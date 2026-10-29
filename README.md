# Priority Tracker — Airtable Interface Extension

InAir Academy training project, built on the [InAir boilerplate](https://github.com/inairstudio/inair-labs-ci-boilerplate) (React 19 + TypeScript + Tailwind). The boilerplate's original setup guide is in [docs/boilerplate.md](docs/boilerplate.md).

A component for Interface Designer that shows a **Status × Priority heatmap** of a table. Click a cell to filter the list, select a record to see its details, and **change its priority with one click**.

## Custom properties

All of these are set from the Interface Designer properties panel, so nothing is hard-coded to a base:

| Property | Type | Notes |
|---|---|---|
| Table | `table` | Defaults to the first table that has a "Priority" single select |
| Status field | `field` | Only single-select fields of the chosen table are listed |
| Priority field | `field` | Only single-select fields of the chosen table are listed; these are the values the buttons write |
| Title | `string` | Header text, defaults to "Priority Tracker" |
| Compact mode | `boolean` | Hides the heatmap |

`useCustomProperties` only rebuilds its property list when the schema changes. The selected table id is therefore read from `globalConfig` in `PriorityTrackerRoot`, and the tracker is remounted with that id as `key`. That way the field dropdowns always list the fields of the table you picked.

Naming convention: variables that come from the configuration are PascalCase (`Table`, `StatusField`, `PriorityField`, `Title`, `IsCompact`). Internal state, logic and functions are camelCase.

## Record selection

The training asks for `useRecordById`, but **the Interface Extensions SDK doesn't export it**. It only exists in the classic Blocks SDK. The equivalent built here:

- The selected record id is kept in the extension's URL params with `useSearchParams` (`?record=rec…`). The heatmap filter is kept the same way. Both survive reloads and work with back/forward.
- The record is resolved from `useRecords(Table)`. The detail panel re-renders when the selection changes and also when someone edits that record anywhere in the base.

## Interactivity

The priority buttons call `Table.updateRecordAsync(record, { [PriorityField.id]: { id } })`:

- Before that, the code checks `Table.hasPermissionToUpdateRecord`, so read-only users see the buttons disabled with a message instead of getting an error.
- "Open" uses `expandRecord`.
- There are no external data needs, so no fetch at all, and no Axios or extra runtime dependencies beyond the boilerplate.

## Structure

```
src/
├── index.tsx                      # initializeBlock({ interface })
├── components/
│   ├── PriorityTrackerRoot.tsx    # theme (useColorScheme) + remount on table change
│   ├── PriorityTracker.tsx        # custom properties, records, layout
│   ├── StatusHeatmap.tsx          # Status × Priority grid, click to filter
│   ├── RecordList.tsx             # filtered record list
│   ├── RecordDetail.tsx           # selected record + priority buttons
│   └── ChoicePill.tsx             # select choices with Airtable's own colors
├── hooks/useTrackerSelection.ts   # selection + filter in URL params
└── lib/
    ├── customProperties.ts        # property definitions + typed config reader
    ├── priorityMatrix.ts          # pure heatmap logic
    └── priorityMatrix.test.ts
```

## Development

```bash
pnpm install
pnpm check         # typecheck + lint + unit tests
pnpm dev           # run against the dev block (scripts/block-config.json)
pnpm release:dev   # needs AIRTABLE_PAT (block:manage) in .env
```

The dev block (`blk0MeneCLyltjPoQ`) was created in the Builder Hub (https://airtable.com/create/extensions). Block IDs created any other way (for example through the Airtable API) fail on `block release` with `airtableApiBlockNotFound`.

`release:dev` loads `.env` with `. .env`, so it needs a POSIX shell (Git Bash on Windows). `block release` prompts for a release comment.

The test base is **Interface Extension Training - Robert** (`apphSEgMHAG1XuH00`) in the InAir - Playground workspace. It has a Tasks table with Status, Priority, Due date and Notes.
