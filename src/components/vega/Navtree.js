import React, {Component, useEffect, useRef, useState} from 'react';
import {Vega} from 'react-vega';
import _ from "lodash";
import {mutate, tidy} from "@tidyjs/tidy";
 // {"events": "dblclick","markname":"nodes", "throttle":200,"update": "datum.id"},{"events": "@cell:dblclick", "throttle":200,"update": "datum.id"}
//
class Navtree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldspec: {
              "$schema": "https://vega.github.io/schema/vega/v5.json",
              "description": "An example of Cartesian layouts for a node-link diagram of hierarchical data.",
              "width": "Container",
              "height": 430,
              "autosize": {"type": "fit-x", "resize": true},
              "padding": {"left": 5, "right": 5, "top": 5, "bottom": 5},
              "signals": [{
                  "name": "width",
                  "update": "(containerSize()[0])",
                  "on": [{"events": {"source": "window", "type": "resize"}, "update": "containerSize()[0]"}]
              }, {
                  "name": "height",
                  "update": "(containerSize()[1])",
                  "on": [{"events": {"source": "window", "type": "resize"}, "update": "containerSize()[1]"},{"events": "click","throttle":150,"marktype":"text", "update": "datum.id"}]
              },
                  {
                  "name": "nodeSel",
                  "description": "Node double click",
                  "value": -1,
                  "on": [{"events": "dblclick","markname":"backArrow", "throttle":50,"update": "datum.parent"},
                      {"events": "dblclick","markname":"nodes", "throttle":50,"update": "datum.id"},
                      {"events": "@cell:dblclick", "throttle":10,"update": "datum.id"}

                  ]
              },{
                  "name": "NodeFocus",
                  "description": "Node single click",
                  "value": -1,
                  "on": [{"events": "@cell:click", "throttle":50    ,"update": "datum.id"}]

              } ],
              "data": [{"name": "table"
                },


                  {
                      "name": "tree",
                      "source": "table",
                      "transform":
                          [
                            {"type": "stratify", "key": "id", "parentKey": "parent"}, {
                              "type": "tree",
                              "method": "tidy",
                              "size": [450, 350 ],
                              "separation": true,
                              "as": ["y", "x", "depth", "children"]
                          },  {
                              "type": "voronoi",
                              "size": [425,450],
                              "x": "x",
                              "y": "y",
                              "as": "path"
                          },{"type": "formula", "as": "x", "expr": "15+(datum.x*0.54) "}]
                  }, {
                      "name": "links",
                      "source": "tree",
                      "transform": [{"type": "treelinks"}, {
                          "type": "linkpath",
                          "orient": "horizontal",
                          "shape": "diagonal"
                      }]
                  }],
              "scales": [{
                  "name": "returnColor",
                  "type": "linear",
                  "range": {"scheme": "redyellowgreen"},
                  "domain": {"data": "table", "field": "ret"},

                  "zero": true
              },    {
      "name": "binnedRets",
      "type": "bin-ordinal",
      "bins": [-0.5,-0.2,-0.1,-0.05,0,0.05,0.1,0.2,0.5],
      "range": ["red","green"]
    } ,{
      "name": "retColor",
      "type": "linear",
      "range": ["red", "green"],
       "domain":{"data": "tree", "field": "ret"},

      "interpolate": "hcl"
    },],



              "legends": [
    {
"title":"Period Returns %",
         "fill": "retColor",
        "gradientLength":200,
        "gradientOpacity":0.5,
        "cornerRadius":50,
        "gradientThickness":10,
        "direction":"vertical",
   "orient":"bottom-left",
        "labelFontSize":8,
        "titleBaseline":"line-top",
        "titleOrient":"bottom",
        "encode": {
        "symbols": {
              "fill": "retColor",
        } }  } ],


              "marks": [{
                  "type": "path",
                  "name": "cell",
                  "zindex": 2,
                  "from": {"data": "tree"},
                  "encode": {
                      "enter": {"fill": {"value": "transparent"}, "strokeWidth": {"value": 0.04}},
                      "update": {"path": {"field": "path"}, "stroke": {"value": "green"}}
                  }
              }, {
                  "type": "symbol",
                  "name": "nodes",
                  "interactive": false,
                  "zindex": 3,
                  "from": {"data": "tree"},
                  "encode": {
                      "enter": {
                          "stroke": {"value": "#fff1e5"},
                          "fillOpacity": {"value": 0.01},
                          "size": {"value": 350},
                          "tooltip": {"signal": "datum.ret"},
                                                    "fill": {"scale": "retColor", "field": "ret"},

                      },
                      "update": {
                          "x": {"field": "x"},
                          "y": {"field": "y"},
                          "stroke": {"value": "#b06c13"},
                          "fill": {"scale": "retColor", "field": "ret"},
                          "fillOpacity": {"value": 0.8},
                          "size": {"value": 350},
                          "opacity": {"value": 1},
                          "strokeOpacity":{"value":0.5}
                      },
                      "hover": {"fillOpacity": {"value": 0.1}}
                  }
              }, {
                  "type": "path",
                  "interactive": false,
                  "zindex": 0,
                  "from": {"data": "links"},
                  "encode": {
                      "enter": {
                          "path": {"field": "path"},
                          "stroke": {"value": "#b3721e"},
                          "strokeWidth": {"value": 0.4},
                          "strokeOpacity": {"value": 0.5} }
                  },
                  "update":
                      {   "blend":"hard-light",
                          "path": {"field": "path"},
                          "stroke": {"value": "#b3721e"}
                      }
              }
              ,
                  {
                      "name": "labels",
                      "type": "text",
                      "from": {"data": "tree"},
                      "transform": [
                          {
                              "type": "label",
                              "avoidMarks": ["cell","nodes"],
                              "anchor": ["top", "bottom", "right", "left"],
                              "offset": [2],
                              "size": [450, 450]
                          }
                      ],
                      "encode": {
                          "enter": {
                              "text": {"field": "name"},
                              "fontSize": {"value": 8},
                              "baseline": {"value": "left"},
                              "opacity": {"value": 0.8}

                          },
                          "update": {
                              "x": {"field": "x", "offset": 15},
                              "y": {"field": "y", "offset": 0}
                          }
                      }
                  }
              ]
          },
          spec1: {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "An example of Cartesian layouts for a node-link diagram of hierarchical data.",
  "width": 450,
  "height": 430,
  "autosize": {"type": "fit-x", "resize": true},
  "padding": {"left": 5, "right": 5, "top": 5, "bottom": 5},
  "signals": [
    {
      "name": "width",
      "update": "(containerSize()[0])",
      "on": [
        {
          "events": {"source": "window", "type": "resize"},
          "update": "containerSize()[0]"
        }
      ]
    },
    {
      "name": "height",
      "update": "(containerSize()[1])",
      "on": [
        {
          "events": {"source": "window", "type": "resize"},
          "update": "containerSize()[1]"
        },
        {
          "events": "click",
          "throttle": 150,
          "marktype": "text",
          "update": "datum.id"
        }
      ]
    },
    {
      "name": "nodeSel",
      "description": "Node double click",
      "value": -1,
      "on": [
        {
          "events": "dblclick",
          "markname": "backArrow",
          "throttle": 50,
          "update": "datum.parent"
        },
        {
          "events": "dblclick",
          "markname": "nodes",
          "throttle": 50,
          "update": "datum.id"
        },
        {"events": "@cell:dblclick", "throttle": 10, "update": "datum.id"}
      ]
    },
    {
      "name": "NodeFocus",
      "description": "Node single click",
      "value": -1,
      "on": [{"events": "@cell:click", "throttle": 50, "update": "datum.id"}]
    }
  ],
  "data": [
    {
      "name": "table",
      "values": [
        {
          "parent": 10000,
          "id": 18000,
          "Name": "Industry - Basic Materials",
          "Ticker": "IDX:FT55",
          "ret_1Y": 0.70561,
          "ret": 0.70561,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 17000,
          "Name": "Industry - Industrials",
          "Ticker": "IDX:FT50",
          "ret_1Y": 0.45255,
          "ret": 0.45255,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 15000,
          "Name": "Industry - Consumer Discretionary",
          "Ticker": "IDX:FT40",
          "ret_1Y": 0.42207,
          "ret": 0.42207,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 14000,
          "Name": "Industry - Financials",
          "Ticker": "IDX:FT30",
          "ret_1Y": 0.28438,
          "ret": 0.28438,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 11000,
          "Name": "Industry - Technology",
          "Ticker": "IDX:FT10",
          "ret_1Y": 0.25386,
          "ret": 0.25386,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 21000,
          "Name": "Industry - Real Estate ",
          "Ticker": "IDX:AXX3510-GBP",
          "ret_1Y": 0.24731,
          "ret": 0.24731,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": "",
          "id": 10000,
          "Name": "FTSE All-Share Index (ASX)",
          "Ticker": "IDX:ASX",
          "ret_1Y": 0.23801,
          "ret": 0.23801,
          "show": 1,
          "highlight": 1
        },
        {
          "parent": 10000,
          "id": 12000,
          "Name": "Industry - Telecommunications",
          "Ticker": "IDX:FT15",
          "ret_1Y": 0.21789,
          "ret": 0.21789,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 16000,
          "Name": "Industry - Consumer Staples",
          "Ticker": "IDX:FT45",
          "ret_1Y": 0.11566,
          "ret": 0.11566,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 20000,
          "Name": "Industry - Utilities",
          "Ticker": "IDX:FT65",
          "ret_1Y": -0.00181,
          "ret": -0.00181,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 13000,
          "Name": "Industry - Health Care",
          "Ticker": "IDX:FT20",
          "ret_1Y": -0.02706,
          "ret": -0.02706,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 19000,
          "Name": "Industry - Energy",
          "Ticker": "IDX:FT60",
          "ret_1Y": -0.02722,
          "ret": -0.02722,
          "show": 1,
          "highlight": 0
        }
      ]
    },
    {
      "name": "tree",
      "source": "table",
      "transform": [
        {"type": "stratify", "key": "id", "parentKey": "parent"},
        {
          "type": "tree",
          "method": "tidy",
          "size": [450, 350],
          "separation": true,
          "as": ["y", "x", "depth", "children"]
        },
        {
          "type": "voronoi",
          "size": [425, 450],
          "x": "x",
          "y": "y",
          "as": "path"
        },
        {"type": "formula", "as": "x", "expr": "15+(datum.x*0.54) "}
      ]
    },
    {
      "name": "links",
      "source": "tree",
      "transform": [
        {"type": "treelinks"},
        {"type": "linkpath", "orient": "horizontal", "shape": "diagonal"}
      ]
    }
  ],
  "scales": [


    {
      "name": "retColor",
      "type": "linear",
      "range": ["red", "white","green"],
      "domain": [-1,1],
      "domainMid":0,
      "interpolate": "hcl"
    }
  ],
  "legends": [
    {
      "title": "Period Returns %",
      "fill": "retColor",
      "gradientLength": 30,
      "gradientOpacity": 0.5,
      "cornerRadius": 1350,
      "gradientThickness": 10,
      "direction": "vertical",
      "orient": "bottom-left",
      "labelFontSize": 8,
      "titleBaseline": "line-top",
      "titleOrient": "bottom",
      "encode": {"symbols": {"fill": "retColor"}}
    }
  ],
  "marks": [
    {
      "type": "path",
      "name": "cell",
      "zindex": 2,
      "from": {"data": "tree"},
      "encode": {
        "enter": {
          "fill": {"value": "transparent"},
          "strokeWidth": {"value": 0.04}
        },
        "update": {"path": {"field": "path"}, "stroke": {"value": "green"}}
        ,
          "tooltip": {
                "signal": "{datum.Ticker,Name:datum.Name,Return:datum.ret}"
              }
      }
    },
    {
      "type": "symbol",
      "name": "nodes",
      "interactive": false,
      "zindex": 3,
      "from": {"data": "tree"},
      "encode": {
        "enter": {
          "stroke": {"value": "#fff1e5"},
          "fillOpacity": {"value": 0.01},
          "size": {"value": 350},
          "fill": {"scale": "retColor", "field": "ret"}
        },
        "update": {
          "x": {"field": "x"},
          "y": {"field": "y"},
          "stroke": {"value": "#b06c13"},
          "fill": {"scale": "retColor", "field": "ret"},
          "fillOpacity": {"value": 0.8},
          "size": {"value": 350},
          "opacity": {"value": 1},
          "strokeOpacity": {"value": 0.5}
        },
        "hover": {"fillOpacity": {"value": 0.1}}
      }
    },
    {
      "type": "path",
      "interactive": false,
      "zindex": 0,
      "from": {"data": "links"},
      "encode": {
        "enter": {
          "path": {"field": "path"},
          "stroke": {"value": "#b3721e"},
          "strokeWidth": {"value": 0.4},
          "strokeOpacity": {"value": 0.5}
        }
      },
      "update": {
        "blend": "hard-light",
        "path": {"field": "path"},
        "stroke": {"value": "#b3721e"}
      }
    },
    {
      "name": "labels",
      "type": "text",
      "from": {"data": "tree"},
      "encode": {
        "enter": {
          "text": {"field": "Name"},
          "fontSize": {"value": 8},
          "baseline": {"value": "left"},
          "opacity": {"value": 0.8}
        },
        "update": {
          "x": {"field": "x", "offset": 15},
          "y": {"field": "y", "offset": 0}
        }
      }
    }
  ]
},
            spec:{
  "$schema": "https://vega.github.io/schema/vega/v5.json",
                "name":'Navtree',
  "description": "An example of Cartesian layouts for a node-link diagram of hierarchical data.",
 "width": "Container",
  "height": "Container",
  "autosize": {"type": "fit-x", "resize": true},
  "padding": {"left": 5, "right": 5, "top": 5, "bottom": 5},
  "signals": [
    {
      "name": "width",
      "update": "(containerSize()[0])",
      "on": [
        {
          "events": {"source": "window", "type": "resize"},
          "update": "containerSize()[0]"
        }
      ]
    },
    {
      "name": "height",
      "update": "(containerSize()[1])",
      "on": [
        {
          "events": {"source": "window", "type": "resize"},
          "update": "containerSize()[1]"
        }
      ]
    },
    {
      "name": "nodeSel",
      "description": "Node double click",
      "value": -1,
      "on": [
        {
          "events": "dblclick",
          "markname": "backArrow",
          "throttle": 50,
          "update": "datum.parent"
        },
        {
          "events": "dblclick",
          "markname": "nodes",
          "throttle": 50,
          "update": "datum.id"
        },
        {"events": "@cell:dblclick", "throttle": 10, "update": "datum.id"}
      ]
    },
    {
      "name": "NodeFocus",
      "description": "Node single click",
      "value": -1,
      "on": [{"events": "@cell:click", "throttle": 50, "update": "datum.id"}]
    }
  ],
  "data": [
    {
      "name": "table",
      "values": [
        {
          "parent": 10000,
          "id": 18000,
          "Name": "Industry - Basic Materials",
          "Ticker": "IDX:FT55",
          "ret_1Y": 0.70561,
          "ret": 0.70561,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 17000,
          "Name": "Industry - Industrials",
          "Ticker": "IDX:FT50",
          "ret_1Y": 0.45255,
          "ret": 0.45255,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 15000,
          "Name": "Industry - Consumer Discretionary",
          "Ticker": "IDX:FT40",
          "ret_1Y": 0.42207,
          "ret": 0.42207,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 14000,
          "Name": "Industry - Financials",
          "Ticker": "IDX:FT30",
          "ret_1Y": 0.28438,
          "ret": 0.28438,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 11000,
          "Name": "Industry - Technology",
          "Ticker": "IDX:FT10",
          "ret_1Y": 0.25386,
          "ret": 0.25386,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 21000,
          "Name": "Industry - Real Estate ",
          "Ticker": "IDX:AXX3510-GBP",
          "ret_1Y": 0.24731,
          "ret": 0.24731,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": "",
          "id": 10000,
          "Name": "FTSE All-Share Index (ASX)",
          "Ticker": "IDX:ASX",
          "ret_1Y": 0.23801,
          "ret": 0.23801,
          "show": 1,
          "highlight": 1
        },
        {
          "parent": 10000,
          "id": 12000,
          "Name": "Industry - Telecommunications",
          "Ticker": "IDX:FT15",
          "ret_1Y": 0.21789,
          "ret": 0.21789,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 16000,
          "Name": "Industry - Consumer Staples",
          "Ticker": "IDX:FT45",
          "ret_1Y": 0.11566,
          "ret": 0.11566,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 20000,
          "Name": "Industry - Utilities",
          "Ticker": "IDX:FT65",
          "ret_1Y": -0.00181,
          "ret": -0.00181,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 13000,
          "Name": "Industry - Health Care",
          "Ticker": "IDX:FT20",
          "ret_1Y": -0.02706,
          "ret": -0.02706,
          "show": 1,
          "highlight": 0
        },
        {
          "parent": 10000,
          "id": 19000,
          "Name": "Industry - Energy",
          "Ticker": "IDX:FT60",
          "ret_1Y": -0.02722,
          "ret": -0.02722,
          "show": 1,
          "highlight": 0
        }
      ]
    },
    {
      "name": "tree",
      "source": "table",
      "transform": [
        {"type": "stratify", "key": "id", "parentKey": "parent"},
        {
          "type": "tree",
          "method": "tidy",
          "size": [450, 350],
          "separation": true,
          "as": ["y", "x", "depth", "children"]
        },
        {
          "type": "voronoi",
          "size": [425, 450],
          "x": "x",
          "y": "y",
          "as": "path"
        },
        {"type": "formula", "as": "x", "expr": "15+(datum.x*0.54) "}
      ]
    },
    {
      "name": "links",
      "source": "tree",
      "transform": [
        {"type": "treelinks"},
        {"type": "linkpath", "orient": "horizontal", "shape": "diagonal"}
      ]
    }
  ],
  "scales": [


    {
      "name": "retColor",
      "type": "linear",
      "range": ["red", "white","green"],
      "domain": [-1,1],
      "domainMid":0,
      "interpolate": "hcl"
    }
  ],
  "legends": [
    {
      "title": "Period Returns %",
      "fill": "retColor",
      "gradientLength": 30,
      "gradientOpacity": 0.5,
      "gradientThickness": 10,
      "direction": "horizontal",
      "orient": "top-left",
      "labelFontSize": 8,
      "titleBaseline": "line-top",
      "titleOrient": "bottom",
      "encode": {"symbols": {"fill": "retColor"}}
    }
  ],
  "marks": [
    {
      "type": "path",
      "name": "cell",
      "zindex": 2,
      "from": {"data": "tree"},
      "encode": {
        "enter": {
          "fill": {"value": "transparent"},
          "strokeWidth": {"value": 0.04}
        },
        "update": {"path": {"field": "path"}, "stroke": {"value": "green"}


        }


      }
    },
    {
      "type": "symbol",
      "name": "nodes",
      "interactive": false,
      "zindex": 3,
      "from": {"data": "tree"},
       "tooltip": {"content": "data"},
      "encode": {
        "enter": {
          "stroke": {"value": "#fff1e5"},
          "fillOpacity": {"value": 0.01},
          "size": {"value": 350},
          "fill": {"scale": "retColor", "field": "ret"}
        },
        "update": {
          "x": {"field": "x"},
          "y": {"field": "y"},
          "stroke": {"value": "#b06c13"},
          "fill": {"scale": "retColor", "field": "ret"},
          "fillOpacity": {"value": 0.8},
          "size": {"value": 350},
          "opacity": {"value": 1},
          "strokeOpacity": {"value": 0.5}
        },
        "hover": {"fillOpacity": {"value": 0.1}}
      }
    },
    {
      "type": "path",
      "interactive": false,
      "zindex": 0,
      "from": {"data": "links"},
      "encode": {
        "enter": {
          "path": {"field": "path"},
          "stroke": {"value": "#b3721e"},
          "strokeWidth": {"value": 0.4},
          "strokeOpacity": {"value": 0.5}
        }
      },
      "update": {
        "blend": "hard-light",
        "path": {"field": "path"},
        "stroke": {"value": "#b3721e"}
      }
    },
    {
      "name": "labels",
      "type": "text",
      "from": {"data": "tree"},
      "transform": [
        {
          "type": "label",
          "avoidMarks": [ "nodes"],
          "anchor": ["top", "bottom", "right", "left"],
          "offset": [2],
          "size": [450, 450]
        }
      ],
      "encode": {
        "enter": {
          "text": {"field": "Name"},
          "fontSize": {"value": 8},
          "baseline": {"value": "left"},
          "opacity": {"value": 0.8},
                 "x": {"field": "x", "offset": 15},
          "y": {"field": "y", "offset": 0}
        },
        "update": {

        }
      }
    }
  ]
},

            filtset: [],
            view: [],
        }
    }
    handleNewView = view => {
        {
            this.setState({view: view});
            this.setState({selectedNode: this.props.selectedNode});
                    console.log("Initial state view : ", this.state.view)
view.addSignalListener('nodeSel', function(name, value) {
  console.log('########### Signal Listener nodeSel: ' + value);})
  view.addSignalListener('Signal Listener  nodeFocus', function(name, value) {
  console.log('########### nodeFocus: ' + value);})
        this.setState({viewCreated: true});
        this.setState({readyforUpdate: true})


        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.dataUpdated !== prevProps.dataUpdated) {
            console.log('data changed', this.props.data)
            this.setState({filtset: this.props.data})
        }
    }

    render() {

 const ele = (<Vega data={{table: this.state.filtset}} className={'Price'} spec={this.state.spec} renderer={'svg'}
                  signalListeners={{nodeSel: this.props.nodeSel,NodeFocus:this.props.nodeFocus}} onNewView={this.handleNewView}
                  actions={false}/>)
                return (this.props.isLoaded ? ele : []);

    }
}

export default Navtree;






