import {
    graphql, formatPageQuery, formatPageQueryWithCount, formatMutation, decodeId, formatGQLString
} from "@openimis/fe-core";

const POLICYHOLDER_FULL_PROJECTION = mm => [
    "id", "code", "tradeName", "locations" + mm.getProjection("location.Location.FlatProjection"),
    "address", "phone", "fax", "email", "contactName", "legalForm", "activityCode",
    "accountancyAccount", "bankAccount", "paymentReference", "dateValidFrom", "dateValidTo"
];

function dateTimeToDate(date) {
    return date.split('T')[0];
}

export function fetchPolicyHolders(mm, prms) {
    const payload = formatPageQueryWithCount(
        "policyHolder",
        prms,
        POLICYHOLDER_FULL_PROJECTION(mm)
    );
    return graphql(payload, "POLICYHOLDER_POLICYHOLDERS");
}

export function fetchPolicyHolder(mm, policyHolderId) {
    let filter = !!policyHolderId ? `id: "${policyHolderId}"` : '';
    const payload = formatPageQuery(
        "policyHolder",
        [filter],
        POLICYHOLDER_FULL_PROJECTION(mm)
    );
    return graphql(payload, "POLICYHOLDER_POLICYHOLDER");
}

function formatPolicyHolderGQL(policyHolder) {
    return `
        ${policyHolder.id !== undefined && policyHolder.id !== null ? `id: "${decodeId(policyHolder.id)}"` : ''}
        ${!!policyHolder.code ? `code: "${formatGQLString(policyHolder.code)}"` : ""}
        ${!!policyHolder.tradeName ? `tradeName: "${formatGQLString(policyHolder.tradeName)}"` : ""}
        ${!!policyHolder.locations ? `locationsId: ${decodeId(policyHolder.locations.id)}` : ""}
        ${!!policyHolder.address ? `address: ${JSON.stringify(policyHolder.address).replace(/\\n/g, "\\n")}` : ""}
        ${!!policyHolder.phone ? `phone: "${formatGQLString(policyHolder.phone)}"` : ""}
        ${!!policyHolder.fax ? `fax: "${formatGQLString(policyHolder.fax)}"` : ""}
        ${!!policyHolder.email ? `email: "${formatGQLString(policyHolder.email)}"` : ""}
        ${!!policyHolder.contactName ? `contactName: ${JSON.stringify(policyHolder.contactName)}` : ""}
        ${!!policyHolder.legalForm ? `legalForm: ${policyHolder.legalForm}` : ""}
        ${!!policyHolder.activityCode ? `activityCode: ${policyHolder.activityCode}` : ""}
        ${!!policyHolder.accountancyAccount ? `accountancyAccount: "${formatGQLString(policyHolder.accountancyAccount)}"` : ""}
        ${!!policyHolder.bankAccount ? `bankAccount: ${JSON.stringify(policyHolder.bankAccount)}` : ""}
        ${!!policyHolder.paymentReference ? `paymentReference: "${formatGQLString(policyHolder.paymentReference)}"` : ""}
        ${!!policyHolder.dateValidFrom ? `dateValidFrom: "${dateTimeToDate(policyHolder.dateValidFrom)}"` : ""}
        ${!!policyHolder.dateValidTo ? `dateValidTo: "${dateTimeToDate(policyHolder.dateValidTo)}"` : ""}
    `;
}

export function createPolicyHolder(mm, policyHolder, clientMutationLabel) {
    let mutation = formatMutation("createPolicyHolder", formatPolicyHolderGQL(policyHolder), clientMutationLabel);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["POLICYHOLDER_MUTATION_REQ", "POLICYHOLDER_CREATE_POLICYHOLDER_RESP", "POLICYHOLDER_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}

export function updatePolicyHolder(mm, policyHolder, clientMutationLabel) {
    let mutation = formatMutation("updatePolicyHolder", formatPolicyHolderGQL(policyHolder), clientMutationLabel);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["POLICYHOLDER_MUTATION_REQ", "POLICYHOLDER_UPDATE_POLICYHOLDER_RESP", "POLICYHOLDER_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}
