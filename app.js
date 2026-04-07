const steps = document.querySelectorAll('.step');
const nextBtns = document.querySelectorAll('.next');
const prevBtns = document.querySelectorAll('.prev');
 const form = document.getElementById('form');

 const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const imageInput = document.getElementById('image');

const previewImg = document.getElementById('p_img');
const expDiv = document.getElementById('experience');
const addExp = document.getElementById('addExp');

const finalData = document.getElementById('finalData');
const sidebar = document.getElementById('sidebar');

const toastBox = document.getElementById('toast');

let current = 0;
 let editIndex = -1;

/* 🔥 SAFE LOCALSTORAGE FIX */
let allData;
try {
  allData = JSON.parse(localStorage.getItem("formData"));
  if (!Array.isArray(allData)) allData = [];
} catch {
  allData = [];
}

/* STEP */
function showStep(i){
  steps.forEach((s,idx)=>s.classList.toggle('active', idx===i));}

/* NAV */
nextBtns.forEach(btn=>{
  btn.onclick = ()=>{
    if(validate()) {
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
  if(current === 0 && (!nameInput.value || !emailInput.value)){
    toast("Fill all fields");
    return false;
  }
  if(current === 1){
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;
    if(pass !== confirm){
      toast("Password mismatch");
      return false;
    }
  }

  return true;
}

/* TOAST */
function toast(msg){
  toastBox.innerText = msg;
  toastBox.style.display = 'block';
  setTimeout(()=>toastBox.style.display='none',2000);
}

/* PREVIEW */
function updatePreview(){
  document.getElementById('p_name').innerText = nameInput.value || '-';
  document.getElementById('p_email').innerText = emailInput.value || '-';

  let skills = [...document.querySelectorAll('input[type=checkbox]:checked')]
    .map(cb=>cb.value);

  document.getElementById('p_skills').innerText = skills.join(', ') || '-';

  let exp = [...expDiv.querySelectorAll('input')]
    .map(e=>e.value);

  document.getElementById('p_exp').innerText = exp.join(', ') || '-';
}

document.querySelectorAll('input').forEach(i=>{
  i.addEventListener('input', updatePreview);
});

/* IMAGE */
imageInput.onchange = ()=>{
  const file = imageInput.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = e=>{
      previewImg.src = e.target.result;
      previewImg.style.display = 'block';
    }
    reader.readAsDataURL(file);
  }
};

/* EXPERIENCE */


addExp.onclick = ()=>{
  const div = document.createElement('div');

  const input = document.createElement('input');


  const del = document.createElement('button');
  del.innerText = 'x';
  del.className = 'del-btn';

  del.onclick = ()=>{
    div.remove();
    updatePreview();
  };

  div.append(input, del);
  expDiv.appendChild(div);

  input.oninput = updatePreview;
};

/* SIDEBAR */
document.getElementById('showSidebar').onclick = ()=>{
  sidebar.classList.add('active');
};

function closeSidebar(){
  sidebar.classList.remove('active');
}

/* SAVE */
function save(){
  localStorage.setItem("formData", JSON.stringify(allData));
}

/* RENDER */
function renderData(){
  finalData.innerHTML = '';

  allData.forEach((d,i)=>{
    const card = document.createElement('div');
    card.className = 'data-card';

    card.innerHTML = `
      ${d.img ? `<img src="${d.img}" width="60">` : ''}
      <p>${d.name}</p>
      <p>${d.email}</p>
      <p>${d.skills}</p>
      <p>${d.exp}</p>
      <button onclick="editData(${i})">Edit</button>
      <button onclick="deleteData(${i})">Delete</button>
    `;

    finalData.appendChild(card);
  });

  save();
}

/* DELETE */
function deleteData(i){
  allData.splice(i,1);
  renderData();
}

/* EDIT */
function editData(i){
  const d = allData[i];
  editIndex = i;

  nameInput.value = d.name;
  emailInput.value = d.email;

  previewImg.src = d.img;
  previewImg.style.display = d.img ? 'block' : 'none';

  expDiv.innerHTML = '';
  d.exp.split(',').forEach(val=>{
    const div = document.createElement('div');
    const input = document.createElement('input');
    input.value = val;

    const del = document.createElement('button');
    del.innerText = 'x';
    del.className = 'del-btn';

    del.onclick = ()=>{
      div.remove();
      updatePreview();
    };

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


  form.reset();
  expDiv.innerHTML = '';
  previewImg.style.display = 'none';
  previewImg.src = '';

  updatePreview();
showStep(0);
};


renderData();
showStep(0);
updatePreview();