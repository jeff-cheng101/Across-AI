#!/bin/bash

# 部署驗證腳本

echo "🔍 開始驗證部署配置..."
echo ""

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SUCCESS=0
FAILED=0

# 檢查函數
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        SUCCESS=$((SUCCESS + 1))
    else
        echo -e "${RED}❌ $1${NC}"
        FAILED=$((FAILED + 1))
    fi
}

# 1. 檢查前端環境變數文件
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  檢查前端環境配置"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
FRONTEND_DIR="/Users/peter/Across-AI/frontend"
ENV_FILE="$FRONTEND_DIR/.env.local"

if [ -f "$ENV_FILE" ]; then
    check "找到 .env.local 文件"
    echo ""
    echo "📝 當前配置："
    cat "$ENV_FILE"
    echo ""
    
    # 檢查環境變數是否包含正確的 URL
    if grep -q "NEXT_PUBLIC_API_BASE_URL" "$ENV_FILE"; then
        check "環境變數 NEXT_PUBLIC_API_BASE_URL 已配置"
        
        # 提取 URL
        API_URL=$(grep "NEXT_PUBLIC_API_BASE_URL" "$ENV_FILE" | cut -d'=' -f2)
        echo "   配置的 URL: $API_URL"
        
        # 檢查是否還是 localhost
        if echo "$API_URL" | grep -q "localhost"; then
            echo -e "   ${YELLOW}⚠️  警告：仍在使用 localhost，可能不適合遠端部署${NC}"
        fi
    else
        echo -e "${RED}❌ 未找到 NEXT_PUBLIC_API_BASE_URL 配置${NC}"
        FAILED=$((FAILED + 1))
    fi
else
    echo -e "${RED}❌ 未找到 .env.local 文件${NC}"
    echo ""
    echo "💡 請運行以下命令創建配置："
    echo "   cd $FRONTEND_DIR"
    echo "   ./setup-env.sh"
    FAILED=$((FAILED + 1))
fi

echo ""

# 2. 檢查前端代碼修改
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  檢查前端代碼修改"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CLOUDFLARE_PAGE="$FRONTEND_DIR/app/ai-analysis/cloudflare/page.tsx"
F5_PAGE="$FRONTEND_DIR/app/ai-analysis/f5/page.tsx"

if grep -q "API_BASE_URL" "$CLOUDFLARE_PAGE"; then
    check "Cloudflare 頁面已更新使用環境變數"
else
    echo -e "${RED}❌ Cloudflare 頁面未更新${NC}"
    FAILED=$((FAILED + 1))
fi

if grep -q "API_BASE_URL" "$F5_PAGE"; then
    check "F5 頁面已更新使用環境變數"
else
    echo -e "${RED}❌ F5 頁面未更新${NC}"
    FAILED=$((FAILED + 1))
fi

# 檢查是否還有硬編碼的 localhost:8080
if grep -r "localhost:8080" "$FRONTEND_DIR/app" 2>/dev/null | grep -v "API_BASE_URL"; then
    echo -e "${YELLOW}⚠️  發現未修改的硬編碼 localhost:8080${NC}"
    grep -r "localhost:8080" "$FRONTEND_DIR/app" 2>/dev/null | grep -v "API_BASE_URL"
else
    check "沒有發現硬編碼的 API 端點"
fi

echo ""

# 3. 檢查後端配置
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  檢查後端配置"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

BACKEND_DIR="/Users/peter/Across-AI/backend"
BACKEND_INDEX="$BACKEND_DIR/index.js"

if [ -f "$BACKEND_INDEX" ]; then
    check "找到後端入口文件"
    
    # 檢查 CORS 配置
    if grep -q "cors()" "$BACKEND_INDEX"; then
        check "CORS 已啟用"
    else
        echo -e "${RED}❌ 未找到 CORS 配置${NC}"
        FAILED=$((FAILED + 1))
    fi
    
    # 檢查端口配置
    PORT=$(grep "const port" "$BACKEND_INDEX" | grep -oE '[0-9]+')
    if [ -n "$PORT" ]; then
        echo "   後端端口: $PORT"
        check "後端端口配置正確"
    fi
else
    echo -e "${RED}❌ 未找到後端入口文件${NC}"
    FAILED=$((FAILED + 1))
fi

echo ""

# 4. 檢查進程運行狀態
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  檢查進程運行狀態"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 檢查前端進程
if pgrep -f "next" > /dev/null; then
    check "前端進程正在運行"
    echo "   PID: $(pgrep -f "next" | head -1)"
else
    echo -e "${YELLOW}⚠️  前端進程未運行${NC}"
    echo "   啟動命令: cd $FRONTEND_DIR && npm run start"
fi

# 檢查後端進程
if pgrep -f "node.*index.js" > /dev/null; then
    check "後端進程正在運行"
    echo "   PID: $(pgrep -f "node.*index.js" | head -1)"
else
    echo -e "${YELLOW}⚠️  後端進程未運行${NC}"
    echo "   啟動命令: cd $BACKEND_DIR && node index.js"
fi

echo ""

# 5. 網絡連接測試
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  網絡連接測試"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 測試本地後端連接
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200\|404"; then
    check "本地後端可訪問 (localhost:8080)"
else
    echo -e "${YELLOW}⚠️  無法連接到本地後端 (localhost:8080)${NC}"
fi

# 如果配置了遠端 URL，測試遠端連接
if [ -f "$ENV_FILE" ] && grep -q "twister5poc.phison.com" "$ENV_FILE"; then
    echo ""
    echo "測試遠端 API 連接..."
    if curl -k -s -o /dev/null -w "%{http_code}" https://twister5poc.phison.com:3000 --connect-timeout 5 | grep -q "200\|404\|302"; then
        check "遠端 API 可訪問 (twister5poc.phison.com:3000)"
    else
        echo -e "${YELLOW}⚠️  無法連接到遠端 API${NC}"
        echo "   可能原因："
        echo "   - 防火牆阻擋"
        echo "   - 服務未啟動"
        echo "   - DNS 解析問題"
    fi
fi

echo ""

# 總結
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 驗證總結"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "成功: ${GREEN}$SUCCESS${NC}"
echo -e "失敗: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 所有檢查通過！部署配置正確。${NC}"
    echo ""
    echo "✅ 下一步："
    echo "1. 確保前端和後端都在運行"
    echo "2. 打開瀏覽器測試 AI 分析功能"
    echo "3. 檢查瀏覽器開發者工具的 Network 標籤"
    exit 0
else
    echo -e "${RED}⚠️  發現 $FAILED 個問題，請修復後重新驗證。${NC}"
    echo ""
    echo "💡 常見解決方案："
    echo "1. 運行配置腳本: cd $FRONTEND_DIR && ./setup-env.sh"
    echo "2. 重新啟動應用以使配置生效"
    echo "3. 查看詳細文檔: cat API_CONNECTION_FIX_SUMMARY.md"
    exit 1
fi



