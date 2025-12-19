"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { RingLoader } from 'react-spinners'
import { resetPassword } from "@/app/routes/auth"
import { notifyError, notifySuccess } from "@/app/util/notify"
import { KeyRound, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react"

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState("")
  const [email, setEmail] = useState("")
  
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    const emailParam = searchParams.get('email')
    
    if (!tokenParam || !emailParam) {
      notifyError('無效的重設連結')
      router.push('/login')
      return
    }
    
    setToken(tokenParam)
    setEmail(decodeURIComponent(emailParam))
  }, [searchParams, router])

  // 密碼強度檢查
  const getPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    }
    
    const passed = Object.values(checks).filter(Boolean).length
    return { checks, passed, total: 5 }
  }

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      notifyError('請填寫所有欄位')
      return
    }

    if (newPassword !== confirmPassword) {
      notifyError('兩次輸入的密碼不一致')
      return
    }

    const strength = getPasswordStrength(newPassword)
    if (strength.passed < 5) {
      notifyError('密碼強度不足，請確保包含大小寫字母、數字和特殊符號，且至少8位')
      return
    }

    setIsLoading(true)

    try {
      const response = await resetPassword({
        token,
        email,
        newPassword,
        confirmPassword
      })
      
      if (response.success) {
        notifySuccess(response.message)
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (error: any) {
      console.error("Reset password error:", error)
      notifyError(error.message || '密碼重設失敗')
    } finally {
      setIsLoading(false)
    }
  }

  const strength = getPasswordStrength(newPassword)

  const PasswordStrengthIndicator = ({ checks }: { checks: any }) => (
    <div className="mt-2 space-y-2">
      <div className="text-sm font-medium text-gray-700">密碼要求：</div>
      <div className="grid grid-cols-1 gap-1 text-xs">
        <div className={`flex items-center gap-2 ${checks.length ? 'text-green-600' : 'text-gray-400'}`}>
          {checks.length ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          至少8個字符
        </div>
        <div className={`flex items-center gap-2 ${checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
          {checks.uppercase ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          包含大寫字母
        </div>
        <div className={`flex items-center gap-2 ${checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
          {checks.lowercase ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          包含小寫字母
        </div>
        <div className={`flex items-center gap-2 ${checks.number ? 'text-green-600' : 'text-gray-400'}`}>
          {checks.number ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          包含數字
        </div>
        <div className={`flex items-center gap-2 ${checks.special ? 'text-green-600' : 'text-gray-400'}`}>
          {checks.special ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          包含特殊符號
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
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
          text='處理中...'
        />

        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle>重設密碼</CardTitle>
          <CardDescription>
            為帳戶 <span className="font-medium">{email}</span> 設定新密碼
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">新密碼</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="請輸入新密碼"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {newPassword && <PasswordStrengthIndicator checks={strength.checks} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">確認新密碼</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="請再次輸入新密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-red-600">密碼不一致</p>
            )}
          </div>

          <Button 
            onClick={handleResetPassword} 
            className="w-full"
            disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || strength.passed < 5}
          >
            確認重設密碼
          </Button>

          <div className="text-center">
            <Button 
              variant="link" 
              onClick={() => router.push('/login')}
              className="text-sm text-gray-600"
            >
              返回登入頁面
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
