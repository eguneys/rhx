export function pTimeout(delay: number) {
  return new Promise((resolve, reject) =>
    setTimeout(() => reject('timeout'), delay));
}
