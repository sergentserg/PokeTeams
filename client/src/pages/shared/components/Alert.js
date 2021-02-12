export function Alert(success, message, timer) {
  const alertClass = success ? 'alert-success' : 'alert-danger';
  const icon = success
    ? '<i class="fas fa-check-circle"></i>'
    : '<i class="fas fa-times-circle"></i>';
  const alertDiv = document.createElement('div');
  alertDiv.classList = `alert ${alertClass}`;
  // alertDiv.style = 'position: absolute;top:20px;opacity: 0.75';
  alertDiv.innerHTML = `${icon} ${message}`;
  setTimeout(() => alertDiv.remove(), timer);
  return alertDiv;
}
function showAlert(success, message) {
  const signUp = document.querySelector('#signUp');
  signUp.insertBefore(alertDiv, signUp.firstElementChild);
  setTimeout(() => alertDiv.remove(), 5000);
}
