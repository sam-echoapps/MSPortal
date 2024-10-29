define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider","ojs/ojlistdataproviderview","ojs/ojdataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable","ojs/ojactioncard","ojs/ojavatar"], 
    function (oj,ko,$, app, ArrayDataProvider,ListDataProviderView, ojdataprovider_1, FilePickerUtils) {

        class Task {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = localStorage.getItem("BaseURL")
                
                self.taskName = ko.observable();
                self.dueDate = ko.observable();
                self.priority = ko.observable('');
                self.reminderDate = ko.observable('');

                self.priorities = [
                    {"label":"High","value":"High"},
                    {"label":"Medium","value":"Medium"},
                    {"label":"Low","value":"Low"}
                ]

                self.priorityList = new ArrayDataProvider(self.priorities, {
                    keyAttributes: 'value'
                });

                self.TaskDet = ko.observableArray([]);

                self.CancelBehaviorOpt = ko.observable('icon'); 

                self.status = ko.observable('');

                self.statusOption = [
                    {"label":"Pending","value":"Pending"},
                    {"label":"In Progress","value":"In Progress"},
                    {"label":"Task Done","value":"Task Done"},
                    {"label":"Dropped","value":"Dropped"}
                ]

                self.statusList = new ArrayDataProvider(self.statusOption, {
                    keyAttributes: 'value'
                });
               
                self.editTaskName = ko.observable();
                self.editDueDate = ko.observable();
                self.editPriority = ko.observable('');
                self.editStatus = ko.observable('');
                self.editCreatedDate = ko.observable('');
                self.employeeName = ko.observable('');
                self.employeeDesignation = ko.observable('');
                self.profilePhotoShow = ko.observable('');
                self.pendingCount = ko.observable('');
                self.progressCount = ko.observable('');
                self.doneCount = ko.observable('');
                self.droppedCount = ko.observable('');
                self.editReminderDate = ko.observable('');
                let userrole = localStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);
                self.userId = ko.observable(localStorage.getItem("userId"));
                self.ownerId = ko.observable('');
                self.description = ko.observable();
                self.editDescription = ko.observable();

                self.connected = function () {
                    if (localStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        getStaffTaskView();

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

                function getStaffTaskView(){
                    self.TaskDet([]);
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetStaffTaskList",
                        type: 'POST',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            staffId : localStorage.getItem("staffId")
                        }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            var result=data[1];
                            var resultData=data[2];
                            var statusCount=data[3];
                            console.log(statusCount)
                            self.pendingCount(statusCount[0][0])
                            self.progressCount(statusCount[0][1])
                            self.doneCount(statusCount[0][2])
                            self.droppedCount(statusCount[0][3])
                            self.employeeName(resultData[0][1] +" "+ resultData[0][3])
                            self.employeeDesignation(resultData[0][4])
                            if(result != ''){
                                self.profilePhotoShow('data:image/jpeg;base64,'+result);
                            } 
                            data = JSON.parse(data[0]);
                            console.log(data)
                            document.getElementById('loaderView').style.display='none';
                            document.getElementById('actionView').style.display='block';
                            if(data.length!=0){
                            for (var i = 0; i < data.length; i++) {
                                let dateCreated = new Date(data[i][7]);
                                // Get only the date part (YYYY-MM-DD)
                                let dateCreatedOnly = dateCreated.toISOString().slice(0, 10);
                                self.TaskDet.push({
                                    'slno': i+1,
                                    'id': data[i][0],
                                    'employee_id': data[i][1], 
                                    'task_name': data[i][2],
                                    'due_date': data[i][3],
                                    'priority': data[i][4], 
                                    'owner_id': data[i][5], 
                                    'owner': data[i][8] + " "+ data[i][9] +" "+ data[i][10],
                                    'status': data[i][6],
                                    'created_date': dateCreatedOnly,
                                    'reminder_date': data[i][11], 
                                    'description': data[i][12], 
                                });
                                
                            }
                            
                             }

                        }
                    })
                }

                self.TaskList = new ArrayDataProvider(this.TaskDet, { keyAttributes: "id"});

                self.filter = ko.observable('');

                self.TaskList = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filter() && this.filter() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filter() }
                        });
                    }
                    const arrayDataProvider = new ArrayDataProvider(self.TaskDet, { 
                        keyAttributes: 'id',
                        sortComparators: {
                            comparators: new Map().set("dob", this.comparator),
                        },
                    });
                    
                    return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
                }, self);

                self.handleValueTask = () => {
                    self.filter(document.getElementById('filter').rawValue);
                };

                self.lessCount = ko.observable('');
                self.inputLength = ko.observable('');
                self.getInputCount = (event)=>{

                    const inputValue = event.detail.value;

                    // Calculate the length of the input value
                    const length = inputValue ? inputValue.length : 0;
            
                    // Update the observable with the length
                    self.inputLength(length);
            
                    // Optionally log the length to the console
                    console.log(length);

                    if (length > 350) {
                        self.lessCount('Max. characters is 350');
                    } else {
                        self.lessCount(''); // Clear the warning if the length is 300 or more
                    }
                }


                self.formSubmit = ()=>{
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid && self.lessCount()=='') {
                            let popup = document.getElementById("loaderPopup");
                            popup.open();
                            
                            $.ajax({
                                url: BaseURL+"/HRModuleAddTask",
                                type: 'POST',
                                data: JSON.stringify({
                                    staffId: localStorage.getItem("staffId"),
                                    task_name : self.taskName(),
                                    due_date : self.dueDate(),
                                    reminder_date : self.reminderDate(),
                                    priority : self.priority(),
                                    userId: localStorage.getItem("userId"),
                                    description : self.description(),
                                }),
                                dataType: 'json',
                                timeout: localStorage.getItem("timeInetrval"),
                                context: self,
                                error: function (xhr, textStatus, errorThrown) {
                                    console.log(textStatus);
                                },
                                success: function (data) {
                                    console.log(data)
                                    document.querySelector('#openAddTask').close();
                                    let popup = document.getElementById("loaderPopup");
                                    popup.close();
                                    let popup1 = document.getElementById("successView");
                                    popup1.open();
                                }
                            })
                        }
                    }

                    self.formSubmitWithMail = ()=>{
                        const formValid = self._checkValidationGroup("formValidation"); 
                        if (formValid) {
                                let popup = document.getElementById("loaderPopup");
                                popup.open();
                                
                                $.ajax({
                                    url: BaseURL+"/HRModuleAddTaskWithMail",
                                    type: 'POST',
                                    data: JSON.stringify({
                                        staffId: localStorage.getItem("staffId"),
                                        task_name : self.taskName(),
                                        due_date : self.dueDate(),
                                        reminder_date : self.reminderDate(),
                                        priority : self.priority(),
                                        userId: localStorage.getItem("userId"),
                                        description : self.description(),
                                    }),
                                    dataType: 'json',
                                    timeout: localStorage.getItem("timeInetrval"),
                                    context: self,
                                    error: function (xhr, textStatus, errorThrown) {
                                        console.log(textStatus);
                                    },
                                    success: function (data) {
                                        console.log(data)
                                        document.querySelector('#openAddTask').close();
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

                
                self.addTask = ()=>{
                    document.querySelector('#openAddTask').open();
                }

                self.goToEditTask = (event,data)=>{
                    console.log(data)
                    var clickedTaskId = data.item.data.id
                    localStorage.setItem("taskId", clickedTaskId);
                    document.querySelector('#openEditTask').open();
                    self.getTaskInfo();
                }

                self.getTaskInfo = () => {
                    $.ajax({
                        url: BaseURL + "/HRModuleGetTaskInfo",
                        type: 'POST',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            taskId: localStorage.getItem("taskId")
                        }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            data = JSON.parse(data[0]);
                            console.log(data);
                            self.editTaskName(data[2])
                            self.editDueDate(data[3])
                            self.editPriority(data[4])
                            self.ownerId(data[5])
                            self.editStatus(data[6])
                            let date = new Date(data[7]);
                            // Get only the date part (YYYY-MM-DD)
                            let dateOnly = date.toISOString().slice(0, 10);
                            self.editCreatedDate(dateOnly)
                            self.editReminderDate(data[11])
                            self.editDescription(data[12])
                        }
                    });
                };

                self.formSubmitUpdate = ()=>{
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid && self.lessCount()=='') {
                            let popup = document.getElementById("loaderPopup");
                            popup.open();
                            
                            $.ajax({
                                url: BaseURL+"/HRModuleUpdateTask",
                                type: 'POST',
                                data: JSON.stringify({
                                    taskId: localStorage.getItem("taskId"),
                                    task_name : self.editTaskName(),
                                    due_date : self.editDueDate(),
                                    priority : self.editPriority(),
                                    status : self.editStatus(),
                                    reminder_date : self.editReminderDate(),
                                    description : self.editDescription(),
                                }),
                                dataType: 'json',
                                timeout: localStorage.getItem("timeInetrval"),
                                context: self,
                                error: function (xhr, textStatus, errorThrown) {
                                    console.log(textStatus);
                                },
                                success: function (data) {
                                    console.log(data)
                                    document.querySelector('#openEditTask').close();
                                    let popup = document.getElementById("loaderPopup");
                                    popup.close();
                                    let popup1 = document.getElementById("updateSuccessView");
                                    popup1.open();
                                }
                            })
                        }
                    }

                    self.statusUpdateList = (event,data)=>{
                        let taskId =  data.item.data.id;
                        let status = event.detail.value; 
                        let popup = document.getElementById("loaderPopup");
                        popup.open();
                        $.ajax({
                            url: BaseURL+"/HRModuleUpdateTaskList",
                            type: 'POST',
                            data: JSON.stringify({
                                taskId: taskId,
                                status : status
                            }),
                            dataType: 'json',
                            timeout: localStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                console.log(data)
                                popup.close();
                                getStaffTaskView();
                            }
                        })
                          
                    }


                    self.goToPage = (event)=>{
                        self.router.go({path:'tasks'})
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
        return  Task;
    }
);