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

    getDOM() {
        /*
        MODELE HTML D'UN NOTA
        <li class="nota">
            <div class="inner">
                <div class="top-bar">
                    <div class="info">
                        <div class="nota-datetime">09/03/2022 - 15:18:25</div>
                        <div class="nota-title">Toto à la plage</div>
                    </div>
                    <div class="cmd-bar">
                        <button type="button" class="btn nota-save hidden">💾</button>
                        <button type="button" class="btn nota-edit">✏️</button>
                        <button type="button" class="btn nota-delete">🗑️</button>
                    </div>
                </div>
                <div class="content-bar">
                    <div class="nota-content">BLA BLA BLA BLA</div>
                </div>
            </div>
        </li>
        */

        // <li class="nota">
        this.elContainer = document.createElement( 'li' );

        let
            strDOM = '',
            date = new Date(this.dateUpdate),
            strDatetime = date.toLocaleString();

        // Construction du DOM à l'intérieur de elNota
        strDOM += '<div class="inner">';
        strDOM +=       '<div class="top-bar">';
        strDOM +=           '<div class="info">';
        strDOM +=               `<div class="nota-datetime">${strDatetime}</div>`;
        strDOM +=               `<div class="nota-title" data-editable>${this.title}</div>`;
        strDOM +=           '</div>';
        strDOM +=           '<div class="cmd-bar">';
        strDOM +=               '<button type="button" data-role="save" class="btn nota-save hidden">💾</button>';
        strDOM +=               '<button type="button" data-role="edit" class="btn nota-edit">✏️</button>';
        strDOM +=               '<button type="button" data-role="delete" class="btn nota-delete">🗑️</button>';
        strDOM +=           '</div>';
        strDOM +=       '</div>';
        strDOM +=       '<div class="content-bar">';
        strDOM +=           `<div class="nota-content" data-editable>${this.content}</div>`;
        strDOM +=       '</div>';
        strDOM += '</div>';

        // <li class="nota">
        this.elContainer.classList.add( 'nota' );
        this.elContainer.innerHTML = strDOM;
        this.elContainer.addEventListener( 'click', this.handlerNota.bind(this) );

        return this.elContainer;
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

    handlerNota( evt ) {
        const
            role = evt.target.dataset.role,
            arrEditable = this.elContainer.querySelectorAll( '[data-editable]' ),
            elTitle = this.elContainer.querySelector( '.nota-title' ),
            elContent = this.elContainer.querySelector( '.nota-content' ),
            elEdit = this.elContainer.querySelector( '.nota-edit' ),
            elDelete = this.elContainer.querySelector( '.nota-delete' ),
            elSave = this.elContainer.querySelector( '.nota-save' );

        switch( role ) {
            case 'edit':
                if( this.isEditing ) return;

                this.isEditing = true;
                document.dispatchEvent( new CustomEvent('notaEdit', { detail: { nota: this }}))

                elEdit.classList.add( 'hidden' );
                elDelete.classList.add( 'hidden' );
                elSave.classList.remove( 'hidden' );

                for( let el of arrEditable ) {
                    el.classList.add( 'form-control' );
                    el.contentEditable = true;
                }
                break;

            case 'save':
                this.isEditing = false;

                elEdit.classList.remove( 'hidden' );
                elDelete.classList.remove( 'hidden' );
                elSave.classList.add( 'hidden' );

                for( let el of arrEditable ) {
                    el.classList.remove( 'form-control' );
                    el.contentEditable = false;
                }

                this.title = elTitle.textContent;
                this.content = elContent.textContent;
                this.dateUpdate = Date.now();


                document.dispatchEvent( new CustomEvent('notaSave', { detail: { nota: this }}))
                break;

            case 'delete':
                if( this.isEditing ) return;

                document.dispatchEvent( new CustomEvent('notaDelete', { detail: { nota: this }}))
                break;

            default:
                return;
        }
    };

}