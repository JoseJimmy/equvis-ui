import React, {Component, useEffect, useRef, useState} from 'react';
import {Vega, VegaLite, View} from 'react-vega';
import _ from "lodash";
import {mutate, tidy} from "@tidyjs/tidy";

class PriceChart extends Component {
    constructor(props) {
        super(props);


        this.state = {
            filtset: [{"id":10000,"show":1,"highlight":0},
                {"id":12205,"show":1,"highlight":1},
                {"id":12000,"show":1,"highlight":0},
                {"id":13000,"show":1,"highlight":0},
                {"id":14000,"show":1,"highlight":0},
                {"id":15000,"show":1,"highlight":0},
                {"id":16000,"show":1,"highlight":0},
                {"id":17000,"show":1,"highlight":0}],
            view: [],
            spec1 : {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "A basic line chart example.",
  "width": 400 ,
  "height": 400,
              "padding": {"left": 5, "right": 5, "top": 25, "bottom": 5},


  "signals":  [ {
  "name": "NodeFocus",
  "description": "Node focus",
  "value": -1,
  "on": [
    {
      "events": [
        {
          "type": "click",
          "marktype": "line"
        }
      ],
      "update": "datum.id "
    }
  ]
},
    {
      name: "width",
      update: "(containerSize()[0])",
      on: [
        {
          events: { source: "window", type: "resize" },
          update: "containerSize()[0]"
        }
      ]
    },

    {
      name: "height",
      update: "(containerSize()[1])",
      on: [
        {
          events: { source: "window", type: "resize" },
          update: "containerSize()[1]"
        }
      ]
    }
  ],
  "data": [


      {"name":"pricedata",

      },     {
      "name": "source",
       "source":"pricedata",
      "url": "https://raw.githubusercontent.com/JoseJimmy/datastore/main/perftic.json",
      "format": {
        "parse": {
          "Date": "date",
          "Ticker": "string",
          "change": "number",
          "id": "number"
        }
      }
     },


      {"name":"show"},

    {
      "name": "selectedSet",
      "source": "source"
     ,
      "transform": [

        {
          "type": "lookup",
          "from": "show",
          "key": "id",
          "fields": [
            "id"
          ],
          "values": [
            "show","highlight","name"
          ],
          "as": [
            "show","highlight","name"
          ],
          "default": 0
        },
        {
          "type": "collect",
          "sort": {
            "field": "id",
            "order": "ascending"
          }
        }
           ,    {
          "type": "filter",
          "expr": "datum.show ==1 "
        }
      ]
    },
{"name":"focusedSet",
"source":"selectedSet",
"transform":[
 {
          "type": "filter",
          "expr": "datum.highlight ==1 "
        }

]}






  ],
  "scales": [
    {
      "name": "x",
      "type": "time",
      "range": "width",
      "domain": {
        "data": "selectedSet",
        "field": "Date"
      }
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "round": true,
      "domain": {
        "data": "selectedSet",
        "field": "change"
      },
      "domainMin": 90
    },
    {
      "name": "color",
      "type": "ordinal",
      "range": ["#21f0b6", "#9f3b60", "#5fe12e", "#de19f7", "#6a9012", "#7771ff", "#afd35a", "#421ec8", "#eec052", "#2f4285", "#a0d1bc", "#cb2c17", "#255026", "#ea8cd0", "#754819", "#a6b6f9", "#fd8f2f"],
      "domain": {
        "data": "selectedSet",
        "field": "Ticker"
      }
    },
      {
      "name": "retColor",
      "type": "linear",
      "range": ["red", "green"],
       "domain": [-0.5,0.5],
      "interpolate": "hcl"
    }
  ],
  "axes": [
    {
      "orient": "bottom",
      "scale": "x",
                    "title": "Date",

      "grid": true
    },
    {
      "orient": "left",
      "scale": "y",
      "grid": true,
            "title": "Price Returns baselined on Start Date"

    }
  ],         "legends": [
    {"stroke": "color",
        "symbolType": "stroke"}
  ],

  "marks": [
    {
      "type": "group",
      "from": {
        "facet": {
          "name": "selectedGrpd",
          "data": "selectedSet",
          "groupby": "id"
        }
      },

      "marks": [
        {"name":"priceline",
          "type": "line",
          "from": {"data": "selectedGrpd"},
                    "encode": {
              "enter":{
                "x": {"scale": "x","field": "Date"},
                "y": {"scale": "y","field": "change"},
                "strokeWidth": {"value": 3.5 },
                "stroke":{"value":"grey"}
              },
              "update": {
                                "tooltip": {"signal": "{title: datum.Ticker,Name:datum.name}"},

                "interpolate": {"value": "natural"},
                "strokeOpacity": [
                  {"test": "datum.highlight==1","value": 0.8},{"value": 0.1}],
                "stroke": {"scale":"color","field": "Ticker"}

                },
            "hover": {
              "strokeOpacity": {
                "value": 0.8
              }
            }
          }
        },
                  {
          "type": "symbol",
          "from": {"data": "selectedGrpd"},
          "encode": {
              "enter":{
                "x": {"scale": "x","field": "Date"},
                "y": {"scale": "y","field": "change"},
                "size": {"value": 10 },
          "tooltip":{ "signal":
          "{title: datum.Ticker,Name:datum.name,Date:timeFormat(datum.Date, '%b %d %Y  '),Price:datum.change}"},
                "fill":{"value":"grey"}


              },
              "update": {
                "size": {"value": 35 },
                "interpolate": {"value": "natural"},
                "fillOpacity": [
                  {"test": "datum.highlight==1","value": 0.8},{"value": 0.1}],
                "fill": [{"value":"grey"}

                  ]
                },
            "hover": {
              "strokeOpacity": {"value": 0.5}

            }
          }
        }

      ]
    },

  ]
},
            spec:{
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "A basic line chart example.",
  "width": 550,
  "height": 420,
  "padding": {"left": 5, "right": 5, "top": 25, "bottom": 5},
  "signals": [
    {
      "name": "NodeFocus",
      "description": "Node focus",
      "value": -1,
      "on": [
        {
          "events": [{"type": "click", "marktype": "line"}],
          "update": "datum.id "
        }
      ]
    }
  ],
  "data": [
    {
      "name": "table",

      "format": {"parse": {"Date": "date"}}

    },
    {
      "name": "source",
      "source": "table"    },
    {
      "name": "show",
      "values": [
        {"id": 50000, "show": 1, "highlight": 1},
        {"id": 51100, "show": 1, "highlight": 1},
        {"id": 52000, "show": 1, "highlight": 1},
        {"id": 18000, "show": 1, "highlight": 1},
        {"id": 14000, "show": 1, "highlight": 0},
        {"id": 13000, "show": 0, "highlight": 0},
        {"id": 16000, "show": 0, "highlight": 0},
        {"id": 17000, "show": 0, "highlight": 0}
      ]
    },
    {
      "name": "selectedSet",
      "source": "source",
      "transform": [


        {"type": "filter", "expr": "datum.show ==1 "},
        {"type": "collect", "sort": {"field": "Date", "order": "ascending"}},
        {"type": "formula", "as":"cumChange","expr": "1+datum.Change"},

         {"type": "window", "groupby":["id"], "sort": {"field": "Date", "order": "ascending"},
        "ops": ["product"],  "fields": ["cumChange"],  "as": ["cumChange"]},
        {"type": "formula", "as":"cumChange","expr": "100*(datum.cumChange-1)"},
                {"type": "formula", "as":"Change","expr": "100*(datum.Change)"}


      ]
    },
    {
      "name": "focusedSet",
      "source": "table",
      "transform": [{"type": "filter", "expr": "datum.highlight ==1  || datum.show ==1"}]
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "time",
      "range": "width",
      "domain": {"data": "selectedSet", "field": "Date"}
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "round": true,
      "domain": {"data": "selectedSet", "field": "cumChange"}    },
    {
      "name": "color",
      "type": "ordinal",
      "range": [
        "#21f0b6",
        "#9f3b60",
        "#5fe12e",
        "#de19f7",
        "#6a9012",
        "#7771ff",
        "#afd35a",
        "#421ec8",
        "#eec052",
        "#2f4285",
        "#a0d1bc",
        "#cb2c17",
        "#255026",
        "#ea8cd0",
        "#754819",
        "#a6b6f9",
        "#fd8f2f"
      ],
      "domain": {"data": "selectedSet", "field": "id"}
    },
    {
      "name": "retColor",
      "type": "linear",
      "range": ["red", "green"],
      "domain": [-0.5, 0.5],
      "interpolate": "hcl"
    }
  ],
  "axes": [
    {"orient": "bottom", "scale": "x", "title": "Date", "grid": true},
    {
      "orient": "left",
      "scale": "y",
      "grid": true,
      "title": "Price Returns baselined on Start Date"
    }
  ],
  "legends": [{"stroke": "color", "symbolType": "stroke"}],
  "marks": [
    {
      "type": "group",
      "from": {
        "facet": {
          "name": "selectedGrpd",
          "data": "selectedSet",
          "groupby": "id"
        }
      },
      "marks": [
        {
          "name": "priceline",
          "type": "line",
          "from": {"data": "selectedGrpd"},
          "encode": {
            "enter": {
              "x": {"scale": "x", "field": "Date"},
              "y": {"scale": "y", "field": "cumChange"},
              "strokeWidth": {"value": 3.5},
              "stroke": {"value": "grey"}
            },
            "update": {
              "tooltip": {"signal": "{title: datum.Ticker,Name:datum.name}"},
              "interpolate": {"value": "natural"},
              "strokeOpacity": [
                {"test": "datum.highlight==1", "value": 0.8},
                {"value": 0.1}
              ],
              "stroke": {"scale": "color", "field": "id"}
            },
            "hover": {"strokeOpacity": {"value": 0.8}}
          }
        },
        {
          "type": "symbol",
          "from": {"data": "selectedGrpd"},
          "encode": {
            "enter": {
              "x": {"scale": "x", "field": "Date"},
              "y": {"scale": "y", "field": "cumChange"},
              "size": {"value": 10},
              "tooltip": {
                "signal": "{title: datum.Ticker,Name:datum.name,Date:timeFormat(datum.Date, '%b %d %Y  '),Price:datum.change}"
              },
              "fill": {"value": "grey"}
            },
            "update": {
              "size": {"value": 35},
              "interpolate": {"value": "natural"},
              "fillOpacity": [
                {"test": "datum.highlight==1", "value": 0.3},
                {"value": 0.1}
              ],
              "fill": [{"value": "grey"}]
            },
            "hover": {"strokeOpacity": {"value": 0.5}}
          }
        }
      ]
    }
  ]
},
            focusNodesList:[],
            priceData:{}

        }
    }
    // componentDidMount() {
    //              fetch("https://raw.githubusercontent.com/JoseJimmy/datastore/main/perftic.json")
    //         .then(res => res.json())
    //         .then(result => {this.setState({pricedata: result}
    //         );console.log('result : ',result)})}

    componentDidUpdate(prevProps) {

        if ((this.props.dataUpdated !== prevProps.dataUpdated) ) {

            // let lookupIds =  [...new Set([...this.props.focusNodesList,...this.props.data.map(d => d.id)])];
            // let priceDispSet = this.props.filtDataset.filter((d) => lookupIds.map((id) => id).includes(d.id), )
            //
            // priceDispSet = tidy(priceDispSet, mutate({show: (d) => 1,highlight: (d) =>  0, }));
            // priceDispSet.forEach(d =>{d.highlight = this.props.focusNodesList.includes(d.id) ? 1:0;})
            //
            //
            // console.log("Lookup ids com",lookupIds,"Price Disp Set ",priceDispSet);
            // console.log('******** data changed',this.props.data)
            // let dispDataSet = _.cloneDeep(this.props.data);
            // dispDataSet =     tidy(dispDataSet, mutate({ show: (d) => 1, highlight: (d) => (d.parent=="" ? 1 : 0), }));
            //

            console.log('Recieved Trigger in Price Update Node ',this.props.priceData)
            this.setState({priceData:this.props.priceData})
            // {this.state.focusNodesList} filtDataset = {this.state.nodeDataDispUnfilt}

        }
    }


    handleNewView = view => {
 {   this.setState({view: view});}
        console.log("Initial state view Price : ", this.state.view)    };

    render() {
        // let data  = {pricedata: this.state.pricedata,show: this.state.filtset}

            console.log("FROM Price Chart , before Vega Call  ",this.state.priceData)
           const ele = ( <Vega data={{table:this.props.priceData}} spec={this.state.spec} signalListeners={{NodeFocus:this.props.nodeFocusPrice}}   actions={false} /> );
           return (this.props.isPriceLoaded ? ele : []); }
}

export default  PriceChart;


//            specbak : {
//   "$schema": "https://vega.github.io/schema/vega/v5.json",
//   "description": "A basic line chart example.",
//   "width": 700,
//   "height": 600,
//   "padding": 50,
//   "signals": [
//
//   ],
//   "data": [
//
//      {
//       "name": "source",
//       "url": "https://raw.githubusercontent.com/JoseJimmy/datastore/main/perftic.json",
//       "format": {
//         "parse": {
//           "Date": "date",
//           "Ticker": "string",
//           "change": "number",
//           "id": "number"
//         }
//       }
//      },
//
//     {
//       "name": "show",
//       "values":[{"id":10000,"show":1,"highlight":0},
//                 {"id":12205,"show":1,"highlight":1},
//                 {"id":12000,"show":1,"highlight":0},
//                 {"id":13000,"show":1,"highlight":0},
//                 {"id":14000,"show":1,"highlight":0},
//                 {"id":15000,"show":1,"highlight":0},
//                 {"id":16000,"show":1,"highlight":0},
//                 {"id":17000,"show":1,"highlight":0}]
//     },
//     {
//       "name": "selectedSet",
//       "source": "source"
//      ,
//       "transform": [
//
//         {
//           "type": "lookup",
//           "from": "show",
//           "key": "id",
//           "fields": [
//             "id"
//           ],
//           "values": [
//             "show","highlight"
//           ],
//           "as": [
//             "show","highlight"
//           ],
//           "default": 0
//         },
//         {
//           "type": "collect",
//           "sort": {
//             "field": "id",
//             "order": "ascending"
//           }
//         }
//            ,    {
//           "type": "filter",
//           "expr": "datum.show ==1 "
//         }
//       ]
//     },
// {"name":"focusedSet",
// "source":"selectedSet",
// "transform":[
//  {
//           "type": "filter",
//           "expr": "datum.highlight ==1 "
//         }
//
// ]}
//
//
//
//
//
//
//   ],
//   "scales": [
//     {
//       "name": "x",
//       "type": "time",
//       "range": "width",
//       "domain": {
//         "data": "selectedSet",
//         "field": "Date"
//       }
//     },
//     {
//       "name": "y",
//       "type": "linear",
//       "range": "height",
//       "round": true,
//       "domain": {
//         "data": "selectedSet",
//         "field": "change"
//       },
//       "domainMin": 90
//     },
//     {
//       "name": "color",
//       "type": "ordinal",
//       "range": "category",
//       "domain": {
//         "data": "selectedSet",
//         "field": "id"
//       }
//     }
//   ],
//   "axes": [
//     {
//       "orient": "bottom",
//       "scale": "x",
//                     "title": "Date",
//
//       "grid": true
//     },
//     {
//       "orient": "left",
//       "scale": "y",
//       "grid": true,
//             "title": "Price Returns baselined on Start Date"
//
//     }
//   ],
//   "marks": [
//     {
//       "type": "group",
//       "from": {
//         "facet": {
//           "name": "selectedGrpd",
//           "data": "selectedSet",
//           "groupby": "id"
//         }
//       },
//       "marks": [
//         {
//           "type": "line",
//           "from": {"data": "selectedGrpd"},
//                     "encode": {
//               "enter":{
//                 "x": {"scale": "x","field": "Date"},
//                 "y": {"scale": "y","field": "change"},
//                 "strokeWidth": {"value": 3 },
//                 "stroke":{"value":"grey"}
//               },
//               "update": {
//                                 "tooltip": {"signal": "datum.Ticker"},
//
//                 "interpolate": {"value": "natural"},
//                 "strokeOpacity": [
//                   {"test": "datum.highlight==1","value": 1},{"value": 0.1}],
//                 "stroke": [
//                   {"test": "datum.highlight==1","value": "red"},{"value":"grey"}
//                   ]
//                 },
//             "hover": {
//               "strokeOpacity": {
//                 "value": 0.5
//               }
//             }
//           }
//         }
//       ]
//     },
//         {
//       "type": "group",
//       "from": {
//         "facet": {
//           "name": "focusedGrpd",
//           "data": "focusedSet",
//           "groupby": "id"
//         }
//       },
//       "marks": [
//         {
//           "type": "symbol",
//           "from": {"data": "focusedGrpd"},
//           "encode": {
//               "enter":{
//                 "x": {"scale": "x","field": "Date"},
//                 "y": {"scale": "y","field": "change"},
//                 "size": {"value": 10 },
//           "tooltip":{ "signal":
//           "{title: datum.Ticker,Date:timeFormat(datum.Date, '%b %d %Y  '),Price:datum.change}"},
//                 "fill":{"value":"grey"}
//
//
//               },
//               "update": {
//                 "size": {"value": 25 },
//                 "interpolate": {"value": "natural"},
//                 "fillOpacity": [
//                   {"test": "datum.highlight==1","value": 1},{"value": 0.1}],
//                 "fill": [
//                   {"test": "datum.highlight==1","value": "green"},{"value":"grey"}
//                   ]
//                 },
//             "hover": {
//               "strokeOpacity": {"value": 0.5},
//               "size": {"value":100}
//
//             }
//           }
//         }
//       ]
//     }
//   ]
// },



