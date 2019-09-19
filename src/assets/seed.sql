CREATE TABLE
IF NOT EXISTS developer
(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,skills TEXT,img TEXT);
INSERT or
IGNORE INTO developer
VALUES
    (1, 'Nadim', '', 'https://www.gkmit.co/images/team/nadim.png');
INSERT or
IGNORE INTO developer
VALUES
    (2, 'Ajay', '', 'https://www.gkmit.co/images/team/ajay.png');
INSERT or
IGNORE INTO developer
VALUES
    (3, 'Neha', '', 'https://www.gkmit.co/images/team/neha.png');

CREATE TABLE
IF NOT EXISTS product
(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, creatorId INTEGER);
INSERT or
IGNORE INTO product(id, name, creatorId)
VALUES
    (1, 'Ionic', 1);
INSERT or
IGNORE INTO product(id, name, creatorId)
VALUES
    (2, 'Software Startup Manual', 1);
INSERT or
IGNORE INTO product(id, name, creatorId)
VALUES
    (3, 'Ionic Framework', 2);
INSERT or
IGNORE INTO product(id, name, creatorId)
VALUES
    (4, 'Ionic Db', 2);
INSERT or
IGNORE INTO product(id, name, creatorId)
VALUES
    (5, 'Ionic google map', 3);
INSERT or
IGNORE INTO product(id, name, creatorId)
VALUES
    (6, 'Ionicons', 3);