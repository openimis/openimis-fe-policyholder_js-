import React, { Component } from "react";
import { PublishedComponent, decodeId } from "@openimis/fe-core";
import { RIGHT_PORTALPAYMENT_SEARCH } from "../constants"

class PolicyHolderPaymentsTabLabel extends Component {
    render() {
        return (
            this.props.rights.includes(RIGHT_PORTALPAYMENT_SEARCH) && (
                <PublishedComponent
                    pubRef="payment.PaymentsTab.label"
                    {...this.props}
                />
            )
        );
    }
}

class PolicyHolderPaymentsTabPanel extends Component {
    additionalFilter = () => {
        const filter = {
            policyHolder: decodeId(this.props.policyHolder.id)
        };
        return JSON.stringify(filter);
    }

    render() {
        return (
            this.props.rights.includes(RIGHT_PORTALPAYMENT_SEARCH) &&
            !!this.props.policyHolder.id && (
                <PublishedComponent
                    pubRef="payment.PaymentsTab.panel"
                    additionalFilter={this.additionalFilter()}
                    {...this.props}
                />
            )
        );
    }
}

export {
    PolicyHolderPaymentsTabLabel,
    PolicyHolderPaymentsTabPanel
}
