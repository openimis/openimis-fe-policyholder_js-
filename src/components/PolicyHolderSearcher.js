import React, { Component, Fragment } from "react"
import { injectIntl } from 'react-intl';
import { withModulesManager, Searcher, formatMessageWithValues } from "@openimis/fe-core";
import PolicyHolderFilter from "./PolicyHolderFilter";
import { fetchPolicyHolders } from "../actions"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { IconButton } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

class PolicyHolderSearcher extends Component {
    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-policyHolder", "policyHolderFilter.rowsPerPageOptions", [10, 20, 50, 100]);
        this.defaultPageSize = props.modulesManager.getConf("fe-policyHolder", "policyHolderFilter.defaultPageSize", 10);
    }

    fetch = (prms) => {
        this.props.fetchPolicyHolders(this.props.modulesManager, prms);
    }

    filtersToQueryParams = (state) => {
        let prms = Object.keys(state.filters)
            .filter(f => !!state.filters[f]['filter'])
            .map(f => state.filters[f]['filter']);
        prms.push(`first: ${state.pageSize}`);
        if (!!state.afterCursor) {
            prms.push(`after: "${state.afterCursor}"`)
        }
        if (!!state.beforeCursor) {
            prms.push(`before: "${state.beforeCursor}"`)
        }
        if (!!state.orderBy) {
            prms.push(`orderBy: ["${state.orderBy}"]`);
        }
        console.log(prms);
        return prms;
    }

    headers = () => {
        return [
            "policyHolder.displayName",
            "policyHolder.location",
            "policyHolder.legalForm",
            "policyHolder.activityCode",
            "policyHolder.dateValidFrom",
            "policyHolder.dateValidTo",
            "policyHolder.actionButtonColumnHeader",
            "policyHolder.actionButtonColumnHeader"
        ];
    }

    itemFormatters = () => {
        return [
            policyHolder => `${policyHolder.code} ${policyHolder.tradeName}`,
            policyHolder => policyHolder.name,
            policyHolder => "",
            policyHolder => "",
            policyHolder => "",
            policyHolder => "",
            policyHolder => <IconButton disabled><EditIcon /></IconButton>,
            policyHolder => <IconButton disabled><DeleteIcon /></IconButton>
        ]
    }

    sorts = () => {
        return [
            ['displayName', true],
            ['location', true],
            ['legalForm', true],
            ['activityCode', true],
            ['dateValidFrom', true],
            ['dateValidTo', true]
        ]
    }

    render() {
        const { intl, fetchingPolicyHolders, fetchedPolicyHolders, errorPolicyHolders, policyHolders, policyHoldersPageInfo } = this.props;
        const count = policyHoldersPageInfo.totalCount;
        console.log(policyHoldersPageInfo);
        return (
            <Fragment>
                <Searcher
                    module="policyHolder"
                    FilterPane={PolicyHolderFilter}
                    fetch={this.fetch}
                    items={policyHolders}
                    itemsPageInfo={policyHoldersPageInfo}
                    fetchingItems={fetchingPolicyHolders}
                    fetchedItems={fetchedPolicyHolders}
                    errorItems={errorPolicyHolders}
                    tableTitle={formatMessageWithValues(intl, "policyHolder", "policyHolders.searcher.results.title", { count })}
                    headers={this.headers}
                    itemFormatters={this.itemFormatters}
                    filtersToQueryParams={this.filtersToQueryParams}
                    sorts={this.sorts}
                    rowsPerPageOptions={this.rowsPerPageOptions}
                    defaultPageSize={this.defaultPageSize}
                    defaultOrderBy="code"
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    fetchingPolicyHolders: state.policyHolder.fetchingPolicyHolders,
    fetchedPolicyHolders: state.policyHolder.fetchedPolicyHolders,
    errorPolicyHolders: state.policyHolder.errorPolicyHolders,
    policyHolders: state.policyHolder.policyHolders,
    policyHoldersPageInfo: state.policyHolder.policyHoldersPageInfo
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPolicyHolders }, dispatch);
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(PolicyHolderSearcher)));