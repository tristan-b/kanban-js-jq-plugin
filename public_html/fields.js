tb = tb || {};
tb.fields = (function () {

    var defaults = {
    }
    var fields = [
        {name: "id", type: "input", attributes: {size: 6, disabled: true}, label: "Id"},
        {name: "summary", type: "input", attributes: {size: 30}, label: "Summary"},
        {name: "description", type: "textarea", attributes: {rows: 5, cols: 29}, label: "Description"},
        {name: "assigned_to", type: "select", attributes: {}, label: "Assigned To"},
        {name: "performer_state", type: "select", attributes: {options: states.performer_state}, label: "Performer State"},
        {name: "requester_state", type: "select", attributes: {options: states.requester_state}, label: "Requester State"},
        {name: "provisional_agreed_date", type: "input", attributes: {size: 30}, label: "Provisional Date"},
        {name: "agreed_date", type: "input", attributes: {size: 30}, label: "Agreed Date"}/*,
        {name: "_1880_full_name", type: "input", attributes:{size:30, disabled:true}, label: "Full Name"}
*/

    ];
    var fieldElems = [];
    var plugin = this;
    function createOption(option) {
        var opt = new Option(option, option);
        return opt;
    }
    function setupSelectOpts(selectEl, optionsArr) {
        if (typeof optionsArr != "undefined" && optionsArr.length > 0) {
            for (var i = 0; i < optionsArr.length; i++) {
                selectEl.options[i] = createOption(optionsArr[i]);
            }
        }
        return selectEl;

    }
    function addAttribs(el, attribs) {
        for (var i in attribs) {
            if (attribs.hasOwnProperty(i) && typeof el[i] != "undefined") {
                el[i] = attribs[i];
            }
        }
        return el;
    }

    return{
        init: function (fieldObjectsArr, form) {
            for (var i = 0; i < fieldObjectsArr.length; i++) {
                var field = this.setupField(fieldObjectsArr[i]);
                $(form).find("fieldset").append(field);
            }
            // code goes here
        },
        setupLabel: function (fname, flabel) {
            var l = document.createElement("label");
            l.for = fname;
            l.innerHTML = flabel;
            return l;
        },
        setupInput: function (fieldObj) {
            // code goes here
            var inp = document.createElement("input");
            inp.name = fieldObj.name;
            inp.id = fieldObj.name;
            return inp;
        },
        setupSelect: function (fieldObj) {
            var sel = document.createElement("select");
            sel.name = fieldObj.name;
            sel.id = fieldObj.name;
            var finalSel = setupSelectOpts(sel, fieldObj.attributes.options);
            return finalSel;
            // code goes here
        },
        setupTextarea: function (fieldObj) {
            var txtArea = document.createElement("textarea");
            txtArea.name = fieldObj.name;
            txtArea.id = fieldObj.name;
            return txtArea;
        },
        setupRadio: function (fieldObj) {

        },
        setupField: function (fieldObj) {
            var f;
            switch (fieldObj.type) {
                case 'input' :
                    f = this.setupInput(fieldObj);
                    break;

                case 'select' :
                    f = this.setupSelect(fieldObj);
                    break;

                case 'textarea' :
                    f = this.setupTextarea(fieldObj);
                    break;

                case 'radio' :
                    f = this.setupRadio(fieldObj);
                    break;
            }
            var finalField = addAttribs(f, fieldObj.attributes);
//            for(var i in fieldObj.attributes){
//                if(f.hasOwnProperty(i)){
//                    f[i] = fieldObj.attributes[i];
//                }
//            }
            var l = this.setupLabel(fieldObj.name, fieldObj.label)
            var cont = document.createElement("div");
            cont.appendChild(l);
            cont.appendChild(finalField);
            fieldElems.push(finalField);
            return cont;
        },
        getFieldElements: function () {
            return fieldElems;
        },
        addFieldElement: function (fieldElem) {
            fieldElems.push(fieldElem);
        },
        getTestFields: function () {
            return fields;
        },
        loadRecordIntoForm: function (rec, formEl){
            
        }
    }
});
tb.users = (function () {

    return{
        getUsersArray: function (ewApi) {
            ewApi.setupApi({table: "Contacts.Employees",
                search: "KanbanUsers",
                fieldsArr: [{name: "_login", "name": "full_name"}]
            });
            var logins = ewApi.searchTable();
     //       console.log(logins);
            return logins;
        }
    }
});
//$(document).ready(function() {
//
//    // attach the plugin to an element
//    $('#element').pluginName({'foo': 'bar'});
//
//    // call a public method
//    $('#element').data('pluginName').foo_public_method();
//
//    // get the value of a property
//    $('#element').data('pluginName').settings.foo;
//
//});