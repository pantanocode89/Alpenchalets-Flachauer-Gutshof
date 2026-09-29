# Alpenchalets Inhalte bearbeiten

Für Texte, Bilder und Reihenfolgen sind keine HTML-, CSS- oder JavaScript-Kenntnisse nötig.

1. Öffnen Sie `https://www.alpenchalets.at/admin/` und melden Sie sich mit dem freigegebenen GitHub-Konto an.
2. Wählen Sie links die gewünschte Seite, zum Beispiel **Startseite** oder **Galerie**.
3. Bearbeiten Sie Deutsch und English jeweils im passenden Feld. Beide Sprachen werden getrennt gespeichert.
4. Bei **Bilder** wählen Sie **Bild ersetzen**. Neue Bilder können dort hochgeladen werden.
5. In **Galerien und Slideshows** können Sie Bilder hinzufügen, entfernen oder per Drag & Drop sortieren. Der Grundriss bleibt ein eigenes Feld.
6. Nutzen Sie vor dem Speichern die Vorschau im CMS.
7. Mit **Veröffentlichen** wird der Inhalt als GitHub-Änderung gespeichert. GitHub Pages stellt die Änderung danach automatisch online bereit.

Die Bereiche Layout, Farben, Abstände, mobile Darstellung, Navigation, Formulare und Animationen sind absichtlich nicht im CMS vorhanden.

## Einmalige Anmeldung einrichten

Decap CMS benötigt für eine GitHub-Pages-Seite einen OAuth-Anmeldedienst. Legen Sie eine GitHub OAuth App für den freigegebenen Besitzer-Account an und hinterlegen Sie deren Client-ID und Secret ausschließlich beim gewählten OAuth-Dienst (zum Beispiel Netlify Identity/Git Gateway oder ein eigener kleiner OAuth-Proxy). Tragen Sie keine Tokens oder Secrets in dieses Repository ein. Der OAuth-Callback und die `base_url` in `admin/config.yml` müssen anschließend auf diesen Dienst zeigen. Erst danach funktioniert Login in `/admin/`.
