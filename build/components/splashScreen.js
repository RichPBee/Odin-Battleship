"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplashScreen = void 0;
class SplashScreen {
    get Dialog() { return this._dialog; }
    ;
    constructor(document, parent, context) {
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
    open() {
        this._parent.appendChild(this._dim);
        this._dim.appendChild(this._dialog);
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => this._button.onclick = () => resolve());
        });
    }
    createComponents() {
        this._button = this._document.createElement('button');
        this._button.setAttribute('class', 'dialogButton');
        this._dialog.appendChild(this._text);
        this._dialog.appendChild(this._button);
        this._button.innerText = 'OK';
        const click = () => {
            this.removeDialog();
        };
        this._button.addEventListener('click', click);
    }
    removeDialog() {
        this._parent.removeChild(this._dim);
    }
}
exports.SplashScreen = SplashScreen;
//# sourceMappingURL=splashScreen.js.map