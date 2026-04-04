// ===== SETUP =====
let userEmail = "";
let userNote = "";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
 
const intro = document.getElementById("intro");
const controls = document.getElementById("controls");
const nextBtn = document.getElementById("nextBtn");
 
// ===== STATE =====
let drawing = false;
let selectedColor = "#8B4513";
let brushSize = 10;
let step = 1;
 
// ===== LOGIN CHECK =====
const params = new URLSearchParams(window.location.search);
if (params.get("loggedIn") === "true") {
  showApp();
}
 
// ===== SHOW APP =====
function showApp() {
  intro.style.display = "none";
  canvas.style.display = "block";
  controls.style.display = "block";
  nextBtn.style.display = "block";
  renderStep();
}
 
// ===== LOGIN =====
function login() {
  window.location.href = "https://cookiegram-production.up.railway.app/auth/google";
}
 
// ===== DRAWING =====
canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseleave", () => drawing = false);
 
canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  const x = e.offsetX;
  const y = e.offsetY;
  ctx.fillStyle = selectedColor;
  ctx.beginPath();
  ctx.arc(x, y, brushSize, 0, Math.PI * 2);
  ctx.fill();
});
 
function setColor(color) {
  selectedColor = color;
}
 
// ===== NEXT BUTTON =====
nextBtn.addEventListener("click", () => {
  if (step === 3) {
    const noteEl = document.getElementById("note");
    if (noteEl) userNote = noteEl.value;
  }
  if (step === 4) {
    const emailEl = document.getElementById("email");
    if (emailEl) userEmail = emailEl.value;
  }
 
  if (step === 5) {
    sendEmail();
    return;
  }
 
  step++;
  renderStep();
});
 
// ===== STEP RENDER =====
function renderStep() {
  nextBtn.innerText = "Next";
 
  if (step === 1) {
    brushSize = 10;
    controls.innerHTML = `
      <p>choose your cookie color</p>
      <div class="palette">
        <div class="color" style="background:#8B4513" onclick="setColor('#8B4513')"></div>
        <div class="color" style="background:#D2B48C" onclick="setColor('#D2B48C')"></div>
        <div class="color" style="background:#F5DEB3" onclick="setColor('#F5DEB3')"></div>
        <div class="color" style="background:#3E2723" onclick="setColor('#3E2723')"></div>
      </div>
    `;
  }
 
  else if (step === 2) {
    brushSize = 5;
    controls.innerHTML = `
      <p>add toppings</p>
      <div class="palette">
        <div class="color" style="background:#3e2723" onclick="setColor('#3e2723')"></div>
        <div class="color" style="background:#ffffff" onclick="setColor('#ffffff')"></div>
        <div class="color" style="background:#ff4d4d" onclick="setColor('#ff4d4d')"></div>
        <div class="color" style="background:#c68642" onclick="setColor('#c68642')"></div>
      </div>
    `;
  }
 
  else if (step === 3) {
    controls.innerHTML = `
      <p>add a note</p>
      <textarea id="note" placeholder="write your note...">${userNote}</textarea>
    `;
  }
 
  else if (step === 4) {
    controls.innerHTML = `
      <p>send your cookie to...</p>
      <input id="email" placeholder="enter their email" value="${userEmail}" />
    `;
  }
 
  else if (step === 5) {
    controls.innerHTML = `<p>ready to send!! 🍪</p>`;
    nextBtn.innerText = "Send 💌";
  }
}
 
// ===== SEND EMAIL =====
function sendEmail() {
  const email = userEmail;
  const note = userNote;
  const cookieImage = canvas.toDataURL("image/png");
 
  console.log("Sending to:", email);
 
  if (!email) {
    alert("no email entered 😢");
    return;
  }
 
  fetch("https://cookiegram-production.up.railway.app/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: email,
      message: note,
      image: cookieImage
    })
  })
  .then(res => res.text())
  .then(() => alert("cookie sent! 🍪✨"))
  .catch(() => alert("error sending 😢"));
}
 