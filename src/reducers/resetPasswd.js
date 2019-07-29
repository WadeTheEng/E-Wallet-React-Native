export const POST_RESETPWD = "kraliss/resetpasswd/LOAD";
export const POST_RESETPWD_SUCCESS = "kraliss/resetpasswd/LOAD_SUCCESS";
export const POST_RESETPWD_FAIL = "kraliss/resetpasswd/LOAD_FAIL";

export default function resetPasswdReducer(
  state = { loading: false, payLoad: {} },
  action
) {
  switch (action.type) {
    case POST_RESETPWD:
      return { ...state, loading: true };
    case POST_RESETPWD_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case POST_RESETPWD_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Reset passwd"
      };
    default:
      return state;
  }
}

export function reqResetPasswd(email) {
  return {
    type: POST_RESETPWD,
    payload: {
      request: {
        url: "/api/auth/password/reset",
        method: "POST",
        data: {
          email: email
        }
      }
    }
  };
}
