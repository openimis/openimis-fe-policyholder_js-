import React, { Component, Fragment } from "react";
import { Form, withModulesManager, withHistory, formatMessage, historyPush } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import PolicyHolderGeneralInfoPanel from "./PolicyHolderGeneralInfoPanel";

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
            policyHolder: this._newPolicyHolder(),
            newPolicyHolder: true
        };
    }

    _newPolicyHolder() {
        return {};
    }

    canSave = () => {
        if (!!this.state.policyHolder.code
            && !!this.state.policyHolder.tradeName
            && !!this.state.policyHolder.location
            && !!this.state.policyHolder.dateValidFrom) {
            return true;
        }
        return false;
    }

    _save = (policyHolder) => {
        this.props.save(policyHolder);
    }

    onEditedChanged = policyHolder => {
        this.setState({ policyHolder, newPolicyHolder: false })
    }

    titleParams = () => {
        const { policyHolder } = this.state;
        var params = { label: null };
        if (!!policyHolder.code && !!policyHolder.tradeName) {
            params.label = `${this.state.policyHolder.code} - ${this.state.policyHolder.tradeName}`
        } else {
            if (!!policyHolder.code) {
                params.label = `${policyHolder.code}`;
            } else if (!!policyHolder.tradeName) {
                params.label = `${policyHolder.tradeName}`;
            }
        }
        return params;
    }

    render() {
        const { intl, back } = this.props;
        return (
            <Fragment>
                <Form
                    module="policyHolder"
                    title="policyHolder.page.title"
                    titleParams={this.titleParams()}
                    edited={this.state.policyHolder}
                    back={back}
                    canSave={this.canSave}
                    save={this._save}
                    onEditedChanged={this.onEditedChanged}
                    HeadPanel={PolicyHolderGeneralInfoPanel}
                    displayHeadPanelError={!this.canSave()}
                    saveTooltip={formatMessage(intl, "policyHolder", `savePolicyHolderButton.tooltip.${this.canSave() ? 'enabled' : 'disabled'}`)} 
                />
            </Fragment>
        )
    }
}

export default withHistory(withModulesManager(injectIntl(withTheme(withStyles(styles)(PolicyHolderForm)))));
