import React, { Component, Fragment } from "react";
import { Form, withModulesManager, withHistory, formatMessage, formatMessageWithValues, journalize, Helmet } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchPolicyHolder } from "../actions"
import PolicyHolderGeneralInfoPanel from "./PolicyHolderGeneralInfoPanel";
import PolicyHolderTabPanel from "./PolicyHolderTabPanel";
import {
    RIGHT_PORTALPOLICYHOLDER_SEARCH,
    RIGHT_POLICYHOLDER_CREATE,
    RIGHT_POLICYHOLDER_UPDATE
} from "../constants";

const styles = theme => ({
    paper: theme.paper.paper,
    paperHeader: theme.paper.header,
    paperHeaderAction: theme.paper.action,
    item: theme.paper.item,
});

const jsonFields = ['address', 'contactName', 'bankAccount']

class PolicyHolderForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            policyHolder: {},
            isFormValid: true
        };
    }

    wrapJSONFields = (policyHolder) => {
        jsonFields.forEach(item => {
            if (!!policyHolder[item]) {
                const key = `"${item}"`;
                const value = `${JSON.stringify(policyHolder[item]).replace(/\\n/g, "\\n")}`;
                policyHolder[item] = `{${key}: ${value}}`;
            }
        });
    }

    unwrapJSONFields = (policyHolder) => {
        jsonFields.forEach(item => {
            if (!!policyHolder[item]) {
                policyHolder[item] = JSON.parse(policyHolder[item])[item];
            }
        });
    }

    componentDidMount() {
        if (!!this.props.policyHolderId) {
            this.setState(
                (_, props) => ({ policyHolderId: props.policyHolderId }),
                () => this.props.fetchPolicyHolder(this.props.modulesManager, this.props.policyHolderId)
            );
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.fetchedPolicyHolder !== this.props.fetchedPolicyHolder && !!this.props.fetchedPolicyHolder) {
            this.unwrapJSONFields(this.props.policyHolder);
            this.setState(
                (_, props) => ({ policyHolder: props.policyHolder, policyHolderId: props.policyHolderId })
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

    canSave = () => !this.isMandatoryFieldsEmpty() && this.state.isFormValid;

    save = (policyHolder) => {
        this.wrapJSONFields(policyHolder);
        this.props.save(policyHolder);
        this.unwrapJSONFields(policyHolder);
    }

    onEditedChanged = (policyHolder) => this.setState({ policyHolder });

    titleParams = () => this.state.policyHolder && this.props.titleParams(this.state.policyHolder);

    onValidation = (isFormValid) => {
        if (this.state.isFormValid !== isFormValid) {
            this.setState({ isFormValid });
        }
    }

    isPolicyHolderPortalUser = () =>
        this.props.rights.includes(RIGHT_PORTALPOLICYHOLDER_SEARCH) &&
        !this.props.rights.includes(RIGHT_POLICYHOLDER_CREATE) &&
        !this.props.rights.includes(RIGHT_POLICYHOLDER_UPDATE);

    render() {
        const { intl, rights, back } = this.props;
        return (
            <Fragment>
                <Helmet title={formatMessageWithValues(this.props.intl, "policyHolder", "policyHolder.page.title", this.titleParams())} />
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
                    isPolicyHolderPortalUser={this.isPolicyHolderPortalUser()}
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
