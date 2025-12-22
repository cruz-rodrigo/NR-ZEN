
... (conteúdo anterior)

---

## 8. Marketing e Leads (NOVO)

```sql
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  name text,
  email text,
  profile text,
  source text DEFAULT 'teste-gratis',
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert leads" ON public.leads FOR INSERT WITH CHECK (true);
```
