define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", "ojs/ojlistdataproviderview", "ojs/ojdataprovider", "ojs/ojfilepickerutils", "ojs/ojconverterutils-i18n",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojselectcombobox","ojs/ojavatar","ojs/ojradioset","ojs/ojtable"], 
    function (oj,ko,$, app, ArrayDataProvider, ListDataProviderView, ojdataprovider_1, FilePickerUtils, ojconverterutils_i18n_1) {

        class leaves {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = sessionStorage.getItem("BaseURL")
                let userrole = sessionStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getCalenderLeaves();
                        self.getEventDates();
                        self.getStaff();
                        self.getMembers();
                        self.getHolidayDetails();

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
                }

                self.tabData = [
                    { id: "calender", label: "Calender" },
                    { id: "leave_requests", label: "Apply Leave" },
                    { id: "my_requests", label: "My Requests" },
                    { id: "leave_approval", label: "Employee Requests" },
                    { id: "leave_balance", label: "Leave Balance" },
                ];

                self.tabData1 = [
                    { id: "calender", label: "Calender" },
                    { id: "leave_requests", label: "Apply Leave" },
                    { id: "my_requests", label: "My Requests" },
                ];

                self.tabData2 = [
                    { id: "calender", label: "Calender" },
                    { id: "leave_requests", label: "Apply Leave" },
                    { id: "my_requests", label: "My Requests" },
                    { id: "leave_balance", label: "Leave Balance" },
                ];
                self.selectedTab = ko.observable("calender");

                self.selectedTabAction = ko.computed(() => { 
                    if(self.selectedTab() == 'calender'){
                        $("#calender").show();
                        $("#leave_requests").hide();
                        $("#leave_approval").hide();
                        $("#leave_balance").hide();
                        $("#my_requests").hide();
                    }
                    else if(self.selectedTab() == 'leave_requests'){
                        $("#calender").hide();
                        self.getLeaveType();
                        $("#leave_requests").show();
                        $("#leave_approval").hide();
                        $("#leave_balance").hide();
                        $("#my_requests").hide();
                    }
                    else if(self.selectedTab() == 'my_requests'){
                        $("#calender").hide();
                        $("#leave_requests").hide();
                        $("#leave_approval").hide();
                        $("#leave_balance").hide();
                        self.getLeaveBalance();
                        self.getMyLeaves();
                        $("#my_requests").show();
                    }
                    else if(self.selectedTab() == 'leave_approval'){
                        $("#calender").hide();
                        $("#leave_requests").hide();
                        self.getLeaves();
                        $("#leave_approval").show();
                        $("#leave_balance").hide();
                        $("#my_requests").hide();
                    }
                    else if(self.selectedTab() == 'leave_balance'){
                        $("#calender").hide();
                        $("#leave_requests").hide();
                        $("#leave_approval").hide();
                        self.getTeams();
                        self.changeLeaveBalance();
                        $("#leave_balance").show();
                        $("#my_requests").hide();
                    }
                });

                self._checkValidationGroup = (value) => {
                    const tracker = document.getElementById(value);
                    if (tracker.valid === "valid") {
                        return true;
                    }
                    else {
                        tracker.showMessages();
                        tracker.focusOn("@firstInvalidShown");
                        return false;
                    }
                };

                self.messageClose = ()=>{
                    location.reload();
                }

                self.date_value = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIso(new Date()).split('T')[0]);
                self.LeaveCalenderDet = ko.observableArray([]);

                self.getCalenderLeaves = () => {
                    console.log(self.date_value())
                    self.LeaveCalenderDet([]);
                    document.getElementById('loaderView').style.display = 'block';
                    document.getElementById('leave_requests').style.display = 'none';
                    document.getElementById('leave_approval').style.display = 'none';
                    document.getElementById('leave_balance').style.display = 'none';
                    document.getElementById('my_requests').style.display = 'none';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetEmployeeCalenderLeave",
                        type: 'POST',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({ 
                            date: self.date_value() 
                        }),
                        contentType: 'application/json',
                        error: function(xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function(result) {
                            console.log(result);
                            document.getElementById('loaderView').style.display = 'none';
                            document.getElementById('calender').style.display = 'block';
                            document.getElementById('leave_requests').style.display = 'none';
                            document.getElementById('leave_approval').style.display = 'none';
                            document.getElementById('leave_balance').style.display = 'none';
                            document.getElementById('my_requests').style.display = 'none';
                                
                            if (result.length != 0) {
                                for (var i = 0; i < result.length; i++) {
                                    self.LeaveCalenderDet.push({
                                        'no': i + 1,
                                        'id': result[i][0],
                                        'name': result[i][1],
                                        'leave_reason': result[i][2]
                                    });
                                }
                            }
                        }
                    });
                };
                
                self.CalenderLeave = new ArrayDataProvider(this.LeaveCalenderDet, { keyAttributes: "id"});

                self.HolidayCalenderDet = ko.observableArray([]);

                self.getHolidayDetails = () => {
                    self.HolidayCalenderDet([]);

                    $.ajax({
                        url: BaseURL + "/HRModuleGetHolidayDetails",
                        type: 'POST',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({ 
                            date: self.date_value() 
                        }),
                        contentType: 'application/json',
                        error: function(xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function(result) {
                            console.log(result);
                                
                            if (result.length != 0) {
                                for (var i = 0; i < result.length; i++) {
                                    self.HolidayCalenderDet.push({
                                        'no': i + 1,
                                        'id': result[i][0],
                                        'holiday': result[i][1],
                                        'holiday_date': result[i][2],
                                        'comments': result[i][3]
                                    });
                                }
                            }
                        }
                    });
                };
                
                self.HolidayLeave = new ArrayDataProvider(this.HolidayCalenderDet, { keyAttributes: "id"});

                self.date_value.subscribe(function(newDate) {
                    self.getCalenderLeaves();
                    self.getHolidayDetails();
                });

                self.eventDates = ko.observableArray([]);

                self.getEventDates = () => {
                    $.ajax({
                        url: BaseURL + "/HRModuleGetEventDates",
                        type: 'POST',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        contentType: 'application/json',
                        error: function(xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function(result) {
                            console.log(result);
                            if (result.length != 0) {
                                sessionStorage.setItem('availableDateData', JSON.stringify(result));
                            }
                        }
                    });
                };
                                           
                self.dayFormatter = ko.observable((dateInfo) => {
                    let month = dateInfo.month;
                    let date = dateInfo.date;
                    let fullYear = dateInfo.fullYear;
                    let availableDateList = JSON.parse(sessionStorage.getItem('availableDateData'));
                    console.log(availableDateList)
                    
                    if (availableDateList != null) {
                        for (let i = 0; i < availableDateList.length; i++) {
                            let da = new Date(availableDateList[i][0]);
                            let availableDay = da.getDate();
                            let availableMonth = da.getMonth() + 1; // Month value starts from 0 (January)
                            let availableYear = da.getFullYear();
                
                            if (month == availableMonth && date == availableDay && fullYear == availableYear) {
                                return {
                                    className: 'available-day',
                                    tooltip: 'Available Day'
                                };
                            }
                        }
                    }
                    
                    return null;
                });
                
                self.selectedSelectionMode = ko.observable('Self');
                self.selectionModeDP = ko.observableArray([]);
                
                self.selectionModeDP.push(
                    {"label":"Self","value":"Self"},
                    {"label":"For Staff","value":"For Staff"}
                );
                self.selectionModeDP = new ArrayDataProvider(self.selectionModeDP, {
                    keyAttributes: 'value'
                });

                self.staff = ko.observable();
                self.StaffDet = ko.observableArray([]);

                self.getStaff = ()=>{
                    $.ajax({
                        url: BaseURL+"/HRModuleGetStaff2",
                        type: 'POST',
                        data: JSON.stringify({
                            userId: sessionStorage.getItem("userId")
                        }),
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log("Error fetching Team Leader:", textStatus); // Log any error
                        },
                        success: function (data) {
                            //document.getElementById('leave_requests').style.display = 'block';
                            console.log(data);
                            if(data[0].length != 0){ 
                                for (var i = 0; i < data[0].length; i++) {
                                    self.StaffDet.push({'value': data[0][i][0],'label': data[0][i][1]});
                                }
                            } else {
                                console.log("No data received from backend."); // Log if no data is received
                            }
                        }
                    })
                }
                self.staff_List = new ArrayDataProvider(this.StaffDet, { keyAttributes: "value"});

                self.isForStaffSelected = ko.computed(() => {
                    return self.selectedSelectionMode() === 'For Staff';
                });

                self.isSelfSelected = ko.computed(() => {
                    return self.selectedSelectionMode() === 'Self';
                });

                self.start_date = ko.observable();
                self.end_date = ko.observable();
                // self.hour = ko.observable();
                self.leave_type = ko.observable();
                self.start_date = ko.observable();
                self.LeaveTypeDet = ko.observableArray([]);
                self.description = ko.observable('');

                self.getLeaveType = ()=>{
                    self.LeaveTypeDet([]);
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetLeaveType",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            console.log(data);
                            document.getElementById('loaderView').style.display='none';
                            if(data[0].length !=0){ 
                                for (var i = 0; i < data[0].length; i++) {
                                    self.LeaveTypeDet.push({"label": data[0][i][1],"value": data[0][i][0]});
                                }
                            }
                        }
                    })
                }
                self.LeaveList = new ArrayDataProvider(self.LeaveTypeDet, { keyAttributes: "value"});


                self.leave_reason = ko.observable();
                self.leaveReasonDet = ko.observableArray([]);
                
                self.leaveReasonDet.push(
                    {"label":"Morning half","value":"Morning half"},
                    {"label":"Evening half","value":"Evening half"},
                    {"label":"Full day","value":"Full day"},
                    //{"label":"Time off","value":"Time off"}
                );
                self.LeaveReasonList = new ArrayDataProvider(self.leaveReasonDet, {
                    keyAttributes: 'value'
                });

                // self.isForTimeOffSelected1 = () => {
                //     if (self.leave_reason() == 'Time off'){
                //         $('#hour_View1').show();
                //     }
                //     else if (self.leave_reason() != 'Time off'){
                //         $('#hour_View1').hide();
                //     }
                // }

                self.saveLeaveMsg = ko.observable('Error');

                self.formSubmit = () => {
                    const formValid = self._checkValidationGroup("formValidation2"); 
                    if (formValid) {
                        // if (self.leave_reason() === 'Time off' && !self.hour()) {
                        //     return;
                        // }
                
                        let popup = document.getElementById("loaderPopup");
                        popup.open();
                
                        $.ajax({
                            url: BaseURL + "/HRModuleAddLeave2",
                            type: 'POST',
                            data: JSON.stringify({
                                staffId: sessionStorage.getItem("userId"),
                                leave_type: self.leave_type(),
                                start_date: self.start_date(),
                                end_date: self.end_date(),
                                leave_reason: self.leave_reason(),
                                description: self.description(),
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                console.log(data);
                                if(data[0].length !=0){ 
                                    for (var i = 0; i < data[0].length; i++) {
                                        self.saveLeaveMsg(data[0][0]);
                                    }
                                }
                                let popup = document.getElementById("loaderPopup");
                                popup.close();
                                if (self.saveLeaveMsg() === "Successfully submitted the leave") {
                                    let popup1 = document.getElementById("successView");
                                    popup1.open();
                                } else {
                                    let popup2 = document.getElementById("successView3");
                                    popup2.open();
                                }
                            }
                        });
                    }
                };
                
                self.formSubmit2 = () => {
                    const formValid = self._checkValidationGroup("formValidation2");
                    if (formValid) {
                        if (!self.staff()) {
                            return;
                        }
                
                        // if (self.leave_reason() === 'Time off' && !self.hour()) {
                        //     return;
                        // }
                
                        let popup = document.getElementById("loaderPopup");
                        popup.open();
                
                        $.ajax({
                            url: BaseURL + "/HRModuleAddLeave2",
                            type: 'POST',
                            data: JSON.stringify({
                                staffId: self.staff(),
                                leave_type: self.leave_type(),
                                start_date: self.start_date(),
                                end_date: self.end_date(),
                                leave_reason: self.leave_reason(),
                                description: self.description(),
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                console.log(data);
                                if(data[0].length !=0){ 
                                    for (var i = 0; i < data[0].length; i++) {
                                        self.saveLeaveMsg(data[0][0]);
                                    }
                                }
                                let popup = document.getElementById("loaderPopup");
                                popup.close();
                                if (self.saveLeaveMsg() === "Successfully submitted the leave") {
                                    let popup1 = document.getElementById("successView");
                                    popup1.open();
                                } else {
                                    let popup2 = document.getElementById("successView3");
                                    popup2.open();
                                }
                            }
                        });
                    }
                };

                self.formSubmitStaff = () => {
                    const formValid = self._checkValidationGroup("formValidation2"); 
                    if (formValid) {
                        // if (self.leave_reason() === 'Time off' && !self.hour()) {
                        //     return;
                        // }
                
                        let popup = document.getElementById("loaderPopup");
                        popup.open();
                
                        $.ajax({
                            url: BaseURL + "/HRModuleAddLeave2",
                            type: 'POST',
                            data: JSON.stringify({
                                staffId: sessionStorage.getItem("userId"),
                                leave_type: self.leave_type(),
                                start_date: self.start_date(),
                                end_date: self.end_date(),
                                leave_reason: self.leave_reason(),
                                description: self.description(),
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                console.log(data);
                                if(data[0].length !=0){ 
                                    for (var i = 0; i < data[0].length; i++) {
                                        self.saveLeaveMsg(data[0][0]);
                                    }
                                }
                                let popup = document.getElementById("loaderPopup");
                                popup.close();
                                if (self.saveLeaveMsg() === "Successfully submitted the leave") {
                                    let popup1 = document.getElementById("successView");
                                    popup1.open();
                                } else {
                                    let popup2 = document.getElementById("successView3");
                                    popup2.open();
                                }
                            }
                        });
                    }
                };

                
                self.LeaveDet = ko.observableArray([]);
                self.LeaveYearDet = ko.observableArray([]);
                self.yearFilter = ko.observable('');

                self.getLeaves = () => {
                    self.LeaveDet([]);
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetEmployeeLeave2",
                        type: 'POST',
                        contentType: 'application/json', // Ensure the content type is set to JSON
                        data: JSON.stringify({
                            userId: sessionStorage.getItem("userId")
                        }),
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function(xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display='none';
                        },
                        success: function(result1) {
                            console.log(result1);
                            document.getElementById('loaderView').style.display = 'none';
                            document.getElementById('leave_approval').style.display = 'block';
                
                            if (result1[0].length != 0) {
                                for (var i = 0; i < result1[0].length; i++) {
                                    self.LeaveDet.push({
                                        'no': i + 1,
                                        'id': result1[0][i][0],
                                        'name': result1[0][i][6],
                                        'start_date': result1[0][i][1],
                                        'end_date': result1[0][i][2],
                                        'leave_type': result1[0][i][3],
                                        'leave_reason': result1[0][i][4],
                                        'status': result1[0][i][5]
                                    });
                                }
                            }

                            var j = 0;
                            if (result1[1].length != 0) {
                                self.LeaveYearDet([]);
                                for (j = 0; j < result1[1].length; j++) {
                                    self.LeaveYearDet.push({"label": result1[1][j][0], "value": result1[1][j][0]});
                                }
                                self.LeaveYearDet.unshift({ value: 'All', label: 'All' });
                            }
                        }
                    });
                };

                self.yearList = new ArrayDataProvider(this.LeaveYearDet, { keyAttributes: "value"});
                self.LeaveData = new ArrayDataProvider(this.LeaveDet, { keyAttributes: "id" });

                // self.filterYearCallCount = 0; // Initialize counter
                // // Debounce function to limit calls to filterYear
                // function debounce(func, wait) {
                //     let timeout;
                //     return function (...args) {
                //         const context = this;
                //         clearTimeout(timeout);
                //         timeout = setTimeout(() => func.apply(context, args), wait);
                //     };
                // }

                // self.filterYear = debounce(function () {
                //     self.LeaveDet([]);
                //     self.filterYearCallCount++; // Increment counter

                //     if (self.yearFilter() == '') {
                //         const currentYear = new Date().getFullYear();
                //         console.log(currentYear);
                //         self.yearFilter(currentYear);
                //     }
                //     if (self.yearFilter() != '') {
                //         if (self.filterYearCallCount <= 3) { // Clear only on first 3 calls
                //             self.LeaveDet([]);
                //         }
                //         document.getElementById('loaderView').style.display = 'block';
                //         $.ajax({
                //             url: BaseURL + "/HRModuleGetYearLeaveEmployeeFilter2",
                //             type: 'POST',
                //             data: JSON.stringify({
                //                 year: self.yearFilter(),
                //                 userId: sessionStorage.getItem("userId")
                //             }),
                //             dataType: 'json',
                //             timeout: sessionStorage.getItem("timeInetrval"),
                //             context: self,
                //             error: function(xhr, textStatus, errorThrown) {
                //                 if (textStatus == 'timeout' || textStatus == 'error') {
                //                     document.querySelector('#TimeoutSup').open();
                //                 }
                //             },
                //             success: function(result2) {
                //                 console.log(result2);
                //                 document.getElementById('loaderView').style.display = 'none';
                //                 document.getElementById('leave_approval').style.display = 'block';
                //                 self.LeaveDet([]);

                //                 if (result2.length != 0) {
                //                     if (self.filterYearCallCount <= 3) { // Clear only on first 3 calls
                //                         self.LeaveDet([]);
                //                     }

                //                     for (var i = 0; i <= result2.length; i++) {
                //                         self.LeaveDet.push({
                //                             'no': i + 1,
                //                             'id': result2[i][0],
                //                             'name': result2[i][6], // 'full_name' is now at the 7th position
                //                             'start_date': result2[i][1],
                //                             'end_date': result2[i][2],
                //                             'leave_type': result2[i][3],
                //                             'leave_reason': result2[i][4],
                //                             'status': result2[i][5]
                //                         });
                //                     }
                //                 }
                //             }
                //         });
                //     }
                // }, 10); // 1-second debounce delay
                
                // self.LeaveData = new ArrayDataProvider(this.LeaveDet, { keyAttributes: "id" });

                self.filter = ko.observable('');

                self.LeaveData = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filter() && this.filter() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filter() }
                        });
                    }
                    const arrayDataProvider = new ArrayDataProvider(self.LeaveDet, { 
                        keyAttributes: 'id',
                        sortComparators: {
                            comparators: new Map().set("dob", this.comparator),
                        },
                    });
                    
                    return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
                }, self);

                self.handleValue = () => {                
                    self.filter(document.getElementById('searchFilter2').rawValue);
                };
                  
                self.status = ko.observable();
                self.statusList = ko.observableArray([]);
                self.statusList.push(
                    {"label":"Pending","value":"Pending"},
                    {"label":"Rejected","value":"Reject"},
                    {"label":"Approved","value":"Approve"},
                );
                self.statusList = new ArrayDataProvider(self.statusList, {
                    keyAttributes: 'value'
                });
            
                self.CancelBehaviorOpt = ko.observable('icon');
                self.Name = ko.observable('');
                self.startDate = ko.observable('');
                self.endDate = ko.observable('');
                self.leaveType = ko.observable('');
                self.leave_reason = ko.observable('');
                //self.hour = ko.observable('');
                self.leaveId = ko.observable();
                self.description2 = ko.observable('');

                self.reviewLeave = (event, data) => {
                    var rowId = data.item.data.id;
                    self.leaveId(rowId);
                    document.querySelector('#openReviewLeave').open();
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetEmployeeLeaveInfo2",
                        type: 'POST',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            leaveId: rowId
                        }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (result3) {
                            console.log(result3);
                            if (result3[0].length != 0) {
                                document.getElementById('loaderView').style.display = 'none';
                                var data = JSON.parse(result3[0]);
                                console.log(data);
                                self.Name(data[0][1]);
                                self.startDate(data[0][2]);
                                self.endDate(data[0][3]);
                                self.leaveType(data[0][4]);
                                self.leave_reason(data[0][5]);
                                self.status(data[0][6]);
                                self.description2(data[0][7]);
                            }
                        }
                    });
                };

                self.deleteLeave = (event,data)=>{
                    var rowId = data.item.data.id
                    $.ajax({
                        url: BaseURL+"/HRModuleDeleteLeave",
                        type: 'POST',
                        data: JSON.stringify({
                           leaveId : rowId
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            location.reload()
                        }
                    })
                }
                
                self.formReviewSubmit = (event,data)=>{
                    const formValid = self._checkValidationGroup("formValidationReview"); 
                    if (formValid) {
                            let popup = document.getElementById("loaderPopup");
                            popup.open();
                            
                            $.ajax({
                                url: BaseURL+"/HRModuleReviewLeaveStatus2",
                                type: 'POST',
                                data: JSON.stringify({
                                    leaveId : self.leaveId(),
                                    status : self.status(),
                                }),
                                dataType: 'json',
                                timeout: sessionStorage.getItem("timeInetrval"),
                                context: self,
                                error: function (xhr, textStatus, errorThrown) {
                                    console.log(textStatus);
                                },
                                success: function (data) {
                                    document.querySelector('#openReviewLeave').close();
                                    let popup = document.getElementById("loaderPopup");
                                    popup.close();
                                    let popup2 = document.getElementById("successView2");
                                    popup2.open();
                                }
                            })
                        }
                }

                self.Member = ko.observable();
                self.MembersDet = ko.observableArray([]);

                self.getMembers = ()=>{
                    $.ajax({
                        url: BaseURL+"/HRModuleMembers",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log("Error fetching Member:", textStatus); // Log any error
                        },
                        success: function (data) {
                            //document.getElementById('leave_balance').style.display = 'block';
                            if(data[0].length != 0){ 
                                for (var i = 0; i < data[0].length; i++) {
                                    self.MembersDet.push({'id': data[0][i][0],'label': data[0][i][1]});
                                }
                            } else {
                                console.log("No data received from backend."); // Log if no data is received
                            }
                        }
                    })
                }
                self.Members_List = new ArrayDataProvider(this.MembersDet, { keyAttributes: "id"});

                self.LeaveDet2 = ko.observableArray([]);

                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const day = currentDate.getDate();

                self.fromDate = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date(year, 0, 1)));
                self.datePicker = {
                    numberOfMonths: 1
                };

                self.toDate = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date(year, month,day)));

                self.blob = ko.observable()
                self.fileName = ko.observable()

                self.getTeams = () => {
                    self.LeaveDet2([]); // Clear the existing data
                    document.getElementById('loaderView').style.display = 'block';
                    
                    $.ajax({
                        url: BaseURL + "/HRModuleGetLeaveData",
                        type: 'POST',
                        data: JSON.stringify({
                            userId: sessionStorage.getItem("userId")
                        }),
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            console.log(data);
                            document.getElementById('loaderView').style.display = 'none';
                            var csvContent = '';
                            var headers = ['ID', 'Name', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total Leave', 'Remaining'];
                
                            // Add headers to CSV content
                            csvContent += headers.join(',') + '\n';
                
                            if (data[0].length != 0) {
                                for (var i = 0; i < data[0].length; i++) {
                                    self.LeaveDet2.push({
                                        'id': data[0][i][0],
                                        'name': data[0][i][1],
                                        'jan': data[0][i][4],
                                        'feb': data[0][i][5],
                                        'mar': data[0][i][6],
                                        'apr': data[0][i][7],
                                        'may': data[0][i][8],
                                        'jun': data[0][i][9],
                                        'jul': data[0][i][10],
                                        'aug': data[0][i][11],
                                        'sep': data[0][i][12],
                                        'oct': data[0][i][13],
                                        'nov': data[0][i][14],
                                        'dec': data[0][i][15],
                                        'total_leave': data[0][i][2],
                                        'remaining': data[0][i][3]
                                    });
                
                                    // Prepare row data for CSV
                                    var rowData = [
                                        data[0][i][0], 
                                        data[0][i][1], 
                                        data[0][i][4], 
                                        data[0][i][5], 
                                        data[0][i][6], 
                                        data[0][i][7], 
                                        data[0][i][8], 
                                        data[0][i][9], 
                                        data[0][i][10], 
                                        data[0][i][11], 
                                        data[0][i][12], 
                                        data[0][i][13], 
                                        data[0][i][14], 
                                        data[0][i][15], 
                                        data[0][i][2], 
                                        data[0][i][3]
                                    ];
                                    csvContent += rowData.join(',') + '\n';
                                }
                            } else {
                                // No data found case
                                var rowData = []; 
                                csvContent += rowData.join(',') + '\n';
                            }
                
                            // Create CSV Blob and FileName
                            var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            var today = new Date();
                            var fileName = 'leave_balance_' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '.csv';
                
                            // Assign blob and fileName to observable properties or any other way to download
                            self.blob(blob);
                            self.fileName(fileName);
                        }
                    });
                }
                
                self.LeaveData2 = new ArrayDataProvider(self.LeaveDet2, { keyAttributes: "id" });
                
                self.formSubmit3 = () => {
                    let selectedMemberId = self.Member();
                    
                    if (selectedMemberId) {
                        self.LeaveDet2([]); // Clear the existing data
                        document.getElementById('loaderView').style.display = 'block';
                        
                        $.ajax({
                            url: BaseURL + "/HRModuleGetLeaveData",
                            type: 'POST',
                            data: JSON.stringify({ userId: selectedMemberId }),
                            contentType: 'application/json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log("Error fetching Leave Data:", textStatus);
                                document.getElementById('loaderView').style.display = 'none';
                            },
                            success: function (data) {
                                document.getElementById('leaveTable2').style.display = 'block';
                                document.getElementById('loaderView').style.display = 'none';
                
                                var csvContent = '';
                                var headers = ['ID', 'Name', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total Leave', 'Remaining'];
                
                                // Add headers to CSV content
                                csvContent += headers.join(',') + '\n';
                
                                if (data[0].length != 0) {
                                    for (var i = 0; i < data[0].length; i++) {
                                        self.LeaveDet2.push({
                                            'id': data[0][i][0],
                                            'name': data[0][i][1],
                                            'jan': data[0][i][4],
                                            'feb': data[0][i][5],
                                            'mar': data[0][i][6],
                                            'apr': data[0][i][7],
                                            'may': data[0][i][8],
                                            'jun': data[0][i][9],
                                            'jul': data[0][i][10],
                                            'aug': data[0][i][11],
                                            'sep': data[0][i][12],
                                            'oct': data[0][i][13],
                                            'nov': data[0][i][14],
                                            'dec': data[0][i][15],
                                            'total_leave': data[0][i][2],
                                            'remaining': data[0][i][3]
                                        });
                
                                        // Prepare row data for CSV
                                        var rowData = [
                                            data[0][i][0],
                                            data[0][i][1],
                                            data[0][i][4],
                                            data[0][i][5],
                                            data[0][i][6],
                                            data[0][i][7],
                                            data[0][i][8],
                                            data[0][i][9],
                                            data[0][i][10],
                                            data[0][i][11],
                                            data[0][i][12],
                                            data[0][i][13],
                                            data[0][i][14],
                                            data[0][i][15],
                                            data[0][i][2],
                                            data[0][i][3]
                                        ];
                                        csvContent += rowData.join(',') + '\n';
                                    }
                                } else {
                                    console.log("No leave data received from backend.");
                                    var rowData = []; 
                                    csvContent += rowData.join(',') + '\n';
                                }
                
                                // Create CSV Blob and FileName
                                var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                var today = new Date();
                                var fileName = 'leave_balance_' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '.csv';
                
                                // Assign blob and fileName to observable properties or any other way to download
                                self.blob(blob);
                                self.fileName(fileName);
                            }
                        });
                    } else {
                        console.log("No member selected.");
                    }
                }

                self.downloadExcel = ()=> {
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                      // For Internet Explorer
                      window.navigator.msSaveOrOpenBlob(self.blob(), self.fileName());
                    } else {
                      // For modern browsers
                      var link = document.createElement('a');
                      link.href = window.URL.createObjectURL(self.blob());
                      link.download = self.fileName();
                      link.style.display = 'none';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }

                //Leave Balance Updater Function: This function should be called where the leave balance needs to be updated and displayed.
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
                            console.log(data);
                        }
                    })
                }

              self.leaveTaken = ko.observable('');
              self.leaveRemaining = ko.observable('');

              self.getLeaveBalance = () => {

                  document.getElementById('loaderView').style.display = 'block';
                  $.ajax({
                      url: BaseURL + "/HRModuleGetLeaveBalance",
                      type: 'POST',
                      data: JSON.stringify({ 
                          staff_id: sessionStorage.getItem("userId"),
                      }),
                      contentType: "application/json", // Specify the content type as JSON
                      timeout: sessionStorage.getItem("timeInterval"),
                      context: self,
                      error: function (xhr, textStatus, errorThrown) {
                          console.log(textStatus);
                          document.getElementById('loaderView').style.display = 'none';
                      },
                      success: function (data) {
                          document.getElementById('loaderView').style.display = 'none';
                          console.log(data);
                          if (data && data.length > 0) {
                              self.leaveTaken(data[0][0]);
                              self.leaveRemaining(data[0][1]);
                          }
                      }
                  });
              };

              self.MyLeaveDet = ko.observableArray([]);
              self.MyLeaveYearDet = ko.observableArray([]);
              self.MyYearFilter = ko.observable('');

              self.getMyLeaves = () => {
                  self.MyLeaveDet([]);
                  document.getElementById('loaderView').style.display = 'block';
                  $.ajax({
                      url: BaseURL + "/HRModuleGetSelfLeaveStatus",
                      type: 'POST',
                      data: JSON.stringify({
                          staff_id: sessionStorage.getItem("userId")
                      }),
                      timeout: sessionStorage.getItem("timeInetrval"),
                      context: self,
                      error: function(xhr, textStatus, errorThrown) {
                          console.log(textStatus);
                          document.getElementById('loaderView').style.display = 'none';
                      },
                      success: function(result1) {
                          console.log(result1);
                          document.getElementById('loaderView').style.display = 'none';
                          document.getElementById('my_requests').style.display = 'block';

                          if (result1[0].length != 0) {
                              for (var i = 0; i < result1[0].length; i++) {
                                  self.MyLeaveDet.push({
                                      'no': i + 1,
                                      'id': result1[0][i][0],
                                      'start_date': result1[0][i][1],
                                      'end_date': result1[0][i][2],
                                      'leave_type': result1[0][i][3],
                                      'leave_reason': result1[0][i][4],
                                      'status': result1[0][i][5]
                                  });
                              }
                          }

                          if (result1[1].length != 0) {
                              for (var i = 0; i < result1[1].length; i++) {
                                  self.MyLeaveYearDet.push({"label": result1[1][i][0], "value": result1[1][i][0]});
                              }
                              self.MyLeaveYearDet.unshift({ value: 'All', label: 'All' });
                          }
                      }
                  });
              };

              self.MyYearList = new ArrayDataProvider(this.LeaveYearDet, { keyAttributes: "value"});
              self.MyLeaveData = new ArrayDataProvider(this.MyLeaveDet, { keyAttributes: "id" });

              self.Myfilter = ko.observable('');

              self.MyLeaveData = ko.computed(function () {
                  let filterCriterion = null;
                  if (self.Myfilter() && this.Myfilter() != '') {
                      filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                          filterDef: { text: self.Myfilter() }
                      });
                  }
                  const arrayDataProvider = new ArrayDataProvider(self.MyLeaveDet, { 
                      keyAttributes: 'id',
                      sortComparators: {
                          comparators: new Map().set("dob", this.comparator),
                      },
                  });
                  
                  return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
              }, self);

              self.MyhandleValue = () => {                
                  self.Myfilter(document.getElementById('MysearchFilter').rawValue);
              };

              self.leaveReport = ()=>{
                self.router.go({path:'leaveReport'})
            }

            self.statusUpdate = (event,data)=>{
                let leaveId =  data.item.data.id;
                let status = event.detail.value;
                sessionStorage.setItem('leaveId',leaveId) 
                sessionStorage.setItem('status',status)

                let popup = document.getElementById("loaderPopup");
                popup.open();
                
                $.ajax({
                    url: BaseURL+"/HRModuleReviewLeaveStatus2",
                    type: 'POST',
                    data: JSON.stringify({
                        leaveId : self.leaveId(),
                        status : self.status(),

                        leaveId: sessionStorage.getItem('leaveId'),
                        status : sessionStorage.getItem('status'),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        popup.close();
                        let popup2 = document.getElementById("successView2");
                        popup2.open();
                    }
                })
            }

            self.fromDateMyLeave = ko.observable('')
            self.toDateMyLeave = ko.observable('')

            self.datePicker = {
                numberOfMonths: 1
            };

            self.showMyLeaveData = ()=>{
                self.MyLeaveDet([]);
                document.getElementById('loaderView').style.display='block';
                let fromDate = self.fromDateMyLeave()
                let toDate = self.toDateMyLeave();
                $.ajax({
                    url: BaseURL+"/HRModuleGetMyLeaveListFilter",
                    type: 'POST',
                    data: JSON.stringify({
                        userId : sessionStorage.getItem("userId"),
                        fromDate : fromDate,
                        toDate : toDate
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        console.log(data)
                        document.getElementById('loaderView').style.display='none';
                        if(data.length!=0){
                            for (var i = 0; i < data.length; i++) {
                                self.MyLeaveDet.push({
                                    'no': i + 1,
                                    'id': data[i][0],
                                    'start_date': data[i][1],
                                    'end_date': data[i][2],
                                    'leave_type': data[i][3],
                                    'leave_reason': data[i][4],
                                    'status': data[i][5]                                 
                                }); 
                            } 
                        }
                    }
                })
            }

            self.fromDateAllLeave = ko.observable('')
            self.toDateAllLeave = ko.observable('')

            self.showAllLeaveData = ()=>{
                self.LeaveDet([]);
                document.getElementById('loaderView').style.display='block';
                let fromDate = self.fromDateAllLeave()
                let toDate = self.toDateAllLeave();
                $.ajax({
                    url: BaseURL+"/HRModuleGetAllLeaveListFilter",
                    type: 'POST',
                    data: JSON.stringify({
                        userId : sessionStorage.getItem("userId"),
                        fromDate : fromDate,
                        toDate : toDate
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        console.log(data)
                        document.getElementById('loaderView').style.display='none';
                        if(data[0].length != 0){
                            for (var i = 0; i < data[0].length; i++) {
                                self.LeaveDet.push({
                                    'no': i + 1,
                                    'id': data[0][i][0],
                                    'name': data[0][i][6],
                                    'start_date': data[0][i][1],
                                    'end_date': data[0][i][2],
                                    'leave_type': data[0][i][3],
                                    'leave_reason': data[0][i][4],
                                    'status': data[0][i][5]                             
                                }); 
                            } 
                        }
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


            }
        }
        return  leaves;
    }
);