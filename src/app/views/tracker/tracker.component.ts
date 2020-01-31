import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { MarkerManager } from '@googlemaps/markermanager';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit, AfterViewInit {
  @ViewChild('gmap', { static: true }) gmapElement: any;

  map: google.maps.Map;

  markerManager: MarkerManager;
  markers = {};
  markerArr = [];

  markerData: any;
  markerKeys: any[];

  markerHQ: google.maps.Marker;

  mode: 'full' | 'single' = 'full';

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    

  }

  ngAfterViewInit() {
    var mapProp = {
      center: new google.maps.LatLng(-20.1391, 57.5328),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);


    var deloffice = new google.maps.LatLng(-20.139054, 57.532781);

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({location: deloffice}, (results, status) => {
      if (status == 'OK') {
        this.map.setCenter(results[0].geometry.location);

        this.markerHQ = new google.maps.Marker({
            map: this.map,
            position: results[0].geometry.location,
            title: 'DelOffice HQ',
            icon: {
              url: './assets/icons/deloffice_icon.png',
              size: new google.maps.Size(512, 512),
              anchor: new google.maps.Point(25, 50),
              origin: new google.maps.Point(0, 0),
              scaledSize: new google.maps.Size(50, 50)
            }
        });
      }
    });

    this.markerManager = new MarkerManager(this.map, {
      maxZoom: 13,
      trackMarkers: true,
      shown: true,
      borderPadding: 10
    });

    this.initDB();
  }

  initDB() {
    this.db.database.ref('raw-locations').on('value', (snapshot) => {
      const val = snapshot.val();
      // console.log(val);

      // this.db.object().remove();

      this.markerData = val;
      this.markerKeys = Object.keys(this.markerData).filter((item) => new Date(this.markerData[item][0].time).getDate() == new Date().getDate() || console.log(item));
      // this.markerKeys = Object.keys(this.markerData);

      Object.keys(this.markers).forEach(key => {
        if (val === null || !(key in val)) {
          const marker: google.maps.Marker = this.markers[key];
          marker.setMap(null);
          marker.setPosition(null);
          delete this.markers[key];
        }
      });

      // Object.keys(this.markers).forEach(key => {
      //   const ref = this.db.database.ref('raw-locations/' + key);
      //   ref.on('value', (snap) => {
      //     const data = snap.val();
      //     console.log(new Date(data.time))
      //   })
      // });

      if (val) {
        const keys = Object.keys(val);
  
        keys.forEach(key => {
          if (key in this.markers) {
            if (new Date().getDate() == new Date(val[key][0].time).getDate()) {
              const marker: google.maps.Marker = this.markers[key];
              marker.setPosition(
                new google.maps.LatLng(
                  val[key][0].lat,
                  val[key][0].lng
                )
              )
            }
          } else if (new Date().getDate() == new Date(val[key][0].time).getDate()) {
            const marker = new google.maps.Marker({
              position: {
                lat: val[key][0].lat,
                lng: val[key][0].lng
              },
              map: this.map,
              title: key,
              optimized: false,
              icon: {
                url: './assets/icons/tracker_icon.png',
                size: new google.maps.Size(512, 512),
                anchor: new google.maps.Point(25, 50),
                origin: new google.maps.Point(0, 0),
                scaledSize: new google.maps.Size(50, 50)
              },
            });
            this.markers[key] = marker;
            this.markerManager.addMarker(marker, 10, 10);
          }
  
        })
      }

      
      console.log(val);
    })
  }

  public switchMode() {
    if (this.mode == 'full') {
      this.mode = 'single';
    } else {
      this.mode = 'full';
    }
  }

  public convertTime(value) {
    return new Date(value);
  }

  public convertLatLng(lat, lng) {
    const location = new google.maps.LatLng(lat, lng)
    return 'https://www.google.com/maps/@' + location.toUrlValue();
  }

  public getTrackingDistance(data) {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      this.markerHQ.getPosition(),
      new google.maps.LatLng(data.lat, data.lng)
    );
    console.log(distance);
    return distance;
  }

  public viewHistory(data: any[], key1) {
    console.log(data)
    let planCoords = [];
    planCoords = data.map(item => {
      if (new Date(item.time).getDate() == new Date().getDate()) {
        item = new google.maps.LatLng(item.lat, item.lng)
        return item
      }
    })
    .filter(el => el != null);

    console.log(planCoords)

    Object.keys(this.markers).forEach(key => {
      if (key !== key1) {
        const marker: google.maps.Marker = this.markers[key];
        marker.setMap(null);
        marker.setPosition(null);
        delete this.markers[key];
      }
    });

    var lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: 4
    };

    if (planCoords.length > 0) {
      let path = new google.maps.Polyline({
        map: this.map,
        path: planCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0,
        strokeWeight: 3,
        icons: [{
          icon: lineSymbol,
          offset: '0',
          repeat: '20px'
        }],
      })
    }
    



  }

}
