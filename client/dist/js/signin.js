const LOGIN_URL = 'http://127.0.0.1:5000/api/v1/auth/login';
document.querySelector('#signInForm').addEventListener('submit', loginUser);

function showAlert(success, message) {
  const alertClass = success ? 'alert-success' : 'alert-danger';
  const icon = success
    ? '<i class="fas fa-check-circle"></i>'
    : '<i class="fas fa-times-circle"></i>';
  const alertDiv = document.createElement('div');
  alertDiv.classList = `alert ${alertClass}`;
  alertDiv.innerHTML = `${icon} ${message}`;
  const signUp = document.querySelector('#signIn');
  signUp.insertBefore(alertDiv, signUp.firstElementChild);
  setTimeout(() => alertDiv.remove(), 5000);
}

async function loginUser(e) {
  e.preventDefault();
  // Get form fields.
  const inputs = e.target.elements;
  const fields = {
    email: inputs['email'].value,
    password: inputs['password'].value,
  };

  // Attempt to login.
  const res = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(fields),
  });

  // Handle response (account exists? unable to send email?)
  const data = await res.json();
  console.log(data);
  if (!data.success) {
    showAlert(false, 'Invalid Credentials');
  } else {
    window.location.replace('pokedex.html');
  }
}
