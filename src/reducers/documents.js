export const DOCUMENTSME_INIT = "kraliss/documentsme/init";

export const GET_DOCUMENTSME = "kraliss/documentsme/LOAD";
export const GET_DOCUMENTSME_SUCCESS = "kraliss/documentsme/LOAD_SUCCESS";
export const GET_DOCUMENTSME_FAIL = "kraliss/documentsme/LOAD_FAIL";

export const DELETE_DOCUMENT = "kraliss/deletedoc/LOAD";

export default function docMeReducer(state = { loading: false }, action) {
  switch (action.type) {
    case DOCUMENTSME_INIT:
      return {
        loading: false
      };
    case GET_DOCUMENTSME:
      return { ...state, loading: true };
    case GET_DOCUMENTSME_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case GET_DOCUMENTSME_FAIL:
      return { ...state, loading: false, error: "Loading Documents Failed!" };
    default:
      return state;
  }
}

export function reqInitDocMe() {
  return {
    type: DOCUMENTSME_INIT,
    payload: {}
  };
}

export function reqGetDocMe() {
  return {
    type: GET_DOCUMENTSME,
    payload: {
      request: {
        url: "/api/resources/documents/me/",
        method: "GET"
      }
    }
  };
}

export function reqDeleteDoc(docID) {
  return {
    type: DELETE_DOCUMENT,
    payload: {
      request: {
        url: `/api/resources/documents/${docID}/`,
        method: "DELETE"
      }
    }
  };
}
