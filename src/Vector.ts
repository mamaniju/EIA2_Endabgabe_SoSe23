// Eisdealer-Simulator
// Julia Mamani, 268377, MKB2
// In Zusammenarbeit mit Evelin Sinner, Anna-Lena Jörger, Penelope Vogel

namespace EisdieleSimulator{

    // Objekt das x und y-Koordinate speichert
    export class Vector{
        public x: number;
        public y: number;

        // Konstruktor nimmt x- und y-Werte von außen entgegen. Daraus ergibt sich Position.
        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        // Erzeugte Distanz (z.B. Distanz zwischen Mausklick und Objekt)
        distanceTo(vec: Vector){
            return Math.sqrt(Math.pow(vec.x-this.x,2) + Math.pow(vec.y - this.y, 2));
        }
    }
}
