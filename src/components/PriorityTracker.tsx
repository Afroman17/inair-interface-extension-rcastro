import { useCustomProperties, useRecords } from "@airtable/blocks/interface/ui";
import type { Base, Field, Table } from "@airtable/blocks/interface/models";
import { useCallback, useMemo } from "react";
import { buildCustomProperties, readTrackerConfig } from "@lib/customProperties";
import { buildMatrix, matchesFilter, type Choice, type TrackerRow } from "@lib/priorityMatrix";
import { useTrackerSelection } from "@hooks/useTrackerSelection";
import { RecordDetail } from "./RecordDetail";
import { RecordList } from "./RecordList";
import { StatusHeatmap } from "./StatusHeatmap";

type Props = { selectedTableId: string | undefined };

export function PriorityTracker({ selectedTableId }: Props) {
    const getCustomProperties = useCallback((base: Base) => buildCustomProperties(base, selectedTableId), [selectedTableId]);
    const { customPropertyValueByKey, errorState } = useCustomProperties(getCustomProperties);
    const config = readTrackerConfig(customPropertyValueByKey);

    if (errorState) {
        return <Notice title="Couldn't load the settings" body={errorState.error.message} />;
    }
    if (!config.isValid) {
        return <Notice title={config.Title} body={`Open the properties panel and pick ${config.missing.join(", ")}.`} />;
    }
    return (
        <TrackerView
            Table={config.Table}
            StatusField={config.StatusField}
            PriorityField={config.PriorityField}
            Title={config.Title}
            IsCompact={config.IsCompact}
        />
    );
}

type TrackerViewProps = { Table: Table; StatusField: Field; PriorityField: Field; Title: string; IsCompact: boolean };

function choicesOf(options: Field["options"]): Choice[] {
    return (options?.choices as Choice[] | undefined) ?? [];
}

function TrackerView({ Table, StatusField, PriorityField, Title, IsCompact }: TrackerViewProps) {
    const records = useRecords(Table);
    const { selectedRecordId, filter, selectRecord, setFilter } = useTrackerSelection();
    const statusOptions = StatusField.options;
    const priorityOptions = PriorityField.options;
    const statusChoices = useMemo(() => choicesOf(statusOptions), [statusOptions]);
    const priorityChoices = useMemo(() => choicesOf(priorityOptions), [priorityOptions]);

    const rows: TrackerRow[] = useMemo(
        () =>
            records.map((record) => ({
                id: record.id,
                name: record.name || "Unnamed record",
                statusName: (record.getCellValue(StatusField) as Choice | null)?.name ?? null,
                priorityName: (record.getCellValue(PriorityField) as Choice | null)?.name ?? null,
            })),
        [records, StatusField, PriorityField],
    );
    const matrix = useMemo(() => buildMatrix(rows, statusChoices, priorityChoices), [rows, statusChoices, priorityChoices]);
    const visibleRows = rows.filter((row) => matchesFilter(row, filter));
    const selectedRecord = records.find((record) => record.id === selectedRecordId) ?? null;

    return (
        <div className="flex flex-col gap-4">
            <header className="flex items-baseline justify-between gap-2">
                <h1 className="text-lg font-semibold">{Title}</h1>
                <span className="text-sm text-muted-foreground">{rows.length} records</span>
            </header>
            {!IsCompact && (
                <StatusHeatmap
                    matrix={matrix}
                    filter={filter}
                    statusChoices={statusChoices}
                    priorityChoices={priorityChoices}
                    onFilterChange={setFilter}
                />
            )}
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <RecordList
                    rows={visibleRows}
                    selectedRecordId={selectedRecordId}
                    filter={filter}
                    onSelect={selectRecord}
                    onClearFilter={() => setFilter({ status: null, priority: null })}
                />
                <RecordDetail
                    Table={Table}
                    StatusField={StatusField}
                    PriorityField={PriorityField}
                    record={selectedRecord}
                    priorityChoices={priorityChoices}
                    onClose={() => selectRecord(null)}
                />
            </div>
        </div>
    );
}

function Notice({ title, body }: { title: string; body: string }) {
    return (
        <div className="rounded-lg border border-border p-6 text-center">
            <h1 className="text-lg font-semibold">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
        </div>
    );
}
