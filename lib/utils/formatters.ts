export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDuration(days: number): string {
  return days === 1 ? "1 day" : `${days} days`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
