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

      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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

        if (markercount < 15) {

          this.addMarker(event.latLng);
          markercount += 1;
          var dispmark = document.getElementById('dispmark');
          if (dispmark) dispmark.textContent = markercount + ' / 15 marker';

        } else {
          window.alert("reach 15 marker");
        }

      });

      markers.addListener


    })
   

  }



  addMarker(location: any): void {
    var Marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      position: location,
      map: this.map,
    });

    const marker = new Nodo(location.lat(), location.lng());
    this.list.push(marker);
    if (!this.startermarker) {
      this.startermarker = marker;
    }
    console.log(this.list)



  }

  
}
