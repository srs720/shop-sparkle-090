import { createFileRoute } from "@tanstack/react-router";
import { MobileSearchHeader } from "@/components/home/ali/MobileSearchHeader";
import { TrustBadges } from "@/components/home/ali/TrustBadges";
import { HeroBanner } from "@/components/home/ali/HeroBanner";
import { QuickCategories } from "@/components/home/ali/QuickCategories";
import { Vouchers } from "@/components/home/ali/Vouchers";
import { MegaSaleBanner } from "@/components/home/ali/MegaSaleBanner";
import { FlashSaleRow } from "@/components/home/ali/FlashSaleRow";
import { TopRanking } from "@/components/home/ali/TopRanking";
import { FeedTabs } from "@/components/home/ali/FeedTabs";
import { ForYouGrid } from "@/components/home/ali/ForYouGrid";
import { BottomNav } from "@/components/home/ali/BottomNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shopzy — Shop smarter, save bigger" },
      {
        name: "description",
        content:
          "Daily deals on fashion, electronics, home & more. Flash sales, vouchers and free delivery.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <MobileSearchHeader />
      <TrustBadges />
      <div className="mx-auto w-full max-w-3xl flex-1 space-y-3 px-3 py-3">
        <HeroBanner />
        <QuickCategories />
        <Vouchers />
        <MegaSaleBanner />
        <FlashSaleRow />
        <TopRanking />
        <FeedTabs />
        <ForYouGrid />
      </div>
      <BottomNav />
    </div>
  );
}
