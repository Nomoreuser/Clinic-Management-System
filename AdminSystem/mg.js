

document.addEventListener('click',(e)=>{

    if(!document.getElementById('filterMed').contains(e.target) && !document.getElementById('dropMed').contains(e.target)){
        document.getElementById('dropMed').classList.add('hidden');
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