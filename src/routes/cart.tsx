import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/PageStub";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart — Shopzy" }] }),
  component: () => (
    <PageStub
      title="Your Cart"
      description="Items you've added show up here. Continue shopping for more deals."
    />
  ),
});