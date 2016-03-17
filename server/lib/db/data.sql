INSERT INTO color VALUES
("#1abc9c", "Turquoise"),
("#2ecc71", "Emerald"),
("#3498db", "Peter River"),
("#9b59b6", "Amethyst"),
("#34495e", "Wet Asphalt"),
("#16a085", "Green Sea"),
("#27ae60", "Nephritis"),
("#2980b9", "Belize Hole"),
("#8e44ad", "Wisteria"),
("#2c3e50", "Midnight Blue"),
("#f1c40f", "Sun Flower"),
("#e67e22", "Carrot"),
("#e74c3c", "Alizarin"),
("#ecf0f1", "Clouds"),
("#95a5a6", "Concrete"),
("#f39c12", "Orange"),
("#d35400", "Pumpikin"),
("#c0392b", "Pomegranate"),
("#bdc3c7", "Silver"),
("#7f8c8d", "Asbestos");


INSERT INTO role VALUES (1, "superuser"), (2, "administrator"), (3, "user");


INSERT INTO signature VALUES
(1,
  "-----BEGIN RSA PRIVATE KEY-----\nMIIBOQIBAAJBAIbbtdO1GilAypbinmtl9UZAI6LKLMrfYoaTDSDOTBcTzKfexGMd\n0k3+lnVkGh7LaP4H3xcaQ4P72/CHBzayllcCAwEAAQJANvwkIcKofQN21phloUJ8\nA/2oyfoG01zLTjVs1+BlM878S/ppXpWcZ6kQuX7seFBnjG1ITaMLZOabAmsRZA5v\n6QIhANq7510Qw1alBl4YZ+hEDjpKGSZpL/2An8zmKJ85cm+LAiEAndWPexYVNOpI\n6bFJgnFzYqPn7nIeue/85Y6KUzBYTeUCICsDuMP8f+2SFmZ6tjRe7c1YtQlwthdM\nLCDHQkXNrktxAiBNsx/CYXmpJhkk6oEctUsvaS85hHa55HokbEqOb4NZPQIgGxyV\nW1kNLsno33LJrlxEdF4JB4R85ROGOKB9Ev97y0U=\n-----END RSA PRIVATE KEY-----",
  "-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIbbtdO1GilAypbinmtl9UZAI6LKLMrf\nYoaTDSDOTBcTzKfexGMd0k3+lnVkGh7LaP4H3xcaQ4P72/CHBzayllcCAwEAAQ==\n-----END PUBLIC KEY-----"
);


INSERT INTO project (label, code, color) VALUES ("IMA", 425, "#2c3e50"), ("Global Fund", 407, "#bdc3c7"), ("Ushindi", 303, "#9b59b6");


INSERT INTO subproject (projectid, label) VALUES
  (1, "Finance Workshop"),
  (1, "IHRIS reform support"),
  (1, "Nutrition"),
  (1, "Training CODESA"),
  (1, "Computerized"),
  (1, "Corruption report"),
  (1, "Develop BCC Promo"),
  (1, "PMTCT services"),
  (1, "Test site in HZ"),
  (1, "TB testing sites"),
  (1, "Empowerment"),
  (1, "Atelier/Conference");

-- password is 'password' hashed with bcrypt
INSERT INTO user (username, displayname, email, password, roleid, hidden, projectid, signatureid) VALUES
("admin", "Adminstrator", "developers@imaworldhealth.org", "$2a$10$RjH4nNRIR4A4uw.iBIhPMexfiRuJDIG1lF4lwp3wYabYzavBj5qL.", 1, 1, 1, 1);
