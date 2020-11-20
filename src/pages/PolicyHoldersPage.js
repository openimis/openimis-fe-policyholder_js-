import React, { Component } from "react"
import PolicyHolderSearcher from "../components/PolicyHolderSearcher";
import { withModulesManager, formatMessage } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    page: theme.page,
})

class PolicyHoldersPage extends Component {
    componentDidMount() {
        document.title = formatMessage(this.props.intl, "policyHolder", "policyHolders.page.title");
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.page}>
                <PolicyHolderSearcher />
            </div>
        )
    }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(PolicyHoldersPage))));