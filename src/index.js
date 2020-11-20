import React from "react"
import { Business } from "@material-ui/icons"
import { FormattedMessage } from "@openimis/fe-core";
import messages_en from "./translations/en.json";
import PolicyHoldersPage from "./pages/PolicyHoldersPage";
import LegalFormPicker from "./pickers/LegalFormPicker";
import ActivityCodePicker from "./pickers/ActivityCodePicker";
import reducer from "./reducer";

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
      icon: <Business />,
      route: "/" + ROUTE_POLICY_HOLDERS
    }
  ]
}

export const PolicyHolderModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}