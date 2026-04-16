create or replace function public.slugify_product_name(input text)
returns text
language sql
immutable
as $$
    select coalesce(
        nullif(
            trim(
                both '-'
                from regexp_replace(
                    translate(
                        lower(coalesce(input, '')),
                        'áàâãäåéèêẽëíìîĩïóòôõöúùûũüçñ',
                        'aaaaaaeeeeeiiiiiooooouuuuucn'
                    ),
                    '[^a-z0-9]+',
                    '-',
                    'g'
                )
            ),
            ''
        ),
        'produto'
    );
$$;

alter table public.products
    add column if not exists slug text not null default '';

create or replace function public.ensure_product_slug()
returns trigger
language plpgsql
as $$
declare
    base_slug text;
    candidate_slug text;
    suffix integer := 1;
begin
    if new.slug is not null and btrim(new.slug) <> '' then
        base_slug := public.slugify_product_name(new.slug);
    else
        base_slug := public.slugify_product_name(new.name);
    end if;

    perform pg_advisory_xact_lock(hashtextextended(base_slug, 0));

    candidate_slug := base_slug;

    while exists (
        select 1
        from public.products existing_product
        where existing_product.slug = candidate_slug
          and existing_product.id is distinct from new.id
    ) loop
        suffix := suffix + 1;
        candidate_slug := base_slug || '-' || suffix::text;
    end loop;

    new.slug := candidate_slug;
    return new;
end;
$$;

drop trigger if exists products_ensure_slug on public.products;

create trigger products_ensure_slug
before insert or update of name, slug
on public.products
for each row
execute function public.ensure_product_slug();

update public.products
set slug = ''
where slug is null or btrim(slug) = '';

create unique index if not exists products_slug_key on public.products (slug);
