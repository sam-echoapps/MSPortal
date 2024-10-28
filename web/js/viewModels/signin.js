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
                    localStorage.clear();
                }
                self.logout()

                self.signIn = ()=>{
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid) {
                        let popup = document.getElementById("popup1");
                        popup.open();
                        $.ajax({
                            // url: "/Hr/HRModuleLogin", 
                            // url: "/HRModuleLogin", 
                            url: "http://65.0.111.226:8050/HRModuleLogin",
                            type: 'POST',
                            data: JSON.stringify({
                                user: self.username(),
                                passwd : self.password()
                            }),
                            dataType: 'json',
                            timeout: localStorage.getItem("timeInetrval"),
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
                                    // localStorage.setItem("BaseURL", "/Hr");
                                    // localStorage.setItem("BaseURL", "");
                                    localStorage.setItem("BaseURL", "http://65.0.111.226:8050");
                                    localStorage.setItem("userId", data[2]);
                                    localStorage.setItem("staffId", data[2]);
                                    localStorage.setItem("userName", data[3]);
                                    localStorage.setItem("userRole", data[4]);
                                    localStorage.setItem("loginedUser", data[5]);
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

                };

                self.getCompanyDetails = ()=>{
                    $.ajax({
                        // url: "/Hr/HRModuleGetCompanyInfo",
                        // url: "/HRModuleGetCompanyInfo",
                        url: "http://65.0.111.226:8050//HRModuleGetCompanyInfo",
                        type: 'GET',
                        timeout: localStorage.getItem("timeInetrval"),
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
        return  SignIn;
    }
);