# beq_codex

Die neue gemeinsame Heimat für beq und seine Begleit-Webseite.

## Struktur

- `bot/` — der neue Discord-Bot (in Vorbereitung)
- `website/` — die statische Begleit-Webseite für GitHub Pages

Die Webseite ist bewusst ohne JavaScript-Abhängigkeiten aufgebaut. Sie erklärt den geplanten Übersetzungskern, die Discord-Funktionen und die späteren Erweiterungen.

## Veröffentlichung

Die Begleit-Webseite wird über GitHub Actions als GitHub-Pages-Projektseite veröffentlicht. Der Workflow liegt unter `.github/workflows/pages.yml` und stellt ausschließlich den Inhalt von `website/` bereit.
