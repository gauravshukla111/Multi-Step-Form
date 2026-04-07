const steps = document.querySelectorAll('.step');
 const nextBtns = document.querySelectorAll('.next');
const prevBtns = document.querySelectorAll('.prev');
const progress = document.getElementById('progress');
const form = document.getElementById('form');

const toastBox = document.getElementById('toast');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const imageInput = document.getElementById('image');

const previewImg = document.getElementById('p_img');

const finalData = document.getElementById('finalData');
const sidebar = document.getElementById('sidebar');

let current = 0;
let allData = [];

/* STEP CONTROL */
function showStep(i){
  steps.forEach((s,idx)=>s.classList.toggle('active', idx===i));
  progress.style.width = (i/(steps.length-1))*100 + '%';
}

/* NAV */
nextBtns.forEach(btn=>{
  btn.onclick = ()=>{
    if(validate()){
      current++;
      showStep(current);
    }
  }
});

prevBtns.forEach(btn=>{
  btn.onclick = ()=>{
    current--;
    showStep(current);
  }
});

/* VALIDATION */
 function validate(){
  const pass = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;

  if(current === 0 && (!nameInput.value || !emailInput.value)){
    toast('Fill all fields');
    return false;
  }

  if(current === 1 && pass !== confirm){
    toast('Password mismatch');
    return false;
  }

  return true;
}

/* TOAST */
function toast(msg){
  toastBox.innerText = msg;
  toastBox.style.display = 'block';
  setTimeout(()=>toastBox.style.display='none',2000);
}

/* LIVE PREVIEW */
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

/* IMAGE PREVIEW */
imageInput.addEventListener('change', function(){
  const file = this.files[0];

  if(file){
    const reader = new FileReader();
    reader.onload = function(e){
      previewImg.src = e.target.result;
      previewImg.style.display = 'block';
    }
    reader.readAsDataURL(file);
  }
});

/* EXPERIENCE */
const addExp = document.getElementById('addExp');
const expDiv = document.getElementById('experience');

addExp.onclick = ()=>{
  const div = document.createElement('div');

  const input = document.createElement('input');
  input.placeholder = 'Experience';

  const del = document.createElement('button');
  del.innerText = 'x';
  del.classList.add('del-btn');

  del.onclick = ()=> div.remove();

  div.append(input, del);
  expDiv.appendChild(div);

  input.addEventListener('input', updatePreview);
};

/* SIDEBAR */
document.getElementById('showSidebar').onclick = ()=>{
  sidebar.classList.add('active');
};

function closeSidebar(){
  sidebar.classList.remove('active');
}

/* RENDER DATA */
function renderData(){
  finalData.innerHTML = '';

  allData.forEach((d, index)=>{
    const card = document.createElement('div');
    card.classList.add('data-card');

    card.innerHTML = `
      <img src="${d.img}" width="60">
      <p><b>${d.name}</b></p>
      <p>${d.email}</p>
      <p>${d.skills}</p>
      <p>${d.exp}</p>
      <button onclick="deleteData(${index})">Delete</button>
    `;

    finalData.appendChild(card);
  });
}

/* DELETE */
function deleteData(index){
  allData.splice(index,1);
  renderData();
}

/* SUBMIT */
form.onsubmit = (e)=>{
  e.preventDefault();

  const data = {
    name: nameInput.value,
    email: emailInput.value,
    skills: document.getElementById('p_skills').innerText,
    exp: document.getElementById('p_exp').innerText,
    img: previewImg.src || ''
  };

  allData.push(data);
  renderData();

  toast('Saved ✅');

  form.reset();
  expDiv.innerHTML = '';
  previewImg.style.display = 'none';
  previewImg.src = '';

  updatePreview();

  current = 0;
  showStep(0);
};

showStep(current);
updatePreview();