import React, {Component} from 'react'
import {Navbar, Nav} from 'react-bootstrap'
import {Form, FormControl, Button} from 'react-bootstrap'

class HorizontalBar extends Component {
    constructor(props){
        super(props)
        this.state = {}
    }

    componentWillMount() {

    }

    componentWillUnmount() {

    }

    render() {
        var message = <h3></h3>
        if(localStorage.getItem('user.name') != undefined){
            message = <h3>{localStorage.getItem('user.name')}</h3>
        }

        return (
            <div class='nav-bar' id='horizontal-nav'>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home">V.I.P</Navbar.Brand>
                    <Nav className="mr-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#features">Features</Nav.Link>
                    <Nav.Link href="#pricing">Pricing</Nav.Link>
                    </Nav>
                    {message}
                </Navbar>
            </div>
        );
    }
}

export default HorizontalBar;