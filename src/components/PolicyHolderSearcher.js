import React, { Component, Fragment } from "react"
import { injectIntl } from 'react-intl';
import { withModulesManager, Searcher, formatMessage, formatMessageWithValues, formatDateFromISO, PublishedComponent } from "@openimis/fe-core";
import PolicyHolderFilter from "./PolicyHolderFilter";
import { fetchPolicyHolders } from "../actions"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { IconButton, Tooltip } from "@material-ui/core";
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
            "policyHolder.displayName",
            "policyHolder.location",
            "policyHolder.legalForm",
            "policyHolder.activityCode",
            "policyHolder.dateValidFrom",
            "policyHolder.dateValidTo",
            "policyHolder.emptyLabel",
            "policyHolder.emptyLabel"
        ];
    }

    itemFormatters = () => {
        const { intl, modulesManager, onDoubleClick, policyHolderPageLink } = this.props;
        return [
            policyHolder => !!policyHolder.code && policyHolder.tradeName
                ? `${policyHolder.code} ${policyHolder.tradeName}` : "",
            policyHolder => 
                <PublishedComponent
                    pubRef="location.DetailedLocation"
                    withNull={true}
                    readOnly={true}
                    value={!!policyHolder.locations ? policyHolder.locations : null} />,
            policyHolder => !!policyHolder.legalForm
                ? <PublishedComponent
                    pubRef="policyHolder.LegalFormPicker"
                    module="policyHolder"
                    label="legalForm"
                    value={policyHolder.legalForm}
                    disabled={true} />
                : "",
            policyHolder => !!policyHolder.activityCode
                ? <PublishedComponent
                    pubRef="policyHolder.ActivityCodePicker"
                    module="policyHolder"
                    label="activityCode"
                    value={policyHolder.activityCode}
                    disabled={true} />
                : "",
            policyHolder => !!policyHolder.dateValidFrom
                ? formatDateFromISO(modulesManager, intl, policyHolder.dateValidFrom)
                : "",
            policyHolder => !!policyHolder.dateValidTo
                ? formatDateFromISO(modulesManager, intl, policyHolder.dateValidTo)
                : "",
            policyHolder => (
                <Tooltip title={formatMessage(this.props.intl, "policyHolder", "editButton.tooltip")}>
                    <IconButton 
                        href={policyHolderPageLink(policyHolder)} 
                        onClick={e => e.stopPropagation() && !policyHolder.clientMutationId && onDoubleClick(policyHolder)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            ),
            policyHolder => <IconButton disabled><DeleteIcon /></IconButton>
        ]
    }

    sorts = () => {
        return [
            ['code', true],
            null,
            ['legalForm', true],
            ['activityCode', true],
            ['dateValidFrom', true],
            ['dateValidTo', true]
        ]
    }

    render() {
        const { intl, fetchingPolicyHolders, fetchedPolicyHolders, errorPolicyHolders, policyHolders, policyHoldersPageInfo,
            policyHoldersTotalCount, onDoubleClick } = this.props;
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
                    tableTitle={formatMessageWithValues(intl, "policyHolder", "policyHolders.searcher.results.title", { policyHoldersTotalCount })}
                    headers={this.headers}
                    itemFormatters={this.itemFormatters}
                    filtersToQueryParams={this.filtersToQueryParams}
                    sorts={this.sorts}
                    rowsPerPageOptions={this.rowsPerPageOptions}
                    defaultPageSize={this.defaultPageSize}
                    defaultOrderBy="code"
                    onDoubleClick={policyHolder => !policyHolder.clientMutationId && onDoubleClick(policyHolder)}
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
    policyHoldersPageInfo: state.policyHolder.policyHoldersPageInfo,
    policyHoldersTotalCount: state.policyHolder.policyHoldersTotalCount
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPolicyHolders }, dispatch);
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(PolicyHolderSearcher)));
