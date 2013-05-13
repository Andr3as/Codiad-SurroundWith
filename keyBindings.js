/*
* Copyright (c) Codiad & Andr3as, distributed
* as-is and without warranty under the MIT License. 
* See [root]/license.md for more information. This information must remain intact.
*/

var ed = codiad.editor.getActive().commands;
//addDiv            
ed.addCommand({
    name : "addDiv", 
    bindKey: {
        win: "Ctrl-Alt-D",
        mac: "Command-Alt-D"
    },
    exec: function(e) {
        codiad.SurroundWith.addDiv();
    }
});
//addDoWhile
ed.addCommand({
    name : "addDoWhile",
    bindKey: {
        win: "Ctrl-Alt-U",
        mac: "Command-Alt-U"
    },
    exec: function(e) {
        codiad.SurroundWith.addDoWhile();
    }
});
//addIf
ed.addCommand({
    name : "addIf", 
    bindKey: {
        win: "Ctrl-Alt-I",
        mac: "Command-Alt-I"
    },
    exec: function(e) {
        codiad.SurroundWith.addIf();
    }
});
//addIfElse
ed.addCommand({
    name : "addIfElse", 
    bindKey: {
        win: "Ctrl-Alt-E",
        mac: "Command-Alt-E"
    },
    exec: function(e) {
        codiad.SurroundWith.addIfElse();
    }
});
//addFor
ed.addCommand({
    name : "addFor", 
    bindKey: {
        win: "Ctrl-Alt-F",
        mac: "Command-Alt-F"
    },
    exec: function(e) {
        codiad.SurroundWith.addFor();
    }
});
//addTry
ed.addCommand({
    name : "addTry", 
    bindKey: {
        win: "Ctrl-Alt-T",
        mac: "Command-Alt-T"
    },
    exec: function(e) {
        codiad.SurroundWith.addTry();
    }
});
//addWhile
ed.addCommand({
    name : "addWhile", 
    bindKey: {
        win: "Ctrl-Alt-W",
        mac: "Command-Alt-W"
    },
    exec: function(e) {
        codiad.SurroundWith.addWhile();
    }
});