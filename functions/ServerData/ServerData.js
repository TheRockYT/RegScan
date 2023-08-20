importScripts("/functions/ServerData/DomainServerData.js");

// Temporary data (cache) for faster loading
let tempData = {};
async function getServerData(server) {
  // Parse the server URL
  let parsedServer = parseServerUrl(server);
  if (tempData[parsedServer.server] != null) {
    return tempData[parsedServer.server];
  }
  let response = null;
  if (parsedServer.type == "ipv4") {
    //response = await getIpV4ServerData(parsedServer.server);
    return { type: "error", message: "IPv4 is not supported yet!" };
  } else if (parsedServer.type == "ipv6") {
    //response = await getIpV6ServerData(parsedServer.server);
    return { type: "error", message: "IPv6 is not supported yet!" };
  } else if (parsedServer.type == "domain") {
    response = await getDomainServerData(parsedServer.server);
  }
  if (response != null) {
    tempData[parsedServer.server] = response;
    return response;
  }
  return { type: "error", message: "Unsupported Protocol!" };
}

function parseServerUrl(server) {
  // Check if the server is a valid URL (http:// or https://)
  if (server.startsWith("http://") || server.startsWith("https://")) {
    // Create a URL object
    let url = new URL(server);

    // Get the hostname
    let hostname = url.hostname;

    // Check if it's an IPv4 address
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      return { type: "ipv4", server: hostname };
    }

    // Check if it's an IPv6 address
    else if (/^[a-fA-F0-9:]+$/.test(hostname)) {
      return { type: "ipv6", server: hostname };
    }

    // Otherwise, it's a domain name
    else {
      // Extract the top level domain
      let parts = hostname.split(".");
      let tld = parts[parts.length - 1];
      let name = parts[parts.length - 2];
      let domain = name + "." + tld;
      return { type: "domain", server: domain };
    }
  }
  return { type: "unsupported_protocol", message: "Unsupported Protocol!" };
}
function showNotification(url, date) {
  // type, iconUrl, title and message.
  chrome.notifications.create("RegScan-" + url, {
    type: "basic",
    iconUrl: "icon.png",
    title: "RegScan",
    contextMessage: "RegScan domain registration notification",
    message:
      "Domain: " +
      url +
      "\n" +
      "Registration date: " +
      date.formattedDate +
      "\n" +
      "Registration days: " +
      date.days,
  });
}
