-- roles
create type public.app_role as enum ('admin','editor');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "admins manage roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- contact entries
create table public.contact_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, phone text, profession text,
  subject text, message text not null,
  status text not null default 'New', admin_notes text, source text default 'Website',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant insert on public.contact_entries to anon, authenticated;
grant select, update, delete on public.contact_entries to authenticated;
grant all on public.contact_entries to service_role;
alter table public.contact_entries enable row level security;
create policy "anyone can submit contact" on public.contact_entries for insert to anon, authenticated with check (true);
create policy "admins manage contact" on public.contact_entries for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger t_contact_updated before update on public.contact_entries for each row execute function public.update_updated_at_column();

-- audit leads
create table public.audit_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, phone text, profession text,
  income_range text, primary_financial_concern text, preferred_consultation_time text,
  source text default 'Website', utm_source text, utm_medium text, utm_campaign text,
  status text not null default 'New', admin_notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant insert on public.audit_leads to anon, authenticated;
grant select, update, delete on public.audit_leads to authenticated;
grant all on public.audit_leads to service_role;
alter table public.audit_leads enable row level security;
create policy "anyone can submit lead" on public.audit_leads for insert to anon, authenticated with check (true);
create policy "admins manage leads" on public.audit_leads for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger t_leads_updated before update on public.audit_leads for each row execute function public.update_updated_at_column();

-- consultation requests
create table public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, phone text, service text,
  preferred_date date, preferred_time text, message text,
  status text not null default 'New', admin_notes text, source text default 'Website',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant insert on public.consultation_requests to anon, authenticated;
grant select, update, delete on public.consultation_requests to authenticated;
grant all on public.consultation_requests to service_role;
alter table public.consultation_requests enable row level security;
create policy "anyone can request consultation" on public.consultation_requests for insert to anon, authenticated with check (true);
create policy "admins manage consultations" on public.consultation_requests for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger t_consult_updated before update on public.consultation_requests for each row execute function public.update_updated_at_column();

-- bookings (paid slot booking)
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, phone text,
  service text not null, plan_price text,
  booking_fee integer not null default 99,
  payment_status text not null default 'pending',
  payment_reference text,
  booking_date date, booking_time text,
  notes text, status text not null default 'New', admin_notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant insert on public.bookings to anon, authenticated;
grant select, update, delete on public.bookings to authenticated;
grant all on public.bookings to service_role;
alter table public.bookings enable row level security;
create policy "anyone can create booking" on public.bookings for insert to anon, authenticated with check (true);
create policy "admins manage bookings" on public.bookings for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger t_bookings_updated before update on public.bookings for each row execute function public.update_updated_at_column();
create index bookings_date_idx on public.bookings (booking_date);

-- blog
create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique, slug text not null unique,
  created_at timestamptz not null default now()
);
grant select on public.blog_categories to anon, authenticated;
grant insert, update, delete on public.blog_categories to authenticated;
grant all on public.blog_categories to service_role;
alter table public.blog_categories enable row level security;
create policy "public read categories" on public.blog_categories for select to anon, authenticated using (true);
create policy "admins manage categories" on public.blog_categories for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null, slug text not null unique, subtitle text, excerpt text,
  content text not null default '', featured_image text, category text,
  author text default 'Mayank Gangwar', tags text[] default '{}',
  seo_title text, seo_description text,
  reading_time integer default 5,
  status text not null default 'draft',
  is_sample boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;
grant all on public.blog_posts to service_role;
alter table public.blog_posts enable row level security;
create policy "public read published posts" on public.blog_posts for select to anon using (status = 'published');
create policy "authed read published posts" on public.blog_posts for select to authenticated using (status = 'published' or public.has_role(auth.uid(),'admin'));
create policy "admins manage posts" on public.blog_posts for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger t_posts_updated before update on public.blog_posts for each row execute function public.update_updated_at_column();
create index blog_posts_status_idx on public.blog_posts (status, published_at desc);

-- services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null, tagline text, description text,
  price text, price_interval text, features text[] default '{}',
  cta_label text default 'GET MY AUDIT', highlighted boolean not null default false,
  active boolean not null default true, display_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "public read services" on public.services for select to anon, authenticated using (active = true);
create policy "admins manage services" on public.services for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger t_services_updated before update on public.services for each row execute function public.update_updated_at_column();

-- testimonials
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null, profession text, company text, quote text not null,
  rating integer not null default 5, image_url text,
  is_sample boolean not null default true,
  active boolean not null default true, display_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;
grant all on public.testimonials to service_role;
alter table public.testimonials enable row level security;
create policy "public read testimonials" on public.testimonials for select to anon, authenticated using (active = true);
create policy "admins manage testimonials" on public.testimonials for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger t_testi_updated before update on public.testimonials for each row execute function public.update_updated_at_column();

-- faqs
create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null, answer text not null,
  active boolean not null default true, display_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select on public.faqs to anon, authenticated;
grant insert, update, delete on public.faqs to authenticated;
grant all on public.faqs to service_role;
alter table public.faqs enable row level security;
create policy "public read faqs" on public.faqs for select to anon, authenticated using (active = true);
create policy "admins manage faqs" on public.faqs for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger t_faqs_updated before update on public.faqs for each row execute function public.update_updated_at_column();

-- site settings + website content (key/value)
create table public.site_settings (
  key text primary key, value text,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admins manage settings" on public.site_settings for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.website_content (
  key text primary key, value text, section text,
  updated_at timestamptz not null default now()
);
grant select on public.website_content to anon, authenticated;
grant insert, update, delete on public.website_content to authenticated;
grant all on public.website_content to service_role;
alter table public.website_content enable row level security;
create policy "public read content" on public.website_content for select to anon, authenticated using (true);
create policy "admins manage content" on public.website_content for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- seed
insert into public.services (name, tagline, description, price, price_interval, features, cta_label, highlighted, display_order) values
('Financial Health Audit','ONE-TIME','A complete one-time review of your financial position with a personalised action report.','₹2,999 – ₹4,999','one-time',
 array['Complete financial review','Money leak detection','Expense analysis','Tax snapshot','Savings review','Personalised action report'],'GET MY AUDIT',false,1),
('Monthly Financial Clarity','MEMBERSHIP','Ongoing analysis, tracking and accountability so your financial system stays on course.','₹4,999 – ₹9,999','per month',
 array['Monthly financial analysis','Dashboard & insights','Money leak tracking','Accountability','Monthly action plan','Review call'],'START MONTHLY PLAN',true,2),
('Personal CFO Lite','PREMIUM','Dedicated financial guidance across investments, taxes and long-term goals.','₹15,000 – ₹50,000','per month',
 array['Comprehensive financial management','Investment planning','Tax planning','Goal-based wealth planning','Priority access','Personalised financial strategy'],'APPLY FOR PERSONAL CFO',false,3);

insert into public.faqs (question, answer, display_order) values
('What exactly is a Financial Health Audit?','A structured review of your income, expenses, savings, investments, loans and taxes, resulting in a clear picture of where you stand and a personalised action plan.',1),
('Do I need to share my bank statements on the website?','No. We do not accept financial documents through this public website. Document sharing, when required, happens through a secure, agreed channel after your consultation.',2),
('Is this investment advice?','No. Our work is financial clarity, analysis and planning support. Nothing on this website should be treated as a guarantee of returns or as a substitute for personalised regulated advice.',3),
('Who is this built for?','Salaried professionals and high-income individuals — typically earning ₹8 LPA and above — who want more visibility and control over their money.',4),
('How long does an audit take?','Timelines depend on the completeness of the information shared. We confirm expected timelines during your first consultation.',5);

insert into public.testimonials (client_name, profession, company, quote, rating, is_sample, display_order) values
('[Client Name]','Software Engineer','[Company]','Sample testimonial placeholder. Replace this text from the admin panel with a real client testimonial.',5,true,1),
('[Client Name]','Consultant','[Company]','Sample testimonial placeholder. Replace this text from the admin panel with a real client testimonial.',5,true,2),
('[Client Name]','Doctor','[Company]','Sample testimonial placeholder. Replace this text from the admin panel with a real client testimonial.',5,true,3);

insert into public.blog_categories (name, slug) values
('Personal Finance','personal-finance'),('Tax Planning','tax-planning'),('Investments','investments'),
('Savings','savings'),('Financial Planning','financial-planning'),('Money Management','money-management'),
('Financial Clarity','financial-clarity');

insert into public.blog_posts (title, slug, subtitle, excerpt, content, category, reading_time, status, is_sample, published_at) values
('Where Does Your Salary Actually Go?','where-does-your-salary-actually-go','A month-by-month look at the invisible outflows','Most professionals can name their salary to the rupee, but not their spending. Here is how to map it.',
'## The gap between earning and knowing

Most professionals can state their monthly salary precisely. Very few can state, with the same confidence, where that salary went last month.

### Start with three buckets

1. **Fixed commitments** — rent or EMI, insurance, school fees.
2. **Variable living costs** — food, transport, utilities.
3. **Discretionary spending** — dining, subscriptions, shopping, travel.

### Why the third bucket matters

Discretionary spending is where clarity produces the fastest change. It is also the bucket that grows quietly as income grows.

### A simple exercise

Export the last three months of transactions, tag every line into one of the three buckets, and calculate the percentage split. Most people are surprised by the result — and that surprise is the beginning of control.

*Illustrative educational content. Individual circumstances differ.*','Personal Finance',6,'published',true,now()),
('7 Money Leaks High-Earning Professionals Often Ignore','7-money-leaks-high-earning-professionals-often-ignore','Small recurring outflows compound quietly','Money leaks rarely feel expensive in the moment. Over a year, they change your savings rate meaningfully.',
'## Leaks are rarely dramatic

They are small, recurring and easy to justify.

1. **Unused subscriptions** that renew silently.
2. **Convenience spending** on food delivery and cabs.
3. **Overlapping insurance** bought without review.
4. **Idle balances** sitting in low-interest accounts.
5. **High-cost debt** carried alongside investments.
6. **Lifestyle creep** after every appraisal.
7. **Unreviewed investments** with fees that quietly reduce returns.

### The fix is visibility, not restriction

Once each leak is named and measured, the decision becomes obvious.

*Illustrative educational content. Not financial advice.*','Money Management',7,'published',true,now()),
('How Much Should You Really Be Saving Every Month?','how-much-should-you-really-be-saving-every-month','Moving beyond generic percentage rules','Savings rate is a better metric than savings amount. Here is how to think about it.',
'## The percentage that matters

A savings rate is simply the share of income that stays with you. It is the single most useful personal finance metric.

### Anchors, not rules

- Below 10% — the system needs attention.
- 10–20% — a workable base.
- 20–35% — strong for most salaried professionals.
- Above 35% — usually indicates a well-designed system.

### Context changes everything

Life stage, dependants, debt load and goals all shift the right number. The point is not to hit a magic figure but to know yours and to know why.

*Illustrative educational content. Subject to individual circumstances.*','Savings',5,'published',true,now()),
('Financial Health Score: What Does It Actually Mean?','financial-health-score-what-does-it-actually-mean','How a single number can summarise a financial system','A score is a summary, not a verdict. Here is what goes into ours.',
'## What the score measures

A financial health score combines several dimensions into one indicator:

- **Savings health** — how much of your income you retain.
- **Expense discipline** — how consistent your spending is.
- **Debt management** — how much of your income services debt.
- **Investment readiness** — whether surplus money is deployed.
- **Goal progress** — whether your plan is moving.

### How to use it

Treat the score as a starting point for a conversation, not as a judgment. The value is in the components, not the headline number.

*Illustrative example. Not a substitute for professional financial advice.*','Financial Clarity',5,'published',true,now()),
('Why Earning More Doesn''t Always Mean Building More Wealth','why-earning-more-doesnt-always-mean-building-more-wealth','Income solves some problems and hides others','Wealth is built by the gap between income and spending — and by what you do with the gap.',
'## Income is an input, not an outcome

A higher salary raises the ceiling. It does not automatically raise the floor.

### Three reasons the gap does not grow

1. **Lifestyle expands with income.** Every raise gets absorbed.
2. **Surplus stays idle.** Money accumulates in a savings account with no plan.
3. **No review rhythm.** Decisions are made once and never revisited.

### What changes the trajectory

A system: clear visibility, a defined savings rate, deliberate deployment and a periodic review with someone who looks at the complete picture.

*Illustrative educational content. Individual circumstances differ.*','Financial Planning',6,'published',true,now());

insert into public.site_settings (key, value) values
('business_name','Mayank Gangwar & Company'),
('business_subtitle','Chartered Accountants'),
('phone','89389 74273'),
('email','camayankgangwar@gmail.com'),
('address','[OFFICE ADDRESS]'),
('whatsapp','[WHATSAPP NUMBER]'),
('linkedin','[LINKEDIN URL]'),
('instagram',''),
('youtube',''),
('site_title','Financial Clarity & Personal CFO Services | Mayank Gangwar & Company'),
('meta_description','Financial clarity, financial health audits, tax planning, investment review and Personal CFO services for salaried professionals and high-income individuals.'),
('booking_fee','99'),
('booking_fee_premium','199');

insert into public.website_content (key, value, section) values
('hero_eyebrow','FINANCIAL CLARITY FOR MODERN PROFESSIONALS','hero'),
('hero_headline_1','Earn Well.','hero'),
('hero_headline_2','Know Where Your Money Goes.','hero'),
('hero_description','We help busy professionals understand their finances, identify money leaks, optimize financial decisions, and build a personalized plan for the future.','hero'),
('hero_cta','GET MY FINANCIAL HEALTH AUDIT','hero'),
('founder_name','Mayank Gangwar','founder'),
('founder_title','Chartered Accountant','founder'),
('founder_statement','My mission is simple: to bring financial clarity and wealth discipline to every salaried professional so they can live a stress-free life and build the future they deserve.','founder'),
('founder_credentials','[CA REGISTRATION DETAILS]','founder'),
('founder_bio','Mayank Gangwar is a Chartered Accountant working with salaried professionals and high-income individuals on financial clarity, structured reviews and long-term planning.','founder');