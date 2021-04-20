import { useState, useEffect } from 'react'
import { Component } from 'react'
import React from "react";
import Navtree from "./components/vega/Navtree";

import { Navigation } from './components/navigation'
import { Header } from './components/header'
import { Features } from './components/features'
import { Services } from './components/services'
import { Gallery } from './components/gallery'
import { Testimonials } from './components/testimonials'
import { Team } from './components/Team'
import { Contact } from './components/contact'
// import JsonData from './data/data.json'
import SmoothScroll from 'smooth-scroll'
import Fab from '@material-ui/core/Fab';
import {BrowserRouter,HashRouter,Route,Switch} from "react-router-dom"
import Chart from './components/charts1'
export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 700,
  speedAsDuration: true,
})


class App extends Component{
  constructor(props) {
    super(props);

    

  }


  render(){

    const style = {
      margin: 10,
      top:'auto' ,
      right: -25,
      bottom: 70,
      left: 'auto',
      position: 'fixed',
      backgroundColor:'red',
      fontSize:"18px",
      color:"white",
      fontFamily: 'Playfair Display sans-serif',
      fontWeight:'Bold',
  
      
  }
  

  return (
    <React.Fragment>


      <BrowserRouter basename="/">
        <Switch>
          <Route exact path="/">

            <Navigation />
            <Header/> 
            <Features/>
            <Services/>
            <Gallery/>
            <Team/>
            <Contact/> 
            <Fab variant="extended" style={style} color={"inherit"} href={"charts"} size={'medium'} className="fab" >{"Open Screener   "}</Fab>

            <Switch>
   
            <HashRouter basename="#">
              <Route path="/page-top"> <Header/>  </Route>
              <Route path="/features"> <Features/>  </Route>
              <Route path="/services"> <Services/>  </Route>
              <Route path="/portfolio"> <Gallery/>  </Route>
              <Route path="/team"> <Team/>  </Route>
              <Route path="/contact"> <Contact />  </Route>
            </HashRouter>
            </Switch>
          </Route>
          <Route exact path="/charts"><Chart style={style}/></Route>
        </Switch>
      </BrowserRouter>
      </React.Fragment>)

  }


}

  export default App




