import Link from "next/link";

/** The three paid placements from the pricing page, shown in turn between stories. */
const placements = [
  {
    label: "Recruitment listing",
    title: "Hiring in Oulu or Lapland?",
    body: "Reach newcomers and seasonal workers where they read the news.",
    price: "€250 per listing",
  },
  {
    label: "Community channel",
    title: "Your staff and residents, one channel.",
    body: "Unlimited readers, a named editor, no editorial approval rights.",
    price: "From €450 per month",
  },
  {
    label: "Event sponsorship",
    title: "Put your event in front of the community.",
    body: "Sponsored events are always labelled and never change what we publish.",
    price: "€900 per event",
  },
] as const;

/** A labelled advertising slot. It never looks like a story and always links to /pricing. */
export function SponsorSlot({ index }: { index: number }) {
  const placement = placements[index % placements.length];

  return (
    <li className="dash-sponsor" aria-label="Sponsored">
      <span className="dash-sponsor__tag">Sponsored · {placement.label}</span>
      <strong className="dash-sponsor__title">{placement.title}</strong>
      <span className="dash-sponsor__body">{placement.body}</span>
      <span className="dash-sponsor__foot">
        <span className="dash-sponsor__price">{placement.price}</span>
        <Link className="dash-sponsor__link" href="/pricing">
          See pricing →
        </Link>
      </span>
    </li>
  );
}
