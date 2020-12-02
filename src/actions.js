import {
    graphql, formatPageQueryWithCount
} from "@openimis/fe-core";

export function fetchPolicyHolders(mm, prms) {
    var projections = ["code", "tradeName",
        "locationsUuid" + mm.getProjection("location.Location.FlatProjection"),
        "legalForm", "activityCode", "dateValidFrom", "dateValidTo"
    ];
    const payload = formatPageQueryWithCount(
        "policyHolder",
        prms,
        projections
    );
    return graphql(payload, "POLICYHOLDER_POLICYHOLDERS")
}