import React, { Component, Fragment } from "react"
import { injectIntl } from 'react-intl';
import { withModulesManager, formatMessageWithValues, formatDateFromISO, Searcher, PublishedComponent, decodeId } from "@openimis/fe-core";
import PolicyHolderInsureeFilter from "./PolicyHolderInsureeFilter";
import { fetchPolicyHolderInsurees } from "../actions"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { DATE_TO_DATETIME_SUFFIX, DEFAULT_PAGE_SIZE, ROWS_PER_PAGE_OPTIONS } from "../constants"

class PolicyHolderInsureeSearcher extends Component {
    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-policyHolder", "policyHolderFilter.rowsPerPageOptions", ROWS_PER_PAGE_OPTIONS);
        this.defaultPageSize = props.modulesManager.getConf("fe-policyHolder", "policyHolderFilter.defaultPageSize", DEFAULT_PAGE_SIZE);
    }

    fetch = (params) => {
        this.props.fetchPolicyHolderInsurees(this.props.modulesManager, params);
    }

    filtersToQueryParams = state => {
        let params = Object.keys(state.filters)
            .filter(f => !!state.filters[f]['filter'])
            .map(f => state.filters[f]['filter']);
        params.push(`first: ${state.pageSize}`);
        if (!state.filters.hasOwnProperty('isDeleted')) {
            params.push("isDeleted: false");
        }
        if (!state.filters.hasOwnProperty('dateValidTo')) {
            let dateValidAt = formatDateFromISO(this.props.modulesManager, this.props.intl, new Date());
            if (state.filters.hasOwnProperty('dateValidFrom')) {
                /**
                 * If @see dateValidTo is not set but @see dateValidFrom is set,
                 * then all @see PolicyHolderInsuree valid at @see dateValidFrom are shown.
                 * Default filter on @see dateValidFrom has to be removed from query params. 
                 */
                dateValidAt = state.filters['dateValidFrom']['value'];
                params = params.filter(f => !f.startsWith('dateValidFrom'));
            }
            params.push(`dateValidFrom_Lte: "${dateValidAt}${DATE_TO_DATETIME_SUFFIX}"`);
            params.push(`dateValidTo_Gte: "${dateValidAt}${DATE_TO_DATETIME_SUFFIX}"`);
        }
        if (!!state.afterCursor) {
            params.push(`after: "${state.afterCursor}"`);
        }
        if (!!state.beforeCursor) {
            params.push(`before: "${state.beforeCursor}"`);
        }
        if (!!state.orderBy) {
            params.push(`orderBy: ["${state.orderBy}"]`);
        }
        return params;
    }

    headers = () => {
        return [
            "policyHolder.name",
            "policyHolder.contributionPlanBundle",
            "policyHolder.calculation",
            "policyHolder.dateValidFrom",
            "policyHolder.dateValidTo"
        ];
    }

    itemFormatters = () => {
        const { intl, modulesManager } = this.props;
        return [
            policyHolderInsuree => !!policyHolderInsuree.insuree
                ? <PublishedComponent
                    pubRef="insuree.InsureePicker"
                    value={policyHolderInsuree.insuree}
                    withLabel={false}
                    readOnly />
                : "",
            policyHolderInsuree => !!policyHolderInsuree.contributionPlanBundle
                ? <PublishedComponent
                    pubRef="contributionPlan.ContributionPlanBundlePicker"
                    withLabel={false}
                    value={decodeId(policyHolderInsuree.contributionPlanBundle.id)}
                    readOnly />
                : "",
            policyHolderInsuree => !!policyHolderInsuree.jsonExt ? policyHolderInsuree.jsonExt : "",
            policyHolderInsuree => !!policyHolderInsuree.dateValidFrom
                ? formatDateFromISO(modulesManager, intl, policyHolderInsuree.dateValidFrom)
                : "",
            policyHolderInsuree => !!policyHolderInsuree.dateValidTo
                ? formatDateFromISO(modulesManager, intl, policyHolderInsuree.dateValidTo)
                : ""
        ];
    }

    sorts = () => {
        return [
            ['insuree', true],
            ['contributionPlanBundle', true],
            null,
            ['dateValidFrom', true],
            ['dateValidTo', true]
        ]
    }

    render() {
        const { intl, fetchingPolicyHolderInsurees, fetchedPolicyHolderInsurees, errorPolicyHolderInsurees, 
            policyHolderInsurees, policyHolderInsureesPageInfo, policyHolderInsureesTotalCount } = this.props;
        return (
            <Fragment>
                <Searcher
                    module="policyHolder"
                    FilterPane={PolicyHolderInsureeFilter}
                    fetch={this.fetch}
                    items={policyHolderInsurees}
                    itemsPageInfo={policyHolderInsureesPageInfo}
                    fetchingItems={fetchingPolicyHolderInsurees}
                    fetchedItems={fetchedPolicyHolderInsurees}
                    errorItems={errorPolicyHolderInsurees}
                    tableTitle={formatMessageWithValues(intl, "policyHolder", "PolicyHolderInsurees.searcher.results.title", { policyHolderInsureesTotalCount })}
                    headers={this.headers}
                    itemFormatters={this.itemFormatters}
                    filtersToQueryParams={this.filtersToQueryParams}
                    sorts={this.sorts}
                    rowsPerPageOptions={this.rowsPerPageOptions}
                    defaultPageSize={this.defaultPageSize}
                    defaultOrderBy="insuree"
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    fetchingPolicyHolderInsurees: state.policyHolder.fetchingPolicyHolderInsurees,
    fetchedPolicyHolderInsurees: state.policyHolder.fetchedPolicyHolderInsurees,
    errorPolicyHolderInsurees: state.policyHolder.errorPolicyHolderInsurees,
    policyHolderInsurees: state.policyHolder.policyHolderInsurees,
    policyHolderInsureesPageInfo: state.policyHolder.policyHolderInsureesPageInfo,
    policyHolderInsureesTotalCount: state.policyHolder.policyHolderInsureesTotalCount
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPolicyHolderInsurees }, dispatch);
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(PolicyHolderInsureeSearcher)));
