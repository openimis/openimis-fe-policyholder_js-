import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import {
  useTranslations,
  useModulesManager,
  ProgressOrError,
} from '@openimis/fe-core';
import { fetchPolicyHolders as fetchEconomicUnits } from '../actions';
import { MODULE_NAME } from '../constants';
import EconomicUnitPicker from '../pickers/EconomicUnitPicker';

const useStyles = makeStyles((theme) => ({
  primaryButton: theme.dialog.primaryButton,
  secondaryButton: theme.dialog.secondaryButton,
}));

const ECONOMIC_UNIT_STORAGE_KEY = 'userEconomicUnit';

const EconomicUnitDialog = ({ open, onClose, setEconomicUnitDialogOpen }) => {
  const dispatch = useDispatch();
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);

  const [value, setValue] = useState(null);
  const {
    policyHolders: economicUnits,
    fetchingPolicyHolders: fetchingEconomicUnits,
    errorPolicyHolders: errorEconomicUnits,
  } = useSelector((store) => store.policyHolder);

  const economicUnitDialogFilters = [];

  const fetchAvailableEconomicUnits = async () => {
    //NOTE: We want to fetch all economic units available for logged User
    //TODO: Add possibility to filter EU using userId. After that, fetch the logged user and change the filters
    try {
      await dispatch(
        fetchEconomicUnits(modulesManager, economicUnitDialogFilters)
      );
    } catch (error) {
      console.error('Failed to fetch economic units:', error);
    }
  };

  const onChange = (option) => {
    setValue(option);
  };

  const onConfirm = () => {
    if (value) {
      localStorage.setItem(ECONOMIC_UNIT_STORAGE_KEY, JSON.stringify(value));
      onClose();
    }
  };

  useEffect(() => {
    if (economicUnits.length === 1) {
      const singleUnit = economicUnits[0];
      setValue(singleUnit);
    }

    const handleLocalStorageChange = (e) => {
      if (!e.target.localStorage.getItem(ECONOMIC_UNIT_STORAGE_KEY)) {
        setEconomicUnitDialogOpen(true);
      }
    };

    window.addEventListener('storage', handleLocalStorageChange);

    return () => {
      window.removeEventListener('storage', handleLocalStorageChange);
    };
  }, [economicUnits]);

  useEffect(() => {
    if (open) {
      fetchAvailableEconomicUnits();
    }
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogTitle>{formatMessage('selectEconomicUnit.title')}</DialogTitle>
      <DialogContent>
        <ProgressOrError
          progress={fetchingEconomicUnits}
          error={errorEconomicUnits}
        />
        <DialogContentText>
          {formatMessage('selectEconomicUnit.message')}
        </DialogContentText>
        <EconomicUnitPicker
          readOnly={false}
          value={value}
          onChange={onChange}
          label={formatMessage('EconomicUnitPicker.label')}
          additionalFilters={economicUnitDialogFilters}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onConfirm}
          autoFocus
          className={classes.primaryButton}
          disabled={!value}
        >
          {formatMessage('selectEconomicUnit.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EconomicUnitDialog;
