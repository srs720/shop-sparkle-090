import { type ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { BottomNav } from "@/components/home/ali/BottomNav";
import { cn } from "@/lib/utils";

type UserMobileLayoutProps = {
  title?: string;
  children: ReactNode;
  /** Hide the sticky top header (use on home page) */
  hideHeader?: boolean;
  /** Hide back button (e.g. top-level tabs) */
  hideBack?: boolean;
  /** Optional right slot (icons, actions) */
  rightSlot?: ReactNode;
  /** Optional extra footer pinned above the bottom nav (e.g. cart summary bar) */
  footer?: ReactNode;
  /** Hide the bottom tab bar (e.g. checkout) */
  hideBottomNav?: boolean;
  /** Override main padding (default px-3 py-3 pb-20) */
  contentClassName?: string;
};

export function UserMobileLayout({
  title,
  children,
  hideHeader,
  hideBack,
  rightSlot,
  footer,
  hideBottomNav,
  contentClassName,
}: UserMobileLayoutProps) {
  const router = useRouter();
  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 md:py-6">
      {/* Desktop: render a centered mobile mockup */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-gray-50 shadow-none md:min-h-[calc(100vh-3rem)] md:rounded-2xl md:shadow-xl md:ring-1 md:ring-black/5">
        {!hideHeader && (
          <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-gray-100 bg-white px-2 shadow-sm md:rounded-t-2xl">
            {!hideBack && (
              <button
                type="button"
                onClick={goBack}
                aria-label="Go back"
                className="grid h-10 w-10 place-content-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <h1 className="flex-1 truncate text-base font-semibold text-gray-900">
              {title}
            </h1>
            {rightSlot && <div className="flex items-center gap-1 pr-1">{rightSlot}</div>}
          </header>
        )}

        <main
          className={cn(
            "flex-1",
            contentClassName ?? "px-3 py-3",
            !hideBottomNav && "pb-20",
          )}
        >
          {children}
        </main>

        {footer && (
          <div className="sticky bottom-16 z-30 border-t border-gray-100 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
            {footer}
          </div>
        )}

        {!hideBottomNav && (
          <div className="sticky bottom-0 z-30 md:rounded-b-2xl md:overflow-hidden">
            <BottomNavGray />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Mobile bottom nav matching the rose/pink design system.
 * Wraps the existing BottomNav but with a gray-50 themed container.
 */
function BottomNavGray() {
  return (
    <div className="[&_nav]:!bg-white [&_nav]:!border-gray-100 [&_.text-hot]:!text-rose-600 [&_.bg-hot]:!bg-rose-600 [&_.text-hot-foreground]:!text-white">
      <BottomNav />
    </div>
  );
}

// Convenience export so callers can render: <Link {...} /> with type safety
export { Link };