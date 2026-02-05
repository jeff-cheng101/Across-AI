import { authClient } from '@/lib/api-clients';

const request = authClient;
/**
 * Elasticsearch 查询 API
 * @param data - 查詢資料 { index, body }
 * @param signal - AbortSignal 用於取消請求
 */
export const getElasticsearchResponse = async (data: any, signal?: AbortSignal) => {
    const resp = await request.post(`elasticsearch/search`, data, { signal });
    return resp;
}



