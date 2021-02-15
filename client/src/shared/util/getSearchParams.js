export function getSearchParams(url) {
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
