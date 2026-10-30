const puroks=['Purok 1','Purok 2','Purok 3','Purok 4','Purok 5'];
const pat=[['Yes','Given'],['No','Pending'],['Yes','Pending'],['No','Given'],['No','Pending']];
let v='login',page=1,toast='',q='',filterBy='all',editIndex=-1;

const names=['Santos, Maria Cruz','Reyes, Juan Dela Pena','Garcia, Ana Lopez','Bautista, Pedro Ramos','Mendoza, Rosa Flores','Villanueva, Jose Aquino','Castillo, Liza Navarro','Torres, Miguel Santiago','Dizon, Carmen Pascual','Ramos, Antonio Cruz','Fernandez, Grace Morales','Lopez, Ricardo Tan','Aquino, Nena Gutierrez','Domingo, Roberto Salazar','Perez, Joy Valdez'];
const ages=[34,51,29,63,45,38,57,42,60,26,49,36,58,31,47];
const jobs=['Farmer','Fisherman','Public school teacher','Sari-sari store owner','Tricycle driver','Carpenter','Nurse','Tailor','Electrician','Senior high student','Baker','Auto mechanic','Barangay health worker','Security guard','Cook'];

const STORE='barangay-residents-v1';
const seedNeeds={'Reyes, Juan Dela Pena':'Medical','Garcia, Ana Lopez':'Food Pack','Mendoza, Rosa Flores':'Food Pack','Castillo, Liza Navarro':'Medical'};
const birthdays=ages.map((age,i)=>`${2026-age}-${String((i%10)+1).padStart(2,'0')}-${String((i*2)%27+1).padStart(2,'0')}`);
const seed=names.map((name,i)=>({name,age:ages[i],ageYear:2026,birthday:birthdays[i],job:jobs[i],purok:puroks[i%5],pwd:pat[i%5][0],aid:pat[i%5][1],need:seedNeeds[name]||''}));
const nowYear=new Date().getFullYear();
let residents=(()=>{
  try{
    const saved=JSON.parse(localStorage.getItem(STORE));
    if(!Array.isArray(saved)||!saved.length)return seed;
    let changed=false;
    saved.forEach(r=>{
      if(r.birthday)return;
      if(!r.ageYear){r.ageYear=nowYear;changed=true}
      else if(nowYear>r.ageYear){
        if(r.age!==''&&r.age!=null)r.age=Number(r.age||0)+(nowYear-r.ageYear);
        r.ageYear=nowYear;changed=true;
      }
    });
    if(changed)localStorage.setItem(STORE,JSON.stringify(saved));
    return saved;
  }catch{return seed}
})();
const persist=()=>{try{localStorage.setItem(STORE,JSON.stringify(residents))}catch{}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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
const summary=()=>{const total=residents.length,assisted=residents.filter(r=>r.aid==='Given').length;return {total,pwd:residents.filter(r=>r.pwd==='Yes').length,assisted,pending:total-assisted}};
const saveResident=rec=>{residents.unshift(rec);persist()};

const field='block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-pine-700 focus:outline-none focus:ring-2 focus:ring-pine-700/10';
const labelCls='mb-1.5 block text-sm font-medium text-slate-700';
const btn='inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40';
const btnPrimary=`${btn} bg-pine-700 text-white hover:bg-pine-800`;
const btnGhost=`${btn} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`;
const aidStatus=aid=>`<span class="inline-flex items-center gap-1.5 text-sm ${aid==='Given'?'text-emerald-700':'text-amber-700'}"><span class="h-1.5 w-1.5 rounded-full ${aid==='Given'?'bg-emerald-500':'bg-amber-500'}"></span>${aid}</span>`;
const statCard=(n,l)=>`<div class="rounded-xl border border-slate-200 bg-white p-5"><p class="text-sm text-slate-500">${l}</p><p class="mt-2 text-2xl font-semibold tracking-tight text-slate-900">${n}</p></div>`;
const dashStat=(n,l,cap,icon,tone)=>`<div class="rounded-2xl border border-slate-200 bg-white p-5"><div class="flex items-start justify-between gap-3"><p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">${l}</p><span class="${tone}" aria-hidden="true">${icon}</span></div><p class="mt-3 text-3xl font-semibold tracking-tight text-slate-900">${n}</p><p class="mt-1 text-xs text-slate-500">${cap}</p></div>`;

const usersIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const heartIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>`;
const checkIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>`;
const clockIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`;
const menuIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" class="h-5 w-5" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`;
const closeIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" class="h-4 w-4" aria-hidden="true"><path d="M6 18L18 6M6 6l12 12"/></svg>`;
const logoutIcon=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><path d="M15 12H3m0 0 3-3m-3 3 3 3M10 5V3h9a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-9v-2"/></svg>`;

const navItems=[['dashboard','Dashboard'],['records','Residents'],['survey','Survey'],['assistance','Assistance'],['reports','Reports']];
const navGroups=[['Overview',navItems.slice(0,1)],['Records',navItems.slice(1,3)],['Services',navItems.slice(3,4)],['Insights',navItems.slice(4)]];
const navBtn=(k,l)=>`<button type="button" onclick="go('${k}')" ${v===k?'aria-current="page"':''} class="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${v===k?'bg-pine-50 font-medium text-pine-800':'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}">${l}</button>`;
const navGroupMarkup=()=>navGroups.map(([label,items])=>`<div><p class="px-3 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">${label}</p><div class="space-y-0.5">${items.map(([k,l])=>navBtn(k,l)).join('')}</div></div>`).join('');
const logoutBtn=`<button type="button" onclick="logout()" class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700">${logoutIcon}Logout</button>`;
const userCard=`<div class="mx-3 mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"><span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-pine-700 text-sm font-bold text-white">SA</span><div class="min-w-0"><p class="truncate text-xs font-semibold text-slate-900">System Admin</p><span class="mt-1 inline-flex rounded-full bg-pine-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-pine-700">Admin</span></div></div>`;
const brandBlock=`<button type="button" onclick="go('dashboard')" class="flex min-w-0 items-center gap-2.5 rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-700"><span class="flex shrink-0 items-center gap-1.5"><img src="assets/barangay-logo.jpg" alt="" class="h-9 w-9 rounded-full object-cover"><img src="assets/tangub-logo.jpg" alt="" class="h-9 w-9 object-contain"></span><span class="min-w-0"><span class="block text-[9px] font-semibold uppercase tracking-[0.24em] text-pine-600">Barangay</span><span class="mt-1 block text-sm font-semibold tracking-[0.1em] text-slate-900">MIGCANAWAY</span><span class="mt-0.5 block text-[10px] uppercase tracking-[0.14em] text-slate-400">Tangub City</span><span class="block text-[9px] uppercase tracking-[0.14em] text-slate-400">Survey &amp; Assistance</span></span></button>`;

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
    <button id="menu-btn" type="button" onclick="toggleMenu()" aria-label="Open navigation" title="Open navigation" aria-controls="mobile-menu" aria-expanded="false" class="-ml-1 grid h-10 w-10 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-700">${menuIcon}</button>
    <p class="pointer-events-none absolute left-1/2 top-1/2 max-w-[40%] -translate-x-1/2 -translate-y-1/2 truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900">${label}</p>
  </header>
  <aside class="hidden border-r border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:w-64 lg:flex-col print:hidden">
    <div class="px-5 py-5">${brandBlock}</div>
    ${userCard}
    <nav class="flex flex-1 flex-col gap-5 overflow-y-auto p-3" aria-label="Main navigation">${navGroupMarkup()}</nav>
    <div class="border-t border-slate-200 p-3">${logoutBtn}</div>
  </aside>
  <div class="relative z-10 lg:pl-64 print:pl-0">
    <main class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-10 lg:py-12 print:max-w-none print:p-0">
      <div class="animate-fade-up">
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
  const views={login,dashboard,survey,records:recs,assistance:recs,reports};
  document.getElementById('app').innerHTML=views[v]()+(toast?`<div class="fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"><div role="status" aria-live="polite" class="animate-fade-up rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">${toast}</div></div>`:'');
}
function go(k){v=k;page=1;q='';filterBy='all';editIndex=-1;draw()}
function editResident(i){editIndex=i;v='survey';page=1;q='';filterBy='all';draw()}
function setSearch(value){q=value;page=1;draw();const el=document.getElementById('search');if(el&&typeof el.focus==='function'){el.focus();if(typeof el.setSelectionRange==='function'){const len=el.value.length;el.setSelectionRange(len,len)}}}
function setFilter(value){filterBy=value;page=1;draw()}
function toggleAid(i){
  const r=residents[i];
  r.aid=r.aid==='Given'?'Pending':'Given';
  persist();
  flash(r.aid==='Given'?'Marked as given':'Marked as pending');
}
function exportCsv(){
  const cell=value=>`"${String(value??'').replace(/"/g,'""')}"`;
  const rows=[['Name','Age','Birthday','Sex','Work','Purok','PWD','Assistance','Need','Remarks'],...residents.map(r=>[r.name,ageOf(r),r.birthday||'',r.sex||'',r.job||'',r.purok||'',r.pwd||'',r.aid||'',r.need||'',r.remarks||''])];
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
  if(confirm('Are you sure you want to log out?'))go('login');
}
function flash(m){toast=m;draw();setTimeout(()=>{toast='';draw()},1800)}
function toggleMenu(){
  const panel=document.getElementById('mobile-menu');
  const button=document.getElementById('menu-btn');
  if(!panel)return;
  const opening=panel.classList.contains('hidden');
  panel.classList.toggle('hidden',!opening);
  if(button)button.setAttribute('aria-expanded',String(opening));
}

function login(){
  return `<div class="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-cream px-4 py-10">
  <div class="pointer-events-none absolute inset-0" aria-hidden="true"><div class="absolute -left-40 top-1/4 h-[34rem] w-[34rem] rounded-full bg-pine-100/70 blur-[130px]"></div><div class="absolute -bottom-48 right-0 h-[30rem] w-[30rem] rounded-full bg-emerald-100/60 blur-[120px]"></div></div>
  <p class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[24vw] font-bold tracking-tighter text-pine-900/[0.04]" aria-hidden="true">MIGCANAWAY</p>
  <div class="relative z-10 w-full max-w-md animate-fade-up rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_30px_100px_-40px_rgba(12,40,34,0.35)] sm:p-9">
    <div class="text-center"><div class="flex items-center justify-center gap-4"><img src="assets/barangay-logo.jpg" alt="Barangay Migcanaway seal" class="h-16 w-16 rounded-full object-cover ring-1 ring-slate-200 sm:h-20 sm:w-20"><img src="assets/tangub-logo.jpg" alt="Tangub City seal" class="h-16 w-16 object-contain sm:h-20 sm:w-20"></div><p class="mt-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-pine-600">Barangay</p><h1 class="mt-2 text-3xl font-semibold tracking-[0.08em] text-pine-800">MIGCANAWAY</h1><p class="mt-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Tangub City</p><p class="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Resident Survey &amp; Assistance</p><div class="mx-auto mt-6 h-px w-2/3 bg-gradient-to-r from-transparent via-pine-200 to-transparent"></div></div>
    <form class="mt-6 space-y-4" onsubmit="event.preventDefault();go('dashboard')">
      <div><label class="${labelCls}" for="u">Username</label><input id="u" class="${field}" placeholder="Enter username" autocomplete="username"></div>
      <div><label class="${labelCls}" for="p">Password</label><input id="p" type="password" class="${field}" placeholder="Enter password" autocomplete="current-password"></div>
      <button type="submit" class="${btnPrimary} mt-2 w-full px-4 py-3">Login</button>
      <p class="text-center text-[10px] uppercase tracking-[0.16em] text-slate-400">No account needed · Click Login to continue</p>
    </form>
  </div>
</div>`;
}

function dashboard(){
  const recent=residents.slice(0,5);
  const hour=new Date().getHours(),greeting=hour<12?'Good morning':hour<18?'Good afternoon':'Good evening';
  const today=new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  const pending=residents.filter(r=>r.aid==='Pending').slice(0,4).map(r=>[r.name,r.need||'Assistance']);
  const s=summary();
  const stats=[[s.total,'Total residents','Registered residents',usersIcon,'text-pine-700'],[s.pwd,'PWD residents','Persons with disability',heartIcon,'text-pine-600'],[s.assisted,'Assisted','Received assistance',checkIcon,'text-emerald-600'],[s.pending,'Pending','Awaiting support',clockIcon,'text-amber-500']];
  return shell('Dashboard','A quick look at residents and assistance across the barangay.',`<section class="relative mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(23,69,59,0.09),transparent_48%)]" aria-hidden="true"></div>
    <div class="relative z-10 max-w-2xl"><p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-pine-600">Barangay overview · Tangub City</p><h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">${greeting}, <span class="text-pine-700">Admin</span>.</h2><p class="mt-2 text-sm leading-6 text-slate-500">${today} — here's what's happening with residents and assistance today.</p><div class="mt-5 flex flex-wrap gap-2"><button type="button" class="${btnPrimary}" onclick="go('survey')">New resident</button><button type="button" class="${btnGhost}" onclick="go('assistance')">Review assistance</button></div></div>
  </section>
  <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">${stats.map(([n,l,cap,icon,tone])=>dashStat(n,l,cap,icon,tone)).join('')}</div>
  <div class="mt-3 grid gap-3 lg:grid-cols-5">
    <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white lg:col-span-3">
      <div class="flex items-start justify-between gap-3 px-5 py-4"><div><h2 class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">Recent residents</h2><p class="mt-1 text-xs text-slate-500">Latest profiles added to the record.</p></div><button type="button" onclick="go('records')" class="rounded-lg px-2 py-1.5 text-xs font-medium text-pine-700 transition-colors hover:bg-pine-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-700">View all</button></div>
      <div class="overflow-x-auto border-t border-slate-100"><table class="w-full min-w-[540px] text-left text-sm"><thead class="bg-slate-50 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500"><tr><th class="px-5 py-2.5 font-medium">Name</th><th class="px-4 py-2.5 font-medium">Work</th><th class="px-5 py-2.5 font-medium">Assistance</th></tr></thead><tbody class="divide-y divide-slate-100">${recent.map(r=>`<tr class="transition-colors hover:bg-slate-50/70"><td class="whitespace-nowrap px-5 py-3 font-medium text-slate-900">${esc(r.name)}</td><td class="px-4 py-3 text-slate-500">${esc(r.job)}</td><td class="px-5 py-3">${aidStatus(esc(r.aid))}</td></tr>`).join('')}</tbody></table></div>
    </section>
    <section class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2"><div><h2 class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">Pending assistance</h2><p class="mt-1 text-xs text-slate-500">Residents waiting for support.</p></div><div class="mt-4 flex-1 space-y-3">${pending.map(([name,need])=>`<div class="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"><div class="min-w-0"><p class="truncate text-sm font-medium text-slate-900">${esc(name)}</p><p class="mt-0.5 text-xs text-slate-500">${esc(need)}</p></div><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true"></span></div>`).join('')}</div><button type="button" class="${btnGhost} mt-5 w-full" onclick="go('assistance')">View assistance</button></section>
  </div>`);
}

function survey(){
  const editing=editIndex>=0;
  const r=editing?residents[editIndex]:{};
  const so=(a,selected='')=>`<select class="${field}"><option value="">Select</option>${a.map(x=>`<option ${x===selected?'selected':''}>${x}</option>`).join('')}</select>`;
  return shell(editing?'Edit Resident':'Resident Survey Form',editing?'Update the resident profile and assistance details.':'Add a resident and record the assistance they need.',`<form class="overflow-hidden rounded-xl border border-slate-200 bg-white" onsubmit="event.preventDefault();saveSurvey()">
  <div class="space-y-8 p-5 sm:p-7">
    <section><h2 class="text-sm font-semibold text-slate-900">Personal information</h2><p class="mt-0.5 text-xs text-slate-500">Basic details for the resident record.</p><div class="mt-5 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
      <div class="sm:col-span-4"><label class="${labelCls}" for="fullname">Full name</label><input id="fullname" class="${field}" placeholder="Last, First, Middle" value="${esc(r.name||'')}" required></div>
      <div class="sm:col-span-1"><label class="${labelCls}" for="age">Age</label><input id="age" type="number" min="0" max="120" class="${field}" placeholder="00" value="${esc(editing?ageOf(r):'')}"></div>
      <div class="sm:col-span-1"><label class="${labelCls}" for="sex">Sex</label>${so(['Male','Female'],r.sex).replace('<select','<select id="sex"')}</div>
      <div class="sm:col-span-2"><label class="${labelCls}" for="birthday">Birthday</label><input id="birthday" type="date" class="${field}" aria-describedby="birthday-hint" value="${esc(r.birthday||'')}" onchange="syncAge()"><p id="birthday-hint" class="mt-1 text-[11px] text-slate-400">Age updates automatically each year.</p></div>
      <div class="sm:col-span-2"><label class="${labelCls}" for="work">Work / occupation</label><input id="work" class="${field}" placeholder="e.g. Farmer" value="${esc(r.job||'')}"></div>
      <div class="sm:col-span-2"><label class="${labelCls}" for="purok">Purok / address</label>${so(puroks,r.purok).replace('<select','<select id="purok"')}</div>
    </div></section>
    <section class="border-t border-slate-100 pt-8"><h2 class="text-sm font-semibold text-slate-900">Assistance details</h2><p class="mt-0.5 text-xs text-slate-500">Needs and notes for this resident.</p><div class="mt-5 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
      <div class="sm:col-span-3"><span class="${labelCls}">PWD status</span><div class="flex gap-6 pt-2"><label class="flex cursor-pointer items-center gap-2 text-sm text-slate-600"><input type="radio" name="pwd" value="Yes" class="h-4 w-4 accent-pine-700" ${r.pwd==='Yes'?'checked':''}>Yes</label><label class="flex cursor-pointer items-center gap-2 text-sm text-slate-600"><input type="radio" name="pwd" value="No" class="h-4 w-4 accent-pine-700" ${r.pwd==='No'?'checked':''}>No</label></div></div>
      <div class="sm:col-span-3"><label class="${labelCls}" for="need">Assistance needed</label>${so(['Food Pack','Medical','Cash Aid','Livelihood'],r.need).replace('<select','<select id="need"')}</div>
      <div class="sm:col-span-6"><label class="${labelCls}" for="remarks">Remarks</label><textarea id="remarks" class="${field} min-h-[6rem] resize-y" placeholder="Type notes here...">${esc(r.remarks||'')}</textarea></div>
    </div></section>
  </div>
  <div class="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:px-7"><button type="reset" class="${btnGhost}">Clear</button><button type="submit" class="${btnPrimary}">${editing?'Save changes':'Save resident'}</button></div>
</form>`);
}

function saveSurvey(){
  const val=id=>(document.getElementById(id)||{}).value||'';
  const name=val('fullname').trim();
  if(!name)return;
  const birthday=val('birthday');
  const computedAge=ageFromBirthday(birthday);
  const pwd=document.querySelector('input[name="pwd"]:checked');
  const aid=editIndex>=0?residents[editIndex].aid:'Pending';
  const rec={name,age:computedAge===''?Number(val('age'))||'':computedAge,ageYear:nowYear,birthday,sex:val('sex'),job:val('work').trim(),purok:val('purok'),pwd:pwd?pwd.value:'No',need:val('need'),remarks:val('remarks').trim(),aid};
  if(editIndex>=0){
    residents[editIndex]=rec;
    persist();
    editIndex=-1;
    go('records');
    flash('Resident updated');
  } else {
    saveResident(rec);
    flash('Resident saved');
  }
}
function syncAge(){
  const b=(document.getElementById('birthday')||{}).value||'';
  const a=ageFromBirthday(b);
  if(a==='')return;
  const input=document.getElementById('age');
  if(input)input.value=a;
}

function recs(){
  const isAid=v==='assistance';
  const needle=q.trim().toLowerCase();
  const filtered=residents.map((r,i)=>({r,i})).filter(({r})=>
    (!needle||r.name.toLowerCase().includes(needle)) &&
    (filterBy==='all'||(filterBy==='pwd'?r.pwd==='Yes':r.aid==='Pending'))
  );
  const pages=Math.max(1,Math.ceil(filtered.length/5));
  if(page>pages)page=pages;
  const rows=filtered.slice((page-1)*5,page*5);
  const pg=n=>`<button type="button" onclick="page=${n};draw()" ${page===n?'aria-current="page"':''} class="grid h-8 min-w-[2rem] place-items-center rounded-md border px-2 text-xs font-medium transition ${page===n?'border-pine-700 bg-pine-700 text-white':'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}">${n}</button>`;
  const arrow=(target,disabled,symbol,label)=>`<button type="button" ${disabled?'disabled':''} onclick="page=${target};draw()" aria-label="${label}" title="${label}" class="grid h-8 w-8 place-items-center rounded-md border border-slate-300 bg-white text-slate-500 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40">${symbol}</button>`;
  const pager=Array.from({length:pages},(_,i)=>pg(i+1)).join('');
  const actions=isAid?'':`<button type="button" class="${btnPrimary}" onclick="go('survey')">Add resident</button>`;
  const rowMarkup=rows.length?rows.map(({r,i})=>{
    const aidAction=isAid?`<button type="button" onclick="toggleAid(${i})" class="text-sm font-medium text-pine-700 transition hover:text-pine-800">${r.aid==='Given'?'Mark pending':'Mark given'}</button>`:'';
    return `<tr class="transition-colors hover:bg-slate-50/70"><td class="whitespace-nowrap px-5 py-3.5 font-medium text-slate-900">${esc(r.name)}</td><td class="px-3 py-3.5 text-slate-500">${esc(ageOf(r))}</td><td class="px-3 py-3.5 text-slate-500">${esc(r.job)}</td><td class="px-3 py-3.5 text-slate-600">${esc(r.pwd)}</td><td class="px-3 py-3.5">${aidStatus(esc(r.aid))}</td><td class="px-5 py-3.5 text-right"><div class="flex justify-end gap-3">${aidAction}<button type="button" onclick="editResident(${i})" class="text-sm font-medium text-pine-700 transition hover:text-pine-800">Edit</button></div></td></tr>`;
  }).join(''):`<tr><td colspan="6" class="px-5 py-10 text-center text-sm text-slate-500">No residents found.</td></tr>`;
  const footer=filtered.length?`Showing <span class="font-medium text-slate-700">${(page-1)*5+1}–${Math.min(page*5,filtered.length)}</span> of ${filtered.length} residents`:'No residents found';
  return shell(isAid?'Assistance':'Resident Records',isAid?'Track who has received assistance and who is still pending.':'Search, review, and update resident profiles.',`<div class="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <form class="flex gap-2 sm:max-w-md" onsubmit="event.preventDefault();setSearch(document.getElementById('search').value)">
      <input id="search" type="search" class="${field}" placeholder="Search name..." aria-label="Search residents" value="${esc(q)}" enterkeyhint="search" oninput="setSearch(this.value)"><button type="submit" class="${btnGhost} shrink-0">Search</button>
    </form>
    <select id="filter" class="${field} sm:w-48" aria-label="Filter residents" onchange="setFilter(this.value)">
      <option value="all" ${filterBy==='all'?'selected':''}>All residents</option>
      <option value="pwd" ${filterBy==='pwd'?'selected':''}>PWD residents</option>
      <option value="pending" ${filterBy==='pending'?'selected':''}>Pending assistance</option>
    </select>
  </div>
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white"><div class="overflow-x-auto"><table class="w-full min-w-[680px] text-left text-sm"><thead class="bg-slate-50 text-xs font-medium text-slate-500"><tr><th class="px-5 py-3 font-medium">Name</th><th class="px-3 py-3 font-medium">Age</th><th class="px-3 py-3 font-medium">Work</th><th class="px-3 py-3 font-medium">PWD</th><th class="px-3 py-3 font-medium">Assistance</th><th class="px-5 py-3 text-right font-medium">Action</th></tr></thead><tbody class="divide-y divide-slate-100">${rowMarkup}</tbody></table></div>
  <div class="flex flex-col gap-3 border-t border-slate-200 p-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>${footer}</span><div class="flex items-center gap-1.5">${filtered.length?`${arrow(page-1,page===1,'‹','Previous page')}${pager}${arrow(page+1,page===pages,'›','Next page')}`:''}</div></div></div>`,actions);
}

function reports(){
  const s=summary();
  const stats=[[s.total,'Total residents'],[s.pwd,'PWD residents'],[s.assisted,'Assisted'],[s.pending,'Pending']];
  const bars=puroks.map(p=>{const list=residents.filter(r=>r.purok===p);const given=list.filter(r=>r.aid==='Given').length;return [list.length?Math.round(given/list.length*100):0]});
  const projects=[['Feeding Program',82],['Medical Mission',58],['Clean-up Drive',100],['Livelihood Training',36]];
  return shell('Reports and Summary','A snapshot of residents and assistance across the barangay.',`<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">${stats.map(([n,l])=>statCard(n,l)).join('')}</div>
  <div class="mt-3 grid gap-3 lg:grid-cols-5">
    <section class="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-3"><h2 class="text-sm font-medium text-slate-900">Assistance per Purok</h2><p class="mt-0.5 text-xs text-slate-500">Residents assisted in each area.</p><div class="mt-8 flex h-40 items-end gap-3 sm:gap-4">${bars.map(([h],i)=>`<div class="relative flex h-full flex-1 items-end"><span class="absolute inset-x-0 -top-5 text-center text-[11px] font-medium text-slate-400">${h}%</span><div class="w-full origin-bottom animate-grow-y rounded-t bg-pine-700" style="height:${h}%;animation-delay:${i*60}ms" title="Purok ${i+1}: ${h}%"></div></div>`).join('')}</div><div class="mt-3 flex gap-3 border-t border-slate-100 pt-3 sm:gap-4">${bars.map((_,i)=>`<span class="flex-1 text-center text-[11px] text-slate-400">Purok ${i+1}</span>`).join('')}</div></section>
    <section class="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2"><h2 class="text-sm font-medium text-slate-900">Projects and Activities</h2><p class="mt-0.5 text-xs text-slate-500">Ongoing barangay programs.</p><div class="mt-6 space-y-4">${projects.map(([name,p],i)=>`<div><div class="flex items-center justify-between gap-3 text-sm"><span class="text-slate-600">${name}</span><span class="text-xs text-slate-400">${p}%</span></div><div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div class="h-full origin-left animate-grow-x rounded-full bg-pine-700" style="width:${p}%;animation-delay:${i*60}ms"></div></div></div>`).join('')}</div></section>
  </div>`,`<button type="button" class="${btnGhost}" onclick="window.print()">Print</button><button type="button" class="${btnPrimary}" onclick="exportCsv()">Export</button>`);
}

draw();
