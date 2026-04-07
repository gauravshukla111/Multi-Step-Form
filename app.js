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

const expDiv = document.getElementById('experience');
const addExp = document.getElementById('addExp');

let current = 0;
let allData = JSON.parse(localStorage.getItem("formData")) || [];
let editIndex = -1;

/* STEP CONTROL */
function showStep(i){
  steps.forEach((s,idx)=>s.classList.toggle('active', idx===i));
  progress.style.width = (i/(steps.length-1))*100 + '%';
}

/* NAVIGATION */
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

/* VALIDATION (custom) */
function validate(){
  const pass = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;

  if(current === 0 && (!nameInput.value || !emailInput.value)){
    toast('Fill all fields properly');
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


addExp.onclick = ()=>{
  const div = document.createElement('div');

  const input = document.createElement('input');
  input.placeholder = 'Experience';

  const del = document.createElement('button');
  del.innerText = 'x';
  del.classList.add('del-btn');

  del.onclick = ()=>{
    div.remove();
    updatePreview(); // FIXED
  };

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

/* SAVE LOCAL */
function saveLocal(){
  localStorage.setItem("formData", JSON.stringify(allData));
}

/* RENDER DATA */
function renderData(){
  finalData.innerHTML = '';

  allData.forEach((d, index)=>{
    const card = document.createElement('div');
    card.classList.add('data-card');

    card.innerHTML = `
      ${d.img ? `<img src="${d.img}" width="60">` : ''}
      <p><b>${d.name}</b></p>
      <p>${d.email}</p>
      <p>${d.skills}</p>
      <p>${d.exp}</p>
      <button onclick="editData(${index})">Edit</button>
      <button onclick="deleteData(${index})">Delete</button>
    `;

    finalData.appendChild(card);
  });

  saveLocal();
}

/* DELETE */
function deleteData(index){
  allData.splice(index,1);
  renderData();
}

/* EDIT */
function editData(index){
  const d = allData[index];
  editIndex = index;

  nameInput.value = d.name;
  emailInput.value = d.email;

  previewImg.src = d.img;
  previewImg.style.display = 'block';

  expDiv.innerHTML = '';
  d.exp.split(',').forEach(e=>{
    const div = document.createElement('div');
    const input = document.createElement('input');
    input.value = e.trim();

    const del = document.createElement('button');
    del.innerText = 'x';
    del.classList.add('del-btn');
    del.onclick = ()=>{ div.remove(); updatePreview(); };

    div.append(input, del);
    expDiv.appendChild(div);
  });

  updatePreview();
  closeSidebar();
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

  if(editIndex === -1){
    allData.push(data);
  } else {
    allData[editIndex] = data;
    editIndex = -1;
  }

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

/* INIT */
renderData();
showStep(current);
updatePreview();