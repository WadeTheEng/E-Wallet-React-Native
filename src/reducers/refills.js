export const REFILLS_INIT = "kraliss/refills/init";
export const POST_REFILLS = "kraliss/refills/LOAD";
export const POST_REFILLS_SUCCESS = "kraliss/refills/LOAD_SUCCESS";
export const POST_REFILLS_FAIL = "kraliss/refills/LOAD_FAIL";

export const GET_REFILLSME = "kraliss/refillsme/LOAD";
export const GET_REFILLSME_SUCCESS = "kraliss/refillsme/LOAD_SUCCESS";
export const GET_REFILLSME_FAIL = "kraliss/refillsme/LOAD_FAIL";

export default function refillsReducer(
  state = { loading: false, payLoad: "" },
  action
) {
  switch (action.type) {
    case REFILLS_INIT:
      return { ...state, loading: false, error: "", payLoad: "" };
    case POST_REFILLS:
      return { ...state, loading: true };
    case POST_REFILLS_SUCCESS:
      return { ...state, loading: false, payLoad: "success" };
    case POST_REFILLS_FAIL:
      return {
        ...state,
        error: "Refill can't be performed.",
        loading: false,
        payLoad: ""
      };
    default:
      return state;
  }
}

export function refillsMeReducer(state = { loading: false }, action) {
  switch (action.type) {
    case REFILLS_INIT:
      return { loading: false };
    case GET_REFILLSME:
      return { ...state, loading: true };
    case GET_REFILLSME_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case GET_REFILLSME_FAIL:
      return {
        error: "Can't load the invoices.",
        loading: false
      };
    default:
      return state;
  }
}

export function reqRefillsInit() {
  return {
    type: REFILLS_INIT,
    payload: {}
  };
}

export function reqRefills(bodyData) {
  return {
    type: POST_REFILLS,
    payload: {
      request: {
        url: "/api/flux/kralissrefills/",
        method: "POST",
        data: bodyData
      }
    }
  };
}

export function reqRefillsMe() {
  return {
    type: GET_REFILLSME,
    payload: {
      request: {
        url: "/api/flux/kralissrefills/me/",
        method: "GET"
      }
    }
  };
}
