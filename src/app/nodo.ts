  class nodo {
  lat:number;
  lng:number;
  visitato: boolean;
 
 constructor(lat: number, lng: number, visitato: boolean) {
   this.lat = lat;
   this.lng = lng;
   this.visitato = visitato;
 }

 public  getLat() {
return this.lat;
 }
 public getLng(){
   return this.lng
 }
 public isVisitato(){
   return this.visitato
 }
 
}
