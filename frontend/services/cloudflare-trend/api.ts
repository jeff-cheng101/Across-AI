import { backendClient } from '@/lib/api-clients';
import {
  type CloudflareTrendRequest,
  type CloudflareTrendResponse,
  CloudflareTrendResponseSchema,
} from './type';

/**
 * Cloudflare 趨勢分析功能
 * GET /api/cloudflare/trend/load-comparison (Proxied to backend)
 *
 * @param params 請求參數 (timeRange)
 * @returns 趨勢分析比較數據
 */
export async function fetchCloudflareTrendComparison(
  params: CloudflareTrendRequest,
): Promise<CloudflareTrendResponse> {
  // 依據 .cursorrules 規範，使用 backendClient 進行後端服務請求
  // 路徑相對於 client 的 baseURL (/api/backend)
  // 假設後端路由結構符合 /api/cloudflare/trend/load-comparison
  // 客戶端將代理至 ${BACKEND_SERVICE_URL}/api/...
  // 根據規格範例，我們發送一個包含 timeRange 的 POST 請求
  const response = await backendClient.post(
    '/api/cloudflare/trend/load-comparison',
    params,
  );

  return CloudflareTrendResponseSchema.parse(response.data);
}
