const puroks=['Purok 1','Purok 2','Purok 3','Purok 4','Purok 5'];
const url={login:'login',survey:'survey-form',records:'records',assistance:'assistance',reports:'reports'};
const pat=[['Yes','Given'],['No','Pending'],['Yes','Pending'],['No','Given'],['No','Pending']];
let v='login',page=1,showPw=false,err=false,toast='';
const names=['Santos, Maria Cruz','Reyes, Juan Dela Pena','Garcia, Ana Lopez','Bautista, Pedro Ramos','Mendoza, Rosa Flores','Villanueva, Jose Aquino','Castillo, Liza Navarro','Torres, Miguel Santiago','Dizon, Carmen Pascual','Ramos, Antonio Cruz','Fernandez, Grace Morales','Lopez, Ricardo Tan','Aquino, Nena Gutierrez','Domingo, Roberto Salazar','Perez, Joy Valdez'];
const bar=w=>`<div class="bar" style="width:${w}%"></div>`;
const chrome=()=>`<div class="chrome"><div class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div><div class="url">barangay-migcanaway-system / ${url[v]}</div></div>`;
function shell(title,body){const it=[['records','Residents'],['survey','Survey Form'],['assistance','Assistance'],['reports','Reports']];
return `<div class="top">Barangay Migcanaway Resident Survey and Assistance Tracking System</div><div class="layout"><div class="side">${it.map(([k,l])=>`<div class="${v===k?'on':''}" onclick="go('${k}')">${l}</div>`).join('')}<div onclick="go('login')">Logout</div></div><div class="main"><h2>${title}</h2>${body}</div></div>`}
function draw(){const f={login,survey,records:recs,assistance:recs,reports}[v];document.getElementById('app').innerHTML=chrome()+f()+(toast?`<div class="toast">${toast}</div>`:'')}
function go(k){v=k;page=1;err=false;draw()}
function flash(m){toast=m;draw();setTimeout(()=>{toast='';draw()},1500)}
function login(){return `<div class="login-bg"><div class="card"><div class="logo">LOGO</div><div class="l1">Barangay Migcanaway</div><div class="l2">Resident Survey and<br>Assistance Tracking System</div>
<div class="fld"><label class="lab">Username</label><input id="u" class="inp" placeholder="Enter username" style="margin-bottom:12px"><label class="lab">Password</label><div class="rel"><input id="p" type="${showPw?'text':'password'}" class="inp" placeholder="••••••••"><span class="show" onclick="pw()">${showPw?'Hide':'Show'}</span></div></div>
<button class="btn full" onclick="doLogin()">LOGIN</button><div class="note">Barangay staff access only</div></div></div>`}
function pw(){const u=document.getElementById('u').value,p=document.getElementById('p').value;showPw=!showPw;draw();document.getElementById('u').value=u;document.getElementById('p').value=p}
function doLogin(){go('records')}
function survey(){const so=a=>`<select class="inp"><option value="">Select</option>${a.map(x=>`<option>${x}</option>`).join('')}</select>`;
return shell('Resident Survey Form',`<form class="grid" onsubmit="event.preventDefault();flash('Resident saved.')">
<div class="s4"><label class="lab">Full Name</label><input class="inp" placeholder="Last, First, Middle"></div>
<div class="s1"><label class="lab">Age</label><input class="inp" placeholder="00"></div>
<div class="s1"><label class="lab">Sex</label>${so(['Male','Female'])}</div>
<div class="s3"><label class="lab">Work / Occupation</label><input class="inp" placeholder="e.g. Farmer"></div>
<div class="s3"><label class="lab">Purok / Address</label>${so(puroks)}</div>
<div class="s3"><label class="lab">PWD Status</label><div class="radios"><label><input type="radio" name="pwd"> Yes</label><label><input type="radio" name="pwd"> No</label></div></div>
<div class="s3"><label class="lab">Assistance Needed</label>${so(['Food Pack','Medical','Cash Aid','Livelihood'])}</div>
<div class="s6"><label class="lab">Remarks</label><textarea class="inp" placeholder="Type notes here..."></textarea></div>
<div class="actions"><button type="reset" class="btn o">CLEAR</button><button class="btn">SAVE</button></div></form>`)}
function recs(){const rows=Array.from({length:5},(_,i)=>{const n=(page-1)*5+i;return [...pat[(i+(page-1)*2)%5],names[n]]});
const pg=n=>`<button class="pg ${page===n?'on':''}" onclick="page=${n};draw()">${n}</button>`;
return shell(v==='assistance'?'Assistance':'Resident Records and Assistance',`<div class="tools"><input class="inp q" placeholder="Search name..."><button class="btn">Search</button><select class="inp f"><option>Filter: All</option><option>PWD</option><option>Pending</option></select></div>
<div class="scroll"><table><thead><tr><th>Name</th><th>Age</th><th>Work</th><th>PWD</th><th>Assistance</th><th>Action</th></tr></thead><tbody>${rows.map(r=>`<tr><td style="width:28%">${r[2]}</td><td style="width:8%">00</td><td style="width:20%;padding-right:12px">${bar(95)}</td><td>${r[0]}</td><td>${r[1]}</td><td><span class="edit" onclick="go('survey')">Edit</span></td></tr>`).join('')}</tbody></table></div>
<div class="pager"><span>Showing ${(page-1)*5+1}-${page*5} of 120 residents</span><div><button class="pg" onclick="page=Math.max(1,page-1);draw()">&lt;</button>${pg(1)}${pg(2)}${pg(3)}<button class="pg" onclick="page=Math.min(3,page+1);draw()">&gt;</button></div></div>
<button class="btn add" onclick="go('survey')">+ ADD RESIDENT</button>`)}
function reports(){const c=[['120','Total Residents'],['18','PWD Residents'],['64','Assisted'],['56','Pending']];
const b=[[75,'#3f5283'],[42,'#8a97c0'],[100,'#3f5283'],[30,'#8a97c0'],[62,'#5f6fa0']];
return shell('Reports and Summary',`<div class="stats">${c.map(([n,l])=>`<div class="stat"><b>${n}</b><span>${l}</span></div>`).join('')}</div>
<div class="panels"><div class="panel"><h3>Assistance per Purok</h3><div class="chart">${b.map(([h,cl])=>`<div style="height:${h}%;background:${cl}"></div>`).join('')}</div></div>
<div class="panel"><h3>Projects and Activities</h3>${[0,1,2,3].map(()=>`<div class="proj"><i></i>${bar(100)}</div>`).join('')}</div></div>
<div class="right noprint"><button class="btn o" onclick="window.print()">PRINT</button><button class="btn" onclick="flash('Export started.')">EXPORT</button></div>`)}
draw();
