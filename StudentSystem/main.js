



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

    let listmed = [{name:'Paracetamol',type:'Pain reliever',dosage:'500mg tablets',
    available:40},{name:'Amoxicillin',type:'Antibiotic',dosage:'250mg capsules',available:23}];

    const medItems = document.getElementById("medItems");

    listmed.forEach((items,i) =>{
        medItems.innerHTML += `<div style="width: 300px;background-color: #ffffff52; border-radius: 15px;border: 1px solid white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.55);margin:20px 0 0 0;">

            <p style="padding:0 10px;margin:0;font-size: 22px">${items.name}</p>

            <div style="display:flex;justify-content:space-between;padding: 0 15px">
                <p>Type: </p>
                <p>${items.type}</p>
            </div>
            <div style="display:flex;justify-content:space-between;padding: 0 15px">
                <p style="margin:0;">Dosage: </p>
                <p style="margin:0;">${items.dosage}</p>
            </div>
            <div style="display:flex;justify-content:space-between;padding: 0 15px">
                <p>Stocks: </p>
                <p>${items.available}</p>
            </div>

            <div style="display:flex;justify-content:center;gap:10px;padding: 0 15px;height:30px;background-color: #f0f0f070;margin: 10px 15px;padding:7px">
                <button style="font-size:25px; width:30px;border-radius:50%;" onmousedown="holdStart(${i},${items.available},'-')" onmouseup="holdStop()" onmouseleave="holdStop()">-</button>
                <div style="height: 100%;width: 50px;background-color: #ffffffbb;border-radius:5px;position:relative;">
                    <div id="itemQ${i}" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">0</div>
                </div>
                <button type="submit" style="font-size:25px; width:30px;border-radius:50%;" onmousedown="holdStart(${i},${items.available},'+')" onmouseup="holdStop()" onmouseleave="holdStop()">+</button>
            </div>
  
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
            alert('limit');
        }

    }else if(status == '-'){
        if(counts[i] > 0){
            counts[i]--;
        }else{
            clearInterval(hold);
            alert('0'+counts[i]);
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
