define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider","ojs/ojlistdataproviderview","ojs/ojdataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable","ojs/ojactioncard","ojs/ojavatar"], 
    function (oj,ko,$, app, ArrayDataProvider,ListDataProviderView, ojdataprovider_1, FilePickerUtils) {

        class AssetManager {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = sessionStorage.getItem("BaseURL")

                self.AssetDet = ko.observableArray([]);

                
                self.department = ko.observable('');

                self.departments = [
                    {"label":"High","value":"High"},
                    {"label":"Medium","value":"Medium"},
                    {"label":"Low","value":"Low"}
                ]
                self.departmentList = new ArrayDataProvider(self.departments, {
                    keyAttributes: 'value'
                });








    
                self.CancelBehaviorOpt = ko.observable('icon'); 
                

                self.selectedTab = ko.observable("allAsset"); 


                self.tabData = [
                    { id: "allAsset", label: "All Assets" },
                    { id: "companyNotice", label: "Get Report" },
                ];

                let userrole = sessionStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);

                self.notificationCount = ko.observable(0); 
                
                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
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
                        $("#companyNotice").hide();
                    }else if(self.selectedTab() == 'companyNotice'){
                        $("#allAsset").hide();
                        $("#companyNotice").show();
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
                                console.log(data)
                                data=data[0]
                                console.log(data.length)
                                document.getElementById('loaderView').style.display='none';
                                document.getElementById('actionView').style.display='block';
                                if(data.length!=0){
                                for (var i = 0; i < data.length; i++) {
                                    self.AssetDet.push({
                                        'slno': i+1,
                                        'assetId':data[i][0], 
                                        'asset_no': "AS" + data[i][0],                                    
                                        'asset_name':  data[i][2],
                                        'po_no':"PO"+ data[i][1], 
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

              


                self.goToAsset = (event,data)=>{
                    var clickedRowId = data.item.data.assetId
                    sessionStorage.setItem("assetId", clickedRowId);
                    self.router.go({path:'assetView'})
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