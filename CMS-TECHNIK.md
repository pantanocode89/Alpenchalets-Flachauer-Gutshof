# CMS-Technik

Der öffentliche Auftritt bleibt eine statische GitHub-Pages-Seite. Decap CMS wird ausschließlich unter `/admin/` geladen. Die bearbeitbaren JSON-Dateien liegen in `content/`; die CMS-Konfiguration stellt ausschließlich DE- und EN-Inhalte bereit.

`cms-content.js` lädt pro Seite genau zwei kleine JSON-Dateien: `content/global.json` und den Seitendatensatz. Der Abruf erfolgt mit `fetch`, nie mit synchronem XHR. Während der Abruf läuft, verhindert ein kurzer Sichtbarkeits-Schutz falschen Sprach- oder Inhalts-Flash. `cms-bootstrap.js` startet anschließend deterministisch genau das vorhandene geschützte Seitenskript (`script.js`, `page.js` oder `chalet-detail.js`). Dadurch initialisieren Galerien, Forms und Slideshows erst nach Anwendung der CMS-Daten und ohne Zeit-Timeouts.

Der Runtime-Code übernimmt nur Text, Bild-URLs und Inhaltslinks über feste `data-cms-*`-Kennungen. Er kann keine Klassen, IDs, CSS oder JavaScript aus CMS-Daten übernehmen. Slideshows erhalten ausschließlich Bildlisten; Intervall, Übergang und responsive Verhalten verbleiben im geschützten Frontend.

Die GitHub-Anmeldung braucht für eine statische Seite einen externen OAuth-Proxy. Die Konfiguration verwendet den Decap-GitHub-Backend ohne `publish_mode: editorial_workflow`, damit ein berechtigter Besitzer direkt nach `main` veröffentlichen kann. Der OAuth-Proxy, Callback und alle Credentials werden außerhalb dieses öffentlichen Repositorys eingerichtet; die konkreten Schritte stehen in `CMS-ANLEITUNG.md`.
