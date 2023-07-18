"use strict";
// Eisdealer-Simulator
// Julia Mamani, 268377, MKB2
// In Zusammenarbeit mit Evelin Sinner, Anna-Lena Jörger, Penelope Vogel
var EisdieleSimulator;
(function (EisdieleSimulator) {
    // Objekt mit Position, welches selektiert werden kann
    class Entity {
        // Objekt hat eine Position, die sich aus den Werten initX und initY (im constructor) ergibt
        pos;
        // Die Position ist nicht selektiert
        selected = false;
        // // Konstruktor nimmt x- und y-Werte von außen entgegen
        constructor(initX, initY) {
            // Position wird durch initX und initY erzeugt
            this.pos = new EisdieleSimulator.Vector(initX, initY);
        }
    }
    EisdieleSimulator.Entity = Entity;
})(EisdieleSimulator || (EisdieleSimulator = {}));
