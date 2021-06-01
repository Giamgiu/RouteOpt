import { mapToMapExpression } from '@angular/compiler/src/render3/util';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Loader, LoaderOptions } from '@googlemaps/js-api-loader';
import { Nodo } from './nodo';
const roma = { lat: 41.89038, lng: 12.49169 };
var markercount = 0;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  originlist: google.maps.LatLng[]=[]
  listamarker: google.maps.Marker[] = [];
  title = 'google-maps';
  list: Nodo[] = []
  map: any;
  startermarker: any = null;


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

      var markers: any = [];

      var input = (document.getElementById('pac-input'));

      this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

      var searchBox = new google.maps.places.SearchBox(input as HTMLInputElement);

     

      this.map.addListener("bounds_changed", () => {

        searchBox.setBounds(this.map.getBounds());
      });


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
  
      google.maps.event.addListener(this.map, "click", (event: any) => {

        if (markercount < 10) {

          this.addMarker(event.latLng);
          markercount += 1;
          var dispmark = document.getElementById('dispmark');
          if (dispmark) dispmark.textContent = markercount + ' / 10 marker';

        } else {
          window.alert("reach 10 marker");
         
        }

      });
      
     


    })
   

  }



  addMarker(location: any): void {
    var Marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      position: location,
      map: this.map,
      draggable : true,
    });
    this.listamarker.push(Marker)
    const dest = new Nodo(location.lat(), location.lng());
    this.list.push(dest);
    if (!this.startermarker) {
      this.startermarker = dest;
    }
    console.log(this.list)



  }

  rimuoviMarker (){
    const outputDiv = document.getElementById("output");
     for( let i = 0; i < this.listamarker.length; i++){
      this.listamarker[i].setMap(null)
     
     }
     this.list = [];
     this.listamarker.length=0;
     this.originlist.length=0;
     this.originlist=[];
     markercount =0;
     
     var dispmark = document.getElementById('dispmark');
         if (dispmark) dispmark.textContent = markercount + ' / 10 marker';
         outputDiv!.innerHTML = "";
  }

  calcolodistanza(){
    const outputDiv = document.getElementById("output");
    outputDiv!.innerHTML = "";
    for( let i = 0; i < this.listamarker.length; i++){
      this.originlist.push( this.listamarker[i].getPosition()!)
    }
    const geocoder = new google.maps.Geocoder();
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: this.originlist,
        destinations: this.originlist,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      },
      (response, status) => {
        if (status !== "OK") {
          alert("Error was: " + status);
        } else {
          const originList = response?.originAddresses;
          const destinationList = response?.destinationAddresses;
         
          outputDiv!.innerHTML = "";
          
  
          const showGeocodedAddressOnMap =  (asDestination:any) => {
            
  
            return  (results:any, status:any) => {
              
            };
          };
  
          for (let i = 0; i < originList!.length; i++) {
            const results = response?.rows[i].elements;
            geocoder.geocode(
              { address: originList![i] },
              showGeocodedAddressOnMap(false)
            );
  
            for (let j = 0; j < results!.length; j++) {
              geocoder.geocode(
                { address: destinationList![j] },
                showGeocodedAddressOnMap(true)
              );
              outputDiv!.innerHTML +=
                originList![i] +
                " to " +
                destinationList![j] +
                ": " +
                results![j].distance.text +
                " in " +
                results![j].duration.text +
                "<br>";
            }
          }
        }
      }
    );
this.originlist=[];
this.originlist.length=0;
  };
}
