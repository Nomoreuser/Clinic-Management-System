

function Verify(){
  if(studentID.value == ""){
    alert("Please enter your Student ID")
  }
  if(studentID.value.length < 11){
    alert("11 chars")
  }if(studentID.value.length = 11){
    window.location.href="main.html";
  }
}

const hi = "greet";