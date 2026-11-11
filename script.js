const puroks=['Purok 1','Purok 2','Purok 3','Purok 4','Purok 5'];
const jobOptions=['Farmer','Fisherman','Teacher','Nurse','Police officer','Seafarer','Driver','Construction worker','Vendor','Student'];
const nameExts=['Jr.','Sr.','II','III','IV','V'];
const educationLevels=['No formal education','Elementary level','Elementary graduate','High school level','High school graduate','Senior high school graduate','Vocational / technical','College level','College graduate','Postgraduate'];
const bloodTypes=['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'];
const complexions=['Fair','Light brown','Brown','Dark brown','Dark'];
const famRels=['Head of the family','Spouse','Child','Parent','Sibling','Other relative','Non-relative'];
const housingTypes=['Single-family house','Duplex','Townhouse','Apartment','Condominium','Makeshift / informal'];
const tenureTypes=['Owner','Renter','Tenant','Rent-free (with owner\'s consent)','Informal settler'];
const citizenshipList=['Filipino'],ethnicityList=['Cebuano','Subanen','Higaonon','Boholano','Ilonggo','Tagalog','Maranao'];
const religionList=['Roman Catholic','Islam','Iglesia ni Cristo','Protestant','Born Again Christian','Seventh-day Adventist','Aglipayan',"Jehovah's Witness"];
const phoneFmt=str=>{
  let d=String(str||'').replace(/[^\d+]/g,'');
  const intl=d.startsWith('+')||d.startsWith('63');
  d=d.replace(/\+/g,'');
  if(intl){
    let n=d.startsWith('63')?d.slice(2):(d.length<2?'':d);
    n=n.replace(/^0/,'').slice(0,10);
    return ['+63',n.slice(0,3),n.slice(3,6),n.slice(6,10)].filter(Boolean).join(' ');
  }
  if(d.startsWith('9'))d='0'+d;
  d=d.slice(0,11);
  return [d.slice(0,4),d.slice(4,7),d.slice(7,11)].filter(Boolean).join(' ');
};
const phoneRaw=str=>String(str||'').replace(/\s/g,'');
const phoneOk=str=>/^(09\d{9}|\+639\d{9})$/.test(phoneRaw(str));
function fmtPhone(el,e){
  const f=phoneFmt(el.value);
  const del=e&&e.inputType&&e.inputType.indexOf('delete')===0;
  el.value=(del&&f==='+63')?'':f;
}
function extraSections(r,so,editing){
  const lab=(id,l)=>`<label class="${labelCls}" for="${id}">${l}</label>`;
  const tx=(id,l,v,ph,cls='sm:col-span-2')=>`<div class="${cls}">${lab(id,l)}<input id="${id}" class="${field}" placeholder="${ph}" value="${esc(v||'')}" oninput="capName(this)" autocapitalize="words" autocomplete="off"></div>`;
  const dl=(id,l,v,ph,list)=>`<div class="sm:col-span-2">${lab(id,l)}<input id="${id}" list="${id}-list" class="${field}" placeholder="${ph}" value="${esc(v||'')}" oninput="capName(this)" autocapitalize="words" autocomplete="off"><datalist id="${id}-list">${list.map(x=>`<option value="${esc(x)}">`).join('')}</datalist></div>`;
  const sel=(id,l,arr,v,cls='sm:col-span-2')=>`<div class="${cls}">${lab(id,l)}${so(arr,v).replace('<select','<select id="'+id+'"')}</div>`;
  const num=(id,l,v,ph,min,max)=>`<div class="sm:col-span-3">${lab(id,l)}<input id="${id}" type="number" min="${min}" max="${max}" step="any" class="${field}" placeholder="${ph}" value="${esc(v??'')}"></div>`;
  const sec=(title,desc,body)=>`<section class="border-t border-slate-100 pt-8"><h2 class="text-sm font-semibold text-slate-900">${title}</h2><p class="mt-0.5 text-xs text-slate-500">${desc}</p><div class="mt-5 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">${body}</div></section>`;
  return sec('More personal details','Citizenship, ethnicity, religion and education.',
      dl('citizenship','Citizenship',editing?r.citizenship:'Filipino','e.g. Filipino',citizenshipList)+dl('ethnicity','Ethnicity / ethnolinguistic group',r.ethnicity,'e.g. Cebuano',ethnicityList)+dl('religion','Religion',r.religion,'e.g. Roman Catholic',religionList)+sel('education','Highest educational attainment',educationLevels,r.education))
    +sec('Physical details','Height, weight, blood type and complexion.',
      num('height','Height (cm)',r.height,'e.g. 165',30,250)+num('weight','Weight (kg)',r.weight,'e.g. 58',1,400)+sel('blood-type','Blood type',bloodTypes,r.bloodType,'sm:col-span-3')+sel('complexion','Complexion',complexions,r.complexion,'sm:col-span-3'))
    +sec('Family details','Mother\'s maiden name, family head and relationship to the family head.',
      tx('mother-maiden','Mother\'s maiden name',r.motherMaiden,'Full maiden name')+tx('fam-head','Family head',r.famHead,'Name of family head')+sel('fam-rel','Relationship to family head',famRels,r.famRel))
    +sec('Housing and tenure','Type of housing unit and tenure status.',
      sel('housing-type','Type of housing unit',housingTypes,r.housingType,'sm:col-span-3')+sel('tenure','Tenure status',tenureTypes,r.tenure,'sm:col-span-3'));
}
const pwdTypes=['Visual disability','Hearing disability','Speech and language impairment','Physical / orthopedic disability','Intellectual disability','Learning disability','Mental / psychosocial disability','Chronic illness','Rare disease','Cancer','Multiple disabilities','Others'];
const pat=[['Yes'],['No'],['Yes'],['No'],['No']];
const AUTH_KEY='barangay-session-v1';
const VIEWS=['dashboard','records','survey','submissions'];
const isPub=()=>v==='public'||v==='thanks'||v==='status';
const savedView=(()=>{try{const s=localStorage.getItem(AUTH_KEY);return s==='assistance'?'records':s==='reports'?'dashboard':VIEWS.includes(s)?s:null}catch(e){return null}})();
let animateNext=true;
let v=savedView||'home',page=1,toast='',q='',filterBy='all',purokBy='all',viewIndex=-1,deleteIndex=-1,editIndex=-1,loginError='',loginRole='',subTab='pending',subIndex=-1,declineIndex=-1;
const AUTH_USER='admin',AUTH_PASS='admin123';

const newUid=()=>'u'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const names=['Santos, Maria Cruz','Reyes, Juan Dela Pena','Garcia, Ana Lopez','Bautista, Pedro Ramos','Mendoza, Rosa Flores','Villanueva, Jose Aquino','Castillo, Liza Navarro','Torres, Miguel Santiago','Dizon, Carmen Pascual','Ramos, Antonio Cruz'];
const ages=[34,51,29,63,45,38,57,42,60,26];
const jobs=['Farmer','Fisherman','Public school teacher','Sari-sari store owner','Tricycle driver','Carpenter','Nurse','Tailor','Electrician','Senior high student'];
const civils=['Married','Married','Single','Widowed','Married','Single','Widowed','Married','Widowed','Single'];

const STORE='barangay-residents-v2';
const seedChildren={
  'Santos, Maria Cruz':[{name:'Santos, Mark Cruz',age:12,here:'Yes'},{name:'Santos, Anna Cruz',age:9,here:'Yes'}],
  'Reyes, Juan Dela Pena':[{name:'Reyes, Paolo Dela Pena',age:24,here:'No'},{name:'Reyes, Jenny Dela Pena',age:19,here:'Yes'}],
  'Bautista, Pedro Ramos':[{name:'Bautista, Carlo Ramos',age:35,here:'No'}],
  'Mendoza, Rosa Flores':[{name:'Mendoza, Liza Flores',age:16,here:'Yes'}]
};
const seedSex={'Santos, Maria Cruz':'Female','Reyes, Juan Dela Pena':'Male','Garcia, Ana Lopez':'Female','Bautista, Pedro Ramos':'Male','Mendoza, Rosa Flores':'Female','Villanueva, Jose Aquino':'Male','Castillo, Liza Navarro':'Female','Torres, Miguel Santiago':'Male','Dizon, Carmen Pascual':'Female','Ramos, Antonio Cruz':'Male'};
const seedSpouse={'Santos, Maria Cruz':'Santos, Roberto Cruz','Reyes, Juan Dela Pena':'Reyes, Elena Dela Pena','Mendoza, Rosa Flores':'Mendoza, Carlos Flores','Torres, Miguel Santiago':'Torres, Gina Santiago'};
const birthdays=ages.map((age,i)=>`${2026-age}-${String((i%10)+1).padStart(2,'0')}-${String((i*2)%27+1).padStart(2,'0')}`);
const seed=names.map((name,i)=>({id:`R-${String(i+1).padStart(3,'0')}`,uid:'seed-'+(i+1),name,age:ages[i],ageYear:2026,birthday:birthdays[i],civil:civils[i],job:jobs[i],purok:puroks[i%5],pwd:pat[i%5][0],children:seedChildren[name]||[],sex:seedSex[name]||'',spouse:seedSpouse[name]||''}));
const renumber=list=>{
  let changed=false;
  [...list].sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),undefined,{sensitivity:'base'})).forEach((r,i)=>{
    const id=`R-${String(i+1).padStart(3,'0')}`;
    if(r.id!==id){r.id=id;changed=true}
  });
  return changed;
};
renumber(seed);
const nowYear=new Date().getFullYear();
let residents=(()=>{
  try{
    const saved=JSON.parse(localStorage.getItem(STORE));
    if(!Array.isArray(saved))return seed;
    let changed=false;
    let nextId=saved.reduce((m,r)=>Math.max(m,Number(String(r.id||'').replace(/\D/g,''))||0),0)+1;
    saved.forEach(r=>{
      if(!r.id){r.id=`R-${String(nextId++).padStart(3,'0')}`;changed=true}
      if(!r.uid){r.uid=newUid();changed=true}
      if(!r.civil){r.civil='Single';changed=true}
      if(!Array.isArray(r.children)){r.children=seedChildren[r.name]||[];changed=true}
      if(r.spouse===undefined){r.spouse=seedSpouse[r.name]||'';changed=true}
      if(!r.sex&&seedSex[r.name]){r.sex=seedSex[r.name];changed=true}
      if(r.birthday)return;
      if(!r.ageYear){r.ageYear=nowYear;changed=true}
      else if(nowYear>r.ageYear){
        if(r.age!==''&&r.age!=null)r.age=Number(r.age||0)+(nowYear-r.ageYear);
        r.ageYear=nowYear;changed=true;
      }
    });
    if(renumber(saved))changed=true;
    if(changed)localStorage.setItem(STORE,JSON.stringify(saved));
    return saved;
  }catch{return seed}
})();
const persist=()=>{renumber(residents);try{localStorage.setItem(STORE,JSON.stringify(residents))}catch{}};
const SUBS_KEY='barangay-submissions-v1';
let submissions=(()=>{try{const x=JSON.parse(localStorage.getItem(SUBS_KEY));return Array.isArray(x)?x:[]}catch{return []}})();
const persistSubs=()=>{try{localStorage.setItem(SUBS_KEY,JSON.stringify(submissions))}catch{}};
const reloadSubs=()=>{try{const x=JSON.parse(localStorage.getItem(SUBS_KEY));if(Array.isArray(x))submissions=x}catch{}ensureRefs()};
const pendingCount=()=>submissions.filter(x=>x.status==='pending').length;
const fmtDT=iso=>{const d=new Date(iso);return iso&&!isNaN(d)?d.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}):''};
const makeId=()=>{
  const max=residents.reduce((m,r)=>{const n=Number(String(r.id||'').replace(/\D/g,''));return Number.isFinite(n)&&n>m?n:m},0);
  return `R-${String(max+1).padStart(3,'0')}`;
};
const sameInfo=(a,b)=>{
  const n=v=>String(v??'').toLowerCase().replace(/\s+/g,' ').trim();
  const kids=r=>JSON.stringify((r.children||[]).map(c=>[n(c.name),String(c.age??''),c.here==='No'?'No':'Yes']));
  const keys=['name','birthday','sex','civil','spouse','job','scholar','emName','emRel','emContact','nameExt','birthPlace','citizenship','ethnicity','religion','education','height','weight','bloodType','complexion','email','street','voterYear','motherMaiden','famHead','famRel','soloParent','ofw','housingType','tenure','purok','pwd','pwdType','pwdId','contact','employment','voter','fourPs','remarks'];
  if(n(ageOf(a))!==n(ageOf(b)))return false;
  if(kids(a)!==kids(b))return false;
  return keys.every(k=>n(a[k])===n(b[k]));
};
const scholarOf=r=>r.scholar==='Scholar'?'Yes':r.scholar==='Not a scholar'?'No':(r.scholar||'');
const normName=s=>String(s||'').toLowerCase().replace(/\s+/g,' ').trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtDate=d=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(d||'');return m?`${m[3]}-${m[2]}-${m[1]}`:(d||'')};
const ageFromBirthday=birthday=>{
  if(!birthday)return '';
  const b=new Date(`${birthday}T00:00:00`);
  if(isNaN(b))return '';
  const t=new Date();
  let age=t.getFullYear()-b.getFullYear();
  if(t.getMonth()<b.getMonth()||(t.getMonth()===b.getMonth()&&t.getDate()<b.getDate()))age--;
  return age>=0?age:'';
};
const ageOf=r=>{
  const a=r.birthday?ageFromBirthday(r.birthday):'';
  if(a!=='')return a;
  if(r.age===''||r.age==null)return r.age;
  const y=new Date().getFullYear();
  return Number(r.age||0)+Math.max(0,y-(Number(r.ageYear)||y));
};
const ageGroup=r=>{const a=ageOf(r);if(a===''||a==null||isNaN(Number(a)))return '';return a<18?'Under 18':a>=60?'Senior Citizen':'Adult'};
const ageCounts=(list=residents)=>{const c={'Under 18':0,'Adult':0,'Senior Citizen':0};list.forEach(r=>{const g=ageGroup(r);if(g)c[g]++});return c};
const byUid=u=>u?residents.find(r=>r.uid===u):undefined;
const childView=c=>{const l=byUid(c.uid);return l?{...c,name:l.name,age:ageOf(l),here:'Yes',linked:true}:c};
const spouseName=r=>{const l=byUid(r.spouseUid);return l?l.name:(r.spouse||'')};
const householdOf=r=>{
  const out=new Map();
  const add=(x,rel)=>{if(x&&x.uid!==r.uid&&!out.has(x.uid))out.set(x.uid,{res:x,rel})};
  const kidsOf=p=>(Array.isArray(p.children)?p.children:[]).map(c=>byUid(c.uid)).filter(Boolean);
  const parents=residents.filter(p=>(Array.isArray(p.children)?p.children:[]).some(c=>c.uid&&c.uid===r.uid));
  const sp=byUid(r.spouseUid);
  add(sp,'Spouse');
  parents.forEach(p=>{add(p,'Parent');add(byUid(p.spouseUid),'Parent')});
  kidsOf(r).forEach(k=>add(k,'Child'));
  if(sp)kidsOf(sp).forEach(k=>add(k,'Child'));
  parents.forEach(p=>kidsOf(p).forEach(k=>add(k,'Sibling')));
  return [...out.values()];
};
function linkSpouse(uid,spouseUid){
  const me=byUid(uid);
  if(!me)return;
  const oldSp=byUid(me.spouseUid);
  if(oldSp&&oldSp.spouseUid===uid)oldSp.spouseUid='';
  me.spouseUid='';
  const sp=byUid(spouseUid);
  if(!sp||sp.uid===uid)return;
  const spOld=byUid(sp.spouseUid);
  if(spOld&&spOld.spouseUid===sp.uid)spOld.spouseUid='';
  sp.spouseUid=uid;sp.spouse=me.name;
  me.spouseUid=sp.uid;me.spouse=sp.name;
}
const ageDash=()=>{const c=ageCounts();return [['Under 18','0–17 years','text-sky-600'],['Adult','18–59 years','text-pine-700'],['Senior Citizen','60 years and above','text-amber-500']].map(([k,cap,tone])=>dashStat(c[k],k,cap,usersIcon,tone)).join('')};
const summary=()=>({total:residents.length,pwd:residents.filter(r=>r.pwd==='Yes').length});
const saveResident=rec=>{residents.unshift(rec);persist()};

const field='block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-pine-700 focus:outline-none focus:ring-2 focus:ring-pine-700/10';
const labelCls='mb-1.5 block text-sm font-medium text-slate-700';
const btn='inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40';
const btnPrimary=`${btn} bg-pine-700 text-white hover:bg-pine-800`;
const btnGhost=`${btn} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`;
const statCard=(n,l)=>`<div class="rounded-xl border border-slate-200 bg-white p-5"><p class="text-sm text-slate-500">${l}</p><p class="mt-2 text-2xl font-semibold tracking-tight text-slate-900">${n}</p></div>`;
const dashStat=(n,l,cap,icon,tone)=>`<div class="hover-lift rounded-2xl border border-slate-200 bg-white p-5"><div class="flex items-start justify-between gap-3"><p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">${l}</p><span class="${tone}" aria-hidden="true">${icon}</span></div><p data-count class="mt-3 text-3xl font-semibold tracking-tight text-slate-900">${n}</p><p class="mt-1 text-xs text-slate-500">${cap}</p></div>`;

const usersIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const heartIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>`;
const checkIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>`;
const clockIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`;
const lockIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;
const menuIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" class="h-5 w-5" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`;
const printIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2"/><rect x="6" y="14" width="12" height="7" rx="1"/></svg>`;
const trashIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>`;
const closeIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" class="h-4 w-4" aria-hidden="true"><path d="M6 18L18 6M6 6l12 12"/></svg>`;
const logoutIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><path d="M15 12H3m0 0 3-3m-3 3 3 3M10 5V3h9a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-9v-2"/></svg>`;

const navItems=[['dashboard','Dashboard'],['records','Residents'],['submissions','Submissions'],['survey','Survey']];
const navGroups=[['Overview',navItems.slice(0,1)],['Records',navItems.slice(1)]];
const navBtn=(k,l)=>`<button type="button" onclick="go('${k}')" ${v===k?'aria-current="page"':''} class="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${v===k?'bg-pine-50 font-medium text-pine-800':'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} flex items-center justify-between gap-2">${l}${k==='submissions'&&pendingCount()?`<span class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">${pendingCount()}</span>`:''}</button>`;
const navGroupMarkup=()=>navGroups.map(([label,items])=>`<div><p class="px-3 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">${label}</p><div class="space-y-0.5">${items.map(([k,l])=>navBtn(k,l)).join('')}</div></div>`).join('');
const logoutBtn=`<button type="button" onclick="logout()" class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700">${logoutIcon}Logout</button>`;
const userCard=`<div class="mx-3 mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"><span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-pine-700 text-sm font-bold text-white">SA</span><div class="min-w-0"><p class="truncate text-xs font-semibold text-slate-900">System Admin</p><span class="mt-1 inline-flex rounded-full bg-pine-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-pine-700">Admin</span></div></div>`;
const brandBlock=`<button type="button" onclick="go('dashboard')" class="flex min-w-0 items-center gap-2.5 rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-700"><span class="flex shrink-0 items-center gap-1.5"><img src="assets/barangay-logo.jpg" alt="" class="h-9 w-9 rounded-full object-cover"><img src="assets/tangub-logo.jpg" alt="" class="h-9 w-9 object-contain"></span><span class="min-w-0"><span class="block text-[9px] font-semibold uppercase tracking-[0.24em] text-pine-600">Barangay</span><span class="mt-1 block text-sm font-semibold tracking-[0.1em] text-slate-900">MIGCANAWAY</span><span class="mt-0.5 block text-[10px] uppercase tracking-[0.14em] text-slate-400">Tangub City</span><span class="block text-[9px] uppercase tracking-[0.14em] text-slate-400">Resident Survey</span></span></button>`;

function mobileMenu(){
  return `<div id="mobile-menu" class="hidden fixed inset-0 z-50 lg:hidden">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onclick="toggleMenu()" aria-hidden="true"></div>
    <aside class="relative flex h-full w-72 max-w-[85%] animate-slide-in flex-col border-r border-slate-200 bg-white shadow-2xl" aria-label="Navigation menu">
      <div class="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-5">${brandBlock}<button type="button" onclick="toggleMenu()" aria-label="Close navigation" title="Close navigation" class="-mr-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-700">${closeIcon}</button></div>
      ${userCard}
      <nav class="flex flex-1 flex-col gap-5 overflow-y-auto p-3" aria-label="Mobile navigation">${navGroupMarkup()}</nav>
      <div class="border-t border-slate-200 p-3">${logoutBtn}</div>
    </aside>
  </div>`;
}

function shell(title,subtitle,body,actions=''){
  const label=(navItems.find(([k])=>k===v)||[,'Dashboard'])[1];
  return `<div class="relative min-h-screen overflow-x-hidden bg-cream text-slate-900 print:bg-white">
  <header class="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur lg:hidden print:hidden">
    <button id="menu-btn" type="button" onclick="toggleMenu()" aria-label="Open navigation" title="Open navigation" aria-controls="mobile-menu" aria-expanded="false" class="-ml-1 flex h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-700">${menuIcon}<span>Menu</span></button>
    <p class="pointer-events-none absolute left-1/2 top-1/2 max-w-[40%] -translate-x-1/2 -translate-y-1/2 truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900">${label}</p>
  </header>
  <aside class="hidden border-r border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:w-64 lg:flex-col print:hidden">
    <div class="px-5 py-5">${brandBlock}</div>
    ${userCard}
    <nav class="flex flex-1 flex-col gap-5 overflow-y-auto p-3" aria-label="Main navigation">${navGroupMarkup()}</nav>
    <div class="border-t border-slate-200 p-3">${logoutBtn}</div>
  </aside>
  <div class="relative z-10 lg:pl-64 print:pl-0">
    <main class="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:max-w-none lg:px-8 lg:py-10 xl:max-w-[1400px] 2xl:max-w-[1700px] print:max-w-none print:p-0">
      <div class="${animateNext?'animate-fade-up':''}">
        ${actions?`<div class="mb-4 flex flex-wrap items-center gap-2 lg:hidden print:hidden">${actions}</div>`:''}
        <div class="mb-8 hidden flex-wrap items-start justify-between gap-4 lg:flex">
          <div><h1 class="text-2xl font-semibold tracking-tight text-slate-900">${title}</h1><p class="mt-1 text-sm text-slate-500">${subtitle}</p></div>
          ${actions?`<div class="flex items-center gap-2 print:hidden">${actions}</div>`:''}
        </div>
        ${body}
      </div>
    </main>
  </div>
  ${mobileMenu()}
</div>`;
}

function draw(){
  const views={home,login,dashboard,survey,records:recs,submissions:subs,public:survey,thanks,status:statusView};
  document.getElementById('app').innerHTML=views[v]();
  animateNext=false;
  renderModal();
  fx();
}
const reduceMotion=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function fx(){
  const root=document.getElementById('app');
  if(!root||reduceMotion())return;
  let i=0;
  root.querySelectorAll('main .rounded-xl, main .rounded-2xl').forEach(el=>{
    if(el.parentElement.closest('.rounded-xl, .rounded-2xl'))return;
    el.classList.add('reveal');el.style.setProperty('--d',Math.min(i++*70,560)+'ms');
  });
  root.querySelectorAll('main tbody tr').forEach((tr,n)=>{
    if(n>13)return;
    tr.classList.add('row-in');tr.style.setProperty('--d',(220+n*35)+'ms');
  });
  root.querySelectorAll('[data-count]').forEach((el,n)=>{
    const end=parseInt(el.textContent,10);
    if(!isFinite(end)||end<1)return;
    const t0=performance.now()+120+n*60,dur=900;
    el.textContent='0';
    const tick=now=>{
      const p=Math.min(1,Math.max(0,(now-t0)/dur));
      el.textContent=Math.round(end*(p===1?1:1-Math.pow(2,-10*p)));
      if(p<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
function animClose(fn){
  const m=document.querySelector('#modal-root > div');
  if(!m||reduceMotion()){fn();return}
  if(m.classList.contains('is-closing'))return;
  m.classList.add('is-closing');
  setTimeout(fn,170);
}
function renderModal(){
  let el=document.getElementById('modal-root');
  if(!el){el=document.createElement('div');el.id='modal-root';document.body.appendChild(el)}
  el.innerHTML=v==='records'?((viewIndex>=0?residentModal():'')+(deleteIndex>=0?deleteModal():'')):v==='submissions'?((subIndex>=0?subModal():'')+(declineIndex>=0?declineModal():'')):'';
}
function go(k){
  v=k;animateNext=true;page=1;q='';filterBy='all';purokBy='all';viewIndex=-1;deleteIndex=-1;editIndex=-1;
  loginRole='';subIndex=-1;declineIndex=-1;if(k==='dashboard'||k==='submissions')reloadSubs();
  try{VIEWS.includes(k)?localStorage.setItem(AUTH_KEY,k):localStorage.removeItem(AUTH_KEY)}catch(e){}
  draw();
  if(k==='login')setTimeout(()=>{const u=document.getElementById('u');if(u)u.focus()},60)
}
function editResident(i){editIndex=i;v='survey';animateNext=true;page=1;q='';filterBy='all';purokBy='all';viewIndex=-1;draw()}
function openResident(i){viewIndex=i;renderModal()}
function closeResident(){animClose(()=>{viewIndex=-1;renderModal()})}
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  if(declineIndex>=0)closeDecline();
  else if(subIndex>=0)closeSub();
  else if(deleteIndex>=0)closeDelete();
  else if(viewIndex>=0)closeResident();
});
function askDelete(i){deleteIndex=i;renderModal()}
function closeDelete(){animClose(()=>{deleteIndex=-1;renderModal()})}
function confirmDelete(){
  const r=residents[deleteIndex];
  if(!r){closeDelete();return}
  residents.forEach(o=>{
    if(o.spouseUid===r.uid)o.spouseUid='';
    if(Array.isArray(o.children))o.children=o.children.map(c=>c.uid===r.uid?{name:r.name,age:ageOf(r),here:'Yes'}:c);
  });
  residents.splice(deleteIndex,1);
  persist();
  deleteIndex=-1;viewIndex=-1;
  renderRecords();
  renderModal();
  flash('Resident deleted');
}
function deleteModal(){
  const r=residents[deleteIndex];
  if(!r)return '';
  return `<div class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4" onclick="if(event.target===this)closeDelete()" role="alertdialog" aria-modal="true" aria-label="Delete resident">
  <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
    <div class="grid h-11 w-11 place-items-center rounded-full bg-red-50 text-red-600">${trashIcon}</div>
    <h2 class="mt-4 text-base font-semibold text-slate-900">Delete this resident?</h2>
    <p class="mt-1 text-sm text-slate-600"><span class="font-medium text-slate-900">${esc(r.name)}</span> (${esc(r.id||'')}) will be removed from the records. This cannot be undone.</p>
    <div class="mt-6 flex justify-end gap-2"><button type="button" class="${btnGhost}" onclick="closeDelete()">Cancel</button><button type="button" class="${btn} bg-red-600 text-white hover:bg-red-700" onclick="confirmDelete()">Delete</button></div>
  </div></div>`;
}
let searchTimer;
function renderRecords(){
  const results=document.getElementById('records-results');
  if(results)results.innerHTML=recordsCard();
  else if(v==='records')draw();
}
function setSearch(value){q=value;page=1;clearTimeout(searchTimer);searchTimer=setTimeout(renderRecords,120)}
function setFilter(value){filterBy=value;page=1;renderRecords()}
function setPurok(value){purokBy=value;page=1;renderRecords()}
function setPage(n){page=n;renderRecords()}
function exportCsv(){
  const cell=value=>`"${String(value??'').replace(/"/g,'""')}"`;
  const kidsText=r=>(Array.isArray(r.children)?r.children:[]).map(childView).map(c=>`${c.name} (${c.age===''||c.age==null?'age n/a':c.age+' yrs'}, ${c.here==='No'?'Non-resident':'Resident'})`).join('; ');
  const rows=[['ID','Name','Age','Age Group','Birthdate','Sex','Civil Status','Spouse','Children','Household Members','Contact Number','Emergency Contact','Emergency Relationship','Emergency Number','Work','Scholar','Employment Status','Registered Voter','4Ps Beneficiary','Purok','PWD','PWD Type','PWD ID Number','Name Extension','Place of Birth','Citizenship','Ethnicity','Religion','Education','Height (cm)','Weight (kg)','Blood Type','Complexion','Email','Street / House No.','Last Year Voted',"Mother's Maiden Name",'Family Head','Relationship to Family Head','Solo Parent','OFW','Housing Type','Tenure Status','Remarks'],...[...residents].sort((x,y)=>String(x.name||'').localeCompare(String(y.name||''),undefined,{sensitivity:'base'})).map(r=>[r.id||'',r.name,ageOf(r),ageGroup(r),r.birthday?fmtDate(r.birthday):'',r.sex||'',r.civil||'',spouseName(r),kidsText(r),householdOf(r).map(h=>`${h.res.name} (${h.rel})`).join('; '),r.contact||'',r.emName||'',r.emRel||'',r.emContact||'',r.job||'',scholarOf(r),r.employment||'',r.voter||'',r.fourPs||'',r.purok||'',r.pwd||'',r.pwd==='Yes'?(r.pwdType||''):'',r.pwd==='Yes'?(r.pwdId||''):'',r.nameExt||'',r.birthPlace||'',r.citizenship||'',r.ethnicity||'',r.religion||'',r.education||'',r.height||'',r.weight||'',r.bloodType||'',r.complexion||'',r.email||'',r.street||'',r.voterYear||'',r.motherMaiden||'',r.famHead||'',r.famRel||'',r.soloParent||'',r.ofw||'',r.housingType||'',r.tenure||'',r.remarks||''])];
  const csv=rows.map(row=>row.map(cell).join(',')).join('\r\n');
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=`barangay-residents-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),0);
  flash('Export downloaded');
}
function logout(){
  if(confirm('Are you sure you want to log out?')){loginError='';go('home')}
}
function attemptLogin(){
  const username=(document.getElementById('u')?.value||'').trim();
  const password=document.getElementById('p')?.value||'';
  if(username===AUTH_USER&&password===AUTH_PASS){
    loginError='';
    go('dashboard');
    return;
  }
  loginError='Invalid username or password.';
  draw();
}
let toastTimer;
function flash(m){
  toast=m;
  let el=document.getElementById('toast');
  if(!el){el=document.createElement('div');el.id='toast';document.body.appendChild(el)}
  el.innerHTML=`<div class="fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"><div role="status" aria-live="polite" class="toast-in rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">${esc(m)}</div></div>`;
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{
    const t=el.querySelector('[role=status]');
    if(t)t.style.animation='toast-out 300ms ease-in forwards';
    toastTimer=setTimeout(()=>{toast='';el.innerHTML=''},300);
  },1700);
}
function toggleMenu(){
  const panel=document.getElementById('mobile-menu');
  const button=document.getElementById('menu-btn');
  if(!panel)return;
  const opening=panel.classList.contains('hidden');
  if(button)button.setAttribute('aria-expanded',String(opening));
  if(opening||reduceMotion()){panel.classList.toggle('hidden',!opening);return}
  if(panel.classList.contains('is-closing'))return;
  panel.classList.add('is-closing');
  setTimeout(()=>{panel.classList.add('hidden');panel.classList.remove('is-closing')},200);
}

const hNav='text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75 transition-colors hover:text-white';
const hFeatures=[[usersIcon,'Resident survey','Fill out your personal, family, housing and contact details online. No login needed.'],[checkIcon,'Request tracking','Use your reference code to see if your submission was accepted or declined.'],[heartIcon,'Complete profile','Personal, physical, family, housing and sectoral information in one form.'],[lockIcon,'Admin review','Barangay staff review every submission before it is added to the resident records.']];
const hSteps=[['01','Fill out the survey','Answer the resident survey form. It only takes a few minutes.'],['02','Save your reference code','You get a code after submitting. Keep it so you can check later.'],['03','Check your status','See if the barangay admin accepted or declined your submission.']];
function home(){
  const total=residents.length;
  return `<div id="top" class="relative min-h-screen overflow-x-hidden bg-[#06130e] text-white">
  <header class="sticky top-0 z-30 border-b border-white/10 bg-[#06130e]/90 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
      <button type="button" onclick="window.scrollTo({top:0,behavior:'smooth'})" class="flex min-w-0 items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
        <span class="flex shrink-0 items-center gap-1.5"><img src="assets/barangay-logo.jpg" alt="" class="h-9 w-9 rounded-full object-cover"><img src="assets/tangub-logo.jpg" alt="" class="h-9 w-9 object-contain"></span>
        <span class="min-w-0"><span class="block truncate text-sm font-bold tracking-[0.14em] text-white">MIGCANAWAY</span><span class="block truncate text-[9px] uppercase tracking-[0.2em] text-emerald-400">Tangub City</span></span>
      </button>
      <nav class="flex items-center gap-4 sm:gap-7" aria-label="Main navigation">
        <button type="button" onclick="window.scrollTo({top:0,behavior:'smooth'})" class="${hNav} hidden border-b-2 border-emerald-400 pb-0.5 text-white sm:inline">Home</button>
        <button type="button" onclick="go('public')" class="${hNav} hidden sm:inline">Resident Survey</button>
        <button type="button" onclick="go('login')" class="rounded-lg bg-emerald-400 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#06130e] shadow-[0_0_24px_-6px_rgba(52,211,153,.9)] hover:bg-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">Log in</button>
      </nav>
    </div>
  </header>

  <section class="relative isolate flex min-h-[calc(100vh-61px)] items-center overflow-hidden">
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(31,90,76,.55),transparent_60%)]"></div>
      <div class="absolute -left-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-emerald-500/10 blur-[120px] animate-drift"></div>
      <img src="assets/barangay-logo.jpg" alt="" class="absolute -right-24 top-1/2 h-[26rem] w-[26rem] -translate-y-1/2 rounded-full object-cover opacity-[.12] grayscale sm:right-[4%] sm:h-[34rem] sm:w-[34rem]">
      <div class="absolute inset-0 bg-gradient-to-r from-[#06130e] via-[#06130e]/70 to-transparent"></div>
      <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#06130e] to-transparent"></div>
    </div>
    <div class="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div class="max-w-2xl">
        <span class="reveal inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300"><span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>Web-based resident survey</span>
        <h1 class="mt-5">
          <span class="reveal block text-5xl font-extrabold italic leading-none tracking-tight sm:text-7xl" style="--d:80ms">Be Counted!</span>
          <span class="reveal mt-2 block text-sm font-semibold italic text-white/90 sm:text-lg" style="--d:140ms">Help us keep Barangay Migcanaway's records updated</span>
          <span class="reveal mt-2 block text-4xl font-extrabold italic leading-none tracking-tight text-emerald-400 sm:text-6xl" style="--d:200ms">Take the Survey</span>
          <span class="reveal block text-7xl font-black italic leading-[.95] tracking-tight sm:text-9xl" style="--d:260ms">TODAY</span>
        </h1>
        <p class="reveal mt-6 max-w-xl text-sm leading-6 text-white/75 sm:text-base" style="--d:320ms">A resident survey system for Barangay Migcanaway, Tangub City. Submit your household details online, then track whether your submission was accepted, all in one place.</p>
        <div class="reveal mt-7 flex flex-wrap items-center gap-3" style="--d:380ms">
          <button type="button" onclick="go('public')" class="-skew-x-12 bg-white px-6 py-3.5 text-sm font-bold text-[#06130e] transition-colors hover:bg-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"><span class="inline-block skew-x-12">&rarr; Take the Survey</span></button>
          <button type="button" onclick="go('status')" class="rounded-lg border border-emerald-400/50 px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-300 transition-colors hover:bg-emerald-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">Check status</button>
        </div>
        <div class="reveal mt-7 inline-flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur" style="--d:440ms">
          <div class="text-center"><p class="text-2xl font-bold text-emerald-400">${total}</p><p class="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/70">Residents</p></div>
          <span class="h-8 w-px bg-white/15"></span>
          <div class="text-center"><p class="text-2xl font-bold text-emerald-400">${puroks.length}</p><p class="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/70">Puroks</p></div>
        </div>
      </div>
    </div>
  </section>

  <section id="features" class="scroll-mt-16 border-t border-white/10 bg-[#081a13] py-16 sm:py-20">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <p class="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400">Features</p>
      <h2 class="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Everything in one place</h2>
      <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        ${hFeatures.map(([ic,t,d])=>`<div class="rounded-2xl border border-white/10 bg-white/[.04] p-5 transition-colors hover:border-emerald-400/40"><span class="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400">${ic}</span><h3 class="mt-4 text-sm font-semibold text-white">${t}</h3><p class="mt-1.5 text-sm leading-6 text-white/65">${d}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section id="how" class="scroll-mt-16 border-t border-white/10 py-16 sm:py-20">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <p class="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400">How it works</p>
      <h2 class="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Three simple steps</h2>
      <div class="mt-8 grid gap-4 sm:grid-cols-3">
        ${hSteps.map(([n,t,d])=>`<div class="rounded-2xl border border-white/10 bg-white/[.04] p-5"><p class="text-3xl font-extrabold italic text-emerald-400">${n}</p><h3 class="mt-3 text-sm font-semibold text-white">${t}</h3><p class="mt-1.5 text-sm leading-6 text-white/65">${d}</p></div>`).join('')}
      </div>
      <div class="mt-10 flex flex-wrap items-center gap-3">
        <button type="button" onclick="go('public')" class="rounded-lg bg-emerald-400 px-5 py-3 text-sm font-bold text-[#06130e] hover:bg-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">Take the Survey</button>
        <button type="button" onclick="go('login')" class="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">Admin log in</button>
      </div>
    </div>
  </section>

  <footer class="border-t border-white/10 px-4 py-6 text-center text-xs text-white/50">&copy; ${new Date().getFullYear()} Barangay Migcanaway, Tangub City &middot; Resident Survey System</footer>
</div>`;
}

function login(){
  return `<div class="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-cream px-4 py-10">
  <div class="pointer-events-none absolute inset-0" aria-hidden="true"><div class="absolute -left-40 top-1/4 h-[34rem] w-[34rem] rounded-full bg-pine-100/70 blur-[130px] animate-drift"></div><div class="absolute -bottom-48 right-0 h-[30rem] w-[30rem] rounded-full bg-emerald-100/60 blur-[120px] animate-drift"></div></div>
  <header class="absolute inset-x-0 top-0 z-20">
    <nav class="mx-auto flex max-w-6xl items-center justify-end gap-5 px-4 py-4 sm:gap-7 sm:px-6" aria-label="Main navigation">
      <button type="button" onclick="go('home')" class="border-b-2 border-emerald-500 pb-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-pine-800 transition-colors hover:text-pine-600">Home</button>
      <button type="button" onclick="go('public')" class="rounded-lg bg-pine-700 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-pine-800">Resident Survey</button>
    </nav>
  </header>
  <p class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[24vw] font-bold tracking-tighter text-pine-900/[0.04]" aria-hidden="true">MIGCANAWAY</p>
  <div class="relative z-10 w-full max-w-md ${animateNext?'animate-fade-up':''} rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_30px_100px_-40px_rgba(12,40,34,0.35)] sm:p-9">
    <div class="text-center"><div class="flex items-center justify-center gap-4"><img src="assets/barangay-logo.jpg" alt="Barangay Migcanaway seal" class="h-16 w-16 rounded-full object-cover ring-1 ring-slate-200 sm:h-20 sm:w-20"><img src="assets/tangub-logo.jpg" alt="Tangub City seal" class="h-16 w-16 object-contain sm:h-20 sm:w-20"></div><p class="mt-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-pine-600">Barangay</p><h1 class="mt-2 text-3xl font-semibold tracking-[0.08em] text-pine-800">MIGCANAWAY</h1><p class="mt-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Tangub City</p><p class="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Resident Survey</p><div class="mx-auto mt-6 h-px w-2/3 bg-gradient-to-r from-transparent via-pine-200 to-transparent"></div></div>
    <form class="mt-6 space-y-4" onsubmit="event.preventDefault();attemptLogin()">
      <div><label class="${labelCls}" for="u">Username</label><input id="u" class="${field}" placeholder="Enter username" autocomplete="username" required></div>
      <div><label class="${labelCls}" for="p">Password</label><input id="p" type="password" class="${field}" placeholder="Enter password" autocomplete="current-password" required></div>
      ${loginError?`<p role="alert" class="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">${loginError}</p>`:''}
      <button type="submit" class="${btnPrimary} mt-2 w-full px-4 py-3">Login</button>
    </form>
  </div>
</div>`;
}

function dashboard(){
  const recent=residents.slice(0,5).sort((a,b)=>String(a.id||'').localeCompare(String(b.id||''),undefined,{numeric:true}));
  const hour=new Date().getHours(),greeting=hour<12?'Good morning':hour<18?'Good afternoon':'Good evening';
  const today=new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  const perPurok=puroks.map(p=>[p,residents.filter(r=>r.purok===p).length]);
  const maxPurok=Math.max(1,...perPurok.map(([,n])=>n));
  const s=summary();
  const stats=[[s.total,'Total residents','Registered residents',usersIcon,'text-pine-700'],[s.pwd,'PWD residents','Persons with disability',heartIcon,'text-pine-600']];
  return shell('Dashboard','A quick look at the residents of the barangay.',`<section class="relative mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(23,69,59,0.09),transparent_48%)]" aria-hidden="true"></div>
    <div class="relative z-10 max-w-2xl"><p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-pine-600">Barangay overview · Tangub City</p><h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">${greeting}, <span class="text-pine-700">Admin</span>.</h2><p class="mt-2 text-sm leading-6 text-slate-500">${today} — here's an overview of the resident records today.</p><div class="mt-5 flex flex-wrap gap-2"><button type="button" class="${btnPrimary}" onclick="go('survey')">New resident</button><button type="button" class="${btnGhost}" onclick="go('records')">View residents</button>${pendingCount()?`<button type="button" class="${btn} border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100" onclick="go('submissions')">Review ${pendingCount()} pending</button>`:''}</div></div>
  </section>
  <div class="grid grid-cols-2 gap-3">${stats.map(([n,l,cap,icon,tone])=>dashStat(n,l,cap,icon,tone)).join('')}</div>
  <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">${ageDash()}</div>
  <div class="mt-3 grid gap-3 lg:grid-cols-5">
    <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white lg:col-span-3">
      <div class="flex items-start justify-between gap-3 px-5 py-4"><div><h2 class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">Recent residents</h2><p class="mt-1 text-xs text-slate-500">Latest profiles added to the record.</p></div><button type="button" onclick="go('records')" class="rounded-lg px-2 py-1.5 text-xs font-medium text-pine-700 transition-colors hover:bg-pine-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-700">View all</button></div>
      <div class="overflow-x-auto border-t border-slate-100"><table class="w-full min-w-[620px] text-left text-sm"><thead class="bg-slate-50 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500"><tr><th class="px-5 py-2.5 font-medium">ID</th><th class="px-3 py-2.5 font-medium">Name</th><th class="px-4 py-2.5 font-medium">Work</th><th class="px-5 py-2.5 font-medium">Purok</th></tr></thead><tbody class="divide-y divide-slate-100">${recent.map(r=>`<tr class="transition-colors hover:bg-slate-50/70"><td class="whitespace-nowrap px-5 py-3 font-mono text-xs text-slate-500">${esc(r.id||'')}</td><td class="whitespace-nowrap px-3 py-3 font-medium text-slate-900">${esc(r.name)}</td><td class="px-4 py-3 text-slate-500">${esc(r.job)}</td><td class="whitespace-nowrap px-5 py-3 text-slate-600">${esc(r.purok||'')}</td></tr>`).join('')}</tbody></table></div>
    </section>
    <section class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2"><div><h2 class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">Residents per purok</h2><p class="mt-1 text-xs text-slate-500">Number of residents in each area.</p></div><div class="mt-4 flex-1 space-y-3">${perPurok.map(([name,n])=>`<div><div class="flex items-center justify-between text-sm"><span class="font-medium text-slate-900">${name}</span><span class="text-slate-500">${n}</span></div><div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full bg-pine-700" style="width:${Math.round(n/maxPurok*100)}%"></div></div></div>`).join('')}</div><button type="button" class="${btnGhost} mt-5 w-full" onclick="go('records')">View residents</button></section>
  </div>`);
}

const residentOptions=(selected,exclude)=>isPub()?'':residents.filter(x=>x.uid&&x.uid!==exclude).slice().sort((a,b)=>String(a.name).localeCompare(String(b.name),undefined,{sensitivity:'base'})).map(x=>`<option value="${esc(x.uid)}" ${x.uid===selected?'selected':''}>${esc(x.name)} (${esc(x.id||'')})</option>`).join('');
const selfUid=()=>editIndex>=0&&residents[editIndex]?residents[editIndex].uid:'';
const yn=(name,cur)=>`<div class="flex gap-6 pt-2">${['Yes','No'].map(x=>`<label class="flex cursor-pointer items-center gap-2 text-sm text-slate-600"><input type="radio" name="${name}" value="${x}" class="h-4 w-4 accent-pine-700" ${cur===x?'checked':''}>${x}</label>`).join('')}</div>`;
const childRow=(c={})=>{
  const cv=childView(c),linked=!!cv.linked;
  return `<div class="child-row grid grid-cols-12 items-center gap-2">
  <select class="child-link ${field} col-span-12 ${isPub()?'hidden':''}" aria-label="Link child to a resident already in the system" onchange="linkChild(this)"><option value="">New child — type details below</option>${residentOptions(linked?c.uid:'',selfUid())}</select>
  <input class="child-name ${field} col-span-12 sm:col-span-4" placeholder="Child's full name" aria-label="Child's full name" oninput="capName(this)" autocapitalize="words" value="${esc(cv.name||'')}" ${linked?'readonly':''}>
  <input type="number" min="0" max="120" class="child-age ${field} col-span-4 sm:col-span-2" placeholder="Age" aria-label="Child's age" value="${esc(cv.age??'')}" ${linked?'readonly':''}>
  <select class="child-here ${field} col-span-8 sm:col-span-3" aria-label="Resident of Barangay Migcanaway or not" ${linked?'disabled':''}><option value="Yes" ${cv.here!=='No'?'selected':''}>Resident</option><option value="No" ${cv.here==='No'?'selected':''}>Non-resident</option></select>
  <button type="button" onclick="this.closest('.child-row').remove()" class="col-span-12 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 sm:col-span-3" aria-label="Remove this child" title="Remove this child">${closeIcon}<span>Remove</span></button>
</div>`;
};
function linkChild(sel){
  const row=sel.closest('.child-row'),l=byUid(sel.value);
  const name=row.querySelector('.child-name'),age=row.querySelector('.child-age'),here=row.querySelector('.child-here');
  if(l){name.value=l.name;age.value=ageOf(l);here.value='Yes';name.readOnly=true;age.readOnly=true;here.disabled=true}
  else{name.readOnly=false;age.readOnly=false;here.disabled=false}
}
function linkSpouseSel(sel){
  const l=byUid(sel.value),set=(k,v,ro)=>{const e=document.getElementById('spouse-'+k);if(e){if(v!==null)e.value=v;e.readOnly=ro}};
  if(l){const n=splitName(l.name);set('last',n.last,true);set('first',n.first,true);set('middle',n.middle,true)}
  else{['last','first','middle'].forEach(k=>set(k,null,false))}
}
function splitName(str){
  const t=String(str||'').trim();
  if(!t)return {last:'',first:'',middle:''};
  if(t.includes(',')){
    const i=t.indexOf(',');
    const rest=t.slice(i+1).trim().split(/\s+/).filter(Boolean);
    return {last:t.slice(0,i).trim(),first:rest[0]||'',middle:rest.slice(1).join(' ')};
  }
  const w=t.split(/\s+/);
  return w.length===1?{last:w[0],first:'',middle:''}:{last:w[w.length-1],first:w[0],middle:w.slice(1,-1).join(' ')};
}
function setFieldError(id,msg,label){
  const el=document.getElementById(id);
  if(!el)return;
  el.dataset.invalid=msg;el.dataset.label=label||'';
  el.style.borderColor='#ef4444';el.style.boxShadow='0 0 0 3px rgba(239,68,68,.15)';
  el.setAttribute('aria-invalid','true');
  let p=el.parentElement.querySelector(`[data-err-for="${id}"]`);
  if(!p){p=document.createElement('p');p.dataset.errFor=id;p.style.cssText='margin-top:4px;font-size:12px;font-weight:500;color:#dc2626';el.insertAdjacentElement('afterend',p)}
  p.textContent=msg;
}
function clearFieldError(id){
  const el=document.getElementById(id);
  if(!el)return;
  delete el.dataset.invalid;delete el.dataset.label;
  el.style.borderColor='';el.style.boxShadow='';el.removeAttribute('aria-invalid');
  const p=el.parentElement.querySelector(`[data-err-for="${id}"]`);
  if(p)p.remove();
}
function refreshFormSummary(){
  const box=document.getElementById('form-summary');
  if(!box)return;
  const bad=[...document.querySelectorAll('[data-invalid]')];
  if(!bad.length){box.classList.add('hidden');box.textContent='';return}
  box.classList.remove('hidden');
  box.innerHTML=`<strong>Can't save yet.</strong> Please fix: ${bad.map(b=>esc(b.dataset.label||b.id)).join(', ')}.`;
}
document.addEventListener('input',e=>{const el=e.target;if(el&&el.dataset&&el.dataset.invalid!==undefined){clearFieldError(el.id);refreshFormSummary()}});
document.addEventListener('change',e=>{const el=e.target;if(el&&el.dataset&&el.dataset.invalid!==undefined){clearFieldError(el.id);refreshFormSummary()}});
const titleCase=str=>String(str||'').replace(/(^|[\s\-'’.])(\p{L})/gu,(m,a,b)=>a+b.toUpperCase());
const isInitialOnly=str=>{const w=String(str||'').trim().split(/\s+/).filter(Boolean);return w.length>0&&w.every(x=>/^\p{L}\.?$/u.test(x))};
function capName(el,isMiddle){
  const a=el.selectionStart,b=el.selectionEnd;
  const v=titleCase(el.value);
  if(v!==el.value){el.value=v;try{el.setSelectionRange(a,b)}catch(e){}}
  if(isMiddle)el.setCustomValidity(isInitialOnly(el.value)?'Middle name must be written in full, not just an initial.':'');
}
const joinName=(last,first,middle)=>{
  last=String(last||'').trim();first=String(first||'').trim();middle=String(middle||'').trim();
  const given=[first,middle].filter(Boolean).join(' ');
  return last&&given?`${last}, ${given}`:(last||given);
};
function syncSpouse(){
  const val=id=>(document.getElementById(id)||{}).value||'';
  const wrap=document.getElementById('spouse-wrap'),label=document.getElementById('spouse-label');
  const hasSpouse=['spouse-last','spouse-first','spouse-middle'].some(k=>val(k).trim());
  if(wrap)wrap.classList.toggle('hidden',val('civil')!=='Married'&&!hasSpouse);
  if(label)label.textContent=spouseLabel(val('sex'));
}
function addChildRow(){
  const list=document.getElementById('children-list');
  if(!list)return;
  list.insertAdjacentHTML('beforeend',childRow());
  const inputs=list.querySelectorAll('.child-name');
  if(inputs.length&&typeof inputs[inputs.length-1].focus==='function')inputs[inputs.length-1].focus();
}
function readChildren(){
  return [...document.querySelectorAll('.child-row')].map(row=>{
    const age=row.querySelector('.child-age').value,uid=row.querySelector('.child-link').value;
    return {name:titleCase(row.querySelector('.child-name').value.trim()),age:age===''?'':Number(age),here:row.querySelector('.child-here').value==='No'?'No':'Yes',...(uid?{uid}:{})};
  }).filter(c=>c.name);
}
const householdBlock=r=>{
  const hh=householdOf(r);
  if(!hh.length)return '';
  return `<div class="mt-6 border-t border-slate-100 pt-5"><div class="flex items-baseline justify-between gap-2"><h3 class="text-sm font-semibold text-slate-900">Household</h3><span class="text-xs text-slate-500">${hh.length+1} members</span></div><ul class="mt-1 divide-y divide-slate-100">${hh.map(({res,rel})=>`<li class="flex items-center justify-between gap-3 py-2.5"><button type="button" onclick="openResident(${residents.indexOf(res)})" class="min-w-0 truncate text-left text-sm font-medium text-pine-700 hover:underline">${esc(res.name)}</button><span class="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">${rel}</span></li>`).join('')}</ul></div>`;
};
const spouseLabel=sex=>sex==='Female'?'Husband':sex==='Male'?'Wife':'Spouse';
function residentModal(ro,footer,cf='closeResident()'){
  const r=ro||residents[viewIndex];
  if(!r)return '';
  const kids=(Array.isArray(r.children)?r.children:[]).map(childView);
  const row=(l,val)=>`<div><dt class="text-[11px] font-medium uppercase tracking-wide text-slate-400">${l}</dt><dd class="mt-0.5 text-sm text-slate-800">${val===''||val==null?'—':esc(val)}</dd></div>`;
  const here=kids.filter(c=>c.here!=='No').length;
  const kidList=kids.length?kids.map(c=>`<li class="flex items-center justify-between gap-3 py-2.5"><div class="min-w-0"><p class="truncate text-sm font-medium text-slate-900">${esc(c.name)}</p><p class="text-xs text-slate-500">${c.age===''||c.age==null?'Age not recorded':esc(c.age)+' years old'}${c.linked?' · In system':''}</p></div><span class="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${c.here==='No'?'bg-amber-50 text-amber-700':'bg-emerald-50 text-emerald-700'}">${c.here==='No'?'Non-resident':'Resident'}</span></li>`).join(''):`<li class="py-3 text-sm text-slate-500">No children recorded.</li>`;
  return `<div class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 sm:items-center sm:p-4" onclick="if(event.target===this)${cf}" role="dialog" aria-modal="true" aria-label="Resident details">
  <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6">
    <div class="flex items-start justify-between gap-3"><div class="min-w-0"><span class="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-600">${esc(r.id||'New submission')}</span><h2 class="mt-2 text-lg font-semibold tracking-tight text-slate-900">${esc(r.name)}</h2><p class="mt-0.5 text-xs text-slate-500">${esc(r.purok||'No purok')} · Barangay Migcanaway, Tangub City</p></div><button type="button" onclick="${cf}" class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500" aria-label="Close" title="Close">${closeIcon}</button></div>
    <dl class="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">${row('Age',ageOf(r)===''?'':ageOf(r)+(ageGroup(r)?' · '+ageGroup(r):''))}${row('Sex',r.sex)}${row('Birthdate',fmtDate(r.birthday))}${row('Civil status',r.civil)}${r.civil==='Married'||spouseName(r)?row(spouseLabel(r.sex),spouseName(r)):''}${row('Work',r.job)}${scholarOf(r)?row('Scholar',scholarOf(r)):''}${row('PWD',r.pwd)}${r.pwd==='Yes'?row('Type of PWD',r.pwdType)+row('PWD ID number',r.pwdId):''}${row('Purok',r.purok)}${row('Contact',phoneFmt(r.contact))}${r.emName||r.emContact?row('Emergency contact',[r.emName,r.emRel?`(${r.emRel})`:''].filter(Boolean).join(' '))+row('Emergency number',phoneFmt(r.emContact)):''}${row('Employment',r.employment)}${row('Registered voter',r.voter)}${row('4Ps beneficiary',r.fourPs)}${[['Name extension',r.nameExt],['Place of birth',r.birthPlace],['Citizenship',r.citizenship],['Ethnicity',r.ethnicity],['Religion',r.religion],['Education',r.education],['Height',r.height?r.height+' cm':''],['Weight',r.weight?r.weight+' kg':''],['Blood type',r.bloodType],['Complexion',r.complexion],['Email',r.email],['Street / house no.',r.street],['Last year voted',r.voterYear],["Mother's maiden name",r.motherMaiden],['Family head',r.famHead],['Relationship to family head',r.famRel],['Solo parent',r.soloParent],['OFW',r.ofw],['Housing type',r.housingType],['Tenure status',r.tenure]].filter(x=>x[1]).map(([k,v])=>row(k,v)).join('')}</dl>
    ${r.remarks?`<div class="mt-4"><p class="text-[11px] font-medium uppercase tracking-wide text-slate-400">Remarks</p><p class="mt-0.5 whitespace-pre-line text-sm text-slate-700">${esc(r.remarks)}</p></div>`:''}
    <div class="mt-6 border-t border-slate-100 pt-5"><div class="flex items-baseline justify-between gap-2"><h3 class="text-sm font-semibold text-slate-900">Children</h3>${kids.length?`<span class="text-xs text-slate-500">${here} of ${kids.length} resident${kids.length>1?'s':''}</span>`:''}</div><ul class="mt-1 divide-y divide-slate-100">${kidList}</ul></div>
    ${householdBlock(r)}
    ${footer!==undefined?footer:`<div class="mt-6 flex justify-end gap-2"><button type="button" class="${btn} border border-red-200 bg-red-50 text-red-600 hover:bg-red-100" onclick="askDelete(${viewIndex})">Delete</button><button type="button" class="${btnPrimary}" onclick="editResident(${viewIndex})">Edit</button></div>`}
  </div></div>`;
}

function survey(){
  const editing=editIndex>=0;
  const r=editing?residents[editIndex]:{};
  const nm=splitName(r.name),sp=splitName(spouseName(r)),spLinked=!!byUid(r.spouseUid);
  const so=(a,selected='')=>`<select class="${field}"><option value="">Select</option>${a.map(x=>`<option ${x===selected?'selected':''}>${x}</option>`).join('')}</select>`;
  const formHtml=`<form class="overflow-hidden rounded-xl border border-slate-200 bg-white" novalidate onsubmit="event.preventDefault();saveSurvey()">
  <div class="space-y-8 p-5 sm:p-7">
    <section><div class="flex flex-wrap items-center justify-between gap-2"><div><h2 class="text-sm font-semibold text-slate-900">Personal information</h2><p class="mt-0.5 text-xs text-slate-500">Basic details for the resident record.</p></div><div class="flex items-center gap-2">${editing?`<span class="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-600">${esc(r.id||'')}</span>`:''}<button type="button" onclick="go('${isPub()?'login':'records'}')" class="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500" aria-label="${isPub()?'Close and return to the start page':'Close and return to Residents'}" title="Close">${closeIcon}</button></div></div><div class="mt-5 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
      ${[['last','Last name'],['first','First name'],['middle','Middle name']].map(([k,l])=>`<div class="sm:col-span-2"><label class="${labelCls}" for="${k}name">${l}</label><input id="${k}name" class="${field}" placeholder="${l}" value="${esc(nm[k])}" ${k!=='middle'?'required':''} oninput="capName(this,${k==='middle'});clearFormError()" autocapitalize="words"></div>`).join('')}
      <p id="form-error" class="hidden text-xs font-medium text-red-600 sm:col-span-6 sm:-mt-3" role="alert"></p>
      <div class="sm:col-span-2"><label class="${labelCls}" for="name-ext">Name extension</label>${so(nameExts,r.nameExt).replace('<select','<select id="name-ext"')}</div>
      <div class="sm:col-span-4"><label class="${labelCls}" for="birth-place">Place of birth</label><input id="birth-place" class="${field}" placeholder="City / municipality, province" value="${esc(r.birthPlace||'')}" oninput="capName(this)" autocapitalize="words" autocomplete="off"></div>
      <div class="sm:col-span-1"><label class="${labelCls}" for="age">Age</label><input id="age" type="number" min="0" max="120" class="${field}" placeholder="00" value="${esc(editing?ageOf(r):'')}" oninput="syncBirthYear()" onchange="syncBirthYear()"></div>
      <div class="sm:col-span-1"><label class="${labelCls}" for="sex">Sex</label>${so(['Male','Female'],r.sex).replace('<select','<select id="sex" required onchange="syncSpouse()"')}</div>
      <div class="sm:col-span-2"><label class="${labelCls}" for="birthday">Birthdate</label><input id="birthday" type="date" class="${field}" aria-describedby="birthday-hint" value="${esc(r.birthday||'')}" onchange="syncAge()"><p id="birthday-hint" class="mt-1 text-[11px] text-slate-400">Age updates automatically each year.</p></div>
      <div id="civil-wrap" class="sm:col-span-2 ${editing&&ageOf(r)!==''&&Number(ageOf(r))<18?'hidden':''}"><label class="${labelCls}" for="civil">Civil status</label>${so(['Single','Married','Widowed','Separated','Annulled'],r.civil||'Single').replace('<select','<select id="civil" onchange="syncSpouse()"')}</div>
      <div id="spouse-wrap" class="sm:col-span-6 ${(r.civil==='Married'||r.spouse)?'':'hidden'}"><p id="spouse-label" class="${labelCls}">${spouseLabel(r.sex)}</p><select id="spouse-link" class="${field} mb-3 ${isPub()?'hidden':''}" aria-label="Link spouse already in the system" onchange="linkSpouseSel(this)"><option value="">Not in system — type name below</option>${residentOptions(spLinked?r.spouseUid:'',r.uid||'')}</select><div class="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-3">${[['last','Last name'],['first','First name'],['middle','Middle name']].map(([k,l])=>`<input id="spouse-${k}" class="${field}" placeholder="${l}" aria-label="${spouseLabel(r.sex)} ${l.toLowerCase()}" value="${esc(sp[k])}" ${spLinked?'readonly':''} oninput="capName(this,${k==='middle'})" autocapitalize="words">`).join('')}</div></div>
      <div class="sm:col-span-2"><label class="${labelCls}" for="work-select">Work / occupation</label>${(()=>{const cur=String(r.job||'').trim();const match=jobOptions.find(j=>j.toLowerCase()===cur.toLowerCase());const sel=match||(cur?'Other':'');return `<select id="work-select" class="${field}" onchange="syncWork()"><option value="">Select</option>${jobOptions.map(j=>`<option ${j===sel?'selected':''}>${j}</option>`).join('')}<option ${sel==='Other'?'selected':''}>Other</option></select><input id="work-other" class="${field} mt-2 ${sel==='Other'?'':'hidden'}" placeholder="Type the occupation" aria-label="Other occupation" value="${esc(sel==='Other'?cur:'')}" oninput="capName(this);syncWork()" autocapitalize="words">`})()}</div>
      <div class="sm:col-span-2"><label class="${labelCls}" for="purok">Purok / address</label>${so(puroks,r.purok).replace('<select','<select id="purok"')}</div>
    </div></section>
    <section class="border-t border-slate-100 pt-8"><div class="flex flex-wrap items-center justify-between gap-2"><div><h2 class="text-sm font-semibold text-slate-900">Children</h2></div><button type="button" class="${btnGhost}" onclick="addChildRow()">Add child</button></div><div id="children-list" class="mt-5 space-y-3">${(Array.isArray(r.children)?r.children:[]).map(childRow).join('')}</div></section>
    ${extraSections(r,so,editing)}
    <section class="border-t border-slate-100 pt-8"><h2 class="text-sm font-semibold text-slate-900">Other information</h2><p class="mt-0.5 text-xs text-slate-500">Contact, employment, voter and program details, plus notes.</p><div class="mt-5 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
      <div class="sm:col-span-3"><span class="${labelCls}">PWD status</span><div class="flex gap-6 pt-2"><label class="flex cursor-pointer items-center gap-2 text-sm text-slate-600"><input type="radio" name="pwd" value="Yes" class="h-4 w-4 accent-pine-700" onchange="syncPwd()" ${r.pwd==='Yes'?'checked':''}>Yes</label><label class="flex cursor-pointer items-center gap-2 text-sm text-slate-600"><input type="radio" name="pwd" value="No" class="h-4 w-4 accent-pine-700" onchange="syncPwd()" ${r.pwd==='No'?'checked':''}>No</label></div></div>
      <div class="sm:col-span-3"><label class="${labelCls}" for="contact">Contact number</label><input id="contact" type="tel" inputmode="tel" class="${field}" placeholder="0912 345 6789" maxlength="16" oninput="fmtPhone(this,event)" title="Philippine mobile number: 09XX XXX XXXX or +63 9XX XXX XXXX" value="${esc(phoneFmt(r.contact))}"></div>
      <div id="pwd-extra" class="grid grid-cols-1 gap-x-4 gap-y-5 sm:col-span-6 sm:grid-cols-6 ${r.pwd==='Yes'?'':'hidden'}"><div class="sm:col-span-3"><label class="${labelCls}" for="pwd-type">Type of PWD</label>${so(pwdTypes,r.pwdType).replace('<select','<select id="pwd-type"'+(r.pwd==='Yes'?' required':''))}</div><div class="sm:col-span-3"><label class="${labelCls}" for="pwd-id">PWD ID number</label><input id="pwd-id" class="${field}" placeholder="e.g. 10-4208-000-0000000" autocomplete="off" value="${esc(r.pwdId||'')}"></div></div>
      <div class="sm:col-span-3"><label class="${labelCls}" for="employment">Employment status</label>${so(['Employed','Self-employed','Unemployed','Student','Retired'],r.employment).replace('<select','<select id="employment"')}</div>
      <div class="sm:col-span-3"><span class="${labelCls}">Registered voter</span>${(()=>{const ra=editing?ageOf(r):'';const minorInit=ra!==''&&Number(ra)<18;const html=yn('voter',minorInit?'No':r.voter);return (minorInit?html.replace('value="Yes"','value="Yes" disabled'):html)+`<p id="voter-hint" class="mt-1 text-[11px] text-slate-400 ${minorInit?'':'hidden'}">Under 18 cannot be a registered voter.</p>`})()}</div>
      <div id="voter-extra" class="sm:col-span-3 ${r.voter==='Yes'?'':'hidden'}"><label class="${labelCls}" for="voter-year">Last year voted</label><input id="voter-year" type="number" min="1987" max="${nowYear}" class="${field}" placeholder="e.g. ${nowYear-1}" value="${esc(r.voterYear||'')}"></div>
      <div class="sm:col-span-3"><span class="${labelCls}">4Ps beneficiary</span>${yn('fourps',r.fourPs)}</div>
      <div class="sm:col-span-3"><span class="${labelCls}">Scholar</span>${yn('scholar',scholarOf(r))}</div>
      <div class="sm:col-span-3"><span class="${labelCls}">Solo parent</span>${yn('solo',r.soloParent)}</div>
      <div class="sm:col-span-3"><span class="${labelCls}">Overseas Filipino worker (OFW)</span>${yn('ofw',r.ofw)}</div>
      <div class="sm:col-span-3"><label class="${labelCls}" for="email">Email address</label><input id="email" type="email" inputmode="email" class="${field}" placeholder="name@example.com" value="${esc(r.email||'')}" autocomplete="off"></div>
      <div class="sm:col-span-3"><label class="${labelCls}" for="street">Street / house no.</label><input id="street" class="${field}" placeholder="Street, house number" value="${esc(r.street||'')}" oninput="capName(this)" autocapitalize="words" autocomplete="off"></div>
      <div class="sm:col-span-6 border-t border-slate-100 pt-5"><h3 class="text-sm font-semibold text-slate-900">Person to contact in case of emergency</h3><p class="mt-0.5 text-xs text-slate-500">Name and contact number are required.</p></div>
      <div class="sm:col-span-2"><label class="${labelCls}" for="em-name">Contact person</label><input id="em-name" class="${field}" placeholder="Full name" value="${esc(r.emName||'')}" oninput="capName(this)" autocapitalize="words" autocomplete="off"></div>
      <div class="sm:col-span-2"><label class="${labelCls}" for="em-rel">Relationship</label>${so(['Spouse','Parent','Child','Sibling','Relative','Neighbor','Friend','Other'],r.emRel).replace('<select','<select id="em-rel"')}</div>
      <div class="sm:col-span-2"><label class="${labelCls}" for="em-contact">Contact number</label><input id="em-contact" type="tel" inputmode="tel" class="${field}" placeholder="0912 345 6789" maxlength="16" oninput="fmtPhone(this,event)" value="${esc(phoneFmt(r.emContact))}" autocomplete="off"></div>
      <div class="sm:col-span-6"><label class="${labelCls}" for="remarks">Remarks</label><textarea id="remarks" class="${field} min-h-[6rem] resize-y" placeholder="Type notes here...">${esc(r.remarks||'')}</textarea></div>
    </div></section>
  </div>
  <div id="form-summary" class="hidden border-t border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700 sm:px-7" role="alert"></div>
  <div class="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:px-7"><button type="reset" class="${btnGhost}" onclick="document.getElementById('children-list').innerHTML='';setTimeout(()=>{syncPwd();syncCivil();syncWorkVisibility()},0)">Clear</button><button type="submit" class="${btnPrimary}">${editing?'Save changes':isPub()?'Submit survey':'Save resident'}</button></div>
</form>`;
  return isPub()?publicShell(formHtml):shell(editing?'Edit Resident':'Resident Survey Form',editing?'Update the resident profile.':'Add a resident to the survey record.',formHtml);
}

function saveSurvey(){
  const val=id=>(document.getElementById(id)||{}).value||'';
  ['lastname','firstname','middlename','sex','pwd-type','contact','work-other','em-name','em-contact','height','weight','email','voter-year'].forEach(clearFieldError);
  const errBox=document.getElementById('form-error');
  if(errBox){errBox.textContent='';errBox.classList.add('hidden')}
  const name=joinName(titleCase(val('lastname')),titleCase(val('firstname')),titleCase(val('middlename')));
  const problems=[];
  if(!val('lastname').trim())problems.push(['lastname','Last name is required.','Last name']);
  if(!val('firstname').trim())problems.push(['firstname','First name is required.','First name']);
  if(isInitialOnly(val('middlename')))problems.push(['middlename','Write the middle name in full, not just an initial.','Middle name']);
  if(!val('sex'))problems.push(['sex','Select the sex.','Sex']);
  const pwdSel=document.querySelector('input[name="pwd"]:checked');
  if(pwdSel&&pwdSel.value==='Yes'&&!val('pwd-type'))problems.push(['pwd-type','Select the type of PWD.','Type of PWD']);
  if((document.getElementById('work-select')||{}).value==='Other'&&!val('work-other').trim())problems.push(['work-other','Type the occupation.','Work / occupation']);
  if(!val('em-name').trim())problems.push(['em-name','Enter the person to contact in case of emergency.','Emergency contact person']);
  const emNum=val('em-contact').trim();
  if(!emNum)problems.push(['em-contact','Enter the emergency contact number.','Emergency contact number']);
  else if(!phoneOk(emNum))problems.push(['em-contact','Use a Philippine mobile number, e.g. 0912 345 6789 or +63 912 345 6789.','Emergency contact number']);
  const hv=val('height').trim(),wv=val('weight').trim(),ev=val('email').trim(),vyv=val('voter-year').trim();
  if(hv&&(isNaN(Number(hv))||Number(hv)<30||Number(hv)>250))problems.push(['height','Height must be between 30 and 250 cm.','Height']);
  if(wv&&(isNaN(Number(wv))||Number(wv)<1||Number(wv)>400))problems.push(['weight','Weight must be between 1 and 400 kg.','Weight']);
  if(ev&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ev))problems.push(['email','Enter a valid email address.','Email address']);
  if(vyv&&(!/^\d{4}$/.test(vyv)||Number(vyv)<1987||Number(vyv)>nowYear))problems.push(['voter-year',`Enter a year from 1987 to ${nowYear}.`,'Last year voted']);
  const contactVal=val('contact').trim();
  if(contactVal&&!phoneOk(contactVal))problems.push(['contact','Use a Philippine mobile number, e.g. 0912 345 6789 or +63 912 345 6789.','Contact number']);
  if(problems.length){
    problems.forEach(([id,msg,label])=>setFieldError(id,msg,label));
    refreshFormSummary();
    const first=document.getElementById(problems[0][0]);
    if(first){first.scrollIntoView({behavior:'smooth',block:'center'});if(typeof first.focus==='function')first.focus({preventScroll:true})}
    return;
  }
  const birthday=val('birthday');
  const computedAge=ageFromBirthday(birthday);
  const pwd=document.querySelector('input[name="pwd"]:checked');
  const id=editIndex>=0?residents[editIndex].id:makeId();
  const finalAge=computedAge===''?Number(val('age'))||'':computedAge;
  const isMinor=finalAge!==''&&Number(finalAge)<18;
  const rec={id,name,age:computedAge===''?Number(val('age'))||'':computedAge,ageYear:nowYear,birthday,sex:val('sex'),civil:isMinor?'':(val('civil')||'Single'),spouse:isMinor?'':joinName(titleCase(val('spouse-last')),titleCase(val('spouse-first')),titleCase(val('spouse-middle'))),job:workValue(),emName:titleCase(val('em-name').trim()),emRel:val('em-rel'),emContact:phoneRaw(val('em-contact')),nameExt:val('name-ext'),birthPlace:titleCase(val('birth-place').trim()),citizenship:titleCase(val('citizenship').trim()),ethnicity:titleCase(val('ethnicity').trim()),religion:titleCase(val('religion').trim()),education:val('education'),height:val('height').trim(),weight:val('weight').trim(),bloodType:val('blood-type'),complexion:val('complexion'),email:val('email').trim(),street:titleCase(val('street').trim()),voterYear:((isMinor?'No':((document.querySelector('input[name="voter"]:checked')||{}).value||''))==='Yes')?val('voter-year').trim():'',motherMaiden:titleCase(val('mother-maiden').trim()),famHead:titleCase(val('fam-head').trim()),famRel:val('fam-rel'),soloParent:(document.querySelector('input[name="solo"]:checked')||{}).value||'',ofw:(document.querySelector('input[name="ofw"]:checked')||{}).value||'',housingType:val('housing-type'),tenure:val('tenure'),scholar:(document.querySelector('input[name="scholar"]:checked')||{}).value||'',purok:val('purok'),pwd:pwd?pwd.value:'No',pwdType:(pwd&&pwd.value==='Yes')?val('pwd-type'):'',pwdId:(pwd&&pwd.value==='Yes')?val('pwd-id').trim():'',remarks:val('remarks').trim(),children:readChildren(),uid:editIndex>=0?residents[editIndex].uid:newUid(),spouseUid:editIndex>=0?(residents[editIndex].spouseUid||''):'',contact:phoneRaw(val('contact')),employment:val('employment')||(workValue()?(/student/i.test(workValue())?'Student':'Employed'):''),voter:isMinor?'No':((document.querySelector('input[name="voter"]:checked')||{}).value||''),fourPs:(document.querySelector('input[name="fourps"]:checked')||{}).value||''};
  if(isPub()){submitPublic(rec);return}
  if(residents.some((r,i)=>i!==editIndex&&sameInfo(r,rec))){
    setFieldError('lastname','This resident is already recorded with exactly the same information. Change at least one detail to save.','Resident already exists (all information is the same)');
    refreshFormSummary();
    const f=document.getElementById('lastname');
    if(f){f.scrollIntoView({behavior:'smooth',block:'center'});f.focus({preventScroll:true})}
    return;
  }
  if(editIndex>=0){
    residents[editIndex]=rec;
    linkSpouse(rec.uid,isMinor?'':val('spouse-link'));
    persist();
    editIndex=-1;
    go('records');
    flash('Resident updated');
  } else {
    saveResident(rec);
    linkSpouse(rec.uid,isMinor?'':val('spouse-link'));
    persist();
    draw();
    flash('Resident saved');
  }
}
function clearFormError(){
  const error=document.getElementById('form-error');
  if(error){error.textContent='';error.classList.add('hidden')}
}
function syncAge(){
  const b=(document.getElementById('birthday')||{}).value||'';
  const a=ageFromBirthday(b);
  if(a==='')return;
  const input=document.getElementById('age');
  if(input)input.value=a;
  syncCivil();
}
function workValue(){
  const sel=(document.getElementById('work-select')||{}).value||'';
  if(sel==='Other')return titleCase(((document.getElementById('work-other')||{}).value||'').trim());
  return sel;
}
function syncWorkVisibility(){
  const sel=document.getElementById('work-select'),other=document.getElementById('work-other');
  const isOther=!!sel&&sel.value==='Other';
  if(other){other.classList.toggle('hidden',!isOther);if(!isOther){other.value='';clearFieldError('work-other')}}
}
function syncWork(){
  syncWorkVisibility();
  const w=workValue();
  const emp=document.getElementById('employment');
  if(emp&&w)emp.value=/student/i.test(w)?'Student':'Employed';
}
function syncBirthYear(){
  const ageEl=document.getElementById('age'),bEl=document.getElementById('birthday');
  if(!ageEl||!bEl)return;
  const v=ageEl.value.trim();
  if(v===''||isNaN(Number(v))||Number(v)<0||Number(v)>120){syncCivil();return}
  const age=Math.floor(Number(v));
  const t=new Date();
  const cur=bEl.value?new Date(`${bEl.value}T00:00:00`):null;
  const month=cur&&!isNaN(cur)?cur.getMonth():t.getMonth();
  const day=cur&&!isNaN(cur)?cur.getDate():t.getDate();
  const pad=n=>String(n).padStart(2,'0');
  for(const y of [t.getFullYear()-age,t.getFullYear()-age-1]){
    const last=new Date(y,month+1,0).getDate();
    const iso=`${y}-${pad(month+1)}-${pad(Math.min(day,last))}`;
    if(ageFromBirthday(iso)===age){bEl.value=iso;break}
  }
  syncCivil();
}
function syncVoter(){
  const v=((document.getElementById('age')||{}).value||'').trim();
  const minor=v!==''&&Number(v)<18;
  const yes=document.querySelector('input[name="voter"][value="Yes"]');
  const no=document.querySelector('input[name="voter"][value="No"]');
  const hint=document.getElementById('voter-hint');
  if(yes)yes.disabled=minor;
  if(minor&&no)no.checked=true;
  if(hint)hint.classList.toggle('hidden',!minor);
  const vx=document.getElementById('voter-extra');
  const votes=(document.querySelector('input[name="voter"]:checked')||{}).value==='Yes';
  if(vx){vx.classList.toggle('hidden',!votes);if(!votes){const vy=document.getElementById('voter-year');if(vy)vy.value=''}}
}
document.addEventListener('change',e=>{if(e.target&&e.target.name==='voter')syncVoter()});
function syncPwd(){
  const yes=(document.querySelector('input[name="pwd"]:checked')||{}).value==='Yes';
  const box=document.getElementById('pwd-extra');
  if(box)box.classList.toggle('hidden',!yes);
  const t=document.getElementById('pwd-type'),i=document.getElementById('pwd-id');
  if(t)t.required=yes;
  if(!yes){if(t)t.value='';if(i)i.value=''}
}
function syncCivil(){
  syncVoter();
  const v=((document.getElementById('age')||{}).value||'').trim();
  const minor=v!==''&&Number(v)<18;
  const wrap=document.getElementById('civil-wrap'),civil=document.getElementById('civil');
  if(wrap)wrap.classList.toggle('hidden',minor);
  if(minor){
    if(civil)civil.value='Single';
    const sp=document.getElementById('spouse-wrap');
    if(sp)sp.classList.add('hidden');
  } else syncSpouse();
}

function printResidents(){
  const list=filteredResidents().map(({r})=>r);
  const scope=[purokBy==='all'?'':purokBy,filterBy==='all'?'':filterBy==='pwd'?'PWD residents':filterBy.startsWith('age:')?filterBy.slice(4):filterBy,q.trim()?`“${q.trim()}”`:''].filter(Boolean).join(' · ');
  const date=new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  const th=h=>`<th class="border border-slate-400 bg-slate-100 px-2 py-1.5 text-left font-semibold">${h}</th>`;
  const td=(c,cls='')=>`<td class="border border-slate-300 px-2 py-1.5 ${cls}">${esc(c)}</td>`;
  const rows=list.map((r,i)=>`<tr>${td(i+1,'text-center')}${td(r.id||'')}${td(r.name)}${td(r.purok||'')}${td(ageOf(r),'text-center')}${td(r.sex||'')}${td(r.civil||'')}${td(r.job||'')}${td(r.pwd||'','text-center')}</tr>`).join('');
  let root=document.getElementById('print-root');
  if(!root){root=document.createElement('div');root.id='print-root';document.body.appendChild(root)}
  root.innerHTML=`<div class="p-2 text-slate-900">
    <div class="flex items-center justify-center gap-4"><img src="assets/barangay-logo.jpg" alt="" class="h-16 w-16 rounded-full object-cover"><div class="text-center"><p class="text-xs uppercase tracking-widest">Republic of the Philippines · City of Tangub</p><h1 class="text-xl font-bold tracking-wide">BARANGAY MIGCANAWAY</h1><p class="text-sm font-semibold">Resident Survey — List of Residents${scope?' · '+esc(scope):''}</p></div><img src="assets/tangub-logo.jpg" alt="" class="h-16 w-16 object-contain"></div>
    <p class="mt-4 flex justify-between text-xs"><span>Total residents: <strong>${list.length}</strong> · PWD: <strong>${list.filter(r=>r.pwd==='Yes').length}</strong>${['Under 18','Adult','Senior Citizen'].map(g=>` · ${g}: <strong>${list.filter(r=>ageGroup(r)===g).length}</strong>`).join('')}</span><span>Printed on ${date}</span></p>
    <table class="mt-2 w-full border-collapse text-xs"><thead>${['No.','ID','Name','Purok','Age','Sex','Civil status','Work','PWD'].map(th).join('')}</thead><tbody>${rows||'<tr><td colspan="9" class="border border-slate-300 px-2 py-4 text-center text-slate-500">No residents found.</td></tr>'}</tbody></table>
  </div>`;
  document.body.classList.add('print-residents');
  const done=()=>{document.body.classList.remove('print-residents');root.innerHTML='';window.removeEventListener('afterprint',done)};
  window.addEventListener('afterprint',done);
  setTimeout(()=>window.print(),50);
}
function filteredResidents(){
  const needle=q.trim().toLowerCase();
  return residents.map((r,i)=>({r,i})).filter(({r})=>
    (!needle||r.name.toLowerCase().includes(needle)||String(r.id||'').toLowerCase().includes(needle)) &&
    (filterBy==='all'||(filterBy==='pwd'?r.pwd==='Yes':filterBy.startsWith('age:')?ageGroup(r)===filterBy.slice(4):r.civil===filterBy)) &&
    (purokBy==='all'||r.purok===purokBy)
  ).sort((a,b)=>a.r.name.localeCompare(b.r.name,undefined,{sensitivity:'base'}));
}
function recordsCard(){
  const filtered=filteredResidents();
  const perPage=10;
  const pages=Math.max(1,Math.ceil(filtered.length/perPage));
  if(page>pages)page=pages;
  const rows=filtered.slice((page-1)*perPage,page*perPage);
  const pg=n=>`<button type="button" onclick="setPage(${n})" ${page===n?'aria-current="page"':''} class="grid h-8 min-w-[2rem] place-items-center rounded-md border px-2 text-xs font-medium transition ${page===n?'border-pine-700 bg-pine-700 text-white':'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}">${n}</button>`;
  const arrow=(target,disabled,symbol,label)=>`<button type="button" ${disabled?'disabled':''} onclick="setPage(${target})" aria-label="${label}" title="${label}" class="grid h-8 w-8 place-items-center rounded-md border border-slate-300 bg-white text-slate-500 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40">${symbol}</button>`;
  const pager=Array.from({length:pages},(_,i)=>pg(i+1)).join('');
  const rowMarkup=rows.length?rows.map(({r,i})=>{
    return `<tr onclick="openResident(${i})" class="cursor-pointer transition-colors hover:bg-slate-50/70"><td class="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-slate-500">${esc(r.id||'')}</td><td class="whitespace-nowrap px-3 py-3.5 font-medium text-slate-900">${esc(r.name)}</td><td class="whitespace-nowrap px-3 py-3.5 text-slate-600">${esc(r.purok||'')}</td><td class="px-3 py-3.5 text-slate-500">${esc(ageOf(r))}</td><td class="px-3 py-3.5 text-slate-600">${esc(r.civil||'')}</td><td class="px-3 py-3.5 text-slate-500">${esc(r.job)}</td><td class="px-3 py-3.5 text-slate-600">${esc(r.pwd)}</td><td class="px-5 py-3.5 text-right"><div class="flex justify-end gap-2"><button type="button" onclick="event.stopPropagation();openResident(${i})" class="whitespace-nowrap rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50">View</button><button type="button" onclick="event.stopPropagation();editResident(${i})" class="whitespace-nowrap rounded-md border border-pine-200 bg-pine-50 px-2.5 py-1 text-xs font-medium text-pine-700 transition hover:bg-pine-100">Edit</button><button type="button" onclick="event.stopPropagation();askDelete(${i})" class="whitespace-nowrap rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100">Delete</button></div></td></tr>`;
  }).join(''):`<tr><td colspan="8" class="px-5 py-10 text-center text-sm text-slate-500">No residents found.</td></tr>`;
  const footer=filtered.length?`Showing <span class="font-medium text-slate-700">${(page-1)*perPage+1}–${Math.min(page*perPage,filtered.length)}</span> of ${filtered.length} residents`:'No residents found';
  return `<div class="overflow-hidden rounded-xl border border-slate-200 bg-white"><div class="overflow-x-auto"><table class="w-full min-w-[940px] text-left text-sm"><thead class="bg-slate-50 text-xs font-medium text-slate-500"><tr><th class="px-5 py-3 font-medium">ID</th><th class="px-3 py-3 font-medium">Name</th><th class="px-3 py-3 font-medium">Purok</th><th class="px-3 py-3 font-medium">Age</th><th class="px-3 py-3 font-medium">Civil status</th><th class="px-3 py-3 font-medium">Work</th><th class="px-3 py-3 font-medium">PWD</th><th class="px-5 py-3 text-right font-medium">Action</th></tr></thead><tbody class="divide-y divide-slate-100">${rowMarkup}</tbody></table></div>
  <div class="flex flex-col gap-3 border-t border-slate-200 p-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>${footer}</span><div class="flex items-center gap-1.5">${pages>1?`${arrow(page-1,page===1,'‹','Previous page')}${pager}${arrow(page+1,page===pages,'›','Next page')}`:''}</div></div></div>`;
}
function recs(){
  const actions=`<button type="button" class="${btnGhost}" onclick="printResidents()">${printIcon}Print</button><button type="button" class="${btnGhost}" onclick="exportCsv()">Export</button><button type="button" class="${btnPrimary}" onclick="go('survey')">Add resident</button>`;
  return shell('Resident Records','Search, review, and update resident profiles.',`<div class="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <form class="flex gap-2 sm:max-w-md" onsubmit="event.preventDefault();setSearch(document.getElementById('search').value)">
      <input id="search" type="search" class="${field}" placeholder="Search name or ID..." aria-label="Search residents by name or ID" value="${esc(q)}" enterkeyhint="search" oninput="setSearch(this.value)"><button type="submit" class="${btnGhost} shrink-0">Search</button>
    </form>
    <div class="flex gap-2">
    <select id="purok-filter" class="${field} min-w-0 flex-1 sm:w-40 sm:flex-none" aria-label="Filter residents by purok" onchange="setPurok(this.value)">
      <option value="all" ${purokBy==='all'?'selected':''}>All puroks</option>
      ${puroks.map(x=>`<option value="${x}" ${purokBy===x?'selected':''}>${x}</option>`).join('')}
    </select>
    <select id="filter" class="${field} min-w-0 flex-1 sm:w-48 sm:flex-none" aria-label="Filter residents" onchange="setFilter(this.value)">
      <option value="all" ${filterBy==='all'?'selected':''}>All residents</option>
      <optgroup label="Civil status">${['Single','Married','Widowed','Separated','Annulled'].map(x=>`<option value="${x}" ${filterBy===x?'selected':''}>${x}</option>`).join('')}</optgroup>
      <optgroup label="Age group">${[['Under 18','Under 18 (0–17)'],['Adult','Adult (18–59)'],['Senior Citizen','Senior Citizen (60+)']].map(([k,l])=>`<option value="age:${k}" ${filterBy==='age:'+k?'selected':''}>${l}</option>`).join('')}</optgroup>
      <option value="pwd" ${filterBy==='pwd'?'selected':''}>PWD residents</option>
    </select>
    </div>
  </div>
  <div id="records-results">${recordsCard()}</div>`,actions);
}


function publicShell(body,title='Resident Survey Form',subtitle='Fill out your details below. The barangay admin will review your response.'){
  return `<div class="relative min-h-screen bg-cream text-slate-900">
  <header class="border-b border-slate-200 bg-white"><div class="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
    <button type="button" onclick="go('home')" aria-label="Go to home" class="flex min-w-0 items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-700"><span class="flex shrink-0 items-center gap-1.5"><img src="assets/barangay-logo.jpg" alt="" class="h-9 w-9 rounded-full object-cover"><img src="assets/tangub-logo.jpg" alt="" class="h-9 w-9 object-contain"></span><span class="min-w-0"><span class="block text-[9px] font-semibold uppercase tracking-[0.24em] text-pine-600">Barangay</span><span class="block text-sm font-semibold tracking-[0.1em] text-slate-900">MIGCANAWAY</span></span></button>
    <div class="flex items-center gap-2"><button type="button" onclick="go('status')" class="${btnGhost}">Check status</button></div>
  </div></header>
  <main class="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:py-10"><div class="${animateNext?'animate-fade-up':''}">
    <div class="mb-6"><h1 class="text-2xl font-semibold tracking-tight text-slate-900">${title}</h1><p class="mt-1 text-sm text-slate-500">${subtitle}</p></div>
    ${body}
  </div></main>
</div>`;
}
function submitPublic(rec){
  delete rec.id;
  reloadSubs();
  lastRef=uniqueRef();
  submissions.unshift({sid:newUid(),ref:lastRef,submittedAt:new Date().toISOString(),status:'pending',data:rec});
  persistSubs();
  rememberRef(lastRef);
  go('thanks');
}
function thanks(){
  return publicShell(`<div class="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center sm:p-9"><div class="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600">${checkIcon}</div><h2 class="mt-4 text-lg font-semibold text-slate-900">Thank you! Your survey was submitted.</h2><p class="mt-2 text-sm leading-6 text-slate-500">The barangay admin will review your response. Once accepted, you will be added to the resident records.</p><div class="mt-5 rounded-xl bg-pine-50 px-4 py-3"><p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-pine-600">Your reference code</p><p class="mt-1 font-mono text-xl font-semibold tracking-wider text-pine-800">${esc(lastRef)}</p><p class="mt-1 text-xs text-slate-500">Save this code. Use it to check if your request was accepted or declined.</p></div><div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center"><button type="button" class="${btnPrimary}" onclick="viewRef(lastRef)">Check status</button><button type="button" class="${btnGhost}" onclick="go('public')">Submit another response</button><button type="button" class="${btnGhost}" onclick="go('home')">Back to start</button></div></div>`,'Submitted','Your response has been sent to the barangay admin.');
}

function setSubTab(t){subTab=t;draw()}
function openSub(i){subIndex=i;renderModal()}
function closeSub(){animClose(()=>{subIndex=-1;renderModal()})}
function subs(){
  const tabs=[['pending','Pending'],['accepted','Accepted'],['declined','Declined']];
  const count=t=>submissions.filter(x=>x.status===t).length;
  const list=submissions.map((x,i)=>({x,i})).filter(({x})=>x.status===subTab);
  const tabBtns=tabs.map(([k,l])=>`<button type="button" onclick="setSubTab('${k}')" ${subTab===k?'aria-current="page"':''} class="${btn} ${subTab===k?'bg-pine-700 text-white hover:bg-pine-800':'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}">${l}<span class="rounded-full px-1.5 text-[11px] ${subTab===k?'bg-white/20':'bg-slate-100'}">${count(k)}</span></button>`).join('');
  const dateHead=subTab==='pending'?'Submitted':subTab==='accepted'?'Accepted on':'Declined on';
  const empty={pending:'No pending submissions.',accepted:'No accepted submissions yet.',declined:'No declined submissions.'}[subTab];
  const rows=list.length?list.map(({x,i})=>{const d=x.data;return `<tr onclick="openSub(${i})" class="cursor-pointer transition-colors hover:bg-slate-50/70"><td class="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-slate-500">${esc(x.ref||'')}</td><td class="whitespace-nowrap px-3 py-3.5 font-medium text-slate-900">${esc(d.name)}</td><td class="px-3 py-3.5 text-slate-600">${esc(ageOf(d))}</td><td class="whitespace-nowrap px-3 py-3.5 text-slate-600">${esc(d.purok||'')}</td><td class="px-3 py-3.5 text-slate-600">${esc(d.job||'')}</td><td class="whitespace-nowrap px-3 py-3.5 text-slate-500">${fmtDT(subTab==='pending'?x.submittedAt:x.reviewedAt)}</td><td class="px-5 py-3.5 text-right"><button type="button" class="${btnGhost} px-3 py-1.5" onclick="event.stopPropagation();openSub(${i})">${subTab==='pending'?'Review':'View'}</button></td></tr>`}).join(''):`<tr><td colspan="7" class="px-5 py-10 text-center text-sm text-slate-500">${empty}</td></tr>`;
  return shell('Submissions','Survey responses sent by residents. Accept to add them to the records, or decline.',`<div class="mb-3 flex flex-wrap gap-2">${tabBtns}</div><div class="overflow-hidden rounded-xl border border-slate-200 bg-white"><div class="overflow-x-auto"><table class="w-full min-w-[820px] text-left text-sm"><thead class="bg-slate-50 text-xs font-medium text-slate-500"><tr><th class="px-5 py-3 font-medium">Ref</th><th class="px-3 py-3 font-medium">Name</th><th class="px-3 py-3 font-medium">Age</th><th class="px-3 py-3 font-medium">Purok</th><th class="px-3 py-3 font-medium">Work</th><th class="px-3 py-3 font-medium">${dateHead}</th><th class="px-5 py-3"></th></tr></thead><tbody class="divide-y divide-slate-100">${rows}</tbody></table></div></div>`);
}
function subModal(){
  const x=submissions[subIndex];
  if(!x)return '';
  const footer=x.status==='pending'
    ?`<div class="mt-6 flex justify-end gap-2"><button type="button" class="${btn} border border-red-200 bg-red-50 text-red-600 hover:bg-red-100" onclick="askDecline(${subIndex})">Decline</button><button type="button" class="${btnPrimary}" onclick="acceptSub(${subIndex})">Accept</button></div>`
    :`<div class="mt-6 rounded-lg px-3 py-2.5 text-xs ${x.status==='accepted'?'bg-emerald-50 text-emerald-700':'bg-red-50 text-red-700'}">${x.status==='accepted'?'Accepted':'Declined'} on ${fmtDT(x.reviewedAt)}${x.reason?` · Reason: ${esc(x.reason)}`:''}</div>`;
  return residentModal(x.data,footer,'closeSub()');
}
function acceptSub(i){
  const x=submissions[i];
  if(!x||x.status!=='pending')return;
  const rec={...x.data,id:makeId(),uid:x.data.uid||newUid()};
  if(residents.some(r=>sameInfo(r,rec))){flash('Already in the records. Decline it instead.');return}
  saveResident(rec);
  x.status='accepted';x.reviewedAt=new Date().toISOString();persistSubs();
  subIndex=-1;declineIndex=-1;draw();flash('Accepted and added to Residents');
}
function askDecline(i){declineIndex=i;renderModal();setTimeout(()=>{const t=document.getElementById('decline-reason');if(t)t.focus()},0)}
function closeDecline(){animClose(()=>{declineIndex=-1;renderModal()})}
function declineModal(){
  const x=submissions[declineIndex];
  if(!x)return '';
  return `<div class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4" onclick="if(event.target===this)closeDecline()" role="alertdialog" aria-modal="true" aria-label="Decline submission">
  <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
    <div class="grid h-11 w-11 place-items-center rounded-full bg-red-50 text-red-600">${closeIcon}</div>
    <h2 class="mt-4 text-base font-semibold text-slate-900">Decline this submission?</h2>
    <p class="mt-1 text-sm text-slate-600"><span class="font-medium text-slate-900">${esc(x.data.name)}</span> will not be added to the records.</p>
    <label class="${labelCls} mt-4" for="decline-reason">Reason (optional)</label><textarea id="decline-reason" class="${field} min-h-[4.5rem] resize-y" placeholder="e.g. Incomplete or incorrect information"></textarea>
    <div class="mt-6 flex justify-end gap-2"><button type="button" class="${btnGhost}" onclick="closeDecline()">Cancel</button><button type="button" class="${btn} bg-red-600 text-white hover:bg-red-700" onclick="confirmDecline()">Decline</button></div>
  </div></div>`;
}
function confirmDecline(){
  const x=submissions[declineIndex];
  if(!x||x.status!=='pending')return;
  x.status='declined';x.reviewedAt=new Date().toISOString();
  x.reason=((document.getElementById('decline-reason')||{}).value||'').trim();
  persistSubs();
  subIndex=-1;declineIndex=-1;draw();flash('Submission declined');
}
window.addEventListener('storage',e=>{
  if(e.key===SUBS_KEY){reloadSubs();if(v==='submissions'&&subIndex<0&&declineIndex<0||v==='dashboard')draw()}
});

let lastRef='',statusRef='',statusErr='';
const REF_CHARS='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const MYREFS_KEY='barangay-my-refs-v1';
function uniqueRef(){
  let r;
  do{r='SUB-'+Array.from({length:6},()=>REF_CHARS[Math.floor(Math.random()*REF_CHARS.length)]).join('')}while(submissions.some(x=>x.ref===r));
  return r;
}
function ensureRefs(){
  let ch=false;
  submissions.forEach(x=>{if(!x.ref){x.ref=uniqueRef();ch=true}});
  if(ch)persistSubs();
}
const myRefs=()=>{try{const a=JSON.parse(localStorage.getItem(MYREFS_KEY));return Array.isArray(a)?a:[]}catch{return []}};
function rememberRef(ref){try{localStorage.setItem(MYREFS_KEY,JSON.stringify([ref,...myRefs().filter(x=>x!==ref)].slice(0,10)))}catch{}}
const normRef=str=>{let c=String(str||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(c.startsWith('SUB'))c=c.slice(3);return c?'SUB-'+c:''};
function viewRef(ref){statusRef=ref;statusErr='';go('status')}
function checkStatus(){
  const el=document.getElementById('ref');
  statusRef=normRef(el?el.value:'');
  statusErr=statusRef?'':'Enter your reference code.';
  draw();
}
function statusCard(x){
  const t={
    pending:['bg-amber-50 text-amber-800','border-amber-200','Under review','The barangay admin has not reviewed your survey yet. Please check again later.'],
    accepted:['bg-emerald-50 text-emerald-800','border-emerald-200','Accepted','Your information has been added to the barangay resident records.'],
    declined:['bg-red-50 text-red-800','border-red-200','Declined','Your survey was not accepted.']
  }[x.status]||['bg-slate-50 text-slate-700','border-slate-200',x.status,''];
  const when=x.status==='pending'?`Submitted ${fmtDT(x.submittedAt)}`:`${x.status==='accepted'?'Accepted':'Declined'} on ${fmtDT(x.reviewedAt)}`;
  return `<div class="rounded-2xl border ${t[1]} bg-white p-5"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><p class="truncate text-sm font-semibold text-slate-900">${esc(x.data.name)}</p><p class="mt-0.5 font-mono text-xs text-slate-500">${esc(x.ref)}</p></div><span class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${t[0]}">${t[2]}</span></div><p class="mt-3 text-sm text-slate-600">${t[3]}</p>${x.status==='declined'?`<p class="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"><span class="font-medium">Reason:</span> ${x.reason?esc(x.reason):'No reason was given.'}</p><button type="button" class="${btnPrimary} mt-4" onclick="go('public')">Submit a new survey</button>`:''}<p class="mt-3 text-xs text-slate-400">${when}</p></div>`;
}
function statusView(){
  reloadSubs();
  const found=statusRef?submissions.find(x=>x.ref===statusRef):null;
  const mine=myRefs().map(r=>submissions.find(x=>x.ref===r)).filter(Boolean);
  const result=statusRef&&!statusErr?(found?statusCard(found):`<p role="alert" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">No request found for <span class="font-mono">${esc(statusRef)}</span>. Check the code and try again.</p>`):'';
  const list=mine.length?`<div class="rounded-2xl border border-slate-200 bg-white p-5"><h2 class="text-sm font-semibold text-slate-900">Your requests on this device</h2><ul class="mt-2 divide-y divide-slate-100">${mine.map(x=>`<li><button type="button" onclick="viewRef('${esc(x.ref)}')" class="flex w-full items-center justify-between gap-3 py-2.5 text-left"><span class="min-w-0"><span class="block truncate text-sm font-medium text-slate-900">${esc(x.data.name)}</span><span class="block font-mono text-xs text-slate-500">${esc(x.ref)}</span></span><span class="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${x.status==='accepted'?'bg-emerald-50 text-emerald-700':x.status==='declined'?'bg-red-50 text-red-700':'bg-amber-50 text-amber-700'}">${x.status==='accepted'?'Accepted':x.status==='declined'?'Declined':'Under review'}</span></button></li>`).join('')}</ul></div>`:'';
  return publicShell(`<div class="mx-auto max-w-md space-y-4"><form class="rounded-2xl border border-slate-200 bg-white p-5" onsubmit="event.preventDefault();checkStatus()"><label class="${labelCls}" for="ref">Reference code</label><input id="ref" class="${field} font-mono uppercase" placeholder="SUB-XXXXXX" value="${esc(statusRef)}" autocapitalize="characters" autocomplete="off">${statusErr?`<p role="alert" class="mt-2 text-xs font-medium text-red-600">${statusErr}</p>`:''}<button type="submit" class="${btnPrimary} mt-4 w-full">Check status</button></form>${result}${list}</div>`,'Check Request Status','Enter the reference code you received after submitting your survey.');
}
ensureRefs();

draw();
