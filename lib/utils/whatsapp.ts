interface WhatsAppParams {
  phone: string;
  trekName?: string;
  agencyName?: string;
  groupSize?: number;
  dates?: string;
}

export function buildWhatsAppUrl(params: WhatsAppParams): string {
  const { phone, trekName, groupSize, dates } = params;

  const message = [
    "Hi! I found you on TrekMapper.",
    trekName  ? `I'm interested in the *${trekName}* trek.` : "",
    groupSize ? `Group size: ${groupSize} people.` : "",
    dates     ? `Dates: ${dates}.` : "",
    "Could you share availability and pricing?",
  ]
    .filter(Boolean)
    .join(" ");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
