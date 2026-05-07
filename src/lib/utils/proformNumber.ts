const BASE_YEAR = 2024;
const STARTING_SEQUENCE = 200;

function getYearCode(year: number): string {
  let offset = Math.max(0, year - BASE_YEAR);
  let code = "";

  do {
    code = String.fromCharCode("A".charCodeAt(0) + (offset % 26)) + code;
    offset = Math.floor(offset / 26) - 1;
  } while (offset >= 0);

  return code;
}

export function getProformSeriesPreview(year = new Date().getFullYear()): string {
  return `${getYearCode(year)}${year}${STARTING_SEQUENCE}`;
}
