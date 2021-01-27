import React, { Component } from "react";
import { SelectInput } from "@openimis/fe-core";
import { formatMessage } from "@openimis/fe-core";
import { injectIntl } from "react-intl";

class ConfigBasedPicker extends Component {
    render() {
        const { intl, module, label, configOptions, readOnly = false, value, onChange } = this.props;
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
                label={readOnly ? null : label}
                options={options}
                value={value}
                onChange={onChange}
                readOnly={readOnly} />
        );
    }
}

export default injectIntl(ConfigBasedPicker);
