define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", "ojs/ojlistdataproviderview", "ojs/ojdataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable"], 
    function (oj,ko,$, app, ArrayDataProvider, ListDataProviderView, ojdataprovider_1, FilePickerUtils) {

        class EmployeeGoalsList {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = localStorage.getItem("BaseURL")
                
                self.GoalDet = ko.observableArray([]); 
                self.CancelBehaviorOpt = ko.observable('icon'); 
                self.yearFilter = ko.observable('');
                self.GoalYearDet = ko.observableArray([]);
                self.filterYearCallCount = 0; // Initialize counter

                self.connected = function () {
                    if (localStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        if (self.yearFilter() == '') {
                            const currentYear1 = new Date().getFullYear();
                            console.log(currentYear1);
                            self.yearFilter(currentYear1);
                        }
                        self.getGoals();

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

                self.getGoals = ()=>{
                    self.GoalDet([]);
                    document.getElementById('loaderView').style.display='none';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetEmployeeGoalList",
                        type: 'POST',
                        data: JSON.stringify({
                            userId: localStorage.getItem("userId")
                        }),
                        dataType: 'json',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display='none';
                        },
                        success: function (data) {
                            console.log(data)
                            document.getElementById('loaderView').style.display='none';
                            document.getElementById('actionView').style.display='block';

                            if(data[0].length !=0){ 
                                for (var i = 0; i < data[0].length; i++) {
                                    if(data[0][i][3] == null){
                                        data[0][i][3] ='';
                                    }
                                    self.GoalDet.push({
                                        'no': i+1,
                                        'id': data[0][i][0],
                                        'name': data[0][i][1] + " "+ data[0][i][3] +" "+ data[0][i][2],
                                        'goal_count': data[0][i][4]
                                    });
                                }
                            }

                            var j = 0;
                            if(data[1].length !=0){ 
                               // self.GoalYearDet([]);
                                for (j = 0; j < data[1].length; j++) {
                                    self.GoalYearDet.push({"label":data[1][j][0],"value":data[1][j][0]});
                                }
                                self.GoalYearDet.unshift({ value: 'All', label: 'All' });
                            }
                        }
                    })
                }

                self.yearList = new ArrayDataProvider(this.GoalYearDet, { keyAttributes: "value"});
                self.dataProvider = new ArrayDataProvider(this.GoalDet, { keyAttributes: "id" });
               
                self.messageClose = ()=>{
                    location.reload();
                }

                self.viewGoal = (event,data)=>{
                    var clickedStaffId = data.item.data.id
                    console.log(clickedStaffId)
                    localStorage.setItem("staffId", clickedStaffId);
                    self.router.go({path:'employeeGoals'})
                }

                self.filter = ko.observable('');

                self.dataProvider = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filter() && this.filter() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filter() }
                        });
                    }
                    const arrayDataProvider = new ArrayDataProvider(self.GoalDet, { 
                        keyAttributes: 'id',
                        sortComparators: {
                            comparators: new Map().set("dob", this.comparator),
                        },
                    });
                    
                    return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
                }, self);

                self.handleValueTeams = () => {
                    self.filter(document.getElementById('filter').rawValue);
                };

                self.datePicker = {
                    numberOfMonths: 1
                };

                self.fromDate = ko.observable('')
                self.toDate = ko.observable('')

                self.showData = ()=>{
                    self.GoalDet([]);
                    document.getElementById('loaderView').style.display='block';
                    let fromDate = self.fromDate()
                    let toDate = self.toDate();
                    $.ajax({
                        url: BaseURL+"/HRModuleGetAllGoalListFilter",
                        type: 'POST',
                        data: JSON.stringify({
                            userId : localStorage.getItem("userId"),
                            fromDate : fromDate,
                            toDate : toDate
                        }),
                        dataType: 'json',
                        timeout: localStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            console.log(data)
                            document.getElementById('loaderView').style.display='none';

                            if(data[0].length !=0){ 
                                for (var i = 0; i < data[0].length; i++) {
                                    if(data[0][i][3] == null){
                                        data[0][i][3] ='';
                                    }
                                    self.GoalDet.push({
                                        'no': i+1,
                                        'id': data[0][i][0],
                                        'name': data[0][i][1] + " "+ data[0][i][3] +" "+ data[0][i][2],
                                        'goal_count': data[0][i][4]
                                    });
                                }
                            }
                        }
                    })
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
        return  EmployeeGoalsList;
    }
);