import React, { Component } from "react";
import { Tab } from "@material-ui/core";
import { formatMessage, PublishedComponent, FormattedMessage } from "@openimis/fe-core";
import { RIGHT_POLICYHOLDERUSER_SEARCH } from "../constants"
import PolicyHolderInsureeSearcher from "./PolicyHolderInsureeSearcher";
import { POLICYHOLDERINSUREE_TAB_VALUE } from "../constants"

class PolicyHolderInsureesTabLabel extends Component {
    render() {
        const { intl, rights, onChange, disabled, tabStyle, isSelected } = this.props;
        return (
            rights.includes(RIGHT_POLICYHOLDERUSER_SEARCH) &&
                <Tab
                    onChange={onChange}
                    disabled={disabled}
                    className={tabStyle(POLICYHOLDERINSUREE_TAB_VALUE)}
                    selected={isSelected(POLICYHOLDERINSUREE_TAB_VALUE)}
                    value={POLICYHOLDERINSUREE_TAB_VALUE}
                    label={formatMessage(intl, "policyHolder", "PolicyHolderTabPanel.policyHolderInsureesTab")}
                />
        )
    }
}

class PolicyHolderInsureesTabPanel extends Component {
    render() {
        const { rights, value, isTabsEnabled } = this.props;
        return (
            rights.includes(RIGHT_POLICYHOLDERUSER_SEARCH) &&
                <PublishedComponent
                    pubRef="policyHolder.TabPanel"
                    module="policyHolder"
                    index={POLICYHOLDERINSUREE_TAB_VALUE}
                    value={value}
                >
                    {isTabsEnabled ? (
                        <PolicyHolderInsureeSearcher />
                    ) : (
                        <FormattedMessage module="policyHolder" id="policyHolderInsureesTabDisabledError" />
                    )}
                </PublishedComponent>
        )
    }
}

export {
    PolicyHolderInsureesTabLabel,
    PolicyHolderInsureesTabPanel
}
