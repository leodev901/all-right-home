'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Metadata } from 'next';

// ============================================================
// 타입 정의
// ============================================================
type ToolLog = {
  name: string;
  data: string;
};

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolLogs?: ToolLog[];
  isStreaming?: boolean;
};

type ToolItem = {
  name: string;
  description: string;
};

type LlmProvider = 'gemini' | 'chatgpt';
type LlmModel = 'fast' | 'advanced';

// ============================================================
// 퀵 액션 카드 (부동산 관련 예시 질문)
// ============================================================
const QUICK_ACTIONS = [
  { icon: '🌤️', label: '오늘 서울 날씨?', prompt: '오늘 서울 날씨 어때?' },
  { icon: '🍔', label: '홍대역 맛집 추천', prompt: '홍대역 맛집 찾아줘' },
  { icon: '📰', label: '부동산 최신 뉴스', prompt: '오늘 부동산 관련 최신 뉴스를 알려줘' },
  { icon: '📊', label: '최근 아파트 시세 동향', prompt: '최근 서울 아파트 시세 동향을 검색해서 알려줘' },
];

// ============================================================
// LLM 선택 옵션
// ============================================================
const LLM_OPTIONS: { provider: LlmProvider; model: LlmModel; label: string }[] = [
  { provider: 'gemini', model: 'fast', label: 'Gemini Fast' },
  { provider: 'gemini', model: 'advanced', label: 'Gemini Advanced' },
  { provider: 'chatgpt', model: 'fast', label: 'ChatGPT Fast' },
  { provider: 'chatgpt', model: 'advanced', label: 'ChatGPT Advanced' },
];

// ============================================================
// 마크다운을 단순 HTML로 변환 (의존성 없이 기본 처리)
// ============================================================
function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-orange-500 hover:underline break-all">$1</a>')
    .replace(/^### (.+)$/gm, '<h3 class="font-bold text-sm mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-bold text-base mt-4 mb-1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-bold text-lg mt-4 mb-2">$1</h1>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\* (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 text-orange-600 px-1 py-0.5 rounded text-[13px] font-mono">$1</code>')
    .replace(/\n{2,}/g, '</p><p class="mb-2">')
    .replace(/\n/g, '<br/>');
}

// ============================================================
// JSON 포맷팅 및 신택스 하이라이팅
// ============================================================
function formatAndHighlightJson(rawText: string): string {
  if (!rawText) return '';

  let formatted = rawText;
  try {
    const trimmed = rawText.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      const parsed = JSON.parse(trimmed);
      formatted = JSON.stringify(parsed, null, 2);
    } else {
      // 여러 줄의 JSON 문자열 처리
      const lines = rawText.split('\n');
      const processed = lines.map(line => {
        const l = line.trim();
        if (l.startsWith('{') || l.startsWith('[')) {
          try {
            return JSON.stringify(JSON.parse(l), null, 2);
          } catch {
            return l;
          }
        }
        return l;
      });
      formatted = processed.join('\n');
    }
  } catch {
    // 파싱 오류 시 원본 사용
  }

  // HTML 이스케이프
  let html = formatted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // JSON 색상 입히기
  return html.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = 'text-purple-600'; // 숫자 기본
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-blue-600 font-semibold'; // 키 (파란색)
        } else {
          cls = 'text-green-600 font-medium'; // 문자열 값 (녹색)
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-orange-500 font-semibold'; // 불리언
      } else if (/null/.test(match)) {
        cls = 'text-gray-400 font-semibold'; // null
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

// ============================================================
// AI 챗봇 페이지 (Client Component)
// ============================================================
export default function ChatPage() {
  // ── 상태 ──
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // sessionId: SSR/CSR hydration mismatch 방지 → useEffect에서 초기화
  const [sessionId, setSessionId] = useState<string>('');

  const [selectedLlm, setSelectedLlm] = useState<(typeof LLM_OPTIONS)[number]>(LLM_OPTIONS[0]);
  const [availableTools, setAvailableTools] = useState<ToolItem[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [showToolPanel, setShowToolPanel] = useState(false);
  const [showLlmPanel, setShowLlmPanel] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

  // ── 세션 ID 초기화 (클라이언트 전용) ──
  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  // ── 자동 스크롤 ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── 사용 가능한 도구 목록 조회 ──
  useEffect(() => {
    async function fetchTools() {
      try {
        const res = await fetch(`${API_BASE}/api/v1/tools`);
        if (!res.ok) return;
        const json = await res.json();
        const tools: ToolItem[] = json?.data ?? [];
        setAvailableTools(tools);
        // 기본적으로 모든 사용 가능한 도구를 체크 상태로 설정
        setSelectedTools(tools.map((t) => t.name));
      } catch {
        // 백엔드 미실행 시 조용히 무시
      }
    }
    fetchTools();
  }, [API_BASE]);

  // ── textarea 자동 높이 조절 ──
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [inputText]);

  // ── 도구 토글 ──
  function toggleTool(toolName: string) {
    setSelectedTools((prev) =>
      prev.includes(toolName) ? prev.filter((t) => t !== toolName) : [...prev, toolName]
    );
  }

  // ── 메시지 ID 생성 ──
  function genId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  // ── 스트리밍 채팅 전송 ──
  const sendMessage = useCallback(async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMsg: Message = { id: genId(), role: 'user', content: userText.trim() };
    const assistantId = genId();
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '', isStreaming: true };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInputText('');
    setIsLoading(true);

    abortRef.current = new AbortController();

    try {
      const body = {
        session_id: sessionId,
        message: userText.trim(),
        llm_config: {
          provider: selectedLlm.provider,
          model: selectedLlm.model,
        },
        tools: selectedTools,
      };

      const res = await fetch(`${API_BASE}/api/v1/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        throw new Error(`서버 오류: ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('스트리밍을 지원하지 않습니다.');

      let accumulated = '';
      let activeToolLogs: ToolLog[] = [];

      // SSE 스트림 읽기
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();

          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'token' && parsed.data) {
              accumulated += parsed.data;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: accumulated } : m
                )
              );
            } else if (parsed.type === 'tool' && parsed.data) {
              const toolName = parsed.name || '검색 도구';
              const existingIdx = activeToolLogs.findIndex((t) => t.name === toolName);
              if (existingIdx > -1) {
                activeToolLogs[existingIdx] = {
                  name: toolName,
                  data: activeToolLogs[existingIdx].data + '\n' + parsed.data
                };
              } else {
                activeToolLogs.push({ name: toolName, data: parsed.data });
              }
              const updatedLogs = [...activeToolLogs];
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, toolLogs: updatedLogs } : m
                )
              );
            }
          } catch {
            // JSON 파싱 실패 시 skip
          }
        }
      }

    } catch (err: unknown) {
      const isCancelled = err instanceof Error && err.name === 'AbortError';
      if (!isCancelled) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: '❌ 오류가 발생했습니다. 백엔드 서버 연결을 확인해주세요.', isStreaming: false }
              : m
          )
        );
      }
    } finally {
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, isStreaming: false } : m))
      );
      setIsLoading(false);
    }
  }, [isLoading, sessionId, selectedLlm, selectedTools, API_BASE]);

  // ── 전송 취소 ──
  function cancelStream() {
    abortRef.current?.abort();
    setIsLoading(false);
  }

  // ── 키보드 Enter 전송 (Shift+Enter = 줄바꿈) ──
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  }

  // ── 대화 초기화 ──
  function resetChat() {
    if (isLoading) cancelStream();
    setMessages([]);
  }

  // ============================================================
  // 렌더링
  // ============================================================
  return (
    <div className="flex flex-col h-[calc(100vh-var(--gnb-height))]" style={{ background: 'var(--color-bg)' }}>

      {/* ── 헤더 ── */}
      <header
        className="flex items-center justify-between px-4 lg:px-6 py-3 border-b"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div>
          <h1 className="text-base font-bold text-gray-900">🤖 업무 에이전트</h1>
          <p className="text-xs text-gray-400 mt-0.5">날씨, 뉴스, 부동산 정보 등 업무를 AI가 도와드립니다</p>
        </div>

        {/* 오른쪽 컨트롤 */}
        <div className="flex items-center gap-2">

          {/* 도구 선택 버튼 */}
          <div className="relative">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${selectedTools.length > 0
                  ? 'border-orange-300 bg-orange-50 text-orange-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              onClick={() => { setShowToolPanel((v) => !v); setShowLlmPanel(false); }}
            >
              🔧 도구
              {selectedTools.length > 0 && (
                <span className="bg-orange-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {selectedTools.length}
                </span>
              )}
            </button>

            {showToolPanel && (
              <div className="absolute right-0 top-full mt-1 w-64 card p-3 shadow-lg animate-slide-down z-20">
                <p className="text-xs font-semibold text-gray-500 mb-2">사용할 도구 선택</p>
                {availableTools.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-2">
                    백엔드 서버에 연결하면<br />도구 목록이 표시됩니다
                  </p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {availableTools.map((tool) => (
                      <label key={tool.name} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-0.5 accent-orange-500"
                          checked={selectedTools.includes(tool.name)}
                          onChange={() => toggleTool(tool.name)}
                        />
                        <div>
                          <p className="text-xs font-medium text-gray-800">{tool.name}</p>
                          <p className="text-[11px] text-gray-400 leading-snug">{tool.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* LLM 모델 선택 */}
          <div className="relative">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-gray-300 transition-colors"
              onClick={() => { setShowLlmPanel((v) => !v); setShowToolPanel(false); }}
            >
              ✨ {selectedLlm.label}
              <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M3 4.5l3 3 3-3" />
              </svg>
            </button>

            {showLlmPanel && (
              <div className="absolute right-0 top-full mt-1 w-48 card py-1.5 shadow-lg animate-slide-down z-20">
                {LLM_OPTIONS.map((opt) => (
                  <button
                    key={`${opt.provider}-${opt.model}`}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${selectedLlm.provider === opt.provider && selectedLlm.model === opt.model
                        ? 'text-orange-500 font-semibold bg-orange-50'
                        : 'text-gray-700'
                      }`}
                    onClick={() => { setSelectedLlm(opt); setShowLlmPanel(false); }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 초기화 버튼 */}
          <button
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors"
            onClick={resetChat}
            title="대화 초기화"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── 채팅 메시지 영역 ── */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4">
        {messages.length === 0 ? (
          /* 빈 상태: 환영 화면 */
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
              style={{ background: 'var(--color-accent-light)' }}
            >
              🤖
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">무엇을 도와드릴까요?</h2>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
              날씨, 뉴스 검색, 부동산 정보 등<br />업무에 필요한 것을 물어보세요.
            </p>

            {/* 퀵 액션 카드 */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-md">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  className="card p-3 text-left hover:border-orange-300 hover:shadow-sm transition-all duration-200 group"
                  onClick={() => sendMessage(action.prompt)}
                >
                  <span className="text-xl mb-1.5 block">{action.icon}</span>
                  <p className="text-xs font-medium text-gray-700 group-hover:text-orange-500 transition-colors leading-snug">
                    {action.label}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* 메시지 목록 */
          <div className="max-w-3xl mx-auto flex flex-col gap-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* 아바타 */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${msg.role === 'user'
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-blue-50 text-blue-600'
                    }`}
                >
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>

                {/* 말풍선 */}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                      ? 'bg-orange-500 text-white rounded-tr-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
                    } ${msg.isStreaming ? 'streaming-cursor' : ''}`}
                >
                  {msg.role === 'assistant' ? (
                    <>
                      {msg.toolLogs && msg.toolLogs.length > 0 && (
                        <div className="flex flex-col gap-1.5 mb-2">
                          {msg.toolLogs.map((log, index) => (
                            <details key={index} className="text-xs bg-gray-50 rounded-lg border border-gray-200 p-2">
                              <summary className="cursor-pointer font-semibold text-gray-600 hover:text-gray-800 focus:outline-none select-none flex items-center gap-1.5">
                                <span>🔧 도구 실행 결과 확인 - <span className="text-orange-500 font-semibold">{log.name}</span></span>
                              </summary>
                              <pre
                                className="mt-1.5 whitespace-pre-wrap font-mono text-[11px] text-gray-700 bg-white p-2.5 rounded-lg border border-gray-200 max-h-60 overflow-y-auto leading-relaxed shadow-inner"
                                dangerouslySetInnerHTML={{ __html: formatAndHighlightJson(log.data) }}
                              />
                            </details>
                          ))}
                        </div>
                      )}
                      <div
                        className="prose-sm"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) || '' }}
                      />
                    </>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* ── 입력 영역 ── */}
      <div
        className="px-4 lg:px-6 py-3 border-t"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-3xl mx-auto">

          {/* 선택된 도구 표시 */}
          {selectedTools.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {selectedTools.map((tool) => (
                <span key={tool} className="inline-flex items-center gap-1 text-[11px] bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full font-medium">
                  🔧 {tool}
                  <button onClick={() => toggleTool(tool)} className="hover:text-red-500 ml-0.5">×</button>
                </span>
              ))}
            </div>
          )}

          {/* 입력창 */}
          <div className="flex items-end gap-2 p-2 rounded-xl border border-gray-200 bg-white focus-within:border-orange-400 transition-colors shadow-sm">
            <textarea
              ref={textareaRef}
              id="chat-input"
              className="flex-1 resize-none bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 min-h-[36px] max-h-40 py-1 px-1 leading-relaxed"
              placeholder="메시지를 입력하세요... (Shift+Enter: 줄바꿈)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
            />

            {/* 전송/취소 버튼 */}
            {isLoading ? (
              <button
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors shrink-0"
                onClick={cancelStream}
                title="전송 취소"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </button>
            ) : (
              <button
                className="flex items-center justify-center w-9 h-9 rounded-lg btn-primary disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim()}
                title="전송 (Enter)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          <p className="text-center text-[11px] text-gray-400 mt-1.5">
            AI 답변은 참고용이며 법적 효력이 없습니다. · 세션 ID: {sessionId.slice(0, 8)}...
          </p>
        </div>
      </div>

    </div>
  );
}
