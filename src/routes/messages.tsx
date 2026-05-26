import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/PageStub";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Messages — Shopzy" }] }),
  component: () => (
    <PageStub
      title="Messages"
      description="Chat with sellers and support. You have no new messages."
      showProducts={false}
    />
  ),
});