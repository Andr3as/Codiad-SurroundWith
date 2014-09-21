/*
* Copyright (c) Codiad & Andr3as, distributed
* as-is and without warranty under the MIT License. 
* See http://opensource.org/licenses/MIT for more information. 
* This information must remain intact.
*/

(function(global, $){

    var codiad = global.codiad,
        scripts= document.getElementsByTagName('script'),
        path = scripts[scripts.length-1].src.split('?')[0],
        curpath = path.split('/').slice(0, -1).join('/')+'/';

    $(function() {
        codiad.SurroundWith.init();
    });

    codiad.SurroundWith = {
    
        tagArray : null,
        keyArray : null,
        path     : curpath,
        //Settings:
        indentType: "tab",
        tabWidth : 4,
    
        init: function() {
            var _this = this;
            $.getJSON(_this.path+"keywords.json",
                function(data) {
                    _this.tagArray = data;
                });
            $.getJSON(_this.path+"keyBindings.json",
                function(data) {
                    _this.keyArray = data;
                    amplify.subscribe("active.onOpen", function(){_this.setKeyBindings()});
                });
        },
        
        addDiv: function() {
            this.addStuff("div");
        },
        
        addDoWhile: function() {
            this.addStuff("dowhile");
        },
        
        addIf: function() {
            this.addStuff("if");
        },
        
        addIfElse: function() {
            this.addStuff("ifelse");
        },
        
        addFor: function() {
            this.addStuff("for");
        },
        
        addTry: function() {
            this.addStuff("try");
        },
        
        addWhile: function() {
            this.addStuff("while");
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Add key bindings
        //
        //////////////////////////////////////////////////////////
        setKeyBindings: function() {
            var _this = this;
            if (codiad.editor.getActive() !== null) {
                _this.setKey("addDiv", function(e) {_this.addDiv();});
                _this.setKey("addDoWhile", function(e) {_this.addDoWhile();});
                _this.setKey("addIf", function(e) {_this.addIf();});
                _this.setKey("addIfElse", function(e) {_this.addIfElse();});
                _this.setKey("addFor", function(e) {_this.addFor();});
                _this.setKey("addTry", function(e) {_this.addTry();});
                _this.setKey("addWhile", function(e) {_this.addWhile();});
            }
        },

        //////////////////////////////////////////////////////////
        //
        //  Set a command
        //
        //  Parameters:
        //
        //  keyName - {String} (name of the command - 
        //                          identical with name in keyBindings.json)
        //  execFunction - {Function} (function of the command)
        //
        //////////////////////////////////////////////////////////
        setKey: function(keyName, execFunction) {
            var _this = this;
            var ed = codiad.editor.getActive().commands;
            for (var i = 0; i < _this.keyArray.length; i++) {
                if (_this.keyArray[i].name == keyName) {
                    _this.keyArray[i].exec = execFunction;
                    ed.addCommand(_this.keyArray[i]);
                    return true;
                }
            }
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Get settings
        //
        //////////////////////////////////////////////////////////
        getSettings: function() {
			this.tabWidth	= codiad.editor.settings.tabSize;
			if (codiad.editor.settings.softTabs) {
				this.indentType     = "space";
            } else {
				this.indentType     = "tab";
			}
			
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Surround the selected text
        //
        //  Parameters:
        //
        //  type - {String} (Keyword for the surrounding content)
        //
        //////////////////////////////////////////////////////////
        addStuff: function(type) {
            var _this       = this;
            this.getSettings();
            var selection   = "";
            if (codiad.editor.getActive().inMultiSelectMode) {
                var multiRanges = codiad.editor.getActive().multiSelect.getAllRanges();
                var session     = codiad.editor.getActive().getSession();
                for (var i = 0; i < multiRanges.length; i++) {
                    selection = session.getTextRange(multiRanges[i]);
                    selection = this.insertType(selection, type, multiRanges[i]);
                    if (selection === false) {
                        return false;
                    }
                    session.replace(multiRanges[i], selection);
                }
            } else {
                selection   = codiad.editor.getSelectedText();
                var range   = codiad.editor.getActive().getSelectionRange();
                selection   = this.insertType(selection, type, range);
                if (selection === false) {
                    return false;
                }
                codiad.editor.getActive().insert(selection);
            }
            var msg = type.substr(0,1).toUpperCase() + type.substr(1,type.length);
            codiad.message.success(msg+" added");
            return true;
        },
        
        
        //////////////////////////////////////////////////////////
        //
        //  Surround selection with specific key word
        //
        //  Parameters:
        //
        //  sel - {String} - Selected text
        //  type - {String} (Keyword for the surrounding content)
        //  range - {Object} - Current selection range
        //
        //  Returns:
        //
        //  {boolean|string} Either false on failure or string with inserted type
        //
        //////////////////////////////////////////////////////////
        insertType: function(sel, type, range) {
            var syntax  = $('#current-mode').text();
            var parts   = null;
            for (var tag in this.tagArray) {
                if (tag === syntax) {
                    parts = this.tagArray[tag];
                }
            }
            if (parts === null) {
                // syntax not defined, select default
                parts = this.tagArray["default"];
            }
            
            // catch wrong key word
            if (typeof(parts[type]) === "undefined") {
                codiad.message.error("Requested type is not supported!");
                return false;
            }
            
            var pre     = parts[type].pre;
            var post    = parts[type].post;
            
            var inText  = "";
            //Insert tabs
            if (sel.search("\r\n") != -1) {
                //Windows
                inText = this.insertLineTab(sel, "\r\n", pre, post, range);
            } else if (sel.search("\r") != -1) {
                //Mac
                inText = this.insertLineTab(sel, "\r", pre, post, range);
            } else {
                //Unix
                inText = this.insertLineTab(sel, "\n", pre, post, range);
            }
            //create space
            var space = "";
            for (var i = 0; i < this.tabWidth; i++) {
                space += " ";
            }
            // Workaround to fix mixed tabs and spaces
            //and to replace "\t" with spaces if necessary
            if (this.indentType == "tab") {
                inText  = inText.replace(new RegExp(space, "g"), "\t");
            } else {
                inText  = inText.replace(new RegExp("\t", "g"), space);
            }
            //insert Text
            return inText;
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Insert one tab each line
        //
        //  Parameters:
        //
        //  sel - {String} - Selected text
        //  type - {String} - Line ending {\n,\r,\r\n}
        //  pre - {String} - String to add before selection
        //  post - {String} - String to add after selection
        //  range - {Object} - Current selection range
        //
        //////////////////////////////////////////////////////////
        insertLineTab: function(sel, type, pre, post, range) {
            var indent = "";
            var inText = "";
            if (this.indentType == "tab") {
                indent  = "\t";
            } else {
                for (var i = 0; i < this.tabWidth; i++) {
                    indent += " ";
                }
            }
            
            var selStart= range.start;
            var tab = this.getStartTab(selStart);
            
            inText = pre + type + tab + sel;
            inText = inText.replace(new RegExp(type, "g"), type+indent);
            inText += type + tab + post;
            return inText;
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Get the indentation of the start line
        //
        //  Parameters:
        //
        //  start - {Object} - Start of the selection
        //
        //////////////////////////////////////////////////////////
        getStartTab: function(start) {
            var str     = "";
            var line    = codiad.editor.getActive().getValue().split("\n")[start.row];
            var seq     = line.substring(0,start.column);
            var incTab  = 0;
            var incSpace = 0;
            for (var i = 0; i < seq.length; i++) {
                if (seq.charAt(i) == "\t") {
                    incTab++;
                } else if (seq.charAt(i) == " ") {
                    incSpace++;
                } else {
                    incSpace++;
                }
            }
            
            for (var j = 0; j < incTab; j++) {
                str += '\t';
            }
            for (var k = 0; k < incSpace; k++) {
                str += ' ';
            }
            return str;
        }
    };
})(this, jQuery);