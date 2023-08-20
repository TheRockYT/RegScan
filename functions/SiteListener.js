// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  // Check if the URL is fully loaded
  if (changeInfo.status === "complete") {
    let serverData = await getServerData(tab.url);
    if (serverData.type == "success") {
      if (serverData.registrationDate.days < 90) {
        injectPopup(
          "error",
          "This page is not three months old. Days: " +
            serverData.registrationDate.days,
          tabId
        );
      } else if (serverData.registrationDate.days < 365) {
        injectPopup(
          "warning",
          "This page is not one year old. Days: " +
            serverData.registrationDate.days,
          tabId
        );
      }
    } else {
      injectPopup("error", "Failed to load page information.", tabId);
    }
  }
});
function injectPopup(type, message, tabId) {
  chrome.scripting.executeScript({
    args: [type, message],
    target: { tabId: tabId },
    func: goPopup,
  });
}
function goPopup(type, message) {
  // Create the popup div
  let popup = document.createElement("div");
  popup.classList.add("regscan_popup");

  // Create the popup title
  let title = document.createElement("p");
  title.classList.add("regscan_popup_title");
  title.innerText = "RegScan";
  popup.appendChild(title);

  // Create the popup message
  let popupMessage = document.createElement("p");
  popupMessage.classList.add("regscan_popup_message");
  popupMessage.innerText = message;
  popup.appendChild(popupMessage);

  // Add the close button
  let closeButton = document.createElement("button");
  closeButton.classList.add("regscan_popup_close");
  closeButton.innerText = "X";
  popup.appendChild(closeButton);

  // Position the popup div in the bottom right corner
  popup.style.position = "fixed";
  popup.style.bottom = "20px";
  popup.style.right = "20px";

  // Style the popup div
  popup.style.padding = "10px";
  popup.style.borderRadius = "5px";
  popup.style.color = "white";
  popup.style.fontFamily = "Arial, Helvetica, sans-serif";
  popup.style.fontSize = "24px";
  popup.style.zIndex = "9999999999";
  popup.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.8)";
  popup.style.transition = "all 0.5s ease";
  popup.style.opacity = "0.0";

  // Style the popup title
  title.style.fontWeight = "bold";
  title.style.margin = "10px";
  title.style.fontSize = "30px";

  // Style the popup message
  popupMessage.style.margin = "10px";
  popupMessage.style.fontSize = "20px";

  // Style the close button
  closeButton.style.position = "absolute";
  closeButton.style.top = "0";
  closeButton.style.right = "0";
  closeButton.style.padding = "10px";
  closeButton.style.border = "none";
  closeButton.style.backgroundColor = "transparent";
  closeButton.style.color = "white";
  closeButton.style.fontSize = "30px";
  closeButton.style.fontWeight = "bold";
  closeButton.style.cursor = "pointer";

  // Set the popup div color depending on the type of message
  if (type === "info") {
    popup.style.backgroundColor = "#2196F3";
  } else if (type === "warning") {
    popup.style.backgroundColor = "#FF9800";
  } else if (type === "error") {
    popup.style.backgroundColor = "#F44336";
  }

  // Add the popup div to body
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.style.opacity = "1.0";
    closeButton.addEventListener("click", () => {
      popup.style.opacity = "0.0";
    });
    setTimeout(() => {
      popup.style.opacity = "0.0";
      setTimeout(() => {
        // Remove the popup div from body
        document.body.removeChild(popup);
      }, 5000);
    }, 5000);
  }, 1);
}
