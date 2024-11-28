-- Extensions
CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;
COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;
COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
-- Types

-- Functions

-- Tables
CREATE TABLE public."Users" (-- SignUp
    id uuid NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "phoneNumber" character varying(255) NOT NULL,
    "companyName" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE public.primary_devices (
    d_serial_number character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    model character varying(50) NOT NULL,
    manufacturer character varying(100),
    description text,
    supported_sensors public.sensor_type[] DEFAULT '{}'::public.sensor_type[],
    specifications jsonb DEFAULT '{}'::jsonb,
    price numeric(10,2) NOT NULL,
    installation_fee numeric(10,2),
    stock numeric(10,2) NOT NULL,
    connecion_status character varying(20) NOT NULL,
    activity_status character varying(20) NOT NULL,
    image_url character varying(255),
    assignment_status boolean DEFAULT 'False',
    connecion_status boolean DEFAULT 'False',
    activity_status boolean DEFAULT 'False',
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    trailer_type public.trailer_type[],
    vehicle_type public.vehicle_type
);

CREATE TABLE public.sensors (
    s_serial_number character varying(50)
    name character varying(100) NOT NULL,
    type public.sensor_type NOT NULL,
    model character varying(50) NOT NULL,
    manufacturer character varying(100),
    description text,
    specifications jsonb DEFAULT '{}'::jsonb,
    price numeric(10,2) NOT NULL,
    installation_fee numeric(10,2),
    avilabilty boolean DEFAULT 'True'
    assignment_status boolean DEFAULT 'False',
    connecion_status boolean DEFAULT 'False',
    activity_status boolean DEFAULT 'False',
    image_url character varying(255),
    installation_guide_url character varying(255),
    installation_video_url character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    trailer_type public.trailer_type[],
    vehicle_type public.vehicle_type
    );

CREATE TABLE public.purchases (
    Id character varying NOT NULL,
    user_id uuid NOT NULL,
    items jsonb NOT NULL,
    total numeric(10,2) NOT NULL,
    date timestamp without time zone NOT NULL,
);

CREATE TABLE public.purchased_devices (
    OrderId fk character varying NOT NULL,
    user_id uuid NOT NULL,
    d_serial_number character varying(50) NOT NULL,
    date timestamp without time zone NOT NULL,
);

CREATE TABLE public.purchased_sensors (
    OrderId fk character varying NOT NULL,
    user_id uuid NOT NULL,
    s_serial_number character varying(50) NOT NULL,
    date timestamp without time zone NOT NULL,
);

CREATE TABLE public.sensor_device_assignments (
    id integer NOT NULL,
    s_serial_number character varying(50) NOT NULL,
    d_serial_number character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.vehicles (
    vehicle_id integer NOT NULL,
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
    specifications jsonb DEFAULT '{}'::jsonb,
    documents jsonb DEFAULT '"[]"'::jsonb,
    notes text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    fuel_type public.enum_vehicles_fuel_type,
    type public.enum_vehicles_type NOT NULL,
    status public.enum_vehicles_status DEFAULT 'inactive'::public.enum_vehicles_status
);

CREATE TABLE public.vehicles_data (
    id integer NOT NULL,
    vehicle_id integer NOT NULL,
    current_odometer integer DEFAULT 0,
    fuel_capacity_level numeric(6,2),
    mileage numeric(10,2) DEFAULT 0,
    created_at timestamp with time zone,
);

CREATE TABLE public.vehicles_maintenance (
    id integer NOT NULL,
    maintenance_date timestamp with time zone,
    complented boolean DEFAULT 'False',
    type character varying(50) NOT NULL,
    description text,
    cost numeric(10,2),
    performed_by character varying(100),
    performed_at timestamp with time zone,
    created_at timestamp with time zone,
);

CREATE TABLE public.drivers (
    id integer NOT NULL,
    user_id uuid,
    account_id integer,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    id_number character varying(20) NOT NULL,
    birth_date timestamp with time zone NOT NULL,
    phone character varying(20) NOT NULL,
    email character varying(100),
    address text,
    profile_image character varying(255),
    emergency_contact jsonb,
    current_location public.geometry(Point,4326),
    license_number character varying(50) NOT NULL,
    license_expiry timestamp with time zone NOT NULL,
    license_issue_date timestamp with time zone NOT NULL,
    hazmat_certified boolean DEFAULT false,
    experience_years integer,
    hire_date timestamp with time zone,
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
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    driver_type public.enum_drivers_driver_type NOT NULL,
    license_type public.enum_drivers_license_type NOT NULL,
    status public.enum_drivers_status DEFAULT 'inactive'::public.enum_drivers_status,
    CONSTRAINT drivers_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric)))
);

