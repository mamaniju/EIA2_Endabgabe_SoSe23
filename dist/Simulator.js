"use strict";
// Eisdealer-Simulator
// Julia Mamani, 268377, MKB2
// In Zusammenarbeit mit Evelin Sinner, Anna-Lena Jörger, Penelope Vogel
var EisdieleSimulator;
(function (EisdieleSimulator) {
    // Class Simulator connects everything logically
    class Simulator {
        angebot;
        // Arrays
        // Table-Array
        tables = [];
        // Sauce-Array
        sauceBuckets = [];
        // Topping-Array
        toppingBuckets = [];
        // Flavour-Array
        icebuckets = [];
        // Customer-Array
        customers = [];
        // Number of tables
        tableAmount = 12;
        // Interval of Customers
        // Every 10s a new Customer comes 
        Customer_Spawn_MS = 10000;
        // Earnings: Money made from Customers
        earnings = 0;
        // Which Object is selected
        selected = null;
        // Constructor of Class Simulator
        constructor(angebot, canvasId) {
            this.angebot = angebot;
            // Get Canvas and RenderinContext
            EisdieleSimulator.canvas = document.getElementById(canvasId);
            EisdieleSimulator.ctx = EisdieleSimulator.canvas.getContext("2d");
            // Wenn Game gestartet wird, dann erscheint das Spiel und das Menü verschwindet
            this.displayGame();
            // Creates the amount of tables from MaxSpace (12) -> 12 Tables
            this.createTables(this.tableAmount);
            // Create Buckets with Sauce, Flavours and Toppings
            this.createBuckets();
            // Create Customer Data
            // Alle 10s kommt ein neuer Customer
            this.customerInterval();
            // Bindet Klick-Events an Canvas
            this.setupEvents();
            // Spiel zeichnen
            // Mit Render-Funktion alles auf Canvas zeichnen
            window.requestAnimationFrame(this.render.bind(this));
        }
        // Customer an Tisch setzen
        spawnCustomer() {
            // Wenn alle Tische besetzt sind (12 Tische), dann wird diese Funktion bei return unterbrochen
            if (this.customers.length >= this.tableAmount) {
                return;
            }
            // Array aus Angeboten vorbereiten
            let angebote = [];
            // Angebote aus Klassenvariable Angebot herausziehen aus Datenbank (über Data.ts)
            // Aus Datenbank kommt Objekt nicht Array und mit Objekt kann man schlecht zufällige Werte herausziehen, daher Array mit Angeboten und Angebots-ID
            for (let angId in this.angebot) {
                // Angebote herausziehen
                let val = this.angebot[angId];
                angebote.push({ ...val, id: angId });
            }
            // Zufälliges Index wählen durch math.random -> Zufälliges Angebot erzeugen
            // Math.floor: Abrundung
            let rnd = angebote[Math.floor(Math.random() * angebote.length)];
            // Neuen Customer
            // Customer bekommt Bestellung auf Objekt beigefügt/draufgespeichert (Angebotsname, Eis, Sauce, Topping)
            let newCustomer = new EisdieleSimulator.Customer(EisdieleSimulator.canvas.width / 2 - 10, EisdieleSimulator.canvas.height - 40, rnd.sauce, rnd.topping, rnd.sorten, rnd.name, rnd.price);
            // Customer in Customer-Array pushen
            this.customers.push(newCustomer);
            // Customer soll auf den ersten leeren Stuhl den er findet
            // Chairs Array
            let chairs = [];
            // Alle Chairs auslesen und die Tables durchloopen 
            // Chairs in einem Array vorbereiten und aus diesem Array, soll das erste leere Element gesucht werden
            for (let table of this.tables) {
                chairs.push(...table.chairs);
            }
            // Wenn es keine leeren Stühle gibt, passiert nichts -> return
            let empty = chairs.find((c) => !c.customer);
            if (!empty) {
                // verlässt hier die Funktion
                return;
            }
            // Den Kunden auf den leeren Stuhl setzen
            // Stuhl bekommt Customer zugewiesen
            empty.customer = newCustomer;
            // Customer bekommt Stuhl zugewiesen
            newCustomer.target = empty;
        }
        // Customer in Intervallen hinzufügen
        customerInterval() {
            // Funktion ausführen, um ersten Customer zu laden, so dass User direkt anfangen kann zu spielen und nicht erst 10s warten muss bis erster Customer kommt
            this.spawnCustomer();
            // Customer erscheint alle 10s, weil alle 10s die Funktion spawnCustomer aufgerufen wird
            setInterval(this.spawnCustomer.bind(this), this.Customer_Spawn_MS);
        }
        // Bindet Events an Canvas
        setupEvents() {
            // Click = Linksclick 
            // Funktion: Selektieren des Elements ausführen
            EisdieleSimulator.canvas.addEventListener("click", this.select.bind(this));
            // Contextmenu = Rechtsclick
            // Funktion: Bucket ist selektiert und wenn man nun mit Rechtsklick auf Kunden klickt, dann wird Item übergeben ggf. Reaktion (Zufrieden oder wütend)
            EisdieleSimulator.canvas.addEventListener("contextmenu", this.chooseCustomer.bind(this));
        }
        // Rechtsklick
        chooseCustomer(e) {
            // Standardverhalten von Rechtsklick mit preventDefault verhindern (Öffnen des Contextmenu)
            e.preventDefault();
            // Wenn kein Element selektiert ist, wird hier mit return Funktion verlassen
            if (!this.selected) {
                return;
            }
            // Logik: Nahsten Kunden an Maus finden
            let { offsetX, offsetY } = e;
            let mouseVec = new EisdieleSimulator.Vector(offsetX, offsetY);
            let target = null;
            let shortest = 40;
            for (let customer of this.customers) {
                customer.selected = false;
                let middle = new EisdieleSimulator.Vector(customer.pos.x + 20, customer.pos.y + 20);
                let dist = middle.distanceTo(mouseVec);
                if (dist < shortest) {
                    target = customer;
                    shortest = dist;
                }
            }
            console.log();
            if (!target) {
                return;
            }
            // Wenn das selektierte ein ToppingBucket ist, aber das Topping nicht dem Topping des Kunden entspricht, dann wird Kunde wütend
            if (this.selected instanceof EisdieleSimulator.ToppingBucket) {
                if (this.selected.topping !== target.topping) {
                    target.mood = "angry";
                }
                else {
                    // Wenn das Topping, dem Topping entspricht den der Kunde will, geben wir es ihm
                    target.givenTopping = this.selected.topping;
                }
            }
            // Wenn das selektierte ein SauceBucket ist, aber die Sauce nicht der Sauce des Kunden entspricht, dann wird Kunde wütend
            if (this.selected instanceof EisdieleSimulator.SauceBucket) {
                if (this.selected.sauce !== target.sauce) {
                    target.mood = "angry";
                }
                else {
                    // Wenn die Sauce, der Sauce entspricht die der Kunde will, geben wir es ihm
                    target.givenSauce = this.selected.sauce;
                }
            }
            // IceBucket ist selektiert
            // Nun wird überprüft, ob die selektierte Sorte in der Auswahl des Kunden dabei ist
            // Wenn ja -> dann fügen wir dem Kunden die Kugel hinzu
            // Wenn nicht -> wird Kunde wütend
            if (this.selected instanceof EisdieleSimulator.IceBucket) {
                if (target.ice.indexOf(this.selected.sorte) === -1) {
                    target.mood = "angry";
                }
                else {
                    target.givenIce.push(this.selected.sorte);
                }
            }
            // Bedingung: Kunde hat Sauce, Topping und Sorten erhalten, die er wollte
            if (target.givenSauce && target.givenTopping && target.ice.length === target.givenIce.length) {
                // Gewinn um den Angebotspreis erhöhen 
                this.earnings += target.angebotPrice;
                // Kunden auslesen
                let idx = this.customers.findIndex((k) => k === target);
                // Stühle wieder zusammenscheiben
                let chairs = [];
                for (let place of this.tables) {
                    chairs.push(...place.chairs);
                }
                for (let chair of chairs) {
                    if (chair.customer === target) {
                        // Kunden vom Stuhl entfernen
                        chair.customer = null;
                    }
                }
                // Kunde löschen, da er zufrieden ist und geht
                this.customers.splice(idx, 1);
            }
        }
        // Linksklick
        select(e) {
            console.log(e);
            // Alle selektierbaren Entitys aus Array rausschreiben
            let entitiesSelectable = this.getSelectableEntities();
            // Aus Event Mausklick herauslesen
            // Wo habe ich auf der Seite in Element hingeklickt
            let { offsetX, offsetY } = e;
            // Vektor aus Mausklick generieren
            let mouseVec = new EisdieleSimulator.Vector(offsetX, offsetY);
            // Hilfsvariablen shortest und closest
            let shortest = 40;
            let closest = null;
            // Globale Selektiervariable reseten
            this.selected = null;
            // Alle Selektierbaren Entitys durchloopen
            for (let ent of entitiesSelectable) {
                // Entity reseten
                ent.selected = false;
                // Mitte des Elements herauslesen
                // Aus Mitte heraus Distanz zum Mausvektor errechnen
                let middle = new EisdieleSimulator.Vector(ent.pos.x + 20, ent.pos.y + 20);
                let dist = middle.distanceTo(mouseVec);
                // Wenn Distanz kleiner als Shortest (40 -> Radius vom Kreis), dann wurde ein neues nahstes Element gefunden
                if (dist < shortest) {
                    closest = ent;
                    shortest = dist;
                }
            }
            console.log(closest, shortest);
            // Die Entity, die am nahsten ist (Closest) wird auf true gesetzt
            // Closest ist die Entity, die selektiert ist
            if (closest) {
                closest.selected = true;
                this.selected = closest;
            }
        }
        // Selektierbare Entitys
        getSelectableEntities() {
            return [
                ...this.sauceBuckets,
                ...this.toppingBuckets,
                ...this.icebuckets
            ];
        }
        // CreateBuckets führt die drei Funktionen für alle Buckets nochmals aus
        createBuckets() {
            this.createSauceBuckets();
            this.createToppingBuckets();
            this.createIceBuckets();
        }
        // Sauce Buckets erstellen mit den vorgegebenen Werten
        // Drei Saucen -> drei Buckets werden erstellt 
        createSauceBuckets() {
            // Von 0 an hochzählen
            let i = 0;
            // Drei Buckets mit jeweiligen Saucen und Koordinaten 
            for (let sauce of ['karamel', 'schokolade', 'himbeere']) {
                // Standard x-Wert: 50
                // y-Wert für alle Buckets = 60
                // Erstes Bucket mit Koordinate 50 + (0*50) = 50, zweites Bucket 50 + (1x50) = 100, drittes Bucketauf Position 50 + (2x50) = 150
                // Push SauceBucket in Entitätenliste, so dass diese mit Daten gefüllt ist
                this.sauceBuckets.push(new EisdieleSimulator.SauceBucket(50 + (i++ * 50), 60, sauce));
            }
        }
        // Create Ice Cream Buckets
        createIceBuckets() {
            let i = 0;
            for (let sorte of ['vanille', 'schoko', 'karamell', 'pistazie', 'erdbeer', 'straccia', 'zitrone', 'mango']) {
                // Standard x-Wert 380 -> da Ice Cream Buckets etwas weiter rechts lokalisiert sind
                // Erstes Bucket mit Koordinate 380 + (0*50) = 430 und so weiter
                this.icebuckets.push(new EisdieleSimulator.IceBucket(380 + (i++ * 50), 60, sorte));
            }
        }
        // Create Topping Buckets
        createToppingBuckets() {
            let i = 0;
            for (let topping of ['keks', 'sahne', 'mms']) {
                // Erstes Bucket mit Koordinate 210 + (0*50) = 260 und so weiter
                this.toppingBuckets.push(new EisdieleSimulator.ToppingBucket(210 + (i++ * 50), 60, topping));
            }
        }
        // Tische erstellen mit Start-Werten x = 150 und y = 200
        createTables(nr) {
            let startX = 150;
            let startY = 200;
            let count = 0;
            // Tische erstellen als Datenobjekt
            // nr = tableAmount -> hier 12s
            for (let i = 0; i < nr; i++) {
                this.tables.push(new EisdieleSimulator.Table(startX, startY));
                // In For-Loop new Table always plus 150 in x-Position
                // For-Schleife: Zu der x-Position des ersten Tisches wird 150 hinzuaddiert, um neuen x-Wert für neuen Tisch zu errechnen
                // ex. Erster Tisch x = 150, Zweiter Tisch x + 150 = 300
                startX += 150;
                count++;
                // When count reaches four Tables in x-row (y = 0 200) start adding in new row below
                // y-Position plus 150 -> y-Positon = 350
                if (count === 4) {
                    count = 0;
                    startX = 150;
                    startY += 150;
                }
            }
        }
        // Spiel wird gestartet
        displayGame() {
            // Container 1 (Menü) wird ausgeblendet 
            let mainContainer = document.getElementById("container1");
            mainContainer.style.display = "none";
            // Container 2 (Spiel) wird eingeblendet
            let canvasContainer = document.getElementById("container2");
            canvasContainer.style.display = "block";
        }
        static DB(command, collection, data, id) {
            let add = "";
            if (id) {
                add = "&id=" + id;
            }
            return EisdieleSimulator.send(`?command=${command}&collection=${collection}${add}`, data);
        }
        // Spiel wird gezeichnet
        // Funktion render ruft requestAnimationFrame auf
        render() {
            // requestAnimationFrame ruft render Funktion auf -> Loop
            window.requestAnimationFrame(this.render.bind(this));
            // Canvas leeren, da diese ständig neu iterriert wird (Kreislauf) und um Überlappungen zu vermeiden am Besten Canvas leeren
            // Passiert alles sehr schnell, nicht auffällig
            EisdieleSimulator.ctx.clearRect(0, 0, EisdieleSimulator.canvas.width, EisdieleSimulator.canvas.height);
            // Mit jedem Frame werden diese Funktionen ausgeführt
            this.renderEisdiele();
            this.renderCustomers();
            this.renderEarnings();
            this.renderLabels();
        }
        // Namen der Saucen auf Canvas zeichnen
        renderLabels() {
            EisdieleSimulator.ctx.fillStyle = "black";
            EisdieleSimulator.ctx.font = "19px Arial";
            EisdieleSimulator.ctx.fillText("Saucen", 50, 50);
            EisdieleSimulator.ctx.fillText("Toppings", 200, 50);
            EisdieleSimulator.ctx.fillText("Eissorten", 375, 50);
        }
        // Gewinn auf Canvas zeichnen
        renderEarnings() {
            //console.log("test");
            EisdieleSimulator.ctx.fillStyle = "darkgreen";
            EisdieleSimulator.ctx.font = "19px Arial";
            // Gewinn errechnen
            EisdieleSimulator.ctx.fillText("Gewinn: " + this.earnings + " €", 650, 20);
        }
        renderCustomers() {
            for (let customer of this.customers) {
                customer.render();
            }
        }
        // Eisdiele auf Canvas zeichnen
        renderEisdiele() {
            // Orangene Borders zeichnen
            EisdieleSimulator.ctx.fillStyle = "orange";
            EisdieleSimulator.ctx.fillRect(0, 0, EisdieleSimulator.canvas.width, 20);
            EisdieleSimulator.ctx.fillRect(0, 0, 20, EisdieleSimulator.canvas.height);
            EisdieleSimulator.ctx.fillRect(0, EisdieleSimulator.canvas.height - 20, EisdieleSimulator.canvas.width, 20);
            EisdieleSimulator.ctx.fillRect(EisdieleSimulator.canvas.width - 20, 0, 20, EisdieleSimulator.canvas.height);
            // Tür zeichnen
            EisdieleSimulator.ctx.fillStyle = "white";
            EisdieleSimulator.ctx.fillRect(EisdieleSimulator.canvas.width / 2 - 40, EisdieleSimulator.canvas.height - 20, 80, 20);
            // Tische, Stühle und das Sortiment rendern
            this.renderTables();
            this.renderBuckets();
        }
        // Buckets rendern
        // Looped alle SauceBuckets etc.
        renderBuckets() {
            // Für jede Sauce (saucebucket) im sauceBuckets-Array wird die Funktion render aufgerufen
            // Ruft render() in SauceBucket.ts auf
            for (let saucebucket of this.sauceBuckets) {
                saucebucket.render();
            }
            for (let topbucket of this.toppingBuckets) {
                topbucket.render();
            }
            for (let icebucket of this.icebuckets) {
                icebucket.render();
            }
        }
        // Tische rendern
        renderTables() {
            // Für jede Tisch/Stuhl-Kombi im tables-Array wird die render-Funktion in Table.ts aufgerufen
            for (let table of this.tables) {
                table.render();
            }
        }
    }
    EisdieleSimulator.Simulator = Simulator;
})(EisdieleSimulator || (EisdieleSimulator = {}));
