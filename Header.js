import React from 'react';
import { AppBar, Toolbar, Select, MenuItem, Box, Link } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { BeachAccess, AttachMoney, Home, Person, Settings, List, ExitToApp } from '@mui/icons-material';
import quadLogo from './quadLogo.svg';
import { FormattedMessage } from 'react-intl';

const userStyles = makeStyles({
  customizeToolbar: {
    minHeight: '50px',
    fontFamily: "Helvetica",
    fontWeight: "200",
    color: "#667799"
  },
  root: {
    marginLeft: '16px',
    color: "#ab003c"
  },
  customizeList: {
    marginLeft: '16px',
    color: "#028A0F",
    paddingRight: '5px'
  },
  user: {
    color: "#6d1b7b",
    verticalAlign: "middle",
    paddingRight: "5px"
  },
  customizeHome: {
    color: "#2c387e",
    marginLeft: '16px',
    paddingRight: '5px'
  },
  customizeSettings: {
    color: "#33eaff",
    paddingRight: '5px',
    verticalAlign: "middle",

  }
});

const Header = () => {
  const classes = userStyles();
  return (
    <Box component="div">
      <AppBar position='fixed' color='transparent'>
        <Toolbar className={classes.customizeToolbar}>
          <img src={quadLogo} className="quad-logo" alt="logo" height={40} width={150} />
          <Home className={classes.customizeHome} fontSize='small' />
          <Link href='#' underline='none' style={{ color: '#000000' }}><FormattedMessage id="Home" /></Link>
          <List className={classes.customizeList} fontSize='small' />
          <Link href='#' underline='none' style={{ color: '#000000' }}><FormattedMessage id="Time Log" /> </Link>
          <BeachAccess className={classes.root} fontSize='small' style={{ paddingRight: '5px' }} />
          <Link data-testid="holiday" href='/' underline='none' style={{ color: '#000000' }}><FormattedMessage id="Holiday" /> </Link>
          <AttachMoney className={classes.root} fontSize='small' />
          <Link href='#' underline='none' style={{ color: '#000000' }}> <FormattedMessage id="Time Summary" /> </Link>

          <Select labelId='person-label' value='Settings' style={{ marginLeft: '16px' }} variant='standard' disableUnderline >
            <MenuItem value='Settings'>
              <Settings fontSize='small' className={classes.customizeSettings} />
              <FormattedMessage id="Settings" /></MenuItem>
            <MenuItem value='changePassword'><FormattedMessage id="Change Password" /></MenuItem>
            <MenuItem value='changePassphrase'><FormattedMessage id="Change Passphrase" /></MenuItem>
          </Select>
          <Select labelId='person-label' value='Sowjanya Tadanki' style={{ marginLeft: 'auto', marginTop: "10px" }} variant='standard' disableUnderline>
            <MenuItem value='Sowjanya Tadanki'>
              <Person className={classes.user} />
              <FormattedMessage id="Sowjanya Tadanki" />
            </MenuItem>
            <MenuItem value='Change Password'><Person style={{ color: "#6d1b7b" }} /><FormattedMessage id="Change Password" /></MenuItem>
            <MenuItem value='Change Passphrase'><Person style={{ color: "#6d1b7b" }} /><FormattedMessage id="Change Passphrase" /></MenuItem>
            <MenuItem value='Logout'><ExitToApp style={{ color: "red" }} /><FormattedMessage id="Logout" /></MenuItem>
          </Select>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header;