import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useTranslations, useModulesManager } from '@openimis/fe-core';
import { ECONOMIC_UNIT_STORAGE_KEY, MODULE_NAME } from '../constants';
import EconomicUnitPicker from '../pickers/EconomicUnitPicker';

const useStyles = makeStyles((theme) => ({
  primaryButton: theme.dialog.primaryButton,
  secondaryButton: theme.dialog.secondaryButton,
}));

const EconomicUnitDialog = ({ open, setEconomicUnitDialogOpen, onLogout }) => {
  const modulesManager = useModulesManager();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const {
    policyHolderUsers: economicUnitsWithUser,
    fetchingPolicyHolderUsers: fetchingEconomicUnitsWithUser,
  } = useSelector((store) => store.policyHolder);

  const [value, setValue] = useState(null);
  const storageEconomicUnit = localStorage.getItem(ECONOMIC_UNIT_STORAGE_KEY);

  const onChange = (option) => {
    setValue(option);
  };

  const onConfirm = () => {
    if (value) {
      localStorage.setItem(ECONOMIC_UNIT_STORAGE_KEY, JSON.stringify(value));
      setEconomicUnitDialogOpen(false);
    }
  };

  const onLogoutAction = () => {
    setEconomicUnitDialogOpen(false);
    onLogout(dispatch);
  };

  useEffect(() => {
    const handleLocalStorageChange = () => {
      if (!storageEconomicUnit) {
        setEconomicUnitDialogOpen(true);
      }
    };

    window.addEventListener('storage', handleLocalStorageChange);

    return () => {
      window.removeEventListener('storage', handleLocalStorageChange);
    };
  }, []);

  return (
    <Dialog open={open}>
      <DialogTitle>{formatMessage('selectEconomicUnit.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {formatMessage('selectEconomicUnit.message')}
        </DialogContentText>
        <EconomicUnitPicker
          readOnly={false}
          value={value}
          onChange={onChange}
          label={formatMessage('EconomicUnitPicker.label')}
        />
      </DialogContent>
      <DialogActions>
        {!economicUnitsWithUser?.length && (
          <Button
            onClick={onLogoutAction}
            className={classes.primaryButton}
            disabled={
              fetchingEconomicUnitsWithUser || economicUnitsWithUser?.length
            }
          >
            {formatMessage('selectEconomicUnit.logout')}
          </Button>
        )}
        <Button
          onClick={onConfirm}
          autoFocus
          className={classes.primaryButton}
          disabled={
            fetchingEconomicUnitsWithUser || !economicUnitsWithUser?.length
          }
        >
          {formatMessage('selectEconomicUnit.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EconomicUnitDialog;
