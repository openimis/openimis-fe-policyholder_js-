import React, { Component, Fragment } from "react"
import { injectIntl } from 'react-intl';
import { withModulesManager, formatMessageWithValues, formatDateFromISO,
    Searcher, decodeId } from "@openimis/fe-core";
    import PolicyHolderContributionPlanBundleFilter from "./PolicyHolderContributionPlanBundleFilter";
import { fetchPolicyHolderContributionPlanBundles } from "../actions"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { DEFAULT_PAGE_SIZE, ROWS_PER_PAGE_OPTIONS, RIGHT_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_REPLACE,
    RIGHT_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_UPDATE, RIGHT_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_DELETE } from "../constants"
import PolicyHolderContributionPlanBundlePicker from "../pickers/PolicyHolderContributionPlanBundlePicker";

const DEFAULT_ORDER_BY = "contributionPlanBundle";

class PolicyHolderContributionPlanBundleSearcher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queryParams: null
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.reset !== this.props.reset) {
            this.refetch();
        }
    }
    
    fetch = params => this.props.fetchPolicyHolderContributionPlanBundles(this.props.modulesManager, params);

    refetch = () => this.fetch(this.state.queryParams);

    filtersToQueryParams = state => {
        let params = Object.keys(state.filters)
            .filter(f => !!state.filters[f]['filter'])
            .map(f => state.filters[f]['filter']);
        params.push(`first: ${state.pageSize}`);
        params.push(`policyHolder_Id: "${decodeId(this.props.policyHolder.id)}"`);
        if (!state.filters.hasOwnProperty('isDeleted')) {
            params.push("isDeleted: false");
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
        this.setState({ queryParams: params });
        return params;
    }

    headers = () => {
        const { rights } = this.props;
        let result = [
            "policyHolder.contributionPlanBundle",
            "policyHolder.calculation",
            "policyHolder.dateValidFrom",
            "policyHolder.dateValidTo"
        ];
        if (rights.includes(RIGHT_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_REPLACE)) {
            result.push("policyHolder.emptyLabel");
        }
        if (rights.includes(RIGHT_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_UPDATE)) {
            result.push("policyHolder.emptyLabel");
        }
        if (rights.includes(RIGHT_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_DELETE)) {
            result.push("policyHolder.emptyLabel");
        }
        return result;
    }

    itemFormatters = () => {
        const { intl, modulesManager } = this.props;
        return [
            policyHolderContributionPlanBundle => !!policyHolderContributionPlanBundle.contributionPlanBundle
                ? <PolicyHolderContributionPlanBundlePicker
                    value={policyHolderContributionPlanBundle.contributionPlanBundle}
                    withLabel={false}
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
            ['contributionPlanBundle', true],
            null,
            ['dateValidFrom', true],
            ['dateValidTo', true]
        ]
    }

    render() {
        const { intl, fetchingPolicyHolderContributionPlanBundles, fetchedPolicyHolderContributionPlanBundles, errorPolicyHolderContributionPlanBundles, 
            policyHolderContributionPlanBundles, policyHolderContributionPlanBundlesPageInfo, policyHolderContributionPlanBundlesTotalCount } = this.props;
        return (
            <Fragment>
                <Searcher
                    module="policyHolder"
                    FilterPane={PolicyHolderContributionPlanBundleFilter}
                    fetch={this.fetch}
                    items={policyHolderContributionPlanBundles}
                    itemsPageInfo={policyHolderContributionPlanBundlesPageInfo}
                    fetchingItems={fetchingPolicyHolderContributionPlanBundles}
                    fetchedItems={fetchedPolicyHolderContributionPlanBundles}
                    errorItems={errorPolicyHolderContributionPlanBundles}
                    tableTitle={formatMessageWithValues(intl, "policyHolder", "policyHolderContributionPlanBundle.searcher.title", { policyHolderContributionPlanBundlesTotalCount })}
                    headers={this.headers}
                    itemFormatters={this.itemFormatters}
                    filtersToQueryParams={this.filtersToQueryParams}
                    sorts={this.sorts}
                    rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                    defaultPageSize={DEFAULT_PAGE_SIZE}
                    defaultOrderBy={DEFAULT_ORDER_BY}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    fetchingPolicyHolderContributionPlanBundles: state.policyHolder.fetchingPolicyHolderContributionPlanBundles,
    fetchedPolicyHolderContributionPlanBundles: state.policyHolder.fetchedPolicyHolderContributionPlanBundles,
    errorPolicyHolderContributionPlanBundles: state.policyHolder.errorPolicyHolderContributionPlanBundles,
    policyHolderContributionPlanBundles: state.policyHolder.policyHolderContributionPlanBundles,
    policyHolderContributionPlanBundlesPageInfo: state.policyHolder.policyHolderContributionPlanBundlesPageInfo,
    policyHolderContributionPlanBundlesTotalCount: state.policyHolder.policyHolderContributionPlanBundlesTotalCount
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPolicyHolderContributionPlanBundles }, dispatch);
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(PolicyHolderContributionPlanBundleSearcher)));
