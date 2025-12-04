"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { RingLoader } from 'react-spinners'
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react"
import Link from "next/link"
import { forgotPassword } from "../routes/auth"
import { notifyError, notifySuccess } from "../util/notify"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()

  const handleForgotPassword = async () => {
    if (!email) {
      notifyError('請輸入電子郵件地址')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      notifyError('請輸入有效的電子郵件地址')
      return
    }

    setIsLoading(true)

    try {
      const response = await forgotPassword(email)
      if (response.success) {
        notifySuccess(response.message)
        setEmailSent(true)
      }
    } catch (error: any) {
      console.error("Forgot password error details:", {
        message: error.message,
        toString: error.toString(),
        stack: error.stack
      })
      notifyError(error.message || '發送重設郵件失敗')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !emailSent) {
      handleForgotPassword()
    }
  }

  const handleRetryWithNewEmail = () => {
    setEmailSent(false)
    setEmail('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
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
          text='發送中...'
        />

        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-full ${emailSent ? 'bg-green-100' : 'bg-blue-100'}`}>
              {emailSent ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <Mail className="h-8 w-8 text-blue-600" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {emailSent ? '郵件已發送' : '忘記密碼'}
          </CardTitle>
          <CardDescription>
            {emailSent 
              ? '我們已發送密碼重設連結至您的信箱'
              : '請輸入您的電子郵件地址，我們將發送密碼重設連結給您'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {emailSent ? (
            // 郵件發送成功狀態
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">
                      重設連結已發送
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>我們已將密碼重設連結發送至：</p>
                      <p className="font-medium">{email}</p>
                      <p className="mt-2">請檢查您的信箱（包括垃圾郵件資料夾）並點擊連結重設密碼。</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="text-sm text-amber-800">
                  <p className="font-medium">⏰ 重要提醒</p>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>重設連結將在 <strong>15分鐘</strong> 後失效</li>
                    <li>如果沒有收到郵件，請檢查垃圾郵件資料夾</li>
                    <li>您可以重新申請新的重設連結</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={handleRetryWithNewEmail}
                  variant="outline" 
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  使用其他信箱重新發送
                </Button>
                <Link href="/login" className="w-full">
                  <Button variant="default" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    返回登入頁面
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            // 輸入郵件表單
            <>
              <div className="space-y-2">
                <Label htmlFor="email">電子郵件</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="請輸入註冊時使用的電子郵件"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoFocus
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-800">
                  <p className="font-medium">📧 關於密碼重設</p>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>請確認輸入的是您註冊帳戶時使用的電子郵件</li>
                    <li>重設連結有效期為15分鐘</li>
                    <li>如果該信箱不存在於系統中，您不會收到郵件</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={handleForgotPassword} 
                  className="w-full"
                  disabled={!email || isLoading}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? '發送中...' : '發送重設連結'}
                </Button>
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    返回登入頁面
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
