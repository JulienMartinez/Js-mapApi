import mapboxgl from "mapbox-gl";
import { LocalEvent } from './LocalEvent';

export class MapMarker {

    setMarker(map) {

        const red = '#ea0505';
        const textRed = 'Quel dommage ! Vous avez raté cet événement !';
        const orange = '#ff8800';
        const green = '#15ea02';
        let color = orange;
        let text = 'Attention, commence dans quelques jours !';
        const end = new Date(LocalEvent.dateEnd).getTime();
        const now = (new Date).getTime();

        if(end > (now + (3 * 24 * 60 * 60 * 1000))) {
            color = green;
            text = '';

        } else if(end < now) {
            color = red;
            text = textRed;
        }

        const marker = new mapboxgl.Marker({color: color});
        marker.setLngLat({lon: this.longitude, lat: this.latitude});
        marker.addTo(map);
        console.log(marker);

        const markerDiv = marker.getElement();
        markerDiv.title = 'Titre : ' + this.title + '\n';
        markerDiv.title += 'Date de début : ' + this.dateCreate + '\n';
        markerDiv.title += 'Date de fin : ' + this.dateEnd + '\n';

        marker.setPopup(new mapboxgl.Popup().setHTML(
            'Nom : ' + this.title +'<br/>'+
            'Description : ' + this.content +'<br/>'+
            'Date de début : ' + this.dateCreate +'<br/>'+
            'Date de fin : ' + this.dateEnd +'<br/>'+
            'Message : ' + text
        ))
    }
}