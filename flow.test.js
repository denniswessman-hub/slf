import test from 'node:test';
import assert from 'node:assert/strict';
import { STEPS, RESULTS, SOURCES, REASONS, nextStep } from './data.js';

function walk(choices){let id='age';let reason=null;for(const choice of choices){({id,reason}=nextStep(id,choice));}return {id,reason};}
const approved=[0,0,0,0,0];
test('adult, approved SLF, confession, authorized FG and consent lead to FG',()=>assert.equal(walk([...approved,0,0,0]).id,'fg'));
test('denial can lead to TGD within SLF',()=>assert.equal(walk([...approved,1,0]).id,'tgdResult'));
test('declining FG still permits TGD',()=>assert.equal(walk([...approved,0,0,1,0]).id,'tgdResult'));
test('missing FG requirements still permit TGD',()=>assert.equal(walk([...approved,0,1,0]).id,'tgdResult'));
test('under 18 never reaches FG',()=>assert.deepEqual(walk([1]),{id:'ordinary',reason:'young'}));
test('unknown age pauses for FU review',()=>assert.equal(walk([2]).id,'consult'));
test('no contact pauses, rather than declaring TGD illegal',()=>assert.equal(walk([0,1]).id,'consult'));
test('uncertain suitability pauses',()=>assert.equal(walk([0,0,2]).id,'consult'));
test('interpreter or defender needs pause the flow',()=>assert.equal(walk([0,0,0,1]).id,'consult'));
test('impaired understanding pauses the flow',()=>assert.equal(walk([0,0,0,2]).id,'consult'));
test('no SLF decision cannot produce an approved route',()=>assert.equal(walk([0,0,0,0,2]).id,'consult'));
test('FU decision for ordinary handling is respected',()=>assert.equal(walk([0,0,0,0,1]).id,'ordinary'));
test('missing fine or FG authorization pauses the flow',()=>assert.equal(walk([...approved,0,2]).id,'consult'));
test('unclear consent pauses instead of accepting FG',()=>assert.equal(walk([...approved,0,0,2]).id,'consult'));
test('missing TGD times pauses instead of issuing a time',()=>assert.deepEqual(walk([...approved,1,1]),{id:'consult',reason:'times'}));
test('FU can choose ordinary handling from TGD gate',()=>assert.equal(walk([...approved,1,2]).id,'ordinary'));
test('invalid input cannot silently choose a route',()=>{assert.throws(()=>nextStep('age',99),RangeError);assert.throws(()=>nextStep('missing',0),RangeError);});
test('entire graph terminates with valid sources and reasons',()=>{
  const leaves=new Set();
  function visit(id,seen=[]){assert.ok(!seen.includes(id),'cycle detected');if(RESULTS[id]){leaves.add(id);return;}
    const step=STEPS[id];assert.ok(step,`missing step ${id}`);for(const source of step.sources)assert.ok(SOURCES[source]);
    step.options.forEach((o,i)=>{assert.ok(!o.reason||REASONS[o.reason]);assert.equal(nextStep(id,i).id,o.next);visit(o.next,[...seen,id]);});
  }
  visit('age');assert.deepEqual([...leaves].sort(),Object.keys(RESULTS).sort());
  for(const r of Object.values(RESULTS)){assert.ok(r.checklist.length);for(const s of r.sources)assert.ok(SOURCES[s]);}
});
test('every path to FG requires all safeguards',()=>{
  const paths=[];function visit(id,trail=[]){if(RESULTS[id]){if(id==='fg')paths.push(trail);return;}STEPS[id].options.forEach((o,i)=>visit(o.next,[...trail,[id,i]]));}
  visit('age');assert.equal(paths.length,1);assert.deepEqual(paths[0].map(([id])=>id),['age','contact','suitable','readiness','decision','admission','penalty','consent']);assert.ok(paths[0].every(([,answer])=>answer===0));
});
test('source URLs are secure, explicit and nonempty',()=>{for(const s of Object.values(SOURCES)){assert.equal(new URL(s.url).protocol,'https:');assert.ok(s.label&&s.note);}});
