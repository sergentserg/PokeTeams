export function Alert(success, message, timer) {
  const alertClass = success ? 'alert-success' : 'alert-danger';
  const icon = success
    ? '<i class="fas fa-check-circle"></i>'
    : '<i class="fas fa-times-circle"></i>';
  const alertDiv = document.createElement('div');
  alertDiv.classList = `alert ${alertClass}`;
  alertDiv.innerHTML = `${icon} ${message}`;
  setTimeout(() => alertDiv.remove(), timer || 5000);
  return alertDiv;
}
