import { lessons } from '@/lib/learning-content';
const questions = new Map(lessons.flatMap(lesson=>lesson.quiz.map(question=>[question.id,question] as const)));
export async function GET(request:Request) {
 const url=new URL(request.url);const question=questions.get(url.searchParams.get('id')??'');const language=url.searchParams.get('lang');
 if(!question||(language!=='ja'&&language!=='id'))return new Response('Unknown lesson audio',{status:400});
 const sentence=language==='id'?question.answerId:question.answerJa;
 const word=url.searchParams.get('word');
 const tokens=language==='id'?sentence.split(/\s+/):Array.from(new Intl.Segmenter('ja',{granularity:'word'}).segment(sentence),s=>s.segment);
 if(word!==null&&(!word.trim()||!tokens.includes(word)))return new Response('Unknown lesson word',{status:400});
 const text=word??sentence;
 if(text.length>200)return new Response('Sentence exceeds audio limit',{status:422});
 const endpoint=new URL('https://translate.google.com/translate_tts');
 endpoint.search=new URLSearchParams({ie:'UTF-8',client:'tw-ob',tl:language,q:text}).toString();
 try{
  const result=await fetch(endpoint,{signal:AbortSignal.timeout(10000),next:{revalidate:86400}});
  if(!result.ok||!result.headers.get('content-type')?.includes('audio/'))throw new Error('Audio unavailable');
  const bytes=await result.arrayBuffer();
  if(bytes.byteLength<500)throw new Error('Empty audio');
  return new Response(bytes,{headers:{'Content-Type':'audio/mpeg','Cache-Control':'public, max-age=86400, s-maxage=604800'}});
 }catch{return new Response('Audio temporarily unavailable',{status:503});}
}
