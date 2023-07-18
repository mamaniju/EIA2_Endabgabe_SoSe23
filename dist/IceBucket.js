"use strict";
// Eisdealer-Simulator
// Julia Mamani, 268377, MKB2
// In Zusammenarbeit mit Evelin Sinner, Anna-Lena Jörger, Penelope Vogel
var EisdieleSimulator;
(function (EisdieleSimulator) {
    // imporitert die Sorte-Bilder
    var sorteImages = EisdealerSimulator.sorteImages;
    // Klasse von Eisbucket und erbt Methoden und Eigenschaften von Entity
    class IceBucket extends EisdieleSimulator.Entity {
        sorte;
        // Consructor nimmt Y und X von außen entgegen
        constructor(initX, initY, sorte) {
            super(initX, initY);
            this.sorte = sorte;
        }
        // Funktion fürs zeichnen
        render() {
            //positioniert(malt) die Eissorten an deren Plätzen
            // sauceImages.get nimmt sich die Bilder von der Variabel bei Images.ts
            EisdieleSimulator.ctx.drawImage(sorteImages.get(this.sorte), this.pos.x, this.pos.y, 40, 40);
            // wenn Bild ausgewählt wird, dann rote Outline um den Bild herum, damit User versteht, dass er Bild angeklickt hat
            if (this.selected) {
                EisdieleSimulator.ctx.beginPath();
                EisdieleSimulator.ctx.strokeStyle = "red";
                EisdieleSimulator.ctx.rect(this.pos.x - 5, this.pos.y - 5, 50, 50);
                EisdieleSimulator.ctx.stroke();
            }
            // Text unter den Eissorten
            EisdieleSimulator.ctx.fillStyle = "black";
            EisdieleSimulator.ctx.font = "12px Arial";
            EisdieleSimulator.ctx.fillText(this.sorte, this.pos.x - 2, this.pos.y + 50);
        }
    }
    EisdieleSimulator.IceBucket = IceBucket;
})(EisdieleSimulator || (EisdieleSimulator = {}));
