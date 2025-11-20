/**
 * API 配置檔案
 * 統一管理後端 API 的 base URL
 * 
 * 優先使用環境變數 NEXT_PUBLIC_BACKEND_API_URL
 * 如果未設定，則使用相對路徑（透過 Next.js rewrites 代理）
 * 
 * 注意：
 * - 使用相對路徑可以避免 CORS 問題（請求會透過 Next.js rewrites 代理到後端）
 * - Next.js rewrites 配置在 next.config.mjs 中處理 /api/cloudflare/* 和 /api/f5/* 路由
 * - 在 Next.js 中，NEXT_PUBLIC_* 環境變數會在構建時被內嵌到客戶端代碼中
 */

/**
 * 後端 API base URL
 * 預設值：空字串（使用相對路徑，透過 Next.js rewrites 代理）
 * 可透過環境變數 NEXT_PUBLIC_BACKEND_API_URL 覆蓋（例如：https://twister5.phison.com:8080）
 */
export const BACKEND_API_BASE_URL = 
  process.env.NEXT_PUBLIC_BACKEND_API_URL || '';

