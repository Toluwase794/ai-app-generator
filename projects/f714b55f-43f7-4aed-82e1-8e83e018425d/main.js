document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  function validateEmail(email) {
    // Simple email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Clear previous errors
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(span => (span.textContent = ''));
    status.textContent = '';
    status.style.color = '#007acc';

    let valid = true;

    const nameInput = form.elements['name'];
    const emailInput = form.elements['email'];
    const messageInput = form.elements['message'];

    if (!nameInput.value.trim()) {
      const errorSpan = nameInput.nextElementSibling;
      errorSpan.textContent = 'Please enter your name.';
      valid = false;
    }

    if (!emailInput.value.trim()) {
      const errorSpan = emailInput.nextElementSibling;
      errorSpan.textContent = 'Please enter your email.';
      valid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      const errorSpan = emailInput.nextElementSibling;
      errorSpan.textContent = 'Please enter a valid email address.';
      valid = false;
    }

    if (!messageInput.value.trim()) {
      const errorSpan = messageInput.nextElementSibling;
      errorSpan.textContent = 'Please enter a message.';
      valid = false;
    }

    if (!valid) {
      status.textContent = 'Please fix the errors above and try again.';
      status.style.color = '#d93025';
      return;
    }

    // Since no backend, simulate sending
    status.textContent = 'Sending message...';
    status.style.color = '#007acc';

    setTimeout(() => {
      status.textContent = 'Thank you for your message! I will get back to you soon.';
      form.reset();
    }, 1500);
  });
});
