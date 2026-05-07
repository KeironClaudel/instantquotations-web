export function formatMoneyAmount(value: number | null | undefined): string {
  const numericValue = value ?? 0;
  const [integerPart = "0", decimalPart = "00"] = numericValue.toFixed(2).split(".");

  return `${integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${decimalPart}`;
}
