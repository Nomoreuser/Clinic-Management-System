

// function Verify(){
//   if(studentID.value == ""){
//     alert("Please enter your Student ID")
//   }else if(studentID.value.length < 11){
//     alert("11 chars")
//   }else{
//     window.location.href="main.html";
//   }
// }

// const hi = "greet";

const students = [{
  student_id:"23-0324-276",
  first_name:"Gerald",
  middle_name:"Albon",
  last_name:"Carvajal",
  course:"Bachelor of Science in Information Technolog",
  year:"3rd Year"
}];

function check(){

  document.getElementById("info").innerHTML = ``;

  let get = students.filter(i => i.student_id === studentID.value);

  if(studentID.value.length < 11){
    // alert("11 chars")
    exit;
  }else if(get.length < 1){
    alert("cant find id!")
    exit;
  }

  get.map(i=>{
    document.getElementById("info").innerHTML = `
    
    <div style="padding: 10px 15px;background-color: rgba(43, 149, 255, 1);display: flex;align-items:center;gap:10px">
      <i class="fas fa-user-graduate" style="background-color: rgba(255, 255, 255, .4);color: white;padding: 5px;font-size: 24px;border-radius: 5px"></i>
      <div style="color:white">
        <h3 style="margin:0">Student Verification</h3>
        <p style="margin:0">Please check if this is your going to use.</p>
      </div>  
    </div>

    <div style="margin: 10px">
      <div class="infoItem">
        <div class="infos">Student ID: </div>
        <div class="data">${i.student_id}</div>
      </div>
      <div class="infoItem">
        <div class="infos">Full Name: </div>
        <div class="data">${i.first_name} ${i.middle_name} ${i.last_name}</div>
      </div>
      <div class="infoItem">
        <div class="infos">Course/Strand: </div>
        <div class="data">${i.course} - ${i.year}</div>
      </div>

      <div style="display: flex;justify-content: flex-end; gap: 15px">
        <button onclick="check()">Cancel</button>
        <button onclick="window.location.href='main.html'">Confirm & Proceed</button>
      </div>
    </div>`;
  });
  
  studentID.value = "";
}



document.addEventListener("keydown", (e)=>{
  if(e.key == "Enter"){
    check();
  }
  exit;
})