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
                        self.getLeaves();
                        self.getMembers();
                        self.getHolidayDetails();
                        self.getLeavesReport();
                    }
                }

                self.tabData = [
                    { id: "calender", label: "Calender" },
                    { id: "leave_requests", label: "Apply Leave" },
                    { id: "leave_approval", label: "Leave Requests" },
                    { id: "leave_balance", label: "Leave Balance" },
                    { id: "leave_report", label: "Leave Report" },
                ];

                self.selectedTab = ko.observable("calender");

                self.selectedTabAction = ko.computed(() => { 
                    if(self.selectedTab() == 'calender'){
                        $("#calender").show();
                        $("#leave_requests").hide();
                        $("#leave_approval").hide();
                        $("#leave_balance").hide();
                        $("#leave_report").hide();
                    }
                    else if(self.selectedTab() == 'leave_requests'){
                        $("#calender").hide();
                        self.getLeaveType();
                        $("#leave_requests").show();
                        $("#leave_approval").hide();
                        $("#leave_balance").hide();
                        $("#leave_report").hide();
                    }
                    else if(self.selectedTab() == 'leave_approval'){
                        $("#calender").hide();
                        self.filterYear();
                        $("#leave_requests").hide();
                        $("#leave_approval").show();
                        $("#leave_balance").hide();
                        $("#leave_report").hide();
                    }
                    else if(self.selectedTab() == 'leave_balance'){
                        $("#calender").hide();
                        $("#leave_requests").hide();
                        $("#leave_approval").hide();
                        self.getTeams();
                        self.changeLeaveBalance();
                        $("#leave_balance").show();
                        $("#leave_report").hide();
                    }
                    else if(self.selectedTab() == 'leave_report'){
                        $("#calender").hide();
                        $("#leave_requests").hide();
                        $("#leave_approval").hide();
                        $("#leave_balance").hide();
                        self.filterYear3();
                        $("#leave_report").show();
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
                    document.getElementById('leave_report').style.display = 'none';

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
                            document.getElementById('leave_report').style.display = 'none';
                                
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
                        type: 'GET',
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
                self.hour = ko.observable();
                self.leave_type = ko.observable();
                self.start_date = ko.observable();
                self.LeaveTypeDet = ko.observableArray([]); 


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
                    {"label":"Time off","value":"Time off"}
                );
                self.LeaveReasonList = new ArrayDataProvider(self.leaveReasonDet, {
                    keyAttributes: 'value'
                });

                self.isForTimeOffSelected1 = () => {
                    if (self.leave_reason() == 'Time off'){
                        $('#hour_View1').show();
                    }
                    else if (self.leave_reason() != 'Time off'){
                        $('#hour_View1').hide();
                    }
                }

                self.formSubmit = () => {
                    const formValid = self._checkValidationGroup("formValidation2"); 
                    if (formValid) {
                        if (self.leave_reason() === 'Time off' && !self.hour()) {
                            return;
                        }
                
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
                                hour: self.hour(),
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                console.log(data);
                                let popup = document.getElementById("loaderPopup");
                                popup.close();
                                let popup1 = document.getElementById("successView");
                                popup1.open();
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
                
                        if (self.leave_reason() === 'Time off' && !self.hour()) {
                            return;
                        }
                
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
                                hour: self.hour(),
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                console.log(data);
                                let popup = document.getElementById("loaderPopup");
                                popup.close();
                                let popup1 = document.getElementById("successView");
                                popup1.open();
                            }
                        });
                    }
                };

                self.formSubmitStaff = () => {
                    const formValid = self._checkValidationGroup("formValidation2"); 
                    if (formValid) {
                        if (self.leave_reason() === 'Time off' && !self.hour()) {
                            return;
                        }
                
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
                                hour: self.hour(),
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                console.log(data);
                                let popup = document.getElementById("loaderPopup");
                                popup.close();
                                let popup1 = document.getElementById("successView");
                                popup1.open();
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
                            //document.getElementById('leave_approval').style.display = 'block';
                
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

                            if (result1[1].length != 0) {
                                self.LeaveYearDet([]);
                                for (var i = 0; i < result1[1].length; i++) {
                                    self.LeaveYearDet.push({"label": result1[1][i][0], "value": result1[1][i][0]});
                                }
                                self.LeaveYearDet.unshift({ value: 'All', label: 'All' });
                            }
                        }
                    });
                };

                self.yearList = new ArrayDataProvider(this.LeaveYearDet, { keyAttributes: "value"});

                self.filterYearCallCount = 0; // Initialize counter
                // Debounce function to limit calls to filterYear
                function debounce(func, wait) {
                    let timeout;
                    return function (...args) {
                        const context = this;
                        clearTimeout(timeout);
                        timeout = setTimeout(() => func.apply(context, args), wait);
                    };
                }

                self.filterYear = debounce(function () {
                    self.LeaveDet([]);
                    self.filterYearCallCount++; // Increment counter

                    if (self.yearFilter() == '') {
                        const currentYear = new Date().getFullYear();
                        console.log(currentYear);
                        self.yearFilter(currentYear);
                    }
                    if (self.yearFilter() != '') {
                        if (self.filterYearCallCount <= 3) { // Clear only on first 3 calls
                            self.LeaveDet([]);
                        }
                        document.getElementById('loaderView').style.display = 'block';
                        $.ajax({
                            url: BaseURL + "/HRModuleGetYearLeaveEmployeeFilter2",
                            type: 'POST',
                            data: JSON.stringify({
                                year: self.yearFilter(),
                                userId: sessionStorage.getItem("userId")
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function(xhr, textStatus, errorThrown) {
                                if (textStatus == 'timeout' || textStatus == 'error') {
                                    document.querySelector('#TimeoutSup').open();
                                }
                            },
                            success: function(result2) {
                                console.log(result2);
                                document.getElementById('loaderView').style.display = 'none';
                                document.getElementById('leave_approval').style.display = 'block';
                                self.LeaveDet([]);

                                if (result2.length != 0) {
                                    if (self.filterYearCallCount <= 3) { // Clear only on first 3 calls
                                        self.LeaveDet([]);
                                    }

                                    for (var i = 0; i <= result2.length; i++) {
                                        self.LeaveDet.push({
                                            'no': i + 1,
                                            'id': result2[i][0],
                                            'name': result2[i][6], // 'full_name' is now at the 7th position
                                            'start_date': result2[i][1],
                                            'end_date': result2[i][2],
                                            'leave_type': result2[i][3],
                                            'leave_reason': result2[i][4],
                                            'status': result2[i][5]
                                        });
                                    }
                                }
                            }
                        });
                    }
                }, 10); // 1-second debounce delay
                
                self.LeaveData = new ArrayDataProvider(this.LeaveDet, { keyAttributes: "id" });

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
                    {"label":"Reject","value":"Reject"},
                    {"label":"Approve","value":"Approve"},
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
                self.hour = ko.observable('');
                self.leaveId = ko.observable();

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
                                self.hour(data[0][7]);
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
                           // document.getElementById('leaveTable2').style.display = 'block';
                            console.log(data);
                            document.getElementById('loaderView').style.display = 'none';
                            if (data[0].length != 0) {
                                for (var i = 0; i < data[0].length; i++) {
                                    self.LeaveDet2.push({
                                        'id': data[0][i][0],
                                        'name': data[0][i][1],
                                        'total_leave': data[0][i][2],
                                        'remaining': data[0][i][3]
                                    });
                                }
                            }
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
                                if (data[0].length != 0) {
                                    for (var i = 0; i < data[0].length; i++) {
                                        self.LeaveDet2.push({
                                            'id': data[0][i][0],
                                            'name': data[0][i][1],
                                            'total_leave': data[0][i][2],
                                            'remaining': data[0][i][3]
                                        });
                                    }
                                } else {
                                    console.log("No leave data received from backend.");
                                }
                            }
                        });
                    } else {
                        console.log("No member selected.");
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

                self.LeaveDet3 = ko.observableArray([]);
                self.LeaveYearDet3 = ko.observableArray([]);
                self.yearFilter3 = ko.observable('');

                self.getLeavesReport = () => {
                    self.LeaveDet3([]);
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetEmployeeLeaveReport",
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
                            //document.getElementById('leave_approval').style.display = 'block';
                
                            if (result1[0].length != 0) {
                                for (var i = 0; i < result1[0].length; i++) {
                                    self.LeaveDet3.push({
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

                            if (result1[1].length != 0) {
                                self.LeaveYearDet3([]);
                                for (var i = 0; i < result1[1].length; i++) {
                                    self.LeaveYearDet3.push({"label": result1[1][i][0], "value": result1[1][i][0]});
                                }
                                self.LeaveYearDet3.unshift({ value: 'All', label: 'All' });
                            }
                        }
                    });
                };

                self.yearList3 = new ArrayDataProvider(this.LeaveYearDet3, { keyAttributes: "value"});

                self.filterYearCallCount_2 = 0; // Initialize counter

                self.filterYear3 = debounce(function () {
                    self.LeaveDet3([]);
                    self.filterYearCallCount_2++; // Increment counter

                    if (self.yearFilter3() == '') {
                        const currentYear = new Date().getFullYear();
                        console.log(currentYear);
                        self.yearFilter3(currentYear);
                    }
                    if (self.yearFilter3() != '') {
                        if (self.filterYearCallCount_2 <= 3) { // Clear only on first 3 calls
                            self.LeaveDet3([]);
                        }
                        document.getElementById('loaderView').style.display = 'block';
                        $.ajax({
                            url: BaseURL + "/HRModuleGetYearLeaveFilterReport",
                            type: 'POST',
                            data: JSON.stringify({
                                year: self.yearFilter3(),
                                userId: sessionStorage.getItem("userId")
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function(xhr, textStatus, errorThrown) {
                                document.getElementById('loaderView').style.display = 'none';
                                if (textStatus == 'timeout' || textStatus == 'error') {
                                    document.querySelector('#TimeoutSup').open();
                                }
                            },
                            success: function(result2) {
                                console.log(result2);
                                document.getElementById('loaderView').style.display = 'none';
                                document.getElementById('leave_report').style.display = 'block';
                                self.LeaveDet3([]);

                                if (result2.length != 0) {
                                    if (self.filterYearCallCount_2 <= 3) { // Clear only on first 3 calls
                                        self.LeaveDet3([]);
                                    }

                                    for (var i = 0; i <= result2.length; i++) {
                                        self.LeaveDet3.push({
                                            'no': i + 1,
                                            'id': result2[i][0],
                                            'name': result2[i][6], // 'full_name' is now at the 7th position
                                            'start_date': result2[i][1],
                                            'end_date': result2[i][2],
                                            'leave_type': result2[i][3],
                                            'leave_reason': result2[i][4],
                                            'status': result2[i][5]
                                        });
                                    }
                                }
                            }
                        });
                    }
                }, 10); // 1-second debounce delay
                
                self.LeaveData3 = new ArrayDataProvider(this.LeaveDet3, { keyAttributes: "id" });

                self.filter3 = ko.observable('');

                self.LeaveData3 = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filter3() && this.filter3() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filter3() }
                        });
                    }
                    const arrayDataProvider = new ArrayDataProvider(self.LeaveDet3, { 
                        keyAttributes: 'id',
                        sortComparators: {
                            comparators: new Map().set("dob", this.comparator),
                        },
                    });
                    
                    return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
                }, self);

                self.handleValue3 = () => {                
                    self.filter3(document.getElementById('searchFilter3').rawValue);
                };
                

            }
        }
        return  leaves;
    }
);