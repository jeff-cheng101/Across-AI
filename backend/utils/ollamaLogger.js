// backend/utils/ollamaLogger.js
// Ollama API 請求/回應日誌工具

const fs = require('fs');
const path = require('path');

// 日誌目錄路徑
const LOGS_DIR = path.join(__dirname, '../logs');

// 確保日誌目錄存在
function ensureLogsDir() {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
    console.log(`📁 創建日誌目錄: ${LOGS_DIR}`);
  }
}

// 生成日誌文件名
function generateLogFileName(prefix) {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/:/g, '-')
    .replace(/\./g, '-')
    .replace('T', '_')
    .replace('Z', '');
  return `${prefix}_${timestamp}.json`;
}

/**
 * 保存完整日誌到文件
 * @param {string} type - 日誌類型 (request/response)
 * @param {Object} data - 日誌資料
 * @param {string} apiType - API 類型 (ollama/openai-compatible)
 * @returns {string|null} - 保存的文件路徑
 */
function saveLogToFile(type, data, apiType = 'ollama') {
  try {
    ensureLogsDir();

    const fileName = generateLogFileName(`${apiType}_${type}`);
    const filePath = path.join(LOGS_DIR, fileName);

    const logContent = {
      timestamp: new Date().toISOString(),
      type: type,
      apiType: apiType,
      ...data,
    };

    fs.writeFileSync(filePath, JSON.stringify(logContent, null, 2), 'utf-8');
    console.log(`💾 日誌已保存: ${filePath}`);

    return filePath;
  } catch (error) {
    console.error(`❌ 保存日誌失敗: ${error.message}`);
    return null;
  }
}

/**
 * 記錄 Ollama API 請求的完整訊息
 * @param {string} url - Ollama API URL
 * @param {Object} requestBody - 請求 body
 */
function logOllamaRequest(url, requestBody) {
  const timestamp = new Date().toISOString();

  console.log('\n' + '='.repeat(80));
  console.log('📤 ===== OLLAMA API 請求訊息 =====');
  console.log('='.repeat(80));
  console.log(`🔗 URL: ${url}`);
  console.log(`📅 時間: ${timestamp}`);
  console.log('\n📋 完整請求 Body:');
  console.log('-'.repeat(80));

  // 複製 requestBody，避免直接修改原始物件
  const logBody = { ...requestBody };

  // 如果 prompt 太長，顯示前後部分（控制台輸出用）
  if (logBody.prompt && logBody.prompt.length > 2000) {
    const promptPreview =
      logBody.prompt.substring(0, 1000) +
      '\n\n... [省略中間 ' +
      (logBody.prompt.length - 2000) +
      ' 字元] ...\n\n' +
      logBody.prompt.substring(logBody.prompt.length - 1000);
    console.log(JSON.stringify({ ...logBody, prompt: promptPreview }, null, 2));
    console.log(`\n📏 完整 Prompt 長度: ${requestBody.prompt.length} 字元`);
  } else {
    console.log(JSON.stringify(logBody, null, 2));
  }

  console.log('-'.repeat(80));
  console.log('📤 ===== 請求訊息結束 =====\n');

  // 💾 保存完整請求到文件（不省略任何內容）
  saveLogToFile(
    'request',
    {
      url: url,
      requestBody: requestBody, // 保存完整的請求 body
    },
    'ollama',
  );
}

/**
 * 記錄 Ollama API 回應的完整訊息
 * @param {Object} responseData - 回應資料
 * @param {number} elapsedTime - 回應時間（秒）
 */
function logOllamaResponse(responseData, elapsedTime) {
  const timestamp = new Date().toISOString();

  console.log('\n' + '='.repeat(80));
  console.log('📥 ===== OLLAMA API 回應訊息 =====');
  console.log('='.repeat(80));
  console.log(`📅 時間: ${timestamp}`);
  console.log(`⏱️ 回應時間: ${elapsedTime} 秒`);

  if (responseData.response) {
    console.log(`📏 回應長度: ${responseData.response.length} 字元`);
    console.log('\n📋 完整回應內容:');
    console.log('-'.repeat(80));

    // 如果回應太長，顯示前後部分（控制台輸出用）
    if (responseData.response.length > 5000) {
      const responsePreview =
        responseData.response.substring(0, 2500) +
        '\n\n... [省略中間 ' +
        (responseData.response.length - 5000) +
        ' 字元] ...\n\n' +
        responseData.response.substring(responseData.response.length - 2500);
      console.log(responsePreview);
    } else {
      console.log(responseData.response);
    }

    console.log('-'.repeat(80));
  }

  // 顯示其他元資料（排除 response 以避免重複）
  const metadata = { ...responseData };
  delete metadata.response;

  if (Object.keys(metadata).length > 0) {
    console.log('\n📊 回應元資料:');
    console.log(JSON.stringify(metadata, null, 2));
  }

  console.log('📥 ===== 回應訊息結束 =====\n');

  // 💾 保存完整回應到文件（不省略任何內容）
  saveLogToFile(
    'response',
    {
      elapsedTime: elapsedTime,
      responseData: responseData, // 保存完整的回應資料
    },
    'ollama',
  );
}

/**
 * 記錄 OpenAI 相容 API 請求的完整訊息（用於 routes 使用 OpenAI SDK）
 * @param {string} baseUrl - API Base URL
 * @param {Object} requestParams - 請求參數
 */
function logOpenAICompatibleRequest(baseUrl, requestParams) {
  const timestamp = new Date().toISOString();

  console.log('\n' + '='.repeat(80));
  console.log('📤 ===== OLLAMA (OpenAI 相容) API 請求訊息 =====');
  console.log('='.repeat(80));
  console.log(`🔗 Base URL: ${baseUrl}`);
  console.log(`📅 時間: ${timestamp}`);
  console.log('\n📋 完整請求參數:');
  console.log('-'.repeat(80));

  // 複製 requestParams，避免直接修改原始物件
  const logParams = JSON.parse(JSON.stringify(requestParams));

  // 如果 messages 中的 content 太長，顯示前後部分（控制台輸出用）
  if (logParams.messages) {
    logParams.messages = logParams.messages.map((msg) => {
      if (msg.content && msg.content.length > 2000) {
        return {
          ...msg,
          content:
            msg.content.substring(0, 1000) +
            '\n\n... [省略中間 ' +
            (msg.content.length - 2000) +
            ' 字元] ...\n\n' +
            msg.content.substring(msg.content.length - 1000),
          _originalLength: msg.content.length,
        };
      }
      return msg;
    });
  }

  console.log(JSON.stringify(logParams, null, 2));
  console.log('-'.repeat(80));
  console.log('📤 ===== 請求訊息結束 =====\n');

  // 💾 保存完整請求到文件（不省略任何內容）
  saveLogToFile(
    'request',
    {
      baseUrl: baseUrl,
      requestParams: requestParams, // 保存完整的請求參數
    },
    'openai-compatible',
  );
}

/**
 * 記錄 OpenAI 相容 API 回應的完整訊息
 * @param {Object} completion - OpenAI completion 回應
 * @param {number} elapsedTime - 回應時間（秒）
 */
function logOpenAICompatibleResponse(completion, elapsedTime) {
  const timestamp = new Date().toISOString();

  console.log('\n' + '='.repeat(80));
  console.log('📥 ===== OLLAMA (OpenAI 相容) API 回應訊息 =====');
  console.log('='.repeat(80));
  console.log(`📅 時間: ${timestamp}`);
  console.log(`⏱️ 回應時間: ${elapsedTime} 秒`);

  const responseText = completion.choices?.[0]?.message?.content || '';

  if (responseText) {
    console.log(`📏 回應長度: ${responseText.length} 字元`);
    console.log('\n📋 完整回應內容:');
    console.log('-'.repeat(80));

    // 如果回應太長，顯示前後部分（控制台輸出用）
    if (responseText.length > 5000) {
      const responsePreview =
        responseText.substring(0, 2500) +
        '\n\n... [省略中間 ' +
        (responseText.length - 5000) +
        ' 字元] ...\n\n' +
        responseText.substring(responseText.length - 2500);
      console.log(responsePreview);
    } else {
      console.log(responseText);
    }

    console.log('-'.repeat(80));
  }

  // 顯示其他元資料
  const metadata = {
    id: completion.id,
    model: completion.model,
    created: completion.created,
    usage: completion.usage,
    finish_reason: completion.choices?.[0]?.finish_reason,
  };

  console.log('\n📊 回應元資料:');
  console.log(JSON.stringify(metadata, null, 2));
  console.log('📥 ===== 回應訊息結束 =====\n');

  // 💾 保存完整回應到文件（不省略任何內容）
  saveLogToFile(
    'response',
    {
      elapsedTime: elapsedTime,
      completion: completion, // 保存完整的 completion 回應
    },
    'openai-compatible',
  );
}

module.exports = {
  logOllamaRequest,
  logOllamaResponse,
  logOpenAICompatibleRequest,
  logOpenAICompatibleResponse,
};
