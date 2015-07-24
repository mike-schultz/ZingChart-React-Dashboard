var React = require('react');
var Core = require('zingchart-react').core;

var Area = React.createClass({
    render : function(){
        var myConfig = {
          type: "area",
          series: [{
            values: this.props.values,
            lineColor: "#1fbff3",
            backgroundColor1: "#77d9f8",
            backgroundColor2: "#272822",
            shadowColor: "transparent",
            lineWidth: 2,
            text: "Users"
          }],
          backgroundColor: '#272822',
          title: {
            text: "Number of Users (24 Hours)",
            textAlign: "left",
            backgroundColor: "transparent",
            fontFamily: "Roboto",
            fontSize: "18px",
            fontWeight: "normal",
            paddingLeft: "20px"
          },
          plotarea: {
            backgroundColor: '#272822',
            marginTop: "50px",
            marginBottom: "40px",
            marginRight: "35px"
          },
          plot: {
            aspect: "spline",
            marker: {
              visible: "false"
            },
            hoverState: {},
            tooltip: {
              visible: false
            }
          },
          scaleX: {
            transform: {
              type: "date",
              all: "%h:%i:%s%A",
              guide: {
                visible: false
              },
              item: {
                visible: false
              }
            },
            minValue : Date.now() - 60000,
            step: 1000,
            guide: {
              visible: false
            },
            lineColor: "#DDD",
            tick: {
              lineColor: "#DDD"
            },
            item: {
              fontColor: "#DDD"
            },
            refLine: {
              lineColor: "#DDD"
            }
          },
          scaleY: {
            lineColor: "#DDD",
            guide: {
              lineColor: "#868686"
            },
            tick: {
              lineColor: "#DDD"
            },
            item: {
              fontColor: "#DDD"
            },
            refLine: {
              lineColor: "#DDD"
            }
          },
          crosshairX: {
            "line-color": "#f6f7f8",
            "value-label": {
              "border-radius": "5px",
              "border-width": "1px",
              "border-color": "#f6f7f8",
              "padding": "5px",
              "font-weight": "bold"
            },
            scaleLabel: {
              backgroundColor: "#00baf0",
              fontColor: "#f6f7f8",
              borderRadius: "5px"
            }
          }
        };
        return (<Core id={this.props.id} height={this.props.height} width={this.props.width} data={myConfig}/>);
    }
});
zingchart.MODULESDIR = "../node_modules/zingchart/client/modules/";
zingchart.loadModules('maps,maps-world-countries');
var Map = React.createClass({
        render: function() {
            var myConfig = {
              globals : {
                shadow : false
              },
              graphset : [
                {
                  height:"270px",
                  title: {
                    text: "Live User Location",
                    textAlign: "left",
                    backgroundColor: "transparent",
                    fontFamily: "Roboto",
                    fontSize: "18px",
                    fontWeight: "normal",
                    paddingLeft: "20px"
                  },
                  backgroundColor: "#272822",
                  shapes: [{
                    type: "zingchart.maps",
                    options: {
                      id: "map",
                      scale: true,
                      name: "world.countries",
                      ignore: ["ATA"],
                      style: {
                        backgroundColor: "#ffffff",
                        hoverState: {
                          visible: false
                        },
                        borderColor: "#272822",
                        label: {
                          visible: false
                        },
                        items: this.props.series
                      }
                    }
                  }]
                },
                {
                  height: "150px",
                  type : 'line',
                  backgroundColor : "#272822",
                  scaleX : {
                      lineColor : "white",
                      tick :{
                          lineColor  :"white"
                      },
                      format : "%v:00",
                      labels : getTimeLabels(),
                      values : "1:25:1",
                      item : {
                          fontColor : "white"
                      }
                  },
                  plotarea : {
                      marginTop : "0px",
                      marginBottom : "30px",
                      marginLeft : "220px",
                      marginRight : "200px"
                  }
                }
              ]
            };

            function getTimeLabels(){
                var labels = [];
                //var now = (new Date()).getHours();
                //Four hour advance on scale;
                var now = new Date(new Date() - 28800000).getHours();
                var k = now + 4;
                for(var i = 0 ; i < 25; i++){
                    if(k < 24){
                        labels.push(k+'');
                        k++;
                    }
                    else{
                        labels.push('0');
                        k = 0;
                    }
                }
                labels.push(now + '');
                return labels;
            }
        return (<Core id={this.props.id} height={this.props.height} width={this.props.width} data={myConfig}/>);
    }
});
var StackedBar = React.createClass({
    render: function() {
        var myConfig = {
            backgroundColor: "#272822",
            type: "bar",
            stacked: true,
            stackType: "100%",
            title: {
                text: "Distribution",
                textAlign: "left",
                backgroundColor: "transparent",
                fontFamily: "Roboto",
                fontSize: "18px",
                fontWeight: "normal",
                paddingLeft: "20px"
            },
            legend: {
                margin: "88% auto auto auto",
                layout: "float",
                fontSize: "10px",
                backgroundColor: "transparent",
                borderColor: "transparent",
                shadowColor: "transparent",
                toggleAction: "remove",
                item: {
                    markerStyle: "circle",
                    fontColor: "#ffffff"
                }
            },
            series: this.props.series,
            tooltip: {
                borderRadius: "5px",
                shadow: 0,
                text : "%t : %v\n Time : %kv",
            },
            plot: {
                fontColor: "white",
            },
            plotarea: {
                backgroundColor: '#272822',
                marginTop: "50px",
                marginBottom: "60px",
                marginRight: "35px"
            },
            scaleX: {
                transform: {
                    type: "date",
                    all: "%h:%i:%s %A",
                    guide: {
                        visible: false
                    },
                    item: {
                        visible: false
                    }
                },
                minValue: Date.now() - 60000,
                step: 1000,
                guide: {
                    visible: false
                },
                lineColor: "#DDD",
                tick: {
                    lineColor: "#DDD"
                },
                item: {
                    fontColor: "#DDD"
                },
                refLine: {
                    lineColor: "#DDD"
                }
            },
            scaleY: {
                lineColor : "white",
                tick : {
                    lineColor : "white"
                },
                item: {
                    fontColor: "white"
                }

            }
        };
        return (<Core id={this.props.id} height={this.props.height} width={this.props.width} data={myConfig}/>);
    }
})

module.exports = {
    area : Area,
    map : Map,
    stackedBar : StackedBar
};
