import React, { useState, useEffect } from 'react';

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

const EconomicUnitDialog = ({ open, onClose, setEconomicUnitDialogOpen }) => {
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const [value, setValue] = useState(null);

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
    const handleLocalStorageChange = (e) => {
      if (!e.target.localStorage.getItem(ECONOMIC_UNIT_STORAGE_KEY)) {
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
