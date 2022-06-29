import mapboxgl, {Map, Popup} from "mapbox-gl";

export class LocalEvent {
    title;
    content;
    dateCreate;
    dateEnd;
    longitude;
    latitude;

    constructor( json) {
        this.title = json.title;
        this.content = json.content;
        this.dateCreate = json.dateCreate;
        this.dateEnd = json.dateEnd;
        this.longitude = json.longitude;
        this.latitude = json.latitude;
    }

    setMarker(map) {

        const red = '#ea0505';
        const textRed = 'Quel dommage ! Vous avez raté cet événement !';
        const orange = '#ff8800';
        const green = '#15ea02';
        let color = orange;
        let text = 'Attention, commence dans quelques jours !';
        const end = new Date(this.dateEnd).getTime();
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

    toJSON() {

        return {
            title: this.title,
            content: this.content,
            dateCreate: this.dateCreate,
            dateEnd: this.dateEnd,
            longitude: this.longitude,
            latitude: this.latitude,
        }
    }
}