export const ACCOUNTSME_INIT = "kraliss/getaccountsme/init";
export const GET_ACCOUNTSME = "kraliss/getaccountsme/LOAD";
export const GET_ACCOUNTSME_SUCCESS = "kraliss/getaccountsme/LOAD_SUCCESS";
export const GET_ACCOUNTSME_FAIL = "kraliss/getaccountsme/LOAD_FAIL";

export const PATCH_ACCOUNTSME = "kraliss/patchaccountsme/LOAD";
export const PATCH_ACCOUNTSME_SUCCESS = "kraliss/patchaccountsme/LOAD_SUCCESS";
export const PATCH_ACCOUNTSME_FAIL = "kraliss/patchaccountsme/LOAD_FAIL";

export default function accountsMeReducer(state = { loading: false }, action) {
  switch (action.type) {
    case ACCOUNTSME_INIT:
      return { loading: false, success: "", error: "" };
    case PATCH_ACCOUNTSME:
    case GET_ACCOUNTSME:
      return { ...state, loading: true };
    case GET_ACCOUNTSME_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case PATCH_ACCOUNTSME_SUCCESS:
      return {
        ...state,
        loading: false,
        success: "true",
        payLoad: action.payload.data
      };
    case PATCH_ACCOUNTSME_FAIL:
      return {
        ...state,
        loading: false,
        error: "Can't set IBAN value."
      };
    case GET_ACCOUNTSME_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Get My user account."
      };

    default:
      return state;
  }
}

export function reqInitAccountsMe() {
  return {
    type: ACCOUNTSME_INIT,
    payload: {}
  };
}

export function reqAccountsMe() {
  return {
    type: GET_ACCOUNTSME,
    payload: {
      request: {
        url: "/api/resources/kraliss_accounts/me/",
        method: "GET"
      }
    }
  };
}

export function reqPatchAccountsMe(patchData) {
  return {
    type: PATCH_ACCOUNTSME,
    payload: {
      request: {
        url: "/api/resources/kraliss_accounts/me/",
        method: "PATCH",
        data: patchData
      }
    }
  };
}
