# CMS-Technik

Der öffentliche Auftritt bleibt eine statische GitHub-Pages-Seite. `/admin/` lädt Decap CMS ausschließlich dort. Die bearbeitbaren JSON-Dateien liegen in `content/`; geschützte HTML-, CSS- und JavaScript-Struktur bleibt außerhalb der CMS-Formulare.

`cms-content.js` liest für die aktuelle Seite ihren JSON-Inhalt und wendet ausschließlich Text-, Bild- und URL-Werte an. Es kann weder Klassen, IDs, CSS noch JavaScript aus den Daten übernehmen. `admin/config.yml` definiert nur DE- und EN-Felder und speichert Medien unter `assets/images`.

Zum Hinzufügen eines neuen editierbaren Feldes wird das Element mit einer stabilen `data-cms-*`-Kennung versehen, der Datensatz in der passenden `content/*.json`-Datei ergänzt und anschließend ein deutsches Formularfeld in `admin/config.yml` ergänzt. Kein raw HTML, CSS oder JavaScript als CMS-Feld anlegen.

Bei Slideshows werden ausschließlich Bildlisten bearbeitet. Intervall, Übergang, responsive Regeln und der jeweilige JavaScript-Mechanismus bleiben im geschützten Frontend-Code. Für Login und GitHub-Backend siehe `CMS-ANLEITUNG.md`.
