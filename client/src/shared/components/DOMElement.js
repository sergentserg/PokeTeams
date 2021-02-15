export function DOMElement(name, attributes) {
  const e = document.createElement(name);
  for (let key in attributes) {
    e.setAttribute(key, attributes[key]);
  }
  return e;
}
