DROP SCHEMA IF EXISTS CattoClient;
CREATE SCHEMA CattoClient;
USE CattoClient;

CREATE TABLE usersxp(
userID VARCHAR(50) NOT NULL,
guildID VARCHAR(50) NOT NULL,
xp INT NOT NULL DEFAULT '0',
nivel INT NOT NULL DEFAULT '0',
xpTotal INT NOT NULL DEFAULT '0',
INDEX xp_index (xp),
INDEX nivel_index (nivel),
INDEX xpTotal_index (xpTotal),
PRIMARY KEY (guildID, userID)
);
 
CREATE TABLE roles (
guildID VARCHAR(100) NOT NULL,
roleID VARCHAR(100) NOT NULL,
nivel INT NOT NULL,
INDEX nivel_index (nivel)
);

CREATE TABLE canal(
guildID VARCHAR(100) NOT NULL,
default_vc_canal VARCHAR(50),
category_canal VARCHAR(50),
INDEX category_canal(category_canal),
INDEX default_vc_canal(default_vc_canal),
INDEX guildID(guildID),
PRIMARY KEY (guildID, default_vc_canal)
);

CREATE TABLE canales_temporales(
guildID VARCHAR(50) NOT NULL,
id_canal VARCHAR(50) NOT NULL,
dueño_canal VARCHAR(50) NOT NULL,
category_canal VARCHAR(50),
FOREIGN KEY (category_canal) REFERENCES canal(category_canal)
);

CREATE TABLE canal_logs(
guildID VARCHAR(50) NOT NULL,
canal_logs VARCHAR(50) NOT NULL,
INDEX canal_logs(canal_logs),
INDEX guildID(guildID)
);

CREATE TABLE userconfigs(
userID VARCHAR(50) NOT NULL,
rankColor VARCHAR(50) NOT NULL DEFAULT'FFFFFF', 
rankBackground VARCHAR(255) NOT NULL DEFAULT 'https://i.imgur.com/OKOTKLl.png',
PRIMARY KEY(userID, rankColor, rankBackground)
);

CREATE TABLE userNotes(
noteID INT NOT NULL,
userID VARCHAR(50) NOT NULL,
perpetrator VARCHAR(50) NOT NULL,
readRoleID VARCHAR(50) NOT NULL DEFAULT 'PUBLIC',
attachmenturl VARCHAR(175) NOT NULL,
unix VARCHAR(20) NOT NULL,
note TEXT NOT NULL,
guildID VARCHAR(50) NOT NULL,
PRIMARY KEY(noteID, guildID)
);

CREATE TABLE configChannels(
guildID VARCHAR(50) NOT NULL,
noteslogs VARCHAR(50),
modlog VARCHAR(50),
textxpnotification VARCHAR(50),
vcxpnotification VARCHAR(50),
PRIMARY KEY(guildID)
);

CREATE TABLE Moderation(
GuildID VARCHAR(50),
UserID VARCHAR(50),
ModeratorID VARCHAR(50),
Reason TEXT,
Type VARCHAR(50)
);