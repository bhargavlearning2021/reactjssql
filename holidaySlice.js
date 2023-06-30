import { createSlice } from '@reduxjs/toolkit';
import axiosConnect from '../axios/axiosConnect';
import moment from 'moment';

const currentYear = moment().year();
const initialState = { holidayList: [], year: currentYear, holiday: {}, actionValue: "", holidayId: "", statusMessage: '',statusCode: 0, flag: true}

const holidaySlice = createSlice({
  name: 'holiday',
  initialState,
  reducers: {
    findHolidayByYear: (state, action) =>  { 
        if(action.payload.status == 200){
          state.holidayList= action.payload.holiday;
        }
        else{
          state.holidayList = action.payload;  
        }
    },
    setActionValue: (state, action)=>{
      state.actionValue = action.payload;
    },
    setYear: (state, action)=>{
      state.year = action.payload;
    },
    setIdValue: (state, action)=> {
      state.holidayId = action.payload;
    },   
    setFlag: (state, action)=>{
      state.flag = action.payload;
    }, 
    createHoliday: (state, action) => {
      if(action.payload.status == 200) {
        state.holiday = action.payload.holiday;
      }
      else{
        state.holiday = action.payload;
    }
    },
    updateHoliday: (state, action) => {   
      if(action.payload.status == 200) {
        state.holiday = action.payload.holiday;
      }
      else{
        state.holiday = action.payload;
    }
    },
    deleteHoliday: (state, action) => {
      console.log(state, action);
    },
    readHoliday: (state, action) => {
      state.holiday = action.payload.holiday;
     },
    setStatusCode: (state, action)=>{
      state.statusCode = action.payload;
    },
    setValidationMessage: (state, action) => {
      state.statusMessage = action.payload;
    },
  },
})


export const { findHolidayByYear, createHoliday, updateHoliday, setYear, setFlag, setStatusCode, setValidationMessage, setActionValue, setIdValue, deleteHoliday, readHoliday } = holidaySlice.actions;

export const retrieveHolidays = (year) => async (dispatch) => {
  try {
      const res = await axiosConnect.get(`/holiday/year/2023`, {timeout: 1000 * 10});   
      dispatch(findHolidayByYear(res.data));
      dispatch(setYear(year));
  } catch (error) {
    if(error.response != undefined){
      dispatch( findHolidayByYear(error.response.data.message));
         dispatch(setValidationMessage(error.response.data.message));
         dispatch(setFlag(false));
         if(error.response.status == 404){
          dispatch(setYear(year));
         }
    }else{
      dispatch(setValidationMessage("Web Services unavailable"));
      dispatch( findHolidayByYear("Web Services unavailable"));
      dispatch(setFlag(false));
    }
  }
}
export const getHolidayRecord = (id) => async(dispatch) => {
  try{
   const res = await axiosConnect.get(`/holiday/${id}`);
    dispatch(readHoliday(res.data));    
   }catch(error){
    dispatch(readHoliday(error.message));
    dispatch(setFlag(false));
  }
    
}
export const addHoliday = ({ id, date, description, type, location }) => async (dispatch) => {
  try {
      const res = await axiosConnect.post("/holiday", { id, date, description, type, location }, {timeout: 1000 * 10});
      dispatch(setStatusCode(res.data.status));
      if(res.data.status == 201){
        dispatch(setValidationMessage(res.data.message));
        dispatch(setFlag(true));
        dispatch(createHoliday(res.data));
        dispatch(setIdValue(res.data.holiday.id)); 
       }
      else if(res.data.status == 200){
        dispatch(setValidationMessage(res.data.message));
        dispatch(setFlag(false));
        dispatch(createHoliday(res.data));
      }
  } catch (error) {
    if(error.response != undefined){
      dispatch( createHoliday(error.message));
         dispatch(setValidationMessage(error.response.data.message));
         dispatch(setFlag(false))
    }else{
      dispatch(setValidationMessage("Web Services unavailable"));
      dispatch(setFlag(false));
      dispatch( createHoliday("Web Services unavailable"));
    }
  }
}
export const removeHoliday = (id) => async (dispatch)=> {
  try{
    await axiosConnect.delete(`/holiday/${id}`);
    dispatch(deleteHoliday(id));
  }catch(error) {
    dispatch(deleteHoliday(error.message));
    dispatch(setFlag(false));
  }
}
export const setAction = (action) => async(dispatch)=>{
  dispatch(setActionValue(action));
}

export const setId = (id) => async(dispatch)=>{
  dispatch(setIdValue(id));
}

 export const editHoliday = (id, data) => async(dispatch)=> {
  await axiosConnect.put(`/holiday/${id}`, data, {timeout: 1000 * 10}).then((res)=>{
    if(res.data.status == 200){
            dispatch(setValidationMessage(res.data.message)); 
            dispatch(setFlag(true));
            dispatch(updateHoliday(res.data));  
            dispatch(setStatusCode(res.data.status));        
           }
           else if(res.data.status == 208) {
            dispatch(setValidationMessage(res.data.message));
            dispatch(setFlag(false));
            dispatch(setStatusCode(res.data.status));
          }
  }).catch((error)=>{
    if(error.response != undefined){
      dispatch( updateHoliday(error.message));
         dispatch(setValidationMessage(error.response.data.message));
         dispatch(setFlag(false));
    }else{
      dispatch(setValidationMessage("Web Services unavailable"));
      dispatch( updateHoliday("Web Services unavailable"));
      dispatch(setFlag(false));
    }   
  })
 }
export default holidaySlice.reducer;
