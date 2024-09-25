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
                self.purpose = ko.observable('');
                self.vendorPONo = ko.observable('');
                self.vendorPOFile = ko.observable('');
                self.secondaryText = ko.observable('Please Upload(Optional)')
                self.filter = ko.observable('');
                self.CancelBehaviorOpt = ko.observable('icon'); 
                self.typeError = ko.observable('');
                self.file = ko.observable('');
                self.estimatedPrice = ko.observable('');
                self.fileContent = ko.observable('');
                self.PurchaseDet = ko.observableArray([]);
               
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
                self.cardSecondaryText = ko.observable('Please Upload(Mandatory)')
                self.billSecondaryText = ko.observable('Please Upload')
                self.have_bill = ko.observable('');
                self.notes = ko.observable('');
                self.lessCount = ko.observable(''); 
                self.inputLength = ko.observable('');
                self.warrentyReminder = ko.observable('');
                self.guaranteeFile = ko.observable('');
                self.typeErrorBill = ko.observable('');
                self.billFile = ko.observable('');
                self.fileBill = ko.observable('');
                self.billSecondaryText = ko.observable('');
                self.typeErrorBill = ko.observable('');
                self.purchaseId = ko.observable(sessionStorage.getItem("purchaseId"));
                self.selectedOptions = ko.observable('Yes');
                self.fileManadatory = ko.observable('');

                // Observable array for dynamic checkbox options
                self.checkboxOptions = ko.observableArray([
                  { value: 'Yes', label: 'GST Included' },
                ]);

                let userrole = sessionStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getPurchaseClosureInfo();
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
                        success: function (data) {
                            data = JSON.parse(data[0]);
                            console.log(data)
                            document.getElementById('loaderView').style.display='none';
                            self.poid("PO"+data[0])
                            self.itemName(data[2])
                            self.owner(data[3])
                            let date = new Date(data[4]);
                            // Get only the date part (YYYY-MM-DD)
                            let dateOnly = date.toISOString().slice(0, 10);
                            self.requestDate(dateOnly)
                            self.status(data[5])
                        }
                    });
                };

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
                        document.getElementById('guaranteeCardSec').style.display='block';
                    }else if(self.have_guarantee()=='No'){
                        self.guaranteeFile('')
                        self.file('')
                        self.cardSecondaryText('')
                        self.typeError('')
                        document.getElementById('guaranteeCardSec').style.display='none';
                    }
                   
                }

                self.billFileSec = function (event,data) {
                    if(self.have_bill()=='Yes'){ 
                        document.getElementById('billSec').style.display='block';
                    }else if(self.have_bill()=='No'){
                        document.getElementById('billSec').style.display='none';
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
                    self.file(files)
                    self.cardSecondaryText(fileName)
                    var fileFormat =files.name.split(".");
                    var checkFormat =fileFormat[1];
                    if(checkFormat == 'png' || checkFormat =="jpeg" || checkFormat =="jpg" || checkFormat =="pdf"){
                    self.typeError('')
                }
                else{
                    self.typeError('The certificate must be a file of type: PNG, JPEG, JPG or PDF.')
                }
              }

              self.uploadBill = function (event) {
                var fileBill = event.detail.files[0];
                const resultBill = event.detail.files;
                const filesBill = resultBill[0];
                var fileNameBill= filesBill.name;
                //console.log(files)
                self.billFile(fileNameBill)
                self.fileBill(filesBill)
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

    

                self.PurchaseList = new ArrayDataProvider(this.PurchaseDet, { keyAttributes: "id"});

                self.PurchaseList = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filter() && self.filter() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filter() }
                        });
                    }
                    const arrayDataProvider = new ArrayDataProvider(self.PurchaseDet, { 
                        keyAttributes: 'id',
                        sortComparators: {
                            comparators: new Map().set("dob", this.comparator),
                        },
                    });
                    
                    return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
                }, self);
    

                self.uploadVendorPO = function (event) {
                    var file = event.detail.files[0];
                    const result = event.detail.files;
                    const files = result[0];
                    var fileName= files.name;
                    //console.log(files)
                    self.vendorPOFile(fileName)
                    self.file(files)
                    self.secondaryText(fileName)
                    var fileFormat =files.name.split(".");
                    var checkFormat =fileFormat[1];
                    if(checkFormat == 'png' || checkFormat =="jpeg" || checkFormat =="jpg" || checkFormat =="pdf"){
                    self.typeError('')
                }
                else{
                    self.typeError('The certificate must be a file of type: PNG, JPEG, JPG or PDF.')
                }
              }

        
              self.handleValueTask = () => {
                self.filter(document.getElementById('filter').rawValue);
            };

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

            self.formSubmit = ()=>{
                const formValid = self._checkValidationGroup("formValidation"); 
                if(self.have_guarantee() =='Yes' && self.guaranteeFile() == ''){
                    self.fileManadatory('Upload')
                }else{
                    self.fileManadatory('')
                }
                if (formValid && self.typeError() == '' && self.typeErrorBill() == ''&& self.fileManadatory() == '') {
                        let popup = document.getElementById("loaderPopup");
                        popup.open();
                        const reader = new FileReader();
                        if(self.file() !=''){
                            reader.readAsDataURL(self.file());
                            reader.onload = ()=>{
                            const fileContent = reader.result;
                            $.ajax({
                                url: BaseURL+"/HRModuleSavePurchaseClosure",
                                type: 'POST',
                                data: JSON.stringify({
                                    purchaseId: sessionStorage.getItem("purchaseId"),
                                    bill_number : self.billNumber(),
                                    guarantee_number : self.guaranteeNumber(),
                                    warrenty_end_date : self.warrentyEndDate(),
                                    guarantee_card : self.have_guarantee(),
                                    guarantee_card_file : self.guaranteeFile(),
                                    bill : self.have_bill(),
                                    warrenty_reminder : self.warrentyReminder(),
                                    total_amount : self.totalAmount(),
                                    closure_note : self.notes(),
                                    tax_included : self.selectedOptions(),
                                    file : fileContent
                                }),
                                dataType: 'json',
                                timeout: sessionStorage.getItem("timeInetrval"),
                                context: self,
                                error: function (xhr, textStatus, errorThrown) {
                                    console.log(textStatus);
                                },
                                success: function (data) {
                                    console.log(data)
                                    let popup = document.getElementById("loaderPopup");
                                    popup.close();
                                    let popup1 = document.getElementById("successView");
                                    popup1.open();
                                }
                            })
                        }
                    }else{
                        $.ajax({
                            url: BaseURL+"/HRModuleSavePurchaseClosure",
                            type: 'POST',
                            data: JSON.stringify({
                                    purchaseId: sessionStorage.getItem("purchaseId"),
                                    bill_number : self.billNumber(),
                                    guarantee_number : self.guaranteeNumber(),
                                    warrenty_end_date : self.warrentyEndDate(),
                                    guarantee_card : self.have_guarantee(),
                                    guarantee_card_file : self.guaranteeFile(),
                                    bill : self.have_bill(),
                                    warrenty_reminder : self.warrentyReminder(),
                                    total_amount : self.totalAmount(),
                                    closure_note : self.notes(),
                                    tax_included : self.selectedOptions(),
                                    file : self.fileContent()
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                console.log(data)
                                let popup = document.getElementById("loaderPopup");
                                popup.close();
                                let popup1 = document.getElementById("successView");
                                popup1.open();
                            }
                        })
                    }
                    }
                }

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