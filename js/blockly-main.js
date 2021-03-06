/**
 * This file is part of the Touchdevelop project:
 * https://github.com/Microsoft/TouchDevelop/blob/c1a8ac1705b8a8a803a62520657527240c1b53b7/www/blockly/blocks-custom.js
 *
 * Copyright (c) 2016 Microsoft
 * Licensed under the MIT license, a copy which can be found in:
 *   https://github.com/Microsoft/TouchDevelop/blob/master/LICENSE
 *
 * It has been modified to work offline with a simple Blockly instance.
 */

var TDev;
(function (TDev) {
    var External;
    (function (External) {
        (function (MessageType) {
            MessageType[MessageType["Init"] = 0] = "Init";
            MessageType[MessageType["Metadata"] = 1] = "Metadata";
            MessageType[MessageType["MetadataAck"] = 2] = "MetadataAck";
            MessageType[MessageType["Save"] = 3] = "Save";
            MessageType[MessageType["SaveAck"] = 4] = "SaveAck";
            MessageType[MessageType["Compile"] = 5] = "Compile";
            MessageType[MessageType["CompileAck"] = 6] = "CompileAck";
            MessageType[MessageType["Merge"] = 7] = "Merge";
            MessageType[MessageType["Quit"] = 8] = "Quit";
            MessageType[MessageType["Upgrade"] = 9] = "Upgrade";
            MessageType[MessageType["Run"] = 10] = "Run";
            MessageType[MessageType["Resized"] = 11] = "Resized";
            MessageType[MessageType["NewBaseVersion"] = 12] = "NewBaseVersion";
            MessageType[MessageType["Load"] = 13] = "Load";
            MessageType[MessageType["TypeCheck"] = 14] = "TypeCheck";
            MessageType[MessageType["Help"] = 15] = "Help";
        })(External.MessageType || (External.MessageType = {}));
        var MessageType = External.MessageType;
        ;
        (function (Status) {
            Status[Status["Ok"] = 0] = "Ok";
            Status[Status["Error"] = 1] = "Error";
        })(External.Status || (External.Status = {}));
        var Status = External.Status;
        ;
        (function (SaveLocation) {
            SaveLocation[SaveLocation["Local"] = 0] = "Local";
            SaveLocation[SaveLocation["Cloud"] = 1] = "Cloud";
        })(External.SaveLocation || (External.SaveLocation = {}));
        var SaveLocation = External.SaveLocation;
        ;
        (function (Language) {
            Language[Language["TouchDevelop"] = 0] = "TouchDevelop";
            Language[Language["CPlusPlus"] = 1] = "CPlusPlus";
        })(External.Language || (External.Language = {}));
        var Language = External.Language;
    })(External = TDev.External || (TDev.External = {}));
})(TDev || (TDev = {}));
var B = Blockly;
var Helpers;
(function (Helpers) {
    function mkDigit(x) {
        return mkOp(x);
    }
    Helpers.mkDigit = mkDigit;
    function mkNumberLiteral(x) {
        return {
            nodeType: "numberLiteral",
            id: null,
            value: x
        };
    }
    Helpers.mkNumberLiteral = mkNumberLiteral;
    function mkBooleanLiteral(x) {
        return {
            nodeType: "booleanLiteral",
            id: null,
            value: x
        };
    }
    Helpers.mkBooleanLiteral = mkBooleanLiteral;
    function mkStringLiteral(x) {
        return {
            nodeType: "stringLiteral",
            id: null,
            value: x
        };
    }
    Helpers.mkStringLiteral = mkStringLiteral;
    function mkOp(x) {
        return {
            nodeType: "operator",
            id: null,
            op: x
        };
    }
    Helpers.mkOp = mkOp;
    var knownPropertyRefs = {
        "post to wall": "String",
        ":=": "Unknown",
    };
    ["=", "≠", "<", "≤", ">", "≥", "+", "-", "/", "*"].forEach(function (x) { return knownPropertyRefs[x] = "Number"; });
    ["and", "or", "not"].forEach(function (x) { return knownPropertyRefs[x] = "Boolean"; });
    function mkPropertyRef(x, p) {
        return {
            nodeType: "propertyRef",
            id: null,
            name: x,
            parent: mkTypeRef(p),
        };
    }
    Helpers.mkPropertyRef = mkPropertyRef;
    function mkCall(name, parent, args) {
        return {
            nodeType: "call",
            id: null,
            name: name,
            parent: parent,
            args: args,
        };
    }
    Helpers.mkCall = mkCall;
    var librarySymbol = "♻";
    var libraryName = "micro:bit";
    var librarySingleton = mkSingletonRef(librarySymbol);
    function mkSingletonRef(name) {
        return {
            nodeType: "singletonRef",
            id: null,
            name: name.toLowerCase(),
            type: mkTypeRef(name)
        };
    }
    function mkLibrary(name) {
        return mkCall(name, mkTypeRef(librarySymbol), [librarySingleton]);
    }
    Helpers.mkLibrary = mkLibrary;
    function stdCall(name, args) {
        return mkCall(name, mkTypeRef(libraryName), [mkLibrary(libraryName)].concat(args));
    }
    Helpers.stdCall = stdCall;
    function extensionCall(name, args) {
        return mkCall(name, mkTypeRef("call"), args);
    }
    Helpers.extensionCall = extensionCall;
    function mkNamespaceRef(lib, namespace) {
        return {
            nodeType: "singletonRef",
            id: null,
            libraryName: lib,
            name: namespace.toLowerCase(),
            type: mkTypeRef(namespace)
        };
    }
    function namespaceCall(namespace, name, args) {
        return mkCall(name, mkTypeRef(libraryName), [mkNamespaceRef(libraryName, namespace)].concat(args));
    }
    Helpers.namespaceCall = namespaceCall;
    function mathCall(name, args) {
        return mkCall(name, mkTypeRef("Math"), [mkSingletonRef("Math")].concat(args));
    }
    Helpers.mathCall = mathCall;
    function stringCall(name, args) {
        return mkCall(name, mkTypeRef("String"), args);
    }
    Helpers.stringCall = stringCall;
    function booleanCall(name, args) {
        return mkCall(name, mkTypeRef("Boolean"), args);
    }
    Helpers.booleanCall = booleanCall;
    function mkGlobalRef(name) {
        return mkCall(name, mkTypeRef("data"), [mkSingletonRef("data")]);
    }
    Helpers.mkGlobalRef = mkGlobalRef;
    function mkSimpleCall(p, args) {
        assert(knownPropertyRefs[p] != undefined);
        return mkCall(p, mkTypeRef(knownPropertyRefs[p]), args);
    }
    Helpers.mkSimpleCall = mkSimpleCall;
    function mkTypeRef(t) {
        return t;
    }
    Helpers.mkTypeRef = mkTypeRef;
    function mkLTypeRef(t) {
        return JSON.stringify({ o: t, l: libraryName });
    }
    Helpers.mkLTypeRef = mkLTypeRef;
    function mkGTypeRef(t) {
        return JSON.stringify({ g: t });
    }
    Helpers.mkGTypeRef = mkGTypeRef;
    function mkVarDecl(x, t) {
        return {
            nodeType: "data",
            id: null,
            name: x,
            type: t,
            comment: "",
            isReadonly: false,
            isTransient: true,
            isCloudEnabled: false,
        };
    }
    Helpers.mkVarDecl = mkVarDecl;
    function mkDef(x, t) {
        return {
            nodeType: "localDef",
            id: null,
            name: x,
            type: t,
            isByRef: false,
        };
    }
    Helpers.mkDef = mkDef;
    function mkLocalRef(x) {
        return {
            nodeType: "localRef",
            id: null,
            name: x,
            localId: null
        };
    }
    Helpers.mkLocalRef = mkLocalRef;
    function mkExprHolder(defs, tree) {
        return {
            nodeType: "exprHolder",
            id: null,
            tokens: null,
            tree: tree,
            locals: defs,
        };
    }
    Helpers.mkExprHolder = mkExprHolder;
    function mkExprStmt(expr) {
        return {
            nodeType: "exprStmt",
            id: null,
            expr: expr,
        };
    }
    Helpers.mkExprStmt = mkExprStmt;
    function mkInlineActions(actions, expr) {
        return {
            nodeType: "inlineActions",
            id: null,
            actions: actions,
            expr: expr,
        };
    }
    Helpers.mkInlineActions = mkInlineActions;
    function mkWhile(condition, body) {
        return {
            nodeType: "while",
            id: null,
            condition: condition,
            body: body
        };
    }
    Helpers.mkWhile = mkWhile;
    function mkFor(index, bound, body) {
        return {
            nodeType: "for",
            id: null,
            index: mkDef(index, mkTypeRef("Number")),
            body: body,
            bound: bound
        };
    }
    Helpers.mkFor = mkFor;
    function mkComment(text) {
        return {
            nodeType: "comment",
            id: null,
            text: text || ""
        };
    }
    Helpers.mkComment = mkComment;
    function mkSimpleIf(condition, thenBranch) {
        return {
            nodeType: "if",
            id: null,
            condition: condition,
            thenBody: thenBranch,
            elseBody: null,
            isElseIf: false,
        };
    }
    Helpers.mkSimpleIf = mkSimpleIf;
    function mkIf(condition, thenBranch, elseBranch) {
        var ifNode = mkSimpleIf(condition, thenBranch);
        var fitForFlattening = elseBranch.length && elseBranch.every(function (s, i) { return s.nodeType == "if" && (i == 0 || s.isElseIf); });
        if (fitForFlattening) {
            var first = elseBranch[0];
            assert(!first.isElseIf);
            first.isElseIf = true;
            return [ifNode].concat(elseBranch);
        }
        else {
            ifNode.elseBody = elseBranch;
            return [ifNode];
        }
    }
    Helpers.mkIf = mkIf;
    function mkAssign(x, e) {
        var assign = mkSimpleCall(":=", [x, e]);
        var expr = mkExprHolder([], assign);
        return mkExprStmt(expr);
    }
    Helpers.mkAssign = mkAssign;
    function mkDefAndAssign(x, t, e) {
        var def = mkDef(x, t);
        var assign = mkSimpleCall(":=", [mkLocalRef(x), e]);
        var expr = mkExprHolder([def], assign);
        return mkExprStmt(expr);
    }
    Helpers.mkDefAndAssign = mkDefAndAssign;
    function mkInlineAction(body, isImplicit, reference, inParams, outParams) {
        if (inParams === void 0) { inParams = []; }
        if (outParams === void 0) { outParams = []; }
        return {
            nodeType: "inlineAction",
            id: null,
            body: body,
            inParameters: inParams,
            outParameters: outParams,
            locals: null,
            reference: reference,
            isImplicit: isImplicit,
            isOptional: false,
            capturedLocals: [],
            allLocals: [],
        };
    }
    Helpers.mkInlineAction = mkInlineAction;
    function mkAction(name, body, inParams, outParams) {
        if (inParams === void 0) { inParams = []; }
        if (outParams === void 0) { outParams = []; }
        return {
            nodeType: "action",
            id: null,
            name: name,
            body: body,
            inParameters: inParams,
            outParameters: outParams,
            isPrivate: false,
            isOffline: false,
            isQuery: false,
            isTest: false,
            isAsync: true,
            description: "Action converted from a Blockly script",
        };
    }
    Helpers.mkAction = mkAction;
    function mkApp(name, description, decls) {
        return {
            nodeType: "app",
            id: null,
            textVersion: "v2.2,js,ctx,refs,localcloud,unicodemodel,allasync,upperplex",
            jsonVersion: "v0.1,resolved",
            name: name,
            comment: description,
            autoIcon: "",
            autoColor: "",
            platform: "current",
            isLibrary: false,
            useCppCompiler: false,
            showAd: false,
            hasIds: false,
            rootId: "TODO",
            decls: decls,
            deletedDecls: [],
        };
    }
    Helpers.mkApp = mkApp;
})(Helpers || (Helpers = {}));
var H = Helpers;
function append(a1, a2) {
    a1.push.apply(a1, a2);
}
function assert(x) {
    if (!x)
        throw new Error("Assertion failure");
}
function throwBlockError(msg, block) {
    var e = new Error(msg);
    e.block = block;
    throw e;
}
var Errors;
(function (Errors) {
    var errors = [];
    function report(m, b) {
        errors.push({ msg: m, block: b });
    }
    Errors.report = report;
    function clear() {
        errors = [];
    }
    Errors.clear = clear;
    function get() {
        return errors;
    }
    Errors.get = get;
})(Errors || (Errors = {}));
var Type;
(function (Type) {
    Type[Type["Number"] = 1] = "Number";
    Type[Type["Boolean"] = 2] = "Boolean";
    Type[Type["String"] = 3] = "String";
    Type[Type["Image"] = 4] = "Image";
    Type[Type["Unit"] = 5] = "Unit";
    Type[Type["Sprite"] = 6] = "Sprite";
})(Type || (Type = {}));
;
function toType(t) {
    switch (t) {
        case "String":
            return 3 /* String */;
        case "Number":
            return 1 /* Number */;
        case "Boolean":
            return 2 /* Boolean */;
        case "image":
            return 4 /* Image */;
        case "sprite":
            return 6 /* Sprite */;
        default:
            throw new Error("Unknown type");
    }
}
function toTdType(t) {
    switch (t) {
        case 1 /* Number */:
            return H.mkTypeRef("Number");
        case 2 /* Boolean */:
            return H.mkTypeRef("Boolean");
        case 3 /* String */:
            return H.mkTypeRef("String");
        case 4 /* Image */:
            return H.mkLTypeRef("Image");
        case 6 /* Sprite */:
            return H.mkLTypeRef("Led Sprite");
        default:
            throw new Error("Cannot convert unit");
    }
}
function typeToString(t) {
    switch (t) {
        case 1 /* Number */:
            return "Number";
        case 2 /* Boolean */:
            return "Boolean";
        case 3 /* String */:
            return "String";
        case 4 /* Image */:
            return "Image";
        case 6 /* Sprite */:
            return "Sprite";
        case 5 /* Unit */:
            throw new Error("Should be forbidden by Blockly");
    }
}
var Point = (function () {
    function Point(link, type) {
        this.link = link;
        this.type = type;
    }
    return Point;
})();
function find(p) {
    if (p.link)
        return find(p.link);
    else
        return p;
}
function union(p1, p2) {
    p1 = find(p1);
    p2 = find(p2);
    assert(p1.link == null && p2.link == null);
    if (p1 == p2)
        return;
    var t = unify(p1.type, p2.type);
    p1.link = p2;
    p1.type = null;
    p2.type = t;
}
function mkPoint(t) {
    return new Point(null, t);
}
var pNumber = mkPoint(1 /* Number */);
var pBoolean = mkPoint(2 /* Boolean */);
var pString = mkPoint(3 /* String */);
var pImage = mkPoint(4 /* Image */);
var pUnit = mkPoint(5 /* Unit */);
var pSprite = mkPoint(6 /* Sprite */);
function ground(t) {
    switch (t) {
        case 1 /* Number */:
            return pNumber;
        case 2 /* Boolean */:
            return pBoolean;
        case 3 /* String */:
            return pString;
        case 4 /* Image */:
            return pImage;
        case 6 /* Sprite */:
            return pSprite;
        case 5 /* Unit */:
            return pUnit;
        default:
            return mkPoint(null);
    }
}
function returnType(e, b) {
    assert(b != null);
    if (b.type == "placeholder")
        return find(b.p);
    if (b.type == "variables_get")
        return find(lookup(e, b.getFieldValue("VAR")).type);
    assert(!b.outputConnection || b.outputConnection.check_ && b.outputConnection.check_.length > 0);
    if (!b.outputConnection)
        return ground(5 /* Unit */);
    return ground(toType(b.outputConnection.check_[0]));
}
function unify(t1, t2) {
    if (t1 == null)
        return t2;
    else if (t2 == null)
        return t1;
    else if (t1 == t2)
        return t1;
    else
        throw new Error("cannot mix " + typeToString(t1) + " with " + typeToString(t2));
}
function mkPlaceholderBlock() {
    return {
        type: "placeholder",
        p: mkPoint(null),
        workspace: Blockly.mainWorkspace,
    };
}
function attachPlaceholderIf(b, n) {
    if (!b.getInputTargetBlock(n)) {
        var i = b.inputList.filter(function (x) { return x.name == n; })[0];
        assert(i != null);
        i.connection.targetConnection = new B.Connection(mkPlaceholderBlock(), 0);
    }
}
function removeAllPlaceholders(w) {
    w.getAllBlocks().forEach(function (b) {
        b.inputList.forEach(function (i) {
            if (i.connection && i.connection.targetBlock() != null && i.connection.targetBlock().type == "placeholder")
                i.connection.targetConnection = null;
        });
    });
}
function unionParam(e, b, n, p) {
    try {
        attachPlaceholderIf(b, n);
        union(returnType(e, b.getInputTargetBlock(n)), p);
    }
    catch (e) {
        throwBlockError("The parameter " + n + " of this block is of the wrong type. More precisely: " + e, b);
    }
}
function infer(e, w) {
    w.getAllBlocks().forEach(function (b) {
        try {
            switch (b.type) {
                case "math_op2":
                    unionParam(e, b, "x", ground(1 /* Number */));
                    unionParam(e, b, "y", ground(1 /* Number */));
                    break;
                case "math_op3":
                    unionParam(e, b, "x", ground(1 /* Number */));
                    break;
                case "math_arithmetic":
                case "logic_compare":
                    switch (b.getFieldValue("OP")) {
                        case "ADD":
                        case "MINUS":
                        case "MULTIPLY":
                        case "DIVIDE":
                        case "LT":
                        case "LTE":
                        case "GT":
                        case "GTE":
                        case "POWER":
                            unionParam(e, b, "A", ground(1 /* Number */));
                            unionParam(e, b, "B", ground(1 /* Number */));
                            break;
                        case "AND":
                        case "OR":
                            unionParam(e, b, "A", ground(2 /* Boolean */));
                            unionParam(e, b, "B", ground(2 /* Boolean */));
                            break;
                        case "EQ":
                        case "NEQ":
                            attachPlaceholderIf(b, "A");
                            attachPlaceholderIf(b, "B");
                            var p1 = returnType(e, b.getInputTargetBlock("A"));
                            var p2 = returnType(e, b.getInputTargetBlock("B"));
                            try {
                                union(p1, p2);
                            }
                            catch (e) {
                                throwBlockError("Comparing objects of different types", b);
                            }
                            var t = find(p1).type;
                            if (t != 3 /* String */ && t != 2 /* Boolean */ && t != 1 /* Number */ && t != null)
                                throwBlockError("I can only compare strings, booleans and numbers", b);
                            break;
                    }
                    break;
                case "logic_operation":
                    unionParam(e, b, "A", ground(2 /* Boolean */));
                    unionParam(e, b, "B", ground(2 /* Boolean */));
                    break;
                case "logic_negate":
                    unionParam(e, b, "BOOL", ground(2 /* Boolean */));
                    break;
                case "controls_if":
                    for (var i = 0; i <= b.elseifCount_; ++i)
                        unionParam(e, b, "IF" + i, ground(2 /* Boolean */));
                    break;
                case "controls_simple_for":
                    unionParam(e, b, "TO", ground(1 /* Number */));
                    break;
                case "text_print":
                    unionParam(e, b, "TEXT", ground(3 /* String */));
                    break;
                case "variables_set":
                case "variables_change":
                    var x = b.getFieldValue("VAR");
                    var p1 = lookup(e, x).type;
                    attachPlaceholderIf(b, "VALUE");
                    var rhs = b.getInputTargetBlock("VALUE");
                    if (rhs) {
                        var tr = returnType(e, rhs);
                        try {
                            union(p1, tr);
                        }
                        catch (e) {
                            throwBlockError("Assigning a value of the wrong type to variable " + x, b);
                        }
                    }
                    break;
                case "device_comment":
                    unionParam(e, b, "comment", ground(3 /* String */));
                    break;
                case "controls_repeat_ext":
                    unionParam(e, b, "TIMES", ground(1 /* Number */));
                    break;
                case "device_while":
                    unionParam(e, b, "COND", ground(2 /* Boolean */));
                    break;
                default:
                    if (b.type in stdCallTable) {
                        stdCallTable[b.type].args.forEach(function (p) {
                            if (p.field && !b.getFieldValue(p.field)) {
                                var i = b.inputList.filter(function (i) { return i.name == p.field; })[0];
                                var t = toType(i.connection.check_[0]);
                                unionParam(e, b, p.field, ground(t));
                            }
                        });
                        return compileStdCall(e, b, stdCallTable[b.type]);
                    }
            }
        }
        catch (e) {
            if (e.block)
                Errors.report(e + "", e.block);
            else
                Errors.report(e + "", b);
        }
    });
    e.bindings.forEach(function (b) {
        if (find(b.type).type == null)
            union(b.type, ground(1 /* Number */));
    });
}
function extractNumber(b) {
    var v = b.getFieldValue("NUM");
    if (!v.match(/\d+/)) {
        Errors.report(v + " is not a valid numeric value", b);
        return 0;
    }
    else {
        var i = parseInt(v);
        if (i >> 0 != i) {
            Errors.report(v + " is either too big or too small", b);
            return 0;
        }
        return parseInt(v);
    }
}
function compileNumber(e, b) {
    return H.mkNumberLiteral(extractNumber(b));
}
var opToTok = {
    "ADD": "+",
    "MINUS": "-",
    "MULTIPLY": "*",
    "DIVIDE": "/",
    "LT": "<",
    "LTE": "≤",
    "GT": ">",
    "GTE": "≥",
    "AND": "and",
    "OR": "or",
    "EQ": "=",
    "NEQ": "≠",
};
function compileArithmetic(e, b) {
    var bOp = b.getFieldValue("OP");
    var left = b.getInputTargetBlock("A");
    var right = b.getInputTargetBlock("B");
    var args = [compileExpression(e, left), compileExpression(e, right)];
    var t = returnType(e, left).type;
    if (t == 3 /* String */) {
        if (bOp == "EQ")
            return H.stringCall("equals", args);
        else if (bOp == "NEQ")
            return H.booleanCall("not", [H.stringCall("equals", args)]);
    }
    else if (t == 2 /* Boolean */) {
        if (bOp == "EQ")
            return H.booleanCall("equals", args);
        else if (bOp == "NEQ")
            return H.booleanCall("not", [H.booleanCall("equals", args)]);
        else if (bOp == "AND" || bOp == "OR")
            return H.mkSimpleCall(opToTok[bOp], args);
    }
    if (bOp == "POWER") {
        return H.mathCall("pow", args);
    }
    else {
        assert(bOp in opToTok);
        return H.mkSimpleCall(opToTok[bOp], args);
    }
}
function compileMathOp2(e, b) {
    var op = b.getFieldValue("op");
    var x = compileExpression(e, b.getInputTargetBlock("x"));
    var y = compileExpression(e, b.getInputTargetBlock("y"));
    return H.mathCall(op, [x, y]);
}
function compileMathOp3(e, b) {
    var x = compileExpression(e, b.getInputTargetBlock("x"));
    return H.mathCall("abs", [x]);
}
function compileVariableGet(e, b) {
    var name = b.getFieldValue("VAR");
    var binding = lookup(e, name);
    assert(binding != null && binding.type != null);
    return H.mkLocalRef(name);
}
function compileText(e, b) {
    return H.mkStringLiteral(b.getFieldValue("TEXT"));
}
function compileBoolean(e, b) {
    return H.mkBooleanLiteral(b.getFieldValue("BOOL") == "TRUE");
}
function compileNot(e, b) {
    var expr = compileExpression(e, b.getInputTargetBlock("BOOL"));
    return H.mkSimpleCall("not", [expr]);
}
function compileRandom(e, b) {
    return H.mathCall("random", [H.mkNumberLiteral(parseInt(b.getFieldValue("limit")) + 1)]);
}
function defaultValueForType(t) {
    if (t.type == null) {
        union(t, ground(1 /* Number */));
        t = find(t);
    }
    switch (t.type) {
        case 2 /* Boolean */:
            return H.mkBooleanLiteral(false);
        case 1 /* Number */:
            return H.mkNumberLiteral(0);
        case 3 /* String */:
            return H.mkStringLiteral("");
        case 4 /* Image */:
            return H.namespaceCall("image", "create image", [H.mkStringLiteral("")]);
        case 6 /* Sprite */:
            return H.namespaceCall("game", "invalid sprite", []);
    }
    throw new Error("No default value for type");
}
function compileNote(e, b) {
    var note = b.type.match(/^device_note_([A-G])/)[1];
    return H.namespaceCall("music", "note", [H.mkStringLiteral(note)]);
}
function compileDuration(e, b) {
    var matches = b.type.match(/^device_duration_1\/(\d+)/);
    if (matches)
        return H.mkSimpleCall("/", [
            H.namespaceCall("music", "tempo", []),
            H.mkNumberLiteral(parseInt(matches[1]))
        ]);
    else
        return H.namespaceCall("music", "tempo", []);
}
function compileBeat(e, b) {
    var matches = b.getFieldValue("fraction").match(/^1\/(\d+)/);
    if (matches)
        return H.mkSimpleCall("/", [
            H.namespaceCall("music", "beat", []),
            H.mkNumberLiteral(parseInt(matches[1]))
        ]);
    else
        return H.namespaceCall("music", "beat", []);
}
function compileExpression(e, b) {
    assert(b != null);
    if (b.disabled || b.type == "placeholder")
        return defaultValueForType(returnType(e, b));
    if (b.type.match(/^device_note_/))
        return compileNote(e, b);
    if (b.type.match(/^device_duration_/))
        return compileDuration(e, b);
    switch (b.type) {
        case "math_number":
            return compileNumber(e, b);
        case "math_op2":
            return compileMathOp2(e, b);
        case "math_op3":
            return compileMathOp3(e, b);
        case "device_random":
            return compileRandom(e, b);
        case "math_arithmetic":
        case "logic_compare":
        case "logic_operation":
            return compileArithmetic(e, b);
        case "logic_boolean":
            return compileBoolean(e, b);
        case "logic_negate":
            return compileNot(e, b);
        case "variables_get":
            return compileVariableGet(e, b);
        case "text":
            return compileText(e, b);
        case 'device_build_image':
            return compileImage(e, b, false, "image", "create image");
        case 'device_build_big_image':
            return compileImage(e, b, true, "image", "create image");
        case 'game_sprite_property':
            return compileStdCall(e, b, stdCallTable["game_sprite_" + b.getFieldValue("property")]);
        case 'device_beat':
            return compileBeat(e, b);
        default:
            if (b.type in stdCallTable)
                return compileStdCall(e, b, stdCallTable[b.type]);
            else {
                console.error("Unable to compile expression: " + b.type);
                return defaultValueForType(returnType(e, b));
            }
    }
}
function isCompiledAsForIndex(b) {
    return b.usedAsForIndex && !b.incompatibleWithFor;
}
function extend(e, x, t) {
    assert(lookup(e, x) == null);
    return {
        bindings: [{ name: x, type: ground(t), usedAsForIndex: 0 }].concat(e.bindings)
    };
}
function lookup(e, n) {
    for (var i = 0; i < e.bindings.length; ++i)
        if (e.bindings[i].name == n)
            return e.bindings[i];
    return null;
}
function fresh(e, s) {
    var i = 0;
    var unique = s;
    while (lookup(e, unique) != null)
        unique = s + i++;
    return unique;
}
var empty = {
    bindings: []
};
function compileControlsIf(e, b) {
    var stmts = [];
    for (var i = 0; i <= b.elseifCount_; ++i) {
        var cond = compileExpression(e, b.getInputTargetBlock("IF" + i));
        var thenBranch = compileStatements(e, b.getInputTargetBlock("DO" + i));
        stmts.push(H.mkSimpleIf(H.mkExprHolder([], cond), thenBranch));
        if (i > 0)
            stmts[stmts.length - 1].isElseIf = true;
    }
    if (b.elseCount_) {
        stmts[stmts.length - 1].elseBody = compileStatements(e, b.getInputTargetBlock("ELSE"));
    }
    return stmts;
}
function isClassicForLoop(b) {
    if (b.type == "controls_simple_for") {
        return true;
    }
    else if (b.type == "controls_for") {
        var bBy = b.getInputTargetBlock("BY");
        var bFrom = b.getInputTargetBlock("FROM");
        return bBy.type.match(/^math_number/) && extractNumber(bBy) == 1 && bFrom.type.match(/^math_number/) && extractNumber(bFrom) == 0;
    }
    else {
        throw new Error("Invalid argument: isClassicForLoop");
    }
}
function compileControlsFor(e, b) {
    var bVar = b.getFieldValue("VAR");
    var bTo = b.getInputTargetBlock("TO");
    var bDo = b.getInputTargetBlock("DO");
    var binding = lookup(e, bVar);
    assert(binding.usedAsForIndex > 0);
    if (isClassicForLoop(b) && !binding.incompatibleWithFor)
        return [
            H.mkFor(bVar, H.mkExprHolder([], H.mkSimpleCall("+", [compileExpression(e, bTo), H.mkNumberLiteral(1)])), compileStatements(e, bDo))
        ];
    else {
        var local = fresh(e, "bound");
        e = extend(e, local, 1 /* Number */);
        var eLocal = H.mkLocalRef(local);
        var eTo = compileExpression(e, bTo);
        var eVar = H.mkLocalRef(bVar);
        var eBy = H.mkNumberLiteral(1);
        var eFrom = H.mkNumberLiteral(0);
        return [
            H.mkAssign(eLocal, eTo),
            H.mkAssign(eVar, eFrom),
            H.mkWhile(H.mkExprHolder([], H.mkSimpleCall("≤", [eVar, eLocal])), compileStatements(e, bDo).concat([
                H.mkExprStmt(H.mkExprHolder([], H.mkSimpleCall(":=", [eVar, H.mkSimpleCall("+", [eVar, eBy])])))
            ])),
        ];
    }
}
function compileControlsRepeat(e, b) {
    var bound = compileExpression(e, b.getInputTargetBlock("TIMES"));
    var body = compileStatements(e, b.getInputTargetBlock("DO"));
    var valid = function (x) { return !lookup(e, x) || !isCompiledAsForIndex(lookup(e, x)); };
    var name = "i";
    for (var i = 0; !valid(name); i++)
        name = "i" + i;
    return H.mkFor(name, H.mkExprHolder([], bound), body);
}
function compileWhile(e, b) {
    var cond = compileExpression(e, b.getInputTargetBlock("COND"));
    var body = compileStatements(e, b.getInputTargetBlock("DO"));
    return H.mkWhile(H.mkExprHolder([], cond), body.concat([
        H.mkExprStmt(H.mkExprHolder([], H.stdCall("pause", [H.mkNumberLiteral(20)])))
    ]));
}
function compileForever(e, b) {
    var bBody = b.getInputTargetBlock("HANDLER");
    var body = compileStatements(e, bBody);
    return mkCallWithCallback(e, "basic", "forever", [], body);
}
function compilePrint(e, b) {
    var text = compileExpression(e, b.getInputTargetBlock("TEXT"));
    return H.mkExprStmt(H.mkExprHolder([], H.mkSimpleCall("post to wall", [text])));
}
function compileSet(e, b) {
    var bVar = b.getFieldValue("VAR");
    var bExpr = b.getInputTargetBlock("VALUE");
    var binding = lookup(e, bVar);
    var expr = compileExpression(e, bExpr);
    var ref = H.mkLocalRef(bVar);
    return H.mkExprStmt(H.mkExprHolder([], H.mkSimpleCall(":=", [ref, expr])));
}
function compileChange(e, b) {
    var bVar = b.getFieldValue("VAR");
    var bExpr = b.getInputTargetBlock("VALUE");
    var binding = lookup(e, bVar);
    var expr = compileExpression(e, bExpr);
    var ref = H.mkLocalRef(bVar);
    return H.mkExprStmt(H.mkExprHolder([], H.mkSimpleCall(":=", [ref, H.mkSimpleCall("+", [ref, expr])])));
}
function compileStdCall(e, b, func) {
    var args = func.args.map(function (p) {
        var lit = p.literal;
        if (lit)
            return lit instanceof String ? H.mkStringLiteral(lit) : H.mkNumberLiteral(lit);
        var f = b.getFieldValue(p.field);
        if (f)
            return H.mkStringLiteral(f);
        else
            return compileExpression(e, b.getInputTargetBlock(p.field));
    });
    if (func.isExtensionMethod) {
        return H.extensionCall(func.f, args);
    }
    else if (func.namespace) {
        return H.namespaceCall(func.namespace, func.f, args);
    }
    else {
        return H.stdCall(func.f, args);
    }
}
function compileStdBlock(e, b, f) {
    return H.mkExprStmt(H.mkExprHolder([], compileStdCall(e, b, f)));
}
function compileComment2(e, b) {
    return H.mkComment(b.getFieldValue("comment"));
}
function compileComment(e, b) {
    var arg = compileExpression(e, b.getInputTargetBlock("comment"));
    assert(arg.nodeType == "stringLiteral");
    return H.mkComment(arg.value);
}
function mkCallWithCallback(e, n, f, args, body) {
    var def = H.mkDef("_body_", H.mkGTypeRef("Action"));
    return H.mkInlineActions([H.mkInlineAction(body, true, def)], H.mkExprHolder([def], H.namespaceCall(n, f, args)));
}
function compileEvent(e, b, event, args, ns) {
    if (ns === void 0) { ns = "input"; }
    var bBody = b.getInputTargetBlock("HANDLER");
    var compiledArgs = args.map(function (arg) {
        return H.mkStringLiteral(b.getFieldValue(arg));
    });
    var body = compileStatements(e, bBody);
    return mkCallWithCallback(e, ns, event, compiledArgs, body);
}
function compileNumberEvent(e, b, event, args, ns) {
    if (ns === void 0) { ns = "input"; }
    var bBody = b.getInputTargetBlock("HANDLER");
    var compiledArgs = args.map(function (arg) {
        return H.mkNumberLiteral(parseInt(b.getFieldValue(arg)));
    });
    var body = compileStatements(e, bBody);
    return mkCallWithCallback(e, ns, event, compiledArgs, body);
}
function compileImage(e, b, big, n, f, args) {
    args = args === undefined ? [] : args;
    var state = "";
    var rows = 5;
    var columns = big ? 10 : 5;
    for (var i = 0; i < rows; ++i) {
        if (i > 0)
            state += '\n';
        for (var j = 0; j < columns; ++j) {
            if (j > 0)
                state += ' ';
            state += /TRUE/.test(b.getFieldValue("LED" + j + i)) ? "1" : "0";
        }
    }
    return H.namespaceCall(n, f, [H.mkStringLiteral(state)].concat(args));
}
var stdCallTable = {
    device_clear_display: {
        namespace: "basic",
        f: "clear screen",
        args: []
    },
    device_show_number: {
        namespace: "basic",
        f: "show number",
        args: [{ field: "number" }, { literal: 150 }]
    },
    device_show_letter: {
        f: "show letter",
        args: [{ field: "letter" }]
    },
    device_pause: {
        namespace: "basic",
        f: "pause",
        args: [{ field: "pause" }]
    },
    device_print_message: {
        namespace: "basic",
        f: "show string",
        args: [{ field: "message" }, { literal: 150 }]
    },
    device_plot: {
        namespace: "led",
        f: "plot",
        args: [{ field: "x" }, { field: "y" }]
    },
    device_unplot: {
        namespace: "led",
        f: "unplot",
        args: [{ field: "x" }, { field: "y" }]
    },
    device_stop_animation: {
        namespace: "led",
        f: "stop animation",
        args: []
    },
    device_point: {
        namespace: "led",
        f: "point",
        args: [{ field: "x" }, { field: "y" }]
    },
    device_plot_bar_graph: {
        namespace: "led",
        f: "plot bar graph",
        args: [{ field: "value" }, { field: "high" }]
    },
    device_temperature: {
        namespace: "input",
        f: "temperature",
        args: []
    },
    device_heading: {
        namespace: "input",
        f: "compass heading",
        args: []
    },
    device_make_StringImage: {
        f: "create image from string",
        args: [{ field: "NAME" }]
    },
    device_scroll_image: {
        f: "scroll image",
        args: [{ field: "sprite" }, { field: "frame offset" }, { field: "delay" }],
        isExtensionMethod: true
    },
    device_show_image_offset: {
        f: "show image",
        args: [{ field: "sprite" }, { field: "offset" }],
        isExtensionMethod: true
    },
    device_get_button: {
        namespace: "input",
        f: "button is pressed",
        args: [{ field: "NAME" }]
    },
    device_get_button2: {
        namespace: "input",
        f: "button is pressed",
        args: [{ field: "NAME" }]
    },
    device_get_acceleration: {
        namespace: "input",
        f: "acceleration",
        args: [{ field: "NAME" }]
    },
    device_get_rotation: {
        namespace: "input",
        f: "rotation",
        args: [{ field: "NAME" }]
    },
    device_get_magnetic_force: {
        namespace: "input",
        f: "magnetic force",
        args: [{ field: "NAME" }]
    },
    device_get_light_level: {
        namespace: "input",
        f: "light level",
        args: []
    },
    device_get_running_time: {
        namespace: "input",
        f: "running time",
        args: []
    },
    device_get_digital_pin: {
        namespace: "pins",
        f: "digital read pin",
        args: [{ field: "name" }]
    },
    device_set_digital_pin: {
        namespace: "pins",
        f: "digital write pin",
        args: [{ field: "name" }, { field: "value" }]
    },
    device_get_analog_pin: {
        namespace: "pins",
        f: "analog read pin",
        args: [{ field: "name" }]
    },
    device_set_analog_pin: {
        namespace: "pins",
        f: "analog write pin",
        args: [{ field: "name" }, { field: "value" }]
    },
    device_set_analog_period: {
        namespace: "pins",
        f: "analog set period",
        args: [{ field: "pin" }, { field: "micros" }]
    },
    device_set_servo_pin: {
        namespace: "pins",
        f: "servo write pin",
        args: [{ field: "name" }, { field: "value" }]
    },
    device_set_servo_pulse: {
        namespace: "pins",
        f: "servo set pulse",
        args: [{ field: "pin" }, { field: "micros" }]
    },
    math_map: {
        namespace: "pins",
        f: "map",
        args: [{ field: "value" }, { field: "fromLow" }, { field: "fromHigh" }, { field: "toLow" }, { field: "toHigh" }]
    },
    device_get_brightness: {
        namespace: "led",
        f: "brightness",
        args: []
    },
    device_set_brightness: {
        namespace: "led",
        f: "set brightness",
        args: [{ field: "value" }]
    },
    device_play_note: {
        namespace: "music",
        f: "play tone",
        args: [{ field: "note" }, { field: "duration" }]
    },
    device_ring: {
        namespace: "music",
        f: "ring tone",
        args: [{ field: "note" }]
    },
    device_rest: {
        namespace: "music",
        f: "rest",
        args: [{ field: "duration" }]
    },
    device_note: {
        namespace: "music",
        f: "note frequency",
        args: [{ field: "note" }]
    },
    device_tempo: {
        namespace: "music",
        f: "tempo",
        args: []
    },
    device_change_tempo: {
        namespace: "music",
        f: "change tempo by",
        args: [{ field: "value" }]
    },
    device_set_tempo: {
        namespace: "music",
        f: "set tempo",
        args: [{ field: "value" }]
    },
    game_start_countdown: {
        namespace: "game",
        f: "start countdown",
        args: [{ field: "duration" }]
    },
    game_score: {
        namespace: "game",
        f: "score",
        args: []
    },
    game_add_score: {
        namespace: "game",
        f: "add score",
        args: [{ field: "points" }]
    },
    game_game_over: {
        namespace: "game",
        f: "game over",
        args: []
    },
    game_create_sprite: {
        namespace: "game",
        f: "create sprite",
        args: [{ field: "x" }, { field: "y" }]
    },
    game_move_sprite: {
        isExtensionMethod: true,
        f: "move",
        args: [{ field: "sprite" }, { field: "leds" }]
    },
    game_turn_left: {
        isExtensionMethod: true,
        f: "turn left",
        args: [{ field: "sprite" }, { field: "angle" }]
    },
    game_turn_right: {
        isExtensionMethod: true,
        f: "turn right",
        args: [{ field: "sprite" }, { field: "angle" }]
    },
    game_sprite_change_x: {
        isExtensionMethod: true,
        f: "change x by",
        args: [{ field: "sprite" }, { field: "value" }]
    },
    game_sprite_change_y: {
        isExtensionMethod: true,
        f: "change y by",
        args: [{ field: "sprite" }, { field: "value" }]
    },
    game_sprite_change_direction: {
        isExtensionMethod: true,
        f: "change direction by",
        args: [{ field: "sprite" }, { field: "value" }]
    },
    game_sprite_change_blink: {
        isExtensionMethod: true,
        f: "change blink by",
        args: [{ field: "sprite" }, { field: "value" }]
    },
    game_sprite_change_brightness: {
        isExtensionMethod: true,
        f: "change brightness by",
        args: [{ field: "sprite" }, { field: "value" }]
    },
    game_sprite_set_x: {
        isExtensionMethod: true,
        f: "set x",
        args: [{ field: "sprite" }, { field: "value" }]
    },
    game_sprite_set_y: {
        isExtensionMethod: true,
        f: "set y",
        args: [{ field: "sprite" }, { field: "value" }]
    },
    game_sprite_set_direction: {
        isExtensionMethod: true,
        f: "set direction",
        args: [{ field: "sprite" }, { field: "value" }]
    },
    game_sprite_set_blink: {
        isExtensionMethod: true,
        f: "set blink",
        args: [{ field: "sprite" }, { field: "value" }]
    },
    game_sprite_set_brightness: {
        isExtensionMethod: true,
        f: "set brightness",
        args: [{ field: "sprite" }, { field: "value" }]
    },
    game_sprite_bounce: {
        isExtensionMethod: true,
        f: "if on edge, bounce",
        args: [{ field: "sprite" }]
    },
    game_sprite_touching_sprite: {
        isExtensionMethod: true,
        f: "is touching",
        args: [{ field: "sprite" }, { field: "other" }]
    },
    game_sprite_touching_edge: {
        isExtensionMethod: true,
        f: "is touching edge",
        args: [{ field: "sprite" }]
    },
    game_sprite_x: {
        isExtensionMethod: true,
        f: "x",
        args: [{ field: "sprite" }]
    },
    game_sprite_y: {
        isExtensionMethod: true,
        f: "y",
        args: [{ field: "sprite" }]
    },
    game_sprite_direction: {
        isExtensionMethod: true,
        f: "direction",
        args: [{ field: "sprite" }]
    },
    game_sprite_blink: {
        isExtensionMethod: true,
        f: "blink",
        args: [{ field: "sprite" }]
    },
    game_sprite_brightness: {
        isExtensionMethod: true,
        f: "brightness",
        args: [{ field: "sprite" }]
    },
    devices_camera: {
        namespace: "devices",
        f: "tell camera to",
        args: [{ field: "property" }]
    },
    devices_remote_control: {
        namespace: "devices",
        f: "tell remote control to",
        args: [{ field: "property" }]
    },
    devices_alert: {
        namespace: "devices",
        f: "raise alert to",
        args: [{ field: "property" }]
    },
    devices_signal_strength: {
        namespace: "devices",
        f: "signal strength",
        args: []
    },
    radio_broadcast: {
        namespace: "radio",
        f: "broadcast message",
        args: [{ field: "MESSAGE" }]
    },
    radio_datagram_send: {
        namespace: "radio",
        f: "send number",
        args: [{ field: "MESSAGE" }]
    },
    radio_datagram_send_numbers: {
        namespace: "radio",
        f: "send numbers",
        args: [{ field: "VALUE0" }, { field: "VALUE1" }, { field: "VALUE2" }, { field: "VALUE3" }]
    },
    radio_datagram_receive: {
        namespace: "radio",
        f: "receive number",
        args: []
    },
    radio_datagram_received_number_at: {
        namespace: "radio",
        f: "received number at",
        args: [{ field: "VALUE" }]
    },
    radio_datagram_rssi: {
        namespace: "radio",
        f: "receive signal strength",
        args: []
    },
    radio_set_group: {
        namespace: "radio",
        f: "set group",
        args: [{ field: "ID" }]
    },
};
function compileStatements(e, b) {
    if (b == null)
        return [];
    var stmts = [];
    while (b) {
        if (!b.disabled) {
            switch (b.type) {
                case 'controls_if':
                    append(stmts, compileControlsIf(e, b));
                    break;
                case 'controls_for':
                case 'controls_simple_for':
                    append(stmts, compileControlsFor(e, b));
                    break;
                case 'text_print':
                    stmts.push(compilePrint(e, b));
                    break;
                case 'variables_set':
                    stmts.push(compileSet(e, b));
                    break;
                case 'variables_change':
                    stmts.push(compileChange(e, b));
                    break;
                case 'device_comment2':
                    stmts.push(compileComment2(e, b));
                    break;
                case 'device_comment':
                    stmts.push(compileComment(e, b));
                    break;
                case 'device_forever':
                    stmts.push(compileForever(e, b));
                    break;
                case 'controls_repeat_ext':
                    stmts.push(compileControlsRepeat(e, b));
                    break;
                case 'device_while':
                    stmts.push(compileWhile(e, b));
                    break;
                case 'device_button_event':
                    stmts.push(compileEvent(e, b, "on button pressed", ["NAME"]));
                    break;
                case 'devices_device_info_event':
                    stmts.push(compileEvent(e, b, "on notified", ["NAME"], "devices"));
                    break;
                case 'devices_gamepad_event':
                    stmts.push(compileEvent(e, b, "on gamepad button", ["NAME"], "devices"));
                    break;
                case 'devices_signal_strength_changed_event':
                    stmts.push(compileEvent(e, b, "on signal strength changed", [], "devices"));
                    break;
                case 'radio_broadcast_received_event':
                    stmts.push(compileNumberEvent(e, b, "on message received", ["MESSAGE"], "radio"));
                    break;
                case 'radio_datagram_received_event':
                    stmts.push(compileEvent(e, b, "on data received", [], "radio"));
                    break;
                case 'device_shake_event':
                    stmts.push(compileEvent(e, b, "on shake", []));
                    break;
                case 'device_gesture_event':
                    stmts.push(compileEvent(e, b, "on " + b.getFieldValue("NAME"), []));
                    break;
                case 'device_pin_event':
                    stmts.push(compileEvent(e, b, "on pin pressed", ["NAME"]));
                    break;
                case 'device_show_leds':
                    stmts.push(H.mkExprStmt(H.mkExprHolder([], compileImage(e, b, false, "basic", "show leds", [H.mkNumberLiteral(400)]))));
                    break;
                case 'game_turn_sprite':
                    stmts.push(compileStdBlock(e, b, stdCallTable["game_turn_" + b.getFieldValue("direction")]));
                    break;
                case 'game_sprite_set_property':
                    stmts.push(compileStdBlock(e, b, stdCallTable["game_sprite_set_" + b.getFieldValue("property")]));
                    break;
                case 'game_sprite_change_xy':
                    stmts.push(compileStdBlock(e, b, stdCallTable["game_sprite_change_" + b.getFieldValue("property")]));
                    break;
                default:
                    if (b.type in stdCallTable)
                        stmts.push(compileStdBlock(e, b, stdCallTable[b.type]));
                    else
                        console.log("Not generating code for (not a statement / not supported): " + b.type);
            }
        }
        b = b.getNextBlock();
    }
    return stmts;
}
function isHandlerRegistration(b) {
    return /(forever|_event)$/.test(b.type);
}
function findParent(b) {
    var candidate = b.parentBlock_;
    if (!candidate)
        return null;
    var isActualInput = false;
    candidate.inputList.forEach(function (i) {
        if (i.name && candidate.getInputTargetBlock(i.name) == b)
            isActualInput = true;
    });
    return isActualInput && candidate || null;
}
function mkEnv(w) {
    var e = empty;
    w.getAllBlocks().forEach(function (b) {
        if (b.type == "controls_for" || b.type == "controls_simple_for") {
            var x = b.getFieldValue("VAR");
            if (lookup(e, x) == null)
                e = extend(e, x, 1 /* Number */);
            lookup(e, x).usedAsForIndex++;
            if (!isClassicForLoop(b) || lookup(e, x).usedAsForIndex > 1)
                lookup(e, x).incompatibleWithFor = true;
        }
    });
    var variableIsScoped = function (b, name) {
        if (!b)
            return false;
        else if ((b.type == "controls_for" || b.type == "controls_simple_for") && b.getFieldValue("VAR") == name)
            return true;
        else
            return variableIsScoped(findParent(b), name);
    };
    w.getAllBlocks().forEach(function (b) {
        if (b.type == "variables_set" || b.type == "variables_change") {
            var x = b.getFieldValue("VAR");
            if (lookup(e, x) == null)
                e = extend(e, x, null);
            var binding = lookup(e, x);
            if (binding.usedAsForIndex)
                binding.incompatibleWithFor = true;
        }
        else if (b.type == "variables_get") {
            var x = b.getFieldValue("VAR");
            if (lookup(e, x) == null)
                e = extend(e, x, null);
            var binding = lookup(e, x);
            if (binding.usedAsForIndex && !variableIsScoped(b, x))
                binding.incompatibleWithFor = true;
        }
    });
    return e;
}
function compileWorkspace(w, options) {
    try {
        var decls = [];
        var e = mkEnv(w);
        infer(e, w);
        var stmtsVariables = [];
        e.bindings.forEach(function (b) {
            var btype = find(b.type);
            if (!isCompiledAsForIndex(b))
                stmtsVariables.push(H.mkDefAndAssign(b.name, toTdType(find(b.type).type), defaultValueForType(find(b.type))));
        });
        var foundWholeNote = e.bindings.filter(function (x) { return x.name == "whole note"; }).length > 0;
        var needsWholeNote = w.getAllBlocks().filter(function (x) { return !!x.type.match(/^device_duration_/); }).length > 0;
        if (!foundWholeNote && needsWholeNote) {
            stmtsVariables.push(H.mkDefAndAssign("whole note", toTdType(1 /* Number */), H.mkNumberLiteral(2000)));
            e = extend(e, "whole note", 1 /* Number */);
        }
        var stmtsHandlers = [];
        var stmtsMain = [];
        w.getTopBlocks(true).forEach(function (b) {
            if (isHandlerRegistration(b))
                append(stmtsHandlers, compileStatements(e, b));
            else
                append(stmtsMain, compileStatements(e, b));
        });
        decls.push(H.mkAction("main", stmtsVariables.concat(stmtsHandlers).concat(stmtsMain), [], []));
    }
    finally {
        removeAllPlaceholders(w);
    }
    return H.mkApp(options.name, options.description, decls);
}
function compile(b, options) {
    Errors.clear();
    return compileWorkspace(b, options);
}
//var TDev2;
//(function (TDev) {
    var dbg = /(dbg|test)=1/.test(window.location.href);
    var allowedOrigins = [
        /^http:\/\/localhost/,
        /^https?:\/\/.*\.microbit\.co\.uk/,
        /^https?:\/\/microbit\.co\.uk/,
    ];
    function isAllowedOrigin(origin) {
        return allowedOrigins.filter(function (x) { return !!origin.match(x); }).length > 0;
    }
    var outer = null;
    var origin = null;
    var currentVersion;
    var inMerge = false;
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate)
                    func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow)
                func.apply(context, args);
        };
    }
    window.addEventListener("message", function (event) {
        if (!isAllowedOrigin(event.origin)) {
            console.error("[inner message] not from the right origin!", event.origin);
            return;
        }
        if (!outer || !origin) {
            outer = event.source;
            origin = event.origin;
        }
        receive(event.data);
    });
    var onResize = function () {
    };
    function receive(message) {
        console.log("[inner message]", message);
        switch (message.type) {
            case 0 /* Init */:
                setupEditor(message);
                setupButtons();
                setupCurrentVersion(message);
                break;
            case 11 /* Resized */:
                onResize();
                break;
            case 4 /* SaveAck */:
                saveAck(message);
                break;
            case 7 /* Merge */:
                promptMerge(message.merge);
                break;
            case 6 /* CompileAck */:
                compileAck(message);
                break;
            case 12 /* NewBaseVersion */:
                newBaseVersion(message);
                break;
            case 14 /* TypeCheck */:
                typeCheckError(message);
                break;
        }
    }
    function post(message) {
        if (!outer)
            console.error("Invalid state");
        outer.postMessage(message, origin);
    }
    function prefix(where) {
        switch (where) {
            case 1 /* Cloud */:
                return ("☁  [cloud]");
            case 0 /* Local */:
                return ("⌂ [local]");
        }
    }
    function statusIcon(icon) {
        var i = $("#cloud-status i");
        i.attr("class", "fa fa-" + icon);
        switch (icon) {
            case "cloud-upload":
                i.attr("title", "Saved to cloud");
                break;
            case "floppy-o":
                i.attr("title", "Saved locally");
                break;
            case "exclamation-triangle":
                i.attr("title", "Error while saving -- see ⓘ for more information");
                break;
            case "pencil":
                i.attr("title", "Local changes");
                break;
            default:
                i.attr("title", "");
        }
    }
    function saveAck(message) {
        switch (message.status) {
            case 1 /* Error */:
                statusMsg(prefix(message.where) + " error: " + message.error, message.status);
                statusIcon("exclamation-triangle");
                break;
            case 0 /* Ok */:
                if (message.where == 1 /* Cloud */) {
                    statusMsg(prefix(message.where) + " successfully saved version (cloud in sync? " + message.cloudIsInSync + ", " + "from " + currentVersion + " to " + message.newBaseSnapshot + ")", message.status);
                    currentVersion = message.newBaseSnapshot;
                    if (message.cloudIsInSync)
                        statusIcon("cloud-upload");
                    else
                        statusIcon("exclamation-triangle");
                }
                else {
                    statusIcon("floppy-o");
                    statusMsg(prefix(message.where) + " successfully saved", message.status);
                }
                break;
        }
    }
    function compileAck(message) {
        $("#command-compile > .roundsymbol").removeClass("compiling");
        switch (message.status) {
            case 1 /* Error */:
                statusMsg("compilation error: " + message.error, message.status);
                showPopup($("#link-log"), $("#popup-log"));
                break;
            case 0 /* Ok */:
                statusMsg("compilation successful", message.status);
                break;
        }
    }
    var mergeDisabled = true;
    function typeCheckError(msg) {
        statusMsg("! your script has errors", 1 /* Error */);
    }
    function newBaseVersion(msg) {
        statusMsg("✎ got assigned our first base version", 0 /* Ok */);
        currentVersion = msg.baseSnapshot;
    }
    function promptMerge(merge) {
        if (mergeDisabled) {
            inMerge = false;
            currentVersion = merge.theirs.baseSnapshot;
            statusMsg("✎ ignoring merge, forcing changes", 0 /* Ok */);
            doSave(true);
            return;
        }
        console.log("[merge] merge request, base = " + merge.base.baseSnapshot + ", theirs = " + merge.theirs.baseSnapshot + ", mine = " + currentVersion);
        var mkButton = function (symbol, label, f) {
            return $("<div>").text(symbol + " " + label).click(f);
        };
        var box = $("#merge-commands");
        var clearMerge = function () {
            box.empty();
        };
        var mineText = saveBlockly();
        var mineName = getName();
        var mineButton = mkButton("🔍", "see mine", function () {
            loadBlockly(mineText);
            setName(mineName);
        });
        var theirsButton = mkButton("🔍", "see theirs", function () {
            loadBlockly(merge.theirs.scriptText);
            setName(merge.theirs.metadata.name);
        });
        var baseButton = mkButton("🔍", "see base", function () {
            loadBlockly(merge.base.scriptText);
            setName(merge.base.metadata.name);
        });
        var mergeButton = mkButton("👍", "finish merge", function () {
            inMerge = false;
            currentVersion = merge.theirs.baseSnapshot;
            clearMerge();
            doSave(true);
        });
        clearMerge();
        inMerge = true;
        box.append($("<div>").addClass("label").text("Merge conflict"));
        [mineButton, theirsButton, baseButton, mergeButton].forEach(function (button) {
            box.append(button);
            box.append($(" "));
        });
    }
    function setupCurrentVersion(message) {
        currentVersion = message.script.baseSnapshot;
        console.log("[revisions] current version is " + currentVersion);
        if (message.merge)
            promptMerge(message.merge);
    }
    function statusMsg(s, st) {
        var box = $("#log");
        var elt = $("<div>").addClass("status").text(s);
        if (st == 1 /* Error */)
            elt.addClass("error");
        else
            elt.removeClass("error");
        box.append(elt);
        box.scrollTop(box.prop("scrollHeight"));
    }
    function loadBlockly(s) {
        var text = s || "<xml></xml>";
        var xml = Blockly.Xml.textToDom(text);
        Blockly.mainWorkspace.clear();
        try {
            Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
        }
        catch (e) {
            console.error("Cannot load saved Blockly script. Too recent?");
            console.error(e);
        }
    }
    function saveBlockly() {
        var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        var text = Blockly.Xml.domToPrettyText(xml);
        return text;
    }
    function setName(x) {
        $("#script-name").val(x);
    }
    function getName() {
        return $("#script-name").val();
    }
    var dirty = false;
    function clearPopups() {
        $(".popup").addClass("hidden");
    }
    function setupPopups() {
        $(document).click(function (e) {
            if ($(e.target).closest(".popup, .roundbutton").length)
                return;
            clearPopups();
        });
    }
    function setupPopup(link, popup) {
        link.click(function (e) {
            if (popup.hasClass("hidden"))
                showPopup(link, popup);
            else
                popup.addClass("hidden");
            e.stopPropagation();
        });
    }
    function showPopup(link, popup) {
        clearPopups();
        popup.removeClass("hidden");
        var x = link[0].offsetLeft;
        var w = link[0].clientWidth;
        var y = link[0].offsetTop;
        var h = link[0].clientHeight;
        var popupw = popup[0].clientWidth;
        popup.css("left", Math.round(x - popupw + w / 2 + 5 + 15) + "px");
        popup.css("top", Math.round(y + h + 10 + 5) + "px");
    }
    var debouncedSave = debounce(doSave, 5000, false);
    function markLocalChanges() {
        statusMsg("✎ local changes", 0 /* Ok */);
        statusIcon("pencil");
        dirty = true;
        debouncedSave();
    }
    function setupEditor(message) {
        //var state = message.script.editorState;
        var blocklyArea = document.getElementById('editor');
        var blocklyDiv = document.getElementById('blocklyDiv');
        //var blocklyToolbox = document.getElementById("blockly-toolbox");
        //if (!dbg) {
        //    var cats = blocklyToolbox.getElementsByTagName("category");
        //    for (var i = 0; i < cats.length; ++i) {
        //        var catEl = cats.item(i);
        //        if (catEl.getAttribute("debug"))
        //            catEl.parentElement.removeChild(catEl);
        //    }
        //}
        var workspace = Blockly.inject(blocklyDiv, {
            toolbox: microbitToolbox,
            scrollbars: true,
            media: "vendor/blockly/media/",
            zoom: {
                enabled: true,
                controls: true,
                wheel: true,
                maxScale: 2.5,
                minScale: .1,
                scaleSpeed: 1.1
            },
        });
        Blockly.BlockSvg.prototype.showHelp_ = function () {
            var url = goog.isFunction(this.helpUrl) ? this.helpUrl() : this.helpUrl;
            var m = /^https:\/\/www.microbit.co.uk(.*)$/i.exec(url);
            if (url) {
                if (m && m[1])
                    post({
                        type: 15 /* Help */,
                        path: m[1]
                    });
                else
                    window.open(url);
            }
        };
        onResize = function () {
            var element = blocklyArea;
            var x = 0;
            var y = 0;
            do {
                x += element.offsetLeft;
                y += element.offsetTop;
                element = element.offsetParent;
            } while (element);
            blocklyDiv.style.left = x + 'px';
            blocklyDiv.style.top = y + 'px';
            blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
            blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
        };
        window.addEventListener('resize', onresize, false);
        window.addEventListener('orientationchange', onresize, false);
        onResize();
        loadBlockly();
        window.setTimeout(function () {
            Blockly.mainWorkspace.addChangeListener(function () {
                markLocalChanges();
            });
        }, 1);
        $("#script-name").on("blur", function () {
            if (getName().trim() == "")
                setName("staggering program");
            markLocalChanges();
        });
        $("#script-name").on("input keyup blur", function () {
            markLocalChanges();
        });
        window.addEventListener("beforeunload", function (e) {
            if (dirty) {
                var confirmationMessage = "Some of your changes have not been saved. Quit anyway?";
                (e || window.event).returnValue = confirmationMessage;
                return confirmationMessage;
            }
        });
        document.addEventListener("dragover", function (event) {
            event.preventDefault();
        });
        document.addEventListener("drop", function (event) {
            event.preventDefault();
            for (var i = 0; i < event.dataTransfer.files.length; ++i) {
                var f = event.dataTransfer.files[i];
                if (/\.(hex|json|jsz)$/.test(f.name))
                    post({
                        type: 13 /* Load */,
                        file: f
                    });
            }
        });
        setupPopup($("#link-log"), $("#popup-log"));
        setupPopups();
    }
    function doSave(force) {
//        if (force === void 0) { force = false; }
//        if (!dirty && !force) {
//            console.log('nothing to save...');
//            return;
//        }
//        var text = saveBlockly();
//        console.log("[saving] on top of: ", currentVersion);
//        post({
//            type: 3 /* Save */,
//            script: {
//                scriptText: text,
//                editorState: {
//                    lastSave: new Date()
//                },
//                baseSnapshot: currentVersion,
//                metadata: {
//                    name: getName(),
//                    comment: ''
//                }
//            },
//        });
//        dirty = false;
    }
    function compileOrError(appendSuffix, msgSel) {
        var ast;
        $(".blocklySelected, .blocklyError").each(function (i, x) { return x.setAttribute("class", x.getAttribute("class").replace(/(blocklySelected|blocklyError)/g, "")); });
        clearPopups();
        $("#errorsGraduate").addClass("hidden");
        $("#errorsCompile").addClass("hidden");
        $("#errorsRun").addClass("hidden");
        try {
            ast = compile(Blockly.mainWorkspace, {
                name: getName() + (appendSuffix ? " (converted)" : ""),
                description: ''
            });
        }
        catch (e) {
            statusMsg("⚠ compilation error: " + e, 1 /* Error */);
            showPopup($("#link-log"), $("#popup-log"));
        }
        var errors = Errors.get();
        if (errors.length && msgSel) {
            var text = "";
            errors.slice(0, 1).forEach(function (e) {
                var block = e.block;
                $(block.svgGroup_).attr("class", "blocklySelected blocklyError");
                text += e.msg + "\n";
            });
            statusMsg(text, 1 /* Error */);
            $(msgSel).removeClass("hidden");
            showPopup($("#link-log"), $("#popup-log"));
            return null;
        }
        return ast;
    }
    var libs = {
        "micro:bit": {
            pubId: "lwhfye",
            depends: []
        },
        "micro:bit game": {
            pubId: "lwagkt",
            depends: ["micro:bit"]
        },
        "micro:bit sprites": {
            pubId: "vzkdcc",
            depends: ["micro:bit", "micro:bit game"]
        },
        "micro:bit screen": {
            pubId: "nzngii",
            depends: ["micro:bit"]
        },
        "micro:bit senses": {
            pubId: "vkmzfe",
            depends: ["micro:bit"]
        },
        "micro:bit music": {
            pubId: "zbiwoq",
            depends: ["micro:bit"]
        },
        "micro:bit radio": {
            pubId: "fgkphf",
            depends: ["micro:bit"]
        },
    };
    if (!dbg) {
        delete libs["micro:bit radio"];
    }
    function doGraduate(msgSel) {
//        doSave();
//        var ast = compileOrError(true, msgSel);
//        if (!ast)
//            return;
//        post({
//            type: 9 /* Upgrade */,
//            ast: ast,
//            name: getName() + " (converted)",
//            libs: libs,
//        });
        alert(Blockly.Python.workspaceToCode(Blockly.mainWorkspace));
    }
    function doCompile(msgSel) {
        doSave();
        var ast = compileOrError(false, msgSel);
        if (!ast)
            return;
        $("#command-compile > .roundsymbol").addClass("compiling");
        post({
            type: 5 /* Compile */,
            text: ast,
            language: 0 /* TouchDevelop */,
            name: getName(),
            libs: libs,
            source: saveBlockly()
        });
    }
    function doRun(auto) {
        doSave();
        var ast = compileOrError(false, "#errorsRun");
        if (!ast)
            return;
        post({
            type: 10 /* Run */,
            ast: ast,
            libs: libs,
            onlyIfSplit: auto
        });
    }
    function setupButtons() {
        $("#command-quit").click(function () {
            doSave();
            post({ type: 8 /* Quit */ });
        });
        $("#command-force-compile").click(function () {
            doCompile();
        });
        $("#command-compile").click(function (e) {
            doCompile("#errorsCompile");
            e.stopPropagation();
        });
        $("#command-force-graduate").click(function () {
            doGraduate();
        });
        $("#command-graduate").click(function (e) {
            doGraduate("#errorsGraduate");
            e.stopPropagation();
        });
        $("#command-run").click(function () { return doRun(false); });
    }
//})(TDev || (TDev = {}));
window.onload = function() {
    setupEditor();
    setupButtons();
};
