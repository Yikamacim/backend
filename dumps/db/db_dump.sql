--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0 (Postgres.app)
-- Dumped by pg_dump version 17.0 (Postgres.app)

-- Started on 2024-11-17 17:35:09 +03

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
-- TOC entry 853 (class 1247 OID 16406)
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
-- TOC entry 217 (class 1259 OID 16392)
-- Name: Account; Type: TABLE; Schema: public; Owner: UYikamacim
--

CREATE TABLE public."Account" (
    "accountId" integer NOT NULL,
    username character varying(16) NOT NULL,
    password character varying(60) NOT NULL,
    "accountType" public."AccountType" NOT NULL
);


ALTER TABLE public."Account" OWNER TO "UYikamacim";

--
-- TOC entry 218 (class 1259 OID 16395)
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
-- TOC entry 3694 (class 0 OID 0)
-- Dependencies: 218
-- Name: Account_accountId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: UYikamacim
--

ALTER SEQUENCE public."Account_accountId_seq" OWNED BY public."Account"."accountId";


--
-- TOC entry 221 (class 1259 OID 16429)
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
-- TOC entry 220 (class 1259 OID 16428)
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
-- TOC entry 3695 (class 0 OID 0)
-- Dependencies: 220
-- Name: Session_accountId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: UYikamacim
--

ALTER SEQUENCE public."Session_accountId_seq" OWNED BY public."Session"."accountId";


--
-- TOC entry 219 (class 1259 OID 16427)
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
-- TOC entry 3696 (class 0 OID 0)
-- Dependencies: 219
-- Name: Session_sessionId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: UYikamacim
--

ALTER SEQUENCE public."Session_sessionId_seq" OWNED BY public."Session"."sessionId";


--
-- TOC entry 3527 (class 2604 OID 16396)
-- Name: Account accountId; Type: DEFAULT; Schema: public; Owner: UYikamacim
--

ALTER TABLE ONLY public."Account" ALTER COLUMN "accountId" SET DEFAULT nextval('public."Account_accountId_seq"'::regclass);


--
-- TOC entry 3528 (class 2604 OID 16432)
-- Name: Session sessionId; Type: DEFAULT; Schema: public; Owner: UYikamacim
--

ALTER TABLE ONLY public."Session" ALTER COLUMN "sessionId" SET DEFAULT nextval('public."Session_sessionId_seq"'::regclass);


--
-- TOC entry 3529 (class 2604 OID 16433)
-- Name: Session accountId; Type: DEFAULT; Schema: public; Owner: UYikamacim
--

ALTER TABLE ONLY public."Session" ALTER COLUMN "accountId" SET DEFAULT nextval('public."Session_accountId_seq"'::regclass);


--
-- TOC entry 3684 (class 0 OID 16392)
-- Dependencies: 217
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: UYikamacim
--

COPY public."Account" ("accountId", username, password, "accountType") FROM stdin;
10	postman	$2b$10$rolxLEZMP7ELLZfW/VpCcOyB4gqU1GeoDWXjLdIi2q4w1ik6w3ZtK	USER
\.


--
-- TOC entry 3688 (class 0 OID 16429)
-- Dependencies: 221
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: UYikamacim
--

COPY public."Session" ("sessionId", "accountId", "deviceName", "sessionKey", "refreshToken", "lastActivityDate") FROM stdin;
8	10	Postman Client	01876e626dae1931ede393903b8af7de327b828c52b37113ac3a24f373c1f0c5	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOjEwLCJhY2NvdW50VHlwZSI6IlVTRVIiLCJzZXNzaW9uSWQiOjgsImlhdCI6MTczMTg1MzQwMSwiZXhwIjoxNzM0NDQ1NDAxfQ.FtUPXWfpwMEYuans23U4TqjnXeNIDxhNDfDfd6IbG5c	2024-11-17
\.


--
-- TOC entry 3697 (class 0 OID 0)
-- Dependencies: 218
-- Name: Account_accountId_seq; Type: SEQUENCE SET; Schema: public; Owner: UYikamacim
--

SELECT pg_catalog.setval('public."Account_accountId_seq"', 10, true);


--
-- TOC entry 3698 (class 0 OID 0)
-- Dependencies: 220
-- Name: Session_accountId_seq; Type: SEQUENCE SET; Schema: public; Owner: UYikamacim
--

SELECT pg_catalog.setval('public."Session_accountId_seq"', 1, false);


--
-- TOC entry 3699 (class 0 OID 0)
-- Dependencies: 219
-- Name: Session_sessionId_seq; Type: SEQUENCE SET; Schema: public; Owner: UYikamacim
--

SELECT pg_catalog.setval('public."Session_sessionId_seq"', 8, true);


--
-- TOC entry 3533 (class 2606 OID 16398)
-- Name: Account Account_pk; Type: CONSTRAINT; Schema: public; Owner: UYikamacim
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pk" PRIMARY KEY ("accountId");


--
-- TOC entry 3535 (class 2606 OID 16404)
-- Name: Account Account_username_uk; Type: CONSTRAINT; Schema: public; Owner: UYikamacim
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_username_uk" UNIQUE (username);


--
-- TOC entry 3537 (class 2606 OID 16437)
-- Name: Session Session_pk; Type: CONSTRAINT; Schema: public; Owner: UYikamacim
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pk" PRIMARY KEY ("sessionId");


--
-- TOC entry 3538 (class 2606 OID 16438)
-- Name: Session Session_Account_fk; Type: FK CONSTRAINT; Schema: public; Owner: UYikamacim
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_Account_fk" FOREIGN KEY ("accountId") REFERENCES public."Account"("accountId");


-- Completed on 2024-11-17 17:35:10 +03

--
-- PostgreSQL database dump complete
--

