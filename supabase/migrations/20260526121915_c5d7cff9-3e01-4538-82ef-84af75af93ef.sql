
-- 1. Coupons: remove public read, restrict to admins/editors
DROP POLICY IF EXISTS "Anyone view active coupons" ON public.coupons;

CREATE POLICY "Admins view coupons"
ON public.coupons
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Server-side coupon validation function
CREATE OR REPLACE FUNCTION public.validate_coupon(_code text, _order_subtotal numeric)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c record;
BEGIN
  SELECT * INTO c FROM public.coupons
    WHERE upper(code) = upper(_code) AND active = true
    LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Invalid coupon code');
  END IF;

  IF c.expires_at IS NOT NULL AND c.expires_at < now() THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Coupon expired');
  END IF;

  IF c.starts_at IS NOT NULL AND c.starts_at > now() THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Coupon not yet active');
  END IF;

  IF c.max_uses IS NOT NULL AND c.used_count >= c.max_uses THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Coupon usage limit reached');
  END IF;

  IF c.min_order IS NOT NULL AND _order_subtotal < c.min_order THEN
    RETURN jsonb_build_object('ok', false, 'message',
      'Minimum order of ' || c.min_order::text || ' required');
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'code', c.code,
    'discount_type', c.discount_type,
    'discount_value', c.discount_value,
    'message', 'Coupon applied'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_coupon(text, numeric) TO anon, authenticated;

-- 2. Payment gateways: hide config column from public
DROP POLICY IF EXISTS "Anyone view enabled gateways" ON public.payment_gateways;

CREATE POLICY "Admins view gateway rows"
ON public.payment_gateways
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE VIEW public.payment_gateways_public
WITH (security_invoker = true) AS
  SELECT id, name, enabled, sort_order
  FROM public.payment_gateways
  WHERE enabled = true;

GRANT SELECT ON public.payment_gateways_public TO anon, authenticated;

-- 3. Ticket messages: prevent is_staff impersonation
DROP POLICY IF EXISTS "Add ticket messages" ON public.ticket_messages;

CREATE POLICY "Add ticket messages"
ON public.ticket_messages
FOR INSERT
TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND (
    is_staff = false
    OR has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'editor'::app_role)
  )
);
