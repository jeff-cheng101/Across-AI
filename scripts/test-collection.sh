#!/bin/bash
# scripts/test-collection.sh
# 測試訓練資料收集系統

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          測試 AI 訓練資料收集系統                             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# 檢查必要的目錄和檔案
echo "📋 步驟 1/5: 檢查系統檔案..."

check_file() {
    if [ -f "$1" ]; then
        echo "   ✅ $1"
    else
        echo "   ❌ $1 (未找到)"
        exit 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo "   ✅ $1/"
    else
        echo "   ⚠️  $1/ (不存在，將自動建立)"
        mkdir -p "$1"
    fi
}

# 檢查檔案
check_file "scripts/collect-training-data.js"
check_file "scripts/config/collection-config.js"
check_file "scripts/utils/logger.js"
check_file "scripts/README.md"
check_file "ai_logs/README.md"
check_file ".gitignore"

# 檢查目錄
check_dir "ai_logs/cloudflare"
check_dir "ai_logs/f5"
check_dir "ai_logs/checkpoint"

echo ""
echo "📋 步驟 2/5: 檢查 Node.js 環境..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   ✅ Node.js $NODE_VERSION"
else
    echo "   ❌ 未安裝 Node.js"
    exit 1
fi

echo ""
echo "📋 步驟 3/5: 檢查必要的 npm 套件..."
if [ -f "package.json" ]; then
    echo "   ✅ package.json 存在"
else
    echo "   ⚠️  未找到 package.json"
fi

echo ""
echo "📋 步驟 4/5: 測試 --help 參數..."
node scripts/collect-training-data.js --help > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ --help 參數正常"
else
    echo "   ❌ --help 參數異常"
    exit 1
fi

echo ""
echo "📋 步驟 5/5: 顯示系統資訊..."
echo ""
node scripts/collect-training-data.js --help

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          ✅ 系統檢查完成！                                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📝 下一步："
echo "   1. 啟動後端服務: cd backend && node index.js"
echo "   2. 收集訓練資料: node scripts/collect-training-data.js --product=cloudflare --count=5 --apiKey=YOUR_KEY"
echo ""
echo "📚 詳細說明請參考:"
echo "   - scripts/README.md"
echo "   - TRAINING_DATA_COLLECTION_GUIDE.md"
echo ""


