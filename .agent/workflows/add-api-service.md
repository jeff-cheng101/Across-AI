---
description: 新增前端 API 服務的標準流程
---

# 新增 API 服務

依照三層架構模式，在 `services/` 目錄新增 API 服務。

// turbo-all

## 步驟

### 1. 建立目錄結構
```bash
mkdir -p frontend/services/[feature-name]
```

### 2. 建立 Zod Schema (`type.ts`)
```typescript
// frontend/services/[feature-name]/type.ts
import { z } from 'zod';

// 定義回應 Schema
export const ResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  // ... 其他欄位
});

// 導出類型
export type Response = z.infer<typeof ResponseSchema>;
```

### 3. 建立 Fetcher (`api.ts`)
```typescript
// frontend/services/[feature-name]/api.ts
import { backendClient } from '@/lib/api-clients';
import { ResponseSchema, type Response } from './type';

/**
 * 取得資料
 */
export async function getData(id: string): Promise<Response> {
  const response = await backendClient.get(`/endpoint/${id}`);
  return ResponseSchema.parse(response.data);
}
```

### 4. 建立索引 (`index.ts`)
```typescript
// frontend/services/[feature-name]/index.ts
export * from './api';
export * from './type';
```

### 5. 在組件中使用
```typescript
import { useQuery } from '@tanstack/react-query';
import { getData } from '@/services/[feature-name]';

const { data, isLoading } = useQuery({
  queryKey: ['feature', id],
  queryFn: () => getData(id),
});
```

## 重要規則

- ✅ 使用 `authClient` 或 `backendClient`
- ✅ 使用 Zod 驗證所有 API 回應
- ✅ 在組件中直接使用 React Query
- ❌ 不要直接使用 `fetch`
- ❌ 不要創建新的 Axios 實例
- ❌ 不要在 `app/routes/` 新增功能
