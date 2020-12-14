import React, { Component } from "react";
import { Tab } from "@material-ui/core";
import { formatMessage, PublishedComponent } from "@openimis/fe-core";
import { RIGHT_POLICYHOLDERUSER_SEARCH } from "../constants"
import PolicyHolderUserSearcher from "./PolicyHolderUserSearcher";

class ManageUsersTabLabel extends Component {
    render() {
        const { intl, rights, onChange, disabled, tabStyle, isSelected } = this.props;
        const value = "manageUsersTab";
        return (
            !rights.includes(RIGHT_POLICYHOLDERUSER_SEARCH) &&
                <Tab
                    onChange={onChange}
                    disabled={disabled}
                    className={tabStyle(value)}
                    selected={isSelected(value)}
                    value={value}
                    label={formatMessage(intl, "policyHolder", "PolicyHolderTabPanel.manageUsersTab")}
                />
        )
    }
}

class ManageUsersTabPanel extends Component {
    render() {
        const { rights, value } = this.props;
        return (
            !rights.includes(RIGHT_POLICYHOLDERUSER_SEARCH) &&
                <PublishedComponent
                    pubRef="policyHolder.TabPanel"
                    module="policyHolder"
                    index="manageUsersTab"
                    value={value}>
                    <PolicyHolderUserSearcher />
                </PublishedComponent>
        )
    }
}

export {
    ManageUsersTabLabel,
    ManageUsersTabPanel
}
