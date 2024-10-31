define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", "ojs/ojlistdataproviderview", "ojs/ojdataprovider", "ojs/ojfilepickerutils", "ojs/ojconverterutils-i18n",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter',
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojselectcombobox","ojs/ojavatar","ojs/ojradioset", "ojs/ojcheckboxset", "ojs/ojcollapsible", "ojs/ojtable"], 
    function (oj,ko,$, app, ArrayDataProvider,CoreRouter, ModuleRouterAdapter,
        KnockoutRouterAdapter, ListDataProviderView, ojdataprovider_1, FilePickerUtils, ojconverterutils_i18n_1) {

        class leaves {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = localStorage.getItem("BaseURL")
                let userrole = localStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);
                self.CancelBehaviorOpt = ko.observable('icon');

                self.connected = function () {
                    if (localStorage.getItem("userName") == null) {
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



                

                self.priority = ko.observable('');
                self.checkboxValue = ko.observable('');
                self.month = ko.observable('');
                self.shiftName = ko.observable('');
                self.startTime = ko.observable('');
                self.endTime = ko.observable('');
                self.notes = ko.observable('');
                self.value = ko.observable('');

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


                self.rowClick = function (event, data) {
                    var clickedRotaId = data.item.data.id
                    localStorage.setItem("rotaId", clickedRotaId);
                    self.router.go({ path: 'rotaView' }); 
                  };
                

                const months = [];
                const currentDate = new Date();
                const options = { year: 'numeric', month: 'short' };

                for (let i = 1; i < 12; i++) {
                    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + i);
                    const year = nextMonth.getFullYear();
                    const month = String(nextMonth.getMonth() + 1).padStart(2, '0'); 
                    
                    months.push({
                        label: nextMonth.toLocaleDateString('en-US', options),
                        value: `${year}-${month}`, // Set value as "YYYY-MM"
                    });
                }
                self.months = months;

                self.monthList = new ArrayDataProvider(self.months, {
                    keyAttributes: 'value'
                });
                self.showRangeDate = ko.observable(false);
                self.showSelectMonth = ko.observable(false);

                /* self.selectDiv = () => {
                    const selectedValue = self.rota_duration();
                    
                    if (selectedValue === 'month') {
                        self.showSelectMonth(true);
                        self.showRangeDate(false);
                    } else {
                        self.showSelectMonth(false);
                        self.showRangeDate(true);
                    }
                }; */
                self.selectDiv = () => {
                    const selectedValue = self.rota_duration();
                    if (selectedValue === 'month') {
                        self.divCheck('month')
                        // $("#showMonth").show();
                        // $("#showDate").hide();

                        // self.showSelectMonth(true);
                        // self.showRangeDate(false);
                        // //self.edit_rota_date('')
                        self.rota_date('')
                    } else {
                        self.divCheck('date')
                        // $("#showMonth").hide();
                        // $("#showDate").show();
                        // self.showSelectMonth(false);
                        // self.showRangeDate(true);
                        // //self.edit_rota_date('')
                        self.rota_month('')
                    }
                };
                self.selectDiv2 = () => {
                    const selectedValue = self.edit_rota_duration();
                    
                    if (selectedValue === 'month') {
                        self.showSelectMonth(true);
                        self.showRangeDate(false);
                        self.rota_date('')
                        self.edit_rota_date('')
                    } else {
                        self.showSelectMonth(false);
                        self.showRangeDate(true);
                        self.rota_month('')
                        self.edit_rota_month('')
                    }
                };
                self.addRota = ()=>{
                    document.querySelector('#openAddRota').open();
                }
                self.addShift = ()=>{
                    document.querySelector('#openAddShift').open();
                }
                
                self.rota_name = ko.observable('');
                self.rota_duration = ko.observable('');
                self.rota_date = ko.observable('');
                self.rota_month = ko.observable('');
                self.edit_rota_name = ko.observable('');
                self.edit_rota_duration = ko.observable('');
                self.edit_rota_date = ko.observable('');
                self.edit_rota_month = ko.observable('');
                self.RotaDet = ko.observableArray([]);
                self.ShiftDet = ko.observableArray([]);
                self.editShiftName = ko.observable('');
                self.editStartTime = ko.observable('');
                self.editEndTime = ko.observable('');
                self.editNotes = ko.observable('');
                self.existRota = ko.observable('');

                self.selectedTab = ko.observable('');
                self.divCheck = ko.observable();

                if(localStorage.getItem("shiftTab")=="Yes"){
                    self.selectedTab('shifts')
                    localStorage.removeItem('shiftTab')
                } else if(localStorage.getItem("activeRotaTab")=="Yes"){
                    self.selectedTab('active_rotas')
                    localStorage.removeItem('activeRotaTab')
                } else if(localStorage.getItem("draftRotaTab")=="Yes"){
                    self.selectedTab('draft_rotas')
                    localStorage.removeItem('draftRotaTab')
                }else{
                    self.selectedTab('active_rotas')
                }

                if(self.userrole() != 'director' && self.userrole() != 'senior hr' && self.userrole() != 'senior manager' && self.userrole() != 'senior accounts' ){
                    self.selectedTab('active_rotas')
                    getActiveRotaList();
                }

                self.tabData = [
                    { id: "active_rotas", label: "Active Rotas" },
                    { id: "draft_rotas", label: "Draft Rotas" },
                    { id: "old_rotas", label: "Old Rotas" },
                    { id: "shifts", label: "Shifts" },
                    /* { id: "rota_settings", label: "Rota Settings" }, */
                ];

                self.selectedTabAction = ko.computed(() => { 
                    if(self.selectedTab() == 'active_rotas'){
                        $("#active_rotas").show();
                        $("#old_rotas").hide();
                        $("#shifts").hide();
                        $("#draft_rotas").hide();
                        $("#rota_settings").hide();
                        getActiveRotaList();
                    }
                    else if(self.selectedTab() == 'old_rotas'){
                        $("#active_rotas").hide();
                        $("#old_rotas").show();
                        $("#shifts").hide();
                        $("#draft_rotas").hide();
                        $("#rota_settings").hide();
                        getOldRotaList();
                    }
                    else if(self.selectedTab() == 'rota_settings'){
                        $("#active_rotas").hide();
                        $("#old_rotas").hide();
                        $("#shifts").hide();
                        $("#draft_rotas").hide();
                        $("#rota_settings").show();
                    }
                    else if(self.selectedTab() == 'shifts'){
                        $("#active_rotas").hide();
                        $("#old_rotas").hide();
                        $("#shifts").show();
                        $("#draft_rotas").hide();
                        $("#rota_settings").hide();
                        getShiftList();
                    }
                    else if(self.selectedTab() == 'draft_rotas'){
                        $("#active_rotas").hide();
                        $("#old_rotas").hide();
                        $("#shifts").hide();
                        $("#draft_rotas").show();
                        $("#rota_settings").hide();
                        getRotaList();
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

                function getShiftList(){
                    self.ShiftDet([]);
                    $("#loaderView").show();
                    $.ajax({
                        url: BaseURL+"/HRModuleGetShiftList",
                        type: 'GET',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            $("#shifts").show();
                            $("#draft_rotas").hide();
                            data = JSON.parse(data[0]);
                            console.log(data)
                            document.getElementById('loaderView').style.display='none';
                            if(data.length!=0){
                                for (var i = 0; i < data.length; i++) {
                                    let dateCreated = new Date(data[i][7]);
                                    // Get only the date part (YYYY-MM-DD)
                                    let dateCreatedOnly = dateCreated.toISOString().slice(0, 10);
                                    self.ShiftDet.push({
                                        'slno': i+1,
                                        'id': data[i][0],
                                        'shift_name': data[i][1], 
                                        'start_time': data[i][2],
                                        'end_time': data[i][3],
                                        'notes': data[i][4],
                                        'created_by': data[i][6], 
                                        'created_date': dateCreatedOnly,
                                        'updated_at': data[i][8]                                                                                                 
                                    });
                                    
                                }
                                
                                 }

                        }
                    })
                }

                self.ShiftList = new ArrayDataProvider(this.ShiftDet, { keyAttributes: "id"});
    

                self.createRota = ()=>{
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid) {
                    let popup = document.getElementById("loaderPopup");
                    popup.open();
                    $.ajax({
                        url: BaseURL+"/HRModuleAddRota",
                        type: 'POST',
                        data: JSON.stringify({
                            rota_name: self.rota_name(),            
                            rota_duration: self.rota_duration(),
                            rota_date: self.rota_date(),
                            rota_month: self.rota_month(),
                            userId: localStorage.getItem("userId"),
                        }),
                        dataType: 'json',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            console.log(data)
                            document.querySelector('#openAddRota').close();
                            let popup = document.getElementById("loaderPopup");
                            popup.close();
                            let popup1 = document.getElementById("successView");
                            popup1.open();
                        }
                    })      
                }
            }

                self.editRota = ()=>{                        
                    let popup = document.getElementById("loaderPopup");
                    popup.open();
                    $.ajax({
                        url: BaseURL+"/HRModuleUpdateRota",
                        type: 'POST',
                        data: JSON.stringify({
                            rotaId: localStorage.getItem("rotaId"),
                            rota_name: self.edit_rota_name(),            
                            rota_duration: self.edit_rota_duration(),
                            rota_date: self.edit_rota_date(),
                            rota_month: self.edit_rota_month(),
                        }),
                        dataType: 'json',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            console.log(data)
                            document.querySelector('#openEditRota').close();
                            let popup = document.getElementById("loaderPopup");
                            popup.close();
                            let popup1 = document.getElementById("updateSuccessView");
                            popup1.open();
                        }
                    })
                }

                self.goToEditRota = (event,data)=>{
                    var clickedRotaId = data.item.data.id
                    localStorage.setItem("rotaId", clickedRotaId);
                    document.querySelector('#openEditRota').open();
                    self.getRotaInfo();
                }
                self.getRotaInfo = () => {
                    $.ajax({
                        url: BaseURL + "/HRModuleGetRotaInfo",
                        type: 'POST',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            rotaId: localStorage.getItem("rotaId")
                        }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            data = JSON.parse(data[0]);
                            console.log(data);
                            self.edit_rota_name(data[1])
                            self.edit_rota_duration(data[2])
                            if(data[3]){
                            self.edit_rota_date(data[3])
                            }
                            if(data[4]){
                            const dateStr = data[4];  // Assuming "YYYY-MM" format
                            const [year, month] = dateStr.split('-'); // Create a Date object from the parsed year and month
                            const date = new Date(year, month - 1, 1);  // month - 1 because JavaScript months are 0-indexed
                            // Generate label (like "Apr 2025") using the same formatting options
                            const label = date.toLocaleDateString('en-US', options);
                            // Update the edit_rota_month observable with the formatted label
                            self.edit_rota_month(label);
                            }
                        }
                    });
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

                self.createShift = ()=>{
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid) {
                    let popup = document.getElementById("loaderPopup");
                    popup.open();
                    $.ajax({
                        url: BaseURL+"/HRModuleAddShift",
                        type: 'POST',
                        data: JSON.stringify({
                            shift_name: self.shiftName(),            
                            start_time: self.startTime().split('+')[0],
                            end_time: self.endTime().split('+')[0],
                            notes: self.notes(),
                            userId: localStorage.getItem("userId"),
                        }),
                        dataType: 'json',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            console.log(data)
                            document.querySelector('#openAddShift').close();
                            let popup = document.getElementById("loaderPopup");
                            popup.close();
                            let popup1 = document.getElementById("successView2");
                            popup1.open();
                        }
                    })      
                }
            }

            function getRotaList(){
                self.RotaDet([]);
                $("#loaderView").show();
                $.ajax({
                    url: BaseURL+"/HRModuleGetRotaList",
                    type: 'GET',
                    timeout: localStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        $("#draft_rotas").show();
                        data = JSON.parse(data[0]);
                        console.log(data)
                        document.getElementById('loaderView').style.display='none';
                        if(data.length!=0){
                            for (var i = 0; i < data.length; i++) {
                                console.log(data[i][1])
                                let dateCreated = new Date(data[i][7]);
                                // Get only the date part (YYYY-MM-DD)
                                let dateCreatedOnly = dateCreated.toISOString().slice(0, 10);
                                let duration;
                                let rotaMonth;
                                if(data[i][2] !='month'){
                                    duration = data[i][2] + " days"
                                }else{
                                    duration = "Calendar month"
                                }
                                if(data[i][4]){
                                    const dateStr = data[i][4];  // Assuming "YYYY-MM" format
                                    const [year, month] = dateStr.split('-'); // Create a Date object from the parsed year and month
                                    const date = new Date(year, month - 1, 1);  // month - 1 because JavaScript months are 0-indexed
                                    // Generate label (like "Apr 2025") using the same formatting options
                                    const label = date.toLocaleDateString('en-US', options);
                                    // Update the edit_rota_month observable with the formatted label
                                    rotaMonth = label;
                                    }
                                self.RotaDet.push({
                                    'slno': i+1,
                                    'id': data[i][0],
                                    'rota_name': data[i][1], 
                                    'rota_duration': duration,
                                    'rota_date': data[i][3],
                                    'rota_month': rotaMonth,
                                    'created_by': data[i][6], 
                                    'created_date': dateCreatedOnly,
                                    'updated_at': data[i][8]                                                                                                 
                                });
                                
                            }
                            
                             }

                    }
                })
            }

            self.RotaList = new ArrayDataProvider(this.RotaDet, { keyAttributes: "id"});


            self.goToEditShift = (event,data)=>{
                var clickedShiftId = data.item.data.id
                localStorage.setItem("shiftId", clickedShiftId);
                document.querySelector('#openEditShift').open();
                self.getShiftInfo();
            }
            self.getShiftInfo = () => {
                $.ajax({
                    url: BaseURL + "/HRModuleGetShiftInfo",
                    type: 'POST',
                    timeout: localStorage.getItem("timeInetrval"),
                    context: self,
                    data: JSON.stringify({
                        shiftId: localStorage.getItem("shiftId")
                    }),
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        data = JSON.parse(data[0]);
                        console.log(data);
                        self.editShiftName(data[0])
                        if(data[1] !=null){
                            if(data[1].split(':')[0].length==1){
                                self.editStartTime('T0'+data[1]+'+05:30')
                            }else if(data[1].split(':')[0].length==2){
                                self.editStartTime('T'+data[1]+'+05:30')
                            }
                        }
                        if(data[2] !=null){
                            if(data[2].split(':')[0].length==1){
                                self.editEndTime('T0'+data[2]+'+05:30')
                            }else if(data[2].split(':')[0].length==2){
                                self.editEndTime('T'+data[2]+'+05:30')
                            }
                        }
                        self.editNotes(data[3])
                    }
                });
            };

            self.updateShift = ()=>{                        
                let popup = document.getElementById("loaderPopup");
                popup.open();
                $.ajax({
                    url: BaseURL+"/HRModuleUpdateShift",
                    type: 'POST',
                    data: JSON.stringify({
                        shiftId: localStorage.getItem("shiftId"),
                        shift_name: self.editShiftName(),            
                        start_time: self.editStartTime().split('+')[0],
                        end_time: self.editEndTime().split('+')[0],
                        notes: self.editNotes(),
                    }),
                    dataType: 'json',
                    timeout: localStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        console.log(data)
                        document.querySelector('#openEditShift').close();
                        let popup = document.getElementById("loaderPopup");
                        popup.close();
                        let popup1 = document.getElementById("updateSuccessView2");
                        popup1.open();
                    }
                })
            }
            self.ShiftMsgClose = ()=>{
                let popup1 = document.getElementById("successView2");
                popup1.close();
                let popup2 = document.getElementById("updateSuccessView2");
                popup2.close();
                getShiftList();
            }

            self.messageRotaClose = ()=>{
                let popup1 = document.getElementById("successView");
                popup1.close();
                self.rota_name('');          
                self.rota_duration('');
                self.rota_date('');
                self.rota_month('');
                self.selectedTab('draft_rotas')
                getRotaList();
            }

            self.rotaExistCheck = (event)=> {
                let valueCheck = event.detail.value
                $.ajax({
                    url: BaseURL+"/HRModuleRotaExistCheck",
                    type: 'POST',
                    data: JSON.stringify({
                        checkRotaName: valueCheck
                    }),
                    dataType: 'json',
                    timeout: localStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        console.log(data)
                        console.log(data[0].length)

                         if(data[0].length !=0){
                                self.existRota("Oops! This rota name is already taken. Please try a different one.");
                        }else{
                            self.existRota('');
                        }
                    }
                })
            }

            function getActiveRotaList(){
                self.RotaDet([]);
                $("#loaderView").show();
                $.ajax({
                    url: BaseURL+"/HRModuleGetActiveRotaList",
                    type: 'GET',
                    timeout: localStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        $("#active_rotas").show();
                        data = JSON.parse(data[0]);
                        console.log(data)
                        document.getElementById('loaderView').style.display='none';
                        if(data.length!=0){
                            for (var i = 0; i < data.length; i++) {
                                console.log(data[i][1])
                                let dateCreated = new Date(data[i][7]);
                                // Get only the date part (YYYY-MM-DD)
                                let dateCreatedOnly = dateCreated.toISOString().slice(0, 10);
                                let duration;
                                let rotaMonth;
                                if(data[i][2] !='month'){
                                    duration = data[i][2] + " days"
                                }else{
                                    duration = "Calendar month"
                                }
                                if(data[i][4]){
                                    const dateStr = data[i][4];  // Assuming "YYYY-MM" format
                                    const [year, month] = dateStr.split('-'); // Create a Date object from the parsed year and month
                                    const date = new Date(year, month - 1, 1);  // month - 1 because JavaScript months are 0-indexed
                                    // Generate label (like "Apr 2025") using the same formatting options
                                    const label = date.toLocaleDateString('en-US', options);
                                    // Update the edit_rota_month observable with the formatted label
                                    rotaMonth = label;
                                    }
                                self.RotaDet.push({
                                    'slno': i+1,
                                    'id': data[i][0],
                                    'rota_name': data[i][1], 
                                    'rota_duration': duration,
                                    'rota_date': data[i][3],
                                    'rota_month': rotaMonth,
                                    'created_by': data[i][6], 
                                    'created_date': dateCreatedOnly,
                                    'updated_at': data[i][8]                                                                                                 
                                });
                                
                            }
                            
                             }

                    }
                })
            }

            self.RotaList = new ArrayDataProvider(this.RotaDet, { keyAttributes: "id"});

            function getOldRotaList(){
                self.RotaDet([]);
                $("#loaderView").show();
                $.ajax({
                    url: BaseURL+"/HRModuleGetOldRotaList",
                    type: 'GET',
                    timeout: localStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        $("#old_rotas").show();
                        data = JSON.parse(data[0]);
                        console.log(data)
                        document.getElementById('loaderView').style.display='none';
                        if(data.length!=0){
                            for (var i = 0; i < data.length; i++) {
                                console.log(data[i][1])
                                let dateCreated = new Date(data[i][7]);
                                // Get only the date part (YYYY-MM-DD)
                                let dateCreatedOnly = dateCreated.toISOString().slice(0, 10);
                                let duration;
                                let rotaMonth;
                                if(data[i][2] !='month'){
                                    duration = data[i][2] + " days"
                                }else{
                                    duration = "Calendar month"
                                }
                                if(data[i][4]){
                                    const dateStr = data[i][4];  // Assuming "YYYY-MM" format
                                    const [year, month] = dateStr.split('-'); // Create a Date object from the parsed year and month
                                    const date = new Date(year, month - 1, 1);  // month - 1 because JavaScript months are 0-indexed
                                    // Generate label (like "Apr 2025") using the same formatting options
                                    const label = date.toLocaleDateString('en-US', options);
                                    // Update the edit_rota_month observable with the formatted label
                                    rotaMonth = label;
                                    }
                                self.RotaDet.push({
                                    'slno': i+1,
                                    'id': data[i][0],
                                    'rota_name': data[i][1], 
                                    'rota_duration': duration,
                                    'rota_date': data[i][3],
                                    'rota_month': rotaMonth,
                                    'created_by': data[i][6], 
                                    'created_date': dateCreatedOnly,
                                    'updated_at': data[i][8]                                                                                                 
                                });
                                
                            }
                            
                             }

                    }
                })
            }

            self.RotaList = new ArrayDataProvider(this.RotaDet, { keyAttributes: "id"});

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
        return  leaves;
    }
);