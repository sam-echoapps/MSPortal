define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable", "ojs/ojcheckboxset", "ojs/ojlabel", "ojs/ojlabelvalue", "ojs/ojactioncard","ojs/ojselectcombobox", "ojs/ojradioset"], 
    function (oj,ko,$, app, ArrayDataProvider, FilePickerUtils) {

        class AssetAdd {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = sessionStorage.getItem("BaseURL")
                let userrole = sessionStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);
                
                self.comments = ko.observable('');
                self.department = ko.observable('');


                this.agreement = ko.observableArray();

                self.documentText = ko.observable('');

                self.documentUpload = function (event) {
                    console.log('Hello');

                }

                self.assetNumber = ko.observable('');
                self.assetName = ko.observable('');
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
                self.categoryList =  ko.observableArray([]);
                self.category = ko.observable('');
                self.DepartmentDet = ko.observableArray([]);
                self.departmentFilter = ko.observable('');
                self.StaffDet = ko.observableArray([]);
                self.staff = ko.observable('');
                self.owner_name = ko.observable('');
                self.selectedDepartment = ko.observable('');
                self.selectedCategory = ko.observable('');
                self.assetType = ko.observable('');
                self.assetTypeList = ko.observableArray([]);  
                self.assetTypeList.push(
                    {'value' : 'N/A', 'label' : 'N/A'},
                    {'value' : 'Currently Usable', 'label' : 'Currently Usable'},
                    {'value' : 'Exhausted ', 'label' : 'Exhausted '},  
                );
                self.assetTypeListDP = new ArrayDataProvider(self.assetTypeList, {keyAttributes: 'value'});
                self.currencySelected = ko.observable(sessionStorage.getItem("currency"));
                self.currencies = [
                    {"label":"USD","value":"USD"},
                    {"label":"INR","value":"INR"},
                    {"label":"GBP","value":"GBP"},
                    {"label":"AED","value":"AED"}
                ]

                self.currencyList = new ArrayDataProvider(self.currencies, {
                    keyAttributes: 'value'
                });
                self.totalAmountConvert = ko.observable('');

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getAssetInfoList();
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

                self.getAssetInfoList = ()=>{    
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetAddAssetInfo",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (result) {
                            console.log(result)
                            let data1,data2,data3;
                            document.getElementById('loaderView').style.display='none';
                            
                            data1= result[0]
                            console.log(data3)
                            if(data1.length !=0){
                                for (var i = 0; i < data1.length; i++) {
                                    self.categoryList.push({'value': data1[i][1],'label': data1[i][1]  });
                                }
                            }
                            data2= result[1]
                            console.log(data2)
                            if(data2.length !=0){
                                self.DepartmentDet.push({'value': '0', 'label': 'N/A'});
                                for (var i = 0; i < data2.length; i++) {
                                    self.DepartmentDet.push({'value': data2[i][0],'label': data2[i][1]  });
                                }
                            }
                            // data3= result[2]
                            // console.log(data3)
                            // if(data3.length !=0){
                            //     self.StaffDet.push({'value': '0', 'label': 'N/A'});
                            //     for (var i = 0; i < data3.length; i++) {
                            //         self.StaffDet.push({'value': data3[i][0],'label': data3[i][1]+" "+data3[i][2]+ " " +data3[i][3]  });
                            //     }
                            // }
                        }  
                    });                
                }
                self.categoryListDet = new ArrayDataProvider(this.categoryList, { keyAttributes: "value"});
                self.DepartmentList = new ArrayDataProvider(this.DepartmentDet, { keyAttributes: "value"});

                self.getStaffFilter = ()=>{
                    let departmentId; 
                    if (Number.isInteger(Number(self.selectedDepartment()))) {
                        departmentId = self.selectedDepartment();
                        if(self.selectedDepartment() == 0){
                            self.owner_name('N/A')
                        }else  if(self.selectedDepartment() > 0){
                            self.owner_name('')
                        }else{
                            self.selectedDepartment(self.departmentFilter())
                        }
                    }else{
                        departmentId = self.departmentFilter();
                    }
                    $.ajax({
                        url: BaseURL+"/getStaffDepartment",
                        type: 'POST',
                        data: JSON.stringify({
                            departmentId : departmentId,
                        }),
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display='none';
                            console.log(data)
                            self.StaffDet([])
                            data = data[0]
                            if(data.length !=0){ 
                                self.StaffDet.push({'value': '0', 'label': 'N/A'});
                                for (var i = 0; i < data.length; i++) {
                                    self.StaffDet.push({'value': data[i][0],'label': data[i][1]+" "+data[i][2]+ " " +data[i][3]  });
                                }
                            }
                        }
                    })
                }
 
                self.StaffList = new ArrayDataProvider(self.StaffDet, { keyAttributes: "value"});




                self.formSubmit = () => {
                    const formValid = self._checkValidationGroup("formValidation");
                    // Validation for guarantee file

                    if (self.have_guarantee_card() == 'Yes' && self.guaranteeFile() == '') {
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
                                    url: BaseURL + "/HRModuleAddAssetInfo",
                                    type: 'POST',
                                    data: JSON.stringify({
                                        asset_name: self.assetName(),
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
                                        category : self.selectedCategory(),
                                        department : self.selectedDepartment(),
                                        owner : self.owner_name(),
                                        assetType : self.assetType(),
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
                    self.router.go({path:'asset'})
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

                self.priceValidate = async (event)=>{
                    var ASCIICode= event.detail.value
                    console.log(ASCIICode)
                    var check = /^\d+(\.\d+)?$/.test(ASCIICode);
                    console.log(check)
                    if (check == true){
                        self.numError('')
                        await convertCurrency(ASCIICode,self.currencySelected());  // Pass the input value to the conversion function
                    }else{
                        self.totalAmount('')
                        self.numError("Please enter a number. Decimals are allowed (e.g., 12.34).");
                    }
                }

                async function convertCurrency(amount, sourceCurrency) {
                    const targetCurrency = sessionStorage.getItem("currency"); // Get target currency from session storage
                    const url = `https://api.exchangerate-api.com/v4/latest/${sourceCurrency}`; // API URL for currency rates
                
                    try {
                        let response = await fetch(url); // Use browser's fetch API
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        let data = await response.json();
                
                        console.log(data.rates);
                
                        // Check if the target currency exists in the rates
                        if (targetCurrency in data.rates) {
                            const conversionRate = data.rates[targetCurrency];
                            console.log(`1 ${sourceCurrency} = ${conversionRate} ${targetCurrency}`);
                
                            // Convert the entered amount from source currency to target currency
                            let amountInConvertedCurrency = amount * conversionRate;
                            console.log(`${amount} ${sourceCurrency} = ${amountInConvertedCurrency.toFixed(2)} ${targetCurrency}`);
                
                            // Update the UI with the converted value
                            self.totalAmount(`${amountInConvertedCurrency.toFixed(2)}`);
                        } else {
                            throw new Error(`Currency ${targetCurrency} is not supported.`);
                        }
                    } catch (error) {
                        console.error('Error fetching exchange rate:', error);
                        self.numError('Failed to fetch exchange rate. Please try again later.');
                    }
                }

                self.clearText = () => {
                    self.totalAmount('')
                    self.totalAmountConvert('')
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
        return  AssetAdd;
    }
);