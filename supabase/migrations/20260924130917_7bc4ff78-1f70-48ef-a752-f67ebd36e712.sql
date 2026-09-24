CREATE TABLE public.cms_pages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text NOT NULL UNIQUE, title text NOT NULL, content text NOT NULL DEFAULT '', published boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.cms_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_pages TO authenticated;
GRANT ALL ON public.cms_pages TO service_role;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view published pages" ON public.cms_pages FOR SELECT USING (published = true);
CREATE POLICY "Staff manage pages" ON public.cms_pages FOR ALL TO authenticated USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'editor')) WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'editor'));
CREATE TRIGGER cms_pages_updated BEFORE UPDATE ON public.cms_pages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.cms_pages (slug,title,content) VALUES ('about','About Us','Welcome to Shopzy.'),('privacy','Privacy Policy','Your privacy matters.'),('terms','Terms of Service','Terms apply.'),('faq','FAQ','Frequently asked questions.');

CREATE TABLE public.courier_partners (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL UNIQUE, tracking_url text, enabled boolean NOT NULL DEFAULT true, sort_order integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courier_partners TO authenticated;
GRANT ALL ON public.courier_partners TO service_role;
ALTER TABLE public.courier_partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff view couriers" ON public.courier_partners FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'editor'));
CREATE POLICY "Admins manage couriers" ON public.courier_partners FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
INSERT INTO public.courier_partners (name,sort_order) VALUES ('Pathao Courier',1),('Steadfast',2),('RedX',3),('Sundarban',4),('DHL Express',5);

CREATE TABLE public.api_keys (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), label text NOT NULL, prefix text NOT NULL, key_hash text NOT NULL, revoked boolean NOT NULL DEFAULT false, created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.api_keys TO authenticated;
GRANT ALL ON public.api_keys TO service_role;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage api keys" ON public.api_keys FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));