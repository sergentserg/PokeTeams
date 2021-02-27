class Alert {
  constructor() {
    this.alert = document.createElement('div');
  }

  get() {
    return this.alert;
  }

  update(success, message, timer) {
    this.alert.remove();
    const icon = success
      ? '<i class="fas fa-check-circle"></i>'
      : '<i class="fas fa-times-circle"></i>';
    const alertClass = success ? 'alert-success' : 'alert-danger';
    this.alert.classList = `alert ${alertClass} alert-dismissible`;
    this.alert.innerHTML = `${icon} ${message}`;
    setTimeout(() => this.alert.remove(), timer || 5000);
  }
}

export const gAlert = new Alert();
