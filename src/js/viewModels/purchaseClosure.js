define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider","ojs/ojlistdataproviderview","ojs/ojdataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable","ojs/ojactioncard","ojs/ojavatar", "ojs/ojradioset","ojs/ojcheckboxset"], 
    function (oj,ko,$, app, ArrayDataProvider,ListDataProviderView, ojdataprovider_1, FilePickerUtils) {

        class PurchaseClosure {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = sessionStorage.getItem("BaseURL")
               
                self.itemName = ko.observable('');
              
                self.filter = ko.observable('');
                self.CancelBehaviorOpt = ko.observable('icon'); 
               
                self.userId = ko.observable(sessionStorage.getItem("userId"));
                self.poid = ko.observable();
                self.owner = ko.observable('');
                self.requestDate = ko.observable('');
                self.status = ko.observable('');
                self.billNumber = ko.observable('');
                self.guaranteeNumber = ko.observable('');
                self.warrentyEndDate = ko.observable('');
                self.totalAmount = ko.observable('');
                self.numError = ko.observable('');
                self.choiceList = ko.observableArray([]);  
                self.choiceList.push(
                    {'value' : 'Yes', 'label' : 'Yes'},
                    {'value' : 'No', 'label' : 'No'},  
                );
                self.choiceListDP = new ArrayDataProvider(self.choiceList, {keyAttributes: 'value'});
                self.have_guarantee = ko.observable('');
                self.have_guarantee_card = ko.observable('');
                self.cardSecondaryText = ko.observable('Please Upload(Mandatory)')
                self.billSecondaryText = ko.observable('Please Upload(Mandatory)')
                self.extraSecondaryText = ko.observable('Please Upload(Optional)')
                self.have_bill = ko.observable('');
                self.have_bill_attach = ko.observable('');
                self.notes = ko.observable('');
                self.lessCount = ko.observable(''); 
                self.inputLength = ko.observable('');
                self.have_warrenty = ko.observable('');
                self.warrentyReminder = ko.observable('');
                self.guaranteeFile = ko.observable('');
                self.guaranteeExist = ko.observable('');
                self.typeErrorBill = ko.observable('');
                self.billFile = ko.observable('');
                self.fileBill = ko.observable('');
                self.typeErrorGuarantee = ko.observable('');
                self.purchaseId = ko.observable(sessionStorage.getItem("purchaseId"));
                self.selectedOptions = ko.observable('No');
                self.billManadatory = ko.observable('');
                self.guaranteeManadatory = ko.observable('');
                self.billCheck = ko.observable('Yes');
                self.guaranteeCheck = ko.observable('Yes');
                self.warrentyCheck = ko.observable('Yes');
                self.fileContentBill = ko.observable('');
                self.fileGuarantee = ko.observable('');
                self.fileExtra = ko.observable('');
                self.extraFile = ko.observable('');
                self.typeErrorExtra = ko.observable('');
                self.offerFileMessage = ko.observable('');
                // Observable array for dynamic checkbox options
                self.checkboxOptions = ko.observableArray([
                  { value: 'Yes', label: 'GST Included' },
                ]);
                self.billExist = ko.observable('');
                self.extraExist = ko.observable('');
                self.updatedAt = ko.observable('');
                self.currency = ko.observable('');


                let userrole = sessionStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getPurchaseClosureInfo();
                        self.getCurrency();
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

                self.getPurchaseClosureInfo = () => {
                    $.ajax({
                        url: BaseURL + "/HRModuleGetPurchaseClosureInfo",
                        type: 'POST',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            purchaseId: sessionStorage.getItem("purchaseId")
                        }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (result) {
                            var data,data2;
                            data = JSON.parse(result[0]);
                            //console.log(data)
                            document.getElementById('loaderView').style.display='none';
                            self.poid("PO"+data[0])
                            self.itemName(data[2])
                            self.owner(data[3])
                            let date = new Date(data[4]);
                            // Get only the date part (YYYY-MM-DD)
                            let dateOnly = date.toISOString().slice(0, 10);
                            self.requestDate(dateOnly)
                            self.status(data[5])
                           
                            data2 = JSON.parse(result[1]);
                            console.log(data2)
                            self.have_bill(data2[2])
                            self.billNumber(data2[3])
                            self.have_bill_attach(data2[4])
                            self.billSecondaryText(data2[5])
                            if(data2[5] !=''){
                                self.billFile(data2[5])
                                self.billExist('Yes')
                            }
                            self.have_guarantee(data2[6])
                            self.guaranteeNumber(data2[7])
                            self.have_guarantee_card(data2[8])
                            self.cardSecondaryText(data2[9])
                            if(data2[9] !=''){
                                self.guaranteeFile(data2[9])
                                self.guaranteeExist('Yes')
                            }
                            self.have_warrenty(data2[10])
                            self.warrentyEndDate(data2[11])
                            self.warrentyReminder(data2[12]),
                            self.totalAmount(data2[13])
                            self.selectedOptions(data2[14])
                            self.extraSecondaryText(data2[15])
                            if(data2[15] !=''){
                                self.extraFile(data2[15])
                                self.extraExist('Yes')
                            }
                            self.notes(data2[16])
                            let dateUpdated = new Date(data2[18]);
                            // Get only the date part (YYYY-MM-DD)
                            let dateUpdatedOnly = dateUpdated.toISOString().slice(0, 10);
                            self.updatedAt(dateUpdatedOnly)
                        }
                    });
                };

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
                            self.currency(data[0][0])
                        }
                    });
                }

                self.priceValidate = (event)=>{
                    var ASCIICode= event.detail.value
                    console.log(ASCIICode)
                    var check = /^\d+(\.\d+)?$/.test(ASCIICode);
                    console.log(check)
                    if (check == true){
                        self.numError('')
                    }else{
                        self.numError("Please enter a number. Decimals are allowed (e.g., 12.34).");
                    }
                }

                self.guaranteeSec = function (event,data) {
                    if(self.have_guarantee()=='Yes'){ 
                        self.guaranteeCheck('Yes')
                        document.getElementById('guaranteeSec').style.display='block';
                        document.getElementById('guaranteeAttatchSec').style.display='block';
                    }else if(self.have_guarantee()=='No'){
                        self.guaranteeCheck('')
                        self.guaranteeNumber('')
                        self.have_guarantee_card('')
                        self.guaranteeFile('')
                        self.fileGuarantee('') 
                        self.cardSecondaryText('Please Upload(Mandatory)')
                        self.typeErrorGuarantee('')
                        document.getElementById('guaranteeSec').style.display='none';
                        document.getElementById('guaranteeAttatchSec').style.display='none';
                        document.getElementById('guaranteeFileSec').style.display='none';
                    }
                   
                }

                self.guaranteeCardSec = function (event,data) {
                    if(self.have_guarantee_card()=='Yes'){ 
                        document.getElementById('guaranteeFileSec').style.display='block';
                    }else if(self.have_guarantee_card()=='No'){
                        self.guaranteeFile('') 
                        self.fileGuarantee('')
                        self.cardSecondaryText('Please Upload(Mandatory)')
                        self.typeErrorGuarantee('')
                        document.getElementById('guaranteeFileSec').style.display='none';
                    }
                   
                }

                self.billNumSec = function (event,data) {
                    if(self.have_bill()=='Yes'){ 
                        self.billCheck('Yes')
                        document.getElementById('billSec').style.display='block';
                        document.getElementById('billAttatchSec').style.display='block';
                    }else if(self.have_bill()=='No'){
                        self.billNumber('')
                        self.have_bill_attach('')
                        self.billCheck('')
                        self.billFile('')
                        self.fileBill('') 
                        self.billSecondaryText('Please Upload(Mandatory)')
                        document.getElementById('billSec').style.display='none';
                        document.getElementById('billAttatchSec').style.display='none';
                        document.getElementById('billAttatchFileSec').style.display='none';
                    }
                   
                }

                self.billFileSec = function (event,data) {
                    if(self.have_bill_attach()=='Yes'){ 
                        document.getElementById('billAttatchFileSec').style.display='block';
                    }else if(self.have_bill_attach()=='No'){
                        self.billSecondaryText('Please Upload(Mandatory)')
                        document.getElementById('billAttatchFileSec').style.display='none';
                    }
                   
                }

                self.warrentySec = function (event,data) {
                    if(self.have_warrenty()=='Yes'){ 
                        self.warrentyCheck('Yes')
                        document.getElementById('warrentyEndSec').style.display='block';
                        document.getElementById('warrentyReminderSec').style.display='block';
                    }else if(self.have_warrenty()=='No'){
                        self.warrentyCheck('')
                        document.getElementById('warrentyEndSec').style.display='none';
                        document.getElementById('warrentyReminderSec').style.display='none';
                    }
                   
                }

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

                self.uploadGuarantee = function (event) {
                    var file = event.detail.files[0];
                    const result = event.detail.files;
                    const files = result[0];
                    var fileName= files.name;
                    //console.log(files)
                    self.guaranteeFile(fileName)
                    self.fileGuarantee(files)
                    self.cardSecondaryText(fileName)
                    var fileFormat =files.name.split(".");
                    var checkFormat =fileFormat[1];
                    if(checkFormat == 'png' || checkFormat =="jpeg" || checkFormat =="jpg" || checkFormat =="pdf"){
                    self.typeErrorGuarantee('')
                }
                else{
                    self.typeErrorGuarantee('The certificate must be a file of type: PNG, JPEG, JPG or PDF.')
                }
              }

              self.uploadBill = function (event) {
                var fileBill = event.detail.files[0];
                const resultBill = event.detail.files;
                const filesBill = resultBill[0];
                var fileNameBill= filesBill.name;
                //console.log(files)
                self.billFile(fileNameBill)
                self.fileBill(fileBill)
                self.billSecondaryText(fileNameBill)
                var fileFormatBill =filesBill.name.split(".");
                var checkFormatBill =fileFormatBill[1];
                if(checkFormatBill == 'png' || checkFormatBill =="jpeg" || checkFormatBill =="jpg" || checkFormatBill =="pdf"){
                self.typeErrorBill('')
            }
            else{
                self.typeErrorBill('The certificate must be a file of type: PNG, JPEG, JPG or PDF.')
            }
          }

          self.uploadExtra = function (event) {
            var fileExtra = event.detail.files[0];
            const resultExtra = event.detail.files;
            const filesExtra = resultExtra[0];
            var fileNameExtra= filesExtra.name;
            //console.log(files)
            self.extraFile(fileNameExtra)
            self.fileExtra(fileExtra)
            self.extraSecondaryText(fileNameExtra)
            var fileFormatExtra =fileExtra.name.split(".");
            var checkFormatExtra =fileFormatExtra[1];
            if(checkFormatExtra == 'png' || checkFormatExtra =="jpeg" || checkFormatExtra =="jpg" || checkFormatExtra =="pdf"){
            self.typeErrorExtra('')
        }
        else{
            self.typeErrorExtra('The certificate must be a file of type: PNG, JPEG, JPG or PDF.')
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

            self.formSubmit = () => {
                const formValid = self._checkValidationGroup("formValidation");
            
                // Validation for guarantee file
                if (self.have_guarantee() == 'Yes' && self.guaranteeFile() == '') {
                    self.guaranteeManadatory('Upload');
                } else {
                    self.guaranteeManadatory('');
                }
            
                // Validation for bill file
                if (self.have_bill_attach() == 'Yes' && self.billFile() == '') {
                    self.billManadatory('Upload');
                } else {
                    self.billManadatory('');
                }
               
                if (formValid && self.numError() == '' && self.typeErrorBill() == '' && self.typeErrorGuarantee() == '' && self.typeErrorExtra() == '' && self.billManadatory() == '' && self.guaranteeManadatory() == '') {
                    let popup = document.getElementById("loaderPopup");
                    popup.open();
            
                    const processFileUpload = (file, callback) => {
                        if (file != '') {
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = () => {
                                callback(reader.result);  // This will pass the file content as base64
                            };
                        } else {
                            callback(null);  // No file uploaded
                        }
                    };
            
                    // Process both files (bill and guarantee) asynchronously
                    processFileUpload(self.fileBill(), (billFileContent) => {
                        processFileUpload(self.fileGuarantee(), (guaranteeFileContent) => {
                            processFileUpload(self.fileExtra(), (extraFileContent) => {
            
                            // Send AJAX request with both files
                            $.ajax({
                                url: BaseURL + "/HRModuleSavePurchaseClosure",
                                type: 'POST',
                                data: JSON.stringify({
                                    purchaseId: sessionStorage.getItem("purchaseId"),
                                    have_bill: self.have_bill(),
                                    bill_number: self.billNumber(),
                                    have_bill_attach: self.have_bill_attach(),
                                    bill_file: self.billFile(),
                                    have_guarantee: self.have_guarantee(),
                                    guarantee_number: self.guaranteeNumber(),
                                    have_guarantee_card: self.have_guarantee_card(),
                                    guarantee_card_file: self.guaranteeFile(),
                                    have_warrenty: self.have_warrenty(),
                                    warrenty_end_date: self.warrentyEndDate(),
                                    warrenty_reminder: self.warrentyReminder(),
                                    total_amount: self.totalAmount(),
                                    tax_included: self.selectedOptions(),
                                    supporting_document : self.extraFile(),
                                    closure_notes: self.notes(),
                                    bill_file_content: billFileContent,
                                    guarantee_file_content: guaranteeFileContent,
                                    extra_file_content: extraFileContent  
                                }),
                                dataType: 'json',
                                timeout: sessionStorage.getItem("timeInetrval"),
                                context: self,
                                error: function (xhr, textStatus, errorThrown) {
                                    console.log(textStatus);
                                },
                                success: function (data) {
                                    console.log(data);
                                    popup.close();
                                    let popup1 = document.getElementById("successView");
                                    popup1.open();
                                }
                            });
                        });
                    });
                });
                }
            };
            

                self.messageClose = ()=>{
                    location.reload();
                }

                self.previewClick = (e) => {
                    e.preventDefault(); // Prevent the default anchor click behavior
                    const documentLink = e.target.closest('a').getAttribute('data-document-link');
                    console.log(documentLink); // Log the document link to verify
                
                    // // Display loader (optional)
                    // let popup = document.getElementById("loaderView");
                    // popup.open();
                
                    $.ajax({
                        url: BaseURL + "/HRModuleDocView",
                        type: 'POST',
                        data: JSON.stringify({
                            fileName: documentLink
                        }),
                        dataType: 'json',
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            // Hide loader (optional)
                            //let popup = document.getElementById("loaderView");
                            //popup.close();
                
                            var fileType = data[1];
                            var base64Code = data[0][0];
                            console.log(data);
                            if (fileType === "pdf") {
                                var byteCharacters = atob(base64Code);
                                var byteNumbers = new Array(byteCharacters.length);
                                for (var i = 0; i < byteCharacters.length; i++) {
                                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                                }
                                var byteArray = new Uint8Array(byteNumbers);
                                var blob = new Blob([byteArray], { type: 'application/pdf' });
                
                                var blobUrl = URL.createObjectURL(blob);
                                window.open(blobUrl, '_blank');
                            } else if (fileType === "jpeg" || fileType === "png") {
                                // Create a Blob for the image
                                var byteCharacters = atob(base64Code);
                                var byteNumbers = new Array(byteCharacters.length);
                                for (var i = 0; i < byteCharacters.length; i++) {
                                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                                }
                                var byteArray = new Uint8Array(byteNumbers);
                                var blob = new Blob([byteArray], { type: 'image/' + fileType });
                            
                                // Generate a URL for the Blob
                                var blobUrl = URL.createObjectURL(blob);
                            
                                // Open the image in a new tab
                                window.open(blobUrl, '_blank');
                            } else {
                                self.offerFileMessage("File not found");
                                setTimeout(() => {
                                    self.offerFileMessage("");
                                }, 3000);
                            }
                        }
                    });
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
        return  PurchaseClosure;
    }
);