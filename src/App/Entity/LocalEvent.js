import mapboxgl, {Map, Popup} from "mapbox-gl";


export class LocalEvent {
    title;
    content;
    dateCreate;
    dateEnd;
    longitude;
    latitude;

    elContainer = null;
    isEditing = false;


    constructor( json) {
        this.title = json.title;
        this.content = json.content;
        this.dateCreate = json.dateCreate;
        this.dateEnd = json.dateEnd;
        this.longitude = json.longitude;
        this.latitude = json.latitude;

    }


    getDOM() {}


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