import { API_URL } from 'src/shared/util/constants';

// Redirect to login page by default if cannot authenticate.
export async function authenticate() {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json();
  return data.success;
}

export async function register(fields) {
  // Register the account.
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(fields),
  });

  // Handle response (account exists? unable to send email?)
  const data = await res.json();
  return data.success;
}

export async function login(fields) {
  // Attempt to login.
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(fields),
  });
  const data = await res.json();
  return data.success;
}

// Clear browser cookie and redirect.
export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: 'GET',
    credentials: 'include',
  });
  window.location.replace('auth.html');
}

// Activate user account
export async function activate(emailtoken) {
  // Email verification.
  const res = await fetch(`${API_URL}/auth/verify/${emailtoken}`, {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    credentials: 'include',
  });
  const data = await res.json();
  return data.success;
}

export async function forgotPassword(email) {
  const res = await fetch(`${API_URL}/auth/forgotpassword`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  return data.success;
}

export async function resetPassword(password, resetToken) {
  const res = await fetch(`${API_URL}/auth/resetpassword/${resetToken}`, {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  return data.success;
}
