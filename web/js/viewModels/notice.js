define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider","ojs/ojlistdataproviderview","ojs/ojdataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable","ojs/ojactioncard","ojs/ojavatar"], 
    function (oj,ko,$, app, ArrayDataProvider,ListDataProviderView, ojdataprovider_1, FilePickerUtils) {

        class Notice {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = sessionStorage.getItem("BaseURL")
                //let userId = sessionStorage.getItem("BaseURL")
                
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

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
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
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            data = JSON.parse(data[0]);
                            console.log(data)
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
                                url: BaseURL+"/HRModuleAddNotice",
                                type: 'POST',
                                data: JSON.stringify({
                                    notice_name: self.subject(),            
                                    notice_description: self.description(),
                                    userId: sessionStorage.getItem("userId"),
                                }),
                                dataType: 'json',
                                timeout: sessionStorage.getItem("timeInetrval"),
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
                    sessionStorage.setItem("noticeId", clickedNoticeId);
                    document.querySelector('#openEditNotice').open();
                    self.getNoticeInfo();
                }

                self.getNoticeInfo = () => {
                    $.ajax({
                        url: BaseURL + "/HRModuleGetNoticeInfo",
                        type: 'POST',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            noticeId: sessionStorage.getItem("noticeId")
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
                        timeout: sessionStorage.getItem("timeInetrval"),
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
                                    noticeId: sessionStorage.getItem("noticeId"),
                                    notice_name : self.editNoticeName(),
                                    notice_description : self.editNoticeDescription(),
                                }),
                                dataType: 'json',
                                timeout: sessionStorage.getItem("timeInetrval"),
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
                                userId: sessionStorage.getItem("userId"),
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,

                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },

                            success: function (data) {
                                data = JSON.parse(data[0]);
                                //console.log(data)
                                //console.log(data);
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
                    self.TaskList = new ArrayDataProvider(self.TaskDet, { keyAttributes: "id" });
                    

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