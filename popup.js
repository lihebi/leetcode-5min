// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}

document.querySelector("#go-to-options").addEventListener("click", function () {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
});

// document.getElementById("leetcode-id").innerHTML = `<p>${document.title}</p>`;
// console.log(document.title);

// I can actually create a promise myself
// https://stackoverflow.com/questions/52087734/make-promise-wait-for-a-chrome-runtime-sendmessage/52089844
function sendMessagePromise(msg) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, msg, function (res) {
        resolve(res);
      });
    });
  });
}

async function setMeta() {
  var res = await sendMessagePromise({
    type: "read",
  });
  document.getElementById("leetcode-id").innerText = res.URL;
  document.getElementById("leetcode-title").innerText = res.title;
}

function timerUpdate() {
  chrome.storage.sync.get("timer", ({ timer }) => {
    displayTimer(timer);
  });
}

// on Load!!!
// https://stackoverflow.com/questions/13591983/onclick-or-inline-script-isnt-working-in-extension
document.addEventListener("DOMContentLoaded", async function () {
  await setMeta();

  timerUpdate();
  // https://stackoverflow.com/questions/1224463/is-there-any-way-to-call-a-function-periodically-in-javascript
  setInterval(timerUpdate, 1000);
});

document.getElementById("test").addEventListener("click", async function () {
  //   var testres = await sendMessagePromise({ greeting: "hello" });
  //   console.log("testres");
  //   console.log(testres);
  await setMeta();
});

function displayTimer(timer) {
  var ele = document.getElementById("timer");
  if (!timer) {
    ele.innerText = "No Timer";
  } else {
    if (timer.status === "off") {
      ele.innerText = Math.round(timer.offset / 1000);
      document.getElementById("timer-toggle").innerText = "start";
      chrome.action.setBadgeText({ text: "OFF" });
      chrome.action.setBadgeBackgroundColor({ color: "#4688F1" });
    } else {
      var t = Math.round((Date.now() - timer.from + timer.offset) / 1000);
      ele.innerText = `${t}`;
      document.getElementById("timer-toggle").innerText = "pause";
      chrome.action.setBadgeText({ text: "ON" });
      chrome.action.setBadgeBackgroundColor({ color: "#4688F1" });
    }
  }
}

function toggleTimer() {
  chrome.storage.sync.get("timer", ({ timer }) => {
    console.log("toggle timer");
    console.log(timer);
    if (timer && timer.status === "on") {
      stopTimer();
    } else {
      startTimer();
    }
  });
}

function startTimer() {
  console.log("start timer");
  chrome.storage.sync.get("timer", ({ timer }) => {
    if (!timer || timer.status !== "on") {
      chrome.storage.sync.set({
        timer: {
          from: Date.now(),
          offset: timer.offset ? timer.offset : 0,
          status: "on",
        },
      });
      timerUpdate();
    }
  });
}

function resetTimer() {
  chrome.storage.sync.set({
    timer: {
      from: Date.now(),
      offset: 0,
      status: "off",
    },
  });
  timerUpdate();
}

function stopTimer() {
  console.log("stop timer");
  chrome.storage.sync.get("timer", ({ timer }) => {
    offset = 0;
    if (timer.status === "on") {
      offset += Date.now() - timer.from;
    }
    offset += timer.offset ? timer.offset : 0;
    console.log("offset", offset);

    chrome.storage.sync.set({
      timer: {
        from: Date.now(),
        offset: offset,
        status: "off",
      },
    });
    timerUpdate();
  });
}

document.getElementById("timer-toggle").addEventListener("click", function () {
  toggleTimer();
});

document.getElementById("timer-reset").addEventListener("click", function () {
  resetTimer();
});
