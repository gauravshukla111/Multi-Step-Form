const steps = document.querySelectorAll('.step');
const circles = document.querySelectorAll('.circle');
const nextBtns = document.querySelectorAll('.next');
const prevBtns = document.querySelectorAll('.prev');
const progress = document.getElementById('progress');
const form = document.getElementById('form');

let current = 0;


function showStep(i){
  steps.forEach((s,idx)=>s.classList.toggle('active',idx===i));
  circles.forEach((c,idx)=>c.classList.toggle('active',idx<=i));
  progress.style.width = (i/(steps.length-1))*100 + '%';
}


nextBtns.forEach(btn=>{
  btn.onclick=()=>{
    if(validate()){
      current++;
      showStep(current);
    }
  }
});

prevBtns.forEach(btn=>{
  btn.onclick=()=>{
    current--;
    showStep(current);
  }
});

/* VALIDATION */

function validate(){
  const pass = password.value;
  const confirm = confirmPass.value;

  if(current===1 && pass !== confirm){
    toast('Password mismatch');
    return false;
  }
return true;
}

/* TOAST */
function toast(msg){
  const t=document.getElementById('toast');
  t.innerText=msg;
  t.style.display='block';
  setTimeout(()=>t.style.display='none',2000);
}

/* LIVE PREVIEW */

function updatePreview(){
  p_name.innerText = name.value || '-';
  p_email.innerText = email.value || '-';

  let skills=[...document.querySelectorAll('.tags span')].map(s=>s.innerText);
  p_skills.innerText = skills.join(', ') || '-';

  let exp=[...document.querySelectorAll('#experience input')].map(e=>e.value);
  p_exp.innerText = exp.join(', ') || '-';
}
document.querySelectorAll('input').forEach(i=>i.oninput=updatePreview);

/* SKILLS TAG */
skillInput.addEventListener('keypress',e=>{
  if(e.key==='Enter'){
    e.preventDefault();
    let span=document.createElement('span');
    span.innerText=skillInput.value;
    skillsList.appendChild(span);
    skillInput.value='';
    updatePreview();
  }
});

/* EXPERIENCE */
addExp.onclick=()=>{
  let div=document.createElement('div');
  let input=document.createElement('input');
  let del=document.createElement('button');

  del.innerText='x';
  del.onclick=()=>div.remove();

  div.append(input,del);
  experience.appendChild(div);

  input.oninput=updatePreview;
};

/* SIDEBAR */
showSidebar.onclick=()=>sidebar.classList.add('active');
function closeSidebar(){sidebar.classList.remove('active')}

/* SUBMIT */
form.onsubmit=e=>{
  e.preventDefault();
  
  finalData.innerHTML = `
    <p>${name.value}</p>
    <p>${email.value}</p>
    <p>${p_skills.innerText}</p>
    <p>${p_exp.innerText}</p>
  `;

  toast('Submitted ✅');

  form.reset();
  skillsList.innerHTML='';
  experience.innerHTML='';
  updatePreview();
  current=0;
  showStep(0);
};

showStep(current);
updatePreview();