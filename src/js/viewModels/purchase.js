define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider",  "ojs/ojconverterutils-i18n",  "ojs/ojlistdataproviderview", "ojs/ojdataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable","ojs/ojavatar","ojs/ojradioset","ojs/ojinputsearch","ojs/ojselectcombobox"], 
    function (oj,ko,$, app, ArrayDataProvider,  ojconverterutils_i18n_1, ListDataProviderView, ojdataprovider_1, FilePickerUtils) {

        class Purchase {
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
                self.editItemName = ko.observable('');
                self.editPurpose = ko.observable('');
                self.editVendorPONo = ko.observable('');
                self.editEstimatedPrice = ko.observable('');  
                self.editSecondaryText = ko.observable('Please Upload(Optional)')
                self.editTypeError = ko.observable('');
                self.offerFileMessage = ko.observable('');
                self.editFile = ko.observable('');
                self.editFileContent = ko.observable('');
                self.editVendorPOFile = ko.observable('');
                self.editFileCheck= ko.observable('');  

                self.editStatus = ko.observable('');
                self.statusOption = [
                    {"label":"Requested","value":"Requested"},
                    {"label":"Approved","value":"Approved"},
                    {"label":"Denied","value":"Denied"}
                ]
                self.statusList = new ArrayDataProvider(self.statusOption, {
                    keyAttributes: 'value'
                });
                self.deniedNotes = ko.observable('');
                self.userId = ko.observable(sessionStorage.getItem("userId"));
                self.staffId = ko.observable();  
                self.numError = ko.observable('');
                self.currency = ko.observable('');
                self.paymentStatus = ko.observable('');

                self.tabData = [
                    { id: "open", label: "Open PO" },
                    { id: "closed", label: "Closed PO" },
                    { id: "report", label: "Get Report" },
                ];

                self.tabData1 = [
                    { id: "open", label: "Open PO" },
                    { id: "closed", label: "Closed PO" },
                ];
                self.selectedTab = ko.observable("open"); 
                self.PurchaseCloseDet = ko.observableArray([]);
                self.filterPurchase = ko.observable('');

                self.status = ko.observable('');

                self.statusOption = [
                    {"label":"Requested","value":"Requested"},
                    {"label":"Approved","value":"Approved"},
                    {"label":"Denied","value":"Denied"},
                ]

                self.statusList = new ArrayDataProvider(self.statusOption, {
                    keyAttributes: 'value'
                });

                self.filterReport = ko.observable('');
                self.PurchaseReportDet = ko.observableArray([]);

                self.statusMissing = ko.observable('');
                self.blob = ko.observable()
                self.fileName = ko.observable()

                self.priceFilter = ko.observable(['All']);

                self.priceFilterOptions = [
                    {"label":"All","value":"All"},
                    {"label":"Below 1000","value":"Below 1000"},
                    {"label":"1000-10000","value":"1000-10000"},
                    {"label":"10000-20000","value":"10000-20000"},
                    {"label":"20000-30000","value":"20000-30000"},
                    {"label":"30000-40000","value":"30000-40000"},
                    {"label":"40000-50000","value":"40000-50000"},
                    {"label":"Above 50000","value":"Above 50000"},
                ]

                self.priceFilterList = new ArrayDataProvider(self.priceFilterOptions, {
                    keyAttributes: 'value'
                });

                self.priceMissing = ko.observable('');



                let userrole = sessionStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);

                self.selectedTabAction1 = ko.computed(() => { 
                    if(self.selectedTab() == 'open'){
                        $("#open").show();
                        $("#closed").hide();
                        $("#report").hide();
                    }else if(self.selectedTab() == 'closed'){
                        $("#open").hide();
                        $("#report").hide();
                        self.getPurchaseCloseList()
                        $("#closed").show();
                    }else if(self.selectedTab() == 'report'){
                        $("#open").hide();
                        $("#closed").hide();
                        $("#report").show();
                    }
                    });

                self.statusFilter = ko.observable(['All']);

                self.statusFilterOption = [
                    {"label":"All","value":"All"},
                    {"label":"Requested","value":"Requested"},
                    {"label":"Approved","value":"Approved"},
                    {"label":"Closed","value":"Closed"},
                    {"label":"Denied","value":"Denied"},
                ]

                self.statusFilterList = new ArrayDataProvider(self.statusFilterOption, {
                    keyAttributes: 'value'
                });

                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const day = currentDate.getDate();

                self.fromDate = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date(year, 0, 1)));
                self.datePicker = {
                    numberOfMonths: 1
                };

                self.toDate = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date(year, month,day)));
                self.fromDatePurchase = ko.observable('')
                self.toDatePurchase = ko.observable('')

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getCurrency();
                        self.getPurchaseList();
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
                            sessionStorage.setItem("currency",self.currency())
                        }
                    });
                }


                self.getPurchaseList = ()=>{
                    self.fromDatePurchase('')
                    self.toDatePurchase('')
                    self.PurchaseDet([]);
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetPurchaseList",
                        type: 'POST',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("userId")
                        }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            data = JSON.parse(data[0]);
                            console.log(data)
                            if(sessionStorage.getItem("currency") == null){
                                location.reload()
                            }
                            document.getElementById('loaderView').style.display='none';
                            document.getElementById('actionView').style.display='block';
                            if(data.length!=0){
                                for (var i = 0; i < data.length; i++) {
                                    console.log(data[i][1])
                                    let dateCreated = new Date(data[i][8]);
                                    // Get only the date part (YYYY-MM-DD)
                                    let dateCreatedOnly = dateCreated.toISOString().slice(0, 10);
                                    self.PurchaseDet.push({
                                        'slno': i+1,
                                        'id': data[i][0],
                                        'pono': "PO"+data[i][0], 
                                        'staff_id': data[i][1],
                                        'item_name': data[i][2],
                                        'purpose': data[i][3],
                                        'vendor_po_no': data[i][4], 
                                        'vendor_po_doc': data[i][5], 
                                        'estimated_price': data[i][6] + " " +sessionStorage.getItem("currency"),
                                        'status': data[i][7],
                                        'created_date': dateCreatedOnly,
                                        'updated_at': data[i][9], 
                                        'ordered_by': data[i][10],    
                                        'payment_status': data[i][11],                                                                  
                                    });
                                    
                                }
                                
                                 }

                        }
                    })
                }

                self.getPurchaseCloseList = ()=>{
                    self.PurchaseCloseDet([]);
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetPurchaseCloseList",
                        type: 'POST',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("userId")
                        }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            data = JSON.parse(data[0]);
                            console.log(data)
                            document.getElementById('loaderView').style.display='none';
                            document.getElementById('closeView').style.display='block';
                            if(data.length!=0){
                                for (var i = 0; i < data.length; i++) {
                                    console.log(data[i][1])
                                    let dateCreated = new Date(data[i][8]);
                                    // Get only the date part (YYYY-MM-DD)
                                    let dateCreatedOnly = dateCreated.toISOString().slice(0, 10);
                                    self.PurchaseCloseDet.push({
                                        'slno': i+1,
                                        'id': data[i][0],
                                        'pono': "PO"+data[i][0], 
                                        'staff_id': data[i][1],
                                        'item_name': data[i][2],
                                        'purpose': data[i][3],
                                        'vendor_po_no': data[i][4], 
                                        'vendor_po_doc': data[i][5], 
                                        'estimated_price': data[i][6] + " " +sessionStorage.getItem("currency"),
                                        'status': data[i][7],
                                        'created_date': dateCreatedOnly,
                                        'updated_at': data[i][9], 
                                        'ordered_by': data[i][10], 
                                        'payment_status': data[i][11],                                                                                                    
                                    });
                                    
                                }
                                
                                 }

                        }
                    })
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
    
                self.PurchaseCloseList = new ArrayDataProvider(this.PurchaseCloseDet, { keyAttributes: "id"});
                self.PurchaseCloseList = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filterPurchase() && self.filterPurchase() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filterPurchase() }
                        });
                    }
                    const arrayDataProvider = new ArrayDataProvider(self.PurchaseCloseDet, { 
                        keyAttributes: 'id',
                        sortComparators: {
                            comparators: new Map().set("dob", this.comparator),
                        },
                    });
                    
                    return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
                }, self);
    

                
                self.addPurchase = ()=>{
                    document.querySelector('#openAddPurchase').open();
                }

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

              self.updateUploadVendorPO = function (event) {
                var file = event.detail.files[0];
                const result = event.detail.files;
                const files = result[0];
                var fileName= files.name;
                console.log(files)
                self.editVendorPOFile(fileName)
                self.editFile(files)
                self.editSecondaryText(fileName)
                var fileFormat =files.name.split(".");
                var checkFormat =fileFormat[1];
                if(checkFormat == 'png' || checkFormat =="jpeg" || checkFormat =="jpg" || checkFormat =="pdf"){
                self.editTypeError('')
            }
            else{
                self.editTypeError('The certificate must be a file of type: PNG, JPEG, JPG or PDF.')
            }
          }

            self.handleValuePurchase = () => {
                self.filter(document.getElementById('filter').rawValue);
            };

            self.handleValuePurchaseClose = () => {
                self.filterPurchase(document.getElementById('filterPurchase').rawValue);
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
                if (formValid && self.typeError() == '' && self.numError() == '') {
                        let popup = document.getElementById("loaderPopup");
                        popup.open();
                        const reader = new FileReader();
                        if(self.file() !=''){
                            reader.readAsDataURL(self.file());
                            reader.onload = ()=>{
                            const fileContent = reader.result;
                            $.ajax({
                                url: BaseURL+"/HRModuleAddPurchase",
                                type: 'POST',
                                data: JSON.stringify({
                                    staffId: sessionStorage.getItem("userId"),
                                    item_name : self.itemName(),
                                    purpose : self.purpose(),
                                    vendor_po_no : self.vendorPONo(),
                                    vendor_po_doc : self.vendorPOFile(),
                                    estimated_price : self.estimatedPrice(),
                                    file : fileContent,
                                    status : 'Requested'
                                }),
                                dataType: 'json',
                                timeout: sessionStorage.getItem("timeInetrval"),
                                context: self,
                                error: function (xhr, textStatus, errorThrown) {
                                    console.log(textStatus);
                                },
                                success: function (data) {
                                    console.log(data)
                                    document.querySelector('#openAddPurchase').close();
                                    let popup = document.getElementById("loaderPopup");
                                    popup.close();
                                    let popup1 = document.getElementById("successView");
                                    popup1.open();
                                }
                            })
                        }
                    }else{
                        $.ajax({
                            url: BaseURL+"/HRModuleAddPurchase",
                            type: 'POST',
                            data: JSON.stringify({
                                staffId: sessionStorage.getItem("userId"),
                                item_name : self.itemName(),
                                purpose : self.purpose(),
                                vendor_po_no : self.vendorPONo(),
                                vendor_po_doc : self.vendorPOFile(),
                                estimated_price : self.estimatedPrice(),
                                file : self.fileContent(),
                                status : 'Requested'
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                console.log(data)
                                document.querySelector('#openAddPurchase').close();
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
                
                self.editPurchase = (event,data)=>{
                    var clickedPurchaseId = data.item.data.id
                    sessionStorage.setItem("purchaseId", clickedPurchaseId);
                    self.getPurchaseInfo();
                    document.querySelector('#openEditPurchase').open();
                }

                self.viewPurchase = (event,data)=>{
                    var clickedPurchaseId = data.item.data.id
                    sessionStorage.setItem("purchaseId", clickedPurchaseId);
                    self.getPurchaseInfo();
                    document.querySelector('#openViewPurchase').open();
                }

                self.getPurchaseInfo = () => {
                    $.ajax({
                        url: BaseURL + "/HRModuleGetPurchaseInfo",
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
                            console.log(data);
                            self.staffId(data[1])
                            self.editItemName(data[2])
                            self.editPurpose(data[3])
                            self.editVendorPONo(data[4])
                            self.editSecondaryText(data[5])
                            self.editFileCheck(data[5])
                            self.editEstimatedPrice(data[6])
                            self.editStatus(data[7])
                            self.deniedNotes(data[8])
                            self.paymentStatus(data[9])
                        }
                    });
                };


                self.updateFormSubmit = ()=>{
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid && self.editTypeError() == '' && self.numError() == '') {
                            let popup = document.getElementById("loaderPopup");
                            popup.open();
                            const reader = new FileReader();
                            if(self.editFile() !=''){
                                reader.readAsDataURL(self.editFile());
                                reader.onload = ()=>{
                                const fileContent = reader.result;
                                $.ajax({
                                    url: BaseURL+"/HRModuleUpdatePurchase",
                                    type: 'POST',
                                    data: JSON.stringify({
                                        purchaseId: sessionStorage.getItem("purchaseId"),
                                        item_name : self.editItemName(),
                                        purpose : self.editPurpose(),
                                        vendor_po_no : self.editVendorPONo(),
                                        vendor_po_doc : self.editVendorPOFile(),
                                        estimated_price : self.editEstimatedPrice(),
                                        file : fileContent,
                                        status : self.editStatus(),
                                        deny_notes : self.deniedNotes(),
                                        staffId : self.staffId()
                                    }),
                                    dataType: 'json',
                                    timeout: sessionStorage.getItem("timeInetrval"),
                                    context: self,
                                    error: function (xhr, textStatus, errorThrown) {
                                        console.log(textStatus);
                                    },
                                    success: function (data) {
                                        console.log(data)
                                        document.querySelector('#openEditPurchase').close();
                                        let popup = document.getElementById("loaderPopup");
                                        popup.close();
                                        let popup1 = document.getElementById("updateSuccessView");
                                        popup1.open();
                                    }
                                })
                            }
                        }else{
                            $.ajax({
                                url: BaseURL+"/HRModuleUpdatePurchase",
                                type: 'POST',
                                data: JSON.stringify({
                                    purchaseId: sessionStorage.getItem("purchaseId"),
                                    item_name : self.editItemName(),
                                    purpose : self.editPurpose(),
                                    vendor_po_no : self.editVendorPONo(),
                                    vendor_po_doc : self.editVendorPOFile(),
                                    estimated_price : self.editEstimatedPrice(),
                                    file : self.editFileContent(),
                                    status : self.editStatus(),
                                    deny_notes : self.deniedNotes(),
                                    staffId : self.staffId()
                                }),
                                dataType: 'json',
                                timeout: sessionStorage.getItem("timeInetrval"),
                                context: self,
                                error: function (xhr, textStatus, errorThrown) {
                                    console.log(textStatus);
                                },
                                success: function (data) {
                                    console.log(data)
                                    document.querySelector('#openEditPurchase').close();
                                    let popup = document.getElementById("loaderPopup");
                                    popup.close();
                                    let popup1 = document.getElementById("updateSuccessView");
                                    popup1.open();
                                }
                            })
                        }
                        }
                    }

                    self.goToPOClosure = (event,data)=>{
                        var clickedRowId = data.item.data.id
                        sessionStorage.setItem("purchaseId", clickedRowId);
                        self.router.go({path:'purchaseClosure'})
                    }

                    self.priceValidate = (event)=>{
                        var ASCIICode= event.detail.value
                        var check = /^\d+(\.\d+)?$/.test(ASCIICode);
                        //console.log(check)
                        if (check == true){
                            self.numError('')
                        }else{
                            self.numError("Please enter a number. Decimals are allowed (e.g., 12.34).");
                        }
                    }

                    self.deniedNotesVal = ko.observable('')
                    self.statusUpdateList = (event,data)=>{
                        let purchaseIdVal =  data.item.data.id;
                        let statusVal = event.detail.value;
                        sessionStorage.setItem('purchaseIdVal',purchaseIdVal) 
                        sessionStorage.setItem('statusVal',statusVal) 
                        if(statusVal == 'Denied'){
                            document.querySelector('#deniedNoteSec').open();                            
                        }else{
                            self.statusUpdatePurchaseList()
                        }
                    }

                    self.noteSubmit = ()=>{
                        self.statusUpdatePurchaseList()
                    }
                  
                    self.statusUpdatePurchaseList = ()=>{
                        var formValidNote = self._checkValidationGroup("formValidationNote"); 
                        if(sessionStorage.getItem('statusVal') == 'Denied'){
                            sessionStorage.setItem('denyNote',self.deniedNotesVal()) 
                        }else{
                            formValidNote=true;
                            sessionStorage.setItem('denyNote','') 
                        }
                        if (formValidNote) {
                        let popup = document.getElementById("loaderPopup");
                        popup.open();
                        $.ajax({
                            url: BaseURL+"/HRModuleUpdatePurchaseList",
                            type: 'POST',
                            data: JSON.stringify({
                                purchaseId: sessionStorage.getItem('purchaseIdVal'),
                                status : sessionStorage.getItem('statusVal'),
                                deniedNote : sessionStorage.getItem('denyNote'),
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                console.log(data)
                                popup.close();
                                document.querySelector('#deniedNoteSec').close();                            
                                self.getPurchaseList();
                            }
                        })
                    }
                          
                    }

                    self.showData = ()=>{
                        self.PurchaseReportDet([]);
                        document.getElementById('loaderView').style.display='block';
                        let fromDate = self.fromDate()
                        let toDate = self.toDate();
                        let statusFilter = self.statusFilter();
                        statusFilter = statusFilter.join(",");
                        let priceRange = self.priceFilter();
                        priceRange = priceRange.join(",");
                        if(self.statusFilter() == ''){
                            self.statusMissing("Please select a status");
                            document.getElementById('loaderView').style.display='none';
                        }
                        else{
                            self.statusMissing('');
                        }
                        if(self.priceFilter() == ''){
                            self.priceMissing("Please select a price range");
                            document.getElementById('loaderView').style.display='none';
                        }
                        else{
                            self.priceMissing('');
                        }
                        if (self.statusMissing() == '' && self.priceMissing() == '') {
                        $.ajax({
                            url: BaseURL+"/getPurchaseReport",
                            type: 'POST',
                            data: JSON.stringify({
                                staffId : sessionStorage.getItem("userId"),
                                fromDate: fromDate,
                                toDate: toDate,
                                status : statusFilter,
                                priceRange : priceRange
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                            console.log(data)
                            document.getElementById('loaderView').style.display='none';
                            if(data[0]!="No data found"){
                            data = JSON.parse(data);
                            console.log(data)
                            var csvContent = '';
                                var headers = ['SL.NO', 'PO.No', 'Item Name', 'Owner', 'Estimated Price','Total Amount', 'Created Date',
                                            'Status'];
                                csvContent += headers.join(',') + '\n';
                            if(data.length!=0){
                                for (var i = 0; i < data.length; i++) {
                                    console.log(data[i][1])
                                    let dateCreated = new Date(data[i][8]);
                                    // Get only the date part (YYYY-MM-DD)
                                    let dateCreatedOnly = dateCreated.toISOString().slice(0, 10);
                                    let totalAmount = data[i][11] ? data[i][11] + " " + sessionStorage.getItem("currency") : '';
                                    self.PurchaseReportDet.push({
                                        'slno': i+1,
                                        'id': data[i][0],
                                        'pono': "PO"+data[i][0], 
                                        'staff_id': data[i][1],
                                        'item_name': data[i][2],
                                        'purpose': data[i][3],
                                        'vendor_po_no': data[i][4], 
                                        'vendor_po_doc': data[i][5], 
                                        'estimated_price': data[i][6] + " " +sessionStorage.getItem("currency"),
                                        'status': data[i][7],
                                        'created_date': dateCreatedOnly,
                                        'updated_at': data[i][9], 
                                        'ordered_by': data[i][10],
                                        'total_amount': totalAmount,  
                                        'payment_status': data[i][12],                                                                                                                                     
                                    });

                                    var rowData = [i+1, "PO"+data[i][0],data[i][2],data[i][10],data[i][6] + " " +sessionStorage.getItem("currency"),data[i][11], data[i][8], data[i][7] ]; 
                                    csvContent += rowData.join(',') + '\n';
                                    
                                }
                                var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                var today = new Date();
                                var fileName = 'data_' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '.csv';
                                self.blob(blob);
                                self.fileName(fileName);
                                
                                 }
                                 else{
                                    var csvContent = '';
                                    var headers = ['SL.NO', 'PO.No', 'Item Name', 'Owner', 'Estimated Price','Total Amount', 'Created Date',
                                                'Status'];
                                    csvContent += headers.join(',') + '\n';
                                    var rowData = []; 
                                    csvContent += rowData.join(',') + '\n';
                                    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                    var today = new Date();
                                    var fileName = 'data_' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '.csv';
                                    self.blob(blob);
                                    self.fileName(fileName);
                                }
    

                        }
                    }
                    })
                }

                        
                    }

                    self.PurchaseReportList = new ArrayDataProvider(this.PurchaseReportDet, { keyAttributes: "id"});

                    self.PurchaseReportList = ko.computed(function () {
                        let filterCriterion = null;
                        if (self.filterReport() && self.filterReport() != '') {
                            filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                                filterDef: { text: self.filterReport() }
                            });
                        }
                        const arrayDataProvider = new ArrayDataProvider(self.PurchaseReportDet, { 
                            keyAttributes: 'id',
                            sortComparators: {
                                comparators: new Map().set("dob", this.comparator),
                            },
                        });
                        
                        return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
                    }, self);

                    self.statusFilterCheck = ()=> {
                        if(self.statusFilter() == ''){
                            self.statusMissing("Please select a status");
                        }else{
                        self.statusMissing('');
                        }
                    }

                    self.downloadExcel = ()=> {
                        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                          // For Internet Explorer
                          window.navigator.msSaveOrOpenBlob(self.blob(), self.fileName());
                        } else {
                          // For modern browsers
                          var link = document.createElement('a');
                          link.href = window.URL.createObjectURL(self.blob());
                          link.download = self.fileName();
                          link.style.display = 'none';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }
                      }

                      self.handleValuePurchaseReport = () => {
                        self.filterReport(document.getElementById('filterReport').rawValue);
                    };

                    self.priceFilterCheck = ()=> {
                        if(self.priceFilter() == ''){
                            self.priceMissing("Please select a price range");
                        }else{
                        self.priceMissing('');
                        }
                    }

                self.showPurchaseData = ()=>{
                    self.PurchaseDet([]);
                    document.getElementById('loaderView').style.display='block';
                    let fromDate = self.fromDatePurchase()
                    let toDate = self.toDatePurchase();
                    $.ajax({
                        url: BaseURL+"/HRModuleGetPurchaseListFilter",
                        type: 'POST',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("userId"),
                            fromDate : fromDate,
                            toDate : toDate
                        }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            data = JSON.parse(data[0]);
                            console.log(data)
                            document.getElementById('loaderView').style.display='none';
                            if(data.length!=0){
                                for (var i = 0; i < data.length; i++) {
                                    console.log(data[i][1])
                                    self.PurchaseDet.push({
                                        'slno': i+1,
                                        'id': data[i][0],
                                        'pono': "PO"+data[i][0], 
                                        'staff_id': data[i][1],
                                        'item_name': data[i][2],
                                        'purpose': data[i][3],
                                        'vendor_po_no': data[i][4], 
                                        'vendor_po_doc': data[i][5], 
                                        'estimated_price': data[i][6] + " " +sessionStorage.getItem("currency"),
                                        'status': data[i][7],
                                        'created_date': data[i][8],
                                        'updated_at': data[i][9], 
                                        'ordered_by': data[i][10],    
                                        'payment_status': data[i][11],                                                                  
                                    });
                                    
                                }
                                
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
        return  Purchase;
    }
);