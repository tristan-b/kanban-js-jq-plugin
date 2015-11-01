// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;
(function ($, window, document, undefined) {
    "use strict";
    var states = {performer_state: [
            "Choose one",
            "Agreed",
            "Counter Offer",
            "Pending",
            "Declined",
            "Revoke No Agreement",
            "Requester Revoked",
            "Cancelled/Closed",
            "Completed"],
        requester_state: [
            "Open",
            "Assigned",
            "Agreed",
            "Counter Offer",
            "Agreed To Counter",
            "Accepted as Completed",
            "Pending",
            "Closed",
            "Cancelled/Closed",
            "Reassigned",
            "C/Offer Declined",
            "Declined",
            "Reject",
            "Revoke No Agreement",
            "New Assigned",
            "Completed"],
        state: [
            "Preparation",
            "Negotiation",
            "Performance",
            "Transition",
            "Pending",
            "Cancelled/Closed",
            "Rejected",
            "Revoke No Agreement",
            "Requester Revoked",
            "Completed",
            "Closed"
        ]};
    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).
    var dragCheck = false,
            self,
            $columnElems,
            cards;

    // Create the defaults once
    var pluginName = "Kanban",
            defaults = {
                user: "tribsupp",
                password: "Chuffed1",
                cols: ["Counter Offer", "Agreed", "Pending", "Declined", "Completed"],
                fields: ["summary", "performer_state", "description", "id", "state", "assigned_to"],
                table: "furniture",
                search: "Unclosed",
                columnField: "performer_state",
                autoColumns: "false",
                resizable: false
            };
    var events = {
        saveCardCb: function () {

        },
        cardClick: function () {

        },
        createCard: function () {

        },
        onCardClick: function () {

        },
        onColumnTitleClick: function () {

        },
        loadCards: function () {

        },
        setupColumns: function () {

        },
        setupColumnsComplete: function () {

        },
        loadColumns: function () {

        }

    };
    // The actual plugin constructor
    function Kanban(element, options) {
        self = this;
        this.element = element;
        // $ has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.columns = [];
        $.extend(events, options.events);
        this.init();

    }

    // Avoid Plugin.prototype conflicts
    $.extend(Kanban.prototype, {
        init: function () {

            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.settings).
            // self = this;

            this.form = {};
            this.form.summary = $("#summary");
            this.form.description = $("#description");
            // this.form.performer_state = $("#performer_state");
            this.form.assigned_to = $("#assigned_to");
            this.form.form = $("#edit");
            // this.form.form.find("fieldset").append(setupStateList(self.settings.columnField, states[self.settings.columnField]));
            this.setupDialog();
            if (this.settings.autoColumns === "false") {
                this.setupColumns(this.settings.cols);
            }
            if (typeof this.settings.cardSrcUrl != "undefined") {
                $.getJSON(this.settings.cardSrcUrl, {}, function () {

                });
            } else {
                this.makeCards(this.settings.cards);
            }
        },
        setupDialog: function () {
            this.dialog = $("#dialog").dialog({
                autoOpen: false,
                height: "800",
                width: "80%",
                modal: true,
                show: {
                    effect: "blind",
                    duration: 1000
                },
                hide: {
                    effect: "blind",
                    duration: 1000
                },
                title: "<- Edit Card ->",
                buttons: {
                    "Save Card": function () {
                        var id = $("#id").val();
//                        logit("Id: " + id);
                        var cardElem = $("#" + id + "");
                        //var card = cardElem.data("card");
                        //logit("Card Perf State: " + card.performer_state + " Perf State Field Val: " + $("#performer_state").val());
//                        if (card[self.settings.columnField]!== $("#"+self.settings.columnField+"").val()) {
//                            logit("Not equals states!");
//                            $("#" + card[self.settings.columnField] + "").append(cardElem.detach());
//                            cardElem.css({
//                                position: "relative",
//                                top: "0px",
//                                left: "0px"
//                            });
//                        }
                        self.saveCard(id, self.form.form, cardElem);
                        self.dialog.dialog("close");
                    },
                    Cancel: function () {
                        self.dialog.dialog("close");
                    }
                },
                close: function () {
                    $("form")[0].reset();
                    self.dialog.dialog("close");
                }
            });
        },
        /*
         * 
         */

        setupColumns: function (colsArr, preSetupCb, postSetupCb) {

            for (var i = 0; i < colsArr.length; i++) {
                var col = this.columns.push(this.makeColumn(colsArr[i]))
            }
            var colWidths = calcColumnWidths(colsArr.length);
            $(".kbstate").css({"width": colWidths + "px"});
        },
        makeColumn: function (title) {
            var self = this;
            var heading = $("<h1>" + title + "<a href='#' class='new'>+</a></h1>");
            heading.on("click", function () {
                var url = "https://katara.techtime.org/gui2/login.jsp?keyID=0&kb=CX1&";
                url += "user="+self.settings.user+"&passwd="+self.settings.password+"&";
                url += "State=New:furniture&table=furniture&gui=no&exiturl=";
                url += "http://dev.c5.co.nz/ewintegration/exit.html&";
                url += "field=description:preset%20from%20hotlinks";

                // document.getElementById("ewFrame").src = url;
//                    var iFrm = document.createElement("iframe");
                //                  $("#dialog").append(iFrm);
                // iFrm.src = url;
                // $("#dialog").empty().html("<iframe src='" + url + "' width='100%' height='100%'></iframe>");

           //     $("#ewFrame").attr("src", url);
                var xpos = (screen.availWidth - 600) / 2,
                        ypos = (screen.availHeight - 500) / 2,
                        size = "width=850,height=800" +
                        ",left=50,top=50" +
                        ",scrollbars=yes,toolbar=no,statusbar=no",
                        wnd_pop = window.open(url, '_blank', size);


//                self.dialog.dialog("open");
                // self.dialog.load(url);

            });
            var el = $("<li/>", {
                "class": "kbstate",
                id: title.replace(" ", "_")
            }).append(heading).appendTo(this.element);
            el.data("state", title);
            el.droppable({
                accept: ".card",
                drop: function (event, ui) {
                    var dropped = ui.draggable;
                    logit(dropped.data("card"));
                    // dropped.detach().appendTo(el);
//                    el.append(dropped.detach());
//                    dropped.css({"position": "relative", "top": "0px", "left": "0px"});
                    self.updateCard(dropped, el);
                    dragCheck = false;
                }
            }).resizable({
                start: function (event, ui){
                    
                },
                stop: function (event, ui){
                    
                }
            });

            return el;
        },
        makeCards: function (recordsArr) {
            // some logic
            var self = this;
            for (var i = 0; i < recordsArr.length; i++) {
                //logit("Record iteration #: "+i);
                self.makeCard(recordsArr[i]);
                //            console.log(recordsArr[i]);
            }

        },
        makeCard: function (card) {
            var self = this;
            var elem = $("<div/>", {
                "class": "card",
                id: card.id

            })
            elem.addClass("" + card._1880_full_name.replace(" ", "_") + "");

            elem.on("mouseup", function () {
                if (dragCheck === true) {
                    return;
                }
                var card = $(this).data("card");
                //self.loadExpandedCard(card);
                var url = $(this).find(".hotlink").data("link");
                // $("#ewFrame").attr("src", url);
                console.log(url);
                // document.getElementById("ewFrame").src = url;
//                    var iFrm = document.createElement("iframe");
                //                  $("#dialog").append(iFrm);
                // iFrm.src = url;
                //$("#dialog").empty().html("<iframe src='" + hl + "' width='100%' height='100%'></iframe>");
                //$("#dialog").dialog("open");
                //return false;
              //  $("#ewFrame").attr("src", hl);
                //    self.dialog.load(hl);
                //self.dialog.dialog("open");
                    var xpos = (screen.availWidth - 600) / 2,
                        ypos = (screen.availHeight - 500) / 2,
                        size = "width=850,height=800" +
                        ",left=50,top=50" +
                        ",scrollbars=yes,toolbar=no,statusbar=no",
                        wnd_pop = window.open(url, '_blank', size);

                //      self.dialog.dialog("open");
                //$(this).toggleClass("test");
            });
            var hotlink = "https://katara.techtime.org/gui2/login.jsp?keyID=0";
            hotlink += "&kb=CX1&user="+self.settings.user+"&passwd="+self.settings.password+"&State=Edit:furniture&";
            hotlink += "record=" + card.id + "&record_access=edit&gui=no&exiturl=http://dev.c5.co.nz/ewintegration/exit.html";
            for (var p in card) {
                if (card.hasOwnProperty(p) && p == "summary") {
                    elem.append("<p><a class='hotlink' data-link='" + hotlink + "' href='#'>" + card[p] + "</a></p>");
                }

                if (p == "_1880_full_name") {
                    elem.append("<p class='name'>" + card[p] + "</p>");
                }
            }
            if (typeof card[self.settings.columnField] !== "undefined") {
                $("#" + card[self.settings.columnField].replace(" ", "_") + "").append(elem);
                //            logit("State field: " + card[self.settings.columnField]);
            } else {

            }
            elem.data("card", card);

            elem.draggable({
                //    helper: "clone",
                helper: function () {
                    var helper = $("<div class='card'><p>" + card.summary + "</p></div>");

                    return helper;
                },
                appendTo: "body",
                start: function () {
                    elem.data("prev", elem.prev());
                    dragCheck = true;
                    // elem.prev(".card")
                }
            })
        },
        updateCard: function (elem, droppable) {
            var card = elem.data("card");
            var parent = elem.closest(".kbstate");
            // var state = parent.data("state");
            var state = droppable.data("state");
            var recId = card.id;
            var self = this;
//            logit("Id: " + recId + " State: " + state);
            var url = "https://katara.techtime.org/ewws/EWUpdate?$KB=CX1" +
                    "&$table=" + self.settings.table + "&$login=devadmin&$password=Chuffed1" +
                    "&$lang=en&id=" + recId + "&" + this.settings.columnField + "=" + state;
            $.ajax(url, {
                success: function (message) {
                    logit(message);
                },
                statusCode: {
                    404: function (ajax, statusText) {
                        elem.append("page not found");
                        var originalState = card[self.settings.columnField];
                        $("#" + originalState + "").append(elem);
                        elem.css({top: "0px", left: "0px", position: "pelative"});
                    },
                    400: function (ajax, statusText) {
                        // elem.append("<p>Error: " + ajax.responseText + "</p>");
                        var originalState = card[self.settings.columnField];
                        $("#" + originalState + "").append(elem);
                        elem.css({top: "0px", left: "0px", position: "pelative"});
                    },
                    200: function (message) {
                        if (state != parent.data("state")) {
                            droppable.append(elem.detach());
                            elem.css({"position": "relative", "top": "0px", "left": "0px"});
                        }
                    },
                    403: function (ajax, statusText) {
                        // elem.append("<p>Error: " + ajax.responseText + "</p>");
                        var originalState = card[self.settings.columnField];
                        droppable.insertAfter(droppable.data("prev"));
                        // $("#" + originalState + "").append(elem);
                        // elem.css({top: "0px", left: "0px", position: "pelative"});
                    },
                    408: function (ajax, statusText) {
                        // elem.append("<p>Error: " + ajax.responseText + "</p>");
                        var originalState = card[self.settings.columnField];
                        droppable.insertAfter(droppable.data("prev"));
                        // $("#" + originalState + "").append(elem);
                        // elem.css({top: "0px", left: "0px", position: "pelative"});
                    },
                    409: function (ajax, statusText) {
                        // elem.append("<p>Error: " + ajax.responseText + "</p>");
                        var originalState = card[self.settings.columnField];
                        droppable.insertAfter(droppable.data("prev"));
                        //$("#" + originalState + "").append(elem);
                        // elem.css({top: "0px", left: "0px", position: "pelative"});
                    },
                    500: function (ajax, statusText) {
                        // elem.append("<p>Error: " + ajax.responseText + "</p>");
                        var originalState = card[self.settings.columnField];
                        droppable.insertAfter(droppable.data("prev"));
                        //$("#" + originalState + "").append(elem);
                        //elem.css({top: "0px", left: "0px", position: "pelative"});
                    }

                }
            })
        },
        saveCard: function (id, form, elem) {
            var self = this;
            var card = elem.data("card");
            //card[self.settings.columnField] = form.find("#"+self.settings.columnField+"").val();
            // var parent = elem.closest(".kbstate");
            var url = "https://katara.techtime.org/ewws/EWUpdate?$KB=CX1" +
                    "&$table=" + self.settings.table + "&$login=devadmin&$password=Chuffed1" +
                    "&$lang=en&id=" + id;
            var newState = false;
            form.find("input, select, text").each(function (i, item) {
                var fname = $(this).attr("id");
                var val = $(this).val();
                if (fname == self.settings.columnField) {
                    //              logit("State field:"+fname+" State:"+val);
                    newState = val;
                }
                if (fname == "summary") {
                    elem.empty().append("<p>" + val + "</p>");
                }
                if (fname.search(/(date)/) && val != "") {
                    //var d =  Date.parse(val);
                    //console.log(d);
                    //val = d.toString('yyyy-M-d HH mm ss');
                }
                url += "&" + fname + "=" + encodeURIComponent(val);
            });
            logit(url);
//            var url = "https://katara.techtime.org/ewws/EWUpdate?$KB=CX1" +
//                    "&$table="+self.settings.table+"&$login=devadmin&$password=Chuffed1" +
//                    "&$lang=en&id=" + id + "&summary=" + encodeURIComponent(formFields.summary.val()) +
//                    "&description=" + encodeURIComponent(formFields.description.val()) +
//                    "&performer_state=" + encodeURIComponent(formFields.performer_state.val())+
//                    "&assigned_to="+encodeURIComponent(formFields.assigned_to);
            $.ajax(url, {
                success: function (message) {
                    //               logit(message);
                },
                statusCode: {
                    404: function (ajax, statusText) {
                        elem.append("page not found");
                        var originalState = card[self.settings.columnField];
                        $("#" + originalState + "").append(elem);
                        elem.css({top: "0px", left: "0px", position: "pelative"});
                    },
                    400: function (ajax, statusText) {
                        // elem.append("<p>Error: " + ajax.responseText + "</p>");
                        var originalState = card[self.settings.columnField];
                        $("#" + originalState + "").append(elem);
                        elem.css({top: "0px", left: "0px", position: "pelative"});
                    },
                    200: function (message) {
                        // droppable.append(elem.detach());
                        var stateCol = $("#" + self.settings.columnField + "").val();
                        logit("State col: " + self.settings.columnField);
                        $("#" + newState.replace(" ", "_") + "").append(elem);
                        ;
                        //     elem.css({"position": "relative", "top": "0px", "left": "0px"});
                    },
                    403: function (ajax, statusText) {
                        // elem.append("<p>Error: " + ajax.responseText + "</p>");
                        var originalState = card[self.settings.columnField];
                        $("#" + originalState + "").append(elem);
                        elem.css({top: "0px", left: "0px", position: "pelative"});
                    },
                    408: function (ajax, statusText) {
                        // elem.append("<p>Error: " + ajax.responseText + "</p>");
                        var originalState = card[self.settings.columnField];
                        $("#" + originalState + "").append(elem);
                        elem.css({top: "0px", left: "0px", position: "pelative"});
                    },
                    409: function (ajax, statusText) {
                        // elem.append("<p>Error: " + ajax.responseText + "</p>");
                        var originalState = card[self.settings.columnField];
                        $("#" + originalState + "").append(elem);
                        elem.css({top: "0px", left: "0px", position: "pelative"});
                    },
                    500: function (ajax, statusText) {
                        // elem.append("<p>Error: " + ajax.responseText + "</p>");
                        var originalState = card[self.settings.columnField];
                        $("#" + originalState + "").append(elem);
                        elem.css({top: "0px", left: "0px", position: "pelative"});
                    }

                }
            })
        },
        loadExpandedCard: function (card) {
            for (var i in card) {
                if (card.hasOwnProperty(i)) {
                    $("#" + i + "").val(card[i]);
                    //                logit("Prop: "+i+" Card val: "+card[i]+" Field val: "+$("#" + i + "").val());
                }
            }

        },
        destroy: function () {
            this.element.empty();
        }
    });
    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function (options) {
        return this.each(function () {
            // if (!$.data(this, "plugin_" + pluginName)) {
            $.data(this, "plugin_" + pluginName, new Kanban(this, options));
            //}else{
            // $.data(this, "plugin_" + pluginName);
            //}
        });
    };
    function calcColumnWidths(numColumns) {
        var contWidth = $("#main").width();
        var evenSplitWidth = contWidth / numColumns;
        return (evenSplitWidth - 10);
    }
    function setupStateList(listName, statesArr) {
        var selectStr = "<label for='" + listName + "' class='state_field'>" + listName + ":</label>";
        selectStr += "<select name='" + listName + "' id='" + listName + "' class='state_field'>";
        for (var i = 0; i < statesArr.length; i++) {
            selectStr += "<option value='" + statesArr[i] + "'>" + statesArr[i] + "</option>";
        }
        selectStr += "</select>";
        return selectStr;
    }
    function iterateRestLines(numRecs, restLinesArr) {
        var i = 0;
        var cards = [];
        while (i < numRecs) {
            var endNumericPadding = 2;

            if (i > (9)) {
                endNumericPadding = 3;
            }
            if (i > 99) {
                endNumericPadding = 4;
            }
            if (i > 999) {
                endNumericPadding = 5;
            }
            var rec = {};
            while (restLinesArr[0].search("/(_" + i + "=)/")) {
                var card = {};
                var lineKeyVal = restLinesArr.shift();
                var vals = lineKeyVal.split("=");
                var fieldNameFirstTrim = vals[0].substr(7);
                // logit(fieldNameFirstTrim);
                var fieldNameFinal = fieldNameFirstTrim.substr(0, fieldNameFirstTrim.length - endNumericPadding);
                if (vals[1]) {
                    rec[fieldNameFinal] = vals[1].replace(/'/g, "").replace(";", "");
                }
            }
            cards.push(rec);
        }
        return cards;
    }
    function calculateCardHeight(column) {

    }
    function option(name, value) {
        if (value === undefined) {
            return options[name];
        }
        if (name == 'height' || name == 'contentHeight' || name == 'aspectRatio') {
            options[name] = value;
            updateSize(true); // true = allow recalculation of height
        }
    }


    function trigger(name, thisObj) { // overrides the Emitter's trigger method :(
        var args = Array.prototype.slice.call(arguments, 2);

        thisObj = thisObj || _element;
        this.triggerWith(name, thisObj, args); // Emitter's method

        if (options[name]) {
            return options[name].apply(thisObj, args);
        }
    }
})($, window, document);
function closeDialog() {
    $("#dialog").dialog("close");
}