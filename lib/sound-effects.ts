export type SoundEffect='correct'|'wrong'|'complete'|'stage';
let context:AudioContext|null=null;
let muted=false;
const notes:Record<SoundEffect,number[]>={correct:[659,880],wrong:[220,165],complete:[523,659,784,1047],stage:[523,659,784,1047,1319,1568]};
export function setEffectsMuted(value:boolean){muted=value;try{localStorage.setItem('jendy:effects-muted',String(value));}catch{}}
export function effectsMuted(){try{return localStorage.getItem('jendy:effects-muted')==='true';}catch{return muted;}}
export function playEffect(effect:SoundEffect){
 if(typeof window==='undefined'||effectsMuted())return;
 try{
  const Constructor=window.AudioContext??(window as unknown as {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;
  if(!Constructor)return;
  context??=new Constructor();
  const engine=context;
  const schedule=()=>{
   if(effectsMuted())return;
   const start=engine.currentTime;
   notes[effect].forEach((frequency,i)=>{
    const oscillator=engine.createOscillator();const gain=engine.createGain();const at=start+i*(effect==='wrong'?.12:.095);
    oscillator.type=effect==='wrong'?'triangle':'sine';oscillator.frequency.setValueAtTime(frequency,at);
    gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.13,at+.012);gain.gain.exponentialRampToValueAtTime(.001,at+.19);
    oscillator.connect(gain);gain.connect(engine.destination);oscillator.start(at);oscillator.stop(at+.2);
    oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
   });
  };
  if(engine.state==='suspended')void engine.resume().then(schedule).catch(()=>{});else schedule();
 }catch{/* Sound must never prevent an answer from being recorded. */}
}
