import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Image as ImageIcon, FileText, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logAdminAction } from "@/lib/admin-helpers";

export const Route = createFileRoute("/admin/cms")({
  head: () => ({ meta: [{ title: "CMS — Shopzy Admin" }, { name: "description", content: "Manage homepage banners and static pages." }] }),
  component: () => <AdminShell title="Content Management"><Page /></AdminShell>,
});

type Banner = { id?: string; title: string; subtitle: string | null; image_url: string | null; link_url: string | null; badge: string | null; position: string; sort_order: number; active: boolean };
type CmsPage = { id?: string; slug: string; title: string; content: string; published: boolean; updated_at?: string };

const emptyBanner: Banner = { title: "", subtitle: "", image_url: "", link_url: "", badge: "", position: "hero", sort_order: 0, active: true };
const emptyPage: CmsPage = { slug: "", title: "", content: "", published: true };

function Page() {
  const qc = useQueryClient();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [page, setPage] = useState<CmsPage | null>(null);

  const banners = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("banners").select("*").order("sort_order");
      if (error) throw error; return data as (Banner & { id: string })[];
    },
  });
  const pages = useQuery({
    queryKey: ["admin-cms-pages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cms_pages").select("*").order("title");
      if (error) throw error; return data as (CmsPage & { id: string })[];
    },
  });

  const saveBanner = useMutation({
    mutationFn: async (b: Banner) => {
      if (!b.title.trim()) throw new Error("Title is required");
      const { id, ...rest } = b;
      const row = { ...rest, sort_order: Number(rest.sort_order) || 0 };
      const { error } = id ? await supabase.from("banners").update(row).eq("id", id) : await supabase.from("banners").insert(row);
      if (error) throw error;
      await logAdminAction(id ? "banner.update" : "banner.create", "banners", id ?? b.title);
    },
    onSuccess: () => { toast.success("Banner saved"); setBanner(null); qc.invalidateQueries({ queryKey: ["admin-banners"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const toggleBanner = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("banners").update({ active }).eq("id", id); if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-banners"] }), onError: (e: Error) => toast.error(e.message),
  });
  const deleteBanner = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("banners").delete().eq("id", id); if (error) throw error;
      await logAdminAction("banner.delete", "banners", id);
    },
    onSuccess: () => { toast.success("Banner deleted"); qc.invalidateQueries({ queryKey: ["admin-banners"] }); }, onError: (e: Error) => toast.error(e.message),
  });

  const savePage = useMutation({
    mutationFn: async (p: CmsPage) => {
      const slug = p.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
      if (!slug || !p.title.trim()) throw new Error("Title and slug are required");
      const row = { slug, title: p.title.trim(), content: p.content, published: p.published };
      const { error } = p.id ? await supabase.from("cms_pages").update(row).eq("id", p.id) : await supabase.from("cms_pages").insert(row);
      if (error) throw error;
      await logAdminAction(p.id ? "page.update" : "page.create", "cms_pages", slug);
    },
    onSuccess: () => { toast.success("Page saved"); setPage(null); qc.invalidateQueries({ queryKey: ["admin-cms-pages"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const deletePage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cms_pages").delete().eq("id", id); if (error) throw error;
      await logAdminAction("page.delete", "cms_pages", id);
    },
    onSuccess: () => { toast.success("Page deleted"); qc.invalidateQueries({ queryKey: ["admin-cms-pages"] }); }, onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Homepage Banners</CardTitle>
          <Button size="sm" onClick={() => setBanner({ ...emptyBanner })}><Plus className="h-4 w-4" /> New banner</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {banners.isLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            : banners.error ? <p className="text-sm text-destructive">{(banners.error as Error).message}</p>
            : banners.data!.length === 0 ? <p className="text-sm text-muted-foreground">No banners yet.</p>
            : banners.data!.map((b) => (
            <div key={b.id} className="flex items-center gap-3 rounded-md border border-border p-2">
              {b.image_url ? <img src={b.image_url} className="h-14 w-24 rounded object-cover" alt="" /> : <div className="h-14 w-24 rounded bg-muted" />}
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium">{b.title}</div>
                <div className="truncate text-xs text-muted-foreground">{b.position} · {b.link_url || "no link"}</div>
              </div>
              <Switch checked={b.active} onCheckedChange={(v) => toggleBanner.mutate({ id: b.id, active: v })} />
              <Button size="icon" variant="ghost" aria-label="Edit banner" onClick={() => setBanner({ ...b })}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" aria-label="Delete banner" onClick={() => confirm(`Delete "${b.title}"?`) && deleteBanner.mutate(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Static Pages</CardTitle>
          <Button size="sm" onClick={() => setPage({ ...emptyPage })}><Plus className="h-4 w-4" /> New page</Button>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {pages.isLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            : pages.error ? <p className="text-sm text-destructive">{(pages.error as Error).message}</p>
            : pages.data!.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-2.5">
              <div>
                <div className="font-medium">{p.title} {!p.published && <span className="text-xs text-muted-foreground">(draft)</span>}</div>
                <div className="text-xs text-muted-foreground">/{p.slug} · updated {new Date(p.updated_at!).toLocaleDateString()}</div>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => setPage({ ...p })}>Edit</Button>
                <Button size="icon" variant="ghost" aria-label="Delete page" onClick={() => confirm(`Delete "${p.title}"?`) && deletePage.mutate(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={!!banner} onOpenChange={(o) => !o && setBanner(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{banner?.id ? "Edit banner" : "New banner"}</DialogTitle></DialogHeader>
          {banner && (
            <div className="grid gap-3">
              <div><Label>Title</Label><Input value={banner.title} onChange={(e) => setBanner({ ...banner, title: e.target.value })} /></div>
              <div><Label>Subtitle</Label><Input value={banner.subtitle ?? ""} onChange={(e) => setBanner({ ...banner, subtitle: e.target.value })} /></div>
              <div><Label>Image URL</Label><Input value={banner.image_url ?? ""} onChange={(e) => setBanner({ ...banner, image_url: e.target.value })} placeholder="https://…" /></div>
              <div><Label>Link</Label><Input value={banner.link_url ?? ""} onChange={(e) => setBanner({ ...banner, link_url: e.target.value })} placeholder="/promotions/summer-sale" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Badge</Label><Input value={banner.badge ?? ""} onChange={(e) => setBanner({ ...banner, badge: e.target.value })} /></div>
                <div><Label>Position</Label><Input value={banner.position} onChange={(e) => setBanner({ ...banner, position: e.target.value })} /></div>
                <div><Label>Order</Label><Input type="number" value={banner.sort_order} onChange={(e) => setBanner({ ...banner, sort_order: Number(e.target.value) })} /></div>
              </div>
            </div>
          )}
          <DialogFooter><Button disabled={saveBanner.isPending} onClick={() => banner && saveBanner.mutate(banner)}>{saveBanner.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!page} onOpenChange={(o) => !o && setPage(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{page?.id ? "Edit page" : "New page"}</DialogTitle></DialogHeader>
          {page && (
            <div className="grid gap-3">
              <div><Label>Title</Label><Input value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} /></div>
              <div><Label>Slug</Label><Input value={page.slug} onChange={(e) => setPage({ ...page, slug: e.target.value })} placeholder="shipping-policy" /></div>
              <div><Label>Content</Label><Textarea rows={8} value={page.content} onChange={(e) => setPage({ ...page, content: e.target.value })} /></div>
              <div className="flex items-center justify-between"><Label>Published</Label><Switch checked={page.published} onCheckedChange={(v) => setPage({ ...page, published: v })} /></div>
            </div>
          )}
          <DialogFooter><Button disabled={savePage.isPending} onClick={() => page && savePage.mutate(page)}>{savePage.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
