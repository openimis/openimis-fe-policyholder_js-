import React, { Component } from "react";
import { SelectInput } from "@openimis/fe-core";
import { withModulesManager, formatMessage } from "@openimis/fe-core";
import { injectIntl } from "react-intl";

export class ConfigBasedPicker extends Component {
    render() {
        const { intl, module, label, configOptions, disabled, value, onChange } = this.props;
        const options = [{
            value: null,
            label: formatMessage(intl, module, `${label}.null`)
        }];
        if (!!configOptions) {
            options.push(...configOptions.map(option => ({
                value: parseInt(option.value),
                label: option.label[intl.locale]
            })));
        };
        return (
            <SelectInput
                module={module}
                label={!!disabled ? 'emptyLabel' : label}
                options={options}
                value={value}
                onChange={onChange}
                disabled={disabled} />
        );
    }
}

export default withModulesManager(injectIntl(ConfigBasedPicker));
