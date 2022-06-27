import config from '../../app.config';

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, {Map, Marker} from 'mapbox-gl';
import { LocalEvent } from './Entity/LocalEvent'

import '../../assets/css/reset.css';
import '../../assets/css/style.css';

import { LocalStorageService } from "./Service/LocalStorageService";
// import {DummyControl} from "./Mapbox/Control/DummyControl";

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
    elBoard = null;

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
        this.elBoard = document.getElementById( 'board' );
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
            console.log( evt );
            console.log(`A click event has occurred at ${evt.lngLat}`);
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
            // trackUserLocation: true
        });
        this.mainMap.addControl( geoLocControl, 'top-right' );


        // - Initialisation des gestionnaires d'événement
        this.elForm.addEventListener( 'submit', this.handlerSubmitNew.bind(this) );
        this.elNewTitle.addEventListener( 'focus', this.handlerRemoveError.bind(this) );
        this.elNewContent.addEventListener( 'focus', this.handlerRemoveError.bind(this) );
        this.elNewDateStart.addEventListener( 'focus', this.handlerRemoveError.bind(this) );
        this.elNewDateEnd.addEventListener( 'focus', this.handlerRemoveError.bind(this) );
        this.elCordLon.addEventListener( 'click', this.handlerRemoveError.bind(this) );
        this.elCordLat.addEventListener( 'click', this.handlerRemoveError.bind(this) );

        let itemStorage = this.eventStorage.getJSON();
        // Si le stockage n'est pas encore crée on ne pass à la suite
        if( itemStorage === null ) return;

        for ( let notaJSON of itemStorage ) this.arrMarker.push( new LocalEvent( notaJSON));

        this.render(this.arrMarker);

    }

    render(arrLocalEvent) {
        for(let itemJSON of arrLocalEvent) {
            this.setMarker(itemJSON)
        }
    }

    placeMarker(position, map) {
       const markerPos = new mapboxgl.Marker({
            position: position,
            map: map
        });
        map.panTo(position);
    }

    // Gestionnaires d'événements
    /**
     * Gestionnaire d'événements désactivation erreur d'un champ de saisie
     */
    handlerRemoveError( evt) {
        evt.target.classList.remove( 'error' );
    }

    /**
     * Gestionnaire d'événement de purge des Notas
     */
    handlerBoardClear() {
        if( this.isEditing ) return;

        this.arrMarker = []; // Vidange du tableau de Notas
        this.elBoard.innerHTML = ''; // Vidange du contenu affiché de board
        this.eventStorage.clear();
    }

    setMarker(localEvent) {
        const marker = new mapboxgl.Marker();
        marker.setLngLat({lon: localEvent.longitude, lat: localEvent.latitude});
        marker.addTo(this.mainMap);

        const markerDiv = marker.getElement();
        markerDiv.title = localEvent.title

        marker.setPopup(new mapboxgl.Popup().setHTML(
            'Nom : ' + localEvent.title +'<br/>'+
            'Description : ' + localEvent.content +'<br/>'+
            'Date de début : ' + localEvent.dateCreate +'<br/>'+
            'Date de fin : ' + localEvent.dateEnd
        ))

    }


    /**
     * Gestionnaire d'événement de soumission du formulaire d'ajout
     */
    handlerSubmitNew( evt ) {
        // preventDefault() empêche le comportement initial de l'événement (ici le rechargement de la page)
        evt.preventDefault();

        if( this.isEditing ) return;

        // Contrôle de la saisie
        let
            strTitle = this.elNewTitle.value.trim(),
            strContent = this.elNewContent.value.trim(),
            strDateCreate = this.elNewDateStart.value.trim(),
            strDateEnd = this.elNewDateEnd.value.trim(),
            strLong = this.elCordLon.value.trim(),
            strlat = this.elCordLat.value.trim();


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

        newEvent.dateCreate
            = newEvent.dateUpdate
            = Date.now();
        newEvent.title = strTitle;
        newEvent.content = strContent;
        newEvent.dateCreate = strDateCreate;
        newEvent.dateEnd = strDateEnd;
        newEvent.longitude = strLong;
        newEvent.latitude =  strlat;

        this.setMarker(newEvent);

        // Enregistrement
        // Array.push() permet d'insérer une valeur à fin d'un tableau
        this.arrMarker.push( new LocalEvent(newEvent ));

        // Mise à jour de l'affichage
        this.render(this.arrMarker);

        // Persistance des données
        this.eventStorage.setJSON( this.arrMarker);

        // console.log(this.arrMarker);

        // Marker.createMarker(this.map, newEvent);
    }


}

const instance = new App();

export default instance;