import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import { FormattedMessage, formatMessageWithValues, PublishedComponent } from "@openimis/fe-core";
import { Fab, Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { createPolicyHolderInsuree } from "../actions";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PolicyHolderContributionPlanBundlePicker from '../pickers/PolicyHolderContributionPlanBundlePicker';

const styles = theme => ({
    item: theme.paper.item
});

class CreatePolicyHolderInsureeDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            policyHolderInsuree: {
                policyHolder: props.policyHolder
            }
        }
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false, policyHolderInsuree: {} });
    };

    handleSave = () => {
        this.props.createPolicyHolderInsuree(
            this.state.policyHolderInsuree,
            formatMessageWithValues(
                this.props.intl,
                "policyHolder",
                "CreatePolicyHolderInsuree.mutationLabel",
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
            policyHolderInsuree: {
                ...state.policyHolderInsuree,
                [attribute]: value
            }
        }));
    }

    canSave = () => {
        const { policyHolderInsuree } = this.state;
        return !!policyHolderInsuree.policyHolder
            && !!policyHolderInsuree.insuree
            && !!policyHolderInsuree.contributionPlanBundle
            && !!policyHolderInsuree.dateValidFrom;
    }

    render() {
        const { classes, disabled } = this.props;
        const { open, policyHolderInsuree } = this.state;
        return (
            <Fragment>
                <Fab
                    size="small"
                    color="primary"
                    disabled={disabled}
                    onClick={this.handleOpen}>
                    <AddIcon />
                </Fab>
                <Dialog open={open} onClose={this.handleClose}>
                    <DialogTitle>
                        <FormattedMessage module="policyHolder" id="policyHolderInsuree.createDialog.title" />
                    </DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" className={classes.item}>
                            <Grid item className={classes.item}>
                                <PublishedComponent
                                    pubRef="insuree.InsureeChfIdPicker"
                                    required
                                    value={!!policyHolderInsuree.insuree && policyHolderInsuree.insuree}
                                    onChange={v => this.updateAttribute('insuree', v)}
                                />
                            </Grid>
                            <Grid item className={classes.item}>
                                <PolicyHolderContributionPlanBundlePicker
                                    withNull={true}
                                    required
                                    value={!!policyHolderInsuree.contributionPlanBundle && policyHolderInsuree.contributionPlanBundle}
                                    onChange={v => this.updateAttribute('contributionPlanBundle', v)}
                                />
                            </Grid>
                            <Grid item className={classes.item}>
                                <PublishedComponent
                                    pubRef="core.DatePicker"
                                    module="policyHolder"
                                    label="dateValidFrom"
                                    required
                                    onChange={v => this.updateAttribute('dateValidFrom', v)}
                                />
                            </Grid>
                            <Grid item className={classes.item}>
                                <PublishedComponent
                                    pubRef="core.DatePicker"
                                    module="policyHolder"
                                    label="dateValidTo"
                                    onChange={v => this.updateAttribute('dateValidTo', v)}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="outlined">
                            <FormattedMessage module="policyHolder" id="policyHolderInsuree.dialog.cancel" />
                        </Button>
                        <Button onClick={this.handleSave} disabled={!this.canSave()} variant="contained" color="primary" autoFocus>
                            <FormattedMessage module="policyHolder" id="policyHolderInsuree.dialog.create" />
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createPolicyHolderInsuree }, dispatch);
};

export default injectIntl(withTheme(withStyles(styles)(connect(null, mapDispatchToProps)(CreatePolicyHolderInsureeDialog))));
