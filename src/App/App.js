import config from '../../app.config';

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
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

    // domCurrentWeather = null;

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

        // Ajout marlker avec popup
        const markerPop = new mapboxgl.Marker({
            color: '#f0c'
        });
        markerPop.setLngLat({
            lon: 2.454649789,
            lat: 42.45648974698
        });

        const popup = new mapboxgl.Popup();
        popup.setHTML('<h2>Coucou</h2><p>Hello there</p>')

        markerPop.setPopup( popup )
        markerPop.addTo( this.mainMap );

        const markerPopDiv = markerPop.getElement();
        markerPopDiv.title = 'Coucou';


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

        for ( let notaJSON of itemStorage ) this.arrMarker.push( new LocalEvent( notaJSON));

        this.render();
    }


    render() {
        // // Tri par date
        // this.arrMarker.sort( ( notaA, notaB ) => notaB.dateUpdate - notaA.dateUpdate );
        //
        // // Vidange de l'affichage actuel
        // this.elBoard.innerHTML = '';
        //
        // for( let nota of this.arrMarker ) this.elBoard.append( nota.getDOM()  );
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

    /**
     * Gestionnaire d'événement de soumission du formulaire d'ajout
     */
    handlerSubmitNew( evt ) {
        // preventDefault() empêche le comportement initial de l'événement (ici le rechargement de la page)
        evt.preventDefault();

        if( this.isEditing ) return;

        // Contrôle de la saisie
        let
            hasError = false,
            regAlphaNum = new RegExp('^[A-Za-z0-9 ]+$'),
            strTitle = this.elNewTitle.value.trim(),
            strContent = this.elNewContent.value.trim();

        // --- Traitement des erreur

        // -- Title
        // - Si la chaine est vide
        // - ou contient autre chose que des chiffres et des lettres
        // => ERREUR
        if( !regAlphaNum.test( strTitle ) ) {
            hasError = true;
            this.elNewTitle.value = '';
            this.elNewTitle.classList.add( 'error' );
        }

        // -- Content
        // Si la chaine est vide: ERREUR
        if( strContent.length <= 0 ) {
            hasError = true;
            this.elNewContent.classList.add( 'error' );
        }

        // S'il y a au moins une erreur on interrompt le traitement
        if( hasError ) return;

        // Vidange du formulaire
        this.elNewTitle.value
            = this.elNewContent.value
            = '';

        // Traitement des données
        const newEvent = {};

        newEvent.dateCreate
            = newEvent.dateUpdate
            = Date.now();
        newEvent.title = strTitle;
        newEvent.content = strContent;

        // Enregistrement
        // Array.push() permet d'insérer une valeur à fin d'un tableau
        this.arrMarker.push( new LocalEvent(newEvent ));

        // Mise à jour de l'affichage
        this.render();

        // Persistance des données
        this.eventStorage.setJSON( this.arrMarker);
    }
}

const instance = new App();

export default instance;