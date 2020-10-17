/**************utility functions */
function getWholeMatches(string, startString, endString) {
  // Return an array of strings with the given start and end,
  // with the start and end strings included.
  var matches = [];
  var substr = string;
  var lastIndex = -1;

  if (endString instanceof RegExp) {
    while (true) {
      if (lastIndex != -1) {
        substr = substr.substring(lastIndex, substr.length);
      }
      let startStr = substr.match(startString);
      if (!startStr || !startStr.length) {
        break;
      } else startStr = startStr[0];
      let endStr = substr.match(endString);
      if (!endStr || !endStr.length) break;
      else endStr = endStr[0];

      var startIndex = substr.search(startStr);

      var endIndex = substr.search(endStr) + endStr.length;
      if (startIndex == -1 || endIndex == -1) {
        break;
      }
      var match = substr.substring(startIndex, endIndex);
      matches.push(match);
      lastIndex = endIndex;
    }
  } else {
    while (true) {
      if (lastIndex != -1) {
        substr = substr.substring(lastIndex, substr.length);
      }
      var startIndex = substr.search(startString);

      var endIndex = substr.search(endString) + endString.length;
      if (startIndex == -1 || endIndex == -1) {
        break;
      }
      var match = substr.substring(startIndex, endIndex);
      matches.push(match);
      lastIndex = endIndex;
    }
  }
  return matches;
}
function imageSize(e)
{
  
  if(e.files[0].size> 102400)
  {
    window.cvNotify('Image should be less than 100kb.','warning');
    $(e).val(null)
    return false;
  }
  
}
function getStringBetween(string, start, end) {
  if (end instanceof RegExp) {
    var startString = string.match(start)[0];
    var endString = string.match(end)[0];

    return string.substr(
      startString.length,
      string.length - endString.length - startString.length
    );
  } else {
    return string.substr(
      start.length,
      string.length - end.length - start.length
    );
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function autofitIframe(frame) {
  let height = frame.contentWindow.document.body.scrollHeight;
  if (height > 150 && height < 600) {
    frame.style.height = height + 24 + "px";
  } else if (height > 600) {
    frame.style.height = "600px";
  }
}

function showPreloader(nobg) {
  let preloader = $("#preloader");
  if (nobg) {
    preloader.css("background-color", "rgba(0,0,0,0)");
  } else {
    preloader.css("background-color", "rgba(0,0,0,0.75)");
  }
  preloader.show();
}

function hidePreloader() {
  $("#preloader").hide();
}

/************** End Utility functions */
/**mcq question */
function initMcqQuestion() {
  $(".quiz-mcq:not([data-correct-answer-shown])").each(function(index, el) {
   
    var answer = el.dataset.answer.replace("\\", "");
    var correctAnswer = el.dataset.option.replace("\\","");
    var answerElement = document.createElement("p");
    answerElement.textContent = "Correct answer: option" + correctAnswer;
    el.setAttribute("data-correct-answer-shown", "true");
    el.appendChild(answerElement);
  });
  $(".lms-mcq-options button").unbind("click");
  $(".lms-mcq-options button").click(function(e) {
    $($($(this.parentElement).siblings()).find('button')).removeClass('lms-mcq-selected-answer')
    $($($(this.parentElement).siblings()).find('button')).removeClass('lms-mcq-wrong-answer')
    $(this.parentElement.parentElement)
      .find(".mcq-description")
      .css("display", "flex");
      let correctOptionsIndex = ($(this.parentElement).index()+1);
    
      
    if (
      (this.innerText ==
      this.parentElement.parentElement.getAttribute("data-answer"))||(correctOptionsIndex ==this.parentElement.parentElement.parentElement.getAttribute("data-option")))
     {
      //$(this.parentElement.parentElement).find(".lms-correct-ans-feedback").css("display", "flex");
      //$(this.parentElement.parentElement).find(".lms-wrong-ans-feedback").hide();

      $(this).addClass("lms-mcq-selected-answer");
      let point = $("#point").text();
      point = 0; //parseInt(point);
      point =
        point +
        parseInt(this.parentElement.parentElement.getAttribute("data-point"));
      $("#point").text(point);

      // Show correct modal
      var correctModal = $("#qotd-submitted-modal");
      if (correctModal.length) {
        correctModal
          .prepareTransition({ property: "opacity" })
          .addClass("modal-shown");
      }
    } else {
      let testimonialElements = $(".radiocontainer");
      for (var i = 0; i < testimonialElements.length; i++) {
        var element = testimonialElements.eq(i);
        //console.log(element.text());
        if (
          element.text() ==
          this.parentElement.parentElement.getAttribute("data-answer")
        ) {
          $(element).addClass("lms-mcq-selected-answer");
          break;
        }
        //do something with element
      }

      
      // $(this.parentElement.parentElement).find(".lms-correct-ans-feedback").hide();
      //  $(this.parentElement.parentElement).find(".lms-wrong-ans-feedback").css("display", "flex");
      $(this).addClass("lms-mcq-wrong-answer");
    }
    //  console.log($(this.parentElement.parentElement.parentElement.parentElement).find(".nextbtns").removeAttr('disabled'));
    // $(this.parentElement.parentElement).find(".radiocontainer").attr("disabled","true");
    // $(".radiocontainer").attr("disabled","true");
    let que_id = this.parentElement.parentElement.parentElement.parentElement.getAttribute(
      "data-set"
    );

    let user_id = $("#user_id").val();
    let p = parseInt(
      this.parentElement.parentElement.getAttribute("data-point")
    );
    // console.log(que_id+' '+user_id+' '+ p);
    //ajax code to sent data to server
    let quiz_id = $("#quiz_id").val();
    /*  $.ajax({
      url: "/api/user/insertQuizResult",
      data: {user_id:user_id,point:p,que_id:que_id,quiz_id:quiz_id},
      type: "POST",
      cache: false,
      dataType: "text",
      success: function(data) {
        data = JSON.parse(data);
        $("#point").html(data.data[0].points);
      }
  });*/
  });
}

function initMcqQuizzes() {
  // Multiple choice questions
  $(".lms-mcq-options button").unbind("click");
  $(".lms-mcq-options button").click(function(e) {
    $(this)
      .siblings()
      .removeClass("lms-mcq-selected-answer");
    $(this).addClass("lms-mcq-selected-answer");

    $(this.parentElement.parentElement)
      .find(".submit-mcq-btn")
      .attr("data-selected-answer", e.currentTarget.textContent);
  });

  $(".submit-mcq-btn").unbind("click");
  $(".submit-mcq-btn").click(function(e) {
    if (
      e.currentTarget.dataset.selectedAnswer ==
      e.currentTarget.parentElement.dataset.answer
    ) {
      $(e.currentTarget.parentElement)
        .find(".lms-correct-ans-feedback")
        .css("display", "flex");
      $(e.currentTarget.parentElement)
        .find(".lms-wrong-ans-feedback")
        .hide();
    } else {
      $(e.currentTarget.parentElement)
        .find(".lms-correct-ans-feedback")
        .hide();
      $(e.currentTarget.parentElement)
        .find(".lms-wrong-ans-feedback")
        .css("display", "flex");
    }
  });
}
function initFillQuizzes() {
  $(".quiz-item:not([data-correct-answer-shown])").each(function(index, el) {
    var answer = el.dataset.answer.replace("\\", "");
    var answerElement = document.createElement("p");
    answerElement.textContent = "Correct answer: " + answer;
    el.setAttribute("data-correct-answer-shown", "true");
    el.appendChild(answerElement);
  });

  $(".lms-fwo-options button").unbind("click");
  $(".lms-fwo-options button").click(function(e) {
    $(e.currentTarget.parentElement.parentElement)
      .find(".fwo-active-blank")
      .text(e.currentTarget.textContent);
    var nextBlank = $(e.currentTarget.parentElement.parentElement)
      .find(".fwo-active-blank")
      .nextAll(".fwo-blank");
    $(e.currentTarget.parentElement.parentElement)
      .find(".fwo-active-blank")
      .removeClass("fwo-active-blank");
    if (nextBlank.length > 0) {
      $(nextBlank[0]).addClass("fwo-active-blank");
    } else {
      $(e.currentTarget.parentElement.parentElement)
        .find(".fwo-blank")
        .addClass("fwo-active-blank");
    }
    let length = $(e.currentTarget.parentElement.parentElement).find(
      ".fwo-blank"
    ).length;
    let divs = $(e.currentTarget.parentElement.parentElement).find(
      ".fwo-blank"
    ); //document.querySelectorAll(".fwo-blank");

    for (var i = 0; i < length; i++) {
      if (divs[i].innerText == "" || divs[i].innerText == null) {
        return false;
      }
    }

    $(e.currentTarget.parentElement.parentElement)
      .find(".fwo-blank")
      .attr("contenteditable", false);
    // $(e.currentTarget.parentElement.parentElement).find(".radiocontainer").attr("disabled",true);
    //console.log($(this.parentElement.parentElement).find(".qtext").text());
    //console.log(this.parentElement.parentElement.getAttribute("data-answer"));
    if (
      $(this.parentElement.parentElement)
        .find(".qtext")
        .text() == this.parentElement.parentElement.getAttribute("data-answer")
    ) {
      // $(this.parentElement.parentElement).find(".lms-correct-ans-feedback").css("display", "flex");
      //  $(this.parentElement.parentElement).find(".lms-wrong-ans-feedback").hide();
      // let point = $("#point").text();
      // point = parseInt(point);
      //  point = point + parseInt(this.parentElement.parentElement.getAttribute("data-point"));
      // $("#point").text(point);
      /*var correctModal = $('#qotd-submitted-modal');
        if(correctModal.length) {
          correctModal.prepareTransition({ property: 'opacity'}).addClass('modal-shown');
        }*/
    } else {
      //  $(this.parentElement.parentElement).find(".lms-correct-ans-feedback").hide();
      //  $(this.parentElement.parentElement).find(".lms-wrong-ans-feedback").css("display", "flex");
    }
    let nodes = this.parentElement.getElementsByTagName("*");
    for (var i = 0; i < nodes.length; i++) {
      // nodes[i].disabled = true;
    }
    let que_id = this.parentElement.parentElement.parentElement.getAttribute(
      "data-set"
    );
    let user_id = $("#user_id").val();
    let quiz_id = $("#quiz_id").val();
    //console.log(que_id+' '+user_id);
    //ajax code to sent data to server
    let p = parseInt(
      this.parentElement.parentElement.getAttribute("data-point")
    );

    /*$.ajax({
         url: "/api/user/insertQuizResult",
         data: {user_id:user_id,point:p,que_id:que_id,quiz_id:quiz_id},
         type: "POST",
         cache: false,
         dataType: "text",
         success: function(data) {
           console.log('here');
           data = JSON.parse(data);
         //  console.log(data);
           $("#point").html(data.data[0].points);
         }
     });*/

    $(this.parentElement.parentElement.parentElement.parentElement)
      .find(".nextbtns")
      .removeAttr("disabled");
    $(this.parentElement.parentElement)
      .find(".lms-description")
      .css("display", "flex");
  });

  $(".fwo-blank").unbind("click");
  $(".fwo-blank").click(function(e) {
    $(e.currentTarget.parentElement)
      .find(".fwo-blank")
      .removeClass("fwo-active-blank");
    $(e.currentTarget).addClass("fwo-active-blank");
  });
}

function initFwoQuizzes() {
  // Fill blanks with given options
  $(".lms-fwo-options button").unbind("click");

  $(".lms-fwo-options button").click(function(e) {
    $(e.currentTarget.parentElement.parentElement)
      .find(".fwo-active-blank")
      .text(e.currentTarget.textContent);

    var nextBlank = $(e.currentTarget.parentElement.parentElement)
      .find(".fwo-active-blank")
      .nextAll(".fwo-blank");

    $(e.currentTarget.parentElement.parentElement)
      .find(".fwo-active-blank")
      .removeClass("fwo-active-blank");
    if (nextBlank.length > 0) {
      $(nextBlank[0]).addClass("fwo-active-blank");
    } else {
      $(e.currentTarget.parentElement.parentElement)
        .find(".fwo-blank")
        .first()
        .addClass("fwo-active-blank");
    }
  });

  $(".fwo-blank").unbind("click");
  $(".fwo-blank").click(function(e) {
    $(e.currentTarget.parentElement)
      .find(".fwo-blank")
      .removeClass("fwo-active-blank");
    $(e.currentTarget).addClass("fwo-active-blank");
  });

  $(".submit-fwo-btn").unbind("click");
  $(".submit-fwo-btn").click(function(e) {
    var correctAns = e.currentTarget.parentElement.dataset.answer;

    var givenAns = $(e.currentTarget.parentElement)
      .find(".fwo-statement span")
      .text();
    var correctAnsRegex = new RegExp(correctAns);
    //if (givenAns == correctAns) {
    if (givenAns.match(correctAnsRegex)) {
      $(e.currentTarget.parentElement)
        .find(".lms-correct-ans-feedback")
        .css("display", "flex");
      $(e.currentTarget.parentElement)
        .find(".lms-wrong-ans-feedback")
        .hide();
    } else {
      $(e.currentTarget.parentElement)
        .find(".lms-correct-ans-feedback")
        .hide();
      $(e.currentTarget.parentElement)
        .find(".lms-wrong-ans-feedback")
        .css("display", "flex");
    }
  });
}

/*********** CODE EDITORS */

var codeMirrors = new Object();
function getLmsEditorMarkupFromTemplate(editorTemplate) {
  let hasHtmlFile = editorTemplate.indexOf("%htmlfile%") >= 0;
  editorTemplate = editorTemplate.replace(
    "%editor%",
    '<div class="lms-editor-container">'
  );
  if (hasHtmlFile) {
    editorTemplate = editorTemplate.replace(
      "%tabs%",
      '<div class="lms-editor-tabs">'
    );
    editorTemplate = editorTemplate.replace(
      "%htmltab%",
      '<a href data-cm-wrapper-id="html-code-wrapper" class="lms-editor-active-tab">'
    );
    editorTemplate = editorTemplate.replace("%endhtmltab%", "</a>");

    editorTemplate = editorTemplate.replace(
      "%jstab%",
      '<a href data-cm-wrapper-id="js-code-wrapper">'
    );
    editorTemplate = editorTemplate.replace("%endjstab%", "</a>");
  } else {
    editorTemplate = editorTemplate.replace(
      "%tabs%",
      '<div class="lms-editor-tabs"><a href data-cm-wrapper-id="html-code-wrapper">index.html</a>'
    );
    editorTemplate = editorTemplate.replace(
      "%jstab%",
      '<a href data-cm-wrapper-id="js-code-wrapper" class="lms-editor-active-tab">'
    );
    editorTemplate = editorTemplate.replace("%endjstab%", "</a>");
  }
  editorTemplate = editorTemplate.replace(
    "%csstab%",
    '<a href data-cm-wrapper-id="css-code-wrapper">'
  );
  editorTemplate = editorTemplate.replace("%endcsstab%", "</a>");

  editorTemplate = editorTemplate.replace(
    "%endtabs%",
    '<i class="flex-filler"></i><button class="lms-editor-run-btn">RUN</button></div>'
  );

  if (hasHtmlFile) {
    editorTemplate = editorTemplate.replace(
      "%files%",
      '<div class="lms-editors-wrapper">'
    );
    editorTemplate = editorTemplate.replace(
      "%htmlfile%",
      '<div class="html-code-wrapper active-lms-editor-tab-content">'
    );
    editorTemplate = editorTemplate.replace("%endhtmlfile%", "</div>");
  } else {
    let defaultHtmlCode =
      '<!doctype>\n<html>\n\t<head>\n\t\t<title>My website</title>\n\t\t<script src="script.js"></script>\n\t</head>\n\t<body>\n\t</body>\n</html>';
    defaultHtmlCode = defaultHtmlCode
      .replace(/&/g, "&amp;")
      .replace(/>/g, "&gt;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
    editorTemplate = editorTemplate.replace(
      "%files%",
      '<div class="lms-editors-wrapper"><div class="html-code-wrapper">' +
        defaultHtmlCode +
        "</div>"
    );
  }

  editorTemplate = editorTemplate.replace(
    "%cssfile%",
    '<div class="css-code-wrapper">'
  );
  editorTemplate = editorTemplate.replace("%endcssfile%", "</div>");
  if (hasHtmlFile)
    editorTemplate = editorTemplate.replace(
      "%jsfile%",
      '<div class="js-code-wrapper">'
    );
  else
    editorTemplate = editorTemplate.replace(
      "%jsfile%",
      '<div class="js-code-wrapper active-lms-editor-tab-content">'
    );
  editorTemplate = editorTemplate.replace("%endjsfile%", "</div>");
  editorTemplate = editorTemplate.replace("%endfiles%", "</div>");
  editorTemplate = editorTemplate.replace(
    "%endeditor%",
    '<iframe class="lms-editor-output"></iframe></div>'
  );

  return editorTemplate;
}
function getSQLEditorMarkupFromTemplate(editorTemplate) {
  editorTemplate = editorTemplate.replace(
    "%sqleditor%",
    '<div class="lms-editor-container" style="overflow:auto;">' +
      '<div class="lms-editor-tabs">' +
      '<i class="flex-filler"></i>' +
      '<button class="lms-editor-run-btn">RUN</button>' +
      "</div>" +
      '<div class="lms-editors-wrapper">' +
      '<div class="sql-code-wrapper active-lms-editor-tab-content">'
  );
  editorTemplate = editorTemplate.replace(
    "%endsqleditor%",
    '</div></div><div class="lms-editor-output" id="lms-sql-output"></div></div>'
  );
  return editorTemplate;
}

function getPythonEditorMarkupFromTemplate(editorTemplate) {
  editorTemplate = editorTemplate.replace(
    "%pythoneditor%",
    '<div class="lms-editor-container">' +
      '<div class="lms-editor-tabs">' +
      '<i class="flex-filler"></i>' +
      '<button class="lms-editor-run-btn">RUN</button>' +
      "</div>" +
      '<div class="lms-editors-wrapper">' +
      '<div class="python-code-wrapper active-lms-editor-tab-content">'
  );
  editorTemplate = editorTemplate.replace(
    "%endpythoneditor%",
    //'</div></div><iframe src="http://localhost:3500" class="lms-editor-output"></iframe></div>'
    '</div></div><iframe src="https://pyapi.codevidhya.com" class="lms-editor-output"></iframe></div>'
  );
  return editorTemplate;
}

function getLmsLessonContentWithEditorsRendered(content) {
  //var contentElement = $(".content");
  //var content = contentElement.text();
  var editorTemplates = getWholeMatches(content, "%editor%", "%endeditor%");
  for (var i = 0; i < editorTemplates.length; i++) {
    var markup = getLmsEditorMarkupFromTemplate(editorTemplates[i]);
    content = content.replace(editorTemplates[i], markup);
  }
  var SQLEditorTemplates = getWholeMatches(
    content,
    "%sqleditor%",
    "%endsqleditor%"
  );

  for (var i = 0; i < SQLEditorTemplates.length; i++) {
    var markup = getSQLEditorMarkupFromTemplate(SQLEditorTemplates[i]);
    content = content.replace(SQLEditorTemplates[i], markup);
  }

  var pythonEditorTemplates = getWholeMatches(
    content,
    "%pythoneditor%",
    "%endpythoneditor%"
  );
  for (var i = 0; i < pythonEditorTemplates.length; i++) {
    var markup = getPythonEditorMarkupFromTemplate(pythonEditorTemplates[i]);
    content = content.replace(pythonEditorTemplates[i], markup);
  }

  return content;
}

function getLmsPrismMarkupFromTemplate(template, start, end, language) {
  template = template.replace(/</g, "&lt;");
  template = template.replace(/>/g, "&gt;");
  template = template.replace(start, '<code class="' + language + '">');
  template = template.replace(end, "</code>");
  return template;
}

function getLmsLessonContentWithCodeSnippetsPrismed(content) {
  var htmlPrismTemplates = getWholeMatches(
    content,
    "%htmlsnippet%",
    "%endhtmlsnippet%"
  );
  var cssPrismTemplates = getWholeMatches(
    content,
    "%csssnippet%",
    "%endcsssnippet%"
  );
  var jsPrismTemplates = getWholeMatches(
    content,
    "%jssnippet%",
    "%endjssnippet%"
  );
  var pyPrismTemplates = getWholeMatches(
    content,
    "%pysnippet%",
    "%endpysnippet%"
  );
  var sqlPrismTemplates = getWholeMatches(
    content,
    "%sqlsnippet%",
    "%endsqlsnippet%"
  );
  for (var i = 0; i < htmlPrismTemplates.length; i++) {
    var markup = getLmsPrismMarkupFromTemplate(
      htmlPrismTemplates[i],
      "%htmlsnippet%",
      "%endhtmlsnippet%",
      "language-html"
    );
    content = content.replace(htmlPrismTemplates[i], markup);
  }
  for (var i = 0; i < cssPrismTemplates.length; i++) {
    var markup = getLmsPrismMarkupFromTemplate(
      cssPrismTemplates[i],
      "%csssnippet%",
      "%endcsssnippet%",
      "language-css"
    );
    content = content.replace(cssPrismTemplates[i], markup);
  }
  for (var i = 0; i < jsPrismTemplates.length; i++) {
    var markup = getLmsPrismMarkupFromTemplate(
      jsPrismTemplates[i],
      "%jssnippet%",
      "%endjssnippet%",
      "language-javascript"
    );
    content = content.replace(jsPrismTemplates[i], markup);
  }
  for (var i = 0; i < pyPrismTemplates.length; i++) {
    var markup = getLmsPrismMarkupFromTemplate(
      pyPrismTemplates[i],
      "%pysnippet%",
      "%endpysnippet%",
      "language-python"
    );

    content = content.replace(pyPrismTemplates[i], markup);
  }
  for (var i = 0; i < sqlPrismTemplates.length; i++) {
    var markup = getLmsPrismMarkupFromTemplate(
      sqlPrismTemplates[i],
      "%sqlsnippet%",
      "%endsqlsnippet%",
      "language-sql"
    );

    content = content.replace(sqlPrismTemplates[i], markup);
  }

  // Remove newline between <pre> and <code> and just after <code>
  content = content.replace(
    /<pre>[\s\S]?\s*<code(.*?)>[\s\S]*?(.)/g,
    "<pre><code$1>$2"
  );

  // Remove newline between </code> and </pre> and just before </code>
  content = content.replace(
    /(.)[\s]*?<\/code>[\s\S]?\s*<\/pre>/g,
    "$1</code></pre>"
  );
  return content;
}

function initLmsEditors() {
  // Initialize CodeMirror instances using code included in the editor markup.
  var editorContainers = $(".lms-editor-container");
  for (var i = 0; i < editorContainers.length; i++) {
    let editorContainer = $(editorContainers[i]);
    if (editorContainer.data("alreadyProcessed") == true) {
      continue; // Don't process editors more than once
    }
    var editorId = i;
    var cmInstancesForGroup = []; // CodeMirror instances for a single editor, e.g. group of index.html, style.css, script.js
    editorContainer.attr("data-editor-id", editorId);
    editorContainer.attr("data-already-processed", "true");

    var tabs = $(editorContainers[i]).find(".lms-editor-tabs > a");
    var editors = $(editorContainers[i]).find(".lms-editors-wrapper > div");
    for (var j = 0; j < editors.length; j++) {
      let fileName_ = $(tabs[j]).text();
      var cmMode = "htmlmixed";

      if ($(editors[j]).hasClass("html-code-wrapper")) cmMode = "htmlmixed";
      else if ($(editors[j]).hasClass("css-code-wrapper")) cmMode = "css";
      else if ($(editors[j]).hasClass("js-code-wrapper")) cmMode = "javascript";
      else if ($(editors[j]).hasClass("python-code-wrapper")) cmMode = "python";
      else if ($(editors[j]).hasClass("sql-code-wrapper"))
        cmMode = "text/x-mysql";

      var code = editors[j].textContent.trim();
      editors[j].textContent = "";
      var cm = CodeMirror(editors[j], {
        value: code + "\n",
        mode: cmMode,
        lineNumbers: true,
        styleActiveLine: true,
        styleActiveSelected: true,
        styleSelectedText: true,
        autoCloseTags: true,
        autoCloseBrackets: true,

        line: true,
        connect: "align",
        lineWrapping: true,
        matchTags: { bothTags: true },
        colorpicker: true,
        fileName: fileName_
      });
      cmInstancesForGroup.push(cm);
    }

    codeMirrors[editorId] = cmInstancesForGroup;
  }

  $(".lms-editor-tabs a").unbind("click");
  $(".lms-editor-tabs a").click(function(e) {
    e.preventDefault();
    var clickedTabId = event.target.dataset.cmWrapperId;
    $(e.currentTarget.parentElement)
      .find("a")
      .removeClass("lms-editor-active-tab");
    $(e.currentTarget).addClass("lms-editor-active-tab");

    $(e.currentTarget.parentElement.parentElement)
      .find(".lms-editors-wrapper > div")
      .removeClass("active-lms-editor-tab-content");
    $(e.currentTarget.parentElement.parentElement)
      .find(".lms-editors-wrapper > div." + clickedTabId)
      .addClass("active-lms-editor-tab-content");
  });

  $(".lms-editor-tabs .lms-editor-run-btn").unbind("click");
  $(".lms-editor-tabs .lms-editor-run-btn").click(function(e) {
    onClickRunButton(e.currentTarget);
  });

  function onClickRunButton(runBtn) {
    var cvWebSQLOK = !!window.openDatabase;
    var cvWebSQL1 = new w3WebSQLInit();
    $(runBtn.parentElement.parentElement)
      .find(".lms-editor-output")
      .css("display", "block");
    var codemirrors =
      codeMirrors[runBtn.parentElement.parentElement.dataset.editorId];

    var outputHTML;
    var outputCSS;
    var outputJS;
    var sqlQuery;

    var htmlFilename;
    var cssFilename;
    var jsFilename;

    var hasPython = false;
    var hasSql = false;

    for (var i = 0; i < codemirrors.length; i++) {
      let mode = codemirrors[i].options.mode;

      if (mode == "python") {
        var pythonCode = codemirrors[i].getValue();
        var outputIframe = $(runBtn.parentElement.parentElement).find(
          ".lms-editor-output"
        )[0];
        outputIframe =
          outputIframe.contentWindow || outputIframe.contentDocument;

        outputIframe.postMessage(
          { action: "run_script", code: pythonCode },
          "*"
        );

        hasPython = true;
      } else if (mode == "text/x-mysql") {
        sqlQuery = codemirrors[i].getValue();
        if (cvWebSQLOK === true) {
          var outputdiv = $(runBtn.parentElement.parentElement).find(
            ".lms-editor-output"
          )[0];
          //  console.log(outputdiv);
          cvWebSQL1.runLMSSQL(sqlQuery, outputdiv);
        }
        hasSql = true;
      } else {
        switch (mode) {
          case "htmlmixed": {
            outputHTML = codemirrors[i].getValue();
            htmlFilename = getLmsEditorTabText(runBtn, mode);
            break;
          }
          case "css": {
            outputCSS = codemirrors[i].getValue();
            cssFilename = getLmsEditorTabText(runBtn, mode);
            break;
          }
          case "javascript": {
            outputJS = codemirrors[i].getValue();
            jsFilename = getLmsEditorTabText(runBtn, mode);
            break;
          }
        }
      }
    }

    if (!hasPython && !hasSql) {
      if (!outputHTML)
        outputHTML =
          '<html><head><script src="script.js"></script></head><body></body></html>';

      var styleRegexStr =
        '<\\s*link[\\s\\S]*(.*?)href="' +
        cssFilename +
        '"[\\s\\S]*?(.*?)[\\/]*>';
      var styleRegex = new RegExp(styleRegexStr, "g");

      var scriptRegexStr =
        '<\\s*script[\\s\\S]*(.*?)src="' +
        jsFilename +
        '"[\\s\\S]*?(.*?)>[\\s\\S]*?(.*?)<[\\s]*?\\/[\\s]*?script[\\s]*?>';
      var scriptRegex = new RegExp(scriptRegexStr, "g");
      outputHTML = outputHTML.replace(
        styleRegex,
        "<style>" + outputCSS + "</style>"
      );
      outputHTML = outputHTML.replace(
        scriptRegex,
        "<script>" + outputJS + "</script>"
      );

      // Now that we've got the combined code (index.html = index.html+style.css+script.js),
      // Write to the iframe
      var outputIframe = $(runBtn.parentElement.parentElement).find(
        ".lms-editor-output"
      )[0];
      outputIframe.innerHTML = "";
      outputIframe = outputIframe.contentWindow || outputIframe.contentDocument;
      if (outputIframe.document) outputIframe = outputIframe.document;
      outputIframe.open();
      outputIframe.write(outputHTML);
      outputIframe.close();
    }
  }

  function getLmsEditorTabText(runBtn, fileType) {
    switch (fileType) {
      case "htmlmixed": {
        return $(runBtn.parentElement)
          .find("a[data-cm-wrapper-id='html-code-wrapper']")
          .text();
      }
      case "css": {
        return $(runBtn.parentElement)
          .find("a[data-cm-wrapper-id='css-code-wrapper']")
          .text();
      }
      case "javascript": {
        return $(runBtn.parentElement)
          .find("a[data-cm-wrapper-id='js-code-wrapper']")
          .text();
      }
    }
  }
}

/************ HTML render */
function getLmsLessonContentWithHtmlSnippetsRendered(content) {
  var htmlRenderTemplates = getWholeMatches(
    content,
    /<pre>[\s\S]\s*%renderhtml%/,
    /%endrenderhtml%[\s\S]?\s*<\/pre>/
  );
  for (var i = 0; i < htmlRenderTemplates.length; i++) {
    var code = getStringBetween(
      htmlRenderTemplates[i],
      /<pre>[\s\S]\s*%renderhtml%/,
      /%endrenderhtml%[\s\S]?\s*<\/pre>/
    );
    code = code.replace(/"/g, "&quot;");
    content = content.replace(
      htmlRenderTemplates[i],
      '<iframe class="lms-html-render" srcdoc="' +
        code +
        '" onload="autofitIframe(this)"></iframe>'
    );
  }
  return content;
}
/*****get Mcq question */
/** ***get Mcq question */
function _getMcqQuestionMarkupFromTemplate (template) {
    template = template.replace(
      /<pre>[\s\S]?\s*%mcq%/,
      '<div class="quiz-mcq quiz-item" data-answer="'
  )
    template = template.replace(/%answer%/, '')
    template = template.replace('%answer%', '');
    template = template.replace('%endanswer%', '" ');
    template = template.replace("%trueoption%",' data-option="')
    template = template.replace("%endtrueoption%",'" ')
    template = template.replace('%questionpoint%', '" data-point="')
    template = template.replace('%endquestionpoint%', '">')
    template = template.replace('%question%', '<h3 id="qtest">')
    template = template.replace('%endquestion%', '</h3>')
    template = template.replace('%questionimg%', '<img class="mb-3" alt="Responsive image" src="/dynamic/Quizzes/quiz_question_options_images/')
    template = template.replace('%endquestionimg%', '" style="width:180px;"/>')
    template = template.replace('%options%', '<div class="lms-mcq-options" style="text-align:left;border-radius:0px;">')
    template = template.replace(/%option%/g, '<div class="option-container"><button class="btn btn-purple col-sm-8 pl-3 text-left m-1 radiocontainer" style="border-radius:3px;font-size:18px;color:#000;border:none; ">')
    template = template.replace(/%optionimg%/g, '<img  alt="Responsive image" src="/dynamic/Quizzes/quiz_question_options_images/')
    template = template.replace(/%endoptionimg%/g, '" style="width:180px;"/>')
    template = template.replace(/%optiontxt%/g,'<p>')
    template = template.replace(/%endoptiontxt%/g,'</p>')
    template = template.replace(/%endoption%/g, '</button></div>')
    template = template.replace('%endoptions%', '</div>')
    template = template.replace('%description%', '<div><p class="mcq-description">')
    template = template.replace('%enddescription%', '</p></div>')
 template = template.replace(/%endmcq%[\s\S]?\s*<\/pre>/, '</div>')

  return template
}
/** ******** Render MCQ Templates */

/** ***get Mcq question */
function _getMcqQuestionMarkupFromTemplatePreview (template) {
  
 // if (template.indexOf('%optionimg%') == -1) {
  
    template = template.replace(
      /<pre>[\s\S]?\s*%mcq%/,
      '<div class="quiz-mcq quiz-item" data-answer="');
    template = template.replace('%answer%', '');
    template = template.replace('%endanswer%', '" ');
    template = template.replace("%trueoption%",' data-option="')
    template = template.replace("%endtrueoption%",'" ')
    template = template.replace('%questionpoint%', '" data-point="')
    template = template.replace('%endquestionpoint%', '">')
    template = template.replace('%question%', '<h3 id="qtest">')
    template = template.replace('%endquestion%', '</h3>')
    template = template.replace('%questionimg%', '<img  alt="Responsive image" class="mb-3" src="')
    template = template.replace('%endquestionimg%', '"style="width:180px;"/>')
    template = template.replace('%options%', '<div class="lms-mcq-options">')
    template = template.replace(/%option%/g, '<div class="option-container"><button class="radiocontainer btn mb-2 text-left" style="border-radius:3px;">')
    template = template.replace(/%optionimg%/g, '<img  alt="Responsive image" src="')
    template = template.replace(/%endoptionimg%/g, '" style="width:180px;"/>')
    template = template.replace(/%optiontxt%/g,"<p>")
    template = template.replace(/%endoptiontxt%/g,"</p>")
    template = template.replace(/%endoption%/g, '</button></div>')
    template = template.replace('%endoptions%', '</div>')
    template = template.replace('%description%', '<div><p class="mcq-description">')
    template = template.replace('%enddescription%', '</p></div>')
    template = template.replace(/%endmcq%[\s\S]?\s*<\/pre>/, '</div>')

  return template
}


/********** Render MCQ Templates */
function _getMcqMarkupFromTemplate(template) {
  template = template.replace(
    /<pre>[\s\S]?\s*%mcq%/,
    '<div class="lms-quiz-mcq" data-answer="'
  );
  template = template.replace(/%answer%/, '');
  template = template.replace('%endanswer%', '">');
  template = template.replace('%question%', "<h3 id='qtext'>");
  template = template.replace('%endquestion%', '</h3>');
  template = template.replace('%options%', '<div class="lms-mcq-options">');
 template = template.replace(/%option%/g, '<button class="border-none">');
  template = template.replace(/%endoption%/g, '</button>');
  template = template.replace(
    '%endoptions%',
    '</div><button class=" mt-2 submit-mcq-btn border-none">Submit</button>'
  );
  template = template.replace(
    '%correctfeedback%',
    '<div><p class="lms-correct-ans-feedback"><i class="fas fa-check-circle"></i><span>'
  );
  template = template.replace('%endcorrectfeedback%', '</span></p>');
  template = template.replace(
    '%wrongfeedback%',
    '<p class="lms-wrong-ans-feedback"><i class="fas fa-times-circle "></i><span>'
  );
  template = template.replace('%endwrongfeedback%', '</span></p>');
  template = template.replace(/%endmcq%[\s\S]?\s*<\/pre>/, '</div></div>');

  return template;
}

function getQuestionContentWithMcqQuizTemplatesRenderedPreview (content) {
  var mcqQuizTemplates = getWholeMatches(content,
    /<pre>[\s\S]?\s*%mcq%/,
    /%endmcq%[\s\S]?\s*<\/pre>/
  );
  for (var i = 0; i < mcqQuizTemplates.length; i++) {
    var markup = _getMcqQuestionMarkupFromTemplatePreview(mcqQuizTemplates[i]);
    markup = markup.replace(/<\p><\/p>/g, '');
        markup = markup.replace(/<\pre><\/pre>/g, '');
        markup = markup.replace(/<\p><\/p>/g, '');
    content = content.replace(mcqQuizTemplates[i], markup);

  }
  return content;
}

function getQuestionContentWithMcqQuizTemplatesRendered(content) {
  var mcqQuizTemplates = getWholeMatches(
    content,
    /<pre>[\s\S]?\s*%mcq%/,
    /%endmcq%[\s\S]?\s*<\/pre>/
  );
  for (var i = 0; i < mcqQuizTemplates.length; i++) {
    var markup = _getMcqQuestionMarkupFromTemplate(mcqQuizTemplates[i]);
    markup = markup.replace(/<\p><\/p>/g, '');
    markup = markup.replace(/<\pre><\/pre>/g, '');
    markup = markup.replace(/<\p><\/p>/g, '');
    content = content.replace(mcqQuizTemplates[i], markup);
  }
  return content;
}

function getLmsLessonContentWithMcqQuizTemplatesRendered(content) {
  var mcqQuizTemplates = getWholeMatches(
    content,
    /<pre>[\s\S]?\s*%mcq%/,
    /%endmcq%[\s\S]?\s*<\/pre>/
  );

  for (var i = 0; i < mcqQuizTemplates.length; i++) {
    var markup = _getMcqMarkupFromTemplate(mcqQuizTemplates[i]);
    content = content.replace(mcqQuizTemplates[i], markup);
  }
  return content;
}
/*******Render Quiz */
function _getQuizFwoMarkupFromTemplate(template) {
  template = template.replace(
    /<pre>[\s\S]?\s*%fwo%/,
    '<div class="quiz-item quiz_fill_in_blank" data-answer="'
  );
  template = template.replace("%answer%", "");
  template = template.replace("%endanswer%%questionpoint%", '" data-point="');
  template = template.replace("%endquestionpoint%", '">');

  template = template.replace("%question%", "<h3>");
  template = template.replace("%endquestion%", "</h3>");
  template = template.replace("%statement%", '<p class="fwo-statement qtext">');
  template = template.replace(/%br%/g, "<br>");
  template = template.replace(/%words%/g, "<span>");
  template = template.replace(/%endwords%/g, "</span>");
  template = template.replace(
    /%blank%/g,
    '<span class="fwo-blank fwo-blank-normal my-1" contenteditable="true"></span>'
  );
  template = template.replace(
    /%blanksmall%/g,
    '<span class="fwo-blank fwo-blank-small my-1" contenteditable="true"></span>'
  );
  template = template.replace(
    /%blanklarge%/g,
    '<span class="fwo-blank fwo-blank-large my-1" contenteditable="true"></span>'
  );
  template = template.replace("%endstatement%", "</p>");

  template = template.replace("%options%", '<div class="lms-fwo-options">');
  template = template.replace(/%option%/g, '<button class="option btn btn-gray" style="border:none;">');
  template = template.replace(/%endoption%/g, "</button>");
  //template = template.replace("%endoptions%",'</div><button class="submit-fwo-btn">Submit</button>');
  template = template.replace("%endoptions%", "</div>");
  template = template.replace(
    "%description%",
    '<div><p class="lms-description explanation"><pre>'
  );
  template = template.replace("%enddescription%", "</pre></p></div>");
  template = template.replace(
    "%correctfeedback%",
    '<div><p class="lms-correct-ans-feedback"><i class="fas fa-check-circle"></i><span>'
  );
  template = template.replace("%endcorrectfeedback%", "</span></p>");
  template = template.replace(
    "%wrongfeedback%",
    '<p class="lms-wrong-ans-feedback"><i class="fas fa-times-circle"></i><span>'
  );
  template = template.replace("%endwrongfeedback%", "</span></p>");
  template = template.replace(/%endfwo%[\s\S]?\s*<\/pre>/, "</div></div>");

  // Make the first blank active
  template = template.replace(
    /<span class="fwo-blank (.*?)"/,
    '<span class="fwo-blank $1 fwo-active-blank"'
  );

  return template;
}
/********** Render 'Fill With Options' Templates */
function _getFwoMarkupFromTemplate(template) {
  template = template.replace(
    /<pre>[\s\S]?\s*%fwo%/,
    '<div class="lms-quiz-fwo" data-answer="'
  );
  template = template.replace("%answer%", "");
  template = template.replace("%endanswer%", '">');
  template = template.replace("%question%", "<h3>");
  template = template.replace("%endquestion%", "</h3>");
  template = template.replace("%statement%", '<p class="fwo-statement">');
  template = template.replace(/%br%/g, "<br>");
  template = template.replace(/%words%/g, "<span>");
  template = template.replace(/%endwords%/g, "</span>");
  template = template.replace(
    /%blank%/g,
    '<span class="fwo-blank fwo-blank-normal" contenteditable="true"></span>'
  );
  template = template.replace(
    /%blanksmall%/g,
    '<span class="fwo-blank fwo-blank-small" contenteditable="true"></span>'
  );
  template = template.replace(
    /%blanklarge%/g,
    '<span class="fwo-blank fwo-blank-large" contenteditable="true"></span>'
  );
  template = template.replace("%endstatement%", "</p>");

  template = template.replace("%options%", '<div class="lms-fwo-options">');
  template = template.replace(/%option%/g, "<button>");
  template = template.replace(/%endoption%/g, "</button>");
  template = template.replace(
    "%endoptions%",
    '</div><button class="submit-fwo-btn">Submit</button>'
  );
  template = template.replace(
    "%correctfeedback%",
    '<div><p class="lms-correct-ans-feedback"><i class="fas fa-check-circle"></i><span>'
  );
  template = template.replace("%endcorrectfeedback%", "</span></p>");
  template = template.replace(
    "%wrongfeedback%",
    '<p class="lms-wrong-ans-feedback"><i class="fas fa-times-circle"></i><span>'
  );
  template = template.replace("%endwrongfeedback%", "</span></p>");
  template = template.replace(/%endfwo%[\s\S]?\s*<\/pre>/, "</div></div>");

  // Make the first blank active
  template = template.replace(
    /<span class="fwo-blank (.*?)"/,
    '<span class="fwo-blank $1 fwo-active-blank"'
  );

  return template;
}
/* Quiz preview */
function getQuizRepresentation(content) {
  var QuizTemplates = getWholeMatches(
    content,
    /<pre>[\s\S]?\s*%fwo%/,
    /%endfwo%[\s\S]?\s*<\/pre>/
  );

  //console.log(QuizTemplates);
  for (var i = 0; i < QuizTemplates.length; i++) {
    var markup = _getQuizFwoMarkupFromTemplate(QuizTemplates[i]);
    content = content.replace(QuizTemplates[i], markup);
  }
  return content;
}
/* end quiz preview*/
/***Video Preview */
function getLMSLessonContentWithVideo(content){
  var videoRender = getWholeMatches(content,/%rendervideo%/,/%endrendervideo%/);
  let markup;
  for (var i = 0; i < videoRender.length; i++) {
    markup = videoRender[i];
    markup = markup.replace(/%rendervideo%/," ");
    markup =markup.replace(/;/g,"")
    markup =markup.replace(/%endrendervideo%/," ");
    markup =markup.replace(/&amp/g,'&')
    markup =markup.replace(/&gt/g,'>')
    markup =markup.replace(/&lt/g,'<')
    markup =markup.replace(/&quot/g,'"')
    content = content.replace(videoRender[i], markup);
  }
 return content;  
}
/***End Video Preview */
function getLmsLessonContentWithFwoQuizTemplatesRendered(content) {
  // console.log(content);
  var fwoQuizTemplates = getWholeMatches(
    content,
    /<pre>[\s\S]?\s*%fwo%/,
    /%endfwo%[\s\S]?\s*<\/pre>/
  );

  for (var i = 0; i < fwoQuizTemplates.length; i++) {
    var markup = _getFwoMarkupFromTemplate(fwoQuizTemplates[i]);
    content = content.replace(fwoQuizTemplates[i], markup);
  }
  return content;
}

function getLmsContentWithAllTemplatesRendered(content) {
  content = getLmsLessonContentWithEditorsRendered(content);
  content = getLmsLessonContentWithCodeSnippetsPrismed(content);
  content = getLmsLessonContentWithHtmlSnippetsRendered(content);
  content =getLMSLessonContentWithVideo(content);
  content = getLmsLessonContentWithMcqQuizTemplatesRendered(content);
  content = getLmsLessonContentWithFwoQuizTemplatesRendered(content);

  content = content.replace(/style="font-size:[\s]*16px"/g, "");
  content = content.replace(/<a.*name="examples_no">\d*<\/a>/g, "");
  return content;
}
function getQuizContentWithAllTemplateRendered(content) {
  content = getQuizRepresentation(content);
  content = getQuestionContentWithMcqQuizTemplatesRendered(content);
  content = content.replace(/style="font-size:[\s]*16px"/g, "");
  content = content.replace(/<a.*name="examples_no">\d*<\/a>/g, "");
  return content;
}
/******quizes  */
function initQuizAndStuff() {
  initMcqQuestion();
  initFillQuizzes(); //fill in blank options
}

function initLmsQuizzesAndStuff() {
  initMcqQuizzes();
  initFwoQuizzes();
  initLmsEditors();
  Prism.highlightAll();
}

/*
Modal +++++++++++++++++++++++++++++
*/

function showOffscreenModal(id) {
  $("#" + id).css({ opacity: 0, left: 0, top: "32px" });
  $("#" + id).animate(
    {
      opacity: 1,
      top: 0
    },
    150,
    function() {
      // Animation complete.
    }
  );
}

function hideOffscreenModal(id) {
  document.getElementById(id).style.left = "10000px";
}
