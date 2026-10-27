import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const DEFAULT_MODEL = 'gemini-3.8-flash';

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'AI Learning Adventure',
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// 1. AI Tutor Endpoint
app.post('/api/ai/tutor', async (req, res) => {
  try {
    const { messages, mode = 'explain', contextTopic = 'Informatika Umum' } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Daftar pesan tidak valid.' });
    }

    const modeInstructions: Record<string, string> = {
      explain: 'Jelaskan konsep dengan analogi sederhana dan bahasa ramah khas siswa SMK kelas X. Gunakan contoh nyata di lingkungan sekolah, lab komputer, atau kehidupan sehari-hari.',
      guide: 'Gunakan teknik bimbingan bertahap (scaffolding). JANGAN langsung berikan jawaban akhir! Berikan pertanyaan pemantik atau petunjuk kecil agar siswa menemukan sendiri jawabannya.',
      example: 'Berikan 2-3 contoh kasus nyata di dunia kerja/industri (misal: teknisi jaringan, programmer, desainer, atau administrasi kantor SMK) terkait topik ini.',
      quiz_me: 'Ajukan 1 pertanyaan penalaran singkat atau studi kasus tentang materi ini dan minta siswa menjawab untuk menguji pemahaman.',
      challenge: 'Berikan tantangan pemecahan masalah (mini case study) tingkat menengah yang menantang siswa berpikir komputasional (dekomposisi, abstraksi, pola, algoritma).'
    };

    const activeInstruction = modeInstructions[mode] || modeInstructions.explain;

    const systemInstruction = `Kamu adalah AI Tutor "Informatika Hero", asisten belajar cerdas untuk siswa kelas X SMK pada mata pelajaran Informatika (Kurikulum Merdeka).
Aturan & Karakteristik Kamu:
1. Bahasa Indonesia yang ramah, santun, memotivasi, dan tidak kaku (cocok untuk remaja SMK).
2. Mode saat ini: [${mode.toUpperCase()}] -> ${activeInstruction}
3. Topik yang sedang dibahas: "${contextTopic}".
4. Pendekatan Edukasi:
   - Gunakan pendekatan Scaffolding: pandu bertahap, jangan langsung memberi jawaban instan jika siswa bertanya solusi tugas.
   - Berikan contoh nyata dunia industri SMK (RPL, TKJ, DKV, Akuntansi, Otomotif, dll) dan kehidupan harian.
   - Ajukan pertanyaan balik untuk memicu berpikir kritis ("Bagaimana menurutmu jika...?", "Langkah apa yang perlu disiapkan pertama kali?").
   - Jika ada miskonsepsi (misal: menganggap RAM menyimpan data permanen), koreksi dengan sopan dan jelaskan perbedaannya.
   - Selalu dorong siswa memverifikasi kebenaran informasi dan bedakan antara fakta teknis dan asumsi.
5. Format jawaban terstruktur dengan rapi (gunakan poin-poin tebal yang mudah dibaca di layar HP).`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: `Halo! (Mode Offline/Demo) Saya AI Tutor Informatika. Untuk topik **${contextTopic}**, ingat bahwa prinsip utamanya adalah memecah masalah besar menjadi bagian-bagian kecil (dekomposisi) dan fokus pada informasi penting (abstraksi). Apa bagian yang ingin kita bedah bersama?`,
        mode,
      });
    }

    // Convert messages for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Maaf, saya belum dapat merespons saat ini. Silakan coba kembali.';
    return res.json({ reply, mode });
  } catch (err: any) {
    console.error('Tutor Error:', err);
    return res.status(500).json({
      error: 'Terjadi kendala saat menghubungi AI Tutor. Silakan coba beberapa saat lagi.',
      details: err?.message,
    });
  }
});

// 2. Dynamic Smart Quiz Generator Endpoint
app.post('/api/ai/generate-quiz', async (req, res) => {
  try {
    const { topic = 'Berpikir Komputasional', count = 5, level = 'Menengah' } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'API Key belum tersedia untuk generate kuis dinamis.' });
    }

    const systemInstruction = `Kamu adalah pembuat soal profesional Informatika SMK Kelas X Kurikulum Merdeka.
Buat ${count} soal kuis interaktif bertema "${topic}" dengan tingkat kesulitan "${level}".
Kriteria Soal:
- Soal harus memiliki konteks nyata (studi kasus sekolah, lab komputer, industri TIK, atau problem sehari-hari).
- Tipe soal: Pilihan Ganda (multiple_choice) dengan 4 opsi (A, B, C, D).
- Ada tepat 1 jawaban benar dengan pengecoh (distractor) yang logis dan masuk akal.
- Sediakan pembahasan (explanation) komprehensif mengapa jawaban tersebut benar dan konsep dasar yang terkait.
- Sediakan materi rekomendasi (reviewTopic) jika siswa salah menjawab.
- Output HANYA JSON sesuai schema yang ditentukan.`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Buatkan ${count} soal kuis Informatika SMK Kurikulum Merdeka topik "${topic}" tingkat "${level}".`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              hint: { type: Type.STRING },
              reviewTopic: { type: Type.STRING },
              topic: { type: Type.STRING },
            },
            required: ['question', 'options', 'correctIndex', 'explanation', 'hint', 'reviewTopic'],
          },
        },
      },
    });

    const rawJson = response.text?.trim() || '[]';
    const parsed = JSON.parse(rawJson);

    // Validate structure
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('Format soal yang dihasilkan tidak valid.');
    }

    const sanitized = parsed.map((item, idx) => ({
      id: item.id || `dyn-q-${Date.now()}-${idx}`,
      type: 'multiple_choice',
      topic: item.topic || topic,
      question: item.question,
      options: item.options,
      correctIndex: typeof item.correctIndex === 'number' && item.correctIndex >= 0 && item.correctIndex < item.options.length ? item.correctIndex : 0,
      explanation: item.explanation || 'Pembahasan konsep dasar materi.',
      hint: item.hint || 'Ingat prinsip dasar materi ini.',
      reviewTopic: item.reviewTopic || topic,
    }));

    return res.json({ success: true, questions: sanitized });
  } catch (err: any) {
    console.error('Quiz Gen Error:', err);
    return res.status(500).json({
      error: 'Gagal membuat kuis dinamis secara otomatis.',
      details: err?.message,
    });
  }
});

// 3. AI Creator Studio Assistance Endpoint
app.post('/api/ai/creator-assist', async (req, res) => {
  try {
    const { projectType, title, theme, goal, targetAudience, studentIdeas } = req.body;

    const systemInstruction = `Kamu adalah Creative Mentor untuk siswa kelas X SMK Informatika di "AI Creator Studio".
Tugasmu adalah membantu siswa merancang draf karya digital berkualitas tinggi.
Jenis Karya: ${projectType}
Judul/Topik: ${title || theme}
Tujuan: ${goal}
Target Audiens: ${targetAudience}
Gagasan Awal Siswa: ${studentIdeas || 'Belum ada, butuh panduan ide awal'}

ATURAN PENTING:
- Jangan membuat karya yang selesai 100% tanpa ruang bagi siswa.
- Berikan kerangka struktur (outline), ide poin-poin visual/teks, slogan atau call-to-action yang kuat.
- Berikan catatan etika & sumber informasi (agar siswa terbiasa mencantumkan rujukan dan tidak plagiat).
- Gunakan bahasa Indonesia inspiratif dan terstruktur rapi dengan markdown headings, bullet points, dan checklist.`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        content: `### Draf Rancangan Proyek: ${title || theme || projectType}\n\n**1. Sasaran Utama:** ${goal || 'Meningkatkan literasi TIK di sekolah'}\n**2. Struktur Konten:**\n- **Hook/Pembuka:** Judul menarik untuk ${targetAudience || 'siswa SMK'}\n- **Poin Kunci 1:** Identifikasi masalah nyata\n- **Poin Kunci 2:** Solusi praktis & langkah aksi\n- **Call-to-Action:** Ajak pembaca mulai hari ini\n\n**3. Panduan untuk Siswa:**\nTambahkan pengalaman pribadimu di bagian solusi dan cantumkan sumber referensi terpercaya!`,
      });
    }

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Bantu saya merancang proyek ${projectType} dengan judul "${title}", tema "${theme}", tujuan "${goal}", dan target audiens "${targetAudience}". Ide awal saya: "${studentIdeas}". Berikan kerangka terstruktur, ide konten kreatif, dan saran visual/audio.`,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    return res.json({
      success: true,
      content: response.text || 'Gagal menghasilkan draf konten.',
    });
  } catch (err: any) {
    console.error('Creator Studio Error:', err);
    return res.status(500).json({
      error: 'Gagal memproses panduan kreasi AI.',
      details: err?.message,
    });
  }
});

// 4. AI Reflection Formative Feedback Endpoint
app.post('/api/ai/evaluate-reflection', async (req, res) => {
  try {
    const { answers, missionTitle = 'Misi Informatika' } = req.body;

    const systemInstruction = `Kamu adalah Guru Pembina Informatika SMK yang ramah dan bijak.
Berikan umpan balik formatif terhadap lembar refleksi belajar siswa kelas X SMK pada misi "${missionTitle}".
PEDAGOGIS:
- JANGAN menilai atau menghakimi kepribadian siswa!
- Nilai secara konstruktif berdasarkan:
  1. Pemahaman konsep yang diutarakan.
  2. Kedalaman analisis dan kejujuran dalam mengidentifikasi kesulitan.
  3. Kemampuan berpikir kritis dalam menilai bantuan AI (apakah ada hal yang perlu dikoreksi/diverifikasi).
  4. Rencana aksi konkret penerapan ilmu di sekolah / kehidupan nyata.
- Format respon dalam 3 bagian singkat:
  * Apresiasi & Catatan Positif (1-2 kalimat)
  * Umpan Balik Pemahaman Konsep (poin praktis)
  * Saran Langkah Pengembangan Selanjutnya (1 saran actionable)`;

    const promptText = `Berikut adalah lembar refleksi siswa untuk "${missionTitle}":
1. Hal baru yang dipelajari: ${answers.q1 || '-'}
2. Bagian paling menantang: ${answers.q2 || '-'}
3. Cara AI membantu belajar: ${answers.q3 || '-'}
4. Temuan jawaban AI yang perlu dikoreksi/diverifikasi: ${answers.q4 || '-'}
5. Rencana penerapan pengetahuan: ${answers.q5 || '-'}`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        feedback: `### Umpan Balik Guru AI (Mode Demo)\n\n**Apresiasi:** Refleksi yang sangat baik! Kamu telah mengidentifikasi tantangan dan cara belajar secara mandiri.\n\n**Penguatan Konsep:** Terus kembangkan pemikiran komputasional dengan mencoba menerapkannya pada kasus nyata di jurusannmu.\n\n**Saran Aksi:** Coba diskusikan dengan teman sekelas mengenai hasil verifikasi jawaban AI untuk saling memperkaya wawasan!`,
      });
    }

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    return res.json({
      success: true,
      feedback: response.text || 'Terima kasih atas refleksimu yang mendalam!',
    });
  } catch (err: any) {
    console.error('Reflection Feedback Error:', err);
    return res.status(500).json({
      error: 'Gagal menghasilkan umpan balik refleksi.',
      details: err?.message,
    });
  }
});

// Setup Vite middleware for development or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI LEARNING ADVENTURE] Server listening on port ${PORT}`);
  });
}

startServer();
