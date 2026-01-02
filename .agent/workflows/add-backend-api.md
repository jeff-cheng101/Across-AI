---
description: 後端 API 開發標準流程
---

# 新增後端 API

在 Express 後端新增 API 端點的標準流程。

## 步驟

### 1. 建立 Service 層
```typescript
// backend/services/[feature]Service.ts
import { z } from 'zod';

// 定義 Schema
const RequestSchema = z.object({
  // ...
});

/**
 * 業務邏輯函數
 */
export async function doSomething(params: z.infer<typeof RequestSchema>) {
  // 實作業務邏輯
}
```

### 2. 建立 Routes
```typescript
// backend/routes/[feature].routes.ts
import express, { type Request, type Response, type Router } from 'express';
import * as featureService from '../services/[feature]Service';

const router: Router = express.Router();

/**
 * POST /api/[feature]
 * 功能描述
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const result = await featureService.doSomething(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('❌ 錯誤:', error);
    res.status(500).json({
      success: false,
      error: '操作失敗',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

export = router;
```

### 3. 註冊路由
在 `backend/index.js` 或主入口檔案中：
```javascript
const featureRoutes = require('./routes/[feature].routes');
app.use('/api/[feature]', featureRoutes);
```

## 重要規則

- ✅ 使用 TypeScript
- ✅ 使用 Zod 驗證輸入
- ✅ 錯誤訊息使用繁體中文
- ✅ 加入適當的 console.log 日誌
- ❌ 不要硬編碼敏感資訊
