

document.addEventListener('click',(e)=>{

    // click outside add hidden

    if(!document.getElementById('filterMed').contains(e.target) && !document.getElementById('dropMed').contains(e.target)){
        document.getElementById('dropMed').classList.add('hidden');
        document.getElementById('filMedArrow').classList.remove('rotate-180');
    }

    if(!document.getElementById('filterEquip').contains(e.target) && !document.getElementById('sortEquip').contains(e.target)){
        document.getElementById('sortEquip').classList.add('hidden');
    }

    if(!document.getElementById('addMedicine').contains(e.target) && !document.getElementById('addMedForm').contains(e.target)){
        document.getElementById('addMedForm').classList.add('hidden');
    }

    if(!document.getElementById('addEquipment').contains(e.target) && !document.getElementById('addEquipForm').contains(e.target)){
        document.getElementById('addEquipForm').classList.add('hidden');
    }

    if(!document.getElementById('editMedForm').contains(e.target)){
        document.getElementById('editMedForm').classList.add('hidden');
    }



    //this is for confirm delete medicine hide it click outside the parent
    if (medId && !document.getElementById(medId).contains(e.target)) {
        document.getElementById(medId).classList.add('hidden');
        medId = "";
    }

})

document.getElementById('logout').addEventListener('click', async(e)=>{
    document.getElementById('logoutBox').classList.remove('hidden');
});
document.getElementById('conLog').addEventListener('click', async()=>{
    //save first activity log
    const ss = await fetch('http://localhost:5000/activity-log', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "logout", activity: "User logged out" }),
        credentials: "include"
    });

    const result = await ss.json();
    if (!ss.ok) return alert("Error logging activity: " + result.error);

    //success then logout
    const res =  await fetch('http://localhost:5000/logout',{
        method: "POST"
    });
    const dd = await res.json()
    if(dd.ok){
        // alert('logout');
        window.location.href = "/login";
    }
    if(!dd.ok) alert("Failed to logout!")
})

async function checkSession() {
  const resp = await fetch('http://localhost:5000/me', { credentials: "include" });
  const data = await resp.json();
  
  if (!data.loggedIn && window.location.pathname === "/inventory") {
    window.location.href = "/login";
    // alert("You need to login "+ window.location.pathname)
  }
}
checkSession()

async function user() {
    const res = await fetch('http://localhost:5000/user/account-info', {credentials: "include"});
    const data = await res.json()

    if(data.ok){
        // alert("if: "+data.user.email+data.user.username);
        document.querySelectorAll('.picon').forEach((icon) => {
            icon.textContent = data.user.username.charAt(0).toUpperCase();
        })
        
        document.querySelectorAll('.pname').forEach((uname) =>{
            uname.textContent = data.user.username;
        })
        document.querySelectorAll('.pemail').forEach((uemail) => {
            uemail.textContent = data.user.email;
        })

    }else{
        alert("else: "+data.message);
    }
}
user()


document.querySelectorAll('.navbtn').forEach(i=>{
    i.addEventListener('click',()=>{
        document.querySelectorAll('.navbtn').forEach(o=>o.classList.remove("bg-[rgba(255,255,255,0.3)]"));

        i.classList.add("bg-[rgba(255,255,255,0.3)]");
        
    })
})


function updateActiveLink() {
  // remove active from all links
  document.querySelectorAll('.navbtn').forEach(link => link.classList.remove("bg-[rgba(255,255,255,0.3)]"));

  // get current hash (e.g. #sec2)
  const currentHash = window.location.hash;

  // find link that matches current hash
  const activeA = document.querySelector(`a[href="${currentHash}"]`);
  if (activeA) {
    const navDiv = activeA.querySelector('.navbtn');
    if (navDiv) {
      navDiv.classList.add("bg-[rgba(255,255,255,0.3)]");
    }
  }
}
updateActiveLink();
window.addEventListener('hashchange', updateActiveLink);

window.addEventListener('load', () => {
  updateActiveLink();
  
  setTimeout(() => {
    const sec = document.querySelector(window.location.hash);
    if (sec) sec.scrollIntoView({ behavior: 'auto' }); // smooth scroll
  }, 100); // small delay so elements exist
});

document.getElementById('filterMed').addEventListener('click',()=>{
    const show = document.getElementById('dropMed').classList.toggle('hidden');

    document.getElementById('filMedArrow').classList.toggle('rotate-180',!show);
})

document.getElementById('filterEquip').addEventListener('click',()=>{
    const show = document.getElementById('sortEquip').classList.toggle('hidden');

    document.getElementById('filEquipArrow').classList.toggle('rotate-180',!show);
})

//medicine form
document.getElementById('addMedicine').addEventListener('click',()=>{
    const show = document.getElementById('addMedForm').classList.toggle('hidden');
    removeInput();
})

document.getElementById('dropImage').addEventListener('dragover',(e)=>{
    e.preventDefault();
    
    document.getElementById('dropImage').classList.remove('bg-[#f9fbffff]')
    document.getElementById('dropImage').classList.add('bg-[#f0f5ffff]')
    document.getElementById('dropImage').style.borderColor = " rgba(153, 177, 255, 1)";
})

document.getElementById('dropImage').addEventListener('dragleave',(e)=>{
    e.preventDefault();
    
    document.getElementById('dropImage').classList.remove('bg-[#f0f5ffff]')
    document.getElementById('dropImage').classList.add('bg-[#f9fbffff]')
    document.getElementById('dropImage').style.borderColor = " #c7c7c7ff"
})

document.getElementById('dropImage').addEventListener('click',()=>{
    image.click();
})

document.getElementById('image').addEventListener('change',(e)=>{
    e.preventDefault();

    // const img = e.target.files[0];
    // alert(`${img.name}`)
    // alert('hi')
    renderImg(e.target.files[0], "add")
});


document.getElementById('dropImage').addEventListener('drop',(e)=>{
    e.preventDefault();

    const img = e.dataTransfer.files[0];

    if (img && img.type.startsWith('image/')) {

        // FIX: Put the dropped file into #eimage input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(img);
        document.getElementById('image').files = dataTransfer.files;

        renderImg(img, "add");
    } else {
      alert('Please drop an image file.');
    }
});


document.getElementById('create_medform').addEventListener('click', async (e) => {
    e.preventDefault();

    if(!document.getElementById('med_name').value || !document.getElementById('med_dosage').value || !document.getElementById('med_quantity').value){
        return alert("Complete fill form!")
    }
  
    const resm = await fetch('http://localhost:5000/medicines', { credentials: 'include' });
    const medData = await resm.json();

    // check if exist already
    const duplicate = medData.meds.find(m =>
        m.name.toLowerCase() === med_name.value.toLowerCase() &&
        m.dosage.toLowerCase() === med_dosage.value.toLowerCase()
    );

    if (duplicate) {
        return alert(`Cannot add. Medicine "${med_name.value}" with dosage "${med_dosage.value}" already exists.`);
    }

  const formData = new FormData();

  formData.append('name', document.getElementById('med_name').value);
  formData.append('description', document.getElementById('med_description').value);
  formData.append('dosage', document.getElementById('med_dosage').value);
  formData.append('quantity', document.getElementById('med_quantity').value);

  // REAL IMAGE FILE
  const file = document.getElementById('image').files[0];
  if (file) formData.append('image', file);

    try {
        const response = await fetch('http://localhost:5000/medicines', {
            method: 'POST',
            body: formData
            // ❌ DO NOT add headers — FormData sets them automatically
        });

        const data = await response.json();
        if (data.success) {
            addMedForm.classList.add('hidden');

            await fetch('http://localhost:5000/activity-log', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "addM", activity: `Added medicine ${med_name.value} ${med_dosage.value}`}),
                credentials: "include"
            });

            location.reload();
        } else {
            alert('Failed to add medicine.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Server error occurred.');
    }
});





// equipment form
document.getElementById('addEquipment').addEventListener('click',()=>{
    const show = document.getElementById('addEquipForm').classList.toggle('hidden');
    removeInput();
})
document.getElementById('dropImageEquip').addEventListener('dragover',(e)=>{
    e.preventDefault();
    
    document.getElementById('dropImageEquip').classList.remove('bg-[#f9fbffff]')
    document.getElementById('dropImageEquip').classList.add('bg-[#f0f5ffff]')
    document.getElementById('dropImageEquip').style.borderColor = " rgba(153, 177, 255, 1)";
})

document.getElementById('dropImageEquip').addEventListener('dragleave',(e)=>{
    e.preventDefault();
    
    document.getElementById('dropImageEquip').classList.remove('bg-[#f0f5ffff]')
    document.getElementById('dropImageEquip').classList.add('bg-[#f9fbffff]')
    document.getElementById('dropImageEquip').style.borderColor = " #c7c7c7ff"
})

document.getElementById('dropImageEquip').addEventListener('click',()=>{
    imageEquip.click();
})

document.getElementById('imageEquip').addEventListener('change',(e)=>{
    e.preventDefault();

    // const img = e.target.files[0];
    // alert(`${img.name}`)
    // alert('hi')
    renderImg(e.target.files[0], "equipment")
});


document.getElementById('dropImageEquip').addEventListener('drop',(e)=>{
    e.preventDefault();

    const img = e.dataTransfer.files[0];

    if (img && img.type.startsWith('image/')) {
    //   alert(`     dropped: ${img.name}`);
      renderImg(img, "equipment");
    } else {
      alert('Please drop an image file.');
    }
});



// function renderImg(img){
//     // alert("hello")
//     if(!img){
//         alert('No images '+img);
//         removeImg('edit')
//         return;
//     }
//     const read = new FileReader();

//     read.addEventListener('load',()=>{
//         //medicine
//         document.getElementById('pImg').src = read.result;
//         document.getElementById('dropImage').classList.add('hidden');
//         document.getElementById('previewImage').classList.remove('hidden');

//         document.getElementById('epImg').src = read.result;
//         document.getElementById('edropImage').classList.add('hidden');
//         document.getElementById('epreviewImage').classList.remove('hidden');

//         //equip
//         document.getElementById('pImgEquip').src = read.result;
//         document.getElementById('dropImageEquip').classList.add('hidden');
//         document.getElementById('previewImageEquip').classList.remove('hidden');
//     })
//     read.readAsDataURL(img);
// }
function renderImg(img, type = "edit") {

    if (!img) {
        removeImg("edit");
        removeImg("add");
        return;
    }

    const read = new FileReader();

    read.onload = () => {

        if (type === "edit") {
            document.getElementById('epImg').src = read.result;
            document.getElementById('edropImage').classList.add('hidden');
            document.getElementById('epreviewImage').classList.remove('hidden');
        }

        if (type === "add") {
            document.getElementById('pImg').src = read.result;
            document.getElementById('dropImage').classList.add('hidden');
            document.getElementById('previewImage').classList.remove('hidden');
        }

        if (type === "equipment") {
            document.getElementById('pImgEquip').src = read.result;
            document.getElementById('dropImageEquip').classList.add('hidden');
            document.getElementById('previewImageEquip').classList.remove('hidden');
        }
    };

    read.readAsDataURL(img);
}


function removeInput(){
    //med
    document.getElementById('med_name').value = '';
    document.getElementById('med_description').value = '';
    document.getElementById('med_dosage').value = '';
    document.getElementById('med_quantity').value = '';

    document.getElementById('image').value = '';
    document.getElementById('dropImage').classList.remove('hidden');
    document.getElementById('previewImage').classList.add('hidden');

    document.getElementById('dropImage').classList.remove('bg-[#f0f5ffff]')
    document.getElementById('dropImage').classList.add('bg-[#f9fbffff]')
    document.getElementById('dropImage').style.borderColor = " #e7e5e4"

    //equipment
    document.getElementById('imageEquip').value = '';
    document.getElementById('dropImageEquip').classList.remove('hidden');
    document.getElementById('previewImageEquip').classList.add('hidden');

    document.getElementById('dropImageEquip').classList.remove('bg-[#f0f5ffff]')
    document.getElementById('dropImageEquip').classList.add('bg-[#f9fbffff]')
    document.getElementById('dropImageEquip').style.borderColor = " #e7e5e4"
}

function removeImg(formType){
    //med
    if (formType === "add") {
        // ADD form elements
        document.getElementById('image').value = '';
        document.getElementById('dropImage').classList.remove('hidden');
        document.getElementById('previewImage').classList.add('hidden');

        document.getElementById('dropImage').classList.remove('bg-[#f0f5ffff]');
        document.getElementById('dropImage').classList.add('bg-[#f9fbffff]');
        document.getElementById('dropImage').style.borderColor = "#e7e5e4";

    } else if (formType === "edit") {
        // EDIT form elements
        document.getElementById('eimage').value = '';
        document.getElementById('edropImage').classList.remove('hidden');
        document.getElementById('epreviewImage').classList.add('hidden');

        document.getElementById('edropImage').classList.remove('bg-[#f0f5ffff]');
        document.getElementById('edropImage').classList.add('bg-[#f9fbffff]');
        document.getElementById('edropImage').style.borderColor = "#e7e5e4";

        // Tell backend to delete existing image
        window.removeImageClicked = true;
        document.getElementById('existingImage').value = "";
    }

    //equipment
    if(formType === "addE"){
        document.getElementById('imageEquip').value = '';
        document.getElementById('dropImageEquip').classList.remove('hidden');
        document.getElementById('previewImageEquip').classList.add('hidden');

        document.getElementById('dropImageEquip').classList.remove('bg-[#f0f5ffff]')
        document.getElementById('dropImageEquip').classList.add('bg-[#f9fbffff]')
        document.getElementById('dropImageEquip').style.borderColor = " #e7e5e4"
    }
}



//  ex data
// let listmed = [
//     {
//         name: "Paracetamol",
//         description: "For pain and fever relief.",
//         dosage: "500mg",
//         quantity: 20,
//         image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
//     },
//     {
//         name: "Amoxicillin",
//         description: "Used to treat bacterial infections.",
//         dosage: "500mg",
//         quantity: 30,
//         image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
//     },
//     {
//         name: "Loratadine",
//         description: "For allergies like sneezing and runny nose.",
//         dosage: "10mg",
//         quantity: 10,
//         image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
//     },
//     {
//         name: "Metformin",
//         description: "Helps control blood sugar levels.",
//         dosage: "500mg",
//         quantity: 60,
//         image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
//     },
//     {
//         name: "Ibuprofen",
//         description: "For pain, swelling, or fever.",
//         dosage: "400mg",
//         quantity: 25,
//         image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
//     },
//     {
//         name: "Cetirizine",
//         description: "Relieves allergy symptoms.",
//         dosage: "10mg",
//         quantity: 15,
//         image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
//     },
//     {
//         name: "Omeprazole",
//         description: "Reduces stomach acid.",
//         dosage: "20mg",
//         quantity: 28,
//         image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
//     },
//     {
//         name: "Salbutamol",
//         description: "Helps open airways for easier breathing. Helps open airways for easier breathing. Helps open airways for easier breathing. Helps open airways for easier breathing. Helps open airways for easier breathing.",
//         dosage: "100 mg",
//         quantity: 1,
//         image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
//     },
//     {
//         name: "Cetirizine",
//         description: "Relieves allergy symptoms.",
//         dosage: "10mg",
//         quantity: 15,
//         image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
//     },
//     {
//         name: "Omeprazole",
//         description: "Reduces stomach acid.",
//         dosage: "20mg",
//         quantity: 28,
//         image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
//     },
//     {
//         name: "Salbutamol",
//         description: "Helps open airways for easier breathing. Helps open airways for easier breathing. Helps open airways for easier breathing. Helps open airways for easier breathing. Helps open airways for easier breathing.",
//         dosage: "100 mg",
//         quantity: 1,
//         image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBSyS7ErCSEdDIUsaWomF4UIKcnHsaPzFDLw&s"
//     }
// ];


// renderListMed();

async function renderListMed(i){
    // alert('kkkk')
    const res = await fetch('http://localhost:5000/medicines', {credentials: 'include'});
    const medData = await res.json();

    console.log(medData)

    if(medData.ok == false) return alert("error fetch!")
    console.log(medData.meds.length == 0)
    document.getElementById('medList').innerHTML = ``;

    if(medData.meds.length == 0){
        document.getElementById('medList').innerHTML += `
            <div class="h-full w-full flex justify-center">
                <div class="text-2xl font-[800] text-stone-400">No added medicines list yet!</div>
            </div>
        `;
    }
    if(i == 'box'){
        medData.meds.forEach((med,i) =>{
            document.getElementById('medList').innerHTML += `
                <div class="h-[350px] w-[350px] shadow-lg rounded-xl border border-stone-100 relative overflow-hidden">
                    <div>
                        <div class="h-[125px] w-[calc(100%-30px)] m-[15px] mb-0 bg-blue-100 overflow-hidden rounded-xl shadow-sm">
                            ${
                                med.image 
                                ? `<img src="http://localhost:5000/uploads/${med.image}" class="h-full w-full object-cover">`
                                : `<div class="h-full w-full flex items-center justify-center text-gray-400 text-xl font-[800]">No Image</div>`
                            }
                        </div>
                        <div class="px-[15px] h-[165px]">
                            <p class="text-[20px] pt-1 font-semibold text-[#333]">${med.name}</p>
                            <p class="py-1 h-[50px] line-clamp-2 leading-tight text-[#444] whitespace-normal break-words">${med.description}</p>
                            <div class="w-full flex flex-row justify-between">
                                <div class="w-[50%]">
                                    <p>Dosage</p>
                                    <p>${med.dosage}</p>
                                </div>
                                <div class="w-[50%]">
                                    <p>Quantity</p>
                                    <p>${med.quantity}</p>
                                </div>
                            <div>
                        </div>
                        <div class="w-full p-[15px] absolute bottom-0 left-0 flex flex-row justify-between border-t border-stone-200 text-white font-semibold text-sm">
                            <button class="w-[30%] bg-blue-500 py-2 rounded-xl hover:-translate-y-1 hover:bg-blue-400 shadow-sm" 
                              onclick="editMedicineForm(event,${med.id},'${med.name}','${med.description}','${med.dosage}','${med.quantity}','${med.image}')">Edit</button>
                            <button class="w-[30%] bg-green-500 py-2 rounded-xl hover:-translate-y-1 hover:bg-green-400 shadow-sm">Dispense</button>
                            <button class="w-[30%] bg-red-500 py-2 rounded-xl hover:-translate-y-1 hover:bg-red-400 shadow-sm" 
                                onclick="document.querySelectorAll('[id^=medDelBtn]').forEach(el => el.classList.add('hidden'));event.stopPropagation(); document.getElementById('medDelBtn${med.id}').classList.remove('hidden'); 
                                medId = 'medDelBtn${med.id}'">Delete</button>
                        </div>
                    </div>
                    <div id="medDelBtn${med.id}" class="absolute bg-[rgba(249,249,249,0.84)] py-10 h-full w-full top-0 left-0 hidden transition-all duration-500"
                       onclick="this.classList.add('hidden')">
                        <div class="flex flex-col items-center gap-0 h-full">
                            <svg class="size-[100px]" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="9" fill="rgba(255, 225, 176, 1)" stroke="orange" stroke-width="1.2"/>
                                <path d="M12 7.627v5.5" stroke="orange" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"/>
                                <path d="M12 16.373v-.5" stroke="orange" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"/>
                            </svg>
                            <p class="text-[24px] font-[700] text-center text-[#555] my-2">Delete This Item?</p>
                            <p class="px-6 text-center text-[#666] font-[500]">This action cannot be undone. Are you sure you want to remove it from the list?</p>
                            <div class="w-full flex justify-center gap-4 mt-5">
                                <button class="w-[40%] flex flex-row justify-center items-center gap-2 py-2 border-2 border-stone-400 bg-stone-100 rounded-xl font-[600] text-[#555] hover:bg-stone-200 hover:-translate-y-1">
                                    <svg class="size-5" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 16 16">
                                        <path fill="currentColor" d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326a.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275a.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018a.751.751 0 0 1-.018-1.042L6.94 8L3.72 4.78a.75.75 0 0 1 0-1.06Z"/>
                                    </svg>
                                    Cancel
                                </button>
                                <button onclick="confirmDelMed(event,${med.id})" class="w-[40%] flex flex-row justify-center items-center gap-2 py-2 rounded-xl font-[600] text-[#444] bg-red-500 text-white hover:bg-[rgba(224,0,0,1)] hover:-translate-y-1">
                                    <svg class="size-4" width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path fill="currentColor" d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16H281c13.8 0 26 8.8 30.4 21.9L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64s14.3-32 32-32h96zM32 144h384v304c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64zm88 64c-13.3 0-24 10.7-24 24v192c0 13.3 10.7 24 24 24s24-10.7 24-24V232c0-13.3-10.7-24-24-24m104 0c-13.3 0-24 10.7-24 24v192c0 13.3 10.7 24 24 24s24-10.7 24-24V232c0-13.3-10.7-24-24-24m104 0c-13.3 0-24 10.7-24 24v192c0 13.3 10.7 24 24 24s24-10.7 24-24V232c0-13.3-10.7-24-24-24"/>
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                    
                </div>
            `;
    
        });
    }

    if(i == 'line'){
        document.getElementById('medList').innerHTML +=  ` 
            <table class="w-full">
                <colgroup>
                    <col class="w-[20%]" />
                    <col class="w-[45%]" />
                    <col class="w-[10%]" />
                    <col class="w-[10%]" />
                    <col class="w-[15%]" />
                </colgroup>
                <thead>
                    <tr class="text-left">
                        <th class="pb-2 border-b-2 border-stone-300 ">Name</th> 
                        <th class="pb-2 border-b-2 border-stone-300 ">Description</th> 
                        <th class="pb-2 border-b-2 border-stone-300 ">Dosage</th> 
                        <th class="pb-2 border-b-2 border-stone-300 ">Quantity</th> 
                        <th class="pb-2 border-b-2 border-stone-300 ">Action</th>
                    </tr>
                </thead>
                <tbody id="mdl">
                    <tr>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        `;
        medData.meds.forEach((med,i) =>{

            document.getElementById('mdl').innerHTML += `
                <tr class="border-b border-stone-300 h-[50px] hover:bg-blue-100">
                    <td class="relative px-5">
                        <div class="flex items-center gap-3">
                            <div class="group">
                                <svg class="size-5" width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path fill="#000000" d="M64 32C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zm64 80a48 48 0 1 1 0 96a48 48 0 1 1 0-96m144 112c8.4 0 16.1 4.4 20.5 11.5l88 144c4.5 7.4 4.7 16.7.5 24.3S368.7 416 360 416H88c-8.9 0-17.2-5-21.3-12.9s-3.5-17.5 1.6-24.8l56-80c4.5-6.4 11.8-10.2 19.7-10.2s15.2 3.8 19.7 10.2l26.4 37.8l61.4-100.5c4.4-7.1 12.1-11.5 20.5-11.5z"/></svg>
                                <div class="hidden absolute left-12 top-[-30px] z-2 group-hover:block shadow-lg rounded-xl p-5 border border-stone-200 bg-white pointer-events-none">
                                    <img src="http://localhost:5000/uploads/${med.image}" class="max-h-[200px] w-auto object-contain">
                                </div>
                            </div>
                            <div class="group">
                                <p>${med.name}</p>

                                <span class="boxt absolute z-2 m-auto bg-[#181C14] text-white text-sm font-light rounded px-2 p-1 max-w-[90%] pointer-events-none">
                                    Name: ${med.name}
                                </span>
                            </div>
                        </div>
                    </td>
                    <td class="pr-5 relative">
                        <div class="group inline-block">
                            <p class="line-clamp-1">${med.description}</p>

                            <span class="boxt absolute z-2 m-auto bg-[#181C14] text-white text-sm font-light rounded px-2 p-1 max-w-[90%] pointer-events-none">
                                Description: ${med.description}
                            </span>
                        </div>
                    </td>
                    <td>${med.dosage}</td>
                    <td>${med.quantity} pcs</td>
                    <td>
                        <div class="flex flex-row items-center gap-5">
                            <button class="">
                                <svg class="size-7" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                                        <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"/>
                                        <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415zM16 5l3 3"/>
                                    </g>
                                </svg>
                            </button>
                            <button>
                                <svg class="size-7" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 16 16">
                                    <path fill="currentColor" d="M12.6 4H12c0-.2-.2-.6-.4-.8s-.5-.4-1.1-.4c-.2 0-.4 0-.6.1c-.1-.2-.2-.3-.3-.5c-.2-.2-.5-.4-1.1-.4c-.8 0-1.2.5-1.4 1c-.1 0-.3-.1-.5-.1c-.5 0-.8.2-1.1.4C5 3.9 5 4.7 5 4.8v.4c-.6 0-1.1.2-1.4.5C3 6.4 3 7.3 3 8.5v.7c0 1.4.7 2.1 1.4 2.8l.3.4C6 13.6 7.2 14 9.8 14c2.9 0 4.2-1.6 4.2-5.1V6.4c0-.7-.2-2.1-1.4-2.4zm-2.1-.2c.4 0 .5.4.5.6v.8c0 .3.2.5.4.5c.3 0 .5-.1.5-.4c0 0 0-.4.4-.3c.6.2.7 1.1.7 1.3v2.6c0 3.4-1.3 4.1-3.2 4.1c-2.4 0-3.3-.3-4.3-1.3l-.4-.4C4.4 10.6 4 10.2 4 9.2v-.6c0-1 0-1.8.3-2.1c.1-.2.4-.3.7-.3V7l-.3 1.2c0 .1 0 .1.1.1c.1.1.2 0 .2 0l1-1.2V5c0-.1 0-.6.2-.8c.1-.1.2-.2.4-.2c.3 0 .4.2.4.4v.4c0 .2.2.5.5.5S8 5 8 4.8V3.5c0-.1 0-.5.5-.5c.3 0 .5.2.5.5v1.2c0 .3.2.6.5.6s.5-.3.5-.5v-.5c0-.3.2-.5.5-.5z"/>
                                </svg>
                            </button>
                            <button>
                                <svg class="size-5" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 304 384">
                                    <path fill="currentColor" d="M21 341V85h256v256q0 18-12.5 30.5T235 384H64q-18 0-30.5-12.5T21 341zM299 21v43H0V21h75L96 0h107l21 21h75z"/>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        })
    }
    
    if(i == ''){
        alert('layout ??')
    }
}

let medId = ""; //dont remove this i use this as id elemt
async function confirmDelMed(e,id) {
    e.stopPropagation();

    const resm = await fetch('http://localhost:5000/medicines', {credentials: 'include'});
    const medData = await resm.json();

    const mfo = medData.meds.find(i => i.id == id)

    console.log(mfo)

    const ss = await fetch('http://localhost:5000/activity-log', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "deleteM", activity: `Deleted medicine item ${mfo.name} ${mfo.dosage}`}),
        credentials: "include"
    });

    const result = await ss.json();
    if (!ss.ok) return alert("Error logging activity: " + result.error);
    
    const response = await fetch(`http://localhost:5000/medicines/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    const data = await response.json();

    if (data.success) {
        // alert("Medicine deleted!");
        location.reload();
    } else {
        alert("Failed to delete.");
    }
}

async function editMedicineForm(e,id,name,description,dosage,quantity,image){
    e.stopPropagation()
    document.getElementById('editMedForm').classList.remove('hidden');
    
    document.getElementById('emed_name').value = name;
    document.getElementById('emed_description').value = description;
    document.getElementById('emed_dosage').value = dosage;
    document.getElementById('emed_quantity').value = quantity;
    
    if(image != 'null'){
        document.getElementById('epImg').src = `http://localhost:5000/uploads/${image}`;
        document.getElementById('edropImage').classList.add('hidden');
        document.getElementById('epreviewImage').classList.remove('hidden');
        
        document.getElementById('existingImage').value = image;  // ← save old image name
    }else{
        document.getElementById('existingImage').value = "";
        document.getElementById('edropImage').classList.remove('hidden');
        document.getElementById('epreviewImage').classList.add('hidden');
    }
    
    medId = id;
}

// document.getElementById('ecreate_medform').addEventListener('click', async (e) => {
//     e.preventDefault();

//     if (!emed_name.value.trim() || !emed_dosage.value.trim() || !emed_quantity.value) {
//         return alert('Fill all required fields');
//     }

//     const id = medId;

//     // Get current medicine data
//     const resm = await fetch('http://localhost:5000/medicines', { credentials: 'include' });
//     const medData = await resm.json();
//     const mfo = medData.meds.find(i => i.id == id);

//     // Build short activity log for name and quantity
//     let actChanges = [];

//     if (mfo.name !== emed_name.value) {
//         actChanges.push(`Name: "${mfo.name}" → "${emed_name.value}"`);
//     }

//     if (mfo.quantity !== Number(emed_quantity.value)) {
//         actChanges.push(`Qty: ${mfo.quantity} → ${emed_quantity.value}`);
//     }

//     const act = actChanges.length > 0 ? actChanges.join(", ") : "No changes";

//     // Prepare FormData
//     const formData = new FormData();
//     formData.append("name", emed_name.value);
//     formData.append("description", emed_description.value);
//     formData.append("dosage", emed_dosage.value);
//     formData.append("quantity", emed_quantity.value);

//     const file = document.getElementById('eimage').files[0];
//     const oldImage = document.getElementById('existingImage').value;

//     if (file) {
//         formData.append("image", file);
//     } else {
//         formData.append("existingImage", oldImage);
//     }

//     if (window.removeImageClicked === true) {
//         formData.append("removeImage", "true");
//     }

//     // Save activity log
//     await fetch('http://localhost:5000/activity-log', {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ type: "editM", activity: act }),
//         credentials: "include"
//     });

//     // Update medicine
//     const response = await fetch(`http://localhost:5000/medicines/${id}`, {
//         method: "PUT",
//         body: formData
//     });

//     const data = await response.json();
//     if (data.success) location.reload();
// });

document.getElementById('ecreate_medform').addEventListener('click', async(e) => {
    e.preventDefault();

    if (!emed_name.value.trim() || !emed_dosage.value.trim() || !emed_quantity.value) {
        return alert('Fill all required fields');
    }

    const id = medId;

    // Fetch current data
    const resm = await fetch('http://localhost:5000/medicines', { credentials: 'include' });
    const medData = await resm.json();
    const mfo = medData.meds.find(i => i.id == id);

    // ❗ DUPLICATE CHECK (name + dosage)
    const duplicate = medData.meds.find(m =>
        m.id != id &&
        m.name.toLowerCase() === emed_name.value.toLowerCase() &&
        m.dosage.toLowerCase() === emed_dosage.value.toLowerCase()
    );

    if (duplicate) {
        return alert(`Cannot save. Medicine "${emed_name.value}" with dosage "${emed_dosage.value}" already exists.`);
    }

    let actChanges = [];

    if (mfo.name !== emed_name.value) {
        actChanges.push(`Name changed from "${mfo.name}" to "${emed_name.value}"`);
    }

    if (mfo.description !== emed_description.value) {
        actChanges.push(`Description updated`);
    }

    if (mfo.dosage !== emed_dosage.value) {
        actChanges.push(`Dosage changed from "${mfo.dosage}" to "${emed_dosage.value}"`);
    }

    const newQty = Number(emed_quantity.value);
    if (mfo.quantity !== newQty) {
        actChanges.push(`Quantity changed from ${mfo.quantity} to ${newQty}`);
    }

    const file = document.getElementById('eimage').files[0];
    const oldImage = document.getElementById('existingImage').value;

    if (file) {
        actChanges.push(`Image updated`);
    } 
    else if (window.removeImageClicked === true) {
        actChanges.push(`Image removed`);
    } 
    else if (!oldImage && file) {
        actChanges.push(`Image added`);
    }

    // no change then stop and hide the edit medicines
    if (actChanges.length === 0) {
        document.getElementById('editMedForm').classList.add('hidden');
        return alert("No changes detected.");
    }

    // Build final activity log text
    const act = `${mfo.name} (${mfo.dosage}) — ` + actChanges.join(", ");

    // Prepare FormData for PUT
    const formData = new FormData();
    formData.append("name", emed_name.value);
    formData.append("description", emed_description.value);
    formData.append("dosage", emed_dosage.value);
    formData.append("quantity", emed_quantity.value);

    if (file) {
        formData.append("image", file);
    } else {
        formData.append("existingImage", oldImage);
    }

    if (window.removeImageClicked === true) {
        formData.append("removeImage", "true");
    }

    // Save activity log
    await fetch('http://localhost:5000/activity-log', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "editM", activity: act }),
        credentials: "include"
    });

    // Update medicine
    const response = await fetch(`http://localhost:5000/medicines/${id}`, {
        method: "PUT",
        body: formData
    });

    const data = await response.json();
    if (data.success) location.reload();
});


document.getElementById('edropImage').addEventListener('dragover',(e)=>{
    e.preventDefault();
    
    document.getElementById('edropImage').classList.remove('bg-[#f9fbffff]')
    document.getElementById('edropImage').classList.add('bg-[#f0f5ffff]')
    document.getElementById('edropImage').style.borderColor = " rgba(153, 177, 255, 1)";
})

document.getElementById('edropImage').addEventListener('dragleave',(e)=>{
    e.preventDefault();
    
    document.getElementById('edropImage').classList.remove('bg-[#f0f5ffff]')
    document.getElementById('edropImage').classList.add('bg-[#f9fbffff]')
    document.getElementById('edropImage').style.borderColor = " #c7c7c7ff"
})

document.getElementById('edropImage').addEventListener('click',()=>{
    window.removeImageClicked = false;
    eimage.click();
})

document.getElementById('eimage').addEventListener('change',(e)=>{
    e.preventDefault();

    const file = e.target.files[0];
    window.removeImageClicked = false;
    renderImg(file, "edit");
});


document.getElementById('edropImage').addEventListener('drop',(e)=>{
    e.preventDefault();

    const img = e.dataTransfer.files[0];

    if (img && img.type.startsWith('image/')) {

        // FIX: Put the dropped file into #eimage input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(img);
        document.getElementById('eimage').files = dataTransfer.files;

        window.removeImageClicked = false;
        renderImg(img, "edit");

    } else {
      alert('Please drop an image file.');
    }
});




document.getElementById('itemLine').addEventListener('click',()=>{
    localStorage.setItem('layout','line');

    let savedlayout = localStorage.getItem('layout');
    Layout(savedlayout);
})

document.getElementById('itemBox').addEventListener('click',()=>{
    localStorage.setItem('layout','box');

    let savedlayout = localStorage.getItem('layout');
    Layout(savedlayout);
})

document.addEventListener('DOMContentLoaded',()=>{
    let savedlayout = localStorage.getItem('layout');
    if(savedlayout == ''){
        localStorage.setItem('layout','box');
    }

    Layout(savedlayout);
})

function Layout(i){
    // alert(i);
    if(i == 'line'){
        // alert('im line')
        document.getElementById('boxCheck').classList.add('hidden');
        document.getElementById('itemBox').classList.remove('bg-blue-200');

        document.getElementById('lineCheck').classList.remove('hidden');
        document.getElementById('itemLine').classList.add('bg-blue-200');
        document.getElementById('medList').classList.remove('flex', 'flex-wrap', 'gap-10', 'pb-10')

        renderListMed(i);
    }else if(i == 'box'){
        // alert('im box')
        document.getElementById('lineCheck').classList.add('hidden');
        document.getElementById('itemLine').classList.remove('bg-blue-200');

        document.getElementById('boxCheck').classList.remove('hidden');
        document.getElementById('itemBox').classList.add('bg-blue-200');
        document.getElementById('medList').classList.add('flex', 'flex-wrap', 'gap-10', 'pb-10')

        renderListMed(i);
    }
}

///////////////////////////////////////

function type(i){
    if(i == "login"){
        return `
        <div class="h-[45px] w-[45px] rounded-full bg-green-500 m-auto flex items-center justify-center" title="login">
            <svg class="size-6" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24">
                <path fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4m-5-4l5-5l-5-5m5 5H3"/>
            </svg>
        </div>
        `;
    }else if(i == "logout"){
        return `
        <div class="h-[45px] w-[45px] rounded-full bg-red-500 m-auto flex items-center justify-center" title="logout">
            <svg class="size-6" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 20 20">
                <path fill="white" d="M3 3h8V1H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8v-2H3z"/>
                <path fill="white" d="M13 5v4H5v2h8v4l6-5z"/>
            </svg>
        </div>
        `;
    }else if(i.includes("delete")){
        return `
        <div class="h-[45px] w-[45px] rounded-full bg-[rgba(255,72,88,1)] m-auto flex items-center justify-center" title="delete">
            <svg class="size-7" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24">
                <path fill="rgba(255, 236, 236, 1)" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
        </div>
        `;
    }else if(i.includes("edit")){
        return `
        <div class="h-[45px] w-[45px] rounded-full bg-[rgba(72,185,255,1)] m-auto flex items-center justify-center" title="edit">
            <svg class="size-5" width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="white" d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L368 46.1l97.9 97.9l24.4-24.4c21.9-21.9 21.9-57.3 0-79.2zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L432 177.9L334.1 80zM96 64c-53 0-96 43-96 96v256c0 53 43 96 96 96h256c53 0 96-43 96-96v-96c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32z"/>
            </svg>
        </div>
        `;
    }else if(i.includes("add")){
        return `
        <div class="h-[45px] w-[45px] rounded-full bg-[rgba(0,201,121,1)] m-auto flex items-center justify-center" title="add">
            <svg class="size-7 text-white" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 12 12">
                <path fill="currentColor" d="M6.5 1.75a.75.75 0 0 0-1.5 0V5H1.75a.75.75 0 0 0 0 1.5H5v3.25a.75.75 0 0 0 1.5 0V6.5h3.25a.75.75 0 0 0 0-1.5H6.5V1.75Z"/>
            </svg>
        </div>
        `;
    }

}

async function activity() {
    document.getElementById('actil').innerHTML = "";

    const res = await fetch('http://localhost:5000/activity-log', {credentials: "include"});
    const result = await res.json()

    console.log(result);

    if (!Array.isArray(result.activities)) {
        console.error("Activities not found:", result);
        return;
    }

    result.activities.forEach((list)=>{
        document.getElementById('actil').innerHTML += `
            <tr class="border-b border-stone-300 h-[70px] hover:bg-blue-100">
                <td>${type(list.type)}</td>
                <td class="text-stone-700 text-[17px] font-[500] pl-3">${list.activity}</td>
                <td>
                    <div class="flex flex-col leading-none">
                        <p class="text-stone-800 text-[18px] font-[500]">${list.username}</p>
                        <p class="text-stone-600 text-[16px] font-[500]">${list.email}</p>
                    </div>
                </td>
                <td>
                    <p class="text-stone-700 text-[16px] font-[500]">
                        ${new Date(list.datetime).toLocaleString('en-GB', {day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Manila'})}, 
                        ${new Date(list.datetime).toLocaleString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila'})}
                    </p>
                </td>
            </tr>
        `;
    });
}

activity()



