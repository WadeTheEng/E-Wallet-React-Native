export const POST_FORGOTPWD = "kraliss/resetpasswd/LOAD";
export const POST_FORGOTPWD_SUCCESS = "kraliss/resetpasswd/LOAD_SUCCESS";
export const POST_FORGOTPWD_FAIL = "kraliss/resetpasswd/LOAD_FAIL";

export default function forgotPasswdReducer(
  state = { loading: false, payLoad: {} },
  action
) {
  switch (action.type) {
    case POST_FORGOTPWD:
      return { ...state, loading: true };
    case POST_FORGOTPWD_SUCCESS:
      return { ...state, loading: false, payLoad: action.payload.data };
    case POST_FORGOTPWD_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Reset passwd"
      };
    default:
      return state;
  }
}

export function reqForgotPasswd(email) {
  return {
    type: POST_FORGOTPWD,
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
