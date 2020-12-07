# openIMIS Frontend Policy Holder reference module
This repository holds the files of the openIMIS Frontend Policy Holder reference module.
It is dedicated to be deployed as a module of [openimis-fe_js](https://github.com/openimis/openimis-fe_js).

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

## Main Menu Contributions
None

## Other Contributions
* `core.Router`: registering `policyHolders`, `policyHolders/policyHolder` routes in openIMIS client-side router
* `insuree.MainMenu`:
    
    **Policy Holders** (`menu.policyHolders` translation key)

## Available Contribution Points
None

## Published Components
* `policyHolder.LegalFormPicker`, picker for legal form (from JSON stored in the module configuration)
* `policyHolder.ActivityCodePicker`, picker for activity code (from JSON stored in the module configuration)

## Dispatched Redux Actions
* `POLICYHOLDER_POLICYHOLDERS_{REQ|RESP|ERR}`, fetching policy holders (as triggered by the searcher)
* `POLICYHOLDER_MUTATION_{REQ|ERR}`, sending a mutation
* `POLICYHOLDER_CREATE_POLICYHOLDER_RESP`, receiving a result of create Policy Holder mutation

## Other Modules Listened Redux Actions
None

## Other Modules Redux State Bindings
* `state.core.user`, to access user info (rights,...)

## Configurations Options
* `policyHolderFilter.rowsPerPageOptions`: pagination page size options in PolicyHolderSearcher component (Default: `[10, 20, 50, 100]`)
* `policyHolderFilter.defaultPageSize`: pagination pre-selected page size options in PolicyHolderSearcher component (Default: `10`)
* `policyHolderFilter.legalFormOptions`: options for LegalFormPicker component (Default:
    ```json
    [{
        "value": "1", 
        "label": {
            "en": "Personal Company",
            "fr": "Persone physique"
        }
    }, {
        "value": "2",
        "label": {
            "en": "Limited Risk Company",
            "fr": "Société à risque limité"
        }
    }, {
        "value": "3",
        "label": {
            "en": "Association",
            "fr": "Association"
        }
    }, {
        "value": "4",
        "label": {
            "en": "Government",
            "fr": "Gouvernement"
        }
    }, {
        "value": "5",
        "label": {
            "en": "Union",
            "fr":"Syndicat"
        }
    }]
    ```
)
* `policyHolderFilter.activityCodeOptions`: options for ActivityCodePicker component (Default:
    ```json
    [{   
        "value": "1", 
        "label": {
            "en": "Retail", 
            "fr": "Vente au détails"
        }
    }, {
        "value": "2",
        "label": {
            "en": "Industry", 
            "fr": "Industrie"
        }
    }, {
        "value": "3",
        "label": {
            "en": "Building", 
            "fr": "Construction"
        }
    }, {
        "value": "4",
        "label": { 
            "en": "Sailing", 
            "fr": "Maritime"
        }
    }, {
        "value": "5",
        "label": { 
            "en": "Services",
            "fr":"Services"
        }
    }]
    ```
)
* `policyHolderForm.phoneValidation`: Phone field validation (regex + error message when regex does not match) (Default:
    ```json
    "phoneValidation": {
        "regex": /^[0-9]*$/,
        "regexMsg": {
            "en": "Invalid phone number",
            "fr": "Numéro de téléphone invalide"
        }
    }
    ```
)
* `policyHolderForm.faxValidation`: Fax field validation (regex + error message when regex does not match) (Default:
    ```json
    "faxValidation", {
        "regex": /^[0-9]{8,9}$/,
        "regexMsg": {
            "en": "Invalid fax number",
            "fr": "Numéro de fax invalide"
        }
    }
    ```
)
* `policyHolderForm.paymentReferenceValidation`: PaymentReference field validation (regex + error message when regex does not match) (Default:
    ```json
    "paymentReferenceValidation", {
        "regex": /.+/,
        "regexMsg": {
            "en": "Invalid payment reference",
            "fr": "Référence de payement invalide"
        }
    }
    ```
)
* `policyHolderForm.accountancyAccountValidation`: AccountancyAccount field validation (regex + error message when regex does not match) (Default:
    ```json
    "accountancyAccountValidation", {
        "regex": /.+/,
        "regexMsg": {
            "en": "Invalid accountancy account",
            "fr": "Numéro de compte comptable invalide"
        }
    }
    ```
)
