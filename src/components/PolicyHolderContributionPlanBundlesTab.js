import React, { Component } from "react";
import { Tab } from "@material-ui/core";
import { formatMessage, PublishedComponent } from "@openimis/fe-core";
import { RIGHT_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_SEARCH, POLICYHOLDERCONTRIBUTIONPLANBUNDLE_TAB_VALUE } from "../constants"
import PolicyHolderContributionPlanBundleSearcher from "./PolicyHolderContributionPlanBundleSearcher";

class PolicyHolderContributionPlanBundlesTabLabel extends Component {
    render() {
        const { intl, rights, onChange, disabled, tabStyle, isSelected } = this.props;
        return (
            rights.includes(RIGHT_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_SEARCH) &&
                <Tab
                    onChange={onChange}
                    disabled={disabled}
                    className={tabStyle(POLICYHOLDERCONTRIBUTIONPLANBUNDLE_TAB_VALUE)}
                    selected={isSelected(POLICYHOLDERCONTRIBUTIONPLANBUNDLE_TAB_VALUE)}
                    value={POLICYHOLDERCONTRIBUTIONPLANBUNDLE_TAB_VALUE}
                    label={formatMessage(intl, "policyHolder", "contributionPlanBundle")}
                />
        )
    }
}

class PolicyHolderContributionPlanBundlesTabPanel extends Component {
    render() {
        const { rights, value, isTabsEnabled, policyHolder } = this.props;
        return (
            rights.includes(RIGHT_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_SEARCH) &&
                <PublishedComponent
                    pubRef="policyHolder.TabPanel"
                    module="policyHolder"
                    index={POLICYHOLDERCONTRIBUTIONPLANBUNDLE_TAB_VALUE}
                    value={value}
                >
                    {isTabsEnabled && (
                        <PolicyHolderContributionPlanBundleSearcher
                            policyHolder={policyHolder}
                            rights={rights}
                        />
                    )}
                </PublishedComponent>
        )
    }
}

export {
    PolicyHolderContributionPlanBundlesTabLabel,
    PolicyHolderContributionPlanBundlesTabPanel
}
