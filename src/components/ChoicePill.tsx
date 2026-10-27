import { colorUtils } from "@airtable/blocks/interface/ui";
import type { Choice } from "@lib/priorityMatrix";
import { cn } from "@lib/utils";

// Renders a select choice with Airtable's own color, so it looks like a native cell value.
export function ChoicePill({ choice, className }: { choice: Choice | null; className?: string }) {
    if (!choice) return <span className={cn("text-xs text-muted-foreground", className)}>—</span>;
    const background = choice.color ? colorUtils.getHexForColor(choice.color) : null;
    const isLight = choice.color ? colorUtils.shouldUseLightTextOnColor(choice.color) : false;
    return (
        <span
            className={cn("inline-flex max-w-full truncate rounded-full px-2 py-0.5 text-xs", !background && "bg-muted", className)}
            style={background ? { backgroundColor: background, color: isLight ? "#fff" : "#1d1f25" } : undefined}
        >
            {choice.name}
        </span>
    );
}
