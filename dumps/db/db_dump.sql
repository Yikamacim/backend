--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Debian 16.8-1.pgdg120+1)
-- Dumped by pg_dump version 16.8 (Debian 16.8-1.pgdg120+1)

-- Started on 2025-03-18 13:02:48 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 846 (class 1247 OID 16387)
-- Name: AccountType; Type: TYPE; Schema: public; Owner: UYikamacim
--

CREATE TYPE public."AccountType" AS ENUM (
    'USER',
    'BUSINESS',
    'EMPLOYEE'
);


ALTER TYPE public."AccountType" OWNER TO "UYikamacim";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16393)
-- Name: Account; Type: TABLE; Schema: public; Owner: UYikamacim
--

CREATE TABLE public."Account" (
    "accountId" integer NOT NULL,
    phone character varying(15) NOT NULL,
    password character varying(60) NOT NULL,
    name character varying(50) NOT NULL,
    surname character varying(50) NOT NULL,
    "accountType" public."AccountType" NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Account" OWNER TO "UYikamacim";

--
-- TOC entry 216 (class 1259 OID 16396)
-- Name: Account_accountId_seq; Type: SEQUENCE; Schema: public; Owner: UYikamacim
--

CREATE SEQUENCE public."Account_accountId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Account_accountId_seq" OWNER TO "UYikamacim";

--
-- TOC entry 3390 (class 0 OID 0)
-- Dependencies: 216
-- Name: Account_accountId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: UYikamacim
--

ALTER SEQUENCE public."Account_accountId_seq" OWNED BY public."Account"."accountId";


--
-- TOC entry 217 (class 1259 OID 16397)
-- Name: Session; Type: TABLE; Schema: public; Owner: UYikamacim
--

CREATE TABLE public."Session" (
    "sessionId" integer NOT NULL,
    "accountId" integer NOT NULL,
    "deviceName" character varying(128) NOT NULL,
    "sessionKey" character varying(64) NOT NULL,
    "refreshToken" character varying(256) DEFAULT 'dummy_refresh_token'::character varying NOT NULL,
    "lastActivityDate" date DEFAULT now() NOT NULL
);


ALTER TABLE public."Session" OWNER TO "UYikamacim";

--
-- TOC entry 218 (class 1259 OID 16402)
-- Name: Session_accountId_seq; Type: SEQUENCE; Schema: public; Owner: UYikamacim
--

CREATE SEQUENCE public."Session_accountId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Session_accountId_seq" OWNER TO "UYikamacim";

--
-- TOC entry 3391 (class 0 OID 0)
-- Dependencies: 218
-- Name: Session_accountId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: UYikamacim
--

ALTER SEQUENCE public."Session_accountId_seq" OWNED BY public."Session"."accountId";


--
-- TOC entry 219 (class 1259 OID 16403)
-- Name: Session_sessionId_seq; Type: SEQUENCE; Schema: public; Owner: UYikamacim
--

CREATE SEQUENCE public."Session_sessionId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Session_sessionId_seq" OWNER TO "UYikamacim";

--
-- TOC entry 3392 (class 0 OID 0)
-- Dependencies: 219
-- Name: Session_sessionId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: UYikamacim
--

ALTER SEQUENCE public."Session_sessionId_seq" OWNED BY public."Session"."sessionId";


--
-- TOC entry 221 (class 1259 OID 16430)
-- Name: Verification; Type: TABLE; Schema: public; Owner: UYikamacim
--

CREATE TABLE public."Verification" (
    "verificationId" integer NOT NULL,
    phone character varying(15) NOT NULL,
    code character varying(6) NOT NULL,
    "sentAt" timestamp without time zone NOT NULL
);


ALTER TABLE public."Verification" OWNER TO "UYikamacim";

--
-- TOC entry 220 (class 1259 OID 16429)
-- Name: verification_verificationid_seq; Type: SEQUENCE; Schema: public; Owner: UYikamacim
--

CREATE SEQUENCE public.verification_verificationid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.verification_verificationid_seq OWNER TO "UYikamacim";

--
-- TOC entry 3393 (class 0 OID 0)
-- Dependencies: 220
-- Name: verification_verificationid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: UYikamacim
--

ALTER SEQUENCE public.verification_verificationid_seq OWNED BY public."Verification"."verificationId";


--
-- TOC entry 3217 (class 2604 OID 16404)
-- Name: Account accountId; Type: DEFAULT; Schema: public; Owner: UYikamacim
--

ALTER TABLE ONLY public."Account" ALTER COLUMN "accountId" SET DEFAULT nextval('public."Account_accountId_seq"'::regclass);


--
-- TOC entry 3219 (class 2604 OID 16405)
-- Name: Session sessionId; Type: DEFAULT; Schema: public; Owner: UYikamacim
--

ALTER TABLE ONLY public."Session" ALTER COLUMN "sessionId" SET DEFAULT nextval('public."Session_sessionId_seq"'::regclass);


--
-- TOC entry 3220 (class 2604 OID 16406)
-- Name: Session accountId; Type: DEFAULT; Schema: public; Owner: UYikamacim
--

ALTER TABLE ONLY public."Session" ALTER COLUMN "accountId" SET DEFAULT nextval('public."Session_accountId_seq"'::regclass);


--
-- TOC entry 3223 (class 2604 OID 16433)
-- Name: Verification verificationId; Type: DEFAULT; Schema: public; Owner: UYikamacim
--

ALTER TABLE ONLY public."Verification" ALTER COLUMN "verificationId" SET DEFAULT nextval('public.verification_verificationid_seq'::regclass);


--
-- TOC entry 3378 (class 0 OID 16393)
-- Dependencies: 215
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: UYikamacim
--

COPY public."Account" ("accountId", phone, password, name, surname, "accountType", "isVerified") FROM stdin;
11	+905331991562	$2b$10$6DQRvLxWf/8UXXiDwaKA.uVNHYfbylrM.F8OmhtvA3PviEjXlruEG	Veysel Karani	Saydam	USER	f
\.


--
-- TOC entry 3380 (class 0 OID 16397)
-- Dependencies: 217
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: UYikamacim
--

COPY public."Session" ("sessionId", "accountId", "deviceName", "sessionKey", "refreshToken", "lastActivityDate") FROM stdin;
\.


--
-- TOC entry 3384 (class 0 OID 16430)
-- Dependencies: 221
-- Data for Name: Verification; Type: TABLE DATA; Schema: public; Owner: UYikamacim
--

COPY public."Verification" ("verificationId", phone, code, "sentAt") FROM stdin;
1	+905331991562	710746	2025-03-18 15:31:54.931
\.


--
-- TOC entry 3394 (class 0 OID 0)
-- Dependencies: 216
-- Name: Account_accountId_seq; Type: SEQUENCE SET; Schema: public; Owner: UYikamacim
--

SELECT pg_catalog.setval('public."Account_accountId_seq"', 11, true);


--
-- TOC entry 3395 (class 0 OID 0)
-- Dependencies: 218
-- Name: Session_accountId_seq; Type: SEQUENCE SET; Schema: public; Owner: UYikamacim
--

SELECT pg_catalog.setval('public."Session_accountId_seq"', 1, false);


--
-- TOC entry 3396 (class 0 OID 0)
-- Dependencies: 219
-- Name: Session_sessionId_seq; Type: SEQUENCE SET; Schema: public; Owner: UYikamacim
--

SELECT pg_catalog.setval('public."Session_sessionId_seq"', 8, true);


--
-- TOC entry 3397 (class 0 OID 0)
-- Dependencies: 220
-- Name: verification_verificationid_seq; Type: SEQUENCE SET; Schema: public; Owner: UYikamacim
--

SELECT pg_catalog.setval('public.verification_verificationid_seq', 1, true);


--
-- TOC entry 3225 (class 2606 OID 16423)
-- Name: Account Account_phone_uk; Type: CONSTRAINT; Schema: public; Owner: UYikamacim
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_phone_uk" UNIQUE (phone);


--
-- TOC entry 3227 (class 2606 OID 16408)
-- Name: Account Account_pk; Type: CONSTRAINT; Schema: public; Owner: UYikamacim
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pk" PRIMARY KEY ("accountId");


--
-- TOC entry 3229 (class 2606 OID 16412)
-- Name: Session Session_pk; Type: CONSTRAINT; Schema: public; Owner: UYikamacim
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pk" PRIMARY KEY ("sessionId");


--
-- TOC entry 3231 (class 2606 OID 16437)
-- Name: Verification Verification_phone_uk; Type: CONSTRAINT; Schema: public; Owner: UYikamacim
--

ALTER TABLE ONLY public."Verification"
    ADD CONSTRAINT "Verification_phone_uk" UNIQUE (phone);


--
-- TOC entry 3233 (class 2606 OID 16435)
-- Name: Verification Verification_pk; Type: CONSTRAINT; Schema: public; Owner: UYikamacim
--

ALTER TABLE ONLY public."Verification"
    ADD CONSTRAINT "Verification_pk" PRIMARY KEY ("verificationId");


--
-- TOC entry 3234 (class 2606 OID 16413)
-- Name: Session Session_Account_fk; Type: FK CONSTRAINT; Schema: public; Owner: UYikamacim
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_Account_fk" FOREIGN KEY ("accountId") REFERENCES public."Account"("accountId");


-- Completed on 2025-03-18 13:02:48 UTC

--
-- PostgreSQL database dump complete
--

