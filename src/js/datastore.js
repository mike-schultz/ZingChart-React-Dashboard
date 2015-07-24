
////////////////
//Pseudo Live Data Feed
////////////////
module.exports = {
    country : [['usa', 'can', 'mex','gbr', 'fra', 'rus', 'ind', 'deu', 'jpn', 'rou', 'aus', 'chn'],['arg','bel','bra','can','chi', 'dnk', 'egy', 'fin', 'fra', 'deu','gbr', 'grc', 'hun', 'isl', 'ind', 'irl','isr', 'ita','jpn', 'mex','nzl','nld','nga','pak','per','phl', 'pol', 'prt', 'qat','rou', 'zaf', 'kor','esp', 'swe', 'che', 'twn', 'tha','tur', 'are','usa', 'ven', 'vnm']],
    resolution : {
        day : 86400000,
        hour : 3600000,
        minute : 60000,
        fiveSeconds : 5000
    },
    generateFakeDataset : function(resolution){
        var numberOfUsers = getRandInt(50, 300);
        //Obtain a country at random.
        var maxNumCountries = getRandInt(4,20);
        //Setup the object to return
        var initialResult = {
            time  : 0,
            users : numberOfUsers,
            page : [
                {title : 'home', count : 0},
                {title : 'gallery', count : 0},
                {title : 'docs', count : 0},
                {title : 'contact', count : 0},
            ],
            location : []
        };
        //Setup locations array
        var oLocation = {};
        for(var i = 0 ; i < maxNumCountries; i++){
            oLocation[(( getRandInt(0,2) )? this.country[0][getRandInt(0,12)] : this.country[1][getRandInt(0,42)])] = 0;
        }
        for(entry in oLocation){
            initialResult.location.push({title : entry, count : 0});
        }
        for(var i = 0; i <numberOfUsers; i++ ){
            //Select a page
            var pageNum = getRandInt(0,initialResult.page.length);
            initialResult.page[pageNum].count++;

            //Select a location
            var locationNum = getRandInt(0,initialResult.location.length);
            initialResult.location[locationNum].count++;
        }
        //Generate a full set of data.
        var dataset = [initialResult];
        var lastResult = initialResult;
        for(var i = 0 ; i < 60; i++){
            var newData = this.generateSingleDataset(lastResult, this.resolution.hour);
            lastResult = newData;
            dataset.push(newData);
        }
        return dataset;
    },
    generateSingleDataset : function(previousData , resolution){
        var newData = JSON.parse(JSON.stringify(previousData));
        //Advance the time.
        newData.time += parseInt(resolution);
        //Return a state of no change.
        if(getRandInt(0,10) >= 7 ){
            return newData;
        }
        else{
            //Modify the users.
            var numToModify = getRandInt(0,10);
            this.modifyPageAndLocation(newData, numToModify, getRandBool());
            return newData;
        }
    },
    /**
    *  Modifies the count of users in a page, and location
    * resultObj - the object to modify the contents
    * numToModify - the number of entries to add or remove
    * bAdd - add or remove
    */
    modifyPageAndLocation : function(resultObj, numToModify, bAdd){
        if(resultObj.users < numToModify){
            return;
        }
        for(var i = 0; i < numToModify; i++ ){
            //Select a page
            var pageNum = getRandInt(0,resultObj.page.length);
            (bAdd)? resultObj.page[pageNum].count++ : resultObj.page[pageNum].count--;
            //Check if that was a safe removal. If not, retry.
            if(resultObj.page[pageNum].count < 0){
                resultObj.page[pageNum].count++;
                i--;
                continue;
            }
            //Select a location
            var locationNum = getRandInt(0,resultObj.location.length);
            //Possibly add a new location if its being added.
            if(bAdd){
                var bFound = false;
                var locationName = (( getRandInt(0,2) )? this.country[0][getRandInt(0,12)] : this.country[1][getRandInt(0,42)]);
                for(var i = 0 ; i < resultObj.location.length; i++){
                    if(resultObj.location[i].title == locationName){ bFound = !bFound};
                }
                //If there is no location that exists, and we randomly want to create one, then add it.
                if(!bFound && getRandBool()){
                    resultObj.location.push({title : locationName, count : 1});
                }
                else{
                    resultObj.location[locationNum].count++
                }
            }
            else{
                resultObj.location[locationNum].count--;
                //Check if that was a safe removal. If not, retry.
                if(resultObj.location[locationNum].count < 0){
                    resultObj.location[locationNum].count++;
                    i--;
                    continue;
                }
            }
        }
        //Modify the total user count
        resultObj.users = (bAdd)? resultObj.users + numToModify : resultObj.users - numToModify;

        if(getRandBool()){
            //Re-sort the user's page locations.
            for(var i = 0 ; i < resultObj.page.length;i++){
                resultObj.page[i].count = 0;
            }
            for(var i = 0 ; i < resultObj.users; i++){
                resultObj.page[getRandInt(0,4)].count++;
            }
        }
    }
};

function getRandInt(min, max){
    return parseInt(Math.floor( Math.random() * (max - min) ) + min);
}
function getRandBool(){
    return (getRandInt(0,10) <= 4);
}
