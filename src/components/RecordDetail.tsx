import { expandRecord } from "@airtable/blocks/interface/ui";
import type { Field, Record as AirtableRecord, Table } from "@airtable/blocks/interface/models";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@ui";
import type { Choice } from "@lib/priorityMatrix";
import { ChoicePill } from "./ChoicePill";

type Props = {
    Table: Table;
    StatusField: Field;
    PriorityField: Field;
    record: AirtableRecord | null;
    priorityChoices: Choice[];
    onClose: () => void;
};

export function RecordDetail({ Table, StatusField, PriorityField, record, priorityChoices, onClose }: Props) {
    const [pendingChoiceId, setPendingChoiceId] = useState<string | null>(null);

    if (!record) {
        return (
            <section className="flex items-center justify-center rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                Select a record to see its details
            </section>
        );
    }

    const currentPriority = record.getCellValue(PriorityField) as Choice | null;
    const status = record.getCellValue(StatusField) as Choice | null;
    const canUpdate = Table.hasPermissionToUpdateRecord(record, { [PriorityField.id]: undefined });
    const canExpand = Table.hasPermissionToExpandRecords();

    const setPriority = async (choice: Choice) => {
        setPendingChoiceId(choice.id);
        try {
            await Table.updateRecordAsync(record, { [PriorityField.id]: { id: choice.id } });
            toast.success(`${record.name} → ${choice.name}`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Couldn't update the priority");
        } finally {
            setPendingChoiceId(null);
        }
    };

    return (
        <section className="flex min-w-0 flex-col gap-4 rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-2">
                <h2 className="min-w-0 truncate text-base font-semibold">{record.name || "Unnamed record"}</h2>
                <div className="flex shrink-0 gap-1">
                    {canExpand && (
                        <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => expandRecord(record)}>
                            Open
                        </Button>
                    )}
                    <Button variant="ghost" size="sm" className="cursor-pointer" onClick={onClose} aria-label="Close details">
                        ✕
                    </Button>
                </div>
            </div>
            <dl className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">{StatusField.name}</dt>
                <dd><ChoicePill choice={status} /></dd>
                <dt className="text-muted-foreground">{PriorityField.name}</dt>
                <dd><ChoicePill choice={currentPriority} /></dd>
            </dl>
            <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground">Set {PriorityField.name.toLowerCase()}</span>
                <div className="flex flex-wrap gap-2">
                    {priorityChoices.map((choice) => (
                        <Button
                            key={choice.id}
                            size="sm"
                            variant={currentPriority?.id === choice.id ? "default" : "outline"}
                            className="cursor-pointer"
                            disabled={!canUpdate || pendingChoiceId !== null || currentPriority?.id === choice.id}
                            onClick={() => setPriority(choice)}
                        >
                            {pendingChoiceId === choice.id ? "Saving…" : choice.name}
                        </Button>
                    ))}
                </div>
                {!canUpdate && <p className="text-xs text-muted-foreground">You don&apos;t have permission to edit this field.</p>}
            </div>
        </section>
    );
}
