'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RingLoader } from 'react-spinners';
import { notifyError } from '@/app/util/notify';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { useIsLoggedIn, useUser } from '@/lib/auth-store';
import type { UserRole } from '@/services/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: RoleGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const user = useUser();
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();

  // 使用 Zustand 進行權限檢查
  useEffect(() => {
    const performAuthCheck = () => {
      try {
        if (isLoggedIn && user) {
          if (allowedRoles.includes(user.role)) {
            setHasAccess(true);
          } else {
            // 根據角色重導向到對應頁面
            switch (user.role) {
              case 'management':
                router.push('/account/management');
                break;
              case 'reseller':
                router.push('/account/dealer');
                break;
              case 'user':
                router.push('/dashboard');
                break;
              default:
                router.push('/');
            }
          }
        } else {
          router.push('/');
        }
      } catch (error) {
        router.push('/');
        console.error(error);
        notifyError('Unauthorized');
      } finally {
        setIsLoading(false);
      }
    };

    performAuthCheck();
  }, [isLoggedIn, user, allowedRoles, router]);

  if (isLoading) {
    return (
      <LoadingOverlay
        active={true}
        spinner={<RingLoader color={'#17a2b8'} size={60} />}
        styles={{
          overlay: (base) => ({
            ...base,
            position: 'fixed',
            zIndex: 1050,
          }),
          content: (base) => ({
            ...base,
            fontWeight: 'normal',
            fontSize: 'inherit',
          }),
        }}
        text="請稍候..."
      />
    );
  }

  if (!hasAccess) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">權限不足</h1>
            <p className="text-gray-600">您沒有權限訪問此頁面</p>
          </div>
        </div>
      )
    );
  }

  return children;
}
