import React, { Component, Fragment } from "react"
import { injectIntl } from 'react-intl';
import { withModulesManager, formatMessageWithValues, formatDateFromISO, Searcher } from "@openimis/fe-core";
import PolicyHolderFilter from "./PolicyHolderFilter";
import { fetchPolicyHolderUsers } from "../actions"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class PolicyHolderUserSearcher extends Component {
    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-policyHolder", "policyHolderFilter.rowsPerPageOptions", [10, 20, 50, 100]);
        this.defaultPageSize = props.modulesManager.getConf("fe-policyHolder", "policyHolderFilter.defaultPageSize", 10);
    }

    fetch = (prms) => {
        this.props.fetchPolicyHolderUsers(this.props.modulesManager, prms);
    }

    filtersToQueryParams = state => {
        let prms = Object.keys(state.filters)
            .filter(f => !!state.filters[f]['filter'])
            .map(f => state.filters[f]['filter']);
        prms.push(`first: ${state.pageSize}`);
        if (!state.filters.hasOwnProperty('isDeleted')) {
            prms.push("isDeleted: false");
        }
        if (!!state.afterCursor) {
            prms.push(`after: "${state.afterCursor}"`);
        }
        if (!!state.beforeCursor) {
            prms.push(`before: "${state.beforeCursor}"`);
        }
        if (!!state.orderBy) {
            prms.push(`orderBy: ["${state.orderBy}"]`);
        }
        return prms;
    }

    headers = () => {
        return [
            "policyHolderUser.userName",
            "policyHolder.dateValidFrom",
            "policyHolder.dateValidTo"
        ];
    }

    itemFormatters = () => {
        const { intl, modulesManager } = this.props;
        return [
            policyHolderUser => !!policyHolderUser.code && policyHolderUser.tradeName
                ? `${policyHolderUser.code} ${policyHolderUser.tradeName}` : "",
                policyHolderUser => !!policyHolderUser.dateValidFrom
                ? formatDateFromISO(modulesManager, intl, policyHolderUser.dateValidFrom)
                : "",
                policyHolderUser => !!policyHolderUser.dateValidTo
                ? formatDateFromISO(modulesManager, intl, policyHolderUser.dateValidTo)
                : ""
        ];
    }

    sorts = () => {
        return [
            ['name', true],
            ['dateValidFrom', true],
            ['dateValidTo', true]
        ]
    }

    render() {
        const { intl, fetchingPolicyHolderUsers, fetchedPolicyHolderUsers, errorPolicyHolderUsers, 
            policyHolderUsers, policyHolderUsersPageInfo, policyHolderUsersTotalCount } = this.props;
        return (
            <Fragment>
                <Searcher
                    module="policyHolder"
                    FilterPane={PolicyHolderFilter}
                    fetch={this.fetch}
                    items={policyHolderUsers}
                    itemsPageInfo={policyHolderUsersPageInfo}
                    fetchingItems={fetchingPolicyHolderUsers}
                    fetchedItems={fetchedPolicyHolderUsers}
                    errorItems={errorPolicyHolderUsers}
                    tableTitle={formatMessageWithValues(intl, "policyHolder", "policyHolderUsers.searcher.results.title", { policyHolderUsersTotalCount })}
                    headers={this.headers}
                    itemFormatters={this.itemFormatters}
                    filtersToQueryParams={this.filtersToQueryParams}
                    sorts={this.sorts}
                    rowsPerPageOptions={this.rowsPerPageOptions}
                    defaultPageSize={this.defaultPageSize}
                    defaultOrderBy="name"
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    fetchingPolicyHolderUsers: state.policyHolder.fetchingPolicyHolders,
    fetchedPolicyHolderUsers: state.policyHolder.fetchedPolicyHolders,
    errorPolicyHolderUsers: state.policyHolder.errorPolicyHolders,
    policyHolderUsers: state.policyHolder.policyHolders,
    policyHolderUsersPageInfo: state.policyHolder.policyHoldersPageInfo,
    policyHolderUsersTotalCount: state.policyHolder.policyHoldersTotalCount
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPolicyHolderUsers }, dispatch);
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(PolicyHolderUserSearcher)));
