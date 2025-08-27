import { AirtableLayout } from "@/components/airtable/layout";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <AirtableLayout />
    </HydrateClient>
  );
}
