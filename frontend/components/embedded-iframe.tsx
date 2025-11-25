"use client"

import React, { useState, useEffect, useCallback } from "react"
import { AlertTriangle, RefreshCw, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Activity } from "lucide-react"

interface EmbeddedIframeProps {
  src: string
  height?: string
  className?: string
  title?: string
  allowFullScreen?: boolean
  sandbox?: string
  onLoad?: () => void
  onError?: () => void
  // 認證相關參數（注意：Chrome 瀏覽器已阻止 URL 基本認證格式）
  // username 和 password 不再支援，因為 Chrome 會阻止這種格式
  authToken?: string
  // 環境變數前綴（用於從環境變數讀取認證資訊）
  envPrefix?: string
}

export function EmbeddedIframe({
  src,
  height = "600px",
  className = "",
  title = "嵌入內容",
  allowFullScreen = true,
  sandbox = "allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-downloads allow-pointer-lock allow-top-navigation",
  onLoad,
  onError,
  authToken: propAuthToken,
  envPrefix = "",
}: EmbeddedIframeProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // 構建帶有認證的 URL（僅在客戶端執行，避免 SSR/CSR 不一致）
  const buildAuthenticatedUrl = useCallback((baseUrl: string): string => {
    // 如果不在瀏覽器環境，直接返回原始 URL（避免 SSR 時構建認證 URL）
    if (typeof window === "undefined") {
      return baseUrl
    }

    try {
      // 優先使用 props，其次使用環境變數
      const authToken = propAuthToken || (envPrefix ? process.env[`NEXT_PUBLIC_${envPrefix}_TOKEN`] : undefined)

      // 只支援 Token 認證（作為查詢參數）
      // 注意：Chrome 瀏覽器已阻止 URL 基本認證格式（user:pass@host），所以不支援
      if (authToken) {
        const url = new URL(baseUrl)
        url.searchParams.set("token", authToken)
        return url.toString()
      }

      // 移除 URL 基本認證方式，因為：
      // 1. Chrome 瀏覽器會阻止這種格式
      // 2. Dify 使用 Session 認證，不需要 URL 基本認證
      // 3. 這會導致 SSR/CSR hydration 不匹配

      return baseUrl
    } catch (err) {
      console.error("構建認證 URL 時發生錯誤:", err)
      return baseUrl
    }
  }, [propAuthToken, envPrefix])

  // 使用 useState 確保只在客戶端更新 URL，避免 SSR/CSR 不一致
  const [authenticatedSrc, setAuthenticatedSrc] = useState(src)

  useEffect(() => {
    // 只在客戶端構建認證 URL
    if (typeof window !== "undefined") {
      setAuthenticatedSrc(buildAuthenticatedUrl(src))
    }
  }, [src, buildAuthenticatedUrl])

  const handleIframeLoad = useCallback(() => {
    const loadingDelay = parseInt(process.env.NEXT_PUBLIC_IFRAME_LOADING_DELAY || "1000")
    
    setTimeout(() => {
      setIsLoading(false)
      setError(null)
      
      // 檢查 iframe 內容是否為登入頁面（使用 try-catch 因為可能被 CORS 阻止）
      try {
        const iframeId = `embedded-iframe-${btoa(src).slice(0, 10)}`
        const iframe = document.querySelector(`#${iframeId}`) as HTMLIFrameElement
        if (iframe?.contentDocument) {
          const iframeDoc = iframe.contentDocument
          const bodyText = iframeDoc.body?.innerText?.toLowerCase() || ""
          const hasLoginPage = 
            bodyText.includes("登入") || 
            bodyText.includes("login") || 
            bodyText.includes("sign in") ||
            iframeDoc.querySelector('input[type="password"]') !== null
          
          if (hasLoginPage && !error) {
            // 不設定錯誤，讓用戶可以在 iframe 中直接登入
            console.log("檢測到登入頁面，允許用戶在 iframe 中登入")
          }
        }
      } catch (e) {
        // CORS 阻止存取，無法檢測 - 這是正常的
        console.log("無法檢測 iframe 內容（CORS 限制）")
      }
      
      onLoad?.()
    }, loadingDelay)
  }, [onLoad, src, error])

  const handleIframeError = useCallback(() => {
    setIsLoading(false)
    try {
      const url = new URL(src)
      const errorMessage = `無法載入內容 (${url.hostname})`
      setError(errorMessage)
    } catch {
      setError("無法載入內容（URL 格式錯誤）")
    }
    onError?.()
  }, [src, onError])

  const retryLoad = useCallback(() => {
    setIsLoading(true)
    setError(null)
    setRetryCount((prev) => prev + 1)
    
    const iframeId = `embedded-iframe-${btoa(src).slice(0, 10)}`
    const iframe = document.querySelector(`#${iframeId}`) as HTMLIFrameElement
    if (iframe) {
      const timestamp = Date.now()
      const retryUrl = buildAuthenticatedUrl(src)
      const separator = retryUrl.includes("?") ? "&" : "?"
      iframe.src = `${retryUrl}${separator}_retry=${retryCount + 1}&_ts=${timestamp}`
    }
  }, [src, retryCount, buildAuthenticatedUrl])

  // 檢測 X-Frame-Options 錯誤的方法：在 iframe 載入後檢查內容是否真的存在
  useEffect(() => {
    const iframeId = `embedded-iframe-${btoa(src).slice(0, 10)}`
    const iframe = document.querySelector(`#${iframeId}`) as HTMLIFrameElement
    
    if (!iframe || isLoading) return
    
    // 延遲檢查，給 iframe 一些時間載入
    const checkTimer = setTimeout(() => {
      try {
        // 嘗試檢查 iframe 是否有內容
        // 如果 X-Frame-Options 阻止載入，iframe.contentWindow 可能為 null 或無法存取
        if (iframe.contentWindow) {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
            // 如果 iframe 完全為空或無法存取，可能是 X-Frame-Options 錯誤
            if (!iframeDoc || !iframeDoc.body || iframeDoc.body.children.length === 0) {
              // 檢查是否真的沒有內容（而不是還在載入中）
              const computedStyle = window.getComputedStyle(iframe)
              if (computedStyle && !iframe.src.includes('about:blank')) {
                // 可能是 X-Frame-Options 錯誤，但我們無法確定，所以不設定錯誤
                // 讓瀏覽器的原生錯誤訊息顯示給用戶
              }
            }
          } catch (crossOriginError) {
            // CORS 錯誤是正常的，不一定是 X-Frame-Options
          }
        }
      } catch (e) {
        // 無法檢測，忽略
      }
    }, 3000)
    
    return () => clearTimeout(checkTimer)
  }, [src, isLoading])

  useEffect(() => {
    // 增加超時時間，因為登入頁面載入是正常的
    const timeout = parseInt(process.env.NEXT_PUBLIC_IFRAME_LOADING_TIMEOUT || "10000")
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        // 不設定錯誤，因為可能是登入頁面或正常載入中
        // X-Frame-Options 錯誤會由上面的 useEffect 處理
      }
    }, timeout)

    return () => clearTimeout(timer)
  }, [isLoading, src])

  if (!src) {
    return (
      <div
        className="flex items-center justify-center bg-slate-900/40 border border-white/10 rounded-lg"
        style={{ height }}
      >
        <div className="text-center text-slate-400">
          <p>未提供嵌入 URL</p>
        </div>
      </div>
    )
  }

  const iframeId = `embedded-iframe-${btoa(src).slice(0, 10)}`

  return (
    <div className={`relative ${className}`}>
      <iframe
        id={iframeId}
        src={authenticatedSrc}
        width="100%"
        height={height}
        className="rounded-lg border border-white/10"
        title={title}
        frameBorder="0"
        sandbox={sandbox}
        referrerPolicy="strict-origin-when-cross-origin"
        allow={allowFullScreen ? "fullscreen; clipboard-read; clipboard-write" : undefined}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{
          minHeight: height,
          display: error ? "none" : "block",
          backgroundColor: "#1a1a1a",
        }}
        loading="lazy"
      />

      {isLoading && (
        <div
          className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-300"
          style={{ height }}
        >
          <div className="text-center">
            <div className="relative mb-6">
              <Activity className="h-16 w-16 animate-spin mx-auto" style={{ color: "#0D99FF" }} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">載入內容中</h3>
            <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
            <p className="text-slate-400 mb-4">正在連接到服務器...</p>
            <p className="text-xs text-slate-500">
              服務器: {(() => {
                try {
                  return new URL(src).hostname
                } catch {
                  return "未知"
                }
              })()}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div
          className="absolute inset-0 bg-red-950/20 rounded-lg border border-red-800 flex items-center justify-center z-50"
          style={{ height }}
        >
          <div className="text-center p-8 max-w-lg">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-4">無法載入內容</h3>
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-slate-400 text-sm mb-6">
              {error?.includes('X-Frame-Options') ? (
                <>
                  <strong className="text-yellow-400">為什麼會出現此錯誤？</strong>
                  <br />
                  目標網站設置了 <code className="bg-slate-800 px-1 rounded">X-Frame-Options: deny</code> 安全標頭，
                  這是為了防止點擊劫持（Clickjacking）攻擊。此限制無法從客戶端繞過。
                </>
              ) : (
                '提示：如果目標網站需要登入，請在新視窗中開啟並登入後再試'
              )}
            </p>

            <div className="space-y-4">
              <Button onClick={retryLoad} disabled={isLoading} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                重新載入
              </Button>

              <Button
                onClick={() => window.open(authenticatedSrc, "_blank")}
                className="w-full border border-white/20"
                variant="outline"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                在新視窗中開啟
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

