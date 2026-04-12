ALTER TABLE public.shipping_integrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS shipping_integrations_service_role_only ON public.shipping_integrations;

CREATE POLICY shipping_integrations_service_role_only
ON public.shipping_integrations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
