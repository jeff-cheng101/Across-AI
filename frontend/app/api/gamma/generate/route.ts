/**
 * Gamma API Route Handler
 * 處理 PPT 簡報生成請求
 *
 * POST /api/gamma/generate
 */

import { type NextRequest, NextResponse } from 'next/server';
import { generatePresentation, waitForCompletion } from '@/services/gamma/api';
import { createGammaRequest } from '@/services/gamma/transform';
import type { GeneratePPTResponse } from '@/services/gamma/type';
import type { DashboardData } from '@/utils/trend-mockData';

const GAMMA_API_KEY = process.env.GAMMA_API_KEY;

interface RequestBody {
  data: DashboardData;
  timeRangeLabel: string;
  timeRangeValue: string;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<GeneratePPTResponse>> {
  // 檢查 API Key 配置
  if (!GAMMA_API_KEY) {
    console.error('❌ GAMMA_API_KEY 未設定');
    return NextResponse.json(
      {
        success: false,
        error: 'PPT 生成服務未配置，請聯繫管理員',
      },
      { status: 500 },
    );
  }

  try {
    // 解析請求
    const body: RequestBody = await request.json();
    const { data, timeRangeLabel, timeRangeValue } = body;

    if (!data || !timeRangeLabel) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必要參數',
        },
        { status: 400 },
      );
    }

    console.log(
      `🎨 開始生成 PPT 簡報 - 時間範圍: ${timeRangeLabel} (${timeRangeValue})`,
    );

    // 建立 Gamma API 請求
    const gammaRequest = createGammaRequest(
      data,
      timeRangeLabel,
      timeRangeValue || 'custom',
    );

    // 發起生成請求
    const generateResponse = await generatePresentation(
      GAMMA_API_KEY,
      gammaRequest,
    );

    console.log(`⏳ 生成任務已建立: ${generateResponse.generationId}`);

    // 輪詢等待完成
    const result = await waitForCompletion(
      GAMMA_API_KEY,
      generateResponse.generationId,
    );

    console.log(`✅ PPT 生成完成: ${result.exportUrl}`);

    // 4. 透過後端 Proxy 下載檔案 (解決 CORS 和檔名問題)
    console.log(`📥 正在透過 Proxy 下載檔案: ${result.exportUrl}`);

    if (!result.exportUrl) {
      throw new Error('PPT 生成成功但未返回下載連結');
    }

    const fileResponse = await fetch(result.exportUrl);

    if (!fileResponse.ok) {
      throw new Error(`無法從 Gamma 下載檔案: ${fileResponse.statusText}`);
    }

    const fileBuffer = await fileResponse.arrayBuffer();

    // 設定檔名
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').split('Z')[0];
    const filename = `cloudflare-trend-report-${timeRangeValue || 'custom'}-${timestamp}.pptx`;

    // 返回檔案流
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      },
    });
  } catch (error) {
    console.error('❌ PPT 生成失敗:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '生成失敗，請稍後再試',
      },
      { status: 500 },
    );
  }
}
