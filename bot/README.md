# beq Bot

Der Bot wird von Grund auf neu und modular aufgebaut. Der aktuelle Stand ist
bewusst klein: Er meldet sich bei Discord an und beantwortet `x?ping` mit
`Pong!`. Dieser Befehl ist nur ein Diagnosewerkzeug, damit eine neue Heroku-
Installation leicht geprüft werden kann.

## Struktur

- `src/index.js` — Einstiegspunkt; verbindet Discord mit den Modulen
- `src/config.js` — liest und prüft Umgebungsvariablen
- `src/commands/` — einzelne Textbefehle, jeweils möglichst in eigener Datei
- `../Procfile` — startet auf Heroku den Worker-Prozess

Die Anwendung verwendet absichtlich nur `discord.js` als direkte Laufzeit-
Abhängigkeit. Node.js-Version und Abhängigkeiten werden im `package.json` im
Repository-Stamm festgelegt, weil Heroku diesen Stamm als App-Verzeichnis
erkennt.

## Lokaler Start

1. `npm install`
2. `.env.example` nach `.env` kopieren und `DISCORD_TOKEN` eintragen
3. `npm start`

Heroku erhält den Token als Config Var `DISCORD_TOKEN`; der Token gehört nie
ins Repository.

## Discord-Konfiguration

Für den Diagnosebefehl muss im Discord Developer Portal der privilegierte
Intent **Message Content Intent** aktiviert werden. Beim Einladen des Bots
werden außerdem die Berechtigungen benötigt, Nachrichten zu sehen und zu
senden.
