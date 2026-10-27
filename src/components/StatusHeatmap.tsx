import { countFor, emptyBucket, heatLevel, toggleCellFilter, type Choice, type MatrixFilter, type PriorityMatrix } from "@lib/priorityMatrix";
import { cn } from "@lib/utils";
import { ChoicePill } from "./ChoicePill";

type Props = {
    matrix: PriorityMatrix;
    filter: MatrixFilter;
    statusChoices: Choice[];
    priorityChoices: Choice[];
    onFilterChange: (filter: MatrixFilter) => void;
};

const heatClasses = ["bg-transparent", "bg-primary/10", "bg-primary/25", "bg-primary/45", "bg-primary/70 text-primary-foreground"];

function choiceFor(choices: Choice[], name: string): Choice {
    return choices.find((choice) => choice.name === name) ?? { id: name, name };
}

export function StatusHeatmap({ matrix, filter, statusChoices, priorityChoices, onFilterChange }: Props) {
    if (matrix.total === 0) return null;
    return (
        <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">Status \ Priority</th>
                        {matrix.priorities.map((priority) => (
                            <th key={priority} className="p-2 text-center font-normal">
                                {priority === emptyBucket ? <span className="text-xs text-muted-foreground">{emptyBucket}</span> : <ChoicePill choice={choiceFor(priorityChoices, priority)} />}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {matrix.statuses.map((status) => (
                        <tr key={status} className="border-t border-border">
                            <th className="p-2 text-left font-normal">
                                {status === emptyBucket ? <span className="text-xs text-muted-foreground">{emptyBucket}</span> : <ChoicePill choice={choiceFor(statusChoices, status)} />}
                            </th>
                            {matrix.priorities.map((priority) => {
                                const count = countFor(matrix, status, priority);
                                const isActive = filter.status === status && filter.priority === priority;
                                return (
                                    <td key={priority} className="p-1 text-center">
                                        <button
                                            type="button"
                                            disabled={count === 0 && !isActive}
                                            onClick={() => onFilterChange(toggleCellFilter(filter, status, priority))}
                                            aria-pressed={isActive}
                                            aria-label={`${count} records with status ${status} and priority ${priority}`}
                                            className={cn(
                                                "h-9 w-full min-w-10 cursor-pointer rounded-md tabular-nums transition-colors disabled:cursor-default disabled:text-muted-foreground/50",
                                                heatClasses[heatLevel(count, matrix.max)],
                                                isActive && "ring-2 ring-ring",
                                            )}
                                        >
                                            {count}
                                        </button>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
