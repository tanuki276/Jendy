import type {Lesson} from './learning-content';
const groups:[string,string,[string,string][]][]=[
 ['私とあなた','Saya dan kamu',[['私','Saya'],['あなた','Kamu'],['私は太郎です','Saya Taro']]],
 ['私がする・あなたがする','Saya dan kamu melakukan',[['私は食べます','Saya makan'],['あなたは食べます','Kamu makan'],['私は飲みます','Saya minum']]],
 ['何を飲む？何を食べる？','Minum dan makan apa?',[['私は水を飲みます','Saya minum air'],['あなたはコーヒーを飲みます','Kamu minum kopi'],['私はご飯を食べます','Saya makan nasi']]],
 ['私の名前・あなたの名前','Nama saya dan nama kamu',[['私の名前','Nama saya'],['私の名前は太郎です','Nama saya Taro'],['あなたの名前はティニです','Nama kamu Tini']]],
 ['朝の挨拶を加える','Tambahkan salam pagi',[['おはようございます','Selamat pagi'],['おはようございます、太郎です','Selamat pagi, saya Taro'],['おはようございます、私の名前はティニです','Selamat pagi, nama saya Tini']]],
 ['挨拶と自己紹介をつなぐ','Salam dan perkenalan',[['おはようございます、私の名前は太郎です','Selamat pagi, nama saya Taro'],['私は日本人です','Saya orang Jepang'],['おはようございます、私の名前はティニです。私はインドネシア人です','Selamat pagi, nama saya Tini. Saya orang Indonesia']]],
];
export const starterLessons:Lesson[]=groups.map(([titleJa,titleId,rows],i)=>({
 id:'starter-'+(i+1),level:'A1 · 入門'+(i+1),category:'Foundation',minutes:5,titleJa,titleId,
 descriptionJa:'短い表現から一歩ずつ。前に学んだ文も繰り返し練習します。',descriptionId:'Mulai dari ungkapan pendek dan ulangi materi sebelumnya.',
 grammarJa:i===0?'Saya は私、Kamu はあなた。名前を続けるだけで自己紹介できます。':i<3?'主語＋動詞＋目的語の順。Saya と Kamu を入れ替えて練習しましょう。':i===3?'nama は名前。nama saya で「私の名前」です。':'学んだ自己紹介に Selamat pagi を加えて、挨拶から名前までつなげます。',
 grammarId:'Bangun kalimat sedikit demi sedikit, dari kata ganti hingga perkenalan.',
 phrases:rows.map(([ja,id])=>({ja,id,noteJa:'文の意味と語の順番を確認しましょう。',noteId:'Perhatikan arti dan urutan kata.'})),
 quiz:rows.map(([ja,id],j)=>({id:'starter-'+(i+1)+'-q'+j,promptJa:'「'+ja+'」をインドネシア語にしてください。',promptId:'Terjemahkan “'+id+'” ke bahasa Jepang.',answerJa:ja,answerId:id,choicesJa:rows.map(r=>r[0]),choicesId:rows.map(r=>r[1]),explanationJa:i===0?'Saya＝私、Kamu＝あなた。日本語の「は・です」に当たる語を毎回入れる必要はありません。':i<3?'Saya／Kamu が主語、makan＝食べる、minum＝飲む。air＝水、kopi＝コーヒー、nasi＝ご飯を動詞の後に置きます。':i===3?'nama＝名前。nama saya＝私の名前、nama kamu＝あなたの名前。名前はその後に続けます。':'Selamat pagi＝おはようございます。nama saya＋名前で自己紹介し、Saya orang＋国名で出身を続けます。',explanationId:'Gabungkan kata yang sudah dipelajari. Saya berarti 私, kamu berarti あなた.'}))
}));
