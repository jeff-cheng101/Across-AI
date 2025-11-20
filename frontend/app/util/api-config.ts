/**
 * API 配置檔案
 * 統一管理後端 API 的 base URL
 * 
 * 優先使用環境變數 NEXT_PUBLIC_BACKEND_API_URL
 * 如果未設定，則使用預設值 https://twister5.phison.com:8080
 * 
 * 注意：使用 HTTPS 以避免 Mixed Content 錯誤（當前端頁面為 HTTPS 時）
 * 在 Next.js 中，NEXT_PUBLIC_* 環境變數會在構建時被內嵌到客戶端代碼中
 */

/**
 * 後端 API base URL
 * 預設值：https://twister5.phison.com:8080
 * 可透過環境變數 NEXT_PUBLIC_BACKEND_API_URL 覆蓋
 */
export const BACKEND_API_BASE_URL = 
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://twister5.phison.com:8080';

