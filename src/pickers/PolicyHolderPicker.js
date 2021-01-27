import React, { Component } from "react";
import { withModulesManager, FormattedMessage, SelectInput } from "@openimis/fe-core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchPolicyHolders } from "../actions"

class PolicyHolderPicker extends Component {
    componentDidMount() {
        const { withDeleted = false } = this.props;
        this.props.fetchPolicyHolders(this.props.modulesManager, withDeleted ? [] : ["isDeleted: false"]);
    }

    render() {
        const { value, onChange, required = false, withNull = false, nullLabel = null,
            withLabel = true, readOnly = false, policyHolders } = this.props;
        let options = [
            ...policyHolders.map(v => ({
                value: v,
                label: `${v.code} - ${v.tradeName}`
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
                label={withLabel ? "policyHolder" : null}
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
    policyHolders: state.policyHolder.policyHolders
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPolicyHolders }, dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(PolicyHolderPicker));
