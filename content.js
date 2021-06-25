console.log("content");
console.log(document.title);
console.log(document.URL);
// mydiv = document.createElement("div");
// mydiv.id = "lt-master";
// mydiv.appendChild(document.createTextNode("Leetcode Master"));
// document.getElementById("app").prepend(mydiv);

// chrome.runtime.onInstalled.addListener(function () {
//   console.log("111");
// });

// https://stackoverflow.com/questions/2694640/find-an-element-in-dom-based-on-an-attribute-value#16775485
console.log(document.querySelector('[data-cy="question-title"]'));

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.greeting === "hello") {
    sendResponse({ farewell: "goodbye" });
  } else if (request.type === "read") {
    sendResponse({
      title: document.title,
      URL: document.URL,
    });
  }
});
