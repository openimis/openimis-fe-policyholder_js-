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
        mutation: {},
        fetchingPolicyHolder: false,
        errorPolicyHolder: null,
        fetchedPolicyHolder: false,
        policyHolder: {},
        fetchingPolicyHolderUsers: false,
        errorPolicyHolderUsers: null,
        fetchedPolicyHolderUsers: false,
        policyHolderUsers: [],
        policyHolderUsersPageInfo: {},
        policyHolderUsersTotalCount: 0
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
                policyHoldersTotalCount: !!action.payload.data.policyHolder ? action.payload.data.policyHolder.totalCount : null,
                errorPolicyHolders: formatGraphQLError(action.payload)
            };
        case "POLICYHOLDER_POLICYHOLDERS_ERR":
            return {
                ...state,
                fetchingPolicyHolders: false,
                errorPolicyHolders: formatServerError(action.payload)
            };
        case 'POLICYHOLDER_POLICYHOLDER_REQ':
            return {
                ...state,
                fetchingPolicyHolder: true,
                fetchedPolicyHolder: false,
                policyHolder: null,
                errorPolicyHolder: null,
            };
        case 'POLICYHOLDER_POLICYHOLDER_RESP':
            var policyHolders = parseData(action.payload.data.policyHolder);
            return {
                ...state,
                fetchingPolicyHolder: false,
                fetchedPolicyHolder: true,
                policyHolder: (!!policyHolders && policyHolders.length > 0) ? policyHolders[0] : null,
                errorPolicyHolder: formatGraphQLError(action.payload)
            };
        case 'POLICYHOLDER_POLICYHOLDER_ERR':
            return {
                ...state,
                fetchingPolicyHolder: false,
                errorPolicyHolder: formatServerError(action.payload)
            };
        case "POLICYHOLDER_POLICYHOLDERUSERS_REQ":
            return {
                ...state,
                fetchingPolicyHolderUsers: true,
                fetchedPolicyHolderUsers: false,
                policyHolderUsers: [],
                policyHolderUsersPageInfo: {},
                policyHolderUsersTotalCount: 0,
                errorPolicyHolderUsers: null
            };
        case "POLICYHOLDER_POLICYHOLDERUSERS_RESP":
            return {
                ...state,
                fetchingPolicyHolderUsers: false,
                fetchedPolicyHolderUsers: true,
                policyHolderUsers: parseData(action.payload.data.policyHolderUser),
                policyHolderUsersPageInfo: pageInfo(action.payload.data.policyHolderUser),
                policyHolderUsersTotalCount: !!action.payload.data.policyHolderUser ? action.payload.data.policyHolderUser.totalCount : null,
                errorPolicyHolderUsers: formatGraphQLError(action.payload)
            };
        case "POLICYHOLDER_POLICYHOLDERUSERS_ERR":
            return {
                ...state,
                fetchingPolicyHolderUsers: false,
                errorPolicyHolders: formatServerError(action.payload)
            };
        case "POLICYHOLDER_MUTATION_REQ":
            return dispatchMutationReq(state, action);
        case "POLICYHOLDER_MUTATION_ERR":
            return dispatchMutationErr(state, action);
        case "POLICYHOLDER_CREATE_POLICYHOLDER_RESP":
            return dispatchMutationResp(state, "createPolicyHolder", action);
        case "POLICYHOLDER_UPDATE_POLICYHOLDER_RESP":
            return dispatchMutationResp(state, "updatePolicyHolder", action);
        case "POLICYHOLDER_DELETE_POLICYHOLDER_RESP":
            return dispatchMutationResp(state, "deletePolicyHolder", action);
        default:
            return state;
    }
}

export default reducer;
