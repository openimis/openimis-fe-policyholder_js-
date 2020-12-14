import React, { Fragment } from "react";
import { Paper, Grid, Divider } from "@material-ui/core";
import { withModulesManager, FormPanel, Contributions, FormattedMessage } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { RIGHT_POLICYHOLDERUSER_SEARCH } from "../constants"

const styles = theme => ({
    item: theme.paper.item,
    paper: theme.paper.paper,
    tableTitle: theme.table.title,
    tabs: {
        padding: 0
    },
    selectedTab: {
        borderBottom: "3px solid white"
    },
    unselectedTab: {
        borderBottom: "3px solid transparent"
    }
});

const POLICYHOLDER_TABS_PANEL_CONTRIBUTION_KEY = "policyHolder.TabPanel.panel";
const POLICYHOLDER_TABS_LABEL_CONTRIBUTION_KEY = "policyHolder.TabPanel.label";

class PolicyHolderTabPanel extends FormPanel {
    constructor(props) {
        super(props);
        this.state = {
            value: props.rights.includes(RIGHT_POLICYHOLDERUSER_SEARCH) ? "manageUsersTab" : undefined
        }
    }

    isSelected = value => value === this.state.value;

    tabStyle = value => this.isSelected(value) ? this.props.classes.selectedTab : this.props.classes.unselectedTab;

    handleChange = (_, value) => this.setState({ value });

    render() {
        const { intl, rights, classes, edited, mandatoryFieldsEmpty } = this.props;
        const { value } = this.state;
        const enableTabs = !!edited && !!edited.id && !mandatoryFieldsEmpty;
        return (
            <Paper className={classes.paper}>
                <Grid container className={`${classes.tableTitle} ${classes.tabs}`}>
                    <Contributions
                        contributionKey={POLICYHOLDER_TABS_LABEL_CONTRIBUTION_KEY}
                        intl={intl}
                        rights={rights}
                        value={value}
                        onChange={this.handleChange}
                        isSelected={this.isSelected}
                        tabStyle={this.tabStyle}
                        disabled={!enableTabs}
                    />
                </Grid>
                {!enableTabs &&
                    <Fragment>
                        <div className={classes.item}>
                            <FormattedMessage module="policyHolder" id="tabPanelDisabledError" />
                        </div>
                        <Divider />
                    </Fragment>
                }
                <Contributions
                    contributionKey={POLICYHOLDER_TABS_PANEL_CONTRIBUTION_KEY}
                    rights={rights}
                    value={value}
                />
            </Paper>
        )
    }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(PolicyHolderTabPanel))))
