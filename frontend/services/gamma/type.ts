/**
 * Gamma API 型別定義
 * 基於 Gamma API v1.0 文檔
 */

/**
 * 生成狀態枚舉
 */
export type GammaGenerationStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'error';

/**
 * 文本處理模式
 * - generate: AI 擴寫內容
 * - condense: AI 濃縮內容
 * - preserve: 保留原始文字（推薦用於數據報告）
 */
export type GammaTextMode = 'generate' | 'condense' | 'preserve';

/**
 * 分頁控制模式
 * - auto: AI 自動分頁
 * - inputTextBreaks: 依照 --- 分隔符強制分頁
 */
export type GammaCardSplit = 'auto' | 'inputTextBreaks';

/**
 * 輸出格式
 */
export type GammaFormat = 'presentation' | 'document' | 'webpage';

/**
 * 圖片來源
 */
export type GammaImageSource = 'aiGenerated' | 'placeholder' | 'none';

/**
 * 生成請求參數
 */
export interface GammaGenerateRequest {
  /** Markdown 格式的輸入文本 */
  inputText: string;
  /** 文本處理模式 */
  textMode?: GammaTextMode;
  /** 分頁控制模式 */
  cardSplit?: GammaCardSplit;
  /** 輸出格式 */
  format?: GammaFormat;
  /** 主題 ID（可選，用於品牌一致性） */
  themeId?: string;
  /** 文本選項 */
  textOptions?: {
    /** 語氣 */
    tone?: string;
    /** 語言 */
    language?: string;
    /** 目標受眾 */
    audience?: string;
  };
  /** 圖片選項 */
  imageOptions?: {
    /** 圖片來源 */
    source?: GammaImageSource;
    /** 圖片風格 */
    style?: string;
  };
  /** 匯出格式 */
  exportAs?: 'pptx' | 'pdf';
}

/**
 * 生成回應（初始回應）
 */
export interface GammaGenerateResponse {
  /** 生成任務 ID */
  generationId: string;
  /** 預估完成時間（秒） */
  estimatedTime?: number;
}

/**
 * 狀態查詢回應
 */
export interface GammaStatusResponse {
  /** 生成任務 ID */
  generationId: string;
  /** 當前狀態 */
  status: GammaGenerationStatus;
  /** Gamma 簡報連結 */
  gammaUrl?: string;
  /** PPT 下載連結 */
  exportUrl?: string;
  /** 錯誤訊息 */
  message?: string;
}

/**
 * PPT 生成請求（前端到後端）
 */
export interface GeneratePPTRequest {
  /** 報告標題 */
  title: string;
  /** 時間範圍描述 */
  timeRange: string;
  /** 報告內容（Markdown 格式） */
  content: string;
}

/**
 * PPT 生成回應（後端到前端）
 */
export interface GeneratePPTResponse {
  /** 是否成功 */
  success: boolean;
  /** PPT 下載連結 */
  downloadUrl?: string;
  /** Gamma 線上編輯連結 */
  gammaUrl?: string;
  /** 錯誤訊息 */
  error?: string;
}
