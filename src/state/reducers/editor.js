import { useReducer } from "react";
import { createContainer } from "react-tracked";

const useValue = ({ reducer, initialState }) => useReducer(reducer, initialState);

export const AppActionsTypes = {
    SetRevisionDispatch: "SET_REVISION_DISPATCH",
    SetRevisionState: "SET_REVISION_STATE",
    SetRevisionQuery: "SET_REVISION",
    SetSummaryState: "SET_SUMMARY_STATE",
    SetTaskTemplates: "SET_TASK_TEMPLATES"
};

export const reducer = (state, action) => {
    switch (action.type) {
        case AppActionsTypes.SetRevisionDispatch:
            return { ...state, revisionDispatch: action };

        case AppActionsTypes.SetRevisionState:
            return { ...state, revisionState: action };

        case AppActionsTypes.SetRevisionQuery:
            return { ...state, revisionQuery: action };

        case AppActionsTypes.SetSummaryState:
            return { ...state, summaryState: action };

        case AppActionsTypes.SetTaskTemplates:
            return { ...state, taskTemplatesData: action.data };
        default:
            throw new Error(`unknown action type: ${action.type}`);
    }
};

export const { Provider, useTracked } = createContainer(useValue);
