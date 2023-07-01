import React, { useEffect } from "react";
import { Box, TextField, Grid, Typography, Autocomplete, Button } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Save, Delete, Visibility, Edit } from '@mui/icons-material';
import { addHoliday, editHoliday, getHolidayRecord, removeHoliday, setAction, setValidationMessage, setYear } from "../slice/holidaySlice";
import { FormattedMessage } from "react-intl";
import * as yup from "yup";
import { Formik, Field, Form } from "formik";


const NewHoliday = () => {
    const types = ['Fixed', 'Optional'];
    const locations = ['All Locations', 'India', 'Bettendorf'];
    const holiday = useSelector(state => state.holiday);
    const record = {
        id: "",
        date: "",
        description: "",
        type: "",
        location: "",
    }
    const validationSchema = yup.object().shape({
        date: yup.string().required('Date is required'),
        description: yup.string().required('Description is required'),
        type: yup.string().required('Type is required').nullable(),
        location: yup.string().required('Location is required').nullable(),
    });

    const [newHoliday, setNewHoliday] = useState(record);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const holidayAction = useSelector(state => state.actionValue);
    const id = useSelector(state => state.holidayId);
    const statusMessage = useSelector(state => state.statusMessage);
    const statusCode = useSelector(state => state.statusCode);
    const flag = useSelector(state => state.flag);
    const goYear = useSelector(state => state.year);


    useEffect(() => {
        if (holidayAction === "view" || holidayAction === "edit") {
            if (holidayAction === 'view') { dispatch(setValidationMessage("")); }
            dispatch(getHolidayRecord(id));
            setNewHoliday({
                id: holiday.id,
                location: holiday.location,
                date: holiday.date,
                type: holiday.type,
                description: holiday.description,
            })
        }
        else if (holidayAction === "create") {
            setNewHoliday(record);
            dispatch(setValidationMessage(""));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (holidayAction === 'create') {
            if (statusCode === 200) {
                dispatch(setAction('create'));
            } else if (statusCode === 201) {
                dispatch(setAction('edit'));
                navigate('/edit');
            }
        }
        else if (holidayAction === 'edit' || holidayAction === 'view') {
            if (holidayAction === 'view') { dispatch(setValidationMessage("")); }
            if (statusCode === 208) {
                setNewHoliday(newHoliday);
            }
            else {
                setNewHoliday({
                    id: holiday.id,
                    location: holiday.location,
                    date: holiday.date,
                    type: holiday.type,
                    description: holiday.description,
                })
            }
        }

    }, [holiday]);

    const onListView = (e) => {
        e.preventDefault();
        dispatch(setYear(goYear));
        navigate("/");
    }
    const handleSubmit = (inputs) => {
        switch (holidayAction) {
            case 'create':
                dispatch(addHoliday(inputs));
                break;
            case 'edit':
                dispatch(editHoliday(id, inputs));
                break;
            default:
                break;
        }
    }
    const onUpdate = () => {
        dispatch(getHolidayRecord(id));
        dispatch(setAction('edit'));
        navigate('/edit');
    }
    const onView = () => {
        dispatch(getHolidayRecord(id));
        dispatch(setAction('view'));
        navigate('/view');
    }
    const onDelete = () => {
        dispatch(removeHoliday(id));
        navigate('/');
    };
    return (
        <Box component="div">
            <Box display="flex" alignItems="center" style={{
                position: "fixed",
                top: "65px",
                border: '1.5px solid #2196f3',
                marginRight: '60px',
                marginLeft: '60px'
            }}>
                <Formik initialValues={newHoliday}
                    validationSchema={validationSchema}
                    enableReinitialize={(holidayAction === 'create') ? false : true}
                    onSubmit={(values, action) => {
                        setNewHoliday(values);
                        handleSubmit(values);
                        action.setSubmitting(false);
                    }}
                >
                    {(props) => (
                        <Form>
                            <Grid container style={{ paddingTop: '10px' }} spacing={1}>
                                <Grid item xs={2} style={{ textAlign: 'right', paddingTop: "10px" }}>
                                    <Typography id="idLabel"> <FormattedMessage id="Holiday ID" />:</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Field as={TextField} id="id" name="id"
                                        value={newHoliday.id} disabled inputProps={{ "data-testid": "id" }}
                                        variant="outlined" style={{ width: '90%', color: 'gray' }} size="small" />
                                </Grid>
                                <Grid item xs={2} style={{ textAlign: 'right', paddingTop: "10px" }}>
                                    <Typography id="locationLabel"><FormattedMessage id="Location" />:</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Autocomplete
                                        inputProps={{ "data-testid": "location" }}
                                        id="location"
                                        name="location"
                                        size="small"
                                        options={locations}
                                        value={holidayAction === 'view' ? newHoliday.location : props.values.location}
                                        disabled={holidayAction === 'view'}
                                        onChange={(event, value) =>
                                            props.setFieldValue("location", value)
                                        }
                                        onBlur={props.handleBlur}
                                        getOptionLabel={(option) => option.label ?? option}
                                        renderInput={(params) => <Field as={TextField} {...params}
                                            onChange={props.handleChange}
                                            variant="outlined" name="location"
                                            style={{ width: '90%' }} />} />
                                    {props.errors.location && props.touched.location && (
                                        <div style={{ color: 'red', fontFamily: 'sans-serif' }}>{props.errors.location}</div>
                                    )}
                                </Grid>
                                <Grid item xs={2} style={{ textAlign: 'right', paddingTop: "10px" }}>
                                    <Typography id="dateLabel"><FormattedMessage id="Date" />:</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Field as={TextField} type='date' id="date"
                                        name="date" inputProps={{ "data-testid": "date" }}
                                        variant="outlined"
                                        style={{ width: '90%' }}
                                        value={holidayAction === 'view' ? newHoliday.date : props.values.date}
                                        onBlur={props.handleBlur}
                                        disabled={holidayAction === 'view'}
                                        onChange={props.handleChange}
                                        size="small" />
                                    {props.errors.date && props.touched.date && (
                                        <div style={{ color: 'red', fontFamily: 'sans-serif' }}>{props.errors.date}</div>
                                    )}
                                </Grid>
                                <Grid item xs={2} style={{ textAlign: 'right', paddingTop: "10px" }}>
                                    <Typography id="typeLabel"><FormattedMessage id="Holiday Type" />:</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Autocomplete
                                        id="type" inputProps={{ "data-testid": "type" }}
                                        name="type"
                                        size="small"
                                        options={types}
                                        value={holidayAction === 'view' ? newHoliday.type : props.values.type}
                                        onBlur={props.handleBlur}
                                        disabled={holidayAction === 'view'}
                                        onChange={(event, value) =>
                                            props.setFieldValue("type", value)
                                        }
                                        renderInput={(params) => <Field as={TextField} {...params}
                                            onChange={props.handleChange}
                                            variant="outlined"
                                            style={{ width: '90%' }} />} />
                                    {props.errors.type && props.touched.type && (
                                        <div style={{ color: 'red', fontFamily: 'sans-serif' }}>{props.errors.type}</div>
                                    )}
                                </Grid>
                                <Grid item xs={2} style={{ textAlign: 'right', paddingTop: "10px" }}>
                                    <Typography id="descriptionLabel"><FormattedMessage id="Description" />:</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <TextField id="description" name="description"
                                        variant="outlined" inputProps={{ "data-testid": "description" }}
                                        value={holidayAction === 'view' ? newHoliday.description : props.values.description}
                                        onBlur={props.handleBlur}
                                        disabled={holidayAction === 'view'}
                                        onChange={props.handleChange}
                                        size="small"
                                        style={{ width: '90%' }} />
                                    {props.errors.description && props.touched.description && (
                                        <div style={{ color: 'red', fontFamily: 'sans-serif' }}>{props.errors.description}</div>
                                    )}
                                </Grid>
                                <Grid container>
                                    {statusMessage && !flag ? <p style={{ color: "red", marginLeft: 'auto', marginRight: 'auto', fontFamily: 'sans-serif' }}>{statusMessage}</p> : <p style={{ color: "green", marginLeft: 'auto', marginRight: 'auto', fontFamily: 'sans-serif' }}>{statusMessage}</p>}
                                </Grid>
                                <Box display="flex" alignItems="center" style={{
                                    paddingTop: '10px',
                                    paddingBottom: '10px',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}>
                                    {holidayAction !== 'view' && (
                                        <Button variant="contained" type="submit"
                                            style={{
                                                backgroundColor: '#2979ff',
                                                color: 'white',
                                                marginRight: '16px',
                                                textTransform: 'none'
                                            }} startIcon={<Save style={{ color: 'yellow' }} />}><FormattedMessage id="Save" /></Button>
                                    )}

                                    {holidayAction === 'view' && (
                                        <Button variant="outlined" startIcon={<Edit style={{ color: '#2e7d32' }} />}
                                            onClick={() => onUpdate(id)} style={{
                                                color: '#00838f',
                                                borderColor: '#00838f',
                                                marginRight: '16px',
                                                textTransform: 'none'
                                            }}><FormattedMessage id="Switch to Update" /></Button>
                                    )}
                                    {holidayAction === 'edit' && (
                                        <Button variant="contained" onClick={() => onDelete(id)}
                                            color="error" startIcon={<Delete style={{ color: 'yellow' }} />} style={{
                                                marginRight: '16px',
                                                textTransform: 'none',
                                            }}><FormattedMessage id="Delete" /></Button>)}
                                    {holidayAction === 'edit' && (
                                        <Button variant="outlined" onClick={() => onView(id)}
                                            startIcon={<Visibility style={{ color: '#002984' }} />} style={{
                                                color: '#00838f',
                                                borderColor: '#00838f',
                                                marginRight: '16px',
                                                textTransform: 'none'
                                            }}><FormattedMessage id="Switch to View" /></Button>
                                    )}
                                    <Button variant="outlined" onClick={onListView} style={{
                                        color: '#00838f',
                                        borderColor: '#00838f',
                                        marginRight: '16px',
                                        textTransform: 'none'
                                    }}><FormattedMessage id="Goto:Holidays" /></Button>
                                </Box>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    )
}

export default NewHoliday;
