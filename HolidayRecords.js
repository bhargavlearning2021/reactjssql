import React from "react";
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { retrieveHolidays, setAction, setId } from "../slice/holidaySlice";
import { Typography, Box, Grid, Select, MenuItem, FormControl } from '@mui/material';
import { AddCircle, Visibility, Edit } from '@mui/icons-material';
import moment from "moment";
import { FormattedMessage } from "react-intl";

const HolidayRecords = () => {
  const yearsList = [];
  const currentYear = moment().year();
  for (let index = currentYear - 3; index <= currentYear + 3; index++) {
    yearsList.push(index)
  }
  let years = yearsList.map(function (e) { return e.toString() });

  const dispatch = useDispatch();
  const holidays = useSelector(state => state.holidayList);
  const hyear = useSelector(state => state.year);
  const statusMessage = useSelector(state => state.statusMessage);
  const [filterYear, setFilterYear] = useState(hyear);

  useEffect(() => {
    dispatch(retrieveHolidays(hyear));
    setFilterYear(hyear);
  }, []);

  const onSelectYear = e => {
    const newYear = e.target.value;
    console.log("newyear", newYear);
    setFilterYear(newYear);
    dispatch(retrieveHolidays(newYear));
  }
  return (
    <Box component="div">
      <Grid container style={{ position: "fixed", top: "65px", backgroundColor: "#17a2b8", display: "flex" }}>
        <Grid item xs={1}></Grid>
        <Grid item xs={1} style={{ color: "white", marginTop: "8px" }}><Typography><FormattedMessage id="Filter - Year" />:</Typography></Grid>
        <Grid item xs={1}>
          <FormControl>
            <Select value={filterYear} onChange={onSelectYear}
              style={{
                backgroundColor: 'white',
                marginLeft: '30px',
                width: 150,
                borderRadius: '0.25rem',
                height: '38px'
              }}>
              {years.map((year, index) => (
                <MenuItem
                  key={index}
                  value={year}
                >{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={8}></Grid>
      </Grid>

      <Grid container style={{
        position: "fixed",
        top: "102px",
        backgroundColor: 'black',
        color: "white",
        height: '6%'
      }}>
        <Grid item xs={1} style={{ display: 'flex', marginTop: "8px" }}>
          <Typography><FormattedMessage id="Action" /></Typography>
          <Link to='/newholiday' onClick={() => dispatch(setAction("create"))}><AddCircle fontSize="small" style={{
            color: 'yellow',
            paddingTop: '3px',
            marginLeft: '5px'
          }} /></Link></Grid>
        <Grid item xs={2} style={{ marginTop: "8px" }}><Typography style={{ paddingLeft: '15px' }}><FormattedMessage id="Date" /></Typography></Grid>
        <Grid item xs={4} style={{ marginTop: "8px" }}><Typography><FormattedMessage id="Description" /></Typography></Grid>
        <Grid item xs={2} style={{ marginTop: "8px" }}><Typography><FormattedMessage id="Type" /></Typography></Grid>
        <Grid item xs={2} style={{ marginTop: "8px" }}><Typography><FormattedMessage id="Location" /></Typography></Grid>
        <Grid item xs={1}></Grid>
      </Grid>
      <Box component="div">
        <Grid container style={{ position: "fixed", top: '149px' }}>
          {(typeof (holidays) === 'string') ?
            <Grid style={{ color: 'red', marginLeft: 'auto', fontFamily: 'sans-serif', marginRight: 'auto' }}>{statusMessage}</Grid>
            : (holidays.map((holiday) => (
              <Grid container key={holiday.id} style={{ fontFamily: "helvetica", paddingBottom: '8px' }}>
                <Grid item xs={1} style={{ paddingLeft: "10px" }}>
                  <Link to="/view" onClick={() => {
                    dispatch(setAction("view"));
                    dispatch(setId(holiday.id));
                  }}><Visibility fontSize="small" style={{ color: "darkcyan", paddingRight: "10px" }} /></Link>
                  <Link to='/edit' onClick={() => {
                    dispatch(setAction("edit"));
                    dispatch(setId(holiday.id));
                  }}><Edit fontSize="small" style={{ color: "orangered" }} /></Link>
                </Grid>
                <Grid item xs={2} style={{ paddingLeft: "15px" }}>{holiday.date}</Grid>
                <Grid item xs={4}>{holiday.description}</Grid>
                <Grid item xs={2}>{holiday.type}</Grid>
                <Grid item xs={2}>{holiday.location}</Grid>
                <Grid item xs={1}></Grid>
              </Grid>
            ))
            )
          }
        </Grid>
      </Box>
    </Box>
  )
}

export default HolidayRecords;