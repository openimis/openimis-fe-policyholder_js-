import React, { Component } from "react";
import { formatMessage } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import PolicyHolderUserSearcher from "../components/PolicyHolderUserSearcher";
import CreatePolicyHolderUserDialog from "../dialogs/CreatePolicyHolderUserDialog";
import {
    RIGHT_POLICYHOLDERUSER_SEARCH,
    RIGHT_PORTALPOLICYHOLDERUSER_SEARCH,
    RIGHT_POLICYHOLDERUSER_CREATE,
    RIGHT_PORTALPOLICYHOLDERUSER_CREATE
} from "../constants"

const styles = theme => ({
    page: theme.page
})

class PolicyHolderUsersPage extends Component {
    state = {
        reset: 0
    }

    componentDidMount() {
        document.title = formatMessage(this.props.intl, "policyHolder", "menu.policyHolderUsers");
    }

    onSave = () =>
        this.setState(state => ({
            reset: state.reset + 1
        }));

    render() {
        const { classes, rights } = this.props;
        return (
            [
                RIGHT_POLICYHOLDERUSER_SEARCH,
                RIGHT_PORTALPOLICYHOLDERUSER_SEARCH
            ].some(right => rights.includes(right)) && (
                <div className={classes.page}>
                    <PolicyHolderUserSearcher
                        rights={rights}
                        reset={this.state.reset}
                        onSave={this.onSave}
                    />
                    {[
                        RIGHT_POLICYHOLDERUSER_CREATE,
                        RIGHT_PORTALPOLICYHOLDERUSER_CREATE
                    ].some(right => rights.includes(right)) && (
                        <CreatePolicyHolderUserDialog
                            onSave={this.onSave}
                        />
                    )}
                </div>
            )
        );
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : []
});

export default injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, null)(PolicyHolderUsersPage))));
