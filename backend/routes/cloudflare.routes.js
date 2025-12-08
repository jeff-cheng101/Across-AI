// backend/routes/cloudflare.routes.js
// Cloudflare 產品專屬 API 路由

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { elkMCPClient } = require('../services/elkMCPClient');
const CloudflareWAFRiskService = require('../services/products/cloudflareWAFRiskService');
const cloudflareELKConfig = require('../config/products/cloudflare/cloudflareELKConfig');
const {
	generateOpenAIRequestBody,
	parseOpenAIResponse,
} = require('../utils/openaiHelper');

const { LLM_API_KEY, LLM_PROVIDER, LLM_SERVICE_URL, LLM_MODEL } = process.env;
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
		const llmProvider = LLM_PROVIDER;

		// 根據 AI 提供者設定預設模型
		const DEFAULT_MODELS = {
			ollama: 'llama3.3:70b',
			vllm: 'meta-llama/Meta-Llama-3-70B-Instruct',
			gemini: 'gemini-2.0-flash-exp',
		};

		const defaultModel = DEFAULT_MODELS[llmProvider] || DEFAULT_MODELS.gemini;

		const { model = defaultModel, timeRange = '24h' } = req.body;

		// 如果使用 Gemini，需要 API Key
		if (llmProvider === 'gemini' && !LLM_API_KEY) {
			return res.status(400).json({
				error: '請在 .env 中設定 GEMINI_API_KEY',
				product: 'Cloudflare',
				hint: '或設定 AI_PROVIDER=ollama 使用 Ollama',
			});
		}

		console.log(`\n🔍 ===== 開始 Cloudflare WAF 風險分析 API =====`);
		console.log(`📅 時間範圍: ${timeRange}`);
		console.log(`🤖 AI 提供者: ${llmProvider}`);
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

		// Step 4: 呼叫 AI 進行分析（支援 Gemini 和 Ollama）
		console.log(
			`\n⭐ Step 3: 呼叫 ${
				llmProvider === 'ollama'
					? 'Ollama'
					: llmProvider === 'vllm'
						? 'vLLM'
						: 'Gemini'
			} AI 分析...`,
		);

		let responseText;

		if (llmProvider === 'ollama') {
			// 使用 Ollama（增強版：支援超時和錯誤處理
			const ollamaUrl = LLM_SERVICE_URL || 'http://localhost:11434';
			const ollamaModel = model || 'llama3.3:70b';

			console.log(`🦙 Ollama URL: ${ollamaUrl}`);
			console.log(`🦙 Ollama 模型: ${ollamaModel}`);
			console.log(`📏 Prompt 長度: ${aiPrompt.length} 字元`);

			// 檢查 Prompt 長度（警告但不阻止）
			if (aiPrompt.length > 50000) {
				console.warn(
					`⚠️ Prompt 非常長 (${aiPrompt.length} 字元)，可能需要較長處理時間`,
				);
			}

			// 設定超時控制器（5 分鐘超時）
			const controller = new AbortController();
			const timeoutId = setTimeout(() => {
				controller.abort();
				console.error('❌ Ollama 請求超時（5 分鐘）');
			}, 300000); // 5 分鐘

			try {
				const startTime = Date.now();
				console.log('⏱️ 開始呼叫 Ollama API...');

				const ollamaResponse = await fetch(`${ollamaUrl}/api/generate`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						model: ollamaModel,
						prompt: aiPrompt,
						stream: false,
						options: {
							temperature: 0.7,
							num_predict: 8192, // 增加到 8192 tokens
							num_ctx: 8192, // 增加 context window
							top_k: 40,
							top_p: 0.9,
							repeat_penalty: 1.1,
						},
					}),
					signal: controller.signal,
				});

				clearTimeout(timeoutId);
				const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
				console.log(`⏱️ Ollama API 回應時間: ${elapsedTime} 秒`);

				if (!ollamaResponse.ok) {
					// 獲取詳細錯誤訊息
					let errorDetails = '';
					try {
						const errorData = await ollamaResponse.json();
						errorDetails = errorData.error || JSON.stringify(errorData);
					} catch (_e) {
						errorDetails = await ollamaResponse.text();
					}

					console.error(`❌ Ollama API 錯誤詳情: ${errorDetails}`);
					throw new Error(
						`Ollama API 錯誤 (${ollamaResponse.status}): ${errorDetails}`,
					);
				}

				const ollamaData = await ollamaResponse.json();
				responseText = ollamaData.response;
				console.log(`✅ Ollama 回應長度: ${responseText.length} 字元`);

				// 檢查回應是否為空
				if (!responseText || responseText.trim().length === 0) {
					console.warn('⚠️ Ollama 返回空回應，使用 Fallback');
					throw new Error('Ollama 返回空回應');
				}
			} catch (fetchError) {
				clearTimeout(timeoutId);

				if (fetchError.name === 'AbortError') {
					console.error('❌ Ollama 請求超時（5 分鐘），使用 Fallback 資料');
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
		} else if (llmProvider === 'vllm') {
			// 使用 vLLM (OpenAI Compatible)
			const vllmUrl =
				LLM_SERVICE_URL || 'http://localhost:8000/v1/chat/completions';

			console.log(`🚀 vLLM URL: ${vllmUrl}`);
			console.log(`🚀 vLLM 模型: ${LLM_MODEL}`);
			console.log(`📏 Prompt 長度: ${aiPrompt.length} 字元`);

			try {
				const startTime = Date.now();
				console.log('⏱️ 開始呼叫 vLLM API...');

				const requestBody = generateOpenAIRequestBody({
					model: LLM_MODEL,
					systemPrompt:
						'你是個資安專家，專精於分析 Cloudflare WAF 日誌和威脅識別。請根據提供的日誌資料，分析潛在的安全風險。',
					userPrompt: aiPrompt,
					options: {
						temperature: 0.2,
						max_tokens: 8192,
					},
				});

				const vllmResponse = await fetch(vllmUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer EMPTY',
					},
					body: JSON.stringify(requestBody),
				});

				const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
				console.log(`⏱️ vLLM API 回應時間: ${elapsedTime} 秒`);

				if (!vllmResponse.ok) {
					const errorText = await vllmResponse.text();
					console.error(
						`❌ vLLM API 錯誤: ${vllmResponse.status} - ${errorText}`,
					);
					throw new Error(`vLLM API Error: ${vllmResponse.status}`);
				}

				const responseData = await vllmResponse.json();
				responseText = parseOpenAIResponse(responseData);
				console.log(`✅ vLLM 回應長度: ${responseText.length} 字元`);
			} catch (error) {
				console.error('❌ vLLM 呼叫失敗:', error);
				throw error;
			}
		} else {
			// 使用 Gemini
			const genAI = new GoogleGenerativeAI(LLM_API_KEY);
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
				aiProvider: llmProvider,
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
