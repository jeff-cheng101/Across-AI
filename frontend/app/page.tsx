'use client';

import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Cpu,
  Eye,
  EyeOff,
  Layers,
  Lock,
  LogIn,
  Network,
  Shield,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore, useIsLoggedIn, useUser } from '@/lib/auth-store';
import { login as apiLogin } from '@/services/auth';

interface ModuleCard {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  authorized: boolean;
}

const MODULES: Omit<ModuleCard, 'authorized'>[] = [
  {
    id: 'ais',
    code: 'AIS',
    name: 'AI Security',
    description:
      'AI-driven threat detection, compliance and security orchestration',
    icon: <Shield className="w-7 h-7" />,
    route: '/dashboard',
  },
  {
    id: 'aig',
    code: 'AIG',
    name: 'AI Governance',
    description: 'Policy management, audit trails and AI usage governance',
    icon: <Network className="w-7 h-7" />,
    route: '/ai-gateway',
  },
  {
    id: 'aie',
    code: 'AIE',
    name: 'AI Ecosystem',
    description:
      'Unified AI ecosystem for integrations, partners and marketplace',
    icon: <Cpu className="w-7 h-7" />,
    route: '/aie',
  },
  {
    id: 'aiw',
    code: 'AIW',
    name: 'AI Workforce',
    description:
      'AI-powered workforce automation, scheduling and talent optimization',
    icon: <Layers className="w-7 h-7" />,
    route: '#',
  },
];

/**
 * 展示用模組權限對照表
 *
 * 業務背景：依據登入的 email 決定該使用者可存取哪些模組，
 * 此為 demo 展示用邏輯，不會進入正式開發 codebase。
 *
 * 規則：
 * - admin@gmail.com：可看到 AIS / AIG / AIE 三個模組
 * - management@gmail.com：可看到 AIG / AIE
 * - finance@gmail.com：只能看到 AIE
 * - 其他 email：預設看到全部三個模組（AIS / AIG / AIE）
 */
const MODULE_ACCESS_BY_EMAIL: Record<string, string[]> = {
  'admin@gmail.com': ['ais', 'aig', 'aie'],
  'management@gmail.com': ['aig', 'aie'],
  'finance@gmail.com': ['aie'],
};

function getAuthorizedModulesByEmail(email: string | undefined): string[] {
  if (!email) return [];
  return MODULE_ACCESS_BY_EMAIL[email] ?? [];
}

const ORBIT_CIRCLE_SIZE = 76;

const orbitConfigs = [
  { radius: 220, duration: 52, startAngle: 0 },
  { radius: 300, duration: 68, startAngle: 90 },
  { radius: 380, duration: 76, startAngle: 200 },
  { radius: 380, duration: 60, startAngle: 330 },
];

const gridPositions = [
  { x: -98, y: -106 },
  { x: 98, y: -106 },
  { x: -98, y: 106 },
  { x: 98, y: 106 },
];

const generateOrbitKeyframes = (radius: number, startAngle: number) => {
  const n = 24;
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= n; i++) {
    const angle = startAngle + (i / n) * 360;
    const rad = (angle * Math.PI) / 180;
    xs.push(Math.cos(rad) * radius - ORBIT_CIRCLE_SIZE / 2);
    ys.push(Math.sin(rad) * radius - ORBIT_CIRCLE_SIZE / 2);
  }
  return { x: xs, y: ys };
};

type ErrorWithResponseMessage = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

function isErrorWithResponseMessage(
  error: unknown,
): error is ErrorWithResponseMessage {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  return true;
}

function getReadableLoginErrorMessage(error: unknown): string {
  if (isErrorWithResponseMessage(error)) {
    const responseMessage = error.response?.data?.message;
    if (responseMessage) {
      return responseMessage;
    }

    if (typeof error.message === 'string' && error.message.length > 0) {
      return error.message;
    }
  }

  return '登入失敗，請檢查您的帳號密碼';
}

export default function Home() {
  const [showMfa, setShowMfa] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showMfaCode, setShowMfaCode] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const user = useUser();
  const setUser = useAuthStore((state) => state.setUser);

  const authorizedModules = getAuthorizedModulesByEmail(user?.email);

  // 登入 Mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiLogin({ email, password }),
    onSuccess: (data) => {
      setUser(data.user, data.contract);
      setShowMfa(false);
      setMfaCode('');
      setPassword('');
      setMfaError('');
      toast.success('登入成功', {
        description: `歡迎回來！`,
      });

      // 業務規則：management 角色登入並完成 MFA 後，直接導向管理主控台
      if (data.user.role === 'management') {
        router.push('/account/management');
      }
    },
    onError: (error: unknown) => {
      const message = getReadableLoginErrorMessage(error);
      setMfaError(message);
    },
  });

  const modules: ModuleCard[] = MODULES.map((m) => ({
    ...m,
    authorized: isLoggedIn && authorizedModules.includes(m.id),
  }));

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setEmailError('');
    setPasswordError('');

    let hasError = false;

    if (!email) {
      setEmailError('請輸入電子郵件');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Email 格式錯誤');
      hasError = true;
    }

    if (!password) {
      setPasswordError('請輸入密碼');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('密碼至少需要 6 個字元');
      hasError = true;
    }

    if (hasError) return;

    setShowMfa(true);
  };

  const handleMfaVerify = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setMfaError('');

    if (!mfaCode) {
      setMfaError('請輸入驗證碼');
      return;
    }

    if (mfaCode.length !== 6) {
      setMfaError('驗證碼必須為 6 位數字');
      return;
    }

    if (!/^\d+$/.test(mfaCode)) {
      setMfaError('驗證碼只能包含數字');
      return;
    }

    // 使用 loginMutation，onSuccess 和 onError 回調會處理狀態更新
    loginMutation.mutate({ email, password });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setResetEmailError('');

    if (!resetEmail) {
      setResetEmailError('請輸入電子郵件');
      return;
    }

    if (!validateEmail(resetEmail)) {
      setResetEmailError('Email 格式錯誤');
      return;
    }

    setIsResetting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('密碼重設連結已發送至您的信箱', {
        description: `已發送至 ${resetEmail}`,
      });
      setShowForgotPassword(false);
      setResetEmail('');
      setResetEmailError('');
    } catch {
      setResetEmailError('發送失敗，請稍後再試');
    } finally {
      setIsResetting(false);
    }
  };

  const handleCardClick = (mod: ModuleCard) => {
    if (!mod.authorized) return;
    router.push(mod.route);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-3xl" />

        {/* Tech circular lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>背景科技線條</title>
          {[
            { r: 260, opacity: 0.12, dash: '12 18', duration: 2, width: 1.2 },
            { r: 340, opacity: 0.08, dash: '8 24', duration: 2.5, width: 1 },
            { r: 440, opacity: 0.06, dash: '6 20', duration: 3, width: 0.8 },
            { r: 560, opacity: 0.05, dash: '16 28', duration: 3.5, width: 0.6 },
          ].map((ring, i) => (
            <motion.circle
              key={`orbit-${ring.r}`}
              cx="50%"
              cy="50%"
              r={ring.r}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeOpacity={ring.opacity}
              strokeWidth={ring.width}
              strokeDasharray={ring.dash}
              initial={{ pathLength: 0, rotate: 0 }}
              animate={{ pathLength: 1, rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{
                pathLength: { duration: ring.duration, ease: 'easeInOut' },
                rotate: {
                  duration: 60 + i * 20,
                  ease: 'linear',
                  repeat: Infinity,
                },
              }}
              style={{ transformOrigin: '50% 50%' }}
            />
          ))}

          {[
            {
              cx: 200,
              cy: 180,
              r: 80,
              start: -30,
              end: 120,
              opacity: 0.15,
              delay: 0.3,
            },
            {
              cx: -60,
              cy: 400,
              r: 140,
              start: -20,
              end: 90,
              opacity: 0.1,
              delay: 0.6,
            },
            {
              cx: 1200,
              cy: 150,
              r: 100,
              start: 150,
              end: 280,
              opacity: 0.12,
              delay: 0.5,
            },
            {
              cx: 1100,
              cy: 600,
              r: 120,
              start: 200,
              end: 330,
              opacity: 0.1,
              delay: 0.8,
            },
            {
              cx: 300,
              cy: 650,
              r: 90,
              start: 60,
              end: 200,
              opacity: 0.12,
              delay: 0.4,
            },
            {
              cx: 900,
              cy: 350,
              r: 70,
              start: 100,
              end: 250,
              opacity: 0.1,
              delay: 0.7,
            },
          ].map((arc) => {
            const startRad = (arc.start * Math.PI) / 180;
            const endRad = (arc.end * Math.PI) / 180;
            const x1 = arc.cx + arc.r * Math.cos(startRad);
            const y1 = arc.cy + arc.r * Math.sin(startRad);
            const x2 = arc.cx + arc.r * Math.cos(endRad);
            const y2 = arc.cy + arc.r * Math.sin(endRad);
            const largeArc = arc.end - arc.start > 180 ? 1 : 0;
            const d = `M ${x1} ${y1} A ${arc.r} ${arc.r} 0 ${largeArc} 1 ${x2} ${y2}`;
            return (
              <motion.path
                key={`arc-${arc.start}-${arc.end}-${arc.cx}-${arc.cy}`}
                d={d}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeOpacity={arc.opacity}
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  delay: arc.delay,
                  ease: 'easeInOut',
                }}
              />
            );
          })}

          {[180, 300, 420].map((r, i) => (
            <motion.circle
              key={`pulse-ring-${r}`}
              cx="50%"
              cy="50%"
              r={r}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.8"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.15, 0], scale: [0.95, 1.05, 1.1] }}
              transition={{
                duration: 3,
                delay: 1.5 + i * 0.8,
                repeat: Infinity,
                repeatDelay: 4,
                ease: 'easeOut',
              }}
              style={{ transformOrigin: '50% 50%' }}
            />
          ))}

          {[
            { cx: '18%', cy: '22%', delay: 1.6, r: 3 },
            { cx: '82%', cy: '18%', delay: 1.8, r: 2.5 },
            { cx: '12%', cy: '55%', delay: 2, r: 3 },
            { cx: '88%', cy: '72%', delay: 2.1, r: 2.5 },
            { cx: '28%', cy: '78%', delay: 2.2, r: 3 },
            { cx: '72%', cy: '42%', delay: 2.3, r: 2.5 },
            { cx: '50%', cy: '12%', delay: 1.9, r: 2 },
            { cx: '50%', cy: '88%', delay: 2.4, r: 2 },
          ].map((dot) => (
            <motion.circle
              key={`dot-${dot.cx}-${dot.cy}`}
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              fill="hsl(var(--primary))"
              fillOpacity="0.25"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 0.4, 0.25] }}
              transition={{ duration: 0.6, delay: dot.delay }}
            />
          ))}

          {[
            { cx: '18%', cy: '22%', delay: 2.8 },
            { cx: '82%', cy: '18%', delay: 3.2 },
            { cx: '28%', cy: '78%', delay: 3.5 },
            { cx: '88%', cy: '72%', delay: 3 },
          ].map((halo) => (
            <motion.circle
              key={`halo-${halo.cx}-${halo.cy}`}
              cx={halo.cx}
              cy={halo.cy}
              r="8"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.8"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0], scale: [1, 2.5] }}
              transition={{
                duration: 2.5,
                delay: halo.delay,
                repeat: Infinity,
                repeatDelay: 4,
              }}
            />
          ))}
        </svg>
      </div>

      {/* Module cards */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          {modules.map((mod, index) => {
            const isActive = mod.authorized;
            const isLocked = isLoggedIn && !mod.authorized;
            const orbit = orbitConfigs[index];
            const gridPos = gridPositions[index];
            const orbitKf = generateOrbitKeyframes(
              orbit.radius,
              orbit.startAngle,
            );

            const gridX = gridPos.x - 88;
            const gridY = gridPos.y - 96;

            return (
              <motion.button
                key={mod.id}
                onClick={() => handleCardClick(mod)}
                disabled={!isActive && isLoggedIn}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                }}
                animate={
                  isLoggedIn
                    ? {
                        x: gridX,
                        y: gridY,
                        width: 176,
                        height: 192,
                        borderRadius: 16,
                        opacity: 1,
                      }
                    : {
                        x: orbitKf.x,
                        y: orbitKf.y,
                        width: ORBIT_CIRCLE_SIZE,
                        height: ORBIT_CIRCLE_SIZE,
                        borderRadius: ORBIT_CIRCLE_SIZE / 2,
                        opacity: 1,
                      }
                }
                transition={
                  isLoggedIn
                    ? {
                        type: 'spring',
                        stiffness: 45,
                        damping: 14,
                        delay: 0.12 * index,
                      }
                    : {
                        x: {
                          duration: orbit.duration,
                          ease: 'linear',
                          repeat: Infinity,
                        },
                        y: {
                          duration: orbit.duration,
                          ease: 'linear',
                          repeat: Infinity,
                        },
                        width: { duration: 0.6, ease: 'easeOut' },
                        height: { duration: 0.6, ease: 'easeOut' },
                        borderRadius: { duration: 0.6, ease: 'easeOut' },
                      }
                }
                whileHover={isActive ? { scale: 1.08 } : {}}
                whileTap={isActive ? { scale: 0.96 } : {}}
                className={`
                  flex flex-col items-center justify-center overflow-hidden border
                  transition-[box-shadow,border-color,background-color] duration-700 ease-in-out
                  ${
                    isLoggedIn
                      ? isActive
                        ? 'bg-card/90 border-primary/30 cursor-pointer shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_60px_-10px_hsl(var(--primary)/0.5)] hover:border-primary/60'
                        : isLocked
                          ? 'bg-card/30 border-border/20 cursor-not-allowed grayscale'
                          : 'bg-card/70 border-primary/10 cursor-default'
                      : 'bg-card/80 border-primary/25 cursor-default shadow-[0_0_24px_-4px_hsl(var(--primary)/0.35)]'
                  }
                `}
              >
                {isLocked && (
                  <div className="absolute top-3 right-3">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground/50" />
                  </div>
                )}

                <motion.div
                  className={`transition-colors duration-700 ${isLoggedIn ? (isActive ? 'text-primary' : 'text-muted-foreground/40') : 'text-primary'}`}
                  animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                >
                  {mod.icon}
                </motion.div>

                <motion.span
                  className={`
                    font-bold font-mono tracking-widest
                    ${isLoggedIn ? (isActive ? 'text-foreground' : 'text-muted-foreground/40') : 'text-foreground/90'}
                  `}
                  animate={
                    isLoggedIn
                      ? { fontSize: '14px', marginTop: 8 }
                      : { fontSize: '10px', marginTop: 4 }
                  }
                  transition={{ duration: 0.5 }}
                >
                  {mod.code}
                </motion.span>

                <motion.p
                  className={`text-[11px] leading-snug text-center ${isActive ? 'text-muted-foreground' : 'text-muted-foreground/20'}`}
                  animate={
                    isLoggedIn
                      ? { opacity: 1, height: 'auto', marginTop: 4 }
                      : { opacity: 0, height: 0, marginTop: 0 }
                  }
                  transition={{ duration: 0.4, delay: isLoggedIn ? 0.3 : 0 }}
                >
                  {mod.name}
                </motion.p>

                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Center Sign In Card */}
      <AnimatePresence>
        {!isLoggedIn && !showMfa && !showForgotPassword && (
          <motion.div
            key="signin-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: -40,
              transition: { duration: 0.5, ease: 'easeInOut' },
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed inset-0 z-30 flex items-center justify-center"
          >
            <div className="w-full max-w-sm px-6">
              <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-3xl p-8 shadow-2xl shadow-primary/[0.05]">
                <div className="flex flex-col items-center mb-8">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-5"
                  >
                    <Image
                      src="/images/across_white.png"
                      alt="ACROSS"
                      width={132}
                      height={28}
                      className="w-auto h-7"
                    />
                  </motion.div>
                  <p className="text-sm text-muted-foreground">
                    Sign in to access your modules
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="login-email"
                      className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      電子郵件
                    </label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      className={`h-11 bg-secondary/50 text-sm ${
                        emailError
                          ? 'border-destructive focus:border-destructive'
                          : 'border-border/40 focus:border-primary/50'
                      }`}
                    />
                    {emailError && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="login-password"
                        className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        密碼
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        忘記密碼?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) setPasswordError('');
                        }}
                        className={`h-11 bg-secondary/50 text-sm pr-10 ${
                          passwordError
                            ? 'border-destructive focus:border-destructive'
                            : 'border-border/40 focus:border-primary/50'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        {passwordError}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 gap-2 text-sm font-semibold mt-2"
                  >
                    <LogIn className="w-4 h-4" />
                    登入
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forgot Password Card */}
      <AnimatePresence>
        {showForgotPassword && !isLoggedIn && (
          <motion.div
            key="forgot-password-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: -40,
              transition: { duration: 0.5, ease: 'easeInOut' },
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed inset-0 z-30 flex items-center justify-center"
          >
            <div className="w-full max-w-sm px-6">
              <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-3xl p-8 shadow-2xl shadow-primary/[0.05]">
                <div className="flex flex-col items-center mb-6">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4"
                  >
                    <Lock className="w-7 h-7 text-primary" />
                  </motion.div>
                  <h2 className="text-lg font-bold text-foreground tracking-wider font-mono mb-1">
                    Reset Password
                  </h2>
                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    Enter your email to receive a password reset link
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="reset-email"
                      className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Email
                    </label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="admin@across.ai"
                      value={resetEmail}
                      onChange={(e) => {
                        setResetEmail(e.target.value);
                        if (resetEmailError) setResetEmailError('');
                      }}
                      className={`h-11 bg-secondary/50 text-sm ${
                        resetEmailError
                          ? 'border-destructive focus:border-destructive'
                          : 'border-border/40 focus:border-primary/50'
                      }`}
                      autoFocus
                    />
                    {resetEmailError && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        {resetEmailError}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isResetting}
                    className="w-full h-11 gap-2 text-sm font-semibold"
                  >
                    <Lock className="w-4 h-4" />
                    {isResetting ? 'Sending...' : 'Send Reset Link'}
                  </Button>

                  <button
                    type="button"
                    disabled={isResetting}
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmail('');
                    }}
                    className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Back to Sign In
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MFA Verification Card */}
      <AnimatePresence>
        {showMfa && !isLoggedIn && (
          <motion.div
            key="mfa-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: -40,
              transition: { duration: 0.5, ease: 'easeInOut' },
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed inset-0 z-30 flex items-center justify-center"
          >
            <div className="w-full max-w-sm px-6">
              <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-3xl p-8 shadow-2xl shadow-primary/[0.05]">
                <div className="flex flex-col items-center mb-6">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4"
                  >
                    <Shield className="w-7 h-7 text-primary" />
                  </motion.div>
                  <h2 className="text-lg font-bold text-foreground tracking-wider font-mono mb-1">
                    雙重驗證
                  </h2>
                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    Enter the verification code to continue
                  </p>
                </div>

                <form onSubmit={handleMfaVerify} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="mfa-code"
                      className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      驗證碼
                    </label>
                    <div className="relative">
                      <Input
                        id="mfa-code"
                        type={showMfaCode ? 'text' : 'password'}
                        placeholder="••••••"
                        value={mfaCode}
                        onChange={(e) => {
                          setMfaCode(e.target.value);
                          if (mfaError) setMfaError('');
                        }}
                        className={`h-11 bg-secondary/50 text-sm pr-10 text-center tracking-[0.3em] font-mono ${
                          mfaError
                            ? 'border-destructive focus:border-destructive'
                            : 'border-border/40 focus:border-primary/50'
                        }`}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowMfaCode(!showMfaCode)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showMfaCode ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {mfaError && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        {mfaError}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="relative -left-0.5 top-0 w-full h-11 gap-2 text-sm font-semibold"
                  >
                    <Shield className="w-4 h-4" />
                    {loginMutation.isPending ? 'Verifying...' : 'Verify'}
                  </Button>

                  <button
                    type="button"
                    disabled={loginMutation.isPending}
                    onClick={() => {
                      setShowMfa(false);
                      setMfaCode('');
                    }}
                    className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Back to Sign In
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-border/30">
                  <div className="bg-secondary/30 rounded-lg p-3 mb-4">
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider text-center mb-2">
                      Test Verification Code
                    </p>
                    <div className="flex items-center justify-center">
                      <code className="text-foreground font-mono bg-secondary/50 px-3 py-1 rounded text-sm tracking-[0.3em]">
                        123456
                      </code>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <Lock className="w-3 h-3 text-muted-foreground/50" />
                    <span className="text-[10px] text-muted-foreground/50 tracking-wider font-mono">
                      Powered by
                    </span>
                    <div className="rounded px-2 opacity-100 py-0 bg-primary-foreground">
                      <Image
                        src="/images/gotrust-logo.png"
                        alt="GoTrust"
                        width={72}
                        height={16}
                        className="h-4 w-auto object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative connecting lines */}
      <AnimatePresence>
        {isLoggedIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="fixed inset-0 z-0 pointer-events-none"
          >
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <title>登入後連線動畫</title>
              <motion.line
                x1="50%"
                y1="25%"
                x2="50%"
                y2="75%"
                stroke="hsl(var(--primary))"
                strokeOpacity="0.08"
                strokeWidth="1"
                strokeDasharray="4 8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.6 }}
              />
              <motion.line
                x1="20%"
                y1="50%"
                x2="80%"
                y2="50%"
                stroke="hsl(var(--primary))"
                strokeOpacity="0.08"
                strokeWidth="1"
                strokeDasharray="4 8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.8 }}
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="4"
                fill="hsl(var(--primary))"
                fillOpacity="0.15"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 1.2 }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
