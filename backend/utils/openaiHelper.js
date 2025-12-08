/**
 * OpenAI API Helper Functions
 * 用於處理 OpenAI 格式的請求與回應
 */

/**
 * 生成 OpenAI 格式的 Request Body
 * @param {object} params - 請求參數物件
 * @param {string} params.model - 模型名稱 (e.g., 'gpt-4o', 'Qwen/Qwen2.5-7B-Instruct-AWQ')
 * @param {string} params.systemPrompt - 系統提示詞 (System Role)
 * @param {string} params.userPrompt - 使用者提示詞 (User Role)
 * @param {object} [params.options] - 其他選項 (temperature, top_p, etc.)
 * @returns {object} OpenAI Chat Completion Request Body
 */
function generateOpenAIRequestBody({ model, systemPrompt, userPrompt, options = {} }) {
    return {
        model: model,
        messages: [
            {
                role: 'system',
                content: systemPrompt || '你是個資安專家，專精於分析日誌和威脅識別。'
            },
            {
                role: 'user',
                content: userPrompt
            }
        ],
        temperature: options.temperature || 0.7,
        ...options
    };
}

/**
 * 從 OpenAI 格式的回應中取得內容
 * @param {object} responseData - OpenAI API 回傳的完整 JSON 物件
 * @returns {string} AI 的回應內容
 * @throws {Error} 如果回應格式不正確
 */
function parseOpenAIResponse(responseData) {
    if (
        responseData?.choices &&
        Array.isArray(responseData.choices) &&
        responseData.choices.length > 0 &&
        responseData.choices[0].message &&
        responseData.choices[0].message.content
    ) {
        return responseData.choices[0].message.content;
    }

    throw new Error('OpenAI Response Format Invalid: Missing choices[0].message.content');
}

module.exports = {
    generateOpenAIRequestBody,
    parseOpenAIResponse
};
