const assert=require('node:assert/strict');require('./register.cjs');
let events=[],resumes=0;
global.localStorage={getItem(){return this.value},setItem(k,v){this.value=v}};
global.window={AudioContext:class{state='running';currentTime=0;destination={};resume(){resumes++;return Promise.resolve();}createOscillator(){return {frequency:{setValueAtTime(v){events.push(v)}},connect(){},start(){},stop(){},disconnect(){}}}createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}}}}};
const {playEffect,setEffectsMuted}=require('../lib/sound-effects.ts');
const signatures=[];
for(const effect of ['correct','wrong','complete','stage']){events=[];playEffect(effect);assert.ok(events.length>=2);signatures.push(events.join(','));}
assert.equal(new Set(signatures).size,4);
setEffectsMuted(true);events=[];playEffect('correct');assert.equal(events.length,0);
setEffectsMuted(false);playEffect('correct');assert.equal(events.length,2);
console.log('✓ Four distinct sound effects, mute persistence and re-enabling');
