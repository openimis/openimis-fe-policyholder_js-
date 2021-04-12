import React, { Component, Fragment } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import {
    FormattedMessage,
    formatMessage,
    formatMessageWithValues,
    PublishedComponent,
    TextInput
} from "@openimis/fe-core";
import { IconButton, Grid, Tooltip } from "@material-ui/core";
import PolicyHolderPicker from "../pickers/PolicyHolderPicker";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { updatePolicyHolderUser } from "../actions";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    ZERO,
    MAX_CLIENTMUTATIONLABEL_LENGTH
} from "../constants";

const styles = theme => ({
    item: theme.paper.item,
    fab: theme.fab
});

class UpdatePolicyHolderUserDialog extends Component {
    state = {
        open: false,
        policyHolderUser: {},
        isDirty: false
    }

    handleOpen = () => this.setState((_, props) => ({ open: true, policyHolderUser: props.policyHolderUser }));

    handleClose = () => this.setState({ open: false, policyHolderUser: {} });

    handleSave = () => {
        const { intl, onSave, updatePolicyHolderUser } = this.props;
        const { policyHolderUser } = this.state;
        updatePolicyHolderUser(
            this.state.policyHolderUser,
            formatMessageWithValues(intl, "policyHolder", "UpdatePolicyHolderUser.mutationLabel", {
                user: policyHolderUser.user,
                policyHolder: `${policyHolderUser.policyHolder.code} - ${policyHolderUser.policyHolder.tradeName}`,
            }).slice(ZERO, MAX_CLIENTMUTATIONLABEL_LENGTH)
        );
        onSave();
        this.handleClose();
    };

    updateAttribute = (attribute, value) =>
        this.setState((state) => ({
            policyHolderUser: {
                ...state.policyHolderUser,
                [attribute]: value,
            },
            isDirty: true
        }));

    canSave = () => {
        const { policyHolderUser, isDirty } = this.state;
        return !!isDirty && !!policyHolderUser.policyHolder && !!policyHolderUser.dateValidFrom;
    };

    render() {
        const { intl, classes } = this.props;
        const { open, policyHolderUser } = this.state;
        return (
            <Fragment>
                <Tooltip title={formatMessage(intl, "policyHolder", "editButton.tooltip")}>
                    <div>
                        <IconButton onClick={this.handleOpen}>
                            <EditIcon />
                        </IconButton>
                    </div>
                </Tooltip>
                <Dialog open={open} onClose={this.handleClose}>
                    <DialogTitle>
                        <FormattedMessage module="policyHolder" id="policyHolderUser.updatePolicyHolderUser" />
                    </DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" className={classes.item}>
                            <Grid item className={classes.item}>
                                <TextInput
                                    module="policyHolder"
                                    label="policyHolderUser.userName"
                                    value={!!policyHolderUser.user && policyHolderUser.user}
                                    readOnly
                                    required
                                />
                            </Grid>
                            <Grid item className={classes.item}>
                                <PolicyHolderPicker
                                    module="policyHolder"
                                    withNull
                                    nullLabel={formatMessage(intl, "policyHolder", "emptyLabel")}
                                    value={!!policyHolderUser.policyHolder && policyHolderUser.policyHolder}
                                    onChange={(v) => this.updateAttribute("policyHolder", v)}
                                    required
                                />
                            </Grid>
                            <Grid item className={classes.item}>
                                <PublishedComponent
                                    pubRef="core.DatePicker"
                                    module="policyHolder"
                                    label="policyHolderUser.dateValidFrom"
                                    value={!!policyHolderUser.dateValidFrom && policyHolderUser.dateValidFrom}
                                    onChange={(v) => this.updateAttribute("dateValidFrom", v)}
                                    required
                                />
                            </Grid>
                            <Grid item className={classes.item}>
                                <PublishedComponent
                                    pubRef="core.DatePicker"
                                    module="policyHolder"
                                    label="policyHolderUser.dateValidTo"
                                    value={!!policyHolderUser.dateValidTo && policyHolderUser.dateValidTo}
                                    onChange={(v) => this.updateAttribute("dateValidTo", v)}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="outlined">
                            <FormattedMessage module="policyHolder" id="dialog.cancel" />
                        </Button>
                        <Button
                            onClick={this.handleSave}
                            disabled={!this.canSave()}
                            variant="contained"
                            color="primary"
                        >
                            <FormattedMessage module="policyHolder" id="dialog.update" />
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ updatePolicyHolderUser }, dispatch);
};

export default injectIntl(
    withTheme(withStyles(styles)(connect(null, mapDispatchToProps)(UpdatePolicyHolderUserDialog)))
);
