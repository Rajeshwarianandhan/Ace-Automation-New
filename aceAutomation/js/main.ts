const ace: any = ace;
const js_beautify: Function = js_beautify;
const babel = Babel;
babel.availablePlugins["preventInfiniteLoops"] = preventInfiniteLoops;
const babelOptions = {
  presets: ["es2015"],
  plugins: ["preventInfiniteLoops"],
};
const getInterpreter = (code: string, initFunc: Function) =>
  new Interpreter(code, initFunc);
ace.require("ace/ext/language_tools");
const BASE_URL = "./";
class Editor {
  editor: any;
  constructor(editor) {
    this.editor = editor;
  }
  getEditor() {
    return this.editor;
  }
  setTheme(value: string) {
    this.editor.setTheme(value);
  }
  setFontSize(value: string) {
    this.editor.setFontSize(value + "px");
  }
}
class Question {
  page: number = 0;
  questions: Array<any> = [];
  questionsCount: number = 0;
  constructor(questions: Array<any>) {
    this.page = 0;
    this.questions = questions;
    this.questionsCount = this.questions.length;
  }
  nextPage() {
    if (this.page < this.questionsCount - 1) {
      this.page++;
      feedQuestion();
      return true;
    }
  }
  prevPage() {
    if (this.page > 0) {
      this.page--;
      feedQuestion();
    }
  }
  getPage() {
    return this.page;
  }
  totalPage() {
    return this.questionsCount;
  }
  getQuestion() {
    return this.questions[this.page];
  }
  getTestCases() {
    return this.questions[this.page].testCases;
  }
  getQuestionId() {
    return this.questions[this.page]._id || this.questions[this.page].qid;
  }
  updateTemplate(code: string) {
    this.questions[this.page].template = code;
  }
}

const myEditor = new Editor(
  ace.edit("editor", {
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
  })
);
const myQuestions = (() => {
  let question;
  const setQuestions = (val) => {
    question = val;
  };
  const getQuestions = () => question;

  return {
    setQuestions,
    getQuestions,
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
const dummyElement = () => document.createElement("");
const scrollEditor = (where = "bottom") => {
  const codeEditorDiv =
    document.querySelector(".code-editor") || dummyElement();
  if (where === "bottom") {
    codeEditorDiv.scrollTo({
      top: codeEditorDiv.scrollHeight + 30,
      behavior: "smooth",
    });
  } else {
    codeEditorDiv.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};
const navTab = document.getElementById("nav-tab") || dummyElement();
navTab.addEventListener("click", () => {
  scrollEditor();
});

const themeSelect = <HTMLSelectElement>(
  (document.getElementById("theme-select") || dummyElement())
);
themeSelect.value = localStorage.getItem("GJSW-theme") || "ace/theme/monokai";
themeSelect.addEventListener("change", () => {
  localStorage.setItem("GJSW-theme", themeSelect.value);
  myEditor.setTheme(themeSelect.value);
});
// #loopLimit

const loopLimitRange = <HTMLInputElement>(
  (document.getElementById("loopLimitRange") || dummyElement())
);
loopLimitRange.value = "" + MAX_SOURCE_ITERATIONS;
const loopLimit = <HTMLSpanElement>(
  (document.getElementById("loopLimit") || dummyElement())
);
loopLimit.innerText = loopLimitRange.value;
loopLimitRange.addEventListener("input", () => {
  const value = loopLimitRange.value;
  MAX_SOURCE_ITERATIONS = parseInt(value, 10);
  loopLimit.innerText = value;
});

const editorFontSize = <HTMLInputElement>(
  (document.getElementById("editorFontSize") || dummyElement())
);
editorFontSize.value = localStorage.getItem("GJSW-fs") || "16";
const fontSize = <HTMLSpanElement>(
  (document.getElementById("fontSize") || dummyElement())
);
fontSize.innerText = editorFontSize.value + "px";
editorFontSize.addEventListener("input", () => {
  const value = editorFontSize.value;
  localStorage.setItem("GJSW-fs", value);
  myEditor.setFontSize(value);
  fontSize.innerText = value + "px";
  fontSize.style.setProperty("font-size", value, "important");
});
const compilerMsg = document.getElementById("compileMsg") || dummyElement();

const clearCC = () => {
  compilerMsg.innerHTML = "";
  compilerMsg.className = "text-danger";
  (document.getElementById("console-log-text") || dummyElement()).innerHTML =
    "";
};
const download = (filename: string, text: string) => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
const myData = {
  key: "getWebtoolQuestions"
};
window.onload = async () => {
  const responce = await fetch('https://guviv2.codingpuppet.com/model/webtool.php', {
    method: "POST",
    body: JSON.stringify(myData),
  });
  const res = await responce.json();
  const myObj = new Question(res);
  myQuestions.setQuestions(myObj);
  (document.querySelector("#totalQuestions") || dummyElement()).innerHTML =
    "" + myObj.totalPage();
  feedQuestion();
  document.querySelector("#editor")?.addEventListener("click", () => {
    scrollEditor("top");
  });
};

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

const validateMail = (email: string) => {
  let atposition = email.indexOf("@");
  let atPosition2 = email.lastIndexOf("@");
  let dotposition = email.lastIndexOf(".");
  let space = email.indexOf(" ");
  if (
    space >= 0 ||
    atPosition2 !== atposition ||
    atposition < 1 ||
    dotposition < atposition + 2 ||
    dotposition + 2 >= email.length
  ) {
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
const manageNavBtn = (page: number, total: number) => {
  document.querySelectorAll(".nav-btn")[0]["disabled"] = !page;
  document.querySelectorAll(".nav-btn")[1]["disabled"] = !(-total + page + 1);
};
const feedQuestion = async () => {
  myEditor.getEditor().setValue("");
  let myObj = myQuestions.getQuestions();
  manageNavBtn(myObj.getPage(), myObj.totalPage());
  (document.querySelector("#questionNo") || dummyElement()).innerHTML =
    1 + myObj.getPage();
  const questionDiv = document.getElementById("question") || dummyElement();
  const testcaseDiv = document.getElementById("testcases") || dummyElement();
  testcaseDiv.innerHTML = "";
  const question = myObj.getQuestion();
  questionDiv.innerHTML = question.question;
  //   const solutionRes = await fetch(
  //     `${BASE_URL}isSubmitted?email=${user.getMail()}&questionId=${question._id}`,
  //     {
  //       method: "GET",
  //     }
  //   );
  //   const solution = await solutionRes.json();
  //   question.template = solution.solution || question.template;
  const solved = sessionStorage.getItem("jsWarmupSolution" + myObj.getQuestionId());
  let template = solved || question.template + "\n/*\nLines For TestCase\n";
  question.testCases.forEach((testcase, ind) => {
    const myDiv = document.createElement("div");
    myDiv.className = "p-2 bd-highlight g-2 testcase";
    myDiv.id = "test" + ind;
    myDiv.innerHTML = `
        <div class = "d-flex justify-content-between align-items-center">
          <span class="p-2 bd-highlight">${testcase.output}</span>
          <i id="test${ind}i" class=""></i>
        </div>
    `;
    if (!solved) {
      template += `\n${testcase.input}`;
    }
    testcaseDiv?.appendChild(myDiv);
  });
  template += solved ? "" : "\n*/";
  const options = {
    indent_size: 1,
    space_in_empty_paren: true,
    indent_with_tabs: true,
    indent_empty_lines: true,
  };
  template = js_beautify(template, options);
  myEditor.getEditor().setValue(template);
  scrollEditor("top");
  clearCC();
};

const prevPage = () => {
  let myObj = myQuestions.getQuestions();
  myObj.prevPage();
};

const nextPage = () => {
  let myObj = myQuestions.getQuestions();
  myObj.nextPage();
};

const initFunc = function (interpreter, globalObject) {
  const x = interpreter.nativeToPseudo(console);
  interpreter.setProperty(globalObject, "console", x);
};
const compile = (myCode: string, testcase: { input: string }) => {
  (document.getElementById("console-log-div") || dummyElement()).style.display =
    "inline-block";
  compilerMsg.innerHTML = "Compiling....";
  return new Promise((resolve, reject) => {
    myCode = babel.transform(myCode + "\n" + testcase.input, babelOptions).code;
    let myInterpreter = getInterpreter(myCode, initFunc);
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

const runCode = () => {
  (document.getElementById("nav-output-tab") || dummyElement()).click();
  // (<HTMLButtonElement>(
  //   (document.getElementById("runCode") || dummyElement())
  // )).disabled = true;
  document.querySelectorAll(".top-bar>*>[type=button]").forEach((element) => {
    (<HTMLButtonElement>element).disabled = true;
  });
  clearCC();
  let myObj = myQuestions.getQuestions();
  let testcases = myObj.getTestCases();
  let myCode = myEditor.getEditor().getValue();
  sessionStorage.setItem(
    "jsWarmupSolution" + myObj.getQuestionId(),
    myCode.replace(/^\s*\n/gm, "")
  );
  compile(myCode, testcases[0])
    .then(
      (value) => {
        console.log(value);
        compilerMsg.innerHTML = "";
        if (
          (document.getElementById("console-log-text") || dummyElement())
            .innerText == ""
        ) {
          compilerMsg.innerHTML = "Compilation is Successfull";
          compilerMsg.className = "text-success";
          console.warn("There is no conosle statement to print the output");
        }
      },
      (error) => {
        compilerMsg.innerText = error;
        compilerMsg.className = "text-danger";
        // console.error(error);
      }
    )
    .finally(() => {
      scrollEditor();
      document
        .querySelectorAll(".top-bar>*>[type=button]")
        .forEach((element) => {
          (<HTMLButtonElement>element).disabled = false;
        });
    });
};
const submitCode = () => {
  document.querySelectorAll(".top-bar>*>[type=button]").forEach((element) => {
    (<HTMLButtonElement>element).disabled = true;
  });
  (document.getElementById("nav-testcases-tab") || dummyElement()).click();
  let myObj = myQuestions.getQuestions();
  let testcases = myObj.getTestCases();
  let myCode = myEditor.getEditor().getValue();
  sessionStorage.setItem(
    "jsWarmupSolution" + myObj.getQuestionId(),
    myCode.replace(/^\s*\n/gm, "")
  );
  compile(myCode, testcases[0])
    .then(
      () => {
        clearCC();
        testcases.forEach((val, ind) => {
          const executable_code = babel.transform(
            myCode + "\n" + val.input,
            babelOptions
          ).code;
          let myInterpreter = getInterpreter(executable_code, initFunc);
          // myInterpreter.appendCode(val.input);
          console["head"]("For testcase :::: ", val.input);
          myInterpreter.run();
          const testcaseInd =
            document.getElementById("test" + ind) || dummyElement();
          const testcaseIcon =
            document.querySelector("#test" + ind + "i") || dummyElement();
          if (testcases[ind].output === myInterpreter.value) {
            testcaseInd.className = "p-2 bd-highlight testcase g-2 pass";
            testcaseIcon.className = "bi bi-check-circle-fill text-success";
          } else {
            testcaseInd.className = "p-2 bd-highlight testcase g-2 fail";
            testcaseIcon.className = "bi bi-x-circle-fill text-danger";
          }
        });
      },
      (error) => {
        compilerMsg.innerText = error;
        // console.error(error);
      }
    )
    .finally(() => {
      scrollEditor();
      document
        .querySelectorAll(".top-bar>*>[type=button]")
        .forEach((element) => {
          (<HTMLButtonElement>element).disabled = false;
        });
    });
};

// Start file download.
const htmlToText = (html: string) => {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
};
const initiateDownload = () => {
  download(
    `GUVI WarmUp - ${myQuestions.getQuestions().getPage()}.${
      (<HTMLInputElement>document.querySelector("#file-type-select")).value
    }`,
    `/* ${htmlToText(myQuestions.getQuestions().getQuestion().question)} */

${js_beautify(myEditor.getEditor().getValue(), {
  indent_size: 1,
  space_in_empty_paren: true,
  indent_with_tabs: true,
  indent_empty_lines: true,
})}`
  );
};
