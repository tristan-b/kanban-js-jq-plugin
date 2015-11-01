/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, window, document, undefined ) {

    var pluginName = "Users";
    // Create the defaults once
    var defaults = {
            table: "Contacts.Employees",
            search: "KanbanUsers",
            fields: ["_login"]
        };

    // The actual plugin constructor
    function Users( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
   //     this._name = pluginName;

        this.init();
    }

    Users.prototype = {

        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).
            this.getUsers(this.options)
        },
        addUsersToSelect: function(userObjArr, selectEl){
            var el = $(selectEl);
            for(var i = 0; i < userObjArr.length; i++){
                el.append('<option value="'+userObjArr[i]._login+'">'+userObjArr[i]._login+'</option>');
            }
        },
        getUsers: function(settings) {
            var self = this;
            // some logic
            var fields = settings.fields.join("&field=")
            var url = "http://katara.techtime.org/ewws/EWSearch?"+
                      "$KB=CX1&$login=devadmin&$password=Chuffed1&"+
                      "$table="+settings.table+"&$lang=en&search="+settings.search+"&field="+fields;
            $.ajax(url, {
                success: function(message){
          //          logit(message);
                    var users = self.parseEwRestResponse(message);
                    self.addUsersToSelect(users, self.element);
              //      logit(users);
                }
            });
        },
        parseEwRestResponse: function (responseString) {
            var finalRecords = [];
            var lines = responseString.split("\n");
            var numRecs = lines.shift().split("=")[1];
            numRecs = parseInt(numRecs.replace("'", ""));
            //logit(numRecs);
            var fieldsPerRecord = parseInt(lines.length / numRecs);
            //logit("Fields per rec: "+fieldsPerRecord);
            var endNumericPadding = 2;
            
            for (var i = 0; i < numRecs; i++) {
            if(i > 9){
                endNumericPadding = 3;
            }
            if(i > 99){
                endNumericPadding = 4;
            }
            if(i > 999){
                endNumericPadding = 5;
            }
                var recObj = {};
                for (var f = 0; f < fieldsPerRecord; f++) {
                    var valsStr = lines.shift();
                    var vals = valsStr.split("=");
                    var fieldNameFirstTrim = vals[0].substr(7);
                    // logit(fieldNameFirstTrim);
                    var fieldNameFinal = fieldNameFirstTrim.substr(0, fieldNameFirstTrim.length - endNumericPadding);
                    //logit(fieldNameFinal);
                    recObj[fieldNameFinal] = vals[1].replace(/'/g, "").replace(";", "");
                }
                finalRecords.push(recObj);
            }
            return finalRecords;
//            for (var i = 0; i < lines.length; i++){
//                var keyVal = lines[i].split("=");
//                finalValues[keyVal[0]] = keyVal[1];
//            }
            //return finalValues;
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
$.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Users(this, options));
            }
        });
    };
})( $, window, document );