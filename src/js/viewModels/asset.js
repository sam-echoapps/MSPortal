define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider","ojs/ojconverterutils-i18n","ojs/ojlistdataproviderview","ojs/ojdataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable","ojs/ojactioncard","ojs/ojavatar", "ojs/ojradioset","ojs/ojselectcombobox"], 
    function (oj,ko,$, app, ArrayDataProvider,ojconverterutils_i18n_1,ListDataProviderView, ojdataprovider_1, FilePickerUtils) {

        class AssetManager {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = sessionStorage.getItem("BaseURL")

                self.AssetDet = ko.observableArray([]);

                
                self.department = ko.observable(['All']);
                self.departments= ko.observableArray([]);
                self.category = ko.observable(['All']);
                self.categories = ko.observableArray([]);
        








    
                self.CancelBehaviorOpt = ko.observable('icon'); 
                

                self.selectedTab = ko.observable("allAsset"); 


                self.tabData = [
                    { id: "allAsset", label: "All Assets" },
                    { id: "report", label: "Get Report" },
                ];

                let userrole = sessionStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);

                self.notificationCount = ko.observable(0); 

                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const day = currentDate.getDate();

                self.fromDate = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date(year, 0, 1)));
                self.datePicker = {
                    numberOfMonths: 1
                };
                self.toDate = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date(year, month,day)));
                self.departmentMissing = ko.observable('');
                self.categoryMissing = ko.observable('');

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
                self.AssetReportDet = ko.observableArray([]);
                self.blob = ko.observable()
                self.fileName = ko.observable()

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getAssetFilterList();
                        self.getAssetInfoList();
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

                self.selectedTabAction1 = ko.computed(() => { 
                    if(self.selectedTab() == 'allAsset'){
                        $("#allAsset").show();
                        $("#report").hide();
                    }else if(self.selectedTab() == 'report'){
                        $("#allAsset").hide();
                        $("#report").show();
                    }
                    });

                    
                    self.getAssetInfoList = ()=>{    
                        self.AssetDet([]);
                        document.getElementById('loaderView').style.display='block';
                        $.ajax({
                            url: BaseURL+"/HRModuleGetAssetInfoList",
                            type: 'GET',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                let pono=null;
                                console.log(data)
                                data=data[0]
                                console.log(data.length)
                                document.getElementById('loaderView').style.display='none';
                                document.getElementById('actionView').style.display='block';
                                if(data.length!=0){
                                for (var i = 0; i < data.length; i++) {
                                    if(data[i][1] != null){
                                        pono = "PO"+ data[i][1]
                                    }
                                    self.AssetDet.push({
                                        'slno': i+1,
                                        'assetId':data[i][0], 
                                        'asset_no': "AS" + data[i][0],                                    
                                        'asset_name':  data[i][2],
                                        'po_no': pono, 
                                        'product_name': data[i][3],
                                    });
                                }
                                
                                 }
                            }  
                        });
                    }

                    self.AssetList = new ArrayDataProvider(this.AssetDet, { keyAttributes: "id"});

                    self.filter = ko.observable('');
                    self.handleValueAsset = () => {
                        self.filter(document.getElementById('filter').rawValue);
                    };

               
                self.AssetList = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filter() && this.filter() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filter() }
                        });
                    }
                    const arrayDataProvider = new ArrayDataProvider(self.AssetDet, { 
                        keyAttributes: 'id',
                        sortComparators: {
                            comparators: new Map().set("dob", this.comparator),
                        },
                    });

                    return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
                }, self);

              
                self.getAssetFilterList = ()=>{    
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
                                    self.categories.push({'value': data1[i][1],'label': data1[i][1]  });
                                }
                                self.categories.unshift({ value: 'All', label: 'All' });
                            }
                            data2= result[1]
                            console.log(data2)
                            if(data2.length !=0){
                                for (var i = 0; i < data2.length; i++) {
                                    self.departments.push({'value': data2[i][0],'label': data2[i][1]  });
                                }
                                self.departments.unshift({ value: 'All', label: 'All' });
                            }
                            // data3= result[2]
                            // console.log(data3)
                            // if(data3.length !=0){
                            //     for (var i = 0; i < data3.length; i++) {
                            //         self.StaffDet.push({'value': data3[i][0],'label': data3[i][1]+" "+data3[i][2]+ " " +data3[i][3]  });
                            //     }
                            // }
                        }  
                    });                
                }
                 self.categoryListDet = new ArrayDataProvider(this.categories, { keyAttributes: "value"});
                 self.DepartmentList = new ArrayDataProvider(this.departments, { keyAttributes: "value"});
                // self.StaffList = new ArrayDataProvider(this.StaffDet, { keyAttributes: "value"});




                self.goToAsset = (event,data)=>{
                    var clickedRowId = data.item.data.assetId
                    sessionStorage.setItem("assetId", clickedRowId);
                    self.router.go({path:'assetView'})
                }

                self.goToAssetView = (event,data)=>{
                    var clickedRowId = data.item.data.assetId
                    sessionStorage.setItem("assetId", clickedRowId);
                    self.router.go({path:'assetAddView'})
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
 
                self.addNotice = ()=>{
                    document.querySelector('#openAddNotice').open();
                }
               
                self.addAsset = (event,data)=>{
                    self.router.go({path:'assetAdd'})
                }
               
                self.priceFilterCheck = ()=> {
                    if(self.priceFilter() == ''){
                        self.priceMissing("Please select a price range");
                    }else{
                    self.priceMissing('');
                    }
                }

                self.showData = ()=>{
                    self.AssetReportDet([]);
                    document.getElementById('loaderView').style.display='block';
                    let fromDate = self.fromDate()
                    let toDate = self.toDate();
                    let department = self.department();
                    department = department.join(",");
                    let category= self.category();
                    category = category.join(",");
                    let priceRange = self.priceFilter();
                    priceRange = priceRange.join(",");
                    if(self.department() == ''){
                        self.departmentMissing("Please select a department");
                        document.getElementById('loaderView').style.display='none';
                    }
                    else{
                        self.departmentMissing('');
                    }
                    if(self.category() == ''){
                        self.categoryMissing("Please select a category");
                        document.getElementById('loaderView').style.display='none';
                    }
                    else{
                        self.categoryMissing('');
                    }
                    if(self.priceFilter() == ''){
                        self.priceMissing("Please select a price range");
                        document.getElementById('loaderView').style.display='none';
                    }
                    else{
                        self.priceMissing('');
                    }
                    if (self.departmentMissing() == '' && self.categoryMissing() == ''&& self.priceMissing() == '') {
                    $.ajax({
                        url: BaseURL+"/getAssetReport",
                        type: 'POST',
                        data: JSON.stringify({
                            fromDate: fromDate,
                            toDate: toDate,
                            department : department,
                            category : category,
                            priceRange : priceRange
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            let owner_name;
                            let totalAmountSum = 0;
                        console.log(data)
                        document.getElementById('loaderView').style.display='none';
                        if(data[0]!="No data found"){
                        data = JSON.parse(data);
                        console.log(data)
                        var csvContent = '';
                            var headers = ['SL.NO', 'Asset No', 'Asset Name', 'Department', 'Owner', 'Category','Total Amount'];
                            csvContent += headers.join(',') + '\n';
                        if(data.length!=0){
                            for (var i = 0; i < data.length; i++) {
                                console.log(data[i][1])
                            if(data[i][5] != null){
                                owner_name = data[i][5] + " " + data[i][6]+ " " + data[i][7]
                            }else{
                                owner_name=""
                            }
                            let total_amount = parseFloat(data[i][10]) || 0; // Assuming data[i][10] holds total_amount

                            self.AssetReportDet.push({
                                'slno': i+1,
                                'asset_no': "AS"+data[i][0],
                                'asset_name': data[i][1],
                                'department': data[i][8],
                                'owner': owner_name,
                                'category': data[i][9],
                                'total_amount': data[i][10]                                                                                                                                     
                            });
                            totalAmountSum += total_amount;
                                var rowData = [i+1, "AS"+data[i][0],data[i][1],data[i][8],owner_name,data[i][9],data[i][10] ]; 
                                csvContent += rowData.join(',') + '\n';
                                
                            }
                            // Add the last row for the total sum
                            self.AssetReportDet.push({
                                'slno': '',  // Empty since it's a summary row
                                'asset_no': '',  // No asset number for summary
                                'asset_name': '',  // Indicate it's the total row
                                'department': '',
                                'owner': '',
                                'category': '',
                                'total_amount': totalAmountSum.toFixed(2)  // Sum of total_amounts
                            });
                            csvContent += [ '', '', '', '', '', '', totalAmountSum.toFixed(2) ].join(',') + '\n'; 

                            var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            var today = new Date();
                            var fileName = 'data_' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '.csv';
                            self.blob(blob);
                            self.fileName(fileName);
                            
                             }
                             else{
                                var csvContent = '';
                                var headers = ['SL.NO', 'Asset No', 'Asset Name', 'Department', 'Owner', 'Category','Total Amount'];
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

                self.AssetReportList = new ArrayDataProvider(this.AssetReportDet, { keyAttributes: "id"});

                self.filterReport = ko.observable('');
                self.handleValueAssetReport = () => {
                    self.filterReport(document.getElementById('filterReport').rawValue);
                };

                self.AssetReportList = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filterReport() && this.filterReport() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filterReport() }
                        });
                    }
                    const arrayDataProvider = new ArrayDataProvider(self.AssetReportDet, { 
                        keyAttributes: 'id',
                        sortComparators: {
                            comparators: new Map().set("dob", this.comparator),
                        },
                    });

                    return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
                }, self);

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
        return  AssetManager;
    }
);

// code after merging