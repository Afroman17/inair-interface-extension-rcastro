// Pure logic behind the Status × Priority heatmap. No SDK imports, so it is unit-testable.

export type Choice = { id: string; name: string; color?: string };

export type TrackerRow = {
    id: string;
    name: string;
    statusName: string | null;
    priorityName: string | null;
};

export type MatrixFilter = { status: string | null; priority: string | null };

// Records with an empty select land in this bucket instead of disappearing from the counts.
export const emptyBucket = "(empty)";

export function cellKey(status: string, priority: string): string {
    return `${status}\u0000${priority}`;
}

export type PriorityMatrix = {
    statuses: string[];
    priorities: string[];
    counts: Map<string, number>;
    max: number;
    total: number;
};

export function buildMatrix(rows: TrackerRow[], statusChoices: Choice[], priorityChoices: Choice[]): PriorityMatrix {
    const withEmpty = (choices: Choice[], hasEmpty: boolean) => [
        ...choices.map((choice) => choice.name),
        ...(hasEmpty ? [emptyBucket] : []),
    ];
    const statuses = withEmpty(statusChoices, rows.some((row) => !row.statusName));
    const priorities = withEmpty(priorityChoices, rows.some((row) => !row.priorityName));

    const counts = new Map<string, number>();
    for (const row of rows) {
        const key = cellKey(row.statusName ?? emptyBucket, row.priorityName ?? emptyBucket);
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return { statuses, priorities, counts, max: Math.max(0, ...counts.values()), total: rows.length };
}

export function countFor(matrix: PriorityMatrix, status: string, priority: string): number {
    return matrix.counts.get(cellKey(status, priority)) ?? 0;
}

// 0 = empty cell, 1–4 = increasing heat relative to the busiest cell.
export function heatLevel(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
    if (count === 0 || max === 0) return 0;
    return Math.max(1, Math.ceil((count / max) * 4)) as 1 | 2 | 3 | 4;
}

export function matchesFilter(row: TrackerRow, filter: MatrixFilter): boolean {
    const statusMatches = !filter.status || (row.statusName ?? emptyBucket) === filter.status;
    const priorityMatches = !filter.priority || (row.priorityName ?? emptyBucket) === filter.priority;
    return statusMatches && priorityMatches;
}

export function toggleCellFilter(current: MatrixFilter, status: string, priority: string): MatrixFilter {
    const isSameCell = current.status === status && current.priority === priority;
    return isSameCell ? { status: null, priority: null } : { status, priority };
}
