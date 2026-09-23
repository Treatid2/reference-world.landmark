// SPDX-License-Identifier: CC0-1.0
// Inert package-local checks: reads only; negative cases mutate memory only.
import {readFileSync,readdirSync,lstatSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
const root=resolve(process.argv[2]??join(dirname(fileURLToPath(import.meta.url)),'..'));
const NS='61d3e4c8-26dd-4d93-aa9b-2118f61031ba', FGPM_NS='6d7092e8-6f8a-4e25-bb6e-a0bf6588e5b4';
const hash=b=>createHash('sha256').update(b).digest('hex');
const fail=(code,detail)=>{const e=new Error(detail);e.code=code;throw e};
const check=(v,code,detail)=>{if(!v)fail(code,detail)};
function capture(dir,prefix='',result=new Map()){for(const name of readdirSync(dir).sort()){const path=join(dir,name),rel=prefix+name,s=lstatSync(path);check(!s.isSymbolicLink(),'NON_REGULAR',rel);if(s.isDirectory())capture(path,rel+'/',result);else{check(s.isFile(),'NON_REGULAR',rel);result.set(rel,readFileSync(path));}}return result;}
function validate(files){
  check(files.has('fgpm-package.json')&&!files.has('fpm-package.json'),'ENTRYPOINT','exact current entrypoint only');
  const parsed=new Map();for(const [name,b] of files)if(name.endsWith('.json')){try{parsed.set(name,JSON.parse(b.toString('utf8')))}catch{fail('JSON_PARSE',name)}}
  const d=parsed.get('fgpm-package.json'),m=parsed.get('maintenance.json'),o=parsed.get('OWNER.json');check(d&&m&&o,'MISSING_METADATA','descriptor/maintenance/owner');
  check(d.format==='fgpm.package/1'&&d.namespace===NS&&d.name==='reference-world.landmark'&&d.version==='0.1.0'&&d.license==='CC0-1.0','IDENTITY','coordinate/version/licence');
  check(NS!==FGPM_NS&&o.publisherNamespace===NS&&o.privateRoutingMetadataIncluded===false,'OWNERSHIP','namespace or public sanitation');
  check(isDeepStrictEqual(d,m.descriptor),'CONTRACT_AGREEMENT','descriptor differs from maintenance metadata');
  const expectedDeps=[['demo.worldspace','^0.1.0'],['demo.primitives','^0.1.0'],['demo.texture-vocabulary','^0.3.0']];check(isDeepStrictEqual(d.dependencies.map(x=>[x.package,x.range]),expectedDeps),'DEPENDENCIES','dependency contract');
  check(isDeepStrictEqual(d.requires.map(x=>[x.capability,x.range]),[['fgpm.handler.scene','^1.0.0'],['fgpm.handler.texture','^1.0.0']]),'HANDLERS','handler contract');
  const ids=new Set(d.contributions.map(x=>x.id));check(ids.size===4,'CONTRIBUTIONS','count/unique');
  for(const c of d.contributions){check(/^[a-z0-9-]+\.json$/.test(c.manifest)&&files.has(c.manifest),'FILE_REFERENCE',c.manifest);const content=parsed.get(c.manifest);check(content.schema===c.manifestType&&content.export.id===c.id,'EXPORT_CORRESPONDENCE',c.id);check(c.manifestType.startsWith('fgpm.demo.'),'ACTIVE_LABEL',c.manifestType)}
  const world=parsed.get('world.json').export,assembly=parsed.get('beacon.json').export,gold=parsed.get('beacon-gold.json').export,blue=parsed.get('beacon-blue.json').export;
  check(isDeepStrictEqual(world.instances.map(x=>[x.id,x.definition,x.translation]),[['world:demo/field-1','pkg:demo.field/assembly/field',[0,0,0]],['world:demo/character-1','pkg:demo.character/assembly/block-character',[0,0,0]],['world:reference/beacon-1','pkg:reference-world.landmark/assembly/beacon',[4,0,2]]])&&world.camera==='pkg:demo.camera/camera/fixed','WORLD_BEHAVIOR','instances/camera');
  check(isDeepStrictEqual(assembly.parts.map(x=>[x.id,x.mesh,x.textureHook,x.translation]),[['base','pkg:demo.primitives/mesh/body-cube','pkg:reference-world.landmark/appearance/beacon',[0,0.5,0]],['shaft','pkg:demo.primitives/mesh/body-cube','pkg:reference-world.landmark/appearance/beacon',[0,1.5,0]],['light','pkg:demo.primitives/mesh/head-cube','pkg:reference-world.landmark/appearance/beacon',[0,2.7,0]]]),'ASSEMBLY_BEHAVIOR','parts');
  const hook=assembly.hooks[0];check(hook.id==='pkg:reference-world.landmark/appearance/beacon'&&hook.default===gold.id&&hook.semanticRelation==='relation:demo.texture/base-colour-solid-to-runtime/1','HOOK_RELATION','hook/default/relation');
  check(isDeepStrictEqual(gold.colour,[255,192,48])&&isDeepStrictEqual(blue.colour,[45,105,220]),'COLORS','gold/blue');
  for(const r of d.replacements){check(ids.has(r.with),'REPLACEMENT_WITH',r.with);check(r.target===hook.id||r.target==='pkg:demo.character/appearance/head/base-colour','REPLACEMENT_TARGET',r.target)}check(d.replacements.length===3,'REPLACEMENTS','count');
  const readme=files.get('README.md').toString('utf8');for(const row of [...d.contributions.map(x=>[x.id,x.manifestType,x.manifest]),...d.replacements.map(x=>[x.target,x.with]),...d.dependencies.map(x=>[x.package,x.range]),...d.requires.map(x=>[x.capability,x.range])])check(readme.includes('| '+row.join(' | ')+' |'),'DOCUMENTATION_AGREEMENT',row.join(' '));
  for(const x of [`${NS}/reference-world.landmark`,'fgpm.package/1','provisional-v1','unselected','CC0-1.0'])check(readme.includes(x),'DOCUMENTATION_AGREEMENT',x);
  check(m.behavior.selection==='unselected from the maintained 32-package composition'&&m.dependencyProviderPins.length===8,'MAINTENANCE_METADATA','selection/provider pins');
  check(hash(files.get('LICENSE.txt'))==='a2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499','LICENSE','exact CC0 text');
  for(const [name,b] of files){if(['MIGRATION.md','maintenance.json','tests/check.mjs'].includes(name))continue;const text=b.toString('utf8');check(!/(?:\bfpm\.|fpm-package\.json)/.test(text),'ACTIVE_LABEL',name);check(!/(?:PON-|FGRW-[A-Z]+-MBX|[A-Z]:\\|\/Codex\/)/.test(text),'PRIVATE_DATA',name)}
  return{jsonFiles:parsed.size,contributions:d.contributions.length,replacements:d.replacements.length,providerPins:m.dependencyProviderPins.length};
}
const original=capture(root),cases=[];
try{
 const counts=validate(original);cases.push({name:'current successor contract and behavior',status:'pass',...counts});
 function neg(name,want,mutate){const f=new Map([...original].map(([k,v])=>[k,Buffer.from(v)]));mutate(f);let got;try{validate(f)}catch(e){got=e.code}check(got===want,'NEGATIVE_CASE',`${name}: wanted ${want}, got ${got}`);cases.push({name,status:'pass',expectedRejection:want,observedRejection:got})}
 const change=(f,n,fn)=>{const j=JSON.parse(f.get(n));fn(j);f.set(n,Buffer.from(JSON.stringify(j)))};
 neg('legacy competing entrypoint rejected','ENTRYPOINT',f=>f.set('fpm-package.json',f.get('fgpm-package.json')));
 neg('malformed JSON rejected','JSON_PARSE',f=>f.set('world.json',Buffer.from('{')));
 neg('FGPM publisher namespace reuse rejected','IDENTITY',f=>change(f,'fgpm-package.json',j=>j.namespace=FGPM_NS));
 neg('legacy active label rejected','EXPORT_CORRESPONDENCE',f=>change(f,'beacon-blue.json',j=>j.schema='fpm.demo.solid-colour/1'));
 neg('color drift rejected','COLORS',f=>change(f,'beacon-blue.json',j=>j.export.colour[0]++));
 neg('geometry drift rejected','ASSEMBLY_BEHAVIOR',f=>change(f,'beacon.json',j=>j.export.parts[0].translation[1]++));
 neg('dangling descriptor file rejected','FILE_REFERENCE',f=>{change(f,'fgpm-package.json',j=>j.contributions[0].manifest='missing.json');change(f,'maintenance.json',j=>j.descriptor.contributions[0].manifest='missing.json')});
 neg('dependency drift rejected','DEPENDENCIES',f=>{change(f,'fgpm-package.json',j=>j.dependencies[0].range='^9.0.0');change(f,'maintenance.json',j=>j.descriptor.dependencies[0].range='^9.0.0')});
 neg('replacement drift rejected','REPLACEMENT_WITH',f=>{change(f,'fgpm-package.json',j=>j.replacements[0].with='pkg:missing/texture');change(f,'maintenance.json',j=>j.descriptor.replacements[0].with='pkg:missing/texture')});
 neg('documentation drift rejected','DOCUMENTATION_AGREEMENT',f=>f.set('README.md',Buffer.from(f.get('README.md').toString().replace('demo.primitives | ^0.1.0','demo.primitives | ^9.0.0'))));
 neg('selection drift rejected','MAINTENANCE_METADATA',f=>change(f,'maintenance.json',j=>j.behavior.selection='selected'));
 check(isDeepStrictEqual(capture(root),original),'SOURCE_MUTATION','test changed package');
 console.log(JSON.stringify({schema:'reference-world.landmark.successor-test/1',status:'pass',root,readsOnly:true,negativeCasesInMemory:true,packageUnchanged:true,cases},null,2));
}catch(e){console.log(JSON.stringify({schema:'reference-world.landmark.successor-test/1',status:'fail',root,code:e.code??'UNEXPECTED',detail:e.message,cases},null,2));process.exitCode=1}
