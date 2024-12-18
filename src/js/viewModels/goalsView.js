define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", "ojs/ojlistdataproviderview", "ojs/ojdataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable","ojs/ojlistitemlayout"], 
    function (oj,ko,$, app, ArrayDataProvider, ListDataProviderView, ojdataprovider_1, FilePickerUtils) {

        class MyGoalsView {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = localStorage.getItem("BaseURL")
                let userrole = localStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);

                self.connected = function () {
                    if (localStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getGoal();

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

                self.goalSubject = ko.observable();
                self.description = ko.observable();
                self.startDate = ko.observable('');
                self.endDate = ko.observable('');
                self.staffComments = ko.observable('');
                self.status = ko.observable('');
                self.adminComments = ko.observable('');
                self.adminStatus = ko.observable('');
                self.GoalDet = ko.observableArray([]); 
                self.CancelBehaviorOpt = ko.observable('icon'); 

                self.getGoal = () => {
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetMyGoal",
                        type: 'POST',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({ goalId: localStorage.getItem("goalId") }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (response) {
                            document.getElementById('loaderView').style.display = 'none';
                            document.getElementById('actionView').style.display = 'block';
                
                            if (response.goal_details && response.goal_details.length > 0) {
                                let goal = response.goal_details[0]; // Assuming you want to display the first goal
                                self.goalSubject(goal[1]);
                                self.description(goal[2]);
                                self.startDate(goal[3]);
                                self.endDate(goal[4]);
                                self.status(goal[5]);
                                self.staffComments(goal[7]);
                                self.adminComments(goal[8]);
                                self.adminStatus(goal[6]);
                            } else {
                                console.log('No goal details found.');
                            }
                        }
                    });
                };
                         
                self.goalSubject2 = ko.observable();
                self.description2 = ko.observable();
                self.startDate2 = ko.observable('');
                self.endDate2 = ko.observable('');
                self.staffComments2 = ko.observable('');
                self.status2 = ko.observable('');
                self.adminComments2 = ko.observable('');
                self.adminStatus2 = ko.observable('');

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

                self.statusList2 = ko.observableArray([]);
                self.statusList2.push(
                    {"label":"Pending","value":"Pending"},
                    {"label":"Under Review","value":"Under Review"},
                    {"label":"Approve","value":"Approve"},
                    {"label":"Reject","value":"Reject"},
                );
                self.statusList2 = new ArrayDataProvider(self.statusList2, {
                    keyAttributes: 'value'
                }); 

                self.editGoal = (event,data)=>{
                    document.querySelector('#openEditGoal').open();
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetEmployeeGoalInfoEdit",
                        type: 'POST',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            goalId: localStorage.getItem("goalId")
                        }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (result) {
                            console.log(result)
                            if(result[0].length !=0){ 
                                document.getElementById('loaderView').style.display='none';
                                var data = JSON.parse(result[0]);
                                console.log(data)
                                self.goalSubject2(data[0][1])
                                self.description2(data[0][2])
                                self.startDate2(data[0][3])
                                self.endDate2(data[0][4])
                                self.status2(data[0][5])
                                self.adminStatus2(data[0][6])                                
                            }
                        }
                    })
                }

                self.formEditSubmit = (event,data)=>{
                    const formValid = self._checkValidationGroup("formValidationEdit"); 
                    if (formValid) {
                        let popup = document.getElementById("loaderPopup");
                        popup.open();
                        
                        $.ajax({
                            url: BaseURL+"/HRModuleReviewGoalStatusUpdate",
                            type: 'POST',
                            data: JSON.stringify({
                                goalId :  localStorage.getItem("goalId"),
                                goalSubject : self.goalSubject2(),
                                description : self.description2(),
                                startDate : self.startDate2(),
                                endDate : self.endDate2(),
                                status : self.status2(),
                                admin_status : self.adminStatus2(),
                                staff_comments : self.staffComments2(),
                                admin_comments : self.adminComments2(),
                            }),
                            dataType: 'json',
                            timeout: localStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                document.querySelector('#openEditGoal').close();
                                let popup = document.getElementById("loaderPopup");
                                popup.close();
                                let popup2 = document.getElementById("successView");
                                popup2.open();
                            }
                        })
                    }
                }

                self.deleteGoal = ()=>{
                    document.querySelector('#confirmPopup').open();
                }

                self.submitDelete = (event,data)=>{
                    let popup2 = document.getElementById("confirmPopup");
                    popup2.close(); 
                    $.ajax({
                        url: BaseURL+"/HRModuleDeleteMyGoal",
                        type: 'POST',
                        data: JSON.stringify({
                            goalId :  localStorage.getItem("goalId"),
                        }),
                        dataType: 'json',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            let popup2 = document.getElementById("confirmPopup");
                            popup2.close();
                            let popup3 = document.getElementById("successView2");
                            popup3.open();
                            self.router.go({path:'goals'})
                        }
                    })
                }

                self.commentsArray = ko.observableArray([]);

                self.viewMyComments = () => {
                    document.querySelector('#viewMyComments').open();
                    document.getElementById('loaderView').style.display = 'block';
                
                    $.ajax({
                        url: BaseURL + "/HRModuleGetMyGoalComments",
                        type: 'POST',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            goalId: localStorage.getItem("goalId")
                        }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (result) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(result);
                
                            if (result && result.comments && result.comments.length > 0) {
                                self.commentsArray([]);
                                for (var i = 0; i < result.comments.length; i++) {
                                    self.commentsArray.push({
                                        'id': result.comments[i][0],        // Extracting id
                                        'comment': result.comments[i][1],   // Extracting comment
                                        'created_at': result.comments[i][2] // Extracting created_at
                                    });
                                }
                            } 
                        },
                    });
                };
                
                self.commentsDataProvider = new ArrayDataProvider(self.commentsArray, { keyAttributes: 'id' });

                self.commentsArray2 = ko.observableArray([]);

                self.viewAdminComments = () => {
                    document.querySelector('#viewAdminComments').open();
                    document.getElementById('loaderView').style.display = 'block';
                
                    $.ajax({
                        url: BaseURL + "/HRModuleGetAdminGoalComments",
                        type: 'POST',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            goalId: localStorage.getItem("goalId")
                        }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (result) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(result);
                
                            if (result && result.comments && result.comments.length > 0) {
                                self.commentsArray2([]);
                                for (var i = 0; i < result.comments.length; i++) {
                                    self.commentsArray2.push({
                                        'id': result.comments[i][0],        // Extracting id
                                        'comment': result.comments[i][1],   // Extracting comment
                                        'created_at': result.comments[i][2] // Extracting created_at
                                    });
                                }
                            } 
                        },
                    });
                };
                
                self.commentsDataProvider2 = new ArrayDataProvider(self.commentsArray2, { keyAttributes: 'id' });
                
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
        return  MyGoalsView;
    }
);