"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail } from "lucide-react"
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { RingLoader } from 'react-spinners'
import { login, UserRole, forgotPassword } from "@/app/routes/auth"
import { notifyError, notifySuccess } from "@/app/util/notify"

export function LoginDialog() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const getRedirectPath = (role: UserRole): string => {
    switch (role) {
      case 'management':
        return '/account/management'
      case 'reseller':
        return '/account/dealer'
      case 'user':
        return '/dashboard'
      default:
        return '/dashboard'
    }
  }

  const handleLogin = async () => {
    if (!email || !password) {
      notifyError('請輸入電子郵件和密碼')
      return
    }

    setIsLoading(true)

    try {
      const response = await login({ email, password })
      console.log('Login response:', response)
      
      if (response.success && response.user) {
        console.log('Login successful, user role:', response.user.role)
        
        // 根據角色重定向
        const redirectPath = getRedirectPath(response.user.role)
        console.log('Redirecting to:', redirectPath)
        router.push(redirectPath)
        setOpen(false)
      } else {
        console.log('Login failed - response:', response)
        notifyError('登入帳密有誤')
      }
    } catch (error: any) {
      console.error("Login error:", error)
      notifyError('登入帳密有誤')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      notifyError('請輸入電子郵件地址')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(forgotEmail)) {
      notifyError('請輸入有效的電子郵件地址')
      return
    }

    setIsLoading(true)

    try {
      const response = await forgotPassword(forgotEmail)
      if (response.success) {
        notifySuccess(response.message)
        setShowForgotPassword(false)
        setForgotEmail('')
      }
    } catch (error: any) {
      console.error("Forgot password error details:", {
        message: error.message,
        toString: error.toString(),
        stack: error.stack
      })
      // 顯示具體的錯誤訊息
      notifyError(error.message || '發送重設郵件失敗')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setForgotEmail('')
    setShowForgotPassword(false)
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          登入
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <LoadingOverlay
          active={isLoading}
          spinner={<RingLoader color={'#17a2b8'} size={60} />}
          styles={{
              overlay: base => ({
                  ...base,
                  position: 'fixed',
                  zIndex: 1050,
              }),
              content: base => ({
                  ...base,
                  fontWeight: 'normal',
                  fontSize: 'inherit'
              }),
          }}
          text={showForgotPassword ? '發送中...' : '登入中...'}
        />

        <DialogHeader>
          <DialogTitle>
            {showForgotPassword ? '忘記密碼' : '登入帳戶'}
          </DialogTitle>
          <DialogDescription>
            {showForgotPassword 
              ? '請輸入您的電子郵件地址，我們將發送密碼重設連結給您'
              : '請輸入您的帳戶資訊以登入系統'
            }
          </DialogDescription>
        </DialogHeader>

        {showForgotPassword ? (
          // 忘記密碼表單
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="forgotEmail">電子郵件</Label>
                <Input
                  id="forgotEmail"
                  type="email"
                  placeholder="請輸入註冊時使用的電子郵件"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={handleForgotPassword} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                發送重設連結
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowForgotPassword(false)}
                className="w-full bg-transparent"
              >
                返回登入
              </Button>
            </div>
          </>
        ) : (
          // 登入表單
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="請輸入電子郵件"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">密碼</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="請輸入密碼"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={handleLogin} className="w-full">
                登入
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowForgotPassword(true)}
                className="w-full bg-transparent"
              >
                忘記密碼？
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
