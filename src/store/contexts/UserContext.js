import React, { createContext, useReducer } from "react";

export const USER_CONTEXT_CONSTANTS = {
  ACTIONS: { USE_QUERY_API_CALLED: "USE_QUERY_API_CALLED" },
  KEYS: {
    _recurringInvoice: "recurringInvoice",
  },
};

const initalState = {
  loading: true,
  isAuthenticated: false,
  personalData: {
    landlord: {},
    servicepro: {},
    renter: {},
  },
  userData: {},
  permissions: [],
  isImpersonate: false,
  impersonator: null,
  accountSetting: {},
  profileInfo: {
    ProfileBankData: {},
    ProfileAbout: {},
    ProfileConnect: {},
  },
  profileCompletenessData: {},
  mfaData: {},
  calledAPI: false,
  uiData: {
    calendarNotification: 0,
    calendarActiveTab: "1",
  },
  isGoCardlessConnected: false,
  useQueryApiCalls: {
    [USER_CONTEXT_CONSTANTS.KEYS._recurringInvoice]: false,
  },
};
const UserDataContext = createContext(initalState);

export const UPDATE_UI_DATA = "UPDATE_UI_DATA";
export const CALLED_API = "CALLED_API";
export const GOCARDLESS_CONNECTED = "GOCARDLESS_CONNECTED";

const { Provider } = UserDataContext;

const UserDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "SET_LOADING":
        return {
          ...state,
          loading: action.payload !== "undefined" ? action.payload : false,
        };
      case "SET_USER_DATA":
        return {
          ...state,
          loading: false,
          isAuthenticated: action.payload.success,
          userData: {
            ...action.payload.data,
            verifiedStatus:
              action.payload?.isVerified ||
              action.payload.data.verifiedStatus ||
              "",
          },
          permissions: action.payload.permissions
            ? action.payload.permissions
            : [],
          accountSetting: action.payload.data.accountSetting,
          isImpersonate: action.payload.isImpersonate
            ? action.payload.isImpersonate
            : false,
          ...(action.payload?.isImpersonate &&
          !state?.isImpersonate &&
          state?.userData
            ? { impersonator: state.userData }
            : {}),
        };
      case "SET_EMAIL_VERIFIED":
        return {
          ...state,
          userData: { ...UserDataContext, isEmailVerified: true },
        };
      case "CHANGE_USER_ROLE": {
        // console.log("invoked", action.payload)
        return {
          ...state,
          userData: { ...state.userData, role: action.payload },
        };
      }

      case "UPDATE_USER_DATA":
        return {
          ...state,
          userData: { ...state.userData, [action.payload]: action.payload },
        };
      case "SET_PROFILE_COMPLETENESS_DATA":
        return {
          ...state,
          profileCompletenessData: action.payload,
        };
      case "SET_PROFILE_INFO":
        return {
          ...state,
          profileInfo: action.payload,
        };

      case "UPDATE_PROFILE_ABOUT":
        return {
          ...state,
          profileInfo: {
            ...state.profileInfo,
            ProfileAbout: action.payload,
            ProfileConnect: {
              ...state.profileInfo.ProfileConnect,
              ...action.payload,
            },
          },
          userData: { ...state.userData, ...action.payload },
        };
      case "UPDATE_BANK_DETAILS":
        return {
          ...state,
          profileInfo: {
            ...state.profileInfo,
            ProfileBankData: action.payload,
          },
        };
      case "UPDATE_CONNECT_DETAILS":
        return {
          ...state,
          profileInfo: { ...state.profileInfo, ProfileConnect: action.payload },
        };
      case "UPDATE_ADDRESS":
        const profileData = state.userData;
        profileData.address["city"] = action.payload["city"];
        profileData.address["country"] = action.payload["country"];

        profileData["facebookLink"] = action.payload["facebookLink"];
        profileData["googleLink"] = action.payload["googleLink"];
        profileData["telegramLink"] = action.payload["telegramLink"];
        return {
          ...state,
          userData: profileData,
        };
      case "UPDATE_STRIPE_CONNECT":
        return {
          ...state,
          userData: {
            ...state.userData,
            connected_account_id: action.payload.data,
            isStripeConnectActive: action.payload.status,
          },
        };
      case UPDATE_UI_DATA:
        return {
          ...state,
          uiData: {
            ...state.uiData,
            [action.payload.key]: action.payload.data,
          },
        };
      case CALLED_API:
        return { ...state, calledAPI: action.payload };
      case GOCARDLESS_CONNECTED:
        return { ...state, isGoCardlessConnected: action.payload };
      case "USE_QUERY_API_CALLED":
        return {
          ...state,
          useQueryApiCalls: {
            ...state.useQueryApiCalls,
            [action.payload.key]: action.payload.data,
          },
        };
      case "LOGOUT":
        return {
          ...initalState,
          loading: false,
        };

      default:
        return state;
    }
  }, initalState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { UserDataProvider, UserDataContext };
