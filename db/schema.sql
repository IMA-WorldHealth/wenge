CREATE TABLE IF NOT EXISTS color (code TEXT, name TEXT, PRIMARY KEY (code));


CREATE TABLE IF NOT EXISTS tip (id INTEGER PRIMARY KEY, body TEXT);


CREATE TABLE IF NOT EXISTS role (
  id INTEGER PRIMARY KEY, label TEXT
);


CREATE TABLE IF NOT EXISTS signature  (
  id INTEGER PRIMARY KEY, public TEXT, private TEXT, type TEXT
);


CREATE TABLE IF NOT EXISTS invitation (
  id TEXT PRIMARY KEY, email TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY, username TEXT, displayname TEXT,
  email TEXT, password TEXT, roleid INTEGER, lastactive DATE,
  avatar TEXT NOT NULL DEFAULT '/assets/avatar.png',
  telephone INTEGER, hidden BOOLEAN, projectid INTEGER,
  signatureid INTEGER, resethash TEXT,
  FOREIGN KEY (signatureid) REFERENCES signature(id),
  FOREIGN KEY (projectid) REFERENCES project(id),
  FOREIGN KEY (roleid) REFERENCES role(id)
);


CREATE TABLE IF NOT EXISTS project (
  id INTEGER PRIMARY KEY, code TEXT, color TEXT, createdby INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (createdby) REFERENCES user(id)
);


CREATE TABLE IF NOT EXISTS subproject (
  id INTEGER PRIMARY KEY, projectid INTEGER, label TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (projectid) REFERENCES project(id)
);


CREATE TABLE IF NOT EXISTS request (
  id INTEGER PRIMARY KEY, projectid INTEGER, date TEXT, beneficiary TEXT,
  explanation TEXT, review TEXT, status TEXT, totalamount REAL,
  createdby INTEGER,
  FOREIGN KEY (projectid) REFERENCES project(id),
  FOREIGN KEY (createdby) REFERENCES user(id)
);


CREATE TABLE IF NOT EXISTS requestsignature (
  id INTEGER PRIMARY KEY, requestid INTEGER, signatureid INTEGER, challenge TEXT,
  FOREIGN KEY (requestid) REFERENCES request(id),
  FOREIGN KEY (signatureid) REFERENCES signature(id)
);


CREATE TABLE IF NOT EXISTS requestdetail (
  id INTEGER PRIMARY KEY, requestid INTEGER, item TEXT, budgetcode REAL,
  quantity REAL, unit TEXT, unitprice REAL, totalprice REAL,
  FOREIGN KEY (requestid) REFERENCES request(id)
);


CREATE TABLE IF NOT EXISTS requestattachment (
  id INTEGER PRIMARY KEY, requestid INTEGER, reference TEXT,
  FOREIGN KEY (requestid) REFERENCES request(id)
);
