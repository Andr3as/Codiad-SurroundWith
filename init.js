/*
* Copyright (c) Codiad & Andr3as, distributed
* as-is and without warranty under the MIT License. 
* See [root]/license.md for more information. This information must remain intact.
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
    
        bindKeys : null,
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
            _this.bindKeys   = window.setInterval(function(){_this.setKeyBindings()},1000);
        },

        showInfo: function() {
            var os;
            if (navigator.platform.search("Win") != -1 || navigator.platform.search("Linux") != -1) {
                os = "win";
            } else {
                os = "mac";
            }
            codiad.modal.load(600,this.path+'dialog.php?os='+os);
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
            //codiad.editor.getActive().commands.addCommand(
            //    {name: 'Andi', bindKey: { win: 'Ctrl-Alt-T', mac: 'Command-T'},exec: function(e) {codiad.message.notice("Andi");}})
            var _this = this;
            if (codiad.editor.getActive() !== null) {
                //clear Interval
                window.clearInterval(_this.bindKeys);
                $.getJSON(_this.path+"keyBindings.json",
                    function(data) {
                        _this.keyArray = data;
                        _this.setKey("addDiv", function(e) {_this.addDiv();});
                        _this.setKey("addDoWhile", function(e) {_this.addDoWhile();});
                        _this.setKey("addIf", function(e) {_this.addIf();});
                        _this.setKey("addIfElse", function(e) {_this.addIfElse();});
                        _this.setKey("addFor", function(e) {_this.addFor();});
                        _this.setKey("addTry", function(e) {_this.addTry();});
                        _this.setKey("addWhile", function(e) {_this.addWhile();});
                    });
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
            var _this   = this;
            this.getSettings();
            var selText = codiad.editor.getSelectedText();
            var selStart= codiad.editor.getActive().getSelectionRange().start;
            // multi selection
            // ?Todo - rewrite - allow multiselection
            if (codiad.editor.getActive().inMultiSelectMode) {
                codiad.message.error("Multiselection is not supported!");
                return false;
            }
            
            var syntax  = $('#current-mode').text();
            var parts   = null;
            for (var tag in _this.tagArray) {
                if (tag === syntax) {
                    parts = _this.tagArray[tag];
                }
            }
            if (parts === null) {
                // syntax not defined, select default
                parts = _this.tagArray["default"];
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
            var tab     = _this.insertStartTab(selStart.column);
            if (selText.search("\r\n") != -1) {
                //Windows
                inText = pre + "\r\n" + tab + selText;
                inText = inText.replace(new RegExp("\r\n", "g"), "\r\n\t");
                inText += "\r\n" + tab + post;
            } else if (selText.search("\r") != -1) {
                //Mac
                inText = pre + "\r" + tab + selText;
                inText = inText.replace(new RegExp("\r", "g"), "\r\t");
                inText += "\r" + tab + post;
            } else {
                //Unix
                inText = pre + "\n" + tab + selText;
                inText = inText.replace(new RegExp("\n", "g"), "\n\t");
                inText += "\n" + tab + post;
            }
            //create space
            var space = "";
            for (var i = 0; i < _this.tabWidth; i++) {
                space += " ";
            }
            // Workaround to fix mixed tabs and spaces
            //and to replace "\t" with spaces if necessary
            if (_this.indentType == "tab") {
                inText  = inText.replace(new RegExp(space, "g"), "\t");
            } else {
                inText  = inText.replace(new RegExp("\t", "g"), space);
            }
            //insert Text
            codiad.editor.getActive().insert(inText);
            var msg = type.substr(0,1).toUpperCase() + type.substr(1,type.length);
            codiad.message.success(msg+" added");
            return true;
        },
        //getStartTabs
        insertStartTab: function(col) {
            var _this   = this;
            var str     = "";
            if (_this.indentType == "tab") {
                var rest = col % _this.tabWidth;
                var nTab = (col - rest) / _this.tabWidth;
                for (var j = 0; j < nTab; j++) {
                    str += '\t';
                }
                for (var k = 0; k < rest; k++) {
                    str += ' ';
                }
            } else {
                for (var i = 0; i < col; i++) {
                    str += " ";
                }
            }
            return str;
        }
    };
})(this, jQuery);