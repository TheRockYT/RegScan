// Listen for messages from the content script (popup.js)
chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  if (message.action == "regscan_info_request") {
    let url = await getCurrentTabUrl();
    console.log("Received regscan_info_request for " + url);
    let serverData = await getServerData(url);
    chrome.runtime.sendMessage({
      action: "regscan_info_response",
      ...serverData,
    });
  }
});

async function getCurrentTabUrl() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.url;
}
