

document.addEventListener('click',(e)=>{

    if(!document.getElementById('filterMed').contains(e.target) && !document.getElementById('dropMed').contains(e.target)){
        document.getElementById('dropMed').classList.add('hidden');
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

})

document.getElementById('logout').addEventListener('click', async(e)=>{
    document.getElementById('logoutBox').classList.remove('hidden');
});
document.getElementById('conLog').addEventListener('click', async()=>{
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
            icon.textContent = data.user.username.charAt(0);
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
    removeImg();
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
    renderImg(e.target.files[0])
});


document.getElementById('dropImage').addEventListener('drop',(e)=>{
    e.preventDefault();

    const img = e.dataTransfer.files[0];

    if (img && img.type.startsWith('image/')) {
    //   alert(`You dropped: ${img.name}`);
      renderImg(img);
    } else {
      alert('Please drop an image file.');
    }
});

// equipment form
document.getElementById('addEquipment').addEventListener('click',()=>{
    const show = document.getElementById('addEquipForm').classList.toggle('hidden');
    removeImg();
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
    renderImg(e.target.files[0])
});


document.getElementById('dropImageEquip').addEventListener('drop',(e)=>{
    e.preventDefault();

    const img = e.dataTransfer.files[0];

    if (img && img.type.startsWith('image/')) {
    //   alert(`     dropped: ${img.name}`);
      renderImg(img);
    } else {
      alert('Please drop an image file.');
    }
});



function renderImg(img){
    // alert("hello")
    if(!img){
        alert('No images')
        return;
    }
    const read = new FileReader();

    read.addEventListener('load',()=>{
        //medicine
        document.getElementById('pImg').src = read.result;
        document.getElementById('dropImage').classList.add('hidden');
        document.getElementById('previewImage').classList.remove('hidden');

        //equip
        document.getElementById('pImgEquip').src = read.result;
        document.getElementById('dropImageEquip').classList.add('hidden');
        document.getElementById('previewImageEquip').classList.remove('hidden');
    })
    read.readAsDataURL(img);
}

function removeImg(){
    //equipment
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



//  ex data
let listmed = [
    {
        name: "Paracetamol",
        description: "For pain and fever relief.",
        dosage: "500mg",
        quantity: 20,
        image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
    },
    {
        name: "Amoxicillin",
        description: "Used to treat bacterial infections.",
        dosage: "500mg",
        quantity: 30,
        image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
    },
    {
        name: "Loratadine",
        description: "For allergies like sneezing and runny nose.",
        dosage: "10mg",
        quantity: 10,
        image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
    },
    {
        name: "Metformin",
        description: "Helps control blood sugar levels.",
        dosage: "500mg",
        quantity: 60,
        image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
    },
    {
        name: "Ibuprofen",
        description: "For pain, swelling, or fever.",
        dosage: "400mg",
        quantity: 25,
        image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
    },
    {
        name: "Cetirizine",
        description: "Relieves allergy symptoms.",
        dosage: "10mg",
        quantity: 15,
        image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
    },
    {
        name: "Omeprazole",
        description: "Reduces stomach acid.",
        dosage: "20mg",
        quantity: 28,
        image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
    },
    {
        name: "Salbutamol",
        description: "Helps open airways for easier breathing. Helps open airways for easier breathing. Helps open airways for easier breathing. Helps open airways for easier breathing. Helps open airways for easier breathing.",
        dosage: "100 mg",
        quantity: 1,
        image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
    },
    {
        name: "Cetirizine",
        description: "Relieves allergy symptoms.",
        dosage: "10mg",
        quantity: 15,
        image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
    },
    {
        name: "Omeprazole",
        description: "Reduces stomach acid.",
        dosage: "20mg",
        quantity: 28,
        image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/c1e14c4c-0f8b-4250-a1eb-3d30d8a6f033/Expired-Medications-1312753473-967x544-1-scaled_jpg"
    },
    {
        name: "Salbutamol",
        description: "Helps open airways for easier breathing. Helps open airways for easier breathing. Helps open airways for easier breathing. Helps open airways for easier breathing. Helps open airways for easier breathing.",
        dosage: "100 mg",
        quantity: 1,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBSyS7ErCSEdDIUsaWomF4UIKcnHsaPzFDLw&s"
    }
];


// renderListMed();

function renderListMed(i){
    // alert('kkkk')

    document.getElementById('medList').innerHTML = ``;
    if(i == 'box'){
        listmed.forEach((med,i) =>{
            document.getElementById('medList').innerHTML += `
                <div class="h-[350px] w-[350px] shadow-lg rounded-xl border border-stone-100 relative">
                    <div class="h-[100px] w-[calc(100%-30px)] m-[15px] mb-0 bg-blue-100 overflow-hidden rounded-xl">
                    <img src="${med.image}" class="h-full w-full object-cover">
                    </div>
                    <div class="px-[15px] h-[165px]">
                        <p class="text-[20px] pt-1 font-semibold text-[#333]">${med.name}</p>
                        <p class="h-[77px] line-clamp-3 text-[#444]">${med.description}</p>
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
                        <button class="w-[30%] bg-blue-500 py-2 rounded-xl hover:-translate-y-1 hover:bg-blue-400 shadow-sm">Edit</button>
                        <button class="w-[30%] bg-green-500 py-2 rounded-xl hover:-translate-y-1 hover:bg-green-400 shadow-sm">Dispense</button>
                        <button class="w-[30%] bg-red-500 py-2 rounded-xl hover:-translate-y-1 hover:bg-red-400 shadow-sm">Delete</button>
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
                        <th class="pb-2 border-b">Name</th> 
                        <th class="pb-2 border-b">Description</th> 
                        <th class="pb-2 border-b">Dosage</th> 
                        <th class="py-2 border-b">Quantity</th> 
                        <th class="pb-2 border-b">Action</th>
                    </tr>
                </thead>
                <tbody id="mdl">
                    <tr>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        `;
        listmed.forEach((med,i) =>{
            // document.getElementById('medList').innerHTML += `
            //     <div class="w-full bg-red-100 border-b p-3">
            //         ${med.name}
            //     </div>
            // `;

            document.getElementById('mdl').innerHTML += `
                <tr class="border-b h-[50px] hover:bg-blue-100">
                    <td class="relative px-5">
                        <div class="flex items-center gap-3">
                            <div class="group">
                                <svg class="size-5" width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path fill="#000000" d="M64 32C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zm64 80a48 48 0 1 1 0 96a48 48 0 1 1 0-96m144 112c8.4 0 16.1 4.4 20.5 11.5l88 144c4.5 7.4 4.7 16.7.5 24.3S368.7 416 360 416H88c-8.9 0-17.2-5-21.3-12.9s-3.5-17.5 1.6-24.8l56-80c4.5-6.4 11.8-10.2 19.7-10.2s15.2 3.8 19.7 10.2l26.4 37.8l61.4-100.5c4.4-7.1 12.1-11.5 20.5-11.5z"/></svg>
                                <div class="hidden absolute left-12 top-[-30px] z-2 group-hover:block shadow-lg rounded-xl p-5 border border-stone-200 bg-white pointer-events-none">
                                    <img src="${med.image}" class="max-h-[200px] w-auto object-contain">
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



