"use client"

import { usePathname } from 'next/navigation'
import Navbar from './navbar'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  // 在帳戶相關頁面中隱藏導航欄
  const hideNavbar = pathname?.startsWith('/account/')
  
  if (hideNavbar) {
    return null
  }
  
  return <Navbar />
} 