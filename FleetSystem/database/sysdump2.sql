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
-- Name: process_fuel_level_change(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.process_fuel_level_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    previous_record RECORD;
BEGIN
    -- البحث عن آخر تسجيل لنفس الجهاز
    SELECT * INTO previous_record
    FROM positions
    WHERE device_id = NEW.device_id 
    AND fuel_level IS NOT NULL
    AND id != NEW.id
    ORDER BY device_time DESC
    LIMIT 1;

    -- إذا كان هناك تغيير في مستوى الوقود وكان المستوى الجديد أعلى
    IF previous_record.fuel_level IS NOT NULL 
    AND NEW.fuel_level > previous_record.fuel_level THEN
        INSERT INTO fuel_logs (
            device_id,
            previous_level,
            new_level,
            previous_time,
            filling_time,
            created_at
        ) VALUES (
            NEW.device_id,
            previous_record.fuel_level,
            NEW.fuel_level,
            previous_record.device_time,
            NEW.device_time,
            CURRENT_TIMESTAMP
        );
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.process_fuel_level_change() OWNER TO postgres;

--
-- Name: track_device_status_changes(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.track_device_status_changes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO device_status_changes (device_id, status)
        VALUES (NEW.id, NEW.status);
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.track_device_status_changes() OWNER TO postgres;

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
-- Name: device_status_changes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.device_status_changes (
    id integer NOT NULL,
    device_id integer NOT NULL,
    status character varying(50) NOT NULL,
    changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.device_status_changes OWNER TO postgres;

--
-- Name: device_status_changes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.device_status_changes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.device_status_changes_id_seq OWNER TO postgres;

--
-- Name: device_status_changes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.device_status_changes_id_seq OWNED BY public.device_status_changes.id;


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
-- Name: fuel_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fuel_logs (
    id integer NOT NULL,
    device_id integer NOT NULL,
    previous_level double precision NOT NULL,
    new_level double precision NOT NULL,
    previous_time timestamp without time zone NOT NULL,
    filling_time timestamp without time zone NOT NULL,
    price_per_liter numeric(10,2),
    total_cost numeric(10,2),
    receipt_image_url text,
    status character varying(20) DEFAULT 'pending'::character varying,
    confirmed_by integer,
    confirmation_time timestamp without time zone,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    liters_added double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public.fuel_logs OWNER TO postgres;

--
-- Name: fuel_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fuel_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fuel_logs_id_seq OWNER TO postgres;

--
-- Name: fuel_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fuel_logs_id_seq OWNED BY public.fuel_logs.id;


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
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fuel_level double precision
);


ALTER TABLE public.positions OWNER TO postgres;

--
-- Name: device_status_changes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_status_changes ALTER COLUMN id SET DEFAULT nextval('public.device_status_changes_id_seq'::regclass);


--
-- Name: fuel_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel_logs ALTER COLUMN id SET DEFAULT nextval('public.fuel_logs_id_seq'::regclass);


--
-- Name: device_status_changes device_status_changes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_status_changes
    ADD CONSTRAINT device_status_changes_pkey PRIMARY KEY (id);


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
-- Name: fuel_logs fuel_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel_logs
    ADD CONSTRAINT fuel_logs_pkey PRIMARY KEY (id);


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
-- Name: idx_fuel_logs_device; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fuel_logs_device ON public.fuel_logs USING btree (device_id, filling_time);


--
-- Name: idx_positions_device_fuel; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_positions_device_fuel ON public.positions USING btree (device_id, fuel_level, device_time);


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
-- Name: devices device_status_tracker; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER device_status_tracker AFTER UPDATE OF status ON public.devices FOR EACH ROW EXECUTE FUNCTION public.track_device_status_changes();


--
-- Name: positions fuel_level_change_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER fuel_level_change_trigger AFTER INSERT ON public.positions FOR EACH ROW WHEN ((new.fuel_level IS NOT NULL)) EXECUTE FUNCTION public.process_fuel_level_change();


--
-- Name: devices update_devices_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON public.devices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: device_status_changes device_status_changes_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_status_changes
    ADD CONSTRAINT device_status_changes_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id);


--
-- Name: fuel_logs fk_device; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel_logs
    ADD CONSTRAINT fk_device FOREIGN KEY (device_id) REFERENCES public.devices(id);


--
-- PostgreSQL database dump complete
--

