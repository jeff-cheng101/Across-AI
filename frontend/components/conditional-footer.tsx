"use client"

import { usePathname } from 'next/navigation'
import Footer from './footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  // 在帳戶相關頁面中隱藏導航欄
  const hideNavbar = pathname?.startsWith('/account/')
  
  if (hideNavbar) {
    return null
  }
  
  return <Footer />
} 