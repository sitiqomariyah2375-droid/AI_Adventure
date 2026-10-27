import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  Download,
  FolderOpen,
  Send,
  BookOpen,
  Info,
  Trash2,
  Edit3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CreatorProject } from '../../types';

export const CreatorStudio: React.FC = () => {
  const { student, saveCreatorProject } = useApp();

  const projectTypes = [
    { id: 'Poster Edukasi', desc: 'Rancang pesan visual persuasif dan slogan edukatif' },
    { id: 'Infografis', desc: 'Struktur poin data, visual diagram, dan alur fakta ringkas' },
    { id: 'Cerita Interaktif', desc: 'Narasi bercabang mengenai dilema etika digital' },
    { id: 'Rancangan Game Edukasi', desc: 'Game design document (GDD) konsep mekanik game TIK' },
    { id: 'Naskah Video Pembelajaran', desc: 'Script video YouTube/TikTok edukasi materi SMK' },
    { id: 'Ide Solusi Digital Sekolah', desc: 'Proposal blueprint pemecahan masalah riil sekolah' },
    { id: 'Kampanye Literasi Digital', desc: 'Rencana aksi sosial media aman berselancar di internet' },
  ];

  const [selectedType, setSelectedType] = useState<string>('Poster Edukasi');
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [theme, setTheme] = useState<string>('Keamanan Siber di Sekolah');
  const [goal, setGoal] = useState<string>('Mengedukasi teman sekelas agar tidak tertipu phishing APK');
  const [targetAudience, setTargetAudience] = useState<string>('Siswa SMK Kelas X dan adik kelas SMP');
  const [studentIdeas, setStudentIdeas] = useState<string>('Ingin ada checklist 5 ciri link penipuan');

  // AI draft and student editor state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiOutline, setAiOutline] = useState<string>('');
  const [studentContent, setStudentContent] = useState<string>('');
  const [aiAssistanceNote, setAiAssistanceNote] = useState<string>(
    'AI Mentor membantu membuat kerangka draf dan struktur penomoran poin-poin.'
  );
  const [sourcesUsed, setSourcesUsed] = useState<string>(
    'Buku Paket Informatika SMK Kemendikbud & Panduan Literasi Siber BSSN'
  );

  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Request AI Scaffolding Outline
  const handleGenerateOutline = async () => {
    if (!projectTitle.trim()) {
      alert('Mohon masukkan judul proyek karya digital terlebih dahulu.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/creator-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType: selectedType,
          title: projectTitle,
          theme,
          goal,
          targetAudience,
          studentIdeas,
        }),
      });

      const data = await res.json();
      const generated = data.content || '';
      setAiOutline(generated);

      // Pre-fill student content with outline so student can refine
      if (!studentContent.trim()) {
        setStudentContent(
          `# ${projectTitle}\n**Jenis Karya:** ${selectedType}\n**Sasaran:** ${targetAudience}\n\n${generated}\n\n---\n### Catatan Tambahan Siswa:\n[Tuliskan ide unik dan analisismu di sini...]`
        );
      }
    } catch (e) {
      console.error(e);
      alert('Gagal menghasilkan draf AI. Silakan coba kembali.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(studentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([studentContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectTitle.replace(/\s+/g, '_')}_Karya_Digital.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToPortfolio = () => {
    if (!projectTitle.trim() || !studentContent.trim()) {
      alert('Harap isi judul dan konten karya sebelum menyimpan.');
      return;
    }

    const newProject: CreatorProject = {
      id: `proj-${Date.now()}`,
      title: projectTitle,
      projectType: selectedType,
      theme,
      goal,
      targetAudience,
      studentIdeas,
      aiAssistanceNote,
      sourcesUsed,
      content: studentContent,
      createdAt: new Date().toLocaleDateString('id-ID'),
    };

    saveCreatorProject(newProject);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Creator Studio — Laboratorium Kreativitas Digital</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Rancang Karya & Naskah Digitalmu
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl">
            Rancang poster, naskah video, cerita interaktif, atau solusi digital sekolah dengan
            bimbingan AI. Tetap kedepankan orisinalitas, cantumkan sumber, dan nyatakan transparansi
            bantuan AI.
          </p>
        </div>

        <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-center space-x-2.5 self-start md:self-auto">
          <Info className="w-4 h-4 text-purple-600 shrink-0" />
          <span>Fokus pada perancangan naskah & konten terstruktur untuk diaplikasikan ke Canva/Figma.</span>
        </div>
      </div>

      {/* Main Dual Grid: Form Setup vs Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Project Planner Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-purple-600" />
            <span>1. Perencanaan Proyek Karya</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            {/* Project Type */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pilih Format Karya:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
              >
                {projectTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} — {t.desc}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Judul Karya / Proyek:</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Contoh: Infografis Stop Phishing APK Sekolah"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            {/* Theme & Goal */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tema Pembelajaran:</label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tujuan yang Ingin Dicapai:</label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Audiens / Pembaca:</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Contoh: Siswa SMK Kelas X, Guru, dan Masyarakat"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Student Initial Ideas */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Gagasan Awal Siswa:</label>
              <textarea
                rows={3}
                value={studentIdeas}
                onChange={(e) => setStudentIdeas(e.target.value)}
                placeholder="Tuliskan ide awalmu atau pesan penting yang ingin kamu sampaikan..."
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="button"
              disabled={isGenerating || !projectTitle.trim()}
              onClick={handleGenerateOutline}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20 flex items-center justify-center space-x-2 transition-transform active:scale-98"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>AI Mentor Sedang Menyusun Kerangka...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Minta Bimbingan & Kerangka AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column (7 Cols): Dual Text Editor & Ethics Attribution */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>2. Editor Karya Siswa</span>
              </h3>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh (.md)</span>
                </button>
              </div>
            </div>

            {/* Textarea Editor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Isi & Naskah Lengkap (Bebas Edit & Kembangkan):
              </label>
              <textarea
                rows={11}
                value={studentContent}
                onChange={(e) => setStudentContent(e.target.value)}
                placeholder="Setelah meminta kerangka AI, modifikasi dan tambahkan gagasan orisinalmu di sini..."
                className="w-full p-3.5 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono text-xs sm:text-sm leading-relaxed"
              />
            </div>

            {/* Ethics & AI Attribution Fields */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <Info className="w-4 h-4 text-indigo-600" />
                <span>Transparansi Penggunaan AI & Rujukan Sumber (Kurikulum Merdeka)</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Bagian mana yang dibantu AI?
                </label>
                <input
                  type="text"
                  value={aiAssistanceNote}
                  onChange={(e) => setAiAssistanceNote(e.target.value)}
                  placeholder="Misal: Menyusun kerangka poin-poin dan ide slogan"
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Sumber Informasi yang Digunakan (Verifikasi Fakta):
                </label>
                <input
                  type="text"
                  value={sourcesUsed}
                  onChange={(e) => setSourcesUsed(e.target.value)}
                  placeholder="Misal: Buku Informatika Kelas X Kemendikbud & Portal Resmi BSSN"
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-2 flex items-center justify-between">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Karya berhasil disimpan ke Galeri Siswa (+150 XP)!</span>
              </span>
            )}
            {!savedSuccess && <div />}

            <button
              type="button"
              onClick={handleSaveToPortfolio}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 flex items-center space-x-2"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Simpan ke Portofolio Siswa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Saved Projects Gallery */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-lg text-slate-900 flex items-center space-x-2">
          <FolderOpen className="w-5 h-5 text-indigo-600" />
          <span>Galeri Karya Digital Saya ({student.creatorProjects.length})</span>
        </h3>

        {student.creatorProjects.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4">
            Belum ada karya yang disimpan. Rancang proyek pertamamu di atas dan simpan ke galeri!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {student.creatorProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-indigo-600 mb-1">
                    <span>{proj.projectType}</span>
                    <span className="text-slate-400">{proj.createdAt}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{proj.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{proj.content}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
                    Sasaran: {proj.targetAudience}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setProjectTitle(proj.title);
                      setSelectedType(proj.projectType);
                      setTheme(proj.theme);
                      setGoal(proj.goal);
                      setTargetAudience(proj.targetAudience);
                      setStudentContent(proj.content);
                      setAiAssistanceNote(proj.aiAssistanceNote);
                      setSourcesUsed(proj.sourcesUsed);
                    }}
                    className="font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    Buka di Editor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
