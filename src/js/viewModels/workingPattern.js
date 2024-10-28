define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider",
    "ojs/ojfilepickerutils","ojs/ojconverter-datetime", "ojs/ojconverterutils-i18n",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable","ojs/ojcheckboxset","ojs/ojradioset"], 
    function (oj,ko,$, app, ArrayDataProvider, FilePickerUtils, ojconverter_datetime_1) {

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
                        self.getPatternName();
                        self.getPatternDefault();

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

                self.pattern_Name = ko.observable();
                self.make_Default = ko.observable("No");
                self.holiday = ko.observable("Not Deducted");

                self.addPattern = ()=>{
                    document.querySelector('#openAddPattern').open();
                }

                self.formSubmit = ()=>{
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid) {
                        let popup = document.getElementById("popup");
                        popup.open();
                        
                        $.ajax({
                            url: BaseURL+"/HRModuleNewPattern",
                            type: 'POST',
                            data: JSON.stringify({
                                pattern_Name : self.pattern_Name(),
                                make_Default : self.make_Default(),
                                holiday : self.holiday(),
                            }),
                            dataType: 'json',
                            timeout: localStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                document.querySelector('#openAddPattern').close();
                                let popup = document.getElementById("popup");
                                popup.close();
                                let popup1 = document.getElementById("successView");
                                popup1.open();
                            }
                        })
                    }
                }

                self.patternDet = ko.observableArray([]);

                self.getPattern = () => {
                    //self.patternDet([]); // Clear the existing data
                    document.getElementById('loaderView').style.display = 'block';
                    
                    $.ajax({
                        url: BaseURL + "/HRModuleGetWorkingPattern",
                        type: 'GET',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
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
                                        'pattern_name': data[0][i][1],
                                        'days': data[0][i][2],
                                        'count': data[0][i][3]
                                    });
                                }
                            }
                        }
                    });
                }
                
                self.patternData = new ArrayDataProvider(self.patternDet, { keyAttributes: "id" });

                self.edit = (event,data)=>{
                    var rowId = data.item.data.id
                    localStorage.setItem("patternId", rowId);
                    self.router.go({path:'workingPatternView'})
                }

                self.Patterns = ko.observable();
                self.PatternsDet = ko.observableArray([]);

                self.getPatternName = ()=>{
                    $.ajax({
                        url: BaseURL+"/HRModuleGetWorkPatternList",
                        type: 'GET',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            console.log(data)
                            if(data[0].length !=0){ 
                                for (var i = 0; i < data[0].length; i++) {
                                    self.PatternsDet.push({
                                        'value': data[0][i][0],
                                        'label': data[0][i][1]  
                                    });
                                }
                            }
                        }
                    })
                }
                self.PatternsList = new ArrayDataProvider(this.PatternsDet, { keyAttributes: "value"});

                self.getPatternDefault = () => {
                    $.ajax({
                        url: BaseURL + "/HRModuleGetWorkingPatternDefault",
                        type: 'GET',
                        contentType: "application/json",
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            console.log(data);
                            if (data[0] && data[0][0]) {
                                self.Patterns(data[0][0][0]);
                            }
                        }
                    });
                };

                self.formSubmit2 = ()=>{
                    const formValid = self._checkValidationGroup("formValidation2"); 
                    if (formValid) {
                        let popup = document.getElementById("popup");
                        popup.open();
                        
                        $.ajax({
                            url: BaseURL+"/HRModuleEditWorkPatternDefault",
                            type: 'POST',
                            data: JSON.stringify({
                                patternId: self.Patterns(),
                            }),
                            dataType: 'json',
                            timeout: localStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                let popup = document.getElementById("popup");
                                popup.close();
                                let popup1 = document.getElementById("successView2");
                                popup1.open();
                            }
                        })
                    }
                }

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
                        url: BaseURL+"/HRModuleDeleteWorkPattern",
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

                self.messageClose2 = () => {
                    $.ajax({
                        url: BaseURL + "/HRModuleGetLastPatternId",
                        type: 'GET',
                        dataType: 'json',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            var patternId = data.pattern_id;
                            localStorage.setItem("patternId", patternId);
                            self.router.go({path: 'workingPatternView'});
                        }
                    });
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