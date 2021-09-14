import { Injectable } from '@angular/core';
import { UserCode } from "./user-code";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment} from "../environments/environment";
import { FiddleTheme } from './fiddle-theme';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  httpOptions = {
    headers: new HttpHeaders({"Content-Type":"application/json"}),
    responseType: 'text' as 'text'
  }
  url: string = environment.url;
  jsCode:string = "";
  cssCode:string = "";
  htmlCode:string = "";
  layout:number = 1;

  cssCodePartSize:number;
  htmlCodePartSize:number;
  jsCodePartSize:number;
  mainContainerHeight: number;
  mainContainerWidth: number;
  codePartsSize: number;
  iframeResizeValue: number;
  fiddleThemeId: string = '';

  fiddleTitle:string = "";
  redirectAfterSaveMode: boolean = false;

  isCtrlKeyOn: boolean = false;
  isAltKeyOn: boolean = false;
  canEmitCodeMsg: boolean = true;
  codeExecutionDate: Date =  undefined;

  showHtml: boolean = true;
  showCss: boolean = false;
  showJs: boolean = false;
  showResult: boolean = true;

  defaultTheme = {
      name: "VS",
      id: "vs-default",
      data: {
          "base": "vs",
          "inherit": true,
          "rules": [],
          "colors": {
              "editor.foreground": "#000000",
              "editor.background": "#FFFFFF",
              "editor.selectionBackground": "#add6ff",
              "editor.lineHighlightBackground": "#FFFFFF",
              "editorCursor.foreground": "#000000",
              "editorWhitespace.foreground": "#000000"
          }
      }
  }

  monacoThemesList: Array<any> = [
    {
        name: "VS",
        id: "vs-default",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [],
            "colors": {
                "editor.foreground": "#000000",
                "editor.background": "#FFFFFF",
                "editor.selectionBackground": "#add6ff",
                "editor.lineHighlightBackground": "#FFFFFF",
                "editorCursor.foreground": "#000000",
                "editorWhitespace.foreground": "#000000"
            }
        }
    },
    {
        name: "VS Dark",
        id: "vs-default-dark",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [],
            "colors": {
                "editor.foreground": "#d4d4d4",
                "editor.background": "#1e1e1e",
                "editor.selectionBackground": "#414141",
                "editor.lineHighlightBackground": "#1e1e1e",
                "editorCursor.foreground": "#d4d4d4",
                "editorWhitespace.foreground": "#d4d4d480"
            }
        }
    },
    {
        name: "Active4D",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "000000",
                    "token": ""
                },
                {
                    "foreground": "ffffff",
                    "background": "434242",
                    "token": "text"
                },
                {
                    "foreground": "ffffff",
                    "background": "000000",
                    "token": "source"
                },
                {
                    "foreground": "9933cc",
                    "token": "comment"
                },
                {
                    "foreground": "3387cc",
                    "token": "constant"
                },
                {
                    "foreground": "cc7833",
                    "token": "keyword"
                },
                {
                    "foreground": "d0d0ff",
                    "token": "meta.preprocessor.c"
                },
                {
                    "fontStyle": "italic",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "ffffff",
                    "background": "9b9b9b",
                    "token": "source comment.block"
                },
                {
                    "foreground": "66cc33",
                    "token": "string"
                },
                {
                    "foreground": "aaaaaa",
                    "token": "string constant.character.escape"
                },
                {
                    "foreground": "000000",
                    "background": "cccc33",
                    "token": "string.interpolated"
                },
                {
                    "foreground": "cccc33",
                    "token": "string.regexp"
                },
                {
                    "foreground": "cccc33",
                    "token": "string.literal"
                },
                {
                    "foreground": "555555",
                    "token": "string.interpolated constant.character.escape"
                },
                {
                    "fontStyle": "underline",
                    "token": "entity.name.type"
                },
                {
                    "fontStyle": "italic underline",
                    "token": "entity.other.inherited-class"
                },
                {
                    "fontStyle": "underline",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "c83730",
                    "token": "support.function"
                }
            ],
            "colors": {
                "editor.foreground": "#FFFFFF",
                "editor.background": "#000000",
                "editor.selectionBackground": "#73597EE0",
                "editor.lineHighlightBackground": "#333300",
                "editorCursor.foreground": "#FFFFFF",
                "editorWhitespace.foreground": "#404040"
            }
        },
        id: "active4d"
    },
    {
        name: "All Hallows Eve",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "000000",
                    "token": ""
                },
                {
                    "foreground": "ffffff",
                    "background": "434242",
                    "token": "text"
                },
                {
                    "foreground": "ffffff",
                    "background": "000000",
                    "token": "source"
                },
                {
                    "foreground": "9933cc",
                    "token": "comment"
                },
                {
                    "foreground": "3387cc",
                    "token": "constant"
                },
                {
                    "foreground": "cc7833",
                    "token": "keyword"
                },
                {
                    "foreground": "d0d0ff",
                    "token": "meta.preprocessor.c"
                },
                {
                    "fontStyle": "italic",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "ffffff",
                    "background": "9b9b9b",
                    "token": "source comment.block"
                },
                {
                    "foreground": "66cc33",
                    "token": "string"
                },
                {
                    "foreground": "aaaaaa",
                    "token": "string constant.character.escape"
                },
                {
                    "foreground": "000000",
                    "background": "cccc33",
                    "token": "string.interpolated"
                },
                {
                    "foreground": "cccc33",
                    "token": "string.regexp"
                },
                {
                    "foreground": "cccc33",
                    "token": "string.literal"
                },
                {
                    "foreground": "555555",
                    "token": "string.interpolated constant.character.escape"
                },
                {
                    "fontStyle": "underline",
                    "token": "entity.name.type"
                },
                {
                    "fontStyle": "italic underline",
                    "token": "entity.other.inherited-class"
                },
                {
                    "fontStyle": "underline",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "c83730",
                    "token": "support.function"
                }
            ],
            "colors": {
                "editor.foreground": "#FFFFFF",
                "editor.background": "#000000",
                "editor.selectionBackground": "#73597EE0",
                "editor.lineHighlightBackground": "#333300",
                "editorCursor.foreground": "#FFFFFF",
                "editorWhitespace.foreground": "#404040"
            }
        },
        id: "all-hallows-eve"
    },
    {
        name: "Amy",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "200020",
                    "token": ""
                },
                {
                    "foreground": "404080",
                    "background": "200020",
                    "fontStyle": "italic",
                    "token": "comment.block"
                },
                {
                    "foreground": "999999",
                    "token": "string"
                },
                {
                    "foreground": "707090",
                    "token": "constant.language"
                },
                {
                    "foreground": "7090b0",
                    "token": "constant.numeric"
                },
                {
                    "fontStyle": "bold",
                    "token": "constant.numeric.integer.int32"
                },
                {
                    "fontStyle": "italic",
                    "token": "constant.numeric.integer.int64"
                },
                {
                    "fontStyle": "bold italic",
                    "token": "constant.numeric.integer.nativeint"
                },
                {
                    "fontStyle": "underline",
                    "token": "constant.numeric.floating-point.ocaml"
                },
                {
                    "foreground": "666666",
                    "token": "constant.character"
                },
                {
                    "foreground": "8080a0",
                    "token": "constant.language.boolean"
                },
                {
                    "foreground": "008080",
                    "token": "variable.language"
                },
                {
                    "foreground": "008080",
                    "token": "variable.other"
                },
                {
                    "foreground": "a080ff",
                    "token": "keyword"
                },
                {
                    "foreground": "a0a0ff",
                    "token": "keyword.operator"
                },
                {
                    "foreground": "d0d0ff",
                    "token": "keyword.other.decorator"
                },
                {
                    "fontStyle": "underline",
                    "token": "keyword.operator.infix.floating-point.ocaml"
                },
                {
                    "fontStyle": "underline",
                    "token": "keyword.operator.prefix.floating-point.ocaml"
                },
                {
                    "foreground": "c080c0",
                    "token": "keyword.other.directive"
                },
                {
                    "foreground": "c080c0",
                    "fontStyle": "underline",
                    "token": "keyword.other.directive.line-number"
                },
                {
                    "foreground": "80a0ff",
                    "token": "keyword.control"
                },
                {
                    "foreground": "b0fff0",
                    "token": "storage"
                },
                {
                    "foreground": "60b0ff",
                    "token": "entity.name.type.variant"
                },
                {
                    "foreground": "60b0ff",
                    "fontStyle": "italic",
                    "token": "storage.type.variant.polymorphic"
                },
                {
                    "foreground": "60b0ff",
                    "fontStyle": "italic",
                    "token": "entity.name.type.variant.polymorphic"
                },
                {
                    "foreground": "b000b0",
                    "token": "entity.name.type.module"
                },
                {
                    "foreground": "b000b0",
                    "fontStyle": "underline",
                    "token": "entity.name.type.module-type.ocaml"
                },
                {
                    "foreground": "a00050",
                    "token": "support.other"
                },
                {
                    "foreground": "70e080",
                    "token": "entity.name.type.class"
                },
                {
                    "foreground": "70e0a0",
                    "token": "entity.name.type.class-type"
                },
                {
                    "foreground": "50a0a0",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "80b0b0",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "3080a0",
                    "token": "entity.name.type.token"
                },
                {
                    "foreground": "3cb0d0",
                    "token": "entity.name.type.token.reference"
                },
                {
                    "foreground": "90e0e0",
                    "token": "entity.name.function.non-terminal"
                },
                {
                    "foreground": "c0f0f0",
                    "token": "entity.name.function.non-terminal.reference"
                },
                {
                    "foreground": "009090",
                    "token": "entity.name.tag"
                },
                {
                    "background": "200020",
                    "token": "support.constant"
                },
                {
                    "foreground": "400080",
                    "background": "ffff00",
                    "fontStyle": "bold",
                    "token": "invalid.illegal"
                },
                {
                    "foreground": "200020",
                    "background": "cc66ff",
                    "token": "invalid.deprecated"
                },
                {
                    "background": "40008054",
                    "token": "source.camlp4.embedded"
                },
                {
                    "foreground": "805080",
                    "token": "punctuation"
                }
            ],
            "colors": {
                "editor.foreground": "#D0D0FF",
                "editor.background": "#200020",
                "editor.selectionBackground": "#80000080",
                "editor.lineHighlightBackground": "#80000040",
                "editorCursor.foreground": "#7070FF",
                "editorWhitespace.foreground": "#BFBFBF"
            }
        },
        id: "amy"
    },
    {
        name: "Birds of Paradise",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "372725",
                    "token": ""
                },
                {
                    "foreground": "e6e1c4",
                    "background": "322323",
                    "token": "source"
                },
                {
                    "foreground": "6b4e32",
                    "fontStyle": "italic",
                    "token": "comment"
                },
                {
                    "foreground": "ef5d32",
                    "token": "keyword"
                },
                {
                    "foreground": "ef5d32",
                    "token": "storage"
                },
                {
                    "foreground": "efac32",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "efac32",
                    "token": "keyword.other.name-of-parameter.objc"
                },
                {
                    "foreground": "efac32",
                    "fontStyle": "bold",
                    "token": "entity.name"
                },
                {
                    "foreground": "6c99bb",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "7daf9c",
                    "token": "variable.language"
                },
                {
                    "foreground": "7daf9c",
                    "token": "variable.other"
                },
                {
                    "foreground": "6c99bb",
                    "token": "constant"
                },
                {
                    "foreground": "efac32",
                    "token": "variable.other.constant"
                },
                {
                    "foreground": "6c99bb",
                    "token": "constant.language"
                },
                {
                    "foreground": "d9d762",
                    "token": "string"
                },
                {
                    "foreground": "efac32",
                    "token": "support.function"
                },
                {
                    "foreground": "efac32",
                    "token": "support.type"
                },
                {
                    "foreground": "6c99bb",
                    "token": "support.constant"
                },
                {
                    "foreground": "efcb43",
                    "token": "meta.tag"
                },
                {
                    "foreground": "efcb43",
                    "token": "declaration.tag"
                },
                {
                    "foreground": "efcb43",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "efcb43",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "ffffff",
                    "background": "990000",
                    "token": "invalid"
                },
                {
                    "foreground": "7daf9c",
                    "token": "constant.character.escaped"
                },
                {
                    "foreground": "7daf9c",
                    "token": "constant.character.escape"
                },
                {
                    "foreground": "7daf9c",
                    "token": "string source"
                },
                {
                    "foreground": "7daf9c",
                    "token": "string source.ruby"
                },
                {
                    "foreground": "e6e1dc",
                    "background": "144212",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "e6e1dc",
                    "background": "660000",
                    "token": "markup.deleted"
                },
                {
                    "background": "2f33ab",
                    "token": "meta.diff.header"
                },
                {
                    "background": "2f33ab",
                    "token": "meta.separator.diff"
                },
                {
                    "background": "2f33ab",
                    "token": "meta.diff.index"
                },
                {
                    "background": "2f33ab",
                    "token": "meta.diff.range"
                }
            ],
            "colors": {
                "editor.foreground": "#E6E1C4",
                "editor.background": "#372725",
                "editor.selectionBackground": "#16120E",
                "editor.lineHighlightBackground": "#1F1611",
                "editorCursor.foreground": "#E6E1C4",
                "editorWhitespace.foreground": "#42302D"
            }
        },
        id: "birds-of-paradise"
    },
    {
        name: "Blackboard",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "0C1021",
                    "token": ""
                },
                {
                    "foreground": "aeaeae",
                    "token": "comment"
                },
                {
                    "foreground": "d8fa3c",
                    "token": "constant"
                },
                {
                    "foreground": "ff6400",
                    "token": "entity"
                },
                {
                    "foreground": "fbde2d",
                    "token": "keyword"
                },
                {
                    "foreground": "fbde2d",
                    "token": "storage"
                },
                {
                    "foreground": "61ce3c",
                    "token": "string"
                },
                {
                    "foreground": "61ce3c",
                    "token": "meta.verbatim"
                },
                {
                    "foreground": "8da6ce",
                    "token": "support"
                },
                {
                    "foreground": "ab2a1d",
                    "fontStyle": "italic",
                    "token": "invalid.deprecated"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "9d1e15",
                    "token": "invalid.illegal"
                },
                {
                    "foreground": "ff6400",
                    "fontStyle": "italic",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "ff6400",
                    "token": "string constant.other.placeholder"
                },
                {
                    "foreground": "becde6",
                    "token": "meta.function-call.py"
                },
                {
                    "foreground": "7f90aa",
                    "token": "meta.tag"
                },
                {
                    "foreground": "7f90aa",
                    "token": "meta.tag entity"
                },
                {
                    "foreground": "ffffff",
                    "token": "entity.name.section"
                },
                {
                    "foreground": "d5e0f3",
                    "token": "keyword.type.variant"
                },
                {
                    "foreground": "f8f8f8",
                    "token": "source.ocaml keyword.operator.symbol"
                },
                {
                    "foreground": "8da6ce",
                    "token": "source.ocaml keyword.operator.symbol.infix"
                },
                {
                    "foreground": "8da6ce",
                    "token": "source.ocaml keyword.operator.symbol.prefix"
                },
                {
                    "fontStyle": "underline",
                    "token": "source.ocaml keyword.operator.symbol.infix.floating-point"
                },
                {
                    "fontStyle": "underline",
                    "token": "source.ocaml keyword.operator.symbol.prefix.floating-point"
                },
                {
                    "fontStyle": "underline",
                    "token": "source.ocaml constant.numeric.floating-point"
                },
                {
                    "background": "ffffff08",
                    "token": "text.tex.latex meta.function.environment"
                },
                {
                    "background": "7a96fa08",
                    "token": "text.tex.latex meta.function.environment meta.function.environment"
                },
                {
                    "foreground": "fbde2d",
                    "token": "text.tex.latex support.function"
                },
                {
                    "foreground": "ffffff",
                    "token": "source.plist string.unquoted"
                },
                {
                    "foreground": "ffffff",
                    "token": "source.plist keyword.operator"
                }
            ],
            "colors": {
                "editor.foreground": "#F8F8F8",
                "editor.background": "#0C1021",
                "editor.selectionBackground": "#253B76",
                "editor.lineHighlightBackground": "#FFFFFF0F",
                "editorCursor.foreground": "#FFFFFFA6",
                "editorWhitespace.foreground": "#FFFFFF40"
            }
        },
        id: "blackboard"
    },
    {
        name: "Brilliance Black",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "0D0D0DFA",
                    "token": ""
                },
                {
                    "foreground": "000000",
                    "background": "ffffff",
                    "fontStyle": "bold",
                    "token": "meta.thomas_aylott"
                },
                {
                    "foreground": "555555",
                    "background": "ffffff",
                    "fontStyle": "underline",
                    "token": "meta.subtlegradient"
                },
                {
                    "foreground": "fffc80",
                    "background": "803d0033",
                    "token": "string -meta.tag -meta.doctype -string.regexp -string.literal -string.interpolated -string.quoted.literal -string.unquoted"
                },
                {
                    "foreground": "fffc80",
                    "background": "803d0033",
                    "token": "variable.parameter.misc.css"
                },
                {
                    "foreground": "fffc80",
                    "background": "803d0033",
                    "token": "text string source string"
                },
                {
                    "foreground": "fffc80",
                    "background": "803d0033",
                    "token": "string.unquoted string"
                },
                {
                    "foreground": "fffc80",
                    "background": "803d0033",
                    "token": "string.regexp string"
                },
                {
                    "foreground": "fffc80",
                    "background": "803d0033",
                    "token": "string.interpolated string"
                },
                {
                    "foreground": "fffc80",
                    "background": "803d0033",
                    "token": "meta.tag source string"
                },
                {
                    "foreground": "803d00",
                    "token": "punctuation.definition.string -meta.tag"
                },
                {
                    "foreground": "fff80033",
                    "token": "string.regexp punctuation.definition.string"
                },
                {
                    "foreground": "fff80033",
                    "token": "string.quoted.literal punctuation.definition.string"
                },
                {
                    "foreground": "fff80033",
                    "token": "string.quoted.double.ruby.mod punctuation.definition.string"
                },
                {
                    "foreground": "fff800",
                    "background": "43800033",
                    "token": "string.quoted.literal"
                },
                {
                    "foreground": "fff800",
                    "background": "43800033",
                    "token": "string.quoted.double.ruby.mod"
                },
                {
                    "foreground": "ffbc80",
                    "token": "string.unquoted -string.unquoted.embedded"
                },
                {
                    "foreground": "ffbc80",
                    "token": "string.quoted.double.multiline"
                },
                {
                    "foreground": "ffbc80",
                    "token": "meta.scope.heredoc"
                },
                {
                    "foreground": "fffc80",
                    "background": "1a1a1a",
                    "token": "string.interpolated"
                },
                {
                    "foreground": "fff800",
                    "background": "43800033",
                    "token": "string.regexp"
                },
                {
                    "background": "43800033",
                    "token": "string.regexp.group"
                },
                {
                    "foreground": "ffffff66",
                    "background": "43800033",
                    "token": "string.regexp.group string.regexp.group"
                },
                {
                    "foreground": "ffffff66",
                    "background": "43800033",
                    "token": "string.regexp.group string.regexp.group string.regexp.group"
                },
                {
                    "foreground": "ffffff66",
                    "background": "43800033",
                    "token": "string.regexp.group string.regexp.group string.regexp.group string.regexp.group"
                },
                {
                    "foreground": "86ff00",
                    "background": "43800033",
                    "token": "string.regexp.character-class"
                },
                {
                    "foreground": "00fff8",
                    "background": "43800033",
                    "token": "string.regexp.arbitrary-repitition"
                },
                {
                    "foreground": "803d00",
                    "token": "string.regexp punctuation.definition.string keyword.other"
                },
                {
                    "background": "0086ff33",
                    "token": "meta.group.assertion.regexp"
                },
                {
                    "foreground": "0086ff",
                    "token": "meta.assertion"
                },
                {
                    "foreground": "0086ff",
                    "token": "meta.group.assertion keyword.control.group.regexp"
                },
                {
                    "foreground": "0086ff",
                    "token": "meta.group.assertion punctuation.definition.group"
                },
                {
                    "foreground": "c6ff00",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "86ff00",
                    "token": "constant.character"
                },
                {
                    "foreground": "07ff00",
                    "token": "constant.language"
                },
                {
                    "foreground": "07ff00",
                    "token": "keyword.other.unit"
                },
                {
                    "foreground": "07ff00",
                    "token": "constant.other.java"
                },
                {
                    "foreground": "07ff00",
                    "token": "constant.other.unit"
                },
                {
                    "foreground": "07ff00",
                    "background": "04800033",
                    "token": "constant.language.pseudo-variable"
                },
                {
                    "foreground": "00ff79",
                    "token": "constant.other"
                },
                {
                    "foreground": "00ff79",
                    "token": "constant.block"
                },
                {
                    "foreground": "00fff8",
                    "token": "support.constant"
                },
                {
                    "foreground": "00fff8",
                    "token": "constant.name"
                },
                {
                    "foreground": "00ff79",
                    "background": "00807c33",
                    "token": "variable.other.readwrite.global.pre-defined"
                },
                {
                    "foreground": "00ff79",
                    "background": "00807c33",
                    "token": "variable.language"
                },
                {
                    "foreground": "00fff8",
                    "token": "variable.other.constant"
                },
                {
                    "foreground": "00fff8",
                    "background": "00807c33",
                    "token": "support.variable"
                },
                {
                    "foreground": "00807c",
                    "background": "00438033",
                    "token": "variable.other.readwrite.global"
                },
                {
                    "foreground": "31a6ff",
                    "token": "variable.other"
                },
                {
                    "foreground": "31a6ff",
                    "token": "variable.js"
                },
                {
                    "foreground": "31a6ff",
                    "token": "punctuation.separator.variable"
                },
                {
                    "foreground": "0086ff",
                    "background": "0008ff33",
                    "token": "variable.other.readwrite.class"
                },
                {
                    "foreground": "406180",
                    "token": "variable.other.readwrite.instance"
                },
                {
                    "foreground": "406180",
                    "token": "variable.other.php"
                },
                {
                    "foreground": "406180",
                    "token": "variable.other.normal"
                },
                {
                    "foreground": "00000080",
                    "token": "punctuation.definition"
                },
                {
                    "foreground": "00000080",
                    "token": "punctuation.separator.variable"
                },
                {
                    "foreground": "7e0080",
                    "token": "storage -storage.modifier"
                },
                {
                    "background": "803d0033",
                    "token": "other.preprocessor"
                },
                {
                    "background": "803d0033",
                    "token": "entity.name.preprocessor"
                },
                {
                    "foreground": "666666",
                    "token": "variable.language.this.js"
                },
                {
                    "foreground": "803d00",
                    "token": "storage.modifier"
                },
                {
                    "foreground": "ff0000",
                    "token": "entity.name.class"
                },
                {
                    "foreground": "ff0000",
                    "token": "entity.name.type.class"
                },
                {
                    "foreground": "ff0000",
                    "token": "entity.name.type.module"
                },
                {
                    "foreground": "870000",
                    "background": "ff000033",
                    "token": "meta.class -meta.class.instance"
                },
                {
                    "foreground": "870000",
                    "background": "ff000033",
                    "token": "declaration.class"
                },
                {
                    "foreground": "870000",
                    "background": "ff000033",
                    "token": "meta.definition.class"
                },
                {
                    "foreground": "870000",
                    "background": "ff000033",
                    "token": "declaration.module"
                },
                {
                    "foreground": "ff0000",
                    "background": "87000033",
                    "token": "support.type"
                },
                {
                    "foreground": "ff0000",
                    "background": "87000033",
                    "token": "support.class"
                },
                {
                    "foreground": "ff3d44",
                    "token": "entity.name.instance"
                },
                {
                    "foreground": "ff3d44",
                    "token": "entity.name.type.instance"
                },
                {
                    "background": "831e5133",
                    "token": "meta.class.instance.constructor"
                },
                {
                    "foreground": "ff0086",
                    "background": "80000433",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "ff0086",
                    "background": "80000433",
                    "token": "entity.name.module"
                },
                {
                    "foreground": "ff0086",
                    "token": "meta.definition.method"
                },
                {
                    "foreground": "ff0086",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "ff0086",
                    "token": "entity.name.preprocessor"
                },
                {
                    "foreground": "9799ff",
                    "token": "variable.parameter.function"
                },
                {
                    "foreground": "9799ff",
                    "token": "variable.parameter -variable.parameter.misc.css"
                },
                {
                    "foreground": "9799ff",
                    "token": "meta.definition.method  meta.definition.param-list"
                },
                {
                    "foreground": "9799ff",
                    "token": "meta.function.method.with-arguments variable.parameter.function"
                },
                {
                    "foreground": "800004",
                    "token": "punctuation.definition.parameters"
                },
                {
                    "foreground": "800004",
                    "token": "variable.parameter.function punctuation.separator.object"
                },
                {
                    "foreground": "782ec1",
                    "token": "keyword.other.special-method"
                },
                {
                    "foreground": "782ec1",
                    "token": "meta.function-call entity.name.function -(meta.function-call meta.function)"
                },
                {
                    "foreground": "782ec1",
                    "token": "support.function - variable"
                },
                {
                    "foreground": "9d3eff",
                    "token": "meta.function-call support.function - variable"
                },
                {
                    "foreground": "603f80",
                    "background": "603f8033",
                    "token": "support.function"
                },
                {
                    "foreground": "bc80ff",
                    "token": "punctuation.section.function"
                },
                {
                    "foreground": "bc80ff",
                    "token": "meta.brace.curly.function"
                },
                {
                    "foreground": "bc80ff",
                    "token": "meta.function-call punctuation.section.scope.ruby"
                },
                {
                    "foreground": "bc80ff",
                    "token": "meta.function-call punctuation.separator.object"
                },
                {
                    "foreground": "bc80ff",
                    "fontStyle": "bold",
                    "token": "meta.group.braces.round punctuation.section.scope"
                },
                {
                    "foreground": "bc80ff",
                    "fontStyle": "bold",
                    "token": "meta.group.braces.round meta.delimiter.object.comma"
                },
                {
                    "foreground": "bc80ff",
                    "fontStyle": "bold",
                    "token": "meta.group.braces.curly.function meta.delimiter.object.comma"
                },
                {
                    "foreground": "bc80ff",
                    "fontStyle": "bold",
                    "token": "meta.brace.round"
                },
                {
                    "foreground": "a88fc0",
                    "token": "meta.function-call.method.without-arguments"
                },
                {
                    "foreground": "a88fc0",
                    "token": "meta.function-call.method.without-arguments entity.name.function"
                },
                {
                    "foreground": "f800ff",
                    "token": "keyword.control"
                },
                {
                    "foreground": "7900ff",
                    "token": "keyword.other"
                },
                {
                    "foreground": "0000ce",
                    "token": "keyword.operator"
                },
                {
                    "foreground": "0000ce",
                    "token": "declaration.function.operator"
                },
                {
                    "foreground": "0000ce",
                    "token": "meta.preprocessor.c.include"
                },
                {
                    "foreground": "0000ce",
                    "token": "punctuation.separator.operator"
                },
                {
                    "foreground": "0000ce",
                    "background": "00009a33",
                    "token": "keyword.operator.assignment"
                },
                {
                    "foreground": "2136ce",
                    "token": "keyword.operator.arithmetic"
                },
                {
                    "foreground": "3759ff",
                    "background": "00009a33",
                    "token": "keyword.operator.logical"
                },
                {
                    "foreground": "7c88ff",
                    "token": "keyword.operator.comparison"
                },
                {
                    "foreground": "800043",
                    "token": "meta.class.instance.constructor keyword.operator.new"
                },
                {
                    "foreground": "cccccc",
                    "background": "333333",
                    "token": "meta.doctype"
                },
                {
                    "foreground": "cccccc",
                    "background": "333333",
                    "token": "meta.tag.sgml-declaration.doctype"
                },
                {
                    "foreground": "cccccc",
                    "background": "333333",
                    "token": "meta.tag.sgml.doctype"
                },
                {
                    "foreground": "333333",
                    "token": "meta.tag"
                },
                {
                    "foreground": "666666",
                    "background": "333333bf",
                    "token": "meta.tag.structure"
                },
                {
                    "foreground": "666666",
                    "background": "333333bf",
                    "token": "meta.tag.segment"
                },
                {
                    "foreground": "4c4c4c",
                    "background": "4c4c4c33",
                    "token": "meta.tag.block"
                },
                {
                    "foreground": "4c4c4c",
                    "background": "4c4c4c33",
                    "token": "meta.tag.xml"
                },
                {
                    "foreground": "4c4c4c",
                    "background": "4c4c4c33",
                    "token": "meta.tag.key"
                },
                {
                    "foreground": "ff7900",
                    "background": "803d0033",
                    "token": "meta.tag.inline"
                },
                {
                    "background": "803d0033",
                    "token": "meta.tag.inline source"
                },
                {
                    "foreground": "ff0007",
                    "background": "80000433",
                    "token": "meta.tag.other"
                },
                {
                    "foreground": "ff0007",
                    "background": "80000433",
                    "token": "entity.name.tag.style"
                },
                {
                    "foreground": "ff0007",
                    "background": "80000433",
                    "token": "entity.name.tag.script"
                },
                {
                    "foreground": "ff0007",
                    "background": "80000433",
                    "token": "meta.tag.block.script"
                },
                {
                    "foreground": "ff0007",
                    "background": "80000433",
                    "token": "source.js.embedded punctuation.definition.tag.html"
                },
                {
                    "foreground": "ff0007",
                    "background": "80000433",
                    "token": "source.css.embedded punctuation.definition.tag.html"
                },
                {
                    "foreground": "0086ff",
                    "background": "00438033",
                    "token": "meta.tag.form"
                },
                {
                    "foreground": "0086ff",
                    "background": "00438033",
                    "token": "meta.tag.block.form"
                },
                {
                    "foreground": "f800ff",
                    "background": "3c008033",
                    "token": "meta.tag.meta"
                },
                {
                    "background": "121212",
                    "token": "meta.section.html.head"
                },
                {
                    "background": "0043801a",
                    "token": "meta.section.html.form"
                },
                {
                    "foreground": "666666",
                    "token": "meta.tag.xml"
                },
                {
                    "foreground": "ffffff4d",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "ffffff33",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "ffffff33",
                    "token": "meta.tag punctuation.definition.string"
                },
                {
                    "foreground": "ffffff66",
                    "token": "meta.tag string -source -punctuation"
                },
                {
                    "foreground": "ffffff66",
                    "token": "text source text meta.tag string -punctuation"
                },
                {
                    "foreground": "999999",
                    "token": "text meta.paragraph"
                },
                {
                    "foreground": "fff800",
                    "background": "33333333",
                    "token": "markup markup -(markup meta.paragraph.list)"
                },
                {
                    "foreground": "000000",
                    "background": "ffffff",
                    "token": "markup.hr"
                },
                {
                    "foreground": "ffffff",
                    "token": "markup.heading"
                },
                {
                    "foreground": "95d4ff80",
                    "fontStyle": "bold",
                    "token": "markup.bold"
                },
                {
                    "fontStyle": "italic",
                    "token": "markup.italic"
                },
                {
                    "fontStyle": "underline",
                    "token": "markup.underline"
                },
                {
                    "foreground": "0086ff",
                    "token": "meta.reference"
                },
                {
                    "foreground": "0086ff",
                    "token": "markup.underline.link"
                },
                {
                    "foreground": "00fff8",
                    "background": "00438033",
                    "token": "entity.name.reference"
                },
                {
                    "foreground": "00fff8",
                    "fontStyle": "underline",
                    "token": "meta.reference.list markup.underline.link"
                },
                {
                    "foreground": "00fff8",
                    "fontStyle": "underline",
                    "token": "text.html.textile markup.underline.link"
                },
                {
                    "background": "80808040",
                    "token": "markup.raw.block"
                },
                {
                    "background": "ffffff1a",
                    "token": "markup.quote"
                },
                {
                    "foreground": "ffffff",
                    "token": "markup.list meta.paragraph"
                },
                {
                    "foreground": "000000",
                    "background": "ffffff",
                    "token": "text.html.markdown"
                },
                {
                    "foreground": "000000",
                    "token": "text.html.markdown meta.paragraph"
                },
                {
                    "foreground": "555555",
                    "token": "text.html.markdown markup.list meta.paragraph"
                },
                {
                    "foreground": "000000",
                    "fontStyle": "bold",
                    "token": "text.html.markdown markup.heading"
                },
                {
                    "foreground": "8a5420",
                    "token": "text.html.markdown string"
                },
                {
                    "foreground": "666666",
                    "token": "meta.selector"
                },
                {
                    "foreground": "006680",
                    "token": "source.css meta.scope.property-list meta.property-value punctuation.definition.arguments"
                },
                {
                    "foreground": "006680",
                    "token": "source.css meta.scope.property-list meta.property-value punctuation.separator.arguments"
                },
                {
                    "foreground": "4f00ff",
                    "token": "entity.other.attribute-name.pseudo-element"
                },
                {
                    "foreground": "7900ff",
                    "token": "entity.other.attribute-name.pseudo-class"
                },
                {
                    "foreground": "7900ff",
                    "token": "entity.other.attribute-name.tag.pseudo-class"
                },
                {
                    "foreground": "f800ff",
                    "token": "meta.selector entity.other.attribute-name.class"
                },
                {
                    "foreground": "ff0086",
                    "token": "meta.selector entity.other.attribute-name.id"
                },
                {
                    "foreground": "ff0007",
                    "token": "meta.selector entity.name.tag"
                },
                {
                    "foreground": "ff7900",
                    "fontStyle": "bold",
                    "token": "entity.name.tag.wildcard"
                },
                {
                    "foreground": "ff7900",
                    "fontStyle": "bold",
                    "token": "entity.other.attribute-name.universal"
                },
                {
                    "foreground": "c25a00",
                    "token": "source.css entity.other.attribute-name.attribute"
                },
                {
                    "foreground": "673000",
                    "token": "source.css meta.attribute-selector keyword.operator.comparison"
                },
                {
                    "foreground": "333333",
                    "fontStyle": "bold",
                    "token": "meta.scope.property-list"
                },
                {
                    "foreground": "999999",
                    "token": "meta.property-name"
                },
                {
                    "foreground": "ffffff",
                    "background": "0d0d0d",
                    "token": "support.type.property-name"
                },
                {
                    "foreground": "999999",
                    "background": "19191980",
                    "token": "meta.property-value"
                },
                {
                    "background": "000000",
                    "token": "text.latex markup.raw"
                },
                {
                    "foreground": "bc80ff",
                    "token": "text.latex support.function -support.function.textit -support.function.emph"
                },
                {
                    "foreground": "ffffffbf",
                    "token": "text.latex support.function.section"
                },
                {
                    "foreground": "000000",
                    "background": "ffffff",
                    "token": "text.latex entity.name.section -meta.group -keyword.operator.braces"
                },
                {
                    "background": "00000080",
                    "token": "text.latex keyword.operator.delimiter"
                },
                {
                    "foreground": "999999",
                    "token": "text.latex keyword.operator.brackets"
                },
                {
                    "foreground": "666666",
                    "token": "text.latex keyword.operator.braces"
                },
                {
                    "foreground": "0008ff4d",
                    "background": "00008033",
                    "token": "meta.footnote"
                },
                {
                    "background": "ffffff0d",
                    "token": "text.latex meta.label.reference"
                },
                {
                    "foreground": "ff0007",
                    "background": "260001",
                    "token": "text.latex keyword.control.ref"
                },
                {
                    "foreground": "ffbc80",
                    "background": "400002",
                    "token": "text.latex variable.parameter.label.reference"
                },
                {
                    "foreground": "ff0086",
                    "background": "260014",
                    "token": "text.latex keyword.control.cite"
                },
                {
                    "foreground": "ffbfe1",
                    "background": "400022",
                    "token": "variable.parameter.cite"
                },
                {
                    "foreground": "ffffff80",
                    "token": "text.latex variable.parameter.label"
                },
                {
                    "foreground": "cdcdcd",
                    "token": "meta.function markup"
                },
                {
                    "foreground": "33333333",
                    "token": "text.latex meta.group.braces"
                },
                {
                    "foreground": "33333333",
                    "background": "00000080",
                    "token": "text.latex meta.environment.list"
                },
                {
                    "foreground": "33333333",
                    "background": "00000080",
                    "token": "text.latex meta.environment.list meta.environment.list"
                },
                {
                    "foreground": "33333333",
                    "background": "000000",
                    "token": "text.latex meta.environment.list meta.environment.list meta.environment.list"
                },
                {
                    "foreground": "33333333",
                    "token": "text.latex meta.environment.list meta.environment.list meta.environment.list meta.environment.list"
                },
                {
                    "foreground": "33333333",
                    "token": "text.latex meta.environment.list meta.environment.list meta.environment.list meta.environment.list meta.environment.list"
                },
                {
                    "foreground": "33333333",
                    "token": "text.latex meta.environment.list meta.environment.list meta.environment.list meta.environment.list meta.environment.list meta.environment.list"
                },
                {
                    "foreground": "000000",
                    "background": "cccccc",
                    "token": "text.latex meta.end-document"
                },
                {
                    "foreground": "000000",
                    "background": "cccccc",
                    "token": "text.latex meta.begin-document"
                },
                {
                    "foreground": "000000",
                    "background": "cccccc",
                    "token": "meta.end-document.latex support.function"
                },
                {
                    "foreground": "000000",
                    "background": "cccccc",
                    "token": "meta.end-document.latex variable.parameter"
                },
                {
                    "foreground": "000000",
                    "background": "cccccc",
                    "token": "meta.begin-document.latex support.function"
                },
                {
                    "foreground": "000000",
                    "background": "cccccc",
                    "token": "meta.begin-document.latex variable.parameter"
                },
                {
                    "foreground": "00ffaa",
                    "background": "00805533",
                    "token": "meta.brace.erb.return-value"
                },
                {
                    "background": "8080801a",
                    "token": "source.ruby.rails.embedded.return-value.one-line"
                },
                {
                    "foreground": "00fff8",
                    "background": "00fff81a",
                    "token": "punctuation.section.embedded -(source string source punctuation.section.embedded)"
                },
                {
                    "foreground": "00fff8",
                    "background": "00fff81a",
                    "token": "meta.brace.erb.html"
                },
                {
                    "background": "00fff81a",
                    "token": "source.ruby.rails.embedded.one-line"
                },
                {
                    "foreground": "406180",
                    "token": "source string source punctuation.section.embedded"
                },
                {
                    "background": "0d0d0d",
                    "token": "source.js.embedded"
                },
                {
                    "background": "000000",
                    "token": "meta.brace.erb"
                },
                {
                    "foreground": "ffffff",
                    "background": "33333380",
                    "token": "source string source"
                },
                {
                    "foreground": "999999",
                    "background": "00000099",
                    "token": "source string.interpolated source"
                },
                {
                    "background": "3333331a",
                    "token": "source source"
                },
                {
                    "background": "3333331a",
                    "token": "source.java.embedded"
                },
                {
                    "foreground": "ffffff",
                    "token": "text -text.xml.strict"
                },
                {
                    "foreground": "cccccc",
                    "background": "000000",
                    "token": "text source"
                },
                {
                    "foreground": "cccccc",
                    "background": "000000",
                    "token": "meta.scope.django.template"
                },
                {
                    "foreground": "999999",
                    "token": "text string source"
                },
                {
                    "foreground": "330004",
                    "background": "ff0007",
                    "fontStyle": "bold",
                    "token": "invalid -invalid.SOMETHING"
                },
                {
                    "foreground": "ff3600",
                    "fontStyle": "underline",
                    "token": "invalid.SOMETHING"
                },
                {
                    "foreground": "333333",
                    "token": "meta.syntax"
                },
                {
                    "foreground": "4c4c4c",
                    "background": "33333333",
                    "token": "comment -comment.line"
                },
                {
                    "foreground": "4c4c4c",
                    "fontStyle": "italic",
                    "token": "comment.line"
                },
                {
                    "fontStyle": "italic",
                    "token": "text comment.block -source"
                },
                {
                    "foreground": "40ff9a",
                    "background": "00401e",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "ff40a3",
                    "background": "400022",
                    "token": "markup.deleted"
                },
                {
                    "foreground": "ffff55",
                    "background": "803d00",
                    "token": "markup.changed"
                },
                {
                    "foreground": "ffffff",
                    "background": "000000",
                    "token": "text.subversion-commit meta.scope.changed-files"
                },
                {
                    "foreground": "ffffff",
                    "background": "000000",
                    "token": "text.subversion-commit meta.scope.changed-files.svn meta.diff.separator"
                },
                {
                    "foreground": "000000",
                    "background": "ffffff",
                    "token": "text.subversion-commit"
                },
                {
                    "foreground": "7f7f7f",
                    "background": "ffffff03",
                    "fontStyle": "bold",
                    "token": "punctuation.terminator"
                },
                {
                    "foreground": "7f7f7f",
                    "background": "ffffff03",
                    "fontStyle": "bold",
                    "token": "meta.delimiter"
                },
                {
                    "foreground": "7f7f7f",
                    "background": "ffffff03",
                    "fontStyle": "bold",
                    "token": "punctuation.separator.method"
                },
                {
                    "background": "00000080",
                    "token": "punctuation.terminator.statement"
                },
                {
                    "background": "00000080",
                    "token": "meta.delimiter.statement.js"
                },
                {
                    "background": "00000040",
                    "token": "meta.delimiter.object.js"
                },
                {
                    "foreground": "803d00",
                    "fontStyle": "bold",
                    "token": "string.quoted.single.brace"
                },
                {
                    "foreground": "803d00",
                    "fontStyle": "bold",
                    "token": "string.quoted.double.brace"
                },
                {
                    "foreground": "333333",
                    "background": "dcdcdc",
                    "token": "text.blog"
                },
                {
                    "foreground": "333333",
                    "background": "dcdcdc",
                    "token": "text.mail"
                },
                {
                    "foreground": "cccccc",
                    "background": "000000",
                    "token": "text.blog text"
                },
                {
                    "foreground": "cccccc",
                    "background": "000000",
                    "token": "text.mail text"
                },
                {
                    "foreground": "06403e",
                    "background": "00fff81a",
                    "token": "meta.header.blog keyword.other"
                },
                {
                    "foreground": "06403e",
                    "background": "00fff81a",
                    "token": "meta.header.mail keyword.other"
                },
                {
                    "foreground": "803d00",
                    "background": "ffff551a",
                    "token": "meta.header.blog string.unquoted.blog"
                },
                {
                    "foreground": "803d00",
                    "background": "ffff551a",
                    "token": "meta.header.mail string.unquoted"
                },
                {
                    "foreground": "ff0000",
                    "token": "source.ocaml entity.name.type.module"
                },
                {
                    "foreground": "ff0000",
                    "background": "83000033",
                    "token": "source.ocaml support.other.module"
                },
                {
                    "foreground": "00fff8",
                    "token": "entity.name.type.variant"
                },
                {
                    "foreground": "00ff79",
                    "token": "source.ocaml entity.name.tag"
                },
                {
                    "foreground": "00ff79",
                    "token": "source.ocaml meta.record.definition"
                },
                {
                    "foreground": "ffffff",
                    "fontStyle": "bold",
                    "token": "punctuation.separator.parameters"
                },
                {
                    "foreground": "4c4c4c",
                    "background": "33333333",
                    "token": "meta.brace.pipe"
                },
                {
                    "foreground": "666666",
                    "fontStyle": "bold",
                    "token": "meta.brace.erb"
                },
                {
                    "foreground": "666666",
                    "fontStyle": "bold",
                    "token": "source.ruby.embedded.source.brace"
                },
                {
                    "foreground": "666666",
                    "fontStyle": "bold",
                    "token": "punctuation.section.dictionary"
                },
                {
                    "foreground": "666666",
                    "fontStyle": "bold",
                    "token": "punctuation.terminator.dictionary"
                },
                {
                    "foreground": "666666",
                    "fontStyle": "bold",
                    "token": "punctuation.separator.object"
                },
                {
                    "foreground": "666666",
                    "fontStyle": "bold",
                    "token": "punctuation.separator.statement"
                },
                {
                    "foreground": "666666",
                    "fontStyle": "bold",
                    "token": "punctuation.separator.key-value.css"
                },
                {
                    "foreground": "999999",
                    "fontStyle": "bold",
                    "token": "punctuation.section.scope.curly"
                },
                {
                    "foreground": "999999",
                    "fontStyle": "bold",
                    "token": "punctuation.section.scope"
                },
                {
                    "foreground": "0c823b",
                    "fontStyle": "bold",
                    "token": "punctuation.separator.objects"
                },
                {
                    "foreground": "0c823b",
                    "fontStyle": "bold",
                    "token": "meta.group.braces.curly meta.delimiter.object.comma"
                },
                {
                    "foreground": "0c823b",
                    "fontStyle": "bold",
                    "token": "punctuation.separator.key-value -meta.tag"
                },
                {
                    "foreground": "0c823b",
                    "fontStyle": "bold",
                    "token": "source.ocaml punctuation.separator.match-definition"
                },
                {
                    "foreground": "800043",
                    "token": "punctuation.separator.parameters.function.js"
                },
                {
                    "foreground": "800043",
                    "token": "punctuation.definition.function"
                },
                {
                    "foreground": "800043",
                    "token": "punctuation.separator.function-return"
                },
                {
                    "foreground": "800043",
                    "token": "punctuation.separator.function-definition"
                },
                {
                    "foreground": "800043",
                    "token": "punctuation.definition.arguments"
                },
                {
                    "foreground": "800043",
                    "token": "punctuation.separator.arguments"
                },
                {
                    "foreground": "7f5e40",
                    "background": "803d001a",
                    "fontStyle": "bold",
                    "token": "meta.group.braces.square punctuation.section.scope"
                },
                {
                    "foreground": "7f5e40",
                    "background": "803d001a",
                    "fontStyle": "bold",
                    "token": "meta.group.braces.square meta.delimiter.object.comma"
                },
                {
                    "foreground": "7f5e40",
                    "background": "803d001a",
                    "fontStyle": "bold",
                    "token": "meta.brace.square"
                },
                {
                    "foreground": "7f5e40",
                    "background": "803d001a",
                    "fontStyle": "bold",
                    "token": "punctuation.separator.array"
                },
                {
                    "foreground": "7f5e40",
                    "background": "803d001a",
                    "fontStyle": "bold",
                    "token": "punctuation.section.array"
                },
                {
                    "foreground": "7f5e40",
                    "background": "803d001a",
                    "fontStyle": "bold",
                    "token": "punctuation.definition.array"
                },
                {
                    "foreground": "7f5e40",
                    "background": "803d001a",
                    "fontStyle": "bold",
                    "token": "punctuation.definition.constant.range"
                },
                {
                    "background": "803d001a",
                    "token": "meta.structure.array -punctuation.definition.array"
                },
                {
                    "background": "803d001a",
                    "token": "meta.definition.range -punctuation.definition.constant.range"
                },
                {
                    "background": "00000080",
                    "token": "meta.brace.curly meta.group.css"
                },
                {
                    "foreground": "666666",
                    "background": "00000080",
                    "token": "meta.source.embedded"
                },
                {
                    "foreground": "666666",
                    "background": "00000080",
                    "token": "entity.other.django.tagbraces"
                },
                {
                    "background": "00000080",
                    "token": "source.ruby meta.even-tab"
                },
                {
                    "background": "00000080",
                    "token": "source.ruby meta.even-tab.group2"
                },
                {
                    "background": "00000080",
                    "token": "source.ruby meta.even-tab.group4"
                },
                {
                    "background": "00000080",
                    "token": "source.ruby meta.even-tab.group6"
                },
                {
                    "background": "00000080",
                    "token": "source.ruby meta.even-tab.group8"
                },
                {
                    "background": "00000080",
                    "token": "source.ruby meta.even-tab.group10"
                },
                {
                    "background": "00000080",
                    "token": "source.ruby meta.even-tab.group12"
                },
                {
                    "foreground": "666666",
                    "token": "meta.block.slate"
                },
                {
                    "foreground": "cccccc",
                    "token": "meta.block.content.slate"
                },
                {
                    "background": "0a0a0a",
                    "token": "meta.odd-tab.group1"
                },
                {
                    "background": "0a0a0a",
                    "token": "meta.group.braces"
                },
                {
                    "background": "0a0a0a",
                    "token": "meta.block.slate"
                },
                {
                    "background": "0a0a0a",
                    "token": "text.xml.strict meta.tag"
                },
                {
                    "background": "0a0a0a",
                    "token": "meta.paren-group"
                },
                {
                    "background": "0a0a0a",
                    "token": "meta.section"
                },
                {
                    "background": "0e0e0e",
                    "token": "meta.even-tab.group2"
                },
                {
                    "background": "0e0e0e",
                    "token": "meta.group.braces meta.group.braces"
                },
                {
                    "background": "0e0e0e",
                    "token": "meta.block.slate meta.block.slate"
                },
                {
                    "background": "0e0e0e",
                    "token": "text.xml.strict meta.tag meta.tag"
                },
                {
                    "background": "0e0e0e",
                    "token": "meta.group.braces meta.group.braces"
                },
                {
                    "background": "0e0e0e",
                    "token": "meta.paren-group meta.paren-group"
                },
                {
                    "background": "0e0e0e",
                    "token": "meta.section meta.section"
                },
                {
                    "background": "111111",
                    "token": "meta.odd-tab.group3"
                },
                {
                    "background": "111111",
                    "token": "meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "111111",
                    "token": "meta.block.slate meta.block.slate meta.block.slate"
                },
                {
                    "background": "111111",
                    "token": "text.xml.strict meta.tag meta.tag meta.tag"
                },
                {
                    "background": "111111",
                    "token": "meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "111111",
                    "token": "meta.paren-group meta.paren-group meta.paren-group"
                },
                {
                    "background": "111111",
                    "token": "meta.section meta.section meta.section"
                },
                {
                    "background": "151515",
                    "token": "meta.even-tab.group4"
                },
                {
                    "background": "151515",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "151515",
                    "token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
                },
                {
                    "background": "151515",
                    "token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag"
                },
                {
                    "background": "151515",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "151515",
                    "token": "meta.paren-group meta.paren-group meta.paren-group meta.paren-group"
                },
                {
                    "background": "151515",
                    "token": "meta.section meta.section meta.section meta.section"
                },
                {
                    "background": "191919",
                    "token": "meta.odd-tab.group5"
                },
                {
                    "background": "191919",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "191919",
                    "token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
                },
                {
                    "background": "191919",
                    "token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag"
                },
                {
                    "background": "191919",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "191919",
                    "token": "meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group"
                },
                {
                    "background": "191919",
                    "token": "meta.section meta.section meta.section meta.section meta.section"
                },
                {
                    "background": "1c1c1c",
                    "token": "meta.even-tab.group6"
                },
                {
                    "background": "1c1c1c",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "1c1c1c",
                    "token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
                },
                {
                    "background": "1c1c1c",
                    "token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag"
                },
                {
                    "background": "1c1c1c",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "1c1c1c",
                    "token": "meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group"
                },
                {
                    "background": "1c1c1c",
                    "token": "meta.section meta.section meta.section meta.section meta.section meta.section"
                },
                {
                    "background": "1f1f1f",
                    "token": "meta.odd-tab.group7"
                },
                {
                    "background": "1f1f1f",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "1f1f1f",
                    "token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
                },
                {
                    "background": "1f1f1f",
                    "token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag"
                },
                {
                    "background": "1f1f1f",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "1f1f1f",
                    "token": "meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group"
                },
                {
                    "background": "1f1f1f",
                    "token": "meta.section meta.section meta.section meta.section meta.section meta.section meta.section"
                },
                {
                    "background": "212121",
                    "token": "meta.even-tab.group8"
                },
                {
                    "background": "212121",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "212121",
                    "token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
                },
                {
                    "background": "212121",
                    "token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag"
                },
                {
                    "background": "212121",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "212121",
                    "token": "meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group"
                },
                {
                    "background": "212121",
                    "token": "meta.section meta.section meta.section meta.section meta.section meta.section meta.section meta.section"
                },
                {
                    "background": "242424",
                    "token": "meta.odd-tab.group9"
                },
                {
                    "background": "242424",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "242424",
                    "token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
                },
                {
                    "background": "242424",
                    "token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag"
                },
                {
                    "background": "242424",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "242424",
                    "token": "meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group meta.paren-group"
                },
                {
                    "background": "242424",
                    "token": "meta.section meta.section meta.section meta.section meta.section meta.section meta.section meta.section meta.section"
                },
                {
                    "background": "1f1f1f",
                    "token": "meta.even-tab.group10"
                },
                {
                    "background": "151515",
                    "token": "meta.odd-tab.group11"
                },
                {
                    "foreground": "1b95e2",
                    "token": "meta.property.vendor.microsoft.trident.4"
                },
                {
                    "foreground": "1b95e2",
                    "token": "meta.property.vendor.microsoft.trident.4 support.type.property-name"
                },
                {
                    "foreground": "1b95e2",
                    "token": "meta.property.vendor.microsoft.trident.4 punctuation.terminator.rule"
                },
                {
                    "foreground": "f5c034",
                    "token": "meta.property.vendor.microsoft.trident.5"
                },
                {
                    "foreground": "f5c034",
                    "token": "meta.property.vendor.microsoft.trident.5 support.type.property-name"
                },
                {
                    "foreground": "f5c034",
                    "token": "meta.property.vendor.microsoft.trident.5 punctuation.separator.key-value"
                },
                {
                    "foreground": "f5c034",
                    "token": "meta.property.vendor.microsoft.trident.5 punctuation.terminator.rule"
                }
            ],
            "colors": {
                "editor.foreground": "#EEEEEE",
                "editor.background": "#0D0D0DFA",
                "editor.selectionBackground": "#0010B499",
                "editor.lineHighlightBackground": "#00008033",
                "editorCursor.foreground": "#3333FF",
                "editorWhitespace.foreground": "#CCCCCC1A"
            }
        },
        id: "brilliance-black"
    },
    {
        name: "Brilliance Dull",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "050505FA",
                    "token": ""
                },
                {
                    "foreground": "000000",
                    "background": "ffffff",
                    "fontStyle": "bold",
                    "token": "meta.thomas_aylott"
                },
                {
                    "foreground": "555555",
                    "background": "ffffff",
                    "fontStyle": "underline",
                    "token": "meta.subtlegradient"
                },
                {
                    "foreground": "e6e6e6",
                    "background": "ffffff",
                    "token": "meta.subtlegradient"
                },
                {
                    "foreground": "d2d1ab",
                    "background": "803d0033",
                    "token": "string -meta.tag -meta.doctype -string.regexp -string.literal -string.interpolated -string.quoted.literal -string.unquoted"
                },
                {
                    "foreground": "d2d1ab",
                    "background": "803d0033",
                    "token": "variable.parameter.misc.css"
                },
                {
                    "foreground": "d2d1ab",
                    "background": "803d0033",
                    "token": "text string source string"
                },
                {
                    "foreground": "d2d1ab",
                    "background": "803d0033",
                    "token": "string.unquoted string"
                },
                {
                    "foreground": "d2d1ab",
                    "background": "803d0033",
                    "token": "string.regexp string"
                },
                {
                    "foreground": "533f2c",
                    "token": "punctuation.definition.string -meta.tag"
                },
                {
                    "foreground": "fff80033",
                    "token": "string.regexp punctuation.definition.string"
                },
                {
                    "foreground": "fff80033",
                    "token": "string.quoted.literal punctuation.definition.string"
                },
                {
                    "foreground": "fff80033",
                    "token": "string.quoted.double.ruby.mod punctuation.definition.string"
                },
                {
                    "foreground": "a6a458",
                    "background": "43800033",
                    "token": "string.quoted.literal"
                },
                {
                    "foreground": "a6a458",
                    "background": "43800033",
                    "token": "string.quoted.double.ruby.mod"
                },
                {
                    "foreground": "d2beab",
                    "token": "string.unquoted -string.unquoted.embedded"
                },
                {
                    "foreground": "d2beab",
                    "token": "string.quoted.double.multiline"
                },
                {
                    "foreground": "d2beab",
                    "token": "meta.scope.heredoc"
                },
                {
                    "foreground": "d2d1ab",
                    "background": "1a1a1a",
                    "token": "string.interpolated"
                },
                {
                    "foreground": "a6a458",
                    "background": "43800033",
                    "token": "string.regexp"
                },
                {
                    "background": "43800033",
                    "token": "string.regexp.group"
                },
                {
                    "foreground": "ffffff66",
                    "background": "43800033",
                    "token": "string.regexp.group string.regexp.group"
                },
                {
                    "foreground": "ffffff66",
                    "background": "43800033",
                    "token": "string.regexp.group string.regexp.group string.regexp.group"
                },
                {
                    "foreground": "ffffff66",
                    "background": "43800033",
                    "token": "string.regexp.group string.regexp.group string.regexp.group string.regexp.group"
                },
                {
                    "foreground": "80a659",
                    "background": "43800033",
                    "token": "string.regexp.character-class"
                },
                {
                    "foreground": "56a5a4",
                    "background": "43800033",
                    "token": "string.regexp.arbitrary-repitition"
                },
                {
                    "foreground": "a75980",
                    "token": "source.regexp keyword.operator"
                },
                {
                    "foreground": "ffffff",
                    "fontStyle": "italic",
                    "token": "string.regexp comment"
                },
                {
                    "background": "0086ff33",
                    "token": "meta.group.assertion.regexp"
                },
                {
                    "foreground": "5780a6",
                    "token": "meta.assertion"
                },
                {
                    "foreground": "5780a6",
                    "token": "meta.group.assertion keyword.control.group.regexp"
                },
                {
                    "foreground": "95a658",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "80a659",
                    "token": "constant.character"
                },
                {
                    "foreground": "59a559",
                    "token": "constant.language"
                },
                {
                    "foreground": "59a559",
                    "token": "keyword.other.unit"
                },
                {
                    "foreground": "59a559",
                    "token": "constant.other.java"
                },
                {
                    "foreground": "59a559",
                    "token": "constant.other.unit"
                },
                {
                    "foreground": "59a559",
                    "background": "04800033",
                    "token": "constant.language.pseudo-variable"
                },
                {
                    "foreground": "57a57d",
                    "token": "constant.other"
                },
                {
                    "foreground": "57a57d",
                    "token": "constant.block"
                },
                {
                    "foreground": "56a5a4",
                    "token": "support.constant"
                },
                {
                    "foreground": "56a5a4",
                    "token": "constant.name"
                },
                {
                    "foreground": "5e6b6b",
                    "token": "variable.language"
                },
                {
                    "foreground": "5e6b6b",
                    "token": "variable.other.readwrite.global.pre-defined"
                },
                {
                    "foreground": "56a5a4",
                    "token": "variable.other.constant"
                },
                {
                    "foreground": "56a5a4",
                    "background": "00807c33",
                    "token": "support.variable"
                },
                {
                    "foreground": "2b5252",
                    "background": "00438033",
                    "token": "variable.other.readwrite.global"
                },
                {
                    "foreground": "5780a6",
                    "token": "variable.other"
                },
                {
                    "foreground": "5780a6",
                    "token": "variable.js"
                },
                {
                    "foreground": "5780a6",
                    "background": "0007ff33",
                    "token": "variable.other.readwrite.class"
                },
                {
                    "foreground": "555f69",
                    "token": "variable.other.readwrite.instance"
                },
                {
                    "foreground": "555f69",
                    "token": "variable.other.php"
                },
                {
                    "foreground": "555f69",
                    "token": "variable.other.normal"
                },
                {
                    "foreground": "00000080",
                    "token": "punctuation.definition -punctuation.definition.comment"
                },
                {
                    "foreground": "00000080",
                    "token": "punctuation.separator.variable"
                },
                {
                    "foreground": "a77d58",
                    "token": "storage -storage.modifier"
                },
                {
                    "background": "803d0033",
                    "token": "other.preprocessor"
                },
                {
                    "background": "803d0033",
                    "token": "entity.name.preprocessor"
                },
                {
                    "foreground": "666666",
                    "token": "variable.language.this.js"
                },
                {
                    "foreground": "533f2c",
                    "token": "storage.modifier"
                },
                {
                    "foreground": "a7595a",
                    "token": "entity.name.class"
                },
                {
                    "foreground": "a7595a",
                    "token": "entity.name.type.class"
                },
                {
                    "foreground": "a7595a",
                    "token": "entity.name.type.module"
                },
                {
                    "foreground": "532d2d",
                    "background": "29161780",
                    "token": "meta.class -meta.class.instance"
                },
                {
                    "foreground": "532d2d",
                    "background": "29161780",
                    "token": "declaration.class"
                },
                {
                    "foreground": "532d2d",
                    "background": "29161780",
                    "token": "meta.definition.class"
                },
                {
                    "foreground": "532d2d",
                    "background": "29161780",
                    "token": "declaration.module"
                },
                {
                    "foreground": "a7595a",
                    "background": "80000433",
                    "token": "support.type"
                },
                {
                    "foreground": "a7595a",
                    "background": "80000433",
                    "token": "support.class"
                },
                {
                    "foreground": "a7595a",
                    "token": "entity.name.instance"
                },
                {
                    "background": "80004333",
                    "token": "meta.class.instance.constructor"
                },
                {
                    "foreground": "a75980",
                    "background": "80000433",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "a75980",
                    "background": "80000433",
                    "token": "entity.name.module"
                },
                {
                    "foreground": "a75980",
                    "token": "object.property.function"
                },
                {
                    "foreground": "a75980",
                    "token": "meta.definition.method"
                },
                {
                    "foreground": "532d40",
                    "background": "80004333",
                    "token": "meta.function -(meta.tell-block)"
                },
                {
                    "foreground": "532d40",
                    "background": "80004333",
                    "token": "meta.property.function"
                },
                {
                    "foreground": "532d40",
                    "background": "80004333",
                    "token": "declaration.function"
                },
                {
                    "foreground": "a75980",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "a75980",
                    "token": "entity.name.preprocessor"
                },
                {
                    "foreground": "a459a5",
                    "token": "keyword"
                },
                {
                    "foreground": "a459a5",
                    "background": "3c008033",
                    "token": "keyword.control"
                },
                {
                    "foreground": "8d809d",
                    "token": "keyword.other.special-method"
                },
                {
                    "foreground": "8d809d",
                    "token": "meta.function-call entity.name.function -(meta.function-call meta.function)"
                },
                {
                    "foreground": "8d809d",
                    "token": "support.function - variable"
                },
                {
                    "foreground": "634683",
                    "token": "support.function - variable"
                },
                {
                    "foreground": "7979b7",
                    "fontStyle": "bold",
                    "token": "keyword.operator"
                },
                {
                    "foreground": "7979b7",
                    "fontStyle": "bold",
                    "token": "declaration.function.operator"
                },
                {
                    "foreground": "7979b7",
                    "fontStyle": "bold",
                    "token": "meta.preprocessor.c.include"
                },
                {
                    "foreground": "9899c8",
                    "token": "keyword.operator.comparison"
                },
                {
                    "foreground": "abacd2",
                    "background": "3c008033",
                    "token": "variable.parameter -variable.parameter.misc.css"
                },
                {
                    "foreground": "abacd2",
                    "background": "3c008033",
                    "token": "meta.definition.method  meta.definition.param-list"
                },
                {
                    "foreground": "abacd2",
                    "background": "3c008033",
                    "token": "meta.function.method.with-arguments variable.parameter.function"
                },
                {
                    "foreground": "cdcdcd",
                    "background": "333333",
                    "token": "meta.doctype"
                },
                {
                    "foreground": "cdcdcd",
                    "background": "333333",
                    "token": "meta.tag.sgml-declaration.doctype"
                },
                {
                    "foreground": "cdcdcd",
                    "background": "333333",
                    "token": "meta.tag.sgml.doctype"
                },
                {
                    "foreground": "333333",
                    "token": "meta.tag"
                },
                {
                    "foreground": "666666",
                    "background": "333333bf",
                    "token": "meta.tag.structure"
                },
                {
                    "foreground": "666666",
                    "background": "333333bf",
                    "token": "meta.tag.segment"
                },
                {
                    "foreground": "4c4c4c",
                    "background": "4c4c4c33",
                    "token": "meta.tag.block"
                },
                {
                    "foreground": "4c4c4c",
                    "background": "4c4c4c33",
                    "token": "meta.tag.xml"
                },
                {
                    "foreground": "4c4c4c",
                    "background": "4c4c4c33",
                    "token": "meta.tag.key"
                },
                {
                    "foreground": "a77d58",
                    "background": "803d0033",
                    "token": "meta.tag.inline"
                },
                {
                    "background": "803d0033",
                    "token": "meta.tag.inline source"
                },
                {
                    "foreground": "a7595a",
                    "background": "80000433",
                    "token": "meta.tag.other"
                },
                {
                    "foreground": "a7595a",
                    "background": "80000433",
                    "token": "entity.name.tag.style"
                },
                {
                    "foreground": "a7595a",
                    "background": "80000433",
                    "token": "source entity.other.attribute-name -text.html.basic.embedded"
                },
                {
                    "foreground": "a7595a",
                    "background": "80000433",
                    "token": "entity.name.tag.script"
                },
                {
                    "foreground": "a7595a",
                    "background": "80000433",
                    "token": "meta.tag.block.script"
                },
                {
                    "foreground": "5780a6",
                    "background": "00438033",
                    "token": "meta.tag.form"
                },
                {
                    "foreground": "5780a6",
                    "background": "00438033",
                    "token": "meta.tag.block.form"
                },
                {
                    "foreground": "a459a5",
                    "background": "3c008033",
                    "token": "meta.tag.meta"
                },
                {
                    "background": "121212",
                    "token": "meta.section.html.head"
                },
                {
                    "background": "0043801a",
                    "token": "meta.section.html.form"
                },
                {
                    "foreground": "666666",
                    "token": "meta.tag.xml"
                },
                {
                    "foreground": "ffffff4d",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "ffffff33",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "ffffff33",
                    "token": "meta.tag punctuation.definition.string"
                },
                {
                    "foreground": "ffffff66",
                    "token": "meta.tag string -source -punctuation"
                },
                {
                    "foreground": "ffffff66",
                    "token": "text source text meta.tag string -punctuation"
                },
                {
                    "foreground": "a6a458",
                    "background": "33333333",
                    "token": "markup markup -(markup meta.paragraph.list)"
                },
                {
                    "foreground": "000000",
                    "background": "ffffff",
                    "token": "markup.hr"
                },
                {
                    "foreground": "666666",
                    "background": "33333380",
                    "token": "markup.heading"
                },
                {
                    "fontStyle": "bold",
                    "token": "markup.bold"
                },
                {
                    "fontStyle": "italic",
                    "token": "markup.italic"
                },
                {
                    "fontStyle": "underline",
                    "token": "markup.underline"
                },
                {
                    "foreground": "5780a6",
                    "token": "meta.reference"
                },
                {
                    "foreground": "5780a6",
                    "token": "markup.underline.link"
                },
                {
                    "foreground": "56a5a4",
                    "background": "00438033",
                    "token": "entity.name.reference"
                },
                {
                    "foreground": "56a5a4",
                    "fontStyle": "underline",
                    "token": "meta.reference.list markup.underline.link"
                },
                {
                    "foreground": "56a5a4",
                    "fontStyle": "underline",
                    "token": "text.html.textile markup.underline.link"
                },
                {
                    "foreground": "999999",
                    "background": "000000",
                    "token": "markup.raw.block"
                },
                {
                    "background": "ffffff1a",
                    "token": "markup.quote"
                },
                {
                    "foreground": "666666",
                    "background": "00000080",
                    "token": "meta.selector"
                },
                {
                    "foreground": "575aa6",
                    "background": "00048033",
                    "token": "meta.attribute-match.css"
                },
                {
                    "foreground": "7c58a5",
                    "token": "entity.other.attribute-name.pseudo-class"
                },
                {
                    "foreground": "7c58a5",
                    "token": "entity.other.attribute-name.tag.pseudo-class"
                },
                {
                    "foreground": "a459a5",
                    "token": "meta.selector entity.other.attribute-name.class"
                },
                {
                    "foreground": "a75980",
                    "token": "meta.selector entity.other.attribute-name.id"
                },
                {
                    "foreground": "a7595a",
                    "token": "meta.selector entity.name.tag"
                },
                {
                    "foreground": "a77d58",
                    "fontStyle": "bold",
                    "token": "entity.name.tag.wildcard"
                },
                {
                    "foreground": "a77d58",
                    "fontStyle": "bold",
                    "token": "entity.other.attribute-name.universal"
                },
                {
                    "foreground": "333333",
                    "fontStyle": "bold",
                    "token": "meta.scope.property-list"
                },
                {
                    "foreground": "999999",
                    "token": "meta.property-name"
                },
                {
                    "foreground": "ffffff",
                    "background": "000000",
                    "token": "support.type.property-name"
                },
                {
                    "foreground": "999999",
                    "background": "0d0d0d",
                    "token": "meta.property-value"
                },
                {
                    "background": "000000",
                    "token": "text.latex markup.raw"
                },
                {
                    "foreground": "bdabd1",
                    "token": "text.latex support.function -support.function.textit -support.function.emph"
                },
                {
                    "foreground": "ffffffbf",
                    "token": "text.latex support.function.section"
                },
                {
                    "foreground": "000000",
                    "background": "ffffff",
                    "token": "text.latex entity.name.section -meta.group -keyword.operator.braces"
                },
                {
                    "background": "00000080",
                    "token": "text.latex keyword.operator.delimiter"
                },
                {
                    "foreground": "999999",
                    "token": "text.latex keyword.operator.brackets"
                },
                {
                    "foreground": "666666",
                    "token": "text.latex keyword.operator.braces"
                },
                {
                    "foreground": "0008ff4d",
                    "background": "00048033",
                    "token": "meta.footnote"
                },
                {
                    "background": "ffffff0d",
                    "token": "text.latex meta.label.reference"
                },
                {
                    "foreground": "a7595a",
                    "background": "180d0c",
                    "token": "text.latex keyword.control.ref"
                },
                {
                    "foreground": "d2beab",
                    "background": "291616",
                    "token": "text.latex variable.parameter.label.reference"
                },
                {
                    "foreground": "a75980",
                    "background": "180d12",
                    "token": "text.latex keyword.control.cite"
                },
                {
                    "foreground": "e8d5de",
                    "background": "29161f",
                    "token": "variable.parameter.cite"
                },
                {
                    "foreground": "ffffff80",
                    "token": "text.latex variable.parameter.label"
                },
                {
                    "foreground": "33333333",
                    "token": "text.latex meta.group.braces"
                },
                {
                    "foreground": "33333333",
                    "background": "00000080",
                    "token": "text.latex meta.environment.list"
                },
                {
                    "foreground": "33333333",
                    "background": "00000080",
                    "token": "text.latex meta.environment.list meta.environment.list"
                },
                {
                    "foreground": "33333333",
                    "background": "000000",
                    "token": "text.latex meta.environment.list meta.environment.list meta.environment.list"
                },
                {
                    "foreground": "33333333",
                    "token": "text.latex meta.environment.list meta.environment.list meta.environment.list meta.environment.list"
                },
                {
                    "foreground": "33333333",
                    "token": "text.latex meta.environment.list meta.environment.list meta.environment.list meta.environment.list meta.environment.list"
                },
                {
                    "foreground": "33333333",
                    "token": "text.latex meta.environment.list meta.environment.list meta.environment.list meta.environment.list meta.environment.list meta.environment.list"
                },
                {
                    "foreground": "000000",
                    "background": "cdcdcd",
                    "token": "text.latex meta.end-document"
                },
                {
                    "foreground": "000000",
                    "background": "cdcdcd",
                    "token": "text.latex meta.begin-document"
                },
                {
                    "foreground": "000000",
                    "background": "cdcdcd",
                    "token": "meta.end-document.latex support.function"
                },
                {
                    "foreground": "000000",
                    "background": "cdcdcd",
                    "token": "meta.end-document.latex variable.parameter"
                },
                {
                    "foreground": "000000",
                    "background": "cdcdcd",
                    "token": "meta.begin-document.latex support.function"
                },
                {
                    "foreground": "000000",
                    "background": "cdcdcd",
                    "token": "meta.begin-document.latex variable.parameter"
                },
                {
                    "foreground": "596b61",
                    "background": "45815d33",
                    "token": "meta.brace.erb.return-value"
                },
                {
                    "background": "66666633",
                    "token": "source.ruby.rails.embedded.return-value.one-line"
                },
                {
                    "foreground": "56a5a4",
                    "background": "00fff81a",
                    "token": "punctuation.section.embedded -(source string source punctuation.section.embedded)"
                },
                {
                    "foreground": "56a5a4",
                    "background": "00fff81a",
                    "token": "meta.brace.erb.html"
                },
                {
                    "background": "00fff81a",
                    "token": "source.ruby.rails.embedded.one-line"
                },
                {
                    "foreground": "555f69",
                    "token": "source string source punctuation.section.embedded"
                },
                {
                    "background": "000000",
                    "token": "source"
                },
                {
                    "background": "000000",
                    "token": "meta.brace.erb"
                },
                {
                    "foreground": "ffffff",
                    "background": "33333380",
                    "token": "source string source"
                },
                {
                    "foreground": "999999",
                    "background": "00000099",
                    "token": "source string.interpolated source"
                },
                {
                    "background": "3333331a",
                    "token": "source.java.embedded"
                },
                {
                    "foreground": "ffffff",
                    "token": "text -text.xml.strict"
                },
                {
                    "foreground": "cccccc",
                    "background": "000000",
                    "token": "text source"
                },
                {
                    "foreground": "cccccc",
                    "background": "000000",
                    "token": "meta.scope.django.template"
                },
                {
                    "foreground": "999999",
                    "token": "text string source"
                },
                {
                    "foreground": "333333",
                    "token": "meta.syntax"
                },
                {
                    "foreground": "211211",
                    "background": "a7595a",
                    "fontStyle": "bold",
                    "token": "invalid"
                },
                {
                    "foreground": "8f8fc3",
                    "background": "0000ff1a",
                    "fontStyle": "italic",
                    "token": "0comment"
                },
                {
                    "foreground": "0000ff1a",
                    "fontStyle": "bold",
                    "token": "comment punctuation"
                },
                {
                    "foreground": "333333",
                    "token": "comment"
                },
                {
                    "foreground": "262626",
                    "background": "8080800d",
                    "fontStyle": "bold italic",
                    "token": "comment punctuation"
                },
                {
                    "fontStyle": "italic",
                    "token": "text comment.block -source"
                },
                {
                    "foreground": "81bb9e",
                    "background": "15281f",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "bc839f",
                    "background": "400021",
                    "token": "markup.deleted"
                },
                {
                    "foreground": "c3c38f",
                    "background": "533f2c",
                    "token": "markup.changed"
                },
                {
                    "foreground": "ffffff",
                    "background": "000000",
                    "token": "text.subversion-commit meta.scope.changed-files"
                },
                {
                    "foreground": "ffffff",
                    "background": "000000",
                    "token": "text.subversion-commit meta.scope.changed-files.svn meta.diff.separator"
                },
                {
                    "foreground": "000000",
                    "background": "ffffff",
                    "token": "text.subversion-commit"
                },
                {
                    "foreground": "ffffff",
                    "background": "ffffff03",
                    "fontStyle": "bold",
                    "token": "punctuation.terminator"
                },
                {
                    "foreground": "ffffff",
                    "background": "ffffff03",
                    "fontStyle": "bold",
                    "token": "meta.delimiter"
                },
                {
                    "foreground": "ffffff",
                    "background": "ffffff03",
                    "fontStyle": "bold",
                    "token": "punctuation.separator.method"
                },
                {
                    "background": "000000bf",
                    "token": "punctuation.terminator.statement"
                },
                {
                    "background": "000000bf",
                    "token": "meta.delimiter.statement.js"
                },
                {
                    "background": "00000040",
                    "token": "meta.delimiter.object.js"
                },
                {
                    "foreground": "533f2c",
                    "fontStyle": "bold",
                    "token": "string.quoted.single.brace"
                },
                {
                    "foreground": "533f2c",
                    "fontStyle": "bold",
                    "token": "string.quoted.double.brace"
                },
                {
                    "background": "ffffff",
                    "token": "text.blog -(text.blog text)"
                },
                {
                    "foreground": "666666",
                    "background": "ffffff",
                    "token": "meta.headers.blog"
                },
                {
                    "foreground": "192b2a",
                    "background": "00fff81a",
                    "token": "meta.headers.blog keyword.other.blog"
                },
                {
                    "foreground": "533f2c",
                    "background": "ffff551a",
                    "token": "meta.headers.blog string.unquoted.blog"
                },
                {
                    "foreground": "4c4c4c",
                    "background": "33333333",
                    "token": "meta.brace.pipe"
                },
                {
                    "foreground": "4c4c4c",
                    "fontStyle": "bold",
                    "token": "meta.brace.erb"
                },
                {
                    "foreground": "4c4c4c",
                    "fontStyle": "bold",
                    "token": "source.ruby.embedded.source.brace"
                },
                {
                    "foreground": "4c4c4c",
                    "fontStyle": "bold",
                    "token": "punctuation.section.dictionary"
                },
                {
                    "foreground": "4c4c4c",
                    "fontStyle": "bold",
                    "token": "punctuation.terminator.dictionary"
                },
                {
                    "foreground": "4c4c4c",
                    "fontStyle": "bold",
                    "token": "punctuation.separator.object"
                },
                {
                    "foreground": "ffffff",
                    "fontStyle": "bold",
                    "token": "meta.group.braces.curly punctuation.section.scope"
                },
                {
                    "foreground": "ffffff",
                    "fontStyle": "bold",
                    "token": "meta.brace.curly"
                },
                {
                    "foreground": "345743",
                    "fontStyle": "bold",
                    "token": "punctuation.separator.objects"
                },
                {
                    "foreground": "345743",
                    "fontStyle": "bold",
                    "token": "meta.group.braces.curly meta.delimiter.object.comma"
                },
                {
                    "foreground": "345743",
                    "fontStyle": "bold",
                    "token": "punctuation.separator.key-value -meta.tag"
                },
                {
                    "foreground": "695f55",
                    "background": "803d001a",
                    "fontStyle": "bold",
                    "token": "meta.group.braces.square punctuation.section.scope"
                },
                {
                    "foreground": "695f55",
                    "background": "803d001a",
                    "fontStyle": "bold",
                    "token": "meta.group.braces.square meta.delimiter.object.comma"
                },
                {
                    "foreground": "695f55",
                    "background": "803d001a",
                    "fontStyle": "bold",
                    "token": "meta.brace.square"
                },
                {
                    "foreground": "695f55",
                    "background": "803d001a",
                    "fontStyle": "bold",
                    "token": "punctuation.separator.array"
                },
                {
                    "foreground": "695f55",
                    "background": "803d001a",
                    "fontStyle": "bold",
                    "token": "punctuation.section.array"
                },
                {
                    "foreground": "cdcdcd",
                    "background": "00000080",
                    "token": "meta.brace.curly meta.group"
                },
                {
                    "foreground": "532d40",
                    "fontStyle": "bold",
                    "token": "meta.group.braces.round punctuation.section.scope"
                },
                {
                    "foreground": "532d40",
                    "fontStyle": "bold",
                    "token": "meta.group.braces.round meta.delimiter.object.comma"
                },
                {
                    "foreground": "532d40",
                    "fontStyle": "bold",
                    "token": "meta.brace.round"
                },
                {
                    "foreground": "abacd2",
                    "background": "3c008033",
                    "token": "punctuation.section.function"
                },
                {
                    "foreground": "abacd2",
                    "background": "3c008033",
                    "token": "meta.brace.curly.function"
                },
                {
                    "foreground": "abacd2",
                    "background": "3c008033",
                    "token": "meta.function-call punctuation.section.scope.ruby"
                },
                {
                    "foreground": "666666",
                    "background": "00000080",
                    "token": "meta.source.embedded"
                },
                {
                    "foreground": "666666",
                    "background": "00000080",
                    "token": "entity.other.django.tagbraces"
                },
                {
                    "background": "0a0a0a",
                    "token": "meta.odd-tab.group1"
                },
                {
                    "background": "0a0a0a",
                    "token": "meta.group.braces"
                },
                {
                    "background": "0a0a0a",
                    "token": "meta.block.slate"
                },
                {
                    "background": "0a0a0a",
                    "token": "text.xml.strict meta.tag"
                },
                {
                    "background": "0a0a0a",
                    "token": "meta.tell-block meta.tell-block"
                },
                {
                    "background": "0e0e0e",
                    "token": "meta.even-tab.group2"
                },
                {
                    "background": "0e0e0e",
                    "token": "meta.group.braces meta.group.braces"
                },
                {
                    "background": "0e0e0e",
                    "token": "meta.block.slate meta.block.slate"
                },
                {
                    "background": "0e0e0e",
                    "token": "text.xml.strict meta.tag meta.tag"
                },
                {
                    "background": "0e0e0e",
                    "token": "meta.group.braces meta.group.braces"
                },
                {
                    "background": "0e0e0e",
                    "token": "meta.tell-block meta.tell-block"
                },
                {
                    "background": "111111",
                    "token": "meta.odd-tab.group3"
                },
                {
                    "background": "111111",
                    "token": "meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "111111",
                    "token": "meta.block.slate meta.block.slate meta.block.slate"
                },
                {
                    "background": "111111",
                    "token": "text.xml.strict meta.tag meta.tag meta.tag"
                },
                {
                    "background": "111111",
                    "token": "meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "111111",
                    "token": "meta.tell-block meta.tell-block meta.tell-block"
                },
                {
                    "background": "151515",
                    "token": "meta.even-tab.group4"
                },
                {
                    "background": "151515",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "151515",
                    "token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
                },
                {
                    "background": "151515",
                    "token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag"
                },
                {
                    "background": "151515",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "151515",
                    "token": "meta.tell-block meta.tell-block meta.tell-block meta.tell-block"
                },
                {
                    "background": "191919",
                    "token": "meta.odd-tab.group5"
                },
                {
                    "background": "191919",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "191919",
                    "token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
                },
                {
                    "background": "191919",
                    "token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag"
                },
                {
                    "background": "191919",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "191919",
                    "token": "meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block"
                },
                {
                    "background": "1c1c1c",
                    "token": "meta.even-tab.group6"
                },
                {
                    "background": "1c1c1c",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "1c1c1c",
                    "token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
                },
                {
                    "background": "1c1c1c",
                    "token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag"
                },
                {
                    "background": "1c1c1c",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "1c1c1c",
                    "token": "meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block"
                },
                {
                    "background": "1f1f1f",
                    "token": "meta.odd-tab.group7"
                },
                {
                    "background": "1f1f1f",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "1f1f1f",
                    "token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
                },
                {
                    "background": "1f1f1f",
                    "token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag"
                },
                {
                    "background": "1f1f1f",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "1f1f1f",
                    "token": "meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block"
                },
                {
                    "background": "212121",
                    "token": "meta.even-tab.group8"
                },
                {
                    "background": "212121",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "212121",
                    "token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
                },
                {
                    "background": "212121",
                    "token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag"
                },
                {
                    "background": "212121",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "212121",
                    "token": "meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block"
                },
                {
                    "background": "242424",
                    "token": "meta.odd-tab.group11"
                },
                {
                    "background": "242424",
                    "token": "meta.odd-tab.group10"
                },
                {
                    "background": "242424",
                    "token": "meta.odd-tab.group9"
                },
                {
                    "background": "242424",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "242424",
                    "token": "meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate meta.block.slate"
                },
                {
                    "background": "242424",
                    "token": "text.xml.strict meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag meta.tag"
                },
                {
                    "background": "242424",
                    "token": "meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces meta.group.braces"
                },
                {
                    "background": "242424",
                    "token": "meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block meta.tell-block"
                },
                {
                    "foreground": "666666",
                    "token": "meta.block.slate"
                },
                {
                    "foreground": "cdcdcd",
                    "token": "meta.block.content.slate"
                }
            ],
            "colors": {
                "editor.foreground": "#CDCDCD",
                "editor.background": "#050505FA",
                "editor.selectionBackground": "#2E2EE64D",
                "editor.lineHighlightBackground": "#0000801A",
                "editorCursor.foreground": "#7979B7",
                "editorWhitespace.foreground": "#CDCDCD1A"
            }
        },
        id: "brilliance-dull"
    },
    {
        name: "Chrome DevTools",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [
                {
                    "background": "FFFFFF",
                    "token": ""
                },
                {
                    "foreground": "c41a16",
                    "token": "string"
                },
                {
                    "foreground": "1c00cf",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "aa0d91",
                    "token": "keyword"
                },
                {
                    "foreground": "000000",
                    "token": "keyword.operator"
                },
                {
                    "foreground": "aa0d91",
                    "token": "constant.language"
                },
                {
                    "foreground": "990000",
                    "token": "support.class.exception"
                },
                {
                    "foreground": "000000",
                    "token": "entity.name.function"
                },
                {
                    "fontStyle": "bold underline",
                    "token": "entity.name.type"
                },
                {
                    "fontStyle": "italic",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "007400",
                    "token": "comment"
                },
                {
                    "foreground": "ff0000",
                    "token": "invalid"
                },
                {
                    "background": "e71a1100",
                    "token": "invalid.deprecated.trailing-whitespace"
                },
                {
                    "foreground": "000000",
                    "background": "fafafafc",
                    "token": "text source"
                },
                {
                    "foreground": "aa0d91",
                    "token": "meta.tag"
                },
                {
                    "foreground": "aa0d91",
                    "token": "declaration.tag"
                },
                {
                    "foreground": "000000",
                    "fontStyle": "bold",
                    "token": "support"
                },
                {
                    "foreground": "aa0d91",
                    "token": "storage"
                },
                {
                    "fontStyle": "bold underline",
                    "token": "entity.name.section"
                },
                {
                    "foreground": "000000",
                    "fontStyle": "bold",
                    "token": "entity.name.function.frame"
                },
                {
                    "foreground": "333333",
                    "token": "meta.tag.preprocessor.xml"
                },
                {
                    "foreground": "994500",
                    "fontStyle": "italic",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "881280",
                    "token": "entity.name.tag"
                }
            ],
            "colors": {
                "editor.foreground": "#000000",
                "editor.background": "#FFFFFF",
                "editor.selectionBackground": "#BAD6FD",
                "editor.lineHighlightBackground": "#0000001A",
                "editorCursor.foreground": "#000000",
                "editorWhitespace.foreground": "#B3B3B3F4"
            }
        },
        id: "chrome-devtools"
    },
    {
        name: "Clouds Midnight",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "191919",
                    "token": ""
                },
                {
                    "foreground": "3c403b",
                    "token": "comment"
                },
                {
                    "foreground": "5d90cd",
                    "token": "string"
                },
                {
                    "foreground": "46a609",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "39946a",
                    "token": "constant.language"
                },
                {
                    "foreground": "927c5d",
                    "token": "keyword"
                },
                {
                    "foreground": "927c5d",
                    "token": "support.constant.property-value"
                },
                {
                    "foreground": "927c5d",
                    "token": "constant.other.color"
                },
                {
                    "foreground": "366f1a",
                    "token": "keyword.other.unit"
                },
                {
                    "foreground": "a46763",
                    "token": "entity.other.attribute-name.html"
                },
                {
                    "foreground": "4b4b4b",
                    "token": "keyword.operator"
                },
                {
                    "foreground": "e92e2e",
                    "token": "storage"
                },
                {
                    "foreground": "858585",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "606060",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "a165ac",
                    "token": "constant.character.entity"
                },
                {
                    "foreground": "a165ac",
                    "token": "support.class.js"
                },
                {
                    "foreground": "606060",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "e92e2e",
                    "token": "meta.selector.css"
                },
                {
                    "foreground": "e92e2e",
                    "token": "entity.name.tag.css"
                },
                {
                    "foreground": "e92e2e",
                    "token": "entity.other.attribute-name.id.css"
                },
                {
                    "foreground": "e92e2e",
                    "token": "entity.other.attribute-name.class.css"
                },
                {
                    "foreground": "616161",
                    "token": "meta.property-name.css"
                },
                {
                    "foreground": "e92e2e",
                    "token": "support.function"
                },
                {
                    "foreground": "ffffff",
                    "background": "e92e2e",
                    "token": "invalid"
                },
                {
                    "foreground": "e92e2e",
                    "token": "punctuation.section.embedded"
                },
                {
                    "foreground": "606060",
                    "token": "punctuation.definition.tag"
                },
                {
                    "foreground": "a165ac",
                    "token": "constant.other.color.rgb-value.css"
                },
                {
                    "foreground": "a165ac",
                    "token": "support.constant.property-value.css"
                }
            ],
            "colors": {
                "editor.foreground": "#929292",
                "editor.background": "#191919",
                "editor.selectionBackground": "#000000",
                "editor.lineHighlightBackground": "#D7D7D708",
                "editorCursor.foreground": "#7DA5DC",
                "editorWhitespace.foreground": "#BFBFBF"
            }
        },
        id: "clouds-midnight"
    },
    {
        name: "Clouds",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [
                {
                    "background": "FFFFFF",
                    "token": ""
                },
                {
                    "foreground": "bcc8ba",
                    "token": "comment"
                },
                {
                    "foreground": "5d90cd",
                    "token": "string"
                },
                {
                    "foreground": "46a609",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "39946a",
                    "token": "constant.language"
                },
                {
                    "foreground": "af956f",
                    "token": "keyword"
                },
                {
                    "foreground": "af956f",
                    "token": "support.constant.property-value"
                },
                {
                    "foreground": "af956f",
                    "token": "constant.other.color"
                },
                {
                    "foreground": "96dc5f",
                    "token": "keyword.other.unit"
                },
                {
                    "foreground": "484848",
                    "token": "keyword.operator"
                },
                {
                    "foreground": "c52727",
                    "token": "storage"
                },
                {
                    "foreground": "858585",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "606060",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "bf78cc",
                    "token": "constant.character.entity"
                },
                {
                    "foreground": "bf78cc",
                    "token": "support.class.js"
                },
                {
                    "foreground": "606060",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "c52727",
                    "token": "meta.selector.css"
                },
                {
                    "foreground": "c52727",
                    "token": "entity.name.tag.css"
                },
                {
                    "foreground": "c52727",
                    "token": "entity.other.attribute-name.id.css"
                },
                {
                    "foreground": "c52727",
                    "token": "entity.other.attribute-name.class.css"
                },
                {
                    "foreground": "484848",
                    "token": "meta.property-name.css"
                },
                {
                    "foreground": "c52727",
                    "token": "support.function"
                },
                {
                    "background": "ff002a",
                    "token": "invalid"
                },
                {
                    "foreground": "c52727",
                    "token": "punctuation.section.embedded"
                },
                {
                    "foreground": "606060",
                    "token": "punctuation.definition.tag"
                },
                {
                    "foreground": "bf78cc",
                    "token": "constant.other.color.rgb-value.css"
                },
                {
                    "foreground": "bf78cc",
                    "token": "support.constant.property-value.css"
                }
            ],
            "colors": {
                "editor.foreground": "#000000",
                "editor.background": "#FFFFFF",
                "editor.selectionBackground": "#BDD5FC",
                "editor.lineHighlightBackground": "#FFFBD1",
                "editorCursor.foreground": "#000000",
                "editorWhitespace.foreground": "#BFBFBF"
            }
        },
        id: "clouds"
    },
    {
        name: "Cobalt",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "002240",
                    "token": ""
                },
                {
                    "foreground": "e1efff",
                    "token": "punctuation - (punctuation.definition.string || punctuation.definition.comment)"
                },
                {
                    "foreground": "ff628c",
                    "token": "constant"
                },
                {
                    "foreground": "ffdd00",
                    "token": "entity"
                },
                {
                    "foreground": "ff9d00",
                    "token": "keyword"
                },
                {
                    "foreground": "ffee80",
                    "token": "storage"
                },
                {
                    "foreground": "3ad900",
                    "token": "string -string.unquoted.old-plist -string.unquoted.heredoc"
                },
                {
                    "foreground": "3ad900",
                    "token": "string.unquoted.heredoc string"
                },
                {
                    "foreground": "0088ff",
                    "fontStyle": "italic",
                    "token": "comment"
                },
                {
                    "foreground": "80ffbb",
                    "token": "support"
                },
                {
                    "foreground": "cccccc",
                    "token": "variable"
                },
                {
                    "foreground": "ff80e1",
                    "token": "variable.language"
                },
                {
                    "foreground": "ffee80",
                    "token": "meta.function-call"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "800f00",
                    "token": "invalid"
                },
                {
                    "foreground": "ffffff",
                    "background": "223545",
                    "token": "text source"
                },
                {
                    "foreground": "ffffff",
                    "background": "223545",
                    "token": "string.unquoted.heredoc"
                },
                {
                    "foreground": "ffffff",
                    "background": "223545",
                    "token": "source source"
                },
                {
                    "foreground": "80fcff",
                    "fontStyle": "italic",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "9eff80",
                    "token": "string.quoted source"
                },
                {
                    "foreground": "80ff82",
                    "token": "string constant"
                },
                {
                    "foreground": "80ffc2",
                    "token": "string.regexp"
                },
                {
                    "foreground": "edef7d",
                    "token": "string variable"
                },
                {
                    "foreground": "ffb054",
                    "token": "support.function"
                },
                {
                    "foreground": "eb939a",
                    "token": "support.constant"
                },
                {
                    "foreground": "ff1e00",
                    "token": "support.type.exception"
                },
                {
                    "foreground": "8996a8",
                    "token": "meta.preprocessor.c"
                },
                {
                    "foreground": "afc4db",
                    "token": "meta.preprocessor.c keyword"
                },
                {
                    "foreground": "73817d",
                    "token": "meta.sgml.html meta.doctype"
                },
                {
                    "foreground": "73817d",
                    "token": "meta.sgml.html meta.doctype entity"
                },
                {
                    "foreground": "73817d",
                    "token": "meta.sgml.html meta.doctype string"
                },
                {
                    "foreground": "73817d",
                    "token": "meta.xml-processing"
                },
                {
                    "foreground": "73817d",
                    "token": "meta.xml-processing entity"
                },
                {
                    "foreground": "73817d",
                    "token": "meta.xml-processing string"
                },
                {
                    "foreground": "9effff",
                    "token": "meta.tag"
                },
                {
                    "foreground": "9effff",
                    "token": "meta.tag entity"
                },
                {
                    "foreground": "9effff",
                    "token": "meta.selector.css entity.name.tag"
                },
                {
                    "foreground": "ffb454",
                    "token": "meta.selector.css entity.other.attribute-name.id"
                },
                {
                    "foreground": "5fe461",
                    "token": "meta.selector.css entity.other.attribute-name.class"
                },
                {
                    "foreground": "9df39f",
                    "token": "support.type.property-name.css"
                },
                {
                    "foreground": "f6f080",
                    "token": "meta.property-group support.constant.property-value.css"
                },
                {
                    "foreground": "f6f080",
                    "token": "meta.property-value support.constant.property-value.css"
                },
                {
                    "foreground": "f6aa11",
                    "token": "meta.preprocessor.at-rule keyword.control.at-rule"
                },
                {
                    "foreground": "edf080",
                    "token": "meta.property-value support.constant.named-color.css"
                },
                {
                    "foreground": "edf080",
                    "token": "meta.property-value constant"
                },
                {
                    "foreground": "eb939a",
                    "token": "meta.constructor.argument.css"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "000e1a",
                    "token": "meta.diff"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "000e1a",
                    "token": "meta.diff.header"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "4c0900",
                    "token": "markup.deleted"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "806f00",
                    "token": "markup.changed"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "154f00",
                    "token": "markup.inserted"
                },
                {
                    "background": "8fddf630",
                    "token": "markup.raw"
                },
                {
                    "background": "004480",
                    "token": "markup.quote"
                },
                {
                    "background": "130d26",
                    "token": "markup.list"
                },
                {
                    "foreground": "c1afff",
                    "fontStyle": "bold",
                    "token": "markup.bold"
                },
                {
                    "foreground": "b8ffd9",
                    "fontStyle": "italic",
                    "token": "markup.italic"
                },
                {
                    "foreground": "c8e4fd",
                    "background": "001221",
                    "fontStyle": "bold",
                    "token": "markup.heading"
                }
            ],
            "colors": {
                "editor.foreground": "#FFFFFF",
                "editor.background": "#002240",
                "editor.selectionBackground": "#B36539BF",
                "editor.lineHighlightBackground": "#00000059",
                "editorCursor.foreground": "#FFFFFF",
                "editorWhitespace.foreground": "#FFFFFF26"
            }
        },
        id: "cobalt"
    },
    {
        name: "Dawn",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [
                {
                    "background": "F9F9F9",
                    "token": ""
                },
                {
                    "foreground": "5a525f",
                    "fontStyle": "italic",
                    "token": "comment"
                },
                {
                    "foreground": "811f24",
                    "fontStyle": "bold",
                    "token": "constant"
                },
                {
                    "foreground": "bf4f24",
                    "token": "entity"
                },
                {
                    "foreground": "794938",
                    "token": "keyword"
                },
                {
                    "foreground": "a71d5d",
                    "fontStyle": "italic",
                    "token": "storage"
                },
                {
                    "foreground": "0b6125",
                    "token": "string | punctuation.definition.string"
                },
                {
                    "foreground": "691c97",
                    "token": "support"
                },
                {
                    "foreground": "234a97",
                    "token": "variable"
                },
                {
                    "foreground": "794938",
                    "token": "punctuation.separator"
                },
                {
                    "foreground": "b52a1d",
                    "fontStyle": "bold italic underline",
                    "token": "invalid.deprecated"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "b52a1d",
                    "fontStyle": "italic underline",
                    "token": "invalid.illegal"
                },
                {
                    "foreground": "080808",
                    "background": "6f8bba26",
                    "token": "string source"
                },
                {
                    "foreground": "696969",
                    "fontStyle": "bold",
                    "token": "string constant"
                },
                {
                    "foreground": "234a97",
                    "token": "string variable"
                },
                {
                    "foreground": "cf5628",
                    "token": "string.regexp"
                },
                {
                    "foreground": "cf5628",
                    "fontStyle": "bold italic",
                    "token": "string.regexp.character-class"
                },
                {
                    "foreground": "cf5628",
                    "fontStyle": "bold italic",
                    "token": "string.regexp constant.character.escaped"
                },
                {
                    "foreground": "cf5628",
                    "fontStyle": "bold italic",
                    "token": "string.regexp source.ruby.embedded"
                },
                {
                    "foreground": "cf5628",
                    "fontStyle": "bold italic",
                    "token": "string.regexp string.regexp.arbitrary-repitition"
                },
                {
                    "foreground": "811f24",
                    "fontStyle": "bold",
                    "token": "string.regexp constant.character.escape"
                },
                {
                    "background": "6f8bba26",
                    "token": "text source"
                },
                {
                    "foreground": "693a17",
                    "token": "support.function"
                },
                {
                    "foreground": "b4371f",
                    "token": "support.constant"
                },
                {
                    "foreground": "234a97",
                    "token": "support.variable"
                },
                {
                    "foreground": "693a17",
                    "token": "markup.list"
                },
                {
                    "foreground": "19356d",
                    "fontStyle": "bold",
                    "token": "markup.heading | markup.heading entity.name"
                },
                {
                    "foreground": "0b6125",
                    "background": "bbbbbb30",
                    "fontStyle": "italic",
                    "token": "markup.quote"
                },
                {
                    "foreground": "080808",
                    "fontStyle": "italic",
                    "token": "markup.italic"
                },
                {
                    "foreground": "080808",
                    "fontStyle": "bold",
                    "token": "markup.bold"
                },
                {
                    "foreground": "080808",
                    "fontStyle": "underline",
                    "token": "markup.underline"
                },
                {
                    "foreground": "234a97",
                    "fontStyle": "italic underline",
                    "token": "markup.link"
                },
                {
                    "foreground": "234a97",
                    "background": "bbbbbb30",
                    "token": "markup.raw"
                },
                {
                    "foreground": "b52a1d",
                    "token": "markup.deleted"
                },
                {
                    "foreground": "19356d",
                    "background": "dcdcdc",
                    "fontStyle": "bold",
                    "token": "meta.separator"
                }
            ],
            "colors": {
                "editor.foreground": "#080808",
                "editor.background": "#F9F9F9",
                "editor.selectionBackground": "#275FFF4D",
                "editor.lineHighlightBackground": "#2463B41F",
                "editorCursor.foreground": "#000000",
                "editorWhitespace.foreground": "#4B4B7E80"
            }
        },
        id: "dawn"
    },
    {
        name: "Dominion Day",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "foreground": "e6e1c4",
                    "background": "322323",
                    "token": "source"
                },
                {
                    "foreground": "6b4e32",
                    "fontStyle": "italic",
                    "token": "comment"
                },
                {
                    "foreground": "ef5d32",
                    "token": "keyword"
                },
                {
                    "foreground": "ef5d32",
                    "token": "storage"
                },
                {
                    "foreground": "efac32",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "efac32",
                    "token": "keyword.other.name-of-parameter.objc"
                },
                {
                    "foreground": "efac32",
                    "fontStyle": "bold",
                    "token": "entity.name"
                },
                {
                    "foreground": "6c99bb",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "7daf9c",
                    "token": "variable.language"
                },
                {
                    "foreground": "7daf9c",
                    "token": "variable.other"
                },
                {
                    "foreground": "6c99bb",
                    "token": "constant"
                },
                {
                    "foreground": "efac32",
                    "token": "variable.other.constant"
                },
                {
                    "foreground": "6c99bb",
                    "token": "constant.language"
                },
                {
                    "foreground": "d9d762",
                    "token": "string"
                },
                {
                    "foreground": "efac32",
                    "token": "support.function"
                },
                {
                    "foreground": "efac32",
                    "token": "support.type"
                },
                {
                    "foreground": "6c99bb",
                    "token": "support.constant"
                },
                {
                    "foreground": "efcb43",
                    "token": "meta.tag"
                },
                {
                    "foreground": "efcb43",
                    "token": "declaration.tag"
                },
                {
                    "foreground": "efcb43",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "efcb43",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "ffffff",
                    "background": "990000",
                    "token": "invalid"
                },
                {
                    "foreground": "7daf9c",
                    "token": "constant.character.escaped"
                },
                {
                    "foreground": "7daf9c",
                    "token": "constant.character.escape"
                },
                {
                    "foreground": "7daf9c",
                    "token": "string source"
                },
                {
                    "foreground": "7daf9c",
                    "token": "string source.ruby"
                },
                {
                    "foreground": "e6e1dc",
                    "background": "144212",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "e6e1dc",
                    "background": "660000",
                    "token": "markup.deleted"
                },
                {
                    "background": "2f33ab",
                    "token": "meta.diff.header"
                },
                {
                    "background": "2f33ab",
                    "token": "meta.separator.diff"
                },
                {
                    "background": "2f33ab",
                    "token": "meta.diff.index"
                },
                {
                    "background": "2f33ab",
                    "token": "meta.diff.range"
                }
            ],
            "colors": {
                "editor.foreground": "#E6E1C4",
                "editor.background": "#372725",
                "editor.selectionBackground": "#16120E",
                "editor.lineHighlightBackground": "#1F1611",
                "editorCursor.foreground": "#E6E1C4",
                "editorWhitespace.foreground": "#42302D"
            }
        }
    },
    {
        name: "Dreamweaver",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [
                {
                    "background": "FFFFFF",
                    "token": ""
                },
                {
                    "foreground": "000000",
                    "token": "text"
                },
                {
                    "foreground": "ee000b",
                    "token": "constant.numeric - source.css"
                },
                {
                    "foreground": "9a9a9a",
                    "token": "comment"
                },
                {
                    "foreground": "00359e",
                    "token": "text.html meta.tag"
                },
                {
                    "foreground": "001eff",
                    "token": "text.html.basic meta.tag string.quoted - source"
                },
                {
                    "foreground": "000000",
                    "fontStyle": "bold",
                    "token": "text.html.basic constant.character.entity.html"
                },
                {
                    "foreground": "106800",
                    "token": "text.html meta.tag.a - string"
                },
                {
                    "foreground": "6d232e",
                    "token": "text.html meta.tag.img - string"
                },
                {
                    "foreground": "ff9700",
                    "token": "text.html meta.tag.form - string"
                },
                {
                    "foreground": "009079",
                    "token": "text.html meta.tag.table - string"
                },
                {
                    "foreground": "842b44",
                    "token": "source.js.embedded.html punctuation.definition.tag - source.php"
                },
                {
                    "foreground": "842b44",
                    "token": "source.js.embedded.html entity.name.tag.script"
                },
                {
                    "foreground": "842b44",
                    "token": "source.js.embedded entity.other.attribute-name - source.js string"
                },
                {
                    "foreground": "9a9a9a",
                    "token": "source.js comment - source.php"
                },
                {
                    "foreground": "000000",
                    "token": "source.js meta.function - source.php"
                },
                {
                    "foreground": "24c696",
                    "token": "source.js meta.class - source.php"
                },
                {
                    "foreground": "24c696",
                    "token": "source.js support.function - source.php"
                },
                {
                    "foreground": "0035ff",
                    "token": "source.js string - source.php"
                },
                {
                    "foreground": "0035ff",
                    "token": "source.js keyword.operator"
                },
                {
                    "foreground": "7e00b7",
                    "token": "source.js support.class"
                },
                {
                    "foreground": "000000",
                    "fontStyle": "bold",
                    "token": "source.js storage"
                },
                {
                    "foreground": "05208c",
                    "fontStyle": "bold",
                    "token": "source.js storage - storage.type.function - source.php"
                },
                {
                    "foreground": "05208c",
                    "fontStyle": "bold",
                    "token": "source.js constant - source.php"
                },
                {
                    "foreground": "05208c",
                    "fontStyle": "bold",
                    "token": "source.js keyword - source.php"
                },
                {
                    "foreground": "05208c",
                    "fontStyle": "bold",
                    "token": "source.js variable.language"
                },
                {
                    "foreground": "05208c",
                    "fontStyle": "bold",
                    "token": "source.js meta.brace"
                },
                {
                    "foreground": "05208c",
                    "fontStyle": "bold",
                    "token": "source.js punctuation.definition.parameters.begin"
                },
                {
                    "foreground": "05208c",
                    "fontStyle": "bold",
                    "token": "source.js punctuation.definition.parameters.end"
                },
                {
                    "foreground": "106800",
                    "token": "source.js string.regexp"
                },
                {
                    "foreground": "106800",
                    "token": "source.js string.regexp constant"
                },
                {
                    "foreground": "8d00b7",
                    "token": "source.css.embedded.html punctuation.definition.tag"
                },
                {
                    "foreground": "8d00b7",
                    "token": "source.css.embedded.html entity.name.tag.style"
                },
                {
                    "foreground": "8d00b7",
                    "token": "source.css.embedded entity.other.attribute-name - meta.selector"
                },
                {
                    "foreground": "009c7f",
                    "fontStyle": "bold",
                    "token": "source.css meta.at-rule.import.css"
                },
                {
                    "foreground": "ee000b",
                    "fontStyle": "bold",
                    "token": "source.css keyword.other.important"
                },
                {
                    "foreground": "430303",
                    "fontStyle": "bold",
                    "token": "source.css meta.at-rule.media"
                },
                {
                    "foreground": "106800",
                    "token": "source.css string"
                },
                {
                    "foreground": "da29ff",
                    "token": "source.css meta.selector"
                },
                {
                    "foreground": "da29ff",
                    "token": "source.css meta.property-list"
                },
                {
                    "foreground": "da29ff",
                    "token": "source.css meta.at-rule"
                },
                {
                    "foreground": "da29ff",
                    "fontStyle": "bold",
                    "token": "source.css punctuation.separator - source.php"
                },
                {
                    "foreground": "da29ff",
                    "fontStyle": "bold",
                    "token": "source.css punctuation.terminator - source.php"
                },
                {
                    "foreground": "05208c",
                    "token": "source.css meta.property-name"
                },
                {
                    "foreground": "0035ff",
                    "token": "source.css meta.property-value"
                },
                {
                    "foreground": "ee000b",
                    "fontStyle": "bold",
                    "token": "source.php punctuation.section.embedded.begin"
                },
                {
                    "foreground": "ee000b",
                    "fontStyle": "bold",
                    "token": "source.php punctuation.section.embedded.end"
                },
                {
                    "foreground": "000000",
                    "token": "source.php - punctuation.section"
                },
                {
                    "foreground": "000000",
                    "token": "source.php variable"
                },
                {
                    "foreground": "000000",
                    "token": "source.php meta.function.arguments"
                },
                {
                    "foreground": "05208c",
                    "token": "source.php punctuation - string - variable - meta.function"
                },
                {
                    "foreground": "24bf96",
                    "token": "source.php storage.type"
                },
                {
                    "foreground": "009714",
                    "token": "source.php keyword - comment"
                },
                {
                    "foreground": "009714",
                    "token": "source.php storage.type.class"
                },
                {
                    "foreground": "009714",
                    "token": "source.php storage.type.interface"
                },
                {
                    "foreground": "009714",
                    "token": "source.php storage.modifier"
                },
                {
                    "foreground": "009714",
                    "token": "source.php constant.language"
                },
                {
                    "foreground": "0035ff",
                    "token": "source.php support"
                },
                {
                    "foreground": "0035ff",
                    "token": "source.php storage"
                },
                {
                    "foreground": "0035ff",
                    "token": "source.php keyword.operator"
                },
                {
                    "foreground": "0035ff",
                    "token": "source.php storage.type.function"
                },
                {
                    "foreground": "0092f2",
                    "token": "source.php variable.other.global"
                },
                {
                    "foreground": "551d02",
                    "token": "source.php support.constant"
                },
                {
                    "foreground": "551d02",
                    "token": "source.php constant.language.php"
                },
                {
                    "foreground": "e20000",
                    "token": "source.php string"
                },
                {
                    "foreground": "e20000",
                    "token": "source.php string keyword.operator"
                },
                {
                    "foreground": "ff6200",
                    "token": "source.php string.quoted.double variable"
                },
                {
                    "foreground": "ff9404",
                    "token": "source.php comment"
                },
                {
                    "foreground": "ee000b",
                    "background": "efff8a",
                    "fontStyle": "bold",
                    "token": "invalid"
                }
            ],
            "colors": {
                "editor.foreground": "#000000",
                "editor.background": "#FFFFFF",
                "editor.selectionBackground": "#5EA0FF",
                "editor.lineHighlightBackground": "#00000012",
                "editorCursor.foreground": "#000000",
                "editorWhitespace.foreground": "#BFBFBF"
            }
        },
        id: "dreamweaver"
    },
    {
        name: "Eiffel",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [
                {
                    "background": "FFFFFF",
                    "token": ""
                },
                {
                    "foreground": "00b418",
                    "token": "comment"
                },
                {
                    "foreground": "0206ff",
                    "fontStyle": "italic",
                    "token": "variable"
                },
                {
                    "foreground": "0100b6",
                    "fontStyle": "bold",
                    "token": "keyword"
                },
                {
                    "foreground": "cd0000",
                    "fontStyle": "italic",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "c5060b",
                    "fontStyle": "italic",
                    "token": "constant"
                },
                {
                    "foreground": "585cf6",
                    "fontStyle": "italic",
                    "token": "constant.language"
                },
                {
                    "foreground": "d80800",
                    "token": "string"
                },
                {
                    "foreground": "26b31a",
                    "token": "constant.character.escape"
                },
                {
                    "foreground": "26b31a",
                    "token": "string source"
                },
                {
                    "foreground": "1a921c",
                    "token": "meta.preprocessor"
                },
                {
                    "foreground": "0c450d",
                    "fontStyle": "bold",
                    "token": "keyword.control.import"
                },
                {
                    "foreground": "0000a2",
                    "fontStyle": "bold",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "0000a2",
                    "fontStyle": "bold",
                    "token": "keyword.other.name-of-parameter.objc"
                },
                {
                    "fontStyle": "italic",
                    "token": "entity.name.type"
                },
                {
                    "fontStyle": "italic",
                    "token": "entity.other.inherited-class"
                },
                {
                    "fontStyle": "italic",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "70727e",
                    "token": "storage.type.method"
                },
                {
                    "fontStyle": "italic",
                    "token": "meta.section entity.name.section"
                },
                {
                    "fontStyle": "italic",
                    "token": "declaration.section entity.name.section"
                },
                {
                    "foreground": "3c4c72",
                    "fontStyle": "bold",
                    "token": "support.function"
                },
                {
                    "foreground": "6d79de",
                    "fontStyle": "bold",
                    "token": "support.class"
                },
                {
                    "foreground": "6d79de",
                    "fontStyle": "bold",
                    "token": "support.type"
                },
                {
                    "foreground": "06960e",
                    "fontStyle": "bold",
                    "token": "support.constant"
                },
                {
                    "foreground": "21439c",
                    "fontStyle": "bold",
                    "token": "support.variable"
                },
                {
                    "foreground": "687687",
                    "token": "keyword.operator.js"
                },
                {
                    "foreground": "ffffff",
                    "background": "990000",
                    "token": "invalid"
                },
                {
                    "background": "ffd0d0",
                    "token": "invalid.deprecated.trailing-whitespace"
                },
                {
                    "background": "427ff530",
                    "token": "text source"
                },
                {
                    "background": "427ff530",
                    "token": "string.unquoted"
                },
                {
                    "foreground": "68685b",
                    "token": "meta.xml-processing"
                },
                {
                    "foreground": "68685b",
                    "token": "declaration.xml-processing"
                },
                {
                    "foreground": "888888",
                    "token": "meta.doctype"
                },
                {
                    "foreground": "888888",
                    "token": "declaration.doctype"
                },
                {
                    "fontStyle": "italic",
                    "token": "meta.doctype.DTD"
                },
                {
                    "fontStyle": "italic",
                    "token": "declaration.doctype.DTD"
                },
                {
                    "foreground": "1c02ff",
                    "token": "meta.tag"
                },
                {
                    "foreground": "1c02ff",
                    "token": "declaration.tag"
                },
                {
                    "fontStyle": "bold",
                    "token": "entity.name.tag"
                },
                {
                    "fontStyle": "italic",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "0c07ff",
                    "fontStyle": "bold",
                    "token": "markup.heading"
                },
                {
                    "foreground": "000000",
                    "fontStyle": "italic",
                    "token": "markup.quote"
                },
                {
                    "foreground": "b90690",
                    "token": "markup.list"
                }
            ],
            "colors": {
                "editor.foreground": "#000000",
                "editor.background": "#FFFFFF",
                "editor.selectionBackground": "#C3DCFF",
                "editor.lineHighlightBackground": "#00000012",
                "editorCursor.foreground": "#000000",
                "editorWhitespace.foreground": "#BFBFBF"
            }
        },
        id: "eiffel"
    },
    {
        name: "Espresso Libre",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "2A211C",
                    "token": ""
                },
                {
                    "foreground": "0066ff",
                    "fontStyle": "italic",
                    "token": "comment"
                },
                {
                    "foreground": "43a8ed",
                    "fontStyle": "bold",
                    "token": "keyword"
                },
                {
                    "foreground": "43a8ed",
                    "fontStyle": "bold",
                    "token": "storage"
                },
                {
                    "foreground": "44aa43",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "c5656b",
                    "fontStyle": "bold",
                    "token": "constant"
                },
                {
                    "foreground": "585cf6",
                    "fontStyle": "bold",
                    "token": "constant.language"
                },
                {
                    "foreground": "318495",
                    "token": "variable.language"
                },
                {
                    "foreground": "318495",
                    "token": "variable.other"
                },
                {
                    "foreground": "049b0a",
                    "token": "string"
                },
                {
                    "foreground": "2fe420",
                    "token": "constant.character.escape"
                },
                {
                    "foreground": "2fe420",
                    "token": "string source"
                },
                {
                    "foreground": "1a921c",
                    "token": "meta.preprocessor"
                },
                {
                    "foreground": "9aff87",
                    "fontStyle": "bold",
                    "token": "keyword.control.import"
                },
                {
                    "foreground": "ff9358",
                    "fontStyle": "bold",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "ff9358",
                    "fontStyle": "bold",
                    "token": "keyword.other.name-of-parameter.objc"
                },
                {
                    "fontStyle": "underline",
                    "token": "entity.name.type"
                },
                {
                    "fontStyle": "italic",
                    "token": "entity.other.inherited-class"
                },
                {
                    "fontStyle": "italic",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "8b8e9c",
                    "token": "storage.type.method"
                },
                {
                    "fontStyle": "italic",
                    "token": "meta.section entity.name.section"
                },
                {
                    "fontStyle": "italic",
                    "token": "declaration.section entity.name.section"
                },
                {
                    "foreground": "7290d9",
                    "fontStyle": "bold",
                    "token": "support.function"
                },
                {
                    "foreground": "6d79de",
                    "fontStyle": "bold",
                    "token": "support.class"
                },
                {
                    "foreground": "6d79de",
                    "fontStyle": "bold",
                    "token": "support.type"
                },
                {
                    "foreground": "00af0e",
                    "fontStyle": "bold",
                    "token": "support.constant"
                },
                {
                    "foreground": "2f5fe0",
                    "fontStyle": "bold",
                    "token": "support.variable"
                },
                {
                    "foreground": "687687",
                    "token": "keyword.operator.js"
                },
                {
                    "foreground": "ffffff",
                    "background": "990000",
                    "token": "invalid"
                },
                {
                    "background": "ffd0d0",
                    "token": "invalid.deprecated.trailing-whitespace"
                },
                {
                    "background": "f5aa7730",
                    "token": "text source"
                },
                {
                    "background": "f5aa7730",
                    "token": "string.unquoted"
                },
                {
                    "foreground": "8f7e65",
                    "token": "meta.tag.preprocessor.xml"
                },
                {
                    "foreground": "888888",
                    "token": "meta.tag.sgml.doctype"
                },
                {
                    "fontStyle": "italic",
                    "token": "string.quoted.docinfo.doctype.DTD"
                },
                {
                    "foreground": "43a8ed",
                    "token": "meta.tag"
                },
                {
                    "foreground": "43a8ed",
                    "token": "declaration.tag"
                },
                {
                    "fontStyle": "bold",
                    "token": "entity.name.tag"
                },
                {
                    "fontStyle": "italic",
                    "token": "entity.other.attribute-name"
                }
            ],
            "colors": {
                "editor.foreground": "#BDAE9D",
                "editor.background": "#2A211C",
                "editor.selectionBackground": "#C3DCFF",
                "editor.lineHighlightBackground": "#3A312C",
                "editorCursor.foreground": "#889AFF",
                "editorWhitespace.foreground": "#BFBFBF"
            }
        },
        id: "espresso-libre"
    },
    {
        name: "GitHub",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [
                {
                    "background": "F8F8FF",
                    "token": ""
                },
                {
                    "foreground": "999988",
                    "fontStyle": "italic",
                    "token": "comment"
                },
                {
                    "foreground": "999999",
                    "fontStyle": "bold",
                    "token": "comment.block.preprocessor"
                },
                {
                    "foreground": "999999",
                    "fontStyle": "bold italic",
                    "token": "comment.documentation"
                },
                {
                    "foreground": "999999",
                    "fontStyle": "bold italic",
                    "token": "comment.block.documentation"
                },
                {
                    "foreground": "a61717",
                    "background": "e3d2d2",
                    "token": "invalid.illegal"
                },
                {
                    "fontStyle": "bold",
                    "token": "keyword"
                },
                {
                    "fontStyle": "bold",
                    "token": "storage"
                },
                {
                    "fontStyle": "bold",
                    "token": "keyword.operator"
                },
                {
                    "fontStyle": "bold",
                    "token": "constant.language"
                },
                {
                    "fontStyle": "bold",
                    "token": "support.constant"
                },
                {
                    "foreground": "445588",
                    "fontStyle": "bold",
                    "token": "storage.type"
                },
                {
                    "foreground": "445588",
                    "fontStyle": "bold",
                    "token": "support.type"
                },
                {
                    "foreground": "008080",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "0086b3",
                    "token": "variable.other"
                },
                {
                    "foreground": "999999",
                    "token": "variable.language"
                },
                {
                    "foreground": "445588",
                    "fontStyle": "bold",
                    "token": "entity.name.type"
                },
                {
                    "foreground": "445588",
                    "fontStyle": "bold",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "445588",
                    "fontStyle": "bold",
                    "token": "support.class"
                },
                {
                    "foreground": "008080",
                    "token": "variable.other.constant"
                },
                {
                    "foreground": "800080",
                    "token": "constant.character.entity"
                },
                {
                    "foreground": "990000",
                    "token": "entity.name.exception"
                },
                {
                    "foreground": "990000",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "990000",
                    "token": "support.function"
                },
                {
                    "foreground": "990000",
                    "token": "keyword.other.name-of-parameter"
                },
                {
                    "foreground": "555555",
                    "token": "entity.name.section"
                },
                {
                    "foreground": "000080",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "008080",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "008080",
                    "token": "support.variable"
                },
                {
                    "foreground": "009999",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "009999",
                    "token": "constant.other"
                },
                {
                    "foreground": "dd1144",
                    "token": "string - string source"
                },
                {
                    "foreground": "dd1144",
                    "token": "constant.character"
                },
                {
                    "foreground": "009926",
                    "token": "string.regexp"
                },
                {
                    "foreground": "990073",
                    "token": "constant.other.symbol"
                },
                {
                    "fontStyle": "bold",
                    "token": "punctuation"
                },
                {
                    "foreground": "000000",
                    "background": "ffdddd",
                    "token": "markup.deleted"
                },
                {
                    "fontStyle": "italic",
                    "token": "markup.italic"
                },
                {
                    "foreground": "aa0000",
                    "token": "markup.error"
                },
                {
                    "foreground": "999999",
                    "token": "markup.heading.1"
                },
                {
                    "foreground": "000000",
                    "background": "ddffdd",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "888888",
                    "token": "markup.output"
                },
                {
                    "foreground": "888888",
                    "token": "markup.raw"
                },
                {
                    "foreground": "555555",
                    "token": "markup.prompt"
                },
                {
                    "fontStyle": "bold",
                    "token": "markup.bold"
                },
                {
                    "foreground": "aaaaaa",
                    "token": "markup.heading"
                },
                {
                    "foreground": "aa0000",
                    "token": "markup.traceback"
                },
                {
                    "fontStyle": "underline",
                    "token": "markup.underline"
                },
                {
                    "foreground": "999999",
                    "background": "eaf2f5",
                    "token": "meta.diff.range"
                },
                {
                    "foreground": "999999",
                    "background": "eaf2f5",
                    "token": "meta.diff.index"
                },
                {
                    "foreground": "999999",
                    "background": "eaf2f5",
                    "token": "meta.separator"
                },
                {
                    "foreground": "999999",
                    "background": "ffdddd",
                    "token": "meta.diff.header.from-file"
                },
                {
                    "foreground": "999999",
                    "background": "ddffdd",
                    "token": "meta.diff.header.to-file"
                },
                {
                    "foreground": "4183c4",
                    "token": "meta.link"
                }
            ],
            "colors": {
                "editor.foreground": "#000000",
                "editor.background": "#F8F8FF",
                "editor.selectionBackground": "#B4D5FE",
                "editor.lineHighlightBackground": "#FFFEEB",
                "editorCursor.foreground": "#666666",
                "editorWhitespace.foreground": "#BBBBBB"
            }
        },
        id: "github"
    },
    {
        name: "IDLE",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [
                {
                    "background": "FFFFFF",
                    "token": ""
                },
                {
                    "foreground": "919191",
                    "token": "comment"
                },
                {
                    "foreground": "00a33f",
                    "token": "string"
                },
                {
                    "foreground": "a535ae",
                    "token": "constant.language"
                },
                {
                    "foreground": "ff5600",
                    "token": "keyword"
                },
                {
                    "foreground": "ff5600",
                    "token": "storage"
                },
                {
                    "foreground": "21439c",
                    "token": "entity.name.type"
                },
                {
                    "foreground": "21439c",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "a535ae",
                    "token": "support.function"
                },
                {
                    "foreground": "a535ae",
                    "token": "support.constant"
                },
                {
                    "foreground": "a535ae",
                    "token": "support.type"
                },
                {
                    "foreground": "a535ae",
                    "token": "support.class"
                },
                {
                    "foreground": "a535ae",
                    "token": "support.variable"
                },
                {
                    "foreground": "ffffff",
                    "background": "990000",
                    "token": "invalid"
                },
                {
                    "foreground": "990000",
                    "token": "constant.other.placeholder.py"
                }
            ],
            "colors": {
                "editor.foreground": "#000000",
                "editor.background": "#FFFFFF",
                "editor.selectionBackground": "#BAD6FD",
                "editor.lineHighlightBackground": "#00000012",
                "editorCursor.foreground": "#000000",
                "editorWhitespace.foreground": "#BFBFBF"
            }
        },
        id: "idle"
    },
    {
        name: "Katzenmilch",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [
                {
                    "background": "E8E9E8",
                    "token": ""
                },
                {
                    "foreground": "949494e8",
                    "background": "dcdcdc8f",
                    "token": "comment"
                },
                {
                    "foreground": "a54776",
                    "background": "e9d6dc85",
                    "token": "comment.line.region"
                },
                {
                    "foreground": "668d68",
                    "background": "e9e4be",
                    "token": "comment.line.marker.php"
                },
                {
                    "foreground": "456e48",
                    "background": "d9eab8",
                    "token": "comment.line.todo.php"
                },
                {
                    "foreground": "880006",
                    "background": "e1d0ca",
                    "token": "comment.line.fixme.php"
                },
                {
                    "foreground": "cd6839",
                    "token": "constant"
                },
                {
                    "foreground": "8b4726",
                    "background": "e8e9e8",
                    "token": "entity"
                },
                {
                    "foreground": "a52a2a",
                    "token": "storage"
                },
                {
                    "foreground": "cd3700",
                    "token": "keyword.control"
                },
                {
                    "foreground": "b03060",
                    "token": "support.function - variable"
                },
                {
                    "foreground": "b03060",
                    "token": "keyword.other.special-method.ruby"
                },
                {
                    "foreground": "b83126",
                    "token": "keyword.operator.comparison"
                },
                {
                    "foreground": "b83126",
                    "token": "keyword.operator.logical"
                },
                {
                    "foreground": "639300",
                    "token": "string"
                },
                {
                    "foreground": "007e69",
                    "token": "string.quoted.double.ruby source.ruby.embedded.source"
                },
                {
                    "foreground": "104e8b",
                    "token": "support"
                },
                {
                    "foreground": "009acd",
                    "token": "variable"
                },
                {
                    "foreground": "fd1732",
                    "background": "e8e9e8",
                    "fontStyle": "italic underline",
                    "token": "invalid.deprecated"
                },
                {
                    "foreground": "fd1224",
                    "background": "ff060026",
                    "token": "invalid.illegal"
                },
                {
                    "foreground": "7b211a",
                    "background": "77ade900",
                    "token": "text source"
                },
                {
                    "foreground": "005273",
                    "fontStyle": "italic",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "417e00",
                    "background": "c9d4be",
                    "token": "string.regexp"
                },
                {
                    "foreground": "005273",
                    "token": "support.function"
                },
                {
                    "foreground": "cf6a4c",
                    "token": "support.constant"
                },
                {
                    "fontStyle": "underline",
                    "token": "entity.name.type"
                },
                {
                    "foreground": "676767",
                    "fontStyle": "italic",
                    "token": "meta.cast"
                },
                {
                    "foreground": "494949",
                    "token": "meta.sgml.html meta.doctype"
                },
                {
                    "foreground": "494949",
                    "token": "meta.sgml.html meta.doctype entity"
                },
                {
                    "foreground": "494949",
                    "token": "meta.sgml.html meta.doctype string"
                },
                {
                    "foreground": "494949",
                    "token": "meta.xml-processing"
                },
                {
                    "foreground": "494949",
                    "token": "meta.xml-processing entity"
                },
                {
                    "foreground": "494949",
                    "token": "meta.xml-processing string"
                },
                {
                    "foreground": "005273",
                    "token": "meta.tag"
                },
                {
                    "foreground": "005273",
                    "token": "meta.tag entity"
                },
                {
                    "foreground": "005273",
                    "token": "source entity.name.tag"
                },
                {
                    "foreground": "005273",
                    "token": "source entity.other.attribute-name"
                },
                {
                    "foreground": "005273",
                    "token": "meta.tag.inline"
                },
                {
                    "foreground": "005273",
                    "token": "meta.tag.inline entity"
                },
                {
                    "foreground": "b85423",
                    "token": "entity.name.tag.namespace"
                },
                {
                    "foreground": "b85423",
                    "token": "entity.other.attribute-name.namespace"
                },
                {
                    "foreground": "b83126",
                    "token": "entity.name.tag.css"
                },
                {
                    "foreground": "b12e25",
                    "token": "meta.selector.css entity.other.attribute-name.tag.pseudo-class"
                },
                {
                    "foreground": "b8002d",
                    "token": "meta.selector.css entity.other.attribute-name.id"
                },
                {
                    "foreground": "b8002d",
                    "token": "entity.other.attribute-name.id.css"
                },
                {
                    "foreground": "b8012d",
                    "token": "meta.selector.css entity.other.attribute-name.class"
                },
                {
                    "foreground": "b8012d",
                    "token": "entity.other.attribute-name.class.css"
                },
                {
                    "foreground": "005273",
                    "token": "support.type.property-name.css"
                },
                {
                    "foreground": "005273",
                    "token": "meta.property-name"
                },
                {
                    "foreground": "8693a5",
                    "token": "meta.preprocessor.at-rule keyword.control.at-rule"
                },
                {
                    "foreground": "417e00",
                    "token": "meta.property-value"
                },
                {
                    "foreground": "b8860b",
                    "token": "constant.other.color"
                },
                {
                    "foreground": "ee3a8c",
                    "token": "keyword.other.important"
                },
                {
                    "foreground": "ee3a8c",
                    "token": "keyword.other.default"
                },
                {
                    "foreground": "417e00",
                    "token": "meta.property-value support.constant.named-color.css"
                },
                {
                    "foreground": "417e00",
                    "token": "meta.property-value constant"
                },
                {
                    "foreground": "417e00",
                    "token": "meta.constructor.argument.css"
                },
                {
                    "foreground": "9a5925",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "9f5e3d",
                    "token": "keyword.other"
                },
                {
                    "foreground": "1b76b0",
                    "token": "source.scss support.function.misc"
                },
                {
                    "foreground": "f8bebe",
                    "background": "82000e",
                    "fontStyle": "italic",
                    "token": "meta.diff"
                },
                {
                    "foreground": "f8bebe",
                    "background": "82000e",
                    "fontStyle": "italic",
                    "token": "meta.diff.header"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "420e09",
                    "token": "markup.deleted"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "4a410d",
                    "token": "markup.changed"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "253b22",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "cd2626",
                    "fontStyle": "italic",
                    "token": "markup.italic"
                },
                {
                    "foreground": "8b1a1a",
                    "fontStyle": "bold",
                    "token": "markup.bold"
                },
                {
                    "foreground": "e18964",
                    "fontStyle": "underline",
                    "token": "markup.underline"
                },
                {
                    "foreground": "8b7765",
                    "background": "fee09c12",
                    "fontStyle": "italic",
                    "token": "markup.quote"
                },
                {
                    "foreground": "b8012d",
                    "background": "bf61330d",
                    "token": "markup.heading"
                },
                {
                    "foreground": "b8012d",
                    "background": "bf61330d",
                    "token": "markup.heading entity"
                },
                {
                    "foreground": "8f5b26",
                    "token": "markup.list"
                },
                {
                    "foreground": "578bb3",
                    "background": "b1b3ba08",
                    "token": "markup.raw"
                },
                {
                    "foreground": "f67b37",
                    "fontStyle": "italic",
                    "token": "markup comment"
                },
                {
                    "foreground": "60a633",
                    "background": "242424",
                    "token": "meta.separator"
                },
                {
                    "foreground": "578bb3",
                    "background": "b1b3ba08",
                    "token": "markup.other"
                },
                {
                    "background": "eeeeee29",
                    "token": "meta.line.entry.logfile"
                },
                {
                    "background": "eeeeee29",
                    "token": "meta.line.exit.logfile"
                },
                {
                    "background": "751012",
                    "token": "meta.line.error.logfile"
                },
                {
                    "background": "dcdcdc8f",
                    "token": "punctuation.definition.end"
                },
                {
                    "foreground": "629f9e",
                    "token": "entity.other.attribute-name.html"
                },
                {
                    "foreground": "79a316",
                    "token": "string.quoted.double.js"
                },
                {
                    "foreground": "79a316",
                    "token": "string.quoted.single.js"
                },
                {
                    "foreground": "488c45",
                    "fontStyle": "italic",
                    "token": "entity.name.function.js"
                },
                {
                    "foreground": "666666",
                    "token": "source.js.embedded.html"
                },
                {
                    "foreground": "bb3182",
                    "token": "storage.type.js"
                },
                {
                    "foreground": "338fd5",
                    "token": "support.class.js"
                },
                {
                    "foreground": "a99904",
                    "fontStyle": "italic",
                    "token": "keyword.control.js"
                },
                {
                    "foreground": "a99904",
                    "fontStyle": "italic",
                    "token": "keyword.operator.js"
                },
                {
                    "foreground": "616838",
                    "background": "d7d7a7",
                    "token": "entity.name.class"
                },
                {
                    "background": "968f96",
                    "token": "active_guide"
                },
                {
                    "background": "cbdc2f38",
                    "token": "highlight_matching_word"
                }
            ],
            "colors": {
                "editor.foreground": "#363636",
                "editor.background": "#E8E9E8",
                "editor.selectionBackground": "#F5AA0091",
                "editor.lineHighlightBackground": "#CBDC2F38",
                "editorCursor.foreground": "#202020",
                "editorWhitespace.foreground": "#0000004A",
                "editorIndentGuide.background": "#8F8F8F",
                "editorIndentGuide.activeBackground": "#FA2828"
            }
        },
        id: "katzenmilch"
    },
    {
        name: "Kuroir Theme",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [
                {
                    "background": "E8E9E8",
                    "token": ""
                },
                {
                    "foreground": "949494e8",
                    "background": "dcdcdc8f",
                    "token": "comment"
                },
                {
                    "foreground": "a54776",
                    "background": "e9d6dc85",
                    "token": "comment.line.region"
                },
                {
                    "foreground": "668d68",
                    "background": "e9e4be",
                    "token": "comment.line.marker.php"
                },
                {
                    "foreground": "456e48",
                    "background": "d9eab8",
                    "token": "comment.line.todo.php"
                },
                {
                    "foreground": "880006",
                    "background": "e1d0ca",
                    "token": "comment.line.fixme.php"
                },
                {
                    "foreground": "cd6839",
                    "token": "constant"
                },
                {
                    "foreground": "8b4726",
                    "background": "e8e9e8",
                    "token": "entity"
                },
                {
                    "foreground": "a52a2a",
                    "token": "storage"
                },
                {
                    "foreground": "cd3700",
                    "token": "keyword.control"
                },
                {
                    "foreground": "b03060",
                    "token": "support.function - variable"
                },
                {
                    "foreground": "b03060",
                    "token": "keyword.other.special-method.ruby"
                },
                {
                    "foreground": "b83126",
                    "token": "keyword.operator.comparison"
                },
                {
                    "foreground": "b83126",
                    "token": "keyword.operator.logical"
                },
                {
                    "foreground": "639300",
                    "token": "string"
                },
                {
                    "foreground": "007e69",
                    "token": "string.quoted.double.ruby source.ruby.embedded.source"
                },
                {
                    "foreground": "104e8b",
                    "token": "support"
                },
                {
                    "foreground": "009acd",
                    "token": "variable"
                },
                {
                    "foreground": "fd1732",
                    "background": "e8e9e8",
                    "fontStyle": "italic underline",
                    "token": "invalid.deprecated"
                },
                {
                    "foreground": "fd1224",
                    "background": "ff060026",
                    "token": "invalid.illegal"
                },
                {
                    "foreground": "7b211a",
                    "background": "77ade900",
                    "token": "text source"
                },
                {
                    "foreground": "005273",
                    "fontStyle": "italic",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "417e00",
                    "background": "c9d4be",
                    "token": "string.regexp"
                },
                {
                    "foreground": "005273",
                    "token": "support.function"
                },
                {
                    "foreground": "cf6a4c",
                    "token": "support.constant"
                },
                {
                    "fontStyle": "underline",
                    "token": "entity.name.type"
                },
                {
                    "foreground": "676767",
                    "fontStyle": "italic",
                    "token": "meta.cast"
                },
                {
                    "foreground": "494949",
                    "token": "meta.sgml.html meta.doctype"
                },
                {
                    "foreground": "494949",
                    "token": "meta.sgml.html meta.doctype entity"
                },
                {
                    "foreground": "494949",
                    "token": "meta.sgml.html meta.doctype string"
                },
                {
                    "foreground": "494949",
                    "token": "meta.xml-processing"
                },
                {
                    "foreground": "494949",
                    "token": "meta.xml-processing entity"
                },
                {
                    "foreground": "494949",
                    "token": "meta.xml-processing string"
                },
                {
                    "foreground": "005273",
                    "token": "meta.tag"
                },
                {
                    "foreground": "005273",
                    "token": "meta.tag entity"
                },
                {
                    "foreground": "005273",
                    "token": "source entity.name.tag"
                },
                {
                    "foreground": "005273",
                    "token": "source entity.other.attribute-name"
                },
                {
                    "foreground": "005273",
                    "token": "meta.tag.inline"
                },
                {
                    "foreground": "005273",
                    "token": "meta.tag.inline entity"
                },
                {
                    "foreground": "b85423",
                    "token": "entity.name.tag.namespace"
                },
                {
                    "foreground": "b85423",
                    "token": "entity.other.attribute-name.namespace"
                },
                {
                    "foreground": "b83126",
                    "token": "entity.name.tag.css"
                },
                {
                    "foreground": "b12e25",
                    "token": "meta.selector.css entity.other.attribute-name.tag.pseudo-class"
                },
                {
                    "foreground": "b8002d",
                    "token": "meta.selector.css entity.other.attribute-name.id"
                },
                {
                    "foreground": "b8002d",
                    "token": "entity.other.attribute-name.id.css"
                },
                {
                    "foreground": "b8012d",
                    "token": "meta.selector.css entity.other.attribute-name.class"
                },
                {
                    "foreground": "b8012d",
                    "token": "entity.other.attribute-name.class.css"
                },
                {
                    "foreground": "005273",
                    "token": "support.type.property-name.css"
                },
                {
                    "foreground": "005273",
                    "token": "meta.property-name"
                },
                {
                    "foreground": "8693a5",
                    "token": "meta.preprocessor.at-rule keyword.control.at-rule"
                },
                {
                    "foreground": "417e00",
                    "token": "meta.property-value"
                },
                {
                    "foreground": "b8860b",
                    "token": "constant.other.color"
                },
                {
                    "foreground": "ee3a8c",
                    "token": "keyword.other.important"
                },
                {
                    "foreground": "ee3a8c",
                    "token": "keyword.other.default"
                },
                {
                    "foreground": "417e00",
                    "token": "meta.property-value support.constant.named-color.css"
                },
                {
                    "foreground": "417e00",
                    "token": "meta.property-value constant"
                },
                {
                    "foreground": "417e00",
                    "token": "meta.constructor.argument.css"
                },
                {
                    "foreground": "9a5925",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "9f5e3d",
                    "token": "keyword.other"
                },
                {
                    "foreground": "1b76b0",
                    "token": "source.scss support.function.misc"
                },
                {
                    "foreground": "f8bebe",
                    "background": "82000e",
                    "fontStyle": "italic",
                    "token": "meta.diff"
                },
                {
                    "foreground": "f8bebe",
                    "background": "82000e",
                    "fontStyle": "italic",
                    "token": "meta.diff.header"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "420e09",
                    "token": "markup.deleted"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "4a410d",
                    "token": "markup.changed"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "253b22",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "cd2626",
                    "fontStyle": "italic",
                    "token": "markup.italic"
                },
                {
                    "foreground": "8b1a1a",
                    "fontStyle": "bold",
                    "token": "markup.bold"
                },
                {
                    "foreground": "e18964",
                    "fontStyle": "underline",
                    "token": "markup.underline"
                },
                {
                    "foreground": "8b7765",
                    "background": "fee09c12",
                    "fontStyle": "italic",
                    "token": "markup.quote"
                },
                {
                    "foreground": "b8012d",
                    "background": "bf61330d",
                    "token": "markup.heading"
                },
                {
                    "foreground": "b8012d",
                    "background": "bf61330d",
                    "token": "markup.heading entity"
                },
                {
                    "foreground": "8f5b26",
                    "token": "markup.list"
                },
                {
                    "foreground": "578bb3",
                    "background": "b1b3ba08",
                    "token": "markup.raw"
                },
                {
                    "foreground": "f67b37",
                    "fontStyle": "italic",
                    "token": "markup comment"
                },
                {
                    "foreground": "60a633",
                    "background": "242424",
                    "token": "meta.separator"
                },
                {
                    "foreground": "578bb3",
                    "background": "b1b3ba08",
                    "token": "markup.other"
                },
                {
                    "background": "eeeeee29",
                    "token": "meta.line.entry.logfile"
                },
                {
                    "background": "eeeeee29",
                    "token": "meta.line.exit.logfile"
                },
                {
                    "background": "751012",
                    "token": "meta.line.error.logfile"
                },
                {
                    "background": "dcdcdc8f",
                    "token": "punctuation.definition.end"
                },
                {
                    "foreground": "629f9e",
                    "token": "entity.other.attribute-name.html"
                },
                {
                    "foreground": "79a316",
                    "token": "string.quoted.double.js"
                },
                {
                    "foreground": "79a316",
                    "token": "string.quoted.single.js"
                },
                {
                    "foreground": "488c45",
                    "fontStyle": "italic",
                    "token": "entity.name.function.js"
                },
                {
                    "foreground": "666666",
                    "token": "source.js.embedded.html"
                },
                {
                    "foreground": "bb3182",
                    "token": "storage.type.js"
                },
                {
                    "foreground": "338fd5",
                    "token": "support.class.js"
                },
                {
                    "foreground": "a99904",
                    "fontStyle": "italic",
                    "token": "keyword.control.js"
                },
                {
                    "foreground": "a99904",
                    "fontStyle": "italic",
                    "token": "keyword.operator.js"
                },
                {
                    "foreground": "616838",
                    "background": "d7d7a7",
                    "token": "entity.name.class"
                },
                {
                    "background": "968f96",
                    "token": "active_guide"
                },
                {
                    "background": "cbdc2f38",
                    "token": "highlight_matching_word"
                }
            ],
            "colors": {
                "editor.foreground": "#363636",
                "editor.background": "#E8E9E8",
                "editor.selectionBackground": "#F5AA0091",
                "editor.lineHighlightBackground": "#CBDC2F38",
                "editorCursor.foreground": "#202020",
                "editorWhitespace.foreground": "#0000004A",
                "editorIndentGuide.background": "#8F8F8F",
                "editorIndentGuide.activeBackground": "#FA2828"
            }
        },
        id: "kuroir-theme"
    },
    {
        name: "LAZY",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [
                {
                    "background": "FFFFFF",
                    "token": ""
                },
                {
                    "foreground": "8c868f",
                    "token": "comment"
                },
                {
                    "foreground": "3b5bb5",
                    "token": "constant"
                },
                {
                    "foreground": "3b5bb5",
                    "token": "entity"
                },
                {
                    "foreground": "d62a28",
                    "token": "text.tex.latex entity"
                },
                {
                    "foreground": "ff7800",
                    "token": "keyword"
                },
                {
                    "foreground": "ff7800",
                    "token": "storage"
                },
                {
                    "foreground": "409b1c",
                    "token": "string"
                },
                {
                    "foreground": "409b1c",
                    "token": "meta.verbatim"
                },
                {
                    "foreground": "3b5bb5",
                    "token": "support"
                },
                {
                    "foreground": "990000",
                    "fontStyle": "italic",
                    "token": "invalid.deprecated"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "9d1e15",
                    "token": "invalid.illegal"
                },
                {
                    "foreground": "3b5bb5",
                    "fontStyle": "italic",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "671ebb",
                    "token": "string constant.other.placeholder"
                },
                {
                    "foreground": "3e4558",
                    "token": "meta.function-call.py"
                },
                {
                    "foreground": "3a4a64",
                    "token": "meta.tag"
                },
                {
                    "foreground": "3a4a64",
                    "token": "meta.tag entity"
                },
                {
                    "foreground": "7f90aa",
                    "token": "keyword.type.variant"
                },
                {
                    "foreground": "000000",
                    "token": "source.ocaml keyword.operator"
                },
                {
                    "foreground": "3b5bb5",
                    "token": "source.ocaml keyword.operator.symbol.infix"
                },
                {
                    "foreground": "3b5bb5",
                    "token": "source.ocaml keyword.operator.symbol.prefix"
                },
                {
                    "fontStyle": "underline",
                    "token": "source.ocaml keyword.operator.symbol.infix.floating-point"
                },
                {
                    "fontStyle": "underline",
                    "token": "source.ocaml keyword.operator.symbol.prefix.floating-point"
                },
                {
                    "fontStyle": "underline",
                    "token": "source.ocaml constant.numeric.floating-point"
                }
            ],
            "colors": {
                "editor.foreground": "#000000",
                "editor.background": "#FFFFFF",
                "editor.selectionBackground": "#E3FC8D",
                "editor.lineHighlightBackground": "#EFFCA68F",
                "editorCursor.foreground": "#7C7C7C",
                "editorWhitespace.foreground": "#B6B6B6"
            }
        },
        id: "lazy"
    },
    {
        name: "MagicWB (Amiga)",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [
                {
                    "background": "969696",
                    "token": ""
                },
                {
                    "foreground": "8d2e75",
                    "fontStyle": "italic",
                    "token": "comment"
                },
                {
                    "foreground": "ffffff",
                    "background": "ff000033",
                    "token": "string"
                },
                {
                    "foreground": "ffffff",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "ffa995",
                    "fontStyle": "bold",
                    "token": "constant.language"
                },
                {
                    "foreground": "ffa995",
                    "background": "0000ff33",
                    "token": "constant.character"
                },
                {
                    "foreground": "ffa995",
                    "background": "0000ff33",
                    "token": "constant.other"
                },
                {
                    "foreground": "ffa995",
                    "token": "variable.language"
                },
                {
                    "foreground": "ffa995",
                    "token": "variable.other"
                },
                {
                    "fontStyle": "bold",
                    "token": "keyword"
                },
                {
                    "foreground": "3a68a3",
                    "fontStyle": "bold",
                    "token": "storage"
                },
                {
                    "fontStyle": "underline",
                    "token": "entity.name.type"
                },
                {
                    "fontStyle": "italic",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "ffa995",
                    "token": "entity.name.function"
                },
                {
                    "fontStyle": "italic",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "0000ff",
                    "fontStyle": "bold",
                    "token": "entity.name"
                },
                {
                    "foreground": "3a68a3",
                    "fontStyle": "italic",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "e5b3ff",
                    "token": "support.function"
                },
                {
                    "foreground": "000000",
                    "token": "support.function.any-method"
                },
                {
                    "fontStyle": "italic",
                    "token": "support.function.any-method - punctuation"
                },
                {
                    "foreground": "ffffff",
                    "token": "support.constant"
                },
                {
                    "foreground": "ffa995",
                    "token": "support.type"
                },
                {
                    "foreground": "ffa995",
                    "token": "support.class"
                },
                {
                    "foreground": "3a68a3",
                    "token": "support.variable"
                },
                {
                    "foreground": "ffffff",
                    "background": "797979",
                    "token": "invalid"
                },
                {
                    "foreground": "ffa995",
                    "background": "969696",
                    "fontStyle": "italic",
                    "token": "string.quoted.other.lt-gt.include"
                },
                {
                    "foreground": "ffa995",
                    "background": "969696",
                    "token": "string.quoted.double.include"
                },
                {
                    "foreground": "4d4e60",
                    "token": "markup.list"
                },
                {
                    "foreground": "ffffff",
                    "background": "0000ff",
                    "token": "markup.raw"
                },
                {
                    "foreground": "00f0c9",
                    "token": "markup.quote"
                },
                {
                    "foreground": "4c457e",
                    "token": "markup.quote markup.quote"
                },
                {
                    "background": "8a9ecb",
                    "token": "text.html source"
                }
            ],
            "colors": {
                "editor.foreground": "#000000",
                "editor.background": "#969696",
                "editor.selectionBackground": "#B1B1B1",
                "editor.lineHighlightBackground": "#00000012",
                "editorCursor.foreground": "#FFFFFF",
                "editorWhitespace.foreground": "#FF38FF"
            }
        },
        id: "magicwb--amiga-"
    },
    {
        name: "Merbivore Soft",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "161616",
                    "token": ""
                },
                {
                    "foreground": "ad2ea4",
                    "fontStyle": "italic",
                    "token": "comment"
                },
                {
                    "foreground": "fc6f09",
                    "token": "keyword"
                },
                {
                    "foreground": "fc6f09",
                    "token": "storage"
                },
                {
                    "foreground": "fc83ff",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "58c554",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "1edafb",
                    "token": "constant"
                },
                {
                    "foreground": "8dff0a",
                    "token": "constant.library"
                },
                {
                    "foreground": "fc6f09",
                    "token": "support.function"
                },
                {
                    "foreground": "fdc251",
                    "token": "constant.language"
                },
                {
                    "foreground": "8dff0a",
                    "token": "string"
                },
                {
                    "foreground": "1edafb",
                    "token": "support.type"
                },
                {
                    "foreground": "8dff0a",
                    "token": "support.constant"
                },
                {
                    "foreground": "fc6f09",
                    "token": "meta.tag"
                },
                {
                    "foreground": "fc6f09",
                    "token": "declaration.tag"
                },
                {
                    "foreground": "fc6f09",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "ffff89",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "ffffff",
                    "background": "990000",
                    "token": "invalid"
                },
                {
                    "foreground": "519f50",
                    "token": "constant.character.escaped"
                },
                {
                    "foreground": "519f50",
                    "token": "constant.character.escape"
                },
                {
                    "foreground": "519f50",
                    "token": "string source"
                },
                {
                    "foreground": "519f50",
                    "token": "string source.ruby"
                },
                {
                    "foreground": "e6e1dc",
                    "background": "144212",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "e6e1dc",
                    "background": "660000",
                    "token": "markup.deleted"
                },
                {
                    "background": "2f33ab",
                    "token": "meta.diff.header"
                },
                {
                    "background": "2f33ab",
                    "token": "meta.separator.diff"
                },
                {
                    "background": "2f33ab",
                    "token": "meta.diff.index"
                },
                {
                    "background": "2f33ab",
                    "token": "meta.diff.range"
                }
            ],
            "colors": {
                "editor.foreground": "#E6E1DC",
                "editor.background": "#161616",
                "editor.selectionBackground": "#454545",
                "editor.lineHighlightBackground": "#333435",
                "editorCursor.foreground": "#FFFFFF",
                "editorWhitespace.foreground": "#404040"
            }
        },
        id: "merbivore-soft"
    },
    {
        name: "Merbivore",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "161616",
                    "token": ""
                },
                {
                    "foreground": "ad2ea4",
                    "fontStyle": "italic",
                    "token": "comment"
                },
                {
                    "foreground": "fc6f09",
                    "token": "keyword"
                },
                {
                    "foreground": "fc6f09",
                    "token": "storage"
                },
                {
                    "foreground": "fc83ff",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "58c554",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "1edafb",
                    "token": "constant"
                },
                {
                    "foreground": "8dff0a",
                    "token": "constant.library"
                },
                {
                    "foreground": "fc6f09",
                    "token": "support.function"
                },
                {
                    "foreground": "fdc251",
                    "token": "constant.language"
                },
                {
                    "foreground": "8dff0a",
                    "token": "string"
                },
                {
                    "foreground": "1edafb",
                    "token": "support.type"
                },
                {
                    "foreground": "8dff0a",
                    "token": "support.constant"
                },
                {
                    "foreground": "fc6f09",
                    "token": "meta.tag"
                },
                {
                    "foreground": "fc6f09",
                    "token": "declaration.tag"
                },
                {
                    "foreground": "fc6f09",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "ffff89",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "ffffff",
                    "background": "990000",
                    "token": "invalid"
                },
                {
                    "foreground": "519f50",
                    "token": "constant.character.escaped"
                },
                {
                    "foreground": "519f50",
                    "token": "constant.character.escape"
                },
                {
                    "foreground": "519f50",
                    "token": "string source"
                },
                {
                    "foreground": "519f50",
                    "token": "string source.ruby"
                },
                {
                    "foreground": "e6e1dc",
                    "background": "144212",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "e6e1dc",
                    "background": "660000",
                    "token": "markup.deleted"
                },
                {
                    "background": "2f33ab",
                    "token": "meta.diff.header"
                },
                {
                    "background": "2f33ab",
                    "token": "meta.separator.diff"
                },
                {
                    "background": "2f33ab",
                    "token": "meta.diff.index"
                },
                {
                    "background": "2f33ab",
                    "token": "meta.diff.range"
                }
            ],
            "colors": {
                "editor.foreground": "#E6E1DC",
                "editor.background": "#161616",
                "editor.selectionBackground": "#454545",
                "editor.lineHighlightBackground": "#333435",
                "editorCursor.foreground": "#FFFFFF",
                "editorWhitespace.foreground": "#404040"
            }
        },
        id: "merbivore"
    },
    {
        name: "Monokai Bright",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "272822",
                    "token": ""
                },
                {
                    "foreground": "75715e",
                    "token": "comment"
                },
                {
                    "foreground": "e6db74",
                    "token": "string"
                },
                {
                    "foreground": "ae81ff",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "ae81ff",
                    "token": "constant.language"
                },
                {
                    "foreground": "ae81ff",
                    "token": "constant.character"
                },
                {
                    "foreground": "ae81ff",
                    "token": "constant.other"
                },
                {
                    "foreground": "f92672",
                    "token": "keyword"
                },
                {
                    "foreground": "f92672",
                    "token": "variable.other.dollar.only.js"
                },
                {
                    "foreground": "f92672",
                    "token": "storage"
                },
                {
                    "foreground": "66d9ef",
                    "fontStyle": "italic",
                    "token": "storage.type"
                },
                {
                    "foreground": "a6e22e",
                    "fontStyle": "underline",
                    "token": "entity.name.class"
                },
                {
                    "foreground": "a6e22e",
                    "fontStyle": "italic underline",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "a6e22e",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "fd971f",
                    "fontStyle": "italic",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "f92672",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "a6e22e",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "66d9ef",
                    "token": "support.function"
                },
                {
                    "foreground": "66d9ef",
                    "token": "support.constant"
                },
                {
                    "foreground": "66d9ef",
                    "fontStyle": "italic",
                    "token": "support.type"
                },
                {
                    "foreground": "66d9ef",
                    "fontStyle": "italic",
                    "token": "support.class"
                },
                {
                    "foreground": "f8f8f0",
                    "background": "f92672",
                    "token": "invalid"
                },
                {
                    "foreground": "f8f8f0",
                    "background": "ae81ff",
                    "token": "invalid.deprecated"
                },
                {
                    "foreground": "cfcfc2",
                    "token": "meta.structure.dictionary.json string.quoted.double.json"
                },
                {
                    "foreground": "75715e",
                    "token": "meta.diff"
                },
                {
                    "foreground": "75715e",
                    "token": "meta.diff.header"
                },
                {
                    "foreground": "f92672",
                    "token": "markup.deleted"
                },
                {
                    "foreground": "a6e22e",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "e6db74",
                    "token": "markup.changed"
                },
                {
                    "foreground": "ae81ffa0",
                    "token": "constant.numeric.line-number.find-in-files - match"
                },
                {
                    "foreground": "e6db74",
                    "token": "entity.name.filename.find-in-files"
                }
            ],
            "colors": {
                "editor.foreground": "#F8F8F2",
                "editor.background": "#272822",
                "editor.selectionBackground": "#9D550F",
                "editor.inactiveSelectionBackground": "#bbbbbb",
                "editor.lineHighlightBackground": "#3E3D32",
                "editorCursor.foreground": "#F8F8F0",
                "editorWhitespace.foreground": "#3B3A32",
                "editorIndentGuide.activeBackground": "#9D550FB0"
            }
        },
        id: "monokai-bright"
    },
    {
        name: "Monokai",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "272822",
                    "token": ""
                },
                {
                    "foreground": "75715e",
                    "token": "comment"
                },
                {
                    "foreground": "e6db74",
                    "token": "string"
                },
                {
                    "foreground": "ae81ff",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "ae81ff",
                    "token": "constant.language"
                },
                {
                    "foreground": "ae81ff",
                    "token": "constant.character"
                },
                {
                    "foreground": "ae81ff",
                    "token": "constant.other"
                },
                {
                    "foreground": "f92672",
                    "token": "keyword"
                },
                {
                    "foreground": "f92672",
                    "token": "storage"
                },
                {
                    "foreground": "66d9ef",
                    "fontStyle": "italic",
                    "token": "storage.type"
                },
                {
                    "foreground": "a6e22e",
                    "fontStyle": "underline",
                    "token": "entity.name.class"
                },
                {
                    "foreground": "a6e22e",
                    "fontStyle": "italic underline",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "a6e22e",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "fd971f",
                    "fontStyle": "italic",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "f92672",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "a6e22e",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "66d9ef",
                    "token": "support.function"
                },
                {
                    "foreground": "66d9ef",
                    "token": "support.constant"
                },
                {
                    "foreground": "66d9ef",
                    "fontStyle": "italic",
                    "token": "support.type"
                },
                {
                    "foreground": "66d9ef",
                    "fontStyle": "italic",
                    "token": "support.class"
                },
                {
                    "foreground": "f8f8f0",
                    "background": "f92672",
                    "token": "invalid"
                },
                {
                    "foreground": "f8f8f0",
                    "background": "ae81ff",
                    "token": "invalid.deprecated"
                },
                {
                    "foreground": "cfcfc2",
                    "token": "meta.structure.dictionary.json string.quoted.double.json"
                },
                {
                    "foreground": "75715e",
                    "token": "meta.diff"
                },
                {
                    "foreground": "75715e",
                    "token": "meta.diff.header"
                },
                {
                    "foreground": "f92672",
                    "token": "markup.deleted"
                },
                {
                    "foreground": "a6e22e",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "e6db74",
                    "token": "markup.changed"
                },
                {
                    "foreground": "ae81ffa0",
                    "token": "constant.numeric.line-number.find-in-files - match"
                },
                {
                    "foreground": "e6db74",
                    "token": "entity.name.filename.find-in-files"
                }
            ],
            "colors": {
                "editor.foreground": "#F8F8F2",
                "editor.background": "#272822",
                "editor.selectionBackground": "#49483E",
                "editor.lineHighlightBackground": "#3E3D32",
                "editorCursor.foreground": "#F8F8F0",
                "editorWhitespace.foreground": "#3B3A32",
                "editorIndentGuide.activeBackground": "#9D550FB0",
                "editor.selectionHighlightBorder": "#222218"
            }
        },
        id: "monokai"
    },
    {
        name: "Night Owl",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "011627",
                    "token": ""
                },
                {
                    "foreground": "637777",
                    "token": "comment"
                },
                {
                    "foreground": "addb67",
                    "token": "string"
                },
                {
                    "foreground": "ecc48d",
                    "token": "vstring.quoted"
                },
                {
                    "foreground": "ecc48d",
                    "token": "variable.other.readwrite.js"
                },
                {
                    "foreground": "5ca7e4",
                    "token": "string.regexp"
                },
                {
                    "foreground": "5ca7e4",
                    "token": "string.regexp keyword.other"
                },
                {
                    "foreground": "5f7e97",
                    "token": "meta.function punctuation.separator.comma"
                },
                {
                    "foreground": "f78c6c",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "f78c6c",
                    "token": "constant.character.numeric"
                },
                {
                    "foreground": "addb67",
                    "token": "variable"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword"
                },
                {
                    "foreground": "c792ea",
                    "token": "punctuation.accessor"
                },
                {
                    "foreground": "c792ea",
                    "token": "storage"
                },
                {
                    "foreground": "c792ea",
                    "token": "meta.var.expr"
                },
                {
                    "foreground": "c792ea",
                    "token": "meta.class meta.method.declaration meta.var.expr storage.type.jsm"
                },
                {
                    "foreground": "c792ea",
                    "token": "storage.type.property.js"
                },
                {
                    "foreground": "c792ea",
                    "token": "storage.type.property.ts"
                },
                {
                    "foreground": "c792ea",
                    "token": "storage.type.property.tsx"
                },
                {
                    "foreground": "82aaff",
                    "token": "storage.type"
                },
                {
                    "foreground": "ffcb8b",
                    "token": "entity.name.class"
                },
                {
                    "foreground": "ffcb8b",
                    "token": "meta.class entity.name.type.class"
                },
                {
                    "foreground": "addb67",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "82aaff",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "addb67",
                    "token": "punctuation.definition.variable"
                },
                {
                    "foreground": "d3423e",
                    "token": "punctuation.section.embedded"
                },
                {
                    "foreground": "d6deeb",
                    "token": "punctuation.terminator.expression"
                },
                {
                    "foreground": "d6deeb",
                    "token": "punctuation.definition.arguments"
                },
                {
                    "foreground": "d6deeb",
                    "token": "punctuation.definition.array"
                },
                {
                    "foreground": "d6deeb",
                    "token": "punctuation.section.array"
                },
                {
                    "foreground": "d6deeb",
                    "token": "meta.array"
                },
                {
                    "foreground": "d9f5dd",
                    "token": "punctuation.definition.list.begin"
                },
                {
                    "foreground": "d9f5dd",
                    "token": "punctuation.definition.list.end"
                },
                {
                    "foreground": "d9f5dd",
                    "token": "punctuation.separator.arguments"
                },
                {
                    "foreground": "d9f5dd",
                    "token": "punctuation.definition.list"
                },
                {
                    "foreground": "d3423e",
                    "token": "string.template meta.template.expression"
                },
                {
                    "foreground": "d6deeb",
                    "token": "string.template punctuation.definition.string"
                },
                {
                    "foreground": "c792ea",
                    "fontStyle": "italic",
                    "token": "italic"
                },
                {
                    "foreground": "addb67",
                    "fontStyle": "bold",
                    "token": "bold"
                },
                {
                    "foreground": "82aaff",
                    "token": "constant.language"
                },
                {
                    "foreground": "82aaff",
                    "token": "punctuation.definition.constant"
                },
                {
                    "foreground": "82aaff",
                    "token": "variable.other.constant"
                },
                {
                    "foreground": "7fdbca",
                    "token": "support.function.construct"
                },
                {
                    "foreground": "7fdbca",
                    "token": "keyword.other.new"
                },
                {
                    "foreground": "82aaff",
                    "token": "constant.character"
                },
                {
                    "foreground": "82aaff",
                    "token": "constant.other"
                },
                {
                    "foreground": "f78c6c",
                    "token": "constant.character.escape"
                },
                {
                    "foreground": "addb67",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "d7dbe0",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "7fdbca",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "cc2996",
                    "token": "punctuation.definition.tag.html"
                },
                {
                    "foreground": "cc2996",
                    "token": "punctuation.definition.tag.begin"
                },
                {
                    "foreground": "cc2996",
                    "token": "punctuation.definition.tag.end"
                },
                {
                    "foreground": "addb67",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "addb67",
                    "token": "entity.name.tag.custom"
                },
                {
                    "foreground": "82aaff",
                    "token": "support.function"
                },
                {
                    "foreground": "82aaff",
                    "token": "support.constant"
                },
                {
                    "foreground": "7fdbca",
                    "token": "upport.constant.meta.property-value"
                },
                {
                    "foreground": "addb67",
                    "token": "support.type"
                },
                {
                    "foreground": "addb67",
                    "token": "support.class"
                },
                {
                    "foreground": "addb67",
                    "token": "support.variable.dom"
                },
                {
                    "foreground": "7fdbca",
                    "token": "support.constant"
                },
                {
                    "foreground": "7fdbca",
                    "token": "keyword.other.special-method"
                },
                {
                    "foreground": "7fdbca",
                    "token": "keyword.other.new"
                },
                {
                    "foreground": "7fdbca",
                    "token": "keyword.other.debugger"
                },
                {
                    "foreground": "7fdbca",
                    "token": "keyword.control"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.operator.comparison"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.control.flow.js"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.control.flow.ts"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.control.flow.tsx"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.control.ruby"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.control.module.ruby"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.control.class.ruby"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.control.def.ruby"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.control.loop.js"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.control.loop.ts"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.control.import.js"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.control.import.ts"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.control.import.tsx"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.control.from.js"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.control.from.ts"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.control.from.tsx"
                },
                {
                    "foreground": "ffffff",
                    "background": "ff2c83",
                    "token": "invalid"
                },
                {
                    "foreground": "ffffff",
                    "background": "d3423e",
                    "token": "invalid.deprecated"
                },
                {
                    "foreground": "7fdbca",
                    "token": "keyword.operator"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.operator.relational"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.operator.assignement"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.operator.arithmetic"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.operator.bitwise"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.operator.increment"
                },
                {
                    "foreground": "c792ea",
                    "token": "keyword.operator.ternary"
                },
                {
                    "foreground": "637777",
                    "token": "comment.line.double-slash"
                },
                {
                    "foreground": "cdebf7",
                    "token": "object"
                },
                {
                    "foreground": "ff5874",
                    "token": "constant.language.null"
                },
                {
                    "foreground": "d6deeb",
                    "token": "meta.brace"
                },
                {
                    "foreground": "c792ea",
                    "token": "meta.delimiter.period"
                },
                {
                    "foreground": "d9f5dd",
                    "token": "punctuation.definition.string"
                },
                {
                    "foreground": "ff5874",
                    "token": "constant.language.boolean"
                },
                {
                    "foreground": "ffffff",
                    "token": "object.comma"
                },
                {
                    "foreground": "7fdbca",
                    "token": "variable.parameter.function"
                },
                {
                    "foreground": "80cbc4",
                    "token": "support.type.vendor.property-name"
                },
                {
                    "foreground": "80cbc4",
                    "token": "support.constant.vendor.property-value"
                },
                {
                    "foreground": "80cbc4",
                    "token": "support.type.property-name"
                },
                {
                    "foreground": "80cbc4",
                    "token": "meta.property-list entity.name.tag"
                },
                {
                    "foreground": "57eaf1",
                    "token": "meta.property-list entity.name.tag.reference"
                },
                {
                    "foreground": "f78c6c",
                    "token": "constant.other.color.rgb-value punctuation.definition.constant"
                },
                {
                    "foreground": "ffeb95",
                    "token": "constant.other.color"
                },
                {
                    "foreground": "ffeb95",
                    "token": "keyword.other.unit"
                },
                {
                    "foreground": "c792ea",
                    "token": "meta.selector"
                },
                {
                    "foreground": "fad430",
                    "token": "entity.other.attribute-name.id"
                },
                {
                    "foreground": "80cbc4",
                    "token": "meta.property-name"
                },
                {
                    "foreground": "c792ea",
                    "token": "entity.name.tag.doctype"
                },
                {
                    "foreground": "c792ea",
                    "token": "meta.tag.sgml.doctype"
                },
                {
                    "foreground": "d9f5dd",
                    "token": "punctuation.definition.parameters"
                },
                {
                    "foreground": "ecc48d",
                    "token": "string.quoted"
                },
                {
                    "foreground": "ecc48d",
                    "token": "string.quoted.double"
                },
                {
                    "foreground": "ecc48d",
                    "token": "string.quoted.single"
                },
                {
                    "foreground": "addb67",
                    "token": "support.constant.math"
                },
                {
                    "foreground": "addb67",
                    "token": "support.type.property-name.json"
                },
                {
                    "foreground": "addb67",
                    "token": "support.constant.json"
                },
                {
                    "foreground": "c789d6",
                    "token": "meta.structure.dictionary.value.json string.quoted.double"
                },
                {
                    "foreground": "80cbc4",
                    "token": "string.quoted.double.json punctuation.definition.string.json"
                },
                {
                    "foreground": "ff5874",
                    "token": "meta.structure.dictionary.json meta.structure.dictionary.value constant.language"
                },
                {
                    "foreground": "d6deeb",
                    "token": "variable.other.ruby"
                },
                {
                    "foreground": "ecc48d",
                    "token": "entity.name.type.class.ruby"
                },
                {
                    "foreground": "ecc48d",
                    "token": "keyword.control.class.ruby"
                },
                {
                    "foreground": "ecc48d",
                    "token": "meta.class.ruby"
                },
                {
                    "foreground": "7fdbca",
                    "token": "constant.language.symbol.hashkey.ruby"
                },
                {
                    "foreground": "e0eddd",
                    "background": "a57706",
                    "fontStyle": "italic",
                    "token": "meta.diff"
                },
                {
                    "foreground": "e0eddd",
                    "background": "a57706",
                    "fontStyle": "italic",
                    "token": "meta.diff.header"
                },
                {
                    "foreground": "ef535090",
                    "fontStyle": "italic",
                    "token": "markup.deleted"
                },
                {
                    "foreground": "a2bffc",
                    "fontStyle": "italic",
                    "token": "markup.changed"
                },
                {
                    "foreground": "a2bffc",
                    "fontStyle": "italic",
                    "token": "meta.diff.header.git"
                },
                {
                    "foreground": "a2bffc",
                    "fontStyle": "italic",
                    "token": "meta.diff.header.from-file"
                },
                {
                    "foreground": "a2bffc",
                    "fontStyle": "italic",
                    "token": "meta.diff.header.to-file"
                },
                {
                    "foreground": "219186",
                    "background": "eae3ca",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "d3201f",
                    "token": "other.package.exclude"
                },
                {
                    "foreground": "d3201f",
                    "token": "other.remove"
                },
                {
                    "foreground": "269186",
                    "token": "other.add"
                },
                {
                    "foreground": "ff5874",
                    "token": "constant.language.python"
                },
                {
                    "foreground": "82aaff",
                    "token": "variable.parameter.function.python"
                },
                {
                    "foreground": "82aaff",
                    "token": "meta.function-call.arguments.python"
                },
                {
                    "foreground": "b2ccd6",
                    "token": "meta.function-call.python"
                },
                {
                    "foreground": "b2ccd6",
                    "token": "meta.function-call.generic.python"
                },
                {
                    "foreground": "d6deeb",
                    "token": "punctuation.python"
                },
                {
                    "foreground": "addb67",
                    "token": "entity.name.function.decorator.python"
                },
                {
                    "foreground": "8eace3",
                    "token": "source.python variable.language.special"
                },
                {
                    "foreground": "82b1ff",
                    "token": "markup.heading.markdown"
                },
                {
                    "foreground": "c792ea",
                    "fontStyle": "italic",
                    "token": "markup.italic.markdown"
                },
                {
                    "foreground": "addb67",
                    "fontStyle": "bold",
                    "token": "markup.bold.markdown"
                },
                {
                    "foreground": "697098",
                    "token": "markup.quote.markdown"
                },
                {
                    "foreground": "80cbc4",
                    "token": "markup.inline.raw.markdown"
                },
                {
                    "foreground": "ff869a",
                    "token": "markup.underline.link.markdown"
                },
                {
                    "foreground": "ff869a",
                    "token": "markup.underline.link.image.markdown"
                },
                {
                    "foreground": "d6deeb",
                    "token": "string.other.link.title.markdown"
                },
                {
                    "foreground": "d6deeb",
                    "token": "string.other.link.description.markdown"
                },
                {
                    "foreground": "82b1ff",
                    "token": "punctuation.definition.string.markdown"
                },
                {
                    "foreground": "82b1ff",
                    "token": "punctuation.definition.string.begin.markdown"
                },
                {
                    "foreground": "82b1ff",
                    "token": "punctuation.definition.string.end.markdown"
                },
                {
                    "foreground": "82b1ff",
                    "token": "meta.link.inline.markdown punctuation.definition.string"
                },
                {
                    "foreground": "7fdbca",
                    "token": "punctuation.definition.metadata.markdown"
                },
                {
                    "foreground": "82b1ff",
                    "token": "beginning.punctuation.definition.list.markdown"
                }
            ],
            "colors": {
                "editor.foreground": "#d6deeb",
                "editor.background": "#011627",
                "editor.selectionBackground": "#5f7e9779",
                "editor.lineHighlightBackground": "#010E17",
                "editorCursor.foreground": "#80a4c2",
                "editorWhitespace.foreground": "#2e2040",
                "editorIndentGuide.background": "#5e81ce52",
                "editor.selectionHighlightBorder": "#122d42"
            }
        },
        id: "night-owl"
    },
    {
        name: "Oceanic Next",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "1B2B34",
                    "token": ""
                },
                {
                    "foreground": "65737e",
                    "token": "comment"
                },
                {
                    "foreground": "65737e",
                    "token": "punctuation.definition.comment"
                },
                {
                    "foreground": "cdd3de",
                    "token": "variable"
                },
                {
                    "foreground": "c594c5",
                    "token": "keyword"
                },
                {
                    "foreground": "c594c5",
                    "token": "storage.type"
                },
                {
                    "foreground": "c594c5",
                    "token": "storage.modifier"
                },
                {
                    "foreground": "5fb3b3",
                    "token": "keyword.operator"
                },
                {
                    "foreground": "5fb3b3",
                    "token": "constant.other.color"
                },
                {
                    "foreground": "5fb3b3",
                    "token": "punctuation"
                },
                {
                    "foreground": "5fb3b3",
                    "token": "meta.tag"
                },
                {
                    "foreground": "5fb3b3",
                    "token": "punctuation.definition.tag"
                },
                {
                    "foreground": "5fb3b3",
                    "token": "punctuation.separator.inheritance.php"
                },
                {
                    "foreground": "5fb3b3",
                    "token": "punctuation.definition.tag.html"
                },
                {
                    "foreground": "5fb3b3",
                    "token": "punctuation.definition.tag.begin.html"
                },
                {
                    "foreground": "5fb3b3",
                    "token": "punctuation.definition.tag.end.html"
                },
                {
                    "foreground": "5fb3b3",
                    "token": "punctuation.section.embedded"
                },
                {
                    "foreground": "5fb3b3",
                    "token": "keyword.other.template"
                },
                {
                    "foreground": "5fb3b3",
                    "token": "keyword.other.substitution"
                },
                {
                    "foreground": "eb606b",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "eb606b",
                    "token": "meta.tag.sgml"
                },
                {
                    "foreground": "eb606b",
                    "token": "markup.deleted.git_gutter"
                },
                {
                    "foreground": "6699cc",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "6699cc",
                    "token": "meta.function-call"
                },
                {
                    "foreground": "6699cc",
                    "token": "variable.function"
                },
                {
                    "foreground": "6699cc",
                    "token": "support.function"
                },
                {
                    "foreground": "6699cc",
                    "token": "keyword.other.special-method"
                },
                {
                    "foreground": "6699cc",
                    "token": "meta.block-level"
                },
                {
                    "foreground": "f2777a",
                    "token": "support.other.variable"
                },
                {
                    "foreground": "f2777a",
                    "token": "string.other.link"
                },
                {
                    "foreground": "f99157",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "f99157",
                    "token": "constant.language"
                },
                {
                    "foreground": "f99157",
                    "token": "support.constant"
                },
                {
                    "foreground": "f99157",
                    "token": "constant.character"
                },
                {
                    "foreground": "f99157",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "f99157",
                    "token": "keyword.other.unit"
                },
                {
                    "foreground": "99c794",
                    "fontStyle": "normal",
                    "token": "string"
                },
                {
                    "foreground": "99c794",
                    "fontStyle": "normal",
                    "token": "constant.other.symbol"
                },
                {
                    "foreground": "99c794",
                    "fontStyle": "normal",
                    "token": "constant.other.key"
                },
                {
                    "foreground": "99c794",
                    "fontStyle": "normal",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "99c794",
                    "fontStyle": "normal",
                    "token": "markup.heading"
                },
                {
                    "foreground": "99c794",
                    "fontStyle": "normal",
                    "token": "markup.inserted.git_gutter"
                },
                {
                    "foreground": "99c794",
                    "fontStyle": "normal",
                    "token": "meta.group.braces.curly constant.other.object.key.js string.unquoted.label.js"
                },
                {
                    "foreground": "fac863",
                    "token": "entity.name.class"
                },
                {
                    "foreground": "fac863",
                    "token": "entity.name.type.class"
                },
                {
                    "foreground": "fac863",
                    "token": "support.type"
                },
                {
                    "foreground": "fac863",
                    "token": "support.class"
                },
                {
                    "foreground": "fac863",
                    "token": "support.orther.namespace.use.php"
                },
                {
                    "foreground": "fac863",
                    "token": "meta.use.php"
                },
                {
                    "foreground": "fac863",
                    "token": "support.other.namespace.php"
                },
                {
                    "foreground": "fac863",
                    "token": "markup.changed.git_gutter"
                },
                {
                    "foreground": "ec5f67",
                    "token": "entity.name.module.js"
                },
                {
                    "foreground": "ec5f67",
                    "token": "variable.import.parameter.js"
                },
                {
                    "foreground": "ec5f67",
                    "token": "variable.other.class.js"
                },
                {
                    "foreground": "ec5f67",
                    "fontStyle": "italic",
                    "token": "variable.language"
                },
                {
                    "foreground": "cdd3de",
                    "token": "meta.group.braces.curly.js constant.other.object.key.js string.unquoted.label.js"
                },
                {
                    "foreground": "d8dee9",
                    "token": "meta.class-method.js entity.name.function.js"
                },
                {
                    "foreground": "d8dee9",
                    "token": "variable.function.constructor"
                },
                {
                    "foreground": "d8dee9",
                    "token": "meta.class.js meta.class.property.js meta.method.js string.unquoted.js entity.name.function.js"
                },
                {
                    "foreground": "bb80b3",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "99c794",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "ec5f67",
                    "token": "markup.deleted"
                },
                {
                    "foreground": "bb80b3",
                    "token": "markup.changed"
                },
                {
                    "foreground": "5fb3b3",
                    "token": "string.regexp"
                },
                {
                    "foreground": "5fb3b3",
                    "token": "constant.character.escape"
                },
                {
                    "fontStyle": "underline",
                    "token": "*url*"
                },
                {
                    "fontStyle": "underline",
                    "token": "*link*"
                },
                {
                    "fontStyle": "underline",
                    "token": "*uri*"
                },
                {
                    "foreground": "ab7967",
                    "token": "constant.numeric.line-number.find-in-files - match"
                },
                {
                    "foreground": "99c794",
                    "token": "entity.name.filename.find-in-files"
                },
                {
                    "foreground": "6699cc",
                    "fontStyle": "italic",
                    "token": "tag.decorator.js entity.name.tag.js"
                },
                {
                    "foreground": "6699cc",
                    "fontStyle": "italic",
                    "token": "tag.decorator.js punctuation.definition.tag.js"
                },
                {
                    "foreground": "ec5f67",
                    "fontStyle": "italic",
                    "token": "source.js constant.other.object.key.js string.unquoted.label.js"
                },
                {
                    "foreground": "fac863",
                    "token": "source.json meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
                },
                {
                    "foreground": "fac863",
                    "token": "source.json meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
                },
                {
                    "foreground": "c594c5",
                    "token": "source.json meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
                },
                {
                    "foreground": "c594c5",
                    "token": "source.json meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
                },
                {
                    "foreground": "d8dee9",
                    "token": "source.json meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
                },
                {
                    "foreground": "d8dee9",
                    "token": "source.json meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
                },
                {
                    "foreground": "6699cc",
                    "token": "source.json meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
                },
                {
                    "foreground": "6699cc",
                    "token": "source.json meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
                },
                {
                    "foreground": "ab7967",
                    "token": "source.json meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
                },
                {
                    "foreground": "ab7967",
                    "token": "source.json meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
                },
                {
                    "foreground": "ec5f67",
                    "token": "source.json meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
                },
                {
                    "foreground": "ec5f67",
                    "token": "source.json meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
                },
                {
                    "foreground": "f99157",
                    "token": "source.json meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
                },
                {
                    "foreground": "f99157",
                    "token": "source.json meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
                },
                {
                    "foreground": "fac863",
                    "token": "source.json meta meta.structure.dictionary.json string.quoted.double.json - meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
                },
                {
                    "foreground": "fac863",
                    "token": "source.json meta meta.structure.dictionary.json punctuation.definition.string - meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
                },
                {
                    "foreground": "c594c5",
                    "token": "source.json meta.structure.dictionary.json string.quoted.double.json - meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json"
                },
                {
                    "foreground": "c594c5",
                    "token": "source.json meta.structure.dictionary.json punctuation.definition.string - meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string"
                }
            ],
            "colors": {
                "editor.foreground": "#CDD3DE",
                "editor.background": "#1B2B34",
                "editor.selectionBackground": "#4f5b66",
                "editor.lineHighlightBackground": "#65737e55",
                "editorCursor.foreground": "#c0c5ce",
                "editorWhitespace.foreground": "#65737e",
                "editorIndentGuide.background": "#65737F",
                "editorIndentGuide.activeBackground": "#FBC95A"
            }
        },
        id: "oceanic-next"
    },
    {
        name: "Pastels on Dark",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "211E1E",
                    "token": ""
                },
                {
                    "foreground": "555555",
                    "token": "comment"
                },
                {
                    "foreground": "555555",
                    "token": "comment.block"
                },
                {
                    "foreground": "ad9361",
                    "token": "string"
                },
                {
                    "foreground": "cccccc",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "a1a1ff",
                    "token": "keyword"
                },
                {
                    "foreground": "2f006e",
                    "token": "meta.preprocessor"
                },
                {
                    "fontStyle": "bold",
                    "token": "keyword.control.import"
                },
                {
                    "foreground": "a1a1ff",
                    "token": "support.function"
                },
                {
                    "foreground": "0000ff",
                    "token": "declaration.function function-result"
                },
                {
                    "fontStyle": "bold",
                    "token": "declaration.function function-name"
                },
                {
                    "fontStyle": "bold",
                    "token": "declaration.function argument-name"
                },
                {
                    "foreground": "0000ff",
                    "token": "declaration.function function-arg-type"
                },
                {
                    "fontStyle": "italic",
                    "token": "declaration.function function-argument"
                },
                {
                    "fontStyle": "underline",
                    "token": "declaration.class class-name"
                },
                {
                    "fontStyle": "italic underline",
                    "token": "declaration.class class-inheritance"
                },
                {
                    "foreground": "fff9f9",
                    "background": "ff0000",
                    "fontStyle": "bold",
                    "token": "invalid"
                },
                {
                    "background": "ffd0d0",
                    "token": "invalid.deprecated.trailing-whitespace"
                },
                {
                    "fontStyle": "italic",
                    "token": "declaration.section section-name"
                },
                {
                    "foreground": "c10006",
                    "token": "string.interpolation"
                },
                {
                    "foreground": "666666",
                    "token": "string.regexp"
                },
                {
                    "foreground": "c1c144",
                    "token": "variable"
                },
                {
                    "foreground": "6782d3",
                    "token": "constant"
                },
                {
                    "foreground": "afa472",
                    "token": "constant.character"
                },
                {
                    "foreground": "de8e30",
                    "fontStyle": "bold",
                    "token": "constant.language"
                },
                {
                    "fontStyle": "underline",
                    "token": "embedded"
                },
                {
                    "foreground": "858ef4",
                    "token": "keyword.markup.element-name"
                },
                {
                    "foreground": "9b456f",
                    "token": "keyword.markup.attribute-name"
                },
                {
                    "foreground": "9b456f",
                    "token": "meta.attribute-with-value"
                },
                {
                    "foreground": "c82255",
                    "fontStyle": "bold",
                    "token": "keyword.exception"
                },
                {
                    "foreground": "47b8d6",
                    "token": "keyword.operator"
                },
                {
                    "foreground": "6969fa",
                    "fontStyle": "bold",
                    "token": "keyword.control"
                },
                {
                    "foreground": "68685b",
                    "token": "meta.tag.preprocessor.xml"
                },
                {
                    "foreground": "888888",
                    "token": "meta.tag.sgml.doctype"
                },
                {
                    "fontStyle": "italic",
                    "token": "string.quoted.docinfo.doctype.DTD"
                },
                {
                    "foreground": "909090",
                    "token": "comment.other.server-side-include.xhtml"
                },
                {
                    "foreground": "909090",
                    "token": "comment.other.server-side-include.html"
                },
                {
                    "foreground": "858ef4",
                    "token": "text.html declaration.tag"
                },
                {
                    "foreground": "858ef4",
                    "token": "text.html meta.tag"
                },
                {
                    "foreground": "858ef4",
                    "token": "text.html entity.name.tag.xhtml"
                },
                {
                    "foreground": "9b456f",
                    "token": "keyword.markup.attribute-name"
                },
                {
                    "foreground": "777777",
                    "token": "keyword.other.phpdoc.php"
                },
                {
                    "foreground": "c82255",
                    "token": "keyword.other.include.php"
                },
                {
                    "foreground": "de8e20",
                    "fontStyle": "bold",
                    "token": "support.constant.core.php"
                },
                {
                    "foreground": "de8e10",
                    "fontStyle": "bold",
                    "token": "support.constant.std.php"
                },
                {
                    "foreground": "b72e1d",
                    "token": "variable.other.global.php"
                },
                {
                    "foreground": "00ff00",
                    "token": "variable.other.global.safer.php"
                },
                {
                    "foreground": "bfa36d",
                    "token": "string.quoted.single.php"
                },
                {
                    "foreground": "6969fa",
                    "token": "keyword.storage.php"
                },
                {
                    "foreground": "ad9361",
                    "token": "string.quoted.double.php"
                },
                {
                    "foreground": "ec9e00",
                    "token": "entity.other.attribute-name.id.css"
                },
                {
                    "foreground": "b8cd06",
                    "fontStyle": "bold",
                    "token": "entity.name.tag.css"
                },
                {
                    "foreground": "edca06",
                    "token": "entity.other.attribute-name.class.css"
                },
                {
                    "foreground": "2e759c",
                    "token": "entity.other.attribute-name.pseudo-class.css"
                },
                {
                    "foreground": "ffffff",
                    "background": "ff0000",
                    "token": "invalid.bad-comma.css"
                },
                {
                    "foreground": "9b2e4d",
                    "token": "support.constant.property-value.css"
                },
                {
                    "foreground": "e1c96b",
                    "token": "support.type.property-name.css"
                },
                {
                    "foreground": "666633",
                    "token": "constant.other.rgb-value.css"
                },
                {
                    "foreground": "666633",
                    "token": "support.constant.font-name.css"
                },
                {
                    "foreground": "7171f3",
                    "token": "support.constant.tm-language-def"
                },
                {
                    "foreground": "7171f3",
                    "token": "support.constant.name.tm-language-def"
                },
                {
                    "foreground": "6969fa",
                    "token": "keyword.other.unit.css"
                }
            ],
            "colors": {
                "editor.foreground": "#DADADA",
                "editor.background": "#211E1E",
                "editor.selectionBackground": "#73597E80",
                "editor.lineHighlightBackground": "#353030",
                "editorCursor.foreground": "#FFFFFF",
                "editorWhitespace.foreground": "#4F4D4D"
            }
        },
        id: "pastels-on-dark"
    },
    {
        name: "Slush and Poppies",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [
                {
                    "background": "F1F1F1",
                    "token": ""
                },
                {
                    "foreground": "406040",
                    "token": "comment"
                },
                {
                    "foreground": "c03030",
                    "token": "string"
                },
                {
                    "foreground": "0080a0",
                    "token": "constant.numeric"
                },
                {
                    "fontStyle": "underline",
                    "token": "source.ocaml constant.numeric.floating-point"
                },
                {
                    "foreground": "800000",
                    "token": "constant.character"
                },
                {
                    "foreground": "2060a0",
                    "token": "keyword"
                },
                {
                    "foreground": "2060a0",
                    "token": "keyword.operator"
                },
                {
                    "fontStyle": "underline",
                    "token": "source.ocaml keyword.operator.symbol.prefix.floating-point"
                },
                {
                    "fontStyle": "underline",
                    "token": "source.ocaml keyword.operator.symbol.infix.floating-point"
                },
                {
                    "foreground": "0080ff",
                    "token": "entity.name.module"
                },
                {
                    "foreground": "0080ff",
                    "token": "support.other.module"
                },
                {
                    "foreground": "a08000",
                    "token": "storage.type"
                },
                {
                    "foreground": "008080",
                    "token": "storage"
                },
                {
                    "foreground": "c08060",
                    "token": "entity.name.class.variant"
                },
                {
                    "fontStyle": "bold",
                    "token": "keyword.other.directive"
                },
                {
                    "foreground": "800000",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "800080",
                    "token": "storage.type.user-defined"
                },
                {
                    "foreground": "8000c0",
                    "token": "entity.name.type.class.type"
                }
            ],
            "colors": {
                "editor.foreground": "#000000",
                "editor.background": "#F1F1F1",
                "editor.selectionBackground": "#B0B0FF",
                "editor.lineHighlightBackground": "#00000026",
                "editorCursor.foreground": "#000000",
                "editorWhitespace.foreground": "#BFBFBF"
            }
        },
        id: "slush-and-poppies"
    },
    {
        name: "Solarized-dark",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "002B36",
                    "token": ""
                },
                {
                    "foreground": "586e75",
                    "token": "comment"
                },
                {
                    "foreground": "2aa198",
                    "token": "string"
                },
                {
                    "foreground": "586e75",
                    "token": "string"
                },
                {
                    "foreground": "dc322f",
                    "token": "string.regexp"
                },
                {
                    "foreground": "d33682",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "268bd2",
                    "token": "variable.language"
                },
                {
                    "foreground": "268bd2",
                    "token": "variable.other"
                },
                {
                    "foreground": "859900",
                    "token": "keyword"
                },
                {
                    "foreground": "859900",
                    "token": "storage"
                },
                {
                    "foreground": "268bd2",
                    "token": "entity.name.class"
                },
                {
                    "foreground": "268bd2",
                    "token": "entity.name.type.class"
                },
                {
                    "foreground": "268bd2",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "859900",
                    "token": "punctuation.definition.variable"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.section.embedded.begin"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.section.embedded.end"
                },
                {
                    "foreground": "b58900",
                    "token": "constant.language"
                },
                {
                    "foreground": "b58900",
                    "token": "meta.preprocessor"
                },
                {
                    "foreground": "dc322f",
                    "token": "support.function.construct"
                },
                {
                    "foreground": "dc322f",
                    "token": "keyword.other.new"
                },
                {
                    "foreground": "cb4b16",
                    "token": "constant.character"
                },
                {
                    "foreground": "cb4b16",
                    "token": "constant.other"
                },
                {
                    "foreground": "268bd2",
                    "fontStyle": "bold",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "586e75",
                    "token": "punctuation.definition.tag.html"
                },
                {
                    "foreground": "586e75",
                    "token": "punctuation.definition.tag.begin"
                },
                {
                    "foreground": "586e75",
                    "token": "punctuation.definition.tag.end"
                },
                {
                    "foreground": "93a1a1",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "268bd2",
                    "token": "support.function"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.separator.continuation"
                },
                {
                    "foreground": "859900",
                    "token": "support.type"
                },
                {
                    "foreground": "859900",
                    "token": "support.class"
                },
                {
                    "foreground": "cb4b16",
                    "token": "support.type.exception"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.other.special-method"
                },
                {
                    "foreground": "2aa198",
                    "token": "string.quoted.double"
                },
                {
                    "foreground": "2aa198",
                    "token": "string.quoted.single"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.string.begin"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.string.end"
                },
                {
                    "foreground": "b58900",
                    "token": "entity.name.tag.css"
                },
                {
                    "foreground": "b58900",
                    "token": "support.type.property-name.css"
                },
                {
                    "foreground": "b58900",
                    "token": "meta.property-name.css"
                },
                {
                    "foreground": "dc322f",
                    "token": "source.css"
                },
                {
                    "foreground": "586e75",
                    "token": "meta.selector.css"
                },
                {
                    "foreground": "6c71c4",
                    "token": "punctuation.section.property-list.css"
                },
                {
                    "foreground": "2aa198",
                    "token": "meta.property-value.css constant.numeric.css"
                },
                {
                    "foreground": "2aa198",
                    "token": "keyword.other.unit.css"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.other.color.rgb-value.css"
                },
                {
                    "foreground": "2aa198",
                    "token": "meta.property-value.css"
                },
                {
                    "foreground": "dc322f",
                    "token": "keyword.other.important.css"
                },
                {
                    "foreground": "2aa198",
                    "token": "support.constant.color"
                },
                {
                    "foreground": "859900",
                    "token": "entity.name.tag.css"
                },
                {
                    "foreground": "586e75",
                    "token": "punctuation.separator.key-value.css"
                },
                {
                    "foreground": "586e75",
                    "token": "punctuation.terminator.rule.css"
                },
                {
                    "foreground": "268bd2",
                    "token": "entity.other.attribute-name.class.css"
                },
                {
                    "foreground": "cb4b16",
                    "token": "entity.other.attribute-name.pseudo-element.css"
                },
                {
                    "foreground": "cb4b16",
                    "token": "entity.other.attribute-name.pseudo-class.css"
                },
                {
                    "foreground": "268bd2",
                    "token": "entity.other.attribute-name.id.css"
                },
                {
                    "foreground": "b58900",
                    "token": "meta.function.js"
                },
                {
                    "foreground": "b58900",
                    "token": "entity.name.function.js"
                },
                {
                    "foreground": "b58900",
                    "token": "support.function.dom.js"
                },
                {
                    "foreground": "b58900",
                    "token": "text.html.basic source.js.embedded.html"
                },
                {
                    "foreground": "268bd2",
                    "token": "storage.type.function.js"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.numeric.js"
                },
                {
                    "foreground": "268bd2",
                    "token": "meta.brace.square.js"
                },
                {
                    "foreground": "268bd2",
                    "token": "storage.type.js"
                },
                {
                    "foreground": "93a1a1",
                    "token": "meta.brace.round"
                },
                {
                    "foreground": "93a1a1",
                    "token": "punctuation.definition.parameters.begin.js"
                },
                {
                    "foreground": "93a1a1",
                    "token": "punctuation.definition.parameters.end.js"
                },
                {
                    "foreground": "268bd2",
                    "token": "meta.brace.curly.js"
                },
                {
                    "foreground": "93a1a1",
                    "fontStyle": "italic",
                    "token": "entity.name.tag.doctype.html"
                },
                {
                    "foreground": "93a1a1",
                    "fontStyle": "italic",
                    "token": "meta.tag.sgml.html"
                },
                {
                    "foreground": "93a1a1",
                    "fontStyle": "italic",
                    "token": "string.quoted.double.doctype.identifiers-and-DTDs.html"
                },
                {
                    "foreground": "839496",
                    "fontStyle": "italic",
                    "token": "comment.block.html"
                },
                {
                    "fontStyle": "italic",
                    "token": "entity.name.tag.script.html"
                },
                {
                    "foreground": "2aa198",
                    "token": "source.css.embedded.html string.quoted.double.html"
                },
                {
                    "foreground": "cb4b16",
                    "fontStyle": "bold",
                    "token": "text.html.ruby"
                },
                {
                    "foreground": "657b83",
                    "token": "text.html.basic meta.tag.other.html"
                },
                {
                    "foreground": "657b83",
                    "token": "text.html.basic meta.tag.any.html"
                },
                {
                    "foreground": "657b83",
                    "token": "text.html.basic meta.tag.block.any"
                },
                {
                    "foreground": "657b83",
                    "token": "text.html.basic meta.tag.inline.any"
                },
                {
                    "foreground": "657b83",
                    "token": "text.html.basic meta.tag.structure.any.html"
                },
                {
                    "foreground": "657b83",
                    "token": "text.html.basic source.js.embedded.html"
                },
                {
                    "foreground": "657b83",
                    "token": "punctuation.separator.key-value.html"
                },
                {
                    "foreground": "657b83",
                    "token": "text.html.basic entity.other.attribute-name.html"
                },
                {
                    "foreground": "2aa198",
                    "token": "text.html.basic meta.tag.structure.any.html punctuation.definition.string.begin.html"
                },
                {
                    "foreground": "2aa198",
                    "token": "punctuation.definition.string.begin.html"
                },
                {
                    "foreground": "2aa198",
                    "token": "punctuation.definition.string.end.html"
                },
                {
                    "foreground": "268bd2",
                    "fontStyle": "bold",
                    "token": "entity.name.tag.block.any.html"
                },
                {
                    "fontStyle": "italic",
                    "token": "source.css.embedded.html entity.name.tag.style.html"
                },
                {
                    "foreground": "839496",
                    "fontStyle": "italic",
                    "token": "source.css.embedded.html"
                },
                {
                    "foreground": "839496",
                    "fontStyle": "italic",
                    "token": "comment.block.html"
                },
                {
                    "foreground": "268bd2",
                    "token": "punctuation.definition.variable.ruby"
                },
                {
                    "foreground": "657b83",
                    "token": "meta.function.method.with-arguments.ruby"
                },
                {
                    "foreground": "2aa198",
                    "token": "variable.language.ruby"
                },
                {
                    "foreground": "268bd2",
                    "token": "entity.name.function.ruby"
                },
                {
                    "foreground": "859900",
                    "fontStyle": "bold",
                    "token": "keyword.control.ruby"
                },
                {
                    "foreground": "859900",
                    "fontStyle": "bold",
                    "token": "keyword.control.def.ruby"
                },
                {
                    "foreground": "859900",
                    "token": "keyword.control.class.ruby"
                },
                {
                    "foreground": "859900",
                    "token": "meta.class.ruby"
                },
                {
                    "foreground": "b58900",
                    "token": "entity.name.type.class.ruby"
                },
                {
                    "foreground": "859900",
                    "token": "keyword.control.ruby"
                },
                {
                    "foreground": "b58900",
                    "token": "support.class.ruby"
                },
                {
                    "foreground": "859900",
                    "token": "keyword.other.special-method.ruby"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.language.ruby"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.numeric.ruby"
                },
                {
                    "foreground": "b58900",
                    "token": "variable.other.constant.ruby"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.other.symbol.ruby"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.section.embedded.ruby"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.string.begin.ruby"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.string.end.ruby"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.other.special-method.ruby"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.control.import.include.php"
                },
                {
                    "foreground": "839496",
                    "token": "text.html.ruby meta.tag.inline.any.html"
                },
                {
                    "foreground": "2aa198",
                    "token": "text.html.ruby punctuation.definition.string.begin"
                },
                {
                    "foreground": "2aa198",
                    "token": "text.html.ruby punctuation.definition.string.end"
                },
                {
                    "foreground": "839496",
                    "token": "punctuation.definition.string.begin"
                },
                {
                    "foreground": "839496",
                    "token": "punctuation.definition.string.end"
                },
                {
                    "foreground": "839496",
                    "token": "support.class.php"
                },
                {
                    "foreground": "dc322f",
                    "token": "keyword.operator.index-start.php"
                },
                {
                    "foreground": "dc322f",
                    "token": "keyword.operator.index-end.php"
                },
                {
                    "foreground": "586e75",
                    "token": "meta.array.php"
                },
                {
                    "foreground": "b58900",
                    "token": "meta.array.php support.function.construct.php"
                },
                {
                    "foreground": "b58900",
                    "token": "meta.array.empty.php support.function.construct.php"
                },
                {
                    "foreground": "b58900",
                    "token": "support.function.construct.php"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.array.begin"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.array.end"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.numeric.php"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.other.new.php"
                },
                {
                    "foreground": "839496",
                    "token": "keyword.operator.class"
                },
                {
                    "foreground": "93a1a1",
                    "token": "variable.other.property.php"
                },
                {
                    "foreground": "b58900",
                    "token": "storage.modifier.extends.php"
                },
                {
                    "foreground": "b58900",
                    "token": "storage.type.class.php"
                },
                {
                    "foreground": "b58900",
                    "token": "keyword.operator.class.php"
                },
                {
                    "foreground": "839496",
                    "token": "punctuation.terminator.expression.php"
                },
                {
                    "foreground": "586e75",
                    "token": "meta.other.inherited-class.php"
                },
                {
                    "foreground": "859900",
                    "token": "storage.type.php"
                },
                {
                    "foreground": "93a1a1",
                    "token": "entity.name.function.php"
                },
                {
                    "foreground": "859900",
                    "token": "support.function.construct.php"
                },
                {
                    "foreground": "839496",
                    "token": "entity.name.type.class.php"
                },
                {
                    "foreground": "839496",
                    "token": "meta.function-call.php"
                },
                {
                    "foreground": "839496",
                    "token": "meta.function-call.static.php"
                },
                {
                    "foreground": "839496",
                    "token": "meta.function-call.object.php"
                },
                {
                    "foreground": "93a1a1",
                    "token": "keyword.other.phpdoc"
                },
                {
                    "foreground": "cb4b16",
                    "token": "source.php.embedded.block.html"
                },
                {
                    "foreground": "cb4b16",
                    "token": "storage.type.function.php"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.numeric.c"
                },
                {
                    "foreground": "cb4b16",
                    "token": "meta.preprocessor.c.include"
                },
                {
                    "foreground": "cb4b16",
                    "token": "meta.preprocessor.macro.c"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.control.import.define.c"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.control.import.include.c"
                },
                {
                    "foreground": "cb4b16",
                    "token": "entity.name.function.preprocessor.c"
                },
                {
                    "foreground": "2aa198",
                    "token": "meta.preprocessor.c.include string.quoted.other.lt-gt.include.c"
                },
                {
                    "foreground": "2aa198",
                    "token": "meta.preprocessor.c.include punctuation.definition.string.begin.c"
                },
                {
                    "foreground": "2aa198",
                    "token": "meta.preprocessor.c.include punctuation.definition.string.end.c"
                },
                {
                    "foreground": "586e75",
                    "token": "support.function.C99.c"
                },
                {
                    "foreground": "586e75",
                    "token": "support.function.any-method.c"
                },
                {
                    "foreground": "586e75",
                    "token": "entity.name.function.c"
                },
                {
                    "foreground": "2aa198",
                    "token": "punctuation.definition.string.begin.c"
                },
                {
                    "foreground": "2aa198",
                    "token": "punctuation.definition.string.end.c"
                },
                {
                    "foreground": "b58900",
                    "token": "storage.type.c"
                },
                {
                    "foreground": "e0eddd",
                    "background": "b58900",
                    "fontStyle": "italic",
                    "token": "meta.diff"
                },
                {
                    "foreground": "e0eddd",
                    "background": "b58900",
                    "fontStyle": "italic",
                    "token": "meta.diff.header"
                },
                {
                    "foreground": "dc322f",
                    "background": "eee8d5",
                    "token": "markup.deleted"
                },
                {
                    "foreground": "cb4b16",
                    "background": "eee8d5",
                    "token": "markup.changed"
                },
                {
                    "foreground": "219186",
                    "background": "eee8d5",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "e0eddd",
                    "background": "b58900",
                    "token": "text.html.markdown meta.dummy.line-break"
                },
                {
                    "foreground": "2aa198",
                    "token": "text.html.markdown markup.raw.inline"
                },
                {
                    "foreground": "2aa198",
                    "token": "text.restructuredtext markup.raw"
                },
                {
                    "foreground": "dc322f",
                    "token": "other.package.exclude"
                },
                {
                    "foreground": "dc322f",
                    "token": "other.remove"
                },
                {
                    "foreground": "2aa198",
                    "token": "other.add"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.section.group.tex"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.arguments.begin.latex"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.arguments.end.latex"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.arguments.latex"
                },
                {
                    "foreground": "b58900",
                    "token": "meta.group.braces.tex"
                },
                {
                    "foreground": "b58900",
                    "token": "string.other.math.tex"
                },
                {
                    "foreground": "cb4b16",
                    "token": "variable.parameter.function.latex"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.constant.math.tex"
                },
                {
                    "foreground": "2aa198",
                    "token": "text.tex.latex constant.other.math.tex"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.other.general.math.tex"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.other.general.math.tex"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.character.math.tex"
                },
                {
                    "foreground": "b58900",
                    "token": "string.other.math.tex"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.string.begin.tex"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.string.end.tex"
                },
                {
                    "foreground": "2aa198",
                    "token": "keyword.control.label.latex"
                },
                {
                    "foreground": "2aa198",
                    "token": "text.tex.latex constant.other.general.math.tex"
                },
                {
                    "foreground": "dc322f",
                    "token": "variable.parameter.definition.label.latex"
                },
                {
                    "foreground": "859900",
                    "token": "support.function.be.latex"
                },
                {
                    "foreground": "cb4b16",
                    "token": "support.function.section.latex"
                },
                {
                    "foreground": "2aa198",
                    "token": "support.function.general.tex"
                },
                {
                    "fontStyle": "italic",
                    "token": "punctuation.definition.comment.tex"
                },
                {
                    "fontStyle": "italic",
                    "token": "comment.line.percentage.tex"
                },
                {
                    "foreground": "2aa198",
                    "token": "keyword.control.ref.latex"
                },
                {
                    "foreground": "586e75",
                    "token": "string.quoted.double.block.python"
                },
                {
                    "foreground": "859900",
                    "token": "storage.type.class.python"
                },
                {
                    "foreground": "859900",
                    "token": "storage.type.function.python"
                },
                {
                    "foreground": "859900",
                    "token": "storage.modifier.global.python"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.control.import.python"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.control.import.from.python"
                },
                {
                    "foreground": "b58900",
                    "token": "support.type.exception.python"
                },
                {
                    "foreground": "859900",
                    "token": "support.function.builtin.shell"
                },
                {
                    "foreground": "cb4b16",
                    "token": "variable.other.normal.shell"
                },
                {
                    "foreground": "268bd2",
                    "token": "source.shell"
                },
                {
                    "foreground": "586e75",
                    "token": "meta.scope.for-in-loop.shell"
                },
                {
                    "foreground": "586e75",
                    "token": "variable.other.loop.shell"
                },
                {
                    "foreground": "859900",
                    "token": "punctuation.definition.string.end.shell"
                },
                {
                    "foreground": "859900",
                    "token": "punctuation.definition.string.begin.shell"
                },
                {
                    "foreground": "586e75",
                    "token": "meta.scope.case-block.shell"
                },
                {
                    "foreground": "586e75",
                    "token": "meta.scope.case-body.shell"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.logical-expression.shell"
                },
                {
                    "fontStyle": "italic",
                    "token": "comment.line.number-sign.shell"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.other.import.java"
                },
                {
                    "foreground": "586e75",
                    "token": "storage.modifier.import.java"
                },
                {
                    "foreground": "b58900",
                    "token": "meta.class.java storage.modifier.java"
                },
                {
                    "foreground": "586e75",
                    "token": "source.java comment.block"
                },
                {
                    "foreground": "586e75",
                    "token": "comment.block meta.documentation.tag.param.javadoc keyword.other.documentation.param.javadoc"
                },
                {
                    "foreground": "b58900",
                    "token": "punctuation.definition.variable.perl"
                },
                {
                    "foreground": "b58900",
                    "token": "variable.other.readwrite.global.perl"
                },
                {
                    "foreground": "b58900",
                    "token": "variable.other.predefined.perl"
                },
                {
                    "foreground": "b58900",
                    "token": "keyword.operator.comparison.perl"
                },
                {
                    "foreground": "859900",
                    "token": "support.function.perl"
                },
                {
                    "foreground": "586e75",
                    "fontStyle": "italic",
                    "token": "comment.line.number-sign.perl"
                },
                {
                    "foreground": "2aa198",
                    "token": "punctuation.definition.string.begin.perl"
                },
                {
                    "foreground": "2aa198",
                    "token": "punctuation.definition.string.end.perl"
                },
                {
                    "foreground": "dc322f",
                    "token": "constant.character.escape.perl"
                },
                {
                    "foreground": "268bd2",
                    "token": "markup.heading.markdown"
                },
                {
                    "foreground": "268bd2",
                    "token": "markup.heading.1.markdown"
                },
                {
                    "foreground": "268bd2",
                    "token": "markup.heading.2.markdown"
                },
                {
                    "foreground": "268bd2",
                    "token": "markup.heading.3.markdown"
                },
                {
                    "foreground": "268bd2",
                    "token": "markup.heading.4.markdown"
                },
                {
                    "foreground": "268bd2",
                    "token": "markup.heading.5.markdown"
                },
                {
                    "foreground": "268bd2",
                    "token": "markup.heading.6.markdown"
                },
                {
                    "foreground": "839496",
                    "fontStyle": "bold",
                    "token": "markup.bold.markdown"
                },
                {
                    "foreground": "839496",
                    "fontStyle": "italic",
                    "token": "markup.italic.markdown"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.bold.markdown"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.italic.markdown"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.raw.markdown"
                },
                {
                    "foreground": "b58900",
                    "token": "markup.list.unnumbered.markdown"
                },
                {
                    "foreground": "859900",
                    "token": "markup.list.numbered.markdown"
                },
                {
                    "foreground": "2aa198",
                    "token": "markup.raw.block.markdown"
                },
                {
                    "foreground": "2aa198",
                    "token": "markup.raw.inline.markdown"
                },
                {
                    "foreground": "6c71c4",
                    "token": "markup.quote.markdown"
                },
                {
                    "foreground": "6c71c4",
                    "token": "punctuation.definition.blockquote.markdown"
                },
                {
                    "foreground": "d33682",
                    "token": "meta.separator.markdown"
                },
                {
                    "foreground": "586e75",
                    "fontStyle": "italic",
                    "token": "meta.image.inline.markdown"
                },
                {
                    "foreground": "586e75",
                    "fontStyle": "italic",
                    "token": "markup.underline.link.markdown"
                },
                {
                    "foreground": "93a1a1",
                    "token": "string.other.link.title.markdown"
                },
                {
                    "foreground": "93a1a1",
                    "token": "string.other.link.description.markdown"
                },
                {
                    "foreground": "586e75",
                    "token": "punctuation.definition.link.markdown"
                },
                {
                    "foreground": "586e75",
                    "token": "punctuation.definition.metadata.markdown"
                },
                {
                    "foreground": "586e75",
                    "token": "punctuation.definition.string.begin.markdown"
                },
                {
                    "foreground": "586e75",
                    "token": "punctuation.definition.string.end.markdown"
                },
                {
                    "foreground": "586e75",
                    "token": "punctuation.definition.constant.markdown"
                },
                {
                    "foreground": "eee8d5",
                    "background": "eee8d5",
                    "token": "sublimelinter.notes"
                },
                {
                    "foreground": "93a1a1",
                    "background": "93a1a1",
                    "token": "sublimelinter.outline.illegal"
                },
                {
                    "background": "dc322f",
                    "token": "sublimelinter.underline.illegal"
                },
                {
                    "foreground": "839496",
                    "background": "839496",
                    "token": "sublimelinter.outline.warning"
                },
                {
                    "background": "b58900",
                    "token": "sublimelinter.underline.warning"
                },
                {
                    "foreground": "657b83",
                    "background": "657b83",
                    "token": "sublimelinter.outline.violation"
                },
                {
                    "background": "cb4b16",
                    "token": "sublimelinter.underline.violation"
                }
            ],
            "colors": {
                "editor.foreground": "#839496",
                "editor.background": "#002B36",
                "editor.selectionBackground": "#073642",
                "editor.lineHighlightBackground": "#073642",
                "editorCursor.foreground": "#819090",
                "editorWhitespace.foreground": "#073642"
            }
        },
        id: "solarized-dark"
    },
    {
        name: "Solarized-light",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [
                {
                    "background": "FDF6E3",
                    "token": ""
                },
                {
                    "foreground": "93a1a1",
                    "token": "comment"
                },
                {
                    "foreground": "2aa198",
                    "token": "string"
                },
                {
                    "foreground": "586e75",
                    "token": "string"
                },
                {
                    "foreground": "dc322f",
                    "token": "string.regexp"
                },
                {
                    "foreground": "d33682",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "268bd2",
                    "token": "variable.language"
                },
                {
                    "foreground": "268bd2",
                    "token": "variable.other"
                },
                {
                    "foreground": "859900",
                    "token": "keyword"
                },
                {
                    "foreground": "073642",
                    "fontStyle": "bold",
                    "token": "storage"
                },
                {
                    "foreground": "268bd2",
                    "token": "entity.name.class"
                },
                {
                    "foreground": "268bd2",
                    "token": "entity.name.type.class"
                },
                {
                    "foreground": "268bd2",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "859900",
                    "token": "punctuation.definition.variable"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.section.embedded.begin"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.section.embedded.end"
                },
                {
                    "foreground": "b58900",
                    "token": "constant.language"
                },
                {
                    "foreground": "b58900",
                    "token": "meta.preprocessor"
                },
                {
                    "foreground": "dc322f",
                    "token": "support.function.construct"
                },
                {
                    "foreground": "dc322f",
                    "token": "keyword.other.new"
                },
                {
                    "foreground": "cb4b16",
                    "token": "constant.character"
                },
                {
                    "foreground": "cb4b16",
                    "token": "constant.other"
                },
                {
                    "foreground": "268bd2",
                    "fontStyle": "bold",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "93a1a1",
                    "token": "punctuation.definition.tag.html"
                },
                {
                    "foreground": "93a1a1",
                    "token": "punctuation.definition.tag.begin"
                },
                {
                    "foreground": "93a1a1",
                    "token": "punctuation.definition.tag.end"
                },
                {
                    "foreground": "93a1a1",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "268bd2",
                    "token": "support.function"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.separator.continuation"
                },
                {
                    "foreground": "859900",
                    "token": "support.type"
                },
                {
                    "foreground": "859900",
                    "token": "support.class"
                },
                {
                    "foreground": "cb4b16",
                    "token": "support.type.exception"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.other.special-method"
                },
                {
                    "foreground": "2aa198",
                    "token": "string.quoted.double"
                },
                {
                    "foreground": "2aa198",
                    "token": "string.quoted.single"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.string.begin"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.string.end"
                },
                {
                    "foreground": "b58900",
                    "token": "entity.name.tag.css"
                },
                {
                    "foreground": "b58900",
                    "token": "support.type.property-name.css"
                },
                {
                    "foreground": "b58900",
                    "token": "meta.property-name.css"
                },
                {
                    "foreground": "dc322f",
                    "token": "source.css"
                },
                {
                    "foreground": "586e75",
                    "token": "meta.selector.css"
                },
                {
                    "foreground": "6c71c4",
                    "token": "punctuation.section.property-list.css"
                },
                {
                    "foreground": "2aa198",
                    "token": "meta.property-value.css constant.numeric.css"
                },
                {
                    "foreground": "2aa198",
                    "token": "keyword.other.unit.css"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.other.color.rgb-value.css"
                },
                {
                    "foreground": "2aa198",
                    "token": "meta.property-value.css"
                },
                {
                    "foreground": "dc322f",
                    "token": "keyword.other.important.css"
                },
                {
                    "foreground": "2aa198",
                    "token": "support.constant.color"
                },
                {
                    "foreground": "859900",
                    "token": "entity.name.tag.css"
                },
                {
                    "foreground": "586e75",
                    "token": "punctuation.separator.key-value.css"
                },
                {
                    "foreground": "586e75",
                    "token": "punctuation.terminator.rule.css"
                },
                {
                    "foreground": "268bd2",
                    "token": "entity.other.attribute-name.class.css"
                },
                {
                    "foreground": "cb4b16",
                    "token": "entity.other.attribute-name.pseudo-element.css"
                },
                {
                    "foreground": "cb4b16",
                    "token": "entity.other.attribute-name.pseudo-class.css"
                },
                {
                    "foreground": "268bd2",
                    "token": "entity.other.attribute-name.id.css"
                },
                {
                    "foreground": "b58900",
                    "token": "meta.function.js"
                },
                {
                    "foreground": "b58900",
                    "token": "entity.name.function.js"
                },
                {
                    "foreground": "b58900",
                    "token": "support.function.dom.js"
                },
                {
                    "foreground": "b58900",
                    "token": "text.html.basic source.js.embedded.html"
                },
                {
                    "foreground": "268bd2",
                    "token": "storage.type.function.js"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.numeric.js"
                },
                {
                    "foreground": "268bd2",
                    "token": "meta.brace.square.js"
                },
                {
                    "foreground": "268bd2",
                    "token": "storage.type.js"
                },
                {
                    "foreground": "93a1a1",
                    "token": "meta.brace.round"
                },
                {
                    "foreground": "93a1a1",
                    "token": "punctuation.definition.parameters.begin.js"
                },
                {
                    "foreground": "93a1a1",
                    "token": "punctuation.definition.parameters.end.js"
                },
                {
                    "foreground": "268bd2",
                    "token": "meta.brace.curly.js"
                },
                {
                    "foreground": "93a1a1",
                    "fontStyle": "italic",
                    "token": "entity.name.tag.doctype.html"
                },
                {
                    "foreground": "93a1a1",
                    "fontStyle": "italic",
                    "token": "meta.tag.sgml.html"
                },
                {
                    "foreground": "93a1a1",
                    "fontStyle": "italic",
                    "token": "string.quoted.double.doctype.identifiers-and-DTDs.html"
                },
                {
                    "foreground": "839496",
                    "fontStyle": "italic",
                    "token": "comment.block.html"
                },
                {
                    "fontStyle": "italic",
                    "token": "entity.name.tag.script.html"
                },
                {
                    "foreground": "2aa198",
                    "token": "source.css.embedded.html string.quoted.double.html"
                },
                {
                    "foreground": "cb4b16",
                    "fontStyle": "bold",
                    "token": "text.html.ruby"
                },
                {
                    "foreground": "657b83",
                    "token": "text.html.basic meta.tag.other.html"
                },
                {
                    "foreground": "657b83",
                    "token": "text.html.basic meta.tag.any.html"
                },
                {
                    "foreground": "657b83",
                    "token": "text.html.basic meta.tag.block.any"
                },
                {
                    "foreground": "657b83",
                    "token": "text.html.basic meta.tag.inline.any"
                },
                {
                    "foreground": "657b83",
                    "token": "text.html.basic meta.tag.structure.any.html"
                },
                {
                    "foreground": "657b83",
                    "token": "text.html.basic source.js.embedded.html"
                },
                {
                    "foreground": "657b83",
                    "token": "punctuation.separator.key-value.html"
                },
                {
                    "foreground": "657b83",
                    "token": "text.html.basic entity.other.attribute-name.html"
                },
                {
                    "foreground": "2aa198",
                    "token": "text.html.basic meta.tag.structure.any.html punctuation.definition.string.begin.html"
                },
                {
                    "foreground": "2aa198",
                    "token": "punctuation.definition.string.begin.html"
                },
                {
                    "foreground": "2aa198",
                    "token": "punctuation.definition.string.end.html"
                },
                {
                    "foreground": "268bd2",
                    "fontStyle": "bold",
                    "token": "entity.name.tag.block.any.html"
                },
                {
                    "fontStyle": "italic",
                    "token": "source.css.embedded.html entity.name.tag.style.html"
                },
                {
                    "foreground": "839496",
                    "fontStyle": "italic",
                    "token": "source.css.embedded.html"
                },
                {
                    "foreground": "839496",
                    "fontStyle": "italic",
                    "token": "comment.block.html"
                },
                {
                    "foreground": "268bd2",
                    "token": "punctuation.definition.variable.ruby"
                },
                {
                    "foreground": "657b83",
                    "token": "meta.function.method.with-arguments.ruby"
                },
                {
                    "foreground": "2aa198",
                    "token": "variable.language.ruby"
                },
                {
                    "foreground": "268bd2",
                    "token": "entity.name.function.ruby"
                },
                {
                    "foreground": "859900",
                    "fontStyle": "bold",
                    "token": "keyword.control.ruby"
                },
                {
                    "foreground": "859900",
                    "fontStyle": "bold",
                    "token": "keyword.control.def.ruby"
                },
                {
                    "foreground": "859900",
                    "token": "keyword.control.class.ruby"
                },
                {
                    "foreground": "859900",
                    "token": "meta.class.ruby"
                },
                {
                    "foreground": "b58900",
                    "token": "entity.name.type.class.ruby"
                },
                {
                    "foreground": "859900",
                    "token": "keyword.control.ruby"
                },
                {
                    "foreground": "b58900",
                    "token": "support.class.ruby"
                },
                {
                    "foreground": "859900",
                    "token": "keyword.other.special-method.ruby"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.language.ruby"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.numeric.ruby"
                },
                {
                    "foreground": "b58900",
                    "token": "variable.other.constant.ruby"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.other.symbol.ruby"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.section.embedded.ruby"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.string.begin.ruby"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.string.end.ruby"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.other.special-method.ruby"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.control.import.include.php"
                },
                {
                    "foreground": "839496",
                    "token": "text.html.ruby meta.tag.inline.any.html"
                },
                {
                    "foreground": "2aa198",
                    "token": "text.html.ruby punctuation.definition.string.begin"
                },
                {
                    "foreground": "2aa198",
                    "token": "text.html.ruby punctuation.definition.string.end"
                },
                {
                    "foreground": "839496",
                    "token": "punctuation.definition.string.begin"
                },
                {
                    "foreground": "839496",
                    "token": "punctuation.definition.string.end"
                },
                {
                    "foreground": "dc322f",
                    "token": "keyword.operator.index-start.php"
                },
                {
                    "foreground": "dc322f",
                    "token": "keyword.operator.index-end.php"
                },
                {
                    "foreground": "586e75",
                    "token": "meta.array.php"
                },
                {
                    "foreground": "b58900",
                    "token": "meta.array.php support.function.construct.php"
                },
                {
                    "foreground": "b58900",
                    "token": "meta.array.empty.php support.function.construct.php"
                },
                {
                    "foreground": "b58900",
                    "token": "support.function.construct.php"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.array.begin"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.array.end"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.numeric.php"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.other.new.php"
                },
                {
                    "foreground": "586e75",
                    "token": "support.class.php"
                },
                {
                    "foreground": "586e75",
                    "token": "keyword.operator.class"
                },
                {
                    "foreground": "93a1a1",
                    "token": "variable.other.property.php"
                },
                {
                    "foreground": "b58900",
                    "token": "storage.modifier.extends.php"
                },
                {
                    "foreground": "b58900",
                    "token": "storage.type.class.php"
                },
                {
                    "foreground": "b58900",
                    "token": "keyword.operator.class.php"
                },
                {
                    "foreground": "586e75",
                    "token": "meta.other.inherited-class.php"
                },
                {
                    "foreground": "859900",
                    "token": "storage.type.php"
                },
                {
                    "foreground": "93a1a1",
                    "token": "entity.name.function.php"
                },
                {
                    "foreground": "859900",
                    "token": "support.function.construct.php"
                },
                {
                    "foreground": "839496",
                    "token": "entity.name.type.class.php"
                },
                {
                    "foreground": "839496",
                    "token": "meta.function-call.php"
                },
                {
                    "foreground": "839496",
                    "token": "meta.function-call.static.php"
                },
                {
                    "foreground": "839496",
                    "token": "meta.function-call.object.php"
                },
                {
                    "foreground": "93a1a1",
                    "token": "keyword.other.phpdoc"
                },
                {
                    "foreground": "cb4b16",
                    "token": "source.php.embedded.block.html"
                },
                {
                    "foreground": "cb4b16",
                    "token": "storage.type.function.php"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.numeric.c"
                },
                {
                    "foreground": "cb4b16",
                    "token": "meta.preprocessor.c.include"
                },
                {
                    "foreground": "cb4b16",
                    "token": "meta.preprocessor.macro.c"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.control.import.define.c"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.control.import.include.c"
                },
                {
                    "foreground": "cb4b16",
                    "token": "entity.name.function.preprocessor.c"
                },
                {
                    "foreground": "2aa198",
                    "token": "meta.preprocessor.c.include string.quoted.other.lt-gt.include.c"
                },
                {
                    "foreground": "2aa198",
                    "token": "meta.preprocessor.c.include punctuation.definition.string.begin.c"
                },
                {
                    "foreground": "2aa198",
                    "token": "meta.preprocessor.c.include punctuation.definition.string.end.c"
                },
                {
                    "foreground": "586e75",
                    "token": "support.function.C99.c"
                },
                {
                    "foreground": "586e75",
                    "token": "support.function.any-method.c"
                },
                {
                    "foreground": "586e75",
                    "token": "entity.name.function.c"
                },
                {
                    "foreground": "2aa198",
                    "token": "punctuation.definition.string.begin.c"
                },
                {
                    "foreground": "2aa198",
                    "token": "punctuation.definition.string.end.c"
                },
                {
                    "foreground": "b58900",
                    "token": "storage.type.c"
                },
                {
                    "foreground": "e0eddd",
                    "background": "b58900",
                    "fontStyle": "italic",
                    "token": "meta.diff"
                },
                {
                    "foreground": "e0eddd",
                    "background": "b58900",
                    "fontStyle": "italic",
                    "token": "meta.diff.header"
                },
                {
                    "foreground": "dc322f",
                    "background": "eee8d5",
                    "token": "markup.deleted"
                },
                {
                    "foreground": "cb4b16",
                    "background": "eee8d5",
                    "token": "markup.changed"
                },
                {
                    "foreground": "219186",
                    "background": "eee8d5",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "e0eddd",
                    "background": "a57706",
                    "token": "text.html.markdown meta.dummy.line-break"
                },
                {
                    "foreground": "2aa198",
                    "token": "text.html.markdown markup.raw.inline"
                },
                {
                    "foreground": "2aa198",
                    "token": "text.restructuredtext markup.raw"
                },
                {
                    "foreground": "dc322f",
                    "token": "other.package.exclude"
                },
                {
                    "foreground": "dc322f",
                    "token": "other.remove"
                },
                {
                    "foreground": "2aa198",
                    "token": "other.add"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.section.group.tex"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.arguments.begin.latex"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.arguments.end.latex"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.arguments.latex"
                },
                {
                    "foreground": "b58900",
                    "token": "meta.group.braces.tex"
                },
                {
                    "foreground": "b58900",
                    "token": "string.other.math.tex"
                },
                {
                    "foreground": "cb4b16",
                    "token": "variable.parameter.function.latex"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.constant.math.tex"
                },
                {
                    "foreground": "2aa198",
                    "token": "text.tex.latex constant.other.math.tex"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.other.general.math.tex"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.other.general.math.tex"
                },
                {
                    "foreground": "2aa198",
                    "token": "constant.character.math.tex"
                },
                {
                    "foreground": "b58900",
                    "token": "string.other.math.tex"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.string.begin.tex"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.string.end.tex"
                },
                {
                    "foreground": "2aa198",
                    "token": "keyword.control.label.latex"
                },
                {
                    "foreground": "2aa198",
                    "token": "text.tex.latex constant.other.general.math.tex"
                },
                {
                    "foreground": "dc322f",
                    "token": "variable.parameter.definition.label.latex"
                },
                {
                    "foreground": "859900",
                    "token": "support.function.be.latex"
                },
                {
                    "foreground": "cb4b16",
                    "token": "support.function.section.latex"
                },
                {
                    "foreground": "2aa198",
                    "token": "support.function.general.tex"
                },
                {
                    "fontStyle": "italic",
                    "token": "punctuation.definition.comment.tex"
                },
                {
                    "fontStyle": "italic",
                    "token": "comment.line.percentage.tex"
                },
                {
                    "foreground": "2aa198",
                    "token": "keyword.control.ref.latex"
                },
                {
                    "foreground": "586e75",
                    "token": "string.quoted.double.block.python"
                },
                {
                    "foreground": "859900",
                    "token": "storage.type.class.python"
                },
                {
                    "foreground": "859900",
                    "token": "storage.type.function.python"
                },
                {
                    "foreground": "859900",
                    "token": "storage.modifier.global.python"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.control.import.python"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.control.import.from.python"
                },
                {
                    "foreground": "b58900",
                    "token": "support.type.exception.python"
                },
                {
                    "foreground": "859900",
                    "token": "support.function.builtin.shell"
                },
                {
                    "foreground": "cb4b16",
                    "token": "variable.other.normal.shell"
                },
                {
                    "foreground": "268bd2",
                    "token": "source.shell"
                },
                {
                    "foreground": "586e75",
                    "token": "meta.scope.for-in-loop.shell"
                },
                {
                    "foreground": "586e75",
                    "token": "variable.other.loop.shell"
                },
                {
                    "foreground": "859900",
                    "token": "punctuation.definition.string.end.shell"
                },
                {
                    "foreground": "859900",
                    "token": "punctuation.definition.string.begin.shell"
                },
                {
                    "foreground": "586e75",
                    "token": "meta.scope.case-block.shell"
                },
                {
                    "foreground": "586e75",
                    "token": "meta.scope.case-body.shell"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.logical-expression.shell"
                },
                {
                    "fontStyle": "italic",
                    "token": "comment.line.number-sign.shell"
                },
                {
                    "foreground": "cb4b16",
                    "token": "keyword.other.import.java"
                },
                {
                    "foreground": "586e75",
                    "token": "storage.modifier.import.java"
                },
                {
                    "foreground": "b58900",
                    "token": "meta.class.java storage.modifier.java"
                },
                {
                    "foreground": "586e75",
                    "token": "source.java comment.block"
                },
                {
                    "foreground": "586e75",
                    "token": "comment.block meta.documentation.tag.param.javadoc keyword.other.documentation.param.javadoc"
                },
                {
                    "foreground": "b58900",
                    "token": "punctuation.definition.variable.perl"
                },
                {
                    "foreground": "b58900",
                    "token": "variable.other.readwrite.global.perl"
                },
                {
                    "foreground": "b58900",
                    "token": "variable.other.predefined.perl"
                },
                {
                    "foreground": "b58900",
                    "token": "keyword.operator.comparison.perl"
                },
                {
                    "foreground": "859900",
                    "token": "support.function.perl"
                },
                {
                    "foreground": "586e75",
                    "fontStyle": "italic",
                    "token": "comment.line.number-sign.perl"
                },
                {
                    "foreground": "2aa198",
                    "token": "punctuation.definition.string.begin.perl"
                },
                {
                    "foreground": "2aa198",
                    "token": "punctuation.definition.string.end.perl"
                },
                {
                    "foreground": "dc322f",
                    "token": "constant.character.escape.perl"
                },
                {
                    "foreground": "268bd2",
                    "token": "markup.heading.markdown"
                },
                {
                    "foreground": "268bd2",
                    "token": "markup.heading.1.markdown"
                },
                {
                    "foreground": "268bd2",
                    "token": "markup.heading.2.markdown"
                },
                {
                    "foreground": "268bd2",
                    "token": "markup.heading.3.markdown"
                },
                {
                    "foreground": "268bd2",
                    "token": "markup.heading.4.markdown"
                },
                {
                    "foreground": "268bd2",
                    "token": "markup.heading.5.markdown"
                },
                {
                    "foreground": "268bd2",
                    "token": "markup.heading.6.markdown"
                },
                {
                    "foreground": "586e75",
                    "fontStyle": "bold",
                    "token": "markup.bold.markdown"
                },
                {
                    "foreground": "586e75",
                    "fontStyle": "italic",
                    "token": "markup.italic.markdown"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.bold.markdown"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.italic.markdown"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.raw.markdown"
                },
                {
                    "foreground": "b58900",
                    "token": "markup.list.unnumbered.markdown"
                },
                {
                    "foreground": "859900",
                    "token": "markup.list.numbered.markdown"
                },
                {
                    "foreground": "2aa198",
                    "token": "markup.raw.block.markdown"
                },
                {
                    "foreground": "2aa198",
                    "token": "markup.raw.inline.markdown"
                },
                {
                    "foreground": "6c71c4",
                    "token": "markup.quote.markdown"
                },
                {
                    "foreground": "6c71c4",
                    "token": "punctuation.definition.blockquote.markdown"
                },
                {
                    "foreground": "d33682",
                    "token": "meta.separator.markdown"
                },
                {
                    "foreground": "839496",
                    "token": "markup.underline.link.markdown"
                },
                {
                    "foreground": "839496",
                    "token": "markup.underline.link.markdown"
                },
                {
                    "foreground": "dc322f",
                    "token": "meta.link.inet.markdown"
                },
                {
                    "foreground": "dc322f",
                    "token": "meta.link.email.lt-gt.markdown"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.string.begin.markdown"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.string.end.markdown"
                },
                {
                    "foreground": "dc322f",
                    "token": "punctuation.definition.link.markdown"
                },
                {
                    "foreground": "6a8187",
                    "token": "text.plain"
                },
                {
                    "foreground": "eee8d5",
                    "background": "eee8d5",
                    "token": "sublimelinter.notes"
                },
                {
                    "foreground": "93a1a1",
                    "background": "93a1a1",
                    "token": "sublimelinter.outline.illegal"
                },
                {
                    "background": "dc322f",
                    "token": "sublimelinter.underline.illegal"
                },
                {
                    "foreground": "839496",
                    "background": "839496",
                    "token": "sublimelinter.outline.warning"
                },
                {
                    "background": "b58900",
                    "token": "sublimelinter.underline.warning"
                },
                {
                    "foreground": "657b83",
                    "background": "657b83",
                    "token": "sublimelinter.outline.violation"
                },
                {
                    "background": "cb4b16",
                    "token": "sublimelinter.underline.violation"
                }
            ],
            "colors": {
                "editor.foreground": "#586E75",
                "editor.background": "#FDF6E3",
                "editor.selectionBackground": "#EEE8D5",
                "editor.lineHighlightBackground": "#EEE8D5",
                "editorCursor.foreground": "#000000",
                "editorWhitespace.foreground": "#EAE3C9"
            }
        },
        id: "solarized-light"
    },
    {
        name: "SpaceCadet",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "0D0D0D",
                    "token": ""
                },
                {
                    "foreground": "473c45",
                    "token": "comment"
                },
                {
                    "foreground": "805978",
                    "token": "string"
                },
                {
                    "foreground": "a8885a",
                    "token": "constant"
                },
                {
                    "foreground": "596380",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "596380",
                    "token": "variable.other"
                },
                {
                    "foreground": "728059",
                    "token": "keyword - keyword.operator"
                },
                {
                    "foreground": "728059",
                    "token": "keyword.operator.logical"
                },
                {
                    "foreground": "9ebf60",
                    "token": "storage"
                },
                {
                    "foreground": "6078bf",
                    "token": "entity"
                },
                {
                    "fontStyle": "italic",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "8a4b66",
                    "token": "support"
                },
                {
                    "foreground": "893062",
                    "token": "support.type.exception"
                },
                {
                    "background": "5f0047",
                    "token": "invalid"
                },
                {
                    "background": "371d28",
                    "token": "meta.function.section"
                }
            ],
            "colors": {
                "editor.foreground": "#DDE6CF",
                "editor.background": "#0D0D0D",
                "editor.selectionBackground": "#40002F",
                "editor.lineHighlightBackground": "#00000012",
                "editorCursor.foreground": "#7F005D",
                "editorWhitespace.foreground": "#BFBFBF"
            }
        },
        id: "spacecadet"
    },
    {
        name: "Sunburst",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "000000",
                    "token": ""
                },
                {
                    "foreground": "aeaeae",
                    "fontStyle": "italic",
                    "token": "comment"
                },
                {
                    "foreground": "3387cc",
                    "token": "constant"
                },
                {
                    "foreground": "89bdff",
                    "token": "entity"
                },
                {
                    "foreground": "e28964",
                    "token": "keyword"
                },
                {
                    "foreground": "99cf50",
                    "token": "storage"
                },
                {
                    "foreground": "65b042",
                    "token": "string"
                },
                {
                    "foreground": "9b859d",
                    "token": "support"
                },
                {
                    "foreground": "3e87e3",
                    "token": "variable"
                },
                {
                    "foreground": "fd5ff1",
                    "fontStyle": "italic underline",
                    "token": "invalid.deprecated"
                },
                {
                    "foreground": "fd5ff1",
                    "background": "562d56bf",
                    "token": "invalid.illegal"
                },
                {
                    "background": "b1b3ba08",
                    "token": "text source"
                },
                {
                    "foreground": "9b5c2e",
                    "fontStyle": "italic",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "daefa3",
                    "token": "string.quoted source"
                },
                {
                    "foreground": "ddf2a4",
                    "token": "string constant"
                },
                {
                    "foreground": "e9c062",
                    "token": "string.regexp"
                },
                {
                    "foreground": "cf7d34",
                    "token": "string.regexp constant.character.escape"
                },
                {
                    "foreground": "cf7d34",
                    "token": "string.regexp source.ruby.embedded"
                },
                {
                    "foreground": "cf7d34",
                    "token": "string.regexp string.regexp.arbitrary-repitition"
                },
                {
                    "foreground": "8a9a95",
                    "token": "string variable"
                },
                {
                    "foreground": "dad085",
                    "token": "support.function"
                },
                {
                    "foreground": "cf6a4c",
                    "token": "support.constant"
                },
                {
                    "foreground": "8996a8",
                    "token": "meta.preprocessor.c"
                },
                {
                    "foreground": "afc4db",
                    "token": "meta.preprocessor.c keyword"
                },
                {
                    "fontStyle": "underline",
                    "token": "entity.name.type"
                },
                {
                    "foreground": "676767",
                    "fontStyle": "italic",
                    "token": "meta.cast"
                },
                {
                    "foreground": "494949",
                    "token": "meta.sgml.html meta.doctype"
                },
                {
                    "foreground": "494949",
                    "token": "meta.sgml.html meta.doctype entity"
                },
                {
                    "foreground": "494949",
                    "token": "meta.sgml.html meta.doctype string"
                },
                {
                    "foreground": "494949",
                    "token": "meta.xml-processing"
                },
                {
                    "foreground": "494949",
                    "token": "meta.xml-processing entity"
                },
                {
                    "foreground": "494949",
                    "token": "meta.xml-processing string"
                },
                {
                    "foreground": "89bdff",
                    "token": "meta.tag"
                },
                {
                    "foreground": "89bdff",
                    "token": "meta.tag entity"
                },
                {
                    "foreground": "e0c589",
                    "token": "source entity.name.tag"
                },
                {
                    "foreground": "e0c589",
                    "token": "source entity.other.attribute-name"
                },
                {
                    "foreground": "e0c589",
                    "token": "meta.tag.inline"
                },
                {
                    "foreground": "e0c589",
                    "token": "meta.tag.inline entity"
                },
                {
                    "foreground": "e18964",
                    "token": "entity.name.tag.namespace"
                },
                {
                    "foreground": "e18964",
                    "token": "entity.other.attribute-name.namespace"
                },
                {
                    "foreground": "cda869",
                    "token": "meta.selector.css entity.name.tag"
                },
                {
                    "foreground": "8f9d6a",
                    "token": "meta.selector.css entity.other.attribute-name.tag.pseudo-class"
                },
                {
                    "foreground": "8b98ab",
                    "token": "meta.selector.css entity.other.attribute-name.id"
                },
                {
                    "foreground": "9b703f",
                    "token": "meta.selector.css entity.other.attribute-name.class"
                },
                {
                    "foreground": "c5af75",
                    "token": "support.type.property-name.css"
                },
                {
                    "foreground": "f9ee98",
                    "token": "meta.property-group support.constant.property-value.css"
                },
                {
                    "foreground": "f9ee98",
                    "token": "meta.property-value support.constant.property-value.css"
                },
                {
                    "foreground": "8693a5",
                    "token": "meta.preprocessor.at-rule keyword.control.at-rule"
                },
                {
                    "foreground": "dd7b3b",
                    "token": "meta.property-value support.constant.named-color.css"
                },
                {
                    "foreground": "dd7b3b",
                    "token": "meta.property-value constant"
                },
                {
                    "foreground": "8f9d6a",
                    "token": "meta.constructor.argument.css"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "0e2231",
                    "fontStyle": "italic",
                    "token": "meta.diff"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "0e2231",
                    "fontStyle": "italic",
                    "token": "meta.diff.header"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "420e09",
                    "token": "markup.deleted"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "4a410d",
                    "token": "markup.changed"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "253b22",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "e9c062",
                    "fontStyle": "italic",
                    "token": "markup.italic"
                },
                {
                    "foreground": "e9c062",
                    "fontStyle": "bold",
                    "token": "markup.bold"
                },
                {
                    "foreground": "e18964",
                    "fontStyle": "underline",
                    "token": "markup.underline"
                },
                {
                    "foreground": "e1d4b9",
                    "background": "fee09c12",
                    "fontStyle": "italic",
                    "token": "markup.quote"
                },
                {
                    "foreground": "fedcc5",
                    "background": "632d04",
                    "token": "markup.heading"
                },
                {
                    "foreground": "fedcc5",
                    "background": "632d04",
                    "token": "markup.heading entity"
                },
                {
                    "foreground": "e1d4b9",
                    "token": "markup.list"
                },
                {
                    "foreground": "578bb3",
                    "background": "b1b3ba08",
                    "token": "markup.raw"
                },
                {
                    "foreground": "f67b37",
                    "fontStyle": "italic",
                    "token": "markup comment"
                },
                {
                    "foreground": "60a633",
                    "background": "242424",
                    "token": "meta.separator"
                },
                {
                    "background": "eeeeee29",
                    "token": "meta.line.entry.logfile"
                },
                {
                    "background": "eeeeee29",
                    "token": "meta.line.exit.logfile"
                },
                {
                    "background": "751012",
                    "token": "meta.line.error.logfile"
                }
            ],
            "colors": {
                "editor.foreground": "#F8F8F8",
                "editor.background": "#000000",
                "editor.selectionBackground": "#DDF0FF33",
                "editor.lineHighlightBackground": "#FFFFFF0D",
                "editorCursor.foreground": "#A7A7A7",
                "editorWhitespace.foreground": "#CAE2FB3D"
            }
        },
        id: "sunburst"
    },
    {
        name: "Textmate (Mac Classic)",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [
                {
                    "background": "FFFFFF",
                    "token": ""
                },
                {
                    "foreground": "0066ff",
                    "fontStyle": "italic",
                    "token": "comment"
                },
                {
                    "foreground": "bfbfbf",
                    "token": "deco.folding"
                },
                {
                    "foreground": "0000ff",
                    "fontStyle": "bold",
                    "token": "keyword"
                },
                {
                    "foreground": "0000ff",
                    "fontStyle": "bold",
                    "token": "storage"
                },
                {
                    "foreground": "0000cd",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "c5060b",
                    "fontStyle": "bold",
                    "token": "constant"
                },
                {
                    "foreground": "585cf6",
                    "fontStyle": "bold",
                    "token": "constant.language"
                },
                {
                    "foreground": "318495",
                    "token": "variable.language"
                },
                {
                    "foreground": "318495",
                    "token": "variable.other"
                },
                {
                    "foreground": "036a07",
                    "token": "string"
                },
                {
                    "foreground": "26b31a",
                    "token": "constant.character.escape"
                },
                {
                    "foreground": "26b31a",
                    "token": "string meta.embedded"
                },
                {
                    "foreground": "1a921c",
                    "token": "meta.preprocessor"
                },
                {
                    "foreground": "0c450d",
                    "fontStyle": "bold",
                    "token": "keyword.control.import"
                },
                {
                    "foreground": "0000a2",
                    "fontStyle": "bold",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "0000a2",
                    "fontStyle": "bold",
                    "token": "support.function.any-method"
                },
                {
                    "fontStyle": "underline",
                    "token": "entity.name.type"
                },
                {
                    "fontStyle": "italic",
                    "token": "entity.other.inherited-class"
                },
                {
                    "fontStyle": "italic",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "70727e",
                    "token": "storage.type.method"
                },
                {
                    "fontStyle": "italic",
                    "token": "meta.section entity.name.section"
                },
                {
                    "fontStyle": "italic",
                    "token": "declaration.section entity.name.section"
                },
                {
                    "foreground": "3c4c72",
                    "fontStyle": "bold",
                    "token": "support.function"
                },
                {
                    "foreground": "6d79de",
                    "fontStyle": "bold",
                    "token": "support.class"
                },
                {
                    "foreground": "6d79de",
                    "fontStyle": "bold",
                    "token": "support.type"
                },
                {
                    "foreground": "06960e",
                    "fontStyle": "bold",
                    "token": "support.constant"
                },
                {
                    "foreground": "21439c",
                    "fontStyle": "bold",
                    "token": "support.variable"
                },
                {
                    "foreground": "687687",
                    "token": "keyword.operator.js"
                },
                {
                    "foreground": "ffffff",
                    "background": "990000",
                    "token": "invalid"
                },
                {
                    "background": "ffd0d0",
                    "token": "invalid.deprecated.trailing-whitespace"
                },
                {
                    "background": "0000000d",
                    "token": "text source"
                },
                {
                    "background": "0000000d",
                    "token": "string.unquoted"
                },
                {
                    "background": "0000000d",
                    "token": "meta.embedded"
                },
                {
                    "background": "0000000f",
                    "token": "text source string.unquoted"
                },
                {
                    "background": "0000000f",
                    "token": "text source text source"
                },
                {
                    "foreground": "68685b",
                    "token": "meta.tag.preprocessor.xml"
                },
                {
                    "foreground": "888888",
                    "token": "meta.tag.metadata.doctype"
                },
                {
                    "foreground": "888888",
                    "token": "meta.tag.metadata.doctype entity"
                },
                {
                    "foreground": "888888",
                    "token": "meta.tag.metadata.doctype string"
                },
                {
                    "foreground": "888888",
                    "token": "meta.tag.metadata.processing.xml"
                },
                {
                    "foreground": "888888",
                    "token": "meta.tag.metadata.processing.xml entity"
                },
                {
                    "foreground": "888888",
                    "token": "meta.tag.metadata.processing.xml string"
                },
                {
                    "fontStyle": "italic",
                    "token": "meta.tag.metadata.doctype string.quoted"
                },
                {
                    "foreground": "1c02ff",
                    "token": "meta.tag"
                },
                {
                    "foreground": "1c02ff",
                    "token": "declaration.tag"
                },
                {
                    "fontStyle": "bold",
                    "token": "entity.name.tag"
                },
                {
                    "fontStyle": "italic",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "0c07ff",
                    "fontStyle": "bold",
                    "token": "markup.heading"
                },
                {
                    "foreground": "000000",
                    "fontStyle": "italic",
                    "token": "markup.quote"
                },
                {
                    "foreground": "b90690",
                    "token": "markup.list"
                }
            ],
            "colors": {
                "editor.foreground": "#000000",
                "editor.background": "#FFFFFF",
                "editor.selectionBackground": "#4D97FF54",
                "editor.lineHighlightBackground": "#00000012",
                "editorCursor.foreground": "#000000",
                "editorWhitespace.foreground": "#BFBFBF"
            }
        },
        id: "textmate--mac-classic-"
    },
    {
        name: "Tomorrow-Night-Blue",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "002451",
                    "token": ""
                },
                {
                    "foreground": "7285b7",
                    "token": "comment"
                },
                {
                    "foreground": "ffffff",
                    "token": "keyword.operator.class"
                },
                {
                    "foreground": "ffffff",
                    "token": "keyword.operator"
                },
                {
                    "foreground": "ffffff",
                    "token": "constant.other"
                },
                {
                    "foreground": "ffffff",
                    "token": "source.php.embedded.line"
                },
                {
                    "foreground": "ff9da4",
                    "token": "variable"
                },
                {
                    "foreground": "ff9da4",
                    "token": "support.other.variable"
                },
                {
                    "foreground": "ff9da4",
                    "token": "string.other.link"
                },
                {
                    "foreground": "ff9da4",
                    "token": "string.regexp"
                },
                {
                    "foreground": "ff9da4",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "ff9da4",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "ff9da4",
                    "token": "meta.tag"
                },
                {
                    "foreground": "ff9da4",
                    "token": "declaration.tag"
                },
                {
                    "foreground": "ff9da4",
                    "token": "markup.deleted.git_gutter"
                },
                {
                    "foreground": "ffc58f",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "ffc58f",
                    "token": "constant.language"
                },
                {
                    "foreground": "ffc58f",
                    "token": "support.constant"
                },
                {
                    "foreground": "ffc58f",
                    "token": "constant.character"
                },
                {
                    "foreground": "ffc58f",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "ffc58f",
                    "token": "punctuation.section.embedded"
                },
                {
                    "foreground": "ffc58f",
                    "token": "keyword.other.unit"
                },
                {
                    "foreground": "ffeead",
                    "token": "entity.name.class"
                },
                {
                    "foreground": "ffeead",
                    "token": "entity.name.type.class"
                },
                {
                    "foreground": "ffeead",
                    "token": "support.type"
                },
                {
                    "foreground": "ffeead",
                    "token": "support.class"
                },
                {
                    "foreground": "d1f1a9",
                    "token": "string"
                },
                {
                    "foreground": "d1f1a9",
                    "token": "constant.other.symbol"
                },
                {
                    "foreground": "d1f1a9",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "d1f1a9",
                    "token": "markup.heading"
                },
                {
                    "foreground": "d1f1a9",
                    "token": "markup.inserted.git_gutter"
                },
                {
                    "foreground": "99ffff",
                    "token": "keyword.operator"
                },
                {
                    "foreground": "99ffff",
                    "token": "constant.other.color"
                },
                {
                    "foreground": "bbdaff",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "bbdaff",
                    "token": "meta.function-call"
                },
                {
                    "foreground": "bbdaff",
                    "token": "support.function"
                },
                {
                    "foreground": "bbdaff",
                    "token": "keyword.other.special-method"
                },
                {
                    "foreground": "bbdaff",
                    "token": "meta.block-level"
                },
                {
                    "foreground": "bbdaff",
                    "token": "markup.changed.git_gutter"
                },
                {
                    "foreground": "ebbbff",
                    "token": "keyword"
                },
                {
                    "foreground": "ebbbff",
                    "token": "storage"
                },
                {
                    "foreground": "ebbbff",
                    "token": "storage.type"
                },
                {
                    "foreground": "ebbbff",
                    "token": "entity.name.tag.css"
                },
                {
                    "foreground": "ffffff",
                    "background": "f99da5",
                    "token": "invalid"
                },
                {
                    "foreground": "ffffff",
                    "background": "bbdafe",
                    "token": "meta.separator"
                },
                {
                    "foreground": "ffffff",
                    "background": "ebbbff",
                    "token": "invalid.deprecated"
                },
                {
                    "foreground": "ffffff",
                    "token": "markup.inserted.diff"
                },
                {
                    "foreground": "ffffff",
                    "token": "markup.deleted.diff"
                },
                {
                    "foreground": "ffffff",
                    "token": "meta.diff.header.to-file"
                },
                {
                    "foreground": "ffffff",
                    "token": "meta.diff.header.from-file"
                },
                {
                    "foreground": "718c00",
                    "token": "markup.inserted.diff"
                },
                {
                    "foreground": "718c00",
                    "token": "meta.diff.header.to-file"
                },
                {
                    "foreground": "c82829",
                    "token": "markup.deleted.diff"
                },
                {
                    "foreground": "c82829",
                    "token": "meta.diff.header.from-file"
                },
                {
                    "foreground": "ffffff",
                    "background": "4271ae",
                    "token": "meta.diff.header.from-file"
                },
                {
                    "foreground": "ffffff",
                    "background": "4271ae",
                    "token": "meta.diff.header.to-file"
                },
                {
                    "foreground": "3e999f",
                    "fontStyle": "italic",
                    "token": "meta.diff.range"
                }
            ],
            "colors": {
                "editor.foreground": "#FFFFFF",
                "editor.background": "#002451",
                "editor.selectionBackground": "#003F8E",
                "editor.lineHighlightBackground": "#00346E",
                "editorCursor.foreground": "#FFFFFF",
                "editorWhitespace.foreground": "#404F7D"
            }
        },
        id: "tomorrow-night-blue"
    },
    {
        name: "Tomorrow-Night-Bright",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "000000",
                    "token": ""
                },
                {
                    "foreground": "969896",
                    "token": "comment"
                },
                {
                    "foreground": "eeeeee",
                    "token": "keyword.operator.class"
                },
                {
                    "foreground": "eeeeee",
                    "token": "constant.other"
                },
                {
                    "foreground": "eeeeee",
                    "token": "source.php.embedded.line"
                },
                {
                    "foreground": "d54e53",
                    "token": "variable"
                },
                {
                    "foreground": "d54e53",
                    "token": "support.other.variable"
                },
                {
                    "foreground": "d54e53",
                    "token": "string.other.link"
                },
                {
                    "foreground": "d54e53",
                    "token": "string.regexp"
                },
                {
                    "foreground": "d54e53",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "d54e53",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "d54e53",
                    "token": "meta.tag"
                },
                {
                    "foreground": "d54e53",
                    "token": "declaration.tag"
                },
                {
                    "foreground": "d54e53",
                    "token": "markup.deleted.git_gutter"
                },
                {
                    "foreground": "e78c45",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "e78c45",
                    "token": "constant.language"
                },
                {
                    "foreground": "e78c45",
                    "token": "support.constant"
                },
                {
                    "foreground": "e78c45",
                    "token": "constant.character"
                },
                {
                    "foreground": "e78c45",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "e78c45",
                    "token": "punctuation.section.embedded"
                },
                {
                    "foreground": "e78c45",
                    "token": "keyword.other.unit"
                },
                {
                    "foreground": "e7c547",
                    "token": "entity.name.class"
                },
                {
                    "foreground": "e7c547",
                    "token": "entity.name.type.class"
                },
                {
                    "foreground": "e7c547",
                    "token": "support.type"
                },
                {
                    "foreground": "e7c547",
                    "token": "support.class"
                },
                {
                    "foreground": "b9ca4a",
                    "token": "string"
                },
                {
                    "foreground": "b9ca4a",
                    "token": "constant.other.symbol"
                },
                {
                    "foreground": "b9ca4a",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "b9ca4a",
                    "token": "markup.heading"
                },
                {
                    "foreground": "b9ca4a",
                    "token": "markup.inserted.git_gutter"
                },
                {
                    "foreground": "70c0b1",
                    "token": "keyword.operator"
                },
                {
                    "foreground": "70c0b1",
                    "token": "constant.other.color"
                },
                {
                    "foreground": "7aa6da",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "7aa6da",
                    "token": "meta.function-call"
                },
                {
                    "foreground": "7aa6da",
                    "token": "support.function"
                },
                {
                    "foreground": "7aa6da",
                    "token": "keyword.other.special-method"
                },
                {
                    "foreground": "7aa6da",
                    "token": "meta.block-level"
                },
                {
                    "foreground": "7aa6da",
                    "token": "markup.changed.git_gutter"
                },
                {
                    "foreground": "c397d8",
                    "token": "keyword"
                },
                {
                    "foreground": "c397d8",
                    "token": "storage"
                },
                {
                    "foreground": "c397d8",
                    "token": "storage.type"
                },
                {
                    "foreground": "c397d8",
                    "token": "entity.name.tag.css"
                },
                {
                    "foreground": "ced2cf",
                    "background": "df5f5f",
                    "token": "invalid"
                },
                {
                    "foreground": "ced2cf",
                    "background": "82a3bf",
                    "token": "meta.separator"
                },
                {
                    "foreground": "ced2cf",
                    "background": "b798bf",
                    "token": "invalid.deprecated"
                },
                {
                    "foreground": "ffffff",
                    "token": "markup.inserted.diff"
                },
                {
                    "foreground": "ffffff",
                    "token": "markup.deleted.diff"
                },
                {
                    "foreground": "ffffff",
                    "token": "meta.diff.header.to-file"
                },
                {
                    "foreground": "ffffff",
                    "token": "meta.diff.header.from-file"
                },
                {
                    "foreground": "718c00",
                    "token": "markup.inserted.diff"
                },
                {
                    "foreground": "718c00",
                    "token": "meta.diff.header.to-file"
                },
                {
                    "foreground": "c82829",
                    "token": "markup.deleted.diff"
                },
                {
                    "foreground": "c82829",
                    "token": "meta.diff.header.from-file"
                },
                {
                    "foreground": "ffffff",
                    "background": "4271ae",
                    "token": "meta.diff.header.from-file"
                },
                {
                    "foreground": "ffffff",
                    "background": "4271ae",
                    "token": "meta.diff.header.to-file"
                },
                {
                    "foreground": "3e999f",
                    "fontStyle": "italic",
                    "token": "meta.diff.range"
                }
            ],
            "colors": {
                "editor.foreground": "#DEDEDE",
                "editor.background": "#000000",
                "editor.selectionBackground": "#424242",
                "editor.lineHighlightBackground": "#2A2A2A",
                "editorCursor.foreground": "#9F9F9F",
                "editorWhitespace.foreground": "#343434"
            }
        },
        id: "tomorrow-night-bright"
    },
    {
        name: "Tomorrow-Night-Eighties",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "2D2D2D",
                    "token": ""
                },
                {
                    "foreground": "999999",
                    "token": "comment"
                },
                {
                    "foreground": "cccccc",
                    "token": "keyword.operator.class"
                },
                {
                    "foreground": "cccccc",
                    "token": "constant.other"
                },
                {
                    "foreground": "cccccc",
                    "token": "source.php.embedded.line"
                },
                {
                    "foreground": "f2777a",
                    "token": "variable"
                },
                {
                    "foreground": "f2777a",
                    "token": "support.other.variable"
                },
                {
                    "foreground": "f2777a",
                    "token": "string.other.link"
                },
                {
                    "foreground": "f2777a",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "f2777a",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "f2777a",
                    "token": "meta.tag"
                },
                {
                    "foreground": "f2777a",
                    "token": "declaration.tag"
                },
                {
                    "foreground": "f2777a",
                    "token": "markup.deleted.git_gutter"
                },
                {
                    "foreground": "f99157",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "f99157",
                    "token": "constant.language"
                },
                {
                    "foreground": "f99157",
                    "token": "support.constant"
                },
                {
                    "foreground": "f99157",
                    "token": "constant.character"
                },
                {
                    "foreground": "f99157",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "f99157",
                    "token": "punctuation.section.embedded"
                },
                {
                    "foreground": "f99157",
                    "token": "keyword.other.unit"
                },
                {
                    "foreground": "ffcc66",
                    "token": "entity.name.class"
                },
                {
                    "foreground": "ffcc66",
                    "token": "entity.name.type.class"
                },
                {
                    "foreground": "ffcc66",
                    "token": "support.type"
                },
                {
                    "foreground": "ffcc66",
                    "token": "support.class"
                },
                {
                    "foreground": "99cc99",
                    "token": "string"
                },
                {
                    "foreground": "99cc99",
                    "token": "constant.other.symbol"
                },
                {
                    "foreground": "99cc99",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "99cc99",
                    "token": "markup.heading"
                },
                {
                    "foreground": "99cc99",
                    "token": "markup.inserted.git_gutter"
                },
                {
                    "foreground": "66cccc",
                    "token": "keyword.operator"
                },
                {
                    "foreground": "66cccc",
                    "token": "constant.other.color"
                },
                {
                    "foreground": "6699cc",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "6699cc",
                    "token": "meta.function-call"
                },
                {
                    "foreground": "6699cc",
                    "token": "support.function"
                },
                {
                    "foreground": "6699cc",
                    "token": "keyword.other.special-method"
                },
                {
                    "foreground": "6699cc",
                    "token": "meta.block-level"
                },
                {
                    "foreground": "6699cc",
                    "token": "markup.changed.git_gutter"
                },
                {
                    "foreground": "cc99cc",
                    "token": "keyword"
                },
                {
                    "foreground": "cc99cc",
                    "token": "storage"
                },
                {
                    "foreground": "cc99cc",
                    "token": "storage.type"
                },
                {
                    "foreground": "cc99cc",
                    "token": "entity.name.tag.css"
                },
                {
                    "foreground": "cdcdcd",
                    "background": "f2777a",
                    "token": "invalid"
                },
                {
                    "foreground": "cdcdcd",
                    "background": "99cccc",
                    "token": "meta.separator"
                },
                {
                    "foreground": "cdcdcd",
                    "background": "cc99cc",
                    "token": "invalid.deprecated"
                },
                {
                    "foreground": "ffffff",
                    "token": "markup.inserted.diff"
                },
                {
                    "foreground": "ffffff",
                    "token": "markup.deleted.diff"
                },
                {
                    "foreground": "ffffff",
                    "token": "meta.diff.header.to-file"
                },
                {
                    "foreground": "ffffff",
                    "token": "meta.diff.header.from-file"
                },
                {
                    "foreground": "718c00",
                    "token": "markup.inserted.diff"
                },
                {
                    "foreground": "718c00",
                    "token": "meta.diff.header.to-file"
                },
                {
                    "foreground": "c82829",
                    "token": "markup.deleted.diff"
                },
                {
                    "foreground": "c82829",
                    "token": "meta.diff.header.from-file"
                },
                {
                    "foreground": "ffffff",
                    "background": "4271ae",
                    "token": "meta.diff.header.from-file"
                },
                {
                    "foreground": "ffffff",
                    "background": "4271ae",
                    "token": "meta.diff.header.to-file"
                },
                {
                    "foreground": "3e999f",
                    "fontStyle": "italic",
                    "token": "meta.diff.range"
                }
            ],
            "colors": {
                "editor.foreground": "#CCCCCC",
                "editor.background": "#2D2D2D",
                "editor.selectionBackground": "#515151",
                "editor.lineHighlightBackground": "#393939",
                "editorCursor.foreground": "#CCCCCC",
                "editorWhitespace.foreground": "#6A6A6A"
            }
        },
        id: "tomorrow-night-eighties"
    },
    {
        name: "Tomorrow-Night",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "1D1F21",
                    "token": ""
                },
                {
                    "foreground": "969896",
                    "token": "comment"
                },
                {
                    "foreground": "ced1cf",
                    "token": "keyword.operator.class"
                },
                {
                    "foreground": "ced1cf",
                    "token": "constant.other"
                },
                {
                    "foreground": "ced1cf",
                    "token": "source.php.embedded.line"
                },
                {
                    "foreground": "cc6666",
                    "token": "variable"
                },
                {
                    "foreground": "cc6666",
                    "token": "support.other.variable"
                },
                {
                    "foreground": "cc6666",
                    "token": "string.other.link"
                },
                {
                    "foreground": "cc6666",
                    "token": "string.regexp"
                },
                {
                    "foreground": "cc6666",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "cc6666",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "cc6666",
                    "token": "meta.tag"
                },
                {
                    "foreground": "cc6666",
                    "token": "declaration.tag"
                },
                {
                    "foreground": "cc6666",
                    "token": "markup.deleted.git_gutter"
                },
                {
                    "foreground": "de935f",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "de935f",
                    "token": "constant.language"
                },
                {
                    "foreground": "de935f",
                    "token": "support.constant"
                },
                {
                    "foreground": "de935f",
                    "token": "constant.character"
                },
                {
                    "foreground": "de935f",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "de935f",
                    "token": "punctuation.section.embedded"
                },
                {
                    "foreground": "de935f",
                    "token": "keyword.other.unit"
                },
                {
                    "foreground": "f0c674",
                    "token": "entity.name.class"
                },
                {
                    "foreground": "f0c674",
                    "token": "entity.name.type.class"
                },
                {
                    "foreground": "f0c674",
                    "token": "support.type"
                },
                {
                    "foreground": "f0c674",
                    "token": "support.class"
                },
                {
                    "foreground": "b5bd68",
                    "token": "string"
                },
                {
                    "foreground": "b5bd68",
                    "token": "constant.other.symbol"
                },
                {
                    "foreground": "b5bd68",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "b5bd68",
                    "token": "markup.heading"
                },
                {
                    "foreground": "b5bd68",
                    "token": "markup.inserted.git_gutter"
                },
                {
                    "foreground": "8abeb7",
                    "token": "keyword.operator"
                },
                {
                    "foreground": "8abeb7",
                    "token": "constant.other.color"
                },
                {
                    "foreground": "81a2be",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "81a2be",
                    "token": "meta.function-call"
                },
                {
                    "foreground": "81a2be",
                    "token": "support.function"
                },
                {
                    "foreground": "81a2be",
                    "token": "keyword.other.special-method"
                },
                {
                    "foreground": "81a2be",
                    "token": "meta.block-level"
                },
                {
                    "foreground": "81a2be",
                    "token": "markup.changed.git_gutter"
                },
                {
                    "foreground": "b294bb",
                    "token": "keyword"
                },
                {
                    "foreground": "b294bb",
                    "token": "storage"
                },
                {
                    "foreground": "b294bb",
                    "token": "storage.type"
                },
                {
                    "foreground": "b294bb",
                    "token": "entity.name.tag.css"
                },
                {
                    "foreground": "ced2cf",
                    "background": "df5f5f",
                    "token": "invalid"
                },
                {
                    "foreground": "ced2cf",
                    "background": "82a3bf",
                    "token": "meta.separator"
                },
                {
                    "foreground": "ced2cf",
                    "background": "b798bf",
                    "token": "invalid.deprecated"
                },
                {
                    "foreground": "ffffff",
                    "token": "markup.inserted.diff"
                },
                {
                    "foreground": "ffffff",
                    "token": "markup.deleted.diff"
                },
                {
                    "foreground": "ffffff",
                    "token": "meta.diff.header.to-file"
                },
                {
                    "foreground": "ffffff",
                    "token": "meta.diff.header.from-file"
                },
                {
                    "foreground": "718c00",
                    "token": "markup.inserted.diff"
                },
                {
                    "foreground": "718c00",
                    "token": "meta.diff.header.to-file"
                },
                {
                    "foreground": "c82829",
                    "token": "markup.deleted.diff"
                },
                {
                    "foreground": "c82829",
                    "token": "meta.diff.header.from-file"
                },
                {
                    "foreground": "ffffff",
                    "background": "4271ae",
                    "token": "meta.diff.header.from-file"
                },
                {
                    "foreground": "ffffff",
                    "background": "4271ae",
                    "token": "meta.diff.header.to-file"
                },
                {
                    "foreground": "3e999f",
                    "fontStyle": "italic",
                    "token": "meta.diff.range"
                }
            ],
            "colors": {
                "editor.foreground": "#C5C8C6",
                "editor.background": "#1D1F21",
                "editor.selectionBackground": "#373B41",
                "editor.lineHighlightBackground": "#282A2E",
                "editorCursor.foreground": "#AEAFAD",
                "editorWhitespace.foreground": "#4B4E55"
            }
        },
        id: "tomorrow-night"
    },
    {
        name: "Tomorrow",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [
                {
                    "background": "FFFFFF",
                    "token": ""
                },
                {
                    "foreground": "8e908c",
                    "token": "comment"
                },
                {
                    "foreground": "666969",
                    "token": "keyword.operator.class"
                },
                {
                    "foreground": "666969",
                    "token": "constant.other"
                },
                {
                    "foreground": "666969",
                    "token": "source.php.embedded.line"
                },
                {
                    "foreground": "c82829",
                    "token": "variable"
                },
                {
                    "foreground": "c82829",
                    "token": "support.other.variable"
                },
                {
                    "foreground": "c82829",
                    "token": "string.other.link"
                },
                {
                    "foreground": "c82829",
                    "token": "string.regexp"
                },
                {
                    "foreground": "c82829",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "c82829",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "c82829",
                    "token": "meta.tag"
                },
                {
                    "foreground": "c82829",
                    "token": "declaration.tag"
                },
                {
                    "foreground": "c82829",
                    "token": "markup.deleted.git_gutter"
                },
                {
                    "foreground": "f5871f",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "f5871f",
                    "token": "constant.language"
                },
                {
                    "foreground": "f5871f",
                    "token": "support.constant"
                },
                {
                    "foreground": "f5871f",
                    "token": "constant.character"
                },
                {
                    "foreground": "f5871f",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "f5871f",
                    "token": "punctuation.section.embedded"
                },
                {
                    "foreground": "f5871f",
                    "token": "keyword.other.unit"
                },
                {
                    "foreground": "c99e00",
                    "token": "entity.name.class"
                },
                {
                    "foreground": "c99e00",
                    "token": "entity.name.type.class"
                },
                {
                    "foreground": "c99e00",
                    "token": "support.type"
                },
                {
                    "foreground": "c99e00",
                    "token": "support.class"
                },
                {
                    "foreground": "718c00",
                    "token": "string"
                },
                {
                    "foreground": "718c00",
                    "token": "constant.other.symbol"
                },
                {
                    "foreground": "718c00",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "718c00",
                    "token": "markup.heading"
                },
                {
                    "foreground": "718c00",
                    "token": "markup.inserted.git_gutter"
                },
                {
                    "foreground": "3e999f",
                    "token": "keyword.operator"
                },
                {
                    "foreground": "3e999f",
                    "token": "constant.other.color"
                },
                {
                    "foreground": "4271ae",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "4271ae",
                    "token": "meta.function-call"
                },
                {
                    "foreground": "4271ae",
                    "token": "support.function"
                },
                {
                    "foreground": "4271ae",
                    "token": "keyword.other.special-method"
                },
                {
                    "foreground": "4271ae",
                    "token": "meta.block-level"
                },
                {
                    "foreground": "4271ae",
                    "token": "markup.changed.git_gutter"
                },
                {
                    "foreground": "8959a8",
                    "token": "keyword"
                },
                {
                    "foreground": "8959a8",
                    "token": "storage"
                },
                {
                    "foreground": "8959a8",
                    "token": "storage.type"
                },
                {
                    "foreground": "ffffff",
                    "background": "c82829",
                    "token": "invalid"
                },
                {
                    "foreground": "ffffff",
                    "background": "4271ae",
                    "token": "meta.separator"
                },
                {
                    "foreground": "ffffff",
                    "background": "8959a8",
                    "token": "invalid.deprecated"
                },
                {
                    "foreground": "ffffff",
                    "token": "markup.inserted.diff"
                },
                {
                    "foreground": "ffffff",
                    "token": "markup.deleted.diff"
                },
                {
                    "foreground": "ffffff",
                    "token": "meta.diff.header.to-file"
                },
                {
                    "foreground": "ffffff",
                    "token": "meta.diff.header.from-file"
                },
                {
                    "background": "718c00",
                    "token": "markup.inserted.diff"
                },
                {
                    "background": "718c00",
                    "token": "meta.diff.header.to-file"
                },
                {
                    "background": "c82829",
                    "token": "markup.deleted.diff"
                },
                {
                    "background": "c82829",
                    "token": "meta.diff.header.from-file"
                },
                {
                    "foreground": "ffffff",
                    "background": "4271ae",
                    "token": "meta.diff.header.from-file"
                },
                {
                    "foreground": "ffffff",
                    "background": "4271ae",
                    "token": "meta.diff.header.to-file"
                },
                {
                    "foreground": "3e999f",
                    "fontStyle": "italic",
                    "token": "meta.diff.range"
                }
            ],
            "colors": {
                "editor.foreground": "#4D4D4C",
                "editor.background": "#FFFFFF",
                "editor.selectionBackground": "#D6D6D6",
                "editor.lineHighlightBackground": "#EFEFEF",
                "editorCursor.foreground": "#AEAFAD",
                "editorWhitespace.foreground": "#D1D1D1"
            }
        },
        id: "tomorrow"
    },
    {
        name: "Twilight",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "141414",
                    "token": ""
                },
                {
                    "foreground": "5f5a60",
                    "fontStyle": "italic",
                    "token": "comment"
                },
                {
                    "foreground": "cf6a4c",
                    "token": "constant"
                },
                {
                    "foreground": "9b703f",
                    "token": "entity"
                },
                {
                    "foreground": "cda869",
                    "token": "keyword"
                },
                {
                    "foreground": "f9ee98",
                    "token": "storage"
                },
                {
                    "foreground": "8f9d6a",
                    "token": "string"
                },
                {
                    "foreground": "9b859d",
                    "token": "support"
                },
                {
                    "foreground": "7587a6",
                    "token": "variable"
                },
                {
                    "foreground": "d2a8a1",
                    "fontStyle": "italic underline",
                    "token": "invalid.deprecated"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "562d56bf",
                    "token": "invalid.illegal"
                },
                {
                    "background": "b0b3ba14",
                    "token": "text source"
                },
                {
                    "background": "b1b3ba21",
                    "token": "text.html.ruby source"
                },
                {
                    "foreground": "9b5c2e",
                    "fontStyle": "italic",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "daefa3",
                    "token": "string source"
                },
                {
                    "foreground": "ddf2a4",
                    "token": "string constant"
                },
                {
                    "foreground": "e9c062",
                    "token": "string.regexp"
                },
                {
                    "foreground": "cf7d34",
                    "token": "string.regexp constant.character.escape"
                },
                {
                    "foreground": "cf7d34",
                    "token": "string.regexp source.ruby.embedded"
                },
                {
                    "foreground": "cf7d34",
                    "token": "string.regexp string.regexp.arbitrary-repitition"
                },
                {
                    "foreground": "8a9a95",
                    "token": "string variable"
                },
                {
                    "foreground": "dad085",
                    "token": "support.function"
                },
                {
                    "foreground": "cf6a4c",
                    "token": "support.constant"
                },
                {
                    "foreground": "8996a8",
                    "token": "meta.preprocessor.c"
                },
                {
                    "foreground": "afc4db",
                    "token": "meta.preprocessor.c keyword"
                },
                {
                    "foreground": "494949",
                    "token": "meta.tag.sgml.doctype"
                },
                {
                    "foreground": "494949",
                    "token": "meta.tag.sgml.doctype entity"
                },
                {
                    "foreground": "494949",
                    "token": "meta.tag.sgml.doctype string"
                },
                {
                    "foreground": "494949",
                    "token": "meta.tag.preprocessor.xml"
                },
                {
                    "foreground": "494949",
                    "token": "meta.tag.preprocessor.xml entity"
                },
                {
                    "foreground": "494949",
                    "token": "meta.tag.preprocessor.xml string"
                },
                {
                    "foreground": "ac885b",
                    "token": "declaration.tag"
                },
                {
                    "foreground": "ac885b",
                    "token": "declaration.tag entity"
                },
                {
                    "foreground": "ac885b",
                    "token": "meta.tag"
                },
                {
                    "foreground": "ac885b",
                    "token": "meta.tag entity"
                },
                {
                    "foreground": "e0c589",
                    "token": "declaration.tag.inline"
                },
                {
                    "foreground": "e0c589",
                    "token": "declaration.tag.inline entity"
                },
                {
                    "foreground": "e0c589",
                    "token": "source entity.name.tag"
                },
                {
                    "foreground": "e0c589",
                    "token": "source entity.other.attribute-name"
                },
                {
                    "foreground": "e0c589",
                    "token": "meta.tag.inline"
                },
                {
                    "foreground": "e0c589",
                    "token": "meta.tag.inline entity"
                },
                {
                    "foreground": "cda869",
                    "token": "meta.selector.css entity.name.tag"
                },
                {
                    "foreground": "8f9d6a",
                    "token": "meta.selector.css entity.other.attribute-name.tag.pseudo-class"
                },
                {
                    "foreground": "8b98ab",
                    "token": "meta.selector.css entity.other.attribute-name.id"
                },
                {
                    "foreground": "9b703f",
                    "token": "meta.selector.css entity.other.attribute-name.class"
                },
                {
                    "foreground": "c5af75",
                    "token": "support.type.property-name.css"
                },
                {
                    "foreground": "f9ee98",
                    "token": "meta.property-group support.constant.property-value.css"
                },
                {
                    "foreground": "f9ee98",
                    "token": "meta.property-value support.constant.property-value.css"
                },
                {
                    "foreground": "8693a5",
                    "token": "meta.preprocessor.at-rule keyword.control.at-rule"
                },
                {
                    "foreground": "ca7840",
                    "token": "meta.property-value support.constant.named-color.css"
                },
                {
                    "foreground": "ca7840",
                    "token": "meta.property-value constant"
                },
                {
                    "foreground": "8f9d6a",
                    "token": "meta.constructor.argument.css"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "0e2231",
                    "fontStyle": "italic",
                    "token": "meta.diff"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "0e2231",
                    "fontStyle": "italic",
                    "token": "meta.diff.header"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "0e2231",
                    "fontStyle": "italic",
                    "token": "meta.separator"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "420e09",
                    "token": "markup.deleted"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "4a410d",
                    "token": "markup.changed"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "253b22",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "f9ee98",
                    "token": "markup.list"
                },
                {
                    "foreground": "cf6a4c",
                    "token": "markup.heading"
                }
            ],
            "colors": {
                "editor.foreground": "#F8F8F8",
                "editor.background": "#141414",
                "editor.selectionBackground": "#DDF0FF33",
                "editor.lineHighlightBackground": "#FFFFFF08",
                "editorCursor.foreground": "#A7A7A7",
                "editorWhitespace.foreground": "#FFFFFF40"
            }
        },
        id: "twilight"
    },
    {
        name: "Upstream Sunburst",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "000000F7",
                    "token": ""
                },
                {
                    "foreground": "3d3d3d",
                    "fontStyle": "italic",
                    "token": "comment"
                },
                {
                    "foreground": "259adb",
                    "token": "constant"
                },
                {
                    "foreground": "b2d72c",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "89725b",
                    "token": "keyword"
                },
                {
                    "foreground": "89725b",
                    "token": "keyword.control"
                },
                {
                    "foreground": "ffffff",
                    "token": "keyword.operator"
                },
                {
                    "foreground": "89725b",
                    "token": "storage"
                },
                {
                    "foreground": "b2d72c",
                    "token": "string"
                },
                {
                    "foreground": "9b859d",
                    "token": "support"
                },
                {
                    "foreground": "259adb",
                    "token": "variable"
                },
                {
                    "foreground": "fd5ff1",
                    "fontStyle": "italic underline",
                    "token": "invalid.deprecated"
                },
                {
                    "foreground": "fd5ff1",
                    "background": "562d56bf",
                    "token": "invalid.illegal"
                },
                {
                    "background": "b1b3ba08",
                    "token": "text source"
                },
                {
                    "foreground": "9b5c2e",
                    "fontStyle": "italic",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "daefa3",
                    "token": "string.quoted source"
                },
                {
                    "foreground": "ddf2a4",
                    "token": "string constant"
                },
                {
                    "foreground": "e9c062",
                    "token": "string.regexp"
                },
                {
                    "foreground": "cf7d34",
                    "token": "string.regexp constant.character.escape"
                },
                {
                    "foreground": "cf7d34",
                    "token": "string.regexp source.ruby.embedded"
                },
                {
                    "foreground": "cf7d34",
                    "token": "string.regexp string.regexp.arbitrary-repitition"
                },
                {
                    "foreground": "8a9a95",
                    "token": "string variable"
                },
                {
                    "foreground": "dad085",
                    "token": "support.function"
                },
                {
                    "foreground": "cf6a4c",
                    "token": "support.constant"
                },
                {
                    "foreground": "8996a8",
                    "token": "meta.preprocessor.c"
                },
                {
                    "foreground": "afc4db",
                    "token": "meta.preprocessor.c keyword"
                },
                {
                    "fontStyle": "underline",
                    "token": "entity.name.type"
                },
                {
                    "foreground": "676767",
                    "fontStyle": "italic",
                    "token": "meta.cast"
                },
                {
                    "foreground": "494949",
                    "token": "meta.sgml.html meta.doctype"
                },
                {
                    "foreground": "494949",
                    "token": "meta.sgml.html meta.doctype entity"
                },
                {
                    "foreground": "494949",
                    "token": "meta.sgml.html meta.doctype string"
                },
                {
                    "foreground": "494949",
                    "token": "meta.xml-processing"
                },
                {
                    "foreground": "494949",
                    "token": "meta.xml-processing entity"
                },
                {
                    "foreground": "494949",
                    "token": "meta.xml-processing string"
                },
                {
                    "foreground": "259adb",
                    "token": "meta.tag"
                },
                {
                    "foreground": "259adb",
                    "token": "meta.tag entity"
                },
                {
                    "foreground": "259adb",
                    "token": "meta.tag entity"
                },
                {
                    "foreground": "259adb",
                    "token": "source entity.name.tag"
                },
                {
                    "foreground": "259adb",
                    "token": "source entity.other.attribute-name"
                },
                {
                    "foreground": "259adb",
                    "token": "meta.tag.inline"
                },
                {
                    "foreground": "259adb",
                    "token": "meta.tag.inline entity"
                },
                {
                    "foreground": "e18964",
                    "token": "entity.name.tag.namespace"
                },
                {
                    "foreground": "e18964",
                    "token": "entity.other.attribute-name.namespace"
                },
                {
                    "foreground": "259adb",
                    "token": "meta.selector.css entity.name.tag"
                },
                {
                    "foreground": "8f9d6a",
                    "token": "meta.selector.css entity.other.attribute-name.tag.pseudo-class"
                },
                {
                    "foreground": "259adb",
                    "token": "meta.selector.css entity.other.attribute-name.id"
                },
                {
                    "foreground": "259adb",
                    "token": "meta.selector.css entity.other.attribute-name.class"
                },
                {
                    "foreground": "e1f5b1",
                    "token": "support.type.property-name.css"
                },
                {
                    "foreground": "b2d72c",
                    "token": "meta.property-group support.constant.property-value.css"
                },
                {
                    "foreground": "b2d72c",
                    "token": "meta.property-value support.constant.property-value.css"
                },
                {
                    "foreground": "8693a5",
                    "token": "meta.preprocessor.at-rule keyword.control.at-rule"
                },
                {
                    "foreground": "b2d72c",
                    "token": "meta.property-value support.constant.named-color.css"
                },
                {
                    "foreground": "b2d72c",
                    "token": "meta.property-value constant"
                },
                {
                    "foreground": "8f9d6a",
                    "token": "meta.constructor.argument.css"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "0e2231",
                    "fontStyle": "italic",
                    "token": "meta.diff"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "0e2231",
                    "fontStyle": "italic",
                    "token": "meta.diff.header"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "420e09",
                    "token": "markup.deleted"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "4a410d",
                    "token": "markup.changed"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "253b22",
                    "token": "markup.inserted"
                },
                {
                    "foreground": "e9c062",
                    "fontStyle": "italic",
                    "token": "markup.italic"
                },
                {
                    "foreground": "e9c062",
                    "fontStyle": "bold",
                    "token": "markup.bold"
                },
                {
                    "foreground": "e18964",
                    "fontStyle": "underline",
                    "token": "markup.underline"
                },
                {
                    "foreground": "e1d4b9",
                    "background": "fee09c12",
                    "fontStyle": "italic",
                    "token": "markup.quote"
                },
                {
                    "foreground": "fedcc5",
                    "background": "632d04",
                    "token": "markup.heading"
                },
                {
                    "foreground": "fedcc5",
                    "background": "632d04",
                    "token": "markup.heading entity"
                },
                {
                    "foreground": "e1d4b9",
                    "token": "markup.list"
                },
                {
                    "foreground": "578bb3",
                    "background": "b1b3ba08",
                    "token": "markup.raw"
                },
                {
                    "foreground": "f67b37",
                    "fontStyle": "italic",
                    "token": "markup comment"
                },
                {
                    "foreground": "60a633",
                    "background": "242424",
                    "token": "meta.separator"
                },
                {
                    "background": "eeeeee29",
                    "token": "meta.line.entry.logfile"
                },
                {
                    "background": "eeeeee29",
                    "token": "meta.line.exit.logfile"
                },
                {
                    "background": "751012",
                    "token": "meta.line.error.logfile"
                }
            ],
            "colors": {
                "editor.foreground": "#F8F8F8",
                "editor.background": "#000000F7",
                "editor.selectionBackground": "#668CDB9C",
                "editor.lineHighlightBackground": "#F2ECFF1F",
                "editorCursor.foreground": "#FFFFFF",
                "editorWhitespace.foreground": "#616D793D"
            }
        },
        id: "upstream-sunburst"
    },
    {
        name: "Vibrant Ink",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "000000",
                    "token": ""
                },
                {
                    "foreground": "ffffff",
                    "background": "0f0f0f",
                    "token": "text"
                },
                {
                    "background": "000000",
                    "token": "source.ruby.rails.embedded.html"
                },
                {
                    "foreground": "ffffff",
                    "background": "101010",
                    "token": "text.html.ruby"
                },
                {
                    "foreground": "ccff33",
                    "token": "constant.numeric.ruby"
                },
                {
                    "foreground": "ffffff",
                    "background": "000000",
                    "token": "source"
                },
                {
                    "foreground": "9933cc",
                    "token": "comment"
                },
                {
                    "foreground": "339999",
                    "token": "constant"
                },
                {
                    "foreground": "ff6600",
                    "token": "keyword"
                },
                {
                    "foreground": "edf8f9",
                    "token": "keyword.preprocessor"
                },
                {
                    "foreground": "ffffff",
                    "token": "keyword.preprocessor directive"
                },
                {
                    "foreground": "ffcc00",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "ffcc00",
                    "token": "storage.type.function.js"
                },
                {
                    "fontStyle": "italic",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "772cb7",
                    "background": "070707",
                    "token": "source comment.block"
                },
                {
                    "foreground": "ffffff",
                    "token": "variable.other"
                },
                {
                    "foreground": "999966",
                    "token": "support.function.activerecord.rails"
                },
                {
                    "foreground": "66ff00",
                    "token": "string"
                },
                {
                    "foreground": "aaaaaa",
                    "token": "string constant.character.escape"
                },
                {
                    "foreground": "000000",
                    "background": "cccc33",
                    "token": "string.interpolated"
                },
                {
                    "foreground": "44b4cc",
                    "token": "string.regexp"
                },
                {
                    "foreground": "cccc33",
                    "token": "string.literal"
                },
                {
                    "foreground": "555555",
                    "token": "string.interpolated constant.character.escape"
                },
                {
                    "fontStyle": "underline",
                    "token": "entity.name.class"
                },
                {
                    "fontStyle": "underline",
                    "token": "support.class.js"
                },
                {
                    "fontStyle": "italic underline",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "ff6600",
                    "token": "meta.tag.inline.any.html"
                },
                {
                    "foreground": "ff6600",
                    "token": "meta.tag.block.any.html"
                },
                {
                    "foreground": "99cc99",
                    "fontStyle": "italic",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "dde93d",
                    "token": "keyword.other"
                },
                {
                    "foreground": "ff6600",
                    "token": "meta.selector.css"
                },
                {
                    "foreground": "ff6600",
                    "token": "entity.other.attribute-name.pseudo-class.css"
                },
                {
                    "foreground": "ff6600",
                    "token": "entity.name.tag.wildcard.css"
                },
                {
                    "foreground": "ff6600",
                    "token": "entity.other.attribute-name.id.css"
                },
                {
                    "foreground": "ff6600",
                    "token": "entity.other.attribute-name.class.css"
                },
                {
                    "foreground": "999966",
                    "token": "support.type.property-name.css"
                },
                {
                    "foreground": "ffffff",
                    "token": "keyword.other.unit.css"
                },
                {
                    "foreground": "ffffff",
                    "token": "constant.other.rgb-value.css"
                },
                {
                    "foreground": "ffffff",
                    "token": "constant.numeric.css"
                },
                {
                    "foreground": "ffffff",
                    "token": "support.function.event-handler.js"
                },
                {
                    "foreground": "ffffff",
                    "token": "keyword.operator.js"
                },
                {
                    "foreground": "cccc66",
                    "token": "keyword.control.js"
                },
                {
                    "foreground": "ffffff",
                    "token": "support.class.prototype.js"
                },
                {
                    "foreground": "ff6600",
                    "token": "object.property.function.prototype.js"
                }
            ],
            "colors": {
                "editor.foreground": "#FFFFFF",
                "editor.background": "#000000",
                "editor.selectionBackground": "#35493CE0",
                "editor.lineHighlightBackground": "#333300",
                "editorCursor.foreground": "#FFFFFF",
                "editorWhitespace.foreground": "#404040"
            }
        },
        id: "vibrant-ink"
    },
    {
        name: "Xcode_default",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [
                {
                    "background": "FFFFFF",
                    "token": ""
                },
                {
                    "foreground": "008e00",
                    "token": "comment"
                },
                {
                    "foreground": "7d4726",
                    "token": "meta.preprocessor"
                },
                {
                    "foreground": "7d4726",
                    "token": "keyword.control.import"
                },
                {
                    "foreground": "df0002",
                    "token": "string"
                },
                {
                    "foreground": "3a00dc",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "c800a4",
                    "token": "constant.language"
                },
                {
                    "foreground": "275a5e",
                    "token": "constant.character"
                },
                {
                    "foreground": "275a5e",
                    "token": "constant.other"
                },
                {
                    "foreground": "c800a4",
                    "token": "variable.language"
                },
                {
                    "foreground": "c800a4",
                    "token": "variable.other"
                },
                {
                    "foreground": "c800a4",
                    "token": "keyword"
                },
                {
                    "foreground": "c900a4",
                    "token": "storage"
                },
                {
                    "foreground": "438288",
                    "token": "entity.name.class"
                },
                {
                    "foreground": "790ead",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "450084",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "450084",
                    "token": "support.function"
                },
                {
                    "foreground": "450084",
                    "token": "support.constant"
                },
                {
                    "foreground": "790ead",
                    "token": "support.type"
                },
                {
                    "foreground": "790ead",
                    "token": "support.class"
                },
                {
                    "foreground": "790ead",
                    "token": "support.other.variable"
                }
            ],
            "colors": {
                "editor.foreground": "#000000",
                "editor.background": "#FFFFFF",
                "editor.selectionBackground": "#B5D5FF",
                "editor.lineHighlightBackground": "#00000012",
                "editorCursor.foreground": "#000000",
                "editorWhitespace.foreground": "#BFBFBF"
            }
        },
        id: "xcode-default"
    },
    {
        name: "Zenburnesque",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "404040",
                    "token": ""
                },
                {
                    "foreground": "709070",
                    "fontStyle": "italic",
                    "token": "comment"
                },
                {
                    "fontStyle": "bold",
                    "token": "keyword.other.directive"
                },
                {
                    "fontStyle": "underline",
                    "token": "keyword.other.directive.line-number"
                },
                {
                    "foreground": "ff8080",
                    "token": "constant.character"
                },
                {
                    "foreground": "ff2020",
                    "token": "string"
                },
                {
                    "foreground": "22c0ff",
                    "token": "constant.numeric"
                },
                {
                    "fontStyle": "underline",
                    "token": "constant.numeric.floating-point"
                },
                {
                    "foreground": "ffffa0",
                    "token": "keyword"
                },
                {
                    "foreground": "ff8000",
                    "fontStyle": "bold",
                    "token": "entity.name.module"
                },
                {
                    "foreground": "ff8000",
                    "fontStyle": "bold",
                    "token": "support.other.module"
                },
                {
                    "foreground": "ffffa0",
                    "token": "keyword.operator"
                },
                {
                    "fontStyle": "underline",
                    "token": "source.ocaml keyword.operator.symbol.infix.floating-point"
                },
                {
                    "fontStyle": "underline",
                    "token": "source.ocaml keyword.operator.symbol.prefix.floating-point"
                },
                {
                    "foreground": "6080ff",
                    "token": "storage.type"
                },
                {
                    "foreground": "4080a0",
                    "token": "entity.name.class.variant"
                },
                {
                    "foreground": "f09040",
                    "token": "entity.name.type"
                },
                {
                    "foreground": "ffcc66",
                    "fontStyle": "bold",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "ffe000",
                    "token": "storage.type.user-defined"
                },
                {
                    "foreground": "f4a020",
                    "token": "entity.name.type.class.type"
                }
            ],
            "colors": {
                "editor.foreground": "#DEDEDE",
                "editor.background": "#404040",
                "editor.selectionBackground": "#A0A0C0",
                "editor.lineHighlightBackground": "#A0804026",
                "editorCursor.foreground": "#FFFF66",
                "editorWhitespace.foreground": "#A8A8A8"
            }
        },
        id: "zenburnesque"
    },
    {
        name: "iPlastic",
        data: {
            "base": "vs",
            "inherit": true,
            "rules": [
                {
                    "background": "EEEEEEEB",
                    "token": ""
                },
                {
                    "foreground": "009933",
                    "token": "string"
                },
                {
                    "foreground": "0066ff",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "ff0080",
                    "token": "string.regexp"
                },
                {
                    "foreground": "0000ff",
                    "token": "keyword"
                },
                {
                    "foreground": "9700cc",
                    "token": "constant.language"
                },
                {
                    "foreground": "990000",
                    "token": "support.class.exception"
                },
                {
                    "foreground": "ff8000",
                    "token": "entity.name.function"
                },
                {
                    "fontStyle": "bold underline",
                    "token": "entity.name.type"
                },
                {
                    "fontStyle": "italic",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "0066ff",
                    "fontStyle": "italic",
                    "token": "comment"
                },
                {
                    "foreground": "ff0000",
                    "background": "e71a114d",
                    "token": "invalid"
                },
                {
                    "background": "e71a1100",
                    "token": "invalid.deprecated.trailing-whitespace"
                },
                {
                    "foreground": "000000",
                    "background": "fafafafc",
                    "token": "text source"
                },
                {
                    "foreground": "0033cc",
                    "token": "meta.tag"
                },
                {
                    "foreground": "0033cc",
                    "token": "declaration.tag"
                },
                {
                    "foreground": "6782d3",
                    "token": "constant"
                },
                {
                    "foreground": "6782d3",
                    "token": "support.constant"
                },
                {
                    "foreground": "3333ff",
                    "fontStyle": "bold",
                    "token": "support"
                },
                {
                    "fontStyle": "bold",
                    "token": "storage"
                },
                {
                    "fontStyle": "bold underline",
                    "token": "entity.name.section"
                },
                {
                    "foreground": "000000",
                    "fontStyle": "bold",
                    "token": "entity.name.function.frame"
                },
                {
                    "foreground": "333333",
                    "token": "meta.tag.preprocessor.xml"
                },
                {
                    "foreground": "3366cc",
                    "fontStyle": "italic",
                    "token": "entity.other.attribute-name"
                },
                {
                    "fontStyle": "bold",
                    "token": "entity.name.tag"
                }
            ],
            "colors": {
                "editor.foreground": "#000000",
                "editor.background": "#EEEEEEEB",
                "editor.selectionBackground": "#BAD6FD",
                "editor.lineHighlightBackground": "#0000001A",
                "editorCursor.foreground": "#000000",
                "editorWhitespace.foreground": "#B3B3B3F4"
            }
        },
        id: "iplastic"
    },
    {
        name: "idleFingers",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "323232",
                    "token": ""
                },
                {
                    "foreground": "ffffff",
                    "token": "text"
                },
                {
                    "foreground": "cdcdcd",
                    "background": "282828",
                    "token": "source"
                },
                {
                    "foreground": "bc9458",
                    "fontStyle": "italic",
                    "token": "comment"
                },
                {
                    "foreground": "ffe5bb",
                    "token": "meta.tag"
                },
                {
                    "foreground": "ffe5bb",
                    "token": "declaration.tag"
                },
                {
                    "foreground": "ffe5bb",
                    "token": "meta.doctype"
                },
                {
                    "foreground": "ffc66d",
                    "token": "entity.name"
                },
                {
                    "foreground": "fff980",
                    "token": "source.ruby entity.name"
                },
                {
                    "foreground": "b7dff8",
                    "token": "variable.other"
                },
                {
                    "foreground": "cccc33",
                    "token": "support.class.ruby"
                },
                {
                    "foreground": "6c99bb",
                    "token": "constant"
                },
                {
                    "foreground": "6c99bb",
                    "token": "support.constant"
                },
                {
                    "foreground": "cc7833",
                    "token": "keyword"
                },
                {
                    "foreground": "d0d0ff",
                    "token": "other.preprocessor.c"
                },
                {
                    "fontStyle": "italic",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "ffffff",
                    "background": "575757",
                    "token": "source comment.block"
                },
                {
                    "foreground": "a5c261",
                    "token": "string"
                },
                {
                    "foreground": "aaaaaa",
                    "token": "string constant.character.escape"
                },
                {
                    "foreground": "000000",
                    "background": "cccc33",
                    "token": "string.interpolated"
                },
                {
                    "foreground": "cccc33",
                    "token": "string.regexp"
                },
                {
                    "foreground": "cccc33",
                    "token": "string.literal"
                },
                {
                    "foreground": "787878",
                    "token": "string.interpolated constant.character.escape"
                },
                {
                    "fontStyle": "underline",
                    "token": "entity.name.class"
                },
                {
                    "fontStyle": "italic underline",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "b83426",
                    "token": "support.function"
                },
                {
                    "foreground": "6ea533",
                    "token": "markup.list.unnumbered.textile"
                },
                {
                    "foreground": "6ea533",
                    "token": "markup.list.numbered.textile"
                },
                {
                    "foreground": "c2c2c2",
                    "fontStyle": "bold",
                    "token": "markup.bold.textile"
                },
                {
                    "foreground": "ffffff",
                    "background": "ff0000",
                    "token": "invalid"
                },
                {
                    "foreground": "323232",
                    "background": "fff980",
                    "token": "collab.user1"
                }
            ],
            "colors": {
                "editor.foreground": "#FFFFFF",
                "editor.background": "#323232",
                "editor.selectionBackground": "#5A647EE0",
                "editor.lineHighlightBackground": "#353637",
                "editorCursor.foreground": "#91FF00",
                "editorWhitespace.foreground": "#404040"
            }
        },
        id: "idlefingers"
    },
    {
        name: "krTheme",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "0B0A09",
                    "token": ""
                },
                {
                    "foreground": "d27518c2",
                    "token": "constant"
                },
                {
                    "foreground": "a89100b5",
                    "token": "entity"
                },
                {
                    "foreground": "ba6912",
                    "token": "entity.other"
                },
                {
                    "foreground": "949c8b",
                    "token": "keyword"
                },
                {
                    "foreground": "ffee80",
                    "token": "storage"
                },
                {
                    "foreground": "c7a4a1b5",
                    "token": "string -string.unquoted.old-plist -string.unquoted.heredoc"
                },
                {
                    "foreground": "c7a4a1b5",
                    "token": "string.unquoted.heredoc string"
                },
                {
                    "foreground": "706d5b",
                    "fontStyle": "italic",
                    "token": "comment"
                },
                {
                    "foreground": "9fc28a",
                    "token": "support"
                },
                {
                    "foreground": "d1a796",
                    "token": "variable"
                },
                {
                    "foreground": "ff80e1",
                    "token": "variable.language"
                },
                {
                    "foreground": "ffee80",
                    "token": "meta.function-call"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "a41300",
                    "token": "invalid"
                },
                {
                    "foreground": "d9d59f",
                    "background": "24231d4d",
                    "token": "text source"
                },
                {
                    "foreground": "d9d59f",
                    "background": "24231d4d",
                    "token": "string.unquoted.heredoc"
                },
                {
                    "foreground": "d9d59f",
                    "background": "24231d4d",
                    "token": "source source"
                },
                {
                    "foreground": "7efcff",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "439740ba",
                    "token": "string.quoted source"
                },
                {
                    "foreground": "60db5dba",
                    "token": "string constant"
                },
                {
                    "foreground": "7dffc0a6",
                    "token": "string.regexp"
                },
                {
                    "foreground": "b8b960",
                    "token": "string variable"
                },
                {
                    "foreground": "85873a",
                    "token": "support.function"
                },
                {
                    "foreground": "c27e66",
                    "token": "support.constant"
                },
                {
                    "foreground": "ff1e00",
                    "token": "support.class.exception"
                },
                {
                    "foreground": "8996a8",
                    "token": "meta.preprocessor.c"
                },
                {
                    "foreground": "afc4db",
                    "token": "meta.preprocessor.c keyword"
                },
                {
                    "foreground": "73817d",
                    "token": "meta.sgml.html meta.doctype"
                },
                {
                    "foreground": "73817d",
                    "token": "meta.sgml.html meta.doctype entity"
                },
                {
                    "foreground": "73817d",
                    "token": "meta.sgml.html meta.doctype string"
                },
                {
                    "foreground": "73817d",
                    "token": "meta.xml-processing"
                },
                {
                    "foreground": "73817d",
                    "token": "meta.xml-processing entity"
                },
                {
                    "foreground": "73817d",
                    "token": "meta.xml-processing string"
                },
                {
                    "foreground": "babd9c",
                    "token": "meta.tag"
                },
                {
                    "foreground": "babd9c",
                    "token": "meta.tag entity"
                },
                {
                    "foreground": "99a190",
                    "token": "meta.selector.css entity.name.tag"
                },
                {
                    "foreground": "cc8844",
                    "token": "meta.selector.css entity.other.attribute-name.id"
                },
                {
                    "foreground": "cfb958",
                    "token": "meta.selector.css entity.other.attribute-name.class"
                },
                {
                    "foreground": "e0ddad",
                    "token": "support.type.property-name.css"
                },
                {
                    "foreground": "aeb14b",
                    "token": "meta.property-group support.constant.property-value.css"
                },
                {
                    "foreground": "aeb14b",
                    "token": "meta.property-value support.constant.property-value.css"
                },
                {
                    "foreground": "ffb010",
                    "token": "meta.preprocessor.at-rule keyword.control.at-rule"
                },
                {
                    "foreground": "999179",
                    "token": "meta.property-value support.constant.named-color.css"
                },
                {
                    "foreground": "999179",
                    "token": "meta.property-value constant"
                },
                {
                    "foreground": "eb939a",
                    "token": "meta.constructor.argument.css"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "000e1a",
                    "token": "meta.diff"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "000e1a",
                    "token": "meta.diff.header"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "800f00",
                    "token": "markup.deleted"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "806f00",
                    "token": "markup.changed"
                },
                {
                    "foreground": "f8f8f8",
                    "background": "228000",
                    "token": "markup.inserted"
                },
                {
                    "background": "8fddf630",
                    "token": "markup.raw"
                },
                {
                    "background": "005baa",
                    "token": "markup.quote"
                },
                {
                    "background": "0f0040",
                    "token": "markup.list"
                },
                {
                    "foreground": "9d80ff",
                    "fontStyle": "bold",
                    "token": "markup.bold"
                },
                {
                    "foreground": "80ffbb",
                    "fontStyle": "italic",
                    "token": "markup.italic"
                },
                {
                    "fontStyle": "bold",
                    "token": "markup.heading"
                }
            ],
            "colors": {
                "editor.foreground": "#FCFFE0",
                "editor.background": "#0B0A09",
                "editor.selectionBackground": "#AA00FF73",
                "editor.lineHighlightBackground": "#38403D",
                "editorCursor.foreground": "#FF9900",
                "editorWhitespace.foreground": "#FFB16F52"
            }
        },
        id: "krtheme"
    },
    {
        name: "monoindustrial",
        data: {
            "base": "vs-dark",
            "inherit": true,
            "rules": [
                {
                    "background": "222C28",
                    "token": ""
                },
                {
                    "foreground": "666c68",
                    "background": "151c19",
                    "token": "comment"
                },
                {
                    "foreground": "c23b00",
                    "token": "storage"
                },
                {
                    "foreground": "c23b00",
                    "token": "support.type"
                },
                {
                    "foreground": "ffffff",
                    "background": "151c19",
                    "token": "string.unquoted.embedded"
                },
                {
                    "foreground": "ffffff",
                    "background": "151c19",
                    "token": "text source"
                },
                {
                    "foreground": "ffffff",
                    "background": "151c19",
                    "token": "string.unquoted"
                },
                {
                    "foreground": "e9470000",
                    "background": "1a0700",
                    "token": "constant.character.escaped"
                },
                {
                    "foreground": "e9470000",
                    "background": "1a0700",
                    "token": "string source - string.unquoted.embedded"
                },
                {
                    "foreground": "e9470000",
                    "background": "1a0700",
                    "token": "string string source"
                },
                {
                    "foreground": "c23800",
                    "background": "1a0700",
                    "token": "string - string source"
                },
                {
                    "foreground": "c23800",
                    "background": "1a0700",
                    "token": "string source string"
                },
                {
                    "foreground": "c23800",
                    "background": "1a0700",
                    "token": "meta.scope.heredoc"
                },
                {
                    "foreground": "e98800",
                    "token": "constant.numeric"
                },
                {
                    "foreground": "648bd2",
                    "token": "variable.language"
                },
                {
                    "foreground": "648bd2",
                    "token": "variable.other"
                },
                {
                    "foreground": "e98800",
                    "token": "constant"
                },
                {
                    "foreground": "a8b3ab",
                    "background": "161d1a",
                    "token": "other.preprocessor"
                },
                {
                    "foreground": "a8b3ab",
                    "background": "161d1a",
                    "token": "entity.name.preprocessor"
                },
                {
                    "foreground": "a8b3ab",
                    "token": "entity.name.function"
                },
                {
                    "foreground": "a8b3ab",
                    "token": "keyword.operator"
                },
                {
                    "foreground": "a8b3ab",
                    "token": "keyword.other.name-of-parameter"
                },
                {
                    "foreground": "9a2f00",
                    "token": "entity.name.class"
                },
                {
                    "foreground": "648bd2",
                    "token": "variable.parameter"
                },
                {
                    "foreground": "666c68",
                    "token": "storage.type.method"
                },
                {
                    "foreground": "a39e64",
                    "token": "keyword"
                },
                {
                    "foreground": "a39e64",
                    "token": "storage.type.function.php"
                },
                {
                    "foreground": "ffffff",
                    "background": "990000ad",
                    "token": "invalid"
                },
                {
                    "foreground": "000000",
                    "background": "ffd0d0",
                    "token": "invalid.trailing-whitespace"
                },
                {
                    "foreground": "588e60",
                    "token": "support.function"
                },
                {
                    "foreground": "5778b6",
                    "token": "support.class"
                },
                {
                    "foreground": "5778b6",
                    "token": "support.type"
                },
                {
                    "foreground": "5778b6",
                    "token": "entity.name"
                },
                {
                    "foreground": "c87500",
                    "token": "support.constant"
                },
                {
                    "foreground": "5879b7",
                    "token": "support.other.variable"
                },
                {
                    "foreground": "68685b",
                    "token": "declaration.xml-processing"
                },
                {
                    "foreground": "888888",
                    "token": "declaration.doctype"
                },
                {
                    "foreground": "888888",
                    "token": "declaration.doctype.DTD"
                },
                {
                    "foreground": "a65eff",
                    "token": "declaration.tag"
                },
                {
                    "foreground": "a65eff",
                    "token": "entity.name.tag"
                },
                {
                    "foreground": "909993",
                    "token": "entity.other.attribute-name"
                },
                {
                    "foreground": "90999380",
                    "token": "punctuation"
                },
                {
                    "foreground": "7642b7",
                    "token": "entity.other.inherited-class"
                },
                {
                    "foreground": "ffffff",
                    "background": "00000059",
                    "token": "meta.scope.changed-files.svn"
                },
                {
                    "foreground": "ffffff",
                    "background": "00000059",
                    "token": "markup.inserted.svn"
                },
                {
                    "foreground": "ffffff",
                    "background": "00000059",
                    "token": "markup.changed.svn"
                },
                {
                    "foreground": "ffffff",
                    "background": "00000059",
                    "token": "markup.deleted.svn"
                },
                {
                    "background": "78807b0a",
                    "token": "meta.section"
                },
                {
                    "background": "78807b0a",
                    "token": "meta.section meta.section"
                },
                {
                    "background": "78807b0a",
                    "token": "meta.section meta.section meta.section"
                }
            ],
            "colors": {
                "editor.foreground": "#FFFFFF",
                "editor.background": "#222C28",
                "editor.selectionBackground": "#91999466",
                "editor.lineHighlightBackground": "#0C0D0C40",
                "editorCursor.foreground": "#FFFFFF",
                "editorWhitespace.foreground": "#666C6880"
            }
        },
        id: "monoindustrial"
    }
]
  
  constructor(private http: HttpClient) { }

  saveFiddle(data: any): Observable<any>{
    //console.log("saveFiddle data = ", data);
    return (this.http.post(this.url, data,this.httpOptions));
  }
  getFiddle(data: any): Observable<any>{
    return (this.http.post(this.url, data, this.httpOptions));
  }

  registerMonacoCustomTheme(fiddleTheme: FiddleTheme) {
    let self = this;
    console.log("A!");
    setTimeout(()=>{
      if(window['monaco']){
        console.log("fiddleTheme = ", fiddleTheme);
        window['monaco'].editor.defineTheme('myCustomTheme', fiddleTheme.data as any);
        window['monaco'].editor.setTheme("myCustomTheme");
      }
    },10);
  }

  resumeFiddleTheme(){
    //console.log("param = ", param);
    //console.log("this.mainService.isFiddleThemeDark = ", this.isFiddleThemeDark);
    let savedThemeId = localStorage.getItem("myfiddle-theme");
    let selectedTheme: FiddleTheme;

    if(savedThemeId){
        selectedTheme = this.monacoThemesList.find((el)=>{return el.id == savedThemeId});
    }
    else{
        selectedTheme = this.defaultTheme;
    }

    this.addThemeStylesheet(selectedTheme);
    this.registerMonacoCustomTheme(selectedTheme);
    
  }

  prepareThemeStyleSheet(theme: FiddleTheme){
    let str = `.code-part-title {
        background:${theme.data.colors['editor.background']};
        color: :${theme.data.colors['editor.foreground']};
    }
    
    .as-split-gutter,
    .as-split-gutter-custom{
        background-color: ${theme.data.colors['editor.foreground']};
    }
    
    .fiddle-size.fiddle-size-hack{
        color: ${theme.data.colors['editor.background']};
        background: ${theme.data.colors['editor.foreground']};
        box-shadow: 0 0 15px 4px ${theme.data.colors['editor.foreground']};
    }
    
    .iframe-hack {
        background: ${theme.data.colors['editor.background']};
    }
    
    input.form-control.fiddle-input {
        background: ${theme.data.colors['editor.background']};
        border: 1px solid ${theme.data.colors['editor.foreground']};
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .code-part-title span {
        color: ${theme.data.colors['editor.foreground']} !important;
    }
    
    .layout > div:first-child > div {
        outline: 1px solid ${theme.data.colors['editor.foreground']} !important;
    }
    
    .layout.active > div:first-child > div {
        outline: 1px solid ${theme.data.colors['editor.background']} !important;
    }
    
    .layout > div:first-child {
        outline: 2px solid ${theme.data.colors['editor.foreground']} !important;
    }
    
    .layout.active > div:first-child {
        outline: 2px solid ${theme.data.colors['editor.background']} !important;
    }
    
    .layout {
        background-color: ${theme.data.colors['editor.background']} !important;
        border-color: ${theme.data.colors['editor.foreground']} !important;
        box-shadow: 0 0 0px 1px ${theme.data.colors['editor.background']} !important;
    }
    
    .layout.active {
        background-color: ${theme.data.colors['editor.foreground']} !important;
        border-color: ${theme.data.colors['editor.background']} !important;
        box-shadow: 0 0 0px 1px ${theme.data.colors['editor.foreground']} !important;
    }
    
    .layouts-list {
        background-color: ${theme.data.colors['editor.background']} !important;
        box-shadow: 0px 0px 4px 2px ${theme.data.colors['editor.foreground']} !important;
    }
    
    ul.donations-menu.shown,
    .themes-menu.shown{
        box-shadow: 0px 0px 4px 2px ${theme.data.colors['editor.foreground']} !important;
        background-color: ${theme.data.colors['editor.background']} !important;
    }
    
    .paypal-btn-container ul.donations-menu > li,
    .themes-menu.shown > li {
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .paypal-btn-container ul.donations-menu > li:hover,
    .themes-menu.shown > li:hover {
        background-color: ${theme.data.colors['editor.foreground']};
        color: ${theme.data.colors['editor.background']};
    }
    
    .ressources-choices-container {
        background-color: ${theme.data.colors['editor.background']} !important;
    }
    
    .modal {
        background: ${theme.data.colors['editor.background']};
        border: 1px solid ${theme.data.colors['editor.foreground']};
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice 
    .ressource-choice-description {
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .form-control {
        background: ${theme.data.colors['editor.background']};
        color: ${theme.data.colors['editor.foreground']};
        border: 1px solid ${theme.data.colors['editor.foreground']};
    }
    
    button.modal-close-btn {
        background: ${theme.data.colors['editor.background']};
        color: ${theme.data.colors['editor.foreground']};
    }
    
    button.btn.btn-remove-selected-ressource {
        background-color: ${theme.data.colors['editor.background']};
        color: ${theme.data.colors['editor.foreground']};
    }
    
    button.modal-close-btn:hover {
        background: ${theme.data.colors['editor.background']};
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice .ressource-choice-description[class] {
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-container > hr {
        border: 2px solid ${theme.data.colors['editor.foreground']} !important;
    }
    
    .paypal-btn-container,
    .themes-btn-container {
        color: ${theme.data.colors['editor.foreground']};
    }
    
    button.btn.paypal-btn {
        color: ${theme.data.colors['editor.foreground']};
        background: ${theme.data.colors['editor.background']};
    }
    
    .header-btns-container .btn,
    .header-btns-container .btn:hover {
        color: ${theme.data.colors['editor.foreground']};
        background: ${theme.data.colors['editor.background']};
    }
    
    #code-parts-title-mobile a.active {
        background-color: ${theme.data.colors['editor.background']};
        color: ${theme.data.colors['editor.foreground']};
        font-weight: 600;
    }
    
    .paypal-btn-container ul.donations-menu > li:hover {
        background-color: ${theme.data.colors['editor.background']};
        font-weight: 600;
    }
    
    .themes-menu.shown > li:not(.selected):hover {
        /*background-color: ${theme.data.colors['editor.lineHighlightBackground']};*/
    }
    
    .themes-menu li.selected {
        font-weight: bold;
        background-color: ${theme.data.colors['editor.selectionBackground']};
        color: ${theme.data.colors['editor.foreground']};
    }

    .ressources-container > hr{
      border: 1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-query-container{
      border-bottom: 1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choices-container{
      background-color: ${theme.data.colors['editor.background']};
      border: 1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice:first-child ~ .ressources-choice{
      border-top:1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice:last-child{
      border-bottom:1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice .ressource-choice-description {
      color: ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice:hover {
      background-color: ${theme.data.colors['editor.lineHighlightBackground']};
    }
    
    .ressources-choice.current-choice {
      background-color: ${theme.data.colors['editor.selectionBackground']};
    }
    
    .ressources-choice-files-container{
      border: 1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice-selected-files-container{
      border: 1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice-files:hover {
      background-color: ${theme.data.colors['editor.background']};
    }
    
    .ressources-choice-files.selected {
      background: ${theme.data.colors['editor.selectionBackground']};
    }
    
    .ressources-choice-files:first-child ~ .ressources-choice-files{
      border-top:1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice-files:last-child {
      border-bottom:1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice-files-search{
      border-bottom:1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice-selected-file {
      background-color: ${theme.data.colors['editor.background']};
    }
    
    .ressources-choice-selected-file.placeholder {
      color: ${theme.data.colors['editor.foreground']};
      background-color: ${theme.data.colors['editor.lineHighlightBackground']};
    }
    
    .ressources-choice-selected-file-wrapper.placeholder {
      background-color: ${theme.data.colors['editor.lineHighlightBackground']};
      border: 2px dashed ${theme.data.colors['editor.foreground']};
      border-top: 2px dashed ${theme.data.colors['editor.foreground']};
      border-bottom: 2px dashed ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice-selected-file-wrapper {
      border-bottom: 1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .resources-tabs-mobile {
      border-bottom: 1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .resources-tabs-mobile label {
      border:1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .resources-tabs-mobile label.selected{
      background-color:${theme.data.colors['editor.selectionBackground']};
    }
    
    .title{
      border-bottom: 1px solid ${theme.data.colors['editor.foreground']};
    }

    .modal-close-btn{
        border-color: ${theme.data.colors['editor.foreground']};
        color: ${theme.data.colors['editor.foreground']};
        background-color: ${theme.data.colors['editor.background']};
    }

    .modal-close-btn:active{
        color: ${theme.data.colors['editor.foreground']};
        background-color: ${theme.data.colors['editor.selectionBackground']};
    }

    .modal-close-btn:hover{
        background-color: ${theme.data.colors['editor.lineHighlightBackground']};
    }

    .modal{
        background-color: ${theme.data.colors['editor.background']};
        box-shadow: 0 0px 8px 1px ${theme.data.colors['editor.foreground']};
        border: 1px solid ${theme.data.colors['editor.foreground']};
    }

    .modal-container.shown{
        background-color: ${theme.data.colors['editor.background']};
    }
    
    body{
        background-color: ${theme.data.colors['editor.background']};
        color: ${theme.data.colors['editor.foreground']};
    }`;

    return str;
  }

  addThemeStylesheet(theme: FiddleTheme){    
    let themeStylesheet = document.querySelector("style#theme-stylesheet") as HTMLStyleElement;
    
    if(themeStylesheet){
      themeStylesheet.parentElement.removeChild(themeStylesheet);
    }
    
    themeStylesheet = document.createElement("style");
    themeStylesheet.id = "theme-stylesheet";

    document.head.appendChild(themeStylesheet);

    themeStylesheet.textContent = theme ? this.prepareThemeStyleSheet(theme) : "";
  }
}
