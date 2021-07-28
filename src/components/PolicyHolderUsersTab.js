import React, { Component, Fragment } from "react";
import { Tab, Grid, Typography } from "@material-ui/core";
import { formatMessage, PublishedComponent, FormattedMessage, decodeId } from "@openimis/fe-core";
import {
    RIGHT_POLICYHOLDERUSER_CREATE,
    RIGHT_POLICYHOLDERUSER_SEARCH,
    RIGHT_PORTALPOLICYHOLDERUSER_CREATE,
    RIGHT_PORTALPOLICYHOLDERUSER_SEARCH
} from "../constants";
import { POLICYHOLDERUSER_TAB_VALUE } from "../constants"
import PolicyHolderUserSearcher from "./PolicyHolderUserSearcher";
import CreatePolicyHolderUserDialog from "../dialogs/CreatePolicyHolderUserDialog";

class PolicyHolderUsersTabLabel extends Component {
    render() {
        const { intl, rights, onChange, disabled, tabStyle, isSelected } = this.props;
        return (
            [
                RIGHT_POLICYHOLDERUSER_SEARCH,
                RIGHT_PORTALPOLICYHOLDERUSER_SEARCH
            ].some(right => rights.includes(right)) && (
                <Tab
                    onChange={onChange}
                    disabled={disabled}
                    className={tabStyle(POLICYHOLDERUSER_TAB_VALUE)}
                    selected={isSelected(POLICYHOLDERUSER_TAB_VALUE)}
                    value={POLICYHOLDERUSER_TAB_VALUE}
                    label={formatMessage(intl, "policyHolder", "menu.policyHolderUsers")}
                />
            )
        )
    }
}

class PolicyHolderUsersTabPanel extends Component {
    state = {
        reset: 0
    }

    onSave = () =>
        this.setState(state => ({
            reset: state.reset + 1
        }));

    render() {
        const { rights, value, isTabsEnabled, policyHolder } = this.props;
        return (
            [RIGHT_POLICYHOLDERUSER_SEARCH, RIGHT_PORTALPOLICYHOLDERUSER_SEARCH].some((right) =>
                rights.includes(right)
            ) && (
                <PublishedComponent
                    pubRef="policyHolder.TabPanel"
                    module="policyHolder"
                    index={POLICYHOLDERUSER_TAB_VALUE}
                    value={value}
                >
                    {isTabsEnabled && (
                        <Fragment>
                            {[RIGHT_POLICYHOLDERUSER_CREATE, RIGHT_PORTALPOLICYHOLDERUSER_CREATE].some((right) =>
                                rights.includes(right)
                            ) && (
                                <Grid container justify="flex-end" alignItems="center" spacing={1}>
                                    <Grid item>
                                        <Typography>
                                            <FormattedMessage
                                                module="policyHolder"
                                                id="policyHolderUser.createPolicyHolderUser"
                                            />
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <CreatePolicyHolderUserDialog
                                            onSave={this.onSave}
                                            tabView
                                            predefinedPolicyHolderId={decodeId(policyHolder.id)}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                            <PolicyHolderUserSearcher
                                rights={rights}
                                reset={this.state.reset}
                                onSave={this.onSave}
                                predefinedPolicyHolderId={decodeId(policyHolder.id)}
                            />
                        </Fragment>
                    )}
                </PublishedComponent>
            )
        );
    }
}

export {
    PolicyHolderUsersTabLabel,
    PolicyHolderUsersTabPanel
}
