const steps = document.querySelectorAll('.step');
const nextBtns = document.querySelectorAll('.next');
const prevBtns = document.querySelectorAll('.prev');
const progress = document.getElementById('progress');
const form = document.getElementById('form');

let current = 0;

function showStep(i){
  steps.forEach((s,idx)=>{
    s.classList.toggle('active', idx===i);
  });
  progress.style.width = (i/(steps.length-1))*100 + '%';
}

nextBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    if(validate()){
      current++;
      showStep(current);
    }
  });
});

prevBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    current--;
    showStep(current);
  });
});


function validate(){
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;

  if(current===0 && (!name || !email)){
    alert('Fill all fields'); return false;
  }

  if(current===1 && pass !== confirm){
    alert('Passwords do not match'); return false;
  }

  return true;
}


const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');

function updatePreview(){
  document.getElementById('p_name').innerText = nameInput.value || '-';
  document.getElementById('p_email').innerText = emailInput.value || '-';

  let skills = [];
  document.querySelectorAll('input[type=checkbox]:checked')
    .forEach(cb=>skills.push(cb.value));

  document.getElementById('p_skills').innerText = skills.join(', ') || '-';

  let exp = [];
  document.querySelectorAll('#experience input')
    .forEach(e=>exp.push(e.value));

  document.getElementById('p_exp').innerText = exp.join(', ') || '-';
}

document.querySelectorAll('input').forEach(i=>{
  i.addEventListener('input', updatePreview);
});

const addExp = document.getElementById('addExp');
const expDiv = document.getElementById('experience');

addExp.addEventListener('click',()=>{
  const input = document.createElement('input');
  input.placeholder = 'Experience (e.g. 2 years React)';
  expDiv.appendChild(input);
  input.addEventListener('input', updatePreview);
});


const sidebar = document.getElementById('sidebar');
const finalData = document.getElementById('finalData');

form.addEventListener('submit',(e)=>{
  e.preventDefault();

  const data = {
    name:nameInput.value,
    email:emailInput.value,
    skills:document.getElementById('p_skills').innerText,
    exp:document.getElementById('p_exp').innerText
  };

  finalData.innerHTML = `
    <p><b>Name:</b> ${data.name}</p>
    <p><b>Email:</b> ${data.email}</p>
    <p><b>Skills:</b> ${data.skills}</p>
    <p><b>Experience:</b> ${data.exp}</p>
  `;

  alert('Form Submitted ✅');

 
  form.reset();
  expDiv.innerHTML = '';
  updatePreview();
  current = 0;
  showStep(current);
});

document.getElementById('showSidebar').onclick = ()=>{
  sidebar.classList.add('active');
}


function closeSidebar(){
  sidebar.classList.remove('active');
}

showStep(current);
updatePreview();