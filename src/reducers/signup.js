export const POST_INIT_SIGNUP = "kraliss/signup/INIT";
export const POST_SIGNUP = "kraliss/signup/LOAD";
export const POST_SIGNUP_SUCCESS = "kraliss/signup/LOAD_SUCCESS";
export const POST_SIGNUP_FAIL = "kraliss/signup/LOAD_FAIL";

export default function signupReducer(
  state = { loading: false, id: "", error: "" },
  action
) {
  switch (action.type) {
    case POST_INIT_SIGNUP:
      return { ...state, loading: false, id: "", error: "" };
    case POST_SIGNUP:
      return { ...state, loading: true };
    case POST_SIGNUP_SUCCESS:
      return { ...state, loading: false, id: action.payload.data };
    case POST_SIGNUP_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while Signup"
      };
    default:
      return state;
  }
}

export function reqInitSignup() {
  return {
    type: POST_INIT_SIGNUP,
    payload: {}
  };
}

export function reqSignup(user) {
  return {
    type: POST_SIGNUP,
    payload: {
      request: {
        url: "/api/auth/users/",
        method: "POST",
        data: {
          username: user.email,
          password: user.password,
          email: user.email
        }
      }
    }
  };
}
