// "24°" and "−3°" (a real minus sign reads better than a hyphen at display sizes)
export function formatTemp(value: number): string {
  const rounded = Math.round(value);
  return `${rounded < 0 ? "\u2212" : ""}${Math.abs(rounded)}\u00b0`;
}
