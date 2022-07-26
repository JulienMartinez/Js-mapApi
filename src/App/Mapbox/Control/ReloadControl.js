export class ReloadControl {
    map;
    container;

    onAdd( map ) {
        this.map = map;

        this.container = document.createElement('div');
        this.container.classList.add( 'mapboxgl-ctrl', 'mapboxgl-ctrl-group');
        this.container.innerHTML = '<button type="button" class="map-control-clown"><span>🔄</span></button>';

        this.container.children[0].addEventListener( 'click', this.handlerReloadClick.bind(this) );

        return this.container;
    }

    handlerReloadClick() {
        location.reload();
    }
}