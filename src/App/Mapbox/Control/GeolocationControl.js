// import mapboxgl, {Map ,GeolocateControl} from "mapbox-gl";
//
// export class GeolocationControl {
//     map;
//     container;
//
//     onAdd( map ) {
//         this.map = map;
//
//         this.container = document.createElement('div');
//         this.container.classList.add( 'mapboxgl-ctrl', 'mapboxgl-ctrl-group');
//         this.container.innerHTML = '<button type="button" class="map-control-clown"><span>🔄</span></button>';
//
//         this.container.children[0].addEventListener( 'click', this.handlerGeoClick.bind(this) );
//
//         return this.container;
//     }
//
//     handlerGeoClick() {
//         map.addControl(new mapboxgl.GeolocateControl({
//             fitBoundsOptions: {
//                 maxZoom: 17.5
//             },
//             positionOptions: {
//                 enableHighAccuracy: true
//             },
//             showUserHeading: true,
//         }));
//     }
// }