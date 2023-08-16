// Sent the info message to the background script
chrome.runtime.sendMessage({
  action: "regscan_info_request",
});

console.log("Send regscan_info_request message to background script.");

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action == "regscan_info_response") {
    console.log(
      "Received regscan_info_response message from background script."
    );
    if (message.type == "success") {
      showInfo(message.server, message.date, message.days);
    } else {
      showError(message.message);
    }
  }
});
