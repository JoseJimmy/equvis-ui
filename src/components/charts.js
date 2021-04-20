import React, {Component} from "react";
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
import Navtree from "./vega/Navtree";
import PriceChart from "./vega/PriceChart";
//style={{color: "white",fontSize:35,fontWeight:"bold",fontFamily: "Playfair Display"}}


export default class Chart extends Component {
    constructor(props) {
        super(props);
        // this.b_handleMarketSel = this.b_handleMarketSel.bind(this);
        this.vegaSelNode = this.vegaSelNode.bind(this);
        // this.vegaFocusNode = this.vegaFocusNode.bind(this);
        this.timeframeBtnHandler = this.timeframeBtnHandler.bind(this);

        this.state = {
            error: null,
            isLoaded: false,

            dataupdated: false,
            dispupdated: false,
            nodeDataRaw: {},
            nodeDataAim: {},
            nodeDataFull: {},
            nodeDataDisp: {},
            nodeDataDispUnfilt: {},
            rootToDisplay: 10000,
            selectedNode: 10000,
            currMareketRoot: 10000,
            allowBackButton: false,
            focusNodesList: [],
            focusNodesListUpdated: false,
            priceFullDataSet:[],
            isPriceLoaded:false,
            priceDispDataSet:[],
            chartTimePeriod:'3M',
            market: "Full",
            urlNavTreeFull:"https://raw.githubusercontent.com/equvis/data/main/treeNavFull.Json",
            urlNavTreeAim:"https://raw.githubusercontent.com/equvis/data/main/treeNavAim.Json",
            urlRetTsFull:"https://raw.githubusercontent.com/equvis/data/main/retTsDataFull5Y.Json",
            urlRretTsAim:"https://raw.githubusercontent.com/equvis/data/main/retTsDataAim5Y.Json"

        };
    };

    filterNodeData = (rootNode, data) => {
                const  period=this.state.chartTimePeriod;

        let retKey = "ret_"+period
        let fields = ["parent","id","Name","Ticker",retKey]
        let f = _.cloneDeep(tidy(data, filter((d) => (d.parent == rootNode) || (d.id == rootNode))))
        const rooIdx = f.findIndex((d => d.id == rootNode));
        f[rooIdx].parent = ""
        f = _.map(f, _.partialRight(_.pick,fields));
        f.map(d=>{d['ret'] = d[retKey]})
                f = _.reverse(_.sortBy(f, ['ret']))
        return f;
    }

    filterPriceData = (fullPriceData,lookupIds)=>{
        const  period=this.state.chartTimePeriod;
        let dateLookup = {"3M":"2021-01-01","6M":"2020-10-03","1Y":"2020-04-01","2Y":"2019-04-02","3Y":"2018-04-02","5Y":"2016-03-28"}
        let startdate = new Date(dateLookup[period]).getTime();
        // const fullPriceData = this.state.priceFullDataSet;

        let filtresult = fullPriceData.filter(d => {
            var time = new Date(d.Date).getTime();
            return (time > startdate);});

        let priceDispDataSet = filtresult.filter((d) => lookupIds.map((id) => id).includes(d.id),)
        priceDispDataSet = tidy(priceDispDataSet, mutate({show: (d) => 1, highlight: (d) => 0,}));
        priceDispDataSet.forEach(d => {d.highlight = this.state.focusNodesList.includes(d.id) ? 1 : 0;})

        console.log("********************Inside Prce filter *************** DATE ",period,"|",dateLookup[period]," | Full Price Data :",fullPriceData,"|Lookupids |",lookupIds,"|Filtere Priceset  |",priceDispDataSet)
        return priceDispDataSet;
    }

    findParentNode = (currMareketRoot, rootToDisplay, nodeDataDispUnfilt) => {

        const idx = nodeDataDispUnfilt.findIndex((d => d.id == rootToDisplay));
        let parent = _.cloneDeep(nodeDataDispUnfilt[idx].parent);
        console.log("back pressed, founc parent ", parent, " child  ", rootToDisplay, "idx ", idx, "searched tis => ", nodeDataDispUnfilt)
        if (parent == "" || parent == null) {
            return currMareketRoot
        } else {
            return parent
        }
    }

    fetchNavDataset()
    {
        let urlNavTree = (this.state.market === 'Full') ? this.state.urlNavTreeFull : this.state.urlNavTreeAim;
        let urlRetTs = (this.state.market === 'Full') ? this.state.urlRetTsFull : this.state.urlRretTsAim;
        fetch(urlNavTree)
            .then(res => res.json())
            .then(result => {
                    console.log("Fetched Json  ", result)
                    this.setState({nodeDataRaw: result})
                    let dataDisp = this.filterNodeData(this.state.currMareketRoot, result)
                    this.setState({nodeDataDispUnfilt: result});
                    this.setState({rootToDisplay: this.state.currMareketRoot});
                    this.setState({nodeDataDisp: dataDisp});
                    this.setState({isLoaded: true});
                    this.setState({dataupdated: !this.state.dataupdated})

                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    fetchPriceDataSet() {
        let urlRetTs = (this.state.market === 'Full') ? this.state.urlRetTsFull : this.state.urlRretTsAim;
        fetch(urlRetTs)
            .then(res => res.json())
            .then(result => {
                    result.map(d => {
                        d['Date'] = new Date(d['Date'])
                    });
                    this.setState({priceFullDataSet: result})
                    let lookupIds = [...new Set([...this.state.focusNodesList, ...this.state.nodeDataDisp.map(d => d.id)])];

                    let temp = this.filterPriceData(result,lookupIds);
                    console.log('*****************  Price Display Set returns ************Filtered nodes ', temp);

                    this.setState({isPriceLoaded: true});
                    this.setState({priceDispDataSet: temp})
                },
                (error) => {
                    this.setState({
                        isPriceLoaded: true,
                        error
                    });
                }
            )
    }

    componentDidMount() {
        this.fetchNavDataset();
        this.fetchPriceDataSet();
     }


    vegaSelNode = _.debounce((...args) => {
            let lookupIds = [];
            if (args[0] == 'nodeSel') {
                var userSelNode = args[1];
                const data = [...this.state.nodeDataDispUnfilt]
                if ((this.state.currMareketRoot == this.state.rootToDisplay && userSelNode == this.state.currMareketRoot)) {
                    console.log("No action - return ");
                    return;
                }
                if (userSelNode == this.state.rootToDisplay) {
                    userSelNode = this.findParentNode(this.state.currMareketRoot, this.state.rootToDisplay, this.state.nodeDataDispUnfilt);
                }
                const filtdata = this.filterNodeData(userSelNode, this.state.nodeDataDispUnfilt)
                this.setState({nodeDataDisp: filtdata});
                this.setState({rootToDisplay: userSelNode});
                this.setState({dataupdated: !this.state.dataupdated})
                this.setState({allowBackButton: true})
                lookupIds = [...new Set([...this.state.focusNodesList, ...filtdata.map(d => d.id)])];
             console.log("Inside Focus Node   -  Focus Node List  |",this.state.focusNodesList,"Nodes Displayed ",filtdata,"Lookupids",lookupIds);

            } else
            {
                let focusNode = args[1];
                let focusNodesList = _.cloneDeep(this.state.focusNodesList)
                if (focusNodesList.includes(focusNode)) {
                    focusNodesList = focusNodesList.filter(item => item !== focusNode)
                } else {
                    focusNodesList.push(focusNode)
                }
                this.setState({focusNodesList: focusNodesList})
                this.setState({focusNodesListUpdated: !this.state.focusNodesListUpdated})
                this.setState({dataupdated: !this.state.dataupdated})
                lookupIds = [...new Set([...focusNodesList, ...this.state.nodeDataDisp.map(d => d.id)])];
                console.log("Inside Focus Node   -  Focus Node List  |",focusNodesList,"Nodes Displayed ",this.state.nodeDataDisp,"Lookupids",lookupIds);

            }

            let temp = this.filterPriceData(this.state.priceFullDataSet,lookupIds)
            this.setState({priceDispDataSet: temp})
            return;


        }
        , 300)


timeframeBtnHandler = (period) =>
{


this.setState({chartTimePeriod:period}, function() {
  // ... do some other actions
    console.log("Setting Period ",this.state.chartTimePeriod)

    let lookupIds = [...new Set([...this.state.focusNodesList, ...this.state.nodeDataDisp.map(d => d.id)])];
    const filtdata = this.filterNodeData(this.state.selectedNode, this.state.nodeDataDispUnfilt,period)
    this.setState({nodeDataDisp: filtdata});
    const dispdata =this.state.nodeDataDisp;
    lookupIds = [...new Set([...this.state.focusNodesList, ...dispdata.map(d => d.id)])];
    let priceData = this.filterPriceData(this.state.priceFullDataSet, lookupIds, this.state.chartTimePeriod)
    this.setState({priceDispDataSet: priceData})
    let val =      !this.state.dataupdated;
    this.setState({dataupdated: val})
    val = !this.state.focusNodesListUpdated;
    this.setState({focusNodesListUpdated  : val })

})
}








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

        const error = this.state.error;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!this.state.isLoaded) {
            return (<div className="App"><Spinner animation="border" role="status"/></div>);
        } else {
            return (
                <React.Fragment>


                    <nav id='menu' className='navbar navbar-default navbar-fixed-top '>
                        <div className='container'>
                            <div className='navbar-header'>
                                <a href='/' className='navbar-brand'>Equvis</a>
                            </div>
                            <div>
                                <Fab style={style} color={"inherit"} href={"/"} className="fab">
                                    <i className={"fa fa-lg fa-mail-reply"}></i></Fab>
                            </div>
                        </div>
                    </nav>
                    <Container fluid>

                        <Row >

                            <Col lg={4} sm={12}>
                                <Navtree data={this.state.nodeDataDisp}
                                         isLoaded={this.state.isLoaded}
                                         market={this.state.market}
                                         dataUpdated={this.state.dataupdated}
                                         nodeSel={(...args) => this.vegaSelNode(...args)}
                                         nodeFocus={(...args) => this.vegaSelNode(...args)}
                                         selectedNode={this.state.selectedNode}/>
                            </Col>
                            <Col lg={6}>
                                <PriceChart priceData={this.state.priceDispDataSet}
                                            isPriceLoaded={this.state.isPriceLoaded}
                                            data={this.state.nodeDataDisp}
                                            selectedNode={this.state.selectedNode}
                                            focusNodesList={this.state.focusNodesList}
                                            filtDataset={this.state.nodeDataDispUnfilt}
                                            isLoaded={this.state.isLoaded}
                                            dataUpdated={this.state.dataupdated}
                                            focusNodesListUpdated={this.state.focusNodesListUpdated}
                                            nodeFocusPrice={(...args) => this.vegaSelNode(...args)}/>
                            </Col>

                        </Row>
                              <Row lg={1}> <ButtonToolbar>
                                <ToggleButtonGroup type="radio" name="options" defaultValue={"3M"}
                                                   onChange={this.timeframeBtnHandler} className={"btn-group"}>
                                    <ToggleButton className="button" value={"3M"}>3M</ToggleButton>
                                    <ToggleButton className="button" value={"6M"}>6M</ToggleButton>
                                    <ToggleButton className="button" value={"1Y"}>1Y</ToggleButton>
                                    <ToggleButton className="button" value={"2Y"}>2Y</ToggleButton>
                                    <ToggleButton className="button" value={"3Y"}>3Y</ToggleButton>
                                    <ToggleButton className="button" value={"5Y"}>5Y</ToggleButton>
                                </ToggleButtonGroup></ButtonToolbar>

                            </Row>



</Container>  </React.Fragment>
            )
        }
    }
}
// export default Chart;