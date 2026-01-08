import React, { createContext, useReducer } from 'react';

const initalState = {
    sidebarCollapsed: false,
    // sidebarClass: "menu__sidebar mobileSidebarShow", // comment out and comment in below line if you want keep sidebar on mobile in open state
    sidebarClass: "menu__sidebar",
    location: window.location,
    profileInfoSettingsTab: 0,
    openAddContactModal: false,
    openViewProfileModal: false,
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
    showLinearProgress: false
};
const InterfaceContext = createContext(initalState);

const { Provider } = InterfaceContext;
const InterfaceProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'START_LINEAR_PROGRESS':
                return {
                    ...state,
                    showLinearProgress: action.payload ? action.payload : true
                }
            case 'END_LINEAR_PROGRESS':
                return {
                    ...state,
                    showLinerProgress: action.payload ? action.payload : false
                }
            case 'TOGGLE_SIDEBAR':
                return {
                    ...state,
                    sidebarCollapsed: !state.sidebarCollapsed
                }
            case 'COLLAPSE_SIDEBAR':
                return {
                    ...state,
                    sidebarCollapsed: action.payload !== undefined ? action.payload : true
                }
            // case 'HIDE_SIDEBAR':
            //     return {
            //         ...state,
            //         sidebarHidden: action.payload !== undefined ? action.payload : true
            //     }
            case 'UPDATE_SIDEBAR_CLASS':
                return {
                    ...state,
                    sidebarClass: action.payload ? action.payload : "menu__sidebar"
                }
            case 'SET_LOCATION':
                return {
                    ...state,
                    location: action.payload ? action.payload : window.location
                }
            case 'SWITCH_PROFILE_INFO_TAB':
                return { ...state, profileInfoSettingsTab: action.payload }

            case 'OPEN_ADD_CONTACT_MODAL':
                return { ...state, openAddContactModal: true }
            case 'CLOSE_ADD_CONTACT_MODAL':
                return { ...state, openAddContactModal: false }

            case "OPEN_VIEW_PROFILE_MODAL":
                return { ...state, openViewProfileModal: true };
            case "CLOSE_VIEW_PROFILE__MODAL":
            return { ...state, openViewProfileModal: false };

            case 'SET_WINDOW_SIZE':
                return { ...state, windowWidth: action.payload.width, windowHeight: action.payload.height }

            default:
                return state
        };
    }, initalState);
    return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { InterfaceProvider, InterfaceContext }