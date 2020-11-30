import React, { Component } from "react"
import { withModulesManager, formatMessage, formatMessageWithValues, withHistory, historyPush, journalize } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import PolicyHolderForm from "../components/PolicyHolderForm";
import { createPolicyHolder } from "../actions"

const styles = theme => ({
    page: theme.page,
});

class PolicyHolderPage extends Component {
    componentDidMount() {
        document.title = formatMessage(this.props.intl, "policyHolder", "policyHolders.page.title");
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
        }
    }

    back = () => {
        historyPush(this.props.modulesManager, this.props.history, "policyHolder.route.policyHolders")
    }

    save = (policyHolder) => {
        if (!policyHolder.uuid) {
            this.props.createPolicyHolder(
                this.props.modulesManager,
                policyHolder,
                formatMessageWithValues(
                    this.props.intl,
                    "policyHolder",
                    "CreatePolicyHolder.mutationLabel",
                    { code: !!policyHolder.code ? policyHolder.code : "" }
                )
            );
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.page}>
                <PolicyHolderForm
                    policyHolderUuid={null}
                    back={this.back}
                    save={this.save}
                />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    submittingMutation: state.policyHolder.submittingMutation,
    mutation: state.policyHolder.mutation
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createPolicyHolder, journalize }, dispatch);
};

export default withHistory(withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(null, mapDispatchToProps)(PolicyHolderPage))))));