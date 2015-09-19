var React = require('react');
var ZingChart = require('zingchart-react').core;
var CustomArea = require('./charts').area;
var CustomMap = require('./charts').map;
var CustomStackedBar = require('./charts').stackedBar;
var DataStore = require('./datastore.js');
zingchart.loadModules('maps,maps-world-countries');

var App = React.createClass({
    getInitialState : function(){

        //////////////////////////////////
        //TIME SERIES DATA
        //////////////////////////////////
        var data = DataStore.generateFakeDataset(DataStore.resolution.hour);
        var _areaValues = [];
        var _stackedValues = {
            gallery : [],
            home : [],
            docs : [],
            contact : []
        };
        for(var i = 0 ; i < data.length; i++){
            //Area Chart
            _areaValues.push(data[i].users);
            //StackedBar Chart
            for(var k = 0 ; k < data[i].page.length; k++){
                _stackedValues[ data[i].page[k].title ].push(data[i].page[k].count);
            }
        }
        var _mapValues = generateMapValues(data[data.length-1].location);
        //////////////////////////////////
        //SNAPSHOT DATA
        //////////////////////////////////
        return {
            originalState : data,
            myAreaValues : _areaValues,
            myStackedSeries : [
                {
                    values: _stackedValues.gallery,
                    text: "Gallery",
                    backgroundColor: "#076d7f"
                }, {
                    values: _stackedValues.home,
                    text: "Home",
                    backgroundColor: "#029fbc"
                }, {
                    values: _stackedValues.docs,
                    text: "Docs",
                    backgroundColor: "#00D9FF"
                }, {
                    values: _stackedValues.contact,
                    text: "Contact",
                    backgroundColor: "#bae2ff"
                }
            ],
            myMapSeries : _mapValues
        };
    },
    render : function(){
        return (
            <div id="chart-containers">
                <CustomArea id="chart1" height="300" width="1000" values={this.state.myAreaValues}/>
                <CustomStackedBar id="chart2" height="300" width="1000" series={this.state.myStackedSeries}/>
                <CustomMap id="chart3" height="300" width="1000" series={this.state.myMapSeries}/>
            </div>
        )
    },
    componentDidMount : function(){
        setInterval(this.modifyData, 2000);
    },
    modifyData : function(){
        var newData = DataStore.generateSingleDataset(this.state.originalState[this.state.originalState.length-1], 3600000);
        var stackedSeries =  JSON.parse(JSON.stringify(this.state.myStackedSeries));
        var _oStackedSeries = {};
        //Obtain values
        for(var i = 0 ; i < newData.page.length; i++){
            _oStackedSeries[newData.page[i].title] = newData.page[i].count;
        }
        for(var i = 0 ; i < stackedSeries.length; i++){
            var newVal = _oStackedSeries[stackedSeries[i].text.toLowerCase()];
            stackedSeries[i].values = stackedSeries[i].values.slice(1);
            stackedSeries[i].values.push(newVal);
        }
        var _arr = this.state.myAreaValues.slice(1);
        _arr.push(newData.users);

        this.setState({
            myAreaValues :  _arr,
            myStackedSeries : stackedSeries,
            myMapSeries : generateMapValues(newData.location)
        })
    }
});

React.render(<App />, document.getElementById('container'));

function generateMapValues(aLocations){
    var _mapValues = {};
    var colors = ["#ededed", "#afffc8", "#73f05f", "#4aa320"]
    var sorted = aLocations.sort(function(a,b){
        return a.count - b.count;
    });
    var i = 0;
    var arr = split(sorted, 4);
    function split(a, n) {
        var len = a.length,out = [], i = 0;
        while (i < len) {
            var size = Math.ceil((len - i) / n--);
            out.push(a.slice(i, i + size));
            i += size;
        }
        return out;
    }

    for(var i = 0 ; i < arr.length; i++ ){
        for(var k = 0 ; k < arr[i].length; k++){
            _mapValues[arr[i][k].title.toUpperCase()] ={
                backgroundColor :colors[i]
            }
        }
    }
    return _mapValues;
}
