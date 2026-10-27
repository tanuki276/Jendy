export type Direction = "ja-id" | "id-ja";

export type Phrase = {
  ja: string;
  id: string;
  reading?: string;
  noteJa: string;
  noteId: string;
};

export type QuizQuestion = {
  id: string;
  promptJa: string;
  promptId: string;
  choicesJa: string[];
  choicesId: string[];
  answerJa: string;
  answerId: string;
  explanationJa: string;
  explanationId: string;
};

export type Lesson = {
  id: string;
  level: string;
  titleJa: string;
  titleId: string;
  descriptionJa: string;
  descriptionId: string;
  minutes: number;
  grammarJa: string;
  grammarId: string;
  phrases: Phrase[];
  quiz: QuizQuestion[];
};

export const lessons: Lesson[] = [
  {
    id: "greetings-01",
    level: "A1 · 01",
    titleJa: "あいさつと自己紹介",
    titleId: "Salam & perkenalan",
    descriptionJa: "時間帯のあいさつ、名前、出身を自然に伝える。",
    descriptionId: "Belajar salam, nama, dan asal dengan ungkapan alami.",
    minutes: 12,
    grammarJa: "インドネシア語は主語を省略することもありますが、最初は saya（私）を軸に組み立てると安定します。selamat は時間帯のあいさつで頻出です。",
    grammarId: "Dalam bahasa Jepang, ungkapan perkenalan berubah menurut tingkat kesopanan. Mulailah dari pola sopan です／ます agar aman dipakai dalam banyak situasi.",
    phrases: [
      { ja: "おはようございます", id: "Selamat pagi", reading: "sə-la-mat pa-gi", noteJa: "朝の丁寧なあいさつ。", noteId: "Salam sopan pada pagi hari." },
      { ja: "私の名前はユキです", id: "Nama saya Yuki", reading: "na-ma sa-ya yu-ki", noteJa: "saya は丁寧で標準的な「私」。", noteId: "saya adalah bentuk netral dan sopan untuk ‘saya’." },
      { ja: "日本から来ました", id: "Saya dari Jepang", reading: "sa-ya da-ri jə-paŋ", noteJa: "会話ではこの簡潔な形が自然。", noteId: "Bentuk ringkas ini alami dalam percakapan." },
    ],
    quiz: [
      { id: "g1", promptJa: "「おはようございます」は？", promptId: "Apa arti “Selamat pagi”?", choicesJa: ["おはようございます", "こんばんは", "ありがとう"], choicesId: ["Selamat pagi", "Selamat malam", "Terima kasih"], answerJa: "おはようございます", answerId: "Selamat pagi", explanationJa: "pagi は「朝」。selamat pagi で朝のあいさつです。", explanationId: "pagi berarti pagi; selamat pagi adalah salam pagi." },
      { id: "g2", promptJa: "「私の名前はユキです」は？", promptId: "Apa arti “Nama saya Yuki”?", choicesJa: ["私はユキです", "私は東京です", "私は学生です"], choicesId: ["Nama saya Yuki", "Saya dari Yuki", "Yuki di mana"], answerJa: "私はユキです", answerId: "Nama saya Yuki", explanationJa: "nama = 名前、saya = 私。", explanationId: "nama berarti nama dan saya berarti saya." },
      { id: "g3", promptJa: "「日本から来ました」は？", promptId: "Apa arti “Saya dari Jepang”?", choicesJa: ["日本から来ました", "日本へ行きます", "日本語を話します"], choicesId: ["Saya dari Jepang", "Saya ke Jepang", "Saya bicara Jepang"], answerJa: "日本から来ました", answerId: "Saya dari Jepang", explanationJa: "dari は「〜から」。", explanationId: "dari menunjukkan asal, seperti ‘dari’." },
    ],
  },
  {
    id: "sentence-01",
    level: "A1 · 02",
    titleJa: "語順と基本文",
    titleId: "Urutan kata dasar",
    descriptionJa: "インドネシア語のSVOと、日本語のSOVの違いを体で覚える。",
    descriptionId: "Pahami perbedaan pola SVO bahasa Indonesia dan SOV bahasa Jepang.",
    minutes: 16,
    grammarJa: "基本語順は SVO（主語＋動詞＋目的語）。日本語の「私は コーヒーを 飲みます」に対して Saya minum kopi の順になります。",
    grammarId: "Bahasa Jepang pada dasarnya memakai pola SOV. Partikel seperti は dan を menandai peran kata, sehingga urutan terasa berbeda dari bahasa Indonesia.",
    phrases: [
      { ja: "私はコーヒーを飲みます", id: "Saya minum kopi", reading: "sa-ya mi-num ko-pi", noteJa: "Saya + minum + kopi の順。", noteId: "Pola: subjek + verba + objek." },
      { ja: "彼は本を読みます", id: "Dia membaca buku", reading: "di-a məm-ba-ca bu-ku", noteJa: "membaca は baca から作る能動動詞。", noteId: "membaca adalah bentuk aktif dari baca." },
      { ja: "これは私の本です", id: "Ini buku saya", reading: "i-ni bu-ku sa-ya", noteJa: "所有者は名詞の後ろ。", noteId: "Pemilik biasanya berada setelah nomina." },
    ],
    quiz: [
      { id: "s1", promptJa: "Saya minum kopi の語順は？", promptId: "Urutan “私はコーヒーを飲みます” dalam bahasa Jepang?", choicesJa: ["私はコーヒーを飲みます", "私は飲みますコーヒーを", "コーヒー私は飲みます"], choicesId: ["Saya minum kopi", "Saya kopi minum", "Minum saya kopi"], answerJa: "私はコーヒーを飲みます", answerId: "Saya minum kopi", explanationJa: "インドネシア語は SVO、日本語は SOV が基本。", explanationId: "Indonesia memakai SVO, Jepang memakai SOV." },
      { id: "s2", promptJa: "「彼は本を読みます」は？", promptId: "Apa arti “Dia membaca buku”?", choicesJa: ["彼は本を読みます", "彼は本を書きます", "彼は本を買います"], choicesId: ["Dia membaca buku", "Dia menulis buku", "Dia membeli buku"], answerJa: "彼は本を読みます", answerId: "Dia membaca buku", explanationJa: "membaca = 読む。", explanationId: "membaca berarti membaca." },
      { id: "s3", promptJa: "「これは私の本です」は？", promptId: "Apa arti “Ini buku saya”?", choicesJa: ["これは私の本です", "これはあなたの本です", "これは本ではありません"], choicesId: ["Ini buku saya", "Ini buku Anda", "Ini bukan buku"], answerJa: "これは私の本です", answerId: "Ini buku saya", explanationJa: "buku saya = 私の本。所有者が後ろです。", explanationId: "buku saya menempatkan pemilik setelah benda." },
    ],
  },
  {
    id: "numbers-01",
    level: "A1 · 03",
    titleJa: "数字・時間・値段",
    titleId: "Angka, waktu & harga",
    descriptionJa: "買い物と待ち合わせに必要な数字表現をまとめて習得。",
    descriptionId: "Kuasai angka untuk belanja, waktu, dan membuat janji.",
    minutes: 14,
    grammarJa: "berapa は数量や値段を尋ねる万能語。時刻は jam + 数字、千は ribu を使います。",
    grammarId: "Dalam bahasa Jepang, angka berubah bunyi pada beberapa penghitung. Untuk tahap awal, kuasai jam, harga, dan pola いくらですか terlebih dahulu.",
    phrases: [
      { ja: "これはいくらですか？", id: "Berapa harganya?", reading: "bə-ra-pa har-ga-nya", noteJa: "berapa = いくつ／いくら。", noteId: "berapa dipakai untuk menanyakan jumlah atau harga." },
      { ja: "三時です", id: "Jam tiga", reading: "jam ti-ga", noteJa: "jam + 数字で時刻。", noteId: "Gunakan jam + angka untuk waktu." },
      { ja: "二万ルピア", id: "Dua puluh ribu rupiah", reading: "du-a pu-luh ri-bu ru-pi-ah", noteJa: "ribu = 千。", noteId: "ribu berarti seribu." },
    ],
    quiz: [
      { id: "n1", promptJa: "値段を聞く表現は？", promptId: "Bagaimana mengatakan “これはいくらですか？”?", choicesJa: ["これはいくらですか？", "これは何時ですか？", "これは誰ですか？"], choicesId: ["Berapa harganya?", "Jam berapa?", "Siapa ini?"], answerJa: "これはいくらですか？", answerId: "Berapa harganya?", explanationJa: "harga は値段。harganya で「その値段」。", explanationId: "harga berarti harga; berapa harganya menanyakan harga." },
      { id: "n2", promptJa: "Jam tiga は？", promptId: "Apa arti “三時です”?", choicesJa: ["三時です", "三日です", "三人です"], choicesId: ["Jam tiga", "Tiga hari", "Tiga orang"], answerJa: "三時です", answerId: "Jam tiga", explanationJa: "jam は時刻・時間。", explanationId: "jam dipakai untuk menyatakan waktu/jam." },
      { id: "n3", promptJa: "ribu の意味は？", promptId: "Apa arti “二万ルピア”?", choicesJa: ["千", "百", "十"], choicesId: ["Dua puluh ribu rupiah", "Dua ratus rupiah", "Dua puluh rupiah"], answerJa: "千", answerId: "Dua puluh ribu rupiah", explanationJa: "ribu は千。dua puluh ribu = 20,000。", explanationId: "ribu berarti seribu; dua puluh ribu = 20.000." },
    ],
  },
  {
    id: "daily-01",
    level: "A1 · 04",
    titleJa: "毎日の動作",
    titleId: "Kegiatan sehari-hari",
    descriptionJa: "食べる、行く、働く、勉強するを使って一日を話す。",
    descriptionId: "Ceritakan rutinitas dengan makan, pergi, bekerja, dan belajar.",
    minutes: 18,
    grammarJa: "時間表現は文頭にも文末にも置けます。di は場所、setiap は「毎〜」を表します。",
    grammarId: "Dalam bahasa Jepang, waktu sering ditandai に, sedangkan lokasi kegiatan memakai で. Pola ini sangat penting untuk rutinitas harian.",
    phrases: [
      { ja: "毎朝六時に起きます", id: "Saya bangun jam enam setiap pagi", noteJa: "setiap = 毎〜。", noteId: "setiap berarti setiap." },
      { ja: "会社で働きます", id: "Saya bekerja di kantor", noteJa: "di = 場所を表す「〜で／に」。", noteId: "di menandai lokasi." },
      { ja: "夜にインドネシア語を勉強します", id: "Malam hari saya belajar bahasa Indonesia", noteJa: "時間は文頭にも置ける。", noteId: "Keterangan waktu dapat diletakkan di awal." },
    ],
    quiz: [
      { id: "d1", promptJa: "setiap pagi は？", promptId: "Apa arti “毎朝”?", choicesJa: ["毎朝", "毎晩", "毎週"], choicesId: ["setiap pagi", "setiap malam", "setiap minggu"], answerJa: "毎朝", answerId: "setiap pagi", explanationJa: "setiap = 毎、pagi = 朝。", explanationId: "setiap = setiap, pagi = pagi." },
      { id: "d2", promptJa: "「会社で働きます」は？", promptId: "Apa arti “Saya bekerja di kantor”?", choicesJa: ["会社で働きます", "会社へ行きます", "会社を辞めます"], choicesId: ["Saya bekerja di kantor", "Saya pergi ke kantor", "Saya keluar dari kantor"], answerJa: "会社で働きます", answerId: "Saya bekerja di kantor", explanationJa: "bekerja = 働く、di kantor = 会社で。", explanationId: "bekerja berarti bekerja; di kantor menunjukkan lokasi." },
      { id: "d3", promptJa: "「夜に勉強します」は？", promptId: "Apa arti “夜に勉強します”?", choicesJa: ["夜に勉強します", "朝に勉強します", "夜に寝ます"], choicesId: ["Malam hari saya belajar", "Pagi hari saya belajar", "Malam hari saya tidur"], answerJa: "夜に勉強します", answerId: "Malam hari saya belajar", explanationJa: "malam hari = 夜、belajar = 勉強する。", explanationId: "malam hari berarti malam, belajar berarti belajar." },
    ],
  },
  {
    id: "travel-01",
    level: "A2 · 01",
    titleJa: "移動と旅行",
    titleId: "Perjalanan & transportasi",
    descriptionJa: "空港、配車、ホテルで困らないための実用表現。",
    descriptionId: "Ungkapan praktis untuk bandara, transportasi, dan hotel.",
    minutes: 20,
    grammarJa: "di mana は「どこ」、di sini は「ここ」。sudah は完了済みを表す重要語です。",
    grammarId: "Dalam bahasa Jepang, どこですか, ここで, 予約しています adalah pola praktis yang langsung bisa dipakai saat bepergian.",
    phrases: [
      { ja: "駅はどこですか？", id: "Stasiun di mana?", noteJa: "di mana = どこ。", noteId: "di mana berarti di mana." },
      { ja: "ここで降ります", id: "Saya turun di sini", noteJa: "turun = 降りる。", noteId: "turun berarti turun dari kendaraan." },
      { ja: "予約しています", id: "Saya sudah reservasi", noteJa: "sudah = すでに／完了。", noteId: "sudah menandai sesuatu telah dilakukan." },
    ],
    quiz: [
      { id: "t1", promptJa: "「駅はどこですか？」は？", promptId: "Apa arti “Stasiun di mana?”", choicesJa: ["駅はどこですか？", "駅は遠いですか？", "駅へ行きますか？"], choicesId: ["Stasiun di mana?", "Stasiun jauh?", "Pergi ke stasiun?"], answerJa: "駅はどこですか？", answerId: "Stasiun di mana?", explanationJa: "di mana は場所を尋ねる表現。", explanationId: "di mana dipakai untuk menanyakan lokasi." },
      { id: "t2", promptJa: "「ここで降ります」は？", promptId: "Apa arti “Saya turun di sini”?", choicesJa: ["ここで降ります", "ここで待ちます", "ここで食べます"], choicesId: ["Saya turun di sini", "Saya tunggu di sini", "Saya makan di sini"], answerJa: "ここで降ります", answerId: "Saya turun di sini", explanationJa: "turun = 降りる、di sini = ここで。", explanationId: "turun = turun, di sini = di sini." },
      { id: "t3", promptJa: "sudah のニュアンスは？", promptId: "Apa arti “予約しています”?", choicesJa: ["すでに／完了", "まだ", "たぶん"], choicesId: ["Saya sudah reservasi", "Saya belum reservasi", "Mungkin saya reservasi"], answerJa: "すでに／完了", answerId: "Saya sudah reservasi", explanationJa: "sudah は行為が済んでいることを示します。", explanationId: "sudah menunjukkan tindakan sudah selesai." },
    ],
  },
  {
    id: "conversation-01",
    level: "A2 · 02",
    titleJa: "会話をつなぐ",
    titleId: "Menyambung percakapan",
    descriptionJa: "相づち、聞き返し、理由説明で短文から会話へ。",
    descriptionId: "Gunakan respons, klarifikasi, dan alasan agar percakapan lebih alami.",
    minutes: 22,
    grammarJa: "tolong で依頼を柔らかくし、apa maksudnya? で意味を確認、karena で理由をつなげます。",
    grammarId: "Dalam bahasa Jepang, permintaan sopan memakai お願いします, klarifikasi memakai どういう意味ですか, dan alasan sering memakai からです.",
    phrases: [
      { ja: "もう一度お願いします", id: "Tolong ulangi sekali lagi", noteJa: "tolong = 〜してください。", noteId: "tolong membuat permintaan lebih sopan." },
      { ja: "どういう意味ですか？", id: "Apa maksudnya?", noteJa: "maksud = 意味／意図。", noteId: "maksud berarti arti atau maksud." },
      { ja: "なぜなら、仕事があるからです", id: "Karena saya harus bekerja", noteJa: "karena = なぜなら／〜なので。", noteId: "karena memperkenalkan alasan." },
    ],
    quiz: [
      { id: "c1", promptJa: "丁寧に「もう一度」と頼むには？", promptId: "Apa arti “Tolong ulangi sekali lagi”?", choicesJa: ["もう一度お願いします", "もう終わりました", "少し待ちます"], choicesId: ["Tolong ulangi sekali lagi", "Sudah selesai", "Tunggu sebentar"], answerJa: "もう一度お願いします", answerId: "Tolong ulangi sekali lagi", explanationJa: "tolong は依頼を丁寧にする語。", explanationId: "tolong membuat permintaan lebih sopan." },
      { id: "c2", promptJa: "Apa maksudnya? は？", promptId: "Bagaimana mengatakan “どういう意味ですか？”?", choicesJa: ["どういう意味ですか？", "どこへ行きますか？", "何時ですか？"], choicesId: ["Apa maksudnya?", "Mau ke mana?", "Jam berapa?"], answerJa: "どういう意味ですか？", answerId: "Apa maksudnya?", explanationJa: "maksud は意味・意図。", explanationId: "maksud berarti arti atau maksud." },
      { id: "c3", promptJa: "理由を導く karena は？", promptId: "Kata untuk memperkenalkan alasan?", choicesJa: ["〜なので／なぜなら", "しかし", "そして"], choicesId: ["karena", "tetapi", "dan"], answerJa: "〜なので／なぜなら", answerId: "karena", explanationJa: "karena は理由を導きます。", explanationId: "karena memperkenalkan alasan." },
    ],
  },
];

export function getLesson(lessonId: string) {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function sourceText(direction: Direction, phrase: Phrase) {
  return direction === "ja-id" ? phrase.ja : phrase.id;
}

export function targetText(direction: Direction, phrase: Phrase) {
  return direction === "ja-id" ? phrase.id : phrase.ja;
}
