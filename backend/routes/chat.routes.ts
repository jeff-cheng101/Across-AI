// backend/routes/chat.routes.ts
// assistant-ui 聊天機器人 API 路由

import type { UIMessage } from 'ai';
import express, { type Request, type Response, type Router } from 'express';
import * as chatService from '../services/chatService';

const router: Router = express.Router();

// ============================================================
// Types
// ============================================================

interface ChatRequestBody {
  messages: UIMessage[];
  userId?: string;
  conversationId?: string;
}

interface ApiSuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

interface ApiErrorResponse {
  success: false;
  error: string;
  details?: string;
}

type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================
// API Endpoints
// ============================================================

/**
 * POST /api/chat
 * assistant-ui 聊天端點 (Streaming Mode)
 * 使用 Vercel AI SDK 的 toUIMessageStreamResponse() 回傳標準串流格式
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { messages, userId, conversationId } = req.body as ChatRequestBody;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: '缺少必要參數: messages',
      });
    }

    console.log(`\n💬 ===== Dify Chat (assistant-ui) =====`);
    console.log(`📝 Messages count: ${messages.length}`);
    console.log(`👤 User: ${userId || '(anonymous)'}`);
    console.log(`🔗 Conversation: ${conversationId || '(新對話)'}`);

    const result = await chatService.streamChatForUI(
      messages,
      userId,
      conversationId,
    );

    console.log(`✅ ===== Dify Stream 開始 =====\n`);

    // 使用 AI SDK 的標準串流回應格式
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('❌ Dify chat 錯誤:', error);
    return res.status(500).json({
      success: false,
      error: 'Dify 對話失敗',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// ============================================================
// History API Endpoints
// ============================================================

/**
 * GET /api/chat/messages
 * 取得對話歷史訊息
 */
router.get('/messages', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const {
      conversationId,
      userId = 'default-user',
      limit = '20',
      firstId,
    } = req.query;

    if (!conversationId || typeof conversationId !== 'string') {
      return res.status(400).json({
        success: false,
        error: '缺少必要參數: conversationId',
      });
    }

    console.log(`\n📜 ===== 取得對話歷史 =====`);
    console.log(`🔗 Conversation: ${conversationId}`);
    console.log(`👤 User: ${userId}`);

    const result = await chatService.getMessages(
      conversationId,
      parseInt(limit as string, 10),
      (firstId as string) || null,
      userId as string,
    );

    console.log(`✅ 取得 ${result.messages.length} 筆訊息`);
    console.log(`\n✅ ===== 歷史訊息取得完成 =====\n`);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('❌ 取得訊息歷史錯誤:', error);
    res.status(500).json({
      success: false,
      error: '取得對話歷史失敗',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * GET /api/chat/conversations
 * 取得使用者的對話列表
 */
router.get(
  '/conversations',
  async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { userId, limit = '20', lastId } = req.query;

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({
          success: false,
          error: '缺少必要參數: userId',
        });
      }

      console.log(`\n📋 ===== 取得對話列表 =====`);
      console.log(`👤 User: ${userId}`);

      const result = await chatService.getConversations(
        userId,
        parseInt(limit as string, 10),
        (lastId as string) || null,
      );

      console.log(`✅ 取得 ${result.conversations.length} 個對話`);
      console.log(`\n✅ ===== 對話列表取得完成 =====\n`);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('❌ 取得對話列表錯誤:', error);
      res.status(500).json({
        success: false,
        error: '取得對話列表失敗',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  },
);

/**
 * DELETE /api/chat/conversations/:conversationId
 * 刪除對話
 */
router.delete(
  '/conversations/:conversationId',
  async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { conversationId } = req.params;
      const { userId } = req.body as { userId?: string };

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: '缺少必要參數: userId',
        });
      }

      console.log(`\n🗑️ ===== 刪除對話 =====`);
      console.log(`🔗 Conversation: ${conversationId}`);
      console.log(`👤 User: ${userId}`);

      await chatService.deleteConversation(conversationId, userId);

      console.log(`✅ 對話已刪除`);
      console.log(`\n✅ ===== 對話刪除完成 =====\n`);

      res.json({
        success: true,
        message: '對話已刪除',
      });
    } catch (error) {
      console.error('❌ 刪除對話錯誤:', error);
      res.status(500).json({
        success: false,
        error: '刪除對話失敗',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  },
);

export = router;
