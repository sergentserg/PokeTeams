export function capitalize(str) {
  return str
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.substr(1))
    .join(' ');
}
