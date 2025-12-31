// hooks/use-report-download.ts
// 報告下載 Hook

import { useState } from 'react';
import { backendClient } from '@/lib/api-clients';
import { useToast } from './use-toast';

export interface UserProvidedData {
  organizationName: string;
  reviewOrganization: string;
  reporterName: string;
  phone: string;
  fax: string;
  email: string;
  investigationVendor: string;
  mainSystemVendor: string;
  systemBuilder: string;
  socVendor: string;
  securityPersonName: string;
  securityPersonTitle: string;
}

export interface ReportGenerationOptions {
  analysisData: any;
  metadata: {
    totalEvents: number;
    timeRange: any;
    platform: string;
    analysisTimestamp?: string;
  };
  userProvidedData: UserProvidedData;
  outputFormat: 'text' | 'word' | 'json';
  useAI?: boolean; // 是否使用第二階段 AI 轉譯
}

export function useReportDownload() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  /**
   * 生成並下載報告
   */
  const generateReport = async (options: ReportGenerationOptions) => {
    setIsGenerating(true);
    setProgress(10);

    try {
      // 讀取 AI 配置（provider 和 model 用於 fallback）
      const aiProvider = localStorage.getItem('aiProvider') || 'ollama';
      const aiModel =
        aiProvider === 'ollama'
          ? localStorage.getItem('ollamaModel') || 'gpt-oss:20b'
          : 'gemini-2.0-flash-exp';

      setProgress(20);

      const endpoint =
        options.useAI !== false
          ? '/api/reports/generate'
          : '/api/reports/generate-text';

      const response = await backendClient.post(
        endpoint,
        {
          analysisData: options.analysisData,
          metadata: options.metadata,
          userProvidedData: options.userProvidedData,
          aiConfig: {
            provider: aiProvider,
            model: aiModel,
            // 注意：apiKey 不再從前端傳遞，後端使用 LLM_API_KEY 環境變數
          },
          outputFormat: options.outputFormat,
        },
        {
          responseType: 'blob', // 先以 blob 接收，再根據類型處理
        },
      );

      setProgress(70);

      const contentType = response.headers['content-type'] || '';

      if (contentType.includes('application/vnd.openxmlformats')) {
        // Word 文件下載
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `資安事件通報單_${new Date().toISOString().split('T')[0]}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: '✅ 報告生成完成',
          description: 'Word 報告已開始下載',
        });
      } else if (contentType.includes('application/json')) {
        // JSON 回應（text 或 json 格式）
        const text = await (response.data as Blob).text();
        const data = JSON.parse(text);

        if (data.format === 'text' && data.content) {
          // 下載純文字報告
          const blob = new Blob([data.content], {
            type: 'text/plain; charset=utf-8',
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `資安事件通報單_${new Date().toISOString().split('T')[0]}.txt`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          toast({
            title: '✅ 報告生成完成',
            description: data.message || '純文字報告已開始下載',
          });
        } else if (data.format === 'json') {
          // 返回 JSON 資料（供進一步處理）
          toast({
            title: '✅ 報告資料已生成',
            description: '報告結構化資料已準備完成',
          });
          return data.reportData;
        }
      } else {
        // 其他情況：嘗試作為 text 處理
        const text = await (response.data as Blob).text();
        const blob = new Blob([text], { type: 'text/plain; charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `資安事件通報單_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: '✅ 報告生成完成',
          description: '報告已開始下載',
        });
      }

      setProgress(100);
      return true;
    } catch (error) {
      console.error('報告生成失敗:', error);
      toast({
        title: '❌ 報告生成失敗',
        description: error instanceof Error ? error.message : '未知錯誤',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  /**
   * 快速下載純文字報告（不使用第二階段 AI）
   */
  const quickDownloadText = async (
    analysisData: any,
    metadata: any,
    userProvidedData: Partial<UserProvidedData> = {},
  ) => {
    return generateReport({
      analysisData,
      metadata,
      userProvidedData: {
        organizationName: '',
        reviewOrganization: '',
        reporterName: '',
        phone: '',
        fax: '',
        email: '',
        investigationVendor: '',
        mainSystemVendor: '',
        systemBuilder: '',
        socVendor: '',
        securityPersonName: '',
        securityPersonTitle: '',
        ...userProvidedData,
      },
      outputFormat: 'text',
      useAI: false,
    });
  };

  return {
    generateReport,
    quickDownloadText,
    isGenerating,
    progress,
  };
}
