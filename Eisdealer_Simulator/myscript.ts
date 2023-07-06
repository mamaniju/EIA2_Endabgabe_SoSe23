/*
Eisdealer-Simulator
Julia Mamani, 268377, MKB2
In Zusammenarbeit mit Evelin Sinner, Penelope Vogel, Anna-Lena Jörger
*/
namespace Eisdiele {
  //let menuAngebot: string [] = ["bomba", "LaPaz", "SantaCruz"]; 
  window.addEventListener ("load", handleLoad)
  function handleLoad (): void {
    /*document.getElementById("angebot").addEventListener("change", function(e: Event) {
      const selectedValue = (e.target as HTMLSelectElement).value;
      const secondDropdown = document.getElementById("anzahl") as HTMLSelectElement;
      secondDropdown.value = 3; 
    }*/
  }
  class Angebot {
    numOfBalls: number;
    Eissorte: string;
    name:string; 

    constructor(numOfBalls: number, Eissorte: string, name: string ) {
      this.numOfBalls = numOfBalls;
      this.Eissorte = Eissorte;
      this.name= name; 
    }
  }
  let angebotArray: Angebot[] = [];
  // Add objects to the array
  angebotArray.push(new Angebot(2, 'Vanilla', 'Bomba'));
  angebotArray.push(new Angebot(3, 'Chocolate', 'La Paz'));
  angebotArray.push(new Angebot(1, 'Strawberry', 'Santa Cruz'));
  
}