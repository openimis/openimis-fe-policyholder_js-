import React, { Component } from "react"
import { injectIntl } from 'react-intl';
import { withModulesManager, formatMessage, TextInput, PublishedComponent } from "@openimis/fe-core";
import { Grid, FormControlLabel, Checkbox } from "@material-ui/core";
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

    _onChangeDateFilter = (k, v, lookup) => {
        this.props.onChangeFilters([
            {
                id: k,
                value: v,
                filter: `${k}_${lookup}: "${v}T00:00:00"`
            }
        ])
    }

    render() {
        const { intl, classes, filters, onChangeFilters } = this.props;
        return (
            <Grid container className={classes.form}>
                <Grid item xs={2} className={classes.item}>
                    <TextInput
                        module="policyHolder"
                        label="name"
                        value={this._filterValue('name')}
                        onChange={v => this._onChangeStringFilter('name', v, 'Icontains')}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item}>
                    <PublishedComponent
                        pubRef="core.DatePicker"
                        module="policyHolder"
                        label="dateValidFrom"
                        value={this._filterValue('dateValidFrom')}
                        onChange={v => this._onChangeDateFilter('dateValidFrom', v, 'Gte')}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item}>
                    <PublishedComponent
                        pubRef="core.DatePicker"
                        module="policyHolder"
                        label="dateValidTo"
                        value={this._filterValue('dateValidTo')}
                        onChange={v => this._onChangeDateFilter('dateValidTo', v, 'Lte')}
                    />
                </Grid>
                <Grid item xs={2} className={classes.item}>
                    <FormControlLabel
                        control={<Checkbox 
                            checked={!!this._filterValue('isDeleted')}
                            onChange={event => this._onChangeFilter('isDeleted', event.target.checked)}
                            name="isDeleted" 
                        />}
                        label={formatMessage(intl, "policyHolder", "isDeleted")}
                    />
                </Grid>
            </Grid>
        )
    }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(PolicyHolderFilter))));
