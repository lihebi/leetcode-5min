let color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log("Default background color set to %cgreen", `color: ${color}`);

  chrome.browserAction.setBadgeText({ text: "ON" });
  chrome.browserAction.setBadgeBackgroundColor({ color: "#4688F1" });
});

console.log("Hello world");

chrome.runtime.onInstalled.addListener(function () {});
