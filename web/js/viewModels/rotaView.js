define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", "ojs/ojlistdataproviderview", "ojs/ojdataprovider", "ojs/ojfilepickerutils", "ojs/ojconverterutils-i18n",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojselectcombobox","ojs/ojavatar","ojs/ojradioset", "ojs/ojcheckboxset", "ojs/ojcollapsible", "ojs/ojtable"], 
    function (oj,ko,$, app, ArrayDataProvider, ListDataProviderView, ojdataprovider_1, FilePickerUtils, ojconverterutils_i18n_1) {

        class leaves {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = sessionStorage.getItem("BaseURL")
                let userrole = sessionStorage.getItem("userRole")
                self.userrole = ko.observable(userrole);
                self.CancelBehaviorOpt = ko.observable('icon');

                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getRotaInfo()

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
                self.duration = ko.observable('');
                self.shiftName = ko.observable('');
                self.startTime = ko.observable('');
                self.endTime = ko.observable('');
                self.notes = ko.observable('');
                self.edit_shiftName = ko.observable();
                self.edit_startTime = ko.observable();
                self.edit_endTime = ko.observable();
                self.edit_notes = ko.observable();
                self.ShiftDet = ko.observableArray([]);
                self.StaffDet = ko.observableArray([]);
                self.OffStaffDet = ko.observableArray([]);

                self.selectDiv2 = () => {
                    const selectedValue = self.edit_rota_duration();
                    
                    if (selectedValue === 'month') {
                        self.showSelectMonth(true);
                        self.showRangeDate(false);
                        self.edit_rota_date('')
                    } else {
                        self.showSelectMonth(false);
                        self.showRangeDate(true);
                        self.edit_rota_month('')
                    }
                };

                self.edit_rota_name = ko.observable('');
                self.edit_rota_duration = ko.observable('');
                self.edit_rota_date = ko.observable('');
                self.edit_rota_month = ko.observable('');
                self.shift_date = ko.observable('');

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
                const months = [];
                const currentDate = new Date();
                const options = { year: 'numeric', month: 'short' };

                for (let i = 0; i < 12; i++) {
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

                self.getRotaInfo = () => {
                    $.ajax({
                        url: BaseURL + "/HRModuleGetRotaInfo",
                        type: 'POST',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            rotaId: sessionStorage.getItem("rotaId")
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
                            self.tableGet(self.edit_rota_duration(),self.edit_rota_date());
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

                self.editRota = ()=>{                        
                    let popup = document.getElementById("loaderPopup");
                    popup.open();
                    $.ajax({
                        url: BaseURL+"/HRModuleUpdateRota",
                        type: 'POST',
                        data: JSON.stringify({
                            rotaId: sessionStorage.getItem("rotaId"),
                            rota_name: self.edit_rota_name(),            
                            rota_duration: self.edit_rota_duration(),
                            rota_date: self.edit_rota_date(),
                            rota_month: self.edit_rota_month(),
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            console.log(data)
                            let popup = document.getElementById("loaderPopup");
                            popup.close();
                            let popup1 = document.getElementById("updateSuccessView");
                            popup1.open();
                        }
                    })
                }

                self.tableGet = (duration, start) => {
                    const options = { weekday: 'short', day: 'numeric', month: 'short' };
                    const shiftData = []; // Declare the array outside the loop
                
                    // Convert start (string or other format) to a Date object
                    const startDate = new Date(start);
                
                    for (let i = 0; i < duration; i++) {
                        // Calculate the next date
                        const shiftDate = new Date(startDate);
                        shiftDate.setDate(startDate.getDate() + i);
                
                        // Format the date as 'Mon 21 Oct'
                        const formattedDate = shiftDate.toLocaleDateString('en-GB', options);
                
                        // Push the date into the shiftData array
                        shiftData.push({
                            date: formattedDate,
                            shifts: [
                                { employees: ['Kannan M', 'Manju Mathew'], startTime: '03:00', endTime: '24:00', color: '#4395e7' },
                                { employees: ['Sam Thomas'], startTime: '09:00', endTime: '19:00', color: '#f37c58' },
                                { employees: ['Mohammed Yaseen'], startTime: '05:00', endTime: '12:00', color: '#7aef7ed9' }
                            ],
                        });
                    }
                
                    console.log(shiftData);
                
                    const tableBody = document.querySelector('#shift-table tbody');
                
                    shiftData.forEach(day => {
                        // Sanitize the date string to use it in the class name (remove commas and replace spaces with dashes)
                        const sanitizedDate = day.date.replace(/,/g, '').replace(/\s+/g, '-');
                
                        // Create a row for the date
                        let dateRow = document.createElement('tr');
                        dateRow.classList.add('date-row'); // Add date row class
                
                        // Create the date cell
                        let dateCell = document.createElement('td');
                        dateCell.textContent = day.date; // Only the date is displayed
                        dateRow.appendChild(dateCell);
                
                        // Create the button cell
                        let buttonCell = document.createElement('div');
                        buttonCell.style.display = 'flex'; // Flexbox for button alignment
                        buttonCell.style.alignItems = 'center';
                
                        // Create the button to assign employees
                        let addShiftButton = document.createElement('button');
                        addShiftButton.textContent = 'View Allocation';
                        addShiftButton.classList.add('btn');

                        // Add event listener to toggle only the shifts for the clicked date
                        addShiftButton.addEventListener('click', () => {
                            // First, select all rows for the specific day
                            const shiftRowsForDay = document.querySelectorAll(`.shift-row-${sanitizedDate}`);

                            // Check if any shift rows for this day are currently visible
                            const isAnyVisible = Array.from(shiftRowsForDay).some(row => !row.classList.contains('hidden'));

                            if (isAnyVisible) {
                                // If visible, hide all shift rows for this day
                                shiftRowsForDay.forEach(row => row.classList.add('hidden'));
                            } else {
                                // If not visible, hide all shift rows first
                                document.querySelectorAll('.shift-row').forEach(row => row.classList.add('hidden'));

                                // Show only the shift rows for this specific day
                                shiftRowsForDay.forEach(row => row.classList.remove('hidden'));
                            }
                        });
                
                        buttonCell.appendChild(addShiftButton);

                    // Create the second button
                        let anotherButton = document.createElement('button');
                        anotherButton.textContent = 'Assign Employee';
                        anotherButton.classList.add('btn');
                        // Add an event listener to the second button
                        anotherButton.addEventListener('click', () => {
                            self.shift_date(`${day.date}`); // Alert the date and any associated shifts
                            self.getShiftList()
                            self.getAllocateStaffList()
                            document.querySelector('#openAssignEmployees').open();
                        });
        
                        buttonCell.appendChild(anotherButton);
                        dateRow.appendChild(buttonCell); // Append button cell to the date row
                
                        // Create empty hour cells
                        for (let i = 0; i < 22; i++) {
                            let hourCell = document.createElement('td');
                            dateRow.appendChild(hourCell);
                        }
                
                        // Append the date row to the table
                        tableBody.appendChild(dateRow);
                
                        // Create rows for each shift and hide initially
                        day.shifts.forEach(shift => {
                            const startHour = parseInt(shift.startTime.split(':')[0], 10);
                            const endHour = parseInt(shift.endTime.split(':')[0], 10);
                            const colspan = endHour - startHour;
                
                            let shiftRow = document.createElement('tr');
                            shiftRow.classList.add(`shift-row-${sanitizedDate}`, 'shift-row', 'hidden'); // Initially hidden
                
                            // Create an empty cell for the shift time
                            let shiftTimeCell = document.createElement('td');
                            shiftRow.appendChild(shiftTimeCell);
                
                            // Create empty cells for hours before the start hour
                            for (let hour = 0; hour < startHour; hour++) {
                                let emptyCell = document.createElement('td');
                                shiftRow.appendChild(emptyCell);
                            }
                
                            // Create a cell that spans the duration of the shift and apply the color
                            let shiftCell = document.createElement('td');
                            shiftCell.colSpan = colspan;
                            shiftCell.classList.add('shift');
                            shiftCell.textContent = shift.employees.join(', ');
                            shiftCell.style.backgroundColor = shift.color; // Set the background color
                            shiftRow.appendChild(shiftCell);
                
                            // Fill empty cells for hours after the shift
                            for (let hour = endHour; hour < 24; hour++) {
                                let emptyCell = document.createElement('td');
                                shiftRow.appendChild(emptyCell);
                            }
                
                            // Append shift row to the table (hidden initially)
                            tableBody.appendChild(shiftRow);
                        });
                    });
                }
                
                

                self.getShiftList = ()=>{
                    self.ShiftDet([]);
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetShiftList",
                        type: 'GET',
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
                                    self.ShiftDet.push({'value': data[i][0],'label': data[i][1]  }); 
                                }
                                
                                 }

                        }
                    })
                }

                self.ShiftList = new ArrayDataProvider(this.ShiftDet, { keyAttributes: "value"});

                self.getAllocateStaffList = ()=>{
                    self.StaffDet([]);
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetAllocateStaffList",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            data = data[0]
                            console.log(data)
                            document.getElementById('loaderView').style.display='none';
                            if(data.length!=0){
                                for (var i = 0; i < data.length; i++) {
                                    self.StaffDet.push({'value': data[i][0],'label': data[i][1] + " " +  data[i][2] + " " +  data[i][3] }); 
                                }
                                self.OffStaffDet(self.StaffDet().slice()); 
                                 }

                        }
                    })
                }

                self.StaffList = new ArrayDataProvider(this.StaffDet, { keyAttributes: "value"});
                self.OffStaffList = new ArrayDataProvider(this.OffStaffDet, { keyAttributes: "value"});


                // self.tableGet = ()=>{
                //     const shiftData = [
                //         {
                //           date: 'Wed 16 Oct',
                //           shifts: [
                //             { employees: ['Kannan M', 'Manju Mathew'], startTime: '03:00', endTime: '24:00', color: '#4395e7' },
                //             { employees: ['Sam Thomas'], startTime: '09:00', endTime: '19:00', color: '#f37c58' },
                //             { employees: ['Mohammed Yaseen'], startTime: '05:00', endTime: '12:00', color: '#7aef7ed9' }
                //           ],
                //           weekOff: ['Issac', 'Sam']
                //         },
                //         {
                //           date: 'Thu 17 Oct',
                //           shifts: [
                //             { employees: ['Mohammed Yaseen'], startTime: '08:00', endTime: '16:00', color: '#e387f3' },
                //             { employees: ['Aparna'], startTime: '14:00', endTime: '22:00', color: '#fe4545' }
                //           ],
                //           weekOff: ['Manju Mathew']
                //         },
                //         {
                //           date: 'Fri 18 Oct',
                //           shifts: [],
                //           weekOff: ['Kannan M', 'Sayooj']
                //         },
                //         {
                //             date: 'Sat 19 Oct',
                //             shifts: [],
                //             weekOff: ['Kannan M', 'Sayooj']
                //         },
                //         {
                //             date: 'Mon 21 Oct',
                //             shifts: [],
                //             weekOff: ['Kannan M', 'Sayooj']
                //         },
                //         {
                //             date: 'Tue 22 Oct',
                //             shifts: [],
                //             weekOff: ['Kannan M', 'Sayooj']
                //         }
                //       ];
                  
                // const tableBody = document.querySelector('#shift-table tbody');

                // shiftData.forEach(day => {
                //     // Create a row for the date
                //     let dateRow = document.createElement('tr');
                //     dateRow.classList.add('date-row'); // Add date row class
                
                //     // Create the date cell
                //     let dateCell = document.createElement('td');
                //     dateCell.textContent = day.date; // Only the date is displayed
                //     dateRow.appendChild(dateCell);
                
                //     // Create the button cell
                //     let buttonCell = document.createElement('div');
                //     buttonCell.style.display = 'flex'; // Add this line for flexbox
                //     buttonCell.style.alignItems = 'center'; // Align items vertically centered

                    

                   

                //     // Create empty hour cells
                //     for (let i = 0; i < 23; i++) { // Create 20 hour cells
                //         let hourCell = document.createElement('td');
                //         dateRow.appendChild(hourCell);
                //     }
                    
                //     // Add the last hour cell
                //     dateRow.appendChild(document.createElement('td')); // Last hour cell
                
                //     // Add click event to toggle shift and week off rows
                   
                
                //     tableBody.appendChild(dateRow); // Append the date row to the table
                
                
                   
                // });
                
                // }                             

            self.shift = ko.observable('');
            self.selectedEmployees = ko.observableArray([]); 
            self.selectedOffEmployees = ko.observableArray([]); 

            self.assignEmployees = ()=>{
                let popup = document.getElementById("loaderPopup");
                popup.open();
                $.ajax({
                    url: BaseURL+"/HRModuleAssignEmployees",
                    type: 'POST',
                    data: JSON.stringify({
                        rotaId : sessionStorage.getItem("rotaId"),
                        shift_date: self.shift_date(),            
                        shiftId: self.shift(),            
                        selectedEmployees: self.selectedEmployees(),
                        selectedOffEmployees: self.selectedOffEmployees(),
                    }),
                    dataType: 'json',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        console.log(data)
                        document.querySelector('#openAssignEmployees').close();
                        let popup = document.getElementById("loaderPopup");
                        popup.close();
                        let popup1 = document.getElementById("successView");
                        popup1.open();
                    }
                })      
            }

            
            self.goToEditShift = (event,data)=>{
                console.log(data)
                var clickedRotaId = data.item.data.id
                sessionStorage.setItem("rotaId", clickedRotaId);
                document.querySelector('#openEditRota').open();
                //self.getShiftInfo();
            }
            self.getShiftInfo = () => {
                $.ajax({
                    url: BaseURL + "/HRModuleGetRotaInfo",
                    type: 'POST',
                    timeout: sessionStorage.getItem("timeInetrval"),
                    context: self,
                    data: JSON.stringify({
                        rotaId: sessionStorage.getItem("rotaId")
                    }),
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        data = JSON.parse(data[0]);
                        //console.log(data);
                        self.edit_shiftName(data[1])
                        self.edit_startTime(data[2])
                        self.edit_endTime(data[3])
                        self.edit_notes(data[4])
                    }
                });
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
        return  leaves;
    }
);