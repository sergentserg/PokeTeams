export function dexNoFromId(id) {
  return ('00' + id).substr(-3, 3);
}
