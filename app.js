// LOAD STUDENTS SA TABLE GALING FIREBASE
onSnapshot(window.studentsRef, (snapshot) => {
  let total = 0;
  const tableBody = document.querySelector("tbody"); 
  if(!tableBody) return;
  tableBody.innerHTML = "";
  
  snapshot.forEach((docSnap) => {
    const s = docSnap.data();
    total++;
    tableBody.innerHTML += `
      <tr>
        <td><img src="${s.photo_url || 'https://via.placeholder.com/40'}" width="40" height="40" style="border-radius:50%;"></td>
        <td>${s.student_id || ''}</td>
        <td>${s.last_name || ''}, ${s.first_name || ''}</td>
        <td>${s.grade || ''} - ${s.section || ''}</td>
        <td>${s.school_year || ''}</td>
        <td>
          <button onclick="printID('${docSnap.id}')">Print ID</button>
          <button onclick="deleteStudent('${docSnap.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
  const totalEl = document.querySelector(".card h1");
  if(totalEl) totalEl.innerText = total;
});

// SAVE STUDENT PAG CLICK NG "Save Student" BUTTON
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if(form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const studentData = {
        student_id: "2026-" + Date.now().toString().slice(-4),
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        grade: document.getElementById("grade").value,
        section: document.getElementById("section").value,
        birthday: document.getElementById("birthday").value,
        address: document.getElementById("address").value,
        contact: document.getElementById("contact").value,
        adviser: document.getElementById("adviser").value,
        school_year: "2026-2027",
        photo_url: "https://via.placeholder.com/60"
      };

      if(studentData.first_name && studentData.last_name) {
        await addDoc(window.studentsRef, studentData);
        alert("Student Added!");
        closeForm();
        form.reset();
      } else {
        alert("Please fill First Name and Last Name");
      }
    });
  }
});

// DELETE STUDENT
window.deleteStudent = async function(id) {
  if(confirm("Delete this student?")) {
    await deleteDoc(doc(window.db, "students", id));
  }
}

// PRINT ID
window.printID = function(id) {
  getDoc(doc(window.db, "students", id)).then((docSnap) => {
    if (docSnap.exists()) {
      const s = docSnap.data();
      const printWindow = window.open('', '', 'height=400,width=600');
      printWindow.document.write(`
        <html><head><title>Student ID</title>
        <style>body{font-family:Arial;text-align:center;padding:20px}.id-card{width:3.37in;height:2.125in;border:2px solid #000;border-radius:10px;padding:10px;margin:auto}</style>
        </head><body>
        <div class="id-card">
          <h3>STUDENT ID CARD</h3>
          <img src="${s.photo_url}" width="60" style="border-radius:50%"/>
          <p><b>${s.last_name}, ${s.first_name}</b></p>
          <p>ID: ${s.student_id}</p>
          <p>${s.grade} - ${s.section}</p>
          <p>S.Y: ${s.school_year}</p>
        </div>
        <script>window.print();</script>
        </body></html>
      `);
      printWindow.document.close();
    }
  });
}

// CLOSE FORM
window.closeForm = function() {
  document.getElementById("studentModal").classList.remove("show");
  document.getElementById("studentModal").setAttribute("aria-hidden", "true");
}
