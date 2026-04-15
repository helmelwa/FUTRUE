IT DevOps Engineer Case – Automatisierung kritischer IT-
Prozesse
Ausgangssituation

Du bist als IT DevOps Engineer bei einem wachsenden Technologieunternehmen tätig. Das
Unternehmen expandiert schnell, und die IT-Abteilung steht vor mehreren kritischen
Herausforderungen bei der Skalierung ihrer Prozesse. Zwei besonders dringende Problembereiche
wurden identifiziert, die beide erhebliche Auswirkungen auf die Effizienz und Zufriedenheit der
Mitarbeitenden haben.

Deine Situation

Das Management hat dir zwei kritische Projekte zugeteilt, die beide höchste Priorität haben.
Aufgrund begrenzter Ressourcen und der Dringlichkeit der Situation musst du dich für eines der
beiden Szenarien entscheiden und dieses vollständig ausarbeiten. Beide Projekte adressieren
zentrale Herausforderungen der Organisation und bieten erhebliches Potenzial für
Verbesserungen.

Szenario B: Self-Service-Portal für Berechtigungsanfragen

Problembeschreibung

Aktuell beantragen Mitarbeitende den Zugriff auf spezielle Ressourcen (z. B. Lizenzen für
Fachsoftware, Zugriff auf Projekt-SharePoints) per E-Mail bei ihrer Führungskraft. Diese leitet die E-
Mail an das IT-Team weiter, das die Berechtigung anschließend manuell im jeweiligen System (z. B.
in einer Active-Directory-Gruppe) einträgt.

Kernprobleme des aktuellen Prozesses

•

Intransparent: Anfragen gehen unter oder bleiben in Postfächern liegen; der aktuelle Status
ist für niemanden ersichtlich.

•

Langsam: Mehrstufige manuelle Bearbeitung führt zu langen Wartezeiten.

•  Nicht nachvollziehbar: Es gibt keine zentrale Dokumentation, wer wann welche

Berechtigung genehmigt hat.

•  Aufwändig für die IT: Das Team wird mit repetitiven Routineaufgaben belastet.

Deine Aufgabe für Szenario B

Entwickle einen funktionsfähigen Prototyp für ein Self-Service-Portal, über das Mitarbeitende
eigenständig den Zugriff auf Ressourcen beantragen können. Der Prototyp soll den gesamten
Prozess von der Anfrage bis zur technischen Umsetzung abbilden.

Anforderungen an die Lösung

1) Web-Oberfläche (Frontend)

•  Erstelle ein einfaches Web-Formular mit den folgenden Feldern:

o  Ein Dropdown-Menü, um die zu beantragende Ressource auszuwählen (z. B. „Lizenz

für Analyse-Software“, „Zugriff auf Projekt-Marketing-SharePoint“)

o  Ein Textfeld für eine kurze Begründung

o  Ein „Senden“-Button

•  Die Wahl der Frontend-Technologie ist dir überlassen

2) Workflow & Backend-Logik

•  Das Backend soll die Anfrage vom Frontend entgegennehmen

•  Es soll die Führungskraft der anfragenden Person identifizieren

Annahme: Es gibt einen internen API-Endpunkt GET /api/manager/{user-email}, der die E-
Mail-Adresse der Führungskraft zurückgibt

4 von 5

•  An die Führungskraft soll eine automatisierte E-Mail mit dem Inhalt der Anfrage und zwei

Links/Buttons gesendet werden: „Genehmigen“ und „Ablehnen“

3) API-Integration & Provisioning

•  Wenn die Führungskraft auf „Genehmigen“ klickt, soll das Backend eine Aktion auslösen

•  Diese Aktion soll per API-Call die anfragende Person zu einer vordefinierten Berechtigungs-

Gruppe hinzufügen

4) Benachrichtigung

•  Die anfragende Person soll nach der Entscheidung der Führungskraft (sowohl bei
Genehmigung als auch bei Ablehnung) eine kurze Bestätigungs-E-Mail erhalten

Inhalte für die Präsentation (ca. 20–40 Minuten)

•

Live-Demonstration: Führe uns live durch den Prozess. Fülle das Formular aus, zeige die
(simulierte) Genehmigungs-E-Mail und den erfolgreichen API-Call.

•  Code-Walkthrough: Zeige uns die interessantesten Teile deines Codes. Erkläre kurz die

Struktur deines Projekts und erläutere:

o  Wie Frontend und Backend kommunizieren

o  Wie der Klick auf den Genehmigungs-Link im Backend verarbeitet wird

•  Design- und Technologie-Entscheidungen: Begründe kurz deine Wahl der eingesetzten

Technologien (Programmiersprache, Frameworks etc.). Wie handhabst du sensible Daten
wie API-Schlüssel oder Credentials in deinem Prototyp?

•  Nächste Schritte & Verbesserungen: Wenn du mehr Zeit hättest, was wären die nächsten

drei Dinge, die du an deinem Prototyp verbessern oder hinzufügen würdest?

Hinweise für beide Szenarien

•  Triff plausible Annahmen, falls dir Informationen fehlen, und dokumentiere diese explizit in

deiner Präsentation

•  Erkläre (wenn notwendig), welche zusätzlichen Informationen du für eine vollständige

Umsetzung benötigen würdest

•  Es geht nicht darum, ein fertiges Produkt zu zeigen, sondern deine Fähigkeit, ein solches
Problem strukturiert zu analysieren und eine technisch fundierte Lösung zu konzipieren
bzw. einen funktionierenden Prototypen zu implementieren

5 von 5

