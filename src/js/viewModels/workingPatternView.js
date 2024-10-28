define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider",
    "ojs/ojfilepickerutils","ojs/ojconverter-datetime", "ojs/ojconverterutils-i18n",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable","ojs/ojcheckboxset","ojs/ojradioset","ojs/ojselectcombobox"], 
    function (oj,ko,$, app, ArrayDataProvider, FilePickerUtils, ojconverter_datetime_1,ojconverterutils_i18n_1) {

        class WorkPattern {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = localStorage.getItem("BaseURL")
                let userrole = localStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);
                
                self.CancelBehaviorOpt = ko.observable('icon'); 

                self.connected = function () {
                    if (localStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getPattern();
                        self.getWorkDetails();

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

                self.patternDet = ko.observableArray([]);

                self.getPattern = () => {
                    self.patternDet([]); // Clear the existing data
                    document.getElementById('loaderView').style.display = 'block';
                    
                    $.ajax({
                        url: BaseURL + "/HRModuleGetWorkingPatternTime",
                        type: 'POST',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({ patternId: localStorage.getItem("patternId") }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },

                        success: function (data) {
                            document.getElementById('table_view').style.display = 'block';
                            console.log(data);
                            document.getElementById('loaderView').style.display = 'none';
                            if (data[0].length != 0) {
                                for (var i = 0; i < data[0].length; i++) {
                                    self.patternDet.push({
                                        'no': i + 1,
                                        'id': data[0][i][0],
                                        'day': data[0][i][1],
                                        'start_time': data[0][i][2],
                                        'finish_time': data[0][i][3],
                                        'break_time': data[0][i][4]
                                    });
                                }
                            }
                        }
                    });
                }
                
                self.workData = new ArrayDataProvider(self.patternDet, { keyAttributes: "id" });

                self.timeConverter = ko.observable(new ojconverter_datetime_1.IntlDateTimeConverter({
                    minute: "2-digit",
                    hour: "2-digit",
                    hour12: false,
                }))

                self.breakTimeError = ko.observable('');

                self.PatternValidator = (event) => {
                    var break_time = event.detail.value.toString();  // Convert to string
                    
                    var pattern = /^([1-9]\d*|0)$/;
                
                    if (break_time.match(pattern)) {
                        self.breakTimeError(''); // Clear any previous error
                    } else {
                        self.breakTimeError('Invalid break time. Only digits allowed and must not start with zero unless it is just "0".');
                    }
                };
                     
                self.start_time = ko.observable();
                self.finish_time = ko.observable();
                self.break_time = ko.observable();

                self.edit = (event, data) => {
                    var clickedTimeId = data.item.data.id;
                    localStorage.setItem("timeId", clickedTimeId);
                    self.getTimeDetails(clickedTimeId);
                    document.querySelector('#openEditTime').open();
                }

                self.getTimeDetails = (timeId) => {
                    if (!timeId) {
                        return;
                    }
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetPatternTimeDetails",
                        type: 'POST',
                        data: JSON.stringify({ id: timeId }), // Send team ID as a parameter
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            if (data[0] && data[0][0]) {
                                self.start_time(data[0][1]);
                                self.finish_time(data[0][2]);
                                self.break_time(data[0][3]);
                                document.querySelector('#openEditTime').open(); // Open the edit popup after data is fetched
                            }
                        }
                    });
                };

                self.formSubmit = ()=>{
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid) {
                        let popup = document.getElementById("popup1");
                        popup.open();
                        
                        $.ajax({
                            url: BaseURL+"/HRModuleAddPatternTime",
                            type: 'POST',
                            data: JSON.stringify({
                                time_id: localStorage.getItem("timeId"),
                                start_time : self.start_time(),
                                finish_time : self.finish_time(),
                                break_time : self.break_time(),
                            }),
                            dataType: 'json',
                            timeout: localStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                document.querySelector('#openEditTime').close();
                                let popup = document.getElementById("popup1");
                                popup.close();
                                let popup1 = document.getElementById("successView");
                                popup1.open();
                            }
                        })
                    }
                }
                
                self.pattern_Name = ko.observable();
                self.holiday = ko.observable();

                self.getWorkDetails = () => {
                    $.ajax({
                        url: BaseURL + "/HRModuleGetWorkPatternDetails",
                        type: 'POST',
                        data: JSON.stringify({ patternId: localStorage.getItem("patternId") }),
                        contentType: "application/json", 
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            console.log(data);
                            if (data[0] && data[0][0]) {
                                self.pattern_Name(data[0][0][1]);
                                self.holiday(data[0][0][2]);
                            }
                        }
                    });
                };

                self.formSubmit2 = ()=>{
                    const formValid = self._checkValidationGroup("formValidation2"); 
                    if (formValid) {
                        let popup = document.getElementById("popup1");
                        popup.open();
                        
                        $.ajax({
                            url: BaseURL+"/HRModuleEditWorkPattern",
                            type: 'POST',
                            data: JSON.stringify({
                                patternId: localStorage.getItem("patternId"),
                                pattern_Name : self.pattern_Name(),
                                holiday : self.holiday(),
                            }),
                            dataType: 'json',
                            timeout: localStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                let popup = document.getElementById("popup1");
                                popup.close();
                                let popup1 = document.getElementById("successView2");
                                popup1.open();
                            }
                        })
                    }
                }

                self.holiday_List = ko.observableArray([]);
                self.holiday_List.push(
                    {"label":"Not Deducted","value":"Not Deducted"},
                    {"label":"Deducted","value":"Deducted"},
                    {"label":"Work Public Holidays","value":"Work Public Holidays"}
                );
                self.holiday_List = new ArrayDataProvider(self.holiday_List, {
                    keyAttributes: 'value'
                });

                self.rowIdToDelete = ko.observable();

                self.deletePattern = (event, data) => {
                    self.rowIdToDelete(data.item.data.id);
                    document.querySelector('#confirmPopup').open();
                };
                
                self.submitDelete = ()=>{
                    let popup2 = document.getElementById("confirmPopup");
                    popup2.close();
                    var rowId = self.rowIdToDelete(); // Get the stored row ID
                    $.ajax({
                        url: BaseURL+"/HRModuleDeleteWorkPatternTiming",
                        type: 'POST',
                        data: JSON.stringify({
                            patternId : rowId
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
                            location.reload();
                        }
                    })
                }

                self.back = ()=>{
                    self.router.go({path:'workingPattern'})
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
        return  WorkPattern;
    }
);