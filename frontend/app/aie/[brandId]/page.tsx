'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  BarChart3,
  Bot,
  ChevronDown,
  FileText,
  FolderOpen,
  ImageIcon,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Paperclip,
  Search,
  Send,
  Sparkles,
  User,
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

type BrandId = 'ailabs' | 'cyberon' | 'eland';

type Brand = {
  id: BrandId;
  name: string;
  subtitle: string;
  logo: string;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatHistory = {
  id: string;
  title: string;
  date: string;
};

const modelOptions = [
  { id: 'gpt-5-3', name: 'GPT-5.3' },
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro' },
  { id: 'opus-4-6', name: 'Opus 4.6' },
];

const brands: Brand[] = [
  {
    id: 'ailabs',
    name: 'Taiwan AI Labs',
    subtitle: '台灣人工智慧實驗室',
    logo: '/images/aie-ailabs-logo.png',
  },
  {
    id: 'cyberon',
    name: 'Cyberon',
    subtitle: 'Leading Speech Solution Provider',
    logo: '/images/aie-cyberon-logo.png',
  },
  {
    id: 'eland',
    name: 'eLAND',
    subtitle: 'AI · Data · Cloud',
    logo: '/images/aie-eland-logo.png',
  },
];

function getBrandIdFromRouteValue(
  routeValue: string | string[] | undefined,
): BrandId | null {
  if (typeof routeValue !== 'string') {
    return null;
  }

  if (
    routeValue === 'ailabs' ||
    routeValue === 'cyberon' ||
    routeValue === 'eland'
  ) {
    return routeValue;
  }

  return null;
}

const getWelcome = (brandId: BrandId) => {
  switch (brandId) {
    case 'ailabs':
      return '您好！我是 Taiwan AI Labs 的 AI 助理，很高興為您服務。請問有什麼我可以幫助您的嗎？';
    case 'cyberon':
      return '您好！我是 Cyberon 的 AI 助理，專精語音解決方案。請問有什麼需要協助的嗎？';
    case 'eland':
      return '您好！我是 eLAND 的 AI 助理，專注於 AI、Data 與 Cloud 服務。請問有什麼可以幫您的？';
    default:
      return '您好！請問有什麼可以幫您的？';
  }
};

export default function AIEBrandPage() {
  const router = useRouter();
  const params = useParams();
  const brandId = getBrandIdFromRouteValue(params.brandId);
  const selectedBrand = useMemo(
    () => brands.find((brand) => brand.id === brandId) ?? null,
    [brandId],
  );

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState(modelOptions[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([
    { id: '1', title: '月度財務報表分析', date: '今天' },
    { id: '2', title: '員工請假流程優化', date: '今天' },
    { id: '3', title: '年度預算編列建議', date: '昨天' },
    { id: '4', title: '人才招募計畫討論', date: '昨天' },
    { id: '5', title: '行政採購作業流程', date: '7天前' },
  ]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modelRef.current &&
        !modelRef.current.contains(event.target as Node)
      ) {
        setShowModelDropdown(false);
      }
      if (
        uploadRef.current &&
        !uploadRef.current.contains(event.target as Node)
      ) {
        setShowUploadMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedBrand || !brandId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
          <p className="text-sm text-muted-foreground mb-4">
            找不到對應品牌頁面。
          </p>
          <Button onClick={() => router.push('/aie')}>返回 AIE 品牌選擇</Button>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((previousMessages) => [
      ...previousMessages,
      { role: 'user', content: userMsg },
    ]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: 'assistant',
          content: `感謝您的提問。關於「${userMsg}」，我們的團隊會盡快為您提供更詳細的資訊。`,
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleNewChat = () => {
    const newId = Date.now().toString();
    setChatHistories((previousHistories) => [
      { id: newId, title: '新對話', date: '今天' },
      ...previousHistories,
    ]);
    setActiveChatId(newId);
    setMessages([]);
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full border-r border-border bg-card flex flex-col shrink-0 overflow-hidden"
          >
            <div className="p-3 flex items-center justify-between border-b border-border">
              <button
                type="button"
                onClick={() => {
                  router.push('/aie');
                }}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                <Image
                  src={selectedBrand.logo}
                  alt={selectedBrand.name}
                  width={24}
                  height={24}
                  className="h-6 w-auto object-contain dark:brightness-0 dark:invert"
                />
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => setSidebarOpen(false)}
              >
                <PanelLeftClose className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-3">
              <button
                type="button"
                onClick={handleNewChat}
                className="w-full flex items-center justify-center gap-3 px-4 bg-gradient-to-l from-primary to-transparent text-foreground text-sm font-medium border border-primary/40 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.7)] hover:border-primary/60 transition-all duration-300 py-2.5 rounded-full"
              >
                <span>＋ 新對話</span>
              </button>
            </div>

            <div className="px-3 pb-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <input
                  placeholder="搜尋"
                  className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-1">
              <p className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                對話
              </p>
              <div className="flex flex-col gap-0.5">
                {chatHistories.map((chat) => (
                  <button
                    type="button"
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors truncate ${
                      activeChatId === chat.id
                        ? 'bg-primary/10 text-foreground font-medium'
                        : 'text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{chat.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => setSidebarOpen(true)}
              >
                <PanelLeftOpen className="w-4 h-4" />
              </Button>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-primary">
                {selectedModel.name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 max-w-lg text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedBrand.name}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getWelcome(brandId)}
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="w-full max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-5">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={`${message.role}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] text-sm leading-relaxed break-words whitespace-pre-wrap ${
                        message.role === 'user'
                          ? 'bg-slate-800/90 text-white px-5 py-3 rounded-xl border border-slate-700/50'
                          : 'text-foreground'
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex gap-1 mt-1.5">
                    {[0, 1, 2].map((dotIndex) => (
                      <motion.span
                        key={`dot-${dotIndex}`}
                        className="w-2 h-2 rounded-full bg-muted-foreground"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          delay: dotIndex * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        <div className="px-4 md:px-6 lg:px-8 py-4">
          <div className="w-full max-w-5xl mx-auto">
            <div className="bg-slate-900/30 rounded-xl border border-border focus-within:border-primary/40 transition-colors">
              <div className="px-4 py-4">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="輸入訊息"
                  rows={3}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between px-3 py-2 border-t border-border/50">
                <div className="flex items-center gap-1">
                  <div ref={modelRef} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModelDropdown(!showModelDropdown);
                        setShowUploadMenu(false);
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary bg-primary/10 hover:bg-primary/15 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{selectedModel.name}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {showModelDropdown && (
                      <div className="absolute bottom-full left-0 mb-1 w-44 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                        {modelOptions.map((model) => (
                          <button
                            type="button"
                            key={model.id}
                            onClick={() => {
                              setSelectedModel(model);
                              setShowModelDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs hover:bg-secondary transition-colors ${
                              selectedModel.id === model.id
                                ? 'text-primary font-medium'
                                : 'text-foreground'
                            }`}
                          >
                            {model.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div ref={uploadRef} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUploadMenu(!showUploadMenu);
                        setShowModelDropdown(false);
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>上傳</span>
                    </button>
                    {showUploadMenu && (
                      <div className="absolute bottom-full left-0 mb-1 w-40 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-secondary transition-colors"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>圖片</span>
                        </button>
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-secondary transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>檔案</span>
                        </button>
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-secondary transition-colors"
                        >
                          <FolderOpen className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>資料夾</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="h-8 w-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {messages.length <= 1 && (
              <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setInput('如何保護公司財務資料的安全？')}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all duration-300"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">財務資料安全</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInput('新員工報到需要注意哪些資安事項？')}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">新員工資安須知</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInput('如何識別可疑的釣魚郵件和連結？')}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all duration-300"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">識別釣魚郵件</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
