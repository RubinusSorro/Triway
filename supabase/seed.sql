insert into public.routes (name, fare)
select v.name, v.fare
from (values
  ('Sample Route A', null::numeric),
  ('Sample Route B', null::numeric),
  ('Sample Route C', null::numeric)
) as v(name, fare)
where not exists (select 1 from public.routes r where r.name = v.name);
