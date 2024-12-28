const form = document.getElementById("contact-form");
const formstatus = document.getElementById("form-status");

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
