// All regData is stored in these variables
let regDataDomain = null;
let regDataV4 = null;
let regDataV6 = null;

// Get the RegData from the IANA RDAP server for domains
async function getRegDataDomain() {
  if (regDataDomain == null) {
    try {
      let response = await fetch("https://data.iana.org/rdap/dns.json");
      let data = await response.json();
      regDataDomain = data;
      console.log({ "RegDataDomain loaded! ": regDataDomain });
    } catch (error) {
      console.log(error);
    }
  }
  return regDataDomain;
}
// Get the RegData from the IANA RDAP server for IPv4
async function getRegDataV4() {
  if (regDataV4 == null) {
    try {
      let response = await fetch("https://data.iana.org/rdap/ipv4.json");
      let data = await response.json();
      regDataV4 = data;
      console.log({ "RegDataV4 loaded! ": regDataV4 });
    } catch (error) {
      console.log(error);
    }
  }
  return regDataV4;
}
// Get the RegData from the IANA RDAP server for IPv6
async function getRegDataV6() {
  if (regDataV6 == null) {
    try {
      let response = await fetch("https://data.iana.org/rdap/ipv6.json");
      let data = await response.json();
      regDataV6 = data;
      console.log({ "RegDataV6 loaded! ": regDataV6 });
    } catch (error) {
      console.log(error);
    }
  }
  return regDataV6;
}
// Preload the data
getRegDataDomain();
getRegDataV4();
getRegDataV6();
