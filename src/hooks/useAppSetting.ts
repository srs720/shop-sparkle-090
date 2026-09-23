import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logAdminAction } from "@/lib/admin-helpers";

/** Read/write a JSON value stored in app_settings under `key`. Note: app_settings is publicly readable — never store secrets here. */
export function useAppSetting<T>(key: string, fallback: T) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["app_settings", key],
    queryFn: async () => {
      const { data, error } = await supabase.from("app_settings").select("value").eq("key", key).maybeSingle();
      if (error) throw error;
      return (data?.value as T | undefined) ?? fallback;
    },
  });
  const save = useMutation({
    mutationFn: async (value: T) => {
      const { error } = await supabase
        .from("app_settings")
        .upsert({ key, value: value as never, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (error) throw error;
      await logAdminAction("settings.update", "app_settings", key);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["app_settings", key] }); toast.success("Saved"); },
    onError: (e: Error) => toast.error(e.message),
  });
  return { data: query.data ?? fallback, isLoading: query.isLoading, error: query.error, save };
}
