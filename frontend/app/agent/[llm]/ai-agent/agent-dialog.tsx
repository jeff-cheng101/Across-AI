'use client';

import { useMutation } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle,
  Eye,
  Lock,
  X,
  XCircle,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { login } from '@/app/routes/auth';
import { getCurrentUser } from '@/app/util/authenticator';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { AgentConfig } from './agent-config';

interface AgentDialogProps {
  agent: AgentConfig;
  isOpen: boolean;
  isExecuting: boolean;
  onClose: () => void;
}

export function AgentDialog({
  agent,
  isOpen,
  isExecuting,
  onClose,
}: AgentDialogProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isExecutionMode, setIsExecutionMode] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [content, setContent] = useState('');

  // 驗證密碼的 mutation
  const verifyPasswordMutation = useMutation({
    mutationFn: async (password: string) => {
      const currentUser = getCurrentUser();
      if (!currentUser?.email) {
        throw new Error('無法獲取當前用戶資訊，請重新登入');
      }
      const response = await login({
        email: currentUser.email,
        password,
      });
      if (!response.success) {
        throw new Error('密碼錯誤，請重新輸入');
      }
      return response;
    },
  });

  // 執行 workflow 的 mutation - 使用 agent 配置中的執行函數
  const executeWorkflowMutation = useMutation({
    mutationFn: async () => {
      return await agent.executeFn(content);
    },
  });

  // 使用 agent 配置中的工作流程步驟
  const workflowSteps = agent.workflowSteps.map((step) => ({
    title: step.title,
  }));
  const totalSteps = workflowSteps.length;

  useEffect(() => {
    if (isExecutionMode && !isComplete && !hasError) {
      if (currentStep < totalSteps) {
        // 模擬進度更新（實際執行時間由 API 決定）
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            const increment = 100 / totalSteps / 100; // 每 50ms 更新一次
            const newProgress = Math.min(
              prev + increment,
              ((currentStep + 1) / totalSteps) * 100,
            );
            return newProgress;
          });
        }, 50);

        // 每個步驟固定 2 秒（實際應該由 API 執行時間決定）
        const stepTimer = setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
        }, 2000);

        return () => {
          clearInterval(progressInterval);
          clearTimeout(stepTimer);
        };
      } else {
        setProgress(100);
        setIsComplete(true);
      }
    }
  }, [isExecutionMode, currentStep, isComplete, hasError, totalSteps]);

  const handleClose = () => {
    setIsPreviewMode(false);
    setIsExecutionMode(false);
    setShowPasswordDialog(false);
    setPassword('');
    setPasswordError('');
    setCurrentStep(0);
    setProgress(0);
    setIsComplete(false);
    setHasError(false);
    setErrorInfo(null);
    onClose();
  };

  const handlePreview = () => {
    setIsPreviewMode(true);
  };

  const handleExecuteClick = () => {
    setShowPasswordDialog(true);
    setPassword('');
    setPasswordError('');
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      setPasswordError('請輸入密碼');
      return;
    }

    setPasswordError('');

    try {
      // 先驗證密碼
      await verifyPasswordMutation.mutateAsync(password);

      // 密碼驗證成功，關閉密碼對話框並開始執行
      setShowPasswordDialog(false);
      setPassword('');
      setPasswordError('');
      setIsPreviewMode(false);
      setIsExecutionMode(true);
      setCurrentStep(0);
      setProgress(0);
      setIsComplete(false);
      setHasError(false);
      setErrorInfo(null);

      // 執行 workflow
      await executeWorkflowMutation.mutateAsync();

      // 執行成功，完成流程
      setProgress(100);
      setIsComplete(true);
    } catch (error: unknown) {
      // 處理錯誤
      const errorMessage =
        error instanceof Error ? error.message : '執行失敗，請重新嘗試';

      // 如果是密碼驗證錯誤，顯示在密碼輸入框
      if (errorMessage.includes('密碼') || errorMessage.includes('登入')) {
        setPasswordError(errorMessage);
      } else {
        // 如果是 workflow 執行錯誤，顯示在執行頁面
        setShowPasswordDialog(false);
        setPassword('');
        setPasswordError('');
        setIsPreviewMode(false);
        setIsExecutionMode(true);
        setHasError(true);
        setErrorInfo(errorMessage);
      }

      console.error(
        'Password verification or workflow execution error:',
        error,
      );
    }
  };

  const handlePasswordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && password.trim()) {
      handlePasswordSubmit();
    }
  };

  // 使用 agent 配置中的工作流程步驟（用於預覽）
  const previewWorkflowSteps = agent.workflowSteps;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800">
        {showPasswordDialog ? (
          <>
            {/* Lock icon centered at top */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-[#334155] border-1 border-[#45A4C0]/30 flex items-center justify-center">
                <Lock className="w-8 h-8 text-[#45A4C0]" />
              </div>
            </div>

            {/* Title and subtitle */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-white">安全驗證</h2>
              <p className="text-gray-400 text-sm">
                請輸入您的密碼以確認執行此操作
              </p>
            </div>

            {/* Password input */}
            <div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                onKeyPress={handlePasswordKeyPress}
                placeholder="請輸入密碼"
                autoFocus
                className={`w-full px-5 py-3 rounded-xl bg-[#1e293b] border-1 ${
                  passwordError ? 'border-red-500' : 'border-[#45A4C0]'
                } text-white text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                  passwordError ? 'focus:ring-red-500' : 'focus:ring-[#45A4C0]'
                } transition-all`}
              />
            </div>

            {/* Error message */}
            {passwordError && (
              <div className="flex items-center justify-center gap-2 text-red-500">
                <XCircle className="w-5 h-5" />
                <span>{passwordError}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPassword('');
                  setPasswordError('');
                }}
                className="text-gray-300 hover:text-white hover:bg-transparent text-base px-6"
              >
                取消
              </Button>
              <Button
                onClick={handlePasswordSubmit}
                disabled={!password.trim()}
                className="bg-[#45A4C0] hover:bg-[#3d8fa3] text-white text-base px-6 py-5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                確認執行
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="border-b border-gray-800 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#45A4C0]/10 border border-[#45A4C0]/20 flex items-center justify-center text-[#45A4C0]">
                    {agent.icon}
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold text-white mb-1">
                      {agent.title}
                    </DialogTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <BrainCircuit className="w-4 h-4" />
                      <span>AI Agent 執行模式</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full bg-gray-700/50 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  aria-label="關閉"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="space-y-5 py-5">
              {isExecutionMode ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  {hasError ? (
                    <>
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center animate-in fade-in zoom-in duration-500">
                          <XCircle
                            className="w-16 h-16 text-red-500"
                            strokeWidth={2}
                          />
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">
                          執行失敗
                        </h3>
                      </div>

                      <div className="w-full max-w-xl px-6">
                        <div className="rounded-xl bg-red-950/30 border border-red-900/50 p-6">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 space-y-2">
                              <h4 className="font-semibold text-white">
                                錯誤訊息
                              </h4>
                              <p className="text-sm text-gray-300 leading-relaxed">
                                {errorInfo || '執行失敗，請稍後再試'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : isComplete ? (
                    <>
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center animate-in fade-in zoom-in duration-500">
                          <CheckCircle
                            className="w-16 h-16 text-green-500"
                            strokeWidth={2}
                          />
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">
                          執行完成！
                        </h3>
                        <p className="text-gray-400 text-sm">
                          AI Agent 已成功完成所有操作
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-[#45A4C0]/20 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full border-4 border-[#45A4C0] border-t-transparent animate-spin" />
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold text-white">
                          執行中...
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {workflowSteps[currentStep]?.title || '處理中'}
                        </p>
                      </div>
                    </>
                  )}

                  {!hasError && (
                    <div className="w-full max-w-xl space-y-3 px-6">
                      <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full transition-all duration-300 ease-out ${
                            hasError
                              ? 'bg-gradient-to-r from-red-500 to-red-600'
                              : 'bg-gradient-to-r from-[#45A4C0] to-[#3d8ea0]'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          {isComplete ? totalSteps : currentStep} / {totalSteps}{' '}
                          步驟完成
                        </span>
                        <span
                          className={`font-semibold ${
                            hasError ? 'text-red-500' : 'text-[#45A4C0]'
                          }`}
                        >
                          {Math.round(progress)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : !isPreviewMode ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-xl bg-gray-950/50 border border-gray-800 text-gray-300 p-6 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#45A4C0]/50 focus:border-[#45A4C0] transition-all"
                  style={{ height: '350px', maxHeight: '350px' }}
                  placeholder="請貼上分析報告"
                />
              ) : (
                <div className="rounded-xl bg-gray-950/50 border border-gray-800 p-6 max-h-[350px] overflow-y-auto">
                  <h3 className="text-base font-medium text-gray-300 mb-6">
                    執行工作流程
                  </h3>
                  <div className="space-y-4">
                    {previewWorkflowSteps.map((step, index) => (
                      <div key={step.step} className="relative">
                        {index < previewWorkflowSteps.length - 1 && (
                          <div className="absolute left-5 top-12 w-0.5 h-full bg-gray-800" />
                        )}

                        <div className="flex gap-4 items-start">
                          <div className="relative z-10 w-10 h-10 rounded-full bg-[#45A4C0]/10 border border-[#45A4C0]/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-semibold text-[#45A4C0]">
                              {step.step}
                            </span>
                          </div>
                          <div className="flex-1 pt-1">
                            <h4 className="text-base font-semibold text-white mb-1">
                              {step.title}
                            </h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isExecutionMode && (
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isExecuting}
                    className="border-gray-700 hover:bg-gray-800 bg-transparent text-gray-300 px-8"
                  >
                    取消
                  </Button>
                  {!isPreviewMode ? (
                    <Button
                      onClick={handlePreview}
                      disabled={isExecuting || !content.trim()}
                      className="bg-[#45A4C0] hover:bg-[#45A4C0]/90 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      預覽執行
                    </Button>
                  ) : (
                    <Button
                      onClick={handleExecuteClick}
                      disabled={isExecuting}
                      className="bg-[#45A4C0] hover:bg-[#45A4C0]/90 text-white px-8"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      執行 AI Agent
                    </Button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
