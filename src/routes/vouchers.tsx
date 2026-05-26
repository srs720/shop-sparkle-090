import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/PageStub";

export const Route = createFileRoute("/vouchers")({
  head: () => ({ meta: [{ title: "Vouchers — Shopzy" }] }),
  component: () => (
    <PageStub
      title="All Vouchers"
      description="Browse all available coupons and claim them to save more on your orders."
    />
  ),
});