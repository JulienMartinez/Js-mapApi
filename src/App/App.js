import config from '../../app.config';

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, {Map, Marker} from 'mapbox-gl';
import { LocalEvent } from './Entity/LocalEvent';

import '../../assets/css/reset.css';
import '../../assets/css/style.css';

import { LocalStorageService } from './Service/LocalStorageService';
import { ReloadControl } from './Mapbox/Control/ReloadControl';
// import {GeolocationControl} from './Mapbox/Control/GeolocationControl';

const STORAGE_KEY = 'lidem-weather';

class App {
    eventStorage = null;
    arrMarker = [];
    isEditing = false;

    // Eléments de l'UI
    elForm = null;
    elNewTitle = null;
    elNewContent = null;
    elNewDateStart = null;
    elNewDateEnd = null;
    elCordLon = null;
    elCordLat = null;

    mainMap = null;

    constructor() {
        this.eventStorage = new LocalStorageService( STORAGE_KEY );

        mapboxgl.accessToken = config.mapbox.token;

        this.elForm = document.forms[0];
        this.elNewTitle = document.getElementById( 'title' );
        this.elNewContent = document.getElementById( 'description' );
        this.elNewDateStart = document.getElementById( 'date-start' );
        this.elNewDateEnd = document.getElementById( 'date-end' );
        this.elCordLon = document.getElementById( 'long' );
        this.elCordLat = document.getElementById( 'lat' );
    }

    /**
     * Démarre l'application
     */
    start() {
        console.info( 'Starting App...' );

        this.mainMap = new mapboxgl.Map({
            container: 'main-map',
            style: 'mapbox://styles/mapbox/streets-v11'
        });

        this.mainMap.on('click', (evt) => {
            this.elCordLon.value = evt.lngLat.lng;
            this.elCordLat.value = evt.lngLat.lat;
        });

        // Ajout du contrôle de navigation (zoom, inclinaison, etc.)
        const navControl = new mapboxgl.NavigationControl({
            visualizePitch: true
        });
        this.mainMap.addControl( navControl, 'bottom-right' );

        // Ajout du contrôle de Géolocalisation
        const geoLocControl = new mapboxgl.GeolocateControl({
            fitBoundsOptions: {
                maxZoom: 17.5
            },
            positionOptions: {
                enableHighAccuracy: true
            },
            showUserHeading: true,
        });
        this.mainMap.addControl( geoLocControl, 'top-right' );

        // Ajout d'un controle personnalisé "ReloadControl"
        const dummyControl = new ReloadControl();
        this.mainMap.addControl( dummyControl, 'top-right' );


        // - Initialisation des gestionnaires d'événement
        this.elForm.addEventListener( 'submit', this.handlerSubmitNew.bind(this) );
        this.elNewTitle.addEventListener( 'focus', this.handlerRemoveError.bind(this) );
        this.elNewContent.addEventListener( 'focus', this.handlerRemoveError.bind(this) );
        this.elNewDateStart.addEventListener( 'focus', this.handlerRemoveError.bind(this) );
        this.elNewDateEnd.addEventListener( 'focus', this.handlerRemoveError.bind(this) );
        this.elCordLon.addEventListener( 'focus', this.handlerRemoveError.bind(this) );
        this.elCordLat.addEventListener( 'focus', this.handlerRemoveError.bind(this) );

        let itemStorage = this.eventStorage.getJSON();
        // Si le stockage n'est pas encore crée on ne pass à la suite
        if( itemStorage === null ) return;

        for ( let markerJSON of itemStorage ) this.arrMarker.push( new LocalEvent( markerJSON));

        this.render(this.arrMarker);
    }

    render(arrLocalEvent) {
        for(let itemJSON of arrLocalEvent) {
           const newLocalEvent = new LocalEvent(itemJSON);
           newLocalEvent.setMarker(this.mainMap);
        }
    }

    // Gestionnaires d'événements
    /**
     * Gestionnaire d'événements désactivation erreur d'un champ de saisie
     */
    handlerRemoveError( evt) {
        evt.target.classList.remove( 'error' );
    }

    /**
     * Gestionnaire d'événement de soumission du formulaire d'ajout
     */
    handlerSubmitNew( evt ) {
        evt.preventDefault();

        if( this.isEditing ) return;

        // Contrôle de la saisie
        let
            strTitle = this.elNewTitle.value.trim(),
            strContent = this.elNewContent.value.trim(),
            strDateCreate = this.elNewDateStart.value.trim(),
            strDateEnd = this.elNewDateEnd.value.trim(),
            strLong = this.elCordLon.value.trim(),
            strLat = this.elCordLat.value.trim();


        // Vidange du formulaire
        this.elNewTitle.value
            = this.elNewContent.value
            = this.elNewDateStart.value
            = this.elNewDateEnd.value
            = this.elCordLon.value
            = this.elCordLat.value
            = '';

        // Traitement des données
        const newEvent = {};

        newEvent.title = strTitle;
        newEvent.content = strContent;
        newEvent.dateCreate = strDateCreate;
        newEvent.dateEnd = strDateEnd;
        newEvent.longitude = strLong;
        newEvent.latitude =  strLat;

        // Enregistrement
        this.arrMarker.push( new LocalEvent(newEvent));

        // Mise à jour de l'affichage
        this.render(this.arrMarker);

        // Persistance des données
        this.eventStorage.setJSON( this.arrMarker);
    }
}

const instance = new App();

export default instance;