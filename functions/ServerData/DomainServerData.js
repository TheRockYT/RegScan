async function getDomainServerData(server) {
  // Get the RegData
  let dataDomain = await getRegDataDomain();
  // Get the domain ending
  let domainEnding = server.split(".")[1];
  if (dataDomain != null) {
    // Get the service data
    let services = dataDomain.services;
    let service = null;
    // Loop through the services
    for (let i = 0; i < services.length; i++) {
      service = services[i];
      let found = false;
      // Loop through the domain endings
      for (let j = 0; j < service[0].length; j++) {
        if (service[0][j] == domainEnding) {
          found = true;
          break;
        }
      }
      if (found) break;
    }
    // Check if the service was found
    if (service != null) {
      // Get the service API url
      let serviceApi = service[1][0] + "domain/" + server;
      try {
        // Fetch the service API
        let response = await fetch(serviceApi);
        // Check if the response was successful
        if (response.status == 200) {
          // Get the response data
          let responseData = await response.json();
          let events = responseData.events;
          let registrationDate = null;
          let expirationDate = null;
          let changedDate = null;
          // Loop through the events
          for (let i = 0; i < events.length; i++) {
            let event = events[i];
            // Check if the event is a registration event
            if (event.eventAction == "registration") {
              // Get the date
              registrationDate = doDate(event.eventDate);
            }
            // Check if the event is a expiration event
            else if (event.eventAction == "expiration") {
              // Get the date
              expirationDate = doDate(event.eventDate);
            }
            // Check if the event is a changed event
            else if (event.eventAction == "last changed") {
              // Get the date
              changedDate = doDate(event.eventDate);
            }
          }
          return {
            type: "success",
            server: server,
            date: registrationDate.formattedDate,
            days: registrationDate.days,
            registrationDate: registrationDate,
            expirationDate: expirationDate,
            changedDate: changedDate,
          };
        } else {
          return {
            type: "error",
            message: "Failed to fetch api: " + response.status,
          };
        }
      } catch (error) {
        return { type: "error", message: "Failed to fetch api: " + error };
      }
    } else {
      return { type: "error", message: "Service not found." };
    }
  } else {
    return { type: "error", message: "Could not load RegDataDomain." };
  }
}
