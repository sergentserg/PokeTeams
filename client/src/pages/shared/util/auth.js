import { API_URL } from './constants';
import { Alert } from '../components/Alert';

// Redirect to login page by default if cannot authenticate.
export async function authenticate() {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json();
  return data.success;
}

export async function register(e) {
  e.preventDefault();
  // Get form fields.
  const form = e.target;
  const inputs = form.elements;
  let alertDiv;
  if (inputs['password'].value !== inputs['password2'].value) {
    alertDiv = Alert(false, 'The passwords did not match', 5000);
  } else {
    const fields = {
      email: inputs['email'].value,
      password: inputs['password'].value,
    };

    // Register the account.
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(fields),
    });

    // Handle response (account exists? unable to send email?)
    const data = await res.json();
    if (!data.success) {
      alertDiv = Alert(
        false,
        'Unable to create account; please try again later.',
        5000
      );
    } else {
      alertDiv = Alert(true, 'Verify your email to activate account.', 5000);
    }
    form.reset();
  }
  form.insertBefore(alertDiv, form.firstElementChild);
}

export async function login(e) {
  e.preventDefault();
  const form = e.target;
  const inputs = form.elements;
  const fields = {
    email: inputs['email'].value,
    password: inputs['password'].value,
  };

  // Attempt to login.
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(fields),
  });

  const data = await res.json();
  if (!data.success) {
    let alertDiv = Alert(false, 'Invalid credentials', 5000);
    form.insertBefore(alertDiv, form.firstElementChild);
  } else {
    window.location.replace('profile.html');
  }
}

// Clear browser cookie and redirect.
export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: 'GET',
    credentials: 'include',
  });
  location.replace('login.html');
}

// Activate user account

export async function activate(emailtoken, form) {
  let alertDiv;
  // Email verification.
  const res = await fetch(`${API_URL}/auth/verify/${emailtoken}`, {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
  });
  const data = await res.json();
  if (!data.success) {
    alertDiv = Alert(false, 'Invalid Token', 5000);
  } else {
    alertDiv = Alert(true, 'Your account was verified.', 5000);
  }
  form.insertBefore(alertDiv, form.firstElementChild);
}
