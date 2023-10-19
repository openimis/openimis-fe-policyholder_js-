import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { TextField } from '@material-ui/core';

import { useModulesManager, Autocomplete } from '@openimis/fe-core';
import { fetchPolicyHolders as fetchEconomicUnits } from '../actions';

const EconomicUnitPicker = ({
  onChange,
  label = ' ',
  readOnly = false,
  required,
  value,
}) => {
  const dispatch = useDispatch();
  const modulesManager = useModulesManager();
  const {
    policyHolders: economicUnits,
    fetchingPolicyHolders: fetchingEconomicUnits,
    errorPolicyHolders: errorEconomicUnits,
  } = useSelector((store) => store.policyHolder);

  const fetchAvailableEconomicUnits = async () => {
    //NOTE: We want to fetch all economic units available for logged User
    //TODO: Add possibility to filter EU using userId. After that, fetch the logged user and change the filters
    try {
      const filters = ['isDeleted: false'];
      await dispatch(fetchEconomicUnits(modulesManager, filters));
    } catch (error) {
      console.error('Failed to fetch economic units:', error);
    }
  };

  useEffect(() => {
    fetchAvailableEconomicUnits();
  }, []);

  useEffect(() => {
    if (economicUnits.length === 1) {
      onChange(economicUnits[0]);
    }
  }, [economicUnits]);

  return (
    <Autocomplete
      error={errorEconomicUnits}
      readOnly={readOnly}
      options={economicUnits}
      isLoading={fetchingEconomicUnits}
      value={value}
      getOptionLabel={(economicUnit) =>
        `${economicUnit.code} - ${economicUnit.tradeName}`
      }
      onChange={(value) => onChange(value)}
      onInputChange={() => {}}
      renderInput={(inputProps) => (
        <TextField {...inputProps} required={required} label={label} />
      )}
    />
  );
};

export default EconomicUnitPicker;
