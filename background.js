// All regData is stored in these variables
let regDataDomain = null;
let regDataV4 = null;
let regDataV6 = null;

// Get the RegData from the IANA RDAP server for domains
function getRegDataDomain() {
  if (regDataDomain == null) {
    fetch("https://data.iana.org/rdap/dns.json")
      .then((response) => {
        return response.json(); // add this line to parse the response as JSON
      })
      .then((data) => {
        regDataDomain = data;
        console.log({ "RegDataDomain loaded! ": regDataDomain });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return regDataDomain;
}
// Get the RegData from the IANA RDAP server for IPv4
function getRegDataV4() {
  if (regDataV4 == null) {
    fetch("https://data.iana.org/rdap/ipv4.json")
      .then((response) => {
        return response.json(); // add this line to parse the response as JSON
      })
      .then((data) => {
        regDataV4 = data;
        console.log({ "RegDataV4 loaded! ": regDataV4 });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return regDataV4;
}
// Get the RegData from the IANA RDAP server for IPv6
function getRegDataV6() {
  if (regDataV6 == null) {
    fetch("https://data.iana.org/rdap/ipv6.json")
      .then((response) => {
        return response.json(); // add this line to parse the response as JSON
      })
      .then((data) => {
        regDataV6 = data;
        console.log({ "RegDataV6 loaded! ": regDataV6 });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return regDataV6;
}
// Preload the data
getRegDataDomain();
getRegDataV4();
getRegDataV6();

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Check if the URL is fully loaded
  if (changeInfo.status === "complete") {
    let url = new URL(tab.url);
    let hostname = url.hostname;
    let domainSplit = hostname.split(".");

    // Get the domain ending (example: .com, .net, .org, etc.)
    let domainEnding = domainSplit.pop();

    // Check if the domain ending is a number (example: 1). This is used to differentiate between IPv4 and domain names.
    if (!isNaN(domainEnding)) {
      // Is is a number, so it is an IPv4 address
      // TODO: IMPLEMENT
      console.log("Not implemented yet");
    } else {
      // Get the domain name (example: google.com, facebook.com, etc.)
      let domain = domainSplit.pop() + "." + domainEnding;

      console.log({
        Url: url,
        "Domain ending: ": domainEnding,
        "Domain hostname: ": domain,
      });

      // Get the RegData
      let dataDomain = getRegDataDomain();
      if (dataDomain != null) {
        // Get the service data
        let services = dataDomain.services;
        let service = null;
        for (let i = 0; i < services.length; i++) {
          service = services[i];
          let found = false;
          for (let j = 0; j < service[0].length; j++) {
            if (service[0][j] == domainEnding) {
              found = true;
              console.log({ "Service found!": service });
              break;
            }
          }
          if (found) break;
        }

        if (service != null) {
          let serviceApi = service[1][0] + "domain/" + domain;
          console.log({ "Service API: ": serviceApi });
          fetch(serviceApi)
            .then((response) => {
              if (response.status != 200) {
                console.error("Request failed: " + response.status);
              } else {
                let data = response.json();
                return data;
              }
            })
            .then((data) => {
              console.log({ "DomainData loaded! ": data });
              let events = data.events;
              for (let i = 0; i < events.length; i++) {
                let event = events[i];
                if (event.eventAction == "registration") {
                  let date = doDate(event.eventDate);
                  console.log({
                    "Registration date: ": date.formattedDate,
                    "Registration days: ": date.days,
                  });
                  showNotification(domain, date);
                  break;
                }
              }
            })
            .catch((error) => {
              console.error({ "Request failed": error });
            });
        } else {
          console.error("Service not found");
        }
      } else {
        console.error("Data is null");
      }
    }
  }
});

function doDate(date) {
  let asDate = new Date(date);
  let diff = new Date() - asDate;
  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let formattedDate = asDate.toLocaleDateString("en-US");

  return { date: asDate, diff: diff, days: days, formattedDate: formattedDate };
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
