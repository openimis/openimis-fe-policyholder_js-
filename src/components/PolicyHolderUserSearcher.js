import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import {
    withModulesManager,
    formatMessageWithValues,
    Searcher,
    formatDateFromISO,
    decodeId
} from "@openimis/fe-core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchPolicyHolderUsers } from "../actions"
import {
    DEFAULT_PAGE_SIZE,
    ROWS_PER_PAGE_OPTIONS
} from "../constants";
import PolicyHolderUserFilter from "./PolicyHolderUserFilter";

const DEFAULT_ORDER_BY = "id";

class PolicyHolderUserSearcher extends Component {
    fetch = params => this.props.fetchPolicyHolderUsers(params);

    headers = () => [
        "policyHolder.policyHolderUser.userName",
        "policyHolder.policyHolderUser.dateValidFrom",
        "policyHolder.policyHolderUser.dateValidTo"
    ];

    itemFormatters = () => {
        const { intl, modulesManager } = this.props;
        const result = [
            policyHolderUser => !!policyHolderUser.id
                ? decodeId(policyHolderUser.id)
                : "",
            policyHolderUser => !!policyHolderUser.dateValidFrom
                ? formatDateFromISO(modulesManager, intl, policyHolderUser.dateValidFrom)
                : "",
            policyHolderUser => !!policyHolderUser.dateValidTo
                ? formatDateFromISO(modulesManager, intl, policyHolderUser.dateValidTo)
                : ""
        ];
        return result;
    }

    sorts = () => [
        ['id', true],
        ['dateValidFrom', true],
        ['dateValidTo', true]
    ];

    render() {
        const {
            intl,
            fetchingPolicyHolderUsers,
            fetchedPolicyHolderUsers,
            errorPolicyHolderUsers,
            policyHolderUsers,
            policyHolderUsersPageInfo,
            policyHolderUsersTotalCount
        } = this.props;
        return (
            <Searcher
                module="policyHolder"
                FilterPane={PolicyHolderUserFilter}
                fetch={this.fetch}
                items={policyHolderUsers}
                itemsPageInfo={policyHolderUsersPageInfo}
                fetchingItems={fetchingPolicyHolderUsers}
                fetchedItems={fetchedPolicyHolderUsers}
                errorItems={errorPolicyHolderUsers}
                tableTitle={formatMessageWithValues(
                    intl,
                    "policyHolder",
                    "policyHolderUsers.searcher.results.title",
                    { policyHolderUsersTotalCount }
                )}
                headers={this.headers}
                itemFormatters={this.itemFormatters}
                sorts={this.sorts}
                rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                defaultPageSize={DEFAULT_PAGE_SIZE}
                defaultOrderBy={DEFAULT_ORDER_BY}
            />
        );
    }
}

const mapStateToProps = state => ({
    fetchingPolicyHolderUsers: state.policyHolder.fetchingPolicyHolderUsers,
    fetchedPolicyHolderUsers: state.policyHolder.fetchedPolicyHolderUsers,
    errorPolicyHolderUsers: state.policyHolder.errorPolicyHolderUsers,
    policyHolderUsers: state.policyHolder.policyHolderUsers,
    policyHolderUsersPageInfo: state.policyHolder.policyHolderUsersPageInfo,
    policyHolderUsersTotalCount: state.policyHolder.policyHolderUsersTotalCount,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPolicyHolderUsers }, dispatch);
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(PolicyHolderUserSearcher)));
