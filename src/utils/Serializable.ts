export function objectToUrlParams(obj: { [key: string]: any } | undefined): string {
  if (typeof obj === 'undefined') return '';
  const params = new URLSearchParams();
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] != 'undefined') {
        params.append(key, obj[key]);
      }
    }
  }
  return params.toString();
}
