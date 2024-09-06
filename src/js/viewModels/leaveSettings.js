define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable","ojs/ojavatar","ojs/ojactioncard","ojs/ojselectcombobox"], 
    function (oj,ko,$, app, ArrayDataProvider, FilePickerUtils) {

        class LeaveSettings {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = sessionStorage.getItem("BaseURL")
                self.leaveType = ko.observable('');
                self.totalLeave = ko.observable('');
                self.totalLeaveId = ko.observable('');
                self.CancelBehaviorOpt = ko.observable('icon'); 
                self.LeaveTypeDet = ko.observableArray([]); 


                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        getLeaveDetails();
                    }
                }

                function getLeaveDetails(){
                    self.LeaveTypeDet([]);
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetLeaveDetails",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            console.log(data)
                            document.getElementById('loaderView').style.display='none';
                            if(data[0] !=0){
                            self.totalLeaveId(data[0][0][0])
                            self.totalLeave(data[0][0][1])
                            self.start_month(data[0][0][2])
                            }
                            if(data[1].length !=0){ 
                                for (var i = 0; i < data[1].length; i++) {
                                    self.LeaveTypeDet.push({'no': i+1,'id': data[1][i][0],'leaveType': data[1][i][1]  });
                                }
                            }
                        }
                    })
                }
                self.dataProvider = new ArrayDataProvider(self.LeaveTypeDet, { keyAttributes: "id"});

                self.addTotalLeave = ()=>{
                    document.querySelector('#openAddTotalLeave').open();
                }


                self.addLeaveTypes = ()=>{
                    document.querySelector('#openAddLeaveType').open();
                }

                self.formSubmit = ()=>{
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid) {
                            let popup = document.getElementById("loaderPopup");
                            popup.open();
                            
                            $.ajax({
                                url: BaseURL+"/HRModuleAddTotalLeave",
                                type: 'POST',
                                data: JSON.stringify({
                                    total_leave_id : self.totalLeaveId(),
                                    total_leave : self.totalLeave(),
                                }),
                                dataType: 'json',
                                timeout: sessionStorage.getItem("timeInetrval"),
                                context: self,
                                error: function (xhr, textStatus, errorThrown) {
                                    console.log(textStatus);
                                },
                                success: function (data) {
                                    document.querySelector('#openAddTotalLeave').close();
                                    let popup = document.getElementById("loaderPopup");
                                    popup.close();
                                    let popup1 = document.getElementById("successView");
                                    popup1.open();
                                }
                            })
                        }
                    }

                    self.leaveFormSubmit = ()=>{
                        const formValid = self._checkValidationGroup("formValidationLeave"); 
                        if (formValid) {
                                let popup = document.getElementById("loaderPopup");
                                popup.open();
                                
                                $.ajax({
                                    url: BaseURL+"/HRModuleAddLeaveType",
                                    type: 'POST',
                                    data: JSON.stringify({
                                        leave_type : self.leaveType(),
                                    }),
                                    dataType: 'json',
                                    timeout: sessionStorage.getItem("timeInetrval"),
                                    context: self,
                                    error: function (xhr, textStatus, errorThrown) {
                                        console.log(textStatus);
                                    },
                                    success: function (data) {
                                        document.querySelector('#openAddLeaveType').close();
                                        let popup = document.getElementById("loaderPopup");
                                        popup.close();
                                        let popup2 = document.getElementById("popup2");
                                        popup2.open();
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

                    self.deleteLeaveType = (event,data)=>{
                        var rowId = data.item.data.id
                        $.ajax({
                            url: BaseURL+"/HRModuleDeleteLeaveType",
                            type: 'POST',
                            data: JSON.stringify({
                                leaveTypeId : rowId
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

                    self.start_month = ko.observable('');

                    self.month_List = ko.observableArray([]);
                    self.month_List.push(
                        {"label":"January","value":"January"},
                        {"label":"February","value":"February"},
                        {"label":"March","value":"March"},
                        {"label":"April","value":"April"},
                        {"label":"May","value":"May"},
                        {"label":"June","value":"June"},
                        {"label":"July","value":"July"},
                        {"label":"August","value":"August"},
                        {"label":"September","value":"September"},
                        {"label":"October","value":"October"},
                        {"label":"November","value":"November"},
                        {"label":"December","value":"December"}
                    );
                    self.month_List = new ArrayDataProvider(self.month_List, {
                        keyAttributes: 'value'
                    });
    

                    self.addLeaveMonth = ()=>{
                        document.querySelector('#openAddLeaveMonth').open();
                    }

                    self.formSubmitMonth = ()=>{
                        const formValid = self._checkValidationGroup("formValidationMonth"); 
                        if (formValid) {
                                let popup = document.getElementById("loaderPopup");
                                popup.open();
                                
                                $.ajax({
                                    url: BaseURL+"/HRModuleAddLeaveMonth",
                                    type: 'POST',
                                    data: JSON.stringify({
                                        total_leave_id : self.totalLeaveId(),
                                        start_month : self.start_month(),
                                    }),
                                    dataType: 'json',
                                    timeout: sessionStorage.getItem("timeInetrval"),
                                    context: self,
                                    error: function (xhr, textStatus, errorThrown) {
                                        console.log(textStatus);
                                    },
                                    success: function (data) {
                                        document.querySelector('#openAddLeaveMonth').close();
                                        let popup = document.getElementById("loaderPopup");
                                        popup.close();
                                        let popup1 = document.getElementById("successView");
                                        popup1.open();
                                    }
                                })
                            }
                        }
    
            }
        }
        return  LeaveSettings;
    }
);