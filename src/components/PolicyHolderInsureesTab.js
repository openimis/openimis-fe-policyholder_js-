import React, { Component, Fragment } from "react";
import { Tab, Grid, Typography } from "@material-ui/core";
import { formatMessage, PublishedComponent, FormattedMessage } from "@openimis/fe-core";
import { RIGHT_POLICYHOLDERUSER_SEARCH } from "../constants"
import PolicyHolderInsureeSearcher from "./PolicyHolderInsureeSearcher";
import { POLICYHOLDERINSUREE_TAB_VALUE } from "../constants"
import CreatePolicyHolderInsureeDialog from "../dialogs/CreatePolicyHolderInsureeDialog";

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
                    label={formatMessage(intl, "policyHolder", "policyHolderInsuree.label")}
                />
        )
    }
}

class PolicyHolderInsureesTabPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reset: 0
        }
    }

    onCreate = () => {
        this.setState(state => ({
            reset: state.reset + 1
        }));
    }

    render() {
        const { rights, value, isTabsEnabled, policyHolder } = this.props;
        return (
            rights.includes(RIGHT_POLICYHOLDERUSER_SEARCH) &&
                <PublishedComponent
                    pubRef="policyHolder.TabPanel"
                    module="policyHolder"
                    index={POLICYHOLDERINSUREE_TAB_VALUE}
                    value={value}
                >
                    {isTabsEnabled ? (
                        <Fragment>
                            <Grid container justify="flex-end" alignItems="center" spacing={1}>
                                <Grid item>
                                    <Typography>
                                        <FormattedMessage module="policyHolder" id="policyHolderInsuree.createPolicyHolderInsuree" />
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <CreatePolicyHolderInsureeDialog
                                        policyHolder={policyHolder}
                                        onCreate={this.onCreate}
                                    />
                                </Grid>
                            </Grid>
                            <PolicyHolderInsureeSearcher
                                reset={this.state.reset}
                            />
                        </Fragment>
                    ) : (
                        <FormattedMessage module="policyHolder" id="policyHolderInsuree.tabDisabledError" />
                    )}
                </PublishedComponent>
        )
    }
}

export {
    PolicyHolderInsureesTabLabel,
    PolicyHolderInsureesTabPanel
}
