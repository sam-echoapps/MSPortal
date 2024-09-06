define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable"], 
    function (oj,ko,$, app, ArrayDataProvider, FilePickerUtils) {

        class AddHoliday {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = sessionStorage.getItem("BaseURL")
                let userrole = sessionStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);
                
                self.holidayName = ko.observable();
                self.holidayDate = ko.observable();
                self.comments = ko.observable('');
                self.HolidayDet = ko.observableArray([]); 
                self.CancelBehaviorOpt = ko.observable('icon'); 
                self.yearFilter = ko.observable('');
                self.HolidayYearDet = ko.observableArray([]);

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        getHoliday();
                    }
                }

                function getHoliday(){
                    self.HolidayDet([]);
                    document.getElementById('loaderView').style.display='none';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetHoliday",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            console.log(data)
                            // document.getElementById('loaderView').style.display='none';
                            // document.getElementById('actionView').style.display='block';
                            if(data[0].length !=0){ 
                                for (var i = 0; i < data[0].length; i++) {
                                    self.HolidayDet.push({'no': i+1,'id': data[0][i][0],'holiday_name': data[0][i][1],'holiday_date': data[0][i][2],'comments': data[0][i][3]  });
                                }
                            }
                            if(data[1].length !=0){ 
                                for (var i = 0; i < data[1].length; i++) {
                                    self.HolidayYearDet.push({"label":data[1][i][0],"value":data[1][i][0]});
                                }
                                self.HolidayYearDet.unshift({ value: 'All', label: 'All' });
                            }
                        }
                    })
                }

                self.yearList = new ArrayDataProvider(this.HolidayYearDet, { keyAttributes: "value"});

                self.formSubmit = ()=>{
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid) {
                            let popup = document.getElementById("loaderPopup");
                            popup.open();
                            
                            $.ajax({
                                url: BaseURL+"/HRModuleAddHoliday",
                                type: 'POST',
                                data: JSON.stringify({
                                    holiday_name : self.holidayName(),
                                    holiday_date : self.holidayDate(),
                                    comments : self.comments(),
                                }),
                                dataType: 'json',
                                timeout: sessionStorage.getItem("timeInetrval"),
                                context: self,
                                error: function (xhr, textStatus, errorThrown) {
                                    console.log(textStatus);
                                },
                                success: function (data) {
                                    document.querySelector('#openAddHoliday').close();
                                    let popup = document.getElementById("loaderPopup");
                                    popup.close();
                                    let popup1 = document.getElementById("successView");
                                    popup1.open();
                                }
                            })
                        }
                    }

                self.messageClose = ()=>{
                    location.reload();
                }
              
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

                self.deleteHoliday = (event,data)=>{
                    var rowId = data.item.data.id
                    $.ajax({
                        url: BaseURL+"/HRModuleDeleteHoliday",
                        type: 'POST',
                        data: JSON.stringify({
                            holidayId : rowId
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

                self.addHoliday = ()=>{
                    document.querySelector('#openAddHoliday').open();
                }

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
                    self.HolidayDet([]);
                    self.filterYearCallCount++; // Increment counter
                    if(self.yearFilter() == ''){
                        const currentYear = new Date().getFullYear();
                        console.log(currentYear);
                        self.yearFilter(currentYear)
                    }
                    if (self.yearFilter() != '' ) {
                        if (self.filterYearCallCount <= 3) { // Clear only on first 3 calls
                            self.HolidayDet([]);
                        }
                        document.getElementById('loaderView').style.display='block';
                        $.ajax({
                            url: BaseURL  + "/HRModuleGetYearHolidayFilterList",
                            type: 'POST',
                            data: JSON.stringify({
                                year : self.yearFilter()
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                if(textStatus == 'timeout' || textStatus == 'error'){
                                    document.querySelector('#TimeoutSup').open();
                                }
                            },
                            success: function (data) {
                                document.getElementById('loaderView').style.display='none';
                                document.getElementById('actionView').style.display='block';
                                console.log(data)
                                if(data[0].length !=0){ 
                                    if (self.filterYearCallCount <= 3) { // Clear only on first 3 calls
                                        self.HolidayDet([]);
                                    }

                                    for (var i = 0; i < data[0].length; i++) {
                                        self.HolidayDet.push({
                                            'no': i+1,
                                            'id': data[0][i][0],
                                            'holiday_name': data[0][i][1],
                                            'holiday_date': data[0][i][2],
                                            'comments': data[0][i][3]  
                                        });
                                    }
                                }
                        }
                        })
                    }
                       
                    }, 10); // 1-second debounce delay

                    self.dataProvider = new ArrayDataProvider(this.HolidayDet, { keyAttributes: "id"});



            }
        }
        return  AddHoliday;
    }
);