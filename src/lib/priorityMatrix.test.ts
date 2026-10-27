import { describe, expect, it } from "vitest";
import {
    buildMatrix,
    countFor,
    emptyBucket,
    heatLevel,
    matchesFilter,
    toggleCellFilter,
    type TrackerRow,
} from "./priorityMatrix";

const statuses = [{ id: "s1", name: "Todo" }, { id: "s2", name: "Done" }];
const priorities = [{ id: "p1", name: "Low" }, { id: "p2", name: "High" }];
const row = (id: string, statusName: string | null, priorityName: string | null): TrackerRow => ({
    id,
    name: id,
    statusName,
    priorityName,
});

describe("buildMatrix", () => {
    it("counts records per status × priority cell", () => {
        const matrix = buildMatrix(
            [row("a", "Todo", "High"), row("b", "Todo", "High"), row("c", "Done", "Low")],
            statuses,
            priorities,
        );
        expect(countFor(matrix, "Todo", "High")).toBe(2);
        expect(countFor(matrix, "Done", "Low")).toBe(1);
        expect(countFor(matrix, "Done", "High")).toBe(0);
        expect(matrix.max).toBe(2);
        expect(matrix.total).toBe(3);
    });

    it("adds an empty bucket only when some record has no value", () => {
        const withoutEmpty = buildMatrix([row("a", "Todo", "Low")], statuses, priorities);
        expect(withoutEmpty.priorities).toEqual(["Low", "High"]);

        const withEmpty = buildMatrix([row("a", "Todo", null)], statuses, priorities);
        expect(withEmpty.priorities).toEqual(["Low", "High", emptyBucket]);
        expect(countFor(withEmpty, "Todo", emptyBucket)).toBe(1);
    });

    it("handles an empty table", () => {
        const matrix = buildMatrix([], statuses, priorities);
        expect(matrix.max).toBe(0);
        expect(matrix.total).toBe(0);
    });
});

describe("heatLevel", () => {
    it("scales counts into 4 levels relative to the max", () => {
        expect(heatLevel(0, 8)).toBe(0);
        expect(heatLevel(1, 8)).toBe(1);
        expect(heatLevel(4, 8)).toBe(2);
        expect(heatLevel(8, 8)).toBe(4);
        expect(heatLevel(3, 0)).toBe(0);
    });
});

describe("filters", () => {
    it("matches rows by cell, treating missing values as the empty bucket", () => {
        expect(matchesFilter(row("a", "Todo", null), { status: "Todo", priority: emptyBucket })).toBe(true);
        expect(matchesFilter(row("a", "Todo", "Low"), { status: "Done", priority: null })).toBe(false);
        expect(matchesFilter(row("a", "Todo", "Low"), { status: null, priority: null })).toBe(true);
    });

    it("clicking the same cell again clears the filter", () => {
        const first = toggleCellFilter({ status: null, priority: null }, "Todo", "Low");
        expect(first).toEqual({ status: "Todo", priority: "Low" });
        expect(toggleCellFilter(first, "Todo", "Low")).toEqual({ status: null, priority: null });
    });
});
