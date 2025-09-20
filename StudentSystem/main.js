



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

    listmed.forEach(items =>{
        medItems.innerHTML += `<div style="width: 250px;background-color: white;">
            <p style="margin:0;">${items.name}</p>
            <div style="display:flex;justify-content:space-between;">
                <p>Type: </p>
                <p>${items.type}</p>
            </div>
            <div style="display:flex;justify-content:space-between;margin:0;">
                <p style="margin:0;">Dosage: </p>
                <p style="margin:0;">${items.dosage}</p>
            </div>
        </div>`;
    });
}
