define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider","ojs/ojlistdataproviderview","ojs/ojdataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable","ojs/ojactioncard","ojs/ojavatar", "ojs/ojradioset"], 
    function (oj,ko,$, app, ArrayDataProvider,ListDataProviderView, ojdataprovider_1, FilePickerUtils) {

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

                

                let userrole = sessionStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getPurchaseList()
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

                self.getPurchaseList = ()=>{
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
                            document.getElementById('loaderView').style.display='none';
                            document.getElementById('actionView').style.display='block';
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
                                        'estimated_price': data[i][6],
                                        'status': data[i][7],
                                        'created_date': data[i][8],
                                        'updated_at': data[i][9], 
                                        'ordered_by': data[i][10],                                   
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
                if (formValid && self.typeError() == '') {
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
                            self.editEstimatedPrice(data[6])
                            self.editStatus(data[7])
                            self.deniedNotes(data[8])
                        }
                    });
                };


                self.updateFormSubmit = ()=>{
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid && self.editTypeError() == '') {
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