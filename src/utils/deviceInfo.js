import DeviceInfo from "react-native-device-info-2";

export async function getDeviceInformations(geolocation) {
  try {
    const returnValue = {
      mb_timezone: DeviceInfo.getTimezone(),
      mb_os_name: DeviceInfo.getSystemName(),
      mb_ip_country: "",
      mb_unique_id_number: DeviceInfo.getUniqueID(),
      mb_public_ip: await DeviceInfo.getIPAddress(),
      mb_lat: "",
      mb_long: ""
    };
    const position = await getCurrentLocation(geolocation);
    returnValue.mb_lat = position.coords.latitude;
    returnValue.mb_long = position.coords.longitude;
    const publicIP = await getGlobalIP();
    returnValue.mb_public_ip = publicIP;
    const country = await getCountry(publicIP);
    returnValue.mb_ip_country = country;
    return returnValue;
  } catch (error) {
    //console.log(error);
    throw error;
  }
}

function getCurrentLocation(geolocation) {
  geolocation.requestAuthorization();
  return new Promise((resolve, reject) => {
    geolocation.getCurrentPosition(
      resolve,
      ({ code, message }) =>
        /*reject(
          Object.assign(new Error(message), { name: "PositionError", code })
        )*/
        resolve({ coords: { latitude: "", longitude: "" } }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  });
}

function getGlobalIP() {
  var urlGetIP = `https://api.ipify.org?format=json`;
  console.log(urlGetIP);
  return new Promise((resolve, reject) => {
    fetch(urlGetIP)
      .then(response => response.json())
      .then(responseJson => {
        const ip = responseJson.ip;
        resolve(ip);
      })
      .catch(error => {
        reject(Object.assign(error));
      });
  });
}

function getCountry(ipAddress) {
  var urlGetIP = `http://api.ipstack.com/${ipAddress}?access_key=9437feb071b96603e7981a0b828ae102`;
  console.log(urlGetIP);
  return new Promise((resolve, reject) => {
    fetch(urlGetIP)
      .then(response => response.json())
      .then(responseJson => {
        const countryName = responseJson.country_name;
        resolve(countryName);
      })
      .catch(error => {
        reject(Object.assign(error));
      });
  });
}
