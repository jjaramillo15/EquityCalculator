import { SavedRangeList } from "@/components/ranges/saved-range-list";
import { getCurrentUser } from "@/lib/current-user";
import { listRangesForOwner } from "@/lib/workspace";
import { redirect } from "next/navigation";

export default async function RangesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const ranges = await listRangesForOwner(user.id);

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
          <SavedRangeList ranges={ranges} />
        </div>
      </section>
    </main>
  );
}
