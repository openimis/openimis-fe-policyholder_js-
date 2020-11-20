import React, { Component } from "react"
import { injectIntl } from 'react-intl';
import { withModulesManager, TextInput, PublishedComponent } from "@openimis/fe-core";
import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    dialogTitle: theme.dialog.title,
    dialogContent: theme.dialog.content,
    form: {
        padding: 0
    },
    item: {
        padding: theme.spacing(1)
    },
    paperDivider: theme.paper.divider,
});

class PolicyHolderFilter extends Component {
    _filterValue = k => {
        const { filters } = this.props;
        return !!filters[k] ? filters[k].value : null
    }

    _onChangeFilter = (k, v) => {
        this.props.onChangeFilters([
            {
                id: k,
                value: v,
                filter: `${k}: ${v}`
            }
        ])
    }

    _onChangeStringFilter = (k, v, lookup) => {
        this.props.onChangeFilters([
            {
                id: k,
                value: v,
                filter: `${k}_${lookup}: "${v}"`
            }
        ])
    }

    render() {
        const { classes, onChangeFilters } = this.props;
        return (
            <Grid container className={classes.form}>
                <Grid item xs={2} className={classes.item}>
                    <TextInput
                        module="policyHolder"
                        label="PolicyHolderFilter.code"
                        value={this._filterValue('code')}
                        onChange={(v, _) => this._onChangeStringFilter('code', v, 'Icontains')}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item}>
                    <TextInput
                        module="policyHolder"
                        label="PolicyHolderFilter.tradeName"
                        value={this._filterValue('tradeName')}
                        onChange={(v, _) => this._onChangeStringFilter('tradeName', v, 'Icontains')}
                    />
                </Grid>
                <Grid item xs={8}>
                    <PublishedComponent
                        pubRef="location.DetailedLocationFilter"
                        withNull={true}
                        anchor="parentLocation"
                        onChangeFilters={onChangeFilters}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        pubRef="policyHolder.LegalFormPicker"
                        module="policyHolder"
                        label="LegalFormPicker.legalForm"
                        value={this._filterValue('legalForm')}
                        onChange={(v, _) => this._onChangeFilter('legalForm', v)}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        pubRef="policyHolder.ActivityCodePicker"
                        module="policyHolder"
                        label="ActivityCodePicker.activityCode"
                        value={this._filterValue('activityCode')}
                        onChange={(v, _) => this._onChangeFilter('activityCode', v)}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        pubRef="core.DatePicker"
                        module="policyHolder"
                        label="PolicyHolderFilter.dateValidFrom"
                        value={this._filterValue('dateValidFrom')}
                        onChange={(v, _) => this._onChangeFilter('dateValidFrom', v)}
                    />
                </Grid>
                <Grid item xs={3} className={classes.item}>
                    <PublishedComponent
                        pubRef="core.DatePicker"
                        module="policyHolder"
                        label="PolicyHolderFilter.dateValidTo"
                        value={this._filterValue('dateValidTo')}
                        onChange={(v, _) => this._onChangeFilter('dateValidTo', v)}
                    />
                </Grid>
            </Grid>
        )
    }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(PolicyHolderFilter))));