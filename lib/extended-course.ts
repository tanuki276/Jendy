import type { Lesson } from './learning-content';
// Each frame constrains its objects. This is compositional sentence practice,
// not arbitrary combinations or additional grammar topics.
const frames: [string,string,[string,string][]][] = [
['食べます','makan',[['ご飯','nasi'],['パン','roti'],['魚','ikan'],['肉','daging'],['卵','telur'],['野菜','sayur'],['果物','buah'],['麺','mi']]],
['飲みます','minum',[['水','air'],['お茶','teh'],['コーヒー','kopi'],['牛乳','susu'],['ジュース','jus'],['紅茶','teh hitam'],['緑茶','teh hijau'],['温かい水','air hangat']]],
['読みます','membaca',[['本','buku'],['新聞','koran'],['雑誌','majalah'],['手紙','surat'],['メール','email'],['小説','novel'],['物語','cerita'],['漫画','komik']]],
['買います','membeli',[['本','buku'],['パン','roti'],['野菜','sayur'],['果物','buah'],['牛乳','susu'],['卵','telur'],['魚','ikan'],['肉','daging']]],
['売ります','menjual',[['パン','roti'],['野菜','sayur'],['果物','buah'],['魚','ikan'],['肉','daging'],['服','pakaian'],['靴','sepatu'],['本','buku']]],
['作ります','membuat',[['ケーキ','kue'],['パン','roti'],['スープ','sup'],['サラダ','salad'],['サンドイッチ','roti lapis'],['ソース','saus'],['朝ご飯','sarapan'],['晩ご飯','makan malam']]],
['洗います','mencuci',[['服','pakaian'],['皿','piring'],['コップ','gelas'],['車','mobil'],['靴','sepatu'],['野菜','sayur'],['果物','buah'],['タオル','handuk']]],
['掃除します','membersihkan',[['部屋','kamar'],['台所','dapur'],['浴室','kamar mandi'],['窓','jendela'],['床','lantai'],['机','meja'],['庭','halaman'],['事務所','kantor']]],
['勉強します','mempelajari',[['日本語','bahasa Jepang'],['インドネシア語','bahasa Indonesia'],['英語','bahasa Inggris'],['数学','matematika'],['歴史','sejarah'],['経済学','ilmu ekonomi'],['文法','tata bahasa'],['生物学','biologi']]],
['聞きます','mendengarkan',[['音楽','musik'],['ラジオ','radio'],['ポッドキャスト','podcast'],['ニュース','berita'],['歌','lagu'],['ジャズ','musik jazz'],['クラシック音楽','musik klasik'],['録音','rekaman']]],
['見ます','menonton',[['映画','film'],['テレビ','televisi'],['ドラマ','drama'],['アニメ','anime'],['動画','video'],['ニュース番組','acara berita'],['料理番組','acara memasak'],['スポーツ番組','acara olahraga']]],
['運びます','membawa',[['かばん','tas'],['箱','kotak'],['本','buku'],['椅子','kursi'],['机','meja'],['食べ物','makanan'],['飲み物','minuman'],['荷物','barang bawaan']]],
['探します','mencari',[['鍵','kunci'],['財布','dompet'],['携帯電話','ponsel'],['本','buku'],['眼鏡','kacamata'],['靴','sepatu'],['かばん','tas'],['書類','dokumen']]],
['準備します','menyiapkan',[['朝ご飯','sarapan'],['晩ご飯','makan malam'],['昼ご飯','makan siang'],['資料','materi'],['服','pakaian'],['かばん','tas'],['飲み物','minuman'],['食べ物','makanan']]],
['確認します','memeriksa',[['書類','dokumen'],['メール','email'],['予定','jadwal'],['宿題','pekerjaan rumah'],['答え','jawaban'],['予約','reservasi'],['切符','tiket'],['報告書','laporan']]],
['使います','menggunakan',[['パソコン','komputer'],['携帯電話','ponsel'],['辞書','kamus'],['アプリ','aplikasi'],['自転車','sepeda'],['カメラ','kamera'],['カード','kartu'],['インターネット','internet']]],
];
const times=[['毎朝','setiap pagi'],['毎晩','setiap malam'],['明日','besok']];
const people=[['私は','Saya'],['私たちは','Kami']];
export const extendedLessons:Lesson[]=frames.flatMap(([verb,idVerb,objects],v)=>objects.map(([object,idObject],o)=>{
 const id=`practice-frame-${v+1}-${o+1}`;
 const phrases=people.flatMap(([person,idPerson])=>times.map(([time,idTime])=>({ja:`${person}${time}${object}を${verb}`,id:`${idPerson} ${idVerb} ${idObject} ${idTime}`,noteJa:`${idVerb} = ${verb}、${idObject} = ${object}、${idTime} = ${time}。基本語順は主語→動詞→対象。Kami は聞き手を含まない「私たち」です。`,noteId:`${object}を menandai objek, ${verb} adalah predikat sopan di akhir. ${time} berarti ${idTime}. Kami tidak mencakup lawan bicara.`})));
 return {id,level:`A1 · Practice ${v+1}.${o+1}`,category:'Sentence Practice',titleJa:`${object}を${verb}：語順と時間`,titleId:`${idVerb} ${idObject}: subjek dan waktu`,descriptionJa:'主語2種類・時間3種類の6文で、習った語順を使う練習。',descriptionId:'Latih enam kalimat: dua subjek dan tiga keterangan waktu.',minutes:8,grammarJa:'組み立て練習：主語＋動詞＋対象＋時間。時間表現は文頭にも置けます。新しい文法項目ではなく、既習の型を使う練習です。',grammarId:'Latihan pola subjek + verba + objek + waktu. Keterangan waktu juga dapat berada di awal.',phrases,quiz:phrases.map((p,i)=>{const other=objects[(o+1)%objects.length];const wrongJa=p.ja.replace(object+'を',other[0]+'を');const wrongId=p.id.replace(' '+idObject+' ',' '+other[1]+' ');const oppositeJa=p.ja.replace(people[Math.floor(i/3)][0],people[1-Math.floor(i/3)][0]);const oppositeId=p.id.replace(people[Math.floor(i/3)][1],people[1-Math.floor(i/3)][1]);const rotate=(a:string[])=>a.slice(i%3).concat(a.slice(0,i%3));return {id:`${id}-${i}`,promptJa:`「${p.ja}」に対応する文は？`,promptId:`Pilih terjemahan: ${p.id}`,choicesJa:rotate([p.ja,wrongJa,oppositeJa]),choicesId:rotate([p.id,wrongId,oppositeId]),answerJa:p.ja,answerId:p.id,explanationJa:p.noteJa,explanationId:p.noteId}})};
}));
