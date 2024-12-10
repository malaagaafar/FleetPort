--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.devices (
    id integer NOT NULL,
    name character varying(255),
    unique_id character varying(255),
    status character varying(50),
    disabled boolean DEFAULT false,
    last_update timestamp without time zone,
    position_id integer,
    group_id integer,
    phone character varying(255),
    model character varying(255),
    contact character varying(255),
    category character varying(255),
    attributes jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.devices OWNER TO postgres;

--
-- Name: positions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.positions (
    id integer NOT NULL,
    device_id integer,
    protocol character varying(255),
    device_time timestamp without time zone,
    fix_time timestamp without time zone,
    server_time timestamp without time zone,
    outdated boolean DEFAULT false,
    valid boolean DEFAULT true,
    latitude double precision,
    longitude double precision,
    altitude double precision,
    speed double precision,
    course double precision,
    address text,
    accuracy double precision,
    network jsonb,
    geofence_ids integer[],
    attributes jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.positions OWNER TO postgres;

--
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);


--
-- Name: devices devices_unique_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_unique_id_key UNIQUE (unique_id);


--
-- Name: positions positions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (id);


--
-- Name: idx_devices_unique_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_devices_unique_id ON public.devices USING btree (unique_id);


--
-- Name: idx_positions_device_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_positions_device_id ON public.positions USING btree (device_id);


--
-- Name: idx_positions_device_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_positions_device_time ON public.positions USING btree (device_time);


--
-- Name: idx_positions_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_positions_location ON public.positions USING gist (public.st_setsrid(public.st_makepoint(longitude, latitude), 4326));


--
-- Name: devices update_devices_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON public.devices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- PostgreSQL database dump complete
--

