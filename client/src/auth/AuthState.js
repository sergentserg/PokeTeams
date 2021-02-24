import { API_URL } from 'src/shared/util/constants';

export class AuthState {
  constructor() {
    this.user = null;
  }

  isLoggedIn() {
    return this.user !== null;
  }

  update(updatedUser) {
    this.user = updatedUser;
  }

  getMe() {
    return this.user;
  }

  getPhotoUrl() {
    return `${API_URL}/uploads/${this.user.photo}`;
  }

  // Redirect to login page by default if cannot authenticate.
  async authenticate() {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    if (data.success) {
      this.user = data.data;
    } else {
      this.user == null;
    }
    return this.isLoggedIn();
  }

  async uploadPhoto(photo) {
    const formData = new FormData();
    formData.append('file', photo);
    const res = await fetch(`${API_URL}/auth/photoupload`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      this.user.photo = data.photo;
    }
    return data.success;
  }

  async update(fields) {
    console.log(fields);
    const res = await fetch(`${API_URL}/auth/updateDetails`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    if (data.success) {
      this.user = data.data;
    }
    return data.success;
  }

  static async register(fields) {
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

  static async login(fields) {
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
  static async logout() {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'GET',
      credentials: 'include',
    });
    window.location.replace('auth.html');
  }

  // Activate user account
  static async activate(emailtoken) {
    // Email verification.
    const res = await fetch(`${API_URL}/auth/verify/${emailtoken}`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      credentials: 'include',
    });
    const data = await res.json();
    return data.success;
  }

  static async forgotPassword(email) {
    const res = await fetch(`${API_URL}/auth/forgotpassword`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return data.success;
  }

  static async resetPassword(password, resetToken) {
    const res = await fetch(`${API_URL}/auth/resetpassword/${resetToken}`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    return data.success;
  }
}

export const authState = new AuthState();
