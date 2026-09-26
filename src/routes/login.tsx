import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Shopzy" },
      { name: "description", content: "Sign in or create your Shopzy account to shop, track orders and earn rewards." },
      { property: "og:title", content: "Sign in — Shopzy" },
      { property: "og:description", content: "Sign in or create your Shopzy account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (user) navigate({ to: "/account", replace: true }); }, [user, navigate]);

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-6 shadow-lg">
        <AuthForm onDone={() => navigate({ to: "/account" })} />
        <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-primary">← Back to home</Link>
      </div>
    </div>
  );
}
