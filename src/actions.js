import {
    graphql, formatPageQuery, formatPageQueryWithCount, formatMutation, decodeId, formatGQLString
} from "@openimis/fe-core";

const POLICYHOLDER_FULL_PROJECTION = modulesManager => [
    "id", "code", "tradeName", "locations" + modulesManager.getProjection("location.Location.FlatProjection"),
    "address", "phone", "fax", "email", "contactName", "legalForm", "activityCode",
    "accountancyAccount", "bankAccount", "paymentReference", "dateValidFrom", "dateValidTo"
];

const POLICYHOLDERINSUREE_FULL_PROJECTION = modulesManager => [
    "id", "dateValidFrom", "dateValidTo", "jsonExt",
    "policyHolder{id}",
    "insuree" + modulesManager.getProjection("insuree.InsureePicker.projection"),
    "contributionPlanBundle" + modulesManager.getProjection("contributionPlan.ContributionPlanBundlePicker.projection")
];

function dateTimeToDate(date) {
    return date.split('T')[0];
}

export function fetchPolicyHolders(modulesManager, params) {
    const payload = formatPageQueryWithCount(
        "policyHolder",
        params,
        POLICYHOLDER_FULL_PROJECTION(modulesManager)
    );
    return graphql(payload, "POLICYHOLDER_POLICYHOLDERS");
}

export function fetchPolicyHolder(modulesManager, policyHolderId) {
    let filter = !!policyHolderId ? `id: "${policyHolderId}"` : '';
    const payload = formatPageQuery(
        "policyHolder",
        [filter],
        POLICYHOLDER_FULL_PROJECTION(modulesManager)
    );
    return graphql(payload, "POLICYHOLDER_POLICYHOLDER");
}

export function fetchPolicyHolderInsurees(modulesManager, params) {
    const payload = formatPageQueryWithCount(
        "policyHolderInsuree",
        params,
        POLICYHOLDERINSUREE_FULL_PROJECTION(modulesManager)
    );
    return graphql(payload, "POLICYHOLDER_POLICYHOLDERINSUREES");
}

function formatPolicyHolderGQL(policyHolder) {
    return `
        ${!!policyHolder.id ? `id: "${decodeId(policyHolder.id)}"` : ''}
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

function formatPolicyHolderInsureeGQL(policyHolderInsuree, isReplaceMutation = false) {
    return `
        ${!!policyHolderInsuree.id ? `${isReplaceMutation ? 'uuid' : 'id'}: "${decodeId(policyHolderInsuree.id)}"` : ''}
        ${!!policyHolderInsuree.policyHolder && !isReplaceMutation ? `policyHolderId: "${decodeId(policyHolderInsuree.policyHolder.id)}"` : ''}
        ${!!policyHolderInsuree.insuree ? `insureeId: ${decodeId(policyHolderInsuree.insuree.id)}` : ""}
        ${!!policyHolderInsuree.contributionPlanBundle ? `contributionPlanBundleId: "${decodeId(policyHolderInsuree.contributionPlanBundle.id)}"` : ""}
        ${!!policyHolderInsuree.dateValidFrom ? `dateValidFrom: "${dateTimeToDate(policyHolderInsuree.dateValidFrom)}"` : ""}
        ${!!policyHolderInsuree.dateValidTo ? `dateValidTo: "${dateTimeToDate(policyHolderInsuree.dateValidTo)}"` : ""}
    `;
}

export function createPolicyHolder(policyHolder, clientMutationLabel) {
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

export function updatePolicyHolder(policyHolder, clientMutationLabel) {
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

export function deletePolicyHolder(policyHolder, clientMutationLabel, clientMutationDetails = null) {
    let policyHolderUuids = `uuids: ["${decodeId(policyHolder.id)}"]`;
    let mutation = formatMutation("deletePolicyHolder", policyHolderUuids, clientMutationLabel, clientMutationDetails);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["POLICYHOLDER_MUTATION_REQ", "POLICYHOLDER_DELETE_POLICYHOLDER_RESP", "POLICYHOLDER_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}

export function createPolicyHolderInsuree(policyHolderInsuree, clientMutationLabel) {
    let mutation = formatMutation("createPolicyHolderInsuree", formatPolicyHolderInsureeGQL(policyHolderInsuree), clientMutationLabel);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["POLICYHOLDER_MUTATION_REQ", "POLICYHOLDER_CREATE_POLICYHOLDERINSUREE_RESP", "POLICYHOLDER_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}

export function updatePolicyHolderInsuree(policyHolderInsuree, clientMutationLabel) {
    let mutation = formatMutation("updatePolicyHolderInsuree", formatPolicyHolderInsureeGQL(policyHolderInsuree), clientMutationLabel);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["POLICYHOLDER_MUTATION_REQ", "POLICYHOLDER_UPDATE_POLICYHOLDERINSUREE_RESP", "POLICYHOLDER_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}

export function deletePolicyHolderInsuree(policyHolderInsuree, clientMutationLabel, clientMutationDetails = null) {
    let policyHolderInsureeUuids = `uuids: ["${decodeId(policyHolderInsuree.id)}"]`;
    let mutation = formatMutation("deletePolicyHolderInsuree", policyHolderInsureeUuids, clientMutationLabel, clientMutationDetails);
    var requestedDateTime = new Date();
    return graphql(
        mutation.payload,
        ["POLICYHOLDER_MUTATION_REQ", "POLICYHOLDER_DELETE_POLICYHOLDERINSUREE_RESP", "POLICYHOLDER_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}

export function replacePolicyHolderInsuree(policyHolderInsuree, clientMutationLabel) {
    let mutation = formatMutation("replacePolicyHolderInsuree", formatPolicyHolderInsureeGQL(policyHolderInsuree, true), clientMutationLabel);
    var requestedDateTime = new Date();
    console.log(mutation.payload);
    return graphql(
        mutation.payload,
        ["POLICYHOLDER_MUTATION_REQ", "POLICYHOLDER_REPLACE_POLICYHOLDERINSUREE_RESP", "POLICYHOLDER_MUTATION_ERR"],
        {
            clientMutationId: mutation.clientMutationId,
            clientMutationLabel,
            requestedDateTime
        }
    );
}
