# openIMIS Frontend Policy Holder reference module
This repository holds the files of the openIMIS Frontend Policy Holder reference module.
It is dedicated to be deployed as a module of [openimis-fe_js](https://github.com/openimis/openimis-fe_js).

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

## Main Menu Contributions
None

## Other Contributions
* `core.Router`: registering `policyHolders` routes in openIMIS client-side router
* `insuree.MainMenu`:
    
    **Policy Holders** (`menu.policyHolders` translation key)

## Available Contribution Points
None

## Published Components
* `policyHolder.LegalFormPicker`, picker for legal form (from JSON stored in the module configuration)
* `policyHolder.ActivityCodePicker`, picker for activity code (from JSON stored in the module configuration)

## Dispatched Redux Actions
* `POLICYHOLDER_POLICYHOLDERS_{REQ|RESP|ERR}`, fetching policy holders (as triggered by the searcher)

## Other Modules Listened Redux Actions
None

## Other Modules Redux State Bindings
* `state.core.user`, to access user info (rights,...)

## Configurations Options
* `policyHolderFilter.rowsPerPageOptions`: pagination page size options in PolicyHolderSearcher component (Default: `[10, 20, 50, 100]`)
* `policyHolderFilter.defaultPageSize`: pagination pre-selected page size options in PolicyHolderSearcher component (Default: `10`)
* `policyHolderFilter.legalFormOptions`: options for LegalFormPicker component (Default: 
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
    }])
* `policyHolderFilter.activityCodeOptions`: options for ActivityCodePicker component (Default:
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
    }])
