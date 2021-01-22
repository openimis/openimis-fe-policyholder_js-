import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import { FormattedMessage, formatMessageWithValues, PublishedComponent, formatMessage } from "@openimis/fe-core";
import { Grid, Tooltip, IconButton } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { updatePolicyHolderContributionPlanBundle } from "../actions";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PolicyHolderContributionPlanBundlePicker from '../pickers/PolicyHolderContributionPlanBundlePicker';

const styles = theme => ({
    item: theme.paper.item
});

class UpdatePolicyHolderContributionPlanBundleDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            policyHolderContributionPlanBundle: {}
        }
    }

    handleOpen = () => {
        this.setState((_, props) => ({
            open: true,
            policyHolderContributionPlanBundle: props.policyHolderContributionPlanBundle
        }));
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleSave = () => {
        this.props.updatePolicyHolderContributionPlanBundle(
            this.state.policyHolderContributionPlanBundle,
            formatMessageWithValues(
                this.props.intl,
                "policyHolder",
                "UpdatePolicyHolderContributionPlanBundle.mutationLabel",
                {
                    code: this.props.policyHolder.code,
                    tradeName: this.props.policyHolder.tradeName
                }
            )
        );
        this.props.onSave();
        this.handleClose();
    };

    updateAttribute = (attribute, value) => {
        this.setState(state => ({
            policyHolderContributionPlanBundle: {
                ...state.policyHolderContributionPlanBundle,
                [attribute]: value
            }
        }));
    }

    canSave = () => {
        const { policyHolderContributionPlanBundle } = this.state;
        return !!policyHolderContributionPlanBundle.policyHolder
            && !!policyHolderContributionPlanBundle.contributionPlanBundle
            && !!policyHolderContributionPlanBundle.dateValidFrom;
    }

    render() {
        const { intl, classes } = this.props;
        const { open, policyHolderContributionPlanBundle } = this.state;
        return (
            <Fragment>
                <Tooltip title={formatMessage(intl, "policyHolder", "editButton.tooltip")}>
                    <div>
                        <IconButton
                            onClick={this.handleOpen}>
                            <EditIcon />
                        </IconButton>
                    </div>
                </Tooltip>
                <Dialog open={open} onClose={this.handleClose}>
                    <DialogTitle>
                        <FormattedMessage module="policyHolder" id="policyHolderContributionPlanBundle.editDialog.title" />
                    </DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" className={classes.item}>
                            <Grid item className={classes.item}>
                                <PolicyHolderContributionPlanBundlePicker
                                    required
                                    value={!!policyHolderContributionPlanBundle.contributionPlanBundle && policyHolderContributionPlanBundle.contributionPlanBundle}
                                    readOnly
                                />
                            </Grid>
                            <Grid item className={classes.item}>
                                <PublishedComponent
                                    pubRef="core.DatePicker"
                                    module="policyHolder"
                                    label="dateValidFrom"
                                    required
                                    value={!!policyHolderContributionPlanBundle.dateValidFrom && policyHolderContributionPlanBundle.dateValidFrom}
                                    readOnly
                                />
                            </Grid>
                            <Grid item className={classes.item}>
                                <PublishedComponent
                                    pubRef="core.DatePicker"
                                    module="policyHolder"
                                    label="dateValidTo"
                                    value={!!policyHolderContributionPlanBundle.dateValidTo && policyHolderContributionPlanBundle.dateValidTo}
                                    onChange={v => this.updateAttribute('dateValidTo', v)}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="outlined">
                            <FormattedMessage module="policyHolder" id="dialog.cancel" />
                        </Button>
                        <Button onClick={this.handleSave} disabled={!this.canSave()} variant="contained" color="primary" autoFocus>
                            <FormattedMessage module="policyHolder" id="dialog.update" />
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ updatePolicyHolderContributionPlanBundle }, dispatch);
};

export default injectIntl(withTheme(withStyles(styles)(connect(null, mapDispatchToProps)(UpdatePolicyHolderContributionPlanBundleDialog))));
