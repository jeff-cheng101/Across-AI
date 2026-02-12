export type DifyConsoleLoginResult = {
  success: boolean;
  error?: string;
};

/**
 * 觸發 Dify Console 自動登入（瀏覽器端直接呼叫）
 *
 * 業務背景：ACROSS 使用者登入後，在瀏覽器端直接呼叫 Dify Console 登入 API，
 * 讓瀏覽器取得 Dify 的 session cookie，後續 Dify iframe 才能保持登入狀態。
 *
 * 邊界條件：
 * - Dify 登入失敗不應中斷 ACROSS 既有登入流程
 * - 需要 NEXT_PUBLIC_DIFY_URL / NEXT_PUBLIC_DIFY_EMAIL / NEXT_PUBLIC_DIFY_PWD 環境變數
 * - 使用 credentials: 'include' 確保瀏覽器接收 Dify 的 Set-Cookie
 *
 * 依賴：無外部套件，直接使用瀏覽器原生 fetch
 */
export async function loginDifyConsole(): Promise<DifyConsoleLoginResult> {
  try {
    const difyBaseUrl = process.env.NEXT_PUBLIC_DIFY_URL;
    const difyEmail = process.env.NEXT_PUBLIC_DIFY_EMAIL;
    const difyPassword = process.env.NEXT_PUBLIC_DIFY_PWD;

    if (!difyBaseUrl || !difyEmail || !difyPassword) {
      return {
        success: false,
        error: 'Dify 環境變數未配置（NEXT_PUBLIC_DIFY_URL / EMAIL / PWD）',
      };
    }

    const normalizedBaseUrl = difyBaseUrl.replace(/\/+$/, '');
    const loginUrl = `${normalizedBaseUrl}/console/api/login`;

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: difyEmail,
        language: 'zh-Hant',
        password: difyPassword,
        remember_me: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData &&
        typeof errorData === 'object' &&
        'message' in errorData &&
        typeof errorData.message === 'string'
          ? errorData.message
          : `Dify login failed (${response.status})`;

      return {
        success: false,
        error: errorMessage,
      };
    }

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Dify console login 失敗';

    return {
      success: false,
      error: errorMessage,
    };
  }
}
