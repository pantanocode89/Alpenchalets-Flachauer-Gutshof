# Alpenchalets Inhalte bearbeiten

## Bereits umgesetzt

Die Website-Inhalte werden in `/admin/` mit Decap CMS gepflegt. Dort stehen ausschließlich DE- und EN-Texte, Bilder, Hero-Bilder, Galerien, Slideshows, FAQ sowie globale Kontaktangaben zur Verfügung. Layout, HTML, CSS, JavaScript, Formulare, Saisonalität und Animationen bleiben geschützt.

Nach der einmaligen Anmeldung ist der normale Ablauf:

1. `https://www.alpenchalets.at/admin/` öffnen und mit dem freigegebenen GitHub-Konto anmelden.
2. Gewünschte Seite oder **Globale Inhalte** wählen.
3. Deutsch und Englisch getrennt bearbeiten; Bilder ersetzen oder in Listen hinzufügen, entfernen und per Drag & Drop sortieren.
4. Vorschau prüfen und **Veröffentlichen** wählen.

Decap schreibt die Inhaltsänderung direkt in den Branch `main`; GitHub Pages veröffentlicht sie anschließend. Für normale Inhaltsänderungen ist kein Pull Request und keine Entwicklerfreigabe vorgesehen.

## Einmalig außerhalb dieses Repositorys einzurichten

Für GitHub Pages benötigt Decap CMS einen OAuth-Proxy. Empfohlen ist ein eigener, auf die Website beschränkter Cloudflare Worker nach der offiziellen Decap-GitHub-Backend-Anleitung.

1. Einen Worker unter einer eigenen HTTPS-Adresse bereitstellen, z. B. `https://cms-auth.<eigene-domain>`.
2. In GitHub eine OAuth App anlegen. Die Callback-URL ist exakt `<Worker-URL>/callback`.
3. GitHub Client-ID und Client-Secret ausschließlich als Worker-Secrets speichern. Sie dürfen weder hier noch in einer CMS-Datei stehen.
4. Den Worker auf `https://www.alpenchalets.at` als erlaubte Herkunft beschränken.
5. In `admin/config.yml` unter `backend` die echte Worker-URL als `base_url` und `auth` als `auth_endpoint` ergänzen.
6. Das Besitzerkonto braucht Schreibzugriff auf `pantanocode89/Alpenchalets-Flachauer-Gutshof`.

Erst nach diesen sechs Schritten funktioniert die Anmeldung unter `/admin/`. Der OAuth-Dienst ist bewusst nicht mit einer erfundenen URL vorkonfiguriert; dadurch werden keine Zugangsdaten oder falsche Produktionsendpunkte veröffentlicht.
