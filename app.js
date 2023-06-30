// const express = require('express');
// const uniqid = require('uniqid');
// const moment = require('moment');
// const cors = require('cors');
// const connection = require('./db/connection');
// const app = express();

// app.use(express.json());
// app.use(cors());
// app.use(express.urlencoded({ extended: true }));

// // app.use((req, res, next) => {
// // console.log(req.header);
// //   if ((req.header("Content-Type") == "application/json") && (req.header("Accept") == "application/json")) {
// //     next();
// //   }
// //   else {
// //     res.status(415).send({ message: "Unsupported Header type", status: "415" });
// //   }
// // });

// app.get('/holiday/year/:year', (req, res) => {
//   const selector = req.params.year;
//   const myquery = "select * from ETT_HOLIDAY where year(HOLIDAY) = ? order by HOLIDAY ASC";
//   let holidaystr;
//   connection.query(myquery, selector, (err, result) => {
//     if(err){
//       console.log(err);
//     if (err.code === 'ECONNREFUSED' || err.code === 'ERR_HTTP_HEADERS_SENT') {
//       res.status(500).send({ message: "Unable to connect to database", status: "500" });
//     }else{
//       console.log(err);
//       res.status(400).send({ message: "error occured", status: "400" });
//     }
//   }
//     else if (result.length > 0) {
//       let listResult = result;
//       for (let i = 0; i < listResult.length; i++) {
//         listResult[i].id = listResult[i].HOLIDAY_ID;
//         delete listResult[i].HOLIDAY_ID;
//         listResult[i].date = moment(listResult[i].HOLIDAY).format('DD-MM-YYYY');
//         delete listResult[i].HOLIDAY;
//         listResult[i].type = listResult[i].HOLIDAY_TYPE;
//         delete listResult[i].HOLIDAY_TYPE;
//         listResult[i].description = listResult[i].HOLIDAY_DESC;
//         delete listResult[i].HOLIDAY_DESC;
//         listResult[i].location = listResult[i].LOC_CD;
//         delete listResult[i].LOC_CD;
//         delete listResult[i].action;
//         delete listResult[i].ORG_CD;
//         delete listResult[i].CRT_BY_USER;
//         delete listResult[i].UPD_BY_USER;
//         delete listResult[i].CRT_BY_TS;
//         delete listResult[i].UPD_BY_TS;
//       }
//       for (i = 0; i < result.length; i++) {
//         result[i].type = (result[i].type === 'O') ? 'Optional' : 'Fixed';
//         result[i].location = (result[i].location === 'ALL') ? 'All Locations' : (result[i].location === 'IND') ? 'India' : 'Bettendorf';
//       }
//       holidaystr = result;
//     }
//     else {
//       holidaystr = "No records found";
//     }
//     res.status(200).send({ message: "Success", status: 200, holiday: holidaystr });
//   })
// })

// app.get('/holiday/:id', (req, res) => {
//   const iselector = req.params.id;
//   let myquery = "select count(*) as count from ETT_HOLIDAY where HOLIDAY_ID = ?";
//   connection.query(myquery, iselector, (err, result) => {
//     if(err){
//       if (err.code === 'ECONNREFUSED' || err.code === 'ERR_HTTP_HEADERS_SENT') {
//         res.status(500).send({ message: "Unable to connect to database", status: "500" });
//       }else{
//         console.log(err);
//         res.status(400).send({ message: "error occured", status: "400" });
//       }
//     }
//     else if (result[0].count != 0) {
//       myquery = "select HOLIDAY_ID, HOLIDAY, HOLIDAY_DESC, HOLIDAY_TYPE, LOC_CD from ETT_HOLIDAY where HOLIDAY_ID = ?";
//       connection.query(myquery, iselector, (err, result) => {
//         if (err) {
//           res.status(400).send({ message: "error occured", status: "400" });
//         }
//         getresult = {
//           id: result[0].HOLIDAY_ID,
//           date: moment(result[0].HOLIDAY).format('YYYY-MM-DD'),
//           description: result[0].HOLIDAY_DESC,
//           type: (result[0].HOLIDAY_TYPE === 'O') ? 'Optional' : 'Fixed',
//           location: (result[0].LOC_CD === 'ALL') ? 'All Locations' : (result[0].LOC_CD === 'IND') ? 'India' : 'Bettendorf'
//         }
//         res.status(200).send({ message: "Success", status: 200, holiday: getresult });
//       })
//     }
//     else {
//       res.status(404).send({ message: "Record not found", status: "404" });
//     }
//   })
// })

// app.post('/holiday', (req, res) => {
//   let cresult = {
//     HOLIDAY_ID: uniqid(),
//     LOC_CD: (req.body.location === 'All Locations') ? 'ALL' : (req.body.location === 'India') ? 'IND' : 'USA',
//     HOLIDAY: req.body.date,
//     HOLIDAY_TYPE: req.body.type === 'Optional' ? 'O' : 'F',
//     HOLIDAY_DESC: req.body.description
//   }
//   cdate = cresult.HOLIDAY;
//   const fomatArray = ['YYYY-MM-DD', 'MM-DD-YYYY', 'DD-MM-YYYY'];
//   validdate = moment(cdate, fomatArray, true).isValid();
//   const cloc = cresult.LOC_CD;
//   const ctype = cresult.HOLIDAY_TYPE;
//   const choliday = req.body.date;
//   const cid = cresult.HOLIDAY_ID;
//   if ((cloc === "") || (choliday === "") || (ctype === "")) {
//     res.status(400).send({ message: "All the fields are mandatory", status: "400" });
//   } else {
//     if (validdate == false) {
//       res.status(400).send({ message: "Invalid Date format", status: "400" })
//     }
//     else {
//       myquery = "select count(*) as count from ETT_HOLIDAY where HOLIDAY=?";
//       connection.query(myquery, [choliday], (err, result) => {
//         let insertresult = {
//           id: cid,
//           date: cdate,
//           description: req.body.description,
//           type: req.body.type,
//           location: req.body.location
//         }
//         if(err){
//           if (err.code === 'ECONNREFUSED' || err.code === 'ERR_HTTP_HEADERS_SENT') {
//             res.status(500).send({ message: "Unable to connect to database", status: "500" });
//           }else{
//             console.log(err);
//             res.status(400).send({ message: "error occured", status: "400" });
//           }
//         }
//         else if (result[0].count == 0) {
//           myquery = "insert into ETT_HOLIDAY(HOLIDAY_ID, ORG_CD, LOC_CD, HOLIDAY, HOLIDAY_TYPE, HOLIDAY_DESC, CRT_BY_USER, UPD_BY_USER, CRT_BY_TS, UPD_BY_TS) values (?, 'CBP', ?, ?, ?, ?, 'stadanki', 'stadanki', now(), now())";
//           connection.query(myquery, [cresult.HOLIDAY_ID, cresult.LOC_CD, cresult.HOLIDAY, cresult.HOLIDAY_TYPE, cresult.HOLIDAY_DESC], (err, result) => {
//             if (err) {
//               console.log(err);
//               res.status(400).send({ message: "error occured", status: 400 });
//             }
//             res.status(201).send({ message: "Record created successfully", status: 201, holiday: insertresult });
//           })
//         }
//         else {
//           res.status(200).send({ message: "Record exists", status: 200, holiday: insertresult });
//         }
//       })
//     }
//   }
// })

// app.put('/holiday/:id', (req, res) => {
//   const objid = req.params.id;
//   let postresult = {
//     HOLIDAY: req.body.date,
//     HOLIDAY_DESC: req.body.description,
//     HOLIDAY_TYPE: req.body.type === 'Optional' ? 'O' : 'F',
//     LOC_CD: (req.body.location === 'All Locations') ? 'ALL' : (req.body.location === 'India') ? 'IND' : 'USA'
//   }
//   hdate = req.body.date;
//   const fomatArray = ['YYYY-MM-DD', 'MM-DD-YYYY', 'DD-MM-YYYY'];
//   validdate = moment(hdate, fomatArray, true).isValid();
//   htype = postresult.HOLIDAY_TYPE;
//   hloc = postresult.LOC_CD;
//   let uresult = {
//     id: objid,
//     date: req.body.date,
//     description: req.body.description,
//     type: req.body.type,
//     location: req.body.location
//   }
//   if (validdate == true) {
//     myquery = "select HOLIDAY_ID, count(*) as count from ETT_HOLIDAY where HOLIDAY=? group by HOLIDAY_ID";
//     connection.query(myquery, [postresult.HOLIDAY], (err, result) => {
//       if (err) {
//         console.log(err);
//         res.status(400).send({ message: "error occured", status: "400" });
//         return;
//       }
//       else if (result && result.length > 0 && result[0].count > 0 && objid != result[0].HOLIDAY_ID) {
//         myquery = "select * from ETT_HOLIDAY where HOLIDAY_ID = ?";
//         connection.query(myquery, objid, (err, result) => {
//           if(err){
//             if (err.code === 'ECONNREFUSED' || err.code === 'ERR_HTTP_HEADERS_SENT') {
//               res.status(500).send({ message: "Unable to connect to database", status: "500" });
//             }else{
//               console.log(err);
//               res.status(400).send({ message: "error occured", status: "400" });
//               return;
//             }
//           }
//           res.status(208).send({ message: "Record exists", status: "208" });
//           return;
//         })
//       }
//       else {
//         myquery = "update ETT_HOLIDAY set ? where HOLIDAY_ID = ?";
//         connection.query(myquery, [postresult, objid], (err, result) => {
//           if(err){
//             if (err.code === 'ECONNREFUSED' || err.code === 'ERR_HTTP_HEADERS_SENT') {
//               res.status(500).send({ message: "Unable to connect to database", status: "500" });
//             }else{
//               console.log(err);
//               res.status(400).send({ message: "error occured", status: "400" });
//               return;
//             }
//           }
//           res.status(200).send({ message: "Record Updated Successfully", status: "200", holiday: uresult });
//           return;
//         })

//       }
//     })
//   }
//   else {
//     res.status(400).send({ message: "Not a valid Date format", status: "400" })
//   }
// })

// app.delete('/holiday/:id', (req, res) => {
//   const objid = req.params.id;
//   myquery = "select count(*) as count from ETT_HOLIDAY where HOLIDAY_ID = ?";
//   connection.query(myquery, objid, (err, result) => {
//     if(err){
//       if (err.code === 'ECONNREFUSED' || err.code === 'ERR_HTTP_HEADERS_SENT') {
//         res.status(500).send({ message: "Unable to connect to database", status: "500" });
//       }else{
//         console.log(err);
//         res.status(400).send({ message: "error occured", status: "400" });
//       }
//     }
//     else if (result[0].count != 0) {
//       myquery = "delete from ETT_HOLIDAY where HOLIDAY_ID = ?";
//       connection.query(myquery, objid, (err, result) => {
//         if(err){
//           if (err.code === 'ECONNREFUSED' || err.code === 'ERR_HTTP_HEADERS_SENT') {
//             res.status(500).send({ message: "Unable to connect to database", status: "500" });
//           }else{
//             console.log(err);
//             res.status(400).send({ message: "error occured", status: "400" });
//           }
//         }
//         res.status(200).send({ message: "Record Deleted", status: 200 });
//       })
//     }
//     else {
//       res.status(404).send({ message: "Record doesn't exist", status: "404" });
//     }
//   })
// })

// app.listen(4000, () => {
//   console.log('Server is up on port 4000')
// }).on("error", (err) => {
//   console.log("error occured: " + err.message);
// });

const mysql = require('mysql2')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const dateFormatter = require('date-and-time')
const uniqid = require('uniqid')
const e = require('express')
const { connect } = require('http2')
const cors = require('cors')

const app = express()
const PORT = 3500
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Establish and create a connection
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '3306',
    database: 'quadyster',
    connectionLimit: 15
})

//Req.Body Error Handling
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(406).send({
            "errormessage": "Invalid JSON body format",
            "status": 406
        })
    }
    next();
});

//List Holidays by Year
app.get('/holiday/year/:year', function (req, res) {
    let year = req.params.year
    try {
        connection.promise().query('SELECT * FROM `ETT_HOLIDAY` WHERE YEAR(`HOLIDAY`) = ? ORDER BY `HOLIDAY` ASC', [year])
            .then(([results, fields]) => {
                if (results.length == 0) {
                    let noHoliObj = {
                        "Holidays": [],
                        "message": "No holidays for the year: " + year,
                        "code": 200
                    }
                    res.status(200).send(noHoliObj)
                } else {
                    let holidays = results
                    let sentHolidays = objectifyHolidays(holidays)
                    res.status(200).send(sentHolidays)
                }
            })
            .catch((error) => {
                res.status(200).send({
                    "Holidays": [],
                    "message": "Unable to connect to the database",
                    "code": 500
                })
            })
    } catch (error) {
        console.log("catch error is happening!");
    }
})

//View One Holiday
app.get('/holiday/:id', function (req, res) {
    const id = req.params.id
    try {
        connection.promise().query('SELECT * FROM `ETT_HOLIDAY` WHERE `HOLIDAY_ID` = ?', [id])
            .then(([results, fields]) => {
                if (results.length === 0) {
                    res.status(404).send({
                        "errormessage": "Holiday not found with ID: " + id,
                        "errorcode": 404
                    })
                } else {
                    let holiday = results[0]
                    if (holiday.HOLIDAY_TYPE === "F") {
                        holiday.HOLIDAY_TYPE = "Fixed"
                    } else {
                        holiday.HOLIDAY_TYPE = "Optional"
                    }
                    if (holiday.LOC_CD === "ALL") {
                        holiday.LOC_CD = "All Locations"
                    } else if (holiday.LOC_CD === "USA") {
                        holiday.LOC_CD = "Bettendorf, IA"
                    } else {
                        holiday.LOC_CD = "India"
                    }
                    holiday.HOLIDAY = dateFormatter.format(holiday.HOLIDAY, 'YYYY-MM-DD')
                    let holidayObj = {
                        "id": holiday.HOLIDAY_ID,
                        "location": holiday.LOC_CD,
                        "date": holiday.HOLIDAY,
                        "type": holiday.HOLIDAY_TYPE,
                        "description": holiday.HOLIDAY_DESC
                    }
                    let holidaysObj = {
                        "Holiday": holidayObj,
                        "message": "Holiday retrieved successfully",
                        "code": 200
                    }
                    res.status(200).send(holidaysObj)
                }
            })
            .catch((error) => {
                res.status(500).send({
                    "errormessage": "Unable to connect to the database",
                    "errorcode": 500
                })
            })
    } catch (error) {
        console.log("Error is happening in the try/catch.");
    }
})

//Create One Holiday
app.post('/holiday', function (req, res) {
    let holidayLocation = req.body.location
    let holidayDate = req.body.date
    let holidayType = req.body.type
    let holidayDescription = req.body.description
    let dbLocation, dbType
    try {
        if ((req.body.location === '') || (req.body.date === '') || (req.body.type === '') || (req.body.description === '')) {
            throw "emptyfields"
        } else if ((req.get('Content-Type') != ('application/json'))) {
            throw "wrongcontenttype"
        } else if ((req.get('Accept') != ('application/json'))) {
            throw "wrongaccept"
        } else if (dateFormatter.isValid(holidayDate, 'YYYY-MM-DD') === false) {
            throw "invaliddate"
        }

        if (holidayLocation === "All Locations") {
            dbLocation = "ALL"
        } else if (holidayLocation === "Bettendorf, IA") {
            dbLocation = "USA"
        } else {
            dbLocation = "IND"
        }
        if (holidayType === "Fixed") {
            dbType = "F"
        } else {
            dbType = "O"
        }
        let newHolID = uniqid()
        connection.promise().query('INSERT INTO `ETT_HOLIDAY` VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [newHolID, 'CBP', dbLocation, holidayDate, dbType, holidayDescription, 'rnamboori', 'rnamboori', dateFormatter.format(new Date(), 'YYYY-MM-DD HH:mm:ss'), dateFormatter.format(new Date(), 'YYYY-MM-DD HH:mm:ss')])
            .then(([results, fields]) => {
                let holidaysObj = {}
                let holidayObj = {}
                holidayObj = {
                    "id": newHolID,
                    "location": holidayLocation,
                    "date": holidayDate,
                    "type": holidayType,
                    "description": holidayDescription
                }
                holidaysObj = {
                    "Holiday": holidayObj,
                    "message": "Holiday created successfully",
                    "code": 201
                }
                res.status(201).send(holidaysObj)
            })
            .catch((error) => {
                let errorMessage, errorStatus
                if (error.code === "ECONNREFUSED" || error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ER_SERVER_SHUTDOWN") {
                    errorMessage = "Unable to connect to the database"
                    errorStatus = 500
                } else if (error.code === 'ER_DUP_ENTRY') {
                    errorMessage = "Duplicate found"
                    errorStatus = 200
                }
                let errorObj = {
                    "errormessage": errorMessage,
                    "errorcode": errorStatus
                }
                res.status(errorStatus).send(errorObj)
            })
    } catch (error) {
        let errorMessage, errorCode
        if (error === "emptyfields") {
            errorMessage = "All fields are required"
            errorCode = 200
        } else if (error === "invaliddate") {
            errorMessage = "Date is invalid"
            errorCode = 403
        } else if (error === "wrongaccept") {
            errorMessage = "Accept header not supported"
            errorCode = 415
        }
        else {
            errorMessage = "Content-Type header not supported"
            errorCode = 415
        }
        res.status(errorCode).send({
            "errormessage": errorMessage,
            "errorcode": errorCode
        })
    }
})

//Delete One Holiday
app.delete('/holiday/:id', function (req, res) {
    let holidayID = req.params.id
    try {
        connection.promise().query('DELETE FROM `ETT_HOLIDAY` WHERE `HOLIDAY_ID` = ?', [holidayID])
            .then(([results, fields]) => {
                res.status(200).send({
                    "message": "Deleted holiday with ID: " + holidayID,
                    "code": 200
                })
            })
            .catch((error) => {
                res.status(500).send({
                    "errormessage": "Unable to connect to the database",
                    "errorcode": 500
                })
            })
    } catch (error) {
        console.log("Error happpening in the try/catch.");
    }
})

//Update One Holiday
app.put('/holiday/:id', function (req, res) {
    try {
        let holidayID = req.params.id
        let holidayLocation = req.body.location
        let holidayDate = req.body.date
        let holidayType = req.body.type
        let holidayDescription = req.body.description
        let dbLocation, dbType
        if ((req.body.location === '') || (req.body.date === '') || (req.body.type === '') || (req.body.description === '')) {
            throw "emptyfields"
        } else if ((req.get('Content-Type') != ('application/json'))) {
            throw "wrongcontenttype"
        } else if ((req.get('Accept') != ('application/json'))) {
            throw "wrongaccept"
        } else if (dateFormatter.isValid(holidayDate, 'YYYY-MM-DD') === false) {
            throw "invaliddate"
        }

        if (holidayLocation === "All Locations") {
            dbLocation = "ALL"
        } else if (holidayLocation === "Bettendorf, IA") {
            dbLocation = "USA"
        } else {
            dbLocation = "IND"
        }
        if (holidayType === "Fixed") {
            dbType = "F"
        } else {
            dbType = "O"
        }
        connection.promise().query('UPDATE `ETT_HOLIDAY` SET `LOC_CD` = ?, `HOLIDAY` = ?, `HOLIDAY_TYPE` = ?, `HOLIDAY_DESC` = ?, `UPD_BY_TS` = ? WHERE `HOLIDAY_ID` = ?', [dbLocation, holidayDate, dbType, holidayDescription, dateFormatter.format(new Date(), 'YYYY-MM-DD HH:mm:ss'), holidayID])
            .then(([results, fields]) => {
                let holidaysObj = {}
                let holidayObj = {}
                holidayObj = {
                    "id": holidayID,
                    "location": holidayLocation,
                    "date": holidayDate,
                    "type": holidayType,
                    "description": holidayDescription
                }
                holidaysObj = {
                    "Holiday": holidayObj,
                    "message": "Holiday updated successfully",
                    "code": 200
                }
                res.status(200).send(holidaysObj)
            })
            .catch((error) => {
                let errorMessage, errorStatus
                if (error.code === "ECONNREFUSED" || error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ER_SERVER_SHUTDOWN") {
                    errorMessage = "Unable to connect to the database"
                    errorStatus = 500
                } else {
                    errorMessage = "Duplicate found"
                    errorStatus = 406
                }
                let errObj = {
                    "errormessage": errorMessage,
                    "errorcode": errorStatus
                }
                res.status(errorStatus).send(errObj)
            })
    } catch (error) {
        let errorMessage, errorCode
        if (error === "emptyfields") {
            errorMessage = "All fields are required"
            errorCode = 200
        } else if (error === "invaliddate") {
            errorMessage = "Date is invalid"
            errorCode = 403
        } else if (error === "wrongaccept") {
            errorMessage = "Accept header not supported"
            errorCode = 415
        }
        else {
            errorMessage = "Content-Type header not supported"
            errorCode = 415
        }
        res.status(errorCode).send({
            "errormessage": errorMessage,
            "errorcode": errorCode
        })
    }
})

//Error Handling for Unknown Resource
app.use((req, res, next) => {
    res.status(404).send({
        "errormessage": "Resource not found",
        "errorcode": 404
    })
})

//Listening on Port
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT + '.')
})

//Transforming and Objectifying Holidays
function objectifyHolidays(holidaysArray) {
    let holidaysP = holidaysArray
    let holidayObj = {}
    let holidays = []
    let holidaysObj = {}
    holidaysP.forEach((holiday) => {
        if (holiday.HOLIDAY_TYPE === "F") {
            holiday.HOLIDAY_TYPE = "Fixed"
        } else {
            holiday.HOLIDAY_TYPE = "Optional"
        }
        if (holiday.LOC_CD === "ALL") {
            holiday.LOC_CD = "All Locations"
        } else if (holiday.LOC_CD === "USA") {
            holiday.LOC_CD = "Bettendorf, IA"
        } else {
            holiday.LOC_CD = "India"
        }
        holiday.HOLIDAY = dateFormatter.format(holiday.HOLIDAY, 'YYYY-MM-DD')
        holidayObj = {
            "id": holiday.HOLIDAY_ID,
            "location": holiday.LOC_CD,
            "date": holiday.HOLIDAY,
            "type": holiday.HOLIDAY_TYPE,
            "description": holiday.HOLIDAY_DESC
        }
        holidays.push(holidayObj)
    })
    holidaysObj = {
        "Holidays": holidays,
        "message": "Holidays retreived successfully",
        "code": 200
    }
    return holidaysObj
}