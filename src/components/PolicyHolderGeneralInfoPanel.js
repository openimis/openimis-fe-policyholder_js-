import React, { Fragment } from "react";
import { Grid, Divider, Typography } from "@material-ui/core";
import { withModulesManager, formatMessage, FormPanel, TextInput, TextAreaInput, FormattedMessage, PublishedComponent } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    tableTitle: theme.table.title,
    item: theme.paper.item,
    fullHeight: {
        height: "100%"
    },
    headPanelError: {
        color: '#801a00',
        textAlign:'center'
    } 
});

class PolicyHolderGeneralInfoPanel extends FormPanel {
    constructor(props) {
        super(props);
        this.phoneRegex = props.modulesManager.getConf("policyHolder", "phoneRegex", /^[0-9]*$/);
        this.faxRegex = props.modulesManager.getConf("policyHolder", "faxRegex", /^[1-9]{8,9}$/);
        this.emailRegex = props.modulesManager.getConf("policyHolder", "emailRegex", /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        this.accountancyAccountRegex = props.modulesManager.getConf("policyHolder", "accountancyAccountRegex", /.+/);
        this.paymentReferenceRegex = props.modulesManager.getConf("policyHolder", "paymentReferenceRegex", /.+/);
    }

    regexError = (field, value) => {
        return !!value && !this[`${field}Regex`].test(value)
            ? formatMessage(this.props.intl, "policyHolder", `${field}.error`)
            : false;
    }

    render() {
        const { classes, edited, displayHeadPanelError } = this.props;
        return (
            <Fragment>
                <Grid container className={classes.tableTitle}>
                    <Grid item>
                        <Grid container align="center" justify="center" direction="column" className={classes.fullHeight}>
                            <Grid item>
                                <Typography >
                                    <FormattedMessage module="policyHolder" id="policyHolder.generalInfoPanel.title" />
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider />
                {displayHeadPanelError &&
                    <Fragment>
                        <div className={`${classes.item} ${classes.headPanelError}`}>
                            <FormattedMessage module="policyHolder" id="mandatoryFieldsEmptyError" />
                        </div>
                        <Divider />
                    </Fragment>
                }
                <Grid container className={classes.item}>
                    <Grid item xs={2} className={classes.item}>
                        <TextInput
                            module="policyHolder"
                            label="code"
                            required
                            value={!!edited && !!edited.code ? edited.code : ""}
                            onChange={v => this.updateAttribute('code', v)}
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <TextInput
                            module="policyHolder"
                            label="tradeName"
                            required
                            value={!!edited && !!edited.tradeName ? edited.tradeName : ""}
                            onChange={v => this.updateAttribute('tradeName', v)}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <PublishedComponent
                            pubRef="location.DetailedLocation"
                            withNull={true}
                            required
                            filterLabels={false}
                            value={!!edited ? edited.location : null}
                            onChange={v => this.updateAttribute('location', v)}
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <TextAreaInput
                            module="policyHolder"
                            label="address"
                            value={!!edited && !!edited.address ? edited.address : ""}
                            onChange={v => this.updateAttribute('address', v)}
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <TextInput
                            module="policyHolder"
                            label="phone"
                            value={!!edited && !!edited.phone ? edited.phone : ""}
                            error={this.regexError('phone', edited.phone)}
                            onChange={v => this.updateAttribute('phone', v)}
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <TextInput
                            module="policyHolder"
                            label="fax"
                            value={!!edited && !!edited.fax ? edited.fax : ""}
                            error={this.regexError('fax', edited.fax)}
                            onChange={v => this.updateAttribute('fax', v)}
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <TextInput
                            module="policyHolder"
                            label="email"
                            value={!!edited && !!edited.email ? edited.email : ""}
                            error={this.regexError('email', edited.email)}
                            onChange={v => this.updateAttribute('email', v)}
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <TextInput
                            module="policyHolder"
                            label="contactName"
                            value={!!edited && !!edited.contactName ? edited.contactName : ""}
                            onChange={v => this.updateAttribute('contactName', v)}
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <PublishedComponent
                            pubRef="policyHolder.LegalFormPicker"
                            module="policyHolder"
                            label="legalForm"
                            value={!!edited ? edited.legalForm : null}
                            onChange={v => this.updateAttribute('legalForm', v)}
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <PublishedComponent
                            pubRef="policyHolder.ActivityCodePicker"
                            module="policyHolder"
                            label="activityCode"
                            value={!!edited ? edited.activityCode : null}
                            onChange={v => this.updateAttribute('activityCode', v)}
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <TextInput
                            module="policyHolder"
                            label="accountancyAccount"
                            value={!!edited && !!edited.accountancyAccount ? edited.accountancyAccount : ""}
                            onChange={v => this.updateAttribute('accountancyAccount', v)}
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <TextInput
                            module="policyHolder"
                            label="bankAccount"
                            value={!!edited && !!edited.bankAccount ? edited.bankAccount : ""}
                            onChange={v => this.updateAttribute('bankAccount', v)}
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <TextInput
                            module="policyHolder"
                            label="paymentReference"
                            value={!!edited && !!edited.paymentReference ? edited.paymentReference : ""}
                            onChange={v => this.updateAttribute('paymentReference', v)}
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <PublishedComponent
                            pubRef="core.DatePicker"
                            module="policyHolder"
                            label="dateValidFrom"
                            required
                            value={!!edited && !!edited.dateValidFrom ? edited.dateValidFrom : null}
                            onChange={v => this.updateAttribute('dateValidFrom', v)}
                        />
                    </Grid>
                    <Grid item xs={2} className={classes.item}>
                        <PublishedComponent
                            pubRef="core.DatePicker"
                            module="policyHolder"
                            label="dateValidTo"
                            value={!!edited && !!edited.dateValidTo ? edited.dateValidTo : null}
                            onChange={v => this.updateAttribute('dateValidTo', v)}
                        />
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(PolicyHolderGeneralInfoPanel))))