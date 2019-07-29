export const GET_INTERNATIONALS = "kraliss/internationals/LOAD";
export const GET_INTERNATIONALS_SUCCESS = "kraliss/internationals/LOAD_SUCCESS";
export const GET_INTERNATIONALS_FAIL = "kraliss/internationals/LOAD_FAIL";

export default function internationalsReducer(
  state = { loading: false, payLoad: {} },
  action
) {
  switch (action.type) {
    case GET_INTERNATIONALS:
      return { ...state, loading: true };
    case GET_INTERNATIONALS_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case GET_INTERNATIONALS_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Reset passwd"
      };
    default:
      return state;
  }
}

export function reqInternationals() {
  return {
    type: GET_INTERNATIONALS,
    payload: {
      request: {
        url: "/api/resources/internationals/",
        method: "GET"
      }
    }
  };
}
