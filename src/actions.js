import {
    graphql, formatPageQueryWithCount
} from "@openimis/fe-core";

export function fetchPolicyHolders(mm, prms) {
    var projections = ["code", "tradeName",
        "location" + mm.getProjection("location.Location.FlatProjection"),
        "legalForm", "activityCode", "dateValidFrom", "dateValidTo"
    ];
    const payload = formatPageQueryWithCount(
        "policyHolders",
        prms,
        projections
    );
    return graphql(payload, "POLICYHOLDER_POLICYHOLDERS")
}