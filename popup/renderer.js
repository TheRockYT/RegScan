function showError(error) {
  hideAll();
  document.getElementById("error_message").innerText = error;
  document.getElementById("information_error").classList.remove("invisible");
}
function showInfo(server, date, days) {
  hideAll();
  document.getElementById("field_server").innerText = server;
  document.getElementById("field_date_register").innerText = date;
  document.getElementById("field_days_register").innerText = days;

  document.getElementById("information_loaded").classList.remove("invisible");
}
function hideAll() {
  document.getElementById("information_loaded").classList.add("invisible");
  document.getElementById("information_error").classList.add("invisible");
  document.getElementById("information_loading").classList.add("invisible");
}
