#!/bin/bash

# 前端環境配置設置腳本

echo "🔧 開始配置前端環境變數..."
echo ""

# 取得當前目錄
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ENV_FILE="$SCRIPT_DIR/.env.local"

# 檢查是否已存在 .env.local
if [ -f "$ENV_FILE" ]; then
    echo "⚠️  發現已存在的 .env.local 文件"
    echo "當前配置："
    cat "$ENV_FILE"
    echo ""
    read -p "是否要覆蓋現有配置？(y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 取消操作"
        exit 1
    fi
    # 備份現有文件
    cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    echo "✅ 已備份現有配置"
fi

# 詢問用戶選擇環境
echo "請選擇部署環境："
echo "1) 本地開發 (localhost)"
echo "2) 自定義 URL"
read -p "請輸入選項 (1-2): " choice

case $choice in
    1)
        AUTH_SERVICE_URL="http://localhost:3001"
        BACKEND_SERVICE_URL="http://localhost:8081"
        KIBANA_URL="https://localhost:5601"
        DIFY_URL="http://localhost"
        ;;
    2)
        read -p "請輸入 Auth Service URL (認證服務，預設 http://localhost:3001): " AUTH_SERVICE_URL
        AUTH_SERVICE_URL=${AUTH_SERVICE_URL:-http://localhost:3001}
        
        read -p "請輸入 Backend Service URL (後端 API，預設 http://localhost:8081): " BACKEND_SERVICE_URL
        BACKEND_SERVICE_URL=${BACKEND_SERVICE_URL:-http://localhost:8081}
        
        read -p "請輸入 Kibana URL (ELK 監控，預設 https://localhost:5601): " KIBANA_URL
        KIBANA_URL=${KIBANA_URL:-https://localhost:5601}
        
        read -p "請輸入 Dify URL (AI Workflow，預設 http://localhost): " DIFY_URL
        DIFY_URL=${DIFY_URL:-http://localhost}
        ;;
    *)
        echo "❌ 無效的選項"
        exit 1
        ;;
esac

# 詢問 Kibana Space
read -p "請輸入 Kibana Space (預設 default): " KIBANA_SPACE
KIBANA_SPACE=${KIBANA_SPACE:-default}

# 詢問 Dify 登入資訊
read -p "請輸入 Dify 登入 Email (可選): " DIFY_EMAIL
read -p "請輸入 Dify 登入密碼 (可選): " DIFY_PWD

# 創建 .env.local 文件
cat > "$ENV_FILE" << EOF
# 前端環境變數配置
# 此文件由 setup-env.sh 自動生成於 $(date)

NODE_ENV=production

# ============================================
# 核心服務配置（4 組主要服務）
# ============================================

# Auth Service - 認證服務
NEXT_PUBLIC_AUTH_SERVICE_URL=$AUTH_SERVICE_URL

# Backend Service - 後端 API 服務
NEXT_PUBLIC_BACKEND_SERVICE_URL=$BACKEND_SERVICE_URL

# Kibana - ELK 監控服務
NEXT_PUBLIC_KIBANA_URL=$KIBANA_URL
NEXT_PUBLIC_KIBANA_SPACE=$KIBANA_SPACE

# Dify - AI Workflow 服務
NEXT_PUBLIC_DIFY_URL=$DIFY_URL
NEXT_PUBLIC_DIFY_WORKFLOW_URL=${DIFY_URL}/app/YOUR_APP_ID/workflow
NEXT_PUBLIC_KB_RAG_URL=${DIFY_URL}/datasets
NEXT_PUBLIC_DIFY_EMAIL=$DIFY_EMAIL
NEXT_PUBLIC_DIFY_PWD=$DIFY_PWD

# ============================================
# UI 載入配置（單位：毫秒）
# ============================================
NEXT_PUBLIC_LOADING_TIMEOUT=20000
NEXT_PUBLIC_LOADING_DELAY=1500
NEXT_PUBLIC_INITIAL_LOADING_DELAY=2000
NEXT_PUBLIC_IFRAME_LOADING_DELAY=1000
NEXT_PUBLIC_IFRAME_LOADING_TIMEOUT=10000
EOF

echo ""
echo "✅ 環境配置已成功創建！"
echo ""
echo "📝 配置內容："
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat "$ENV_FILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  重要提醒："
echo "1. 請重新啟動前端應用以使配置生效"
echo "2. .env.local 文件不會被 Git 追蹤（這是正常的）"
echo "3. 如需修改配置，可以重新運行此腳本或手動編輯 .env.local"
echo "4. 請記得更新 NEXT_PUBLIC_DIFY_WORKFLOW_URL 中的 YOUR_APP_ID"
echo ""
echo "🚀 啟動命令："
echo "   開發模式: npm run dev"
echo "   生產模式: npm run build && npm run start"
echo ""
