
---

   - layout: joureka
   - title: joureka - Mit mehr Muße vom Interview zum Artikel!
   - image: ![Übersicht von Joureka](joureka_overview.png)
   authors:
   - author: Ana-Maria Tomi
   - link: [Ana's GithHub](https://github.com/anatomi)
   - author: Felix Mertineit
   - link: [Felix's GithHub](https://github.com/FelixMertin)
   - brief: Wir erleichtern die Arbeit von Journalist:innen!
   - summary: Mit joureka transkribieren Journalist:innen Interviews und Tonaufnahmen automatisch. Mittels Textanalyse werden die erhaltenen Inhalte zusammengefasst und visuell präsentiert!

---

# Mit mehr Muße vom Interview zum Artikel!
joureka macht die Arbeit von Journalist:innen leichter! Mit joureka transkribierst Du Deine Interviews automatisch und bereitest Deine Artikel vor: joureka bietet generierte Überblicke über die Textinhalte der Aufnahmen. Zum einen werden unterschiedliche Themengebiete identifiziert und zum anderen werden Dir Vorschläge für erkannte Personen, Orte, Organisationen und Daten geliefert. Auch wird ersichtlich, welche Wörter am häufigsten Vorkommen. All diese Funktionen verknüpfen die Ergebnisse mit dem korrespondierendem Interview. Um Dich dabei zu unterstützen, den Stift wirklich auf das Papier zu setzen, haben wir die Möglichkeit eingebaut Interviews zu kommentieren und Notizen zu visualisieren. \
In Zeiten, in denen investigativer Journalismus schwieriger und notwendiger wird, arbeitet joureka lediglich lokal auf Deinem eigenen Rechner und mit Verschlüsselung! Die Sicherheit Deiner Daten und Interviewpartner:innen werden so nicht gefährdet. 
 
Neugierig geworden? Hier geht es zu der Installationsanleitung! 
- [Kurze Installationsanleitung](https://www.joureka.ai/#Install)
- [Ausführliche Installationsanleitung](https://github.com/joureka-ai/joureka-app) 

# Was ist joureka?


![Übersicht von Joureka](joureka_overview.png)
Für alle Visuellen, hier eine kleiner Überblick!

Mit joureka bieten wir eine effiziente Lösung an, die wichtige investigativ Arbeit unterstützt und Journalist:innen hilft, die Sicherheit und Souveränität ihrer Daten und Informant:innen zu wahren. Dabei haben wir uns bewusst dazu entschieden joureka als eine Open-Source-Anwendung zu veröffentlichen, die jedem zur Verfügung steht. Wir - Cecilia Maas, Felix Mertineit und Ana-Maria Tomi - geben somit joureka unter der A-GPL-3.0 Lizenz für die weitere Nutzung, bei Vertrieb unter der gleichen Lizenz, frei. Um auch ein wenig Licht auf die technische Seite zu werfen: Der Funktionsumfang von joureka basiert auf automatischer Spracherkennung und neuesten Methoden des Natural Language Processing. Die Spracherkennungsbibliothek VOSK liefert die Transkripte und die semantischen sowie statistischen Zusammenfassungen erfolgen mit Hilfe von aktuellen Deep-Learning-Modellen und Clustering-Algorithmen. Die Architektur von joureka ist so konzipiert, dass die bisherigen Modelle einfach mit zukünftigen Modellen ausgetauscht werden können.


# Intuitiv. Übersichtlich. Schlicht.
Dies sind die Werte, mit denen wir die Benutzeroberfläche von joureka assoziieren möchten. Durch den Einsatz von weit verbreiteter Frontend-Frameworks wie Next.js, React und Bootstrap sind wir in der Lage, Journalist:innen eine Vielzahl von Funktionalitäten intuitiv und übersichtlich anzubieten. Die grafische Oberfläche von [joureka](https://joureka.ai) unterteilt sich in zwei Hauptansichten:
die Projektansicht und die Aufnahmeansicht. Die Projektansicht bietet neben Informationen zu den darin enthaltenen Aufnahmen, eine statistiche Auswertung dieser. Die dort enthaltenen Grafiken zu annotierten sowie automatisch generierten Themengebieten, Worthäufigkeit und Eigennamenerkennung werden durch das visx-Framework ermöglicht.
In der Aufnahmeansicht erhalten Journalist:innen die Möglichkeit Interviews abzuspielen, zu annotieren und die automatisch generierten Transkription zu editieren. Die Funktionalität zum Abspielen und Annotieren der Audiodateien von joureka basieren auf der wavesurfer.js-Library.
Darüber hinaus war es uns bewusst, dass nicht jeder das gleiche Gerät mit der gleichen Konfiguration für die Benutzung von joureka verwenden wird. Daher war uns ein responsives Design der Anwendung, der sich an alle Gerätegrößen anpasst, wichtig.


# Woher kommt joureka?

joureka ist Teil des aureka-Ökosystems. [aureka](https://aureka.ai) ist ein Startup, das digitale Tools für den Erhalt von audiovisuellen Erbe und der Wissensproduktion entwickelt. \
Cecilia Maas ist promovierte Medienhistorikerin und Ideengeberin für joureka als auch aureka. Sie unterstützt die Entwickler:innen in Kommunikation und liefert Feedback.
Felix Mertineit ist studierter Wirtschaftsinformatiker (M.Sc.) und fungiert bei joureka als Projektmanager, Backend- und Deep-Learning-Entwickler. Ana-Maria Tomi ist als angehende Medienformatikerin für die Designkonzepte und -sprache sowie für die eigentliche Entwicklung eines interaktiven und ansprechenden Frontends zuständig. 


# Was haben wir gelernt?
Durch die in den Projektablauf eingegliederten Workshops konnten alle Beteiligten ein tieferes Verständnis für das Designen von Services nach Nutzer:innen-Perspektive gewinnen. Als eine weitere Methode in unserem digitalen Werkzeugkasten werden wir definitiv das Assumption Mappings mit nehmen! \
Im Rahmen der Entwicklung haben wir unterschiedliche Modelle für die Transkription von Aufnahmen getestet. Hierbei griffen wir auch auf sehr neue, sogenannte Transformer, Modelle zurück. Diese behaupteten sich in ihrer Qualität, jedoch nicht in der benötigten Zeit. Insbesondere war dies der Fall, wenn diese nicht via einer Nvidia Grafikkarte beschleunigt wurden. Um allgemein rechenintensive Aufgaben bearbeiten zu können, haben beide Entwickler:innen erstmalig mit einem Message-Queue-System gearbeitet, welches Arbeitslasten intelligent orchestriert. Für Teile des Entwicklungsteams war auch der Einsatz von Docker als Tool für die Containerisierung sehr lehrreich und ein weiterer Schritt hin zu modernen Praktiken des Web Developments. Das Frontend konnte desweiteren neue Frameworks erproben und nachhaltig integrieren wie beispielsweise Next.JS und das visx-Framework.


# Wie geht es weiter?
Zum Zeitpunkt des Abschlusses von Prototype Fund holen wir Feedback von Journalist:innen ein. Nachdem wir dieses Feedback katalogisiert und priorisiert haben, erfolgt die Anpassung der wichtigsten Punkte. Insbesondere erhoffe wir durch das Feedback zu verstehen, wie wichtig für Journalist:innen einzelne Funktionen wie Annotationen, Verwaltung von langen und vielen Interviews und eine Zusammenfassung von Textinhalten ist. \
Da auch wir bei [joureka](https://www.joureka.ai/) nur eine begrenzte Zeit von Luft und Liebe leben können, suchen wir nach weiterer finanzieller Unterstützung, um joureka fortzuentwickeln. Eine Herzensangelegenheit wäre es für uns die jetzige prototypische Version zu einer vollumfänglichen Desktop App auszubauen, eine technische Installation mittels Docker & Co. , wissen wir, ist nicht für Journalist:innen geeignet.
