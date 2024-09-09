define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider",  "ojs/ojconverterutils-i18n",  "ojs/ojlistdataproviderview", "ojs/ojdataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable","ojs/ojavatar","ojs/ojradioset","ojs/ojinputsearch","ojs/ojselectcombobox"], 
    function (oj,ko,$, app, ArrayDataProvider,  ojconverterutils_i18n_1, ListDataProviderView, ojdataprovider_1, FilePickerUtils) {

        class Task {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = sessionStorage.getItem("BaseURL")
                
                self.taskName = ko.observable();
                self.dueDate = ko.observable();

                self.CancelBehaviorOpt = ko.observable('icon'); 

                self.TaskDet = ko.observableArray([]);

                self.statusFilter = ko.observable('');

                self.statusOption = [
                    {"label":"All","value":"All"},
                    {"label":"Pending","value":"Pending"},
                    {"label":"Approved","value":"Approve"},
                    {"label":"Rejected","value":"Reject"},
                ]

                self.statusList = new ArrayDataProvider(self.statusOption, {
                    keyAttributes: 'value'
                });

                self.DesignationDet2 = ko.observableArray([]);
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
                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getDepartment();
                        //self.getDesignation();
                        getAllTaskReport();

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
                                    console.log(data[0][i][1])
                                    self.DesignationDet.push({'value': data[0][i][1],'label': data[0][i][1]  });
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
                                    self.StaffDet.push({'value': data[0][i][0],'label': data[0][i][1] + " " +  data[0][i][2] + " " +  data[0][i][3]  });
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
                function getAllTaskReport(){
                    self.TaskDet([]);
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetAllLeaveReport",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display='none';
                            document.getElementById('actionView').style.display='block';
                            if(data[0]!="No data found"){
                            data = JSON.parse(data[0]);
                            console.log(data)
                                var csvContent = '';
                                var headers = ['SL.NO', 'Name', 'Department', 'Designation', 'Leave Type','Start Date', 'End Date',
                                            'Status'];
                                csvContent += headers.join(',') + '\n';

                                for (var i = 0; i < data.length; i++) {
                                    self.TaskDet.push({
                                        'slno': i+1,
                                        'name': data[i][1] + " "+ data[i][2] +" "+ data[i][3],
                                        'designation': data[i][4],
                                        'department': data[i][5],
                                        'leave_type': data[i][6],
                                        'start_date': data[i][7],
                                        'end_date': data[i][8],
                                        'status': data[i][9],
                                    });
                                    var rowData = [i+1, data[i][1] + " "+ data[i][2] +" "+ data[i][3],data[i][4],data[i][5], data[i][6], data[i][7], 
                                    data[i][8], data[i][9] ]; 
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
                                var headers = ['SL.NO', 'Name', 'Department', 'Designation', 'Leave Type','Start Date', 'End Date',
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
                    })
                }

                self.showData = ()=>{
                    document.getElementById('staffTable').style.display='none';
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
                        url: BaseURL+"/getSelectedLeaveReport",
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
                            self.TaskDet([])
                            document.getElementById('loaderView').style.display='none';
                            document.getElementById('staffTable').style.display='block';
                            if(data[0]!="No data found"){
                            data = JSON.parse(data[0]);
                            console.log(data)
                                var csvContent = '';
                                    var headers = ['SL.NO', 'Name', 'Department', 'Designation', 'Leave Type','Start Date', 'End Date',
                                            'Status'];
                                    csvContent += headers.join(',') + '\n';

                                for (var i = 0; i < data.length; i++) {
                                    self.TaskDet.push({
                                        'slno': i+1,
                                        'name': data[i][1] + " "+ data[i][2] +" "+ data[i][3],
                                        'designation': data[i][4],
                                        'department': data[i][5],
                                        'leave_type': data[i][6],
                                        'start_date': data[i][7],
                                        'end_date': data[i][8],
                                        'status': data[i][9],
                                    });
                                    var rowData = [i+1, data[i][1] + " "+ data[i][2] +" "+ data[i][3],data[i][4],data[i][5], data[i][6], data[i][7], 
                                    data[i][8], data[i][9] ]; 
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
                                var headers = ['SL.NO', 'Name', 'Department', 'Designation', 'Leave Type','Start Date', 'End Date',
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
                    })
                }

                }


                self.TaskList = new ArrayDataProvider(this.TaskDet, { keyAttributes: "id"});

                self.filter = ko.observable('');

                self.TaskList = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filter() && this.filter() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filter() }
                        });
                    }
                    const arrayDataProvider = new ArrayDataProvider(self.TaskDet, { 
                        keyAttributes: 'id',
                        sortComparators: {
                            comparators: new Map().set("dob", this.comparator),
                        },
                    });
                    
                    return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
                }, self);

                self.handleValueStaff = () => {
                    self.filter(document.getElementById('filter').rawValue);
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

                  self.back = ()=>{
                    self.router.go({path:'leaves'})
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
        return  Task;
    }
);