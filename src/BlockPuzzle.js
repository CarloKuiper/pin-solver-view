import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './BlockPuzzle.css';

let dragId = null;
let dragGrid = null;
let offSetX = 0;
let offSetY = 0;
let offSetI = 0;
let offSetJ = 0;
let dragX = 0;
let dragY = 0;
// Henceforth the max amount of pieces is ten
let pieces = [true, true, true, true, true, true, true, true, true, true];

// let test;

class BlockPuzzle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boardLength: 8,
            boardHeight: 4,
            pieceObject: [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]],
            pieceDragIds: [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]],
            pieceIs: [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]],
            pieceJs: [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]],
            grid: [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]],
            pieces: null
        };

        this.greeting = this.greeting.bind(this);
    }

    componentDidMount() {
        fetch("http://localhost:8080/pin/solver")
            .then(response => response.json())
            .then(hacks => this.setState({pieces : hacks.piecesEncoding}))
    }

    handleKeyPress(event) {
        if(event.key === 'Enter'){
            // this.greeting().then(ultraHacks => this.setState({ greeting: ultraHacks.content}));
            this.greeting().then(console.info("het doet het"))
        }
    }

    async greeting() {
        const test = await fetch("http://localhost:8080/pin/solver").then(response => response.json());
        return test;
    }

    extradiv(id) {
        return (id % 4 === 0) ? '</div><div>' : ''
    }


    render() {
        return (
            <header className="App-header"
                    onMouseMove={(event) => this.mouseMoveHandler(event)}
                    onTouchMove={(event) => this.touchMoveHandler(event)}
                    onMouseUp={(event) => this.handleDragEnd(event)}
                    onTouchEnd={(event) => this.handleDragEnd(event)}>
            <div id="board" className="BlockPuzzle">
                    {this.renderBoard()}
            </div>
                {/*TODO Generate the pieces responsively!*/}
            <div className="App-default">
                {pieces.map((piece, id) => {return <Piece grid={[[0, 1], [1, 3]]} id={id} key={'piece' + id} refresh={this.refresh}/>})}
            </div>
                <Link to="/" className="App-link">Return</Link>
                <Cursor pageX={dragX} pageY={dragY}/>
            </header>
        );
    }

    refresh() {
        this.setState({})
    }

    drop(event, igrid, jgrid) {
        const piece = dragGrid;

        // Can drop piece.
        if (igrid < 0 || jgrid < 0) return;
        if (igrid + piece.length> this.state.grid.length) return;
        if (jgrid + piece[0].length> this.state.grid[0].length) return;
        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (this.state.grid[i + igrid][j + jgrid] !== 0 && piece[i][j] !== 0) return;
            }
        }

        // Drop piece.
        let grid = this.state.grid;
        let pieceObject = this.state.pieceObject;
        let pieceDragIds = this.state.pieceDragIds;
        let pieceIs = this.state.pieceIs;
        let pieceJs = this.state.pieceJs;

        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] !== 0) {
                    grid[i + igrid][j + jgrid] += piece[i][j];
                    pieceObject[i + igrid][j + jgrid] = piece;
                    pieceDragIds[i + igrid][j + jgrid] = dragId;
                    pieceIs[i + igrid][j + jgrid] = i;
                    pieceJs[i + igrid][j + jgrid] = j;
                }
            }
        }

        pieces[dragId] = false;
        dragId = null;
        offSetX = 0;
        offSetY = 0;
        offSetI = 0;
        offSetJ = 0;
        this.setState({grid: grid, pieceObject: pieceObject, pieceDragIds: pieceDragIds, pieceIs: pieceIs, pieceJs: pieceJs});
    }

    handleDragStart(event, igrid, jgrid) {
        event.preventDefault();
        let grid = this.state.grid;
        const piece = this.state.pieceObject[igrid][jgrid];
        const pieceI = this.state.pieceIs[igrid][jgrid];
        const pieceJ = this.state.pieceJs[igrid][jgrid];

        if (event.pageX) offSetX = event.pageX - document.getElementById('board').offsetLeft;
        else offSetX = event.touches[0].clientX - document.getElementById('board').offsetLeft;
        if (event.pageY) offSetY = event.pageY - document.getElementById('board').offsetTop;
        else offSetY = event.touches[0].clientY - document.getElementById('board').offsetTop;
        // TODO hier moet eigenlijk t minimum genomen worden omdat ie nu op de buitenrand niet meer wordt meegenomen
        offSetX = offSetX % 55 + 55 * pieceJ + 5;
        offSetY = offSetY % 55 + 55 * pieceI + 5;

        offSetJ = Math.floor(offSetY / 55);
        offSetI = Math.floor(offSetX / 55);

        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] !== 0) {
                    grid[i + igrid - pieceI][j + jgrid - pieceJ] = 0
                }
            }
        }
        this.setState({grid: grid});
        dragId = this.state.pieceDragIds[igrid][jgrid];
        event.touches === undefined ? this.mouseMoveHandler(event) : this.touchMoveHandler(event);
        dragGrid = piece;
    }

    mouseMoveHandler(event) {
        if (dragId === null) return;
        dragX = event.pageX - offSetX;
        dragY = event.pageY - offSetY;
        this.forceUpdate();
    }

    touchMoveHandler(event) {
        if (dragId === null) return;

        dragX = event.touches[0].clientX - offSetX;
        dragY = event.touches[0].clientY - offSetY;
        this.forceUpdate();
    }

    handleDragEnd(event) {
        if (dragId === null) return;
        let board = document.getElementById("board");
        if (board.offsetTop < dragY + offSetY < board.offsetTop + board.offsetHeight
            && board.offsetLeft < dragX + offSetX < board.offsetLeft + board.offsetWidth) {
            // TODO zelfde hier eigenlijk nog een math min zodat de buitenrand van 5px meedoet
            this.drop(
                event,
                Math.floor((dragY + offSetY - board.offsetTop) / 55) - offSetJ,
                Math.floor((dragX + offSetX - board.offsetLeft) / 55) - offSetI
            )
        }
        pieces[dragId] = true;
        dragId = null;
        this.forceUpdate();
    }

    renderBoard() {
        let board =[];
        for (let i = 0; i < this.state.boardHeight; i++) {
            let children = [];
            for (let j = 0; j < this.state.boardLength; j++) {
                if (this.state.grid[i][j] !== 0) {
                    children.push(
                        <div
                            key={"BoardBlock" + i + j}
                            className="Block"
                            draggable="true"
                            onMouseDown={event => this.handleDragStart(event, i, j)}
                            onTouchStart={event => this.handleDragStart(event, i, j)}
                        >
                        {this.state.grid[i][j]}
                        </div>
                    )
                } else {
                    children.push(<div key={"BoardBlock" + i + j} className="Block">{this.state.grid[i][j]}</div>)
                    // children.push(<div key={"BoardBlock" + i + j} className="Block" onMouseUp={event => this.drop(event, i, j)}>{this.state.grid[i][j]}</div>)
                }
            }
            board.push({children});
        }

        return <div onDragOver={(event) => event.preventDefault()} onDragEnd={event => this.handleDragEnd(event)}>
            {board.map((array, index) => <div key={"BoardArray" + index}>{array.children}</div>)}
        </div>;
    }
}

class Piece extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: props.grid,
            id: props.id
        };
    }

    render() {
        return this.renderPiece()
    }

    renderPiece() {
        let piece = [];
        for (let i = 0; i < this.state.grid.length; i++) {
            let children = [];
            // Inner loop to create children
            for (let j = 0; j < this.state.grid[i].length; j++) {
                if (this.state.grid[i][j] === 0) {
                    children.push(<div key={"PieceBlock" + i + j} className="BlockEmpty">{this.state.grid[i][j]}</div>)
                } else {
                    children.push(<div key={"PieceBlock" + i + j}
                                       className="Block"
                                       style={{opacity : pieces[this.state.id] ? 1 : 0.5}}
                                       onMouseDown={event => this.handleDragStart(event, this.state.id)}
                                       onTouchStart={event => this.handleDragStart(event, this.state.id)}
                                       onDragOver={(event) => event.preventDefault()} >{this.state.grid[i][j]}</div>)
                }
            }
            piece.push({children});
        }

        return <div className="Piece"
                    id={this.state.id}>
            {piece.map((array, index) => <div key={"PieceArray" + index}>{array.children}</div>)}
        </div>;
    }

    handleDragStart(event, id) {
        if (!pieces[id]) return;
        // offSetX = event.pageX - document.getElementById(id).offsetLeft;
        if (event.pageX) offSetX = event.pageX - document.getElementById(id).offsetLeft;
        else offSetX = event.touches[0].clientX - document.getElementById(id).offsetLeft;
        if (event.pageY) offSetY = event.pageY - document.getElementById(id).offsetTop;
        else offSetY = event.touches[0].clientY - document.getElementById(id).offsetTop;
        // offSetX = event.pageX == true ? event.pageX - document.getElementById(id).offsetLeft : event.touches[0].clientX - document.getElementById(id).offsetLeft;
        // offSetY = event.pageY - document.getElementById(id).offsetTop;
        // offSetY = event.pageY == true ? event.pageY - document.getElementById(id).offsetTop : event.touches[0].clientY - document.getElementById(id).offsetTop;
        // TODO hier moet eigenlijk t minimum genomen worden omdat ie nu op de buitenrand niet meer wordt meegenomen
        offSetJ = Math.floor(offSetY / 55);
        offSetI = Math.floor(offSetX / 55);
        event.preventDefault();
        dragGrid = this.state.grid;
        dragId = this.state.id;
        pieces[dragId] = false;
        this.forceUpdate();
    }
}

class Cursor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            html: props.html
        };
    }

    render() {
        if (dragId === null) return null;

        let piece = [];
        let width = dragGrid[0].length * 55;
        for (let i = 0; i < dragGrid.length; i++) {
            let children = [];
            // Inner loop to create children
            for (let j = 0; j < dragGrid[i].length; j++) {
                if (dragGrid[i][j] === 0) {
                    children.push(<div key={"PieceBlock" + i + j} className="BlockEmpty">{dragGrid[i][j]}</div>)
                } else {
                    children.push(<div key={"PieceBlock" + i + j}
                                       className="Block">{dragGrid[i][j]}</div>)
                }
            }
            piece.push({children});
        }
        return <div key="Cursor"
                    id="Cursor"
                    className="Cursor"
                    style={{left: dragX, top: dragY}}>
            <div className="Piece"
                 id="CursorPiece"
                 style={{width: width}}>
                 {piece.map((array, index) => <div key={"PieceArray" + index}>{array.children}</div>)}
            </div>
        </div>
    }
}

export default BlockPuzzle;
