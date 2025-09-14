

function Verify(){
  if(studentID.value == ""){
    alert("Please enter your Student ID")
  }else if(studentID.value.length < 11){
    alert("11 chars")
  }else{
    window.location.href="main.html";
  }
}

const hi = "greet";