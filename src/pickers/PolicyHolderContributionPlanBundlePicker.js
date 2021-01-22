import React, { Component } from "react";
import { withModulesManager, FormattedMessage, SelectInput } from "@openimis/fe-core";
import { connect } from "react-redux";
import _ from "lodash";

class PolicyHolderContributionPlanBundlePicker extends Component {
    render() {
        const { value, onChange, required = false, withNull = false, nullLabel = null,
            withLabel = true, readOnly = false, pickerPolicyHolderContributionPlanBundles } = this.props;
        let distinctContributionPlanBundles = _.uniqWith(pickerPolicyHolderContributionPlanBundles.map(v => v.contributionPlanBundle), _.isEqual);
        let options = [
            ...distinctContributionPlanBundles.map(v => ({
                value: v,
                label: `${v.code} - ${v.name}`
            }))
        ];
        if (withNull) {
            options.unshift({
                value: null,
                label: nullLabel || <FormattedMessage module="policyHolder" id="policyHolder.emptyLabel" />
            })
        }
        return (
            <SelectInput
                module="policyHolder"
                label={withLabel ? "contributionPlanBundle" : null}
                required={required}
                options={options}
                value={!!value ? value : null}
                onChange={onChange}
                readOnly={readOnly}
            />
        )
    }
}

const mapStateToProps = state => ({
    pickerPolicyHolderContributionPlanBundles: state.policyHolder.pickerPolicyHolderContributionPlanBundles
});

export default withModulesManager(connect(mapStateToProps, null)(PolicyHolderContributionPlanBundlePicker));
