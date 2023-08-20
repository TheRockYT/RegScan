function showError(error) {
  hideAll();
  document.getElementById("error_message").innerText = error;
  document.getElementById("information_error").classList.remove("invisible");
}
function showInfo(
  server,
  registrationDate,
  expirationDate,
  changedDate,
  nameservers
) {
  hideAll();
  document.getElementById("field_server").innerText = server;
  document.getElementById("field_date_registration").innerText =
    registrationDate.formattedDate + " (" + registrationDate.days + " days)";
  document.getElementById("field_date_expiration").innerText =
    expirationDate.formattedDate + " (" + expirationDate.days + " days)";
  document.getElementById("field_date_changed").innerText =
    changedDate.formattedDate + " (" + changedDate.days + " days)";
  document.getElementById("field_nameservers").innerHTML =
    "<ul>" +
    nameservers.map((nameserver) => "<li>" + nameserver + "</li>").join("") +
    "</ul>";

  document.getElementById("information_loaded").classList.remove("invisible");
}
function hideAll() {
  document.getElementById("information_loaded").classList.add("invisible");
  document.getElementById("information_error").classList.add("invisible");
  document.getElementById("information_loading").classList.add("invisible");
}
