const puroks=['Purok 1','Purok 2','Purok 3','Purok 4','Purok 5'];
const pat=[['Yes','Given'],['No','Pending'],['Yes','Pending'],['No','Given'],['No','Pending']];
const routes={login:'login',survey:'survey-form',records:'records',assistance:'assistance',reports:'reports'};
let v='login',page=1,showPw=false,err='',toast='';

const names=['Santos, Maria Cruz','Reyes, Juan Dela Pena','Garcia, Ana Lopez','Bautista, Pedro Ramos','Mendoza, Rosa Flores','Villanueva, Jose Aquino','Castillo, Liza Navarro','Torres, Miguel Santiago','Dizon, Carmen Pascual','Ramos, Antonio Cruz','Fernandez, Grace Morales','Lopez, Ricardo Tan','Aquino, Nena Gutierrez','Domingo, Roberto Salazar','Perez, Joy Valdez'];
const ages=[34,51,29,63,45,38,57,42,60,26,49,36,58,31,47];
const jobs=['Farmer','Fisherman','Public school teacher','Sari-sari store owner','Tricycle driver','Carpenter','Nurse','Tailor','Electrician','Senior high student','Baker','Auto mechanic','Barangay health worker','Security guard','Cook'];

const I={
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  clipboard:'<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 12h6"/><path d="M9 16h4"/>',
  heart:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  chart:'<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  plus:'<path d="M12 5v14"/><path d="M5 12h14"/>',
  printer:'<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  access:'<circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/>',
  lock:'<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  alert:'<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  arrow:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  chevronLeft:'<path d="m15 18-6-6 6-6"/>',
  chevronRight:'<path d="m9 18 6-6-6-6"/>'
};
const ico=(path,cls='h-5 w-5')=>`<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;

const field='block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500';
const labelCls='mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500';
const btn='inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[.98] disabled:pointer-events-none disabled:opacity-40';
const btnPrimary=`${btn} bg-brand-600 text-white shadow-sm hover:bg-brand-700`;
const btnGhost=`${btn} bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50`;

const tones={
  yes:'bg-brand-50 text-brand-700 ring-brand-600/20',
  no:'bg-slate-100 text-slate-600 ring-slate-500/10',
  given:'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  pending:'bg-amber-50 text-amber-700 ring-amber-600/20'
};
const badge=(text,tone)=>`<span class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${tones[tone]}"><span class="h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>${text}</span>`;
const initials=n=>{const[last,first='']=n.split(', ');return(last[0]+first[0]).toUpperCase()};

const nav=[['records','Residents',I.users],['survey','Survey Form',I.clipboard],['assistance','Assistance',I.heart],['reports','Reports',I.chart]];

const chrome=()=>`<div class="flex items-center gap-3 border-b border-slate-200 bg-slate-100 px-4 py-2.5">
  <div class="flex shrink-0 gap-1.5">
    <span class="h-2.5 w-2.5 rounded-full bg-rose-400"></span>
    <span class="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
    <span class="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
  </div>
  <div class="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-500">
    ${ico(I.lock,'h-3 w-3 shrink-0 text-slate-400')}
    <span class="truncate">barangay-migcanaway-system / ${routes[v]}</span>
  </div>
</div>`;

function shell(title,subtitle,body){
  const links=nav.map(([k,l,i])=>{
    const on=v===k;
    return `<button type="button" onclick="go('${k}')" ${on?'aria-current="page"':''} class="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition duration-200 lg:w-full ${on?'bg-brand-600 text-white shadow-sm shadow-brand-900/20':'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'}">${ico(i,'h-4 w-4 shrink-0')}<span>${l}</span></button>`;
  }).join('');
  return `<div class="min-h-screen bg-gradient-to-br from-slate-200 via-slate-100 to-brand-100/60 px-2 py-3 sm:px-4 sm:py-6 lg:px-8 lg:py-10 print:bg-white print:p-0">
  <div class="mx-auto max-w-6xl">
    <div class="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/20 ring-1 ring-slate-300/70 print:rounded-none print:shadow-none print:ring-0">
      ${chrome()}
      <div class="bg-gradient-to-r from-brand-950 via-brand-800 to-brand-700 print:hidden">
        <div class="flex items-center gap-3 px-4 py-3.5 sm:px-6">
          <div class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-xs font-bold tracking-wide ring-1 ring-inset ring-white/15">BM</div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold sm:text-[15px]">Barangay Migcanaway</p>
            <p class="truncate text-[10px] text-white/55 sm:text-[11px]">Resident Survey and Assistance Tracking System</p>
          </div>
          <span class="hidden shrink-0 items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3 text-[11px] font-medium text-white/85 ring-1 ring-inset ring-white/15 sm:flex">
            <span class="grid h-6 w-6 place-items-center rounded-full bg-white/15 text-[9px] font-semibold">BS</span>Barangay Staff
          </span>
        </div>
      </div>
      <div class="flex flex-col lg:min-h-[620px] lg:flex-row">
        <aside class="flex shrink-0 flex-col border-b border-slate-200 bg-slate-50/80 lg:w-60 lg:border-b-0 lg:border-r print:hidden">
          <nav class="flex gap-1 overflow-x-auto p-2 lg:flex-1 lg:flex-col lg:p-3" aria-label="Main navigation">
            ${links}
            <button type="button" onclick="go('login')" class="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition duration-200 hover:bg-slate-200/70 hover:text-slate-900 lg:mt-auto lg:w-full">${ico(I.logout,'h-4 w-4 shrink-0')}<span>Logout</span></button>
          </nav>
        </aside>
        <main class="min-w-0 flex-1 bg-slate-100/60 p-4 sm:p-6 print:bg-white print:p-0">
          <div class="animate-fade-up">
            <h1 class="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">${title}</h1>
            <p class="mt-1 text-sm text-slate-500">${subtitle}</p>
            <div class="mt-5">${body}</div>
          </div>
        </main>
      </div>
    </div>
    <p class="mt-3 text-center text-[11px] text-slate-400 print:hidden">Prototype · Barangay Migcanaway</p>
  </div>
</div>`;
}

function draw(){
  const views={login,survey,records:recs,assistance:recs,reports};
  document.getElementById('app').innerHTML=views[v]()+(toast?`<div role="status" aria-live="polite" class="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 animate-toast-in items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xl">${ico(I.check,'h-4 w-4 text-emerald-400')}${toast}</div>`:'');
}
function go(k){v=k;page=1;err='';draw()}
function flash(m){toast=m;draw();setTimeout(()=>{toast='';draw()},1800)}

function login(){
  return `<div class="min-h-screen bg-gradient-to-br from-slate-200 via-slate-100 to-brand-100/60 px-2 py-3 sm:px-4 sm:py-6 lg:px-8 lg:py-10">
  <div class="mx-auto max-w-6xl">
    <div class="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/20 ring-1 ring-slate-300/70">
      ${chrome()}
      <div class="relative flex min-h-[560px] items-center justify-center overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-slate-950 px-4 py-12 sm:min-h-[620px]">
        <div aria-hidden="true" class="pointer-events-none absolute -left-24 -top-24 h-80 w-80 animate-float rounded-full bg-brand-500/25 blur-3xl"></div>
        <div aria-hidden="true" class="pointer-events-none absolute -bottom-28 -right-20 h-96 w-96 animate-float rounded-full bg-indigo-400/15 blur-3xl [animation-delay:-3s]"></div>
        <div class="relative w-full max-w-sm">
          <div class="rounded-2xl bg-white/95 p-8 shadow-2xl ring-1 ring-black/5 backdrop-blur">
            <div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-lg font-bold text-white shadow-lg shadow-brand-950/30">BM</div>
            <h1 class="mt-5 text-center text-lg font-semibold tracking-tight text-slate-900">Barangay Migcanaway</h1>
            <p class="mx-auto mt-1 max-w-[15rem] text-center text-sm leading-5 text-slate-500">Resident Survey and Assistance Tracking System</p>
            <form class="mt-7 space-y-4" onsubmit="event.preventDefault();doLogin()">
              <div>
                <label class="${labelCls}" for="u">Username</label>
                <input id="u" class="${field}" placeholder="Enter username" autocomplete="username">
              </div>
              <div>
                <label class="${labelCls}" for="p">Password</label>
                <div class="relative">
                  <input id="p" type="${showPw?'text':'password'}" class="${field} pr-14" placeholder="••••••••" autocomplete="current-password">
                  <button type="button" onclick="pw()" class="absolute inset-y-0 right-0 rounded-r-lg px-3 text-xs font-semibold text-brand-600 transition hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500">${showPw?'Hide':'Show'}</button>
                </div>
              </div>
              ${err?`<div class="flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">${ico(I.alert,'h-4 w-4 shrink-0')}${err}</div>`:''}
              <button type="submit" class="${btnPrimary} w-full">Login ${ico(I.arrow,'h-4 w-4')}</button>
            </form>
            <p class="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">${ico(I.lock,'h-3.5 w-3.5')}Barangay staff access only</p>
          </div>
        </div>
      </div>
    </div>
    <p class="mt-3 text-center text-[11px] text-slate-400">Prototype · Barangay Migcanaway</p>
  </div>
</div>`;
}
function pw(){const u=document.getElementById('u').value,p=document.getElementById('p').value;showPw=!showPw;draw();document.getElementById('u').value=u;document.getElementById('p').value=p;document.getElementById('p').focus()}
function doLogin(){
  const u=document.getElementById('u').value.trim(),p=document.getElementById('p').value;
  if(!u||!p){err='Please enter your username and password.';draw();document.getElementById('u').value=u;document.getElementById('p').value=p;document.getElementById('u').focus();return}
  go('records')
}

function survey(){
  const so=a=>`<select class="${field}"><option value="">Select</option>${a.map(x=>`<option>${x}</option>`).join('')}</select>`;
  return shell('Resident Survey Form','Register a resident and record the assistance they need.',`<form class="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-200" onsubmit="event.preventDefault();flash('Resident saved successfully.')">
  <div class="space-y-7 p-5 sm:p-6">
    <section>
      <div class="mb-4 flex items-center gap-2.5">
        <span class="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600">${ico(I.users,'h-4 w-4')}</span>
        <div>
          <h2 class="text-sm font-semibold text-slate-900">Personal information</h2>
          <p class="text-xs text-slate-500">Basic details of the resident.</p>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
        <div class="sm:col-span-4"><label class="${labelCls}" for="fullname">Full Name</label><input id="fullname" class="${field}" placeholder="Last, First, Middle"></div>
        <div class="sm:col-span-1"><label class="${labelCls}" for="age">Age</label><input id="age" type="number" min="0" max="120" class="${field}" placeholder="00"></div>
        <div class="sm:col-span-1"><label class="${labelCls}" for="sex">Sex</label>${so(['Male','Female']).replace('<select','<select id="sex"')}</div>
        <div class="sm:col-span-3"><label class="${labelCls}" for="work">Work / Occupation</label><input id="work" class="${field}" placeholder="e.g. Farmer"></div>
        <div class="sm:col-span-3"><label class="${labelCls}" for="purok">Purok / Address</label>${so(puroks).replace('<select','<select id="purok"')}</div>
      </div>
    </section>
    <section class="border-t border-slate-100 pt-7">
      <div class="mb-4 flex items-center gap-2.5">
        <span class="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600">${ico(I.heart,'h-4 w-4')}</span>
        <div>
          <h2 class="text-sm font-semibold text-slate-900">Assistance details</h2>
          <p class="text-xs text-slate-500">Needs and notes for this resident.</p>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
        <div class="sm:col-span-3">
          <span class="${labelCls}">PWD Status</span>
          <div class="flex gap-2">
            <label class="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 ring-1 ring-inset ring-slate-300 transition has-[:checked]:bg-brand-50 has-[:checked]:text-brand-700 has-[:checked]:ring-brand-500"><input type="radio" name="pwd" value="Yes" class="h-4 w-4 accent-brand-600">Yes</label>
            <label class="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 ring-1 ring-inset ring-slate-300 transition has-[:checked]:bg-brand-50 has-[:checked]:text-brand-700 has-[:checked]:ring-brand-500"><input type="radio" name="pwd" value="No" class="h-4 w-4 accent-brand-600">No</label>
          </div>
        </div>
        <div class="sm:col-span-3"><label class="${labelCls}" for="need">Assistance Needed</label>${so(['Food Pack','Medical','Cash Aid','Livelihood']).replace('<select','<select id="need"')}</div>
        <div class="sm:col-span-6"><label class="${labelCls}" for="remarks">Remarks</label><textarea id="remarks" class="${field} min-h-24 resize-y" placeholder="Type notes here..."></textarea></div>
      </div>
    </section>
  </div>
  <div class="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/70 px-5 py-4 sm:px-6">
    <button type="reset" class="${btnGhost}">Clear</button>
    <button type="submit" class="${btnPrimary}">${ico(I.check,'h-4 w-4')}Save</button>
  </div>
</form>`);
}

function recs(){
  const isAid=v==='assistance';
  const rows=Array.from({length:5},(_,i)=>{
    const n=(page-1)*5+i;
    return {name:names[n],age:ages[n],job:jobs[n],pwd:pat[(i+(page-1)*2)%5][0],aid:pat[(i+(page-1)*2)%5][1]};
  });
  const pg=n=>`<button type="button" onclick="page=${n};draw()" ${page===n?'aria-current="page"':''} class="grid h-8 min-w-8 place-items-center rounded-lg px-2 text-xs font-semibold transition ${page===n?'bg-brand-600 text-white shadow-sm':'bg-white text-slate-600 ring-1 ring-inset ring-slate-300 hover:bg-slate-50'}">${n}</button>`;
  const navBtn=(target,disabled,icon,label)=>`<button type="button" ${disabled?'disabled':''} onclick="page=${target};draw()" aria-label="${label}" class="grid h-8 w-8 place-items-center rounded-lg bg-white text-slate-600 ring-1 ring-inset ring-slate-300 transition hover:bg-slate-50">${ico(icon,'h-4 w-4')}</button>`;
  return shell(isAid?'Assistance':'Resident Records and Assistance',isAid?'Track who has received assistance and who is still pending.':'Search, review, and update resident profiles.',`<div class="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-200">
  <div class="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
    <div class="relative w-full sm:max-w-xs">
      <span class="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-items-center text-slate-400">${ico(I.search,'h-4 w-4')}</span>
      <input class="${field} pl-10" placeholder="Search resident name..." aria-label="Search residents">
    </div>
    <div class="flex items-center gap-2">
      <label for="filter" class="sr-only">Filter records</label>
      <select id="filter" class="${field} sm:w-44"><option>All residents</option><option>PWD residents</option><option>Pending assistance</option></select>
    </div>
  </div>
  <div class="overflow-x-auto">
    <table class="w-full min-w-[720px] text-left text-sm">
      <thead class="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
        <tr>
          <th class="px-5 py-3 font-semibold">Name</th>
          <th class="px-3 py-3 font-semibold">Age</th>
          <th class="px-3 py-3 font-semibold">Work</th>
          <th class="px-3 py-3 font-semibold">PWD</th>
          <th class="px-3 py-3 font-semibold">Assistance</th>
          <th class="px-5 py-3 text-right font-semibold">Action</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        ${rows.map((r,i)=>`<tr class="animate-fade-up transition-colors hover:bg-slate-50/80" style="animation-delay:${i*35}ms">
          <td class="whitespace-nowrap px-5 py-3.5">
            <div class="flex items-center gap-3">
              <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-[10px] font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/10">${initials(r.name)}</span>
              <span class="font-medium text-slate-900">${r.name}</span>
            </div>
          </td>
          <td class="px-3 py-3.5 text-slate-500">${r.age}</td>
          <td class="px-3 py-3.5 text-slate-600">${r.job}</td>
          <td class="px-3 py-3.5">${badge(r.pwd,r.pwd==='Yes'?'yes':'no')}</td>
          <td class="px-3 py-3.5">${badge(r.aid,r.aid==='Given'?'given':'pending')}</td>
          <td class="px-5 py-3.5 text-right"><button type="button" onclick="go('survey')" class="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-brand-50 hover:text-brand-700">Edit</button></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
  <div class="flex flex-col gap-3 border-t border-slate-200 p-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
    <span>Showing <span class="font-medium text-slate-700">${(page-1)*5+1}–${page*5}</span> of 120 residents</span>
    <div class="flex items-center gap-1.5">${navBtn(page-1,page===1,I.chevronLeft,'Previous page')}${pg(1)}${pg(2)}${pg(3)}${navBtn(page+1,page===3,I.chevronRight,'Next page')}</div>
  </div>
</div>${isAid?'':`<div class="mt-4 print:hidden"><button type="button" class="${btnPrimary}" onclick="go('survey')">${ico(I.plus,'h-4 w-4')}Add Resident</button></div>`}`);
}

function reports(){
  const stats=[['120','Total residents',I.users,'bg-brand-50 text-brand-600'],['18','PWD residents',I.access,'bg-violet-50 text-violet-600'],['64','Assisted',I.check,'bg-emerald-50 text-emerald-600'],['56','Pending',I.clock,'bg-amber-50 text-amber-600']];
  const bars=[[75,'bg-brand-600'],[42,'bg-brand-300'],[100,'bg-brand-600'],[30,'bg-brand-300'],[62,'bg-brand-500']];
  const projects=[['Feeding Program',82,'bg-brand-600'],['Medical Mission',58,'bg-brand-400'],['Clean-up Drive',100,'bg-emerald-500'],['Livelihood Training',36,'bg-amber-500']];
  return shell('Reports and Summary','A barangay-wide snapshot of residents and assistance.',`<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  ${stats.map(([n,l,i,t])=>`<div class="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
    <div class="flex items-center justify-between gap-3">
      <p class="text-sm font-medium text-slate-500">${l}</p>
      <span class="grid h-9 w-9 place-items-center rounded-xl ${t}">${ico(i,'h-4 w-4')}</span>
    </div>
    <p class="mt-3 text-2xl font-semibold tracking-tight text-slate-900">${n}</p>
  </div>`).join('')}
</div>
<div class="mt-4 grid gap-4 lg:grid-cols-5">
  <section class="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200 lg:col-span-3">
    <div class="flex flex-wrap items-start justify-between gap-2">
      <div>
        <h2 class="text-sm font-semibold text-slate-900">Assistance per Purok</h2>
        <p class="mt-0.5 text-xs text-slate-500">Share of residents assisted in each area.</p>
      </div>
      <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">2026</span>
    </div>
    <div class="mt-8 flex h-40 items-end gap-3 sm:gap-5">
      ${bars.map(([h,c],i)=>`<div class="relative flex h-full flex-1 items-end">
        <span class="absolute inset-x-0 -top-5 text-center text-[11px] font-semibold text-slate-500">${h}%</span>
        <div class="w-full origin-bottom animate-grow-y rounded-t-lg ${c}" style="height:${h}%;animation-delay:${i*80}ms" title="Purok ${i+1}: ${h}%"></div>
      </div>`).join('')}
    </div>
    <div class="mt-3 flex gap-3 border-t border-slate-100 pt-3 sm:gap-5">
      ${bars.map((_,i)=>`<span class="flex-1 text-center text-[11px] text-slate-500">Purok ${i+1}</span>`).join('')}
    </div>
  </section>
  <section class="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200 lg:col-span-2">
    <h2 class="text-sm font-semibold text-slate-900">Projects and Activities</h2>
    <p class="mt-0.5 text-xs text-slate-500">Ongoing barangay programs.</p>
    <div class="mt-5 space-y-4">
      ${projects.map(([name,p,c])=>`<div>
        <div class="flex items-center justify-between gap-3 text-sm"><span class="font-medium text-slate-700">${name}</span><span class="text-xs text-slate-400">${p}%</span></div>
        <div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div class="h-full origin-left animate-grow-x rounded-full ${c}" style="width:${p}%"></div></div>
      </div>`).join('')}
    </div>
  </section>
</div>
<div class="mt-4 flex justify-end gap-2 print:hidden">
  <button type="button" class="${btnGhost}" onclick="window.print()">${ico(I.printer,'h-4 w-4')}Print</button>
  <button type="button" class="${btnPrimary}" onclick="flash('Export started.')">${ico(I.download,'h-4 w-4')}Export</button>
</div>`);
}

draw();
