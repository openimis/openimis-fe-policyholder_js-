import React, { Component, Fragment } from "react"
import { injectIntl } from 'react-intl';
import { withModulesManager, Searcher, formatMessageWithValues, formatDateFromISO, PublishedComponent } from "@openimis/fe-core";
import PolicyHolderFilter from "./PolicyHolderFilter";
import { fetchPolicyHolders } from "../actions"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { IconButton } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TabIcon from '@material-ui/icons/Tab';

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
        /**
         * Location "Level" parameter introduced 
         * in @see openimis-fe-location_js module 
         * by @see DetailedLocationFilter component
         * has to be removed from the filter for backend to respond correctly.
         * In the future this parameter should be handled to filter
         * PolicyHolders' locations with parent location
         */
        if (state.filters.hasOwnProperty('locations_Uuid')) {
            state.filters['locations_Uuid']['filter'] = state.filters['locations_Uuid']['filter'].split(',')[0];
        }
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
            "policyHolder.actionButtonColumnHeader",
            "policyHolder.actionButtonColumnHeader",
            "policyHolder.actionButtonColumnHeader"
        ];
    }

    itemFormatters = () => {
        const { intl, modulesManager } = this.props;
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
            policyHolder => <IconButton disabled><EditIcon /></IconButton>,
            policyHolder => <IconButton disabled><DeleteIcon /></IconButton>,
            policyHolder => <IconButton disabled><TabIcon /></IconButton>
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
        const { intl, fetchingPolicyHolders, fetchedPolicyHolders, errorPolicyHolders, policyHolders, policyHoldersPageInfo, policyHoldersTotalCount } = this.props;
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
