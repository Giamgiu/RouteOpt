import { mapToMapExpression } from '@angular/compiler/src/render3/util';
import { Component, OnInit, ɵɵclassMapInterpolateV } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { Nodo } from './nodo';
const roma = { lat: 41.89038, lng: 12.49169 };
var labelIndex = 1;




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
      apiKey: 'AIzaSyC5eTcNbxr52pcXxiMo6ZpB_Nkx6mov3AE'
    })


    loader.load().then(() => {
      this.map = new google.maps.Map(document.getElementById("mappa") as HTMLElement, {
        zoom: 12,
        center: roma
      })


      google.maps.event.addListener(this.map, "click", (event: any) => {
        this.addMarker(event.latLng);
      });

      const service = new google.maps.DistanceMatrixService();

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
    if (!this.startermarker){
      this.startermarker = marker;
    }
    console.log(this.list)
    labelIndex++


  }
}
