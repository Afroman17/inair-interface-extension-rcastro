import { initializeBlock } from '@airtable/blocks/interface/ui';
import { Button, Toaster } from "@ui";
import { toast } from "sonner";
import '@styles/globals.css';

function App() {
    // YOUR CODE GOES HERE
    return (
        <div
            className="p-4 sm:p-8 min-h-screen relative bg-gray-gray50 dark:bg-gray-gray800"
        >
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">Hello World</h1>
                <div className="flex gap-4">
                    <Button variant="default" className="cursor-pointer" onClick={() => toast.success("I'm a success toast")}>Default</Button>
                    <Button variant="outline" className="cursor-pointer" onClick={() => toast.error("I'm an error toast")}>Outline</Button>
                    <Button variant="ghost" className="cursor-pointer" onClick={() => toast.warning("I'm a warning toast")}>Ghost</Button>
                    <Button variant="secondary" className="cursor-pointer" onClick={() => toast.info("I'm an info toast")}>Secondary</Button>
                </div>
            </div>
            <Toaster  />
        </div>

    );
}

initializeBlock({ interface: () => <App /> });
