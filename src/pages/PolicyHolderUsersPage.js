import React, { Component } from "react";
import { formatMessage } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import PolicyHolderUserSearcher from "../components/PolicyHolderUserSearcher";
import {
    RIGHT_POLICYHOLDERUSER_SEARCH,
    RIGHT_PORTALPOLICYHOLDERUSER_SEARCH
} from "../constants"

const styles = theme => ({
    page: theme.page
})

class PolicyHolderUsersPage extends Component {
    componentDidMount() {
        document.title = formatMessage(this.props.intl, "policyHolder", "menu.policyHolderUsers");
    }

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
                    />
                </div>
            )
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : []
});

export default injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, null)(PolicyHolderUsersPage))));
