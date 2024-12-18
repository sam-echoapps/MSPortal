define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider","ojs/ojlistdataproviderview","ojs/ojdataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable","ojs/ojactioncard","ojs/ojavatar"], 
    function (oj,ko,$, app, ArrayDataProvider,ListDataProviderView, ojdataprovider_1, FilePickerUtils) {

        class Notice {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = localStorage.getItem("BaseURL")
                
                self.subject = ko.observable();
                self.description = ko.observable();
                self.NoticeDet = ko.observableArray([]);
                self.CancelBehaviorOpt = ko.observable('icon'); 
                self.editNoticeName = ko.observable('');
                self.editNoticeDescription = ko.observable('');

                self.selectedTab = ko.observable("allNotice"); 

                self.TaskDet = ko.observableArray([]);

                self.tabData = [
                    { id: "allNotice", label: "All Notifications" },
                    { id: "companyNotice", label: "Company Notice" },
                ];

                let userrole = localStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);

                self.notificationCount = ko.observable(0); 

                self.getNotificationCount = function() {
                    self.notificationCount(0);
                    $.ajax({
                    url: BaseURL+"/HRModuleGetStaffAllNotificationCount",
                    type: 'POST',
                    data: JSON.stringify({
                    userId: localStorage.getItem("userId"),
                    }),
                    dataType: 'json',
                    timeout: localStorage.getItem("timeInetrval"),
                    context: self,
                    
                    error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    },
                    success: function (data) {
                    count = JSON.parse(data);
                    console.log('count from notice add', count);
                    self.notificationCount(count);
                    //localStorage.setItem("notificationCount", count);
                    }  
                    });
                    }
                
                self.connected = function () {
                    if (localStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getStaffNoticeView();
                        self.getStaffNoticeViewAllNoification();
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

                self.selectedTabAction1 = ko.computed(() => { 
                    if(self.selectedTab() == 'allNotice'){
                        $("#allNotice").show();
                        $("#companyNotice").hide();
                    }else if(self.selectedTab() == 'companyNotice'){
                        $("#allNotice").hide();
                        self.getStaffNoticeView();
                        $("#companyNotice").show();
                    }
                    });

                self.getStaffNoticeView = ()=>{    // for Company Notice table
                    self.NoticeDet([]);
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetStaffNoticeList",
                        type: 'GET',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            data = JSON.parse(data[0]);
                            //console.log(data)
                            document.getElementById('loaderView').style.display='none';
                            document.getElementById('actionView').style.display='block';
                            if(data.length!=0){
                            for (var i = 0; i < data.length; i++) {
                                self.NoticeDet.push({
                                    'slno': i+1,
                                    'id': data[i][0],                                    
                                    'notice_name': data[i][1],
                                    'notice_description': data[i][2], 
                                    'created_date': data[i][3],
                                });
                            }
                            
                             }
                        }  
                    });
                }
                self.noticeCloseButtonLoadCompanyNotice = () => {  // for Company Notice table without read update
                    self.NoticeDet([]);
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetStaffNoticeCloseButtonLoadCompanyNotice",
                        type: 'GET',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            data = JSON.parse(data[0]);
                            //console.log(data)
                            document.getElementById('loaderView').style.display='none';
                            document.getElementById('actionView').style.display='block';
                            if(data.length!=0){
                            for (var i = 0; i < data.length; i++) {
                                self.NoticeDet.push({
                                    'slno': i+1,
                                    'id': data[i][0],                                    
                                    'notice_name': data[i][1],
                                    'notice_description': data[i][2], 
                                    'created_date': data[i][3],
                                });
                            }
                            
                             }
                        }  
                    });
                } 

                self.NoticeList = new ArrayDataProvider(this.NoticeDet, { keyAttributes: "id"});
                self.filter = ko.observable('');

                self.NoticeList = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filter() && this.filter() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filter() }
                        });
                    }
                    const arrayDataProvider = new ArrayDataProvider(self.NoticeDet, { 
                        keyAttributes: 'id',
                        sortComparators: {
                            comparators: new Map().set("dob", this.comparator),
                        },
                    });

                    return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
                }, self);

                self.handleValueNotice = () => {
                    self.filter(document.getElementById('filter').rawValue);
                };

                self.lessCount = ko.observable('');
                self.inputLength = ko.observable('');
                self.getInputCount = (event)=>{

                    const inputValue = event.detail.value;
                    const length = inputValue ? inputValue.length : 0;           
                    self.inputLength(length);
                    //console.log(length);

                    if (length > 350) {
                        self.lessCount('Max. characters is 350');
                    } else {
                        self.lessCount(''); 
                    }
                }

                self.formSubmit = ()=>{
                    
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid && self.lessCount()=='') {
                            let popup = document.getElementById("loaderPopup");
                            popup.open();
                            
                            $.ajax({
                                url: BaseURL+"/HRModuleAddNotice",
                                type: 'POST',
                                data: JSON.stringify({
                                    notice_name: self.subject(),            
                                    notice_description: self.description(),
                                    userId: localStorage.getItem("userId"),
                                }),
                                dataType: 'json',
                                timeout: localStorage.getItem("timeInetrval"),
                                context: self,
                                error: function (xhr, textStatus, errorThrown) {
                                    console.log(textStatus);
                                },
                                success: function (data) {
                                    console.log(data)
                                    document.querySelector('#openAddNotice').close();
                                    let popup = document.getElementById("loaderPopup");
                                    popup.close();
                                    let popup1 = document.getElementById("successView");
                                    popup1.open();
                                }
                            })
                        }
                    }

                    self.messageClose = ()=>{
                        //location.reload();
                        self.noticeCloseButtonLoadCompanyNotice();
                        self.getStaffNoticeCloseButtonLoadAllNoification();
                        self.getNotificationCount();
                        let successPopup = document.getElementById("successView");
                        successPopup.close(); 
                        let updatePopup = document.getElementById("updateSuccessView");
                        updatePopup.close(); 
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
 
                self.addNotice = ()=>{
                    document.querySelector('#openAddNotice').open();
                }
                self.messageClose5 = ()=>{
                    self.getStaffNoticeView();
                    let successPopup = document.getElementById("successView3");
                    
                    successPopup.close();
                } 

                self.goToEditNotice = (event,data)=>{
                    console.log(data)
                    var clickedNoticeId = data.item.data.id
                    localStorage.setItem("noticeId", clickedNoticeId);
                    document.querySelector('#openEditNotice').open();
                    self.getNoticeInfo();
                }

                self.getNoticeInfo = () => {
                    $.ajax({
                        url: BaseURL + "/HRModuleGetNoticeInfo",
                        type: 'POST',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            noticeId: localStorage.getItem("noticeId")
                        }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            data = JSON.parse(data[0]);
                            console.log(data);
                            self.editNoticeName(data[1])
                            self.editNoticeDescription(data[2])
                        }
                    });
                };

                self.deleteNotice = (event, data) => {
                    var noticeId = data.item.data.id; 
                    console.log(noticeId)
                    $.ajax({
                        url: BaseURL + "/HRModuleDeleteNotice",
                        type: 'POST',
                        data: JSON.stringify({
                            noticeId: noticeId
                        }),
                        dataType: 'json',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            let successPopup = document.getElementById("successView3");
                            successPopup.open();
                        }
                    });  
                };


                self.formSubmitUpdate = ()=>{
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid) {
                            let popup = document.getElementById("loaderPopup");
                            popup.open();
                            
                            $.ajax({
                                url: BaseURL+"/HRModuleUpdateNotice",
                                type: 'POST',
                                data: JSON.stringify({
                                    noticeId: localStorage.getItem("noticeId"),
                                    notice_name : self.editNoticeName(),
                                    notice_description : self.editNoticeDescription(),
                                }),
                                dataType: 'json',
                                timeout: localStorage.getItem("timeInetrval"),
                                context: self,
                                error: function (xhr, textStatus, errorThrown) {
                                    console.log(textStatus);
                                },
                                success: function (data) {
                                    console.log(data)
                                    document.querySelector('#openEditNotice').close();
                                    let popup = document.getElementById("loaderPopup");
                                    popup.close();
                                    let popup1 = document.getElementById("updateSuccessView");
                                    popup1.open();
                                }
                            })
                        }
                    }

                    self.getStaffNoticeViewAllNoification = () => {  //for All notification table
                        self.TaskDet([]);
                        document.getElementById('loaderView').style.display = 'block';
                        $.ajax({
                            url: BaseURL + "/HRModuleGetStaffAllNotice",
                            type: 'POST',
                            data: JSON.stringify({
                                userId: localStorage.getItem("userId"),
                            }),
                            dataType: 'json',
                            timeout: localStorage.getItem("timeInetrval"),
                            context: self,

                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },

                            success: function (data) {
                                data = JSON.parse(data[0]);
                                //console.log(data)
                                document.getElementById('loaderView').style.display='none';
                                document.getElementById('actionView').style.display='block';
                                if(data.length!=0){
                                 for (var i = 0; i < data.length; i++) {
                                            self.TaskDet.push({
                                                'slno': i + 1,
                                                'id': data[i][1], 
                                                'category': data[i][2],
                                                'subject': data[i][3],
                                                'description': data[i][4]
                                            });
                                        }
                                    }
                                    }  
                                })
                            }  
                            self.getStaffNoticeCloseButtonLoadAllNoification = () => {  //for All notification table without read update
                                self.TaskDet([]);
                                document.getElementById('loaderView').style.display = 'block';
                                $.ajax({
                                    url: BaseURL + "/HRModuleGetStaffNoticeCloseButtonLoadAllNoification",
                                    type: 'POST',
                                    data: JSON.stringify({
                                        userId: localStorage.getItem("userId"),
                                    }),
                                    dataType: 'json',
                                    timeout: localStorage.getItem("timeInetrval"),
                                    context: self,     
                                    error: function (xhr, textStatus, errorThrown) {
                                        console.log(textStatus);
                                    },     
                                    success: function (data) {
                                        data = JSON.parse(data[0]);
                                        document.getElementById('loaderView').style.display='none';
                                        document.getElementById('actionView').style.display='block';
                                        if(data.length!=0){
                                         for (var i = 0; i < data.length; i++) {
                                                    self.TaskDet.push({
                                                        'slno': i + 1,
                                                        'id': data[i][1], 
                                                        'category': data[i][2],
                                                        'subject': data[i][3],
                                                        'description': data[i][4]
                                                    });
                                                }}}  
                                        })
                                    }                         
                    self.TaskList = new ArrayDataProvider(self.TaskDet, { keyAttributes: "id" });
                    
                    self.filter2 = ko.observable('');
                    
                    self.TaskList = ko.computed(function () {
                        let filterCriterion = null;
                        if (self.filter2() && this.filter2() != '') {
                            filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                                filterDef: { text: self.filter2() }
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
        return  Notice;
    }
);

// code after merging