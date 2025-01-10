(()=>{"use strict";var e={882:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.GameContext=t.Game=void 0;const r=i(634),a=i(794);t.Game=class{constructor(e,t,i,r){this._document=e,this._boardSize=t,this._playerOne=i,this._playerTwo=r,this.createComponents()}createComponents(){this._context=new s(this._playerOne,this._playerTwo,this._document,this._boardSize)}};class s{get GameManager(){return this._gameManager}get UIManager(){return this._uiManager}constructor(e,t,i,s){this._gameManager=new r.GameManager(e,t,this),this._uiManager=new a.UIManager(i,s,this)}}t.GameContext=s},634:(e,t)=>{var i,r;Object.defineProperty(t,"__esModule",{value:!0}),t.GameManager=t.GameState=t.Players=void 0,function(e){e[e.One=0]="One",e[e.Two=1]="Two"}(i||(t.Players=i={})),function(e){e[e.Menu=0]="Menu",e[e.Playing=1]="Playing",e[e.Ended=2]="Ended"}(r||(t.GameState=r={}));class a{get ActiveIndex(){return this._activeIndex}get CurrentPlayer(){return this._currentPlayer}get IsTwoPlayer(){return this._isTwoPlayer}get PlayerOne(){return this._players[0]}get PlayerTwo(){return this._players[1]}constructor(e,t,a){this._players=[e,t],this._currentPlayer=e,this._activeIndex=i.One,this._currentState=r.Menu,this._context=a}switchPlayer(){const e=Number(this._activeIndex)?i.One:i.Two;this._currentPlayer=this._players[e],console.log(this._currentPlayer),this._activeIndex=e,this.playCurrentTurn()}checkForWin(){const e=Number(this._activeIndex)?i.Two:i.One;this._players[e].Gameboard.AllSunk&&console.log(`${this._currentPlayer.Name} has won the game!`)}startPlaying(){this._players[0].setupBoard(),this._players[1].setupBoard(),this.switchState(r.Playing)}switchState(e){this._currentState=e}playCurrentTurn(){if(this._currentPlayer===this.PlayerTwo&&!this._isTwoPlayer){const e=this.PlayerTwo.generateRandomPosition(this.PlayerOne);this._context.UIManager.clickBoardSquare(e)}}}t.GameManager=a,e.exports={GameManager:a}},677:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Gameboard=void 0;class i{get NumShips(){return this._ships.length}get OccupiedPositions(){return this._occupiedPositions}get AllSunk(){return this._allSunk}constructor(e=10){this._ships=[],this._hitPositions=[],this._missedPositions=[],this._occupiedPositions=[],this.generateGrid(e)}placeShip(e,t,i=!0){const{x:r,y:a}=t;if(!this.canPlaceInPosition(e.Length,t,i))return!1;for(let t=0;t<e.Length;t++)i?(this._grid[r+t][a]=e,this._occupiedPositions.push({x:r+t,y:a})):(this._grid[r][a+t]=e,this._occupiedPositions.push({x:r,y:a+t}));return this._ships.push(e),!0}receiveAttack(e){const t=this.checkPosition(e);return t?(t.hit(),this.addHitAttack(e),this.checkAllSunk(t),!0):(this.addMissedAttack(e),!1)}isPositionHit(e,t){return t?this.checkArrayForHit(e,this._missedPositions):this.checkArrayForHit(e,this._hitPositions)}checkArrayForHit(e,t){return null!=t.find((t=>t.x===e.x&&t.y===e.y))}checkPosition(e){const{x:t,y:i}=e;return this._grid[t][i]}generateGrid(e){this._grid=[];for(let t=0;t<e;t++)for(let i=0;i<e;i++)this._grid[i]||(this._grid[i]=[]),this._grid[i][t]=null}canPlaceInPosition(e,t,i){if(this.hasOverlap(e,t,i))return!1;const{x:r,y:a}=t,s=r+e<=this._grid.length&&r>=0,o=a+e<=this._grid[0].length&&a>=0;return i?s:o}addMissedAttack(e){this.isPositionHit(e,!0)||this._missedPositions.push(e)}addHitAttack(e){this.isPositionHit(e,!1)||this._hitPositions.push(e)}checkAllSunk(e){e.isSunk()&&(this._allSunk=this._ships.every((e=>e.isSunk())))}hasOverlap(e,t,i){const{x:r,y:a}=t;let s=!1;for(let t=0;t<e;t++)if(i){const e={x:r+t,y:a};if(s=null!=this._occupiedPositions.find((t=>t.x===e.x&&t.y===e.y)),s)return!0}else{const e={x:r,y:a+t};if(s=null!=this._occupiedPositions.find((t=>t.x===e.x&&t.y===e.y)),s)return!0}return!1}}t.Gameboard=i,e.exports={Gameboard:i}},790:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Computer=t.Player=void 0;const r=i(677),a=i(653);class s{get Gameboard(){return this._gameboard}get Name(){return this._name}constructor(e=10,t="Player"){this._gameboard=new r.Gameboard(e),this._availableShips=[],this._name=t,this.setupShips()}setupBoard(){for(const e of this._availableShips)this.placeShipAuto(e)}setupShips(){const e=new a.Ship(5,"Carrier"),t=new a.Ship(4,"Battleship"),i=new a.Ship(3,"Destroyer"),r=new a.Ship(3,"Submarine"),s=new a.Ship(2,"Patrol Boat");this._availableShips=[e,t,i,r,s]}placeShipAuto(e){const t={x:Math.floor(10*Math.random()),y:Math.floor(10*Math.random())},i=2*Math.random()>1;this._gameboard.placeShip(e,t,i)||this.placeShipAuto(e)}}t.Player=s,t.Computer=class extends s{constructor(e,t="Computer"){super(e,t)}generateRandomPosition(e){const t={x:Math.floor(10*Math.random()),y:Math.floor(10*Math.random())};return console.log(t),e.Gameboard.isPositionHit(t,!0)||e.Gameboard.isPositionHit(t,!1)?this.generateRandomPosition(e):t}placeShipAuto(e){super.placeShipAuto(e)}}},653:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Ship=void 0;class i{get Name(){return this._name}get Length(){return this._length}get NumHits(){return this._numHits}constructor(e,t="ship"){this._length=e,this._numHits=0,this._sunk=!1,this._name=t}hit(){this._numHits++,this._sunk=this._numHits>=this._length}isSunk(){return this._sunk}}t.Ship=i,e.exports={Ship:i}},794:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UIManager=void 0,t.UIManager=class{constructor(e,t=10,i){this._document=e,this._boardSize=t,this._main=e.getElementById("main"),this._playerOneSquares=[],this._playerTwoSquares=[],this._dummySquaresOne=[],this._dummySquaresTwo=[],this._context=i,this.createComponents()}createComponents(){this.createBoardSections(),this.createBoardSquares(),this.createBottomSection()}createBoardSections(){this._boardSection=document.createElement("div"),this._boardSection.id="boardSection",this._playerOneBoard=document.createElement("div"),this._playerOneBoard.className="gameBoard",this._playerOneBoard.id="boardOne",this._playerTwoBoard=document.createElement("div"),this._playerTwoBoard.className="gameBoard",this._playerTwoBoard.id="boardTwo",this._dummyBoardOne=document.createElement("div"),this._dummyBoardOne.className="gameBoard",this._dummyBoardTwo=document.createElement("div"),this._dummyBoardTwo.className="gameBoard",this._main.appendChild(this._boardSection)}createBoardSquares(){for(let e=0;e<this._boardSize;e++)for(let t=0;t<this._boardSize;t++)this._playerOneSquares[t]||this._playerTwoSquares[t]||(this._playerOneSquares[t]=[],this._playerTwoSquares[t]=[]),this._dummySquaresOne[t]||this._dummySquaresTwo[t]||(this._dummySquaresOne[t]=[],this._dummySquaresTwo[t]=[]),this.createMainSquare(t,e),this.createDummySquare(t,e);this._playerOneBoard.setAttribute("style",`grid-template-columns: repeat(${this._boardSize}, 1fr)`),this._playerTwoBoard.setAttribute("style",`grid-template-columns: repeat(${this._boardSize}, 1fr)`),this._dummyBoardOne.setAttribute("style",`grid-template-columns: repeat(${this._boardSize}, 1fr)`),this._dummyBoardTwo.setAttribute("style",`grid-template-columns: repeat(${this._boardSize}, 1fr)`),this._boardSection.appendChild(this._playerOneBoard),this._boardSection.appendChild(this._dummyBoardTwo)}createBottomSection(){const e=document.createElement("div"),t=document.createElement("button");t.innerText="Start",t.addEventListener("click",(()=>{this._context.GameManager.startPlaying(),t.disabled=!0,this.colourSquares()})),e.appendChild(t),this._main.appendChild(e)}colourSquares(){const{PlayerOne:e,PlayerTwo:t}=this._context.GameManager;for(const t of e.Gameboard.OccupiedPositions)this._playerOneSquares[t.x][t.y].setAttribute("style","background-color: black");for(const e of t.Gameboard.OccupiedPositions)this._playerTwoSquares[e.x][e.y].setAttribute("style","background-color: black")}clickBoardSquare(e){const t=this._context.GameManager;let i,r,a=!1;0===t.ActiveIndex?(a=t.PlayerTwo.Gameboard.receiveAttack(e),i=this._playerTwoSquares[e.x][e.y],r=this._dummySquaresTwo[e.x][e.y]):(a=t.PlayerOne.Gameboard.receiveAttack(e),i=this._playerOneSquares[e.x][e.y],r=this._dummySquaresOne[e.x][e.y]),this.changeSquareColour(a,i,r),t.checkForWin(),t.switchPlayer(),this._context.GameManager.IsTwoPlayer&&this.switchPlayer(t.ActiveIndex)}changeSquareColour(e,t,i){const r=e?"green":"red";t.setAttribute("style",`background-color: ${r}`),t.removeEventListener("click",this.clickBoardSquare),i.setAttribute("style",`background-color: ${r}`),i.removeEventListener("click",this.clickBoardSquare)}switchPlayer(e){if(1===e)return this._boardSection.replaceChild(this._dummyBoardOne,this._playerOneBoard),void this._boardSection.replaceChild(this._playerTwoBoard,this._dummyBoardTwo);this._boardSection.replaceChild(this._dummyBoardTwo,this._playerTwoBoard),this._boardSection.replaceChild(this._playerOneBoard,this._dummyBoardOne)}createMainSquare(e,t){const i=document.createElement("div"),r=document.createElement("div");i.className=r.className="boardSquare",i.id=`PlayerOne-Square0${e}-${t}`,r.id=`playerTwo-Square-${e}-${t}`,this._playerOneSquares[e][t]=i,this._playerTwoSquares[e][t]=r,this._playerOneBoard.appendChild(i),this._playerTwoBoard.appendChild(r)}createDummySquare(e,t){const i=document.createElement("div");i.className="boardSquare",this._dummyBoardOne.appendChild(i),this._dummySquaresOne[e][t]=i;const r=document.createElement("div");r.className="boardSquare",this._dummyBoardTwo.appendChild(r),this._dummySquaresTwo[e][t]=r,i.addEventListener("click",(()=>{0!==this._context.GameManager.ActiveIndex&&this.clickBoardSquare({x:e,y:t})})),r.addEventListener("click",(()=>{1!==this._context.GameManager.ActiveIndex&&this.clickBoardSquare({x:e,y:t})}))}}}},t={};function i(r){var a=t[r];if(void 0!==a)return a.exports;var s=t[r]={exports:{}};return e[r](s,s.exports,i),s.exports}(()=>{const e=i(790),t=i(882),r=(document.getElementById("main"),new e.Player(10)),a=new e.Computer(10);new t.Game(document,10,r,a)})()})();