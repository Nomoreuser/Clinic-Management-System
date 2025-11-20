
const sid = localStorage.getItem("studentId");

if(sid){
    document.getElementById("studentid").textContent = sid;
}else{
    window.location.href = "/student"
}


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

async function Medicine(){

    const res = await fetch('http://localhost:5000/medicines', {credentials: 'include'});
    const medData = await res.json();

    console.log(medData)

    if(medData.ok == false) return alert("error fetch!")
    console.log(medData.meds.length == 0)

    const medItems = document.getElementById("medItems");

    medItems.innerHTML = "";

    medData.meds.forEach((items,i) =>{
        medItems.innerHTML += `
            <div style="width: 350px;height: 360px;background: rgba(255, 255, 255, 0.95); border-radius: 16px;border: 1px solid rgba(255,255,255,0.8);box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); overflow:hidden; display: flex; flex-direction: column;">
                <div style="background-color:white;width:100%;height:100px;flex-shrink:0;">
                    <img src="http://localhost:5000/uploads/${items.image}" alt="" onerror="this.src='https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';"
                        style="width:100%; height:100%; object-fit:cover;" />
                </div>
                <div style="padding: 12px 15px; flex: 1; display: flex; flex-direction: column;">

                    <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #1a1a1a;">${items.name}</div>

                    <div style="padding: 0; word-break: break-word; margin: 0 0 12px 0; color: #666; line-height: 1.4; height: 40px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                        ${items.description}
                    </div>
                    <div style="display:flex;justify-content:space-between;padding: 4px 0; font-size: 14px;">
                        <div style="color: #666;">Dosage:</div>
                        <div style="font-weight: 500;">${items.dosage}</div>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding: 4px 0 12px 0; font-size: 14px;">
                        <div style="color: #666;">Stocks:</div>
                        <div style="font-weight: 500;">${items.quantity}</div>
                    </div>
                    <div style="display:flex; justify-content:center; align-items:center; gap:12px; height:36px; background-color: rgba(240, 240, 240, 0.6); margin: 0 0 12px 0; padding:6px; border-radius:10px;">
                        <button style="font-size:20px; width:28px;height:28px;border-radius:50%;margin:0;padding:0;border:none;background:white;cursor:pointer;line-height:1; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" 
                            onmousedown="holdStart(${i},${items.quantity},'-')" onmouseup="holdStop()" onmouseleave="holdStop()">-
                        </button>
                        <div style="height: 28px;width: 50px;background-color: white;border-radius:6px;position:relative; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                            <div id="itemQ${i}" style="margin:0;padding:0; font-weight:600;">0</div>
                        </div>
                        <button style="font-size:20px; width:28px;height:28px;border-radius:50%;margin:0;padding:0;border:none;background:white;cursor:pointer;line-height:1; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" 
                            onmousedown="holdStart(${i},${items.quantity},'+')" onmouseup="holdStop()" onmouseleave="holdStop()">+
                        </button>
                    </div>
                    <button onclick="confirm('${items.name} ${items.dosage}', '${i}', ${items.id}, 'get')" style="width: 100%;margin:0;padding:10px;border:none;border-radius:8px;background:linear-gradient(135deg, #2b95ff 0%, #1a7de0 100%);color:white;cursor:pointer;font-weight:600; box-shadow: 0 4px 12px rgba(43, 149, 255, 0.3);">Confirm</button>
                </div>
            </div>
        `;
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

async function confirm(item, i, medId, type){
    let id = "itemQ"+i;
    let qty = document.getElementById(id).textContent;
    alert(sid+" "+type+" "+item + " "+qty)

    const res = await fetch("http://localhost:5000/records", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ 
            studentId: sid, 
            type: type, 
            itemName: item, 
            qty: qty,
            itemId: medId
        })
    })

    const result = await res.json();

    alert(result.message);
    document.getElementById(id).textContent = 0;
    counts[i] = 0;
    Medicine()
}



// ///////////////////////////////////////////////////////////////////
// // EQUIPMENT SECTION
// Equipment()

// // Separate counter for equipment to avoid conflict with medicine counters
// let eqCounts = [];

// async function Equipment(){

//     const res = await fetch('http://localhost:5000/equipments', {credentials: 'include'});
//     const eqData = await res.json();

//     console.log(eqData)

//     if(eqData.ok == false) return alert("error fetch!")
//     console.log(eqData.equips.length == 0)

//     const equipItems = document.getElementById("equipItems");

//     eqData.equips.forEach((items,i) =>{

//         // Initialize equipment counter
//         eqCounts[i] = 0;

//         equipItems.innerHTML += `
//             <div style="width: 350px;height: 360px;background: rgba(255, 255, 255, 0.95); border-radius: 16px;border: 1px solid rgba(255,255,255,0.8);box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); overflow:hidden; display: flex; flex-direction: column;">
//                 <div style="background-color:white;width:100%;height:100px;flex-shrink:0;">
//                     <img src="http://localhost:5000/uploads/${items.image}" alt="" onerror="this.src='https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';"
//                         style="width:100%; height:100%; object-fit:cover;" />
//                 </div>
//                 <div style="padding: 12px 15px; flex: 1; display: flex; flex-direction: column;">

//                     <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #1a1a1a;">${items.name}</div>

//                     <div style="padding: 0; word-break: break-word; margin: 0 0 12px 0; color: #666; line-height: 1.4; height: 40px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
//                         ${items.description}
//                     </div>

//                     <div style="display:flex;justify-content:space-between;padding: 4px 0 12px 0; font-size: 14px;">
//                         <div style="color: #666;">Stocks:</div>
//                         <div style="font-weight: 500;">${items.quantity}</div>
//                     </div>

//                     <div style="display:flex; justify-content:center; align-items:center; gap:12px; height:36px; background-color: rgba(240, 240, 240, 0.6); margin: 0 0 12px 0; padding:6px; border-radius:10px;">
//                         <button style="font-size:20px; width:28px;height:28px;border-radius:50%;border:none;background:white;cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" 
//                             onmousedown="eqHoldStart(${i},${items.quantity},'-')" onmouseup="eqHoldStop()" onmouseleave="eqHoldStop()">-
//                         </button>

//                         <div style="height: 28px;width: 50px;background-color: white;border-radius:6px; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
//                             <div id="eqItemQ${i}" style="margin:0;padding:0; font-weight:600;">0</div>
//                         </div>

//                         <button style="font-size:20px; width:28px;height:28px;border-radius:50%;border:none;background:white;cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" 
//                             onmousedown="eqHoldStart(${i},${items.quantity},'+')" onmouseup="eqHoldStop()" onmouseleave="eqHoldStop()">+
//                         </button>
//                     </div>

//                     <button onclick="eqConfirm('${items.name}', '${i}', ${items.id})" 
//                         style="width: 100%;padding:10px;border:none;border-radius:8px;background:linear-gradient(135deg, #2b95ff 0%, #1a7de0 100%);color:white;cursor:pointer;font-weight:600; box-shadow: 0 4px 12px rgba(43, 149, 255, 0.3);">
//                         Confirm
//                     </button>
//                 </div>
//             </div>
//         `;
//     });
// }


// // ======================
// // COUNTER LOGIC (equipment)
// // ======================

// let eqHold;

// function eqCount(i, available, status){
//     if(eqCounts[i] === undefined) eqCounts[i] = 0;

//     if(status == '+'){
//         if(eqCounts[i] < available){
//             eqCounts[i]++;
//         } else {
//             clearInterval(eqHold);
//         }
//     } else {
//         if(eqCounts[i] > 0){
//             eqCounts[i]--;
//         } else {
//             clearInterval(eqHold);
//         }
//     }

//     document.getElementById("eqItemQ"+i).textContent = eqCounts[i];
// }

// function eqHoldStart(i, available, status){
//     eqCount(i, available, status);
//     eqHold = setInterval(()=> eqCount(i, available, status), 200);
// }

// function eqHoldStop(){
//     clearInterval(eqHold);
// }


// // ======================
// // CONFIRM FOR EQUIPMENT
// // ======================

// async function eqConfirm(itemName, i, equipId){

//     let qty = eqCounts[i];

//     if(qty == 0) return alert("Please select quantity.");

//     const res = await fetch("http://localhost:5000/records", {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify({ 
//             studentId: sid, 
//             type: type, 
//             itemName: item, 
//             qty: qty,
//             itemId: equipId
//         })
//     })

//     const result = await res.json();
//     alert(result.message);

//     // Reset UI
//     eqCounts[i] = 0;
//     document.getElementById("eqItemQ"+i).textContent = 0;
// }
