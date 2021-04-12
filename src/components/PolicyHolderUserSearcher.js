import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import {
    withModulesManager,
    formatMessageWithValues,
    Searcher,
    formatDateFromISO,
    decodeId,
    journalize
} from "@openimis/fe-core";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchPolicyHolderUsers } from "../actions"
import {
    DEFAULT_PAGE_SIZE,
    RIGHT_POLICYHOLDERUSER_UPDATE,
    RIGHT_PORTALPOLICYHOLDERUSER_UPDATE,
    ROWS_PER_PAGE_OPTIONS
} from "../constants";
import PolicyHolderUserFilter from "./PolicyHolderUserFilter";
import UpdatePolicyHolderUserDialog from "../dialogs/UpdatePolicyHolderUserDialog";

const DEFAULT_ORDER_BY = "id";

class PolicyHolderUserSearcher extends Component {
    state = {
        queryParams: null
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
        } else if (prevProps.reset !== this.props.reset) {
            this.refetch();
        }
    }

    fetch = params => this.props.fetchPolicyHolderUsers(params);

    refetch = () => this.fetch(this.state.queryParams);

    filtersToQueryParams = state => {
        let params = Object.keys(state.filters)
            .filter(f => !!state.filters[f]['filter'])
            .map(f => state.filters[f]['filter']);
        params.push(`first: ${state.pageSize}`);
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
        const result = [
            "policyHolder.policyHolderUser.userName",
            "policyHolder.policyHolderUser.dateValidFrom",
            "policyHolder.policyHolderUser.dateValidTo"
        ];
        if (
            [
                RIGHT_POLICYHOLDERUSER_UPDATE,
                RIGHT_PORTALPOLICYHOLDERUSER_UPDATE
            ].some(right => this.props.rights.includes(right))
        ) {
            result.push("policyHolder.emptyLabel");
        }
        return result;
    }

    itemFormatters = () => {
        const { intl, modulesManager, rights, onSave } = this.props;
        const result = [
            policyHolderUser => !!policyHolderUser.user
                ? decodeId(policyHolderUser.user.id)
                : "",
            policyHolderUser => !!policyHolderUser.dateValidFrom
                ? formatDateFromISO(modulesManager, intl, policyHolderUser.dateValidFrom)
                : "",
            policyHolderUser => !!policyHolderUser.dateValidTo
                ? formatDateFromISO(modulesManager, intl, policyHolderUser.dateValidTo)
                : ""
        ];
        if (
            [
                RIGHT_POLICYHOLDERUSER_UPDATE,
                RIGHT_PORTALPOLICYHOLDERUSER_UPDATE
            ].some(right => rights.includes(right))
        ) {
            result.push(
                policyHolderUser => !this.isDeletedFilterEnabled(policyHolderUser) && (
                    <UpdatePolicyHolderUserDialog
                        onSave={onSave}
                        policyHolderUser={policyHolderUser}
                    />
                )
            )
        }
        return result;
    }

    sorts = () => [
        ['id', true],
        ['dateValidFrom', true],
        ['dateValidTo', true]
    ];

    defaultFilters = () => ({
        isDeleted: {
            value: false,
            filter: "isDeleted: false"
        }
    });

    isDeletedFilterEnabled = policyHolderUser => policyHolderUser.isDeleted;

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
                    "policyHolderUser.searcher.results.title",
                    { policyHolderUsersTotalCount }
                )}
                filtersToQueryParams={this.filtersToQueryParams}
                headers={this.headers}
                itemFormatters={this.itemFormatters}
                sorts={this.sorts}
                rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                defaultPageSize={DEFAULT_PAGE_SIZE}
                defaultOrderBy={DEFAULT_ORDER_BY}
                defaultFilters={this.defaultFilters()}
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
    submittingMutation: state.policyHolder.submittingMutation,
    mutation: state.policyHolder.mutation
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPolicyHolderUsers, journalize }, dispatch);
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(PolicyHolderUserSearcher)));
