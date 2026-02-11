'use client';

import { useMutation } from '@tanstack/react-query';
import { Calendar, LogOut, Menu, MessageSquare, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { setGlobalRouter } from '@/lib/api-clients';
import { useAuthStore, useIsLoggedIn, useUser } from '@/lib/auth-store';
import { cn } from '@/lib/utils';
import {
  logout as apiLogout,
  switchToManagement as apiSwitchToManagement,
} from '@/services/auth';
import { LoginDialog } from './login-dialog';

const services = [
  {
    title: 'WAF防禦',
    href: '/services/hiwaf',
    description: '網站應用防火牆服務，保護您的網站免受各種攻擊',
  },
  {
    title: '應用層DDoS防禦',
    href: '/services/application-defense',
    description: '防範任何規模或類型的 DDoS 攻擊',
  },
  {
    title: '全球CDN加速',
    href: '/services/cdn',
    description: '通過全球分佈的節點加速內容傳遞',
  },
];

const eventManagement = [
  {
    title: '新增告警規則',
    href: '/event-management/alert-rules',
    description: '設定系統告警規則與通知條件',
  },
  {
    title: '建立案件工單',
    href: '/event-management/tickets',
    description: '建立並追蹤事件處理工單',
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground font-normal">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const user = useUser();
  const isLoggedIn = useIsLoggedIn();
  const clearUser = useAuthStore((state) => state.clearUser);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // 设置全局路由器供request拦截器使用
    setGlobalRouter(router);
  }, [router]);

  // 登出 Mutation
  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      clearUser();
      router.push('/');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      clearUser(); // 即使失败也清除状态
      router.push('/');
    },
  });

  // 切换回管理员 Mutation
  const switchToManagementMutation = useMutation({
    mutationFn: apiSwitchToManagement,
    onSuccess: (data) => {
      setUser(data.user, data.contract);
      // 根据角色跳转到对应页面
      if (data.user.role === 'management') {
        router.push('/account/management');
      } else if (data.user.role === 'reseller') {
        router.push('/account/dealer');
      } else {
        router.push('/');
      }
    },
    onError: (error) => {
      console.error('Switch to management failed:', error);
      router.push('/');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleSwitchToManagement = () => {
    switchToManagementMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-full flex h-16 items-center px-4 sm:px-6 lg:px-8 bg-[rgba(10,22,40,1)]">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/across_white.png"
            alt="ACROSS"
            width={132}
            height={24}
            className="w-auto h-6"
          />
        </Link>

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
                      <ListItem
                        key={service.title}
                        title={service.title}
                        href={service.href}
                      >
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
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {user?.userId || user?.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {(user?.role === 'management' ||
                    user?.role === 'reseller') && (
                    <DropdownMenuItem
                      onClick={handleSwitchToManagement}
                      className="text-black-600 focus:text-black-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>進入管理系統</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>登出</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <LoginDialog />
            )}
          </div>
        </div>

        <div className="ml-4 flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">打開選單</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-6 mt-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">事件管理</h3>
                  </div>
                  <div className="flex flex-col gap-2 pl-7">
                    {eventManagement.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <Link
                    href="/ai-chat"
                    className="flex items-center gap-2 py-2 text-lg font-semibold hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <MessageSquare className="h-5 w-5 text-primary" />
                    AI Chat
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
