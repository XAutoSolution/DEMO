import type { ReactNode } from "react";

// One card, reused for every content type. Only the data changes per type
// (badge, accent, icon, specs) — the layout is shared. This IS the proof
// the marketplace bid is making: same component, fields swap by type.
export type Listing = {
  id: string;
  title: string;
  price: string;
  location: string;
  badge: string;
  accent: string;
  icon: ReactNode;
  description: string;
  specs: { label: string; value: string }[];
};

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md">
      <div
        className="relative flex h-36 items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${listing.accent}22, ${listing.accent}0a)`,
        }}
      >
        <div style={{ color: listing.accent }}>{listing.icon}</div>
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: listing.accent }}
        >
          {listing.badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-semibold leading-tight text-neutral-900">
            {listing.title}
          </h3>
          <p className="mt-0.5 text-sm text-neutral-500">{listing.location}</p>
        </div>

        <div className="text-lg font-bold" style={{ color: listing.accent }}>
          {listing.price}
        </div>

        <dl className="mt-auto grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-neutral-100 pt-3 text-xs">
          {listing.specs.map((s) => (
            <div key={s.label}>
              <dt className="text-neutral-400">{s.label}</dt>
              <dd className="font-medium text-neutral-700">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
