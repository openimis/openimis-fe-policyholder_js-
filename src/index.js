import React from "react"
import BusinessIcon from "@material-ui/icons/Business"
import { FormattedMessage } from "@openimis/fe-core";
import messages_en from "./translations/en.json";
import PolicyHoldersPage from "./pages/PolicyHoldersPage";
import LegalFormPicker from "./pickers/LegalFormPicker";
import ActivityCodePicker from "./pickers/ActivityCodePicker";
import reducer from "./reducer";
import { RIGHT_POLICYHOLDER_SEARCH } from "./constants"

const ROUTE_POLICY_HOLDERS = "policyHolders";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }],
  "reducers": [{ key: 'policyHolder', reducer }],
  "refs": [
    { key: "policyHolder.LegalFormPicker", ref: LegalFormPicker },
    { key: "policyHolder.ActivityCodePicker", ref: ActivityCodePicker }
  ],
  "core.Router": [
    { path: ROUTE_POLICY_HOLDERS, component: PolicyHoldersPage }
  ],
  "insuree.MainMenu": [
    {
      text: <FormattedMessage module="policyHolder" id="menu.policyHolders" />,
      icon: <BusinessIcon />,
      route: "/" + ROUTE_POLICY_HOLDERS,
      filter: rights => rights.includes(RIGHT_POLICYHOLDER_SEARCH)
    }
  ]
}

export const PolicyHolderModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}