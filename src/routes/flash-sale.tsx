import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/PageStub";

export const Route = createFileRoute("/flash-sale")({
  head: () => ({ meta: [{ title: "Flash Sale — Shopzy" }] }),
  component: () => (
    <PageStub
      title="⚡ Flash Sale"
      description="Limited-time deals. Grab them before they're gone!"
    />
  ),
});