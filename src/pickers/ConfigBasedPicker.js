import React, { Component } from "react";
import { SelectInput } from "@openimis/fe-core";
import { withModulesManager, formatMessage } from "@openimis/fe-core";
import { injectIntl } from "react-intl";

export class ConfigBasedPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: !!props.value ? props.value : null
        };
    }

    _onChange = v => {
        this.setState(
            { value: v },
            e => this.props.onChange(v)
        );
    };

    render() {
        const { intl, module, label, configOptions, disabled } = this.props;
        const { value } = this.state;
        const options = [{
            value: null,
            label: formatMessage(
                this.props.intl,
                this.props.module,
                `${this.props.label}.null`
            )
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
                label={!!disabled ? ' ' : label}
                options={options}
                value={value}
                onChange={this._onChange}
                disabled={disabled} />
        );
    }
}
export default withModulesManager(injectIntl(ConfigBasedPicker));
