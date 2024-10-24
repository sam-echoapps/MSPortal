define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable", "ojs/ojinputnumber"], 
    function (oj,ko,$, app, ArrayDataProvider, FilePickerUtils) {

        class POSettings {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = sessionStorage.getItem("BaseURL")

                self.lineManager = ko.observable('');
                self.limitError = ko.observable('');
                self.numError = ko.observable('');

                self.currency = ko.observable('');
                self.currencies = [
                    {"label":"USD","value":"USD"},
                    {"label":"INR","value":"INR"},
                    {"label":"GBP","value":"GBP"},
                    {"label":"AED","value":"AED"}
                ]

                self.currencyList = new ArrayDataProvider(self.currencies, {
                    keyAttributes: 'value'
                });

                self.CancelBehaviorOpt = ko.observable('icon'); 
                self.actionCheck = ko.observable(''); 

                self.currencyFormSubmit = ()=>{
                    console.log('function called');
                            let popup = document.getElementById("loaderPopup");
                            popup.open();
                            
                            $.ajax({
                                url: BaseURL+"/HRModuleAddCurrency",
                                type: 'POST',
                                data: JSON.stringify({
                                    currency : self.currency(),
                                }),
                                dataType: 'json',
                                timeout: sessionStorage.getItem("timeInetrval"),
                                context: self,
                                error: function (xhr, textStatus, errorThrown) {
                                    console.log(textStatus);
                                },
                                success: function (data) {
                                    console.log(data)
                                    document.querySelector('#openAddCurrency').close();
                                    let popup = document.getElementById("loaderPopup");
                                    popup.close();
                                    let popup1 = document.getElementById("successView2");
                                    popup1.open();
                                }
                            })
                    }

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getPurchaseOrderLimit();

                        var elem = document.querySelector('input[type="range"]');

                        var rangeValue = function(){
                        var newValue = elem.value;
                        var target = document.querySelector('.value');
                        target.innerHTML = newValue;
                        self.lineManager(newValue)
                        }
        
                        elem.addEventListener("input", rangeValue);

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
                self.messageClose2 = ()=>{
                    location.reload();
                }
                
                self.addCurrency = ()=>{
                    document.querySelector('#openAddCurrency').open();
                    self.getCurrency()
                }

                self.getCurrency = ()=>{
                    $.ajax({
                        url: BaseURL + "/HRModuleGetCurrencyType",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log("Error:", textStatus); 
                            reject(textStatus);
                        },
                        success: function (data) {
                            if(data[0][0] !=''){
                                self.actionCheck('No')
                            }
                            self.currency(data[0][0])
                        }
                    });
                }

                self.purchaseLimitFill = (event)=>{
                    var ASCIICode= event.detail.value
                    var check = /^\d+(\.\d+)?$/.test(ASCIICode);
                    //console.log(check)
                    if (check == true){
                        self.numError('')
                    }else{
                        self.numError("Please enter a number. Decimals are allowed (e.g., 12.34).");
                    }
                    var newValue = self.lineManager();
                    var target = document.querySelector('.value');
                    target.innerHTML = newValue;
                    if(newValue>50000){
                        self.limitError('Limit Exceeded');
                    }else{
                        self.limitError('')
                    }
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
            

                self.getPurchaseOrderLimit = () => {
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetPurchaseOrderLimit",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log("Error:", textStatus); 
                            reject(textStatus);
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            //console.log(data);
                            var elem = document.querySelector('input[type="range"]');
                            elem.value= data[0][0][0];
                            self.lineManager(data[0][0][0]);
                        }
                    });
            }; 

                self.formSubmit = () => {
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid && self.limitError() == '' && self.numError() == '') {
                        let popup = document.getElementById("loaderPopup");
                        popup.open();
                
                        $.ajax({
                            url: BaseURL + "/HRModuleAddPurchaseLimit",
                            type: 'POST',
                            data: JSON.stringify({
                                lineManager: self.lineManager(),
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
        return  POSettings;
    }
);

