define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable"], 
    function (oj,ko,$, app, ArrayDataProvider, FilePickerUtils) {

        class GoalsSettings {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = sessionStorage.getItem("BaseURL")

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getGoalMonth();
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
                
                self.month = ko.observable();
                self.monthDet = ko.observableArray([]);
                
                self.monthDet.push(
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
                self.Month_List = new ArrayDataProvider(self.monthDet, {
                    keyAttributes: 'value'
                });

                self.getGoalMonth = () => {
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetGoalMonth",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log("Error fetching Goal month:", textStatus); // Log any error
                            reject(textStatus);
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            self.month(data[0][0][0]);
                        }
                    });
            }; 

                self.formSubmit = () => {
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid) {
                        let popup = document.getElementById("loaderPopup");
                        popup.open();
                
                        $.ajax({
                            url: BaseURL + "/HRModuleAddGoalMonth",
                            type: 'POST',
                            data: JSON.stringify({
                                month: self.month(),
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


            }
        }
        return  GoalsSettings;
    }
);