import React, { Component, Fragment } from "react"
import { injectIntl } from 'react-intl';
import { withModulesManager, formatMessage, formatMessageWithValues, formatDateFromISO,
    Searcher, PublishedComponent, withTooltip, coreConfirm } from "@openimis/fe-core";
import PolicyHolderInsureeFilter from "./PolicyHolderInsureeFilter";
import { fetchPolicyHolderInsurees, deletePolicyHolderInsuree } from "../actions"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import UpdatePolicyHolderInsureeDialog from "../dialogs/UpdatePolicyHolderInsureeDialog"
import { IconButton } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import { DATE_TO_DATETIME_SUFFIX, DEFAULT_PAGE_SIZE, ROWS_PER_PAGE_OPTIONS,
    RIGHT_POLICYHOLDERINSUREE_UPDATE, RIGHT_POLICYHOLDERINSUREE_DELETE, RIGHT_POLICYHOLDERINSUREE_REPLACE } from "../constants"

const DEFAULT_ORDER_BY = "insuree";

class PolicyHolderInsureeSearcher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toDelete: null,
            deleted: []
        }
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-policyHolder", "policyHolderFilter.rowsPerPageOptions", ROWS_PER_PAGE_OPTIONS);
        this.defaultPageSize = props.modulesManager.getConf("fe-policyHolder", "policyHolderFilter.defaultPageSize", DEFAULT_PAGE_SIZE);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.confirmed !== this.props.confirmed && !!this.props.confirmed && !!this.state.confirmedAction) {
            this.state.confirmedAction();
        } else if (prevState.toDelete !== this.state.toDelete) {
            this.setState(state => ({ deleted: state.deleted.concat(state.toDelete) }));
        } else if (prevState.deleted !== this.state.deleted || prevProps.reset !== this.props.reset) {
            this.refetch();
        }
    }

    fetch = params => this.props.fetchPolicyHolderInsurees(this.props.modulesManager, params);

    refetch = () => this.fetch(this.filtersToQueryParams({ filters: {}, pageSize: this.defaultPageSize, orderBy: [DEFAULT_ORDER_BY] }));

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
        const { rights } = this.props;
        let result = [
            "policyHolder.name",
            "policyHolder.contributionPlanBundle",
            "policyHolder.calculation",
            "policyHolder.dateValidFrom",
            "policyHolder.dateValidTo"
        ];
        if (rights.includes(RIGHT_POLICYHOLDERINSUREE_REPLACE)) {
            result.push("policyHolder.emptyLabel");
        }
        if (rights.includes(RIGHT_POLICYHOLDERINSUREE_UPDATE)) {
            result.push("policyHolder.emptyLabel");
        }
        if (rights.includes(RIGHT_POLICYHOLDERINSUREE_DELETE)) {
            result.push("policyHolder.emptyLabel");
        }
        return result;
    }

    itemFormatters = () => {
        const { intl, modulesManager, rights, policyHolder } = this.props;
        let result = [
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
                    value={policyHolderInsuree.contributionPlanBundle}
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
        if (rights.includes(RIGHT_POLICYHOLDERINSUREE_REPLACE)) {
            result.push(
                policyHolderInsuree =>
                    <UpdatePolicyHolderInsureeDialog
                        policyHolder={policyHolder}
                        policyHolderInsuree={policyHolderInsuree}
                        onSave={this.props.onSave}
                        disabled={this.state.deleted.includes(policyHolderInsuree.id)}
                        isReplacing={true}
                    />
            );
        }
        if (rights.includes(RIGHT_POLICYHOLDERINSUREE_UPDATE)) {
            result.push(
                policyHolderInsuree =>
                    <UpdatePolicyHolderInsureeDialog
                        policyHolder={policyHolder}
                        policyHolderInsuree={policyHolderInsuree}
                        onSave={this.props.onSave}
                        disabled={this.state.deleted.includes(policyHolderInsuree.id)}
                    />
            );
        }
        if (rights.includes(RIGHT_POLICYHOLDERINSUREE_DELETE)) {
            result.push(
                policyHolderInsuree => withTooltip(
                    <IconButton
                        onClick={() => this.onDelete(policyHolderInsuree)}
                        disabled={this.state.deleted.includes(policyHolderInsuree.id)}>
                        <DeleteIcon />
                    </IconButton>,
                    formatMessage(this.props.intl, "policyHolder", "deleteButton.tooltip")
                )
            )
        }
        return result;
    }

    onDelete = policyHolderInsuree => {
        const { intl, coreConfirm, deletePolicyHolderInsuree, policyHolder } = this.props;
        let confirm = () => coreConfirm(
            formatMessageWithValues(
                intl,
                "policyHolder",
                "policyHolderInsuree.deleteDialog.title",
                {
                    otherNames: policyHolderInsuree.insuree.otherNames,
                    lastName: policyHolderInsuree.insuree.lastName
                }),
            formatMessageWithValues(
                intl,
                "policyHolder",
                "policyHolderInsuree.deleteDialog.message",
                {
                    code: policyHolder.code,
                    tradeName: policyHolder.tradeName
                })
        );
        let confirmedAction = () => {
            deletePolicyHolderInsuree(
                policyHolderInsuree,
                formatMessageWithValues(
                    intl,
                    "policyHolder",
                    "DeletePolicyHolderInsuree.mutationLabel",
                    {
                        code: policyHolder.code,
                        tradeName: policyHolder.tradeName
                    }
                )
            );
            this.setState({ toDelete: policyHolderInsuree.id });
        }
        this.setState(
            { confirmedAction },
            confirm
        )
    }

    rowDeleted = (_, policyHolderInsuree) => this.state.deleted.includes(policyHolderInsuree.id);

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
                    tableTitle={formatMessageWithValues(intl, "policyHolder", "policyHolderInsuree.searcher.title", { policyHolderInsureesTotalCount })}
                    headers={this.headers}
                    itemFormatters={this.itemFormatters}
                    filtersToQueryParams={this.filtersToQueryParams}
                    sorts={this.sorts}
                    rowsPerPageOptions={this.rowsPerPageOptions}
                    defaultPageSize={this.defaultPageSize}
                    defaultOrderBy={DEFAULT_ORDER_BY}
                    rowLocked={this.rowDeleted}
                    rowDisabled={this.rowDeleted}
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
    policyHolderInsureesTotalCount: state.policyHolder.policyHolderInsureesTotalCount,
    confirmed: state.core.confirmed
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPolicyHolderInsurees, deletePolicyHolderInsuree, coreConfirm }, dispatch);
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(PolicyHolderInsureeSearcher)));
