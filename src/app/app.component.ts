
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Loader, LoaderOptions } from '@googlemaps/js-api-loader';

import { Nodo } from './nodo';
const roma = {lat:  41.76820695690988, lng: 12.470126152038574 };
const roma2 = { lat: 42.43, lng: 12.49169 };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  markercount = 0;
  outputdist = '';
  markerpos: google.maps.LatLng[] = [];
  final: google.maps.LatLng[] = [];
  listamarker: google.maps.Marker[] = [];
  title = 'google-maps';
  list: Nodo[] = []
  map: any;
  startermarker: any = null;

  listaviaggioparzialeshuf: google.maps.DirectionsWaypoint[] = [];
  matricedistanze: number[][] = [];
  distancematrix: number[][] = [];
  indexex: number[] = [];
  preindexex: number[] = [];



  ngOnInit(): void {

    let loader = new Loader({
      apiKey: 'AIzaSyC5eTcNbxr52pcXxiMo6ZpB_Nkx6mov3AE',
      libraries: ['places'],
    })


    loader.load().then(() => {


      this.map = new google.maps.Map(document.getElementById("map-canvas") as HTMLElement, {
        zoom: 12,
        center: roma
      })
      var directionsService = new google.maps.DirectionsService();
      var directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,


      });
      var markers: any = [];
      var input = (document.getElementById('pac-input'));

      this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

      document.getElementById("lancia")!.addEventListener("click", () => {
        this.gestorecalc();
        setTimeout(() => this.viaggiorandom(directionsService, directionsRenderer), this.listamarker.length*500)


      });
      document.getElementById("delete")!.addEventListener("click", () => {
        this.rimuoviMarker(directionsService, directionsRenderer);
      });




      //SearchBox della mappa
      var searchBox = new google.maps.places.SearchBox(input as HTMLInputElement);


      //Contestualizzazione della SearchBox rispetto alla porzione di mappa inquadrata
      this.map.addListener("bounds_changed", () => {
        searchBox.setBounds(this.map.getBounds());
      });



      directionsRenderer.setMap(this.map);
      searchBox.addListener("places_changed", () => {

        const places = searchBox.getPlaces();

        if (places!.length == 0) {
          return;
        }


        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();
        places!.forEach((place) => {

          if (!place.geometry || !place.geometry.location) {
            console.log("Returned place contains no geometry");
            return;
          }


          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }

        });


        this.map.fitBounds(bounds);
      });
      //Evento (click) per aggiungere i marker
      google.maps.event.addListener(this.map, "click", (event: any) => {

        if (this.markercount < 10) {

          this.addMarker(event.latLng);
          this.markercount += 1;

        }

      });




    })


  }





  //Fine del void

  //Aggiunta del marker alla mappa
  addMarker(location: any): void {
    var Marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      position: location,
      map: this.map,
      draggable: true,

    });
    this.listamarker.push(Marker)
    this.listamarker[0].setLabel("1")

    const dest = new Nodo(location.lat(), location.lng());
    this.list.push(dest);
    if (!this.startermarker) {
      this.startermarker = dest;
    }
    console.log(this.list)
  }





  //Eliminazione dei marker e dei risultati 
  rimuoviMarker(directionsService: google.maps.DirectionsService, directionsRenderer: google.maps.DirectionsRenderer) {

    for (let i = 0; i < this.listamarker.length; i++) {
      this.listamarker[i].setMap(null)

    }
    this.list = [];
    this.listamarker = [];
   
    this.markerpos = [];
    this.markercount = 0;
    this.outputdist = '';
    this.indexex = [];
    this.listaviaggioparzialeshuf = [];
    this.final = []
    directionsRenderer.set('directions', null);
  }








  //Servizio DistanceMatrix per il calcolo delle distanze reciproche tra i marker
  calcolodistanza() {
    const service = new google.maps.DistanceMatrixService();
    var matricedistanze: number[][] = [];
    var outputmat: number[][] = [];
    var matricetempi: number[][] = [];
    for (let i = 0; i < (this.listamarker.length); i++) {
      this.markerpos[i] = this.listamarker[i].getPosition()!;
    };

    for (let i = 0; i < this.listamarker.length; i++) {

      matricedistanze[i] = new Array(this.listamarker.length);
      matricetempi[i] = new Array(this.listamarker.length);
      outputmat[i] = new Array(this.listamarker.length);
    }

    service.getDistanceMatrix(
      {
        origins: this.markerpos,
        destinations: this.markerpos,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      },
      (response, status) => {
        if (status !== "OK") {

          alert("Error was: " + status);
          return;
        } else {


          const showGeocodedAddressOnMap = (asDestination: any) => {

            return (results: number, status: any) => {

            };
          };

          for (let i = 0; i < this.listamarker.length; i++) {
            const results = response?.rows[i].elements



            for (let j = 0; j < this.listamarker.length; j++) {

              matricedistanze[i][j] = results![j].distance.value;
              matricetempi[i][j] = results![j].duration.value;

            }

          }

        }
      }

    );

    return matricedistanze;
  };





  gestorecalc() {


    console.log(this.markerpos.length);
    this.distancematrix = this.calcolodistanza();
    setTimeout(() => this.algoritmo(this.distancematrix), this.listamarker.length*80)

  }






  algoritmo(distancematrix: number[][]) {
    var Temp = 2000 + 800* this.listamarker.length;
    var numIter = Math.pow(this.listamarker.length-1, 4)
    var cooling = 0.97 + 0.003*(this.listamarker.length-1);
    var bestdistance = 0;
    var count = 0;
    var indice: number[] = [0];
    var bestindice: number[] = [0];
    var preindice: number[] = [0];

    for (let i = 0; i < (this.listamarker.length - 1); i++) {
      indice[i] = i + 1;
    }
    for (let i = 0; i < (this.listamarker.length); i++) {
      this.markerpos[i] = this.listamarker[i].getPosition()!;
    };
    this.shuffle(indice);
    bestindice = indice;
    for (let i = 0; i < (this.listamarker.length - 1); i++) {
      this.listaviaggioparzialeshuf[i] = { location: this.markerpos[bestindice[i]] };
      this.final[i] = this.markerpos[bestindice[i]]
    }
    bestdistance = this.calcolatot(indice, distancematrix)
    for (let i = 0; i < (numIter); i++) {
      count++;
      if (Temp > 0.1) {
        preindice = indice;
        indice = this.invertinodi(indice)
        var currdist = this.calcolatot(indice, distancematrix)
        if (currdist < bestdistance) {
          console.log(count + " " + currdist + "minore" + bestdistance + indice)
          bestdistance = currdist;
          bestindice = indice;
          console.log(bestindice)
          this.indexex = bestindice
          for (let i = 0; i < (this.listamarker.length - 1); i++) {
            this.listaviaggioparzialeshuf[i] = { location: this.markerpos[bestindice[i]] };
            this.final[i] = this.markerpos[bestindice[i]]
          }

        } else if (Math.exp((bestdistance - currdist) / Temp) < Math.random()) {
          console.log("cattivo" + currdist + indice)
          indice = preindice;

        }
        Temp *= cooling;
      } else {
        break;
      }
    } console.log(count);
    console.log(bestdistance)


    return bestindice
  }






  viaggiorandom(directionsService: google.maps.DirectionsService, directionsRenderer: google.maps.DirectionsRenderer) {

    //Creo una lista di posizioni latlng
    for (let i = 0; i < (this.listamarker.length); i++) {
      this.markerpos[i] = this.listamarker[i].getPosition()!;

    };

    console.log(this.markerpos.length);
    console.log(this.indexex);


    var request = {
      origin: this.markerpos[0],
      destination: this.markerpos[0],
      waypoints: this.listaviaggioparzialeshuf,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status == 'OK') {
        directionsRenderer.setDirections(result);
        console.log("ok");
        var totalDist = 0;
        var totalTime = 0;
        var myroute = result!.routes[0];
        var orders = result!.routes[0].waypoint_order;
        for (let i = 0; i < myroute.legs.length; i++) {
          totalDist += myroute.legs[i].distance!.value;
          totalTime += myroute.legs[i].duration!.value;

        }
        totalDist = totalDist / 1000.
        console.log(totalDist);
        console.log(orders);
        this.listamarker[0].setMap(null)
        for (let i = 1; i < this.final.length + 1; i++) {
          this.listamarker[i].setMap(null)
          var Marker = new google.maps.Marker({
            position: this.final[i - 1],
            map: this.map,
            draggable: true,
            label: (i + 1).toString()

          });
          this.listamarker[i] = (Marker)
        }
        var Marker1 = new google.maps.Marker({
          position: this.markerpos[0],
          map: this.map,
          draggable: true,
          label: (1).toString()

        });
        this.listamarker[0] = Marker1
        console.log(this.listamarker.length)
      }
    });

    console.log(this.listamarker.length);



  }






  //Mischia un array
  shuffle(array: any[]) {
    var currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }






  //Data una sequenza ordinata di città, calcolane la distanza
  calcolatot(ind: number[], matricedistanzex: number[][]) {

    var tot = 0;

    tot += matricedistanzex[0][ind[0]];
    tot += matricedistanzex[ind[ind.length - 1]][0];

    for (let i = 0; i < (ind.length - 1); i++) {
      tot += matricedistanzex[ind[i]][ind[i + 1]];
    }

    return tot;
  }





  //Inverti due nodi casuali nella sequenza
  invertinodi(array: number[]) {
    var app;
    var a = Math.floor(Math.random() * array.length);
    var b = Math.floor(Math.random() * array.length);
    app = array[a]
    array[a] = array[b];
    array[b] = app
    return array
  }

}




