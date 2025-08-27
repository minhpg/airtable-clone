import { Header } from "./header";
import { RecentBases } from "./recent-bases";
import { Sidebar } from "./sidebar";
import { StartCards } from "./start-cards";
import { TabGroups } from "./tab-groups";

export function AirtableLayout() {
  return (
    <div className="relative flex h-screen flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <h1 className="mb-8 text-3xl font-semibold">Home</h1>
            <StartCards />
            <RecentBases />
          </div>
        </main>
      </div>
      <TabGroups />
    </div>
  );
}
