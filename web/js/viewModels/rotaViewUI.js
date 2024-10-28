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
                        self.tableGet();

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

                self.employees = [
                    {"label":"Manju","value":"4"},
                    {"label":"Sam","value":"5"},
                    {"label":"Kannan","value":"6"},
                    {"label":"Yaseen","value":"7"},
                    {"label":"Issac","value":"8"},
                ]

                self.employeeList = new ArrayDataProvider(self.employees, {
                    keyAttributes: 'value'
                });

                self.shifts = [
                    {"label":"08:00 - 05:00","value":"4"},
                    {"label":"10:00 - 07:00","value":"4"},
                    {"label":"12:00 - 09:00","value":"4"},
                ]

                self.shiftList = new ArrayDataProvider(self.shifts, {
                    keyAttributes: 'value'
                });

                self.tableGet = ()=>{
                    const shiftData = [
                        {
                          date: 'Wed 16 Oct',
                          shifts: [
                            { employees: ['Kannan M', 'Manju Mathew'], startTime: '03:00', endTime: '24:00', color: '#4395e7' },
                            { employees: ['Sam Thomas'], startTime: '09:00', endTime: '19:00', color: '#f37c58' },
                            { employees: ['Mohammed Yaseen'], startTime: '05:00', endTime: '12:00', color: '#7aef7ed9' }
                          ],
                          weekOff: ['Issac', 'Sam']
                        },
                        {
                          date: 'Thu 17 Oct',
                          shifts: [
                            { employees: ['Mohammed Yaseen'], startTime: '08:00', endTime: '16:00', color: '#e387f3' },
                            { employees: ['Aparna'], startTime: '14:00', endTime: '22:00', color: '#fe4545' }
                          ],
                          weekOff: ['Manju Mathew']
                        },
                        {
                          date: 'Fri 18 Oct',
                          shifts: [],
                          weekOff: ['Kannan M', 'Sayooj']
                        },
                        {
                            date: 'Sat 19 Oct',
                            shifts: [],
                            weekOff: ['Kannan M', 'Sayooj']
                        },
                        {
                            date: 'Mon 21 Oct',
                            shifts: [],
                            weekOff: ['Kannan M', 'Sayooj']
                        },
                        {
                            date: 'Tue 22 Oct',
                            shifts: [],
                            weekOff: ['Kannan M', 'Sayooj']
                        }
                      ];
                  
                const tableBody = document.querySelector('#shift-table tbody');

                shiftData.forEach(day => {
                    // Create a row for the date
                    let dateRow = document.createElement('tr');
                    dateRow.classList.add('date-row'); // Add date row class
                
                    // Create the date cell
                    let dateCell = document.createElement('td');
                    dateCell.textContent = day.date; // Only the date is displayed
                    dateRow.appendChild(dateCell);
                
                    // Create the button cell
                    let buttonCell = document.createElement('div');
                    buttonCell.style.display = 'flex'; // Add this line for flexbox
                    buttonCell.style.alignItems = 'center'; // Align items vertically centered

                    // Create the first button
                    let addShiftButton = document.createElement('button');
                    addShiftButton.textContent = 'Assign Emplyees';
                    addShiftButton.classList.add('btn');
                    // Add an event listener to the first button
                    addShiftButton.addEventListener('click', () => {
                        // var clickedRotaId = data.item.data.id
                        // localStorage.setItem("rotaId", clickedRotaId);
                        //document.querySelector('#openAssignEmployees').open();
                    });
                    buttonCell.appendChild(addShiftButton);

                    // Create the second button
                    let anotherButton = document.createElement('button');
                    anotherButton.textContent = 'Edit Shift';
                    anotherButton.classList.add('btn');
                    // Add an event listener to the second button
                    anotherButton.addEventListener('click', () => {
                        // var clickedRotaId = data.item.data.id
                        // localStorage.setItem("rotaId", clickedRotaId);
                        //document.querySelector('#openEditShift').open();
                        //self.getShiftInfo();
                    });
    
                    buttonCell.appendChild(anotherButton);

                    dateRow.appendChild(buttonCell); // Append button cell to the date row

                    // Create empty hour cells
                    for (let i = 0; i < 20; i++) { // Create 20 hour cells
                        let hourCell = document.createElement('td');
                        dateRow.appendChild(hourCell);
                    }
                    
                    // Add the last hour cell
                    dateRow.appendChild(document.createElement('td')); // Last hour cell
                
                    // Add click event to toggle shift and week off rows
                    dateRow.addEventListener('click', () => {
                        const shiftRows = Array.from(tableBody.querySelectorAll(`.shift-row-${day.date.replace(/\s/g, '-')}`));
                        const weekOffRow = tableBody.querySelector(`.weekoff-row-${day.date.replace(/\s/g, '-')}`);
                        shiftRows.forEach(row => {
                            row.classList.toggle('hidden');
                        });
                        weekOffRow.classList.toggle('hidden');
                    });
                
                    tableBody.appendChild(dateRow); // Append the date row to the table
                
                    // Create rows for each shift
                    day.shifts.forEach(shift => {
                        const startHour = parseInt(shift.startTime.split(':')[0], 10);
                        const endHour = parseInt(shift.endTime.split(':')[0], 10);
                        const colspan = endHour - startHour; // Calculate how many columns to span
                
                        let shiftRow = document.createElement('tr');
                        shiftRow.classList.add(`shift-row-${day.date.replace(/\s/g, '-')}`, 'hidden'); // Add class for hiding
                
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
                
                        tableBody.appendChild(shiftRow);
                    });
                
                    // Create a week off row
                    let weekOffRow = document.createElement('tr');
                    weekOffRow.classList.add(`weekoff-row-${day.date.replace(/\s/g, '-')}`, 'hidden'); // Add class for hiding
                    let weekOffCell = document.createElement('td');
                    weekOffCell.colSpan = 25; // Span across all columns except the date column
                    weekOffCell.classList.add('weekoff');
                    weekOffCell.textContent = `Week Off: ${day.weekOff.join(', ')}`; // Add week off names
                    weekOffRow.appendChild(weekOffCell);
                    tableBody.appendChild(weekOffRow);
                });
                
                }                             

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
                        shift: self.shift(),            
                        selectedEmployees: self.selectedEmployees(),
                        selectedOffEmployees: self.selectedOffEmployees(),
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
                localStorage.setItem("rotaId", clickedRotaId);
                document.querySelector('#openEditRota').open();
                //self.getShiftInfo();
            }
            self.getShiftInfo = () => {
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