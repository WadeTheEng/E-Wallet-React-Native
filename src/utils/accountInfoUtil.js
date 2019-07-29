import i18n from "../locale/i18n";
export function getStatusText(item) {
  if (item === null) {
    return { title: i18n.t("myAccount.notSpecified"), showIcon: false };
  }
  if (item.document_api_money_state == "CREATED")
    return { title: i18n.t("myAccount.inWaitingVerify"), showIcon: false };

  if (item.document_api_money_state == "VALID")
    return { title: i18n.t("myAccount.verified"), showIcon: true };

  if (item.document_api_money_state == "INVALID")
    return { title: i18n.t("myAccount.invalid"), showIcon: false };
}

export function getDocTitleText(type) {
  if (type == "PROOF_OF_REGISTRATION")
    return i18n.t("myAccount.registerOfCompany");
  if (type == "PROOF_OF_ID") return i18n.t("myAccount.proofOfID");
  if (type == "PROOF_OF_ADDRESS") return i18n.t("myAccount.proofOfAddress");
  if (type == "PROOF_OF_IBAN") return i18n.t("myAccount.proofOfIBAN");
  if (type == "PROOF_OF_HOST_ID") return i18n.t("myAccount.proofOfHostID");
  if (type == "PROOF_OF_HOST_HOSTING")
    return i18n.t("myAccount.proofOfHostHosting");
  if (type == "PROOF_OF_HOST_ADDRESS")
    return i18n.t("myAccount.proofHostAddress");
  return "";
}
