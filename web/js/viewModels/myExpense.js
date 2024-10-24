define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", "ojs/ojconverterutils-i18n", "ojs/ojlistdataproviderview", "ojs/ojdataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable","ojs/ojavatar","ojs/ojradioset","ojs/ojinputsearch","ojs/ojselectcombobox"], 
    function (oj,ko,$, app, ArrayDataProvider, ojconverterutils_i18n_1, ListDataProviderView, ojdataprovider_1, FilePickerUtils) {

        class expense {
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
                        self.getMyExpense();
                        self.getDepartment();

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
                    { id: "my_expense", label: "My Expense" },
                    { id: "expense", label: "Employee Expense" },
                    { id: "report", label: "Get Report" },
                ];

                self.tabData1 = [
                    { id: "my_expense", label: "My Expense" },
                    { id: "report", label: "Get Report" },
                ];

                self.tabData2 = [
                    { id: "my_expense", label: "My Expense" },
                ];

                self.selectedTab = ko.observable("my_expense");

                self.selectedTabAction = ko.computed(() => { 
                    if(self.selectedTab() == 'my_expense'){
                        $("#my_expense").show();
                        $("#expense").hide();
                        $("#report").hide();
                    }
                    else if(self.selectedTab() == 'expense'){
                        $("#my_expense").hide();
                        self.getTotalExpense();
                        self.getExpense();
                        $("#expense").show();
                        $("#report").hide();
                    }
                    else if(self.selectedTab() == 'report'){
                        $("#my_expense").hide();
                        $("#expense").hide();
                        getAllExpenseReport();
                        $("#report").show();
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
                self.tax =ko.observable('');

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
                            self.tax(data[0][1]);
                        }
                    });
                }; 

                self.expenseName = ko.observable();
                self.description = ko.observable();
                self.totalAmount = ko.observable();
                self.taxInclude = ko.observable("No");

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

                self.documentText = ko.observable('Upload bill');
                self.uploadError = ko.observable('');
                self.typeError = ko.observable('');
                self.selectedFile = ko.observable(null);

                self.billUpload = function (event) {
                    var file = event.detail.files[0];
                    const result = event.detail.files;
                    const files = result[0];
                    var documentFileName = files.name;
                    self.selectedFile(files);
                    var fileFormat = files.name.split(".").pop().toLowerCase();
                
                    if (fileFormat === 'pdf' || fileFormat === 'jpeg' || fileFormat === 'jpg' || fileFormat === 'png') {
                        self.typeError('');
                        self.documentText(documentFileName);
                    } else {
                        self.typeError('The document must be a file of type: pdf, jpeg, jpg, or png');
                    }
                };                

                self.addExpense = ()=>{
                    document.querySelector('#openAddExpense').open();
                }
                
                self.formSubmit = function () {
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid) {
                        let popup = document.getElementById("popup");
                        popup.open();
                        
                        var selectedFile = self.selectedFile();
                
                        if (selectedFile) {
                            // File is selected, handle the file upload
                            var documentFileName = selectedFile.name;
                            const reader = new FileReader();
                            reader.readAsDataURL(selectedFile);
                
                            reader.onload = function () {
                                const fileContent = reader.result;
                                $.ajax({
                                    url: BaseURL + "/HRModuleExpenseUpload",
                                    type: 'POST',
                                    data: JSON.stringify({
                                        staffId: sessionStorage.getItem("userId"),
                                        expense_name: self.expenseName(),
                                        description: self.description(),
                                        total_amount: self.totalAmount(),
                                        tax_include: self.taxInclude(),
                                        file_name: documentFileName,
                                        file: fileContent,
                                    }),
                                    contentType: 'application/json',
                                    dataType: 'json',
                                    timeout: sessionStorage.getItem("timeInterval"),
                                    context: self,
                                    error: function (xhr, textStatus, errorThrown) {
                                        console.log(textStatus);
                                        popup.close(); // Close the loading popup on error
                                    },
                                    success: function (data) {
                                        console.log(data);
                                        let popup = document.getElementById("popup");
                                        popup.close();
                                        let popup1 = document.getElementById("successView");
                                        popup1.open();
                                    }
                                });
                            };
                        } else {
                            // No file is selected, proceed without file upload
                            $.ajax({
                                url: BaseURL + "/HRModuleExpenseUpload",
                                type: 'POST',
                                data: JSON.stringify({
                                    staffId: sessionStorage.getItem("userId"),
                                    expense_name: self.expenseName(),
                                    description: self.description(),
                                    total_amount: self.totalAmount(),
                                    tax_include: self.taxInclude(),
                                    file_name: null,  // No file name
                                    file: null,       // No file content
                                }),
                                contentType: 'application/json',
                                dataType: 'json',
                                timeout: sessionStorage.getItem("timeInterval"),
                                context: self,
                                error: function (xhr, textStatus, errorThrown) {
                                    console.log(textStatus);
                                    popup.close(); // Close the loading popup on error
                                },
                                success: function (data) {
                                    console.log(data);
                                    let popup = document.getElementById("popup");
                                    popup.close();
                                    let popup1 = document.getElementById("successView");
                                    popup1.open();
                                }
                            });
                        }
                    }
                };                

                self.myExpenseDet = ko.observableArray([]);
                self.ExpenseYearDet = ko.observableArray([]);
                self.yearFilter = ko.observable('');
                self.currencyType = ko.observable("");
                self.AmountHeaderText = ko.observable("");

                self.getMyExpense = () => {
                    self.myExpenseDet([]); // Reset the expense details array
                    document.getElementById('loaderView').style.display = 'block';
                    document.getElementById('expense').style.display = 'none';
                    document.getElementById('report').style.display = 'none';
                    
                    $.ajax({
                        url: BaseURL + "/HRModuleGetMyExpense",
                        type: 'POST',
                        data: JSON.stringify({
                            userId: sessionStorage.getItem("userId")
                        }),
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
                            document.getElementById('expense').style.display = 'none';
                            document.getElementById('report').style.display = 'none';
                            document.getElementById('myExpenseTable').style.display = 'block';

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

                            var data = JSON.parse(result[0]);
                            var data1 = JSON.parse(result[1]);
                            console.log(data);
                            console.log(data1);

                            if (data.length != 0) {
                                for (var i = 0; i < data.length; i++) {
                                    self.myExpenseDet.push({
                                        'id': data[i][0],
                                        'expense_no': data[i][0],
                                        'expense_name': data[i][1],
                                        'request_date': data[i][2],
                                        'amount': data[i][3],
                                        'view': data[i][4],
                                        'status': data[i][5],
                                        'payment_status': data[i][6]
                                    });
                                }
                            }

                            var j = 0;
                            if (data1.length != 0) {
                                self.ExpenseYearDet([]); 
                                for (j = 0; j < data1.length; j++) {
                                    self.ExpenseYearDet.push({ "label": data1[j][0], "value": data1[j][0] });
                                }
                                self.ExpenseYearDet.unshift({ value: 'All', label: 'All' }); // Add 'All' option at the top
                            }
                        }
                    });
                };
                
                self.yearList = new ArrayDataProvider(this.ExpenseYearDet, { keyAttributes: "value" });
                self.myExpenseData = new ArrayDataProvider(self.myExpenseDet, { keyAttributes: "id" });

                self.filter = ko.observable('');

                self.myExpenseData = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filter() && this.filter() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filter() }
                        });
                    }
                    const arrayDataProvider = new ArrayDataProvider(self.myExpenseDet, { 
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

                self.ExpenseDet = ko.observableArray([]);
                self.ExpenseYearDet2 = ko.observableArray([]);
                self.yearFilter2 = ko.observable('');

                self.getExpense = () => {
                    self.ExpenseDet([]);
                    document.getElementById('loaderView').style.display = 'block';
                    
                    $.ajax({
                        url: BaseURL + "/HRModuleGetAllExpense",
                        type: 'POST',
                        data: JSON.stringify({
                            userId: sessionStorage.getItem("userId")
                        }),
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
                            document.getElementById('expense').style.display = 'block';
                            document.getElementById('ExpenseTable').style.display = 'block';

                            var data = JSON.parse(result[0]);
                            var data1 = JSON.parse(result[1]);
                            console.log(data);
                            console.log(data1);

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
                                        'status': data[i][8],
                                        'payment_status': data[i][9]        
                                    });
                                }
                            }

                            var j = 0;
                            if (data1.length != 0) {
                                self.ExpenseYearDet2([]); 
                                for (j = 0; j < data1.length; j++) {
                                    self.ExpenseYearDet2.push({ "label": data1[j][0], "value": data1[j][0] });
                                }
                                self.ExpenseYearDet2.unshift({ value: 'All', label: 'All' }); // Add 'All' option at the top
                            }
                        }
                    });
                };
                
                self.yearList2 = new ArrayDataProvider(this.ExpenseYearDet2, { keyAttributes: "value" });                                 
                self.ExpenseData = new ArrayDataProvider(self.ExpenseDet, { keyAttributes: "id" });

                self.filter2 = ko.observable('');

                self.ExpenseData = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filter2() && this.filter2() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filter2() }
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

                self.handleValue2 = () => {                
                    self.filter2(document.getElementById('searchFilter2').rawValue);
                };

                self.totalExpense = ko.observable('');
                self.totalAmountText = ko.observable("");
  
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

                            if(self.currency() == null){
                                location.reload()
                            }
                            if(self.currency() =='INR'){
                                self.currencyType('₹')
                            }else if(self.currency() =='USD'){
                                self.currencyType('$')
                            }else if(self.currency() =='GBP'){
                                self.currencyType('£')
                            }
                            self.totalAmountText(self.currencyType())

                            if (data && data.length > 0) {
                                const totalWithCurrency = data[0][0]+' '+self.totalAmountText();
                                self.totalExpense(totalWithCurrency);
                            }
                        }
                    });
                };

                self.dueDate = ko.observable();

                self.ExpenseReportDet = ko.observableArray([]);

                self.statusFilter = ko.observable('');

                self.statusOption = [
                    {"label":"All","value":"All"},
                    {"label":"Requested","value":"Requested"},
                    {"label":"Approved","value":"Approved"},
                    {"label":"Denied","value":"Denied"},
                ]

                self.statusList = new ArrayDataProvider(self.statusOption, {
                    keyAttributes: 'value'
                });

                self.DepartmentDet = ko.observableArray([]);
                self.designation  = ko.observable('');
                self.department  = ko.observable('');
                self.departmentFilter  = ko.observable('');
                self.departmentFilter(["All"])
                self.designationFilter  = ko.observable('');
                self.designationFilter(["All"])
                self.staffFilter  = ko.observable('');
                self.staffFilter(["All"])
                self.statusFilter(["All"])
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const day = currentDate.getDate();
                
                self.designationMissing = ko.observable();
                self.staffMissing = ko.observable();


                self.fromDate = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date(year, 0, 1)));
                self.datePicker = {
                    numberOfMonths: 1
                };

                self.toDate = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date(year, month,day)));
                self.blob = ko.observable()
                self.fileName = ko.observable()

                self.getDepartment = ()=>{
                    $.ajax({
                        url: BaseURL+"/HRModuleGetDesignation",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            // Clear the DepartmentDet array before populating it
                            if(data[1].length !=0){
                                for (var i = 0; i < data[1].length; i++) {
                                    self.DepartmentDet.push({'value': data[1][i][0],'label': data[1][i][1]  });
                                }
                                self.DepartmentDet.unshift({ value: 'All', label: 'All' });
                            }
                        }
                    })
                }
                self.departmentList = new ArrayDataProvider(this.DepartmentDet, { keyAttributes: "value"});

                self.DesignationDet = ko.observableArray([]);
                self.StaffDet = ko.observableArray([]);

                self.getDesignationFilter = ()=>{
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL+"/getDesignationWithDepartment",
                        type: 'POST',
                        data: JSON.stringify({
                            departmentId : self.departmentFilter()
                        }),
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display='none';
                            console.log(data)
                            self.DesignationDet([])
                            if(data[0].length !=0){ 
                                for (var i = 0; i < data[0].length; i++) {
                                    var newValue = data[0][i][1]; 
                                    var exists = self.DesignationDet().some(function (designation) {
                                        return designation.value === newValue;
                                    });

                                    if (!exists) {
                                        self.DesignationDet.push({
                                            'value': newValue,
                                            'label': data[0][i][1]
                                        });
                                    }
                                }
                                self.DesignationDet.unshift({ value: 'All', label: 'All' });
                            }
                        }
                    })
                }
                self.designationList = new ArrayDataProvider(this.DesignationDet, { keyAttributes: "value"});
 

                self.getStaffList = ()=>{
                    self.designationMissing(""); 
                    // document.getElementById('loaderView').style.display='block';
                    if(self.designationFilter() !=''){
                    $.ajax({
                        url: BaseURL+"/getStaffWithSelection",
                        type: 'POST',
                        data: JSON.stringify({
                            departmentId : self.departmentFilter(),
                            designationId : self.designationFilter()
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
                            if(data[0].length !=0){ 
                                for (var i = 0; i < data[0].length; i++) {
                                    var newValue = data[0][i][0]; 
                                    var exists = self.StaffDet().some(function (staff) {
                                        return staff.value === newValue;
                                    });

                                    if (!exists) {
                                        self.StaffDet.push({
                                            'value': newValue,
                                            'label': data[0][i][1] + " " + data[0][i][2] + " " + data[0][i][3]
                                        });
                                    }
                                }
                                self.StaffDet.unshift({ value: 'All', label: 'All' });
                            }
                        }
                    })
                }
                }
                self.staffList = new ArrayDataProvider(this.StaffDet, { keyAttributes: "value"});
 
                self.clearStaffError = ()=>{
                    self.staffMissing(""); 
                }
                function getAllExpenseReport(){
                    self.ExpenseReportDet([]);
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetAllExpenseReport",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display='none';
                            document.getElementById('actionView').style.display='block';
                            let totalSum = 0;
                            if(data[0]!="No data found"){
                            data = JSON.parse(data[0]);
                            console.log(data)
                                var csvContent = '';
                                var headers = ['Expense No', 'Name', 'Designation', 'Department', 'Expense Name', 'Amount', 'Date of Request', 'Status', 'Payment Status'];
                                csvContent += headers.join(',') + '\n';

                                for (var i = 0; i < data.length; i++) {
                                    let total_amount = parseFloat(data[i][7])
                                    self.ExpenseReportDet.push({
                                        'expense_no': data[i][0],
                                        'name': data[i][1] + " "+ data[i][2] +" "+ data[i][3],
                                        'designation': data[i][4],
                                        'department': data[i][5],
                                        'expense_name': data[i][6],
                                        'amount': data[i][7],
                                        'date_of_request': data[i][8],
                                        'status': data[i][9],
                                        'payment_status': data[i][10],
                                    });
                                    totalSum += total_amount;
                                    var rowData = [data[i][0], data[i][1] + " "+ data[i][2] +" "+ data[i][3],data[i][4],data[i][5], data[i][6], data[i][7], data[i][8], data[i][9], data[i][10]]; 
                                    csvContent += rowData.join(',') + '\n';
                                }

                                self.ExpenseReportDet.push({
                                    'expense_no': '',
                                    'name': '',
                                    'designation': '', 
                                    'department': '',
                                    'expense_name': '',
                                    'amount': '<strong>' + totalSum.toFixed(2) + '</strong>',
                                    'date_of_request': '', 
                                    'status': '', 
                                    'payment_status': '', 
                                });
                                csvContent += [ '', '', '', '', '',totalSum.toFixed(2),'', '','' ].join(',') + '\n'; 

                                var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                var today = new Date();
                                var fileName = 'Expense_Report_' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '.csv';
                                self.blob(blob);
                                self.fileName(fileName);
                            }
                            else{
                                var csvContent = '';
                                var headers = ['Expense No', 'Name', 'Designation', 'Department', 'Expense Name', 'Amount', 'Date of Request', 'Status', 'Payment Status'];
                                csvContent += headers.join(',') + '\n';
                                var rowData = []; 
                                csvContent += rowData.join(',') + '\n';
                                var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                var today = new Date();
                                var fileName = 'Expense_Report_' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '.csv';
                                self.blob(blob);
                                self.fileName(fileName);
                            }

                        }
                    })
                }

                self.showData = ()=>{
                    document.getElementById('ReportTable').style.display='none';
                    document.getElementById('loaderView').style.display='block';
                    let fromDate = self.fromDate()
                    let toDate = self.toDate();
                    let department = self.departmentFilter();
                    department = department.join(",");
                    let designation = self.designationFilter();
                    designation = designation.join(",");
                    let staff = self.staffFilter();
                    staff = staff.join(",");
                    if(designation == ''){
                        self.designationMissing("Please select a designation");
                        document.getElementById('loaderView').style.display='none';
                    }
                    else{
                        self.designationMissing(""); 
                    }
                    if(staff == ''){
                        self.staffMissing("Please select a staff");
                        document.getElementById('loaderView').style.display='none';
                    }
                    else{
                        self.staffMissing(""); 
                    }
                    let status = self.statusFilter();
                    status = status.join(",");
                    if(self.designationMissing() =="" && self.staffMissing() ==""){
                    $.ajax({
                        url: BaseURL+"/getSelectedExpenseReport",
                        type: 'POST',
                        data: JSON.stringify({
                            fromDate: fromDate,
                            toDate: toDate,
                            department: department,
                            designation: designation,
                            staff: staff,
                            status : status
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            self.ExpenseReportDet([])
                            document.getElementById('loaderView').style.display='none';
                            document.getElementById('ReportTable').style.display='block';
                            let totalSum = 0;
                            if(data[0]!="No data found"){
                            data = JSON.parse(data[0]);
                            console.log(data)
                                var csvContent = '';
                                    var headers = ['Expense No', 'Name', 'Designation', 'Department', 'Expense Name', 'Amount', 'Date of Request', 'Status', 'Payment Status'];
                                    csvContent += headers.join(',') + '\n';

                                for (var i = 0; i < data.length; i++) {
                                    let total_amount = parseFloat(data[i][7])
                                    self.ExpenseReportDet.push({
                                        'expense_no': data[i][0],
                                        'name': data[i][1] + " "+ data[i][2] +" "+ data[i][3],
                                        'designation': data[i][4],
                                        'department': data[i][5],
                                        'expense_name': data[i][6],
                                        'amount': data[i][7],
                                        'date_of_request': data[i][8],
                                        'status': data[i][9],
                                        'payment_status': data[i][10],
                                    });
                                    totalSum += total_amount;
                                    var rowData = [data[i][0], data[i][1] + " "+ data[i][2] +" "+ data[i][3],data[i][4],data[i][5], data[i][6], data[i][7], data[i][8], data[i][9], data[i][10]]; 
                                    csvContent += rowData.join(',') + '\n';
                                }

                                self.ExpenseReportDet.push({
                                    'expense_no': '',
                                    'name': '',
                                    'designation': '', 
                                    'department': '',
                                    'expense_name': '',
                                    'amount': '<strong>' + totalSum.toFixed(2) + '</strong>',
                                    'date_of_request': '', 
                                    'status': '', 
                                    'payment_status': '', 
                                });
                                csvContent += [ '', '', '', '', '',totalSum.toFixed(2),'', '','' ].join(',') + '\n'; 

                                var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                var today = new Date();
                                var fileName = 'Expense_Report_' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '.csv';
                                self.blob(blob);
                                self.fileName(fileName);
                            }
                             else{
                                var csvContent = '';
                                var headers = ['Expense No', 'Name', 'Designation', 'Department', 'Expense Name', 'Amount', 'Date of Request', 'Status', 'Payment Status'];
                                csvContent += headers.join(',') + '\n';
                                var rowData = []; 
                                csvContent += rowData.join(',') + '\n';
                                var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                var today = new Date();
                                var fileName = 'Expense_Report_' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '.csv';
                                self.blob(blob);
                                self.fileName(fileName);
                            }

                        }
                    })
                }

                }

                self.ExpenseList = new ArrayDataProvider(this.ExpenseReportDet, { keyAttributes: "id"});

                self.ReportFilter = ko.observable('');

                self.ExpenseList = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.ReportFilter() && this.ReportFilter() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.ReportFilter() }
                        });
                    }
                    const arrayDataProvider = new ArrayDataProvider(self.ExpenseReportDet, { 
                        keyAttributes: 'id',
                        sortComparators: {
                            comparators: new Map().set("dob", this.comparator),
                        },
                    });
                    
                    return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
                }, self);

                self.handleValueStaff = () => {
                    self.ReportFilter(document.getElementById('ReportFilter').rawValue);
                };
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

                self.expenseName2 = ko.observable();
                self.description2 = ko.observable();
                self.totalAmount2 = ko.observable();
                self.taxInclude2 = ko.observable();
                self.editFileCheck= ko.observable('');
                self.editMyStatus = ko.observable('');
                self.deniedNotes = ko.observable('');
                self.paymentStatus = ko.observable('');
                self.editFileContent = ko.observable('');

                self.statusOption2 = [
                    {"label":"Requested","value":"Requested"},
                    {"label":"Approved","value":"Approved"},
                    {"label":"Denied","value":"Denied"},
                ]

                self.statusList2 = new ArrayDataProvider(self.statusOption2, {
                    keyAttributes: 'value'
                });

                self.statusOption3 = [
                    {"label":"Requested","value":"Requested"},
                    {"label":"Approved","value":"Approved"},
                    {"label":"Denied","value":"Denied"},
                ]

                self.statusList3 = new ArrayDataProvider(self.statusOption3, {
                    keyAttributes: 'value'
                });

                self.editMyExpense = (event,data)=>{
                    var clickedExpenseId = data.item.data.id
                    sessionStorage.setItem("expenseId", clickedExpenseId);
                    self.getMyExpenseInfo();
                    document.querySelector('#openEditMyExpense').open();
                }

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
                
                self.FormSubmit2 = function () {
                    const formValid = self._checkValidationGroup("formValidationEditMyExpense"); 
                    if (formValid) {
                        document.getElementById('loaderView').style.display = 'block';
                        
                        var selectedFile = self.selectedFile();
                
                        if (selectedFile) {
                            // File is selected, handle the file upload
                            var documentFileName = selectedFile.name;
                            const reader = new FileReader();
                            reader.readAsDataURL(selectedFile);
                
                            reader.onload = function () {
                                const fileContent = reader.result;
                                $.ajax({
                                    url: BaseURL + "/HRModuleUpdateMyExpense",
                                    type: 'POST',
                                    data: JSON.stringify({
                                        expenseId: sessionStorage.getItem("expenseId"),
                                        expense_name : self.expenseName2(),
                                        description : self.description2(),
                                        total_amount : self.totalAmount2(),
                                        tax_include : self.taxInclude2(),
                                        file_name: documentFileName,
                                        file : fileContent,
                                    }),
                                    contentType: 'application/json',
                                    dataType: 'json',
                                    timeout: sessionStorage.getItem("timeInterval"),
                                    context: self,
                                    error: function (xhr, textStatus, errorThrown) {
                                        console.log(textStatus);
                                        document.getElementById('loaderView').style.display = 'none';
                                    },
                                    success: function (data) {
                                        console.log(data);
                                        document.querySelector('#openEditMyExpense').close();
                                        document.getElementById('loaderView').style.display = 'none';
                                        let popup1 = document.getElementById("successView");
                                        popup1.open();
                                    }
                                });
                            };
                        } else {
                            // No file is selected, proceed without file upload
                            $.ajax({
                                url: BaseURL + "/HRModuleUpdateMyExpense",
                                type: 'POST',
                                data: JSON.stringify({
                                    expenseId: sessionStorage.getItem("expenseId"),
                                    expense_name : self.expenseName2(),
                                    description : self.description2(),
                                    total_amount : self.totalAmount2(),
                                    tax_include : self.taxInclude2(),
                                    file_name: null,
                                    file : null,
                                }),
                                contentType: 'application/json',
                                dataType: 'json',
                                timeout: sessionStorage.getItem("timeInterval"),
                                context: self,
                                error: function (xhr, textStatus, errorThrown) {
                                    console.log(textStatus);
                                    popup.close(); // Close the loading popup on error
                                },
                                success: function (data) {
                                    console.log(data);
                                    document.querySelector('#openEditMyExpense').close();
                                    // let popup = document.getElementById("popup");
                                    // popup.close();
                                    let popup1 = document.getElementById("successView");
                                    popup1.open();
                                }
                            });
                        }
                    }
                };

                self.editAllExpense = (event,data)=>{
                    var clickedExpenseId = data.item.data.id
                    sessionStorage.setItem("expenseId", clickedExpenseId);
                    self.getMyExpenseInfo();
                    document.querySelector('#reviewAllExpense').open();
                }

                self.FormSubmit3 = () => {
                    const formValid = self._checkValidationGroup("formValidationReviewAllExpense"); 
                    if (formValid) {
                        let popup = document.getElementById("popup");
                        popup.open();
                
                        $.ajax({
                            url: BaseURL + "/HRModuleUpdateAllExpense",
                            type: 'POST',
                            data: JSON.stringify({
                                expenseId: sessionStorage.getItem("expenseId"),
                                editMyStatus : self.editMyStatus(),
                                deny_note : self.deniedNotes(),
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                console.log(data);
                                let popup = document.getElementById("popup");
                                popup.close();
                                let popup1 = document.getElementById("successView2");
                                popup1.open();
                            }
                        });
                    }
                };

                self.statusUpdateList = (event,data)=>{
                    let expenseId =  data.item.data.id;
                    let status = event.detail.value;
                    sessionStorage.setItem('expenseId',expenseId) 
                    sessionStorage.setItem('status',status) 
                    if(status == 'Denied'){
                        document.querySelector('#openEditMyStatus').open();                            
                    }else{
                        self.statusUpdate()
                    }
                }

                self.noteSubmit = ()=>{
                    self.statusUpdate()
                }

                self.statusUpdate = ()=>{
                    var formValidNote = self._checkValidationGroup("formValidationNote"); 
                    if(sessionStorage.getItem('status') == 'Denied'){
                        sessionStorage.setItem('denyNote',self.deniedNotes()) 
                    }else{
                        formValidNote=true;
                        sessionStorage.setItem('denyNote','') 
                    }
                    if (formValidNote) {
                        let popup = document.getElementById("popup");
                        popup.open();
                        $.ajax({
                            url: BaseURL+"/HRModuleUpdateExpenseList",
                            type: 'POST',
                            data: JSON.stringify({
                                expenseId: sessionStorage.getItem('expenseId'),
                                status : sessionStorage.getItem('status'),
                                deny_note : sessionStorage.getItem('denyNote'),
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
                                document.querySelector('#openEditMyStatus').close();                            
                                self.getMyExpense();
                            }
                        })
                    }
                }

                self.fromDateExpense = ko.observable('')
                self.toDateExpense = ko.observable('')

                self.showExpenseData = ()=>{
                    self.myExpenseDet([]);
                    document.getElementById('loaderView').style.display='block';
                    let fromDate = self.fromDateExpense()
                    let toDate = self.toDateExpense();
                    $.ajax({
                        url: BaseURL+"/HRModuleGetExpenseListFilter",
                        type: 'POST',
                        data: JSON.stringify({
                            userId : sessionStorage.getItem("userId"),
                            fromDate : fromDate,
                            toDate : toDate
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            data = JSON.parse(data[0]);
                            console.log(data)
                            document.getElementById('loaderView').style.display='none';
                            if(data.length!=0){
                                for (var i = 0; i < data.length; i++) {
                                    self.myExpenseDet.push({
                                        'id': data[i][0],
                                        'expense_no': data[i][0],
                                        'expense_name': data[i][1],
                                        'request_date': data[i][2],
                                        'amount': data[i][3],
                                        'view': data[i][4],
                                        'status': data[i][5],
                                        'payment_status': data[i][6]                                  
                                    }); 
                                } 
                            }
                        }
                    })
                }

                self.statusUpdateAllFunction = (event,data)=>{
                    let expenseId =  data.item.data.id;
                    let status = event.detail.value;
                    sessionStorage.setItem('expenseId',expenseId) 
                    sessionStorage.setItem('status',status) 
                    if(status == 'Denied'){
                        document.querySelector('#openEditAllStatus').open();                            
                    }else{
                        self.statusUpdateAll()
                    }
                }

                self.noteSubmitAll = ()=>{
                    self.statusUpdateAll()
                }

                self.statusUpdateAll = ()=>{
                    var formValidNote = self._checkValidationGroup("formValidationNote2"); 
                    if(sessionStorage.getItem('status') == 'Denied'){
                        sessionStorage.setItem('denyNote',self.deniedNotes()) 
                    }else{
                        formValidNote=true;
                        sessionStorage.setItem('denyNote','') 
                    }
                    if (formValidNote) {
                        let popup = document.getElementById("popup");
                        popup.open();
                        $.ajax({
                            url: BaseURL+"/HRModuleUpdateAllExpense",
                            type: 'POST',
                            data: JSON.stringify({
                                expenseId: sessionStorage.getItem('expenseId'),
                                editMyStatus : sessionStorage.getItem('status'),
                                deny_note : sessionStorage.getItem('denyNote'),
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
                                document.querySelector('#openEditAllStatus').close();                            
                                self.getExpense();
                            }
                        })
                    }
                }

                self.fromDateExpense2 = ko.observable('')
                self.toDateExpense2 = ko.observable('')

                self.showExpenseData2 = ()=>{
                    self.ExpenseDet([]);
                    document.getElementById('loaderView').style.display='block';
                    let fromDate = self.fromDateExpense2()
                    let toDate = self.toDateExpense2();
                    $.ajax({
                        url: BaseURL+"/HRModuleGetAllExpenseListFilter",
                        type: 'POST',
                        data: JSON.stringify({
                            userId : sessionStorage.getItem("userId"),
                            fromDate : fromDate,
                            toDate : toDate
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
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
                                        'status': data[i][8],
                                        'payment_status': data[i][9]                                
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
        return  expense;
    }
);