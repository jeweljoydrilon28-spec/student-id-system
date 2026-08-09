const STORAGE_KEY = "studentIdSystem_students";
let students = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const $ = id => document.getElementById(id);

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function openForm(index = null) {
  $("studentModal").classList.add("show");
  $("studentModal").setAttribute("aria-hidden", "false");
  $("studentForm").reset();
  $("editIndex").value = index === null ? "" : index;
  $("formTitle").textContent = index === null ? "Add Student" : "Edit Student";

  if (index !== null) {
    const s = students[index];
    $("studentId").value = s.studentId || "";
    $("fullName").value = s.fullName || "";
    $("grade").value = s.grade || "";
    $("section").value = s.section || "";
    $("birthday").value = s.birthday || "";
    $("contact").value = s.contact || "";
    $("schoolYear").value = s.schoolYear || "";
    $("adviser").value = s.adviser || "";
    $("address").value = s.address || "";
  } else {
    $("schoolYear").value = "2026-2027";
  }
}

function closeForm() {
  $("studentModal").classList.remove("show");
  $("studentModal").setAttribute("aria-hidden", "true");
}

function readPhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

$("studentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const index = $("editIndex").value;
  const old = index !== "" ? students[Number(index)] : {};
  const uploadedPhoto = await readPhoto($("photo").files[0]);

  const student = {
    studentId: $("studentId").value.trim(),
    fullName: $("fullName").value.trim(),
    grade: $("grade").value.trim(),
    section: $("section").value.trim(),
    birthday: $("birthday").value,
    contact: $("contact").value.trim(),
    schoolYear: $("schoolYear").value.trim(),
    adviser: $("adviser").value.trim(),
    address: $("address").value.trim(),
    photo: uploadedPhoto || old.photo || ""
  };

  if (index === "") students.push(student);
  else students[Number(index)] = student;

  saveStudents();
  closeForm();
  renderStudents();
});

function renderStudents() {
  const query = $("searchInput").value.toLowerCase().trim();
  const tbody = $("studentTable");
  const filtered = students
    .map((s, index) => ({...s, index}))
    .filter(s => Object.values(s).join(" ").toLowerCase().includes(query));

  $("studentCount").textContent = students.length;

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty">No students found. Click “Add Student” to register one.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td><img class="thumb" src="${s.photo || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='100'%3E%3Crect width='100%25' height='100%25' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='%23647589'%3ENo Photo%3C/text%3E%3C/svg%3E"}" alt="Student photo"></td>
      <td>${escapeHtml(s.studentId)}</td>
      <td>${escapeHtml(s.fullName)}</td>
      <td>${escapeHtml(s.grade)} - ${escapeHtml(s.section)}</td>
      <td>${escapeHtml(s.schoolYear)}</td>
      <td class="actions">
        <button class="primary" onclick="printId(${s.index})">Print ID</button>
        <button class="secondary" onclick="openForm(${s.index})">Edit</button>
        <button class="danger" onclick="deleteStudent(${s.index})">Delete</button>
      </td>
    </tr>
  `).join("");
}

function deleteStudent(index) {
  if (confirm(`Delete ${students[index].fullName}?`)) {
    students.splice(index, 1);
    saveStudents();
    renderStudents();
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function printId(index) {
  localStorage.setItem("studentIdSystem_printIndex", index);
  window.open("id-card.html", "_blank");
}

renderStudents();
