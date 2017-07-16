import { Component,ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
declare var google;

/**
 * Generated class for the Map page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: ' map-page',
  templateUrl: 'map.html',
})
export class Map {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  coords=[];
  currentPositon: any;
  endPosition: any;

  constructor(public navCtrl: NavController,private navParams:NavParams,private geolocation:Geolocation,private alert:AlertController) {
  }

  ionViewDidLoad() {
    console.log("Load map");
    document.getElementById('main_header').hidden = true;
    this.loadMap();
  }
  loadMap() {
    let markArray = this.navParams.get('arr');
    let mark = markArray[0];
   // this.showAlert('mark',mark.lat);
    this.geolocation.getCurrentPosition().then((position) => {
      // this.showAlert('lat',position.coords.latitude);
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let latLngend = new google.maps.LatLng(mark.lat,mark.long);

      let mapOptions = {
        center: latLngend,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      let currMark = {
        lat: position.coords.latitude,
        long : position.coords.longitude
      }
      this.currentPositon=currMark;
      this.endPosition=mark;
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addMarkerWithInfo(currMark,'You are here');
      this.addMarkerWithInfo(mark,mark.name);
    
    }, (err) => {
      console.log(err);
    });

  }

   

  calculateAndDisplayRoute(type:string) {
      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;
      directionsDisplay.setMap(this.map);
      let start = new google.maps.LatLng(this.currentPositon.lat,this.currentPositon.long);
      let end = new google.maps.LatLng(this.endPosition.lat,this.endPosition.long);
      if(type.match('drive')) {
      directionsService.route({
          origin: start,
          destination: end,
          travelMode: 'DRIVING'
          }, function(response, status) {
              if (status === 'OK') {
                directionsDisplay.setDirections(response);
              } else {
                window.alert('Directions request failed due to ' + status);
             }
          }); 
        } else {
           directionsService.route({
          origin: start,
          destination: end,
          travelMode: 'WALKING'
          }, function(response, status) {
              if (status === 'OK') {
                directionsDisplay.setDirections(response);
              } else {
                window.alert('Directions request failed due to ' + status);
             }
          }); 
        }
      }

      showAddresses() {
        let geocoder = new google.maps.Geocoder;
        let infowindow = new google.maps.InfoWindow;
         
       // geocoder.setMap(this.map);
        let end = new google.maps.LatLng(this.endPosition.lat,this.endPosition.long)
        geocoder.geocode({'location': end}, function(results, status) {
          if (status === 'OK') {
            if (results[1]) {
              console.log('upao');
              console.log((results[1].formatted_address));
              //this.map.setZoom(11);
            //   let marker = new google.maps.Marker({
            //     position: end,
            //     map: this.map
            //   });
            // let infowindow = new google.maps.InfoWindownew({
            //            content: results[1].formatted_address
            //           });
            // // infowindow.setContent(results[1].formatted_address);
            //  infowindow.open(this.map,marker);
            
            } else {
              //window.alert('No results found');
              this.showAlert('No results found');
            }
          } else {
           // window.alert('Geocoder failed due to: ' + status);
           this.showAlert('Geocoder failed due to: ' + status);
          }
        });
      }

  addMarker(item){

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(item.lat, item.long)
    });

    let content = "<h4>Information!</h4>";

    this.addInfoWindow(marker, content);

  }
  addMarkerWithInfo(item,infot){

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(item.lat, item.long)
    });

    let content = "<h4>" + infot + "</h4>";

    this.addInfoWindow(marker, content);

  }
  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    infoWindow.open(this.map,marker);
    // google.maps.event.addListener(marker, 'click', () => {
    //   infoWindow.open(this.map, marker);
    // });

  }
  showAlert(title,subtitle) {
    let alert = this.alert.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present(prompt);
  }


}
