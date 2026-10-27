import { useSearchParams } from "@airtable/blocks/interface/ui";
import { useCallback } from "react";
import type { MatrixFilter } from "@lib/priorityMatrix";

// The selected record and the heatmap filter live in the URL (scoped to this extension), so they
// survive reloads, work with back/forward and can be deep-linked. The Interface SDK has no
// useRecordById: the selected record is resolved from useRecords by this id, which keeps the
// component reactive both to selection changes and to edits of the record itself.
export function useTrackerSelection() {
    const { searchParams, setSearchParamsAsync } = useSearchParams();

    const selectedRecordId = searchParams.record ?? null;
    const filter: MatrixFilter = { status: searchParams.status ?? null, priority: searchParams.priority ?? null };

    const update = useCallback(
        (changes: Record<string, string | null>) =>
            setSearchParamsAsync((previous) => {
                const next = { ...previous };
                for (const [key, value] of Object.entries(changes)) {
                    if (value === null) delete next[key];
                    else next[key] = value;
                }
                return next;
            }),
        [setSearchParamsAsync],
    );

    const selectRecord = useCallback((recordId: string | null) => update({ record: recordId }), [update]);
    const setFilter = useCallback(
        (nextFilter: MatrixFilter) => update({ status: nextFilter.status, priority: nextFilter.priority }),
        [update],
    );

    return { selectedRecordId, filter, selectRecord, setFilter };
}
