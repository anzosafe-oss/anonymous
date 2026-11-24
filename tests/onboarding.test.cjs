const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');const source=html.slice(html.indexOf('async function saveInitialAlias'),html.indexOf('function notice'));
function env({existing='',error=false}={}){
 let rendered='';const calls=[],alert={textContent:''},form={querySelector:()=>alert};
 const database={rpc:async()=>({}),from:()=>({
  select:()=>({eq:()=>({single:async()=>({data:{alias:existing}})})}),
  update:row=>({eq:(key,uid)=>({select:()=>({single:async()=>{calls.push({alias:row.alias,uid});return {error:error?{}:null};}})})})
 })};
 const c={modal:{open:false,querySelector:()=>form,close(){this.open=false}},openDialog:h=>{rendered=h;c.modal.open=true},database,
 authClient:{auth:{updateUser:async data=>{calls.push({password:data.password});return{}},getSession:async()=>({data:{session:{user:{id:'u'}}}}),signOut:async()=>calls.push('signout')}},
 FormData:class{constructor(){this.get=k=>c.values[k]}},values:{alias:' Maria ',password:'TEST_ONLY_PASSWORD',confirmation:'TEST_ONLY_PASSWORD'},
 login(){},notice(){},user:'u',profile:{},model:{prefs:{}},render(){},recovery:true};
 vm.createContext(c);vm.runInContext(source,c);return {c,calls,form,alert,html:()=>rendered,submit:()=>form.onsubmit({preventDefault(){},submitter:{disabled:false}})};
}
test('first activation includes required alias beside password',async()=>{const e=env();await e.c.preparePasswordSetup({user:{id:'u'}});assert.match(e.html(),/name="alias"/);assert.match(e.html(),/name="password"/);await e.submit();assert.equal(e.calls[0].alias,'Maria');assert.equal(e.calls[1].password,'TEST_ONLY_PASSWORD')});
test('recovery preserves existing alias',async()=>{const e=env({existing:'Daniel'});await e.c.preparePasswordSetup({user:{id:'u'}});assert.doesNotMatch(e.html(),/name="alias"/);await e.submit();assert(!e.calls.some(c=>c.alias));});
test('alias failure blocks password change',async()=>{const e=env({error:true});e.c.showPasswordForm(true,{uid:'u',needsAlias:true});await e.submit();assert(!e.calls.some(c=>c.password));assert.match(e.alert.textContent,/Aliasul/)});
test('password mismatch makes no writes',async()=>{const e=env();e.c.showPasswordForm(true,{uid:'u',needsAlias:true});e.c.values.confirmation='different';await e.submit();assert.equal(e.calls.length,0)});
test('blank or oversized alias is rejected',async()=>{const e=env();await assert.rejects(e.c.saveInitialAlias('u','  '));await assert.rejects(e.c.saveInitialAlias('u','x'.repeat(61)));assert.equal(e.calls.length,0)});
