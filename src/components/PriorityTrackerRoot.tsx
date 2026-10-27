import { useColorScheme, useGlobalConfig } from "@airtable/blocks/interface/ui";
import { Toaster } from "@ui";
import { PropertyKeys } from "@lib/customProperties";
import { cn } from "@lib/utils";
import { PriorityTracker } from "./PriorityTracker";

export function PriorityTrackerRoot() {
    const globalConfig = useGlobalConfig();
    const { colorScheme } = useColorScheme();
    const selectedTableId = globalConfig.get(PropertyKeys.Table) as string | undefined;

    return (
        <div className={cn(colorScheme === "dark" && "dark", "min-h-screen")}>
            <div className="min-h-screen bg-background p-4 text-foreground">
                {/* Remount when the builder picks another table so the field dropdowns follow it. */}
                <PriorityTracker key={selectedTableId ?? "default"} selectedTableId={selectedTableId} />
            </div>
            <Toaster />
        </div>
    );
}
