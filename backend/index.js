// backend/index.js
require('dotenv').config();

// 註冊 ts-node 以支持 TypeScript 文件
// ts-node 會自動讀取 tsconfig.json，無需額外配置
require('ts-node').register({
  transpileOnly: true, // 只轉譯，不進行類型檢查（提升速度）
});

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { elkMCPClient } = require('./services/elkMCPClient');
const { ELK_CONFIG } = require('./config/elkConfig');

// 產品專屬路由模組
const cloudflareRoutes = require('./routes/cloudflare.routes');
const f5Routes = require('./routes/f5.routes');
const checkpointRoutes = require('./routes/checkpoint.routes');
const commonRoutes = require('./routes/common.routes');
const reportRoutes = require('./routes/report.routes');
const workflowRoutes = require('./routes/workflow.routes.ts');

const app = express();
app.use(cors());
app.use(express.json());

// 註冊產品專屬路由
app.use('/api/cloudflare', cloudflareRoutes);
app.use('/api/f5', f5Routes);
app.use('/api/checkpoint', checkpointRoutes);
app.use('/api', commonRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/workflow', workflowRoutes);

// --- 工具函數 ---

// 載入配置檔案（如果存在）
let config = {};
try {
  config = require('./config.js');
} catch (_error) {
  // 配置檔案不存在，使用 UI 設定
}

// 可用的 Gemini 模型
const AVAILABLE_MODELS = [
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite' },
];

// @deprecated - 已移至 common.routes.js
// 取得可用的模型列表（向後兼容）
app.get('/api/models-legacy', (_req, res) => {
  res.json(AVAILABLE_MODELS);
});

// @deprecated - 內部使用
// 原始 AI 分析端點 (現在主要由後端內部呼叫)
app.post('/api/analyze', async (req, res) => {
  try {
    const analysis = await getAIAssessment(req.body);
    res.json(analysis);
  } catch (error) {
    console.error('AI 分析錯誤:', error);
    res.status(500).json({
      error: 'AI 分析失敗',
      details: error.message,
    });
  }
});

// @deprecated - 已移至 common.routes.js
// 簡化的 AI 測試端點（向後兼容）
app.post('/api/test-ai-legacy', async (req, res) => {
  try {
    const { apiKey, model } = req.body;
    const useApiKey = apiKey || config.GEMINI_API_KEY;
    const useModel = model || config.GEMINI_MODEL || 'gemini-2.5-flash';

    if (!useApiKey) {
      return res.status(400).json({ error: '缺少 API Key' });
    }

    // 簡單的 AI 測試
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(useApiKey);
    const genModel = genAI.getGenerativeModel({ model: useModel });

    const testPrompt = '請回答：AI 連接測試成功。';
    const result = await genModel.generateContent(testPrompt);
    const response = result.response;
    const text = response.text();

    res.json({
      success: true,
      message: '✅ AI 連接測試成功',
      model: useModel,
      response: text,
    });
  } catch (error) {
    console.error('AI 測試錯誤:', error);
    res.status(500).json({
      error: 'AI 測試失敗',
      details: error.message,
    });
  }
});

// --- 核心邏輯函式 ---

async function getAIAssessment(requestBody) {
  const {
    apiKey,
    model,
    attackData,
    healthData,
    eventData,
    overallData,
    fieldReference,
    owaspReferences,
  } = requestBody;
  const useApiKey = apiKey || config.GEMINI_API_KEY;
  const useModel = model || config.GEMINI_MODEL || 'gemini-2.5-flash';

  if (
    !useApiKey ||
    (!attackData && !healthData && !eventData && !overallData)
  ) {
    throw new Error('缺少必要參數');
  }

  console.log('=== AI 分析請求 ===');
  console.log('使用模型:', useModel);

  const genAI = new GoogleGenerativeAI(useApiKey);
  const genModel = genAI.getGenerativeModel({ model: useModel });
  const analysisId = Math.random().toString(36).substr(2, 9);
  const currentTime = new Date().toLocaleString('zh-TW');
  let prompt;

  if (attackData) {
    console.log('分析類型: 攻擊事件');

    // 格式化攻擊模式資訊
    const formatAttackPatterns = (patterns) => {
      const sections = [];
      if (patterns.sensitiveFiles && patterns.sensitiveFiles.length > 0) {
        sections.push(
          `敏感檔案探測: ${patterns.sensitiveFiles.map((p) => `${p.item} (${p.count}次)`).join(', ')}`,
        );
      }
      if (patterns.versionControl && patterns.versionControl.length > 0) {
        sections.push(
          `版本控制系統攻擊: ${patterns.versionControl.map((p) => `${p.item} (${p.count}次)`).join(', ')}`,
        );
      }
      if (patterns.adminPanels && patterns.adminPanels.length > 0) {
        sections.push(
          `管理面板攻擊: ${patterns.adminPanels.map((p) => `${p.item} (${p.count}次)`).join(', ')}`,
        );
      }
      if (patterns.configFiles && patterns.configFiles.length > 0) {
        sections.push(
          `配置檔案攻擊: ${patterns.configFiles.map((p) => `${p.item} (${p.count}次)`).join(', ')}`,
        );
      }
      if (patterns.sqlInjection && patterns.sqlInjection.length > 0) {
        sections.push(
          `SQL注入嘗試: ${patterns.sqlInjection.map((p) => `${p.item} (${p.count}次)`).join(', ')}`,
        );
      }
      if (patterns.xssAttempts && patterns.xssAttempts.length > 0) {
        sections.push(
          `XSS攻擊嘗試: ${patterns.xssAttempts.map((p) => `${p.item} (${p.count}次)`).join(', ')}`,
        );
      }
      return sections.length > 0
        ? sections.join('\n- ')
        : '未檢測到其他特定攻擊模式';
    };

    // 格式化 OWASP 分析結果
    const formatOWASPFindings = (findings) => {
      if (!findings || findings.length === 0) {
        return '未檢測到特定的 OWASP 攻擊模式';
      }

      const grouped = {};
      findings.forEach((finding) => {
        finding.owaspTypes.forEach((type) => {
          if (!grouped[type.type]) {
            grouped[type.type] = {
              title: type.title,
              url: type.url,
              description: type.description,
              instances: [],
            };
          }
          grouped[type.type].instances.push({
            uri: finding.uri,
            ip: finding.clientIp,
            wafScore: finding.wafScore,
          });
        });
      });

      return Object.values(grouped)
        .map((data) => {
          return `${data.title}:
   - 描述: ${data.description}
   - 參考: ${data.url}
   - 檢測到 ${data.instances.length} 個實例
   - 主要攻擊路徑: ${data.instances
     .slice(0, 3)
     .map((i) => i.uri)
     .join(', ')}`;
        })
        .join('\n\n');
    };

    prompt = `
作為一個網路安全專家，請深入分析以下攻擊事件，並基於完整的安全資料提供專業見解。

${
  fieldReference
    ? `
=== 日誌欄位參考 ===
以下是 Cloudflare 日誌欄位的對應說明，請在分析時參考這些欄位的業務意義：

${fieldReference}

`
    : ''
}

${
  owaspReferences
    ? `
=== OWASP Top 10 參考資源 ===
請參考以下 OWASP Top 10 資源來分類和分析攻擊類型：
${owaspReferences.map((ref) => `- ${ref}`).join('\n')}

`
    : ''
}

=== 攻擊事件基本資訊 ===
分析ID: ${analysisId}
分析時間: ${currentTime}
時間範圍: ${attackData.timeRange ? `${attackData.timeRange.start} 到 ${attackData.timeRange.end}` : 'N/A'}

=== 主要攻擊事件分析 ===
- 實際目標網域：${attackData.attackDomain}${
      attackData.claimedDomain
        ? `
- 攻擊者聲稱目標：${attackData.claimedDomain} (⚠️ 偽造的 Host header)`
        : ''
    }
- 目標IP：${attackData.targetIP}
- 攻擊URL：${attackData.targetURL}
- 攻擊流量：${attackData.attackTrafficGbps.toFixed(4)} Gbps
- 主要攻擊來源：${attackData.sourceList.map((src) => `${src.ip} (${src.country}, ${src.asn}, ${src.count} 次請求)`).join(', ')}

=== 所有檢測到的攻擊事件 ===
${
  attackData.allAttacks
    ? attackData.allAttacks
        .map(
          (attack, index) =>
            `${index + 1}. ${attack.domain}${attack.claimedDomain ? ` (偽造: ${attack.claimedDomain})` : ''}
   - 攻擊來源: ${attack.sourceCount} 個IP
   - 目標路徑: ${attack.targetURL}`,
        )
        .join('\n')
    : '僅檢測到上述單一攻擊事件'
}

=== 攻擊關聯圖分析 ===
${
  attackData.attackGraph
    ? `
🔗 關聯強度: ${(attackData.attackGraph.correlationMetrics.strength * 100).toFixed(1)}% ${attackData.attackGraph.correlationMetrics.coordinatedAttack ? '(協調攻擊)' : ''}
📊 多目標攻擊者: ${attackData.attackGraph.correlationMetrics.multiTargetAttackers} 個
🏗️ 基礎設施規模: ${attackData.attackGraph.correlationMetrics.infrastructureScope} 個子域名

🎯 攻擊者IP集群分析:
${attackData.attackGraph.ipClusters
  .map(
    (cluster, index) =>
      `${index + 1}. ${cluster.ip} [${cluster.riskLevel}風險]
   - 攻擊目標數: ${cluster.targets.length}
   - 總嚴重程度: ${cluster.totalSeverity}
   - 使用技術: ${cluster.techniques.join(', ')}
   - 目標域名: ${cluster.targets.map((t) => t.domain).join(', ')}`,
  )
  .join('\n')}

🏢 目標基礎設施分析:
${attackData.attackGraph.infrastructureMap
  .map(
    (infra, index) =>
      `${index + 1}. ${infra.baseDomain} ${infra.isTargetedInfrastructure ? '(重點目標)' : ''}
   - 受攻擊子域名: ${infra.subdomains.join(', ')}
   - 攻擊者數量: ${infra.attackers.length}
   - 攻擊者IP: ${infra.attackers.join(', ')}`,
  )
  .join('\n')}

🔍 攻擊模式分佈:
${attackData.attackGraph.attackPatternAnalysis
  .map(
    (pattern) =>
      `- ${pattern.type}: ${pattern.count} 次 (範例: ${pattern.examples.slice(0, 2).join(', ')})`,
  )
  .join('\n')}
`
    : '未建立攻擊關聯圖（單一攻擊事件）'
}

=== 攻擊環境統計 ===
- 總請求數: ${attackData.totalRequests ? attackData.totalRequests.toLocaleString() : 'N/A'}
- 涉及獨立IP數: ${attackData.uniqueIPs ? attackData.uniqueIPs.toLocaleString() : 'N/A'}
- 被阻擋請求: ${attackData.securityEvents ? attackData.securityEvents.blockedRequests.toLocaleString() : 'N/A'}
- 高風險請求: ${attackData.securityEvents ? attackData.securityEvents.highRiskRequests.toLocaleString() : 'N/A'}

=== 詳細攻擊模式分析 ===
${attackData.attackPatterns ? formatAttackPatterns(attackData.attackPatterns) : '無詳細攻擊模式資料'}

=== OWASP Top 10 威脅分析 ===
${attackData.owaspFindings ? formatOWASPFindings(attackData.owaspFindings) : '未檢測到特定的 OWASP 攻擊模式'}

=== 地理分佈與來源分析 ===
- Top 5 來源國家: ${attackData.topCountries ? attackData.topCountries.map((c) => `${c.item} (${c.count}次)`).join(', ') : 'N/A'}
- Top 5 攻擊來源IP: ${attackData.topIPs ? attackData.topIPs.map((ip) => `${ip.item} (${ip.count}次)`).join(', ') : 'N/A'}
- 主要安全規則觸發: ${attackData.securityEvents?.topSecurityRules ? attackData.securityEvents.topSecurityRules.map((r) => `${r.item} (${r.count}次)`).join(', ') : 'N/A'}

請提供：
1. 深度攻擊關聯分析 (summary)：基於以上攻擊關聯圖和完整資料，進行專業的威脅評估。重點分析：
   - **攻擊關聯圖解讀**：分析IP集群、基礎設施目標、攻擊模式分佈的關聯性
   - **協調攻擊評估**：評估是否為有組織的協調攻擊，或是散漫的機會主義攻擊  
   - **多目標攻擊分析**：分析單一攻擊者針對多個目標的戰術意圖
   - **基礎設施威脅**：評估整個 twister5.cf 基礎設施面臨的系統性風險
   - **攻擊技術組合**：分析攻擊者使用的技術組合和演進趨勢
   - **Host header 偽造**：特別分析偽造攻擊對基礎設施認知的影響
   - **威脅行為者畫像**：基於關聯分析推斷攻擊者的技術水平和目標
   - **整體威脅等級**：綜合關聯強度、攻擊規模、技術複雜度的威脅評級

2. 關聯式防禦策略 (recommendations)：基於攻擊關聯圖分析，提供7-9個層次化的防禦建議：
   - **IP集群防護**：針對識別出的攻擊者IP集群的阻斷策略
   - **基礎設施加固**：針對整個 twister5.cf 基礎設施的系統性防護
   - **攻擊模式對策**：針對發現的特定攻擊模式（環境檔案、配置檔案等）的防護
   - **Host偽造防護**：專門的 Host header 驗證和偽造檢測機制
   - **關聯檢測增強**：建立跨域名的攻擊關聯監控機制
   - **威脅情報整合**：利用攻擊關聯資訊提升威脅情報效果
   - **事件響應優化**：基於關聯分析的快速事件響應流程

請以繁體中文回答，格式為 JSON：
{
  "summary": "您的專業深度攻擊分析",
  "recommendations": [ "建議1", "建議2", "..." ]
}`;
  } else if (eventData) {
    console.log('分析類型: 純事件日誌');
    prompt = `
作為一個網路安全專家，請分析以下在 ${eventData.timeRange.start} 到 ${eventData.timeRange.end} 期間的純事件日誌資料。此日誌主要記錄安全事件，不包含詳細的流量資訊。

事件摘要：
- 總事件數: ${eventData.totalEvents.toLocaleString()}
- 涉及的獨立 IP 數: ${eventData.uniqueIPs.toLocaleString()}
- Top 5 來源國家: ${eventData.topCountries.map((c) => `${c.item} (${c.count.toLocaleString()}次)`).join(', ')}
- Top 5 事件來源 IP: ${eventData.topIPs.map((ip) => `${ip.item} (${ip.count.toLocaleString()}次)`).join(', ')}
- Top 5 目標資源: ${eventData.topURIs.map((u) => `${u.item} (${u.count.toLocaleString()}次)`).join(', ')}

請提供：
1. 事件分析 (summary)：根據以上事件資料，分析這段時間內的安全事件特徵。評估事件的分佈模式、來源特徵、目標資源等，判斷是否存在潛在的安全威脅或異常行為模式。
2. 安全建議 (recommendations)：基於事件分析結果，提供 4-5 個針對性的安全防護和監控建議。

請以繁體中文回答，格式為 JSON：
{
  "summary": "您的專業事件分析",
  "recommendations": [ "建議1", "建議2", "..." ]
}`;
  } else if (overallData) {
    console.log('分析類型: 整體綜合分析');

    // 格式化攻擊模式資訊
    const formatAttackPatterns = (patterns) => {
      const sections = [];
      if (patterns.sensitiveFiles.length > 0) {
        sections.push(
          `敏感檔案探測: ${patterns.sensitiveFiles.map((p) => `${p.item} (${p.count}次)`).join(', ')}`,
        );
      }
      if (patterns.versionControl.length > 0) {
        sections.push(
          `版本控制系統攻擊: ${patterns.versionControl.map((p) => `${p.item} (${p.count}次)`).join(', ')}`,
        );
      }
      if (patterns.adminPanels.length > 0) {
        sections.push(
          `管理面板攻擊: ${patterns.adminPanels.map((p) => `${p.item} (${p.count}次)`).join(', ')}`,
        );
      }
      if (patterns.configFiles.length > 0) {
        sections.push(
          `配置檔案攻擊: ${patterns.configFiles.map((p) => `${p.item} (${p.count}次)`).join(', ')}`,
        );
      }
      if (patterns.sqlInjection.length > 0) {
        sections.push(
          `SQL注入嘗試: ${patterns.sqlInjection.map((p) => `${p.item} (${p.count}次)`).join(', ')}`,
        );
      }
      if (patterns.xssAttempts.length > 0) {
        sections.push(
          `XSS攻擊嘗試: ${patterns.xssAttempts.map((p) => `${p.item} (${p.count}次)`).join(', ')}`,
        );
      }
      return sections.length > 0
        ? sections.join('\n- ')
        : '未檢測到特定攻擊模式';
    };

    prompt = `
作為一個網路安全專家，請深入分析以下在 ${overallData.timeRange.start} 到 ${overallData.timeRange.end} 期間的網站安全狀況。此報告包含完整的流量、安全事件和攻擊模式資料。

=== 基本流量統計 ===
- 總請求數: ${overallData.totalRequests.toLocaleString()}
- 獨立訪客 IP 數: ${overallData.uniqueIPs.toLocaleString()}
- 總流量: ${overallData.totalGB} GB
- 平均每請求位元組數: ${overallData.avgBytesPerRequest} bytes
- Top 5 來源國家: ${overallData.topCountries.map((c) => `${c.item} (${c.count.toLocaleString()}次)`).join(', ')}
- Top 5 請求來源 IP: ${overallData.topIPs.map((ip) => `${ip.item} (${ip.count.toLocaleString()}次)`).join(', ')}

=== 安全事件統計 ===
- 被阻擋的請求: ${overallData.securityEvents.blockedRequests.toLocaleString()}
- 高風險請求: ${overallData.securityEvents.highRiskRequests.toLocaleString()}
- 主要安全規則觸發: ${overallData.securityEvents.topSecurityRules.map((r) => `${r.item} (${r.count}次)`).join(', ')}

=== 攻擊模式分析 ===
- ${formatAttackPatterns(overallData.attackPatterns)}

=== 最常被請求的資源 ===
- ${overallData.topURIs.map((u) => `${u.item} (${u.count.toLocaleString()}次)`).join(', ')}

請提供：
1. 深度安全分析 (summary)：基於以上詳細資料，提供專業的安全威脅評估。特別關注：
   - 攻擊模式的嚴重程度和威脅等級
   - 敏感檔案探測（如 .env、.git/config、.DS_Store）的風險
   - 版本控制系統攻擊的潛在影響
   - 管理面板和配置檔案攻擊的安全隱患
   - SQL注入和XSS攻擊的威脅程度
   - 地理來源和IP分佈的異常性
   
2. 針對性防護建議 (recommendations)：基於發現的具體攻擊模式，提供 5-6 個精確的安全防護建議，每個建議應直接對應發現的威脅。

**重要：請務必嚴格按照以下JSON格式回答，不要添加任何其他文字或說明：**

{
  "summary": "您的專業深度安全分析",
  "recommendations": [ "建議1", "建議2", "建議3", "建議4", "建議5" ]
}

**注意：請直接回應JSON，不要有"好的"、"作為專家"等開頭語句**`;
  } else if (healthData) {
    console.log('分析類型: 網站健康度');
    prompt = `
作為一個網路安全專家，請分析以下在 ${healthData.timeRange.start} 到 ${healthData.timeRange.end} 期間的網站總體流量健康度報告。報告期間內未偵測到符合特定規則的攻擊事件。

流量摘要：
- 總請求數: ${healthData.totalRequests.toLocaleString()}
- 獨立訪客 IP 數: ${healthData.uniqueIPs.toLocaleString()}
- 總流量: ${healthData.totalGB} GB
- Top 5 來源國家: ${healthData.topCountries.map((c) => `${c.item} (${c.count.toLocaleString()}次)`).join(', ')}
- Top 5 請求 IP: ${healthData.topIPs.map((ip) => `${ip.item} (${ip.count.toLocaleString()}次)`).join(', ')}
- Top 5 被請求頁面: ${healthData.topURIs.map((u) => `${u.item} (${u.count.toLocaleString()}次)`).join(', ')}

請提供：
1. 總結報告 (summary)：根據以上數據，評估這段時間的整體網站是否健康。分析來源分佈、請求模式等是否有任何潛在的異常或值得關注的跡象（例如，來自特定國家的請求是否過於集中？某個IP的請求量是否不成比例地高？）。即使沒有偵測到明確攻擊，也請從專業角度提供您的見解。
2. 安全建議 (recommendations)：提供 4-5 個通用的、預防性的安全加固建議，以維持網站的健康和安全。

**重要：請務必嚴格按照以下JSON格式回答，不要添加任何其他文字或說明：**

{
  "summary": "您的專業分析報告",
  "recommendations": [ "建議1", "建議2", "建議3", "建議4", "建議5" ]
}

**注意：請直接回應JSON，不要有"好的"、"作為專家"等開頭語句**`;
  }

  // 添加重試機制處理 503 錯誤
  let result;
  let retryCount = 0;
  const maxRetries = 3;
  const retryDelay = 2000; // 2 秒

  while (retryCount < maxRetries) {
    try {
      console.log(`🔄 嘗試 AI 分析 (第 ${retryCount + 1} 次)...`);
      result = await genModel.generateContent(prompt);
      break; // 成功就跳出迴圈
    } catch (error) {
      retryCount++;
      console.log(`⚠️ AI 分析失敗 (第 ${retryCount} 次):`, error.message);

      if (error.status === 503 && retryCount < maxRetries) {
        console.log(`⏳ 等待 ${retryDelay / 1000} 秒後重試...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        // 如果不是 503 錯誤或已達到最大重試次數，拋出錯誤
        throw error;
      }
    }
  }

  const response = await result.response;
  let text = response
    .text()
    .replace(/```json\s*|```\s*/g, '')
    .trim();

  // 嘗試從非JSON回應中提取JSON部分
  if (!text.startsWith('{') && text.includes('{')) {
    const jsonStart = text.indexOf('{');
    text = text.substring(jsonStart);
  }

  try {
    const analysis = JSON.parse(text);

    // 確保必要的屬性存在且格式正確
    if (!analysis.summary) {
      analysis.summary = 'AI 分析完成，但摘要格式異常';
    } else if (typeof analysis.summary === 'object') {
      // 如果 summary 是物件，將其轉換為可讀的字串
      if (analysis.summary !== null) {
        const summaryParts = [];
        for (const [key, value] of Object.entries(analysis.summary)) {
          const formattedKey = key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
          summaryParts.push(`**${formattedKey}**: ${String(value)}`);
        }
        analysis.summary = summaryParts.join('\n\n');
      } else {
        analysis.summary = 'AI 分析完成，但摘要格式異常';
      }
    }

    if (!analysis.recommendations) {
      analysis.recommendations = ['請檢查系統安全設定'];
    } else if (!Array.isArray(analysis.recommendations)) {
      // 如果 recommendations 不是陣列，轉換為陣列
      analysis.recommendations = [String(analysis.recommendations)];
    }

    // 安全地處理 recommendations 陣列
    if (analysis.recommendations && Array.isArray(analysis.recommendations)) {
      analysis.recommendations = analysis.recommendations
        .map((rec) => {
          // 確保每個建議都是字串類型
          if (typeof rec === 'string') {
            return rec
              .replace(/^\*\*|\*\*$/g, '')
              .replace(/^["']|["']$/g, '')
              .replace(/^•\s*/, '')
              .trim();
          } else if (typeof rec === 'object' && rec !== null) {
            // 如果是物件，嘗試轉換為字串
            return JSON.stringify(rec);
          } else {
            // 其他類型轉為字串
            return String(rec || '').trim();
          }
        })
        .filter((rec) => rec.length > 0); // 過濾空字串
    } else {
      // 如果recommendations不是陣列，轉換為陣列
      analysis.recommendations = [
        String(analysis.recommendations || '請檢查系統安全設定'),
      ];
    }

    analysis.metadata = {
      analysisId: analysisId,
      timestamp: currentTime,
      model: useModel,
      isAIGenerated: true,
    };
    console.log('✅ AI 分析成功。');
    return analysis;
  } catch (parseError) {
    console.error('JSON 解析錯誤:', parseError);
    console.log('原始回應內容 (前200字元):', text.substring(0, 200));

    // 嘗試從自然語言回應中提取有用信息
    let summary = text;
    let recommendations = [];

    // 如果回應太長，截取前500字元作為摘要
    if (summary.length > 500) {
      summary = `${summary.substring(0, 500)}...`;
    }

    // 嘗試提取建議（尋找列表格式的文字）
    const suggestionPatterns = ['建議', '建議', '應該', '需要', '可以', '推薦'];
    const lines = text.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.length > 0) {
        // 檢查是否包含建議關鍵字
        for (const pattern of suggestionPatterns) {
          if (trimmedLine.includes(pattern) && trimmedLine.length > 10) {
            recommendations.push(trimmedLine);
            break;
          }
        }
        // 檢查是否是列表項目
        if (
          (trimmedLine.startsWith('-') ||
            trimmedLine.startsWith('•') ||
            trimmedLine.startsWith('*')) &&
          trimmedLine.length > 5
        ) {
          recommendations.push(trimmedLine.replace(/^[-•*]\s*/, ''));
        }
      }
    }

    // 如果沒有找到建議，使用預設建議
    if (recommendations.length === 0) {
      recommendations = [
        '檢查防火牆設定是否適當',
        '監控異常流量模式',
        '定期更新安全規則',
        '加強訪問控制機制',
      ];
    }

    return {
      summary: summary,
      recommendations: recommendations.slice(0, 10), // 最多10個建議
      metadata: {
        analysisId: analysisId,
        timestamp: currentTime,
        model: useModel,
        isAIGenerated: true,
        parseError: true,
        originalResponse: text.substring(0, 100), // 保留原始回應的前100字元供調試
      },
    };
  }
}

// 將 ELK 資料轉換為現有日誌格式
function convertELKToLogEntry(elkRecord) {
  return {
    timestamp: elkRecord['@timestamp'],
    EdgeStartTimestamp: elkRecord.EdgeStartTimestamp || elkRecord['@timestamp'], // 使用 EdgeStartTimestamp 或 @timestamp
    ClientIP: elkRecord.ClientIP,
    ClientCountry: elkRecord.ClientCountry,
    ClientASN: elkRecord.ClientASN,
    EdgeRequestHost: elkRecord.EdgeRequestHost, // Cloudflare 實際處理的域名
    ClientRequestHost: elkRecord.ClientRequestHost, // 客戶端聲稱的域名
    ClientRequestURI: elkRecord.ClientRequestURI,
    EdgeResponseBytes: elkRecord.EdgeResponseBytes || 0,
    ClientRequestBytes: elkRecord.ClientRequestBytes || 0, // 新增：客戶端請求位元組數
    EdgeResponseStatus: elkRecord.EdgeResponseStatus,
    SecurityAction: elkRecord.SecurityAction,
    SecurityRuleDescription: elkRecord.SecurityRuleDescription,
    WAFAttackScore: elkRecord.WAFAttackScore,
    WAFSQLiAttackScore: elkRecord.WAFSQLiAttackScore,
    WAFXSSAttackScore: elkRecord.WAFXSSAttackScore,
    WAFRCEAttackScore: elkRecord.WAFRCEAttackScore, // 添加 RCE 攻擊分數
    ClientRequestUserAgent: elkRecord.ClientRequestUserAgent,
    RayID: elkRecord.RayID,
  };
}

// === 新增 ELK 相關 API 端點 ===

// ELK 連接測試端點
// @deprecated - 請使用 /api/cloudflare/test-connection 或 /api/f5/test-connection
app.get('/api/elk/test-connection', async (_req, res) => {
  console.warn(
    '⚠️ 廢棄端點警告: /api/elk/test-connection 已廢棄，請使用產品專屬端點',
  );
  try {
    const isConnected = await elkMCPClient.testConnection();
    res.json({
      connected: isConnected,
      message: isConnected ? 'ELK MCP 連接正常' : 'ELK MCP 連接失敗',
      deprecationWarning:
        '此端點已廢棄，請使用 /api/cloudflare/test-connection 或 /api/f5/test-connection',
    });
  } catch (error) {
    res.status(500).json({
      connected: false,
      error: error.message,
      deprecationWarning: '此端點已廢棄，請使用產品專屬端點',
    });
  }
});

// ✅ 已移除廢棄的 /api/elk/stats 端點
// 原因: 使用了不存在的 elasticsearch_query MCP 工具
// 替代方案: 使用產品專屬的 WAF 分析端點:
//   - POST /api/cloudflare/analyze-waf-risks
//   - POST /api/f5/analyze-waf-risks

// 調試端點：檢查時間分組問題
app.get('/api/debug/time-grouping', async (_req, res) => {
  try {
    console.log('🔍 開始調試時間分組...');

    // 查詢少量實際數據
    const elkData = await elkMCPClient.queryElasticsearch('auto');

    if (!elkData.hits || elkData.hits.length === 0) {
      return res.json({ error: '沒有找到數據' });
    }

    // 轉換前10筆數據
    const logEntries = elkData.hits
      .slice(0, 10)
      .map((hit) => convertELKToLogEntry(hit.source));

    // 分析時間分組
    const results = [];
    const groupInterval = 24 * 60 * 60 * 1000; // 1天

    logEntries.forEach((entry, i) => {
      const timestamp = new Date(entry.EdgeStartTimestamp || entry.timestamp);
      const timeKey =
        Math.floor(timestamp.getTime() / groupInterval) * groupInterval;
      const requestBytes = parseInt(entry.ClientRequestBytes, 10) || 0;

      results.push({
        index: i,
        originalTimestamp: entry.EdgeStartTimestamp,
        parsedTimestamp: timestamp.toISOString(),
        timeKey: new Date(timeKey).toISOString(),
        clientRequestBytes: requestBytes,
        clientIP: entry.ClientIP,
      });
    });

    res.json({
      message: '時間分組調試',
      totalRecords: elkData.hits.length,
      sampleData: results,
      groupInterval: `${groupInterval}ms (${groupInterval / (24 * 60 * 60 * 1000)}天)`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @deprecated - 請使用 /api/cloudflare/analyze-waf-risks
// 新增：Cloudflare WAF 風險分析 API（向後兼容）
app.post('/api/analyze-waf-risks-cloudflare', async (req, res, next) => {
  console.warn(
    '⚠️ 廢棄端點警告: /api/analyze-waf-risks-cloudflare 已廢棄，請使用 /api/cloudflare/analyze-waf-risks',
  );
  // 重定向到新端點
  req.url = '/api/cloudflare/analyze-waf-risks';
  return cloudflareRoutes(req, res, next);
});

// === ELK 連接管理 ===

// ELK 連接預熱（可選）
async function warmupELKConnection() {
  try {
    console.log('🔥 開始 ELK 連接預熱...');

    // 檢查是否配置了ELK
    if (
      !ELK_CONFIG.mcp.serverUrl ||
      ELK_CONFIG.mcp.serverUrl.includes('localhost')
    ) {
      console.log('⚠️ 跳過 ELK 預熱：未配置生產環境 ELK 服務器');
      return;
    }

    // 嘗試建立連接（不強制要求成功）
    const connected = await elkMCPClient.testConnection();
    if (connected) {
      console.log('✅ ELK 連接預熱成功');
    } else {
      console.log('⚠️ ELK 連接預熱失敗，但不影響系統啟動');
    }
  } catch (error) {
    console.log('⚠️ ELK 連接預熱失敗:', error.message);
    console.log('💡 系統將在首次使用時建立 ELK 連接');
  }
}

// 啟動服務
const port = 8081;
app.listen(port, async () => {
  console.log(`🚀 Backend API 已啟動: http://localhost:${port}`);
  console.log('📊 DDoS 攻擊圖表分析系統已就緒');

  // 異步執行ELK預熱（不阻塞啟動）
  setTimeout(() => {
    warmupELKConnection().catch((err) => {
      console.log('ELK預熱過程出錯（可忽略）:', err.message);
    });
  }, 1000); // 等待1秒後開始預熱
});
