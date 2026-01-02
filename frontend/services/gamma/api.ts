/**
 * Gamma API 服務
 * 處理與 Gamma API v1.0 的互動
 */

import type {
  GammaGenerateRequest,
  GammaGenerateResponse,
  GammaStatusResponse,
} from './type';

const GAMMA_API_BASE = 'https://public-api.gamma.app/v1.0';

/**
 * 發起簡報生成請求
 * @param apiKey Gamma API Key
 * @param request 生成請求參數
 * @returns 生成任務 ID
 */
export async function generatePresentation(
  apiKey: string,
  request: GammaGenerateRequest,
): Promise<GammaGenerateResponse> {
  const response = await fetch(`${GAMMA_API_BASE}/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Gamma API 錯誤: ${response.status} - ${errorData.message || response.statusText}`,
    );
  }

  return response.json();
}

/**
 * 查詢生成任務狀態
 * @param apiKey Gamma API Key
 * @param generationId 生成任務 ID
 * @returns 任務狀態資訊
 */
export async function checkGenerationStatus(
  apiKey: string,
  generationId: string,
): Promise<GammaStatusResponse> {
  const response = await fetch(
    `${GAMMA_API_BASE}/generations/${generationId}`,
    {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey,
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Gamma API 狀態查詢錯誤: ${response.status} - ${errorData.message || response.statusText}`,
    );
  }

  return response.json();
}

/**
 * 輪詢等待生成完成（含指數退避策略）
 * @param apiKey Gamma API Key
 * @param generationId 生成任務 ID
 * @param maxAttempts 最大嘗試次數（預設 60 次，約 5 分鐘）
 * @returns 完成後的狀態資訊
 */
export async function waitForCompletion(
  apiKey: string,
  generationId: string,
  maxAttempts: number = 60,
): Promise<GammaStatusResponse> {
  let attempts = 0;
  let waitTime = 2000; // 初始等待 2 秒

  while (attempts < maxAttempts) {
    const status = await checkGenerationStatus(apiKey, generationId);

    if (status.status === 'completed') {
      return status;
    }

    if (status.status === 'error') {
      throw new Error(`PPT 生成失敗: ${status.message || '未知錯誤'}`);
    }

    // 等待後重試
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    attempts++;

    // 指數退避：增加等待時間，但不超過 10 秒
    waitTime = Math.min(waitTime * 1.5, 10000);
  }

  throw new Error('PPT 生成逾時，請稍後再試');
}
