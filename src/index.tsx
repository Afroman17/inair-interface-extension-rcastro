import { initializeBlock } from "@airtable/blocks/interface/ui";
import { PriorityTrackerRoot } from "@components/PriorityTrackerRoot";
import "@styles/globals.css";

initializeBlock({ interface: () => <PriorityTrackerRoot /> });
