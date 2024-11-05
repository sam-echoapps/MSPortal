define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", "ojs/ojlistdataproviderview", "ojs/ojdataprovider", "ojs/ojfilepickerutils", "ojs/ojconverterutils-i18n",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojselectcombobox","ojs/ojavatar","ojs/ojradioset", "ojs/ojcheckboxset", "ojs/ojcollapsible", "ojs/ojtable"], 
    function (oj,ko,$, app, ArrayDataProvider, ListDataProviderView, ojdataprovider_1, FilePickerUtils, ojconverterutils_i18n_1) {

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
                        self.getRotaInfo();

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
                self.allocationExistVal = ko.observable('No');
                self.divCheck = ko.observable();

                self.selectDiv = () => {
                    const selectedValue = self.rota_duration();
                    
                    if (selectedValue === 'month') {
                        self.showSelectMonth(true);
                        self.showRangeDate(false);
                    } else {
                        self.showSelectMonth(false);
                        self.showRangeDate(true);
                    }
                };
                self.selectDiv2 = () => {
                    const selectedValue = self.edit_rota_type();
                    if (selectedValue === 'month') {
                        self.divCheck('month')
                        // $("#showMonth").show();
                        // $("#showDate").hide();

                        // self.showSelectMonth(true);
                        // self.showRangeDate(false);
                        // //self.edit_rota_date('')
                        self.edit_rota_date('')
                        self.edit_rota_end_date('')
                    } else {
                        self.divCheck('date')
                        // $("#showMonth").hide();
                        // $("#showDate").show();
                        // self.showSelectMonth(false);
                        // self.showRangeDate(true);
                        // //self.edit_rota_date('')
                        self.edit_rota_month('')
                    }
                };
                self.edit_rota_name = ko.observable('');
                self.edit_rota_name_check = ko.observable('');
                self.edit_rota_duration = ko.observable('');
                self.edit_rota_date = ko.observable('');
                self.edit_rota_month = ko.observable('');
                self.shift_date = ko.observable('');
                self.shift_date_format = ko.observable('');
                self.edit_rota_status = ko.observable('');
                self.existRota = ko.observable('');
                self.edit_rota_type = ko.observable('');
                self.edit_rota_date = ko.observable('');
                self.edit_rota_end_date = ko.observable('');

                self.equalDate = ko.observable('');
                self.dateIssue = ko.observable('');

                self.durations = [
                    // {"label":"4 days","value":"4"},
                    // {"label":"5 days","value":"5"},
                    // {"label":"6 days","value":"6"},
                    // {"label":"7 days","value":"7"},
                    // {"label":"8 days","value":"8"},
                    // {"label":"9 days","value":"9"},
                    // {"label":"10 days","value":"10"},
                    // {"label":"11 days","value":"11"},
                    // {"label":"12 days","value":"12"},
                    // {"label":"13 days","value":"13"},
                    // {"label":"14 days","value":"14"},
                    {"label":"Custom Date","value":"date"},
                    {"label":"Calender Month","value":"month"},
                ]

                self.durationList = new ArrayDataProvider(self.durations, {
                    keyAttributes: 'value'
                });
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

                self.currentDate = ko.observable();

                const CurrentDate = new Date(); 
                let currentYear= CurrentDate.getFullYear(); 
                let currentMonth= CurrentDate.getMonth()+1; 
                let currentDay= CurrentDate.getDate(); 
                //console.log(CurrentDate); 
                
                if(currentMonth<10){
                    currentMonth = '0'+currentMonth;
                }       
                if(currentDay<10){
                    currentDay = '0'+currentDay;
                }
                self.currentDate(currentYear+'-'+currentMonth+'-'+currentDay)

                

                self.getRotaInfo = () => {
                    $("#loaderView").show();
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
                            self.edit_rota_name_check(data[1])
                            self.edit_rota_duration(data[2])
                            self.edit_rota_type(data[7])
                            self.selectDiv2()
                            self.edit_rota_status(data[5])
                            if(data[3]){
                            self.edit_rota_date(data[3])
                            self.edit_rota_end_date(data[6])
                            self.tableGet(self.edit_rota_duration(),self.edit_rota_date());
                            }
                            if(data[4]){
                            const dateStr = data[4];  // Assuming "YYYY-MM" format
                            const [year, month] = dateStr.split('-'); // Create a Date object from the parsed year and month
                            const date = new Date(year, month - 1, 1);  // month - 1 because JavaScript months are 0-indexed
                            // Generate label (like "Apr 2025") using the same formatting options
                            const label = date.toLocaleDateString('en-US', options);
                            // Update the edit_rota_month observable with the formatted label
                            self.edit_rota_month(dateStr);

                            const [monthName, yearVal] = label.split(" ");
                            const monthMap = {
                                "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", 
                                "May": "05", "Jun": "06", "Jul": "07", "Aug": "08", 
                                "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
                            };
                            const formattedMonth = monthMap[monthName];
                            const formattedDate = `${yearVal}-${formattedMonth}`;
                            
                            self.tableGetMonth(formattedDate);
                            }
                        }
                    });
                };

                self.editRota = ()=>{ 
                    // Define the start and end dates as strings
                const startDateStr = self.edit_rota_date(); // Example: "2024-11-01"
                const endDateStr = self.edit_rota_end_date(); // Example: "2024-11-26"

                // Convert the strings to Date objects
                const startDate = new Date(startDateStr);
                const endDate = new Date(endDateStr);

                // Calculate the difference in milliseconds
                const diffInMs = endDate - startDate;


                // Calculate the difference in days, hours, minutes, and seconds
                const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
                self.edit_rota_duration(diffInDays+1)

                if(self.edit_rota_date() == self.edit_rota_end_date() && self.edit_rota_date() != "" && self.edit_rota_end_date()!=""){
                    self.equalDate('Yes')
                    let popup1 = document.getElementById("warningViewDateSame");
                    popup1.open();
                }else{
                    self.equalDate() == ''
                }
                if(self.edit_rota_date() > self.edit_rota_end_date() && self.edit_rota_date() != "" && self.edit_rota_end_date()!=""){
                    self.dateIssue() == 'Yes'
                    let popup1 = document.getElementById("warningViewDateIssue");
                    popup1.open();
                }else{
                    self.dateIssue() == ''
                }

                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid && self.equalDate() == '' && self.dateIssue() == '') {
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
                            rota_end_date: self.edit_rota_end_date(),
                            rota_type: self.edit_rota_type(),
                        }),
                        dataType: 'json',
                        timeout: localStorage.getItem("timeInetrval"),
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
                }

                self.warnDateIssueMsgClose = ()=>{
                    self.equalDate('')
                    self.dateIssue('')
                    let popup1 = document.getElementById("warningViewDateSame");
                    popup1.close();
                    let popup2 = document.getElementById("warningViewDateIssue");
                    popup2.close();
                }
    
                self.tableGet = (duration, start) => {
                    $("#loaderView").show();
                    $("#publishBtn").hide();
                    const options = { weekday: 'short', day: 'numeric', month: 'short' };
                    const shiftData = []; // Declare the array to hold shift data
                
                    // Convert start (string or other format) to a Date object
                    const startDate = new Date(start);
                
                    // Create a promise array to handle all AJAX calls
                    const ajaxCalls = [];
                
                    const colors = ['#cff4fc', '#fff3cd', '#1abc9c', '#6c5ffc'];
                
                    for (let i = 0; i < duration; i++) {
                        // Calculate the next date
                        const shiftDate = new Date(startDate);
                        shiftDate.setDate(startDate.getDate() + i);
                        const formattedDateISO = shiftDate.toISOString().split('T')[0];
                
                        // Format the date as 'Mon 21 Oct'
                        const formattedDate = shiftDate.toLocaleDateString('en-GB', options);
                        const dayShifts = [];
                        const weekOff = [];
                        const leaveStaff = [];
                        
                
                        // Create a promise for each AJAX call
                        const ajaxCall = $.ajax({
                            url: BaseURL + "/HRModuleGetAssignStaffList",
                            type: 'GET',
                            timeout: localStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                data = JSON.parse(data[0]);
                                console.log(data);
                
                                // Populate the employeeShifts array
                                const employeeShifts = []; // Declare it here for each call
                                const offEmployeeShifts = []; // Declare it here for each call
                                const leaveEmployee = []; // Declare it here for each call
                                for (var j = 0; j < data.length; j++) {
                                    var employeeNames = data[j][7].split(',').map(name => name.trim()); // Clean up any extra whitespace
                                    var offEmployeeNames = data[j][9].split(',').map(name => name.trim()); // Clean up any extra whitespace
                                    var leaveStaffNames = data[j][10].split(',').map(name => name.trim()); // Clean up any extra whitespace
                                    var colorIndex = j % colors.length;
                                    employeeShifts.push({
                                        'date': data[j][1],
                                        'employees': employeeNames,
                                        'shiftName': data[j][4],
                                        'startTime': data[j][5],
                                        'endTime': data[j][6],
                                        'color': colors[colorIndex]
                                    });
                                    offEmployeeShifts.push({
                                        'date': data[j][1],
                                        'offEmployees': offEmployeeNames,
                                        'color': colors[colorIndex]
                                    });
                                    leaveEmployee.push({
                                        'date': data[j][1],
                                        'leaveStaff': leaveStaffNames,
                                        'color': colors[colorIndex]
                                    });
                                }

                
                                // Process the shifts to find matching dates
                                employeeShifts.forEach(shift => {
                                    // If the shift date matches the formatted date, add the shift to the day's shifts
                                    if (shift.date === formattedDate) {
                                        dayShifts.push({
                                            employees: shift.employees,
                                            shiftName: shift.shiftName,
                                            startTime: shift.startTime,
                                            endTime: shift.endTime,
                                            color: shift.color
                                        });
                                    }
                                });
                
                                offEmployeeShifts.forEach(off => {
                                    // If the shift date matches the formatted date, add the week off to the day's weekOff
                                    if (off.date === formattedDate) {
                                        weekOff.push({
                                            offEmployees: off.offEmployees,
                                            color: "#ced4da"
                                        });
                                    }
                                });

                                leaveEmployee.forEach(leave => {
                                    // If the shift date matches the formatted date, add the week off to the day's weekOff
                                    if (leave.date === formattedDate) {
                                        leaveStaff.push({
                                            leaveStaffNames: leave.leaveStaff,
                                            color: "#f8d7da"
                                        });
                                    }
                                });

                
                                // Push the shift data for the current date
                                shiftData.push({
                                    fullDate : formattedDateISO,
                                    date: formattedDate,
                                    shifts: dayShifts,
                                    weekOff: weekOff,
                                    leaveStaff: leaveStaff
                                });
                            }
                        });
                
                        // Collect each AJAX call promise
                        ajaxCalls.push(ajaxCall);
                    }
                
                    // Wait for all AJAX calls to complete
                    Promise.all(ajaxCalls).then(() => {
                        // Now all shift data is populated
                        console.log(shiftData);
                
                        const tableBody = document.querySelector('#shift-table tbody');
                
                        shiftData.forEach(day => {
                            // Sanitize the date string to use it in the class name (remove commas and replace spaces with dashes)
                            const sanitizedDate = day.date.replace(/,/g, '').replace(/\s+/g, '-');
                            const sanitizedFullDate = day.fullDate.replace(/,/g, '').replace(/\s+/g, '-');

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
                            addShiftButton.classList.add('btn');
                            
                            // Create an <i> element for the icon
                            let icon = document.createElement('i');
                            icon.classList.add('fas', 'fa-eye'); // Replace 'fa-eye' with your desired icon class
                            
                            // Append the icon to the button
                            addShiftButton.appendChild(icon);
                
                            // Add event listener to toggle only the shifts for the clicked date
                            addShiftButton.addEventListener('click', () => {
                                const shiftRowsForDay = document.querySelectorAll(`.shift-row-${sanitizedDate}`);
                                const weekOffRowsForDay = document.querySelectorAll(`.weekoff-row-${sanitizedDate}`);
                                const leaveRowsForDay = document.querySelectorAll(`.leave-row-${sanitizedDate}`);

                                const isAnyVisible = Array.from(shiftRowsForDay).some(row => !row.classList.contains('hidden')) ||
                                                     Array.from(weekOffRowsForDay).some(row => !row.classList.contains('hidden'))||
                                                     Array.from(leaveRowsForDay).some(row => !row.classList.contains('hidden'));
                
                                if (isAnyVisible) {
                                    shiftRowsForDay.forEach(row => row.classList.add('hidden'));
                                    weekOffRowsForDay.forEach(row => row.classList.add('hidden'));
                                    leaveRowsForDay.forEach(row => row.classList.add('hidden'));
                                } else {
                                    document.querySelectorAll('.shift-row').forEach(row => row.classList.add('hidden'));
                                    document.querySelectorAll('.weekoff-row').forEach(row => row.classList.add('hidden'));
                                    document.querySelectorAll('.leave-row').forEach(row => row.classList.add('hidden'));
                                    shiftRowsForDay.forEach(row => row.classList.remove('hidden'));
                                    weekOffRowsForDay.forEach(row => row.classList.remove('hidden'));
                                    leaveRowsForDay.forEach(row => row.classList.remove('hidden'));
                                }
                            });
                
                            buttonCell.appendChild(addShiftButton);

                            if(self.userrole() == 'director' || self.userrole() == 'senior hr' || self.userrole() == 'senior manager' || self.userrole() == 'senior accounts' ){
                                if(self.edit_rota_status() != 'Old'){
                
                            // Create the second button
                            let anotherButton = document.createElement('button');
                            anotherButton.classList.add('btn');

                            // Create an <i> element for the icon
                            let iconPlus = document.createElement('i');
                            iconPlus.classList.add('fas', 'fa-user-plus'); // Replace 'fa-user-plus' with your desired icon class

                            // Append the icon to the button
                            anotherButton.appendChild(iconPlus);

                            anotherButton.addEventListener('click', () => {
                                self.shift_date(`${day.date}`);
                                self.shift_date_format(`${day.fullDate}`);
                                self.getShiftList();
                                self.getAllocateStaffList();
                                self.selectedEmployees([])
                                self.selectedOffEmployees([])
                                self.allocationExistVal('No')
                                document.querySelector('#openAssignEmployees').open();
                            });
                
                            buttonCell.appendChild(anotherButton);
                        }
                    }
                            dateRow.appendChild(buttonCell); // Append button cell to the date row
                
                            // Create empty hour cells
                            for (let i = 0; i < 23; i++) {
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
                                shiftRow.classList.add(`shift-row-${sanitizedDate}`, 'shift-row'); // Initially show now, if add hidden class then hide 
                
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
                                shiftCell.textContent = "Allocated Staff: " + shift.employees.join(', ');
                                shiftCell.style.backgroundColor = shift.color; // Set the background color
                                shiftCell.style.color = '#000000'; // Set text color to white
                                shiftCell.title = shift.shiftName + " : " + shift.startTime+"-"+shift.endTime;
                                shiftRow.appendChild(shiftCell);
                
                                // Fill empty cells for hours after the shift
                                for (let hour = endHour; hour < 23; hour++) {
                                    let emptyCell = document.createElement('td');
                                    shiftRow.appendChild(emptyCell);
                                }
                
                                // Append shift row to the table (hidden initially)
                                tableBody.appendChild(shiftRow);
                            });
                
                            // Create rows for week-off and hide initially
                            // day.weekOff.forEach(off => {
                            //     let weekOffRow = document.createElement('tr');
                            //     weekOffRow.classList.add(`weekoff-row-${sanitizedDate}`, 'weekoff-row'); // Initially hidden
                
                            //     // Create a cell for week off employees
                            //     let weekOffCell = document.createElement('td');
                            //     weekOffCell.colSpan = 25; // Span the entire row
                            //     weekOffCell.textContent = `Week Off: ${off.offEmployees.join(', ')}`;
                            //     weekOffCell.style.backgroundColor = off.color; // Set the background color for week off
                            //     weekOffCell.style.color = '#000000'; // Set text color to white
                            //     weekOffCell.title = `Weekoff Staff`;
                            //     weekOffRow.appendChild(weekOffCell);
                
                            //     // Append week off row to the table (hidden initially)
                            //     tableBody.appendChild(weekOffRow);
                            // });
                            // Create a Set to track unique week-off entries
                        const uniqueWeekOffEntries = new Set();

                        // Check if there are any week-off entries for the day
                        if (day.weekOff.length > 0) {
                            // Loop through the weekOff entries to aggregate unique values
                            day.weekOff.forEach(off => {
                                // Create a unique key based on the employee names and color
                                const key = `${off.offEmployees.join(', ')}|${off.color}`;
                                uniqueWeekOffEntries.add(key); // Add to the Set to ensure uniqueness
                            });

                            // Create a single row for all unique week-off employees
                            let weekOffRow = document.createElement('tr');
                            weekOffRow.classList.add(`weekoff-row-${sanitizedDate}`, 'weekoff-row'); // Class for styling

                            // Create a cell for week off employees
                            let weekOffCell = document.createElement('td');
                            weekOffCell.colSpan = 25; // Span the entire row

                            // Aggregate all unique week-off employee names and their colors
                            const allOffEntries = Array.from(uniqueWeekOffEntries).map(entry => {
                                const [employees, color] = entry.split('|');
                                return { employees, color };
                            });

                            // Combine all unique employee entries into a single string
                            const combinedEmployees = allOffEntries.map(entry => entry.employees).join(', ');

                            // Set the text content to the list of week-off employees
                            weekOffCell.textContent = `Week Off: ${combinedEmployees}`;
                            
                            // Set the background color for week off using the color of the first entry (or adjust as needed)
                            weekOffCell.style.backgroundColor = allOffEntries.length > 0 ? allOffEntries[0].color : '#fff'; // Set the background color for week off
                            weekOffCell.style.color = '#000000'; // Set text color to black
                            weekOffCell.title = `Weekoff Staff`;
                            
                            weekOffRow.appendChild(weekOffCell);

                            // Append week off row to the table (this will only happen once)
                            tableBody.appendChild(weekOffRow);
                        }

                        // Create a Set to track unique leave entries
                        const uniqueLeaveEntries = new Set();

                        // Check if there are any leave entries for the day
                        if (day.leaveStaff.length > 0) {
                            // Loop through the leaves entries to aggregate unique values
                            day.leaveStaff.forEach(leave => {
                                // Create a unique key based on the leave staff names and color
                                const key = `${leave.leaveStaffNames.join(', ')}|${leave.color}`;
                                uniqueLeaveEntries.add(key); // Add to the Set to ensure uniqueness
                            });

                            // Create a single row for all unique leave staff
                            let leaveRow = document.createElement('tr');
                            leaveRow.classList.add(`leave-row-${sanitizedDate}`, 'leave-row'); // Class for styling

                            // Create a cell for leave staff
                            let leaveCell = document.createElement('td');
                            leaveCell.colSpan = 25; // Span the entire row

                            // Aggregate all unique leave staff names and their colors
                            const allLeaveEntries = Array.from(uniqueLeaveEntries).map(entry => {
                                const [staff, color] = entry.split('|');
                                return { staff, color };
                            });

                            // Combine all unique leave staff entries into a single string
                            const combinedLeaveStaff = allLeaveEntries.map(entry => entry.staff).join(', ');

                            // Set the text content to the list of leave staff
                            leaveCell.textContent = `Leave Staff: ${combinedLeaveStaff}`;
                            
                            // Set the background color for leave using the color of the first entry (or adjust as needed)
                            leaveCell.style.backgroundColor = allLeaveEntries[0].color;
                            leaveCell.style.color = '#000000'; // Set text color as needed
                            leaveCell.title = `Leave Staff`;

                            leaveRow.appendChild(leaveCell);

                            // Append leave row to the table (hidden initially)
                            tableBody.appendChild(leaveRow);
                        }

                            $("#loaderView").hide();
                            $("#publishBtn").show();
                        });
                      
                    }).catch(err => {
                        console.error("Error occurred while fetching shifts:", err);
                    });
                };


                self.tableGetMonth = (month) => {
                    $("#loaderView").show();
                    $("#publishBtn").hide();
                    const options = { weekday: 'short', day: 'numeric', month: 'short' };
                    const shiftData = []; // Array to hold shift data
                
                    // Parse the month parameter (format "YYYY-MM")
                    const [year, monthIndex] = month.split('-').map(Number);
                    const startDate = new Date(year, monthIndex - 1, 1); // First day of the month
                    const endDate = new Date(year, monthIndex, 0); // Last day of the month
                
                    const colors = ['#cff4fc', '#fff3cd', '#1abc9c', '#6c5ffc'];
                    const ajaxCalls = []; // Array to hold AJAX promises
                
                    for (let day = 1; day <= endDate.getDate(); day++) {
                        const shiftDate = new Date(year, monthIndex - 1, day);
                        //const formattedDateISO = shiftDate.toISOString().split('T')[0];
                        const nextDayDate = new Date(shiftDate);
                        // Add one day to the new date
                        nextDayDate.setDate(nextDayDate.getDate() + 1);
                        // Format the new date to ISO format (YYYY-MM-DD)
                        const formattedDateISO = nextDayDate.toISOString().split('T')[0];
                        const formattedDate = shiftDate.toLocaleDateString('en-GB', options);
                        const dayShifts = [];
                        const weekOff = [];
                        const leaveStaff = [];

                        // Create a promise for each AJAX call
                        const ajaxCall = $.ajax({
                            url: BaseURL + "/HRModuleGetAssignStaffList",
                            type: 'GET',
                            timeout: localStorage.getItem("timeInetrval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                            },
                            success: function (data) {
                                data = JSON.parse(data[0]);
                                console.log(data);
                
                                const employeeShifts = [];
                                const offEmployeeShifts = [];
                                const leaveEmployee = [];
                                for (var j = 0; j < data.length; j++) {
                                    var employeeNames = data[j][7].split(',').map(name => name.trim());
                                    var offEmployeeNames = data[j][9].split(',').map(name => name.trim());
                                    var leaveStaffNames = data[j][10].split(',').map(name => name.trim()); // Clean up any extra whitespace
                                    var colorIndex = j % colors.length;
                                    employeeShifts.push({
                                        'date': data[j][1],
                                        'employees': employeeNames,
                                        'shiftName': data[j][4],
                                        'startTime': data[j][5],
                                        'endTime': data[j][6],
                                        'color': colors[colorIndex]
                                    });
                                    offEmployeeShifts.push({
                                        'date': data[j][1],
                                        'offEmployees': offEmployeeNames,
                                        'color': colors[colorIndex]
                                    });
                                    leaveEmployee.push({
                                        'date': data[j][1],
                                        'leaveStaff': leaveStaffNames,
                                        'color': colors[colorIndex]
                                    });
                                }
                
                                employeeShifts.forEach(shift => {
                                    if (shift.date === formattedDate) {
                                        dayShifts.push({
                                            employees: shift.employees,
                                            shiftName: shift.shiftName,
                                            startTime: shift.startTime,
                                            endTime: shift.endTime,
                                            color: shift.color
                                        });
                                    }
                                });
                
                                offEmployeeShifts.forEach(off => {
                                    if (off.date === formattedDate) {
                                        weekOff.push({
                                            offEmployees: off.offEmployees,
                                            color: "#ced4da"
                                        });
                                    }
                                });

                                leaveEmployee.forEach(leave => {
                                    // If the shift date matches the formatted date, add the week off to the day's weekOff
                                    if (leave.date === formattedDate) {
                                        leaveStaff.push({
                                            leaveStaffNames: leave.leaveStaff,
                                            color: "#f8d7da"
                                        });
                                    }
                                });
                
                                shiftData.push({
                                    fullDate: formattedDateISO,
                                    date: formattedDate,
                                    shifts: dayShifts,
                                    weekOff: weekOff,
                                    leaveStaff: leaveStaff
                                });
                            }
                        });
                
                        // Collect each AJAX call promise
                        ajaxCalls.push(ajaxCall);
                    }
                
                    // Wait for all AJAX calls to complete
                    Promise.all(ajaxCalls).then(() => {
                        const tableBody = document.querySelector('#shift-table tbody');
                        
                        shiftData.forEach(day => {
                            const sanitizedDate = day.date.replace(/,/g, '').replace(/\s+/g, '-');
                            const sanitizedFullDate = day.fullDate.replace(/,/g, '').replace(/\s+/g, '-');
                
                            let dateRow = document.createElement('tr');
                            dateRow.classList.add('date-row');
                
                            let dateCell = document.createElement('td');
                            dateCell.textContent = day.date;
                            dateRow.appendChild(dateCell);
                
                            let buttonCell = document.createElement('div');
                            buttonCell.style.display = 'flex';
                            buttonCell.style.alignItems = 'center';
                
                            let addShiftButton = document.createElement('button');
                            addShiftButton.classList.add('btn');
                
                            let icon = document.createElement('i');
                            icon.classList.add('fas', 'fa-eye');
                            addShiftButton.appendChild(icon);
                
                            addShiftButton.addEventListener('click', () => {
                                const shiftRowsForDay = document.querySelectorAll(`.shift-row-${sanitizedDate}`);
                                const weekOffRowsForDay = document.querySelectorAll(`.weekoff-row-${sanitizedDate}`);
                                const leaveRowsForDay = document.querySelectorAll(`.leave-row-${sanitizedDate}`);

                                const isAnyVisible = Array.from(shiftRowsForDay).some(row => !row.classList.contains('hidden')) ||
                                                     Array.from(weekOffRowsForDay).some(row => !row.classList.contains('hidden')) ||
                                                     Array.from(leaveRowsForDay).some(row => !row.classList.contains('hidden'));
                                                     
                                
                                if (isAnyVisible) {
                                    shiftRowsForDay.forEach(row => row.classList.add('hidden'));
                                    weekOffRowsForDay.forEach(row => row.classList.add('hidden'));
                                    leaveRowsForDay.forEach(row => row.classList.add('hidden'));
                                } else {
                                    document.querySelectorAll('.shift-row').forEach(row => row.classList.add('hidden'));
                                    document.querySelectorAll('.weekoff-row').forEach(row => row.classList.add('hidden'));
                                    document.querySelectorAll('.leave-row').forEach(row => row.classList.add('hidden'));
                                    shiftRowsForDay.forEach(row => row.classList.remove('hidden'));
                                    weekOffRowsForDay.forEach(row => row.classList.remove('hidden'));
                                    leaveRowsForDay.forEach(row => row.classList.remove('hidden'));
                                }
                            });
                
                            buttonCell.appendChild(addShiftButton);
                
                            let anotherButton = document.createElement('button');
                            anotherButton.classList.add('btn');
                
                            let iconPlus = document.createElement('i');
                            iconPlus.classList.add('fas', 'fa-user-plus');
                            anotherButton.appendChild(iconPlus);
                
                            anotherButton.addEventListener('click', () => {
                                self.shift_date(`${day.date}`);
                                self.shift_date_format(`${day.fullDate}`);
                                self.getShiftList();
                                self.getAllocateStaffList();
                                self.selectedEmployees([]);
                                self.selectedOffEmployees([]);
                                self.allocationExistVal('No');
                                document.querySelector('#openAssignEmployees').open();
                            });
                
                            buttonCell.appendChild(anotherButton);
                            dateRow.appendChild(buttonCell);
                
                            for (let i = 0; i < 23; i++) {
                                let hourCell = document.createElement('td');
                                dateRow.appendChild(hourCell);
                            }
                
                            tableBody.appendChild(dateRow);
                
                            day.shifts.forEach(shift => {
                                const startHour = parseInt(shift.startTime.split(':')[0], 10);
                                const endHour = parseInt(shift.endTime.split(':')[0], 10);
                                const colspan = endHour - startHour;
                
                                let shiftRow = document.createElement('tr');
                                shiftRow.classList.add(`shift-row-${sanitizedDate}`, 'shift-row');
                
                                let shiftTimeCell = document.createElement('td');
                                shiftRow.appendChild(shiftTimeCell);
                
                                for (let hour = 0; hour < startHour; hour++) {
                                    let emptyCell = document.createElement('td');
                                    shiftRow.appendChild(emptyCell);
                                }
                
                                let shiftCell = document.createElement('td');
                                shiftCell.colSpan = colspan;
                                shiftCell.classList.add('shift');
                                shiftCell.textContent = "Allocated Staff: " + shift.employees.join(', ');
                                shiftCell.style.backgroundColor = shift.color;
                                shiftCell.style.color = '#000000';
                                shiftCell.title = shift.shiftName + " : " + shift.startTime+"-"+shift.endTime;
                                shiftRow.appendChild(shiftCell);
                
                                for (let hour = endHour; hour < 23; hour++) {
                                    let emptyCell = document.createElement('td');
                                    shiftRow.appendChild(emptyCell);
                                }
                
                                tableBody.appendChild(shiftRow);
                            });
                
                            // day.weekOff.forEach(off => {
                            //     let weekOffRow = document.createElement('tr');
                            //     weekOffRow.classList.add(`weekoff-row-${sanitizedDate}`, 'weekoff-row');
                
                            //     let weekOffCell = document.createElement('td');
                            //     weekOffCell.colSpan = 25;
                            //     weekOffCell.textContent = `Week Off: ${off.offEmployees.join(', ')}`;
                            //     weekOffCell.style.backgroundColor = off.color;
                            //     weekOffCell.style.color = '#000000';
                            //     weekOffRow.appendChild(weekOffCell);
                
                            //     tableBody.appendChild(weekOffRow);
                            // });
                            // Create a Set to track unique week-off entries
                        const uniqueWeekOffEntries = new Set();

                        // Check if there are any week-off entries for the day
                        if (day.weekOff.length > 0) {
                            // Loop through the weekOff entries to aggregate unique values
                            day.weekOff.forEach(off => {
                                // Create a unique key based on the employee names and color
                                const key = `${off.offEmployees.join(', ')}|${off.color}`;
                                uniqueWeekOffEntries.add(key); // Add to the Set to ensure uniqueness
                            });

                            // Create a single row for all unique week-off employees
                            let weekOffRow = document.createElement('tr');
                            weekOffRow.classList.add(`weekoff-row-${sanitizedDate}`, 'weekoff-row'); // Class for styling

                            // Create a cell for week off employees
                            let weekOffCell = document.createElement('td');
                            weekOffCell.colSpan = 25; // Span the entire row

                            // Aggregate all unique week-off employee names and their colors
                            const allOffEntries = Array.from(uniqueWeekOffEntries).map(entry => {
                                const [employees, color] = entry.split('|');
                                return { employees, color };
                            });

                            // Combine all unique employee entries into a single string
                            const combinedEmployees = allOffEntries.map(entry => entry.employees).join(', ');

                            // Set the text content to the list of week-off employees
                            weekOffCell.textContent = `Week Off: ${combinedEmployees}`;
                            
                            // Set the background color for week off using the color of the first entry (or adjust as needed)
                            weekOffCell.style.backgroundColor = allOffEntries.length > 0 ? allOffEntries[0].color : '#fff'; // Set the background color for week off
                            weekOffCell.style.color = '#000000'; // Set text color to black
                            weekOffCell.title = `Weekoff Staff`;
                            
                            weekOffRow.appendChild(weekOffCell);

                            // Append week off row to the table (this will only happen once)
                            tableBody.appendChild(weekOffRow);
                        }

                         // Create a Set to track unique leave entries
                         const uniqueLeaveEntries = new Set();

                         // Check if there are any leave entries for the day
                         if (day.leaveStaff.length > 0) {
                             // Loop through the leaves entries to aggregate unique values
                             day.leaveStaff.forEach(leave => {
                                 // Create a unique key based on the leave staff names and color
                                 const key = `${leave.leaveStaffNames.join(', ')}|${leave.color}`;
                                 uniqueLeaveEntries.add(key); // Add to the Set to ensure uniqueness
                             });
 
                             // Create a single row for all unique leave staff
                             let leaveRow = document.createElement('tr');
                             leaveRow.classList.add(`leave-row-${sanitizedDate}`, 'leave-row'); // Class for styling
 
                             // Create a cell for leave staff
                             let leaveCell = document.createElement('td');
                             leaveCell.colSpan = 25; // Span the entire row
 
                             // Aggregate all unique leave staff names and their colors
                             const allLeaveEntries = Array.from(uniqueLeaveEntries).map(entry => {
                                 const [staff, color] = entry.split('|');
                                 return { staff, color };
                             });
 
                             // Combine all unique leave staff entries into a single string
                             const combinedLeaveStaff = allLeaveEntries.map(entry => entry.staff).join(', ');
 
                             // Set the text content to the list of leave staff
                             leaveCell.textContent = `Leave Staff: ${combinedLeaveStaff}`;
                             
                             // Set the background color for leave using the color of the first entry (or adjust as needed)
                             leaveCell.style.backgroundColor = allLeaveEntries[0].color;
                             leaveCell.style.color = '#000000'; // Set text color as needed
                             leaveCell.title = `Leave Staff`;
 
                             leaveRow.appendChild(leaveCell);
 
                             // Append leave row to the table (hidden initially)
                             tableBody.appendChild(leaveRow);
                         }

                            $("#loaderView").hide();
                            $("#publishBtn").show();
                        });
                       
                    }).catch(err => {
                        console.error("Error occurred while fetching shifts:", err);
                    });
                };
                
                
                
                

                self.getShiftList = ()=>{
                    self.ShiftDet([]);
                    document.getElementById('loaderView').style.display='block';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetShiftList",
                        type: 'GET',
                        timeout: localStorage.getItem("timeInetrval"),
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
                        type: 'POST',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            shift_date: self.shift_date(),
                            shift_date_format: self.shift_date_format()
                        }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (result) {
                            let data,data2;
                            data = result[0]
                            console.log(data)
                            document.getElementById('loaderView').style.display='none';
                            if(data.length!=0){
                                for (var i = 0; i < data.length; i++) {
                                    self.StaffDet.push({'value': data[i][0],'label': data[i][1] + " " +  data[i][2] + " " +  data[i][3] }); 
                                }
                            }
                            data2 = result[1]
                            if(data2.length!=0){
                                for (var i = 0; i < data2.length; i++) {
                                    self.OffStaffDet.push({'value': data2[i][0],'label': data2[i][1] + " " +  data2[i][2] + " " +  data2[i][3] }); 
                                }
                            }

                        }
                    })
                }

                self.StaffList = new ArrayDataProvider(this.StaffDet, { keyAttributes: "value"});
                self.OffStaffList = new ArrayDataProvider(this.OffStaffDet, { keyAttributes: "value"});
                         

            self.shift = ko.observable('');
            self.selectedEmployees = ko.observableArray([]); 
            self.selectedOffEmployees = ko.observableArray([]); 

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

            self.assignEmployees = ()=>{
                let duplicate=0;
                for (let id of self.selectedEmployees()) {
                    if (self.selectedOffEmployees().includes(id)) {
                        duplicate = 1;
                    }else{
                        duplicate = 0;
                    }
                }
                if(duplicate==0){
                        const formValid = self._checkValidationGroup("formValidation"); 
                        if (formValid) {
                        let popup = document.getElementById("loaderPopup");
                        popup.open();
                        $.ajax({
                            url: BaseURL+"/HRModuleAssignEmployees",
                            type: 'POST',
                            data: JSON.stringify({
                                rotaId : localStorage.getItem("rotaId"),
                                shift_date: self.shift_date(),            
                                shiftId: self.shift(),            
                                selectedEmployees: self.selectedEmployees(),
                                selectedOffEmployees: self.selectedOffEmployees(),
                                shift_date_format: self.shift_date_format(),            
                            }),
                            dataType: 'json',
                            timeout: localStorage.getItem("timeInetrval"),
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
                    }else{
                        let popup1 = document.getElementById("warningViewDuplicate");
                        popup1.open();
                    } 
                }


            self.messageClose = ()=>{
                location.reload();
            }

            self.goToPage = (event)=>{
                self.router.go({path:'rota'})
            }

            self.confirmPublishRota = (event)=>{
                localStorage.setItem("activeRotaTab", 'Yes');
                self.router.go({path:'rota'})
            }

            self.allocationExist = ()=>{
                self.selectedEmployees([])
                if(self.shift()!=""){
                    $.ajax({
                        url: BaseURL+"/HRModuleGetAllocationExist",
                        type: 'POST',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            shift_date: self.shift_date(),
                            shift: self.shift()
                        }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (result) {
                            console.log(result)
                            let data1,data2;
                            data1 = result[0]
                            data2 = result[1]
                            console.log(data2)
                            if(data1.length != 0){
                                let selectedEmployee = data1[0][0].split(',').map(Number);
                                self.selectedEmployees(selectedEmployee)
                            }
                            if(data2[0][0] != null){
                                let selectedOffEmployees = data2[0][0].split(',').map(Number);
                                self.selectedOffEmployees(selectedOffEmployees)
                            }
                            if(data1.length != 0){
                                self.allocationExistVal('Yes')
                            }
                        }
                    })
                }
            }

            self.assignEmployeesUpdate = ()=>{
                let duplicate;
                for (let id of self.selectedEmployees()) {
                    if (self.selectedOffEmployees().includes(id)) {
                        duplicate = 1;
                    }else{
                        duplicate = 0;
                    }
                }
                if(duplicate==0){
                const formValid = self._checkValidationGroup("formValidation");
                if (formValid) {
                let popup = document.getElementById("loaderPopup");
                popup.open();
                $.ajax({
                    url: BaseURL+"/HRModuleUpdateAssignEmployees",
                    type: 'POST',
                    data: JSON.stringify({
                        shiftId: self.shift(),            
                        shift_date: self.shift_date(),            
                        selectedEmployees: self.selectedEmployees(),
                        selectedOffEmployees: self.selectedOffEmployees(),
                    }),
                    dataType: 'json',
                    timeout: localStorage.getItem("timeInetrval"),
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
        }else{
            let popup1 = document.getElementById("warningViewDuplicate");
            popup1.open();
        }    
            }

            self.warnDuplicateMsgClose = ()=>{
                let popup1 = document.getElementById("warningViewDuplicate");
                popup1.close();
            }

            self.warnMsgClose = ()=>{
                let popup1 = document.getElementById("warningView");
                popup1.close();
                let popup2 = document.getElementById("warningUnpublishView");
                popup2.close();
            }

            self.publishRota = ()=>{
                let popup1 = document.getElementById("warningView");
                popup1.open();
            }

            self.unpublishRota = ()=>{
                let popup1 = document.getElementById("warningUnpublishView");
                popup1.open();
            }

            self.goToShiftTab = (event)=>{
                localStorage.setItem("shiftTab", 'Yes');
                self.router.go({path:'rota'})
            }

            self.confirmPublishRota = ()=>{
                $.ajax({
                    url: BaseURL+"/HRModulePublishRota",
                    type: 'POST',
                    data: JSON.stringify({
                        rotaId: localStorage.getItem("rotaId")
                    }),
                    dataType: 'json',
                    timeout: localStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        console.log(data)
                        localStorage.setItem("activeRotaTab", 'Yes');
                        self.router.go({path:'rota'})
                    }
                }) 
            }

            self.confirmUnpublishRota = ()=>{
                $.ajax({
                    url: BaseURL+"/HRModuleUnpublishRota",
                    type: 'POST',
                    data: JSON.stringify({
                        rotaId: localStorage.getItem("rotaId")
                    }),
                    dataType: 'json',
                    timeout: localStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        console.log(data)
                        localStorage.setItem("draftRotaTab", 'Yes');
                        self.router.go({path:'rota'})
                    }
                }) 
            }

            self.alertRota = ()=>{
                let popup1 = document.getElementById("warningAlertView");
                popup1.open();
            }

            self.warnAlertMsgClose = ()=>{
                let popup1 = document.getElementById("warningAlertView");
                popup1.close();
            }

            self.confirmAlertRota = ()=>{
                $.ajax({
                    url: BaseURL+"/HRModuleAlertRota",
                    type: 'GET',
                    dataType: 'json',
                    timeout: localStorage.getItem("timeInetrval"),
                    context: self,
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (data) {
                        console.log(data)
                        location.reload()
                        // localStorage.setItem("activeRotaTab", 'Yes');
                        // self.router.go({path:'rota'})
                    }
                }) 
            }

            self.rotaExistCheck = (event)=> {
                let valueCheck = event.detail.value
                if(valueCheck!=self.edit_rota_name_check()){
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