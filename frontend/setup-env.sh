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
echo "1) 本地開發 (http://localhost:8080)"
echo "2) 遠端部署 (https://twister5poc.phison.com:3000)"
echo "3) 自定義 URL"
read -p "請輸入選項 (1-3): " choice

case $choice in
    1)
        API_URL="http://localhost:8080"
        ;;
    2)
        API_URL="https://twister5poc.phison.com:3000"
        ;;
    3)
        read -p "請輸入自定義 API URL: " API_URL
        ;;
    *)
        echo "❌ 無效的選項"
        exit 1
        ;;
esac

# 創建 .env.local 文件
cat > "$ENV_FILE" << EOF
# API 基礎 URL 配置
# 此文件由 setup-env.sh 自動生成於 $(date)

# API 基礎 URL
NEXT_PUBLIC_API_BASE_URL=$API_URL
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
echo ""
echo "🚀 啟動命令："
echo "   開發模式: npm run dev"
echo "   生產模式: npm run build && npm run start"
echo ""



