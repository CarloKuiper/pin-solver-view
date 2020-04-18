import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {greeting: "", value: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                    <p>
                        {this.state.greeting}
                    </p>
                    <p>
                        <input type="text" value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleKeyPress}/>
                    </p>
                    <p>
                        <Link to="/blockpuzzle" className="App-link">Block puzzle</Link>
                    </p>
                    <div>
                        <h1>Move the mouse around!</h1>
                        <Mouse />
                    </div>
                </header>
            </div>
        );
    }

    componentDidMount() {
        this.greeting().then(hacks => this.setState({greeting: hacks.content}))
    }

    handleChange(event) {
        this.setState({value: event.target.value})
    }

    handleKeyPress(event) {
        if(event.key === 'Enter'){
            this.greet(event.target.value).then(ultraHacks => this.setState({ greeting: ultraHacks.content}));
        }
    }

    async greeting() {
        const test = await fetch("http://localhost:8080/greeting").then(response => response.json());
        return test;
    }

    async greet(param) {
        const test = await fetch("http://localhost:8080/greeting?name=" + param).then(response => response.json());
        return test;
    }
}

// The <Mouse> component encapsulates the behavior we need...
class Mouse extends React.Component {
    constructor(props) {
        super(props);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.state = { x: 0, y: 0 };
    }

    handleMouseMove(event) {
        this.setState({
            x: event.clientX,
            y: event.clientY
        });
    }

    render() {
        return (
            <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

                {/* ...but how do we render something other than a <p>? */}
                <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
            </div>
        );
    }
}

export default App;
