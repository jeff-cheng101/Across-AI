"use client"

import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, LogOut } from "lucide-react"
import { LoginDialog } from "./login-dialog"
import authenticator, { checkAuth } from "@/app/util/authenticator";
import { useRouter } from 'next/navigation';
import { logout, logoutContract } from "@/app/routes/auth";
import { setGlobalRouter } from "@/app/routes/request";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const services = [
  {
    title: "WAF防禦",
    href: "/services/hiwaf",
    description: "網站應用防火牆服務，保護您的網站免受各種攻擊",
  },
  {
    title: "應用層DDoS防禦",
    href: "/services/application-defense",
    description: "防範任何規模或類型的 DDoS 攻擊",
  },
  {
    title: "全球CDN加速",
    href: "/services/cdn",
    description: "通過全球分佈的節點加速內容傳遞",
  },
]

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground font-normal">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

export function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [loginState, setLoginState] = useState(false)
  const [userId, setUserId] = useState('')
  const [auth, setAuth] = useState<any>({ loginState: false })

  useEffect(() => {
    let isMounted = true
    
    // 设置全局路由器供request拦截器使用
    setGlobalRouter(router);
    // 初始化时检查认证状态
    checkAuth();
    
    const subscription = authenticator.authObservable.subscribe((nextAuth: any) => {
      try {
        const authValue = typeof nextAuth === 'string' ? JSON.parse(nextAuth) : nextAuth
        if (!isMounted) return
        setAuth(authValue || { loginState: false })

        if (authValue?.maintainer) {
          setLoginState(true)
          setUserId(authValue.maintainer.userId || '')
        } else if (authValue?.user) {
          setLoginState(true)
          setUserId(authValue.user.userId || '')
        } else {
          setLoginState(false)
          setUserId('')
        }
      } catch (error) {
        if (!isMounted) return
        console.error('Auth parse error:', error)
        setAuth({ loginState: false })
        setLoginState(false)
        setUserId('')
      }
    })
    return () => { isMounted = false; subscription.unsubscribe() }
  }, [router])

  const handleLogout = async () => {
    try {
      await logout();
      setAuth({ loginState: false });
      setLoginState(false);
      setUserId('');
      await checkAuth(); // 重新检查认证状态确保同步
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      setAuth({ loginState: false });
      setLoginState(false);
      setUserId('');
      await checkAuth(); // 即使失败也要重新检查状态
      router.push('/');
    }
  }

  const handleLogoutContract = async () => {
    try {
      const resp = await logoutContract();
      if (resp.success && resp.user && resp.user.role === 'management') {
        router.push('/account/management');
      } else if (resp.success && resp.user && resp.user.role === 'reseller') {
        router.push('/account/dealer');
      } else {
        console.error('Back to management failed:', resp.message);
        router.push('/');
      }
    } catch (error) {
      console.error('Back to management failed:', error);
      router.push('/');
      throw error;
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-full flex h-16 items-center px-4 sm:px-6 lg:px-8 bg-[rgba(10,22,40,1)]">
        {
          auth?.user ? (            
          <Link href="/dashboard" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#3B82F6] text-sky-500" />
            <span className="text-xl font-normal">ACROSS</span>
          </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-[#3B82F6]" />
              <span className="text-xl font-medium">ACROSS</span>
            </Link>
          )
        }

        <div className="hidden md:flex ml-auto">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground font-light">
                  服務總覽
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4 grid-cols-1">
                    {services.map((service) => (
                      <ListItem key={service.title} title={service.title} href={service.href}>
                        {service.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="ml-4 text-[#45A4C0] hover:text-white hover:bg-transparent transition-colors"
          >
            <a href="/contact">聯絡我們</a>
          </Button>

          <div className="ml-4 flex items-center gap-2">
          {
              loginState ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />{userId}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {
                      auth?.maintainer?.role === 'management' || auth?.maintainer?.role === 'reseller' || auth?.user?.role === 'management' || auth?.user?.role === 'reseller' ? (
                        <DropdownMenuItem onClick={handleLogoutContract} className="text-black-600 focus:text-black-600">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>進入管理系統</span>
                        </DropdownMenuItem>
                      ) : null
                    }
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>登出</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <LoginDialog />
              )
            }
          </div>
        </div>

        <div className="md:hidden ml-auto flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">打開選單</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  className="text-lg font-light hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  首頁
                </Link>
                <div className="border-t pt-4">
                  <p className="text-lg font-light mb-2">服務總覽</p>
                  {services.map((service) => (
                    <Link
                      key={service.title}
                      href={service.href}
                      className="block py-2 text-muted-foreground hover:text-primary font-light transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="text-[#45A4C0] hover:text-white hover:bg-transparent font-normal w-full mt-4 justify-start"
                  onClick={() => setIsOpen(false)}
                >
                  <a href="/contact">聯絡我們</a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Navbar
