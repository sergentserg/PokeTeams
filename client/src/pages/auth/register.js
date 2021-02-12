const REGISTER_URL = 'http://127.0.0.1:5000/api/v1/auth/register';
const VERIFY_URL = 'http://127.0.0.1:5000/api/v1/auth/verify';
document.querySelector('#signUpForm').addEventListener('submit', registerUser);

// Check for a token for email verification.
window.addEventListener('load', async (e) => {
  const params = getSearchParams(window.location.href);
  if (params.emailtoken) {
    // Email verification.
    const res = await fetch(`${VERIFY_URL}/${params.emailtoken}`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
    });
    const data = await res.json();
    if (!data.success) {
      showAlert(false, 'Invalid token.');
    } else {
      showAlert(true, 'Your account was verified.');
      setTimeout(() => {
        window.location.replace(`signin.html`);
      }, 2000);
    }
  }
});

function showAlert(success, message) {
  const alertClass = success ? 'alert-success' : 'alert-danger';
  const icon = success
    ? '<i class="fas fa-check-circle"></i>'
    : '<i class="fas fa-times-circle"></i>';
  const alertDiv = document.createElement('div');
  alertDiv.classList = `alert ${alertClass}`;
  // alertDiv.style = 'position: absolute;top:20px;opacity: 0.75';
  alertDiv.innerHTML = `${icon} ${message}`;
  const signUp = document.querySelector('#signUp');
  signUp.insertBefore(alertDiv, signUp.firstElementChild);
  setTimeout(() => alertDiv.remove(), 5000);
}

// Get parameter list.
function getSearchParams(url) {
  const indexParams = url.indexOf('?');
  if (indexParams == -1) {
    return { emailToken: false };
  }
  const paramSubstr = url.slice(indexParams + 1);
  const params = {};
  paramSubstr.split('&').forEach((pair) => {
    const [key, value] = pair.split('=');
    params[key] = value;
  });
  return params;
}

export async function registerUser(e) {
  e.preventDefault();
  // Get form fields.
  const inputs = e.target.elements;
  if (inputs['password'].value !== inputs['password2'].value) {
    console.log("Passwords don't match");
  } else {
    const fields = {
      email: inputs['email'].value,
      password: inputs['password'].value,
    };

    // Register the account.
    const res = await fetch(REGISTER_URL, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(fields),
    });

    // Handle response (account exists? unable to send email?)
    const data = await res.json();
    if (!data.success) {
      showAlert(false, 'Unable to create account; please try again later.');
    } else {
      showAlert(true, 'Verify your email to activate account.');
    }
  }
  e.target.reset();
}
