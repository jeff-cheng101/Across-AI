"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { login, UserRole } from "../routes/auth"
import { notifyError, notifySuccess } from "../util/notify"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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
      
      if (response.success && response.user) {
        // 根據角色重定向
        const redirectPath = getRedirectPath(response.user.role)
        router.push(redirectPath)
      } else {
        notifyError(response.message || '登入失敗')
      }
    } catch (error: any) {
      notifyError(error.message || '登入失敗')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">歡迎回來</CardTitle>
          <CardDescription>請登入您的帳戶以存取安全服務</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">電子郵件</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="請輸入電子郵件"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密碼</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="請輸入密碼"
                className="pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* <input type="checkbox" id="remember" className="rounded border-gray-300" />
              <Label htmlFor="remember" className="text-sm">
                記住我
              </Label> */}
            </div>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              忘記密碼？
            </Link>
          </div>
          <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
            {isLoading ? "登入中..." : "登入"}
          </Button>
          <Separator />
          <div className="text-center text-sm text-muted-foreground">
            {/* 還沒有帳戶？{" "} */}
            {/* <Link href="/register" className="text-primary hover:underline">
              立即註冊
            </Link> */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
