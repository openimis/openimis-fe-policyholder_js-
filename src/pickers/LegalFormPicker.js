import React, { Component } from "react";
import { withModulesManager } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { ConfigBasedPicker } from "./ConfigBasedPicker";

class LegalFormPicker extends Component {
    constructor(props) {
        super(props);
        this.activityCodeOptions = props.modulesManager.getConf("fe-policyHolder", "policyHolderFilter.legalFormOptions", []);
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

export default withModulesManager(injectIntl(LegalFormPicker));