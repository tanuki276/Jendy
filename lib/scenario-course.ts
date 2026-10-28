import type { Lesson } from './learning-content';
// Slashes explicitly mark authored phrase chunks for the word-order game.
type Example = [ja: string, id: string, whyJa: string, whyId: string];
type Scenario = [slug: string, titleJa: string, titleId: string, rows: Example[]];
export const scenarios: Scenario[] = [
['train-ticket','切符と乗り換え','Tiket dan transit',[
['バンドンまでの/切符を/二枚/ください','Minta/dua tiket/ke Bandung','dua tiket は切符二枚。目的地は ke で示します。','まで menunjukkan tujuan perjalanan; 二枚 adalah dua lembar tiket.'],
['どこで/乗り換えれば/いいですか？','Di mana/saya harus/transit?','乗り換える場所を di mana で尋ねます。harus はここでは必要な手順。','どこで menanyakan tempat kegiatan; 乗り換えればいいですか menanyakan cara yang tepat.'],
['この電車は/空港に/止まりますか？','Apakah/kereta ini/berhenti/di bandara?','berhenti di は停車地点。目的地へ向かう ke と区別します。','止まりますか menanyakan apakah kereta berhenti; に menandai titik berhenti.'],
]],
['delivery','配達と受け取り','Pengiriman barang',[
['荷物は/まだ/届いていません','Paketnya/belum/sampai','belum sampai は未到着。まだ届く可能性がある状態です。','まだ届いていません berarti belum sampai, bukan hilang.'],
['荷物を/受付に/預けてください','Tolong/titipkan/paketnya/di resepsionis','titipkan は預ける依頼。受け取り場所を具体的に示します。','受付に預けてください meminta menitipkan paket di resepsionis.'],
['住所を/間違えて/入力しました','Saya/salah/memasukkan/alamat','salah + 動詞で、誤ってその動作をしたことを表します。','間違えて menjelaskan bahwa alamat dimasukkan secara keliru.'],
]],
['wifi','通信とWi-Fi','Koneksi dan Wi-Fi',[
['Wi-Fiの/パスワードを/教えてください','Tolong/beri tahu saya/kata sandi Wi-Fi','beri tahu は知らせる。kata sandi がパスワードです。','教えてください di sini meminta informasi, bukan pelajaran formal.'],
['インターネットに/接続できません','Saya/tidak bisa/terhubung/ke internet','tidak bisa は能力・可能性の否定。許可の否定ではありません。','接続できません memakai bentuk potensial negatif: tidak dapat tersambung.'],
['もう一度/接続してみます','Saya/akan mencoba/menyambung lagi','mencoba は試す。てみる は試しに行うことを表します。','てみます menyatakan mencoba melakukan tindakan; もう一度 berarti sekali lagi.'],
]],
['lost-property','忘れ物を説明する','Barang tertinggal',[
['電車に/かばんを/忘れました','Saya/meninggalkan tas/di kereta','meninggalkan は置いてきたこと。盗難と断定しません。','電車に忘れました berarti tas tertinggal di kereta.'],
['黒いかばんに/名前が/書いてあります','Ada nama/tertulis/di tas hitam','tertulis は書かれた状態。日本語のてあるは結果の状態です。','書いてあります menyoroti hasil tulisan yang masih ada pada tas.'],
['見つかったら/連絡して/いただけますか？','Bisa tolong/hubungi saya/kalau sudah ditemukan?','kalau sudah ditemukan で発見を条件にします。','見つかったら adalah syarat; ていただけますか meminta bantuan dengan sopan.'],
]],
['appointment','予約日時を変える','Mengubah janji',[
['予約を/金曜日に/変更したいです','Saya ingin/mengubah reservasi/ke hari Jumat','mengubah ... ke ... は変更先を示す形です。','変更したいです menyatakan keinginan mengubah; 金曜日に adalah waktu baru.'],
['午後三時は/空いていますか？','Apakah/pukul tiga sore/masih tersedia?','tersedia は利用可能な状態。sore を付けて午後を明確にします。','空いていますか di sini menanyakan slot waktu yang tersedia.'],
['予約を/キャンセルして/ください','Tolong/batalkan/reservasinya','batalkan は取り消す依頼。変更するとは異なります。','キャンセルしてください meminta pembatalan, bukan perubahan waktu.'],
]],
['exchange-money','両替と手数料','Menukar uang',[
['円を/ルピアに/両替したいです','Saya ingin/menukar yen/ke rupiah','menukar A ke B は A から B への交換です。','円をルピアに menunjukkan arah penukaran: yen menjadi rupiah.'],
['手数料は/いくら/ですか？','Berapa/biaya administrasinya?','biaya administrasi は手続きの費用。両替レートそのものとは別です。','手数料 berarti biaya layanan atau administrasi, bukan nilai tukar.'],
['領収書を/いただけますか？','Boleh saya/minta/kuitansinya?','minta は求める。Boleh saya ... で丁寧に依頼します。','いただけますか adalah permintaan sopan untuk menerima sesuatu.'],
]],
['restaurant-detail','注文の細かい希望','Permintaan saat memesan',[
['砂糖を/入れないで/ください','Tolong/jangan tambahkan/gula','jangan は禁止・否定の依頼。gula は砂糖です。','入れないでください meminta agar bahan tidak ditambahkan.'],
['氷は/少なめに/してください','Tolong/kurangi/esnya','kurangi は減らす。全部なしにする意味ではありません。','少なめに berarti jumlah lebih sedikit, bukan tanpa es.'],
['別々に/払っても/いいですか？','Boleh/kami bayar/sendiri-sendiri?','sendiri-sendiri は各自別々に。kami は聞き手を含まない私たち。','別々に払ってもいいですか meminta izin membayar secara terpisah.'],
]],
['work-deadline','締切と進捗を伝える','Tenggat dan progres',[
['明日の朝までに/報告書を/送ります','Saya akan/mengirim laporan/paling lambat besok pagi','paling lambat は遅くとも。期限のまでにと対応します。','までに menandai batas waktu; laporan akan dikirim paling lambat saat itu.'],
['確認が/まだ/終わっていません','Pemeriksaannya/belum/selesai','belum selesai はまだ完了していないこと。','まだ終わっていません menyatakan proses pemeriksaan belum selesai.'],
['締切を/延ばして/いただけますか？','Bisa tolong/perpanjang/tenggatnya?','perpanjang は延長する。丁寧な形でも承諾を前提にはしません。','延ばしていただけますか meminta perpanjangan tenggat dengan sopan.'],
]],
['learn-clarify','分からないと伝える','Meminta penjelasan',[
['この二つの単語の/違いは/何ですか？','Apa/perbedaan/dua kata ini?','perbedaan は違い。単語の個別の意味ではなく比較を尋ねます。','違いは何ですか menanyakan perbedaan dua kata, bukan artinya satu per satu.'],
['もっと簡単な言葉で/説明して/ください','Tolong/jelaskan/dengan kata-kata yang lebih sederhana','dengan は説明に使う手段。lebih sederhana はより簡単。','もっと簡単な言葉で meminta penjelasan memakai kosakata yang lebih mudah.'],
['例を/一つ/挙げてください','Tolong/berikan/satu contoh','berikan satu contoh は例を一つ示す依頼です。','例を挙げる berarti memberikan contoh, bukan menaikkan sesuatu secara harfiah.'],
]],
['invite-boundary','無理せず誘いに返事する','Menjawab ajakan',[
['土曜日なら/参加/できます','Saya bisa/ikut/kalau hari Sabtu','kalau ... は参加できる条件。単なる予定の断定ではありません。','なら menunjukkan kondisi; hari Sabtu adalah waktu ketika pembicara bisa ikut.'],
['今回は/参加を/見送ります','Kali ini/saya tidak/akan ikut','今回はと範囲を限定した断り。永久に断るとは限りません。','見送ります di sini berarti memilih tidak ikut kali ini, bukan mengantar orang.'],
['無理を/しないでね','Jangan/terlalu/memaksakan diri, ya','memaksakan diri は無理をする。親しい相手への気遣い。','無理をしないでね adalah perhatian dalam gaya akrab.'],
]],
['house-rules','家でのルールを確認','Aturan di rumah',[
['靴を/脱いだほうが/いいですか？','Sebaiknya/saya melepas sepatu?','sebaiknya は望ましい行動の確認。許可とは焦点が違います。','たほうがいいですか meminta saran tentang tindakan yang sebaiknya dilakukan.'],
['この部屋では/たばこを/吸わないでください','Tolong/jangan merokok/di kamar ini','jangan merokok は禁煙の依頼。場所の di は分けて書きます。','この部屋では membatasi tempat berlakunya larangan merokok.'],
['使った後で/片付けて/ください','Tolong/rapikan/setelah dipakai','setelah は後で。dipakai は使われるという受動形。','使った後で menunjukkan urutan: pakai dahulu, kemudian rapikan.'],
]],
['conditional-route','道案内と順序','Arah dan urutan',[
['信号を/渡ってから/右に曲がってください','Setelah menyeberang/di lampu lalu lintas,/belok kanan','setelah A, B は A の後に B をする順序です。','てから menunjukkan bahwa menyeberang dilakukan sebelum berbelok.'],
['この道を/まっすぐ/進んでください','Silakan/jalan lurus/di jalan ini','jalan はここでは歩く・進む意味。lurus はまっすぐ。','まっすぐ進んでください meminta bergerak lurus sepanjang jalan.'],
['銀行の/向かいに/あります','Letaknya/di seberang/bank','di seberang は向かい側。di sebelah の隣とは異なります。','向かいにあります menyatakan posisi di seberang bank, bukan di sebelahnya.'],
]],
['give-help','助けを申し出る','Menawarkan bantuan',[
['荷物を/持ちましょうか？','Boleh saya/bantu membawa/barang bawaan Anda?','bantu membawa は運ぶのを手伝う申し出です。','ましょうか menawarkan bantuan, bukan memerintah orang membawa barang.'],
['手伝ってくれて/ありがとう/ございます','Terima kasih/sudah/membantu saya','sudah membantu で行われた援助に感謝します。','てくれてありがとうございます berterima kasih atas tindakan orang lain untuk pembicara.'],
['自分で/できます','Saya bisa/melakukannya/sendiri','sendiri は自分で。強い言い方にすると援助を拒む印象にもなります。','自分でできます menyatakan mampu melakukan sendiri; gunakan nada sesuai konteks.'],
]],
['frequency','頻度を正確に伝える','Frekuensi kegiatan',[
['週に/二回/運動します','Saya berolahraga/dua kali/seminggu','dua kali seminggu は一週間に二回。dua minggu は二週間です。','週に二回 berarti dua kali dalam seminggu, bukan selama dua minggu.'],
['最近は/ほとんど/テレビを見ません','Belakangan ini/saya hampir tidak/pernah menonton televisi','hampir tidak pernah はほとんどしない頻度。完全なゼロとは限りません。','ほとんど〜ません menyatakan sangat jarang, bukan selalu tidak pernah.'],
['毎日/少しずつ/練習しています','Saya berlatih/sedikit demi sedikit/setiap hari','sedikit demi sedikit は少しずつ。量を小さく積み重ねます。','少しずつ menjelaskan kemajuan bertahap; 毎日 menjelaskan frekuensi.'],
]],
['evidence','推測と根拠を分ける','Dugaan dan alasan',[
['電気がついているので/誰か/いるようです','Sepertinya/ada orang/karena lampunya menyala','sepertinya は推測。理由を karena で示しています。','ようです menandai dugaan berdasarkan lampu yang menyala, bukan kepastian.'],
['予報によると/明日は/晴れるそうです','Menurut prakiraan cuaca,/besok/akan cerah','menurut は情報源。予報から得た情報を伝えます。','によると menunjukkan sumber; そうです di sini menyampaikan informasi yang didengar.'],
['本当かどうかは/まだ/分かりません','Saya belum tahu/apakah itu/benar atau tidak','apakah ... atau tidak は〜かどうか。真偽を保留します。','かどうか menyatakan pertanyaan ya/tidak yang tertanam dalam kalimat.'],
]],
['repair','修理と交換を頼む','Perbaikan dan penukaran',[
['この商品は/届いたときから/壊れていました','Barang ini/sudah rusak/sejak tiba','sejak tiba は到着時から。故障がいつからかを具体化します。','届いたときから menjelaskan sejak kapan kondisi rusak ada.'],
['同じ商品と/交換/できますか？','Bisa/ditukar/dengan barang yang sama?','ditukar は交換される。返金の依頼とは異なります。','交換できますか menanyakan kemungkinan penukaran, bukan pengembalian uang.'],
['修理には/何日くらい/かかりますか？','Kira-kira berapa hari/yang diperlukan/untuk perbaikan?','kira-kira はおよそ。修理の所要日数を尋ねます。','何日くらいかかりますか menanyakan perkiraan durasi dalam hari.'],
]],
];
export const scenarioLessons: Lesson[] = scenarios.map(([slug,titleJa,titleId,rows],index)=>{
 const id=`scenario-${slug}`;
 const phrases=rows.map(([ja,id,noteJa,noteId])=>({ja:ja.replaceAll('/',''),id:id.replaceAll('/',' '),noteJa,noteId}));
 return {id,level:`${index>=14?'B1':'A2'} · Mission ${index+1}`,category:'Missions',titleJa,titleId,descriptionJa:'場面に合う表現を選び、語順を組み立て、理由を確認するミッション。',descriptionId:'Pilih ungkapan sesuai situasi dan pahami susunan serta alasannya.',minutes:10,grammarJa:rows.map(r=>r[2]).join(' '),grammarId:rows.map(r=>r[3]).join(' '),phrases,quiz:phrases.map((p,i)=>{const rotate=(a:string[])=>a.slice(i).concat(a.slice(0,i));return {id:`${id}-${i}`,promptJa:`「${p.ja}」に対応する表現は？`,promptId:`Pilih terjemahan: ${p.id}`,choicesJa:rotate(phrases.map(x=>x.ja)),choicesId:rotate(phrases.map(x=>x.id)),answerJa:p.ja,answerId:p.id,explanationJa:p.noteJa,explanationId:p.noteId}})};
});
const scenarioOrderQuestions=scenarios.flatMap(([slug,titleJa,titleId,rows])=>rows.map(([ja,id,noteJa,noteId],i)=>({id:`scenario-${slug}-${i}`,lessonId:`scenario-${slug}`,phraseIndex:i,titleJa,titleId,ja:ja.replaceAll('/',''),idText:id.replaceAll('/',' '),jaChunks:ja.split('/'),idChunks:id.split('/'),noteJa,noteId})));

const basicOrderQuestions = [
 {id:"order-coffee",lessonId:"sentence-01",phraseIndex:0,titleJa:"主語・動詞・目的語",titleId:"Subjek, verba, objek",ja:"私はコーヒーを飲みます",idText:"Saya minum kopi",jaChunks:["私は","コーヒーを","飲みます"],idChunks:["Saya","minum","kopi"],noteJa:"Saya（私）→ minum（飲む）→ kopi（コーヒー）の順。日本語では動詞が文末に来ます。",noteId:"Urutan Indonesia adalah subjek–verba–objek; bahasa Jepang menempatkan verba di akhir."},
 {id:"order-book",lessonId:"sentence-01",phraseIndex:1,titleJa:"読む人と読むもの",titleId:"Pelaku dan objek bacaan",ja:"彼は本を読みます",idText:"Dia membaca buku",jaChunks:["彼は","本を","読みます"],idChunks:["Dia","membaca","buku"],noteJa:"Dia が読む人、membaca が動作、buku が対象です。",noteId:"彼は adalah topik; 本を adalah objek; 読みます adalah verba."},
 {id:"order-possession",lessonId:"sentence-01",phraseIndex:2,titleJa:"所有者は名詞の後ろ",titleId:"Letak pemilik",ja:"これは私の本です",idText:"Ini buku saya",jaChunks:["これは","私の","本です"],idChunks:["Ini","buku","saya"],noteJa:"buku saya は本＋私。日本語の私の本と修飾の順序が違います。",noteId:"私の本 menempatkan pemilik sebelum benda, berbeda dari buku saya."},
];
export const wordOrderQuestions = [...basicOrderQuestions, ...scenarioOrderQuestions];
