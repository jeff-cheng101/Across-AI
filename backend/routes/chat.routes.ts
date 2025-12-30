// backend/routes/chat.routes.ts
// Dify Chatbot API 路由

import express, { type Request, type Response, type Router } from 'express';
import * as chatService from '../services/chatService';

const router: Router = express.Router();

// ============================================================
// Types
// ============================================================

interface ChatRequestBody {
  message: string;
  userId: string;
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
 * 發送對話訊息 (Blocking Mode)
 */
router.post('/', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { message, userId, conversationId } = req.body as ChatRequestBody;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: '缺少必要參數: message',
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: '缺少必要參數: userId',
      });
    }

    console.log(`\n💬 ===== Dify Chat (Blocking) =====`);
    console.log(`📝 Message: ${message.substring(0, 50)}...`);
    console.log(`👤 User: ${userId}`);
    console.log(`🔗 Conversation: ${conversationId || '(新對話)'}`);

    const result = await chatService.chat(
      message,
      userId,
      conversationId || null,
    );

    console.log(`✅ 回應長度: ${result.text.length} 字元`);
    console.log(`🆔 Conversation ID: ${result.conversationId}`);
    console.log(`\n✅ ===== Dify Chat 完成 =====\n`);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('❌ Dify chat 錯誤:', error);
    res.status(500).json({
      success: false,
      error: 'Dify 對話失敗',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * POST /api/chat/stream
 * 發送對話訊息 (Streaming Mode - SSE)
 */
router.post('/stream', async (req: Request, res: Response) => {
  try {
    const { message, userId, conversationId } = req.body as ChatRequestBody;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: '缺少必要參數: message',
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: '缺少必要參數: userId',
      });
    }

    console.log(`\n💬 ===== Dify Chat (Streaming) =====`);
    console.log(`📝 Message: ${message.substring(0, 50)}...`);
    console.log(`👤 User: ${userId}`);
    console.log(`🔗 Conversation: ${conversationId || '(新對話)'}`);

    // 設定 SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const stream = await chatService.streamChat(
      message,
      userId,
      conversationId || null,
    );

    // 處理串流
    let fullText = '';
    let resultConversationId = conversationId;
    for await (const chunk of stream.textStream) {
      fullText += chunk;
      res.write(
        `data: ${JSON.stringify({ type: 'text', content: chunk })}\n\n`,
      );
    }

    // 取得最終結果（需要 await 以取得 Promise 的值）
    const providerMetadata = await stream.providerMetadata;
    const difyData =
      (providerMetadata?.difyWorkflowData as Record<string, string>) || {};
    resultConversationId = difyData.conversationId || conversationId;
    const resultMessageId = difyData.messageId;

    res.write(
      `data: ${JSON.stringify({
        type: 'done',
        conversationId: resultConversationId,
        messageId: resultMessageId,
        fullText,
      })}\n\n`,
    );

    console.log(`✅ 串流完成，總長度: ${fullText.length} 字元`);
    console.log(`🆔 Conversation ID: ${resultConversationId}`);
    console.log(`\n✅ ===== Dify Stream 完成 =====\n`);

    res.end();
  } catch (error) {
    console.error('❌ Dify stream 錯誤:', error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Dify 串流對話失敗',
        details: error instanceof Error ? error.message : String(error),
      });
    } else {
      res.write(
        `data: ${JSON.stringify({ type: 'error', error: error instanceof Error ? error.message : String(error) })}\n\n`,
      );
      res.end();
    }
  }
});

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
