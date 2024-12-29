const form = document.getElementById("contact-form");
const formstatus = document.getElementById("form-status");
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const confettiColors = [
  "#0f2ba0",
  "#0128ff",
  "#2e63ff",
  "#791453",
  "#c11582",
  "#ef45bf",
];
let confetti = [];
let animationId;
let isStopping = false;

function renderConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((p, index) => {
    // Only render confetti still visible on the canvas
    if (p.y <= canvas.height) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();

      // Update position and rotation
      p.y += p.speed;
      p.rotation += p.speed;

      // Reset position if not stopping
      if (!isStopping && p.y > canvas.height) {
        p.y = -p.size;
        p.x = Math.random() * canvas.width;
      }
    } else if (isStopping) {
      // Remove confetti pieces that have fallen off the screen
      confetti.splice(index, 1);
    }
  });

  // Continue animation until no confetti left
  if (confetti.length > 0) {
    animationId = requestAnimationFrame(renderConfetti);
  }
}

function startConfetti() {
  isStopping = false;
  confetti.push(
    ...Array.from({ length: 100 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 5 + 5,
      speed: Math.random() * 3 + 2,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * 360,
    }))
  );
  renderConfetti();
}

function stopConfetti() {
  isStopping = true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = form.querySelector("input[name='name']").value;
  const email = form.querySelector("input[name='email']").value;
  const message = form.querySelector("textarea[name='message']").value;

  if (!name || !email || !message) {
    formstatus.textContent = "Please fill out all fields.";
    return;
  } else {
    formstatus.textContent = "";
  }

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  const formData = new FormData(form);
  const jsonData = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonData),
    });

    if (response.ok) {
      formstatus.textContent = "Message sent successfully!";
      startConfetti();
      setTimeout(() => {
        stopConfetti();
      }, 3000);
      form.reset();
    } else {
      formstatus.textContent = "Failed to send the message.";
    }
  } catch (error) {
    formstatus.textContent = "An error occurred.";
    console.error(error);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send Message";
  }
});
