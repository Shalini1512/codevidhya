function cvNotify(message, type) {
  switch (type) {
    case "notice": {
      $.growl.notice({
        message: message
      });
      break;
    }
    case "warning": {
      $.growl.warning({
        message: message
      });
      break;
    }
    case "error": {
      $.growl.error({
        message: message
      });
      break;
    }
    default: {
      $.growl({
        // title: "Growl",
        message: message
      });
    }
  }
}

function hideTawk() {
  Tawk_API = Tawk_API || {};
  Tawk_API.onLoad = function() {
    Tawk_API.hideWidget();
  };
  if (Tawk_API && Tawk_API.hideWidget) Tawk_API.hideWidget();
}

function showTawk() {
  if (Tawk_API) Tawk_API.showWidget();
}


function handleFatalError() {
  if (document.getElementById("fatal-error-dialog")) return;
  var html = document.createElement("div");
  html.id = "fatal-error-dialog";
  html.className = "cv-dialog normal";
  html.innerHTML =
    "<div>" +
    "<h3><i class='error fas fa-exclamation' style='color: red'></i> Error</h3>" +
    "<p>Some data failed to load and the page needs to <b>reload</b>.</p>" +
    "<button class='btn btn-primary'>Reload now</button>" +
    "</div>";
  document.body.appendChild(html);
  $(html)
    .prepareTransition({ property: "opacity" })
    .addClass("visible");
  html.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.tagName.toLowerCase() == "button") {
      window.open(window.location.href, "_self");
    }
  });
}

function loginAndRedirectTo(vueRouter, redirectTo) {
  vueRouter.push("/login?redirect=" + encodeURIComponent(redirectTo));
}

function loginAndRedirectBack(vueRouter) {
  vueRouter.push(
    "/login?redirect=" + encodeURIComponent(window.location.pathname)
  );
}

// Validation
function validateEmail(email) {
  return email && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function validatePhone(phone) {
  return phone && phone.length >= 10 && /^[0-9]+$/.test(phone);
}

function getPasswordInvalid(password) {
  if (!password) {
    return "Password is required.";
  } else if (!(/[^a-zA-Z0-9]/.test(password) && /[0-9]/.test(password))) {
    return "Password should contain at least 1 number and 1 special character";
  } else {
    return false;
  }
}

function getTimeHMS(millis) {
  var hours = Math.floor(millis / (1000 * 60 * 60));
  var minutes = Math.floor((millis % (1000 * 60 * 60)) / (60 * 1000));
  var seconds = Math.floor((millis % (1000 * 60)) / 1000);
  return [hours, minutes, seconds];
}

function getMonthName(month) {
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  return months[month];
}

function recreateObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/****** Authentication *******/
/*****************************/

function cvAuthClass() {
  this.userId = null;
  this.callbacks = new Array();
  this.persistentCallbacks = new Array();
  this.getUserId = function(callback, persistent) {
    if (this.userId != null) {
      if (persistent) this.persistentCallbacks.push(callback);
      callback(this.userId);
    } else {
      this.callbacks.push(callback);
    }
  };
  this.setUserId = function(userId) {
    this.userId = userId;
    for (var i = 0; i < this.callbacks.length; i++) {
      this.callbacks[i](this.userId);
    }
    for (var i = 0; i < this.persistentCallbacks.length; i++) {
      this.persistentCallbacks[i](this.userId);
    }
    this.callbacks = new Array();
  };
}
var cvAuth = new cvAuthClass();

/******** Utils */
function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
function getElementIndex(elem) {
  var i = 0;
  while ((elem = elem.previousElementSibling) != null) ++i;
  return i;
}
function scrollToElement(id) {
  var el = $(id);
  if (el.length) vm.scrolledToTopic = true;
  else return;
  var top = el.offset().top;
  window.scrollTo(0, top - el.outerHeight(true));
}

function getFileExtension(fileName) {
  var lastDotIndex = fileName.lastIndexOf(".");
  return lastDotIndex < 0 ? "" : fileName.substring(lastDotIndex + 1);
}

/*********************************
 ******** Media Query Stuff *******
 *********************************/
var mqIsDesktop = window.matchMedia("(min-width: 1024px)");
var mqIsLargeTablet = window.matchMedia("(max-width: 768px)");
var mqIsSmallTablet = window.matchMedia("(max-width: 600px)");
var mqIsPhone = window.matchMedia("(max-width: 480px)");

var mqIsPhoneLandscape = window.matchMedia(
  "(max-height: 480px) and (orientation: landscape)"
);

function isDeviceLargeTablet() {
  return mqIsLargeTablet.matches;
}
function isDeviceSmallTabletOrSmaller() {
  return mqIsSmallTablet.matches;
}

function isDevicePhone() {
  return mqIsPhone.matches;
}

function isDevicePhoneLandscape() {
  return mqIsPhoneLandscape.matches;
}

function isDeviceDesktop() {
  return mqIsDesktop.matches;
}

function initExpandableLayout(expandableLayout, progressCallback) {
  /*
  Expandable layout used with this html:
  <div class="cv-expandable-layout">
    <div>
      <div class="cv-expandable-always-visible">
        THIS WILL ACT AS THE TOGGLE
      </div>
      <div class="cv-expandable-hidden">
        COLLAPSIBLE CONTENT
      </div>
    </div>
  </div>

  */
  var toggle = $(expandableLayout + ">div");
  toggle.off("click");
  toggle.click(function(e) {
    var currentTarget = $(e.currentTarget);
    var baseHeight = e.currentTarget.offsetHeight;
    var hiddenHeight = $(e.currentTarget.parentElement).find(
      ".cv-expandable-hidden"
    )[0].offsetHeight;
    var targetHeight;
    var expanding = false;
    if (currentTarget.hasClass("cv-expandable-expanded")) {
      targetHeight = baseHeight;
      expanding = false;
    } else {
      targetHeight = baseHeight + hiddenHeight;
      expanding = true;
    }
    currentTarget.toggleClass("cv-expandable-expanded");
    $(e.currentTarget.parentElement).velocity(
      {
        height: targetHeight + "px",
        tween: 1000
      },
      {
        progress: progressCallback
      },
      300
    );
  });
}

/********** Context menu *******************/
function showContextMenu(anchor, options, callback) {
  if (!anchor || !options) return;
  var html = document.createElement("div");
  html.className = "cv-context-menu";
  for (var i = 0; i < options.length; i++) {
    html.innerHTML += '<a href="#">' + options[i] + "</a>";
  }
  document.body.appendChild(html);
  var anchorPos = anchor.getBoundingClientRect();
  html.style.top =
    anchorPos.top +
    anchorPos.height / 2 +
    document.documentElement.scrollTop +
    "px";
  var menuRect = html.getBoundingClientRect();
  var targetLeft = 0;
  if (anchorPos.left + menuRect.width > document.documentElement.clientWidth) {
    targetLeft = anchorPos.left - menuRect.width + anchorPos.width / 2;
  } else {
    targetLeft = anchorPos.left + anchorPos.width / 2;
  }
  html.style.left = targetLeft + "px";

  html.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.tagName.toLowerCase() == "a") {
      removeOutsideClickListener();
      html.parentElement.removeChild(html);
      if (callback) callback(options[getElementIndex(e.target)]);
    }
  });
  function outsideClickListener(e) {
    if (e.target != html) {
      removeOutsideClickListener();
      html.parentElement.removeChild(html);
    }
  }
  function removeOutsideClickListener() {
    document.body.removeEventListener("click", outsideClickListener);
  }
  setTimeout(function() {
    document.body.addEventListener("click", outsideClickListener);
  }, 200);
}

/********* Modal ****************/
function initCvModals() {
  var modals = $(".cv-modal");
  modals.off("click");
  modals.click(function(e) {
    // hide modal
    hideModal($(e.currentTarget));
  });
  var undismissable = $(".undismissable");
  undismissable.off("click");

  var modalBox = $(".cv-modal > div");
  modalBox.click(function(e) {
    e.stopPropagation();
  });
  modals.attr("data-initialized");
}
function initCvModal(id) {
  var modal = $("#" + id);
  modal.off("click");
  if (!modal.hasClass("undismissable")) {
    modal.click(function(e) {
      // hide modal
      hideModal($(e.currentTarget));
    });
  }

  var modalBox = modal.find(" > div");
  modalBox.click(function(e) {
    e.stopPropagation();
  });
  modal.attr("data-initialized", "");
}
function showModal(modalIdOrJquery) {
  var modal = modalIdOrJquery;
  if (typeof modalIdOrJquery == "string") {
    modal = $("#" + modalIdOrJquery);
    if (!modal.length) return;
  }
  modal.prepareTransition({ property: "opacity" }).addClass("visible");
}

function hideModal(modalIdOrJquery) {
  var modal = modalIdOrJquery;
  if (typeof modalIdOrJquery == "string") {
    modal = $("#" + modalIdOrJquery);
    if (!modal.length) return;
  }
  if (modal.hasClass("visible"))
    modal.prepareTransition({ property: "opacity" }).removeClass("visible");
}

function showConfirmationDialog(options) {
  //message, callback, positiveButton, negativeButton) {
  if ((!options.title && !options.message) || !options.callback) return;
  if (!options.positiveButton) options.positiveButton = "Okay";
  if (!options.negativeButton) options.negativeButton = "Cancel";
  var html = document.createElement("div");
  html.className = "cv-dialog normal";
  html.innerHTML =
    "<div>" +
    (options.title ? "<h3>" + options.title + "</h3>" : "") +
    (options.message ? "<p>" + options.message + "</p>" : "") +
    '<div class="footer">' +
    '<button class="btn btn-secondary" data-type="negative">' +
    options.negativeButton +
    "</button>" +
    '<button class="btn btn-primary' +
    (options.positiveButtonClass ? " " + options.positiveButtonClass : "") +
    '" data-type="positive">' +
    options.positiveButton +
    "</button>" +
    "</div>" +
    "</div>";
  document.body.appendChild(html);
  $(html)
    .prepareTransition({ property: "opacity" })
    .addClass("visible");

  html.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    function dismiss() {
      $(html)
        .prepareTransition({
          property: "opacity",
          callback: function() {
            html.parentElement.removeChild(html);
          }
        })
        .removeClass("visible");
    }
    if (e.target == e.currentTarget) {
      // Clicked on the dimming background
      dismiss();
      return;
    }
    if (e.target.tagName.toLowerCase() == "button") {
      if (e.target.dataset.type == "negative") {
        dismiss();
        return;
      }
      if (options.callback) {
        if (options.manualDismissOnPositive) {
          options.callback(e.target.dataset.type, dismiss);
        } else {
          options.callback(e.target.dataset.type);
          dismiss();
        }
      }
    }
  });

  return function() {
    return 9;
  };
}

function showPromptDialog(options) {
  if ((!options.title && !options.message) || !options.callback) return;
  if (!options.positiveButton) options.positiveButton = "Okay";
  if (!options.negativeButton) options.negativeButton = "Cancel";
  var html = document.createElement("div");
  html.className = "cv-dialog normal";
  html.innerHTML =
    "<div>" +
    (options.title ? "<h3>" + options.title + "</h3>" : "") +
    (options.message ? "<p>" + options.message + "</p>" : "") +
    '<input class="cv-input" value="' +
    (options.prefill ? options.prefill : "") +
    '" />' +
    '<div class="footer">' +
    '<button class="btn btn-secondary" data-type="negative">' +
    options.negativeButton +
    "</button>" +
    '<button class="btn btn-primary" data-type="positive">' +
    options.positiveButton +
    "</button>" +
    "</div>" +
    "</div>";
  document.body.appendChild(html);
  $(html)
    .prepareTransition({ property: "opacity" })
    .addClass("visible");
  var input = html.getElementsByTagName("input")[0];
  html.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    function dismiss() {
      $(html)
        .prepareTransition({
          property: "opacity",
          callback: function() {
            html.parentElement.removeChild(html);
          }
        })
        .removeClass("visible");
    }
    if (e.target == e.currentTarget && !options.undismissable) {
      dismiss();
      return;
    }
    if (e.target.tagName.toLowerCase() == "button") {
      if (options.callback && e.target.dataset.type == "positive") {
        var shouldDismiss = options.callback({
          type: e.target.dataset.type,
          value: input.value
        });
        if (shouldDismiss) dismiss();
      } else {
        dismiss();
      }
    }
  });
}

/*********** Tablayout *************/
function initCvTablayouts(callback) {
  var tabs = $(".tabs > div");
  tabs.off("click");
  tabs.click(function(e) {
    var tabs = $(e.currentTarget.parentElement).find(">div");
    tabs.removeClass("active");
    $(e.currentTarget).addClass("active");
    var clickedTabIndex = getElementIndex(e.currentTarget);
    var tabContentBoxes = $(e.currentTarget.parentElement.parentElement).find(
      "> .content"
    );
    tabContentBoxes.removeClass("active");
    $(tabContentBoxes[clickedTabIndex]).addClass("active");
    if (callback) callback(e.currentTarget);
  });
}

/*** Progress *************/
function showProgressOverlay(id) {
  var progress = document.getElementById(id);
  if (!progress) {
    progress = document.createElement("div");
    progress.id = id;
    progress.className = "cv-progress-overlay";
    progress.innerHTML = '<div class="bounceball"></div>';
    document.body.appendChild(progress);
  } else {
    progress.style.display = "block";
  }
}

function hideProgressOverlay(id) {
  var progressOverlay = document.getElementById(id);
  if (progressOverlay)
    progressOverlay.parentElement.removeChild(progressOverlay);
}

/******** Grades */
function getSectionName(sectionId) {
  sectionId = parseInt(sectionId);
  switch (sectionId) {
    case 1:
      return "A";
    case 2:
      return "B";
    case 3:
      return "C";
    case 4:
      return "D";
    case 5:
      return "E";
    case 6:
      return "F";
    case 7:
      return "G";
    case 8:
      return "H";
    case 9:
      return "I";
    case 10:
      return "J";
    case 11:
      return "K";
    case 12:
      return "L";
    case 13:
      return "M";
    case 14:
      return "N";
    case 15:
      return "O";
    case 16:
      return "P";
    case 17:
      return "Q";
    case 18:
      return "R";
    case 19:
      return "S";
    case 20:
      return "T";
    case 21:
      return "U";
    case 22:
      return "V";
    case 23:
      return "W";
    case 24:
      return "X";
    case 25:
      return "Y";
    case 26:
      return "Z";
    default:
      return null;
  }
}
