const puroks=['Purok 1','Purok 2','Purok 3','Purok 4','Purok 5'];
const pat=[['Yes','Given'],['No','Pending'],['Yes','Pending'],['No','Given'],['No','Pending']];
let v='login',page=1,showPw=false,err='',toast='';

const names=['Santos, Maria Cruz','Reyes, Juan Dela Pena','Garcia, Ana Lopez','Bautista, Pedro Ramos','Mendoza, Rosa Flores','Villanueva, Jose Aquino','Castillo, Liza Navarro','Torres, Miguel Santiago','Dizon, Carmen Pascual','Ramos, Antonio Cruz','Fernandez, Grace Morales','Lopez, Ricardo Tan','Aquino, Nena Gutierrez','Domingo, Roberto Salazar','Perez, Joy Valdez'];
const ages=[34,51,29,63,45,38,57,42,60,26,49,36,58,31,47];
const jobs=['Farmer','Fisherman','Public school teacher','Sari-sari store owner','Tricycle driver','Carpenter','Nurse','Tailor','Electrician','Senior high student','Baker','Auto mechanic','Barangay health worker','Security guard','Cook'];

const field='block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-pine-700 focus:outline-none focus:ring-2 focus:ring-pine-700/10';
const labelCls='mb-1.5 block text-sm font-medium text-slate-700';
const btn='inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-700 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40';
const btnPrimary=`${btn} bg-pine-700 text-white hover:bg-pine-800`;
const btnGhost=`${btn} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`;

const navItems=[['records','Residents'],['survey','Survey Form'],['assistance','Assistance'],['reports','Reports']];
const navBtn=(k,l,full=false)=>`<button type="button" onclick="go('${k}')" ${v===k?'aria-current="page"':''} class="${full?'lg:w-full ':''}shrink-0 rounded-lg px-3 py-2 text-left text-sm transition-colors ${v===k?'bg-pine-50 font-medium text-pine-800':'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}">${l}</button>`;
const logoutBtn=full=>`<button type="button" onclick="go('login')" class="${full?'lg:w-full ':''}shrink-0 rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-900 lg:mt-auto">Logout</button>`;

function shell(title,subtitle,body,actions=''){
  return `<div class="min-h-screen bg-cream print:bg-white">
  <aside class="flex flex-col border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r print:hidden">
    <div class="flex items-center gap-3 px-5 py-5">
      <div class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-pine-700 text-[11px] font-semibold text-white">BM</div>
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-slate-900">Barangay Migcanaway</p>
        <p class="truncate text-xs text-slate-500">Survey &amp; Assistance</p>
      </div>
    </div>
    <nav class="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:gap-0.5 lg:pb-3 lg:pt-1" aria-label="Main navigation">
      ${navItems.map(([k,l])=>navBtn(k,l,true)).join('')}
      ${logoutBtn(true)}
    </nav>
  </aside>
  <div class="lg:pl-64 print:pl-0">
    <main class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12 print:max-w-none print:p-0">
      <div class="animate-fade-up">
        <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 class="text-2xl font-semibold tracking-tight text-slate-900">${title}</h1>
            <p class="mt-1 text-sm text-slate-500">${subtitle}</p>
          </div>
          ${actions?`<div class="flex items-center gap-2 print:hidden">${actions}</div>`:''}
        </div>
        ${body}
      </div>
    </main>
  </div>
</div>`;
}

function draw(){
  const views={login,survey,records:recs,assistance:recs,reports};
  document.getElementById('app').innerHTML=views[v]()+(toast?`<div class="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"><div role="status" aria-live="polite" class="animate-fade-up rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">${toast}</div></div>`:'');
}
function go(k){v=k;page=1;err='';if(k==='login')showPw=false;draw()}
function flash(m){toast=m;draw();setTimeout(()=>{toast='';draw()},1800)}

function login(){
  return `<div class="min-h-screen bg-cream lg:grid lg:grid-cols-2">
  <div class="relative hidden overflow-hidden bg-pine-900 bg-cover bg-center lg:block" style="background-image:url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&amp;fit=crop&amp;w=1600&amp;q=80')">
    <div class="absolute inset-0 bg-gradient-to-t from-pine-900 via-pine-900/60 to-pine-900/25"></div>
    <div class="relative flex h-full flex-col justify-between p-10 xl:p-14">
      <div class="flex items-center gap-3 text-white">
        <div class="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-[11px] font-semibold ring-1 ring-inset ring-white/20">BM</div>
        <span class="text-sm font-medium">Barangay Migcanaway</span>
      </div>
      <div class="max-w-md">
        <p class="text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">Resident survey &amp; assistance</p>
        <p class="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white xl:text-4xl">Serving the community, one resident at a time.</p>
        <p class="mt-4 max-w-sm text-sm leading-6 text-white/70">A simple workspace for resident records, assistance, and barangay reports.</p>
      </div>
      <p class="text-xs text-white/50">Barangay office · Migcanaway</p>
    </div>
  </div>
  <div class="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8 lg:min-h-0">
    <div class="w-full max-w-sm animate-fade-up">
      <div class="mb-10 flex items-center gap-3 lg:hidden">
        <div class="grid h-9 w-9 place-items-center rounded-xl bg-pine-700 text-[11px] font-semibold text-white">BM</div>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-slate-900">Barangay Migcanaway</p>
          <p class="truncate text-xs text-slate-500">Survey &amp; Assistance</p>
        </div>
      </div>
      <p class="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">Barangay staff portal</p>
      <h1 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
      <p class="mt-1.5 text-sm text-slate-500">Sign in to manage resident records and assistance.</p>
      <form class="mt-8 space-y-5" onsubmit="event.preventDefault();doLogin()">
        <div>
          <label class="${labelCls}" for="u">Username</label>
          <input id="u" class="${field}" placeholder="Enter username" autocomplete="username" autofocus>
        </div>
        <div>
          <label class="${labelCls}" for="p">Password</label>
          <div class="relative">
            <input id="p" type="${showPw?'text':'password'}" class="${field} pr-16" placeholder="Enter password" autocomplete="current-password">
            <button type="button" onclick="pw()" class="absolute inset-y-0 right-0 rounded-r-lg px-3.5 text-xs font-medium text-slate-500 transition hover:text-pine-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pine-700">${showPw?'Hide':'Show'}</button>
          </div>
        </div>
        ${err?`<p role="alert" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">${err}</p>`:''}
        <button type="submit" class="${btnPrimary} w-full">Login</button>
      </form>
      <p class="mt-8 text-center text-xs text-slate-400">Authorized barangay staff only</p>
    </div>
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
  return shell('Resident Survey Form','Add a resident and record the assistance they need.',`<form class="overflow-hidden rounded-xl border border-slate-200 bg-white" onsubmit="event.preventDefault();flash('Resident saved')">
  <div class="space-y-8 p-5 sm:p-7">
    <section>
      <h2 class="text-sm font-semibold text-slate-900">Personal information</h2>
      <p class="mt-0.5 text-xs text-slate-500">Basic details for the resident record.</p>
      <div class="mt-5 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
        <div class="sm:col-span-4"><label class="${labelCls}" for="fullname">Full name</label><input id="fullname" class="${field}" placeholder="Last, First, Middle"></div>
        <div class="sm:col-span-1"><label class="${labelCls}" for="age">Age</label><input id="age" type="number" min="0" max="120" class="${field}" placeholder="00"></div>
        <div class="sm:col-span-1"><label class="${labelCls}" for="sex">Sex</label>${so(['Male','Female']).replace('<select','<select id="sex"')}</div>
        <div class="sm:col-span-3"><label class="${labelCls}" for="work">Work / occupation</label><input id="work" class="${field}" placeholder="e.g. Farmer"></div>
        <div class="sm:col-span-3"><label class="${labelCls}" for="purok">Purok / address</label>${so(puroks).replace('<select','<select id="purok"')}</div>
      </div>
    </section>
    <section class="border-t border-slate-100 pt-8">
      <h2 class="text-sm font-semibold text-slate-900">Assistance details</h2>
      <p class="mt-0.5 text-xs text-slate-500">Needs and notes for this resident.</p>
      <div class="mt-5 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
        <div class="sm:col-span-3">
          <span class="${labelCls}">PWD status</span>
          <div class="flex gap-6 pt-2">
            <label class="flex cursor-pointer items-center gap-2 text-sm text-slate-600"><input type="radio" name="pwd" value="Yes" class="h-4 w-4 accent-pine-700">Yes</label>
            <label class="flex cursor-pointer items-center gap-2 text-sm text-slate-600"><input type="radio" name="pwd" value="No" class="h-4 w-4 accent-pine-700">No</label>
          </div>
        </div>
        <div class="sm:col-span-3"><label class="${labelCls}" for="need">Assistance needed</label>${so(['Food Pack','Medical','Cash Aid','Livelihood']).replace('<select','<select id="need"')}</div>
        <div class="sm:col-span-6"><label class="${labelCls}" for="remarks">Remarks</label><textarea id="remarks" class="${field} min-h-[6rem] resize-y" placeholder="Type notes here..."></textarea></div>
      </div>
    </section>
  </div>
  <div class="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:px-7">
    <button type="reset" class="${btnGhost}">Clear</button>
    <button type="submit" class="${btnPrimary}">Save resident</button>
  </div>
</form>`);
}

function recs(){
  const isAid=v==='assistance';
  const rows=Array.from({length:5},(_,i)=>{
    const n=(page-1)*5+i;
    return {name:names[n],age:ages[n],job:jobs[n],pwd:pat[(i+(page-1)*2)%5][0],aid:pat[(i+(page-1)*2)%5][1]};
  });
  const pg=n=>`<button type="button" onclick="page=${n};draw()" ${page===n?'aria-current="page"':''} class="grid h-8 min-w-[2rem] place-items-center rounded-md border px-2 text-xs font-medium transition ${page===n?'border-pine-700 bg-pine-700 text-white':'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}">${n}</button>`;
  const arrow=(target,disabled,symbol,label)=>`<button type="button" ${disabled?'disabled':''} onclick="page=${target};draw()" aria-label="${label}" class="grid h-8 w-8 place-items-center rounded-md border border-slate-300 bg-white text-slate-500 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40">${symbol}</button>`;
  const status=aid=>`<span class="inline-flex items-center gap-1.5 text-sm ${aid==='Given'?'text-emerald-700':'text-amber-700'}"><span class="h-1.5 w-1.5 rounded-full ${aid==='Given'?'bg-emerald-500':'bg-amber-500'}"></span>${aid}</span>`;
  const actions=isAid?'':`<button type="button" class="${btnPrimary}" onclick="go('survey')">Add resident</button>`;
  return shell(isAid?'Assistance':'Resident Records',isAid?'Track who has received assistance and who is still pending.':'Search, review, and update resident profiles.',`<div class="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <input class="${field} sm:max-w-xs" placeholder="Search name..." aria-label="Search residents">
    <select class="${field} sm:w-48" aria-label="Filter residents"><option>All residents</option><option>PWD residents</option><option>Pending assistance</option></select>
  </div>
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[680px] text-left text-sm">
        <thead class="bg-slate-50 text-xs font-medium text-slate-500">
          <tr>
            <th class="px-5 py-3 font-medium">Name</th>
            <th class="px-3 py-3 font-medium">Age</th>
            <th class="px-3 py-3 font-medium">Work</th>
            <th class="px-3 py-3 font-medium">PWD</th>
            <th class="px-3 py-3 font-medium">Assistance</th>
            <th class="px-5 py-3 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${rows.map(r=>`<tr class="transition-colors hover:bg-slate-50/70">
            <td class="whitespace-nowrap px-5 py-3.5 font-medium text-slate-900">${r.name}</td>
            <td class="px-3 py-3.5 text-slate-500">${r.age}</td>
            <td class="px-3 py-3.5 text-slate-500">${r.job}</td>
            <td class="px-3 py-3.5 text-slate-600">${r.pwd}</td>
            <td class="px-3 py-3.5">${status(r.aid)}</td>
            <td class="px-5 py-3.5 text-right"><button type="button" onclick="go('survey')" class="text-sm font-medium text-pine-700 transition hover:text-pine-800">Edit</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="flex flex-col gap-3 border-t border-slate-200 p-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <span>Showing <span class="font-medium text-slate-700">${(page-1)*5+1}–${page*5}</span> of 120 residents</span>
      <div class="flex items-center gap-1.5">${arrow(page-1,page===1,'‹','Previous page')}${pg(1)}${pg(2)}${pg(3)}${arrow(page+1,page===3,'›','Next page')}</div>
    </div>
  </div>`,actions);
}

function reports(){
  const stats=[['120','Total residents'],['18','PWD residents'],['64','Assisted'],['56','Pending']];
  const bars=[[75],[42],[100],[30],[62]];
  const projects=[['Feeding Program',82],['Medical Mission',58],['Clean-up Drive',100],['Livelihood Training',36]];
  return shell('Reports and Summary','A snapshot of residents and assistance across the barangay.',`<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    ${stats.map(([n,l])=>`<div class="rounded-xl border border-slate-200 bg-white p-5">
      <p class="text-sm text-slate-500">${l}</p>
      <p class="mt-2 text-2xl font-semibold tracking-tight text-slate-900">${n}</p>
    </div>`).join('')}
  </div>
  <div class="mt-3 grid gap-3 lg:grid-cols-5">
    <section class="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-3">
      <h2 class="text-sm font-medium text-slate-900">Assistance per Purok</h2>
      <p class="mt-0.5 text-xs text-slate-500">Residents assisted in each area.</p>
      <div class="mt-8 flex h-40 items-end gap-3 sm:gap-4">
        ${bars.map(([h],i)=>`<div class="relative flex h-full flex-1 items-end">
          <span class="absolute inset-x-0 -top-5 text-center text-[11px] font-medium text-slate-400">${h}%</span>
          <div class="w-full origin-bottom animate-grow-y rounded-t bg-pine-700" style="height:${h}%;animation-delay:${i*60}ms" title="Purok ${i+1}: ${h}%"></div>
        </div>`).join('')}
      </div>
      <div class="mt-3 flex gap-3 border-t border-slate-100 pt-3 sm:gap-4">
        ${bars.map((_,i)=>`<span class="flex-1 text-center text-[11px] text-slate-400">Purok ${i+1}</span>`).join('')}
      </div>
    </section>
    <section class="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
      <h2 class="text-sm font-medium text-slate-900">Projects and Activities</h2>
      <p class="mt-0.5 text-xs text-slate-500">Ongoing barangay programs.</p>
      <div class="mt-6 space-y-4">
        ${projects.map(([name,p],i)=>`<div>
          <div class="flex items-center justify-between gap-3 text-sm"><span class="text-slate-600">${name}</span><span class="text-xs text-slate-400">${p}%</span></div>
          <div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div class="h-full origin-left animate-grow-x rounded-full bg-pine-700" style="width:${p}%;animation-delay:${i*60}ms"></div></div>
        </div>`).join('')}
      </div>
    </section>
  </div>`,`<button type="button" class="${btnGhost}" onclick="window.print()">Print</button><button type="button" class="${btnPrimary}" onclick="flash('Export started')">Export</button>`);
}

draw();
