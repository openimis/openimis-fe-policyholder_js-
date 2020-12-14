import React, { Component, Fragment } from "react";
import { Form, withModulesManager, withHistory, formatMessage, formatMessageWithValues, journalize } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchPolicyHolder } from "../actions"
import PolicyHolderGeneralInfoPanel from "./PolicyHolderGeneralInfoPanel";
import PolicyHolderTabPanel from "./PolicyHolderTabPanel";

const styles = theme => ({
    paper: theme.paper.paper,
    paperHeader: theme.paper.header,
    paperHeaderAction: theme.paper.action,
    item: theme.paper.item,
});

class PolicyHolderForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            policyHolder: {},
            isFormValid: true
        };
    }

    componentDidMount() {
        document.title = formatMessageWithValues(this.props.intl, "policyHolder", "policyHolder.page.title", { label: "" })
        if (!!this.props.policyHolderId) {
            this.setState(
                (state, props) => ({ policyHolderId: props.policyHolderId }),
                () => this.props.fetchPolicyHolder(this.props.modulesManager, this.props.policyHolderId)
            )
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.fetchedPolicyHolder !== this.props.fetchedPolicyHolder && !!this.props.fetchedPolicyHolder) {
            this.setState(
                (state, props) => ({ policyHolder: props.policyHolder, policyHolderId: props.policyHolderId }),
                () => document.title = formatMessageWithValues(this.props.intl, "policyHolder", "policyHolder.page.title", { label: this.titleParams().label })
            );
        }
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
        }
    }

    isMandatoryFieldsEmpty = () => {
        const { policyHolder} = this.state;
        if (!!policyHolder.code
            && !!policyHolder.tradeName
            && !!policyHolder.locations
            && !!policyHolder.dateValidFrom) {
            return false;
        }
        return true;
    }

    canSave = () => {
        return !this.isMandatoryFieldsEmpty() && this.state.isFormValid
    }

    save = (policyHolder) => {
        this.props.save(policyHolder);
    }

    onEditedChanged = policyHolder => {
        this.setState({ policyHolder })
    }

    titleParams = () => {
        return this.props.titleParams(this.state.policyHolder);
    }

    onValidation = isFormValid => {
        if(this.state.isFormValid !== isFormValid) {
            this.setState({ isFormValid });
        }
    }

    render() {
        const { intl, rights, back } = this.props;
        return (
            <Fragment>
                <Form
                    module="policyHolder"
                    title="policyHolder.page.title"
                    titleParams={this.titleParams()}
                    edited={this.state.policyHolder}
                    back={back}
                    canSave={this.canSave}
                    save={this.save}
                    onEditedChanged={this.onEditedChanged}
                    HeadPanel={PolicyHolderGeneralInfoPanel}
                    mandatoryFieldsEmpty={this.isMandatoryFieldsEmpty()}
                    saveTooltip={formatMessage(intl, "policyHolder", `savePolicyHolderButton.tooltip.${this.canSave() ? 'enabled' : 'disabled'}`)} 
                    onValidation={this.onValidation}
                    Panels={[PolicyHolderTabPanel]}
                    rights={rights}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    fetchingPolicyHolder: state.policyHolder.fetchingPolicyHolder,
    errorPolicyHolder: state.policyHolder.errorPolicyHolder,
    fetchedPolicyHolder: state.policyHolder.fetchedPolicyHolder,
    policyHolder: state.policyHolder.policyHolder,
    submittingMutation: state.policyHolder.submittingMutation,
    mutation: state.policyHolder.mutation
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPolicyHolder, journalize }, dispatch);
};

export default withHistory(withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PolicyHolderForm))))));
