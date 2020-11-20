import {
    formatServerError, formatGraphQLError, parseData, pageInfo
} from "@openimis/fe-core";

function reducer(
    state = {
        fetchingPolicyHolders: false,
        errorPolicyHolders: null,
        fetchedPolicyHolders: false,
        policyHolders: [],
        policyHoldersPageInfo: { totalCount: 0 }
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
                policyHoldersPageInfo: { totalCount: 0 },
                errorPolicyHolders: null
            };
        case "POLICYHOLDER_POLICYHOLDERS_RESP":
            return {
                ...state,
                fetchingPolicyHolders: false,
                fetchedPolicyHolders: true,
                policyHolders: parseData(action.payload.data.healthFacilities),
                policyHoldersPageInfo: pageInfo(action.payload.data.healthFacilities),
                errorPolicyHolders: formatGraphQLError(action.payload)
            };
        case "POLICYHOLDER_POLICYHOLDERS_ERR":
            return {
                ...state,
                fetchingPolicyHolders: false,
                errorPolicyHolders: formatServerError(action.payload)
            }
        default:
            return state;
    }
}

export default reducer;