define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", "ojs/ojlistdataproviderview", "ojs/ojdataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojselectcombobox","ojs/ojavatar","ojs/ojradioset","ojs/ojtable"], 
    function (oj,ko,$, app, ArrayDataProvider, ListDataProviderView, ojdataprovider_1, FilePickerUtils) {

        class editDocuments {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = localStorage.getItem("BaseURL")

                self.tabData = [
                    { id: "documents", label: "Public Documents" },
                    { id: "employee_documents", label: "My Documents" },
                ];

                self.selectedTab = ko.observable("documents");

                self.selectedTabAction = ko.computed(() => { 
                    if(self.selectedTab() == 'documents'){
                        $("#documents").show();
                        $("#employee_documents").hide();
                    }else if(self.selectedTab() == 'employee_documents'){
                        $("#documents").hide();
                        self.getDocuments2();
                        $("#employee_documents").show();
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
                
                self.connected = function () {
                    if (localStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getDocuments();

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
                            

                self.DocumentsDet = ko.observableArray([]);

                self.getDocuments = () => {
                    self.DocumentsDet([]);
                    document.getElementById('loaderView').style.display = 'block'; 
                    document.getElementById('employee_documents').style.display = 'none';                           
                    const userId = localStorage.getItem("userId");
                    $.ajax({
                        url: BaseURL + "/HRModuleGetDocuments3",
                        type: 'POST',
                        data: JSON.stringify({ userId: userId }),
                        contentType: 'application/json',
                        dataType: 'json',
                        timeout: localStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            data = JSON.parse(data[0]);
                            document.getElementById('document_view').style.display = 'block';
                            document.getElementById('employee_documents').style.display = 'none';
                            console.log(data);
                            document.getElementById('loaderView').style.display = 'none';
                            if (data.length != 0) {
                                for (var i = 0; i < data.length; i++) {
                                    self.DocumentsDet.push({
                                        'id': data[i][0],
                                        'no': i + 1,
                                        'document_name': data[i][1],
                                        'uploaded_date': data[i][2],
                                        'document_link': data[i][3],
                                        'uploaded_by': data[i][4],
                                        'user_role': data[i][5]
                                    });
                                }
                            }
                        }                        
                    });
                }                                
                
                self.documentData = new ArrayDataProvider(self.DocumentsDet, { keyAttributes: "id" });    
                
                self.filter = ko.observable('');

                self.documentData = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filter() && this.filter() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filter() }
                        });
                    }
                    const arrayDataProvider = new ArrayDataProvider(self.DocumentsDet, { 
                        keyAttributes: 'id',
                        sortComparators: {
                            comparators: new Map().set("dob", this.comparator),
                        },
                    });
                    
                    return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
                }, self);

                self.handleValueDocuments = () => {
                    self.filter(document.getElementById('filter').rawValue);
                };

                self.previewClick = (e) => {
                    e.preventDefault(); // Prevent the default anchor click behavior
                    const documentLink = e.target.closest('a').getAttribute('data-document-link');
                    console.log(documentLink); // Log the document link to verify
                
                    document.getElementById('loaderView').style.display = 'block';
                
                    $.ajax({
                        url: BaseURL + "/HRModulePdfView",
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
                            } else {
                                self.offerFileMessage("File not found");
                                setTimeout(() => {
                                    self.offerFileMessage("");
                                }, 3000);
                            }
                        }
                    });
                }; 

                self.DocumentsDet2 = ko.observableArray([]);

                self.getDocuments2 = () => {
                    self.DocumentsDet2([]);
                    document.getElementById('loaderView').style.display = 'block';              
                    $.ajax({
                        url: BaseURL + "/HRModuleGetDocuments",
                        type: 'POST',
                        data: JSON.stringify({
                            userId: localStorage.getItem("userId"),
                            userRole: localStorage.getItem("userRole"),
                            staffId: localStorage.getItem("staffId")  // Pass the staffId here
                        }),
                        contentType: 'application/json',
                        dataType: 'json',
                        timeout: localStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            data = JSON.parse(data[0]);
                            document.getElementById('employee_documents').style.display = 'block';
                            console.log(data);
                            document.getElementById('loaderView').style.display = 'none';
                            if (data.length != 0) {
                                for (var i = 0; i < data.length; i++) {
                                    self.DocumentsDet2.push({
                                        'id': data[i][0],
                                        'no': i + 1,
                                        'document_name': data[i][1],
                                        'uploaded_date': data[i][2],
                                        'document_link': data[i][3],
                                        'uploaded_by': data[i][4],     
                                        'user_role': data[i][5]        
                                    });
                                }
                            }
                        }                        
                    });
                }
                
                self.documentData2 = new ArrayDataProvider(self.DocumentsDet2, { keyAttributes: "id" }); 

                self.filter2 = ko.observable('');

                self.documentData2 = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filter2() && this.filter2() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filter() }
                        });
                    }
                    const arrayDataProvider = new ArrayDataProvider(self.DocumentsDet2, { 
                        keyAttributes: 'id',
                        sortComparators: {
                            comparators: new Map().set("dob", this.comparator),
                        },
                    });
                    
                    return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
                }, self);

                self.handleValueDocuments2 = () => {
                    self.filter2(document.getElementById('filter2').rawValue);
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
        return  editDocuments;
    }
);