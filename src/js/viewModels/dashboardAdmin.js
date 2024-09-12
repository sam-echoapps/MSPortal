define(['ojs/ojcore',"knockout", 'ojs/ojcontext', "jquery","appController","ojs/ojconverterutils-i18n", 
    "ojs/ojarraydataprovider",
    "ojs/ojtable", "ojs/ojbutton", "ojs/ojcheckboxset", "ojs/ojgauge", "ojs/ojchart","ojs/ojdatetimepicker",
    "ojs/ojlistview", "ojs/ojfilmstrip","ojs/ojlistitemlayout", "ojs/ojswitch", "ojs/ojbutton","ojs/ojgauge"], 
function (oj,ko,Context,$, app, ojconverterutils_i18n_1, ArrayDataProvider) {
    
    class dasboardAdminfViewModel {
        constructor(args) {
            var self = this;

            self.router = args.parentRouter;
            let BaseURL = sessionStorage.getItem("BaseURL")

            const date=new Date()
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
            self.currentDate=`${daysOfWeek[date.getDay()]} ${day}/${month}/${date.getFullYear()}`
            
            self.currentTime=ko.observable()
            self.liveShowTime=ko.observable()
            
            self.breakStartTime=ko.observable()
            self.breakInterval=ko.observable();
            self.running=ko.observable(false)

            self.userName=ko.observable(sessionStorage.getItem("userName"))
            self.clockInTime=ko.observable(0)
            self.checkIn=ko.observable(false);

            self.clockInBtnDisabled=ko.observable(false)
            self.clockOutBtnDisabled=ko.observable(true)
            self.breakStartBtnDisable=ko.observable(false)
            self.breakStopBtnDisable=ko.observable(true)
            self.breakTime=ko.observable(0)

            self.employeClockinData = ko.observableArray([]);
            self.workingTimePattern=ko.observable()
            self.totalLeaves=ko.observable(0);
            self.leavesTaken=ko.observable(0);
            self.leavesRemaining=ko.observable(0);

            self.holidays = ko.observableArray([]);
            self.absentEmployees = ko.observableArray([]);
            self.employeeLeaveRequest = ko.observableArray([]);

            self.getCurrentTime=()=>{
                var now = new Date()
                var hours = now.getHours();
                var minutes = now.getMinutes();
                var seconds = now.getSeconds();
                self.currentTime(`${hours}:${minutes}:${seconds}`)
                var ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; 
                minutes = minutes < 10 ? '0' + minutes : minutes;
                seconds = seconds < 10 ? '0' + seconds : seconds;
                var timeString = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
                self.liveShowTime(timeString)
            }
            setInterval(function(){
                self.getCurrentTime()
            },1000)
            
            self.getTime=(seconds)=>{
                const workingHour=Math.floor(seconds/3600)
                const workingMinutes=Math.floor((seconds%3600)/60)
                const remainingSeconds = seconds % 60;
                
                return `${workingHour}:${workingMinutes}:${remainingSeconds}`
            }

            self.convertTo12HourFormat=(time)=> {
                let [hours, minutes] = time.split(':');
                hours = parseInt(hours);
                const suffix = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12;  // Convert 0 to 12 for midnight/noon
                return `${hours}:${minutes} ${suffix}`;
            }

            self.getWorkingPattern=()=>{
                $.ajax({
                    url: BaseURL + "/getEmployeeWorkingPattern",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId: sessionStorage.getItem("userId")
                    }),
                    contentType: 'application/json',
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInterval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        console.log(data);
                        if(data.length!=0){
                            let startTime=data[0].start_time
                            let finishTime=data[0].finish_time
                            startTime=self.convertTo12HourFormat(startTime)
                            finishTime=self.convertTo12HourFormat(finishTime)
                            self.workingTimePattern(`${startTime} to ${finishTime}`)
                        }
                    }
                });
            }

            self.getEmployeeClockinData=()=>{
                self.employeClockinData([]);
                $.ajax({
                    url: BaseURL + "/getCurrentDayEmployeeClockinDetail",
                    type: 'GET',
                    contentType: 'application/json',
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInterval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                        document.getElementById('loaderView').style.display = 'none';
                    },
                    success: function (data) {
                        if (data.length != 0) { 
                            for (var i = 0; i < data.length; i++) {
                                let clockInStatus=data[i][4] 
                                let breakStatus = data[i][5];   
                                if (clockInStatus=="clockIn"){
                                    clockInStatus="Done"
                                }
                                else if(clockInStatus=="clockOut"){
                                    clockInStatus="Clocked Out"
                                }
                                if(breakStatus=="break"){
                                    clockInStatus="Break"
                                }
                                self.employeClockinData.push({
                                    id: data[i][0], 
                                    name: `${data[i][1]} ${data[i][2]}`, 
                                    email: data[i][3],
                                    status: clockInStatus
                                })
                                if(data[i][0]==sessionStorage.getItem("userId")){
                                    let userName = `${data[i][1]} ${data[i][2]}`
                                    userName = userName.charAt(0).toUpperCase() + userName.slice(1)
                                    self.userName(userName)
                                }
                            }
                        }
                    }
                });
            }
            
            self.employeClockinDataProvider = new ArrayDataProvider(self.employeClockinData, {
                keyAttributes: 'id'
            }); 

            self.checkEmployeClockedIn=async ()=>{
                let totalBreakTime = await self.getTotalBreakTime()
                const timeParts = totalBreakTime.split(':'); 
                const hours = parseInt(timeParts[0], 10);
                const minutes = parseInt(timeParts[1], 10);
                const seconds = parseInt(timeParts[2], 10);
                const elapsedTime = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);
                self.breakTime(elapsedTime)
                $.ajax({
                    url: BaseURL + "/checkEmployeeClockedIn",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId: sessionStorage.getItem("userId")
                    }),
                    contentType: 'application/json',
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInterval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        console.log(data);
                        
                        if(data[0]==1 && data[1]=="clockIn"){
                            self.clockInBtnDisabled(true);
                            if(self.running()){
                                self.clockOutBtnDisabled(true);
                                self.breakStartBtnDisable(true)
                                self.breakStopBtnDisable(false)
                            }
                            else{
                                self.clockOutBtnDisabled(false);
                                self.breakStartBtnDisable(false)
                                self.breakStopBtnDisable(true)
                            }
                            self.checkIn(true)
                            document.getElementById('clockIn').style.backgroundColor = '#6c5ffca8';
                            document.getElementById('clockOut').style.backgroundColor = '#ff3a29';
                        } 
                        else if(data[0]==1 && data[1]=="clockOut"){
                            self.clockInBtnDisabled(true);
                            self.clockOutBtnDisabled(true);
                            self.breakStartBtnDisable(true)
                            self.breakStopBtnDisable(true)
                            self.checkIn(false)
                            document.getElementById('clockOut').style.backgroundColor = '#ff3a29bd';
                            document.getElementById('clockIn').style.backgroundColor = '#6c5ffca8';
                        }
                        else {
                            self.clockInBtnDisabled(false);
                            self.clockOutBtnDisabled(true);
                            self.breakStartBtnDisable(true)
                            self.breakStopBtnDisable(true)
                            self.checkIn(false)
                            document.getElementById('clockOut').style.backgroundColor = '#ff3a29bd';
                            document.getElementById('clockIn').style.backgroundColor = '#3524ff';
                        }
                        console.log(self.clockInBtnDisabled());
                    }
                });
            }

            self.getLocation=()=>{
                return new Promise((resolve, reject) => {
                    if ("geolocation" in navigator) {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                                function (position) {
                                    const latitude = position.coords.latitude;
                                    const longitude = position.coords.longitude;

                                    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

                                    fetch(url)
                                        .then(response => response.json())
                                        .then(data => {
                                            let location = "";
                                            if (data && data.address) {
                                                const address = data.address;
                                                location = `City: ${address.city || address.town || address.village}, State: ${address.state}, Country: ${address.country}`
                                            
                                            } else {
                                                console.log('No address found for the given coordinates.');
                                            }
                                            console.log(location);
                                            console.log(longitude);
                                            console.log(latitude);

                                            resolve([location, longitude, latitude]);
                                        })
                                        .catch(error => {
                                            console.error('Error fetching data:', error);
                                            resolve(["Unknown location", null, null]);
                                        });
                                },
                                function (error) {
                                    console.error(`Geolocation Error: ${error.message}`);
                                    resolve(["Unknown location", null, null]);
                                },
                                {
                                    enableHighAccuracy: true,
                                    timeout: 5000, 
                                    maximumAge: 0 
                                }
                            );
                        }
                        else {
                            console.log("Geolocation is not supported");
                            reject(new Error("Geolocation not supported"));
                            resolve(["Unknown location", null, null]);
                        }
                    }
                });
            }

            self.clockInAction=async (e)=>{
                let location = "Location not available";
                let longitude = "";
                let latitude = "";
                try {
                    [location, longitude, latitude] = await self.getLocation();
                } catch (error) {
                    console.warn("Failed to fetch location data:", error);
                }
                var now=new Date
                var hours = now.getHours();
                var minutes = now.getMinutes();
                var seconds = now.getSeconds();
                self.clockInTime(`${hours}:${minutes}:${seconds}`) 

                document.getElementById('clockIn').style.backgroundColor = '#6c5ffca8';
                document.getElementById('clockOut').style.backgroundColor = '#ff3a29';
                self.clockInBtnDisabled(true)
                document.getElementById('clockIn').style.backgroundColor = '#6c5ffca8';
                self.clockOutBtnDisabled(false)
                self.breakStartBtnDisable(false)
                self.breakStopBtnDisable(true)
                self.checkIn(true)
               
                $.ajax({
                    url: BaseURL + "/ClockinActivity",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId: sessionStorage.getItem("userId"),
                        clockinTime: `${hours}:${minutes}:${seconds}`,
                        clockinLocation: location,
                        clockinLongitude: longitude,
                        clockinLatitude: latitude,
                        clockInStatus: "clockIn"
                    }),
                    contentType: 'application/json',
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInterval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        console.log(data);
                        self.getEmployeeClockinData()
                    }
                });          
            }

            self.clockOutAction=()=>{
                let popup = document.getElementById('clockOutPopup');
                popup.open();
            }

            self.confirmClockOut=async ()=>{
                let location = "Location not available";
                let longitude = "";
                let latitude = "";
                try {
                    [location, longitude, latitude] = await self.getLocation();
                } catch (error) {
                    console.warn("Failed to fetch location data:", error);
                }

                let totalBreakTime=0
                try{
                    totalBreakTime=await self.getTotalBreakTime();
                } catch (error){
                    console.warn("Failed to fetch Total Breaktime:", error);
                }
                
                
                var now=new Date
                var hours = now.getHours();
                var minutes = now.getMinutes();
                var seconds = now.getSeconds();
                
                document.getElementById('clockOut').style.backgroundColor = '#ff3a29bd';
                document.getElementById('clockIn').style.backgroundColor = '#3524ff';
                self.clockInBtnDisabled(true)
                document.getElementById('clockIn').style.backgroundColor = '#6c5ffca8';
                self.clockOutBtnDisabled(true)
                self.breakStartBtnDisable(true)
                self.breakStopBtnDisable(true)
                self.checkIn(false);
                $.ajax({
                    url: BaseURL + "/ClockoutActivity",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId: sessionStorage.getItem("userId"),
                        clockOutTime: `${hours}:${minutes}:${seconds}`,
                        clockOutLocation: location,
                        clockOutLongitude: longitude,
                        clockOutLatitude: latitude,
                        totalBreakTime: totalBreakTime,
                        clockOutStatus: "clockOut"
                    }),
                    contentType: 'application/json',
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInterval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        console.log(data);
                        self.getEmployeeClockinData()
                        self.cancelClockOut();
                    }
                });
            }

            self.cancelClockOut=()=>{
                let popup = document.getElementById('clockOutPopup');
                popup.close();
            }

            self.getTotalBreakTime=()=>{
                return new Promise((resolve, reject) => {
                    $.ajax({
                        url: BaseURL + "/getTotalBreakTime",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId: sessionStorage.getItem("userId")
                        }),
                        contentType: 'application/json',
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            if(data.length!=0){
                                const parts = data[0].break_time.split(':');
                                const hours = parts[0].padStart(2, '0');
                                const minutes = parts[1].padStart(2, '0');
                                const seconds = parts[2].padStart(2, '0');
                                resolve(`${hours}:${minutes}:${seconds}`)
                            }
                        }
                    });
                })
            }

            self.thresholdValues = [
                { max: 900000, color: 'green' }, 
                { max: 1800000, color: 'orange' }, 
                { max: 3600000, color: '#c73226' }
            ];

            self.runBreakTime=()=>{
                const now = new Date();
                const elapsedTime = now - self.breakStartTime(); 
                // self.breakTime(elapsedTime)
                if (elapsedTime <= 3600000) {
                    self.breakTime(elapsedTime);
                    
                    if (elapsedTime > 900000 && elapsedTime <= 1800000) {
                        self.thresholdValues([
                            { max: 1800000, color: 'orange' },
                            { max: 3600000, color: '#c73226' }
                        ]);
                    } else if (elapsedTime > 1800000) {
                        self.thresholdValues([
                            { max: 3600000, color: '#c73226' }
                        ]);
                    }
                }
            }

            self.formattedBreakTime = ko.computed(() => {
                const elapsedTime = self.breakTime();
                const seconds = Math.floor((elapsedTime / 1000) % 60);
                const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
                const hours = Math.floor((elapsedTime / 1000 / 60 / 60) % 24);

                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            });

            self.startBreak=async ()=>{
                if (!self.running()) {
                    self.breakStartTime(new Date);
                    self.breakInterval(setInterval(self.runBreakTime, 1000)); 
                    self.running(true);
                    self.clockOutBtnDisabled(true)
                    self.breakStartBtnDisable(true)
                    self.breakStopBtnDisable(false)
                    var now=new Date
                    var hours = now.getHours();
                    var minutes = now.getMinutes();
                    var seconds = now.getSeconds();

                    $.ajax({
                        url: BaseURL + "/addBreakInDetails",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId: sessionStorage.getItem("userId"),
                            breakInTime: `${hours}:${minutes}:${seconds}`,
                            breakStatus: "break"
                        }),
                        contentType: 'application/json',
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            console.log(data);
                            self.getEmployeeClockinData()
                        }
                    });
                }
            }

            self.stopBreak=async ()=>{
                if (self.running()) {
                    clearInterval(self.breakInterval());  
                    self.running(false);
                    self.clockOutBtnDisabled(false);
                    self.breakStartBtnDisable(false)
                    self.breakStopBtnDisable(true); 
                    self.checkEmployeClockedIn();             
                    var now=new Date
                    var hours = now.getHours();
                    var minutes = now.getMinutes();
                    var seconds = now.getSeconds();

                    $.ajax({
                        url: BaseURL + "/addBreakOutDetails",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId: sessionStorage.getItem("userId"),
                            breakOutTime: `${hours}:${minutes}:${seconds}`,
                            breakStatus: "breakOut"
                        }),
                        contentType: 'application/json',
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: async function (data) {
                            console.log(data); 
                            let totalBreakTime = await self.getTotalBreakTime()
                            const timeParts = totalBreakTime.split(':'); 
                            const hours = parseInt(timeParts[0], 10);
                            const minutes = parseInt(timeParts[1], 10);
                            const seconds = parseInt(timeParts[2], 10);
                            const elapsedTime = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);
                            self.breakTime(elapsedTime)
                            self.getEmployeeClockinData()   
                        }
                    });
                }
            }

            self.getBreakDetails=()=>{
                $.ajax({
                    url: BaseURL + "/getBreakDetails",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId: sessionStorage.getItem("userId")
                    }),
                    contentType: 'application/json',
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInterval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        if(data.length!=0){
                            for(let i=0;i<data.length;i++){
                                if(data[0].status=="break"){
                                    const timeString = data[i].breakin_time;
                                    const now = new Date();
                                    const [hours, minutes, seconds] = timeString.split(':').map(Number);
                                    now.setHours(hours);
                                    now.setMinutes(minutes);
                                    now.setSeconds(seconds);
                                    now.setMilliseconds(0);
                                    console.log(now);
                                    
                                    self.breakStartTime(now)
                                    self.breakInterval(setInterval(self.runBreakTime, 10)); 
                                    self.running(true);
                                    self.breakStartBtnDisable(true)
                                    self.breakStopBtnDisable(false)
                                }
                            }
                        }
                    }
                });
            }
            
            self.getLeaveDetails=()=>{
                $.ajax({
                    url: BaseURL + "/getLeavesDetails",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId: sessionStorage.getItem("userId")
                    }),
                    contentType: 'application/json',
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInterval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        if (data.length != 0) { 
                            let totalLeaves=data[0][1]
                            let remainingLeaves=data[0][2]
                            let leavesTaken=totalLeaves-remainingLeaves
                            self.totalLeaves(totalLeaves);
                            self.leavesTaken(leavesTaken);
                            self.leavesRemaining(remainingLeaves)
                        }
                    }
                });
            }

            self.changeLeaveBalance = ()=>{
                $.ajax({
                    url: BaseURL+"/HRModuleChangeLeaveBalance",
                    type: 'GET',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log("Error fetching :", textStatus); // Log any error
                    },
                    success: function (data) {
                        // console.log(data);
                    }
                })
            }

            self.applyLeave=()=>{
                self.router.go({path : 'leaves'});     
            }

            self.monthHolidays = ()=>{
                self.holidays([])
                $.ajax({
                    url: BaseURL+"/getCurrentMonthHolidays",
                    type: 'GET',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log("Error fetching :", textStatus); // Log any error
                    },
                    success: function (data) {                  
                        if (data.length != 0) { 
                            for (var i = 0; i < data.length; i++) {
                                self.holidays.push({
                                    id: i,
                                    holiday_name: data[i][0],
                                    holiday_date: data[i][1],
                                    holiday_day: data[i][2].slice(0,3)
                                })
                            }
                        }
                    }
                })
            }

            self.holidayListDataProvider = new ArrayDataProvider(self.holidays, {
                keyAttributes: "id",
            });

            
            self.getAbsentEmployees = ()=>{
                self.absentEmployees([])
                $.ajax({
                    url: BaseURL+"/getAbsentEmployess",
                    type: 'GET',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log("Error fetching :", textStatus); // Log any error
                    },
                    success: function (data) { 
                        if (data.length != 0) { 
                            for (var i = 0; i < data.length; i++) {
                                self.absentEmployees.push({
                                    id: data[i][0],
                                    name: `${data[i][1]} ${data[i][2]}`,
                                    department: data[i][3],
                                    day: data[i][4]
                                })
                            }
                        }
                    }
                })
            }

            self.absentEmployeeListDataProvider = new ArrayDataProvider(self.absentEmployees, {
                keyAttributes: "id",
            });
            
            
            self.getEmployeeLeaveRequests = ()=>{
                self.employeeLeaveRequest([])
                $.ajax({
                    url: BaseURL+"/getEmployeeLeaveRequests",
                    type: 'GET',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log("Error fetching :", textStatus); // Log any error
                    },
                    success: function (data) {
                        if (data.length != 0) { 
                            for (var i = 0; i < data.length; i++) {
                                self.employeeLeaveRequest.push({
                                    slNo: i+1,
                                    id: data[i][0],
                                    name: `${data[i][1]} ${data[i][2]}`,
                                    startDate: data[i][3],
                                    reason: data[i][5],
                                    leaveType: data[i][7],
                                    days: data[i][6],
                                    status: data[i][8]
                                })
                            }
                        }
                    }
                })
            }

            self.employeeLeaveRequestDataProvider = new ArrayDataProvider(self.employeeLeaveRequest, {
                keyAttributes: "id",
            });

            self.leaveReject=(e,row)=>{
                const requestId=row.data.id;
                $.ajax({
                    url: BaseURL+"/HRModuleReviewLeaveStatus2",
                    type: 'POST',
                    data: JSON.stringify({
                        leaveId : requestId,
                        status : "Reject",
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        console.log(data);
                        self.getEmployeeLeaveRequests()
                    }
                })
            }

            self.leaveAccept=(e,row)=>{
                const requestId=row.data.id;
                $.ajax({
                    url: BaseURL+"/HRModuleReviewLeaveStatus2",
                    type: 'POST',
                    data: JSON.stringify({
                        leaveId : requestId,
                        status : "Approve",
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        console.log(data);
                        self.getEmployeeLeaveRequests()
                    }
                })
            }

            self.rewriteUrl=(url)=> {
                if (url.includes('/Hr')) {
                    return url;
                }
                const cssRegex = /\/css\//g;
                const jsRegex = /\/js\//g;
                const imgRegex = /\/img\//g;
                const backImgregex = /url\((['"]?)(\.\.\/\.\.\/css\/|\.\.\/css\/|\/css\/)(.*?)(['"]?)\)/g;
                const baseUrl = 'https://uanglobal.com/';
                if (url.startsWith(baseUrl)||url.startsWith('..')){
                    if (cssRegex.test(url)){
                            url = url.replace(cssRegex, '/Hr/css/');
                            return url;
                    } else if (jsRegex.test(url)) {
                            url = url.replace(jsRegex, '/Hr/js/');
                            return url;
                    } else if (imgRegex.test(url)) {
                            url = url.replace(imgRegex, '/Hr/img/');
                            return url;
                    }
                }
                return url;
            }

            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({ path: 'signin' });
                }
                else {
                    self.checkEmployeClockedIn();
                    self.getEmployeeClockinData();
                    self.getBreakDetails();
                    self.getWorkingPattern();
                    self.getLeaveDetails();
                    self.changeLeaveBalance();
                    self.monthHolidays();
                    self.getAbsentEmployees();
                    self.getEmployeeLeaveRequests();
                    app.onAppSuccess();

                    if(window.location.pathname=='/Hr'){
                        document.querySelectorAll('link').forEach(function(link){
                                const baseUrl = 'https://uanglobal.com/';
                                if (link.href.startsWith(baseUrl) && !link.href.includes("redwood.css")){
                                    link.href = self.rewriteUrl(link.href);
                                }
                        });
                        document.querySelectorAll('script').forEach(function(script) {
                                script.src = self.rewriteUrl(script.src);
                        });
                        document.querySelectorAll('img').forEach(function(img) {
                                img.src = self.rewriteUrl(img.src);
                        });
                        document.querySelectorAll('oj-avatar').forEach(function(avatar) {
                                const currentSrc = avatar.getAttribute('src');
                                const newSrc = self.rewriteUrl(currentSrc);
                                avatar.setAttribute('src', newSrc);
                        });
                    }
                    
                }
            };
            
        }
        getItemInitialDisplay(index) {
            return index < 1 ? "" : "none";
        }
    }
    return  dasboardAdminfViewModel;
});