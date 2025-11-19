// 測試移除 elasticsearch_query 工具後的系統功能
// 驗證所有依賴 search 工具的功能是否正常運作

require('dotenv').config();
const { elkMCPClient } = require('../services/elkMCPClient');
const CloudflareWAFRiskService = require('../services/products/cloudflareWAFRiskService');
const F5WAFRiskService = require('../services/products/f5WAFRiskService');
const cloudflareELKConfig = require('../config/products/cloudflare/cloudflareELKConfig');
const f5ELKConfig = require('../config/products/f5/f5ELKConfig');
const { CLOUDFLARE_FIELD_MAPPING } = require('../config/products/cloudflare/cloudflareFieldMapping');

async function runTests() {
  console.log('🧪 ===== 開始系統功能測試 =====\n');
  
  let passedTests = 0;
  let failedTests = 0;
  
  // ==========================================
  // 測試 1: 驗證 MCP 連接和工具列表
  // ==========================================
  console.log('📝 測試 1: 驗證 MCP 連接和可用工具');
  console.log('─────────────────────────────────────');
  try {
    await elkMCPClient.connect();
    console.log('✅ MCP 連接成功');
    
    const tools = await elkMCPClient.listTools();
    console.log('可用的 MCP 工具:');
    if (tools.tools) {
      tools.tools.forEach(tool => {
        console.log(`   - ${tool.name}: ${tool.description || 'No description'}`);
      });
    }
    
    // 驗證 elasticsearch_query 不在列表中
    const hasElasticsearchQuery = tools.tools?.some(t => t.name === 'elasticsearch_query');
    if (hasElasticsearchQuery) {
      console.log('⚠️  警告: elasticsearch_query 工具存在於列表中');
    } else {
      console.log('✅ 確認: elasticsearch_query 工具不存在（符合預期）');
    }
    
    // 驗證 search 工具存在
    const hasSearch = tools.tools?.some(t => t.name === 'search');
    if (hasSearch) {
      console.log('✅ 確認: search 工具存在且可用');
    } else {
      console.log('❌ 錯誤: search 工具不存在');
      throw new Error('search 工具不可用');
    }
    
    passedTests++;
  } catch (error) {
    console.log('❌ 測試 1 失敗:', error.message);
    failedTests++;
  }
  
  console.log('\n');
  
  // ==========================================
  // 測試 2: 測試 queryElasticsearch (使用 search 工具)
  // ==========================================
  console.log('📝 測試 2: 測試 queryElasticsearch 方法');
  console.log('─────────────────────────────────────');
  try {
    const result = await elkMCPClient.queryElasticsearch('1h', {
      indexPattern: cloudflareELKConfig.index,
      fieldMapping: CLOUDFLARE_FIELD_MAPPING
    });
    
    console.log(`✅ 查詢成功: 找到 ${result.hits.length} 筆記錄`);
    console.log(`   總數: ${result.total}`);
    
    if (result.hits.length > 0) {
      const firstHit = result.hits[0];
      console.log(`   第一筆記錄 ID: ${firstHit.id}`);
      console.log(`   時間戳記: ${firstHit.timestamp}`);
    }
    
    passedTests++;
  } catch (error) {
    console.log('❌ 測試 2 失敗:', error.message);
    failedTests++;
  }
  
  console.log('\n');
  
  // ==========================================
  // 測試 3: 測試 Cloudflare WAF 風險分析
  // ==========================================
  console.log('📝 測試 3: 測試 Cloudflare WAF 風險分析');
  console.log('─────────────────────────────────────');
  try {
    const wafService = new CloudflareWAFRiskService();
    const analysisData = await wafService.analyzeCloudflareWAF('1h');
    
    console.log(`✅ Cloudflare WAF 分析成功`);
    console.log(`   總事件數: ${analysisData.totalEvents}`);
    console.log(`   SQL 注入: ${analysisData.sqlInjection.count} 次`);
    console.log(`   XSS 攻擊: ${analysisData.xssAttacks.count} 次`);
    console.log(`   RCE 攻擊: ${analysisData.rceAttacks.count} 次`);
    console.log(`   惡意機器人: ${analysisData.botTraffic.count} 次`);
    console.log(`   受影響資產: ${analysisData.assetAnalysis.totalAssets} 個`);
    
    passedTests++;
  } catch (error) {
    console.log('❌ 測試 3 失敗:', error.message);
    failedTests++;
  }
  
  console.log('\n');
  
  // ==========================================
  // 測試 4: 測試 F5 WAF 風險分析
  // ==========================================
  console.log('📝 測試 4: 測試 F5 WAF 風險分析');
  console.log('─────────────────────────────────────');
  try {
    const f5Service = new F5WAFRiskService();
    const analysisData = await f5Service.analyzeF5WAF('1h');
    
    console.log(`✅ F5 WAF 分析成功`);
    console.log(`   總事件數: ${analysisData.totalEvents}`);
    console.log(`   SQL 注入: ${analysisData.sqlInjection.count} 次`);
    console.log(`   XSS 攻擊: ${analysisData.xssAttacks.count} 次`);
    console.log(`   命令執行: ${analysisData.commandExecution.count} 次`);
    console.log(`   惡意機器人: ${analysisData.botTraffic.count} 次`);
    console.log(`   受影響資產: ${analysisData.assetAnalysis.totalAssets} 個`);
    
    passedTests++;
  } catch (error) {
    console.log('❌ 測試 4 失敗:', error.message);
    failedTests++;
  }
  
  console.log('\n');
  
  // ==========================================
  // 測試 5: 驗證已移除的方法不存在
  // ==========================================
  console.log('📝 測試 5: 驗證 getSecurityStats 方法已移除');
  console.log('─────────────────────────────────────');
  try {
    if (typeof elkMCPClient.getSecurityStats === 'function') {
      console.log('❌ 錯誤: getSecurityStats 方法仍然存在');
      failedTests++;
    } else {
      console.log('✅ 確認: getSecurityStats 方法已成功移除');
      passedTests++;
    }
  } catch (error) {
    console.log('❌ 測試 5 失敗:', error.message);
    failedTests++;
  }
  
  console.log('\n');
  
  // ==========================================
  // 測試總結
  // ==========================================
  console.log('🎯 ===== 測試總結 =====');
  console.log(`總測試數: ${passedTests + failedTests}`);
  console.log(`✅ 通過: ${passedTests}`);
  console.log(`❌ 失敗: ${failedTests}`);
  
  if (failedTests === 0) {
    console.log('\n🎉 所有測試通過！系統功能正常運作。');
  } else {
    console.log('\n⚠️  部分測試失敗，請檢查上述錯誤訊息。');
  }
  
  // 清理連接
  await elkMCPClient.disconnect();
  
  process.exit(failedTests > 0 ? 1 : 0);
}

// 執行測試
runTests().catch(error => {
  console.error('💥 測試執行失敗:', error);
  process.exit(1);
});


