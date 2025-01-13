(()=>{"use strict";var e={882:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.GameContext=t.Game=void 0;const s=i(634),r=i(794);t.Game=class{constructor(e,t,i,s){this._document=e,this._boardSize=t,this._playerOne=i,this._playerTwo=s,this.createComponents()}createComponents(){this._context=new a(this._playerOne,this._playerTwo,this._document,this._boardSize)}};class a{get GameManager(){return this._gameManager}get UIManager(){return this._uiManager}constructor(e,t,i,a){this._gameManager=new s.GameManager(e,t,this),this._uiManager=new r.UIManager(i,a,this)}}t.GameContext=a},634:function(e,t){var i,s,r=this&&this.__awaiter||function(e,t,i,s){return new(i||(i=Promise))((function(r,a){function n(e){try{h(s.next(e))}catch(e){a(e)}}function o(e){try{h(s.throw(e))}catch(e){a(e)}}function h(e){var t;e.done?r(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(n,o)}h((s=s.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.GameManager=t.GameState=t.Players=void 0,function(e){e[e.One=0]="One",e[e.Two=1]="Two"}(i||(t.Players=i={})),function(e){e[e.Menu=0]="Menu",e[e.Setup=1]="Setup",e[e.Playing=2]="Playing",e[e.Ended=3]="Ended"}(s||(t.GameState=s={}));class a{get ActiveIndex(){return this._activeIndex}get CurrentPlayer(){return this._currentPlayer}get GameState(){return this._currentState}get IsTwoPlayer(){return this._isTwoPlayer}get IsComputerOnly(){return this._isComputerOnly}get PlayerOne(){return this._players[0]}get PlayerTwo(){return this._players[1]}get NumPlacedShips(){return this._numPlacedShips}set NumPlacedShips(e){this._numPlacedShips=e}constructor(e,t,r){this._players=[e,t],this._currentPlayer=e,this._activeIndex=i.One,this._currentState=s.Menu,this._context=r,this._numPlacedShips=0,this._isTwoPlayer=!1}switchPlayer(){const e=Number(this._activeIndex)?i.One:i.Two;this._currentPlayer=this._players[e],this._activeIndex=e,this.GameState===s.Playing&&this.playCurrentTurn()}checkForWin(e){const t=e===i.One?this.PlayerOne:this.PlayerTwo;(e===i.One?this.PlayerTwo:this.PlayerOne).Gameboard.AllSunk&&(console.log(`${t.Name} has won the game!`),this._context.UIManager.disableBoardUI(),this._context.UIManager.removeHoverable(!0))}placeShip(e,t){const i=this._currentPlayer.AvailableShips[0];this._currentPlayer.placeShip(i,e,t)&&this._numPlacedShips++}startSetup(){return r(this,void 0,void 0,(function*(){this.switchState(s.Setup),this._isComputerOnly&&(this._players[0].setupBoard(),this._players[1].setupBoard(),this._numPlacedShips=this.PlayerOne.Gameboard.NumShips+this.PlayerTwo.Gameboard.NumShips,this.switchPlayer(),this.startPlaying())}))}checkSetup(){if(5===this._numPlacedShips){if(this.switchPlayer(),!this._isTwoPlayer)return this.PlayerTwo.setupBoard(),this.startPlaying(),this.switchPlayer(),void this._context.UIManager.removeHoverable();setTimeout((()=>{this._context.UIManager.switchPlayer(this.ActiveIndex)}),300)}else 10===this._numPlacedShips&&(this.switchPlayer(),setTimeout((()=>{this._context.UIManager.switchPlayer(this.ActiveIndex)}),300),this._context.UIManager.removeHoverable(),this.startPlaying())}startPlaying(){this.switchState(s.Playing)}switchState(e){this._currentState=e}reset(){this.PlayerOne.reset(),this.PlayerTwo.reset()}playCurrentTurn(){if(this._currentPlayer===this.PlayerTwo&&!this._isTwoPlayer){const e=this.PlayerTwo.generateRandomPosition(this.PlayerOne);setTimeout((()=>this._context.UIManager.clickBoardSquare(e)),300)}}}t.GameManager=a,e.exports={GameManager:a}},677:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Gameboard=void 0;class i{get NumShips(){return this._ships.length}get OccupiedPositions(){return this._occupiedPositions}get AllSunk(){return this._allSunk}constructor(e=10){this._ships=[],this._hitPositions=[],this._missedPositions=[],this._occupiedPositions=[],this._size=e,this.generateGrid(e)}placeShip(e,t,i=!0){const{x:s,y:r}=t;if(!this.canPlaceInPosition(e.Length,t,i))return!1;for(let t=0;t<e.Length;t++)i?(this._grid[s+t][r]=e,this._occupiedPositions.push({x:s+t,y:r})):(this._grid[s][r+t]=e,this._occupiedPositions.push({x:s,y:r+t}));return this._ships.push(e),!0}receiveAttack(e){const t=this.checkPosition(e);return t?(t.hit(),this.addHitAttack(e),this.checkAllSunk(t),!0):(this.addMissedAttack(e),!1)}isPositionHit(e,t){return t?this.checkArrayForHit(e,this._missedPositions):this.checkArrayForHit(e,this._hitPositions)}reset(){this._ships=[],this._hitPositions=[],this._missedPositions=[],this._occupiedPositions=[],this.generateGrid(this._size)}checkArrayForHit(e,t){return null!=t.find((t=>t.x===e.x&&t.y===e.y))}checkPosition(e){const{x:t,y:i}=e;return this._grid[t][i]}generateGrid(e){this._grid=[];for(let t=0;t<e;t++)for(let i=0;i<e;i++)this._grid[i]||(this._grid[i]=[]),this._grid[i][t]=null}canPlaceInPosition(e,t,i){if(this.hasOverlap(e,t,i))return!1;const{x:s,y:r}=t,a=s+e<=this._grid.length&&s>=0,n=r+e<=this._grid[0].length&&r>=0;return i?a:n}addMissedAttack(e){this.isPositionHit(e,!0)||this._missedPositions.push(e)}addHitAttack(e){this.isPositionHit(e,!1)||this._hitPositions.push(e)}checkAllSunk(e){e.isSunk()&&(this._allSunk=this._ships.every((e=>e.isSunk())))}hasOverlap(e,t,i){const{x:s,y:r}=t;let a=!1;for(let t=0;t<e;t++)if(i){const e={x:s+t,y:r};if(a=null!=this._occupiedPositions.find((t=>t.x===e.x&&t.y===e.y)),a)return!0}else{const e={x:s,y:r+t};if(a=null!=this._occupiedPositions.find((t=>t.x===e.x&&t.y===e.y)),a)return!0}return!1}}t.Gameboard=i,e.exports={Gameboard:i}},790:function(e,t,i){var s=this&&this.__awaiter||function(e,t,i,s){return new(i||(i=Promise))((function(r,a){function n(e){try{h(s.next(e))}catch(e){a(e)}}function o(e){try{h(s.throw(e))}catch(e){a(e)}}function h(e){var t;e.done?r(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(n,o)}h((s=s.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.Computer=t.Player=void 0;const r=i(677),a=i(653);class n{get Gameboard(){return this._gameboard}get AvailableShips(){return this._availableShips}get Name(){return this._name}constructor(e=10,t="Player"){this._gameboard=new r.Gameboard(e),this._availableShips=[],this._name=t,this._isComputerPlayer=!1,this.setupShips()}reset(){this._gameboard.reset(),this.setupShips()}setupBoard(){return s(this,void 0,void 0,(function*(){for(const e of this._availableShips)this.placeShipAuto(e)}))}setupShips(){const e=new a.Ship(5,"Carrier"),t=new a.Ship(4,"Battleship"),i=new a.Ship(3,"Destroyer"),s=new a.Ship(3,"Submarine"),r=new a.Ship(2,"Patrol Boat");this._availableShips=[e,t,i,s,r]}placeShipAuto(e){const t={x:Math.floor(10*Math.random()),y:Math.floor(10*Math.random())},i=2*Math.random()>1;this._gameboard.placeShip(e,t,i)||this.placeShipAuto(e)}placeShip(e,t,i){return!!this._gameboard.placeShip(e,t,i)&&(this._availableShips.shift(),!0)}}t.Player=n,t.Computer=class extends n{constructor(e,t="Computer"){super(e,t),this._isComputerPlayer=!0}generateRandomPosition(e){const t={x:Math.floor(10*Math.random()),y:Math.floor(10*Math.random())};return e.Gameboard.isPositionHit(t,!0)||e.Gameboard.isPositionHit(t,!1)?this.generateRandomPosition(e):t}placeShipAuto(e){super.placeShipAuto(e)}}},653:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Ship=void 0;class i{get Name(){return this._name}get Length(){return this._length}get NumHits(){return this._numHits}constructor(e,t="ship"){this._length=e,this._numHits=0,this._sunk=!1,this._name=t}hit(){this._numHits++,this._sunk=this._numHits>=this._length}isSunk(){return this._sunk}}t.Ship=i,e.exports={Ship:i}},794:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UIManager=void 0,t.UIManager=class{constructor(e,t=10,i){this._document=e,this._boardSize=t,this._main=e.getElementById("main"),this._playerOneSquares=[],this._playerTwoSquares=[],this._dummySquaresOne=[],this._dummySquaresTwo=[],this._squareListeners={},this._context=i,this._isHorizontal=!0,this.createComponents()}createComponents(){this.createTopSection(),this.createBoardSections(),this.createBoardSquares(),this.createBottomSection()}createBoardSections(){this._boardSection=document.createElement("div"),this._boardSection.id="boardSection",this._playerOneBoard=document.createElement("div"),this._playerOneBoard.className="gameBoard",this._playerOneBoard.id="boardOne",this._playerTwoBoard=document.createElement("div"),this._playerTwoBoard.className="gameBoard",this._playerTwoBoard.id="boardTwo",this._dummyBoardOne=document.createElement("div"),this._dummyBoardOne.className="gameBoard",this._dummyBoardTwo=document.createElement("div"),this._dummyBoardTwo.className="gameBoard",this._main.appendChild(this._boardSection)}createBoardSquares(){for(let e=0;e<this._boardSize;e++)for(let t=0;t<this._boardSize;t++)this._playerOneSquares[t]||this._playerTwoSquares[t]||(this._playerOneSquares[t]=[],this._playerTwoSquares[t]=[]),this._dummySquaresOne[t]||this._dummySquaresTwo[t]||(this._dummySquaresOne[t]=[],this._dummySquaresTwo[t]=[]),this.createMainSquare(t,e),this.createDummySquare(t,e);this._playerOneBoard.setAttribute("style",`grid-template-columns: repeat(${this._boardSize}, 1fr)`),this._playerTwoBoard.setAttribute("style",`grid-template-columns: repeat(${this._boardSize}, 1fr)`),this._dummyBoardOne.setAttribute("style",`grid-template-columns: repeat(${this._boardSize}, 1fr)`),this._dummyBoardTwo.setAttribute("style",`grid-template-columns: repeat(${this._boardSize}, 1fr)`),this._boardSection.appendChild(this._playerOneBoard),this._boardSection.appendChild(this._dummyBoardTwo)}createBottomSection(){const e=document.createElement("div"),t=document.createElement("button");t.innerText="Start";const i=document.createElement("button");i.innerText="Reset",t.addEventListener("click",(()=>{this._context.GameManager.startSetup(),t.disabled=!0,this.colourSquares(),this.enableUI()})),i.addEventListener("click",(()=>{this._context.GameManager.reset(),this.resetSquares(),t.disabled=!1})),e.appendChild(t),e.appendChild(i),this._main.appendChild(e)}colourSquares(){const{PlayerOne:e,PlayerTwo:t}=this._context.GameManager;for(const t of e.Gameboard.OccupiedPositions){const e=this._playerOneSquares[t.x][t.y];e.setAttribute("style","background-color: black"),e.classList.remove("hoverableSquare")}for(const e of t.Gameboard.OccupiedPositions){const t=this._playerTwoSquares[e.x][e.y];t.setAttribute("style","background-color: black"),t.classList.remove("hoverableSquare")}}resetSquares(){this.disableBoardUI();for(let e=0;e<this._boardSize;e++)for(let t=0;t<this._boardSize;t++)this._playerOneSquares[t][e].setAttribute("style","background-color: transparent"),this._playerTwoSquares[t][e].setAttribute("style","background-color: transparent"),this._dummySquaresOne[t][e].setAttribute("style","background-color: transparent"),this._dummySquaresTwo[t][e].setAttribute("style","background-color: transparent"),this.applyListeners(this._dummySquaresOne[t][e],this._dummySquaresTwo[t][e],{x:t,y:e})}clickBoardSquare(e){const t=this._context.GameManager;let i,s,r=!1;0===t.ActiveIndex?(r=t.PlayerTwo.Gameboard.receiveAttack(e),i=this._playerTwoSquares[e.x][e.y],s=this._dummySquaresTwo[e.x][e.y]):(r=t.PlayerOne.Gameboard.receiveAttack(e),i=this._playerOneSquares[e.x][e.y],s=this._dummySquaresOne[e.x][e.y]),this.changeSquareColour(r,i,s),t.checkForWin(t.ActiveIndex),t.switchPlayer(),this._context.GameManager.IsTwoPlayer&&this.switchPlayer(t.ActiveIndex)}enableUI(){for(let e=0;e<this._boardSize;e++)for(let t=0;t<this._boardSize;t++)this.applyListeners(this._dummySquaresOne[t][e],this._dummySquaresTwo[t][e],{x:t,y:e})}disableBoardUI(){for(let e=0;e<this._boardSize;e++)for(let t=0;t<this._boardSize;t++)this._squareListeners[this.getListenerKey({x:t,y:e})]&&(this._dummySquaresOne[t][e].removeEventListener("click",this._squareListeners[this.getListenerKey({x:t,y:e})]),delete this._squareListeners[this.getListenerKey({x:t,y:e})]),this._squareListeners[this.getListenerKey({x:t,y:e},!1)]&&(this._dummySquaresTwo[t][e].removeEventListener("click",this._squareListeners[this.getListenerKey({x:t,y:e},!1)]),delete this._squareListeners[this.getListenerKey({x:t,y:e},!1)])}changeSquareColour(e,t,i){const s=e?"green":"red";t.setAttribute("style",`background-color: ${s}`),t.removeEventListener("click",this.clickBoardSquare),i.setAttribute("style",`background-color: ${s}`),i.removeEventListener("click",this.clickBoardSquare)}switchPlayer(e){if(1===e)return this._boardSection.replaceChild(this._dummyBoardOne,this._playerOneBoard),void this._boardSection.replaceChild(this._playerTwoBoard,this._dummyBoardTwo);this._boardSection.replaceChild(this._dummyBoardTwo,this._playerTwoBoard),this._boardSection.replaceChild(this._playerOneBoard,this._dummyBoardOne)}removeHoverable(e=!1){if(e)for(let e=0;e<this._boardSize;e++)for(let t=0;t<this._boardSize;t++)this._dummySquaresOne[t][e].classList.remove("hoverableSquare"),this._dummySquaresTwo[t][e].classList.remove("hoverableSquare");for(let e=0;e<this._boardSize;e++)for(let t=0;t<this._boardSize;t++)this._playerOneSquares[t][e].classList.remove("hoverableSquare"),this._playerTwoSquares[t][e].classList.remove("hoverableSquare")}createMainSquare(e,t){const i=document.createElement("div"),s=document.createElement("div");i.className=s.className="boardSquare",i.id=`PlayerOne-Square0${e}-${t}`,s.id=`playerTwo-Square-${e}-${t}`,this._playerOneSquares[e][t]=i,this._playerTwoSquares[e][t]=s,this._playerOneBoard.appendChild(i),this._playerTwoBoard.appendChild(s);const r=()=>{1===this._context.GameManager.GameState&&(this._context.GameManager.placeShip({x:e,y:t},this._isHorizontal),this._context.GameManager.checkSetup(),this.colourSquares())};i.addEventListener("click",r),s.addEventListener("click",r),i.classList.add("hoverableSquare"),s.classList.add("hoverableSquare")}createDummySquare(e,t){const i=document.createElement("div");i.className="boardSquare",this._dummyBoardOne.appendChild(i),this._dummySquaresOne[e][t]=i;const s=document.createElement("div");s.className="boardSquare",this._dummyBoardTwo.appendChild(s),this._dummySquaresTwo[e][t]=s}getListenerKey(e,t=!0){return t?`board-square-${e.x}-${e.y}`:`board-square-two-${e.x}-${e.y}`}applyListeners(e,t,i){const s=()=>{0!==this._context.GameManager.ActiveIndex&&2===this._context.GameManager.GameState&&(this.clickBoardSquare(i),e.removeEventListener("click",s),delete this._squareListeners[this.getListenerKey(i)])},r=()=>{1!==this._context.GameManager.ActiveIndex&&2===this._context.GameManager.GameState&&(this.clickBoardSquare(i),t.removeEventListener("click",r),delete this._squareListeners[this.getListenerKey(i,!1)])};this._squareListeners[this.getListenerKey(i)]=s,this._squareListeners[this.getListenerKey(i,!1)]=r,e.addEventListener("click",s),t.addEventListener("click",r),e.classList.add("hoverableSquare"),t.classList.add("hoverableSquare")}createTopSection(){this._topSection=document.createElement("div");const e=document.createElement("button");e.innerText="Horizontal",e.addEventListener("click",(()=>{this._isHorizontal=!this._isHorizontal;const t=this._isHorizontal?"Horizontal":"Vertical";e.innerText=t})),this._topSection.appendChild(e),this._main.appendChild(this._topSection)}}}},t={};function i(s){var r=t[s];if(void 0!==r)return r.exports;var a=t[s]={exports:{}};return e[s].call(a.exports,a,a.exports,i),a.exports}(()=>{const e=i(790),t=i(882),s=(document.getElementById("main"),new e.Player(10)),r=new e.Computer(10);new t.Game(document,10,s,r)})()})();