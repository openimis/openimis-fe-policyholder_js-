import React from "react"
import BusinessIcon from "@material-ui/icons/Business"
import { FormattedMessage } from "@openimis/fe-core";
import messages_en from "./translations/en.json";
import PolicyHoldersPage from "./pages/PolicyHoldersPage";
import PolicyHolderPage from"./pages/PolicyHolderPage";
import LegalFormPicker from "./pickers/LegalFormPicker";
import ActivityCodePicker from "./pickers/ActivityCodePicker";
import reducer from "./reducer";
import { RIGHT_POLICYHOLDER_SEARCH } from "./constants"
import TabPanel from "./components/TabPanel";
import { PolicyHolderInsureesTabLabel, PolicyHolderInsureesTabPanel } from "./components/PolicyHolderInsureesTab";
import { PolicyHolderContributionPlanBundlesTabLabel, PolicyHolderContributionPlanBundlesTabPanel } from "./components/PolicyHolderContributionPlanBundlesTab";
import ConfigBasedPicker from "./pickers/ConfigBasedPicker";
import PolicyHolderPicker from "./pickers/PolicyHolderPicker";

const ROUTE_POLICY_HOLDERS = "policyHolders";
const ROUTE_POLICY_HOLDER = "policyHolders/policyHolder";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }],
  "reducers": [{ key: 'policyHolder', reducer }],
  "refs": [
    { key: "policyHolder.LegalFormPicker", ref: LegalFormPicker },
    { key: "policyHolder.ActivityCodePicker", ref: ActivityCodePicker },
    { key: "policyHolder.ConfigBasedPicker", ref: ConfigBasedPicker},
    { key: "policyHolder.TabPanel", ref: TabPanel },
    { key: "policyHolder.PolicyHolderPicker", ref: PolicyHolderPicker },
    { key: "policyHolder.PolicyHolderPicker.projection", ref: ["id", "code", "tradeName"] },
    { key: "policyHolder.route.policyHolders", ref: ROUTE_POLICY_HOLDERS },
    { key: "policyHolder.route.policyHolder", ref: ROUTE_POLICY_HOLDER }
  ],
  "core.Router": [
    { path: ROUTE_POLICY_HOLDERS, component: PolicyHoldersPage },
    { path: ROUTE_POLICY_HOLDER  + "/:policyholder_id?", component: PolicyHolderPage }
  ],
  "insuree.MainMenu": [
    {
      text: <FormattedMessage module="policyHolder" id="menu.policyHolders" />,
      icon: <BusinessIcon />,
      route: "/" + ROUTE_POLICY_HOLDERS,
      filter: rights => rights.includes(RIGHT_POLICYHOLDER_SEARCH)
    }
  ],
  "policyHolder.TabPanel.label": [PolicyHolderInsureesTabLabel, PolicyHolderContributionPlanBundlesTabLabel],
  "policyHolder.TabPanel.panel": [PolicyHolderInsureesTabPanel, PolicyHolderContributionPlanBundlesTabPanel]
}

export const PolicyHolderModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}
