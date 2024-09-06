define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable"], 
    function (oj,ko,$, app, ArrayDataProvider, FilePickerUtils) {

        class MyGoals {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = sessionStorage.getItem("BaseURL")
                let userrole = sessionStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);
                
                self.goalSubject = ko.observable();
                self.description = ko.observable();
                self.startDate = ko.observable('');
                self.endDate = ko.observable('');
                self.GoalDet = ko.observableArray([]); 
                self.CancelBehaviorOpt = ko.observable('icon'); 
                self.yearFilter = ko.observable('');
                self.GoalYearDet = ko.observableArray([]);

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        getGoals();
                    }
                }

                function getGoals(){
                    self.GoalDet([]);
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetGoal",
                        type: 'POST',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("userId")
                        }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display='none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display='none';
                            console.log(data)
                            if(data[0].length !=0){ 
                                for (var i = 0; i < data[0].length; i++) {
                                    self.GoalDet.push({
                                        'no': i+1,
                                        'id': data[0][i][0],
                                        'goal_subject': data[0][i][1],
                                        'description': data[0][i][2],
                                        'start_date': data[0][i][3],
                                        'end_date': data[0][i][4],
                                        'status': data[0][i][5],
                                        'admin_status': data[0][i][6],
                                    });
                                }
                            }
                            if(data[1].length !=0){ 
                                for (var i = 0; i < data[1].length; i++) {
                                    self.GoalYearDet.push({"label":data[1][i][0],"value":data[1][i][0]});
                                }
                                self.GoalYearDet.unshift({ value: 'All', label: 'All' });
                            }
                        }
                    })
                }

                self.yearList = new ArrayDataProvider(this.GoalYearDet, { keyAttributes: "value"});

                self.formSubmit = ()=>{
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid) {
                            let popup = document.getElementById("loaderPopup");
                            popup.open();
                            
                            $.ajax({
                                url: BaseURL+"/HRModuleAddGoal",
                                type: 'POST',
                                data: JSON.stringify({
                                    staffId : sessionStorage.getItem("userId"),
                                    goal_subject : self.goalSubject(),
                                    description : self.description(),
                                    start_date : self.startDate(),
                                    end_date : self.endDate(),
                                }),
                                dataType: 'json',
                                timeout: sessionStorage.getItem("timeInetrval"),
                                context: self,
                                error: function (xhr, textStatus, errorThrown) {
                                    console.log(textStatus);
                                },
                                success: function (data) {
                                    document.querySelector('#openAddGoal').close();
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

                self.addGoal = ()=>{
                    document.querySelector('#openAddGoal').open();
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
                    self.GoalDet([]);
                    self.filterYearCallCount++; // Increment counter

                    if(self.yearFilter() == ''){
                        const currentYear = new Date().getFullYear();
                        console.log(currentYear);
                        self.yearFilter(currentYear)
                    }
                    if (self.yearFilter() != '' ) {
                        if (self.filterYearCallCount <= 3) { // Clear only on first 3 calls
                            self.GoalDet([]);
                        }
                        document.getElementById('loaderView').style.display='block';
                        $.ajax({
                            url: BaseURL  + "/HRModuleGetYearGoalFilterList",
                            type: 'POST',
                            data: JSON.stringify({
                                staffId : sessionStorage.getItem("userId"),
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
                                        self.GoalDet([]);
                                    }

                                    for (var i = 0; i < data[0].length; i++) {
                                        self.GoalDet.push({
                                            'no': i+1,
                                            'id': data[0][i][0],
                                            'goal_subject': data[0][i][1],
                                            'description': data[0][i][2],
                                            'start_date': data[0][i][3],
                                            'end_date': data[0][i][4],
                                            'status': data[0][i][5],
                                            'admin_status': data[0][i][6],
                                        });
                                    }
                                }
                        }
                        })
                    }
                       
                }, 10); // 1-second debounce delay

                self.dataProvider = new ArrayDataProvider(this.GoalDet, { keyAttributes: "id"});

                self.status = ko.observable();
                self.statusList = ko.observableArray([]);
                self.statusList.push(
                    {"label":"Pending","value":"Pending"},
                    {"label":"Under Review","value":"Under Review"},
                    {"label":"Working","value":"Working"},
                    {"label":"Completed","value":"Completed"},
                );
                self.statusList = new ArrayDataProvider(self.statusList, {
                    keyAttributes: 'value'
                }); 

                self.viewGoal = (event,data)=>{
                    var rowId = data.item.data.id
                    console.log(rowId)
                    sessionStorage.setItem("goalId", rowId);
                    self.router.go({path:'goalsView'})
                }


            }
        }
        return  MyGoals;
    }
);