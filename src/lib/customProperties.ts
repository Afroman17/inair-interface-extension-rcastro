import type { Base, Field, Table } from "@airtable/blocks/interface/models";

// Custom properties shown in the Interface Designer sidebar. Builders pick the table and the
// two single-select fields, so the extension works on any base without hard-coded names.
export const PropertyKeys = {
    Table: "table",
    StatusField: "statusField",
    PriorityField: "priorityField",
    Title: "title",
    IsCompact: "isCompact",
} as const;

const isSingleSelect = (field: { config: { type: string } }) => field.config.type === "singleSelect";

function findDefaultField(table: Table | undefined, nameHint: string): Field | undefined {
    return table?.fields.find((field) => isSingleSelect(field) && field.name.toLowerCase().includes(nameHint));
}

// The field dropdowns must list the fields of the table the builder picked. useCustomProperties
// only rebuilds the property list on schema changes, so the caller passes the selected table id
// (read from globalConfig) and remounts when it changes — see PriorityTrackerRoot.
export function buildCustomProperties(base: Base, selectedTableId: string | undefined) {
    const defaultTable = base.tables.find((table) => findDefaultField(table, "priority")) ?? base.tables[0];
    const Table = base.tables.find((table) => table.id === selectedTableId) ?? defaultTable;
    const fieldProperty = (key: string, label: string, nameHint: string) =>
        Table
            ? [{
                key,
                label,
                type: "field" as const,
                table: Table,
                shouldFieldBeAllowed: isSingleSelect,
                defaultValue: findDefaultField(Table, nameHint),
            }]
            : [];

    return [
        { key: PropertyKeys.Table, label: "Table", type: "table" as const, defaultValue: defaultTable },
        ...fieldProperty(PropertyKeys.StatusField, "Status field (single select)", "status"),
        ...fieldProperty(PropertyKeys.PriorityField, "Priority field (single select)", "priority"),
        { key: PropertyKeys.Title, label: "Title", type: "string" as const, defaultValue: "Priority Tracker" },
        { key: PropertyKeys.IsCompact, label: "Compact mode (hide the heatmap)", type: "boolean" as const, defaultValue: false },
    ];
}

export type TrackerConfig =
    | { isValid: true; Table: Table; StatusField: Field; PriorityField: Field; Title: string; IsCompact: boolean }
    | { isValid: false; missing: string[]; Title: string };

export function readTrackerConfig(values: Record<string, unknown>): TrackerConfig {
    const Table = values[PropertyKeys.Table] as Table | undefined;
    const StatusField = values[PropertyKeys.StatusField] as Field | undefined;
    const PriorityField = values[PropertyKeys.PriorityField] as Field | undefined;
    const Title = (values[PropertyKeys.Title] as string | undefined)?.trim() || "Priority Tracker";
    const IsCompact = Boolean(values[PropertyKeys.IsCompact]);

    const missing = [
        !Table && "a table",
        !StatusField && "a Status single-select field",
        !PriorityField && "a Priority single-select field",
    ].filter((item): item is string => Boolean(item));

    if (!Table || !StatusField || !PriorityField) return { isValid: false, missing, Title };
    return { isValid: true, Table, StatusField, PriorityField, Title, IsCompact };
}
