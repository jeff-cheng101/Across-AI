"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // 页面切换时的滚动处理
    const handleScroll = () => {
      // 延迟执行以避免与固定元素冲突
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
      }, 100)
    }

    // 监听路由变化
    const timeoutId = setTimeout(() => {
      // 检查是否有固定定位元素，如果有则使用平滑滚动
      const fixedElements = document.querySelectorAll('[style*="position: fixed"], .fixed, .sticky')
      if (fixedElements.length > 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 50)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [pathname])

  useEffect(() => {
    // 页面加载时的滚动优化
    const optimizeScroll = () => {
      // 为所有固定元素添加优化属性，但排除导航栏
      const fixedElements = document.querySelectorAll('.fixed, .sticky, [style*="position: fixed"]')
      fixedElements.forEach(element => {
        if (element instanceof HTMLElement) {
          // 跳过导航栏或包含导航菜单的元素
          if (!element.querySelector('[data-radix-navigation-menu-root]') && 
              !element.closest('[data-radix-navigation-menu-root]') &&
              !element.matches('header') &&
              !element.hasAttribute('data-navbar')) {
            element.style.willChange = 'transform'
            element.style.contain = 'layout style paint'
          } else {
            // 对于导航栏只设置 willChange，不设置 contain
            element.style.willChange = 'transform'
            // 明確移除 contain 屬性（如果存在）
            element.style.contain = ''
          }
        }
      })
    }

    // DOM 加载完成后执行，延遲以確保導航元素已渲染
    const delayedOptimize = () => {
      setTimeout(optimizeScroll, 100) // 延遲 100ms 確保 React 組件已渲染
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', delayedOptimize)
    } else {
      delayedOptimize()
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', delayedOptimize)
    }
  }, [])

  return <>{children}</>
} 