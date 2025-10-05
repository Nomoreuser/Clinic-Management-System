



document.getElementById('nav').addEventListener('click',(e)=>{
    if(e.target.classList.contains("navbtn")){
        document.querySelectorAll('.navbtn').forEach(btn => btn.classList.remove('active'));
    };
    if(e.target.id == "nav") exit;
    e.target.classList.add('active');

    let me = e.target.id;
    section(me);

});

window.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById('medBTN').classList.add('active');
});

section("medBTN"); // default view section medic

function section(show){
    const medicine = document.getElementById("med");
    const borrowed = document.getElementById("bor");
    const returned = document.getElementById("ret");
    document.querySelectorAll(".mainC").forEach(section => section.classList.remove("showSec"));

    if(show == "medBTN"){
        document.getElementById("med").classList.add("showSec");
    }else if(show == "borBTN"){
        document.getElementById("bor").classList.add("showSec");
    }else if(show == "retBTN"){
        document.getElementById("ret").classList.add("showSec");
    }
};


Medicine();

function Medicine(){

    let listmed = [{name:'Paracetamol',type:'Pain reliever',dosage:'500mg tablets',available:40,img: "https://www.rosepharmacy.com/ph1/wp-content/uploads/2016/09/67195.jpg"},
        {name:'Amoxicillin',type:'Antibiotic',dosage:'250mg capsules',available:23,img:""},
        {name:'Amoxicillin',type:'Antibiotic',dosage:'250mg capsules',available:23,img:""},
        {name:'Amoxicillin',type:'Antibiotic',dosage:'250mg capsules',available:23,img:""},
        {name:'Amoxicillin',type:'Antibiotic',dosage:'250mg capsules',available:23,img:""},
        {name:'Amoxicillin',type:'Antibiotic',dosage:'250mg capsules',available:23,img:""},
        {name:'Amoxicillin',type:'Antibiotic',dosage:'250mg capsules',available:23,img:""},
        {name:'Amoxicillin',type:'Antibiotic',dosage:'250mg capsules',available:23,img:""},
        {name:'Amoxicillin',type:'Antibiotic',dosage:'250mg capsules',available:23,img:""},
        {name:'Amoxicillin',type:'Antibiotic',dosage:'250mg capsules',available:23,img:""},
        {name:'Amoxicillin',type:'Antibiotic',dosage:'250mg capsules',available:23,img:""},
        {name:'Amoxicillin',type:'Antibiotic',dosage:'250mg capsules',available:23,img:""},
        {name:'Amoxicillin',type:'Antibiotic',dosage:'250mg capsules',available:23,img:""}
    ];

    const medItems = document.getElementById("medItems");

    listmed.forEach((items,i) =>{
        medItems.innerHTML += `<div style="width: 295px;height: 310px;background-color: rgba(255, 255, 255, 0.32); border-radius: 15px;border: 1px solid white;box-shadow: 0 0 10px rgba(0, 0, 0, 0.55);
            margin:0 0 0;overflow:hidden;">

            <div style="background-color:white;width:100%;height:100px;">
                <img src="${items.img}" alt="" onerror="this.src='https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';"
                    style="width:100%; height:100%; object-fit:cover;" />
            </div>
    
            <div style="padding:5px 15px;font-size: 22px;margin:0">${items.name}</div>

            <div style="display:flex;justify-content:space-between;padding: 0 15px 5px 15px;margin:0">
                <div>Type: </div>
                <div>${items.type}</div>
            </div>
            <div style="display:flex;justify-content:space-between;padding: 0 15px 10px 15px;margin:0">
                <div>Dosage: </div>
                <div>${items.dosage}</div>
            </div>
            <div style="display:flex;justify-content:space-between;padding: 0 15px 10px 15px;margin:0">
                <div>Stocks: </div>
                <div>${items.available}</div>
            </div>

            <div style="display:flex; justify-content:center; gap:10px; height:30px; background-color: rgba(240, 240, 240, 0.32); margin: 0 15px 10px; padding:5px; border-radius:7px">
                <button style="font-size:25px; width:30px;border-radius:50%;margin:0;padding:0;border:none;background:none;cursor:pointer;line-height:1" 
                    onmousedown="holdStart(${i},${items.available},'-')" onmouseup="holdStop()" onmouseleave="holdStop()">-
                </button>
                <div style="height: 100%;width: 50px;background-color: #ffffffbb;border-radius:5px;position:relative;">
                    <div id="itemQ${i}" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);margin:0;padding:0">0</div>
                </div>
                <button type="submit" style="font-size:25px; width:30px;border-radius:50%;margin:0;padding:0;border:none;background:none;cursor:pointer;line-height:1" onmousedown="holdStart(${i},${items.available},'+')" onmouseup="holdStop()" onmouseleave="holdStop()">+</button>
            </div>
    
            <button style="width: 90%;margin:0 5% 0;padding:8px;border:none;border-radius:5px;background:#2b95ff;color:white;cursor:pointer;display:block">Confirm</button>
        </div>`;
    });
}

let counts = [];
let hold;

function borrowed(i,available,status){
    // alert("hi"+i+available)
    let id = "itemQ"+i;

    if(counts[i] === undefined) counts[i] = 0;

    if(status == '+'){
        if(counts[i] < available){
            counts[i]++;
        }else {
            clearInterval(hold);
            // alert('limit');
        }

    }else if(status == '-'){
        if(counts[i] > 0){
            counts[i]--;
        }else{
            clearInterval(hold);
            // alert('0'+counts[i]);
        }
    }

    document.getElementById(id).textContent = counts[i];
}

function holdStart(i,available,status){
    borrowed(i,available,status);
    hold = setInterval(()=>borrowed(i,available,status),200);
}
function holdStop(){
    clearInterval(hold);
}
