import type { Lesson, Phrase, QuizQuestion } from "./learning-content";

// Every row is authored: translation, two distractors in EACH direction, and
// a bilingual explanation. No LLM calls, empty future units, or random word swaps.
type Row = [ja: string, id: string, wrongJa: [string, string], wrongId: [string, string], whyJa: string, whyId: string];
type Unit = [slug: string, level: "A1" | "A2" | "B1", category: string, titleJa: string, titleId: string, ruleJa: string, ruleId: string, rows: Row[]];

export const units: Unit[] = [
["already", "A1", "Foundation", "もう・まだ：sudah / belum", "Sudah dan belum", "sudah は成立済み、belum はまだ成立していない状態。日本語の過去形と一対一には対応しません。", "sudah menyatakan keadaan yang telah tercapai; belum berarti belum tercapai. Bentuk lampau Jepang tidak selalu sama dengan sudah.", [
["私はもう食べました", "Saya sudah makan", ["私はまだ食べていません", "私はまだ食べています"], ["Saya belum makan", "Saya masih makan"], "sudah は食事が済んだことを示します。", "もう〜ました menandai tindakan yang telah selesai."],
["私はまだ食べていません", "Saya belum makan", ["私はもう食べました", "私は食べません"], ["Saya sudah makan", "Saya tidak makan"], "belum は未完了。tidak は一般的な否定です。", "まだ〜ていません berarti belum; 〜ません saja tidak selalu berarti belum."],
["もう準備できていますか？", "Sudah siap?", ["まだ準備できていません", "準備しないでください"], ["Belum siap", "Jangan bersiap"], "状態が成立したかを sudah で尋ねます。", "もう〜ていますか menanyakan apakah keadaan sudah tercapai."],
]],
["ongoing", "A1", "Foundation", "継続と進行：masih / sedang", "Masih dan sedang", "sedang は進行中、masih は継続中。日本語の「ている」だけでは区別が表れない場合があります。", "sedang menyoroti proses; masih menyoroti kelanjutan. Bahasa Jepang sering memakai ている untuk keduanya.", [
["私は今勉強しています", "Saya sedang belajar", ["私はもう勉強しました", "私は勉強したことがあります"], ["Saya sudah belajar", "Saya pernah belajar"], "sedang は今進行している動作を示します。", "今〜ています menunjukkan proses yang sedang berlangsung."],
["彼はまだ寝ています", "Dia masih tidur", ["彼はもう起きました", "彼は寝ません"], ["Dia sudah bangun", "Dia tidak tidur"], "masih で寝ている状態が続くことを強調します。", "まだ〜ています menegaskan keadaan yang masih berlanjut."],
["私はまだここで働いています", "Saya masih bekerja di sini", ["私はもうここで働いていません", "私はここで働いたことがあります"], ["Saya tidak bekerja di sini lagi", "Saya pernah bekerja di sini"], "masih と tidak ... lagi は継続と終了の対比です。", "まだ働いています berarti masih bekerja, bukan sudah berhenti."],
]],
["experience", "A1", "Foundation", "経験：pernah / たことがある", "Pengalaman: たことがある", "pernah は経験の有無。いつ起きたかを述べる過去の出来事とは区別します。", "たことがある menyatakan pengalaman, berbeda dari menceritakan satu kejadian lampau.", [
["私はバリに行ったことがあります", "Saya pernah ke Bali", ["私は今バリにいます", "私はバリに行ったことがありません"], ["Saya sekarang di Bali", "Saya belum pernah ke Bali"], "pernah ke は訪れた経験。移動動詞が省かれる自然な形です。", "行ったことがあります menyatakan pengalaman pernah pergi."],
["私は納豆を食べたことがありません", "Saya belum pernah makan natto", ["私は納豆を食べたことがあります", "私は今納豆を食べています"], ["Saya pernah makan natto", "Saya sedang makan natto"], "belum pernah で今まで経験がないことを示します。", "食べたことがありません menyatakan belum pernah, bukan sedang makan."],
["日本に行ったことがありますか？", "Pernah ke Jepang?", ["今日本にいますか？", "明日日本に行きますか？"], ["Sekarang di Jepang?", "Besok ke Jepang?"], "経験を尋ねる疑問文で、主語は文脈から省けます。", "たことがありますか menanyakan pengalaman tanpa menentukan waktunya."],
]],
["location", "A1", "Foundation", "場所と移動：di / ke / dari", "Lokasi dan arah", "di は位置、ke は目的地、dari は起点。日本語では動詞に合わせて助詞を選びます。", "di menandai lokasi, ke tujuan, dari asal. Partikel Jepang bergantung pada hubungan dengan verba.", [
["私は家にいます", "Saya di rumah", ["私は家へ行きます", "私は家から来ました"], ["Saya pergi ke rumah", "Saya dari rumah"], "存在の場所は di、日本語では「に」。", "いる memakai に untuk tempat keberadaan."],
["私は市場へ行きます", "Saya pergi ke pasar", ["私は市場にいます", "私は市場から来ました"], ["Saya di pasar", "Saya dari pasar"], "移動先なので ke。日本語では「へ」も「に」も使えます。", "へ menandai arah; に juga dapat menandai tujuan pergi."],
["私はバンドンから来ました", "Saya dari Bandung", ["私はバンドンへ行きます", "私はバンドンに住んでいます"], ["Saya pergi ke Bandung", "Saya tinggal di Bandung"], "dari は出発地や出身を示します。", "から menunjukkan asal; bukan tujuan atau tempat tinggal."],
]],
["topic", "A1", "Foundation", "話題と主語：は / が", "Topik は dan subjek が", "は は話題、が は主語や新情報を示します。「は＝saya」のような単語対応では覚えません。", "は menandai topik; が menandai subjek atau informasi yang disorot. Keduanya bukan terjemahan kata ganti.", [
["私は学生です", "Saya pelajar", ["私は先生です", "私は会社員です"], ["Saya guru", "Saya pegawai kantor"], "私は で自分を話題にし、学生です と説明します。", "私は menjadikan saya sebagai topik; 学生です menjelaskan status."],
["誰が来ますか？", "Siapa yang akan datang?", ["誰が帰りますか？", "誰が待っていますか？"], ["Siapa yang akan pulang?", "Siapa yang sedang menunggu?"], "誰が では、来る人という未知の情報を尋ねます。", "誰が menanyakan identitas subjek yang belum diketahui."],
["雨が降っています", "Hujan sedang turun", ["雪が降っています", "雨がやみました"], ["Salju sedang turun", "Hujan sudah berhenti"], "雨が で起きている現象の主語を示します。", "が menandai subjek fenomena yang sedang dilaporkan."],
]],
["activity-place", "A1", "Foundation", "存在のに・動作ので", "に dan で untuk tempat", "存在する場所は「に」、動作を行う場所は「で」。インドネシア語は両方に di を使います。", "に untuk keberadaan, で untuk tempat kegiatan. Bahasa Indonesia dapat memakai di untuk keduanya.", [
["図書館で本を読みます", "Saya membaca buku di perpustakaan", ["図書館に本があります", "図書館へ本を持って行きます"], ["Ada buku di perpustakaan", "Saya membawa buku ke perpustakaan"], "読むという動作の場所なので「で」。", "Membaca adalah kegiatan, maka tempatnya memakai で."],
["机の上に本があります", "Ada buku di atas meja", ["机の下に本があります", "机の上で本を読みます"], ["Ada buku di bawah meja", "Saya membaca buku di atas meja"], "あるという存在の場所なので「に」。", "あります menyatakan keberadaan, sehingga memakai に."],
["公園で走ります", "Saya berlari di taman", ["公園にいます", "公園へ行きます"], ["Saya di taman", "Saya pergi ke taman"], "走るという動作の場所は「で」。", "Tempat melakukan kegiatan berlari memakai で."],
]],
["objects", "A1", "Foundation", "目的語を・好みのが", "Objek を dan kesukaan が", "動作の対象は「を」。好き・分かるなどは基本文型で「が」を使います。", "を menandai objek tindakan. Dalam pola dasar, 好き dan 分かる memakai が.", [
["私は水を飲みます", "Saya minum air", ["私は水を買います", "私は水が好きです"], ["Saya membeli air", "Saya suka air"], "飲む対象の水には「を」。", "Air adalah objek tindakan minum; gunakan を."],
["私は猫が好きです", "Saya suka kucing", ["私は猫を飼っています", "私は犬が好きです"], ["Saya memelihara kucing", "Saya suka anjing"], "好き は形容動詞で、基本文型では対象に「が」。", "好き bukan verba transitif biasa; pola dasarnya 猫が好きです."],
["日本語が分かります", "Saya mengerti bahasa Jepang", ["日本語を書きます", "日本語を教えます"], ["Saya menulis bahasa Jepang", "Saya mengajar bahasa Jepang"], "分かる の基本文型は「言語が分かる」。", "Pola dasar 分かります memakai が untuk hal yang dipahami."],
]],
["negation", "A1", "Foundation", "否定：tidak / bukan / jangan", "Tiga bentuk negasi", "tidak は動詞・形容詞の否定、bukan は主に名詞の否定、jangan は禁止です。", "tidak menegasikan verba atau adjektiva; bukan terutama nomina; jangan menyatakan larangan.", [
["私は先生ではありません", "Saya bukan guru", ["私は働きません", "私は先生です"], ["Saya tidak bekerja", "Saya guru"], "職業という名詞を否定するので bukan。", "ではありません menegasikan nomina guru."],
["私は肉を食べません", "Saya tidak makan daging", ["私は肉を食べます", "肉を食べないでください"], ["Saya makan daging", "Jangan makan daging"], "makan という動作を否定するので tidak。", "食べません adalah negasi tindakan, bukan larangan untuk orang lain."],
["ここで写真を撮らないでください", "Jangan mengambil foto di sini", ["ここで写真を撮ります", "ここで写真を撮ってもいいです"], ["Saya mengambil foto di sini", "Boleh mengambil foto di sini"], "禁止は jangan。自分が撮らないという意味ではありません。", "〜ないでください meminta orang lain tidak melakukan tindakan."],
]],
["questions", "A1", "Foundation", "疑問詞：何・誰・いつ", "Kata tanya", "apa・siapa・kapan はそれぞれ何・誰・いつ。日本語の丁寧な疑問には文末の「か」を使います。", "何, 誰, いつ berarti apa, siapa, kapan. Kalimat tanya sopan Jepang sering diakhiri か.", [
["これは何ですか？", "Ini apa?", ["これは誰のですか？", "これはどこですか？"], ["Ini punya siapa?", "Ini di mana?"], "物の正体を尋ねるので apa。", "何 menanyakan identitas benda, bukan pemilik atau tempat."],
["あの人は誰ですか？", "Siapa orang itu?", ["あの人はどこですか？", "あの人は何歳ですか？"], ["Di mana orang itu?", "Berapa umur orang itu?"], "人の正体を尋ねるのは siapa。", "誰 menanyakan identitas orang."],
["いつ出発しますか？", "Kapan berangkat?", ["どこへ行きますか？", "誰と出発しますか？"], ["Mau ke mana?", "Berangkat dengan siapa?"], "時期を尋ねるのは kapan。", "いつ menanyakan waktu, bukan tujuan atau teman perjalanan."],
]],
["possession", "A1", "Foundation", "所有：の / punya", "Kepemilikan", "日本語は所有者＋の＋物、インドネシア語は物＋所有者が基本です。", "Jepang: pemilik + の + benda. Indonesia: benda + pemilik.", [
["これは私のかばんです", "Ini tas saya", ["これはあなたのかばんです", "これは私の靴です"], ["Ini tas Anda", "Ini sepatu saya"], "tas saya は「かばん＋私」。日本語と語順が逆です。", "私のかばん menempatkan pemilik sebelum benda."],
["これは誰の本ですか？", "Ini buku siapa?", ["これは何の本ですか？", "本はどこですか？"], ["Ini buku tentang apa?", "Bukunya di mana?"], "buku siapa は所有者を尋ねます。", "誰の menanyakan pemilik, bukan isi buku."],
["私は車を持っていません", "Saya tidak punya mobil", ["私は車を持っています", "私は車を運転しません"], ["Saya punya mobil", "Saya tidak mengemudi mobil"], "所有を否定する tidak punya。", "持っていません menyatakan tidak memiliki."],
]],
["adjectives", "A1", "Foundation", "形容詞と語順", "Adjektiva dan urutan kata", "インドネシア語の修飾語は多くの場合名詞の後ろ。日本語の形容詞は名詞の前です。", "Adjektiva Indonesia umumnya setelah nomina; adjektiva Jepang sebelum nomina.", [
["大きい家", "Rumah besar", ["小さい家", "大きい車"], ["Rumah kecil", "Mobil besar"], "rumah の後ろに besar。", "大きい diletakkan sebelum 家."],
["おいしい料理", "Makanan enak", ["辛い料理", "冷たい飲み物"], ["Makanan pedas", "Minuman dingin"], "enak はおいしい。pedas は辛いという別の性質です。", "おいしい berarti enak; 辛い berarti pedas."],
["この部屋は静かです", "Kamar ini tenang", ["この部屋はうるさいです", "この部屋は狭いです"], ["Kamar ini berisik", "Kamar ini sempit"], "静か はナ形容詞。文末では静かです。", "静か adalah adjektiva-na; predikat sopannya 静かです."],
]],
["existence", "A1", "Daily Life", "ある・いる / ada", "Keberadaan", "日本語は人や動物に「いる」、物に「ある」。インドネシア語はどちらも ada です。", "いる untuk manusia atau hewan; ある untuk benda. Keduanya bisa diterjemahkan ada.", [
["部屋に猫がいます", "Ada kucing di kamar", ["部屋に机があります", "庭に猫がいます"], ["Ada meja di kamar", "Ada kucing di halaman"], "猫は動物なので「います」。", "Kucing adalah hewan, maka gunakan います."],
["駅の前に銀行があります", "Ada bank di depan stasiun", ["駅の後ろに銀行があります", "銀行の前に駅があります"], ["Ada bank di belakang stasiun", "Ada stasiun di depan bank"], "di depan は前。基準となる物が後ろです。", "駅の前 berarti di depan stasiun; bank adalah benda yang ada."],
["ここに誰かいますか？", "Ada orang di sini?", ["ここに何かありますか？", "誰もいません"], ["Ada sesuatu di sini?", "Tidak ada siapa-siapa"], "人がいるかを尋ねています。", "誰か menanyakan keberadaan seseorang; gunakan います."],
]],
["food", "A1", "Daily Life", "屋台で注文する", "Memesan di warung", "注文では mau / minta を使います。辛さや持ち帰りなど条件を具体的に伝えます。", "Untuk memesan, gunakan mau atau minta. Nyatakan tingkat pedas dan apakah dibungkus.", [
["ナシゴレンを一皿ください", "Minta nasi goreng satu porsi", ["ナシゴレンを二皿ください", "水を一杯ください"], ["Minta nasi goreng dua porsi", "Minta air satu gelas"], "一皿分の食事は satu porsi。", "一皿 menandai satu porsi makanan."],
["辛くしないでください", "Jangan pedas, ya", ["とても辛くしてください", "甘くしないでください"], ["Yang sangat pedas, ya", "Jangan manis, ya"], "注文時の jangan pedas は辛くしないでという自然な依頼。", "辛くしないでください meminta agar tidak dibuat pedas."],
["持ち帰りでお願いします", "Dibungkus, ya", ["ここで食べます", "注文を取り消します"], ["Makan di sini", "Saya batalkan pesanan"], "bungkus は包む。屋台では dibungkus で持ち帰りが伝わります。", "持ち帰りでお願いします dipakai untuk meminta makanan dibawa pulang."],
]],
["shopping", "A1", "Daily Life", "買い物と支払い", "Belanja dan pembayaran", "値段・在庫・支払い方法を分けて尋ねます。「〜できますか」はこの場面では利用可能かの確認です。", "Bedakan pertanyaan harga, stok, dan cara pembayaran. できますか bisa menanyakan ketersediaan cara bayar.", [
["カードで払えますか？", "Bisa bayar pakai kartu?", ["現金で払えますか？", "カードをなくしました"], ["Bisa bayar tunai?", "Kartu saya hilang"], "pakai は道具・手段。ここではカードを使って払う意味です。", "で menandai alat atau cara pembayaran."],
["もう少し安くできますか？", "Bisa lebih murah sedikit?", ["もう少し高くできますか？", "もっと大きい物はありますか？"], ["Bisa lebih mahal sedikit?", "Ada yang lebih besar?"], "lebih murah はより安い。値引きが適切な店で使います。", "もう少し安く meminta harga sedikit lebih rendah; sesuaikan dengan jenis toko."],
["小さいサイズはありますか？", "Ada ukuran kecil?", ["大きいサイズはありますか？", "赤い色はありますか？"], ["Ada ukuran besar?", "Ada warna merah?"], "ukuran はサイズ、warna は色です。", "小さいサイズ berarti ukuran kecil, bukan warna."],
]],
["clock", "A1", "Daily Life", "時刻と待ち合わせ", "Jam dan janji", "jam は時刻、selama は期間。日本語の具体的な時刻にはよく「に」を付けます。", "jam menunjukkan pukul; selama menunjukkan durasi. Waktu tertentu dalam bahasa Jepang sering memakai に.", [
["七時に会いましょう", "Mari bertemu jam tujuh", ["九時に会いましょう", "七時間待ちましょう"], ["Mari bertemu jam sembilan", "Mari menunggu selama tujuh jam"], "jam tujuh は七時。tujuh jam は七時間です。", "七時 adalah pukul tujuh; 七時間 adalah durasi tujuh jam."],
["あと十分待ってください", "Tolong tunggu sepuluh menit lagi", ["あと十時間待ってください", "今すぐ来てください"], ["Tolong tunggu sepuluh jam lagi", "Tolong datang sekarang"], "menit は分。lagi で追加の時間を示します。", "あと十分 berarti sepuluh menit lagi."],
["明日は休みです", "Besok libur", ["今日は休みです", "明日は仕事です"], ["Hari ini libur", "Besok bekerja"], "besok は明日。libur は休日・休みです。", "明日 berarti besok, 休み berarti libur."],
]],
["family", "A1", "Social", "家族と呼び方", "Keluarga dan sapaan", "kakak は性別を問わない年上のきょうだい。日本語では兄・姉などを区別します。", "kakak tidak menentukan gender. Jepang membedakan 兄 dan 姉, serta keluarga sendiri dan orang lain.", [
["私には姉が一人います", "Saya punya satu kakak perempuan", ["私には妹が一人います", "私には兄が一人います"], ["Saya punya satu adik perempuan", "Saya punya satu kakak laki-laki"], "kakak perempuan は年上の女性のきょうだい。", "姉 adalah kakak perempuan sendiri; 妹 adalah adik perempuan."],
["母は家にいます", "Ibu saya di rumah", ["父は家にいます", "母は会社にいます"], ["Ayah saya di rumah", "Ibu saya di kantor"], "自分の母を他人に話すときは「母」が基本です。", "母 dipakai untuk ibu sendiri saat berbicara kepada orang lain."],
["弟は学生です", "Adik laki-laki saya pelajar", ["兄は学生です", "妹は先生です"], ["Kakak laki-laki saya pelajar", "Adik perempuan saya guru"], "adik laki-laki は弟。adik だけでは性別は未指定です。", "弟 adalah adik laki-laki; 兄 adalah kakak laki-laki."],
]],
["pronouns", "A1", "Natural Speech", "saya / aku / gue", "Pilihan kata ganti", "saya は中立・丁寧、aku は親しい間柄、gue は地域や集団に依存する非常にくだけた形です。", "saya netral/sopan, aku akrab, gue sangat santai dan bergantung wilayah atau kelompok. Jangan menggantinya tanpa melihat lawan bicara.", [
["私は日本出身です", "Saya dari Jepang", ["私は日本へ行きます", "私は日本に住んでいます"], ["Saya pergi ke Jepang", "Saya tinggal di Jepang"], "初対面や仕事では saya が無難です。", "私は〜出身です cocok untuk perkenalan; pakai gaya sopan saat baru berkenalan."],
["私、もう食べたよ", "Aku sudah makan", ["私、まだ食べてないよ", "私、まだ食べてるよ"], ["Aku belum makan", "Aku masih makan"], "aku は親しい相手向け。sudah の完了の意味は変わりません。", "〜たよ adalah gaya akrab; jangan otomatis dipakai kepada atasan."],
["俺、まだ知らない", "Gue belum tahu", ["俺、もう知ってる", "俺、忘れた"], ["Gue sudah tahu", "Gue lupa"], "gue と俺はどちらもくだけていますが、地域差・性別の慣習は同じではありません。", "俺 dan gue sama-sama santai, tetapi norma gender dan wilayahnya tidak sama."],
]],
["permission", "A1", "Foundation", "許可：boleh / てもいい", "Meminta izin", "boleh は許可、bisa は能力・可能性。日本語では「てもいい」と「できる」を区別します。", "boleh untuk izin; bisa untuk kemampuan atau kemungkinan. Bedakan てもいい dan できる.", [
["ここに座ってもいいですか？", "Boleh duduk di sini?", ["ここに座らないでください", "ここに座ってください"], ["Jangan duduk di sini", "Silakan duduk di sini"], "座る許可を尋ねるので boleh。", "座ってもいいですか meminta izin, bukan memberi perintah."],
["写真を撮ってもいいです", "Boleh mengambil foto", ["写真を撮ってはいけません", "写真を撮りたくありません"], ["Tidak boleh mengambil foto", "Saya tidak ingin mengambil foto"], "てもいい は許可を与える表現。", "てもいい menyatakan izin; てはいけません menyatakan larangan."],
["先に帰ってもいいですか？", "Boleh pulang dulu?", ["先に帰らなければなりません", "先に帰りたくありません"], ["Saya harus pulang dulu", "Saya tidak ingin pulang dulu"], "dulu はここでは先に。許可と義務を区別します。", "帰ってもいいですか meminta izin pulang lebih dulu."],
]],
["ability", "A1", "Foundation", "能力：bisa / できる", "Kemampuan", "bisa は能力や可能性。日本語は名詞＋ができる、動詞の可能形などを使います。", "bisa menyatakan kemampuan atau kemungkinan. Jepang memakai ができる atau bentuk potensial verba.", [
["私は泳げます", "Saya bisa berenang", ["私は泳げません", "私は泳いでいます"], ["Saya tidak bisa berenang", "Saya sedang berenang"], "泳げる は泳ぐの可能形。", "泳げます adalah bentuk potensial dari 泳ぐ."],
["私は漢字が読めません", "Saya tidak bisa membaca kanji", ["私は漢字が読めます", "私は漢字を書いています"], ["Saya bisa membaca kanji", "Saya sedang menulis kanji"], "読めない は読む能力の否定。", "読めません menegasikan kemampuan membaca, bukan tindakan menulis."],
["少し日本語を話せます", "Saya bisa berbicara bahasa Jepang sedikit", ["日本語を全く話せません", "日本語を教えています"], ["Saya sama sekali tidak bisa berbicara bahasa Jepang", "Saya mengajar bahasa Jepang"], "話せる は話すの可能形。sedikit で程度を示します。", "話せます adalah bentuk potensial; 少し membatasi tingkat kemampuan."],
]],
["requests", "A1", "Social", "依頼：tolong / てください", "Meminta bantuan", "tolong は依頼を和らげます。てくださいは丁寧な形ですが、上司への依頼では別の言い方が適する場合もあります。", "tolong memperhalus permintaan. てください sopan, tetapi hubungan dengan atasan dapat memerlukan bentuk lain.", [
["少し待ってください", "Tolong tunggu sebentar", ["今すぐ出てください", "少し休んでください"], ["Tolong keluar sekarang", "Tolong istirahat sebentar"], "sebentar は少しの間。", "少し待ってください meminta menunggu sebentar."],
["ドアを閉めてください", "Tolong tutup pintunya", ["ドアを開けてください", "窓を閉めてください"], ["Tolong buka pintunya", "Tolong tutup jendelanya"], "tutup は閉める、buka は開ける。", "閉めて adalah bentuk-te dari 閉める, bukan 開ける."],
["ゆっくり話してください", "Tolong bicara pelan-pelan", ["もう一度書いてください", "早く話してください"], ["Tolong tulis sekali lagi", "Tolong bicara cepat"], "pelan-pelan はこの場面ではゆっくりした話し方。", "ゆっくり meminta kecepatan bicara yang lebih lambat."],
]],
["wants", "A1", "Daily Life", "希望：mau / ingin / たい", "Keinginan", "mau は会話で広く使い、ingin は希望を表します。日本語の「たい」は動詞のます形の語幹に付きます。", "mau lazim dalam percakapan; ingin menyatakan keinginan. たい melekat pada pangkal bentuk-masu verba.", [
["水を飲みたいです", "Saya ingin minum air", ["水を飲みたくありません", "水を飲まなければなりません"], ["Saya tidak ingin minum air", "Saya harus minum air"], "飲み＋たい で飲む希望。", "飲みたい berasal dari 飲みます tanpa ます, ditambah たい."],
["今日は出かけたくありません", "Hari ini saya tidak mau keluar", ["今日は出かけたいです", "昨日は出かけませんでした"], ["Hari ini saya mau keluar", "Kemarin saya tidak keluar"], "たくない はたいの否定。過去の事実とは別です。", "たくありません menegasikan keinginan, bukan kejadian lampau."],
["日本に住みたいです", "Saya ingin tinggal di Jepang", ["日本に住んでいます", "日本へ旅行したいです"], ["Saya tinggal di Jepang", "Saya ingin berwisata ke Jepang"], "tinggal は住む。旅行するとは異なります。", "住みたい menyatakan ingin menetap, bukan sekadar berwisata."],
]],
["invitations", "A1", "Social", "誘いと返事", "Mengajak dan menjawab", "yuk は気軽な誘い、mari はより改まった誘い。日本語では「ませんか」「ましょう」を使います。", "yuk santai, mari lebih formal. Jepang memakai ませんか untuk mengajak dan ましょう untuk usulan bersama.", [
["一緒に昼ご飯を食べませんか？", "Mau makan siang bersama?", ["一人で昼ご飯を食べます", "もう昼ご飯を食べましたか？"], ["Saya makan siang sendiri", "Sudah makan siang?"], "ませんか は否定形ですが、この場面では誘いです。", "ませんか di sini merupakan ajakan, bukan sekadar pertanyaan negatif."],
["行こう！", "Ayo pergi!", ["帰って！", "行かないで！"], ["Pulang!", "Jangan pergi!"], "行こう は行くの意向形。", "行こう adalah bentuk ajakan atau kehendak dari 行く."],
["また今度にしましょう", "Lain kali saja, ya", ["今すぐ行きましょう", "二度と会いません"], ["Ayo pergi sekarang", "Kita tidak akan bertemu lagi"], "lain kali は別の機会。永久に断る意味ではありません。", "また今度 mengusulkan kesempatan lain, bukan menolak selamanya."],
]],
["weather", "A1", "Daily Life", "天気と体感", "Cuaca dan rasa", "暑い・寒いは体感、熱い・冷たいは物の温度。インドネシア語の panas / dingin と区分が異なります。", "暑い/寒い untuk cuaca atau rasa udara; 熱い/冷たい untuk benda. Pembagiannya berbeda dari panas/dingin.", [
["今日は暑いです", "Hari ini panas", ["今日は寒いです", "今日は涼しいです"], ["Hari ini dingin", "Hari ini sejuk"], "気温が高いときの日本語は「暑い」。", "Gunakan 暑い untuk udara panas, bukan 熱い."],
["このお茶は熱いです", "Teh ini panas", ["このお茶は冷たいです", "このお茶は甘いです"], ["Teh ini dingin", "Teh ini manis"], "飲み物の温度には「熱い」。", "熱い dipakai untuk suhu benda seperti teh."],
["傘を持って行ってください", "Tolong bawa payung", ["帽子を持って行ってください", "傘を置いて行ってください"], ["Tolong bawa topi", "Tolong tinggalkan payung"], "持って行く は移動先へ運ぶこと。", "持って行ってください meminta membawa benda ke tempat tujuan."],
]],
["health", "A1", "Daily Life", "体調を伝える", "Mengatakan kondisi tubuh", "sakit は病気・痛みの両方に使えます。症状の場所や種類を具体的に伝えます。", "sakit dapat berarti sakit secara umum atau nyeri. Sebutkan bagian tubuh dan gejalanya dengan jelas.", [
["頭が痛いです", "Kepala saya sakit", ["おなかが痛いです", "足が痛いです"], ["Perut saya sakit", "Kaki saya sakit"], "kepala は頭。日本語では痛む部分に「が」。", "頭が痛い memakai が untuk bagian tubuh yang terasa sakit."],
["熱があります", "Saya demam", ["せきが出ます", "けがをしました"], ["Saya batuk", "Saya terluka"], "demam は発熱。単に暑いこととは区別します。", "熱があります berarti demam, bukan merasa cuaca panas."],
["今日は休みたいです", "Saya ingin istirahat hari ini", ["今日は働きたいです", "明日は休みたいです"], ["Saya ingin bekerja hari ini", "Saya ingin istirahat besok"], "istirahat は休息。libur は休日を指すことが多いです。", "休みたい menyatakan keinginan beristirahat hari ini."],
]],
["chat-basic", "A1", "Internet", "チャットの短い返事", "Balasan chat singkat", "チャットでは主語や丁寧形を省くことがあります。親しい相手向けの表現として学びます。", "Chat sering menghilangkan subjek dan bentuk sopan. Ungkapan di sini untuk orang yang akrab.", [
["今向かってる", "Lagi di jalan", ["もう着いた", "まだ家にいる"], ["Sudah sampai", "Masih di rumah"], "lagi di jalan は移動中。直訳の「道にいる」だけでは捉えません。", "向かってる adalah bentuk santai dari 向かっている; berarti sedang menuju ke sana."],
["あとで連絡するね", "Nanti aku kabari, ya", ["今電話してね", "もう連絡しないでね"], ["Telepon sekarang, ya", "Jangan hubungi lagi, ya"], "kabari は知らせる。nanti は後で。", "あとで連絡するね menjanjikan kabar nanti, bukan meminta telepon sekarang."],
["気にしないで", "Jangan dipikirkan", ["忘れないで", "心配している"], ["Jangan lupa", "Aku khawatir"], "相手を安心させる場面の言い方。文脈によって訳は変わります。", "気にしないで dapat menenangkan orang; terjemahannya bergantung konteks."],
]],
["read-root", "A1", "Foundation", "語根 baca の地図", "Keluarga kata baca", "baca を中心に、membaca（読む）、dibaca（読まれる）、pembaca（読者）を関連付けます。", "Hubungkan baca dengan membaca, dibaca, dan pembaca; jangan hafalkan sebagai kata yang tidak berkaitan.", [
["彼は新聞を読みます", "Dia membaca koran", ["彼は新聞を書きます", "彼は新聞を買います"], ["Dia menulis koran", "Dia membeli koran"], "membaca は meN- + baca。動作を行う人が主語です。", "読みます adalah bentuk sopan dari 読む; objeknya ditandai を."],
["この本は多くの人に読まれています", "Buku ini dibaca banyak orang", ["この本は誰にも読まれていません", "多くの人がこの本を書きます"], ["Buku ini tidak dibaca siapa pun", "Banyak orang menulis buku ini"], "di- は動詞に付いて受動。場所の di は分けて書きます。", "読まれています adalah bentuk pasif; buku menjadi topik yang menerima tindakan."],
["私はこの雑誌の読者です", "Saya pembaca majalah ini", ["私はこの雑誌の編集者です", "私はこの雑誌の販売員です"], ["Saya editor majalah ini", "Saya penjual majalah ini"], "pembaca は読む人。peN- は人などを表す語を作ります。", "読者 adalah orang yang membaca; bukan editor atau penjual."],
]],
["airport", "A2", "Travel", "空港に着いたら", "Tiba di bandara", "入国・荷物・出口を具体的に尋ねます。確認に使う丁寧な疑問形を練習します。", "Latih pertanyaan sopan tentang imigrasi, bagasi, dan pintu keluar.", [
["荷物はどこで受け取れますか？", "Di mana saya bisa mengambil bagasi?", ["荷物はどこに預けられますか？", "切符はどこで買えますか？"], ["Di mana saya bisa menitipkan bagasi?", "Di mana saya bisa membeli tiket?"], "mengambil は受け取る・取る。menitipkan は預ける。", "受け取れますか menanyakan tempat mengambil, bukan menitipkan."],
["観光で来ました", "Saya datang untuk berwisata", ["仕事で来ました", "留学で来ました"], ["Saya datang untuk bekerja", "Saya datang untuk belajar di luar negeri"], "untuk はここでは訪問の目的を示します。", "観光で menandai tujuan kunjungan, bukan alat transportasi."],
["出口はどちらですか？", "Di mana pintu keluar?", ["入口はどちらですか？", "トイレはどちらですか？"], ["Di mana pintu masuk?", "Di mana toilet?"], "pintu keluar は出口、pintu masuk は入口。", "どちらですか merupakan cara sopan menanyakan arah atau lokasi."],
]],
["grab", "A2", "Travel", "Grabの運転手に連絡", "Menghubungi pengemudi", "乗車場所と現在地を区別します。sudah / masih を使うと待ち合わせの状態が伝わります。", "Bedakan lokasi jemput dan lokasi saat ini. sudah/masih membantu menjelaskan status pertemuan.", [
["私はロビーで待っています", "Saya menunggu di lobi", ["私はロビーへ向かっています", "私はもう出発しました"], ["Saya sedang menuju lobi", "Saya sudah berangkat"], "待つ動作の場所は di、日本語では「で」。", "待っています memakai で untuk tempat menunggu."],
["私は青いシャツを着ています", "Saya memakai kemeja biru", ["私は赤いシャツを着ています", "私は青いかばんを持っています"], ["Saya memakai kemeja merah", "Saya membawa tas biru"], "服装の説明は着ているという結果の状態です。", "着ています menunjukkan keadaan setelah mengenakan pakaian, bukan selalu proses memakai."],
["もう着きましたか？", "Sudah sampai?", ["まだ遠いですか？", "もう帰りましたか？"], ["Masih jauh?", "Sudah pulang?"], "sampai は到着する。sudah は到着済みかを確認します。", "もう着きましたか menanyakan apakah kedatangan sudah terjadi."],
]],
["hotel", "A2", "Travel", "ホテルで困ったら", "Masalah di hotel", "壊れている・動かないなど状態を述べてから依頼します。日本語のているは結果状態も表します。", "Jelaskan kondisi sebelum meminta bantuan. ている juga dapat menyatakan keadaan hasil.", [
["エアコンが動きません", "AC-nya tidak berfungsi", ["エアコンが寒すぎます", "エアコンを消してください"], ["AC-nya terlalu dingin", "Tolong matikan AC-nya"], "tidak berfungsi は機能しないこと。寒すぎることとは別です。", "動きません menjelaskan tidak berfungsi, bukan suhu terlalu dingin."],
["部屋を替えていただけますか？", "Bisa tolong ganti kamar saya?", ["部屋を掃除していただけますか？", "予約を取り消していただけますか？"], ["Bisa tolong bersihkan kamar saya?", "Bisa tolong batalkan reservasi saya?"], "いただけますか は相手に行為をお願いする丁寧な形。", "ていただけますか meminta bantuan dengan lebih sopan daripada てください."],
["お湯が出ません", "Air panasnya tidak keluar", ["水が止まりません", "お湯が熱すぎます"], ["Airnya tidak berhenti mengalir", "Air panasnya terlalu panas"], "air panas はお湯。keluar はここでは蛇口などから出ること。", "出ません menyatakan tidak keluar; bukan terlalu panas."],
]],
["obligation", "A2", "Foundation", "義務：harus / なければならない", "Kewajiban", "harus は義務、tidak harus は必須ではない、tidak boleh は禁止。否定の範囲に注意します。", "harus berarti wajib; tidak harus berarti tidak wajib; tidak boleh berarti dilarang.", [
["明日までに払わなければなりません", "Saya harus membayar paling lambat besok", ["明日までに払わなくてもいいです", "明日払ってはいけません"], ["Saya tidak harus membayar paling lambat besok", "Saya tidak boleh membayar besok"], "なければならない は義務。までに は期限です。", "までに menandai batas waktu; なければなりません menyatakan kewajiban."],
["今日は来なくてもいいです", "Hari ini tidak harus datang", ["今日は来てはいけません", "今日は来なければなりません"], ["Hari ini tidak boleh datang", "Hari ini harus datang"], "なくてもいい は義務がないこと。禁止ではありません。", "なくてもいい berarti tidak wajib, bukan dilarang."],
["ここに車を止めてはいけません", "Tidak boleh parkir di sini", ["ここに車を止めなくてもいいです", "ここに車を止めてもいいです"], ["Tidak harus parkir di sini", "Boleh parkir di sini"], "てはいけない は禁止。tidak harus とは異なります。", "てはいけません menyatakan larangan, bukan pilihan bebas."],
]],
["because", "A2", "Social", "理由：karena / soalnya", "Menjelaskan alasan", "karena は理由をつなぎ、soalnya は会話で説明を補うことが多い表現。日本語のから・のでにも場面差があります。", "karena menghubungkan sebab; soalnya sering memberi penjelasan dalam percakapan. から/ので juga berbeda menurut konteks.", [
["雨なので、行きません", "Saya tidak pergi karena hujan", ["雨ですが、行きます", "雨なら、行きます"], ["Saya pergi meskipun hujan", "Kalau hujan, saya pergi"], "karena は理由。meskipun は逆接です。", "ので menyatakan alasan, bukan pertentangan atau syarat."],
["行けないんだ。仕事があるから", "Aku tidak bisa ikut. Soalnya ada pekerjaan", ["行けるよ。仕事がないから", "仕事が終わったら行くよ"], ["Aku bisa ikut. Soalnya tidak ada pekerjaan", "Aku ikut kalau pekerjaan sudah selesai"], "soalnya は直前の発言の理由を補う会話的な使い方。", "んだ dan から memberi penjelasan dalam gaya akrab."],
["電車が遅れたので、遅刻しました", "Saya terlambat karena keretanya terlambat", ["電車が遅れても、間に合いました", "遅刻したので、電車に乗りませんでした"], ["Saya tetap tepat waktu meskipun keretanya terlambat", "Saya tidak naik kereta karena terlambat"], "原因と結果の順序を取り違えないようにします。", "ので menghubungkan keterlambatan kereta sebagai sebab keterlambatan datang."],
]],
["work", "A2", "Work", "遅刻・連絡・確認", "Komunikasi kerja", "仕事では内容だけでなく相手との関係に合う丁寧さが必要です。謝罪の後に見込みや依頼を具体化します。", "Dalam pekerjaan, sesuaikan kesopanan dengan hubungan. Setelah meminta maaf, jelaskan perkiraan atau permintaan.", [
["申し訳ありません。十分ほど遅れます", "Mohon maaf, saya akan terlambat sekitar sepuluh menit", ["申し訳ありません。十分ほど早く着きます", "申し訳ありません。今日は休みます"], ["Mohon maaf, saya akan tiba sekitar sepuluh menit lebih awal", "Mohon maaf, hari ini saya izin tidak masuk"], "sekitar はおよそ。到着見込みを具体的に伝えます。", "ほど berarti sekitar; 遅れます menyatakan akan terlambat."],
["確認していただけますか？", "Bisa tolong diperiksa?", ["削除していただけますか？", "印刷していただけますか？"], ["Bisa tolong dihapus?", "Bisa tolong dicetak?"], "periksa は確認・検査。受動形で対象に焦点を置く依頼です。", "ていただけますか adalah permintaan sopan untuk memeriksa."],
["資料をメールで送ります", "Saya akan mengirim dokumen lewat email", ["資料をメールで受け取りました", "資料を印刷します"], ["Saya sudah menerima dokumen lewat email", "Saya akan mencetak dokumen"], "mengirim は送る、menerima は受け取る。", "送ります menyatakan mengirim; で menunjukkan sarana email."],
]],
["relationship", "A2", "Relationship", "断る・気持ちを伝える", "Menolak dan menyampaikan perasaan", "親しい関係でも、相手の気持ちを決めつけず自分の事情や希望を説明します。", "Dalam hubungan dekat, jelaskan keadaan atau keinginan sendiri tanpa menganggap tahu perasaan lawan bicara.", [
["今日は一人でいたい", "Hari ini aku ingin sendiri", ["今日は一緒にいたい", "今日は出かけたい"], ["Hari ini aku ingin bersamamu", "Hari ini aku ingin keluar"], "sendiri は一人。相手への評価ではなく自分の希望です。", "一人でいたい menyatakan keinginan sendiri; bentuk ini akrab."],
["少し考える時間がほしい", "Aku butuh waktu untuk berpikir", ["もう考えたくない", "今すぐ答えがほしい"], ["Aku tidak mau berpikir lagi", "Aku ingin jawaban sekarang"], "butuh は必要とする。考えるための時間を求めています。", "時間がほしい meminta waktu, bukan menuntut jawaban saat ini."],
["誘ってくれてありがとう。でも今日は行けない", "Terima kasih sudah mengajak, tapi hari ini aku tidak bisa ikut", ["誘ってくれてありがとう。今日は行ける", "今日は誘わないで"], ["Terima kasih sudah mengajak, hari ini aku bisa ikut", "Jangan ajak aku hari ini"], "tapi で感謝と断りをつなぎます。", "てくれてありがとう berterima kasih atas tindakan orang lain; でも mengawali penolakan."],
]],
["internet", "A2", "Internet", "既読・投稿・DM", "Chat dan media sosial", "ネット表現は地域や世代で違います。ここでは親しい相手との会話として使いどころを示します。", "Ungkapan internet berbeda menurut wilayah dan generasi. Contoh ini untuk percakapan akrab.", [
["メッセージ、もう読んだ？", "Pesannya sudah dibaca?", ["メッセージ、もう送った？", "メッセージ、消した？"], ["Pesannya sudah dikirim?", "Pesannya dihapus?"], "dibaca は読まれた。既読機能の表示そのものとは限りません。", "もう読んだ？ menanyakan apakah pesan telah dibaca; tidak selalu menanyakan indikator aplikasi."],
["この写真を投稿してもいい？", "Boleh unggah foto ini?", ["この写真を消してもいい？", "この写真を印刷してもいい？"], ["Boleh hapus foto ini?", "Boleh cetak foto ini?"], "写真を公開する前の許可を求めます。unggah はアップロード。", "投稿してもいい？ meminta izin mengunggah dalam gaya akrab."],
["それ、本当？", "Serius?", ["それ、いつ？", "それ、どこ？"], ["Kapan?", "Di mana?"], "驚いて確認する文脈の Serius?。丁寧な場面では説明を足します。", "本当？ mengonfirmasi kebenaran dengan nada akrab atau terkejut."],
]],
["comparison", "A2", "Foundation", "比較：lebih / より", "Perbandingan", "lebih ... daripada ... は「〜より…」。比較する対象の順序に注意します。", "lebih ... daripada ... sepadan dengan 〜より…; perhatikan arah perbandingan.", [
["電車はバスより速いです", "Kereta lebih cepat daripada bus", ["バスは電車より速いです", "電車はバスより安いです"], ["Bus lebih cepat daripada kereta", "Kereta lebih murah daripada bus"], "daripada の後ろが比較の基準です。", "より menandai patokan; yang lebih cepat di sini adalah kereta."],
["どちらが安いですか？", "Mana yang lebih murah?", ["どちらが高いですか？", "どちらが近いですか？"], ["Mana yang lebih mahal?", "Mana yang lebih dekat?"], "二つを比べる質問。murah は安い。", "どちらが menanyakan pilihan dari dua hal; 安い berarti murah."],
["これはあれほど高くありません", "Ini tidak semahal itu", ["これはあれより高いです", "これはあれと同じ値段です"], ["Ini lebih mahal daripada itu", "Harganya sama dengan itu"], "ほど〜ない は比較の基準に達しないことを示します。", "ほど〜ありません berarti tidak mencapai tingkat yang dibandingkan."],
]],
["plans", "A2", "Daily Life", "予定・つもり・約束", "Rencana dan niat", "予定はスケジュール、つもりは本人の意図。インドネシア語の akan / berencana だけで常に区別できるわけではありません。", "予定 menyoroti jadwal; つもり menyoroti niat. akan/berencana tidak selalu membedakan keduanya secara langsung.", [
["来月引っ越す予定です", "Saya berencana pindah bulan depan", ["先月引っ越しました", "来月旅行する予定です"], ["Saya pindah bulan lalu", "Saya berencana berwisata bulan depan"], "bulan depan は来月。予定は今後の計画です。", "予定です menyatakan rencana; 来月 berarti bulan depan."],
["今日は早く寝るつもりです", "Hari ini saya berniat tidur lebih awal", ["今日は早く起きるつもりです", "昨日は早く寝ました"], ["Hari ini saya berniat bangun lebih awal", "Kemarin saya tidur lebih awal"], "つもり は自分の意図。寝ると起きるを区別します。", "つもり menyatakan niat pembicara; 寝る berarti tidur."],
["約束を忘れないでね", "Jangan lupa janji kita, ya", ["約束を変えよう", "約束を断ってね"], ["Ayo ubah janji kita", "Tolak janji itu, ya"], "janji は約束。忘れないで は否定の依頼です。", "忘れないでね meminta agar tidak lupa dengan gaya akrab."],
]],
["affixes", "B1", "Advanced Grammar", "接辞：-kan / -i", "Akhiran -kan dan -i", "接辞の意味は語根によって変わります。-kan を常に他動化、-i を常に反復と決めつけず、対象との関係を例文で覚えます。", "Makna akhiran bergantung pada kata dasar. Jangan menganggap -kan selalu kausatif atau -i selalu berulang; pelajari hubungan argumennya.", [
["母は子供に物語を読んであげます", "Ibu membacakan cerita untuk anaknya", ["子供は母に物語を読みます", "母は子供の物語を書きます"], ["Anak membacakan cerita untuk ibunya", "Ibu menulis cerita anaknya"], "membacakan は誰かのために読み聞かせる用法。", "読んであげます menyoroti tindakan membaca untuk penerima manfaat."],
["庭に花を植えます", "Saya menanam bunga di halaman", ["庭に水をまきます", "庭の花を摘みます"], ["Saya menyirami halaman", "Saya memetik bunga di halaman"], "menanam bunga は花を植える。場所は di halaman です。", "植えます berarti menanam, bukan menyiram atau memetik."],
["私は毎朝植物に水をやります", "Saya menyirami tanaman setiap pagi", ["私は毎朝植物を売ります", "私は毎朝植物を買います"], ["Saya menjual tanaman setiap pagi", "Saya membeli tanaman setiap pagi"], "menyirami は siram + meN- + -i。対象の植物に水をかける用法。", "植物に水をやります menunjukkan tanaman sebagai sasaran pemberian air."],
]],
["passive", "B1", "Advanced Grammar", "受動文：di- / れる・られる", "Kalimat pasif", "受動文では行為を受ける対象を前に出せます。日本語には迷惑を表す受動もあり、di- と完全対応しません。", "Pasif menonjolkan penerima tindakan. Jepang juga memiliki pasif yang menyatakan dampak merugikan, sehingga tidak selalu sama dengan di-.", [
["この橋は去年建てられました", "Jembatan ini dibangun tahun lalu", ["この橋は来年建てられます", "この橋は去年壊されました"], ["Jembatan ini akan dibangun tahun depan", "Jembatan ini dihancurkan tahun lalu"], "dibangun は bangun の受動。建造物の橋が主題です。", "建てられました adalah pasif lampau dari 建てる."],
["私の財布が盗まれました", "Dompet saya dicuri", ["私は財布を拾いました", "私は財布を買いました"], ["Saya menemukan dompet", "Saya membeli dompet"], "dicuri は盗まれる。盗む人が不明でも文にできます。", "盗まれました adalah pasif; pelakunya tidak disebutkan."],
["この書類は部長に確認されました", "Dokumen ini sudah diperiksa oleh kepala bagian", ["この書類は部長に削除されました", "部長はこの書類をまだ確認していません"], ["Dokumen ini sudah dihapus oleh kepala bagian", "Kepala bagian belum memeriksa dokumen ini"], "oleh は受動文の行為者。日本語では「に」で示しています。", "部長に menandai pelaku dalam kalimat pasif ini."],
]],
["appearance", "B1", "Advanced Grammar", "様子のそう・伝聞のそう", "Dua fungsi そう", "おいしそう は見た印象、おいしいそうだ は聞いた情報。接続の違いが意味を変えます。", "おいしそう adalah kesan dari penampilan; おいしいそうだ adalah informasi yang didengar. Bentuk sebelum そう membedakan maknanya.", [
["この料理はおいしそうです", "Makanan ini kelihatannya enak", ["この料理はおいしいそうです", "この料理はおいしくありません"], ["Katanya makanan ini enak", "Makanan ini tidak enak"], "形容詞の語幹＋そう で見た目の印象。", "おいし + そう berarti terlihat enak, belum tentu sudah dicicipi."],
["明日は雨が降るそうです", "Katanya besok akan hujan", ["明日は雨が降りそうです", "昨日は雨が降りました"], ["Sepertinya besok akan hujan", "Kemarin hujan turun"], "普通形＋そうです は伝聞。情報源から聞いたことを伝えます。", "降るそうです adalah kabar yang didengar, berbeda dari perkiraan 降りそうです."],
["彼は疲れているようです", "Dia tampaknya lelah", ["彼は疲れていないと言いました", "彼は休んではいけません"], ["Dia mengatakan bahwa dia tidak lelah", "Dia tidak boleh beristirahat"], "ようです は状況からの判断。断定を避けています。", "ようです menyampaikan dugaan berdasarkan keadaan, bukan kepastian."],
]],
["change", "B1", "Advanced Grammar", "変化：ようになる / なくなる", "Perubahan kemampuan dan kebiasaan", "ようになる は能力や習慣の変化。なくなる は以前あった状態や習慣がなくなることです。", "ようになる menyatakan perubahan kemampuan atau kebiasaan; なくなる menyatakan sesuatu tidak lagi terjadi.", [
["漢字が読めるようになりました", "Sekarang saya sudah bisa membaca kanji", ["漢字が読めなくなりました", "漢字を読むつもりです"], ["Saya tidak bisa membaca kanji lagi", "Saya berniat membaca kanji"], "読める＋ようになる で以前できなかったことが可能になった変化。", "読めるようになりました menandai kemampuan baru, bukan sekadar niat."],
["最近、テレビを見なくなりました", "Belakangan ini saya tidak menonton televisi lagi", ["最近、テレビを見るようになりました", "昨日はテレビを見ませんでした"], ["Belakangan ini saya mulai terbiasa menonton televisi", "Kemarin saya tidak menonton televisi"], "見なくなる は習慣がなくなったこと。一回見なかったこととは別です。", "見なくなりました berarti kebiasaan menonton telah berhenti."],
["毎日運動するようにしています", "Saya berusaha berolahraga setiap hari", ["毎日運動するようになりました", "毎日運動しなければなりません"], ["Saya mulai terbiasa berolahraga setiap hari", "Saya harus berolahraga setiap hari"], "ようにしている は意識的な心がけ。ようになる は変化です。", "ようにしています menyatakan usaha yang disengaja, bukan hanya perubahan kebiasaan."],
]],
["condition", "B1", "Advanced Grammar", "条件：たら・なら", "Syarat dan konteks", "たら は条件や出来事の後、なら は相手の話題や前提を受けた条件に使えます。", "たら dapat menyatakan syarat atau setelah kejadian; なら menanggapi asumsi atau topik dari konteks.", [
["着いたら連絡してください", "Tolong hubungi saya setelah sampai", ["着く前に連絡してください", "着いても連絡しないでください"], ["Tolong hubungi saya sebelum sampai", "Jangan hubungi saya meskipun sudah sampai"], "着いたら は到着が成立した後の連絡を求めます。", "着いたら di sini berarti setelah sampai, bukan sebelumnya."],
["雨だったら、家にいます", "Kalau hujan, saya di rumah", ["雨でも、出かけます", "雨だったので、家にいました"], ["Meskipun hujan, saya keluar", "Karena hujan, saya di rumah tadi"], "たら は仮定の条件。ので の原因とは区別します。", "だったら menyatakan syarat hipotetis; だったので menyatakan alasan lampau."],
["京都に行くなら、この店がおすすめです", "Kalau mau ke Kyoto, saya merekomendasikan toko ini", ["京都から帰ったら、この店に来てください", "京都に行ったので、この店を閉めました"], ["Setelah pulang dari Kyoto, datanglah ke toko ini", "Karena pergi ke Kyoto, saya menutup toko ini"], "なら は京都へ行くという相手の計画を前提に助言します。", "なら menerima rencana ke Kyoto sebagai konteks untuk saran."],
]],
["culture", "B1", "Natural Speech", "直訳だけでは足りない表現", "Makna di balik terjemahan", "挨拶や配慮の言葉は、字面だけでは機能が分かりません。関係・場面・返事まで学びます。", "Sapaan dan perhatian tidak selalu dipahami lewat terjemahan harfiah. Pelajari hubungan, konteks, dan responsnya.", [
["もう食べた？", "Sudah makan?", ["何を食べたい？", "誰と食べた？"], ["Mau makan apa?", "Makan dengan siapa?"], "文字通りの食事確認に加え、場面によって気遣いとして使います。常に挨拶になるわけではありません。", "もう食べた？ menanyakan makan; Sudah makan? juga dapat menyampaikan perhatian menurut konteks."],
["お先に失礼します", "Permisi, saya pulang dulu", ["お帰りなさい", "いってらっしゃい"], ["Selamat datang kembali", "Selamat jalan"], "職場などで他の人より先に帰るときの挨拶。直訳は機能を伝えません。", "お先に失礼します dipakai ketika pulang lebih dulu dari orang lain, misalnya di kantor."],
["いただきます", "Ungkapan sebelum mulai makan", ["ごちそうさまでした", "おやすみなさい"], ["Ungkapan setelah selesai makan", "Ungkapan sebelum tidur"], "食べ始める前の定型表現。インドネシア語に完全に一致する定型句があるとは限りません。", "いただきます adalah ungkapan sebelum makan; terjemahan di sini menjelaskan fungsinya, bukan padanan harfiah."],
]],
];

// Rotate answer positions reproducibly; never make the first option always correct.
function options(answer: string, wrong: [string, string], index: number) {
  const result = [...wrong];
  result.splice(index % 3, 0, answer);
  return result;
}

export const expandedLessons: Lesson[] = units.map((unit, index) => {
  const [slug, level, category, titleJa, titleId, grammarJa, grammarId, rows] = unit;
  const id = `contrast-${slug}`;
  const phrases: Phrase[] = rows.map(([ja, id, , , noteJa, noteId]) => ({ ja, id, noteJa, noteId }));
  const quiz: QuizQuestion[] = rows.map(([ja, idText, wrongJa, wrongId, explanationJa, explanationId], row) => ({
    id: `${id}-${row + 1}`,
    promptJa: `「${ja}」に対応する表現を選んでください。`,
    promptId: `Pilih ungkapan Jepang yang sesuai dengan “${idText}”.`,
    choicesJa: options(ja, wrongJa, index + row),
    choicesId: options(idText, wrongId, index + row),
    answerJa: ja, answerId: idText, explanationJa, explanationId,
  }));
  return { id, level: `${level} · ${String(index + 7).padStart(2, "0")}`, category,
    titleJa, titleId, descriptionJa: grammarJa, descriptionId: grammarId,
    minutes: 12, grammarJa, grammarId, phrases, quiz };
});
