// backend/routes/cloudflare.routes.js
// Cloudflare 產品專屬 API 路由

require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// vLLM configuration
const LLM_SERVICE_URL = process.env.LLM_SERVICE_URL;

// 根據環境變數決定使用本地服務 (vLLM) 或雲端服務 (Gemini)
const USE_LOCAL_SERVICE = process.env.USE_LOCAL_SERVICE === 'true';
const AI_PROVIDER = USE_LOCAL_SERVICE ? 'vllm' : 'gemini';

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { generateOpenAIRequestBody, parseOpenAIResponse } = require('../utils/openaiHelper');
const { elkMCPClient } = require('../services/elkMCPClient');
const CloudflareWAFRiskService = require('../services/products/cloudflareWAFRiskService');
// const {
// 	CLOUDFLARE_FIELD_MAPPING,
// } = require('../config/products/cloudflare/cloudflareFieldMapping');
const cloudflareELKConfig = require('../config/products/cloudflare/cloudflareELKConfig');

// 測試 Cloudflare ELK 連接
router.get('/test-connection', async (_, res) => {
	try {
		const isConnected = await elkMCPClient.testConnection();
		res.json({
			connected: isConnected,
			product: 'Cloudflare',
			index: cloudflareELKConfig.index,
			message: isConnected
				? 'Cloudflare ELK 連接正常'
				: 'Cloudflare ELK 連接失敗',
		});
	} catch (error) {
		res.status(500).json({
			connected: false,
			product: 'Cloudflare',
			error: error.message,
		});
	}
});

// ✅ 已移除 Cloudflare stats 端點
// 原因: getSecurityStats() 使用了不存在的 elasticsearch_query MCP 工具
// 替代方案: 使用 POST /api/cloudflare/analyze-waf-risks 進行完整的 WAF 風險分析

// Cloudflare WAF 風險分析 API（主要端點）
router.post('/analyze-waf-risks', async (req, res) => {
	try {
		// 從環境變數決定 AI 提供者，不再從請求參數讀取
		const aiProvider = AI_PROVIDER;

		// 根據 AI 提供者設定預設模型
		const defaultModel =
			aiProvider === 'vllm'
				? 'Qwen/Qwen2.5-7B-Instruct-AWQ' // vLLM 預設模型
				: 'gemini-2.0-flash-exp';

		const { model = defaultModel, timeRange = '24h' } = req.body;

		// 如果使用 Gemini，需要 API Key
		if (aiProvider === 'gemini' && !GEMINI_API_KEY) {
			return res.status(400).json({
				error: '請在 .env 中設定 GEMINI_API_KEY',
				product: 'Cloudflare',
				hint: '或設定 USE_LOCAL_SERVICE=true 使用 vLLM',
			});
		}

		// 如果使用 vLLM，檢查 Service URL
		if (aiProvider === 'vllm' && !LLM_SERVICE_URL) {
			return res.status(400).json({
				error: '請在 .env 中設定 LLM_SERVICE_URL',
				product: 'Cloudflare',
				hint: '例如: http://localhost:8000/v1',
			});
		}

		console.log(`\n🔍 ===== 開始 Cloudflare WAF 風險分析 API =====`);
		console.log(`📅 時間範圍: ${timeRange}`);
		console.log(
			`🤖 AI 提供者: ${aiProvider} (由環境變數 USE_LOCAL_SERVICE=${USE_LOCAL_SERVICE} 決定)`,
		);
		console.log(`🤖 AI 模型: ${model}`);
		console.log(`📊 索引: ${cloudflareELKConfig.index}`);

		// Step 1: 建立 CloudflareWAFRiskService 實例
		const wafService = new CloudflareWAFRiskService();

		// Step 2: 透過 ELK MCP 分析 Cloudflare WAF 資料
		console.log('\n⭐ Step 1: 透過 ELK MCP 分析 Cloudflare 日誌...');
		const analysisData = await wafService.analyzeCloudflareWAF(timeRange);

		console.log(`✅ 分析完成，總事件數: ${analysisData.totalEvents}`);

		// Step 3: 生成 AI Prompt
		console.log('\n⭐ Step 2: 生成 AI 分析 Prompt...');
		const aiPrompt = wafService.generateAIPrompt(analysisData);
		console.log(`✅ Prompt 長度: ${aiPrompt.length} 字元`);

		// Step 4: 呼叫 AI 進行分析（支援 Gemini 和 vLLM）
		console.log(
			`\n⭐ Step 3: 呼叫 ${aiProvider === 'vllm' ? 'vLLM' : 'Gemini'} AI 分析...`,
		);

		let responseText;

		if (aiProvider === 'vllm') {
			// 使用 vLLM (OpenAI Compatible)
			console.log(`� vLLM URL: ${LLM_SERVICE_URL}`);
			console.log(`� vLLM Model: ${model}`);
			console.log(`📏 Prompt 長度: ${aiPrompt.length} 字元`);

			// 設定超時控制器（5 分鐘超時）
			const controller = new AbortController();
			const timeoutId = setTimeout(() => {
				controller.abort();
				console.error('❌ vLLM 請求超時（5 分鐘）');
			}, 300000); // 5 分鐘

			try {
				const startTime = Date.now();
				console.log('⏱️ 開始呼叫 vLLM API...');

				// 使用 Helper 生成 Request Body
				const requestBody = generateOpenAIRequestBody({
					model,
					systemPrompt: '你是一位資深的網路安全分析專家，專精於 Cloudflare WAF 日誌分析和威脅識別。',
					userPrompt: aiPrompt,
					options: { temperature: 0.7 }
				});

				const vllmResponse = await fetch(`${LLM_SERVICE_URL}/chat/completions`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						// 如果 vLLM 需要 API Key，可以在這裡加入
						// 'Authorization': `Bearer ${process.env.VLLM_API_KEY || 'EMPTY'}`
					},
					body: JSON.stringify(requestBody),
					signal: controller.signal,
				});

				clearTimeout(timeoutId);
				const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
				console.log(`⏱️ vLLM API 回應時間: ${elapsedTime} 秒`);

				if (!vllmResponse.ok) {
					const errorText = await vllmResponse.text();
					console.error(`❌ vLLM API 錯誤: ${errorText}`);
					throw new Error(`vLLM API Error: ${vllmResponse.status} ${errorText}`);
				}

				const rawResponse = await vllmResponse.text();
				let vllmData;
				try {
					vllmData = JSON.parse(rawResponse);
				} catch (jsonError) {
					console.error('❌ vLLM 回應非 JSON 格式:', rawResponse);
					throw new Error(`vLLM API 回應解析失敗: ${jsonError.message}`);
				}

				// 使用 Helper 解析回應
				try {
					responseText = parseOpenAIResponse(vllmData);
				} catch (e) {
					console.warn('⚠️ vLLM 返回非預期格式', vllmData);
					throw e;
				}
				console.log(`✅ vLLM 回應長度: ${responseText.length} 字元`);

			} catch (fetchError) {
				clearTimeout(timeoutId);

				if (fetchError.name === 'AbortError') {
					console.error('❌ vLLM 請求超時（5 分鐘），使用 Fallback 資料');
					// 超時時使用 fallback
					const aiAnalysisFallback =
						wafService.generateFallbackRisks(analysisData);
					return res.json({
						success: true,
						product: 'Cloudflare',
						risks: aiAnalysisFallback.risks || [],
						metadata: {
							totalEvents: analysisData.totalEvents,
							timeRange: analysisData.timeRange,
							aiProvider: 'fallback',
							model: 'N/A',
							analysisTimestamp: new Date().toISOString(),
							note: 'AI 分析超時，使用預設風險資料',
						},
					});
				}

				throw fetchError;
			}
		} else {
			// 使用 Gemini
			const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
			const geminiModel = genAI.getGenerativeModel({
				model: model || 'gemini-2.0-flash-exp',
			});
			const result = await geminiModel.generateContent(aiPrompt);
			responseText = result.response.text();
			console.log(`✅ Gemini 回應長度: ${responseText.length} 字元`);
		}

		// Step 5: 解析 AI 回應（JSON 格式）
		console.log('\n⭐ Step 4: 解析 AI 回應...');
		let aiAnalysis;

		try {
			// 嘗試直接解析 JSON
			aiAnalysis = JSON.parse(responseText);
			console.log(
				`✅ 成功解析 JSON，風險數量: ${aiAnalysis.risks?.length || 0}`,
			);
		} catch (_parseError) {
			console.log('⚠️ JSON 解析失敗，嘗試提取 JSON...');

			// 嘗試從 markdown code block 中提取
			const jsonMatch =
				responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
				responseText.match(/```\s*([\s\S]*?)\s*```/);

			if (jsonMatch) {
				try {
					aiAnalysis = JSON.parse(jsonMatch[1]);
					console.log(
						`✅ 從 markdown 中成功解析，風險數量: ${aiAnalysis.risks?.length || 0}`,
					);
				} catch (_e) {
					console.log('❌ 無法解析 AI 回應，使用 Fallback 資料');
					aiAnalysis = wafService.generateFallbackRisks(analysisData);
				}
			} else {
				console.log('❌ 無法找到 JSON 格式，使用 Fallback 資料');
				aiAnalysis = wafService.generateFallbackRisks(analysisData);
			}
		}

		console.log('\n✅ ===== Cloudflare WAF 風險分析完成 =====\n');

		// 返回結果
		res.json({
			success: true,
			product: 'Cloudflare',
			risks: aiAnalysis.risks || [],
			metadata: {
				totalEvents: analysisData.totalEvents,
				timeRange: analysisData.timeRange,
				aiProvider,
				model,
				analysisTimestamp: new Date().toISOString(),
			},
		});
	} catch (error) {
		console.error('❌ Cloudflare WAF 風險分析失敗:', error);
		res.status(500).json({
			success: false,
			product: 'Cloudflare',
			error: 'WAF 風險分析失敗',
			details: error.message,
		});
	}
});

// 取得 Cloudflare 操作指引
router.post('/get-operation-guide', async (req, res) => {
	try {
		const { recommendationTitle, category } = req.body;

		console.log(`\n📚 ===== 取得 Cloudflare 操作指引 =====`);
		console.log(`📝 建議標題: ${recommendationTitle}`);
		console.log(`🏷️ 分類: ${category || '未提供'}`);

		// 載入 Cloudflare 操作指引模組
		const {
			CLOUDFLARE_OPERATION_GUIDES,
			mapRecommendationToGuideId,
		} = require('../config/products/cloudflare/cloudflareOperationGuides');

		// 根據建議標題或分類，找到對應的操作指引 ID
		const guideId = mapRecommendationToGuideId(recommendationTitle, category);

		if (!guideId) {
			console.log(`⚠️ 找不到對應的操作指引`);
			return res.json({
				success: false,
				message: '找不到對應的操作指引',
				product: 'Cloudflare',
			});
		}

		console.log(`✅ 找到對應的操作指引 ID: ${guideId}`);

		// 取得操作指引
		const guide = CLOUDFLARE_OPERATION_GUIDES[guideId];

		if (!guide) {
			console.log(`❌ 操作指引不存在: ${guideId}`);
			return res.json({
				success: false,
				message: '操作指引不存在',
				product: 'Cloudflare',
			});
		}

		console.log(`✅ 操作指引載入成功`);
		console.log(`   標題: ${guide.title}`);
		console.log(`   步驟數量: ${guide.steps.length}`);
		console.log(`   預估時間: ${guide.estimatedTime}`);
		console.log(`\n✅ ===== Cloudflare 操作指引取得完成 =====\n`);

		res.json({
			success: true,
			product: 'Cloudflare',
			guide: guide,
		});
	} catch (error) {
		console.error('❌ 取得 Cloudflare 操作指引失敗:', error);
		res.status(500).json({
			success: false,
			product: 'Cloudflare',
			error: '取得操作指引失敗',
			details: error.message,
		});
	}
});

module.exports = router;
