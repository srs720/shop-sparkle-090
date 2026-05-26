import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/PageStub";

export const Route = createFileRoute("/promotions/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug.replace(/-/g, " ")} — Shopzy` }],
  }),
  component: PromoPage,
});

function PromoPage() {
  const { slug } = Route.useParams();
  const title = slug
    .split("-")
    .map((s: string) => s[0]?.toUpperCase() + s.slice(1))
    .join(" ");
  return (
    <PageStub
      title={title}
      description="Exclusive deals curated just for you. Shop the latest promotions below."
    />
  );
}