define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojinputtext", "ojs/ojformlayout", 
    "ojs/ojvalidationgroup", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojavatar"], 
    function (oj,ko,$, app) {

        class SignIn {
            constructor() {
                var self = this;

                self.username = ko.observable();
                self.password = ko.observable();
                self.formValid = ko.observable();
                self.SignIn = ko.observable();
                self.logo = ko.observable('');
                self.companyLogoShow = ko.observable();

                self.logout = ()=>{
                    sessionStorage.clear();
                }
                self.logout()

                self.signIn = ()=>{
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid) {
                        let popup = document.getElementById("popup1");
                        popup.open();
                        $.ajax({
                            //url: "/HRModuleLogin", 
                            url: "http://65.0.111.226:8050/HRModuleLogin",
                            type: 'POST',
                            data: JSON.stringify({
                                user: self.username(),
                                passwd : self.password()
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                let popup = document.getElementById("popup1");
                                popup.close();
                                self.username('')
                                self.password('')
                                let popup1 = document.getElementById("errorLog");
                                popup1.open();
                            },
                            success: function (data) {
                                console.log(data);
                                if (data[1]== 'Y') {
                                    //sessionStorage.setItem("BaseURL", "");
                                    sessionStorage.setItem("BaseURL", "http://65.0.111.226:8050");
                                    sessionStorage.setItem("userId", data[2]);
                                    sessionStorage.setItem("staffId", data[2]);
                                    sessionStorage.setItem("userName", data[3]);
                                    sessionStorage.setItem("userRole", data[4]);
                                    sessionStorage.setItem("loginedUser", data[5]);
                                    self.SignIn('Y');
                                    app.onLoginSuccess();
                                }
                                if(data[1]=='N'){
                                    let popup1 = document.getElementById("popup1");
                                    popup1.close();
                                    self.username('')
                                    self.password('')
                                    let popup = document.getElementById("errorLog");
                                    popup.open();
                                }
                            }
                        })
                    }
                }

                self.LoginMsgOKClose = ()=>{
                    let popup = document.getElementById("errorLog");
                    popup.close();
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

                self.connected = function () {
                    self.getCompanyDetails();
                };

                self.getCompanyDetails = ()=>{
                    $.ajax({
                        //url: "/HRModuleGetCompanyInfo", 
                        url: "http://65.0.111.226:8050//HRModuleGetCompanyInfo",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display='none';
                            document.getElementById('contentView').style.display='block';
                            if(data[1] != ''){
                                self.logo('yes')
                                self.companyLogoShow('data:image/jpeg;base64,'+data[1]);
                            } else{
                                self.logo('no')
                            }
                        }
                    })
                }
            }
        }
        return  SignIn;
    }
);