"use client";
import {useEffect,useRef,useState} from 'react';
type Recognition={lang:string;interimResults:boolean;onresult:((event:{results:{[key:number]:{[key:number]:{transcript:string}}}})=>void)|null;onerror:((event:{error:string})=>void)|null;onend:(()=>void)|null;start:()=>void;abort:()=>void};
export function SpeakingExercise({text,ja,disabled,onAnswer}:{text:string;ja:boolean;disabled:boolean;onAnswer:(text:string)=>void}){
 const recorder=useRef<Recognition|null>(null);const [busy,setBusy]=useState(false);const [heard,setHeard]=useState('');const [error,setError]=useState('');
 useEffect(()=>()=>{if(recorder.current){recorder.current.onresult=null;recorder.current.onerror=null;recorder.current.onend=null;recorder.current.abort();}},[]);
 function start(){
  const engine=window as unknown as {SpeechRecognition?:new()=>Recognition;webkitSpeechRecognition?:new()=>Recognition};
  const Constructor=engine.SpeechRecognition??engine.webkitSpeechRecognition;
  if(!Constructor){setError(ja?'このブラウザは音声認識に対応していません。発話をOFFにして続けられます。':'Pengenalan suara tidak tersedia. Matikan latihan bicara.');return;}
  if(recorder.current){recorder.current.onresult=null;recorder.current.onerror=null;recorder.current.onend=null;recorder.current.abort();}setError('');setHeard('');const recognition=new Constructor();recorder.current=recognition;recognition.lang=ja?'id-ID':'ja-JP';recognition.interimResults=false;
  recognition.onresult=e=>{setHeard(e.results[0][0].transcript);setBusy(false);};
  recognition.onerror=e=>{setBusy(false);setError(e.error==='not-allowed'?(ja?'マイクの利用が許可されていません。':'Mikrofon tidak diizinkan.'):(ja?'聞き取れませんでした。もう一度試してください。':'Coba bicara sekali lagi.'));};
  recognition.onend=()=>setBusy(false);try{recognition.start();setBusy(true);}catch{setBusy(false);setError(ja?'録音を開始できませんでした。':'Tidak bisa memulai mikrofon.');}
 }
 return <section className="speaking-exercise"><h3 lang={ja?'id':'ja'}>{text}</h3><p>{ja?'この文を声に出して読んでください。音声認識された文を確認して送信できます。':'Baca kalimat ini, lalu periksa hasil pengenalan suara.'}</p><button disabled={disabled||busy} className="primary-button" onClick={start}>{busy?(ja?'聞き取り中…':'Mendengarkan…'):(ja?'マイクで話す':'Mulai bicara')}</button>{busy&&<button onClick={()=>{recorder.current?.abort();setBusy(false);}}>{ja?'録音を停止':'Berhenti'}</button>}{error&&<p role="status">{error}</p>}{heard&&<><p role="status">{ja?'聞き取った文：':'Terdengar: '}{heard}</p><button disabled={disabled} className="primary-button" onClick={()=>onAnswer(heard)}>{ja?'この文で回答':'Kirim jawaban'}</button></>}<small>{ja?'音声はブラウザの音声認識サービスで処理される場合があります。':'Audio dapat diproses oleh layanan pengenalan suara browser.'}</small><small>{ja?'音声認識による文の照合です。発音の細かな採点ではありません。':'Pencocokan transkripsi, bukan penilaian pelafalan terperinci.'}</small></section>;
}
