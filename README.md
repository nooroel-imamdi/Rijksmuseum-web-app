# Web App From Scratch - Herkansing

Nooroel Imamdi | 500706701

## Algemeen
Deze repository bevat de eindopdracht voor het vak *Web App From Scratch*, onderdeel van de minor *Webdevelopment* aan de *Hogeschool van Amsterdam*.

## TO DO LIST
- [x] Object model
- [x] Flowchart
- [x] Interaction Flow Diagram
- [x] IFFE
- [x] Template engine
- [x] Router
- [x] Overview
- [x] Detail
- [ ] Filtering Features
- [x] Data manipulatie met filter/sort/map/reduce
- [x] Feedback data (laden en errors)
- [ ] SPA online gehost


## Responsive Design (mobile first)
Deze app is opgebouwd volgens het principe *mobiele first*. Hierbij wordt de app vanuit mobiel opgebouwd naar een fluide website die op vrijwel alle apparaten toegankelijk is.

## Rijksmuseum API
De Rijksmuseum API Collectie is een set van ruim 111.000 objectenbeschrijvingen (metadata) en digitale beelden uit de collectie van het Rijksmuseum. De kunstwerken en gebruiksvoorwerpen in de set dateren van de oudheid tot de late negentiende eeuw en geven een goed beeld van de rijkheid, diversiteit en schoonheid van ons Nederlands (en internationaal) erfgoed. Helaas kunnen wij, in verband met auteursrechtelijke beperkingen, nog geen werken uit de twintigste en eenentwintigste Eeuw beschikbaar stellen.

## Templating engine
### Handlebars
Bij de bouw van deze app wordt gebruikt gemaakt van ```handlebars```. ```Handlebars``` zorgt er in deze app voor dat data vanuit de Rijksmuseum API wordt vertaald naar een template. Daarmee is het mogelijk de data te verwerken en te gebruiken op de gewenste pagina's in de app.

## Router
Om de route af te handelen wordt er in deze app gebruikt gemaakt van ```routie.js```.

*Routie is a javascript hash routing library. It is designed for scenarios when push state is not an option (IE8 support, static/Github pages, Phonegap, simple sites, etc). It is very tiny (800 bytes gzipped), and should be able to handle all your routing needs.*
[Routie.js](http://projects.jga.me/routie/)

## Gebruiksaanwijzingen
- Open de applicatie en je ziet een random collectie verschijnen
- Wil je opzoek naar het werk van een kunstenaar? Vul dan zijn naam in in de zoekbalk
- Om de kunstwerken apart de bewonderen klik je op de desetreffende items
- Wil je terug naar het overzicht? Klik dan op de terugbutton

## Flowchart
![Flowchart](https://github.com/nooroel-imamdi/web-app-from-scratch-her/blob/master/docs/flowchart.png?raw=true)

## SPA object model
![Flowdiagram](https://github.com/nooroel-imamdi/web-app-from-scratch-her/blob/master/docs/flowdiagram.png?raw=true)

## Interaction Flow Diagram
![Interaction flow](https://github.com/nooroel-imamdi/web-app-from-scratch-her/blob/master/docs/user_opens_spa.png?raw=true)
Diagram wanneer gebruiker SPA opent


![Interaction flow](https://github.com/nooroel-imamdi/web-app-from-scratch-her/blob/master/docs/user_search_form.png?raw=true)
Diagram wanneer gebruiker zoekopdracht invoert


![Interaction flow](https://github.com/nooroel-imamdi/web-app-from-scratch-her/blob/master/docs/user_detail.png?raw=true)
Diagram wanneer gebruiker kunst wil bekijken op detailpagina


## Features


## Sources
- [Rijksmuseum API](https://www.rijksmuseum.nl/nl/api)
- [Handlebars](http://handlebarsjs.com/)
- [Routie](http://projects.jga.me/routie/)
- [Loading spin Cube Grid](https://github.com/tobiasahlin/SpinKit/blob/master/examples/9-cube-grid.html)
