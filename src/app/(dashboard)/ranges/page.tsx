import { SavedRangeList } from "@/components/ranges/saved-range-list";

const DEMO_RANGES = [
  {
    id: "range-1",
    name: "CO Open",
    textValue: "22+,A2s+,K9s+,QTs+,JTs,ATo+,KJo+",
  },
  {
    id: "range-2",
    name: "BB Defend",
    textValue: "44+,A2s+,K8s+,Q9s+,J9s+,T9s,98s,AJo+,KQo",
  },
  {
    id: "range-3",
    name: "3-Bet Value",
    textValue: "TT+,AQs+,AKo",
  },
];

export default function RangesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-table backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brass-300">
          Range Library
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Saved Ranges</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-stone-300">
          Create, rename, and reuse your personal ranges across projects and
          scenario reviews.
        </p>
        <div className="mt-8">
          <SavedRangeList ranges={DEMO_RANGES} />
        </div>
      </section>
    </main>
  );
}
