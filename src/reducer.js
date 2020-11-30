import {
    formatServerError, formatGraphQLError, parseData, pageInfo,
    dispatchMutationReq, dispatchMutationResp, dispatchMutationErr
} from "@openimis/fe-core";

function reducer(
    state = {
        fetchingPolicyHolders: false,
        errorPolicyHolders: null,
        fetchedPolicyHolders: false,
        policyHolders: [],
        policyHoldersPageInfo: {},
        policyHoldersTotalCount: 0,
        submittingMutation: false,
        mutation: {}
    },
    action
) {
    switch(action.type) {
        case "POLICYHOLDER_POLICYHOLDERS_REQ":
            return {
                ...state,
                fetchingPolicyHolders: true,
                fetchedPolicyHolders: false,
                policyHolders: [],
                policyHoldersPageInfo: {},
                policyHoldersTotalCount: 0,
                errorPolicyHolders: null
            };
        case "POLICYHOLDER_POLICYHOLDERS_RESP":
            return {
                ...state,
                fetchingPolicyHolders: false,
                fetchedPolicyHolders: true,
                policyHolders: parseData(action.payload.data.policyHolder),
                policyHoldersPageInfo: pageInfo(action.payload.data.policyHolder),
                policyHoldersTotalCount: action.payload.data.policyHolder.totalCount,
                errorPolicyHolders: formatGraphQLError(action.payload)
            };
        case "POLICYHOLDER_POLICYHOLDERS_ERR":
            return {
                ...state,
                fetchingPolicyHolders: false,
                errorPolicyHolders: formatServerError(action.payload)
            };
        case "POLICYHOLDER_MUTATION_REQ":
            return dispatchMutationReq(state, action);
        case "POLICYHOLDER_MUTATION_ERR":
            return dispatchMutationErr(state, action);
        case "POLICYHOLDER_CREATE_POLICYHOLDER_RESP":
            dispatchMutationResp(state, "createPolicyHolder", action);
        default:
            return state;
    }
}

export default reducer;