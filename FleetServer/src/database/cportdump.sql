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
-- Name: btree_gist; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;


--
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: account_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.account_status AS ENUM (
    'pending_review',
    'active',
    'inactive',
    'suspended'
);


ALTER TYPE public.account_status OWNER TO postgres;

--
-- Name: assignment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assignment_status AS ENUM (
    'pending_installation',
    'pending_setup',
    'setup_failed',
    'pending_connection',
    'active',
    'removedinstallation_verified',
    'receiving_data',
    'connection_lost',
    'inactive'
);


ALTER TYPE public.assignment_status OWNER TO postgres;

--
-- Name: cargo_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.cargo_type AS ENUM (
    'general',
    'refrigerated',
    'hazardous',
    'liquid',
    'bulk',
    'heavy',
    'fragile',
    'livestock',
    'vehicles',
    'equipment'
);


ALTER TYPE public.cargo_type OWNER TO postgres;

--
-- Name: device_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.device_status AS ENUM (
    'new',
    'in_stock',
    'assigned',
    'faulty',
    'maintenance',
    'retired'
);


ALTER TYPE public.device_status OWNER TO postgres;

--
-- Name: driver_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.driver_status AS ENUM (
    'active',
    'inactive',
    'on_trip',
    'on_leave',
    'suspended',
    'terminated'
);


ALTER TYPE public.driver_status OWNER TO postgres;

--
-- Name: driver_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.driver_type AS ENUM (
    'company',
    'independent'
);


ALTER TYPE public.driver_type OWNER TO postgres;

--
-- Name: enum_drivers_approval_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_drivers_approval_status AS ENUM (
    'pending_review',
    'approved',
    'rejected'
);


ALTER TYPE public.enum_drivers_approval_status OWNER TO postgres;

--
-- Name: enum_drivers_driver_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_drivers_driver_type AS ENUM (
    'company',
    'independent'
);


ALTER TYPE public.enum_drivers_driver_type OWNER TO postgres;

--
-- Name: enum_drivers_license_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_drivers_license_type AS ENUM (
    'light',
    'medium',
    'heavy',
    'hazmat',
    'special'
);


ALTER TYPE public.enum_drivers_license_type OWNER TO postgres;

--
-- Name: enum_drivers_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_drivers_status AS ENUM (
    'pending_review',
    'active',
    'inactive',
    'on_trip',
    'on_leave',
    'suspended',
    'terminated'
);


ALTER TYPE public.enum_drivers_status OWNER TO postgres;

--
-- Name: enum_fleet_driver_accounts_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_fleet_driver_accounts_status AS ENUM (
    'pending_review',
    'active',
    'inactive',
    'suspended'
);


ALTER TYPE public.enum_fleet_driver_accounts_status OWNER TO postgres;

--
-- Name: enum_primary_devices_supported_sensors; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_primary_devices_supported_sensors AS ENUM (
    'temperature',
    'door',
    'fuel',
    'weight',
    'camera',
    'humidity'
);


ALTER TYPE public.enum_primary_devices_supported_sensors OWNER TO postgres;

--
-- Name: enum_primary_devices_trailer_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_primary_devices_trailer_type AS ENUM (
    'flatbed',
    'box',
    'refrigerated',
    'tanker',
    'lowboy',
    'car_carrier',
    'tipper',
    'curtainsider',
    'skeletal',
    'extendable'
);


ALTER TYPE public.enum_primary_devices_trailer_type OWNER TO postgres;

--
-- Name: enum_primary_devices_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_primary_devices_type AS ENUM (
    'type1',
    'type2',
    'truck',
    'van',
    'pickup',
    'refrigerated',
    'tanker',
    'trailer'
);


ALTER TYPE public.enum_primary_devices_type OWNER TO postgres;

--
-- Name: enum_sensors_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_sensors_type AS ENUM (
    'sensorType1',
    'sensorType2'
);


ALTER TYPE public.enum_sensors_type OWNER TO postgres;

--
-- Name: enum_vehicles_fuel_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_vehicles_fuel_type AS ENUM (
    'petrol',
    'diesel',
    'electric',
    'hybrid'
);


ALTER TYPE public.enum_vehicles_fuel_type OWNER TO postgres;

--
-- Name: enum_vehicles_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_vehicles_status AS ENUM (
    'on_trip',
    'active',
    'parked',
    'inactive',
    'maintenance',
    'temp_inactive',
    'retired',
    'out_of_service',
    'reserved'
);


ALTER TYPE public.enum_vehicles_status OWNER TO postgres;

--
-- Name: enum_vehicles_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_vehicles_type AS ENUM (
    'truck',
    'van',
    'pickup',
    'refrigerated',
    'tanker',
    'trailer',
    'car',
    'bus',
    'trailer_head'
);


ALTER TYPE public.enum_vehicles_type OWNER TO postgres;

--
-- Name: fleet_vehicle_availability; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.fleet_vehicle_availability AS ENUM (
    'full_time',
    'scheduled',
    'on_demand'
);


ALTER TYPE public.fleet_vehicle_availability OWNER TO postgres;

--
-- Name: fuel_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.fuel_type AS ENUM (
    'petrol',
    'diesel',
    'electric',
    'hybrid'
);


ALTER TYPE public.fuel_type OWNER TO postgres;

--
-- Name: health_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.health_status AS ENUM (
    'healthy',
    'warning',
    'critical',
    'offline',
    'unknown'
);


ALTER TYPE public.health_status OWNER TO postgres;

--
-- Name: license_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.license_type AS ENUM (
    'light',
    'medium',
    'heavy',
    'hazmat',
    'special'
);


ALTER TYPE public.license_type OWNER TO postgres;

--
-- Name: maintenance_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.maintenance_status AS ENUM (
    'pending',
    'scheduled',
    'in_progress',
    'completed',
    'cancelled',
    'overdue'
);


ALTER TYPE public.maintenance_status OWNER TO postgres;

--
-- Name: maintenance_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.maintenance_type AS ENUM (
    'oil_change',
    'tire_service',
    'brake_service',
    'battery_service',
    'engine_service',
    'transmission',
    'cooling_system',
    'fuel_system',
    'electrical',
    'inspection',
    'filter_change',
    'alignment',
    'other'
);


ALTER TYPE public.maintenance_type OWNER TO postgres;

--
-- Name: marketplace_availability_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.marketplace_availability_type AS ENUM (
    'full_time',
    'scheduled',
    'on_demand',
    'contract_only'
);


ALTER TYPE public.marketplace_availability_type OWNER TO postgres;

--
-- Name: notification_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notification_type AS ENUM (
    'alert',
    'warning',
    'info',
    'maintenance',
    'system'
);


ALTER TYPE public.notification_type OWNER TO postgres;

--
-- Name: partner_trip_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.partner_trip_status AS ENUM (
    'draft',
    'published',
    'in_bidding',
    'assigned',
    'in_progress',
    'completed',
    'cancelled'
);


ALTER TYPE public.partner_trip_status OWNER TO postgres;

--
-- Name: primary_device_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.primary_device_type AS ENUM (
    'teltonika_fmb920',
    'teltonika_fmb130',
    'concox_gt06n',
    'concox_x3'
);


ALTER TYPE public.primary_device_type OWNER TO postgres;

--
-- Name: priority_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.priority_level AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);


ALTER TYPE public.priority_level OWNER TO postgres;

--
-- Name: sensor_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.sensor_type AS ENUM (
    'temperature',
    'door',
    'fuel',
    'weight',
    'camera',
    'humidity'
);


ALTER TYPE public.sensor_type OWNER TO postgres;

--
-- Name: trailer_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.trailer_type AS ENUM (
    'flatbed',
    'box',
    'refrigerated',
    'tanker',
    'lowboy',
    'car_carrier',
    'tipper',
    'curtainsider',
    'skeletal',
    'extendable'
);


ALTER TYPE public.trailer_type OWNER TO postgres;

--
-- Name: trip_event_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.trip_event_type AS ENUM (
    'trip_started',
    'trip_ended',
    'stop_arrived',
    'stop_departed',
    'delay_started',
    'delay_ended',
    'route_deviated',
    'route_resumed',
    'driver_changed',
    'issue_reported',
    'maintenance_needed',
    'fuel_alert',
    'speed_violation',
    'sensor_alert',
    'geofence_enter',
    'geofence_exit'
);


ALTER TYPE public.trip_event_type OWNER TO postgres;

--
-- Name: trip_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.trip_status AS ENUM (
    'draft',
    'pending',
    'assigned',
    'in_progress',
    'completed',
    'cancelled',
    'failed'
);


ALTER TYPE public.trip_status OWNER TO postgres;

--
-- Name: trip_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.trip_type AS ENUM (
    'delivery',
    'pickup',
    'transfer',
    'round_trip'
);


ALTER TYPE public.trip_type OWNER TO postgres;

--
-- Name: vehicle_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.vehicle_status AS ENUM (
    'on_trip',
    'active',
    'parked',
    'inactive',
    'maintenance',
    'temp_inactive',
    'retired',
    'out_of_service',
    'reserved'
);


ALTER TYPE public.vehicle_status OWNER TO postgres;

--
-- Name: vehicle_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.vehicle_type AS ENUM (
    'truck',
    'van',
    'pickup',
    'refrigerated',
    'tanker',
    'trailer'
);


ALTER TYPE public.vehicle_type OWNER TO postgres;

--
-- Name: verification_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.verification_method AS ENUM (
    'qr_code',
    'pin_code',
    'rfid_card',
    'face_id',
    'fingerprint'
);


ALTER TYPE public.verification_method OWNER TO postgres;

--
-- Name: check_max_drivers_per_vehicle(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_max_drivers_per_vehicle() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (SELECT COUNT(*) FROM drivers_vehicle_assignments 
        WHERE vehicle_id = NEW.vehicle_id) >= 4 THEN
        RAISE EXCEPTION 'لا يمكن تخصيص أكثر من 4 سائقين لكل مركبة';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.check_max_drivers_per_vehicle() OWNER TO postgres;

--
-- Name: get_trip_actual_route(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_trip_actual_route(trip_id_param integer) RETURNS public.geometry
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN ST_MakeLine(
        ARRAY(
            SELECT location::geometry
            FROM trip_device_logs
            WHERE trip_id = trip_id_param
            ORDER BY recorded_at
        )
    );
END;
$$;


ALTER FUNCTION public.get_trip_actual_route(trip_id_param integer) OWNER TO postgres;

--
-- Name: get_trip_map_summary(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_trip_map_summary(trip_id_param integer) RETURNS TABLE(trip_info jsonb, planned_route public.geometry, actual_route public.geometry, stops jsonb[], events jsonb[], bounds public.geometry)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    WITH trip_bounds AS (
        SELECT 
            ST_Envelope(
                ST_Collect(
                    ARRAY[
                        start_location,
                        end_location,
                        (SELECT ST_Collect(location) FROM trip_stops WHERE trip_id = trip_id_param),
                        (SELECT ST_Collect(location) FROM trip_device_logs WHERE trip_id = trip_id_param)
                    ]
                )
            ) as route_bounds
        FROM trips
        WHERE id = trip_id_param
    )
    SELECT 
        -- معلومات الرحلة
        jsonb_build_object(
            'id', t.id,
            'reference_number', t.reference_number,
            'status', t.status,
            'scheduled_start', t.scheduled_start,
            'scheduled_end', t.scheduled_end,
            'actual_start', t.actual_start,
            'actual_end', t.actual_end,
            'estimated_distance', t.estimated_distance,
            'actual_distance', t.actual_distance
        ) as trip_info,
        
        -- المسار المخطط
        t.planned_route,
        
        -- المسار الفعلي
        get_trip_actual_route(trip_id_param) as actual_route,
        
        -- نقاط التوقف
        ARRAY(
            SELECT jsonb_build_object(
                'id', id,
                'sequence', sequence_number,
                'type', type,
                'location', ST_AsGeoJSON(location)::jsonb,
                'status', status,
                'scheduled_arrival', scheduled_arrival,
                'actual_arrival', actual_arrival
            )
            FROM trip_stops
            WHERE trip_id = trip_id_param
            ORDER BY sequence_number
        ) as stops,
        
        -- الأحداث
        ARRAY(
            SELECT jsonb_build_object(
                'id', id,
                'type', event_type,
                'time', event_time,
                'location', ST_AsGeoJSON(location)::jsonb,
                'severity', severity,
                'description', description
            )
            FROM trip_events
            WHERE trip_id = trip_id_param
            AND location IS NOT NULL
            ORDER BY event_time
        ) as events,
        
        -- حدود الخريطة
        route_bounds as bounds
        
    FROM trips t, trip_bounds
    WHERE t.id = trip_id_param;
END;
$$;


ALTER FUNCTION public.get_trip_map_summary(trip_id_param integer) OWNER TO postgres;

--
-- Name: get_trip_route_details(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_trip_route_details(trip_id_param integer) RETURNS TABLE(point_type character varying, sequence_number integer, location public.geometry, recorded_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- نقاط المسار الفعلي
    RETURN QUERY
    SELECT 
        'route_point' as point_type,
        ROW_NUMBER() OVER (ORDER BY recorded_at) as sequence_number,
        location,
        recorded_at,
        jsonb_build_object(
            'speed', speed,
            'ignition', ignition,
            'motion', motion,
            'fuel_level', fuel_level,
            'is_alert', is_alert,
            'alert_type', alert_type
        ) as metadata
    FROM trip_device_logs
    WHERE trip_id = trip_id_param

    UNION ALL

    -- نقاط التوقف المخططة
    SELECT 
        'stop_point' as point_type,
        sequence_number,
        location,
        scheduled_arrival as recorded_at,
        jsonb_build_object(
            'type', type,
            'address', address,
            'tasks', tasks,
            'status', status
        ) as metadata
    FROM trip_stops
    WHERE trip_id = trip_id_param

    UNION ALL

    -- نقاط الأحداث والتنبيهات
    SELECT 
        'alert_point' as point_type,
        ROW_NUMBER() OVER (ORDER BY event_time) as sequence_number,
        location,
        event_time as recorded_at,
        jsonb_build_object(
            'event_type', event_type,
            'description', description,
            'severity', severity
        ) as metadata
    FROM trip_events
    WHERE trip_id = trip_id_param AND location IS NOT NULL

    ORDER BY recorded_at;
END;
$$;


ALTER FUNCTION public.get_trip_route_details(trip_id_param integer) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: device_firmware_updates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.device_firmware_updates (
    id integer NOT NULL,
    device_assignment_id integer,
    previous_version character varying(50),
    new_version character varying(50),
    update_status character varying(20) NOT NULL,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    error_message text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.device_firmware_updates OWNER TO postgres;

--
-- Name: device_firmware_updates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.device_firmware_updates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.device_firmware_updates_id_seq OWNER TO postgres;

--
-- Name: device_firmware_updates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.device_firmware_updates_id_seq OWNED BY public.device_firmware_updates.id;


--
-- Name: device_health_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.device_health_logs (
    id integer NOT NULL,
    device_assignment_id integer,
    status public.health_status NOT NULL,
    battery_level integer,
    signal_strength integer,
    gsm_status jsonb DEFAULT '{}'::jsonb,
    memory_usage integer,
    temperature numeric(5,2),
    voltage numeric(5,2),
    last_communication timestamp with time zone,
    uptime integer,
    firmware_version character varying(50),
    hardware_version character varying(50),
    errors jsonb DEFAULT '[]'::jsonb,
    warnings jsonb DEFAULT '[]'::jsonb,
    diagnostics jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.device_health_logs OWNER TO postgres;

--
-- Name: device_health_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.device_health_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.device_health_logs_id_seq OWNER TO postgres;

--
-- Name: device_health_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.device_health_logs_id_seq OWNED BY public.device_health_logs.id;


--
-- Name: device_maintenance_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.device_maintenance_logs (
    id integer NOT NULL,
    device_id integer,
    maintenance_type character varying(50) NOT NULL,
    description text,
    cost numeric(10,2),
    performed_by character varying(100),
    performed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    next_maintenance_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.device_maintenance_logs OWNER TO postgres;

--
-- Name: device_maintenance_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.device_maintenance_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.device_maintenance_logs_id_seq OWNER TO postgres;

--
-- Name: device_maintenance_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.device_maintenance_logs_id_seq OWNED BY public.device_maintenance_logs.id;


--
-- Name: device_positions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.device_positions (
    id bigint NOT NULL,
    device_assignment_id integer,
    traccar_position_id bigint NOT NULL,
    protocol character varying(50),
    device_time timestamp with time zone,
    fix_time timestamp with time zone,
    server_time timestamp with time zone,
    latitude double precision,
    longitude double precision,
    altitude double precision,
    speed double precision,
    course double precision,
    address text,
    accuracy double precision,
    network jsonb,
    attributes jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.device_positions OWNER TO postgres;

--
-- Name: device_positions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.device_positions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.device_positions_id_seq OWNER TO postgres;

--
-- Name: device_positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.device_positions_id_seq OWNED BY public.device_positions.id;


--
-- Name: device_setup_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.device_setup_logs (
    id integer NOT NULL,
    assignment_id integer,
    attempt_number integer NOT NULL,
    status character varying(20) NOT NULL,
    error_message text,
    traccar_response jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.device_setup_logs OWNER TO postgres;

--
-- Name: device_setup_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.device_setup_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.device_setup_logs_id_seq OWNER TO postgres;

--
-- Name: device_setup_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.device_setup_logs_id_seq OWNED BY public.device_setup_logs.id;


--
-- Name: device_vehicle_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.device_vehicle_assignments (
    id integer NOT NULL,
    device_serial_number character varying(50),
    vehicle_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.device_vehicle_assignments OWNER TO postgres;

--
-- Name: device_vehicle_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.device_vehicle_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.device_vehicle_assignments_id_seq OWNER TO postgres;

--
-- Name: device_vehicle_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.device_vehicle_assignments_id_seq OWNED BY public.device_vehicle_assignments.id;


--
-- Name: driver_job_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_job_applications (
    id integer NOT NULL,
    driver_id integer,
    fleet_manager_id uuid,
    status character varying(20) DEFAULT 'pending'::character varying,
    application_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    response_date timestamp with time zone,
    proposed_salary numeric(10,2),
    proposed_start_date date,
    interview_date timestamp with time zone,
    interview_notes text,
    rejection_reason text,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.driver_job_applications OWNER TO postgres;

--
-- Name: driver_job_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.driver_job_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.driver_job_applications_id_seq OWNER TO postgres;

--
-- Name: driver_job_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.driver_job_applications_id_seq OWNED BY public.driver_job_applications.id;


--
-- Name: driver_leaves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_leaves (
    id integer NOT NULL,
    driver_id integer,
    type character varying(50) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    reason text,
    status character varying(20) DEFAULT 'pending'::character varying,
    approved_by uuid,
    approved_at timestamp with time zone,
    documents jsonb DEFAULT '[]'::jsonb,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.driver_leaves OWNER TO postgres;

--
-- Name: driver_leaves_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.driver_leaves_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.driver_leaves_id_seq OWNER TO postgres;

--
-- Name: driver_leaves_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.driver_leaves_id_seq OWNED BY public.driver_leaves.id;


--
-- Name: driver_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_reviews (
    id integer NOT NULL,
    driver_id integer,
    reviewer_id uuid,
    rating numeric(2,1),
    review_type character varying(50),
    review_date date NOT NULL,
    performance_metrics jsonb,
    strengths text[],
    weaknesses text[],
    recommendations text,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT driver_reviews_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric)))
);


ALTER TABLE public.driver_reviews OWNER TO postgres;

--
-- Name: driver_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.driver_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.driver_reviews_id_seq OWNER TO postgres;

--
-- Name: driver_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.driver_reviews_id_seq OWNED BY public.driver_reviews.id;


--
-- Name: driver_schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_schedules (
    id integer NOT NULL,
    driver_id integer,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    schedule_type character varying(50),
    status character varying(20) DEFAULT 'scheduled'::character varying,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_schedule_time CHECK ((end_time > start_time))
);


ALTER TABLE public.driver_schedules OWNER TO postgres;

--
-- Name: driver_schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.driver_schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.driver_schedules_id_seq OWNER TO postgres;

--
-- Name: driver_schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.driver_schedules_id_seq OWNED BY public.driver_schedules.id;


--
-- Name: driver_training; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_training (
    id integer NOT NULL,
    driver_id integer,
    training_type character varying(100) NOT NULL,
    provider character varying(100),
    start_date date NOT NULL,
    end_date date NOT NULL,
    status character varying(20) DEFAULT 'scheduled'::character varying,
    certification_number character varying(50),
    expiry_date date,
    documents jsonb DEFAULT '[]'::jsonb,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.driver_training OWNER TO postgres;

--
-- Name: driver_training_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.driver_training_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.driver_training_id_seq OWNER TO postgres;

--
-- Name: driver_training_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.driver_training_id_seq OWNED BY public.driver_training.id;


--
-- Name: driver_verification_methods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_verification_methods (
    id integer NOT NULL,
    driver_id integer,
    method public.verification_method NOT NULL,
    identifier character varying(255) NOT NULL,
    is_primary boolean DEFAULT false,
    status character varying(20) DEFAULT 'active'::character varying,
    issued_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    expires_at timestamp with time zone,
    last_used_at timestamp with time zone,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.driver_verification_methods OWNER TO postgres;

--
-- Name: driver_verification_methods_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.driver_verification_methods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.driver_verification_methods_id_seq OWNER TO postgres;

--
-- Name: driver_verification_methods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.driver_verification_methods_id_seq OWNED BY public.driver_verification_methods.id;


--
-- Name: driver_violations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_violations (
    id integer NOT NULL,
    driver_id integer,
    vehicle_id integer,
    violation_date timestamp with time zone NOT NULL,
    type character varying(50) NOT NULL,
    description text,
    location public.geometry(Point,4326),
    fine_amount numeric(10,2),
    paid boolean DEFAULT false,
    documents jsonb DEFAULT '[]'::jsonb,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.driver_violations OWNER TO postgres;

--
-- Name: driver_violations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.driver_violations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.driver_violations_id_seq OWNER TO postgres;

--
-- Name: driver_violations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.driver_violations_id_seq OWNED BY public.driver_violations.id;


--
-- Name: drivers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drivers (
    id integer NOT NULL,
    user_id uuid,
    account_id integer,
    driver_type public.driver_type NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    id_number character varying(20) NOT NULL,
    birth_date date NOT NULL,
    phone character varying(20) NOT NULL,
    email character varying(100),
    address text,
    profile_image character varying(255) DEFAULT 'https://i.imgur.com/cRSm6eI.png'::character varying,
    emergency_contact jsonb,
    current_location public.geometry(Point,4326),
    license_number character varying(50) NOT NULL,
    license_type public.license_type NOT NULL,
    license_expiry date NOT NULL,
    license_issue_date date NOT NULL,
    hazmat_certified boolean DEFAULT false,
    experience_years integer,
    hire_date date,
    status public.driver_status DEFAULT 'inactive'::public.driver_status,
    current_vehicle_id integer,
    total_trips integer DEFAULT 0,
    total_distance numeric(10,2) DEFAULT 0,
    rating numeric(3,2),
    employment_status character varying(20),
    preferences jsonb DEFAULT '{}'::jsonb,
    skills jsonb DEFAULT '[]'::jsonb,
    documents jsonb DEFAULT '[]'::jsonb,
    certifications jsonb DEFAULT '[]'::jsonb,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    approval_status public.enum_drivers_approval_status DEFAULT 'pending_review'::public.enum_drivers_approval_status,
    CONSTRAINT drivers_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric)))
);


ALTER TABLE public.drivers OWNER TO postgres;

--
-- Name: drivers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.drivers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.drivers_id_seq OWNER TO postgres;

--
-- Name: drivers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.drivers_id_seq OWNED BY public.drivers.id;


--
-- Name: drivers_vehicle_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drivers_vehicle_assignments (
    id integer NOT NULL,
    vehicle_id integer,
    driver_id integer,
    assignment_order integer,
    is_primary boolean DEFAULT false,
    status character varying(50) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    start_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    end_date timestamp without time zone,
    CONSTRAINT drivers_vehicle_assignments_assignment_order_check CHECK (((assignment_order >= 1) AND (assignment_order <= 4)))
);


ALTER TABLE public.drivers_vehicle_assignments OWNER TO postgres;

--
-- Name: drivers_vehicle_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.drivers_vehicle_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.drivers_vehicle_assignments_id_seq OWNER TO postgres;

--
-- Name: drivers_vehicle_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.drivers_vehicle_assignments_id_seq OWNED BY public.drivers_vehicle_assignments.id;


--
-- Name: fleet_driver_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fleet_driver_accounts (
    id integer NOT NULL,
    driver_id integer,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    status public.account_status DEFAULT 'active'::public.account_status,
    device_token character varying(255),
    verification_code character varying(6),
    verification_expires_at timestamp with time zone,
    last_login timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.fleet_driver_accounts OWNER TO postgres;

--
-- Name: fleet_driver_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fleet_driver_accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fleet_driver_accounts_id_seq OWNER TO postgres;

--
-- Name: fleet_driver_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fleet_driver_accounts_id_seq OWNED BY public.fleet_driver_accounts.id;


--
-- Name: fleet_driver_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fleet_driver_reset_tokens (
    id integer NOT NULL,
    driver_account_id integer,
    token character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.fleet_driver_reset_tokens OWNER TO postgres;

--
-- Name: fleet_driver_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fleet_driver_reset_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fleet_driver_reset_tokens_id_seq OWNER TO postgres;

--
-- Name: fleet_driver_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fleet_driver_reset_tokens_id_seq OWNED BY public.fleet_driver_reset_tokens.id;


--
-- Name: fleet_marketplace_vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fleet_marketplace_vehicles (
    id integer NOT NULL,
    fleet_id uuid,
    vehicle_id integer,
    availability_type public.fleet_vehicle_availability NOT NULL,
    is_active boolean DEFAULT true,
    start_date date,
    end_date date,
    available_days integer[],
    available_hours jsonb,
    price_per_km numeric(10,2),
    price_per_hour numeric(10,2),
    price_per_day numeric(10,2),
    minimum_hire_period integer,
    allowed_cargo_types public.cargo_type[],
    max_distance integer,
    service_area public.geometry(Polygon,4326),
    special_requirements text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.fleet_marketplace_vehicles OWNER TO postgres;

--
-- Name: fleet_marketplace_vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fleet_marketplace_vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fleet_marketplace_vehicles_id_seq OWNER TO postgres;

--
-- Name: fleet_marketplace_vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fleet_marketplace_vehicles_id_seq OWNED BY public.fleet_marketplace_vehicles.id;


--
-- Name: generated_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.generated_reports (
    id integer NOT NULL,
    template_id integer,
    user_id uuid,
    parameters jsonb DEFAULT '{}'::jsonb,
    result_data jsonb,
    file_url text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.generated_reports OWNER TO postgres;

--
-- Name: generated_reports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.generated_reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.generated_reports_id_seq OWNER TO postgres;

--
-- Name: generated_reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.generated_reports_id_seq OWNED BY public.generated_reports.id;


--
-- Name: independent_driver_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.independent_driver_accounts (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    status public.account_status DEFAULT 'pending_review'::public.account_status,
    device_token character varying(255),
    verification_code character varying(6),
    verification_expires_at timestamp with time zone,
    last_login timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.independent_driver_accounts OWNER TO postgres;

--
-- Name: independent_driver_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.independent_driver_accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.independent_driver_accounts_id_seq OWNER TO postgres;

--
-- Name: independent_driver_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.independent_driver_accounts_id_seq OWNED BY public.independent_driver_accounts.id;


--
-- Name: independent_driver_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.independent_driver_reset_tokens (
    id integer NOT NULL,
    driver_account_id integer,
    token character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.independent_driver_reset_tokens OWNER TO postgres;

--
-- Name: independent_driver_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.independent_driver_reset_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.independent_driver_reset_tokens_id_seq OWNER TO postgres;

--
-- Name: independent_driver_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.independent_driver_reset_tokens_id_seq OWNED BY public.independent_driver_reset_tokens.id;


--
-- Name: installation_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.installation_notifications (
    id integer NOT NULL,
    assignment_id integer,
    type character varying(50) NOT NULL,
    message text NOT NULL,
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.installation_notifications OWNER TO postgres;

--
-- Name: installation_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.installation_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.installation_notifications_id_seq OWNER TO postgres;

--
-- Name: installation_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.installation_notifications_id_seq OWNED BY public.installation_notifications.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    reference_number character varying(50),
    partner_id uuid,
    trip_id integer,
    rental_request_id integer,
    amount numeric(10,2) NOT NULL,
    tax_amount numeric(10,2),
    total_amount numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    due_date date NOT NULL,
    paid_at timestamp with time zone,
    payment_method character varying(50),
    payment_reference character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_id_seq OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: latest_device_health; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.latest_device_health AS
 SELECT DISTINCT ON (device_assignment_id) device_assignment_id,
    status,
    battery_level,
    signal_strength,
    last_communication,
    errors,
    warnings,
    created_at
   FROM public.device_health_logs
  ORDER BY device_assignment_id, created_at DESC;


ALTER VIEW public.latest_device_health OWNER TO postgres;

--
-- Name: maintenance_criteria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance_criteria (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    type public.maintenance_type NOT NULL,
    description text,
    measure_type character varying(50) NOT NULL,
    threshold_value numeric(10,2) NOT NULL,
    warning_threshold numeric(10,2) NOT NULL,
    critical_threshold numeric(10,2) NOT NULL,
    repeat_interval interval,
    is_active boolean DEFAULT true,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.maintenance_criteria OWNER TO postgres;

--
-- Name: maintenance_criteria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maintenance_criteria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_criteria_id_seq OWNER TO postgres;

--
-- Name: maintenance_criteria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maintenance_criteria_id_seq OWNED BY public.maintenance_criteria.id;


--
-- Name: maintenance_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance_logs (
    id integer NOT NULL,
    vehicle_id integer,
    schedule_id integer,
    type public.maintenance_type NOT NULL,
    performed_at timestamp with time zone NOT NULL,
    performed_by uuid,
    odometer_reading integer,
    cost numeric(10,2),
    parts_used jsonb DEFAULT '[]'::jsonb,
    diagnosis text,
    work_performed text,
    recommendations text,
    documents jsonb DEFAULT '[]'::jsonb,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.maintenance_logs OWNER TO postgres;

--
-- Name: maintenance_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maintenance_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_logs_id_seq OWNER TO postgres;

--
-- Name: maintenance_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maintenance_logs_id_seq OWNED BY public.maintenance_logs.id;


--
-- Name: maintenance_recommendations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance_recommendations (
    id integer NOT NULL,
    vehicle_id integer,
    criteria_id integer,
    type public.maintenance_type NOT NULL,
    priority character varying(20) NOT NULL,
    current_value numeric(10,2) NOT NULL,
    threshold_value numeric(10,2) NOT NULL,
    due_date date,
    status public.maintenance_status DEFAULT 'pending'::public.maintenance_status,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.maintenance_recommendations OWNER TO postgres;

--
-- Name: maintenance_recommendations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maintenance_recommendations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_recommendations_id_seq OWNER TO postgres;

--
-- Name: maintenance_recommendations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maintenance_recommendations_id_seq OWNED BY public.maintenance_recommendations.id;


--
-- Name: maintenance_schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance_schedules (
    id integer NOT NULL,
    vehicle_id integer,
    recommendation_id integer,
    type public.maintenance_type NOT NULL,
    scheduled_date date NOT NULL,
    estimated_duration integer,
    assigned_to uuid,
    location text,
    status public.maintenance_status DEFAULT 'scheduled'::public.maintenance_status,
    cost_estimate numeric(10,2),
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.maintenance_schedules OWNER TO postgres;

--
-- Name: maintenance_schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maintenance_schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_schedules_id_seq OWNER TO postgres;

--
-- Name: maintenance_schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maintenance_schedules_id_seq OWNED BY public.maintenance_schedules.id;


--
-- Name: marketplace_vehicle_bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marketplace_vehicle_bookings (
    id integer NOT NULL,
    vehicle_id integer,
    partner_id uuid,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    pickup_location public.geometry(Point,4326),
    return_location public.geometry(Point,4326),
    purpose text,
    cargo_type public.cargo_type,
    estimated_distance integer,
    route_plan public.geometry(LineString,4326),
    base_price numeric(10,2) NOT NULL,
    additional_charges jsonb DEFAULT '[]'::jsonb,
    total_price numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    confirmation_code character varying(50),
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.marketplace_vehicle_bookings OWNER TO postgres;

--
-- Name: marketplace_vehicle_bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.marketplace_vehicle_bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marketplace_vehicle_bookings_id_seq OWNER TO postgres;

--
-- Name: marketplace_vehicle_bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.marketplace_vehicle_bookings_id_seq OWNED BY public.marketplace_vehicle_bookings.id;


--
-- Name: marketplace_vehicle_partners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marketplace_vehicle_partners (
    id integer NOT NULL,
    vehicle_id integer,
    partner_id uuid,
    custom_pricing jsonb DEFAULT '{}'::jsonb,
    priority_level integer DEFAULT 0,
    special_terms text,
    status character varying(20) DEFAULT 'active'::character varying,
    start_date date,
    end_date date,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.marketplace_vehicle_partners OWNER TO postgres;

--
-- Name: marketplace_vehicle_partners_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.marketplace_vehicle_partners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marketplace_vehicle_partners_id_seq OWNER TO postgres;

--
-- Name: marketplace_vehicle_partners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.marketplace_vehicle_partners_id_seq OWNED BY public.marketplace_vehicle_partners.id;


--
-- Name: marketplace_vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marketplace_vehicles (
    id integer NOT NULL,
    vehicle_id integer,
    fleet_id uuid,
    availability_type public.marketplace_availability_type NOT NULL,
    is_active boolean DEFAULT true,
    start_date date,
    end_date date,
    available_days integer[],
    available_hours jsonb,
    base_price_per_km numeric(10,2),
    base_price_per_hour numeric(10,2),
    minimum_hire_period integer,
    pricing_rules jsonb DEFAULT '{}'::jsonb,
    allowed_cargo_types public.cargo_type[],
    max_distance integer,
    service_area public.geometry(Polygon,4326),
    special_requirements text,
    total_orders integer DEFAULT 0,
    completed_orders integer DEFAULT 0,
    total_revenue numeric(10,2) DEFAULT 0,
    average_rating numeric(2,1),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.marketplace_vehicles OWNER TO postgres;

--
-- Name: marketplace_vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.marketplace_vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.marketplace_vehicles_id_seq OWNER TO postgres;

--
-- Name: marketplace_vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.marketplace_vehicles_id_seq OWNED BY public.marketplace_vehicles.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id uuid,
    partner_id uuid,
    type character varying(50) NOT NULL,
    title character varying(200) NOT NULL,
    message text,
    data jsonb DEFAULT '{}'::jsonb,
    is_read boolean DEFAULT false,
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: partner_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partner_accounts (
    id uuid NOT NULL,
    business_name character varying(100) NOT NULL,
    contact_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    password_hash character varying(255) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying,
    business_type character varying(50),
    commercial_record character varying(50),
    tax_number character varying(50),
    address text,
    last_login timestamp with time zone,
    device_token character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.partner_accounts OWNER TO postgres;

--
-- Name: partner_password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partner_password_reset_tokens (
    id integer NOT NULL,
    partner_id uuid,
    token character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.partner_password_reset_tokens OWNER TO postgres;

--
-- Name: partner_password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.partner_password_reset_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.partner_password_reset_tokens_id_seq OWNER TO postgres;

--
-- Name: partner_password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.partner_password_reset_tokens_id_seq OWNED BY public.partner_password_reset_tokens.id;


--
-- Name: partner_trip_bids; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partner_trip_bids (
    id integer NOT NULL,
    request_id integer,
    fleet_id uuid,
    vehicle_id integer,
    price_offer numeric(10,2) NOT NULL,
    notes text,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.partner_trip_bids OWNER TO postgres;

--
-- Name: partner_trip_bids_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.partner_trip_bids_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.partner_trip_bids_id_seq OWNER TO postgres;

--
-- Name: partner_trip_bids_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.partner_trip_bids_id_seq OWNED BY public.partner_trip_bids.id;


--
-- Name: partner_trip_offers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partner_trip_offers (
    id integer NOT NULL,
    partner_id uuid,
    title character varying(200) NOT NULL,
    description text,
    pickup_location public.geometry(Point,4326),
    delivery_location public.geometry(Point,4326),
    pickup_address text,
    delivery_address text,
    required_vehicle_type character varying(50),
    cargo_type character varying(50),
    cargo_weight numeric(10,2),
    cargo_volume numeric(10,2),
    price_offer numeric(10,2),
    pickup_date timestamp with time zone,
    delivery_date timestamp with time zone,
    status character varying(20) DEFAULT 'open'::character varying,
    assigned_vehicle_id integer,
    assigned_at timestamp with time zone,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.partner_trip_offers OWNER TO postgres;

--
-- Name: partner_trip_offers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.partner_trip_offers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.partner_trip_offers_id_seq OWNER TO postgres;

--
-- Name: partner_trip_offers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.partner_trip_offers_id_seq OWNED BY public.partner_trip_offers.id;


--
-- Name: partner_trip_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partner_trip_requests (
    id integer NOT NULL,
    partner_id uuid,
    reference_number character varying(50),
    title character varying(200) NOT NULL,
    description text,
    pickup_location public.geometry(Point,4326) NOT NULL,
    pickup_address text NOT NULL,
    delivery_location public.geometry(Point,4326) NOT NULL,
    delivery_address text NOT NULL,
    pickup_date timestamp with time zone NOT NULL,
    delivery_date timestamp with time zone NOT NULL,
    cargo_type public.cargo_type NOT NULL,
    cargo_weight numeric(10,2),
    cargo_volume numeric(10,2),
    special_requirements text,
    required_vehicle_type character varying(50),
    price_offer numeric(10,2),
    status public.partner_trip_status DEFAULT 'draft'::public.partner_trip_status,
    assigned_fleet_id uuid,
    assigned_vehicle_id integer,
    assigned_trip_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.partner_trip_requests OWNER TO postgres;

--
-- Name: partner_trip_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.partner_trip_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.partner_trip_requests_id_seq OWNER TO postgres;

--
-- Name: partner_trip_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.partner_trip_requests_id_seq OWNED BY public.partner_trip_requests.id;


--
-- Name: partner_vehicle_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partner_vehicle_requests (
    id integer NOT NULL,
    partner_id uuid,
    vehicle_id integer,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    pickup_location public.geometry(Point,4326),
    return_location public.geometry(Point,4326),
    purpose text,
    cargo_type public.cargo_type,
    estimated_distance integer,
    total_price numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.partner_vehicle_requests OWNER TO postgres;

--
-- Name: partner_vehicle_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.partner_vehicle_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.partner_vehicle_requests_id_seq OWNER TO postgres;

--
-- Name: partner_vehicle_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.partner_vehicle_requests_id_seq OWNED BY public.partner_vehicle_requests.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    token character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- Name: primary_devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.primary_devices (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    model character varying(255) NOT NULL,
    manufacturer character varying(255),
    description text,
    supported_sensors public.sensor_type[],
    specifications jsonb DEFAULT '{}'::jsonb,
    price numeric(10,2) NOT NULL,
    installation_fee numeric(10,2),
    image_url character varying(255),
    is_active boolean DEFAULT true,
    installation_guide_url character varying(255),
    installation_video_url character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    trailer_type public.trailer_type[],
    type public.vehicle_type,
    category character varying(50) DEFAULT 'primary_devices'::character varying
);


ALTER TABLE public.primary_devices OWNER TO postgres;

--
-- Name: primary_devices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.primary_devices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.primary_devices_id_seq OWNER TO postgres;

--
-- Name: primary_devices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.primary_devices_id_seq OWNED BY public.primary_devices.id;


--
-- Name: purchased_devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchased_devices (
    id integer NOT NULL,
    order_id character varying(255) NOT NULL,
    user_id uuid NOT NULL,
    device_id integer NOT NULL,
    serial_number character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    assigned boolean DEFAULT false
);


ALTER TABLE public.purchased_devices OWNER TO postgres;

--
-- Name: purchased_devices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchased_devices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchased_devices_id_seq OWNER TO postgres;

--
-- Name: purchased_devices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchased_devices_id_seq OWNED BY public.purchased_devices.id;


--
-- Name: purchased_sensors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchased_sensors (
    id integer NOT NULL,
    order_id character varying(255) NOT NULL,
    user_id uuid NOT NULL,
    sensor_id integer NOT NULL,
    serial_number character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    assigned boolean DEFAULT false
);


ALTER TABLE public.purchased_sensors OWNER TO postgres;

--
-- Name: purchased_sensors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchased_sensors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchased_sensors_id_seq OWNER TO postgres;

--
-- Name: purchased_sensors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchased_sensors_id_seq OWNED BY public.purchased_sensors.id;


--
-- Name: purchases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchases (
    id character varying NOT NULL,
    items jsonb NOT NULL,
    total numeric(10,2) NOT NULL,
    date timestamp with time zone NOT NULL,
    user_id uuid NOT NULL,
    processed boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.purchases OWNER TO postgres;

--
-- Name: purchases_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchases_id_seq OWNER TO postgres;

--
-- Name: purchases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchases_id_seq OWNED BY public.purchases.id;


--
-- Name: report_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.report_templates (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    report_type character varying(50) NOT NULL,
    query_template text NOT NULL,
    parameters jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.report_templates OWNER TO postgres;

--
-- Name: report_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.report_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.report_templates_id_seq OWNER TO postgres;

--
-- Name: report_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.report_templates_id_seq OWNED BY public.report_templates.id;


--
-- Name: sensor_device_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sensor_device_assignments (
    id integer NOT NULL,
    sensor_serial_number character varying(50),
    device_serial_number character varying(50),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sensor_device_assignments OWNER TO postgres;

--
-- Name: sensor_device_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sensor_device_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sensor_device_assignments_id_seq OWNER TO postgres;

--
-- Name: sensor_device_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sensor_device_assignments_id_seq OWNED BY public.sensor_device_assignments.id;


--
-- Name: sensor_readings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sensor_readings (
    id bigint NOT NULL,
    sensor_assignment_id integer,
    position_id bigint,
    value double precision,
    raw_value jsonb,
    "timestamp" timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sensor_readings OWNER TO postgres;

--
-- Name: sensor_readings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sensor_readings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sensor_readings_id_seq OWNER TO postgres;

--
-- Name: sensor_readings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sensor_readings_id_seq OWNED BY public.sensor_readings.id;


--
-- Name: sensors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sensors (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    type public.sensor_type NOT NULL,
    model character varying(50) NOT NULL,
    manufacturer character varying(100),
    description text,
    specifications jsonb DEFAULT '{}'::jsonb,
    price numeric(10,2) NOT NULL,
    installation_fee numeric(10,2),
    image_url character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    category character varying(50) DEFAULT 'sensors'::character varying,
    stock integer
);


ALTER TABLE public.sensors OWNER TO postgres;

--
-- Name: sensors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sensors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sensors_id_seq OWNER TO postgres;

--
-- Name: sensors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sensors_id_seq OWNED BY public.sensors.id;


--
-- Name: serial_devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.serial_devices (
    device_id integer,
    serial_number character varying(50) NOT NULL,
    available boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.serial_devices OWNER TO postgres;

--
-- Name: serial_sensors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.serial_sensors (
    sensor_id integer NOT NULL,
    serial_number character varying(255) NOT NULL,
    id integer NOT NULL,
    available boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.serial_sensors OWNER TO postgres;

--
-- Name: serial_sensors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.serial_sensors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.serial_sensors_id_seq OWNER TO postgres;

--
-- Name: serial_sensors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.serial_sensors_id_seq OWNED BY public.serial_sensors.id;


--
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.support_tickets (
    id integer NOT NULL,
    reference_number character varying(50),
    user_id uuid,
    partner_id uuid,
    category character varying(50) NOT NULL,
    priority character varying(20) DEFAULT 'normal'::character varying,
    subject character varying(200) NOT NULL,
    description text,
    status character varying(20) DEFAULT 'open'::character varying,
    assigned_to uuid,
    resolution text,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.support_tickets OWNER TO postgres;

--
-- Name: support_tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.support_tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.support_tickets_id_seq OWNER TO postgres;

--
-- Name: support_tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.support_tickets_id_seq OWNED BY public.support_tickets.id;


--
-- Name: traccar_device_configs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.traccar_device_configs (
    id integer NOT NULL,
    device_serial_number character varying(50),
    traccar_id integer,
    traccar_disabled boolean DEFAULT false,
    last_update timestamp with time zone,
    last_position_id bigint,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    traccar_status character varying(20),
    attributes jsonb DEFAULT '{}'::jsonb,
    group_id integer DEFAULT 0,
    calendar_id integer DEFAULT 0
);


ALTER TABLE public.traccar_device_configs OWNER TO postgres;

--
-- Name: traccar_device_configs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.traccar_device_configs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.traccar_device_configs_id_seq OWNER TO postgres;

--
-- Name: traccar_device_configs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.traccar_device_configs_id_seq OWNED BY public.traccar_device_configs.id;


--
-- Name: trip_device_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_device_logs (
    id integer NOT NULL,
    trip_id integer,
    device_id integer,
    position_id integer,
    driver_id integer,
    recorded_at timestamp with time zone NOT NULL,
    location public.geometry(Point,4326) NOT NULL,
    speed double precision,
    heading double precision,
    altitude double precision,
    ignition boolean,
    motion boolean,
    odometer double precision,
    fuel_level double precision,
    battery_level double precision,
    engine_hours double precision,
    engine_rpm double precision,
    engine_temp double precision,
    engine_load double precision,
    fuel_consumption double precision,
    is_alert boolean DEFAULT false,
    alert_type character varying(50),
    event_type character varying(50),
    raw_data jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_position_data CHECK (((speed >= (0)::double precision) AND (heading >= (0)::double precision) AND (heading <= (360)::double precision)))
);


ALTER TABLE public.trip_device_logs OWNER TO postgres;

--
-- Name: trip_device_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trip_device_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trip_device_logs_id_seq OWNER TO postgres;

--
-- Name: trip_device_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trip_device_logs_id_seq OWNED BY public.trip_device_logs.id;


--
-- Name: trip_driver_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_driver_assignments (
    id integer NOT NULL,
    trip_id integer,
    driver_id integer,
    role character varying(50) DEFAULT 'primary'::character varying,
    status character varying(20) DEFAULT 'assigned'::character varying,
    assigned_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.trip_driver_assignments OWNER TO postgres;

--
-- Name: trip_driver_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trip_driver_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trip_driver_assignments_id_seq OWNER TO postgres;

--
-- Name: trip_driver_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trip_driver_assignments_id_seq OWNED BY public.trip_driver_assignments.id;


--
-- Name: trip_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_events (
    id integer NOT NULL,
    trip_id integer,
    driver_id integer,
    event_type public.trip_event_type NOT NULL,
    event_time timestamp with time zone NOT NULL,
    location public.geometry(Point,4326),
    description text,
    severity character varying(20),
    requires_action boolean DEFAULT false,
    action_taken text,
    resolved_at timestamp with time zone,
    resolved_by uuid,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_resolution CHECK (((requires_action = false) OR ((requires_action = true) AND ((resolved_at IS NULL) OR (resolved_by IS NOT NULL)))))
);


ALTER TABLE public.trip_events OWNER TO postgres;

--
-- Name: trip_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trip_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trip_events_id_seq OWNER TO postgres;

--
-- Name: trip_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trip_events_id_seq OWNED BY public.trip_events.id;


--
-- Name: trip_performance_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_performance_stats (
    id integer NOT NULL,
    trip_id integer,
    last_update timestamp with time zone NOT NULL,
    total_distance double precision DEFAULT 0,
    moving_time integer DEFAULT 0,
    idle_time integer DEFAULT 0,
    stop_time integer DEFAULT 0,
    avg_speed double precision DEFAULT 0,
    max_speed double precision DEFAULT 0,
    speed_violations integer DEFAULT 0,
    fuel_consumed double precision DEFAULT 0,
    fuel_cost double precision DEFAULT 0,
    avg_fuel_economy double precision DEFAULT 0,
    harsh_acceleration_count integer DEFAULT 0,
    harsh_braking_count integer DEFAULT 0,
    harsh_cornering_count integer DEFAULT 0,
    total_alerts integer DEFAULT 0,
    total_events integer DEFAULT 0,
    score double precision DEFAULT 100,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.trip_performance_stats OWNER TO postgres;

--
-- Name: trip_performance_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trip_performance_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trip_performance_stats_id_seq OWNER TO postgres;

--
-- Name: trip_performance_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trip_performance_stats_id_seq OWNED BY public.trip_performance_stats.id;


--
-- Name: trip_sensor_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_sensor_logs (
    id integer NOT NULL,
    trip_id integer,
    sensor_reading_id integer,
    driver_id integer,
    recorded_at timestamp with time zone NOT NULL,
    location public.geometry(Point,4326),
    value jsonb NOT NULL,
    expected_range jsonb,
    is_alert boolean DEFAULT false,
    alert_type character varying(50),
    alert_severity character varying(20),
    alert_handled boolean DEFAULT false,
    handled_by uuid,
    handled_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_alert_handling CHECK (((is_alert = false) OR ((is_alert = true) AND ((alert_handled = false) OR (handled_by IS NOT NULL)))))
);


ALTER TABLE public.trip_sensor_logs OWNER TO postgres;

--
-- Name: trip_sensor_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trip_sensor_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trip_sensor_logs_id_seq OWNER TO postgres;

--
-- Name: trip_sensor_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trip_sensor_logs_id_seq OWNED BY public.trip_sensor_logs.id;


--
-- Name: trip_stops; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_stops (
    id integer NOT NULL,
    trip_id integer,
    sequence_number integer NOT NULL,
    location public.geometry(Point,4326) NOT NULL,
    address text,
    type character varying(50),
    scheduled_arrival timestamp with time zone,
    scheduled_departure timestamp with time zone,
    actual_arrival timestamp with time zone,
    actual_departure timestamp with time zone,
    tasks jsonb DEFAULT '[]'::jsonb,
    status character varying(20) DEFAULT 'pending'::character varying,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.trip_stops OWNER TO postgres;

--
-- Name: trip_stops_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trip_stops_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trip_stops_id_seq OWNER TO postgres;

--
-- Name: trip_stops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trip_stops_id_seq OWNED BY public.trip_stops.id;


--
-- Name: trip_verification_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_verification_logs (
    id integer NOT NULL,
    trip_id integer,
    driver_id integer,
    vehicle_id integer,
    verification_id integer,
    event_type character varying(50) NOT NULL,
    event_time timestamp with time zone NOT NULL,
    location public.geometry(Point,4326),
    verification_status character varying(20) NOT NULL,
    verified_by uuid,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.trip_verification_logs OWNER TO postgres;

--
-- Name: trip_verification_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trip_verification_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trip_verification_logs_id_seq OWNER TO postgres;

--
-- Name: trip_verification_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trip_verification_logs_id_seq OWNED BY public.trip_verification_logs.id;


--
-- Name: trips; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trips (
    id integer NOT NULL,
    reference_number character varying(50),
    user_id uuid,
    vehicle_id integer,
    type public.trip_type NOT NULL,
    status public.trip_status DEFAULT 'draft'::public.trip_status,
    title character varying(200),
    description text,
    scheduled_start timestamp with time zone,
    scheduled_end timestamp with time zone,
    actual_start timestamp with time zone,
    actual_end timestamp with time zone,
    start_location public.geometry(Point,4326),
    end_location public.geometry(Point,4326),
    waypoints public.geometry(MultiPoint,4326),
    planned_route public.geometry(LineString,4326),
    actual_route public.geometry(LineString,4326),
    estimated_distance numeric(10,2),
    actual_distance numeric(10,2),
    estimated_duration integer,
    actual_duration integer,
    cargo_details jsonb DEFAULT '{}'::jsonb,
    requirements jsonb DEFAULT '{}'::jsonb,
    notes text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.trips OWNER TO postgres;

--
-- Name: trips_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trips_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trips_id_seq OWNER TO postgres;

--
-- Name: trips_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trips_id_seq OWNED BY public.trips.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    phone_number character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: vehicle_driver_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_driver_logs (
    id integer NOT NULL,
    driver_id integer,
    vehicle_id integer,
    trip_id integer,
    verification_id integer,
    check_in timestamp with time zone NOT NULL,
    check_out timestamp with time zone,
    location_in public.geometry(Point,4326),
    location_out public.geometry(Point,4326),
    odometer_in integer,
    odometer_out integer,
    status character varying(20) DEFAULT 'active'::character varying,
    verification_status character varying(20) NOT NULL,
    verified_by uuid,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_check_times CHECK (((check_out IS NULL) OR (check_out > check_in)))
);


ALTER TABLE public.vehicle_driver_logs OWNER TO postgres;

--
-- Name: vehicle_driver_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehicle_driver_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicle_driver_logs_id_seq OWNER TO postgres;

--
-- Name: vehicle_driver_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehicle_driver_logs_id_seq OWNED BY public.vehicle_driver_logs.id;


--
-- Name: vehicle_inspections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_inspections (
    id integer NOT NULL,
    vehicle_id integer,
    inspector_name character varying(100) NOT NULL,
    inspection_date timestamp with time zone NOT NULL,
    type character varying(50) NOT NULL,
    status character varying(20) NOT NULL,
    odometer_reading integer,
    findings jsonb DEFAULT '[]'::jsonb,
    recommendations text,
    next_inspection_date date,
    documents jsonb DEFAULT '[]'::jsonb,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vehicle_inspections OWNER TO postgres;

--
-- Name: vehicle_inspections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehicle_inspections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicle_inspections_id_seq OWNER TO postgres;

--
-- Name: vehicle_inspections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehicle_inspections_id_seq OWNED BY public.vehicle_inspections.id;


--
-- Name: vehicle_maintenance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_maintenance (
    id integer NOT NULL,
    vehicle_id integer,
    type character varying(50) NOT NULL,
    description text,
    odometer_reading integer,
    cost numeric(10,2),
    performed_by character varying(100),
    performed_at timestamp with time zone,
    next_maintenance_date date,
    next_maintenance_odometer integer,
    documents jsonb DEFAULT '[]'::jsonb,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vehicle_maintenance OWNER TO postgres;

--
-- Name: vehicle_maintenance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehicle_maintenance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicle_maintenance_id_seq OWNER TO postgres;

--
-- Name: vehicle_maintenance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehicle_maintenance_id_seq OWNED BY public.vehicle_maintenance.id;


--
-- Name: vehicle_maintenance_specs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_maintenance_specs (
    id integer NOT NULL,
    make character varying(50) NOT NULL,
    model character varying(50) NOT NULL,
    year integer,
    criteria_id integer,
    custom_threshold numeric(10,2),
    custom_warning numeric(10,2),
    custom_critical numeric(10,2),
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vehicle_maintenance_specs OWNER TO postgres;

--
-- Name: vehicle_maintenance_specs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehicle_maintenance_specs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicle_maintenance_specs_id_seq OWNER TO postgres;

--
-- Name: vehicle_maintenance_specs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehicle_maintenance_specs_id_seq OWNED BY public.vehicle_maintenance_specs.id;


--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicles (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    make character varying(50) NOT NULL,
    model character varying(50) NOT NULL,
    year integer,
    plate_number character varying(20) NOT NULL,
    vin character varying(50),
    registration_number character varying(50),
    registration_expiry timestamp with time zone,
    insurance_number character varying(50),
    insurance_expiry timestamp with time zone,
    max_load_weight numeric(10,2),
    fuel_tank_capacity integer,
    current_odometer integer DEFAULT 0,
    specifications jsonb DEFAULT '{}'::jsonb,
    documents jsonb DEFAULT '"[]"'::jsonb,
    notes text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    last_maintenance_date timestamp with time zone,
    next_maintenance_date timestamp with time zone,
    mileage numeric(10,2) DEFAULT 0,
    fuel_type public.enum_vehicles_fuel_type,
    fuel_capacity numeric(6,2),
    type public.enum_vehicles_type NOT NULL,
    status public.enum_vehicles_status DEFAULT 'inactive'::public.enum_vehicles_status,
    name character varying(50) NOT NULL,
    vehicle_image character varying(255) DEFAULT 'https://imgur.com/a/Xjh110o'::character varying
);


ALTER TABLE public.vehicles OWNER TO postgres;

--
-- Name: vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicles_id_seq OWNER TO postgres;

--
-- Name: vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehicles_id_seq OWNED BY public.vehicles.id;


--
-- Name: device_firmware_updates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_firmware_updates ALTER COLUMN id SET DEFAULT nextval('public.device_firmware_updates_id_seq'::regclass);


--
-- Name: device_health_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_health_logs ALTER COLUMN id SET DEFAULT nextval('public.device_health_logs_id_seq'::regclass);


--
-- Name: device_maintenance_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_maintenance_logs ALTER COLUMN id SET DEFAULT nextval('public.device_maintenance_logs_id_seq'::regclass);


--
-- Name: device_positions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_positions ALTER COLUMN id SET DEFAULT nextval('public.device_positions_id_seq'::regclass);


--
-- Name: device_setup_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_setup_logs ALTER COLUMN id SET DEFAULT nextval('public.device_setup_logs_id_seq'::regclass);


--
-- Name: device_vehicle_assignments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_vehicle_assignments ALTER COLUMN id SET DEFAULT nextval('public.device_vehicle_assignments_id_seq'::regclass);


--
-- Name: driver_job_applications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_job_applications ALTER COLUMN id SET DEFAULT nextval('public.driver_job_applications_id_seq'::regclass);


--
-- Name: driver_leaves id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_leaves ALTER COLUMN id SET DEFAULT nextval('public.driver_leaves_id_seq'::regclass);


--
-- Name: driver_reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_reviews ALTER COLUMN id SET DEFAULT nextval('public.driver_reviews_id_seq'::regclass);


--
-- Name: driver_schedules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedules ALTER COLUMN id SET DEFAULT nextval('public.driver_schedules_id_seq'::regclass);


--
-- Name: driver_training id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_training ALTER COLUMN id SET DEFAULT nextval('public.driver_training_id_seq'::regclass);


--
-- Name: driver_verification_methods id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_verification_methods ALTER COLUMN id SET DEFAULT nextval('public.driver_verification_methods_id_seq'::regclass);


--
-- Name: driver_violations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_violations ALTER COLUMN id SET DEFAULT nextval('public.driver_violations_id_seq'::regclass);


--
-- Name: drivers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers ALTER COLUMN id SET DEFAULT nextval('public.drivers_id_seq'::regclass);


--
-- Name: drivers_vehicle_assignments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers_vehicle_assignments ALTER COLUMN id SET DEFAULT nextval('public.drivers_vehicle_assignments_id_seq'::regclass);


--
-- Name: fleet_driver_accounts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fleet_driver_accounts ALTER COLUMN id SET DEFAULT nextval('public.fleet_driver_accounts_id_seq'::regclass);


--
-- Name: fleet_driver_reset_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fleet_driver_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.fleet_driver_reset_tokens_id_seq'::regclass);


--
-- Name: fleet_marketplace_vehicles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fleet_marketplace_vehicles ALTER COLUMN id SET DEFAULT nextval('public.fleet_marketplace_vehicles_id_seq'::regclass);


--
-- Name: generated_reports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generated_reports ALTER COLUMN id SET DEFAULT nextval('public.generated_reports_id_seq'::regclass);


--
-- Name: independent_driver_accounts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.independent_driver_accounts ALTER COLUMN id SET DEFAULT nextval('public.independent_driver_accounts_id_seq'::regclass);


--
-- Name: independent_driver_reset_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.independent_driver_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.independent_driver_reset_tokens_id_seq'::regclass);


--
-- Name: installation_notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installation_notifications ALTER COLUMN id SET DEFAULT nextval('public.installation_notifications_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: maintenance_criteria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_criteria ALTER COLUMN id SET DEFAULT nextval('public.maintenance_criteria_id_seq'::regclass);


--
-- Name: maintenance_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_logs ALTER COLUMN id SET DEFAULT nextval('public.maintenance_logs_id_seq'::regclass);


--
-- Name: maintenance_recommendations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_recommendations ALTER COLUMN id SET DEFAULT nextval('public.maintenance_recommendations_id_seq'::regclass);


--
-- Name: maintenance_schedules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_schedules ALTER COLUMN id SET DEFAULT nextval('public.maintenance_schedules_id_seq'::regclass);


--
-- Name: marketplace_vehicle_bookings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketplace_vehicle_bookings ALTER COLUMN id SET DEFAULT nextval('public.marketplace_vehicle_bookings_id_seq'::regclass);


--
-- Name: marketplace_vehicle_partners id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketplace_vehicle_partners ALTER COLUMN id SET DEFAULT nextval('public.marketplace_vehicle_partners_id_seq'::regclass);


--
-- Name: marketplace_vehicles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketplace_vehicles ALTER COLUMN id SET DEFAULT nextval('public.marketplace_vehicles_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: partner_password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.partner_password_reset_tokens_id_seq'::regclass);


--
-- Name: partner_trip_bids id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_trip_bids ALTER COLUMN id SET DEFAULT nextval('public.partner_trip_bids_id_seq'::regclass);


--
-- Name: partner_trip_offers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_trip_offers ALTER COLUMN id SET DEFAULT nextval('public.partner_trip_offers_id_seq'::regclass);


--
-- Name: partner_trip_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_trip_requests ALTER COLUMN id SET DEFAULT nextval('public.partner_trip_requests_id_seq'::regclass);


--
-- Name: partner_vehicle_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_vehicle_requests ALTER COLUMN id SET DEFAULT nextval('public.partner_vehicle_requests_id_seq'::regclass);


--
-- Name: primary_devices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.primary_devices ALTER COLUMN id SET DEFAULT nextval('public.primary_devices_id_seq'::regclass);


--
-- Name: purchased_devices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices ALTER COLUMN id SET DEFAULT nextval('public.purchased_devices_id_seq'::regclass);


--
-- Name: purchased_sensors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors ALTER COLUMN id SET DEFAULT nextval('public.purchased_sensors_id_seq'::regclass);


--
-- Name: purchases id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases ALTER COLUMN id SET DEFAULT nextval('public.purchases_id_seq'::regclass);


--
-- Name: report_templates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_templates ALTER COLUMN id SET DEFAULT nextval('public.report_templates_id_seq'::regclass);


--
-- Name: sensor_device_assignments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor_device_assignments ALTER COLUMN id SET DEFAULT nextval('public.sensor_device_assignments_id_seq'::regclass);


--
-- Name: sensor_readings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor_readings ALTER COLUMN id SET DEFAULT nextval('public.sensor_readings_id_seq'::regclass);


--
-- Name: sensors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensors ALTER COLUMN id SET DEFAULT nextval('public.sensors_id_seq'::regclass);


--
-- Name: serial_sensors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors ALTER COLUMN id SET DEFAULT nextval('public.serial_sensors_id_seq'::regclass);


--
-- Name: support_tickets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets ALTER COLUMN id SET DEFAULT nextval('public.support_tickets_id_seq'::regclass);


--
-- Name: traccar_device_configs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs ALTER COLUMN id SET DEFAULT nextval('public.traccar_device_configs_id_seq'::regclass);


--
-- Name: trip_device_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_device_logs ALTER COLUMN id SET DEFAULT nextval('public.trip_device_logs_id_seq'::regclass);


--
-- Name: trip_driver_assignments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_driver_assignments ALTER COLUMN id SET DEFAULT nextval('public.trip_driver_assignments_id_seq'::regclass);


--
-- Name: trip_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_events ALTER COLUMN id SET DEFAULT nextval('public.trip_events_id_seq'::regclass);


--
-- Name: trip_performance_stats id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_performance_stats ALTER COLUMN id SET DEFAULT nextval('public.trip_performance_stats_id_seq'::regclass);


--
-- Name: trip_sensor_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_sensor_logs ALTER COLUMN id SET DEFAULT nextval('public.trip_sensor_logs_id_seq'::regclass);


--
-- Name: trip_stops id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_stops ALTER COLUMN id SET DEFAULT nextval('public.trip_stops_id_seq'::regclass);


--
-- Name: trip_verification_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_verification_logs ALTER COLUMN id SET DEFAULT nextval('public.trip_verification_logs_id_seq'::regclass);


--
-- Name: trips id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips ALTER COLUMN id SET DEFAULT nextval('public.trips_id_seq'::regclass);


--
-- Name: vehicle_driver_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_driver_logs ALTER COLUMN id SET DEFAULT nextval('public.vehicle_driver_logs_id_seq'::regclass);


--
-- Name: vehicle_inspections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_inspections ALTER COLUMN id SET DEFAULT nextval('public.vehicle_inspections_id_seq'::regclass);


--
-- Name: vehicle_maintenance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_maintenance ALTER COLUMN id SET DEFAULT nextval('public.vehicle_maintenance_id_seq'::regclass);


--
-- Name: vehicle_maintenance_specs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_maintenance_specs ALTER COLUMN id SET DEFAULT nextval('public.vehicle_maintenance_specs_id_seq'::regclass);


--
-- Name: vehicles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles ALTER COLUMN id SET DEFAULT nextval('public.vehicles_id_seq'::regclass);


--
-- Name: device_firmware_updates device_firmware_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_firmware_updates
    ADD CONSTRAINT device_firmware_updates_pkey PRIMARY KEY (id);


--
-- Name: device_health_logs device_health_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_health_logs
    ADD CONSTRAINT device_health_logs_pkey PRIMARY KEY (id);


--
-- Name: device_maintenance_logs device_maintenance_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_maintenance_logs
    ADD CONSTRAINT device_maintenance_logs_pkey PRIMARY KEY (id);


--
-- Name: device_positions device_positions_device_assignment_id_traccar_position_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_positions
    ADD CONSTRAINT device_positions_device_assignment_id_traccar_position_id_key UNIQUE (device_assignment_id, traccar_position_id);


--
-- Name: device_positions device_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_positions
    ADD CONSTRAINT device_positions_pkey PRIMARY KEY (id);


--
-- Name: device_setup_logs device_setup_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_setup_logs
    ADD CONSTRAINT device_setup_logs_pkey PRIMARY KEY (id);


--
-- Name: device_vehicle_assignments device_vehicle_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_vehicle_assignments
    ADD CONSTRAINT device_vehicle_assignments_pkey PRIMARY KEY (id);


--
-- Name: driver_job_applications driver_job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_job_applications
    ADD CONSTRAINT driver_job_applications_pkey PRIMARY KEY (id);


--
-- Name: driver_leaves driver_leaves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_leaves
    ADD CONSTRAINT driver_leaves_pkey PRIMARY KEY (id);


--
-- Name: driver_reviews driver_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_reviews
    ADD CONSTRAINT driver_reviews_pkey PRIMARY KEY (id);


--
-- Name: driver_schedules driver_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedules
    ADD CONSTRAINT driver_schedules_pkey PRIMARY KEY (id);


--
-- Name: driver_training driver_training_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_training
    ADD CONSTRAINT driver_training_pkey PRIMARY KEY (id);


--
-- Name: driver_verification_methods driver_verification_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_verification_methods
    ADD CONSTRAINT driver_verification_methods_pkey PRIMARY KEY (id);


--
-- Name: driver_violations driver_violations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_violations
    ADD CONSTRAINT driver_violations_pkey PRIMARY KEY (id);


--
-- Name: drivers drivers_id_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_id_number_key UNIQUE (id_number);


--
-- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (id);


--
-- Name: drivers_vehicle_assignments drivers_vehicle_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers_vehicle_assignments
    ADD CONSTRAINT drivers_vehicle_assignments_pkey PRIMARY KEY (id);


--
-- Name: drivers_vehicle_assignments drivers_vehicle_assignments_vehicle_id_assignment_order_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers_vehicle_assignments
    ADD CONSTRAINT drivers_vehicle_assignments_vehicle_id_assignment_order_key UNIQUE (vehicle_id, assignment_order);


--
-- Name: fleet_driver_accounts fleet_driver_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fleet_driver_accounts
    ADD CONSTRAINT fleet_driver_accounts_pkey PRIMARY KEY (id);


--
-- Name: fleet_driver_accounts fleet_driver_accounts_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fleet_driver_accounts
    ADD CONSTRAINT fleet_driver_accounts_username_key UNIQUE (username);


--
-- Name: fleet_driver_reset_tokens fleet_driver_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fleet_driver_reset_tokens
    ADD CONSTRAINT fleet_driver_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: fleet_marketplace_vehicles fleet_marketplace_vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fleet_marketplace_vehicles
    ADD CONSTRAINT fleet_marketplace_vehicles_pkey PRIMARY KEY (id);


--
-- Name: generated_reports generated_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generated_reports
    ADD CONSTRAINT generated_reports_pkey PRIMARY KEY (id);


--
-- Name: independent_driver_accounts independent_driver_accounts_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.independent_driver_accounts
    ADD CONSTRAINT independent_driver_accounts_email_key UNIQUE (email);


--
-- Name: independent_driver_accounts independent_driver_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.independent_driver_accounts
    ADD CONSTRAINT independent_driver_accounts_pkey PRIMARY KEY (id);


--
-- Name: independent_driver_accounts independent_driver_accounts_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.independent_driver_accounts
    ADD CONSTRAINT independent_driver_accounts_username_key UNIQUE (username);


--
-- Name: independent_driver_reset_tokens independent_driver_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.independent_driver_reset_tokens
    ADD CONSTRAINT independent_driver_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: installation_notifications installation_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installation_notifications
    ADD CONSTRAINT installation_notifications_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_reference_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_reference_number_key UNIQUE (reference_number);


--
-- Name: maintenance_criteria maintenance_criteria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_criteria
    ADD CONSTRAINT maintenance_criteria_pkey PRIMARY KEY (id);


--
-- Name: maintenance_logs maintenance_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_logs
    ADD CONSTRAINT maintenance_logs_pkey PRIMARY KEY (id);


--
-- Name: maintenance_recommendations maintenance_recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_recommendations
    ADD CONSTRAINT maintenance_recommendations_pkey PRIMARY KEY (id);


--
-- Name: maintenance_schedules maintenance_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_schedules
    ADD CONSTRAINT maintenance_schedules_pkey PRIMARY KEY (id);


--
-- Name: marketplace_vehicle_bookings marketplace_vehicle_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketplace_vehicle_bookings
    ADD CONSTRAINT marketplace_vehicle_bookings_pkey PRIMARY KEY (id);


--
-- Name: marketplace_vehicle_partners marketplace_vehicle_partners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketplace_vehicle_partners
    ADD CONSTRAINT marketplace_vehicle_partners_pkey PRIMARY KEY (id);


--
-- Name: marketplace_vehicles marketplace_vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketplace_vehicles
    ADD CONSTRAINT marketplace_vehicles_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: partner_accounts partner_accounts_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_accounts
    ADD CONSTRAINT partner_accounts_email_key UNIQUE (email);


--
-- Name: partner_accounts partner_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_accounts
    ADD CONSTRAINT partner_accounts_pkey PRIMARY KEY (id);


--
-- Name: partner_password_reset_tokens partner_password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_password_reset_tokens
    ADD CONSTRAINT partner_password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: partner_trip_bids partner_trip_bids_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_trip_bids
    ADD CONSTRAINT partner_trip_bids_pkey PRIMARY KEY (id);


--
-- Name: partner_trip_offers partner_trip_offers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_trip_offers
    ADD CONSTRAINT partner_trip_offers_pkey PRIMARY KEY (id);


--
-- Name: partner_trip_requests partner_trip_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_trip_requests
    ADD CONSTRAINT partner_trip_requests_pkey PRIMARY KEY (id);


--
-- Name: partner_trip_requests partner_trip_requests_reference_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_trip_requests
    ADD CONSTRAINT partner_trip_requests_reference_number_key UNIQUE (reference_number);


--
-- Name: partner_vehicle_requests partner_vehicle_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_vehicle_requests
    ADD CONSTRAINT partner_vehicle_requests_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: primary_devices primary_devices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.primary_devices
    ADD CONSTRAINT primary_devices_pkey PRIMARY KEY (id);


--
-- Name: purchased_devices purchased_devices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_pkey PRIMARY KEY (id);


--
-- Name: purchased_devices purchased_devices_serial_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key1 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key10 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key100; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key100 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key101; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key101 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key102; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key102 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key103; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key103 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key104; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key104 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key105; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key105 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key106; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key106 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key107 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key108; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key108 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key109; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key109 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key11 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key110; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key110 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key111; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key111 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key112; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key112 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key113; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key113 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key114; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key114 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key115; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key115 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key116; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key116 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key117; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key117 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key118; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key118 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key119; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key119 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key12 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key120; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key120 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key121; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key121 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key122; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key122 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key123; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key123 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key124; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key124 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key125; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key125 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key126; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key126 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key127 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key128; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key128 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key129; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key129 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key13 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key130; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key130 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key131; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key131 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key132; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key132 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key133; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key133 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key134; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key134 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key135; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key135 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key136; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key136 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key137; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key137 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key138; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key138 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key139; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key139 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key14 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key140; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key140 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key141; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key141 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key142; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key142 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key143; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key143 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key144; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key144 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key145; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key145 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key146; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key146 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key147; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key147 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key148; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key148 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key149; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key149 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key15 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key150; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key150 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key151; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key151 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key152; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key152 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key153; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key153 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key154; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key154 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key155; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key155 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key156; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key156 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key157; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key157 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key158; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key158 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key159; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key159 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key16 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key160; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key160 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key161; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key161 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key162; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key162 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key163; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key163 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key164; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key164 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key165; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key165 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key166; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key166 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key167; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key167 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key168; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key168 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key169; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key169 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key17 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key18 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key19 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key2 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key20 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key21 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key22 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key23 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key24 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key25 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key26 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key27 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key28 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key29 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key3 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key30 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key31 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key32 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key33 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key34 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key35 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key36 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key37 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key38 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key39 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key4 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key40 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key41 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key42 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key43 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key44 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key45 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key46 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key47 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key48 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key49 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key5 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key50 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key51 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key52 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key53 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key54 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key55 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key56 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key57 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key58 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key59 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key6 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key60 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key61 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key62 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key63 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key64 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key65 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key66 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key67 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key68 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key69 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key7 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key70 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key71 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key72 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key73 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key74 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key75 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key76 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key77 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key78 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key79 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key8 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key80 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key81 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key82 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key83 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key84 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key85 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key86 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key87 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key88 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key89 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key9 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key90 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key91 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key92 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key93 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key94 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key95 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key96; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key96 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key97; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key97 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key98 UNIQUE (serial_number);


--
-- Name: purchased_devices purchased_devices_serial_number_key99; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_serial_number_key99 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_pkey PRIMARY KEY (id);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key1 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key10 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key100; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key100 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key101; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key101 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key102; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key102 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key103; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key103 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key104; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key104 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key105; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key105 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key106; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key106 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key107 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key108; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key108 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key109; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key109 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key11 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key110; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key110 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key111; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key111 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key112; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key112 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key113; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key113 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key114; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key114 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key115; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key115 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key116; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key116 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key117; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key117 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key118; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key118 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key119; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key119 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key12 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key120; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key120 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key121; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key121 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key122; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key122 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key123; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key123 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key124; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key124 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key125; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key125 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key126; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key126 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key127 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key128; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key128 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key129; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key129 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key13 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key130; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key130 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key131; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key131 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key132; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key132 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key133; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key133 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key134; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key134 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key135; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key135 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key136; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key136 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key137; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key137 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key138; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key138 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key139; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key139 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key14 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key140; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key140 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key141; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key141 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key142; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key142 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key143; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key143 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key144; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key144 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key145; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key145 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key146; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key146 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key147; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key147 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key148; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key148 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key149; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key149 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key15 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key150; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key150 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key151; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key151 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key152; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key152 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key153; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key153 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key154; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key154 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key155; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key155 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key156; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key156 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key157; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key157 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key158; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key158 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key159; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key159 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key16 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key160; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key160 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key161; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key161 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key162; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key162 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key163; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key163 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key164; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key164 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key165; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key165 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key166; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key166 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key17 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key18 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key19 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key2 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key20 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key21 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key22 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key23 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key24 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key25 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key26 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key27 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key28 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key29 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key3 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key30 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key31 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key32 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key33 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key34 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key35 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key36 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key37 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key38 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key39 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key4 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key40 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key41 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key42 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key43 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key44 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key45 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key46 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key47 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key48 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key49 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key5 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key50 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key51 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key52 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key53 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key54 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key55 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key56 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key57 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key58 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key59 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key6 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key60 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key61 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key62 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key63 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key64 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key65 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key66 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key67 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key68 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key69 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key7 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key70 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key71 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key72 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key73 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key74 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key75 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key76 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key77 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key78 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key79 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key8 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key80 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key81 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key82 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key83 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key84 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key85 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key86 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key87 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key88 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key89 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key9 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key90 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key91 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key92 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key93 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key94 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key95 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key96; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key96 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key97; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key97 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key98 UNIQUE (serial_number);


--
-- Name: purchased_sensors purchased_sensors_serial_number_key99; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_serial_number_key99 UNIQUE (serial_number);


--
-- Name: purchases purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (id);


--
-- Name: report_templates report_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_templates
    ADD CONSTRAINT report_templates_pkey PRIMARY KEY (id);


--
-- Name: sensor_device_assignments sensor_device_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor_device_assignments
    ADD CONSTRAINT sensor_device_assignments_pkey PRIMARY KEY (id);


--
-- Name: sensor_readings sensor_readings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor_readings
    ADD CONSTRAINT sensor_readings_pkey PRIMARY KEY (id);


--
-- Name: sensors sensors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensors
    ADD CONSTRAINT sensors_pkey PRIMARY KEY (id);


--
-- Name: serial_devices serial_devices_serial_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_devices
    ADD CONSTRAINT serial_devices_serial_number_key UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key1 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key10 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key100; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key100 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key101; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key101 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key102; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key102 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key103; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key103 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key104; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key104 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key105; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key105 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key106; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key106 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key107 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key108; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key108 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key109; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key109 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key11 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key110; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key110 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key111; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key111 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key112; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key112 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key113; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key113 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key114; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key114 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key115; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key115 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key116; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key116 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key117; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key117 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key118; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key118 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key119; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key119 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key12 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key120; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key120 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key121; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key121 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key122; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key122 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key123; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key123 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key124; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key124 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key125; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key125 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key126; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key126 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key127 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key128; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key128 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key129; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key129 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key13 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key130; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key130 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key131; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key131 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key132; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key132 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key133; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key133 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key134; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key134 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key135; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key135 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key136; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key136 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key137; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key137 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key138; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key138 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key139; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key139 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key14 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key140; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key140 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key141; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key141 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key142; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key142 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key143; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key143 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key144; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key144 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key145; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key145 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key146; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key146 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key147; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key147 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key148; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key148 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key149; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key149 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key15 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key150; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key150 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key151; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key151 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key152; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key152 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key153; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key153 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key154; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key154 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key155; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key155 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key156; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key156 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key157; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key157 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key158; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key158 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key159; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key159 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key16 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key160; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key160 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key161; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key161 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key162; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key162 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key163; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key163 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key164; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key164 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key165; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key165 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key166; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key166 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key17 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key18 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key19 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key2 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key20 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key21 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key22 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key23 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key24 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key25 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key26 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key27 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key28 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key29 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key3 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key30 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key31 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key32 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key33 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key34 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key35 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key36 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key37 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key38 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key39 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key4 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key40 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key41 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key42 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key43 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key44 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key45 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key46 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key47 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key48 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key49 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key5 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key50 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key51 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key52 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key53 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key54 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key55 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key56 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key57 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key58 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key59 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key6 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key60 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key61 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key62 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key63 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key64 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key65 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key66 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key67 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key68 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key69 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key7 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key70 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key71 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key72 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key73 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key74 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key75 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key76 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key77 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key78 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key79 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key8 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key80 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key81 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key82 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key83 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key84 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key85 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key86 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key87 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key88 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key89 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key9 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key90 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key91 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key92 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key93 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key94 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key95 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key96; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key96 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key97; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key97 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key98 UNIQUE (serial_number);


--
-- Name: serial_sensors serial_sensors_serial_number_key99; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_serial_number_key99 UNIQUE (serial_number);


--
-- Name: support_tickets support_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_reference_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_reference_number_key UNIQUE (reference_number);


--
-- Name: traccar_device_configs traccar_device_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_pkey PRIMARY KEY (id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key1 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key10 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key11 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key12 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key13 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key14 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key15 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key16 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key17 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key18 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key19 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key2 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key20 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key21 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key22 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key23 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key24 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key25 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key26 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key27 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key28 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key29 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key3 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key30 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key4 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key5 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key6 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key7 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key8 UNIQUE (traccar_id);


--
-- Name: traccar_device_configs traccar_device_configs_traccar_id_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_traccar_id_key9 UNIQUE (traccar_id);


--
-- Name: trip_device_logs trip_device_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_device_logs
    ADD CONSTRAINT trip_device_logs_pkey PRIMARY KEY (id);


--
-- Name: trip_driver_assignments trip_driver_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_driver_assignments
    ADD CONSTRAINT trip_driver_assignments_pkey PRIMARY KEY (id);


--
-- Name: trip_events trip_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_events
    ADD CONSTRAINT trip_events_pkey PRIMARY KEY (id);


--
-- Name: trip_performance_stats trip_performance_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_performance_stats
    ADD CONSTRAINT trip_performance_stats_pkey PRIMARY KEY (id);


--
-- Name: trip_sensor_logs trip_sensor_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_sensor_logs
    ADD CONSTRAINT trip_sensor_logs_pkey PRIMARY KEY (id);


--
-- Name: trip_stops trip_stops_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_stops
    ADD CONSTRAINT trip_stops_pkey PRIMARY KEY (id);


--
-- Name: trip_verification_logs trip_verification_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_verification_logs
    ADD CONSTRAINT trip_verification_logs_pkey PRIMARY KEY (id);


--
-- Name: trips trips_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_pkey PRIMARY KEY (id);


--
-- Name: trips trips_reference_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_reference_number_key UNIQUE (reference_number);


--
-- Name: driver_verification_methods unique_driver_identifier; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_verification_methods
    ADD CONSTRAINT unique_driver_identifier UNIQUE (driver_id, method, identifier);


--
-- Name: vehicles unique_user_vehicle_name; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT unique_user_vehicle_name UNIQUE (user_id, name);


--
-- Name: vehicle_maintenance_specs unique_vehicle_criteria; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_maintenance_specs
    ADD CONSTRAINT unique_vehicle_criteria UNIQUE (make, model, year, criteria_id);


--
-- Name: marketplace_vehicle_partners unique_vehicle_partner; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketplace_vehicle_partners
    ADD CONSTRAINT unique_vehicle_partner UNIQUE (vehicle_id, partner_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- Name: users users_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key10 UNIQUE (email);


--
-- Name: users users_email_key100; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key100 UNIQUE (email);


--
-- Name: users users_email_key101; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key101 UNIQUE (email);


--
-- Name: users users_email_key102; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key102 UNIQUE (email);


--
-- Name: users users_email_key103; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key103 UNIQUE (email);


--
-- Name: users users_email_key104; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key104 UNIQUE (email);


--
-- Name: users users_email_key105; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key105 UNIQUE (email);


--
-- Name: users users_email_key106; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key106 UNIQUE (email);


--
-- Name: users users_email_key107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key107 UNIQUE (email);


--
-- Name: users users_email_key108; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key108 UNIQUE (email);


--
-- Name: users users_email_key109; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key109 UNIQUE (email);


--
-- Name: users users_email_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key11 UNIQUE (email);


--
-- Name: users users_email_key110; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key110 UNIQUE (email);


--
-- Name: users users_email_key111; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key111 UNIQUE (email);


--
-- Name: users users_email_key112; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key112 UNIQUE (email);


--
-- Name: users users_email_key113; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key113 UNIQUE (email);


--
-- Name: users users_email_key114; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key114 UNIQUE (email);


--
-- Name: users users_email_key115; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key115 UNIQUE (email);


--
-- Name: users users_email_key116; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key116 UNIQUE (email);


--
-- Name: users users_email_key117; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key117 UNIQUE (email);


--
-- Name: users users_email_key118; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key118 UNIQUE (email);


--
-- Name: users users_email_key119; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key119 UNIQUE (email);


--
-- Name: users users_email_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key12 UNIQUE (email);


--
-- Name: users users_email_key120; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key120 UNIQUE (email);


--
-- Name: users users_email_key121; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key121 UNIQUE (email);


--
-- Name: users users_email_key122; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key122 UNIQUE (email);


--
-- Name: users users_email_key123; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key123 UNIQUE (email);


--
-- Name: users users_email_key124; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key124 UNIQUE (email);


--
-- Name: users users_email_key125; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key125 UNIQUE (email);


--
-- Name: users users_email_key126; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key126 UNIQUE (email);


--
-- Name: users users_email_key127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key127 UNIQUE (email);


--
-- Name: users users_email_key128; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key128 UNIQUE (email);


--
-- Name: users users_email_key129; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key129 UNIQUE (email);


--
-- Name: users users_email_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key13 UNIQUE (email);


--
-- Name: users users_email_key130; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key130 UNIQUE (email);


--
-- Name: users users_email_key131; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key131 UNIQUE (email);


--
-- Name: users users_email_key132; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key132 UNIQUE (email);


--
-- Name: users users_email_key133; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key133 UNIQUE (email);


--
-- Name: users users_email_key134; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key134 UNIQUE (email);


--
-- Name: users users_email_key135; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key135 UNIQUE (email);


--
-- Name: users users_email_key136; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key136 UNIQUE (email);


--
-- Name: users users_email_key137; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key137 UNIQUE (email);


--
-- Name: users users_email_key138; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key138 UNIQUE (email);


--
-- Name: users users_email_key139; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key139 UNIQUE (email);


--
-- Name: users users_email_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key14 UNIQUE (email);


--
-- Name: users users_email_key140; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key140 UNIQUE (email);


--
-- Name: users users_email_key141; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key141 UNIQUE (email);


--
-- Name: users users_email_key142; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key142 UNIQUE (email);


--
-- Name: users users_email_key143; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key143 UNIQUE (email);


--
-- Name: users users_email_key144; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key144 UNIQUE (email);


--
-- Name: users users_email_key145; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key145 UNIQUE (email);


--
-- Name: users users_email_key146; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key146 UNIQUE (email);


--
-- Name: users users_email_key147; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key147 UNIQUE (email);


--
-- Name: users users_email_key148; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key148 UNIQUE (email);


--
-- Name: users users_email_key149; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key149 UNIQUE (email);


--
-- Name: users users_email_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key15 UNIQUE (email);


--
-- Name: users users_email_key150; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key150 UNIQUE (email);


--
-- Name: users users_email_key151; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key151 UNIQUE (email);


--
-- Name: users users_email_key152; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key152 UNIQUE (email);


--
-- Name: users users_email_key153; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key153 UNIQUE (email);


--
-- Name: users users_email_key154; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key154 UNIQUE (email);


--
-- Name: users users_email_key155; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key155 UNIQUE (email);


--
-- Name: users users_email_key156; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key156 UNIQUE (email);


--
-- Name: users users_email_key157; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key157 UNIQUE (email);


--
-- Name: users users_email_key158; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key158 UNIQUE (email);


--
-- Name: users users_email_key159; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key159 UNIQUE (email);


--
-- Name: users users_email_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key16 UNIQUE (email);


--
-- Name: users users_email_key160; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key160 UNIQUE (email);


--
-- Name: users users_email_key161; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key161 UNIQUE (email);


--
-- Name: users users_email_key162; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key162 UNIQUE (email);


--
-- Name: users users_email_key163; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key163 UNIQUE (email);


--
-- Name: users users_email_key164; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key164 UNIQUE (email);


--
-- Name: users users_email_key165; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key165 UNIQUE (email);


--
-- Name: users users_email_key166; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key166 UNIQUE (email);


--
-- Name: users users_email_key167; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key167 UNIQUE (email);


--
-- Name: users users_email_key168; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key168 UNIQUE (email);


--
-- Name: users users_email_key169; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key169 UNIQUE (email);


--
-- Name: users users_email_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key17 UNIQUE (email);


--
-- Name: users users_email_key170; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key170 UNIQUE (email);


--
-- Name: users users_email_key171; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key171 UNIQUE (email);


--
-- Name: users users_email_key172; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key172 UNIQUE (email);


--
-- Name: users users_email_key173; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key173 UNIQUE (email);


--
-- Name: users users_email_key174; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key174 UNIQUE (email);


--
-- Name: users users_email_key175; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key175 UNIQUE (email);


--
-- Name: users users_email_key176; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key176 UNIQUE (email);


--
-- Name: users users_email_key177; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key177 UNIQUE (email);


--
-- Name: users users_email_key178; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key178 UNIQUE (email);


--
-- Name: users users_email_key179; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key179 UNIQUE (email);


--
-- Name: users users_email_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key18 UNIQUE (email);


--
-- Name: users users_email_key180; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key180 UNIQUE (email);


--
-- Name: users users_email_key181; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key181 UNIQUE (email);


--
-- Name: users users_email_key182; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key182 UNIQUE (email);


--
-- Name: users users_email_key183; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key183 UNIQUE (email);


--
-- Name: users users_email_key184; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key184 UNIQUE (email);


--
-- Name: users users_email_key185; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key185 UNIQUE (email);


--
-- Name: users users_email_key186; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key186 UNIQUE (email);


--
-- Name: users users_email_key187; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key187 UNIQUE (email);


--
-- Name: users users_email_key188; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key188 UNIQUE (email);


--
-- Name: users users_email_key189; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key189 UNIQUE (email);


--
-- Name: users users_email_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key19 UNIQUE (email);


--
-- Name: users users_email_key190; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key190 UNIQUE (email);


--
-- Name: users users_email_key191; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key191 UNIQUE (email);


--
-- Name: users users_email_key192; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key192 UNIQUE (email);


--
-- Name: users users_email_key193; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key193 UNIQUE (email);


--
-- Name: users users_email_key194; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key194 UNIQUE (email);


--
-- Name: users users_email_key195; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key195 UNIQUE (email);


--
-- Name: users users_email_key196; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key196 UNIQUE (email);


--
-- Name: users users_email_key197; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key197 UNIQUE (email);


--
-- Name: users users_email_key198; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key198 UNIQUE (email);


--
-- Name: users users_email_key199; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key199 UNIQUE (email);


--
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- Name: users users_email_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key20 UNIQUE (email);


--
-- Name: users users_email_key200; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key200 UNIQUE (email);


--
-- Name: users users_email_key201; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key201 UNIQUE (email);


--
-- Name: users users_email_key202; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key202 UNIQUE (email);


--
-- Name: users users_email_key203; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key203 UNIQUE (email);


--
-- Name: users users_email_key204; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key204 UNIQUE (email);


--
-- Name: users users_email_key205; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key205 UNIQUE (email);


--
-- Name: users users_email_key206; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key206 UNIQUE (email);


--
-- Name: users users_email_key207; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key207 UNIQUE (email);


--
-- Name: users users_email_key208; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key208 UNIQUE (email);


--
-- Name: users users_email_key209; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key209 UNIQUE (email);


--
-- Name: users users_email_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key21 UNIQUE (email);


--
-- Name: users users_email_key210; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key210 UNIQUE (email);


--
-- Name: users users_email_key211; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key211 UNIQUE (email);


--
-- Name: users users_email_key212; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key212 UNIQUE (email);


--
-- Name: users users_email_key213; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key213 UNIQUE (email);


--
-- Name: users users_email_key214; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key214 UNIQUE (email);


--
-- Name: users users_email_key215; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key215 UNIQUE (email);


--
-- Name: users users_email_key216; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key216 UNIQUE (email);


--
-- Name: users users_email_key217; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key217 UNIQUE (email);


--
-- Name: users users_email_key218; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key218 UNIQUE (email);


--
-- Name: users users_email_key219; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key219 UNIQUE (email);


--
-- Name: users users_email_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key22 UNIQUE (email);


--
-- Name: users users_email_key220; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key220 UNIQUE (email);


--
-- Name: users users_email_key221; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key221 UNIQUE (email);


--
-- Name: users users_email_key222; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key222 UNIQUE (email);


--
-- Name: users users_email_key223; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key223 UNIQUE (email);


--
-- Name: users users_email_key224; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key224 UNIQUE (email);


--
-- Name: users users_email_key225; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key225 UNIQUE (email);


--
-- Name: users users_email_key226; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key226 UNIQUE (email);


--
-- Name: users users_email_key227; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key227 UNIQUE (email);


--
-- Name: users users_email_key228; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key228 UNIQUE (email);


--
-- Name: users users_email_key229; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key229 UNIQUE (email);


--
-- Name: users users_email_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key23 UNIQUE (email);


--
-- Name: users users_email_key230; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key230 UNIQUE (email);


--
-- Name: users users_email_key231; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key231 UNIQUE (email);


--
-- Name: users users_email_key232; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key232 UNIQUE (email);


--
-- Name: users users_email_key233; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key233 UNIQUE (email);


--
-- Name: users users_email_key234; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key234 UNIQUE (email);


--
-- Name: users users_email_key235; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key235 UNIQUE (email);


--
-- Name: users users_email_key236; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key236 UNIQUE (email);


--
-- Name: users users_email_key237; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key237 UNIQUE (email);


--
-- Name: users users_email_key238; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key238 UNIQUE (email);


--
-- Name: users users_email_key239; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key239 UNIQUE (email);


--
-- Name: users users_email_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key24 UNIQUE (email);


--
-- Name: users users_email_key240; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key240 UNIQUE (email);


--
-- Name: users users_email_key241; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key241 UNIQUE (email);


--
-- Name: users users_email_key242; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key242 UNIQUE (email);


--
-- Name: users users_email_key243; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key243 UNIQUE (email);


--
-- Name: users users_email_key244; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key244 UNIQUE (email);


--
-- Name: users users_email_key245; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key245 UNIQUE (email);


--
-- Name: users users_email_key246; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key246 UNIQUE (email);


--
-- Name: users users_email_key247; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key247 UNIQUE (email);


--
-- Name: users users_email_key248; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key248 UNIQUE (email);


--
-- Name: users users_email_key249; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key249 UNIQUE (email);


--
-- Name: users users_email_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key25 UNIQUE (email);


--
-- Name: users users_email_key250; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key250 UNIQUE (email);


--
-- Name: users users_email_key251; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key251 UNIQUE (email);


--
-- Name: users users_email_key252; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key252 UNIQUE (email);


--
-- Name: users users_email_key253; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key253 UNIQUE (email);


--
-- Name: users users_email_key254; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key254 UNIQUE (email);


--
-- Name: users users_email_key255; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key255 UNIQUE (email);


--
-- Name: users users_email_key256; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key256 UNIQUE (email);


--
-- Name: users users_email_key257; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key257 UNIQUE (email);


--
-- Name: users users_email_key258; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key258 UNIQUE (email);


--
-- Name: users users_email_key259; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key259 UNIQUE (email);


--
-- Name: users users_email_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key26 UNIQUE (email);


--
-- Name: users users_email_key260; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key260 UNIQUE (email);


--
-- Name: users users_email_key261; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key261 UNIQUE (email);


--
-- Name: users users_email_key262; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key262 UNIQUE (email);


--
-- Name: users users_email_key263; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key263 UNIQUE (email);


--
-- Name: users users_email_key264; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key264 UNIQUE (email);


--
-- Name: users users_email_key265; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key265 UNIQUE (email);


--
-- Name: users users_email_key266; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key266 UNIQUE (email);


--
-- Name: users users_email_key267; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key267 UNIQUE (email);


--
-- Name: users users_email_key268; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key268 UNIQUE (email);


--
-- Name: users users_email_key269; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key269 UNIQUE (email);


--
-- Name: users users_email_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key27 UNIQUE (email);


--
-- Name: users users_email_key270; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key270 UNIQUE (email);


--
-- Name: users users_email_key271; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key271 UNIQUE (email);


--
-- Name: users users_email_key272; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key272 UNIQUE (email);


--
-- Name: users users_email_key273; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key273 UNIQUE (email);


--
-- Name: users users_email_key274; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key274 UNIQUE (email);


--
-- Name: users users_email_key275; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key275 UNIQUE (email);


--
-- Name: users users_email_key276; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key276 UNIQUE (email);


--
-- Name: users users_email_key277; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key277 UNIQUE (email);


--
-- Name: users users_email_key278; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key278 UNIQUE (email);


--
-- Name: users users_email_key279; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key279 UNIQUE (email);


--
-- Name: users users_email_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key28 UNIQUE (email);


--
-- Name: users users_email_key280; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key280 UNIQUE (email);


--
-- Name: users users_email_key281; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key281 UNIQUE (email);


--
-- Name: users users_email_key282; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key282 UNIQUE (email);


--
-- Name: users users_email_key283; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key283 UNIQUE (email);


--
-- Name: users users_email_key284; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key284 UNIQUE (email);


--
-- Name: users users_email_key285; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key285 UNIQUE (email);


--
-- Name: users users_email_key286; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key286 UNIQUE (email);


--
-- Name: users users_email_key287; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key287 UNIQUE (email);


--
-- Name: users users_email_key288; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key288 UNIQUE (email);


--
-- Name: users users_email_key289; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key289 UNIQUE (email);


--
-- Name: users users_email_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key29 UNIQUE (email);


--
-- Name: users users_email_key290; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key290 UNIQUE (email);


--
-- Name: users users_email_key291; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key291 UNIQUE (email);


--
-- Name: users users_email_key292; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key292 UNIQUE (email);


--
-- Name: users users_email_key293; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key293 UNIQUE (email);


--
-- Name: users users_email_key294; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key294 UNIQUE (email);


--
-- Name: users users_email_key295; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key295 UNIQUE (email);


--
-- Name: users users_email_key296; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key296 UNIQUE (email);


--
-- Name: users users_email_key297; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key297 UNIQUE (email);


--
-- Name: users users_email_key298; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key298 UNIQUE (email);


--
-- Name: users users_email_key299; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key299 UNIQUE (email);


--
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


--
-- Name: users users_email_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key30 UNIQUE (email);


--
-- Name: users users_email_key300; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key300 UNIQUE (email);


--
-- Name: users users_email_key301; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key301 UNIQUE (email);


--
-- Name: users users_email_key302; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key302 UNIQUE (email);


--
-- Name: users users_email_key303; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key303 UNIQUE (email);


--
-- Name: users users_email_key304; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key304 UNIQUE (email);


--
-- Name: users users_email_key305; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key305 UNIQUE (email);


--
-- Name: users users_email_key306; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key306 UNIQUE (email);


--
-- Name: users users_email_key307; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key307 UNIQUE (email);


--
-- Name: users users_email_key308; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key308 UNIQUE (email);


--
-- Name: users users_email_key309; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key309 UNIQUE (email);


--
-- Name: users users_email_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key31 UNIQUE (email);


--
-- Name: users users_email_key310; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key310 UNIQUE (email);


--
-- Name: users users_email_key311; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key311 UNIQUE (email);


--
-- Name: users users_email_key312; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key312 UNIQUE (email);


--
-- Name: users users_email_key313; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key313 UNIQUE (email);


--
-- Name: users users_email_key314; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key314 UNIQUE (email);


--
-- Name: users users_email_key315; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key315 UNIQUE (email);


--
-- Name: users users_email_key316; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key316 UNIQUE (email);


--
-- Name: users users_email_key317; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key317 UNIQUE (email);


--
-- Name: users users_email_key318; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key318 UNIQUE (email);


--
-- Name: users users_email_key319; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key319 UNIQUE (email);


--
-- Name: users users_email_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key32 UNIQUE (email);


--
-- Name: users users_email_key320; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key320 UNIQUE (email);


--
-- Name: users users_email_key321; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key321 UNIQUE (email);


--
-- Name: users users_email_key322; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key322 UNIQUE (email);


--
-- Name: users users_email_key323; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key323 UNIQUE (email);


--
-- Name: users users_email_key324; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key324 UNIQUE (email);


--
-- Name: users users_email_key325; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key325 UNIQUE (email);


--
-- Name: users users_email_key326; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key326 UNIQUE (email);


--
-- Name: users users_email_key327; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key327 UNIQUE (email);


--
-- Name: users users_email_key328; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key328 UNIQUE (email);


--
-- Name: users users_email_key329; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key329 UNIQUE (email);


--
-- Name: users users_email_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key33 UNIQUE (email);


--
-- Name: users users_email_key330; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key330 UNIQUE (email);


--
-- Name: users users_email_key331; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key331 UNIQUE (email);


--
-- Name: users users_email_key332; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key332 UNIQUE (email);


--
-- Name: users users_email_key333; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key333 UNIQUE (email);


--
-- Name: users users_email_key334; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key334 UNIQUE (email);


--
-- Name: users users_email_key335; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key335 UNIQUE (email);


--
-- Name: users users_email_key336; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key336 UNIQUE (email);


--
-- Name: users users_email_key337; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key337 UNIQUE (email);


--
-- Name: users users_email_key338; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key338 UNIQUE (email);


--
-- Name: users users_email_key339; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key339 UNIQUE (email);


--
-- Name: users users_email_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key34 UNIQUE (email);


--
-- Name: users users_email_key340; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key340 UNIQUE (email);


--
-- Name: users users_email_key341; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key341 UNIQUE (email);


--
-- Name: users users_email_key342; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key342 UNIQUE (email);


--
-- Name: users users_email_key343; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key343 UNIQUE (email);


--
-- Name: users users_email_key344; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key344 UNIQUE (email);


--
-- Name: users users_email_key345; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key345 UNIQUE (email);


--
-- Name: users users_email_key346; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key346 UNIQUE (email);


--
-- Name: users users_email_key347; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key347 UNIQUE (email);


--
-- Name: users users_email_key348; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key348 UNIQUE (email);


--
-- Name: users users_email_key349; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key349 UNIQUE (email);


--
-- Name: users users_email_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key35 UNIQUE (email);


--
-- Name: users users_email_key350; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key350 UNIQUE (email);


--
-- Name: users users_email_key351; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key351 UNIQUE (email);


--
-- Name: users users_email_key352; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key352 UNIQUE (email);


--
-- Name: users users_email_key353; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key353 UNIQUE (email);


--
-- Name: users users_email_key354; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key354 UNIQUE (email);


--
-- Name: users users_email_key355; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key355 UNIQUE (email);


--
-- Name: users users_email_key356; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key356 UNIQUE (email);


--
-- Name: users users_email_key357; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key357 UNIQUE (email);


--
-- Name: users users_email_key358; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key358 UNIQUE (email);


--
-- Name: users users_email_key359; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key359 UNIQUE (email);


--
-- Name: users users_email_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key36 UNIQUE (email);


--
-- Name: users users_email_key360; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key360 UNIQUE (email);


--
-- Name: users users_email_key361; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key361 UNIQUE (email);


--
-- Name: users users_email_key362; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key362 UNIQUE (email);


--
-- Name: users users_email_key363; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key363 UNIQUE (email);


--
-- Name: users users_email_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key37 UNIQUE (email);


--
-- Name: users users_email_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key38 UNIQUE (email);


--
-- Name: users users_email_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key39 UNIQUE (email);


--
-- Name: users users_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key4 UNIQUE (email);


--
-- Name: users users_email_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key40 UNIQUE (email);


--
-- Name: users users_email_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key41 UNIQUE (email);


--
-- Name: users users_email_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key42 UNIQUE (email);


--
-- Name: users users_email_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key43 UNIQUE (email);


--
-- Name: users users_email_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key44 UNIQUE (email);


--
-- Name: users users_email_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key45 UNIQUE (email);


--
-- Name: users users_email_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key46 UNIQUE (email);


--
-- Name: users users_email_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key47 UNIQUE (email);


--
-- Name: users users_email_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key48 UNIQUE (email);


--
-- Name: users users_email_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key49 UNIQUE (email);


--
-- Name: users users_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key5 UNIQUE (email);


--
-- Name: users users_email_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key50 UNIQUE (email);


--
-- Name: users users_email_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key51 UNIQUE (email);


--
-- Name: users users_email_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key52 UNIQUE (email);


--
-- Name: users users_email_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key53 UNIQUE (email);


--
-- Name: users users_email_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key54 UNIQUE (email);


--
-- Name: users users_email_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key55 UNIQUE (email);


--
-- Name: users users_email_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key56 UNIQUE (email);


--
-- Name: users users_email_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key57 UNIQUE (email);


--
-- Name: users users_email_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key58 UNIQUE (email);


--
-- Name: users users_email_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key59 UNIQUE (email);


--
-- Name: users users_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key6 UNIQUE (email);


--
-- Name: users users_email_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key60 UNIQUE (email);


--
-- Name: users users_email_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key61 UNIQUE (email);


--
-- Name: users users_email_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key62 UNIQUE (email);


--
-- Name: users users_email_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key63 UNIQUE (email);


--
-- Name: users users_email_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key64 UNIQUE (email);


--
-- Name: users users_email_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key65 UNIQUE (email);


--
-- Name: users users_email_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key66 UNIQUE (email);


--
-- Name: users users_email_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key67 UNIQUE (email);


--
-- Name: users users_email_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key68 UNIQUE (email);


--
-- Name: users users_email_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key69 UNIQUE (email);


--
-- Name: users users_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key7 UNIQUE (email);


--
-- Name: users users_email_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key70 UNIQUE (email);


--
-- Name: users users_email_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key71 UNIQUE (email);


--
-- Name: users users_email_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key72 UNIQUE (email);


--
-- Name: users users_email_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key73 UNIQUE (email);


--
-- Name: users users_email_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key74 UNIQUE (email);


--
-- Name: users users_email_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key75 UNIQUE (email);


--
-- Name: users users_email_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key76 UNIQUE (email);


--
-- Name: users users_email_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key77 UNIQUE (email);


--
-- Name: users users_email_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key78 UNIQUE (email);


--
-- Name: users users_email_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key79 UNIQUE (email);


--
-- Name: users users_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key8 UNIQUE (email);


--
-- Name: users users_email_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key80 UNIQUE (email);


--
-- Name: users users_email_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key81 UNIQUE (email);


--
-- Name: users users_email_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key82 UNIQUE (email);


--
-- Name: users users_email_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key83 UNIQUE (email);


--
-- Name: users users_email_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key84 UNIQUE (email);


--
-- Name: users users_email_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key85 UNIQUE (email);


--
-- Name: users users_email_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key86 UNIQUE (email);


--
-- Name: users users_email_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key87 UNIQUE (email);


--
-- Name: users users_email_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key88 UNIQUE (email);


--
-- Name: users users_email_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key89 UNIQUE (email);


--
-- Name: users users_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key9 UNIQUE (email);


--
-- Name: users users_email_key90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key90 UNIQUE (email);


--
-- Name: users users_email_key91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key91 UNIQUE (email);


--
-- Name: users users_email_key92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key92 UNIQUE (email);


--
-- Name: users users_email_key93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key93 UNIQUE (email);


--
-- Name: users users_email_key94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key94 UNIQUE (email);


--
-- Name: users users_email_key95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key95 UNIQUE (email);


--
-- Name: users users_email_key96; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key96 UNIQUE (email);


--
-- Name: users users_email_key97; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key97 UNIQUE (email);


--
-- Name: users users_email_key98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key98 UNIQUE (email);


--
-- Name: users users_email_key99; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key99 UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vehicle_driver_logs vehicle_driver_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_driver_logs
    ADD CONSTRAINT vehicle_driver_logs_pkey PRIMARY KEY (id);


--
-- Name: vehicle_inspections vehicle_inspections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_inspections
    ADD CONSTRAINT vehicle_inspections_pkey PRIMARY KEY (id);


--
-- Name: vehicle_maintenance vehicle_maintenance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_maintenance
    ADD CONSTRAINT vehicle_maintenance_pkey PRIMARY KEY (id);


--
-- Name: vehicle_maintenance_specs vehicle_maintenance_specs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_maintenance_specs
    ADD CONSTRAINT vehicle_maintenance_specs_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_plate_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key1 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key10 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key100; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key100 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key101; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key101 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key102; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key102 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key103; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key103 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key104; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key104 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key105; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key105 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key106; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key106 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key107 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key108; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key108 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key109; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key109 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key11 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key110; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key110 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key111; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key111 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key112; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key112 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key113; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key113 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key114; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key114 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key115; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key115 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key116; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key116 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key117; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key117 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key118; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key118 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key119; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key119 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key12 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key120; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key120 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key121; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key121 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key122; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key122 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key123; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key123 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key124; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key124 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key125; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key125 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key126; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key126 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key127 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key128; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key128 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key129; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key129 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key13 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key130; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key130 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key131; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key131 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key132; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key132 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key133; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key133 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key134; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key134 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key135; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key135 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key136; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key136 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key137; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key137 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key138; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key138 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key139; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key139 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key14 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key140; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key140 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key141; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key141 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key142; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key142 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key143; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key143 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key144; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key144 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key145; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key145 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key146; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key146 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key147; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key147 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key148; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key148 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key149; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key149 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key15 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key150; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key150 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key151; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key151 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key152; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key152 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key153; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key153 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key154; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key154 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key155; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key155 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key156; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key156 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key157; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key157 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key158; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key158 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key159; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key159 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key16 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key160; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key160 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key161; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key161 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key162; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key162 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key163; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key163 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key164; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key164 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key165; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key165 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key166; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key166 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key167; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key167 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key168; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key168 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key169; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key169 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key17 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key170; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key170 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key171; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key171 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key172; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key172 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key173; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key173 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key174; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key174 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key175; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key175 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key176; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key176 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key177; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key177 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key178; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key178 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key179; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key179 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key18 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key180; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key180 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key181; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key181 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key182; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key182 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key183; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key183 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key184; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key184 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key185; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key185 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key186; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key186 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key187; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key187 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key188; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key188 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key189; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key189 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key19 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key190; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key190 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key191; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key191 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key192; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key192 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key193; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key193 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key194; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key194 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key2 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key20 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key21 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key22 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key23 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key24 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key25 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key26 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key27 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key28 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key29 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key3 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key30 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key31 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key32 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key33 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key34 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key35 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key36 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key37 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key38 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key39 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key4 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key40 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key41 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key42 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key43 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key44 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key45 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key46 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key47 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key48 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key49 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key5 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key50 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key51 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key52 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key53 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key54 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key55 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key56 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key57 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key58 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key59 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key6 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key60 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key61 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key62 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key63 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key64 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key65 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key66 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key67 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key68 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key69 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key7 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key70 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key71 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key72 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key73 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key74 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key75 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key76 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key77 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key78 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key79 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key8 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key80 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key81 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key82 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key83 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key84 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key85 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key86 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key87 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key88 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key89 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key9 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key90 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key91 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key92 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key93 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key94 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key95 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key96; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key96 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key97; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key97 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key98 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_plate_number_key99; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_number_key99 UNIQUE (plate_number);


--
-- Name: vehicles vehicles_vin_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key1 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key10 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key100; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key100 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key101; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key101 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key102; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key102 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key103; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key103 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key104; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key104 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key105; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key105 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key106; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key106 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key107 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key108; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key108 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key109; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key109 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key11 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key110; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key110 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key111; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key111 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key112; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key112 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key113; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key113 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key114; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key114 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key115; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key115 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key116; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key116 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key117; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key117 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key118; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key118 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key119; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key119 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key12 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key120; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key120 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key121; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key121 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key122; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key122 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key123; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key123 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key124; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key124 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key125; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key125 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key126; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key126 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key127 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key128; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key128 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key129; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key129 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key13 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key130; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key130 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key131; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key131 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key132; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key132 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key133; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key133 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key134; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key134 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key135; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key135 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key136; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key136 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key137; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key137 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key138; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key138 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key139; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key139 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key14 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key140; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key140 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key141; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key141 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key142; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key142 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key143; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key143 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key144; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key144 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key145; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key145 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key146; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key146 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key147; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key147 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key148; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key148 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key149; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key149 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key15 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key150; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key150 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key151; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key151 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key152; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key152 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key153; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key153 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key154; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key154 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key155; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key155 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key156; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key156 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key157; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key157 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key158; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key158 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key159; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key159 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key16 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key160; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key160 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key161; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key161 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key162; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key162 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key163; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key163 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key164; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key164 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key165; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key165 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key166; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key166 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key167; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key167 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key168; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key168 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key169; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key169 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key17 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key170; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key170 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key171; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key171 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key172; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key172 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key173; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key173 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key174; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key174 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key175; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key175 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key176; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key176 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key177; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key177 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key178; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key178 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key179; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key179 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key18 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key180; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key180 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key181; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key181 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key182; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key182 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key183; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key183 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key184; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key184 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key185; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key185 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key186; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key186 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key187; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key187 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key188; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key188 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key189; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key189 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key19 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key190; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key190 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key191; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key191 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key192; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key192 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key193; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key193 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key194; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key194 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key2 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key20 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key21 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key22 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key23 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key24 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key25 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key26 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key27 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key28 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key29 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key3 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key30 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key31 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key32 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key33 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key34 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key35 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key36 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key37 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key38 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key39 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key4 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key40 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key41 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key42 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key43 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key44 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key45 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key46 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key47 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key48 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key49 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key5 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key50 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key51 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key52 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key53 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key54 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key55 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key56 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key57 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key58 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key59 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key6 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key60 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key61 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key62 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key63 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key64 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key65 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key66 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key67 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key68 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key69 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key7 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key70 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key71 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key72 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key73 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key74 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key75 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key76 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key77 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key78 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key79 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key8 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key80 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key81 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key82 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key83 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key84 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key85 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key86 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key87 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key88 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key89 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key9 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key90 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key91 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key92 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key93 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key94 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key95 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key96; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key96 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key97; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key97 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key98 UNIQUE (vin);


--
-- Name: vehicles vehicles_vin_key99; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_key99 UNIQUE (vin);


--
-- Name: drivers_license_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX drivers_license_number ON public.drivers USING btree (license_number);


--
-- Name: drivers_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX drivers_status ON public.drivers USING btree (status);


--
-- Name: drivers_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX drivers_user_id ON public.drivers USING btree (user_id);


--
-- Name: idx_driver_verification_methods_driver; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_driver_verification_methods_driver ON public.driver_verification_methods USING btree (driver_id);


--
-- Name: idx_drivers_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_drivers_account_id ON public.drivers USING btree (account_id);


--
-- Name: idx_drivers_driver_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_drivers_driver_type ON public.drivers USING btree (driver_type);


--
-- Name: idx_drivers_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_drivers_status ON public.drivers USING btree (status);


--
-- Name: idx_drivers_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_drivers_user_id ON public.drivers USING btree (user_id);


--
-- Name: idx_firmware_updates_assignment; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_firmware_updates_assignment ON public.device_firmware_updates USING btree (device_assignment_id);


--
-- Name: idx_firmware_updates_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_firmware_updates_status ON public.device_firmware_updates USING btree (update_status);


--
-- Name: idx_fleet_driver_accounts_driver_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fleet_driver_accounts_driver_id ON public.fleet_driver_accounts USING btree (driver_id);


--
-- Name: idx_fleet_driver_accounts_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fleet_driver_accounts_username ON public.fleet_driver_accounts USING btree (username);


--
-- Name: idx_fleet_marketplace_vehicles_all; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fleet_marketplace_vehicles_all ON public.fleet_marketplace_vehicles USING btree (fleet_id, is_active);


--
-- Name: idx_fleet_marketplace_vehicles_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fleet_marketplace_vehicles_dates ON public.fleet_marketplace_vehicles USING btree (start_date, end_date);


--
-- Name: idx_health_logs_assignment; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_health_logs_assignment ON public.device_health_logs USING btree (device_assignment_id);


--
-- Name: idx_health_logs_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_health_logs_status ON public.device_health_logs USING btree (status);


--
-- Name: idx_health_logs_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_health_logs_time ON public.device_health_logs USING btree (created_at);


--
-- Name: idx_independent_driver_accounts_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_independent_driver_accounts_email ON public.independent_driver_accounts USING btree (email);


--
-- Name: idx_independent_driver_accounts_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_independent_driver_accounts_username ON public.independent_driver_accounts USING btree (username);


--
-- Name: idx_inspections_vehicle; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inspections_vehicle ON public.vehicle_inspections USING btree (vehicle_id);


--
-- Name: idx_job_applications_driver; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_job_applications_driver ON public.driver_job_applications USING btree (driver_id);


--
-- Name: idx_job_applications_manager; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_job_applications_manager ON public.driver_job_applications USING btree (fleet_manager_id);


--
-- Name: idx_job_applications_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_job_applications_status ON public.driver_job_applications USING btree (status);


--
-- Name: idx_leaves_driver; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leaves_driver ON public.driver_leaves USING btree (driver_id);


--
-- Name: idx_maintenance_criteria_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_maintenance_criteria_type ON public.maintenance_criteria USING btree (type);


--
-- Name: idx_maintenance_logs_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_maintenance_logs_date ON public.maintenance_logs USING btree (performed_at);


--
-- Name: idx_maintenance_logs_device; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_maintenance_logs_device ON public.device_maintenance_logs USING btree (device_id);


--
-- Name: idx_maintenance_logs_vehicle; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_maintenance_logs_vehicle ON public.maintenance_logs USING btree (vehicle_id);


--
-- Name: idx_maintenance_recommendations_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_maintenance_recommendations_status ON public.maintenance_recommendations USING btree (status);


--
-- Name: idx_maintenance_recommendations_vehicle; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_maintenance_recommendations_vehicle ON public.maintenance_recommendations USING btree (vehicle_id);


--
-- Name: idx_maintenance_schedules_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_maintenance_schedules_date ON public.maintenance_schedules USING btree (scheduled_date);


--
-- Name: idx_maintenance_schedules_vehicle; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_maintenance_schedules_vehicle ON public.maintenance_schedules USING btree (vehicle_id);


--
-- Name: idx_maintenance_vehicle; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_maintenance_vehicle ON public.vehicle_maintenance USING btree (vehicle_id);


--
-- Name: idx_marketplace_vehicle_bookings_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_marketplace_vehicle_bookings_dates ON public.marketplace_vehicle_bookings USING btree (start_time, end_time);


--
-- Name: idx_marketplace_vehicle_bookings_partner; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_marketplace_vehicle_bookings_partner ON public.marketplace_vehicle_bookings USING btree (partner_id);


--
-- Name: idx_marketplace_vehicle_bookings_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_marketplace_vehicle_bookings_status ON public.marketplace_vehicle_bookings USING btree (status);


--
-- Name: idx_marketplace_vehicle_bookings_vehicle; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_marketplace_vehicle_bookings_vehicle ON public.marketplace_vehicle_bookings USING btree (vehicle_id);


--
-- Name: idx_marketplace_vehicle_partners_all; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_marketplace_vehicle_partners_all ON public.marketplace_vehicle_partners USING btree (vehicle_id, partner_id, status);


--
-- Name: idx_marketplace_vehicles_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_marketplace_vehicles_active ON public.marketplace_vehicles USING btree (is_active);


--
-- Name: idx_marketplace_vehicles_area; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_marketplace_vehicles_area ON public.marketplace_vehicles USING gist (service_area);


--
-- Name: idx_marketplace_vehicles_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_marketplace_vehicles_dates ON public.marketplace_vehicles USING btree (start_date, end_date);


--
-- Name: idx_marketplace_vehicles_fleet; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_marketplace_vehicles_fleet ON public.marketplace_vehicles USING btree (fleet_id);


--
-- Name: idx_partner_trip_bids_request; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_partner_trip_bids_request ON public.partner_trip_bids USING btree (request_id);


--
-- Name: idx_partner_trip_requests_all; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_partner_trip_requests_all ON public.partner_trip_requests USING btree (partner_id, status);


--
-- Name: idx_partner_trip_requests_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_partner_trip_requests_dates ON public.partner_trip_requests USING btree (pickup_date, delivery_date);


--
-- Name: idx_partner_vehicle_requests_all; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_partner_vehicle_requests_all ON public.partner_vehicle_requests USING btree (partner_id, status);


--
-- Name: idx_reviews_driver; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_driver ON public.driver_reviews USING btree (driver_id);


--
-- Name: idx_schedules_driver; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schedules_driver ON public.driver_schedules USING btree (driver_id);


--
-- Name: idx_schedules_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schedules_time ON public.driver_schedules USING btree (start_time, end_time);


--
-- Name: idx_sensor_readings_position; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sensor_readings_position ON public.sensor_readings USING btree (position_id);


--
-- Name: idx_sensor_readings_sensor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sensor_readings_sensor ON public.sensor_readings USING btree (sensor_assignment_id);


--
-- Name: idx_sensor_readings_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sensor_readings_time ON public.sensor_readings USING btree ("timestamp");


--
-- Name: idx_sensors_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sensors_type ON public.sensors USING btree (type);


--
-- Name: idx_setup_logs_assignment; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_setup_logs_assignment ON public.device_setup_logs USING btree (assignment_id);


--
-- Name: idx_training_driver; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_training_driver ON public.driver_training USING btree (driver_id);


--
-- Name: idx_trip_device_logs_alerts; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trip_device_logs_alerts ON public.trip_device_logs USING btree (is_alert) WHERE (is_alert = true);


--
-- Name: idx_trip_device_logs_all; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trip_device_logs_all ON public.trip_device_logs USING btree (trip_id, device_id, driver_id, recorded_at);


--
-- Name: idx_trip_device_logs_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trip_device_logs_location ON public.trip_device_logs USING gist (location);


--
-- Name: idx_trip_device_logs_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trip_device_logs_time ON public.trip_device_logs USING btree (recorded_at);


--
-- Name: idx_trip_driver_assignments_all; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trip_driver_assignments_all ON public.trip_driver_assignments USING btree (trip_id, driver_id, status);


--
-- Name: idx_trip_events_all; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trip_events_all ON public.trip_events USING btree (trip_id, driver_id, event_type, event_time);


--
-- Name: idx_trip_events_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trip_events_location ON public.trip_events USING gist (location);


--
-- Name: idx_trip_events_unresolved; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trip_events_unresolved ON public.trip_events USING btree (requires_action) WHERE ((requires_action = true) AND (resolved_at IS NULL));


--
-- Name: idx_trip_performance_stats_score; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trip_performance_stats_score ON public.trip_performance_stats USING btree (score);


--
-- Name: idx_trip_performance_stats_trip; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trip_performance_stats_trip ON public.trip_performance_stats USING btree (trip_id);


--
-- Name: idx_trip_sensor_logs_alerts; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trip_sensor_logs_alerts ON public.trip_sensor_logs USING btree (is_alert, alert_handled) WHERE (is_alert = true);


--
-- Name: idx_trip_sensor_logs_all; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trip_sensor_logs_all ON public.trip_sensor_logs USING btree (trip_id, sensor_reading_id, driver_id, recorded_at);


--
-- Name: idx_trip_sensor_logs_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trip_sensor_logs_location ON public.trip_sensor_logs USING gist (location);


--
-- Name: idx_trip_stops_trip; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trip_stops_trip ON public.trip_stops USING btree (trip_id);


--
-- Name: idx_trip_verification_logs_all; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trip_verification_logs_all ON public.trip_verification_logs USING btree (trip_id, driver_id, vehicle_id, event_time);


--
-- Name: idx_trips_all; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trips_all ON public.trips USING btree (vehicle_id, status, scheduled_start, scheduled_end);


--
-- Name: idx_vehicle_driver_logs_all; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_driver_logs_all ON public.vehicle_driver_logs USING btree (driver_id, vehicle_id, trip_id, check_in, check_out);


--
-- Name: idx_vehicle_maintenance_specs_vehicle; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicle_maintenance_specs_vehicle ON public.vehicle_maintenance_specs USING btree (make, model, year);


--
-- Name: idx_vehicles_plate; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicles_plate ON public.vehicles USING btree (plate_number);


--
-- Name: idx_vehicles_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicles_user ON public.vehicles USING btree (user_id);


--
-- Name: idx_violations_driver; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_violations_driver ON public.driver_violations USING btree (driver_id);


--
-- Name: unique_primary_driver; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_primary_driver ON public.drivers_vehicle_assignments USING btree (driver_id) WHERE (is_primary = true);


--
-- Name: vehicles_plate_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX vehicles_plate_number ON public.vehicles USING btree (plate_number);


--
-- Name: vehicles_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX vehicles_status ON public.vehicles USING btree (status);


--
-- Name: vehicles_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX vehicles_user_id ON public.vehicles USING btree (user_id);


--
-- Name: vehicles_user_id_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX vehicles_user_id_name ON public.vehicles USING btree (user_id, name);


--
-- Name: drivers_vehicle_assignments enforce_max_drivers_per_vehicle; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER enforce_max_drivers_per_vehicle BEFORE INSERT ON public.drivers_vehicle_assignments FOR EACH ROW EXECUTE FUNCTION public.check_max_drivers_per_vehicle();


--
-- Name: device_vehicle_assignments device_vehicle_assignments_device_serial_number_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_vehicle_assignments
    ADD CONSTRAINT device_vehicle_assignments_device_serial_number_fkey FOREIGN KEY (device_serial_number) REFERENCES public.purchased_devices(serial_number);


--
-- Name: device_vehicle_assignments device_vehicle_assignments_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_vehicle_assignments
    ADD CONSTRAINT device_vehicle_assignments_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: driver_job_applications driver_job_applications_fleet_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_job_applications
    ADD CONSTRAINT driver_job_applications_fleet_manager_id_fkey FOREIGN KEY (fleet_manager_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: driver_leaves driver_leaves_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_leaves
    ADD CONSTRAINT driver_leaves_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: driver_reviews driver_reviews_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_reviews
    ADD CONSTRAINT driver_reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(id);


--
-- Name: driver_violations driver_violations_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_violations
    ADD CONSTRAINT driver_violations_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: drivers drivers_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.independent_driver_accounts(id);


--
-- Name: drivers drivers_current_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_current_vehicle_id_fkey FOREIGN KEY (current_vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: drivers drivers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: drivers_vehicle_assignments drivers_vehicle_assignments_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers_vehicle_assignments
    ADD CONSTRAINT drivers_vehicle_assignments_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id);


--
-- Name: drivers_vehicle_assignments drivers_vehicle_assignments_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers_vehicle_assignments
    ADD CONSTRAINT drivers_vehicle_assignments_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: fleet_driver_accounts fleet_driver_accounts_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fleet_driver_accounts
    ADD CONSTRAINT fleet_driver_accounts_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON DELETE CASCADE;


--
-- Name: fleet_driver_reset_tokens fleet_driver_reset_tokens_driver_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fleet_driver_reset_tokens
    ADD CONSTRAINT fleet_driver_reset_tokens_driver_account_id_fkey FOREIGN KEY (driver_account_id) REFERENCES public.fleet_driver_accounts(id) ON DELETE CASCADE;


--
-- Name: fleet_marketplace_vehicles fleet_marketplace_vehicles_fleet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fleet_marketplace_vehicles
    ADD CONSTRAINT fleet_marketplace_vehicles_fleet_id_fkey FOREIGN KEY (fleet_id) REFERENCES public.users(id);


--
-- Name: fleet_marketplace_vehicles fleet_marketplace_vehicles_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fleet_marketplace_vehicles
    ADD CONSTRAINT fleet_marketplace_vehicles_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: generated_reports generated_reports_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generated_reports
    ADD CONSTRAINT generated_reports_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.report_templates(id);


--
-- Name: generated_reports generated_reports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.generated_reports
    ADD CONSTRAINT generated_reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: independent_driver_reset_tokens independent_driver_reset_tokens_driver_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.independent_driver_reset_tokens
    ADD CONSTRAINT independent_driver_reset_tokens_driver_account_id_fkey FOREIGN KEY (driver_account_id) REFERENCES public.independent_driver_accounts(id) ON DELETE CASCADE;


--
-- Name: invoices invoices_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partner_accounts(id);


--
-- Name: invoices invoices_rental_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_rental_request_id_fkey FOREIGN KEY (rental_request_id) REFERENCES public.partner_vehicle_requests(id);


--
-- Name: invoices invoices_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id);


--
-- Name: maintenance_logs maintenance_logs_performed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_logs
    ADD CONSTRAINT maintenance_logs_performed_by_fkey FOREIGN KEY (performed_by) REFERENCES public.users(id);


--
-- Name: maintenance_logs maintenance_logs_schedule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_logs
    ADD CONSTRAINT maintenance_logs_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES public.maintenance_schedules(id);


--
-- Name: maintenance_logs maintenance_logs_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_logs
    ADD CONSTRAINT maintenance_logs_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: maintenance_recommendations maintenance_recommendations_criteria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_recommendations
    ADD CONSTRAINT maintenance_recommendations_criteria_id_fkey FOREIGN KEY (criteria_id) REFERENCES public.maintenance_criteria(id);


--
-- Name: maintenance_recommendations maintenance_recommendations_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_recommendations
    ADD CONSTRAINT maintenance_recommendations_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: maintenance_schedules maintenance_schedules_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_schedules
    ADD CONSTRAINT maintenance_schedules_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: maintenance_schedules maintenance_schedules_recommendation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_schedules
    ADD CONSTRAINT maintenance_schedules_recommendation_id_fkey FOREIGN KEY (recommendation_id) REFERENCES public.maintenance_recommendations(id);


--
-- Name: maintenance_schedules maintenance_schedules_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_schedules
    ADD CONSTRAINT maintenance_schedules_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: marketplace_vehicle_bookings marketplace_vehicle_bookings_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketplace_vehicle_bookings
    ADD CONSTRAINT marketplace_vehicle_bookings_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partner_accounts(id);


--
-- Name: marketplace_vehicle_bookings marketplace_vehicle_bookings_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketplace_vehicle_bookings
    ADD CONSTRAINT marketplace_vehicle_bookings_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.marketplace_vehicles(id);


--
-- Name: marketplace_vehicle_partners marketplace_vehicle_partners_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketplace_vehicle_partners
    ADD CONSTRAINT marketplace_vehicle_partners_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partner_accounts(id);


--
-- Name: marketplace_vehicle_partners marketplace_vehicle_partners_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketplace_vehicle_partners
    ADD CONSTRAINT marketplace_vehicle_partners_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.marketplace_vehicles(id);


--
-- Name: marketplace_vehicles marketplace_vehicles_fleet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketplace_vehicles
    ADD CONSTRAINT marketplace_vehicles_fleet_id_fkey FOREIGN KEY (fleet_id) REFERENCES public.users(id);


--
-- Name: marketplace_vehicles marketplace_vehicles_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketplace_vehicles
    ADD CONSTRAINT marketplace_vehicles_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: notifications notifications_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partner_accounts(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: partner_password_reset_tokens partner_password_reset_tokens_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_password_reset_tokens
    ADD CONSTRAINT partner_password_reset_tokens_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partner_accounts(id) ON DELETE CASCADE;


--
-- Name: partner_trip_bids partner_trip_bids_fleet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_trip_bids
    ADD CONSTRAINT partner_trip_bids_fleet_id_fkey FOREIGN KEY (fleet_id) REFERENCES public.users(id);


--
-- Name: partner_trip_bids partner_trip_bids_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_trip_bids
    ADD CONSTRAINT partner_trip_bids_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.partner_trip_requests(id);


--
-- Name: partner_trip_bids partner_trip_bids_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_trip_bids
    ADD CONSTRAINT partner_trip_bids_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: partner_trip_offers partner_trip_offers_assigned_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_trip_offers
    ADD CONSTRAINT partner_trip_offers_assigned_vehicle_id_fkey FOREIGN KEY (assigned_vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: partner_trip_offers partner_trip_offers_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_trip_offers
    ADD CONSTRAINT partner_trip_offers_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partner_accounts(id) ON DELETE CASCADE;


--
-- Name: partner_trip_requests partner_trip_requests_assigned_fleet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_trip_requests
    ADD CONSTRAINT partner_trip_requests_assigned_fleet_id_fkey FOREIGN KEY (assigned_fleet_id) REFERENCES public.users(id);


--
-- Name: partner_trip_requests partner_trip_requests_assigned_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_trip_requests
    ADD CONSTRAINT partner_trip_requests_assigned_trip_id_fkey FOREIGN KEY (assigned_trip_id) REFERENCES public.trips(id);


--
-- Name: partner_trip_requests partner_trip_requests_assigned_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_trip_requests
    ADD CONSTRAINT partner_trip_requests_assigned_vehicle_id_fkey FOREIGN KEY (assigned_vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: partner_trip_requests partner_trip_requests_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_trip_requests
    ADD CONSTRAINT partner_trip_requests_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partner_accounts(id);


--
-- Name: partner_vehicle_requests partner_vehicle_requests_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_vehicle_requests
    ADD CONSTRAINT partner_vehicle_requests_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partner_accounts(id);


--
-- Name: partner_vehicle_requests partner_vehicle_requests_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partner_vehicle_requests
    ADD CONSTRAINT partner_vehicle_requests_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.fleet_marketplace_vehicles(id);


--
-- Name: password_reset_tokens password_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: purchased_devices purchased_devices_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.primary_devices(id);


--
-- Name: purchased_devices purchased_devices_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.purchases(id) ON DELETE CASCADE;


--
-- Name: purchased_devices purchased_devices_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_devices
    ADD CONSTRAINT purchased_devices_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: purchased_sensors purchased_sensors_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.purchases(id) ON DELETE CASCADE;


--
-- Name: purchased_sensors purchased_sensors_sensor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_sensor_id_fkey FOREIGN KEY (sensor_id) REFERENCES public.sensors(id);


--
-- Name: purchased_sensors purchased_sensors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchased_sensors
    ADD CONSTRAINT purchased_sensors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: purchases purchases_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: sensor_device_assignments sensor_device_assignments_device_serial_number_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor_device_assignments
    ADD CONSTRAINT sensor_device_assignments_device_serial_number_fkey FOREIGN KEY (device_serial_number) REFERENCES public.purchased_devices(serial_number);


--
-- Name: sensor_device_assignments sensor_device_assignments_sensor_serial_number_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor_device_assignments
    ADD CONSTRAINT sensor_device_assignments_sensor_serial_number_fkey FOREIGN KEY (sensor_serial_number) REFERENCES public.purchased_sensors(serial_number);


--
-- Name: sensor_readings sensor_readings_position_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor_readings
    ADD CONSTRAINT sensor_readings_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.device_positions(id);


--
-- Name: serial_devices serial_devices_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_devices
    ADD CONSTRAINT serial_devices_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.primary_devices(id);


--
-- Name: serial_sensors serial_sensors_sensor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.serial_sensors
    ADD CONSTRAINT serial_sensors_sensor_id_fkey FOREIGN KEY (sensor_id) REFERENCES public.sensors(id);


--
-- Name: support_tickets support_tickets_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: support_tickets support_tickets_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partner_accounts(id);


--
-- Name: support_tickets support_tickets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: traccar_device_configs traccar_device_configs_device_serial_number_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.traccar_device_configs
    ADD CONSTRAINT traccar_device_configs_device_serial_number_fkey FOREIGN KEY (device_serial_number) REFERENCES public.purchased_devices(serial_number);


--
-- Name: trip_device_logs trip_device_logs_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_device_logs
    ADD CONSTRAINT trip_device_logs_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.primary_devices(id);


--
-- Name: trip_device_logs trip_device_logs_position_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_device_logs
    ADD CONSTRAINT trip_device_logs_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.device_positions(id);


--
-- Name: trip_device_logs trip_device_logs_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_device_logs
    ADD CONSTRAINT trip_device_logs_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id);


--
-- Name: trip_driver_assignments trip_driver_assignments_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_driver_assignments
    ADD CONSTRAINT trip_driver_assignments_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id);


--
-- Name: trip_events trip_events_resolved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_events
    ADD CONSTRAINT trip_events_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES public.users(id);


--
-- Name: trip_events trip_events_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_events
    ADD CONSTRAINT trip_events_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id);


--
-- Name: trip_performance_stats trip_performance_stats_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_performance_stats
    ADD CONSTRAINT trip_performance_stats_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id);


--
-- Name: trip_sensor_logs trip_sensor_logs_handled_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_sensor_logs
    ADD CONSTRAINT trip_sensor_logs_handled_by_fkey FOREIGN KEY (handled_by) REFERENCES public.users(id);


--
-- Name: trip_sensor_logs trip_sensor_logs_sensor_reading_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_sensor_logs
    ADD CONSTRAINT trip_sensor_logs_sensor_reading_id_fkey FOREIGN KEY (sensor_reading_id) REFERENCES public.sensor_readings(id);


--
-- Name: trip_sensor_logs trip_sensor_logs_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_sensor_logs
    ADD CONSTRAINT trip_sensor_logs_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id);


--
-- Name: trip_stops trip_stops_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_stops
    ADD CONSTRAINT trip_stops_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id);


--
-- Name: trip_verification_logs trip_verification_logs_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_verification_logs
    ADD CONSTRAINT trip_verification_logs_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id);


--
-- Name: trip_verification_logs trip_verification_logs_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_verification_logs
    ADD CONSTRAINT trip_verification_logs_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: trip_verification_logs trip_verification_logs_verification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_verification_logs
    ADD CONSTRAINT trip_verification_logs_verification_id_fkey FOREIGN KEY (verification_id) REFERENCES public.driver_verification_methods(id);


--
-- Name: trip_verification_logs trip_verification_logs_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_verification_logs
    ADD CONSTRAINT trip_verification_logs_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id);


--
-- Name: trips trips_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: trips trips_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: vehicle_driver_logs vehicle_driver_logs_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_driver_logs
    ADD CONSTRAINT vehicle_driver_logs_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id);


--
-- Name: vehicle_driver_logs vehicle_driver_logs_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_driver_logs
    ADD CONSTRAINT vehicle_driver_logs_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: vehicle_driver_logs vehicle_driver_logs_verification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_driver_logs
    ADD CONSTRAINT vehicle_driver_logs_verification_id_fkey FOREIGN KEY (verification_id) REFERENCES public.driver_verification_methods(id);


--
-- Name: vehicle_driver_logs vehicle_driver_logs_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_driver_logs
    ADD CONSTRAINT vehicle_driver_logs_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.users(id);


--
-- Name: vehicle_inspections vehicle_inspections_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_inspections
    ADD CONSTRAINT vehicle_inspections_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: vehicle_maintenance_specs vehicle_maintenance_specs_criteria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_maintenance_specs
    ADD CONSTRAINT vehicle_maintenance_specs_criteria_id_fkey FOREIGN KEY (criteria_id) REFERENCES public.maintenance_criteria(id);


--
-- Name: vehicle_maintenance vehicle_maintenance_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_maintenance
    ADD CONSTRAINT vehicle_maintenance_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: vehicles vehicles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

