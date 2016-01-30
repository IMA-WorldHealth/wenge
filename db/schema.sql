CREATE TABLE IF NOT EXISTS color (code TEXT, name TEXT, PRIMARY KEY (code));


CREATE TABLE IF NOT EXISTS role (
  id INTEGER PRIMARY KEY, label TEXT
);


CREATE TABLE IF NOT EXISTS signature  (
  id INTEGER PRIMARY KEY, public TEXT, private TEXT
);


CREATE TABLE IF NOT EXISTS invitation (
  id TEXT PRIMARY KEY, email TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY, username TEXT, displayname TEXT,
  email TEXT, password TEXT, roleid INTEGER, lastactive DATETIME DEFAULT CURRENT_TIMESTAMP,
  telephone INTEGER, hidden BOOLEAN, projectid INTEGER,
  signatureid INTEGER, resethash TEXT,
  FOREIGN KEY (signatureid) REFERENCES signature(id),
  FOREIGN KEY (projectid) REFERENCES project(id),
  FOREIGN KEY (roleid) REFERENCES role(id)
);


CREATE TABLE IF NOT EXISTS project (
  id INTEGER PRIMARY KEY, code TEXT, label TEXT, color TEXT, createdby INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (createdby) REFERENCES user(id)
);


CREATE TABLE IF NOT EXISTS subproject (
  id INTEGER PRIMARY KEY, projectid INTEGER, label TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (projectid) REFERENCES project(id)
);


CREATE TABLE IF NOT EXISTS voucher (
  id INTEGER PRIMARY KEY, projectid INTEGER, date DATETIME DEFAULT CURRENT_TIMESTAMP,
  beneficiary TEXT, explanation TEXT, review TEXT, status TEXT, totalamount REAL,
  createdby INTEGER,
  FOREIGN KEY (projectid) REFERENCES project(id),
  FOREIGN KEY (createdby) REFERENCES user(id)
);


CREATE TABLE IF NOT EXISTS vouchersignature (
  id INTEGER PRIMARY KEY, voucherid INTEGER, signatureid INTEGER, challenge TEXT,
  FOREIGN KEY (voucherid) REFERENCES voucher(id),
  FOREIGN KEY (signatureid) REFERENCES signature(id)
);


CREATE TABLE IF NOT EXISTS voucherdetail (
  id INTEGER PRIMARY KEY, voucherid INTEGER, item TEXT, budgetcode REAL,
  quantity REAL, unit TEXT, unitprice REAL, totalprice REAL,
  FOREIGN KEY (voucherid) REFERENCES voucher(id)
);


CREATE TABLE IF NOT EXISTS voucherattachment (
  id INTEGER PRIMARY KEY, voucherid INTEGER, reference TEXT,
  FOREIGN KEY (voucherid) REFERENCES voucher(id)
);
