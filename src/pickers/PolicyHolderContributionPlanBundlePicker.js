import React, { Component } from "react";
import { withModulesManager, FormattedMessage, SelectInput } from "@openimis/fe-core";
import { connect } from "react-redux";

class PolicyHolderContributionPlanBundlePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            policyHolderContributionPlanBundles: []
        }
    }

    componentDidMount() {
        this.setState((_, props) => ({ policyHolderContributionPlanBundles: props.policyHolderContributionPlanBundles }));
    }

    componentDidUpdate() {
        /**
         * When Policy Holder Contribution Plan Bundle entities are filtered, they are refetched and
         * the number of options provided to @see PolicyHolderContributionPlanBundlePicker changes.
         * In order to have all Policy Holder Contribution Plan Bundle entities in the picker,
         * the biggest number of entities fetched will be provided to the picker as its options.
         */
        if (this.props.policyHolderContributionPlanBundles.length > this.state.policyHolderContributionPlanBundles.length) {
            this.setState((_, props) => ({ policyHolderContributionPlanBundles: props.policyHolderContributionPlanBundles }));
        }
    }

    render() {
        const { value, onChange, required = false, withNull = false, nullLabel = null, withLabel = true, readOnly = false } = this.props;
        const { policyHolderContributionPlanBundles } = this.state;
        let options = [
            ...policyHolderContributionPlanBundles.map(v => ({
                value: v.contributionPlanBundle,
                label: `${v.contributionPlanBundle.code} - ${v.contributionPlanBundle.name}`
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
    policyHolderContributionPlanBundles: state.policyHolder.policyHolderContributionPlanBundles
});

export default withModulesManager(connect(mapStateToProps, null)(PolicyHolderContributionPlanBundlePicker));
