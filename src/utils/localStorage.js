import { AsyncStorage } from "react-native";
import Storage from "react-native-storage";

var storage = new Storage({
  // maximum capacity, default 1000
  size: 5000,
  // Use AsyncStorage for RN apps, or window.localStorage for web apps.
  // If storageBackend is not set, data will be lost after reload.
  storageBackend: AsyncStorage, // for web: window.localStorage
  // cache data in the memory. default is true.
  enableCache: true,
  // if data was not found in storage or expired data was found,
  // the corresponding sync method will be invoked returning
  // the latest data.
  sync: {
    // we'll talk about the details later.
  }
});

const auth_key = "auth_token";

export async function saveAuthToken(auth_token) {
  try {
    await AsyncStorage.setItem(auth_key, auth_token);
  } catch (error) {
    // Error saving data
  }
}

export async function getAuthToken() {
  try {
    const value = await AsyncStorage.getItem(auth_key);
    if (value !== null) {
      // We have data!!
      //console.log(value);
    }
    return value;
  } catch (error) {
    // Error retrieving data
    return null;
  }
}

export function deleteMyAccount() {
  AsyncStorage.clear();
  storage.clearMap();
}

export async function loadLocalData(load_key) {
  try {
    const ret = await storage.load({ key: load_key });
    return ret;
  } catch (error) {
    console.log("load error: " + load_key);
    console.log(error);
    return null;
  }
}

export async function saveLocalData(key, data) {
  try {
    if (data === null || data === undefined) return false;

    const ret = await storage.save({ key: key, data: data });
    return true;
  } catch (error) {
    console.log("save error: " + key);
    console.log(error);
    return false;
  }
}

export async function saveUserInfo(payLoad) {
  const { kra_user } = payLoad;

  const myuserIsBusiness = kra_user["myuser_is_business"];
  await saveLocalData("myuserIsBusiness", myuserIsBusiness);

  const accountId = payLoad["id"];
  await saveLocalData("kraAccountId", accountId);

  const firstName = kra_user["first_name"];
  await saveLocalData("firstName", firstName);

  const lastName = kra_user["last_name"];
  await saveLocalData("lastName", lastName);

  const email = kra_user["email"];
  await saveLocalData("email", email);

  const myuserPhoneNumber = kra_user["myuser_phone_number"];
  await saveLocalData("myuserPhoneNumber", myuserPhoneNumber);

  const myuserMobilePhoneNumber = kra_user["myuser_mobile_phone_number"];
  await saveLocalData("myuserMobilePhoneNumber", myuserMobilePhoneNumber);

  const myuserNationality = kra_user["myuser_nationality"];
  await saveLocalData("myuserNationality", myuserNationality);

  const myuserBirthdate = kra_user["myuser_birthdate"];
  await saveLocalData("myuserBirthdate", myuserBirthdate);

  if (myuserIsBusiness) {
    const myUserBusiness = kra_user["myuser_business"];
    await saveLocalData("myUserBusiness", myUserBusiness);

    const kraBusinessInfo = payLoad["kra_business_info"];

    const address = kraBusinessInfo["company_address"]["formatted_address"];
    await saveLocalData("formattedAddress", address);

    const companyName = kraBusinessInfo["company_name"];
    await saveLocalData("companyName", companyName);

    const identificationNumber = kraBusinessInfo["identification_number"];
    await saveLocalData("identificationNumber", identificationNumber);

    const activityField = kraBusinessInfo["activity_field"];
    await saveLocalData("activityField", activityField);

    const companyPhoneNumber = kraBusinessInfo["company_phone_number"];
    await saveLocalData("companyPhoneNumber", companyPhoneNumber);

    const companyInternational = kraBusinessInfo["company_international"];
    await saveLocalData("companyInternational", companyInternational);

    const functionInSociety = kraBusinessInfo["function_in_society"];
    await saveLocalData("functionInSociety", functionInSociety);
  } else {
    const address = kra_user["myuser_address"]["formatted_address"];
    await saveLocalData("formattedAddress", address);
  }

  const myuserBeneficiary = kra_user["myuser_beneficiary"];
  await saveLocalData("myuserBeneficiary", myuserBeneficiary);

  const myuserInternational = kra_user["myuser_international"];
  await saveLocalData("myuserInternational", myuserInternational);

  const myuserInternationalPhone = kra_user["myuser_international_phone"];
  await saveLocalData("myuserInternationalPhone", myuserInternationalPhone);

  const myuserInternationalMobilePhone =
    kra_user["myuser_international_mobile_phone"];
  await saveLocalData(
    "myuserInternationalMobilePhone",
    myuserInternationalMobilePhone
  );

  const kraIban = payLoad["kra_iban"];
  await saveLocalData("kraIban", kraIban);

  const kraBalance = payLoad["kra_balance"];
  await saveLocalData("kraBalance", kraBalance);

  const kraKycLevel = payLoad["kra_kyc_level"];
  await saveLocalData("kraKycLevel", kraKycLevel);

  const kraAccountNumber = payLoad["kra_account_number"];
  await saveLocalData("kraAccountNumber", kraAccountNumber);

  const kraApiMoneyWalletId = payLoad["kra_api_money_wallet_id"];
  await saveLocalData("kraApiMoneyWalletId", kraApiMoneyWalletId);
}
