type SavedRangeListProps = {
  ranges: Array<{
    id: string;
    name: string;
    textValue: string;
  }>;
};

export function SavedRangeList({ ranges }: SavedRangeListProps) {
  return (
    <ul className="space-y-3">
      {ranges.map((range) => (
        <li
          key={range.id}
          className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4"
        >
          <div className="text-base font-semibold text-white">{range.name}</div>
          <div className="mt-2 text-sm leading-6 text-stone-400">
            {range.textValue}
          </div>
        </li>
      ))}
    </ul>
  );
}
