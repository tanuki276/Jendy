import { recordedQuestions } from './audio-manifest';
export function createLessonAudio(questionId:string,text:string,language:'id'|'ja',onError:()=>void,word?:string){
 let stopped=false;let media:HTMLAudioElement|null=null;let utterance:SpeechSynthesisUtterance|null=null;let generation=0;let timer:ReturnType<typeof setTimeout>|undefined;
 let removeVoiceListener:(()=>void)|undefined;
 let fallbackGeneration=-1;
 function cancel(){
  generation++;
  if(timer){clearTimeout(timer);timer=undefined;}
  removeVoiceListener?.();removeVoiceListener=undefined;
  if(media){media.onerror=null;media.onplaying=null;media.pause();media.removeAttribute('src');media=null;}
  if(utterance){utterance.onerror=null;utterance=null;}
  if('speechSynthesis' in window)window.speechSynthesis.cancel();
 }
 function fallback(rate:number,token:number){
  if(stopped||token!==generation||fallbackGeneration===token)return;
  fallbackGeneration=token;
  if(timer){clearTimeout(timer);timer=undefined;}
  if(media){media.onerror=null;media.onplaying=null;media.pause();media.removeAttribute('src');media=null;}
  if(!('speechSynthesis' in window)){onError();return;}
  const synth=window.speechSynthesis;
  const say=()=>{
   if(stopped||token!==generation)return;
   const voices=synth.getVoices();const voice=voices.find(v=>v.lang.toLowerCase().startsWith(language));
   if(!voice){onError();return;}
   utterance=new SpeechSynthesisUtterance(text);utterance.lang=language==='id'?'id-ID':'ja-JP';utterance.voice=voice;utterance.rate=rate;
   utterance.onerror=e=>{if(!stopped&&token===generation&&e.error!=='canceled'&&e.error!=='interrupted')onError();};
   synth.resume();synth.speak(utterance);
  };
  if(synth.getVoices().length)say();else{
   const ready=()=>{removeVoiceListener?.();removeVoiceListener=undefined;if(timer){clearTimeout(timer);timer=undefined;}say();};
   removeVoiceListener=()=>synth.removeEventListener('voiceschanged',ready);
   synth.addEventListener('voiceschanged',ready,{once:true});timer=setTimeout(ready,1500);
  }
 }
 return {play(rate:number){cancel();stopped=false;const token=generation;
  if(typeof window.Audio==='function'){
   media=new window.Audio(!word&&recordedQuestions.has(questionId)?'/audio/'+questionId+'-'+language+'.mp3':'/api/audio?id='+encodeURIComponent(questionId)+'&lang='+language+(word?'&word='+encodeURIComponent(word):''));
   media.playbackRate=rate;
   media.onplaying=()=>{if(token===generation&&timer){clearTimeout(timer);timer=undefined;}};
   media.onerror=()=>fallback(rate,token);
   timer=setTimeout(()=>fallback(rate,token),12000);
   try{void media.play().then(()=>{if(token===generation&&timer){clearTimeout(timer);timer=undefined;}}).catch(()=>fallback(rate,token));}catch{fallback(rate,token);}
  }else fallback(rate,token);
 },stop(){stopped=true;cancel();}};
}
