const STARTING_SEQUENCE = 200;

function normalizePrefix(prefix: string): string {
  const lettersOnly = prefix.trim().toUpperCase().replace(/[^A-Z]/g, "");
  return lettersOnly.length > 0 ? lettersOnly : "A";
}

export function getProformSeriesPreview(prefix: string, year = new Date().getFullYear()): string {
  return `${normalizePrefix(prefix)}${year}${STARTING_SEQUENCE}`;
}
