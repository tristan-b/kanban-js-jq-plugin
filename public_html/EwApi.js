var tb = tb || {};
tb = {};
var api = (function () {
    var apiConfig = {user: "",
        pass: "",
        apiurl: "",
        ewkb: "",
        fieldsArr: [],
        search: "",
        table: ""
    };
    var endPoints = {
        "search": "EWSearch",
        "create": "EWCreate",
        "update": "EWUpdate",
        "select": "EWSelect",
        "delete": "EWDelete"
    };

    function ajaxRequest(url, method, dataToPost) {
        var httpRequest;
        if (typeof ActiveXObject != 'undefined') {
            httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
        }
        else if (typeof XMLHttpRequest != 'undefined') {
            httpRequest = new XMLHttpRequest();
        }

        if (httpRequest) {
            httpRequest.open(method, url, false);
            if (method === "POST") {
                httpRequest.setRequestHeader(
                        'Content-Type', 'application/x-www-form-urlencoded');
                httpRequest.send(dataToPost);
            } else {
                httpRequest.send();
            }

            return httpRequest;
        }
        else {
            return void 0;
        }
    }
    function buildRequestUrl(action) {
        /*
         * http://localhost:8080/ewws/EWSearch?
         $KB=Demo&$login=admin&$password=qwerty&
         $table=case&$lang=en&search=Closed%20Cases&field=summary&field=priority
         */
        var apiAction = endPoints[action];

        var urlStr = apiConfig.apiurl + apiAction + "?"
        urlStr += "$KB=" + apiConfig.ewkb + "&$login=" + apiConfig.user + "&$password=" + apiConfig.pass + "&$table=" + apiConfig.table + "&$lang=en";
        return urlStr;
    }
    function parseEwRestResponse(responseString, fieldsArr) {
        var finalRecords = [];
        var lines = responseString.split(";\n");
        var numRecs = lines.shift().split("=")[1];
        numRecs = parseInt(numRecs.replace(/'/g, ""));
        logit("Num recs: " + numRecs);
        var endNumericPadding = 2;
        var i = 0;
        var recObj = {};
        while (i < numRecs) {
            if (i > (9)) {
                endNumericPadding = 3;
            }
            if (i > 99) {
                endNumericPadding = 4;
            }
            if (i > 999) {
                endNumericPadding = 5;
            }


            //if(lines[0].search('/(_'+i+'=)/')){
            // alert("True");
//            console.log("I: " + i);
            var valsStr = lines.shift();
            var vals = valsStr.split("=");

            var recNum = parseInt(vals[0].substr(vals[0].length - (endNumericPadding - 1)));
            if (recNum == i) {
//                logit("Still on same rec!");
                var fieldNameFirstTrim = vals[0].substr(7);
                // logit(fieldNameFirstTrim);
                var fieldNameFinal = fieldNameFirstTrim.substr(0, fieldNameFirstTrim.length - endNumericPadding);
                if (fieldNameFinal == "i") {
//                    logit("Padding: " + endNumericPadding);
                    logit("Final field name: " + fieldNameFinal + " I: " + i);
//                    logit(valsStr)
                }

                if (vals[1]) {
           //         logit("Final field name: " + fieldNameFinal + " I: " + i + "Val: " + vals[1]);
                    recObj[fieldNameFinal] = vals[1].replace(/'/g, "").replace(";", "");
                }
            } else {
           //     logit("Advancing record num");
                finalRecords.push(recObj);
                recObj = {};
                var fieldNameFirstTrim = vals[0].substr(7);
                // logit(fieldNameFirstTrim);
                var fieldNameFinal = fieldNameFirstTrim.substr(0, fieldNameFirstTrim.length - endNumericPadding);
                if (fieldNameFinal == "i") {
             //       logit("Padding: " + endNumericPadding);
           //         logit("Final field name: " + fieldNameFinal + " I: " + i);
           ////         logit(valsStr)
                }

                if (vals[1]) {
        //            logit("Final field name: " + fieldNameFinal + " I: " + i + "Val: " + vals[1]);
                    recObj[fieldNameFinal] = vals[1].replace(/'/g, "").replace(";", "");
                }
                i++;
            }

//                    }else{
//                        alert("Moing!");
//                        //break;
//                    }


        }
        return finalRecords;
//            for (var i = 0; i < lines.length; i++){
//                var keyVal = lines[i].split("=");
//                finalValues[keyVal[0]] = keyVal[1];
//            }
        //return finalValues;
    }
    function getFieldsAsArray() {
        var reformattedArray = apiConfig.fieldsArr.map(function (obj) {
            return obj.name;
        });
        return reformattedArray;
    }
    var example = "EWREST_length = '4';\n";
    example += "EWREST_id_0='355';\n";
    example += "EWREST_customer_login_0='admin';\n";
    example += "EWREST_type_0='Case\r\n';\n";
    example += "EWREST_id_1='117';\n";
    example += "EWREST_customer_login_1='johnl';\n";
    example += "EWREST_type_1='Case';\n";
    example += "EWREST_id_2='83';\n";
    example += "EWREST_customer_login_2='admin';\n";
    example += "EWREST_type_2='Case';\n";
    example += "EWREST_id_3='82';\n";
    example += "EWREST_customer_login_3='admin';\n";
    example += "EWREST_type_3='Case';\n";
    example += "EWREST_id_4='83';\n";
    example += "EWREST_customer_login_4='admin';\n";
    example += "EWREST_type_4='Case';\n";
    example += "EWREST_id_5='82';\n";
    example += "EWREST_customer_login_5='admin';\n";
    example += "EWREST_type_5='Case';\n";

    return{
        setupApi: function (configObj) {
            for (var i in configObj) {
                if (typeof apiConfig[i] != "undefined") {
                    apiConfig[i] = configObj[i];
                }
            }
            return this;
        },
        setCredentials: function (u, p) {
            apiConfig.user = u;
            apiConfig.pass = p;
        },
        setApiLocation: function (apiBaseUrl) {
            apiConfig.apiurl = apiBaseUrl;
        },
        setKb: function (kb) {
            apiConfig.ewkb = kb;
        },
        setTable: function (tableName) {
            apiConfig.table = tableName;
        },
        setSearch: function (searchName) {
            apiConfig.search = searchName;
        },
        addFields: function (fieldsArr) {
            for (var i = 0; i < fieldsArr.length; i++) {
                apiConfig.fields.push(fieldsArr[i]);
            }
        },
        resetFields: function () {
            apiConfig.fields.length = 0;
        },
        searchTable: function (searchObj) {
            var url = buildRequestUrl("search");
            //var fields = apiConfig.fieldsArr.join("&field=")
            var fieldsArr;
            if(typeof apiConfig.fieldsArr[0].name == "undefined"){
                fieldsArr = apiConfig.fieldsArr;
            }else{
                fieldsArr = getFieldsAsArray(); 
            }
            var fields = fieldsArr.join("&field=");
            url += "&search=" + apiConfig.search + "&field=" + fields;
            var ajaxReq = ajaxRequest(url, "GET");
            var recs = parseEwRestResponse(ajaxReq.responseText);
       //     console.log(recs);
            return recs;
            //callback.call(this, ajaxReq);
        },
        updateRecord: function (keyValsObject){
            var url = buildRequestUrl("update");
            for(var i in keyValsObject){
                if(keyValsObject.hasOwnProperty(i)){
                    url += "&"+encodeURIComponent(i)+"="+encodeURIComponent(keyValsObject[i]);
                }
            }
            console.log(url);
            var ajaxReq = ajaxRequest(url, "POST");
            console.log(ajaxReq);
            

        },
        test: function (testStr) {
            if (arguments.length > 0) {
                var res = parseEwRestResponse(example);
            } else {
                var res = parseEwRestResponse(example);
            }
        //    console.log(res);

            return res;
        }
    }
});
api.form = (function () {
    var fieldSettings = [],
        fieldElems = [],
        form;
    return{
        addConfig: function(configObj){
            
        },
        setupForm: function(){
            
        }
    }
} );
//var ew = new api();
//ew.setupApi({ewkb: "CX1", "user": "devadmin", "pass": "Chuffed1", "table": "furniture", "search": "OverdueAgreed",
//    "apiurl": "http://katara.techtime.org/ewws/", "fieldsArr" : ["summary", "description", "performer_state", "assigned_to"]});
//ew.searchTable();