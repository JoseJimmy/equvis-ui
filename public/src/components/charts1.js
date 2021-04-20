import React, {Component} from "react";
// import Navtree from "./vega/Navtree";

import Fab from '@material-ui/core/Fab';
import _ from "lodash";

import {filter, mutate, tidy} from "@tidyjs/tidy";
import {
    ButtonToolbar,
    Col,
    Container,
    Nav,
    Navbar,
    NavDropdown,
    Row,
    Spinner,
    ToggleButton,
    ToggleButtonGroup
} from "react-bootstrap";
// import PriceChart from "./vega/PriceChart";
//style={{color: "white",fontSize:35,fontWeight:"bold",fontFamily: "Playfair Display"}}


export default class Chart extends Component {
    


    render() {
        const style = {
            margin: 0,
            top: 'auto',
            right: 15,
            bottom: 20,
            left: 10,
            position: 'fixed',
            backgroundColor: 'red',
            fontSize: "18px",
            color: "white",
            fontFamily: 'Playfair Display',
            fontWeight: 'Bold'
        }

      
            return (
                <React.Fragment>
                    <nav id='menu' className='navbar navbar-default navbar-fixed-top '>
                        <div className='container'>
                            <div className='navbar-header'>
                                <a href='/' className='navbar-brand'>Equvis</a>
                            </div>
                            <div>
                                <Fab style={style} color={"inherit"} href={"/"} className="fab"><i
                                    className={"fa fa-lg fa-mail-reply"}></i></Fab>
                            </div>
                        </div>
                    </nav>
             
                     
                </React.Fragment>
            )
        }
    
}
// export default Chart;