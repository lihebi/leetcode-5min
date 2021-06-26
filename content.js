console.log("content");
console.log(document.title);
console.log(document.URL);

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

b = document.getElementsByTagName("body")[0];
mydiv = document.createElement("div");
mydiv.id = "kuberletes";
mydiv.appendChild(document.createTextNode("kuberLetes"));
// document.getElementById("app").prepend(mydiv);
b.prepend(mydiv);

// put information into mydiv
//
// But I don't want to use js to manipulate DOM. Can I use react here?
//
// - render react into content script: https://itnext.io/create-chrome-extension-with-reactjs-using-inject-page-strategy-137650de1f39
// - use iframe: https://github.com/ryanseddon/react-frame-component
