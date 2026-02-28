export function stringToHash(val: string) {
  return val.split('').reduce((hash, char) => {
    return char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash;
  }, 0);
}
