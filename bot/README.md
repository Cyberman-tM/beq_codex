# beq Bot

Der Bot wird von Grund auf neu und modular aufgebaut. Der aktuelle Stand ist
bewusst klein: Er meldet sich bei Discord an, beantwortet `x?ping` mit `Pong!`
und bietet die erste einfache Wörterbuchsuche. Diese Befehle sind zunächst
bewusst exakt und verzichten auf Fuzzy-Suche oder automatische Morphologie:

- `x?tlh mu'` — Klingonisch nachschlagen
- `x!mugh tlh *mu'* de` — explizite Suche mit alter Befehlssyntax
- `x!yIngu'` — Bot- und Datenbankinformationen

`ping` bleibt ein Diagnosewerkzeug, damit eine neue Heroku-Installation leicht
geprüft werden kann. Wenn eine exakte Suche nichts findet, versucht beq noch
eine Fragment-Suche in derselben Sprache und kennzeichnet die Treffer deutlich.
Bearbeitete eigene Nachrichten werden ebenfalls verarbeitet. Dadurch kann ein
Befehl in Discord mit Cursor-Up zurückgeholt, leicht geändert und erneut
gesendet werden.

## Struktur

- `src/index.js` — Einstiegspunkt; verbindet Discord mit den Modulen
- `src/config.js` — liest und prüft Umgebungsvariablen
- `../data/personality.json` — zentral gepflegte Meldungen nach Zweck
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
ins Repository. Für den optionalen Begrüßungskanal wird `WELCOME_CHANNEL_ID`
als Config Var gesetzt.

## Discord-Konfiguration

Für den Diagnosebefehl muss im Discord Developer Portal der privilegierte
Intent **Message Content Intent** aktiviert werden. Beim Einladen des Bots
werden außerdem die Berechtigungen benötigt, Nachrichten zu sehen und zu
senden. Für Begrüßungen neuer Mitglieder muss zusätzlich der privilegierte
Intent **Server Members Intent** aktiviert werden.
