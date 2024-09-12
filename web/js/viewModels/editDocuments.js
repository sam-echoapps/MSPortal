define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", "ojs/ojlistdataproviderview", "ojs/ojdataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojselectcombobox","ojs/ojavatar","ojs/ojradioset","ojs/ojtable"], 
    function (oj,ko,$, app, ArrayDataProvider, ListDataProviderView, ojdataprovider_1, FilePickerUtils) {

        class editDocuments {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = sessionStorage.getItem("BaseURL")
                let userrole = sessionStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);

                self.tabData = [
                    { id: "documents", label: "Add Documents" },
                    { id: "employee_documents", label: "Employee Documents" },
                ];

                self.tabData1 = [
                    { id: "documents", label: "Add Documents" },
                ];

                self.selectedTab = ko.observable("documents");

                self.selectedTabAction = ko.computed(() => { 
                    if(self.selectedTab() == 'documents'){
                        $("#documents").show();
                        $("#employee_documents").hide();
                    }else if(self.selectedTab() == 'employee_documents'){
                        $("#documents").hide();
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

                self.messageClose = ()=>{
                    location.reload();
                }
                
                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getDocuments();
                        self.getMembers();
                        self.getRoles();

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
                
                self.documentName = ko.observable();
                self.documentText = ko.observable('Upload your documents as PDF Format');
                self.uploadError = ko.observable('');
                self.typeError2 = ko.observable('');
                self.selectedFile = ko.observable(null);

                self.documentUpload = function (event) {
                    var file = event.detail.files[0];
                    const result = event.detail.files;
                    const files = result[0];
                    var documentFileName = files.name;
                    self.selectedFile(files); // Store the selected file
                    var fileFormat = files.name.split(".");
                    var checkFormat = fileFormat[1];
                    if (checkFormat == 'pdf') {
                        self.typeError2('');
                        self.documentText(documentFileName); 
                    } else {
                        self.typeError2('The document must be a file of type: pdf');
                    }
                };

                self.formSubmit2 = function () {
                    const formValid = self._checkValidationGroup("formValidation2"); 
                    if (formValid) {
                        let popup = document.getElementById("popup1");
                        popup.open();
                
                        var documentName = self.documentName(); 
                        var selectedFile = self.selectedFile();
                        var selectedRole = self.Roles();
                
                        if (!selectedFile) {
                            self.uploadError('No file selected');
                            popup.close();
                            return;
                        }
                
                        var documentFileName = selectedFile.name;
                        const reader = new FileReader();
                        reader.readAsDataURL(selectedFile);
                
                        reader.onload = function () {
                            const fileContent = reader.result;
                            $.ajax({
                                url: BaseURL + "/HRModuleDocumentUpload2",
                                type: 'POST',
                                data: JSON.stringify({
                                    userId: sessionStorage.getItem("userId"),
                                    staffId: sessionStorage.getItem("userId"),
                                    userRole: sessionStorage.getItem("userRole"),
                                    document_name: documentName,
                                    file_name: documentFileName,
                                    file: fileContent,
                                    roles: selectedRole
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
                                    let popup = document.getElementById("popup1");
                                    popup.close();
                                    let popup1 = document.getElementById("popup3");
                                    popup1.open();
                                }
                            });
                        };
                    }
                };
                 

                self.DocumentsDet = ko.observableArray([]);

                self.getDocuments = () => {
                    self.DocumentsDet([]);
                    document.getElementById('loaderView').style.display = 'block';              
                    $.ajax({
                        url: BaseURL + "/HRModuleGetDocuments2",
                        type: 'GET',
                        contentType: 'application/json',
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            data = JSON.parse(data[0]);
                            document.getElementById('contentView').style.display = 'block';
                            document.getElementById('document_view').style.display = 'block';
                            console.log(data);
                            document.getElementById('loaderView').style.display = 'none';
                            if (data.length != 0) { 
                                for (var i = 0; i < data.length; i++) {
                                    self.DocumentsDet.push({
                                        'id': data[i][0],
                                        'no': i + 1,
                                        'document_name': data[i][1],
                                        'document_link': data[i][3],
                                        'uploaded_date': data[i][2],
                                        'uploaded_by': data[i][4],
                                        'user_role': data[i][5],
                                        'uploaded_for': data[i][6]
                                    });
                                }
                            }
                        }
                    });
                }                                
                
                self.documentData = new ArrayDataProvider(self.DocumentsDet, { keyAttributes: "id" });

                self.previewClick = (e) => {
                    e.preventDefault(); // Prevent the default anchor click behavior
                    const documentLink = e.target.closest('a').getAttribute('data-document-link');
                    console.log(documentLink); // Log the document link to verify
                
                    // // Display loader (optional)
                    // let popup = document.getElementById("loaderView");
                    // popup.open();
                
                    $.ajax({
                        url: BaseURL + "/HRModulePdfView",
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
                            } else {
                                self.offerFileMessage("File not found");
                                setTimeout(() => {
                                    self.offerFileMessage("");
                                }, 3000);
                            }
                        }
                    });
                };                
                
                                
                self.deleteDocument = (event, data) => {
                    var documentId = data.item.data.id;
                    $.ajax({
                        url: BaseURL + "/HRModuleDeleteDocuments2",
                        type: 'POST',
                        data: JSON.stringify({ document_id: documentId }),
                        contentType: 'application/json',
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (response) {
                            let successPopup = document.getElementById("successView");
                            successPopup.open();
                        }
                    });
                }; 
                
                self.deleteDocument2 = (event, data) => {
                    var documentId = data.item.data.id;
                    $.ajax({
                        url: BaseURL + "/HRModuleDeleteDocuments",
                        type: 'POST',
                        data: JSON.stringify({ document_id: documentId }),
                        contentType: 'application/json',
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (response) {
                            let successPopup = document.getElementById("successView");
                            successPopup.open();
                        }
                    });
                };
                
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
                
                self.Member = ko.observable();
                self.MembersDet = ko.observableArray([]);

                self.getMembers = ()=>{
                    $.ajax({
                        url: BaseURL+"/HRModuleMembers2",
                        type: 'POST',
                        data: JSON.stringify({
                            userId: sessionStorage.getItem("userId")
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log("Error fetching Member:", textStatus); // Log any error
                        },
                        success: function (data) {
                            if(data[0].length != 0){ 
                                for (var i = 0; i < data[0].length; i++) {
                                    self.MembersDet.push({'id': data[0][i][0],'label': data[0][i][1]});
                                }
                            } else {
                                console.log("No data received from backend."); // Log if no data is received
                            }
                        }
                    })
                }
                self.Members_List = new ArrayDataProvider(this.MembersDet, { keyAttributes: "id"});

                self.Documents2Det = ko.observableArray([]);
                // Form submission to fetch documents for a specific member
                self.formSubmit3 = () => {
                    const formValid = self._checkValidationGroup("formValidation3"); 
                    if (formValid) {
                        let popup = document.getElementById("popup1");
                        popup.open();
                        
                        $.ajax({
                            url: BaseURL + "/HRModuleGetAllDocuments",
                            type: 'POST',
                            data: JSON.stringify({
                                Member: self.Member()
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
                                data = JSON.parse(data[0]);
                                let popup = document.getElementById("popup1");
                                popup.close();
                                document.getElementById('contentView').style.display = 'block';
                                document.getElementById('document_view2').style.display = 'block';
                                document.getElementById('loaderView').style.display = 'none';
                                self.Documents2Det([]);
                                if (data.length != 0) {
                                    for (var i = 0; i < data.length; i++) {
                                        self.Documents2Det.push({
                                            'id': data[i][0],
                                            'no': i + 1,
                                            'document_name': data[i][1],
                                            'document_link': data[i][3],
                                            'uploaded_date': data[i][2],
                                            'uploaded_by': data[i][4],
                                            'user_role': data[i][5]
                                        });
                                    }
                                }
                            }
                        })
                    }
                }

                self.documentData2 = new ArrayDataProvider(self.Documents2Det, { keyAttributes: "id" });

                self.filter2 = ko.observable('');

                self.documentData2 = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filter2() && this.filter2() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filter2() }
                        });
                    }
                    const arrayDataProvider = new ArrayDataProvider(self.Documents2Det, { 
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

                self.RolesDet = ko.observableArray([]);
                self.Roles = ko.observable();

                self.getRoles = ()=>{
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetRolesForDocument",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            console.log(data)
                            if(data[0].length !=0){ 
                                for (var i = 0; i < data[0].length; i++) {
                                    self.RolesDet.push({'value': data[0][i][1],'label': data[0][i][1]  });
                                }
                                self.RolesDet.unshift({ value: 'All', label: 'All' });
                            }
                        }
                    })
                }
                self.RolesList = new ArrayDataProvider(this.RolesDet, { keyAttributes: "value"});

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