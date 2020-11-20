import React, { Component } from "react";
import { withModulesManager } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { ConfigBasedPicker } from "./ConfigBasedPicker";

export class ActivityCodePicker extends Component {
    constructor(props) {
        super(props);
        this.activityCodeOptions = props.modulesManager.getConf("fe-policyHolder", "policyHolderFilter.activityCodeOptions", []);
    }

    render() {
        return (
            <ConfigBasedPicker
                configOptions={this.activityCodeOptions}
                {...this.props}
            />
        )
    }
}

export default withModulesManager(injectIntl(ActivityCodePicker));