

// https://students-sample-api.vercel.app/api/students

async function check(id) {

  if(id == "") return

  try {
    const res = await fetch(`https://students-sample-api.vercel.app/api/students?id=${id}`);

    console.log("Response status:", res.status);

    if (!res.ok) {
      alert("Student not found!");
      return;
    }

    // --- GET RAW RESPONSE FIRST ---
    const raw = await res.text();
    console.log("RAW RESPONSE:", raw);

    let data;

    // --- TRY TO PARSE JSON SAFELY ---
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.log("JSON PARSE ERROR:", err);
      alert("SERVER ERROR: API returned invalid JSON.");
      return;
    }

    console.log("Data received:", data);

    alert("FOUND: " + data.fullName);

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
          <div class="data">${data.studentId}</div>
        </div>
        <div class="infoItem">
          <div class="infos">Full Name: </div>
          <div class="data">${data.fullName}</div>
        </div>
        <div class="infoItem">
          <div class="infos">Course/Strand: </div>
          <div class="data">${data.courseOrStrand} - ${data.yearLevel}</div>
        </div>

        <div style="display: flex;justify-content: flex-end; gap: 15px">
          <button onclick="document.getElementById('info').innerHTML =''; studID.value=''">Cancel</button>
          <button onclick="confirm()">Confirm & Proceed</button>
        </div>
      </div>
    `;

  } catch (error) {
    console.log("FETCH ERROR:", error);
    alert("Fetch failed. Check console.");
  }
}

function confirm(){
  localStorage.setItem("studentId", studID.value);
  window.location.href='main.html';
}

document.addEventListener("keydown", (e)=>{
  if(e.key == "Enter"){
    check(studID.value);
  }
})