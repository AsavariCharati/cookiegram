// ===== SETUP =====
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const intro = document.getElementById("intro");
const startBtn = document.getElementById("startBtn");

const controls = document.getElementById("controls");
const nextBtn = document.getElementById("nextBtn");

// ===== STATE =====
let drawing = false;
let selectedColor = "#8B4513";
let brushSize = 10;
let step = 1;

// ===== INTRO START =====
startBtn.onclick = () => {
  intro.style.display = "none";

  canvas.style.display = "block";
  controls.style.display = "block";
  nextBtn.style.display = "block";

  renderStep();
};

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

// ===== COLOR =====
function setColor(color) {
  selectedColor = color;
}

// ===== STEP RENDER =====
function renderStep() {

  // DRAW COOKIE
  if (step === 1) {
    controls.innerHTML = `
      <p>choose your cookie color </p>
      <div class="palette">
        <div class="color" style="background:#8B4513" onclick="setColor('#8B4513')"></div>
        <div class="color" style="background:#D2B48C" onclick="setColor('#D2B48C')"></div>
        <div class="color" style="background:#F5DEB3" onclick="setColor('#F5DEB3')"></div>
        <div class="color" style="background:#3E2723" onclick="setColor('#3E2723')"></div>
      </div>
    `;
  }

  // TOPPINGS
  // STEP 2 → TOPPINGS (smaller brush)
else if (step === 2) {
  brushSize = 5;   //  smaller for toppings

  controls.innerHTML = `
    <p>add toppings </p>
    <div class="palette">
      <div class="color" style="background:#3e2723" onclick="setColor('#3e2723')"></div>
      <div class="color" style="background:#ffffff" onclick="setColor('#ffffff')"></div>
      <div class="color" style="background:#ff4d4d" onclick="setColor('#ff4d4d')"></div>
      <div class="color" style="background:#c68642" onclick="setColor('#c68642')"></div>
    </div>
  `;
}

  // NOTE
  else if (step === 3) {
    controls.innerHTML = `
      <p>add a note </p>
      <textarea id="note" placeholder="write your note..."></textarea>
    `;
  }

  // EMAIL
  else if (step === 4) {
    controls.innerHTML = `
      <p>send your cookie </p>
      <input id="email" placeholder="enter email" />
    `;
  }

  // FINAL
  else if (step === 5) {
    controls.innerHTML = `<p>ready to send!!</p>`;
    nextBtn.innerText = "Send";
  }
  // STEP 1 → COOKIE (big brush)
if (step === 1) {
  brushSize = 10;   // bigger
  controls.innerHTML = `
    <p>choose your cookie color </p>
    <div class="palette">
      <div class="color" style="background:#8B4513" onclick="setColor('#8B4513')"></div>
      <div class="color" style="background:#D2B48C" onclick="setColor('#D2B48C')"></div>
      <div class="color" style="background:#F5DEB3" onclick="setColor('#F5DEB3')"></div>
      <div class="color" style="background:#3E2723" onclick="setColor('#3E2723')"></div>
    </div>
  `;
}
}

// ===== NEXT =====
nextBtn.onclick = () => {
  step++;

  if (step > 5) {
    alert("cookie sent!");
    return;
  }

  renderStep();
};