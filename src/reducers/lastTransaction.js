export const LASTTRANS_INIT = "kraliss/lasttransaction/init";
export const GET_LASTTRANS = "kraliss/lasttransaction/LOAD";
export const GET_LASTTRANS_SUCCESS = "kraliss/lasttransaction/LOAD_SUCCESS";
export const GET_LASTTRANS_FAIL = "kraliss/lasttransaction/LOAD_FAIL";

export default function lastTransactionReducer(
  state = { loading: false },
  action
) {
  switch (action.type) {
    case LASTTRANS_INIT:
      return {
        loading: false
      };
    case GET_LASTTRANS:
      return { ...state, loading: true };
    case GET_LASTTRANS_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case GET_LASTTRANS_FAIL:
      return { loading: false, error: "Last Transaction Error!" };
    default:
      return state;
  }
}

export function reqLastTransactionInit() {
  return {
    type: LASTTRANS_INIT,
    payload: {}
  };
}

export function reqLastTransaction(page, limit) {
  return {
    type: GET_LASTTRANS,
    payload: {
      request: {
        url: `/api/flux/last_transactions/me/?start=${page}&limit=${limit}`,
        method: "GET"
      }
    }
  };
}
