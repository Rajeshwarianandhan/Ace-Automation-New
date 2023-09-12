var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var ace = ace;
var js_beautify = js_beautify;
var babel = Babel;
babel.availablePlugins["preventInfiniteLoops"] = preventInfiniteLoops;
var babelOptions = {
    presets: ["es2015"],
    plugins: ["preventInfiniteLoops"],
};
var getInterpreter = function (code, initFunc) {
    return new Interpreter(code, initFunc);
};
ace.require("ace/ext/language_tools");
var BASE_URL = "./";
var Editor = /** @class */ (function () {
    function Editor(editor) {
        this.editor = editor;
    }
    Editor.prototype.getEditor = function () {
        return this.editor;
    };
    Editor.prototype.setTheme = function (value) {
        this.editor.setTheme(value);
    };
    Editor.prototype.setFontSize = function (value) {
        this.editor.setFontSize(value + "px");
    };
    return Editor;
}());
var Question = /** @class */ (function () {
    function Question(questions) {
        this.page = 0;
        this.questions = [];
        this.questionsCount = 0;
        this.page = 0;
        this.questions = questions;
        this.questionsCount = this.questions.length;
    }
    Question.prototype.nextPage = function () {
        if (this.page < this.questionsCount - 1) {
            this.page++;
            feedQuestion();
            return true;
        }
    };
    Question.prototype.prevPage = function () {
        if (this.page > 0) {
            this.page--;
            feedQuestion();
        }
    };
    Question.prototype.getPage = function () {
        return this.page;
    };
    Question.prototype.totalPage = function () {
        return this.questionsCount;
    };
    Question.prototype.getQuestion = function () {
        return this.questions[this.page];
    };
    Question.prototype.getTestCases = function () {
        return this.questions[this.page].testCases;
    };
    Question.prototype.getQuestionId = function () {
        return this.questions[this.page]._id || this.questions[this.page].qid;
    };
    Question.prototype.updateTemplate = function (code) {
        this.questions[this.page].template = code;
    };
    return Question;
}());
var myEditor = new Editor(ace.edit("editor", {
    theme: localStorage.getItem("GJSW-theme") || "ace/theme/monokai",
    mode: "ace/mode/javascript",
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    wrap: true,
    fontSize: (localStorage.getItem("GJSW-fs") || 16) + "px",
    autoScrollEditorIntoView: true,
    copyWithEmptySelection: true,
    firstLineNumber: 0,
    enableEmmet: true,
    enableAutoIndent: true,
}));
var myQuestions = (function () {
    var question;
    var setQuestions = function (val) {
        question = val;
    };
    var getQuestions = function () { return question; };
    return {
        setQuestions: setQuestions,
        getQuestions: getQuestions,
    };
})();
// const user = (() => {
//   let userMail;
//   const setMail = (mail) => {
//     userMail = mail;
//   };
//   const getMail = () => userMail;
//   return {
//     setMail,
//     getMail,
//   };
// })();
var dummyElement = function () { return document.createElement(""); };
var scrollEditor = function (where) {
    if (where === void 0) { where = "bottom"; }
    var codeEditorDiv = document.querySelector(".code-editor") || dummyElement();
    if (where === "bottom") {
        codeEditorDiv.scrollTo({
            top: codeEditorDiv.scrollHeight + 30,
            behavior: "smooth",
        });
    }
    else {
        codeEditorDiv.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }
};
var navTab = document.getElementById("nav-tab") || dummyElement();
navTab.addEventListener("click", function () {
    scrollEditor();
});
var themeSelect = ((document.getElementById("theme-select") || dummyElement()));
themeSelect.value = localStorage.getItem("GJSW-theme") || "ace/theme/monokai";
themeSelect.addEventListener("change", function () {
    localStorage.setItem("GJSW-theme", themeSelect.value);
    myEditor.setTheme(themeSelect.value);
});
// #loopLimit
var loopLimitRange = ((document.getElementById("loopLimitRange") || dummyElement()));
loopLimitRange.value = "" + MAX_SOURCE_ITERATIONS;
var loopLimit = ((document.getElementById("loopLimit") || dummyElement()));
loopLimit.innerText = loopLimitRange.value;
loopLimitRange.addEventListener("input", function () {
    var value = loopLimitRange.value;
    MAX_SOURCE_ITERATIONS = parseInt(value, 10);
    loopLimit.innerText = value;
});
var editorFontSize = ((document.getElementById("editorFontSize") || dummyElement()));
editorFontSize.value = localStorage.getItem("GJSW-fs") || "16";
var fontSize = ((document.getElementById("fontSize") || dummyElement()));
fontSize.innerText = editorFontSize.value + "px";
editorFontSize.addEventListener("input", function () {
    var value = editorFontSize.value;
    localStorage.setItem("GJSW-fs", value);
    myEditor.setFontSize(value);
    fontSize.innerText = value + "px";
    fontSize.style.setProperty("font-size", value, "important");
});
var compilerMsg = document.getElementById("compileMsg") || dummyElement();
var clearCC = function () {
    compilerMsg.innerHTML = "";
    compilerMsg.className = "text-danger";
    (document.getElementById("console-log-text") || dummyElement()).innerHTML =
        "";
};
var download = function (filename, text) {
    var element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};
var myData = {
    key: "getWebtoolQuestions"
};
window.onload = function () { return __awaiter(_this, void 0, void 0, function () {
    var responce, res, myObj;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, fetch('https://guviv2.codingpuppet.com/model/webtool.php', {
                    method: "POST",
                    body: JSON.stringify(myData),
                })];
            case 1:
                responce = _b.sent();
                return [4 /*yield*/, responce.json()];
            case 2:
                res = _b.sent();
                myObj = new Question(res);
                myQuestions.setQuestions(myObj);
                (document.querySelector("#totalQuestions") || dummyElement()).innerHTML =
                    "" + myObj.totalPage();
                feedQuestion();
                (_a = document.querySelector("#editor")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                    scrollEditor("top");
                });
                return [2 /*return*/];
        }
    });
}); };
// window.onload = async () => {
//   const responce = await fetch(`${BASE_URL}/questions/questions.json`, {
//     method: "GET",
//   });
//   const res = await responce.json();
//   const myObj = new Question(res.warmup);
//   myQuestions.setQuestions(myObj);
//   (document.querySelector("#totalQuestions") || dummyElement()).innerHTML =
//     "" + myObj.totalPage();
//   feedQuestion();
//   document.querySelector("#editor")?.addEventListener("click", () => {
//     scrollEditor("top");
//   });
// };
var validateMail = function (email) {
    var atposition = email.indexOf("@");
    var atPosition2 = email.lastIndexOf("@");
    var dotposition = email.lastIndexOf(".");
    var space = email.indexOf(" ");
    if (space >= 0 ||
        atPosition2 !== atposition ||
        atposition < 1 ||
        dotposition < atposition + 2 ||
        dotposition + 2 >= email.length) {
        // alert("Please enter a valid e-mail address \n atpostion:" + atposition + "\n dotposition:" + dotposition);
        return false;
    }
    return true;
};
// const changeTopic = (val) => {
//     let myObj = myQuestions.getQuestions();
//     myObj.setTopic(val);
//     feedQuestion(val);
// };
var manageNavBtn = function (page, total) {
    document.querySelectorAll(".nav-btn")[0]["disabled"] = !page;
    document.querySelectorAll(".nav-btn")[1]["disabled"] = !(-total + page + 1);
};
var feedQuestion = function () { return __awaiter(_this, void 0, void 0, function () {
    var myObj, questionDiv, testcaseDiv, question, solved, template, options;
    return __generator(this, function (_a) {
        myEditor.getEditor().setValue("");
        myObj = myQuestions.getQuestions();
        manageNavBtn(myObj.getPage(), myObj.totalPage());
        (document.querySelector("#questionNo") || dummyElement()).innerHTML =
            1 + myObj.getPage();
        questionDiv = document.getElementById("question") || dummyElement();
        testcaseDiv = document.getElementById("testcases") || dummyElement();
        testcaseDiv.innerHTML = "";
        question = myObj.getQuestion();
        questionDiv.innerHTML = question.question;
        solved = sessionStorage.getItem("jsWarmupSolution" + myObj.getQuestionId());
        template = solved || question.template + "\n/*\nLines For TestCase\n";
        question.testCases.forEach(function (testcase, ind) {
            var myDiv = document.createElement("div");
            myDiv.className = "p-2 bd-highlight g-2 testcase";
            myDiv.id = "test" + ind;
            myDiv.innerHTML = "\n        <div class = \"d-flex justify-content-between align-items-center\">\n          <span class=\"p-2 bd-highlight\">".concat(testcase.output, "</span>\n          <i id=\"test").concat(ind, "i\" class=\"\"></i>\n        </div>\n    ");
            if (!solved) {
                template += "\n".concat(testcase.input);
            }
            testcaseDiv === null || testcaseDiv === void 0 ? void 0 : testcaseDiv.appendChild(myDiv);
        });
        template += solved ? "" : "\n*/";
        options = {
            indent_size: 1,
            space_in_empty_paren: true,
            indent_with_tabs: true,
            indent_empty_lines: true,
        };
        template = js_beautify(template, options);
        myEditor.getEditor().setValue(template);
        scrollEditor("top");
        clearCC();
        return [2 /*return*/];
    });
}); };
var prevPage = function () {
    var myObj = myQuestions.getQuestions();
    myObj.prevPage();
};
var nextPage = function () {
    var myObj = myQuestions.getQuestions();
    myObj.nextPage();
};
var initFunc = function (interpreter, globalObject) {
    var x = interpreter.nativeToPseudo(console);
    interpreter.setProperty(globalObject, "console", x);
};
var compile = function (myCode, testcase) {
    (document.getElementById("console-log-div") || dummyElement()).style.display =
        "inline-block";
    compilerMsg.innerHTML = "Compiling....";
    return new Promise(function (resolve, reject) {
        myCode = babel.transform(myCode + "\n" + testcase.input, babelOptions).code;
        var myInterpreter = getInterpreter(myCode, initFunc);
        // let flag = false;
        console["head"]("Sample testcase :::: ", testcase.input);
        // flag =
        myInterpreter.run();
        // resolve(myInterpreter.value);
        // setTimeout(() => {
        //   if (flag) {
        // flag = myInterpreter.run();
        resolve(myInterpreter.value);
        //   } else {
        //     resolve(myInterpreter.value);
        //   }
        // }, 0);
    });
};
var runCode = function () {
    (document.getElementById("nav-output-tab") || dummyElement()).click();
    // (<HTMLButtonElement>(
    //   (document.getElementById("runCode") || dummyElement())
    // )).disabled = true;
    document.querySelectorAll(".top-bar>*>[type=button]").forEach(function (element) {
        element.disabled = true;
    });
    clearCC();
    var myObj = myQuestions.getQuestions();
    var testcases = myObj.getTestCases();
    var myCode = myEditor.getEditor().getValue();
    sessionStorage.setItem("jsWarmupSolution" + myObj.getQuestionId(), myCode.replace(/^\s*\n/gm, ""));
    compile(myCode, testcases[0])
        .then(function (value) {
        console.log(value);
        compilerMsg.innerHTML = "";
        if ((document.getElementById("console-log-text") || dummyElement())
            .innerText == "") {
            compilerMsg.innerHTML = "Compilation is Successfull";
            compilerMsg.className = "text-success";
            console.warn("There is no conosle statement to print the output");
        }
    }, function (error) {
        compilerMsg.innerText = error;
        compilerMsg.className = "text-danger";
        // console.error(error);
    })
        .finally(function () {
        scrollEditor();
        document
            .querySelectorAll(".top-bar>*>[type=button]")
            .forEach(function (element) {
            element.disabled = false;
        });
    });
};
var submitCode = function () {
    document.querySelectorAll(".top-bar>*>[type=button]").forEach(function (element) {
        element.disabled = true;
    });
    (document.getElementById("nav-testcases-tab") || dummyElement()).click();
    var myObj = myQuestions.getQuestions();
    var testcases = myObj.getTestCases();
    var myCode = myEditor.getEditor().getValue();
    sessionStorage.setItem("jsWarmupSolution" + myObj.getQuestionId(), myCode.replace(/^\s*\n/gm, ""));
    compile(myCode, testcases[0])
        .then(function () {
        clearCC();
        testcases.forEach(function (val, ind) {
            var executable_code = babel.transform(myCode + "\n" + val.input, babelOptions).code;
            var myInterpreter = getInterpreter(executable_code, initFunc);
            // myInterpreter.appendCode(val.input);
            console["head"]("For testcase :::: ", val.input);
            myInterpreter.run();
            var testcaseInd = document.getElementById("test" + ind) || dummyElement();
            var testcaseIcon = document.querySelector("#test" + ind + "i") || dummyElement();
            if (testcases[ind].output === myInterpreter.value) {
                testcaseInd.className = "p-2 bd-highlight testcase g-2 pass";
                testcaseIcon.className = "bi bi-check-circle-fill text-success";
            }
            else {
                testcaseInd.className = "p-2 bd-highlight testcase g-2 fail";
                testcaseIcon.className = "bi bi-x-circle-fill text-danger";
            }
        });
    }, function (error) {
        compilerMsg.innerText = error;
        // console.error(error);
    })
        .finally(function () {
        scrollEditor();
        document
            .querySelectorAll(".top-bar>*>[type=button]")
            .forEach(function (element) {
            element.disabled = false;
        });
    });
};
// Start file download.
var htmlToText = function (html) {
    var temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
};
var initiateDownload = function () {
    download("GUVI WarmUp - ".concat(myQuestions.getQuestions().getPage(), ".").concat(document.querySelector("#file-type-select").value), "/* ".concat(htmlToText(myQuestions.getQuestions().getQuestion().question), " */\n\n").concat(js_beautify(myEditor.getEditor().getValue(), {
        indent_size: 1,
        space_in_empty_paren: true,
        indent_with_tabs: true,
        indent_empty_lines: true,
    })));
};
