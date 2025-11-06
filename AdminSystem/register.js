const API_URL = "http://localhost:5000/users/account";

const username = document.getElementById('username');
const email = document.getElementById('email');
const pass = document.getElementById('pass');
const conpass = document.getElementById('conpass');


let isLoading = false;

document.getElementById('form1').addEventListener('submit', async(e)=>{
    e.preventDefault();

    if(!username.value.trim() || !email.value.trim() || !pass.value.trim() || !conpass.value.trim()) return; // exit if input empty

    if(isLoading) return;

    //loading while waiting to finish
    isLoading = true;
    document.getElementById("submit").innerHTML = `<div class="loading"></div>`;

    //checking if email has been saved to my database
    const res = await fetch("http://localhost:5000/users/account-check",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: email.value})
    });

    const data = await res.json();

    // stop if exists
    if (data.exists) {
        // alert("Email already exists! "+data.exists);
        
        // email.style.cssText = `
        //     font-size: 16px;
        //     outline: none;
        //     border: 1px solid red;
   
        //     border-radius: 20px;
        //     padding: 10px 20px;
        //     background-color: rgba(255, 161, 161, 1);
        // `;
        email.classList.add('styleAlert')
        document.getElementById('inputAlert').hidden = false;
        document.getElementById('inputAlert').textContent = "⚠️ Email already registered.";
        isLoading = false;
        document.getElementById("submit").innerHTML = "Continue";
        return;
    }

    if(data.error) {
        isLoading = false;
        document.getElementById("submit").innerHTML = "Continue";
        console.log(data.error);
        return;
    }

    if(pass.value.trim() != conpass.value.trim()){
        conpass.classList.add('styleAlert');
        document.getElementById('inputAlert').hidden = false;
        document.getElementById('inputAlert').textContent = "⚠️ Passwords don't match.";
        isLoading = false;
        document.getElementById("submit").innerHTML = "Continue";
        return;
    }

    const temp = JSON.parse(localStorage.getItem('temp'));

    // alert(temp.email + " :ok: " + email.value);
    // alert("test: "+(temp.email != email.value));

    //no change email input and timer still will proceed to form 2 without sending a new code 
    if(timer != null && temp.email == email.value){
        isLoading = false;
        document.getElementById("submit").innerHTML = "Continue";

        document.getElementById('fill').style.width = "100%";
        document.getElementById('otp').style.cssText = `background-color: rgba(78, 78, 255, 0.955); color: white;transition: 0.7s`;
        
        document.getElementById('form1').hidden = true;
        document.getElementById('form2').hidden = false;
        return;
    }

    // alert(username.value + email.value + pass.value + conpass.value + " "+ code);
    await sendEmailVerification(email);
    
    //remove loading
    isLoading = false;
    document.getElementById("submit").innerHTML = "Continue";
});

//back to form1
document.getElementById('back').addEventListener('click', ()=>{
    
    document.getElementById('fill').style.width = "0%";
    document.getElementById('otp').style.cssText = `background-color: rgba(234, 234, 234, 0.95); color: #444;`;

    document.getElementById('form1').hidden = false;
    document.getElementById('form2').hidden = true;

    // localStorage.setItem('temp', JSON.stringify({
    //     "email": "",
    //     "code": ""
    // }));

    document.querySelectorAll('.verification').forEach(i =>{
        i.classList.remove("wrongCode");
    })
});


document.querySelectorAll('.verification').forEach((input,i) => {
    input.addEventListener('input', function() {   
        // Move to next input if current is filled
        if (this.value.length === 1 && i < 5) {
            document.querySelectorAll('.verification')[i + 1].focus();
        }
    });
    
    input.addEventListener('keydown', function(e) {
        // Handle backspace
        if (e.key === 'Backspace' && this.value.length === 0 && i > 0) {
            document.querySelectorAll('.verification')[i - 1].focus();
        }
    });

    input.addEventListener('paste', (e)=>{
        e.preventDefault();

        const text = e.clipboardData.getData('text').trim();
        //only digits
        const digits = text.replace(/\D/g, '').slice(0, document.querySelectorAll('.verification').length);
        for(let k=0; k < document.querySelectorAll('.verification').length;k++){
            document.querySelectorAll('.verification')[k].value = digits[k];
        }

    })
});

document.getElementById('resend').addEventListener('click', async(e)=>{
    e.preventDefault();
    if(!username.value.trim() || !email.value.trim() || !pass.value.trim() || !conpass.value.trim()) return alert('fill all!');
    if(isLoading) return;

    isLoading = true;
    document.getElementById('resendText').innerHTML = `<div class="loading"></div>`;

    await sendEmailVerification(email);

    isLoading = false;
    document.getElementById('resendText').textContent = `Resend code`;
});

document.getElementById('confirm').addEventListener('click',async(e)=>{
    e.preventDefault();

    isLoading = true;
    document.getElementById("confirm").innerHTML = `<div class="loading"></div>`;

    const temp = JSON.parse(localStorage.getItem('temp'));
    const code = Array.from(document.querySelectorAll('.verification')).map(i=>i.value.trim());
    // alert(temp.email+temp.code+ "   =  "+email.value.trim()+code.join(""))
    
    if(temp.email == email.value && temp.code == code.join("")){
        // window.location.href = "/inventory";
        // alert("hhh");
        try{
            //send to server and insert to database
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username: username.value.trim(), email: email.value.trim(), password: pass.value.trim()})
            });

            const data = res.json();
            if(!res.ok) return alert('data error ' +data.error+' '+data);

            //clear value if ok
            email.value = "";
            username.value ="";
            pass.value = "";
            conpass.value = "";

            document.querySelectorAll('.verification').forEach(input => {
                input.value = "";
            })

            localStorage.setItem('temp', JSON.stringify({
                "email": "",
                "code": ""
            }))

            // alert('success '+data.message);
            document.getElementById('msg').hidden = false;
            document.getElementById('msg').innerHTML += `
                <div class="msgBox">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
                        <path fill="#10b981" fill-rule="evenodd" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z" clip-rule="evenodd"/>
                    </svg>
                    <h1>Account Created</h1>
                    <p>Your account has been successfully created and is ready to use.</p>
                    <div class="msgbtn">
                        <div onclick="window.location.href = '/login';reset()">Continue to Login</div>
                        <div onclick="reset()">Back</div>
                    </div>
                </div>
            `;

        }catch(error){
            alert(error)
        }
        
    }else{
        document.querySelectorAll('.verification').forEach(i=>{
            i.classList.add("wrongCode");
        })
    }

    isLoading = false;
    document.getElementById("confirm").textContent = `Verify & Create Account`;
})

document.querySelectorAll('.verification').forEach(input => {
    input.addEventListener('focus', () => {
        document.querySelectorAll('.verification').forEach(i => i.classList.remove('wrongCode'));
    });
});


let timer = null;

function startTimer(){

    if(timer) clearInterval(timer);
    let time = 120; //2 seconds
    
    // disable resend
    document.getElementById('resend').style.pointerEvents = "none";
    document.getElementById('resendText').style.color = "rgba(151, 151, 151, 1)"

    timer = setInterval(()=>{
        let mins = Math.floor(time/60);
        let secs = time % 60;

        document.getElementById('timer').textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                
        time--;

        if(time < 0) {
            clearInterval(timer);
            timer = null;
            localStorage.setItem('temp', JSON.stringify({
                "email": "",
                "code": ""
            }))

            document.getElementById('timer').textContent = "";
            document.getElementById('resend').style.pointerEvents = "auto";
            document.getElementById('resendText').style.color = "rgb(78, 78, 255)";
        }
    },1000) //1SECONDS 
}

async function sendEmailVerification(email){

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    let toEmail = email.value.trim();

    await fetch("http://localhost:5000/sent-verification",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: toEmail, code})
    })
    .then(res=>res.json())      
    .then(data=>{
        if(data.success){
            console.log('Success');
            localStorage.setItem('temp', JSON.stringify({
                "email":toEmail,
                "code":code
            }))
            //color the line between 1 and 2
            document.getElementById('fill').style.width = "100%";
            //highlight the 2
            document.getElementById('otp').style.cssText = `background-color: rgba(78, 78, 255, 0.955); color: white;transition: 0.7s`;
            // hide & show forms
            document.getElementById('form1').hidden = true;
            document.getElementById('form2').hidden = false;
            
            document.getElementById('showEmail').textContent = toEmail;

            startTimer()

        }else{
            alert(data.error);
        }
    })
    .catch(err=> console.error("Fetch error", err));
}

function reset(){

    document.getElementById('msg').hidden = true;

    document.getElementById('fill').style.width = "0%";
    document.getElementById('otp').style.cssText = `background-color: rgba(228, 228, 228, 0.955);color: rgb(105, 105, 105);`;

    document.getElementById('form1').hidden = false;
    document.getElementById('form2').hidden = true;
    
}



email.addEventListener("focus", ()=>{
    email.classList.remove('styleAlert');
    document.getElementById('inputAlert').textContent = "";
    document.getElementById('inputAlert').hidden= true;
})

conpass.addEventListener("focus", ()=>{
    conpass.classList.remove('styleAlert');
    document.getElementById('inputAlert').textContent = "";
    document.getElementById('inputAlert').hidden= true;
})