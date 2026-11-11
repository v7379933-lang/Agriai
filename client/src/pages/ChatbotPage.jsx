import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  Send,
  Sprout,
  User,
  Sparkles,
  BookOpen,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export function ChatbotPage() {
  const { profile, language, setLanguage } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Namaste! I am AgriSmart AI, your digital agricultural assistant. You can ask me any farming questions regarding crop diseases, fertilizer calculations, irrigation timing, or seasonal varieties for ${profile?.district || 'Andhra Pradesh & Telangana'}.`,
      recommended_actions: [
        'Check my active crops for disease symptoms',
        'Calculate fertilizer schedule for paddy or cotton',
        'Review upcoming 7-day weather forecast'
      ]
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const quickPrompts = [
    'Why are my crop leaves turning yellow?',
    'What is the recommended fertilizer for paddy?',
    'How do I manage Pink Bollworm in cotton?',
    'When should I irrigate my chilli field?',
    'Is it safe to spray pesticides tomorrow?'
  ];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (messageToSend) => {
    const text = messageToSend || inputMsg;
    if (!text || text.trim() === '' || loading) return;

    const userBubble = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text
    };

    setMessages((prev) => [...prev, userBubble]);
    setInputMsg('');
    setLoading(true);

    try {
      const res = await api.sendMessage({
        message: text,
        language: language,
        cropContext: profile?.crop || 'Rice, Cotton, Chilli',
        soilContext: profile?.soil_type || 'Black cotton'
      });

      if (res?.data?.response) {
        const ai = res.data.response;
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: ai.answer,
            recommended_actions: ai.recommended_actions,
            follow_up_questions: ai.follow_up_questions,
            source_references: ai.source_references,
            warnings: ai.warnings
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Unable to reach the advisory engine. Please verify your connection or try asking again.',
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8.5rem)] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 px-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">AgriSmart AI Assistant</h1>
            <p className="text-[10px] text-slate-500">Grounded in ICAR & State Agricultural Universities</p>
          </div>
        </div>

        {/* Language selector for chatbot */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded transition ${language === 'en' ? 'bg-purple-100 text-purple-900' : 'text-slate-500'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('te')}
            className={`px-2 py-0.5 rounded transition ${language === 'te' ? 'bg-purple-100 text-purple-900' : 'text-slate-500'}`}
          >
            తెలుగు
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2 py-0.5 rounded transition ${language === 'hi' ? 'bg-purple-100 text-purple-900' : 'text-slate-500'}`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center flex-shrink-0 text-xs font-bold border border-purple-200 mt-1">
                  AI
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs space-y-2.5 ${
                isUser
                  ? 'bg-agri-700 text-white rounded-tr-none'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
              }`}>
                <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>

                {/* Recommended Actions */}
                {msg.recommended_actions && msg.recommended_actions.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 space-y-1">
                    <p className="font-bold text-slate-900">Recommended Steps:</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                      {msg.recommended_actions.map((act, idx) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Follow up questions pills */}
                {msg.follow_up_questions && msg.follow_up_questions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {msg.follow_up_questions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-semibold transition text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Source Grounding */}
                {msg.source_references && msg.source_references.length > 0 && (
                  <div className="pt-1.5 text-[10px] text-slate-400 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-slate-400" />
                    <span>Source: {msg.source_references[0]?.organization || 'ICAR Agricultural Knowledge Network'}</span>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center flex-shrink-0 text-xs font-bold border border-purple-200">
              AI
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
              <span>Analyzing agronomic standards...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 text-[11px] font-medium transition flex-shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 sm:p-4 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder={`Ask about crop diseases, fertilizers, or weather in ${language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'}...`}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:outline-hidden"
        />
        <button
          type="submit"
          disabled={!inputMsg.trim() || loading}
          className="px-4 py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition flex items-center gap-1.5 disabled:opacity-40 shadow-xs"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

