import React, { Component } from "react";
import PolicyHolderSearcher from "../components/PolicyHolderSearcher";
import { withModulesManager, formatMessage, withTooltip, historyPush } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { RIGHT_POLICYHOLDER_SEARCH, RIGHT_POLICYHOLDER_CREATE, RIGHT_POLICYHOLDER_UPDATE } from "../constants"
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { decodeId } from "@openimis/fe-core";

const styles = theme => ({
    page: theme.page,
    fab: theme.fab
})

class PolicyHoldersPage extends Component {
    componentDidMount() {
        document.title = formatMessage(this.props.intl, "policyHolder", "policyHolders.page.title");
    }

    onAdd = () => {
        historyPush(this.props.modulesManager, this.props.history, "policyHolder.route.policyHolder");
    }

    policyHolderPageLink = policyHolder => {
        return `${this.props.modulesManager.getRef("policyHolder.route.policyHolder")}${"/" + decodeId(policyHolder.id)}`;
    }

    onDoubleClick = (policyHolder, newTab = false) => {
        const { rights, modulesManager, history } = this.props;
        if (rights.includes(RIGHT_POLICYHOLDER_UPDATE)) {
            historyPush(modulesManager, history, "policyHolder.route.policyHolder", [decodeId(policyHolder.id)], newTab);
        }
    }

    render() {
        const { intl, classes, rights } = this.props;
        return (
            rights.includes(RIGHT_POLICYHOLDER_SEARCH) && (
                <div className={classes.page}>
                    <PolicyHolderSearcher
                        onDoubleClick={this.onDoubleClick}
                        policyHolderPageLink={this.policyHolderPageLink}
                        rights={rights}
                    />
                    {rights.includes(RIGHT_POLICYHOLDER_CREATE) && withTooltip(
                        <div className={classes.fab} >
                            <Fab color="primary" onClick={this.onAdd}>
                                <AddIcon />
                            </Fab>
                        </div>,
                        formatMessage(intl, "policyHolder", "createButton.tooltip")
                    )}
                </div>
            )
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : []
});

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, null)(PolicyHoldersPage)))));
