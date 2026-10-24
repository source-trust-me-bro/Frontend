export function formatDate(iso: string | null | undefined): string {
  if (!iso) {
    return "";
  }

  return new Intl.DateTimeFormat("en-FI", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Helsinki",
  }).format(new Date(iso));
}
