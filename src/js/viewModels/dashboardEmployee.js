define(['ojs/ojcore',"knockout", 'ojs/ojcontext', "jquery","appController","ojs/ojconverterutils-i18n", 
    "ojs/ojarraydataprovider",
    "ojs/ojtable", "ojs/ojbutton", "ojs/ojcheckboxset", "ojs/ojgauge", "ojs/ojchart","ojs/ojdatetimepicker",
    "ojs/ojlistview", "ojs/ojfilmstrip","ojs/ojlistitemlayout", "ojs/ojswitch", "ojs/ojbutton","ojs/ojactioncard"], 
function (oj,ko,Context,$, app, ojconverterutils_i18n_1, ArrayDataProvider) {
    
    class dasboardEmployeeViewModel {
        constructor(args) {
            var self = this;

            self.router = args.parentRouter;
            let BaseURL = sessionStorage.getItem("BaseURL")

            var routerLength = args.parentRouter._routes.length;
          
            if(routerLength!=17){
                location.reload();
            }

            self.connected = function () {
                if (sessionStorage.getItem("userName") == null) {
                    self.router.go({ path: 'signin' });
                }
                else {
                    self.getEmployeeClockinData();
                    self.checkEmployeClockedIn();
                    self.getLeaveDetails();
                    self.changeLeaveBalance();
                    self.monthHolidays();
                    self.getAbsentEmployees();
                    app.onAppSuccess();
                }
            };
            
            const date=new Date()
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
            self.currentDate=`${daysOfWeek[date.getDay()]} ${day}/${month}/${date.getFullYear()}`
            
            self.userName=ko.observable(sessionStorage.getItem("userName"))
            self.clockInTime=ko.observable(0)
            self.checkIn=ko.observable(false);

            self.clockInBtnDisabled=ko.observable(false)
            self.clockOutBtnDisabled=ko.observable(true)
            
            self.checkEmployeClockedIn=()=>{
                $.ajax({
                    url: BaseURL + "/checkEmployeeClockedIn",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId: sessionStorage.getItem("staffId")
                    }),
                    contentType: 'application/json',
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInterval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        if(data==1){
                            self.clockInBtnDisabled(true);
                            self.clockOutBtnDisabled(false);
                            self.checkIn(true)
                            document.getElementById('clockIn').style.backgroundColor = '#6c5ffca8';
                            document.getElementById('clockOut').style.backgroundColor = '#ff3a29';
                        } 
                        else {
                            self.clockInBtnDisabled(false);
                            self.clockOutBtnDisabled(true);
                            self.checkIn(false)
                            document.getElementById('clockOut').style.backgroundColor = '#ff3a29bd';
                            document.getElementById('clockIn').style.backgroundColor = '#3524ff';
                        }
                    }
                });
            }

            self.clockInAction=(e)=>{
                let location=""
                let latitude=""
                let longitude=""
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        latitude = position.coords.latitude;
                        longitude = position.coords.longitude;
                        // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

                        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data && data.address) {
                                    const address = data.address;
                                    location = `City: ${address.city || address.town || address.village}, State: ${address.state}, Country: ${address.country}`
                                    
                                } else {
                                    console.log('No address found for the given coordinates.');
                                }

                                var now=new Date
                                var hours = now.getHours();
                                var minutes = now.getMinutes();
                                var seconds = now.getSeconds();
                                self.clockInTime(`${hours}:${minutes}:${seconds}`) 

                                document.getElementById('clockIn').style.backgroundColor = '#6c5ffca8';
                                document.getElementById('clockOut').style.backgroundColor = '#ff3a29';
                                self.clockInBtnDisabled(true)
                                self.clockOutBtnDisabled(false)
                                self.checkIn(true)

                                $.ajax({
                                    url: BaseURL + "/ClockinActivity",
                                    type: 'POST',
                                    data: JSON.stringify({
                                        staffId: sessionStorage.getItem("staffId"),
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
                            })
                            .catch(error => console.error('Error fetching data:', error));
                    },
                    function (error) {
                        console.error(`Error: ${error.message}`);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000, 
                        maximumAge: 0 
                    });
                } 
                else {
                    console.log("Geolocation is not supported");
                }
            }

            self.clockOutAction=()=>{
                let popup = document.getElementById('clockOutPopup');
                popup.open();
            }

            self.confirmClockOut=()=>{
                let location=""
                let latitude=""
                let longitude=""
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        latitude = position.coords.latitude;
                        longitude = position.coords.longitude;

                        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                if (data && data.address) {
                                    const address = data.address;
                                    location = `City: ${address.city || address.town || address.village}, State: ${address.state}, Country: ${address.country}`
                                    
                                } else {
                                    console.log('No address found for the given coordinates.');
                                }

                                var now=new Date
                                var hours = now.getHours();
                                var minutes = now.getMinutes();
                                var seconds = now.getSeconds();
                                
                                document.getElementById('clockOut').style.backgroundColor = '#ff3a29bd';
                                document.getElementById('clockIn').style.backgroundColor = '#3524ff';
                                self.clockInBtnDisabled(false)
                                self.clockOutBtnDisabled(true)
                                self.checkIn(false)
                    
                                $.ajax({
                                    url: BaseURL + "/ClockoutActivity",
                                    type: 'POST',
                                    data: JSON.stringify({
                                        staffId: sessionStorage.getItem("staffId"),
                                        clockOutTime: `${hours}:${minutes}:${seconds}`,
                                        clockOutLocation: location,
                                        clockOutLongitude: longitude,
                                        clockOutLatitude: latitude,
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
                            })
                        .catch(error => console.error('Error fetching data:', error));
                    },
                    function (error) {
                        console.error(`Error: ${error.message}`);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000, 
                        maximumAge: 0 
                    });
                }
            }

            self.cancelClockOut=()=>{
                let popup = document.getElementById('clockOutPopup');
                popup.close();
            }
            
            self.currentTime=ko.observable()
            self.liveShowTime=ko.observable()

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
            
            self.totalLeaves=ko.observable(0);
            self.leavesTaken=ko.observable(0);
            self.leavesRemaining=ko.observable(0)

            self.getLeaveDetails=()=>{
                $.ajax({
                    url: BaseURL + "/getLeavesDetails",
                    type: 'POST',
                    data: JSON.stringify({
                        staffId: sessionStorage.getItem("staffId")
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

            self.holidays = ko.observableArray([]);

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

            self.absentEmployees = ko.observableArray([]);
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
            
            self.getEmployeeClockinData=()=>{
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
           
        }
        getItemInitialDisplay(index) {
            return index < 1 ? "" : "none";
        }
    }
    return  dasboardEmployeeViewModel;
});
