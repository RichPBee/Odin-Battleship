import { GameContext } from "../Game";

export class SplashScreen
{
    private _document: Document;
    private _button: HTMLButtonElement;
    private _dim: HTMLElement;
    private _text: HTMLElement;

    private _dialog: HTMLElement;
    get Dialog() { return this._dialog};

    private _parent: HTMLElement;

    constructor(document: Document, parent: HTMLElement, context: GameContext)
    {
        this._dialog = document.createElement('div');
        this._dialog.setAttribute('class', 'dialogBox');
        this._dim = document.createElement('div');
        this._dim.setAttribute('class', 'dim');
        this._text = document.createElement('h3');
        const player = context.GameManager.CurrentPlayer;
        this._text.innerText = `Switch to player: ${player.Name}`;

        this._document = document;
        this._parent = parent;
        this.createComponents();
        this.open();
    }

    public open()
    {
        this._parent.appendChild(this._dim);
        this._dim.appendChild(this._dialog);
    }

    public async close(): Promise<void>
    {
        return new Promise(resolve => this._button.onclick = () => resolve());
    }

    private createComponents()
    {
        this._button = this._document.createElement('button');
        this._button.setAttribute('class', 'dialogButton');
        this._dialog.appendChild(this._text);
        this._dialog.appendChild(this._button);
        this._button.innerText = 'OK';
        const click = () => { 
            this.removeDialog();
        }

        this._button.addEventListener('click', click);
    }

    private removeDialog()
    {
        this._parent.removeChild(this._dim);
    }
}