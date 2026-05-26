import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/PageStub";

export const Route = createFileRoute("/top-ranking")({
  head: () => ({ meta: [{ title: "Top Ranking — Shopzy" }] }),
  component: () => (
    <PageStub
      title="👑 Top Ranking"
      description="The most popular products this week, ranked by customers."
    />
  ),
});