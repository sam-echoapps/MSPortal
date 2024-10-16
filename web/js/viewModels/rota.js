define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", "ojs/ojlistdataproviderview", "ojs/ojdataprovider", "ojs/ojfilepickerutils", "ojs/ojconverterutils-i18n",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojselectcombobox","ojs/ojavatar","ojs/ojradioset", "ojs/ojcheckboxset","ojs/ojtable"], 
    function (oj,ko,$, app, ArrayDataProvider, ListDataProviderView, ojdataprovider_1, FilePickerUtils, ojconverterutils_i18n_1) {

        class Rota {
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
                self.selectedTab1 = ko.observable("a");
                self.tabData2 = [
                    { id: "a", label: "Every One" },
                    { id: "b", label: "Me" },
                ];



                self.selectedTab = ko.observable('active_rotas');

                self.tabData = [
                    { id: "active_rotas", label: "Active Rotas" },
                    { id: "old_rotas", label: "Old Rotas" },
                    { id: "shifts", label: "Shifts" },
                    { id: "create_rotas", label: "Create Rotas" },
                    { id: "rota_settings", label: "Rota Settings" },
                ];

                self.selectedTabAction = ko.computed(() => { 
                    if(self.selectedTab() == 'active_rotas'){
                        $("#active_rotas").show();
                        $("#old_rotas").hide();
                        $("#shifts").hide();
                        $("#create_rotas").hide();
                        $("#rota_settings").hide();
                    }
                    else if(self.selectedTab() == 'old_rotas'){
                        $("#active_rotas").hide();
                        $("#old_rotas").show();
                        $("#shifts").hide();
                        $("#create_rotas").hide();
                        $("#rota_settings").hide();
                    }
                    else if(self.selectedTab() == 'rota_settings'){
                        $("#active_rotas").hide();
                        $("#old_rotas").hide();
                        $("#shifts").hide();
                        $("#create_rotas").hide();
                        $("#rota_settings").show();
                    }
                    else if(self.selectedTab() == 'shifts'){
                        $("#active_rotas").hide();
                        $("#old_rotas").hide();
                        $("#shifts").show();
                        $("#create_rotas").hide();
                        $("#rota_settings").hide();
                    }
                    else if(self.selectedTab() == 'create_rotas'){
                        $("#active_rotas").hide();
                        $("#old_rotas").hide();
                        $("#shifts").hide();
                        $("#create_rotas").show();
                        $("#rota_settings").hide();
                    }
                });

                self.priority = ko.observable('');
                self.duration = ko.observable('');
                self.checkboxValue = ko.observable('');
                self.month = ko.observable('');

                self.priorities = [
                    {"label":"Name (A-Z)","value":"High"},
                    {"label":"Name (Z-A)","value":"Medium"},
                    {"label":"Start Date (Newest First)","value":"Low"},
                    {"label":"Start Date (Oldest First)","value":"Low2"}
                ]

                self.priorityList = new ArrayDataProvider(self.priorities, {
                    keyAttributes: 'value'
                });

                self.durations = [
                    {"label":"4 days","value":"4"},
                    {"label":"5 days","value":"5"},
                    {"label":"6 days","value":"6"},
                    {"label":"7 days","value":"7"},
                    {"label":"8 days","value":"8"},
                    {"label":"9 days","value":"9"},
                    {"label":"10 days","value":"10"},
                    {"label":"11 days","value":"11"},
                    {"label":"12 days","value":"12"},
                    {"label":"13 days","value":"13"},
                    {"label":"14 days","value":"14"},
                    {"label":"Calender Month","value":"month"},
                ]

                self.durationList = new ArrayDataProvider(self.durations, {
                    keyAttributes: 'value'
                });

                self.months = [
                    {"label":"Oct 2024","value":"4"},
                    {"label":"Nov 2024","value":"4"},
                    {"label":"Dec 2024","value":"4"},
                    {"label":"Jan 2025","value":"4"},
                    {"label":"Feb 2025","value":"4"},
                    {"label":"Mar 2025","value":"4"},
                    {"label":"Apr 2025","value":"4"},
                    {"label":"May 2025","value":"4"},
                    {"label":"June 2025","value":"4"},
                    {"label":"July 2025","value":"4"},
                    {"label":"Aug 2025","value":"4"},
                    {"label":"Sep 2025","value":"4"},
                ]

                self.monthList = new ArrayDataProvider(self.months, {
                    keyAttributes: 'value'
                });
                self.showRangeDate = ko.observable(false);
                self.showSelectMonth = ko.observable(false);

                self.selectDiv = () => {
                    const selectedValue = self.duration();
                    
                    if (selectedValue === 'month') {
                        self.showSelectMonth(true);
                        self.showRangeDate(false);
                    } else {
                        self.showSelectMonth(false);
                        self.showRangeDate(true);
                    }
                };
                
                self.showCreateRota = () => {
                    // Hide all other rota divs
                    document.getElementById('old_rotas').style.display = 'none';
                    document.getElementById('active_rotas').style.display = 'none';
                    document.getElementById('shifts').style.display = 'none';
                    
                    // Show the create_rotas div
                    document.getElementById('create_rotas').style.display = 'block';
                };







                
                self.messageClose = ()=>{
                    location.reload();
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
        return  Rota;
    }
);