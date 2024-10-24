define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", "ojs/ojconverterutils-i18n", "ojs/ojlistdataproviderview", "ojs/ojdataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable","ojs/ojavatar","ojs/ojradioset","ojs/ojinputsearch","ojs/ojselectcombobox"], 
    function (oj,ko,$, app, ArrayDataProvider, ojconverterutils_i18n_1, ListDataProviderView, ojdataprovider_1, FilePickerUtils) {

        class finance {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = sessionStorage.getItem("BaseURL")
                let userrole = sessionStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getCurrency();
                        self.getExpense();
                        self.getTotalExpense();

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

                self.tabData = [
                    { id: "expense", label: "Expense" },
                    { id: "purchasesec", label: "Purchase" },
                ];

                self.selectedTab = ko.observable("expense");

                self.selectedTabAction = ko.computed(() => { 
                    if(self.selectedTab() == 'expense'){
                        $("#expense").show();
                        $("#purchasesec").hide();
                    }
                    else if(self.selectedTab() == 'purchasesec'){
                        $("#expense").hide();
                        self.getPurchase();
                        $("#purchasesec").show();
                    }
                });

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

                self.CancelBehaviorOpt = ko.observable('icon'); 

                self.messageClose = ()=>{
                    location.reload();
                }

                self.currency = ko.observable('');

                self.getCurrency = () => {
                    document.getElementById('loaderView').style.display='none';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetCurrencyType",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log("Error fetching company code:", textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            self.currency(data[0][0]);
                        }
                    });
                };

                self.ExpenseDet = ko.observableArray([]);
                self.currencyType = ko.observable("");
                self.AmountHeaderText = ko.observable("");
                self.AmountHeaderTextFinance = ko.observable("");
                
                self.getExpense = () => {
                    self.ExpenseDet([]);
                    document.getElementById('loaderView').style.display = 'block';
                    document.getElementById('purchasesec').style.display = 'none';

                    $.ajax({
                        url: BaseURL + "/HRModuleGetAllExpenseForPay",
                        type: 'GET',
                        contentType: 'application/json',
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (result) {
                            document.getElementById('loaderView').style.display = 'none';
                            document.getElementById('ExpenseTable').style.display = 'block';
                            document.getElementById('purchasesec').style.display = 'none';

                            if(self.currency() == null){
                                location.reload()
                            }
                            if(self.currency() =='INR'){
                                self.currencyType('(₹)')
                            }else if(self.currency() =='USD'){
                                self.currencyType('($)')
                            }else if(self.currency() =='GBP'){
                                self.currencyType('(£)')
                            }
                            self.AmountHeaderText('Amount' + self.currencyType())
                            self.AmountHeaderTextFinance('Estimated Price' + self.currencyType()) //for finance

                            var data = JSON.parse(result[0]);
                            console.log(data);

                            if (data.length != 0) {
                                for (var i = 0; i < data.length; i++) {
                                    self.ExpenseDet.push({
                                        'id': data[i][0],
                                        'expense_no': data[i][0],
                                        'expense_name': data[i][1],
                                        'owner': data[i][2] + " " + data[i][3] + " " + data[i][4],
                                        'request_date': data[i][5],
                                        'amount': data[i][6],
                                        'view': data[i][7],
                                        'payment_status': data[i][8]
                                    });
                                }
                            }
                        }
                    });
                };
                
                self.ExpenseData = new ArrayDataProvider(self.ExpenseDet, { keyAttributes: "id" });

                self.filter = ko.observable('');

                self.ExpenseData = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filter() && this.filter() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filter() }
                        });
                    }
                    const arrayDataProvider = new ArrayDataProvider(self.ExpenseDet, { 
                        keyAttributes: 'id',
                        sortComparators: {
                            comparators: new Map().set("dob", this.comparator),
                        },
                    });
                    
                    return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
                }, self);

                self.handleValue = () => {                
                    self.filter(document.getElementById('searchFilter').rawValue);
                };

                self.datePicker = {
                    numberOfMonths: 1
                };

                self.fromDateExpense = ko.observable('')
                self.toDateExpense = ko.observable('')

                self.showExpenseData = ()=>{
                    self.ExpenseDet([]);
                    document.getElementById('loaderView').style.display='block';
                    let fromDate = self.fromDateExpense()
                    let toDate = self.toDateExpense();
                    $.ajax({
                        url: BaseURL+"/HRModuleGetExpenseListFilterForPay",
                        type: 'POST',
                        data: JSON.stringify({
                            fromDate : fromDate,
                            toDate : toDate
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display='none';
                        },
                        success: function (data) {
                            data = JSON.parse(data[0]);
                            console.log(data)
                            document.getElementById('loaderView').style.display='none';
                            if(data.length!=0){
                                for (var i = 0; i < data.length; i++) {
                                    self.ExpenseDet.push({
                                        'id': data[i][0],
                                        'expense_no': data[i][0],
                                        'expense_name': data[i][1],
                                        'owner': data[i][2] + " " + data[i][3] + " " + data[i][4],
                                        'request_date': data[i][5],
                                        'amount': data[i][6],
                                        'view': data[i][7],
                                        'payment_status': data[i][8]                                  
                                    }); 
                                } 
                            }
                        }
                    })
                }

                self.viewExpense = ()=>{
                    self.router.go({path:'myExpense'})
                }

                self.offerFileMessage = ko.observable('');

                self.previewClick = (e) => {
                    e.preventDefault();
                    const documentLink = e.target.closest('a').getAttribute('data-document-link');
                    console.log(documentLink);
                
                    document.getElementById('loaderView').style.display = 'block';
                
                    $.ajax({
                        url: BaseURL + "/HRModuleDocView",
                        type: 'POST',
                        data: JSON.stringify({
                            fileName: documentLink
                        }),
                        dataType: 'json',
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                
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
                            }else if (fileType === "jpeg" || fileType === "png") {
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
                            }else {
                                self.offerFileMessage("File not found");
                                setTimeout(() => {
                                    self.offerFileMessage("");
                                }, 3000);
                            }
                        }
                    });
                };

                self.totalExpense = ko.observable('');

                self.getTotalExpense = () => {
  
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetTotalExpense",
                        type: 'GET',
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            if (data && data.length > 0) {
                                const totalWithCurrency = data[0][0]+' '+self.currency();
                                self.totalExpense(totalWithCurrency);
                            }
                        }
                    });
                };

                self.PurchaseDet = ko.observableArray([]);
                
                self.getPurchase = () => {
                    self.PurchaseDet([]);
                    document.getElementById('loaderView').style.display = 'block';

                    $.ajax({
                        url: BaseURL + "/HRModuleGetAllPurchaseForPay",
                        type: 'GET',
                        contentType: 'application/json',
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (result) {
                            document.getElementById('loaderView').style.display = 'none';
                            document.getElementById('purchasesec').style.display = 'block';
                            document.getElementById('PurchaseTable').style.display = 'block';

                            var data = JSON.parse(result[0]);
                            console.log(data);

                            if (data.length != 0) {
                                for (var i = 0; i < data.length; i++) {
                                    let dateCreated = new Date(data[i][7]);
                                    // Get only the date part (YYYY-MM-DD)
                                    let dateCreatedOnly = dateCreated.toISOString().slice(0, 10);
                                    self.PurchaseDet.push({
                                        'id': data[i][0],
                                        'pono': "PO"+data[i][0], 
                                        'item_name': data[i][1],
                                        'vendor_po_doc': data[i][2], 
                                        'estimated_price': data[i][3],
                                        'ordered_by': data[i][4] + " " + data[i][5] + " " + data[i][6],
                                        'created_date': dateCreatedOnly, //To get date only
                                        'payment_status': data[i][8],
                                        'staff_id': data[i][9],
                                    });
                                }
                            }
                        }
                    });
                };
                
                self.PurchaseData = new ArrayDataProvider(self.PurchaseDet, { keyAttributes: "id" });

                self.filter2 = ko.observable('');

                self.PurchaseData = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filter2() && this.filter2() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filter2() }
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

                self.handleValue2 = () => {                
                    self.filter2(document.getElementById('searchFilter2').rawValue);
                };

                self.fromDatePurchase = ko.observable('')
                self.toDatePurchase = ko.observable('')

                self.showPurchaseData = ()=>{
                    self.PurchaseDet([]);
                    document.getElementById('loaderView').style.display='block';
                    let fromDate = self.fromDatePurchase()
                    let toDate = self.toDatePurchase();
                    $.ajax({
                        url: BaseURL+"/HRModuleGetPurchaseListFilterForPay",
                        type: 'POST',
                        data: JSON.stringify({
                            fromDate : fromDate,
                            toDate : toDate
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display='none';
                        },
                        success: function (data) {
                            data = JSON.parse(data[0]);
                            console.log(data)
                            document.getElementById('loaderView').style.display='none';
                            if(data.length!=0){
                                for (var i = 0; i < data.length; i++) {
                                    let dateCreated = new Date(data[i][7]);
                                    // Get only the date part (YYYY-MM-DD)
                                    let dateCreatedOnly = dateCreated.toISOString().slice(0, 10);
                                    self.PurchaseDet.push({
                                        'id': data[i][0],
                                        'pono': "PO"+data[i][0], 
                                        'item_name': data[i][1],
                                        'vendor_po_doc': data[i][2], 
                                        'estimated_price': data[i][3],
                                        'ordered_by': data[i][4] + " " + data[i][5] + " " + data[i][6],
                                        'created_date': dateCreatedOnly,
                                        'payment_status': data[i][8], 
                                        'staff_id': data[i][9],                               
                                    }); 
                                } 
                            }
                        }
                    })
                }

                self.statusOption = [
                    {"label":"Unpaid","value":"Unpaid"},
                    {"label":"Paid","value":"Paid"},
                ]

                self.statusList = new ArrayDataProvider(self.statusOption, {
                    keyAttributes: 'value'
                });

                self.statusUpdateExpense = (event,data)=>{
                    let expenseId =  data.item.data.id;
                    let paymentStatus = event.detail.value;
                    sessionStorage.setItem('expenseId',expenseId) 
                    sessionStorage.setItem('paymentStatus',paymentStatus)

                    $.ajax({
                        url: BaseURL+"/HRModuleUpdateExpensePaidStatus",
                        type: 'POST',
                        data: JSON.stringify({
                            expenseId: sessionStorage.getItem('expenseId'),
                            paymentStatus : sessionStorage.getItem('paymentStatus'),
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
                            self.getExpense();
                            self.getTotalExpense();
                        }
                    })
                }

                self.statusUpdatePurchase = (event,data)=>{
                    let purchaseId =  data.item.data.id;
                    let paymentStatus = event.detail.value;
                    sessionStorage.setItem('purchaseId',purchaseId) 
                    sessionStorage.setItem('paymentStatus',paymentStatus)

                    $.ajax({
                        url: BaseURL+"/HRModuleUpdatePurchasePaidStatus",
                        type: 'POST',
                        data: JSON.stringify({
                            purchaseId: sessionStorage.getItem('purchaseId'),
                            paymentStatus : sessionStorage.getItem('paymentStatus'),
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
                            self.getPurchase();
                        }
                    })
                }

                self.expenseReport = ()=>{
                    self.router.go({path:'expenseReport'})
                }
                self.purchaseReport = ()=>{
                    self.router.go({path:'purchaseReport'})
                }

                self.amountError = ko.observable('');

                self.PatternValidator = (event) => {
                    var amount = event.detail.value.toString();  // Convert to string
                    
                    // pattern to allow numbers like 0.12, 30.5 but not just 0
                    var pattern = /^(?!0$)(0|[1-9]\d*)(\.\d{1,2})?$/;
                
                    if (amount.match(pattern)) {
                        self.amountError(''); // Clear any previous error
                    } else {
                        self.amountError('Invalid Amount. Enter a valid amount (e.g., 30, 30.5).');
                    }
                };  

                self.expenseName2 = ko.observable();
                self.description2 = ko.observable();
                self.totalAmount2 = ko.observable();
                self.taxInclude2 = ko.observable();
                self.editFileCheck= ko.observable('');
                self.editMyStatus = ko.observable('');
                self.deniedNotes = ko.observable('');
                self.paymentStatus = ko.observable('');
                self.editFileContent = ko.observable('');

                self.reviewedExpense = (event,data)=>{
                    var clickedExpenseId = data.item.data.id
                    sessionStorage.setItem("expenseId", clickedExpenseId);
                    self.getMyExpenseInfo();
                    document.querySelector('#reviewedExpense').open();
                }

                self.getMyExpenseInfo = () => {
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetMyExpenseInfo",
                        type: 'POST',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            expenseId: sessionStorage.getItem("expenseId")
                        }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display='none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display='none';
                            data = JSON.parse(data[0]);
                            console.log(data);

                            if(data[5] == null){
                                data[5] = '';
                            }

                            self.expenseName2(data[1])
                            self.description2(data[2])
                            self.totalAmount2(data[3])
                            self.taxInclude2(data[4])
                            self.editFileCheck(data[5])
                            self.editMyStatus(data[6])
                            self.deniedNotes(data[7])
                            self.paymentStatus(data[8])
                        }
                    });
                };

                self.userId = ko.observable(sessionStorage.getItem("userId"));

                self.goToPOClosure = (event,data)=>{
                    var clickedRowId = data.item.data.id
                    sessionStorage.setItem("purchaseId", clickedRowId);
                    self.router.go({path:'purchaseClosure'})
                }

                self.editItemName = ko.observable('');
                self.editPurpose = ko.observable('');
                self.editVendorPONo = ko.observable('');
                self.editEstimatedPrice = ko.observable('');
                self.paymentStatusPurchase = ko.observable('');
                self.editFileCheckPurchase= ko.observable(''); 

                self.viewPurchase = (event,data)=>{
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
                            console.log(data[5]);
                            self.editItemName(data[2])
                            self.editPurpose(data[3])
                            self.editVendorPONo(data[4])
                            self.editFileCheckPurchase(data[5])
                            self.editEstimatedPrice(data[6])
                            self.paymentStatusPurchase(data[9])
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
        return  finance;
    }
);