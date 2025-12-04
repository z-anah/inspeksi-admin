-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.articles (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  published_at date NOT NULL,
  image_url text,
  content ARRAY NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  views bigint NOT NULL DEFAULT 0,
  shares bigint NOT NULL DEFAULT 0,
  likes bigint NOT NULL DEFAULT 0,
  excerpt text NOT NULL DEFAULT ''::text,
  CONSTRAINT articles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.content (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  section text NOT NULL,
  key text NOT NULL,
  value text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT content_pkey PRIMARY KEY (id)
);
CREATE TABLE public.events (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title text NOT NULL,
  event_date date NOT NULL,
  location text NOT NULL,
  map_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (id)
);
CREATE TABLE public.faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT faqs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.forms (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  icon text,
  title text NOT NULL,
  link text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT forms_pkey PRIMARY KEY (id)
);
CREATE TABLE public.opinion (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  icon text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT opinion_pkey PRIMARY KEY (id)
);
CREATE TABLE public.partners (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  logo_url text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT partners_pkey PRIMARY KEY (id)
);
CREATE TABLE public.product_images (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  product_id bigint,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false,
  CONSTRAINT product_images_pkey PRIMARY KEY (id),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.products (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id)
);
CREATE TABLE public.team_members (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  position text NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  order_index integer DEFAULT 0,
  CONSTRAINT team_members_pkey PRIMARY KEY (id)
);
CREATE TABLE public.testimonials (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  text text NOT NULL,
  author text NOT NULL,
  location text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);
