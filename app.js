const steps = document.querySelectorAll('.step');
const nextBtns = document.querySelectorAll('.next');
const prevBtns = document.querySelectorAll('.prev');
const progress = document.getElementById('progress');
let current = 0;

function showStep(i){
  steps.forEach((step,index)=>{
    step.classList.toggle('active', index===i);
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
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirm');

  if(current===0 && name.value==='') return alert('Enter name'),false;
  if(current===0 && email.value==='') return alert('Enter email'),false;

  if(current===1 && password.value!==confirm.value)
    return alert('Password mismatch'),false;

  return true;
}

// LIVE PREVIEW
const inputs = document.querySelectorAll('input');
inputs.forEach(input=>{
  input.addEventListener('input', updatePreview);
});

function updatePreview(){
  document.getElementById('p_name').innerText = name.value;
  document.getElementById('p_email').innerText = email.value;

  let skills = [];
  document.querySelectorAll('input[type=checkbox]:checked')
    .forEach(cb=>skills.push(cb.value));

  document.getElementById('p_skills').innerText = skills.join(', ');

  localStorage.setItem('formData', JSON.stringify({name:name.value,email:email.value,skills}));
}


const addExp = document.getElementById('addExp');
const expDiv = document.getElementById('experience');

addExp.addEventListener('click',()=>{
  const input = document.createElement('input');
  input.placeholder = 'Experience';
  expDiv.appendChild(input);
});

showStep(current);
