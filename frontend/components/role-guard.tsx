"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/app/routes/auth'
import { checkLoginStatus } from '@/app/routes/auth'
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { RingLoader } from 'react-spinners'
import authenticator, { checkAuth } from '@/app/util/authenticator'
import { notifyError } from '@/app/util/notify'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [authState, setAuthState] = useState<any>(null)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const router = useRouter()

  // 訂閱 auth 狀態變化
  useEffect(() => {
    let isMounted = true
    const subscription = authenticator.authObservable.subscribe((nextAuth: any) => {
      if (!isMounted) return
      try {
        const authValue = typeof nextAuth === 'string' ? JSON.parse(nextAuth) : nextAuth
        setAuthState(authValue)
      } catch (error) {
        console.error('Auth parse error:', error)
        setAuthState(null)
      }
    })

    // 確保 auth 狀態已初始化
    const initAuth = async () => {
      try {
        await checkAuth()
      } catch (error) {
        console.error('Init auth error:', error)
      } finally {
        if (isMounted) {
          setIsAuthReady(true)
        }
      }
    }

    initAuth()

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  // 當 auth 狀態準備好後進行權限檢查
  useEffect(() => {
    if (!isAuthReady) return

    console.log('Auth state:', authState)
    const performAuthCheck = () => {
      try {
        if (authState?.loginState && authState?.user) {
          setUser(authState.user)
          if (allowedRoles.includes(authState.user.role)) {
            setHasAccess(true)
          } else {
            switch (authState.user.role) {
              case 'management':
                router.push('/account/management')
                break
              case 'reseller':
                router.push('/account/dealer')
                break
              case 'user':
                router.push('/dashboard')
                break
              default:
                router.push('/')
            }
          }
        } else {
          router.push('/')
        }
      } catch (error) {
        router.push('/')
        console.log(error)
        notifyError('Unauthorized')
      } finally {
        setIsLoading(false)
      }
    }

    performAuthCheck()
  }, [isAuthReady, authState, allowedRoles, router])

  if (isLoading) {
    return (
      <LoadingOverlay
        active={true}
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
        text='請稍候...'
      />
    )
  }

  if (!hasAccess) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">權限不足</h1>
          <p className="text-gray-600">您沒有權限訪問此頁面</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 