import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Image as ImageIcon, FileText, Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/cms")({
  head: () => ({ meta: [{ title: "CMS — Shopzy Admin" }] }),
  component: () => <AdminShell title="Content Management"><Page /></AdminShell>,
});

const banners = [
  { id: 1, title: "Mega Summer Sale", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600", active: true },
  { id: 2, title: "Electronics Week", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", active: true },
  { id: 3, title: "Fashion Drop", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600", active: false },
];
const pages = [
  { slug: "about", title: "About Us", updated: "2 days ago" },
  { slug: "privacy", title: "Privacy Policy", updated: "1 week ago" },
  { slug: "terms", title: "Terms of Service", updated: "1 month ago" },
  { slug: "faq", title: "FAQ", updated: "4 days ago" },
];

function Page() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Homepage Banners</CardTitle>
          <Button size="sm"><Plus className="h-4 w-4" /> New banner</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {banners.map((b) => (
            <div key={b.id} className="flex items-center gap-3 rounded-md border border-border p-2">
              <img src={b.img} className="h-14 w-24 rounded object-cover" alt="" />
              <div className="flex-1 min-w-0"><div className="truncate font-medium">{b.title}</div>
                <Input defaultValue={`/promo/${b.id}`} className="mt-1 h-7 text-xs" /></div>
              <Switch defaultChecked={b.active} />
              <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Static Pages</CardTitle>
          <Button size="sm"><Plus className="h-4 w-4" /> New page</Button>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {pages.map((p) => (
            <div key={p.slug} className="flex items-center justify-between py-2.5">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground">/{p.slug} · updated {p.updated}</div>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}