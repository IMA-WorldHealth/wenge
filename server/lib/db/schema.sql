-- DROP SCHEMA IF EXISTS wenge CASCADE;
-- CREATE SCHEMA wenge;

-- color codes for making various tags throughout the application
CREATE TABLE colors (
  code char(8) PRIMARY KEY,
  name varchar(100) NOT NULL
);

-- user roles
CREATE TABLE roles (
  id    SERIAL PRIMARY KEY,
  label varchar(100) NOT NULL
);

-- the public/private key signatures for users
CREATE TABLE signatures  (
  "id"        SERIAL PRIMARY KEY,
  "public"    TEXT,
  "private"   TEXT
);

-- log of email invitations sent to users, inviting them to use the application
CREATE TABLE invitations (
  id        char(36) PRIMARY KEY,
  email     TEXT NOT NULL,
  roleid    INTEGER REFERENCES roles (id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- the list of projects within the application
CREATE TABLE projects (
  id          SERIAL PRIMARY KEY,
  code        TEXT NOT NULL,
  label       TEXT NOT NULL,
  color       TEXT,
  timestamp   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- the list of users available to the application
CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  username        TEXT,
  displayname     TEXT,
  email           TEXT,
  password        TEXT,
  roleid          INTEGER REFERENCES roles (id),
  lastactive      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  telephone       INTEGER,
  hidden          BOOLEAN,
  projectid       INTEGER REFERENCES projects (id),
  signatureid     INTEGER REFERENCES signatures (id),
  resethash       TEXT
);

-- subproject codes available to PRFs
CREATE TABLE subprojects (
  id          SERIAL PRIMARY KEY,
  projectid   INTEGER REFERENCES projects (id),
  label       TEXT,
  timestamp   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- the voucher forms
CREATE TABLE vouchers (
  id            INTEGER PRIMARY KEY,
  projectid     INTEGER REFERENCES projects (id),
  date          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  beneficiary   TEXT,
  explanation   TEXT,
  review        TEXT,
  status        TEXT,
  totalamount   REAL NOT NULL,
  createdby     INTEGER REFERENCES users (id)
);

-- voucher signature hashes, identifying that the voucher has been signed by an individual
CREATE TABLE vouchersignatures (
  id          SERIAL PRIMARY KEY,
  voucherid   INTEGER REFERENCES vouchers (id),
  signatureid INTEGER REFERENCES signatures (id),
  challenge   TEXT NOT NULL
);

-- the detailed items on a voucher
CREATE TABLE voucherdetails (
  id          SERIAL PRIMARY KEY,
  voucherid   INTEGER REFERENCES vouchers (id),
  item        TEXT NOT NULL,
  budgetcode  REAL NOT NULL,
  quantity    REAL NOT NULL,
  unit        TEXT NOT NULL,
  unitprice   REAL NOT NULL,
  totalprice  REAL NOT NULL
);

-- attachments uploaded with the vouchers
CREATE TABLE voucherattachments (
  id          SERIAL PRIMARY KEY,
  voucherid   INTEGER REFERENCES vouchers (id),
  reference   TEXT NOT NULL
);

-- copied for node-connect-pg-simple's session store
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
