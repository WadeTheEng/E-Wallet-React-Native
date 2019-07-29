import hmacSHA256 from "crypto-js/hmac-sha256";

const APIMONEY_URL = "https://test-emoney-services.w-ha.com";
const APIMONEY_KEY = "YpWO3H6oRqED5cKIar0EYCz1GJUbTdFu";
const APIMONEY_SECRET = "InWmSuf2QlwxR7hIaAjlddh4FWlCACRF";
const VERSION_NUMBER = "1";

function getAuthorization(body) {
  const timeStamp = Date.now();
  const stringToSign = `${APIMONEY_KEY}:${timeStamp}:${VERSION_NUMBER}:${body}`;
  const sign = hmacSHA256(stringToSign, APIMONEY_SECRET).toString();
  const authValue = `AUTH ${APIMONEY_KEY}:${timeStamp}:${VERSION_NUMBER}:${sign}`;
  return authValue;
}
export async function getCreditcardInit(bodyString, callBack) {
  fetch(`${APIMONEY_URL}/api/cash-in/creditcards/init`, {
    method: "POST",
    headers: {
      Authorization: getAuthorization(bodyString),
      "content-type": "application/json"
    },
    body: bodyString
  })
    .then(response => response.json())
    .then(responseJson => {
      callBack(responseJson, null);
    })
    .catch(error => callBack(null, errror));
}
