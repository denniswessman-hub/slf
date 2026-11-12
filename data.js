export const REVIEWED = '2026-11-12';
export const SOURCES = {
  police: { label: 'Polisen · Snabbare lagföring', url: 'https://polisen.se/om-polisen/polisens-arbete/snabbare-lagforing/', note: 'Arbetsmetoden, FU-ledarens roll och informationsfilmer.' },
  rb: { label: 'Rättegångsbalken', url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/rattegangsbalk-1942740_sfs-1942-740/', note: '23 kap. 18 a § · 33 kap. 6 och 6 b §§ · 48 kap. 10 §.' },
  sfk: { label: 'Strafföreläggandekungörelsen', url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/strafforelaggandekungorelse-197060_sfs-1970-60/', note: '3 §: beslut och åldersgräns. 6 §: kopia till den misstänkte.' },
  dl: { label: 'Delgivningslagen', url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/delgivningslag-20101932_sfs-2010-1932/', note: '52–54 §§: information, tillgängliggörande och delgivningstidpunkt.' },
  prosecutor: { label: 'Åklagarmyndigheten · Strafföreläggande', url: 'https://www.aklagare.se/fran-brott-till-rattegang/atalsbeslutet/strafforelaggande-och-dagsboter/', note: 'Förklaring av strafföreläggande, förhandsgodkännande och dagsböter.' },
  guidance: { label: 'Åklagarmyndigheten · Rättsliga vägledningar', url: 'https://www.aklagare.se/om-oss/dokument/rattsliga-vagledningar/', note: 'Sök RäV 2023:2 Strafföreläggande för fördjupning och aktuell version.' },
  tgdOutside: { label: 'Åklagarmyndigheten · TGD utanför SLF', url: 'https://www.aklagare.se/for-media/aktuellt-pa-aklagarmyndigheten/2026/februari/metod-for-att-slippa-installda-forhandlingar/', note: 'Exempel från Uddevalla och Vänersborg, februari 2026.' },
  canvas: { label: 'Malmö universitet · Kursens FAQ', url: 'https://mau.instructure.com/courses/19413/pages/faq-snabbare-lagforing-samt-dom-fran-narkotikaarende?module_item_id=891446', note: 'Kräver Canvas-inloggning. FAQ daterad september 2023, inklusive länk till övningsdom.' }
};

const answer = (label, hint, next, reason) => ({ label, hint, next, reason });
export const STEPS = {
  age: { stage: 0, title: 'Har personen fyllt 18 år?', lead: 'Börja med den misstänktes ålder.', help: 'Förhandsgodkännande får inte upprättas för någon under 18 år. Den här guiden avser vuxenspåret inom SLF.', sources: ['sfk', 'police'], options: [answer('Ja, 18 år eller äldre', 'Fortsätt till förutsättningarna på plats.', 'contact'), answer('Nej, under 18 år', 'Följ rutinen för unga lagöverträdare.', 'ordinary', 'young'), answer('Åldern är oklar', 'Klargör identiteten och åldern med FU-ledaren.', 'consult', 'identity')] },
  contact: { stage: 0, title: 'Är personen identifierad och kvar på plats?', lead: 'Guiden utgår från ett ingripande med direkt kontakt.', help: 'Saknad kontakt är inte ett generellt lagförbud mot TGD. FU-ledaren får bedöma fortsatt kontakt och handläggning. Information kan även delges via ljud- och bildöverföring, om övriga krav är uppfyllda.', sources: ['police', 'dl'], options: [answer('Ja', 'Identiteten är klar och personen finns kvar.', 'suitable'), answer('Nej eller oklart', 'Stäm av hur kontakten ska säkras.', 'consult', 'contact')] },
  suitable: { stage: 0, title: 'Är utredningen enkel och möjlig att slutföra snabbt?', lead: 'Tänk polisiär FU och en realistisk tidsplan.', help: 'Förhör, bevisning och eventuella analyser måste kunna hanteras inom planeringen. Sex veckor är en målsättning, inte en absolut laggräns. FU-ledaren avgör lämpligheten.', sources: ['police'], options: [answer('Ja, det verkar lämpligt', 'Fortsätt till den misstänktes förutsättningar.', 'readiness'), answer('Nej', 'Mer omfattande utredning eller annat spår behövs.', 'ordinary', 'complex'), answer('Jag är osäker', 'Låt FU-ledaren bedöma utredningsläget.', 'consult', 'suitable')] },
  readiness: { stage: 0, title: 'Kan personen förstå informationen och ta tillvara sina rättigheter?', lead: 'Kontrollera behovet av tolk och försvarare.', help: 'Språk, påverkan eller önskemål om försvarare måste hanteras före relevanta moment. En försvararbegäran innebär inte automatiskt att SLF är uteslutet.', sources: ['rb', 'canvas'], options: [answer('Ja, behoven är hanterade', 'Informationen kan lämnas begripligt.', 'decision'), answer('Tolk eller försvarare behöver ordnas', 'Stäm av fortsättningen innan du går vidare.', 'consult', 'rights'), answer('Personen kan inte förstå just nu', 'Exempelvis kraftig påverkan eller annat hinder.', 'consult', 'understanding')] },
  decision: { stage: 1, title: 'Har JB eller FU-ledaren beslutat om SLF?', lead: 'Patrullen identifierar möjligheten. FU-ledaren beslutar.', help: 'Använd den funktion som ansvarar för SLF enligt aktuell lokal rutin. Berätta om brott, bevisläge, inställning och återstående åtgärder.', sources: ['police', 'canvas'], options: [answer('Ja, SLF är beslutat', 'Fortsätt till val av väg.', 'admission'), answer('Nej, ordinarie handläggning är beslutad', 'Anmäl och avrapportera enligt direktiven.', 'ordinary', 'decision'), answer('Jag har inte fått beslut ännu', 'Kontakta JB/FU-ledaren.', 'consult', 'decision')] },
  admission: { stage: 1, title: 'Erkänner personen gärningen?', lead: 'Ett förnekande stänger inte SLF-spåret.', help: 'Förhandsgodkännande förutsätter att personen erkänner och godtar innehållet. TGD kräver däremot inget erkännande.', sources: ['prosecutor', 'dl'], options: [answer('Ja', 'Pröva förutsättningarna för förhandsgodkännande.', 'penalty'), answer('Nej eller vill inte ta ställning', 'Pröva tillgänglighetsdelgivning.', 'tgd')] },
  penalty: { stage: 1, title: 'Har behörig FU-ledare eller åklagare beslutat att förhandsgodkännande kan upprättas?', lead: 'Det krävs ett särskilt beslut – ett ja till SLF räcker inte.', help: 'Kontrollera fastställd bötespåföljd, särskild rättsverkan och eventuellt skadestånd. Villkorlig dom eller ungdomstjänst får inte förhandsgodkännas. Vid flera brott ska helheten bedömas av behörig beslutsfattare.', sources: ['sfk', 'rb'], options: [answer('Ja, innehåll och böter är bestämda', 'Fortsätt till personens godkännande.', 'consent'), answer('Nej, förutsättningarna saknas', 'Pröva tillgänglighetsdelgivning.', 'tgd'), answer('Beslut eller belopp är oklart', 'Komplettera avstämningen med FU-ledaren.', 'consult', 'penalty')] },
  consent: { stage: 1, title: 'Godtar personen hela innehållet och vill skriva under?', lead: 'Godkännandet ska vara frivilligt och informerat.', help: 'Förklara innebörden och möjligheten att återkalla innan åklagaren utfärdar föreläggandet. Ett erkännande ensamt räcker inte. Använd aktuell godkänd blankett eller systemfunktion.', sources: ['rb', 'prosecutor'], options: [answer('Ja', 'Gå till checklistan för förhandsgodkännande.', 'fg'), answer('Nej', 'Pröva tillgänglighetsdelgivning.', 'tgd'), answer('Det är oklart om personen förstår', 'Klargör förutsättningarna med FU-ledaren.', 'consult', 'understanding')] },
  tgd: { stage: 1, title: 'Är förutsättningarna för TGD klara?', lead: 'FU-ledaren har anvisat tiderna och informationen kan delges korrekt.', help: 'Rätt datum, klockslag och plats ska vara klara. Informationen delges vid personligt möte eller via ljud och bild; ett vanligt telefonsamtal räcker inte. Säkerställ förståelse. Skilj på tillgängliggörande och preliminär förhandling.', sources: ['dl', 'rb'], options: [answer('Ja, tider och information är klara', 'Gå till checklistan för tillgänglighetsdelgivning.', 'tgdResult'), answer('Nej eller oklart', 'Komplettera med FU-ledaren; gissa inga tider.', 'consult', 'times'), answer('FU-ledaren har valt ordinarie handläggning', 'Följ det beslutade spåret.', 'ordinary', 'decision')] }
};

export const REASONS = {
  young: 'Personen är under 18 år. Förhandsgodkännande är inte tillåtet; följ särskilda regler för unga och FU-ledarens direktiv.',
  identity: 'Åldern eller identiteten behöver klarläggas innan guiden kan användas vidare.',
  contact: 'Kontakten eller identiteten behöver säkras. Låt FU-ledaren bedöma fortsatt handläggning.',
  complex: 'Utredningen verkar behöva ett annat upplägg. Stäm av ordinarie handläggning med FU-ledaren.',
  suitable: 'Utredningens lämplighet och tidsplan behöver bedömas.',
  rights: 'Ordna tolk eller hantera försvararbegäran enligt FU-ledarens direktiv. Vid senare förhör: stäm av kallelse. SLF kan fortfarande vara möjligt.',
  understanding: 'Informationen måste kunna förstås. Fortsätt inte med underskrift eller delgivningsinformation innan hindret är hanterat.',
  decision: 'Utgå från FU-ledarens beslut om fortsatt handläggning.',
  penalty: 'Beslut om förhandsgodkännande och dess fullständiga innehåll måste vara klara.',
  times: 'Tid, plats eller möjligheten att lämna information är inte klar. Be FU-ledaren komplettera eller välja annat förfarande.'
};

export const RESULTS = {
  fg: { code:'A', tone:'green', icon:'pen', label:'Förhandsgodkännande', short:'Erkänt och godtaget', title:'Förhandsgodkännande av strafföreläggande', intro:'Detta spår är aktuellt utifrån dina svar. Slutför momenten enligt beslutet.', note:'Ett giltigt förhandsgodkännande medför undantag från slutunderrättelse enligt RB 23:18 a. Om godkännandet återkallas eller inte täcker föreläggandet: ny avstämning med FU-ledaren.', sources:['rb','sfk','prosecutor'], checklist:[
    ['Slutför utredningsåtgärderna','Följ FU-direktiven. Säkerställ förhör, bevisning och uppgifter om den misstänktes ekonomi.'],
    ['Kontrollera allt som godtas','Brott, tid, plats, böter, särskild rättsverkan och eventuellt skadestånd ska vara korrekt angivna.'],
    ['Förklara och låt personen skriva under','Frivilligt godkännande på aktuell blankett eller i godkänt system. Förklara rättsverkan och återkallelse före utfärdande.'],
    ['Lämna kopia om möjligt','Ta hand om handlingen enligt lokal rutin. Den misstänkte ska få en kopia om det är möjligt.'],
    ['Avrapportera i Durtvå','Registrera anmälan, förhör och bevisning. Bifoga förhandsgodkännandet och dokumentera FU-beslutet enligt lokal rutin.']
  ] },
  tgdResult: { code:'B', tone:'blue', icon:'calendar', label:'Tillgänglighetsdelgivning', short:'Information om tid och plats', title:'Information om tillgänglighetsdelgivning', intro:'Detta spår är aktuellt utifrån dina svar. Informationen lämnas nu; själva delgivningen sker senare enligt reglerna.', note:'TGD för domstolens handlingar ersätter inte automatiskt slutunderrättelse av förundersökningen. FU-ledaren måste planera den separat. En preliminär förhandlingstid är inte samma sak som delgivningstidpunkten.', sources:['dl','rb','police'], checklist:[
    ['Bekräfta tiderna med FU-ledaren','Kontrollera datum, klockslag, rätt myndighet/plats och eventuell preliminär tid för huvudförhandling.'],
    ['Delge informationen och säkerställ förståelse','Personligt möte eller ljud- och bildöverföring. Erkännande och samtycke krävs inte. Använd tolk vid behov.'],
    ['Lämna och dokumentera informationen','Använd aktuell TGD-blankett. Följ lokal rutin för exemplar till personen, dokumentation och information om förenklad delgivning.'],
    ['Stäm av slutunderrättelsen','Säkerställ med FU-ledaren hur den misstänkte och försvararen får insyn och skäligt rådrum innan åtal.'],
    ['Avrapportera i Durtvå inom anvisad tid','Anmälan, förhör, bevisning, FU-beslut och dokumenterad delgivningsinformation ska följa med. Bifoga blankett enligt lokal rutin.']
  ] },
  ordinary: { code:'C', tone:'sand', icon:'file', label:'Ordinarie handläggning', short:'Anmälan och fortsatt utredning', title:'Ordinarie handläggning i Durtvå', intro:'Fortsätt utanför guidens SLF-spår och följ FU-ledarens direktiv.', note:'Ordinarie handläggning betyder inte automatiskt delgivningssättet ”vanlig delgivning”. TGD kan användas även utanför SLF när rättsliga och praktiska förutsättningar finns.', sources:['police','rb','tgdOutside'], checklist:[
    ['Stäm av fortsatt handläggning','Klargör FU-ledare, kvarvarande åtgärder och eventuell särskild rutin för unga.'],
    ['Säkra utredningen','Dokumentera iakttagelser, förhör och bevisning. Hantera tolk, försvarare och tvångsmedel enligt beslut och gällande regler.'],
    ['Upprätta anmälan i Durtvå','Registrera relevanta uppgifter och bifoga dokumentationen enligt lokal rutin.'],
    ['Lämna över tydligt','Redovisa vad som är gjort, vad som återstår och vilka beslut som fattats. Stäm av fortsatt kallelse och delgivning.']
  ] },
  consult: { code:'?', tone:'sand', icon:'phonecall', label:'Stäm av med FU-ledaren', short:'Klargör innan du går vidare', title:'Ta en avstämning med JB/FU-ledaren', intro:'Ett vägval behöver klarläggas. Det innebär inte automatiskt att SLF är uteslutet.', note:'När du fått besked: gå tillbaka och ändra det aktuella svaret. Guiden ersätter inte ett beslut från behörig FU-ledare eller åklagare.', sources:['police','canvas'], checklist:[
    ['Beskriv läget kort','Brottsmisstanke, identitet/ålder, bevisning, inställning och vad som återstår.'],
    ['Lyft det som är oklart','Be om besked om aktuellt hinder, SLF-spår och nödvändiga åtgärder.'],
    ['Dokumentera direktiven','Notera beslut och anvisningar i ordinarie tjänstesystem. Återgå sedan till guiden vid behov.']
  ] }
};

export const FAQ = [
  ['Är SLF ett alternativ till att skriva i Durtvå?', 'Nej. SLF är ett arbetssätt för snabbare handläggning. Anmälan och utredningsdokumentation behövs även när förhandsgodkännande eller TGD används.', ['canvas','police']],
  ['Måste personen erkänna för att SLF ska fungera?', 'Nej. Erkännande behövs för förhandsgodkännande, men inte för TGD. Ett förnekande kan alltså fortfarande hanteras inom SLF.', ['prosecutor','dl']],
  ['När slipper jag slutunderrätta?', 'Vid ett giltigt förhandsgodkännande gäller undantaget i RB 23 kap. 18 a § tredje stycket. Ett erkännande eller lämnad information om domstolens TGD räcker inte i sig.', ['rb']],
  ['Är personen delgiven stämningen redan på plats?', 'Nej. På plats lämnas informationen. Vid en i förväg bestämd tidpunkt sker delgivning när handlingarna faktiskt hålls tillgängliga på angiven plats. Vid omedelbart tillgängliggörande gäller i stället tredje arbetsdagen efter informationen.', ['dl']],
  ['Vad gör jag om personen vill ha försvarare?', 'Stäm av med FU-ledaren och hantera försvararfrågan före förhöret. Ett senare förhör och en kallelse kan behövas. Det är inte i sig ett automatiskt nej till SLF.', ['rb','canvas']],
  ['Fungerar SLF för utländska medborgare?', 'Medborgarskapet är inte i sig ett hinder. Identitet, förståelse, eventuellt tolkbehov och praktiska förutsättningar måste vara klarlagda.', ['canvas','rb']],
  ['Kan flera brott ingå i ett förhandsgodkännande?', 'Ja, men behörig beslutsfattare behöver bedöma hela innehållet och den samlade bötespåföljden. Appen räknar inte ut dagsböter.', ['guidance','canvas']],
  ['Kan förhandsgodkännande kombineras med TGD?', 'Ja, information om TGD kan också vara aktuell som beredskap enligt FU-ledarens planering. Spåren är därför inte alltid ömsesidigt uteslutande.', ['guidance']],
  ['Vilka blanketter ska jag spara?', 'Använd aktuella lokala blanketter och dokumentrutiner. Kursens FAQ beskriver att TGD-handlingen lämnas till personen och dokumenteras i Durtvå, medan förhandsgodkännandet tas om hand. Kopia av förhandsgodkännandet lämnas om möjligt enligt 6 § strafföreläggandekungörelsen.', ['canvas','sfk']]
];

export function nextStep(stepId, optionIndex) {
  const option = STEPS[stepId]?.options[optionIndex];
  if (!option) throw new RangeError('Ogiltigt vägval');
  return { id: option.next, reason: option.reason || null };
}
