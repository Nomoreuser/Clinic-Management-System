

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

document.getElementById('logout').addEventListener('click', (e)=>{
    alert("hi");
})

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
      alert(`You dropped: ${img.name}`);
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
    //   alert(`You dropped: ${img.name}`);
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