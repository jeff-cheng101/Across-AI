// frontend/services/chat/type.ts
import { z } from 'zod';

/**
 * 對話項目 Schema
 */
export const ConversationItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});

export type ConversationItem = z.infer<typeof ConversationItemSchema>;

/**
 * 對話列表回應 Schema
 */
export const ConversationsResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      conversations: z.array(ConversationItemSchema),
      hasMore: z.boolean(),
    })
    .optional(),
  error: z.string().optional(),
});

export type ConversationsResponse = z.infer<typeof ConversationsResponseSchema>;

/**
 * Dify 訊息格式 Schema
 */
export const DifyMessageSchema = z.object({
  id: z.string(),
  query: z.string(),
  answer: z.string(),
  created_at: z.number(),
});

export type DifyMessage = z.infer<typeof DifyMessageSchema>;

/**
 * 訊息列表回應 Schema
 */
export const MessagesResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      messages: z.array(DifyMessageSchema),
      hasMore: z.boolean(),
    })
    .optional(),
  error: z.string().optional(),
});

export type MessagesResponse = z.infer<typeof MessagesResponseSchema>;
