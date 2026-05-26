import { Outlet, useRouterState } from "@tanstack/react-router";
import { TopBar } from "./TopBar";
import { MainHeader } from "./MainHeader";
import { MegaMenu } from "./MegaMenu";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/store/cart";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/store/app";
import { FloatingWidgets } from "./FloatingWidgets";
import { AuthModal } from "@/components/auth/AuthModal";
import { NotificationOptIn } from "./NotificationOptIn";

export function Layout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isMobileHome = pathname === "/";
  return (
    <AppProvider>
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-background">
        {!isMobileHome && (
          <header className="sticky top-0 z-40 shadow-sm">
            <TopBar />
            <MainHeader />
            <MegaMenu />
          </header>
        )}
        <main className="flex-1" id="main">
          <Outlet />
        </main>
        {!isMobileHome && <Footer />}
        <CartDrawer />
        <AuthModal />
        {!isMobileHome && <FloatingWidgets />}
        <NotificationOptIn />
        <Toaster />
      </div>
    </CartProvider>
    </AppProvider>
  );
}