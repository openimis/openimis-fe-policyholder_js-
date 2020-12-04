import React, { Component } from "react"
import PolicyHolderSearcher from "../components/PolicyHolderSearcher";
import { withModulesManager, formatMessage } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { RIGHT_POLICYHOLDER_SEARCH } from "../constants"

const styles = theme => ({
    page: theme.page,
})

class PolicyHoldersPage extends Component {
    componentDidMount() {
        document.title = formatMessage(this.props.intl, "policyHolder", "policyHolders.page.title");
    }

    render() {
        const { classes, rights } = this.props;
        return (
            rights.includes(RIGHT_POLICYHOLDER_SEARCH) && (
                <div className={classes.page}>
                    <PolicyHolderSearcher />
                </div>
            )
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : []
});

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, null)(PolicyHoldersPage)))));