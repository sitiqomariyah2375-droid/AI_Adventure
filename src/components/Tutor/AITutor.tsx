import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Compass,
  RotateCcw,
  Volume2,
  VolumeX,
  BookOpen,
  CheckCircle,
  AlertCircle,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  mode?: string;
}

export const AITutor: React.FC = () => {
  const { student } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: `Halo **${student.name}**! 👋 Saya **Informatika Hero**, asisten belajar cerdasmu di kelas X SMK.\n\nSaya di sini bukan untuk sekadar memberi jawaban instan, tetapi membantu memandu logikamu selangkah demi selangkah. Topik apa yang sedang ingin kita bedah bersama hari ini?`,
      timestamp: 'Baru saja',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('Berpikir Komputasional');
  const [selectedMode, setSelectedMode] = useState<'explain' | 'guide' | 'example' | 'quiz_me' | 'challenge'>('explain');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const topicsList = [
    'Berpikir Komputasional (4 Pilar)',
    'Perangkat TIK (Input, Proses, Output, Storage)',
    'Sistem Komputer (Hardware, OS, Brainware)',
    'Algoritma & Flowchart Gerbang Sekolah',
    'Keamanan Siber & Phishing APK',
    'Etika AI & Integritas Siswa',
  ];

  const modes = [
    { id: 'explain', label: 'Jelaskan Materi', desc: 'Penjelasan konsep dengan analogi ramah' },
    { id: 'guide', label: 'Bimbing Saya', desc: 'Panduan bertahap (scaffolding)' },
    { id: 'example', label: 'Beri Contoh SMK', desc: 'Studi kasus nyata di industri/lab' },
    { id: 'quiz_me', label: 'Uji Pemahaman', desc: 'AI menguji penalaran Anda' },
    { id: 'challenge', label: 'Tantangan Logika', desc: 'Mini case study problem solving' },
  ];

  const quickActionPrompts = [
    { label: '💡 Petunjuk Berikutnya', prompt: 'Bisa berikan petunjuk langkah berikutnya untuk memecahkan problem ini?' },
    { label: '🏭 Beri Contoh Nyata SMK', prompt: 'Bagaimana contoh penerapan materi ini di dunia kerja atau lab kejuruan SMK?' },
    { label: '🎯 Cek Pemahaman Saya', prompt: 'Saya akan coba jelaskan pemahaman saya, tolong periksa apakah konsep saya sudah tepat atau ada miskonsepsi.' },
    { label: '🔍 Bagaimana Cara Verifikasinya?', prompt: 'Bagaimana cara saya memverifikasi informasi ini secara mandiri ke sumber rujukan resmi?' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      mode: selectedMode,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Prepare payload for server
      const chatPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatPayload,
          mode: selectedMode,
          contextTopic: selectedTopic,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.reply || 'Maaf, saya tidak menerima respons yang jelas.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        mode: selectedMode,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(err.message || 'Gagal berkomunikasi dengan AI Tutor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLast = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Banner / Topic & Mode Controls */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">AI Tutor: Informatika Hero</h2>
              <p className="text-xs text-slate-500">
                Pendekatan Scaffolding: Pertanyaan pemantik, analogi industri SMK, dan penguatan konsep
              </p>
            </div>
          </div>

          {/* Context Topic Dropdown */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-slate-600 shrink-0">Fokus Topik:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 font-medium text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              {topicsList.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5 Mode Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 border-t border-slate-100">
          {modes.map((m) => {
            const isSelected = selectedMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMode(m.id as any)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 font-bold shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold leading-tight">{m.label}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{m.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[580px] overflow-hidden">
        {/* Chat Message Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isBot = msg.role === 'model';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${
                    isBot ? 'bg-indigo-600 shadow-xs' : 'bg-slate-800'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? 'bg-slate-50 border border-slate-200/90 text-slate-800'
                      : 'bg-indigo-600 text-white shadow-xs'
                  }`}
                >
                  {/* Markdown-like paragraphs */}
                  <div className="space-y-2 whitespace-pre-wrap">
                    {msg.content.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx}>
                        {paragraph.split('**').map((part, bIdx) =>
                          bIdx % 2 === 1 ? (
                            <strong key={bIdx} className="font-bold">
                              {part}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    ))}
                  </div>

                  {/* Bubble Footer */}
                  <div
                    className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] ${
                      isBot ? 'border-slate-200 text-slate-400' : 'border-indigo-500/50 text-indigo-200'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isBot && (
                      <button
                        type="button"
                        onClick={() => handleSpeak(msg.content)}
                        className="hover:text-indigo-600 flex items-center space-x-1"
                        title="Dengarkan suara"
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                        <span>{isSpeaking ? 'Hentikan' : 'Baca Suara'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center space-x-3 text-slate-500 text-xs py-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 px-4 py-2.5 rounded-2xl flex items-center space-x-1.5 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] font-medium text-slate-600">
                  AI Tutor sedang menyusun bimbingan...
                </span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={handleRetryLast}
                className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center space-x-1 hover:bg-rose-700"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Coba Lagi</span>
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Chips */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex space-x-2 overflow-x-auto no-scrollbar shrink-0">
          {quickActionPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSendMessage(q.prompt)}
              className="text-[11px] font-semibold text-slate-700 hover:text-indigo-600 hover:bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/80 bg-white/70 whitespace-nowrap transition-colors disabled:opacity-40"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input Form Bar */}
        <div className="p-3.5 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputPrompt}
              disabled={isLoading}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={`Tanyakan materi ${selectedTopic} dalam mode [${modes.find((m) => m.id === selectedMode)?.label}]...`}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs sm:text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold flex items-center space-x-1.5 shadow-xs transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Kirim</span>
            </button>
          </form>
          <div className="mt-1.5 text-[11px] text-slate-400 text-center">
            💡 Verifikasi fakta teknis dengan buku paket Kurikulum Merdeka atau dokumentasi resmi.
          </div>
        </div>
      </div>
    </div>
  );
};
