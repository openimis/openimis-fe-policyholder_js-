import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Tooltip } from '@material-ui/core';
import { PinDrop } from '@material-ui/icons';

import { useTranslations, useModulesManager } from '@openimis/fe-core';
import { MODULE_NAME } from '../constants';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(2),
    color: theme.palette.secondary.main,
  },
}));

const EconomicUnitChangeButton = ({ onEconomicDialogOpen }) => {
  const classes = useStyles();
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);

  const economicUnitConfig = modulesManager.getConf(
    'fe-core',
    'App.economicUnitConfig',
    false
  );

  if (!economicUnitConfig) return null;

  return (
    <Tooltip title={formatMessage('EconomicUnitChangeButton.tooltip')}>
      <IconButton
        className={classes.button}
        onClick={() => onEconomicDialogOpen()}
      >
        <PinDrop />
      </IconButton>
    </Tooltip>
  );
};

export default EconomicUnitChangeButton;
