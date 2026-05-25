import { Globe, Phone, Truck, HelpCircle, Smartphone, Sun, Moon } from "lucide-react";
import { useApp } from "@/store/app";

export function TopBar() {
  const { theme, toggleTheme, lang, setLang } = useApp();
  return (
    <div className="hidden bg-header-top text-header-top-foreground md:block">
      <div className="container mx-auto flex h-9 items-center justify-between gap-4 px-4 text-xs">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 hover:text-primary">
            <Smartphone className="h-3.5 w-3.5" /> Download App
          </button>
          <span className="opacity-60">|</span>
          <button className="hover:text-primary">Sell on Shopzy</button>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 hover:text-primary">
            <Phone className="h-3.5 w-3.5" /> Customer Care
          </button>
          <button className="flex items-center gap-1 hover:text-primary">
            <Truck className="h-3.5 w-3.5" /> Track Order
          </button>
          <button className="flex items-center gap-1 hover:text-primary">
            <HelpCircle className="h-3.5 w-3.5" /> Help
          </button>
          <button
            onClick={() => setLang(lang === "en" ? "bn" : "en")}
            className="flex items-center gap-1 hover:text-primary"
            aria-label="Switch language"
          >
            <Globe className="h-3.5 w-3.5" /> {lang.toUpperCase()}
          </button>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1 hover:text-primary"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}