import type { MatrixFilter, TrackerRow } from "@lib/priorityMatrix";
import { cn } from "@lib/utils";

type Props = {
    rows: TrackerRow[];
    selectedRecordId: string | null;
    filter: MatrixFilter;
    onSelect: (recordId: string) => void;
    onClearFilter: () => void;
};

export function RecordList({ rows, selectedRecordId, filter, onSelect, onClearFilter }: Props) {
    const isFiltered = Boolean(filter.status || filter.priority);
    return (
        <section className="flex min-w-0 flex-col rounded-lg border border-border">
            <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2 text-sm">
                <span className="truncate text-muted-foreground">
                    {isFiltered ? `${filter.status} · ${filter.priority}` : "All records"}
                </span>
                {isFiltered && (
                    <button type="button" className="cursor-pointer text-xs underline" onClick={onClearFilter}>
                        Clear filter
                    </button>
                )}
            </div>
            <ul className="max-h-80 overflow-y-auto">
                {rows.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No records</li>}
                {rows.map((row) => (
                    <li key={row.id}>
                        <button
                            type="button"
                            onClick={() => onSelect(row.id)}
                            aria-current={row.id === selectedRecordId}
                            className={cn(
                                "flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-muted",
                                row.id === selectedRecordId && "bg-muted font-medium",
                            )}
                        >
                            <span className="truncate">{row.name}</span>
                            <span className="shrink-0 text-xs text-muted-foreground">{row.priorityName ?? "—"}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
