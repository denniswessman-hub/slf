# SLF · Snabbare lagföring

Mobilanpassat, fristående studiestöd för polisstudenter. En fråga i taget leder till en checklista för förhandsgodkännande, information om tillgänglighetsdelgivning, ordinarie handläggning eller avstämning med FU-ledare.

**App:** https://denniswessman-hub.github.io/slf/

## Funktioner

- Vägledning med ålder, kontakt, utredningsläge, rättigheter, FU-beslut, erkännande och godkännande.
- Separat kontroll av beslut att upprätta förhandsgodkännande.
- Förnekande och nej till förhandsgodkännande kan fortfarande leda till TGD.
- Avprickningsbara checklistor, utskrift, bakåtnavigering och ändring av tidigare svar.
- Snabböversikt, FAQ och direktlänkar till primärkällor.
- Responsiv layout, tangentbordsstöd och fokusmarkeringar.
- Manifest och service worker för hemskärm och offline efter första besöket. Källänkar kräver nätanslutning.
- Inga formulär för person- eller ärendeuppgifter, ingen analysmätning och ingen lagring av vägval. Svar och markeringar finns endast i sidans minne.

## Avgränsning och innehåll

Detta är en **studieapp, inte en myndighetsapp eller ett beslutsstöd godkänt för tjänstebruk**. Använd aktuella lokala rutiner, blanketter och behörig FU-ledares eller åklagares beslut. Appen är inte ansluten till Durtvå.

Guiden beskriver ett typiskt ingripande med en vuxen misstänkt. Ordningsbot, fullständiga ungdomsrutiner och andra särskilda förfaranden ligger utanför omfattningen. Vanlig handläggning och delgivningssättet vanlig delgivning är olika saker. TGD kan användas utanför SLF och TGD-information kan ibland kombineras med förhandsgodkännande.

Källkontrollerad **2026-11-12**. Rättskällor och hänvisningar finns i `data.js` och appens källvy. Lagtext kontrollerades mot Riksdagens konsoliderade författningar. Innehållet utgår även från Polisen, Åklagarmyndigheten och kursens FAQ på Malmö universitets Canvas (september 2023). Kursfiler och personuppgifter från den länkade domen återpubliceras inte.

Viktiga förtydliganden jämfört med en förenklad trevägsmodell:

- Alla spår kräver ordinarie anmälan och dokumentation.
- TGD-information på plats är inte redan verkställd delgivning av framtida stämning.
- TGD för domstolens handlingar ersätter inte automatiskt slutunderrättelse av FU.
- Undantaget från slutunderrättelse gäller giltigt förhandsgodkännande enligt RB 23 kap. 18 a § tredje stycket.
- Kopia av förhandsgodkännande lämnas om möjligt, enligt 6 § strafföreläggandekungörelsen.
- Saknad tolk, försvararfråga, oklart beslut eller saknade tider leder till avstämning, inte ett automatiskt godkännande.

## Lokal utveckling

Ingen installation eller byggkedja behövs. Node.js 20 eller senare:

```sh
npm start
npm test
npm run check
```

Öppna http://127.0.0.1:4173. Använd HTTP-servern; JavaScript-moduler fungerar inte tillförlitligt från `file://`.

## Publicering

GitHub Pages publicerar grenen `main`, mappen `/ (root)`. `.nojekyll` gör att filerna serveras direkt. Alla resurslänkar är relativa och fungerar under `/slf/`.

`data.js` innehåller flödets data, källor och checklistor. Ändra källgranskningsdatum först efter en ny faktisk granskning. Vid en appuppdatering: bumpa cacheversionen i `sw.js` och versionsuppgifterna. Offlineinnehåll kan vara äldre; användaren ska kontrollera datum och aktuella rutiner. Testerna provar kritiska vägar och att hela beslutsgrafen är sammanhängande och avslutas.

GitHub Pages kan behandla sedvanliga anslutningsuppgifter. Inga vägval skickas av appen. Externa länkar öppnas hos respektive utgivare.
