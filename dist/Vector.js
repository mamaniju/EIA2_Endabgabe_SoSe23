"use strict";
// Eisdealer-Simulator
// Julia Mamani, 268377, MKB2
// In Zusammenarbeit mit Evelin Sinner, Anna-Lena Jörger, Penelope Vogel
var EisdieleSimulator;
(function (EisdieleSimulator) {
    // Objekt das x und y-Koordinate speichert
    class Vector {
        x;
        y;
        // Konstruktor nimmt x- und y-Werte von außen entgegen. Daraus ergibt sich Position.
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        // Erzeugte Distanz (z.B. Distanz zwischen Mausklick und Objekt)
        distanceTo(vec) {
            return Math.sqrt(Math.pow(vec.x - this.x, 2) + Math.pow(vec.y - this.y, 2));
        }
    }
    EisdieleSimulator.Vector = Vector;
})(EisdieleSimulator || (EisdieleSimulator = {}));
