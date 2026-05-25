import { Outlet } from "@tanstack/react-router";
import { TopBar } from "./TopBar";
import { MainHeader } from "./MainHeader";
import { MegaMenu } from "./MegaMenu";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/store/cart";
import { Toaster } from "@/components/ui/sonner";

export function Layout() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-40 shadow-sm">
          <TopBar />
          <MainHeader />
          <MegaMenu />
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <CartDrawer />
        <Toaster />
      </div>
    </CartProvider>
  );
}