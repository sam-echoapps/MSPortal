define([ 'ojs/ojoffcanvas' , 'knockout', 'ojs/ojmodule-element-utils', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 
  'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', 
  'ojs/ojarraydataprovider', 'ojs/ojarraytreedataprovider','ojs/ojknockouttemplateutils', 'ojs/ojmodule-element','ojs/ojmodule-element-utils','ojs/ojknockout' ,'ojs/ojbutton',
  'ojs/ojdialog','ojs/ojselectsingle','ojs/ojdrawerpopup'],
function( OffcanvasUtils , ko , moduleUtils, ResponsiveUtils, ResponsiveKnockoutUtils, CoreRouter, ModuleRouterAdapter,
KnockoutRouterAdapter, UrlParamAdapter, ArrayDataProvider, ArrayTreeDataProvider,KnockoutTemplateUtils  ) {
function ControllerViewModel() {
 var self = this;

self.KnockoutTemplateUtils = KnockoutTemplateUtils;
self.CancelBehaviorOpt = ko.observable('icon');
self.footerLinks = ko.observableArray([]);
self.onepDepType = ko.observable();

let BaseURL = sessionStorage.getItem("BaseURL")

self.notificationCount = ko.observable(0);

self.getAllNotificationCount = function() {
   self.notificationCount(0); // Reset count initially
   $.ajax({
       url: BaseURL + "/HRModuleGetStaffAllNotificationCount",
       type: 'POST',
       data: JSON.stringify({
           userId: sessionStorage.getItem("userId"),
       }),
       dataType: 'json',
       timeout: sessionStorage.getItem("timeInetrval"),
       context: self,
       error: function(xhr, textStatus, errorThrown) {
           console.log("Error occurred: ", textStatus);
       },
       success: function(data) {
           var count = JSON.parse(data);
           console.log("Received count: ", count);

           var countElement = document.getElementById('count');
           if (countElement) {
               if (count > 0) {
                   countElement.style.display = 'block';
                   countElement.innerText = count; 
               } else {
                   countElement.style.display = 'none'; 
               }
           }
       }
   });
};

self.init = function() {
 self.getAllNotificationCount(); 
};

/*
self.getAllNotificationCount();     */
setInterval(function() {
 self.getAllNotificationCount();
 }, 3000);  

self.drawer = {
 displayMode: 'push',
 selector: '#drawer',
 content: '#main'
};

self.toggleDrawer = function () {
 return OffcanvasUtils.toggle(self.drawer);
};
self.endOpened = ko.observable(false);

self.endToggle = function () {
   if (!self.endOpened()) { // Only fetch notifications if the drawer is being opened
       self.getAllNotification();
   }
   self.endOpened(!self.endOpened());
};

self.closeMenu = function () {
 self.endOpened(false); 
 self.getAllNotificationCount();
 self.getAllNotificationCount();
};

// Notifications
self.NoticeDet = ko.observableArray([]);
self.NoticeList = ko.computed(function() {
const arrayDataProvider = new ArrayDataProvider(self.NoticeDet, {
keyAttributes: 'id'
});
return new oj.ListDataProviderView(arrayDataProvider);
});

self.getAllNotification = function() {
  const notificationList = document.getElementById('notificationList');
  notificationList.innerHTML = ''; 
  $.ajax({
      url: BaseURL + "/HRModuleGetStaffAllNotification",
      type: 'POST',
      data: JSON.stringify({
          userId: sessionStorage.getItem("userId"),
      }),
      dataType: 'json',
      timeout: sessionStorage.getItem("timeInetrval"),
      context: self,
      error: function (xhr, textStatus, errorThrown) {
          console.log(textStatus);
      },
      success: function (data) {
        data = JSON.parse(data[0]);
        //console.log(data);
        if (data.length !== 0) {
            for (var i = 0; i < data.length; i++) {
                var status = data[i][5]; 
    
                const noticeItem = document.createElement('li');
                noticeItem.classList.add('oj-list-item-layout'); 
                
                if (status === 'unread') {
                    noticeItem.classList.add('unread-notification');
                    
                    const redDot = document.createElement('span');
                    redDot.classList.add('red-dot');
                    noticeItem.appendChild(redDot); 
    
                    noticeItem.innerHTML += `
                        <div>
                            <div slot="overline" class="oj-typography-body-xs oj-text-color-secondary">
                                <strong>${data[i][1] || ' '}</strong> <!-- Bold part for unread -->
                            </div>
                            <div class="oj-typography-body-md">
                                <strong>${data[i][2]}</strong> <!-- Bold part for unread -->
                            </div>
                            <div slot="tertiary" class="oj-typography-body-xs">
                                ${data[i][3]}
                            </div>
                        </div>`;
                } else {
                    noticeItem.classList.add('read-notification'); 
                    noticeItem.innerHTML += `
                        <div>
                            <div slot="overline" class="oj-typography-body-xs oj-text-color-secondary">
                                ${data[i][1] || ' '}
                            </div>
                            <div class="oj-typography-body-md">
                                ${data[i][2]}
                            </div>
                            <div slot="tertiary" class="oj-typography-body-xs">
                                ${data[i][3]}
                            </div>
                        </div>`;
                }
                notificationList.appendChild(noticeItem);
    
                const hr = document.createElement('hr');
                hr.style.border = '1px solid #eee'; 
                hr.style.margin = '10px 0'; 
                notificationList.appendChild(hr);
            }
        }
    }
});
}; 

self.viewMore = function (event, data) {
 self.closeMenu(); 
 router.go({ path: 'notice' }); 
 //sessionStorage.clear();
 //self.getAllNotificationCount();
 //location.reload();
};

self.username = ko.observable();
self.userrole = ko.observable();
self.logineduser = ko.observable();


 self.manner = ko.observable('polite');
 self.message = ko.observable();
 document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);

 function announcementHandler(event) {
   setTimeout(function() {
     self.message(event.detail.message);
     self.manner(event.detail.manner);
   }, 200);
 };

// Media queries for repsonsive layouts
var smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
self.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

self.count = ko.observable(3);
this.selectedItem = ko.observable('dashboardAdmin');

if(sessionStorage.getItem('userRole')=='employee'){
 var navData = [
   { path:"" ,redirect : 'signin'},
   { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'} },
   { path: 'dashboardEmployee', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'leaves', detail : {label: 'Leaves',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'documentview', detail : {label :'Documents',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'myProfile', detail : {label :'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goals', detail : {label: 'My Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goalsView', detail : {label: 'My Goal',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'dashboardSeniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardIntern', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardExternal', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'taskView', detail : {label: 'Tasks View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'purchase', detail : {label: 'Purchase Manager',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'notice', detail : {label: 'Notice',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'purchaseClosure', detail : {label: 'Purchase Closure',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'assetView', detail : {label: 'Asset View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'assetAdd', detail : {label: 'Asset Add',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'assetAddView', detail : {label: 'Asset Add View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
];  
}
else if(sessionStorage.getItem('userRole')=='junior manager'){
 var navData = [
   { path:"" ,redirect : 'signin'},
   { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'} },
   { path: 'dashboardJuniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'leaves', detail : {label: 'Leaves',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'documentview', detail : {label :'Documents',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'editStaff', detail : {label :'Employees Profile',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goals', detail : {label: 'My Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goalsView', detail : {label: 'My Goal',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'dashboardSeniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardIntern', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardExternal', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'employees', detail : {label: 'Employees',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'editStaff', detail : {label: 'Edit Staff',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'myProfile', detail : {label :'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'taskView', detail : {label: 'Tasks View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'purchase', detail : {label: 'Purchase Manager',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'notice', detail : {label: 'Notice',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
];  
}
else if(sessionStorage.getItem('userRole')=='senior manager'){
 var navData = [
   { path: 'dashboardSeniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'employees', detail : {label: 'Employees',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path:"" ,redirect : 'signin'},
   { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'} },
   { path: 'editStaff', detail : {label: 'Edit Staff',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'addCompany', detail : {label :'Add Company',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'addHoliday', detail : {label :'Add Holiday',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'leaveSettings', detail : {label :'Leave Settings',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'myProfile', detail : {label :'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'employeeGoalsList', detail : {label: 'Employee Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'employeeGoals', detail : {label: 'Employee Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'editDocuments', detail : {label: 'Edit Documents',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'leaves', detail : {label: 'Leave',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goals', detail : {label: 'Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goalSettings', detail : {label: 'Goal Settings',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goalsView', detail : {label: 'My Goal',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'workingPatternView', detail : {label: 'Working Pattern',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'workingPattern', detail : {label: 'Working Pattern',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'dashboardSeniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardIntern', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardExternal', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardEmployee', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'tasks', detail : {label: 'Tasks',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'taskView', detail : {label: 'Tasks View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'taskReport', detail : {label: 'Tasks Report',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'leaveReport', detail : {label: 'Leave Report',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'purchase', detail : {label: 'Purchase Manager',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'poSettings', detail : {label: 'Purchase Order Settings',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'purchaseClosure', detail : {label: 'Purchase Closure',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'assetView', detail : {label: 'Asset View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'assetAdd', detail : {label: 'Asset Add',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'assetAddView', detail : {label: 'Asset Add View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
];  
}
else if(sessionStorage.getItem('userRole')=='senior hr'){
 var navData = [
   { path: 'dashboardSeniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'employees', detail : {label: 'Employees',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path:"" ,redirect : 'signin'},
   { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'} },
   { path: 'editStaff', detail : {label: 'Edit Staff',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'addCompany', detail : {label :'Add Company',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'addHoliday', detail : {label :'Add Holiday',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'leaveSettings', detail : {label :'Leave Settings',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'myProfile', detail : {label :'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'employeeGoalsList', detail : {label: 'Employee Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'employeeGoals', detail : {label: 'Employee Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'editDocuments', detail : {label: 'Edit Documents',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'leaves', detail : {label: 'Leave',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goals', detail : {label: 'Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goalSettings', detail : {label: 'Goal Settings',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goalsView', detail : {label: 'My Goal',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'workingPatternView', detail : {label: 'Working Pattern',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'workingPattern', detail : {label: 'Working Pattern',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'dashboardSeniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardIntern', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardExternal', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardEmployee', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'tasks', detail : {label: 'Tasks',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'taskView', detail : {label: 'Tasks View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'taskReport', detail : {label: 'Tasks Report',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'leaveReport', detail : {label: 'Leave Report',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'purchase', detail : {label: 'Purchase Manager',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'poSettings', detail : {label: 'Purchase Order Settings',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'purchaseClosure', detail : {label: 'Purchase Closure',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'assetView', detail : {label: 'Asset View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'assetAdd', detail : {label: 'Asset Add',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'assetAddView', detail : {label: 'Asset Add View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
];  
}
else if(sessionStorage.getItem('userRole')=='junior hr'){
 var navData = [
   { path: 'dashboardJuniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'employees', detail : {label: 'Employees',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path:"" ,redirect : 'signin'},
   { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'} },
   { path: 'editStaff', detail : {label: 'Edit Staff',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'myProfile', detail : {label :'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'editDocuments', detail : {label: 'View Documents',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'leaves', detail : {label: 'Leave',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goals', detail : {label: 'Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goalsView', detail : {label: 'My Goal',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'dashboardSeniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardIntern', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardExternal', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardEmployee', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'taskView', detail : {label: 'Tasks View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'purchase', detail : {label: 'Purchase Manager',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
];  
}
else if(sessionStorage.getItem('userRole')=='junior accounts'){
 var navData = [
   { path: 'dashboardJuniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'employees', detail : {label: 'Employees',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path:"" ,redirect : 'signin'},
   { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'} },
   { path: 'editStaff', detail : {label: 'Edit Staff',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'myProfile', detail : {label :'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'editDocuments', detail : {label: 'View Documents',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'leaves', detail : {label: 'Leave',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goals', detail : {label: 'Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goalsView', detail : {label: 'My Goal',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'dashboardSeniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardIntern', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardExternal', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardEmployee', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'taskView', detail : {label: 'Tasks View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'purchase', detail : {label: 'Purchase Manager',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
];  
}
else if(sessionStorage.getItem('userRole')=='senior accounts'){
 var navData = [
   { path: 'dashboardSeniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'employees', detail : {label: 'Employees',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path:"" ,redirect : 'signin'},
   { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'} },
   { path: 'editStaff', detail : {label: 'Edit Staff',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'addCompany', detail : {label :'Add Company',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'addHoliday', detail : {label :'Add Holiday',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'leaveSettings', detail : {label :'Leave Settings',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'myProfile', detail : {label :'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'employeeGoalsList', detail : {label: 'Employee Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'employeeGoals', detail : {label: 'Employee Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'editDocuments', detail : {label: 'Edit Documents',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'leaves', detail : {label: 'Leave',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goals', detail : {label: 'Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goalSettings', detail : {label: 'Goal Settings',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goalsView', detail : {label: 'My Goal',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'workingPatternView', detail : {label: 'Working Pattern',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'workingPattern', detail : {label: 'Working Pattern',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'dashboardJuniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardIntern', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardExternal', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardEmployee', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'tasks', detail : {label: 'Tasks',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'taskView', detail : {label: 'Tasks View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'taskReport', detail : {label: 'Tasks Report',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'leaveReport', detail : {label: 'Leave Report',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'purchase', detail : {label: 'Purchase Manager',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'poSettings', detail : {label: 'Purchase Order Settings',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'notice', detail : {label: 'Notice',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'purchaseClosure', detail : {label: 'Purchase Closure',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
];  
}
else if(sessionStorage.getItem('userRole')=='intern'){
 var navData = [
   { path: 'dashboardIntern', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path:"" ,redirect : 'signin'},
   { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'} },
   { path: 'leaves', detail : {label: 'Leaves',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'documentview', detail : {label :'Documents',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'myProfile', detail : {label :'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goals', detail : {label: 'My Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goalsView', detail : {label: 'My Goal',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'dashboardSeniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardExternal', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardEmployee', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'taskView', detail : {label: 'Tasks View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'purchase', detail : {label: 'Purchase Manager',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'notice', detail : {label: 'Notice',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
];  
}
else if(sessionStorage.getItem('userRole')=='external'){
 var navData = [
   { path:"" ,redirect : 'signin'},
   { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'} },
   { path: 'dashboardExternal', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'leaves', detail : {label: 'Leaves',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'documentview', detail : {label :'Documents',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'myProfile', detail : {label :'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goals', detail : {label: 'My Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goalsView', detail : {label: 'My Goal',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'dashboardSeniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardIntern', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardEmployee', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'taskView', detail : {label: 'Tasks View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'purchase', detail : {label: 'Purchase Manager',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'notice', detail : {label: 'Notice',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
];  
}
else{
 var navData = [
   { path: 'dashboardEmployee', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'employees', detail : {label: 'Employees',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path:"" ,redirect : 'signin'},
   { path: 'signin', detail : {label: 'SignIn',iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'} },
   { path: 'dashboardAdmin', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'editStaff', detail : {label: 'Edit Staff',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'myProfile', detail : {label :'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'addCompany', detail : {label :'Add Company',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'addHoliday', detail : {label :'Add Holiday',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'leaveSettings', detail : {label :'Leave Settings',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'myProfile', detail : {label :'My Profile',iconClass: 'oj-navigationlist-item-icon fa fa-id-card'} },
   { path: 'employeeGoalsList', detail : {label: 'Employee Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'employeeGoals', detail : {label: 'Employee Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'editDocuments', detail : {label: 'Edit Documents',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'leaves', detail : {label: 'Leave',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goals', detail : {label: 'Goals',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goalSettings', detail : {label: 'Goal Settings',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'goalsView', detail : {label: 'My Goal',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'workingPatternView', detail : {label: 'Working Pattern',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'workingPattern', detail : {label: 'Working Pattern',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'dashboardSeniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorManager', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardSeniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorHR', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardJuniorAccounts', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardIntern', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'dashboardExternal', detail : {label: 'Dashboard',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'tasks', detail : {label: 'Tasks',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'taskView', detail : {label: 'Tasks View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'taskReport', detail : {label: 'Tasks Report',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'leaveReport', detail : {label: 'Leave Report',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'purchase', detail : {label: 'Purchase Manager',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'notice', detail : {label: 'Notice',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'poSettings', detail : {label: 'Purchase Order Settings',iconClass: 'oj-navigationlist-item-icon fa fa-list-check'} },
   { path: 'purchaseClosure', detail : {label: 'Purchase Closure',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'asset', detail : {label: 'Asset Manager',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'assetView', detail : {label: 'Asset View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'assetAdd', detail : {label: 'Asset Add',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
   { path: 'assetAddView', detail : {label: 'Asset Add View',iconClass: 'oj-navigationlist-item-icon fa fa-home'} },
 ];
}

if (sessionStorage.getItem("userRole") == "employee") {
 self.navMenu = [
   {"name": "Dashboard","id": "dashboardEmployee","icons": "fa-solid fa fa-home", "path":"dashboardEmployee"},        
   {"name": "My Profile","id": "myProfile","icons": "fa-solid fa fa-user", "path":"myProfile"},
   {"name": "Documents","id": "publicHoliday","icons": "fa-solid fa fa-file", "path":"documentview"},
   {"name": "Leaves","id": "leaves","icons": "fa-solid fa fa-person-walking-arrow-right", "path":"leaves"},
   {"name": "Task Manager","id": "tasks","icons": "fa-solid fa fa-clipboard-list", "path":"taskView"},
   {"name": "Purchase Manager","id": "purchase","icons": "fa-solid fa fa-shopping-cart ", "path":"purchase"},
   {"name": "Notice Board","id": "notice","icons": "fa-solid fa fa-shopping-cart ", "path":"notice"},
   {"name": "Perfomance", "id": "performanceReview2", "icons": "fa-solid fa fa-chart-line", 
     "children": [
       {"name": "My Goals","id": "myGoals","icons": "fa-solid fa fa-bullseye", "path":"goals"},
     ]
   },
 ]       
}
else if (sessionStorage.getItem("userRole") == "junior manager") {
 self.navMenu = [
   {"name": "Dashboard","id": "dashboardJuniorManager","icons": "fa-solid fa fa-home", "path":"dashboardJuniorManager"},        
   {"name": "My Profile","id": "myProfile","icons": "fa-solid fa fa-user", "path":"myProfile"},
   {"name": "Employees","id": "employees","icons": "fa-solid fa fa-id-card", "path":"employees"},
   {"name": "Documents","id": "publicHoliday","icons": "fa-solid fa fa-file", "path":"documentview"},
   {"name": "Leaves","id": "leaves","icons": "fa-solid fa fa-person-walking-arrow-right", "path":"leaves"},
   {"name": "Task Manager","id": "tasks","icons": "fa-solid fa fa-clipboard-list", "path":"taskView"},
   {"name": "Purchase Manager","id": "purchase","icons": "fa-solid fa fa-shopping-cart ", "path":"purchase"},
   {"name": "Perfomance", "id": "performanceReview2", "icons": "fa-solid fa fa-chart-line", 
     "children": [
       {"name": "My Goals","id": "myGoals","icons": "fa-solid fa fa-bullseye", "path":"goals"},
     ]
   },
 ]       
}
else if (sessionStorage.getItem("userRole") == "senior manager") {
 self.navMenu = [
   {"name": "Dashboard","id": "dashboardSeniorManager","icons": "fa-solid fa fa-home", "path":"dashboardSeniorManager"},
   {"name": "My Profile","id": "myProfile","icons": "fa-solid fa fa-user", "path":"myProfile"},
   {"name": "Employees","id": "employees","icons": "fa-solid fa fa-id-card", "path":"employees"},
   {"name": "Leaves","id": "leaves","icons": "fa-solid fa fa-person-walking-arrow-right", "path":"leaves"},
   {"name": "Company Holiday","id": "addHoliday","icons": "fa-solid fa fa-calendar-alt", "path":"addHoliday"},
   {"name": "Perfomance Review", "id": "performanceReview", "icons": "fa-solid fa fa-chart-line", 
     "children": [
       {"name": "My Goals","id": "myGoals","icons": "fa-solid fa fa-bullseye", "path":"goals"},
       {"name": "Employee Goals List","id": "employeeGoalsList","icons": "fa-solid fa fa-list", "path":"employeeGoalsList"},
     ]
   },
   {"name": "Documents","id": "documentsView","icons": "fa-solid fa fa-file", "path":"editDocuments"},
   {"name": "Task Manager","id": "tasks","icons": "fa-solid fa fa-clipboard-list", "path":"tasks"},
   {"name": "Purchase Manager","id": "purchase","icons": "fa-solid fa fa-shopping-cart ", "path":"purchase"},
   {"name": "Settings", "id": "settings", "icons": "fa-solid fa fa-cogs", 
     "children": [
       {"name": "Company Settings","id": "addCompany","icons": "fa-solid fa fa-building", "path":"addCompany"},
       {"name": "Leave Settings","id": "leaveSettings","icons": "fa-solid fa fa-person-walking-arrow-right", "path":"leaveSettings"},
       {"name": "Goal Settings","id": "goalSettings","icons": "fa-solid fa fa-bullseye", "path":"goalSettings"},
       {"name": "Purchase Order Settings","id": "poSettings","icons": "fa-solid fa fa-shopping-cart", "path":"poSettings"},
       {"name": "Working Pattern","id": "workingPattern","icons": "fa-solid fa fa-briefcase", "path":"workingPattern"},
     ]
   },
 ]      
}
else if (sessionStorage.getItem("userRole") == "senior hr") {
 self.navMenu = [
   {"name": "Dashboard","id": "dashboardSeniorHR","icons": "fa-solid fa fa-home", "path":"dashboardSeniorHR"},        
   {"name": "My Profile","id": "myProfile","icons": "fa-solid fa fa-user", "path":"myProfile"},
   {"name": "Employees","id": "employees","icons": "fa-solid fa fa-id-card", "path":"employees"},
   {"name": "Leaves","id": "leaves","icons": "fa-solid fa fa-person-walking-arrow-right", "path":"leaves"},
   {"name": "Company Holiday","id": "addHoliday","icons": "fa-solid fa fa-calendar-alt", "path":"addHoliday"},
   {"name": "Perfomance Review", "id": "performanceReview", "icons": "fa-solid fa fa-chart-line", 
     "children": [
       {"name": "My Goals","id": "myGoals","icons": "fa-solid fa fa-bullseye", "path":"goals"},
       {"name": "Employee Goals List","id": "employeeGoalsList","icons": "fa-solid fa fa-list", "path":"employeeGoalsList"},
     ]
   },
   {"name": "Documents","id": "documentsView","icons": "fa-solid fa fa-file", "path":"editDocuments"},
   {"name": "Task Manager","id": "tasks","icons": "fa-solid fa fa-clipboard-list", "path":"tasks"},
   {"name": "Purchase Manager","id": "purchase","icons": "fa-solid fa fa-shopping-cart ", "path":"purchase"},
   {"name": "Settings", "id": "settings", "icons": "fa-solid fa fa-cogs", 
     "children": [
       {"name": "Company Settings","id": "addCompany","icons": "fa-solid fa fa-building", "path":"addCompany"},
       {"name": "Leave Settings","id": "leaveSettings","icons": "fa-solid fa fa-person-walking-arrow-right", "path":"leaveSettings"},
       {"name": "Goal Settings","id": "goalSettings","icons": "fa-solid fa fa-bullseye", "path":"goalSettings"},
       {"name": "Purchase Order Settings","id": "poSettings","icons": "fa-solid fa fa-shopping-cart", "path":"poSettings"},
       {"name": "Working Pattern","id": "workingPattern","icons": "fa-solid fa fa-briefcase", "path":"workingPattern"},
     ]
   },
 ]      
}
else if (sessionStorage.getItem("userRole") == "junior hr") {
 self.navMenu = [
   {"name": "Dashboard","id": "dashboardJuniorHR","icons": "fa-solid fa fa-home", "path":"dashboardJuniorHR"},
   {"name": "My Profile","id": "myProfile","icons": "fa-solid fa fa-user", "path":"myProfile"},
   {"name": "Employees","id": "employees","icons": "fa-solid fa fa-id-card", "path":"employees"},
   {"name": "Leaves","id": "leaves","icons": "fa-solid fa fa-person-walking-arrow-right", "path":"leaves"},
   {"name": "Task Manager","id": "tasks","icons": "fa-solid fa fa-clipboard-list", "path":"taskView"},
   {"name": "Purchase Manager","id": "purchase","icons": "fa-solid fa fa-shopping-cart ", "path":"purchase"},
   {"name": "Perfomance Review", "id": "performanceReview", "icons": "fa-solid fa fa-chart-line", 
     "children": [
       {"name": "My Goals","id": "myGoals","icons": "fa-solid fa fa-bullseye", "path":"goals"},
     ]
   },
   {"name": "Documents","id": "documentsView","icons": "fa-solid fa fa-file", "path":"editDocuments"},
 ]        
}
else if (sessionStorage.getItem("userRole") == "junior accounts") {
 self.navMenu = [
   {"name": "Dashboard","id": "dashboardJuniorAccounts","icons": "fa-solid fa fa-home", "path":"dashboardJuniorAccounts"},        
   {"name": "My Profile","id": "myProfile","icons": "fa-solid fa fa-user", "path":"myProfile"},
   {"name": "Employees","id": "employees","icons": "fa-solid fa fa-id-card", "path":"employees"},
   {"name": "Leaves","id": "leaves","icons": "fa-solid fa fa-person-walking-arrow-right", "path":"leaves"},
   {"name": "Task Manager","id": "tasks","icons": "fa-solid fa fa-clipboard-list", "path":"taskView"},
   {"name": "Purchase Manager","id": "purchase","icons": "fa-solid fa fa-shopping-cart ", "path":"purchase"},
   {"name": "Perfomance Review", "id": "performanceReview", "icons": "fa-solid fa fa-chart-line", 
     "children": [
       {"name": "My Goals","id": "myGoals","icons": "fa-solid fa fa-bullseye", "path":"goals"},
     ]
   },
   {"name": "Documents","id": "documentsView","icons": "fa-solid fa fa-file", "path":"editDocuments"},
 ]     
}
else if (sessionStorage.getItem("userRole") == "senior accounts") {
 self.navMenu = [
   {"name": "Dashboard","id": "dashboardSeniorAccounts","icons": "fa-solid fa fa-home", "path":"dashboardSeniorAccounts"},        
   {"name": "My Profile","id": "myProfile","icons": "fa-solid fa fa-user", "path":"myProfile"},
   {"name": "Employees","id": "employees","icons": "fa-solid fa fa-id-card", "path":"employees"},
   {"name": "Leaves","id": "leaves","icons": "fa-solid fa fa-person-walking-arrow-right", "path":"leaves"},
   {"name": "Company Holiday","id": "addHoliday","icons": "fa-solid fa fa-calendar-alt", "path":"addHoliday"},
   {"name": "Perfomance Review", "id": "performanceReview", "icons": "fa-solid fa fa-chart-line", 
     "children": [
       {"name": "My Goals","id": "myGoals","icons": "fa-solid fa fa-bullseye", "path":"goals"},
       {"name": "Employee Goals List","id": "employeeGoalsList","icons": "fa-solid fa fa-list", "path":"employeeGoalsList"},
     ]
   },
   {"name": "Documents","id": "documentsView","icons": "fa-solid fa fa-file", "path":"editDocuments"},
   {"name": "Task Manager","id": "tasks","icons": "fa-solid fa fa-clipboard-list", "path":"tasks"},
   {"name": "Purchase Manager","id": "purchase","icons": "fa-solid fa fa-shopping-cart ", "path":"purchase"},
   {"name": "Notice","id": "notice","icons": "fa-solid fa fa-shopping-cart ", "path":"notice"},
   {"name": "Settings", "id": "settings", "icons": "fa-solid fa fa-cogs", 
     "children": [
       {"name": "Company Settings","id": "addCompany","icons": "fa-solid fa fa-building", "path":"addCompany"},
       {"name": "Leave Settings","id": "leaveSettings","icons": "fa-solid fa fa-person-walking-arrow-right", "path":"leaveSettings"},
       {"name": "Goal Settings","id": "goalSettings","icons": "fa-solid fa fa-bullseye", "path":"goalSettings"},
       {"name": "Purchase Order Settings","id": "poSettings","icons": "fa-solid fa fa-shopping-cart", "path":"poSettings"},
       {"name": "Working Pattern","id": "workingPattern","icons": "fa-solid fa fa-briefcase", "path":"workingPattern"},
     ]
   },
 ]       
}
else if (sessionStorage.getItem("userRole") == "intern") {
 self.navMenu = [
   {"name": "Dashboard","id": "dashboardIntern","icons": "fa-solid fa fa-home", "path":"dashboardIntern"},        
   {"name": "My Profile","id": "myProfile","icons": "fa-solid fa fa-user", "path":"myProfile"},
   {"name": "Documents","id": "publicHoliday","icons": "fa-solid fa fa-file", "path":"documentview"},
   {"name": "Leaves","id": "leaves","icons": "fa-solid fa fa-person-walking-arrow-right", "path":"leaves"},
   {"name": "Task Manager","id": "tasks","icons": "fa-solid fa fa-clipboard-list", "path":"taskView"},
   {"name": "Purchase Manager","id": "purchase","icons": "fa-solid fa fa-shopping-cart ", "path":"purchase"},
   {"name": "Notice","id": "notice","icons": "fa-solid fa fa-shopping-cart ", "path":"notice"},
   {"name": "Perfomance", "id": "performanceReview2", "icons": "fa-solid fa fa-chart-line", 
     "children": [
       {"name": "My Goals","id": "myGoals","icons": "fa-solid fa fa-bullseye", "path":"goals"},
     ]
   },
 ]      
}
else if (sessionStorage.getItem("userRole") == "external") {
 self.navMenu = [
   {"name": "Dashboard","id": "dashboardExternal","icons": "fa-solid fa fa-home", "path":"dashboardExternal"},        
   {"name": "My Profile","id": "myProfile","icons": "fa-solid fa fa-user", "path":"myProfile"},
   {"name": "Documents","id": "publicHoliday","icons": "fa-solid fa fa-file", "path":"documentview"},
   {"name": "Leaves","id": "leaves","icons": "fa-solid fa fa-person-walking-arrow-right", "path":"leaves"},
   {"name": "Task Manager","id": "tasks","icons": "fa-solid fa fa-clipboard-list", "path":"taskView"},
   {"name": "Purchase Manager","id": "purchase","icons": "fa-solid fa fa-shopping-cart ", "path":"purchase"},
   {"name": "Notice","id": "notice","icons": "fa-solid fa fa-shopping-cart ", "path":"notice"},
   {"name": "Perfomance", "id": "performanceReview2", "icons": "fa-solid fa fa-chart-line", 
     "children": [
       {"name": "My Goals","id": "myGoals","icons": "fa-solid fa fa-bullseye", "path":"goals"},
     ]
   },
 ]       
}
else {
 self.navMenu = [
   {"name": "Dashboard","id": "dashboardAdmin","icons": "fa-solid fa fa-home", "path":"dashboardAdmin"},
   {"name": "My Profile","id": "myProfile","icons": "fa-solid fa fa-user", "path":"myProfile"},
   {"name": "Employees","id": "employees","icons": "fa-solid fa fa-id-card", "path":"employees"},
   {"name": "Leaves","id": "leaves","icons": "fa-solid fa fa-person-walking-arrow-right", "path":"leaves"},
   {"name": "Company Holiday","id": "addHoliday","icons": "fa-solid fa fa-calendar-alt", "path":"addHoliday"},
   {"name": "Perfomance Review", "id": "performanceReview", "icons": "fa-solid fa fa-chart-line", 
     "children": [
       {"name": "My Goals","id": "myGoals","icons": "fa-solid fa fa-bullseye", "path":"goals"},
       {"name": "Employee Goals List","id": "employeeGoalsList","icons": "fa-solid fa fa-list", "path":"employeeGoalsList"},
     ]
   },
   {"name": "Documents","id": "documentsView","icons": "fa-solid fa fa-file", "path":"editDocuments"},
   {"name": "Task Manager","id": "tasks","icons": "fa-solid fa fa-clipboard-list", "path":"tasks"},
   {"name": "Purchase Manager","id": "purchase","icons": "fa-solid fa fa-shopping-cart ", "path":"purchase"},
   {"name": "Asset Manager","id": "asset","icons": "fa-solid fa fa-money-check", "path":"asset"},
   {"name": "Notice Board","id": "notice","icons": "fa-solid fa fa-bullhorn ", "path":"notice"},
   {"name": "Settings", "id": "settings", "icons": "fa-solid fa fa-cogs", 
     "children": [
       {"name": "Company Settings","id": "addCompany","icons": "fa-solid fa fa-building", "path":"addCompany"},
       {"name": "Leave Settings","id": "leaveSettings","icons": "fa-solid fa fa-person-walking-arrow-right", "path":"leaveSettings"},
       {"name": "Goal Settings","id": "goalSettings","icons": "fa-solid fa fa-bullseye", "path":"goalSettings"},
       {"name": "Purchase Order Settings","id": "poSettings","icons": "fa-solid fa fa-shopping-cart", "path":"poSettings"},
       {"name": "Working Pattern","id": "workingPattern","icons": "fa-solid fa fa-briefcase", "path":"workingPattern"},
     ]
   },
 ]
}
self.dataProvider = new ArrayTreeDataProvider(self.navMenu, {
 keyAttributes: 'id'
});
self.goToPage = (e)=>{
 if(e.currentTarget.id!=""){
   router.go({path : e.currentTarget.id});
 }
}
// Router setup

let router = new CoreRouter(navData, {
 urlAdapter: new UrlParamAdapter()
});
router.sync();

self.moduleAdapter = new ModuleRouterAdapter(router);

self.selection = new KnockoutRouterAdapter(router);

self.appName = ko.observable();

// User Info used in Global Navigation area

// Footer
function footerLink(name, id, linkTarget) {
 this.name = name;
 this.linkId = id;
 this.linkTarget = linkTarget;
}

self.footerLinksDP = new ArrayDataProvider(self.footerLinks,{keyAttributes: 'name'});

self.SignIn = ko.observable('N');

self.goToSignIn = function() {
router.go({path : 'signin'});
self.SignIn('N');
location.reload()
};

ControllerViewModel.prototype.signIn = function() {
if (!self.localFlow) {
 self.goToSignIn();
 return;
}
}

ControllerViewModel.prototype.onAppSuccess = function() {
self.username(sessionStorage.getItem("userName"));
self.userrole(sessionStorage.getItem("userRole"));
self.logineduser(sessionStorage.getItem("loginedUser"));
self.SignIn('Y');
};

ControllerViewModel.prototype.onLoginSuccess = function() {
if(sessionStorage.getItem("userRole")=="employee"){
 
 router.go({path : 'dashboardEmployee'});

}
else if(sessionStorage.getItem("userRole")=="junior manager"){
 
 router.go({path : 'dashboardJuniorManager'});

}
else if(sessionStorage.getItem("userRole")=="senior manager"){
 
 router.go({path : 'dashboardSeniorManager'});

}
else if(sessionStorage.getItem("userRole")=="senior hr"){
 
 router.go({path : 'dashboardSeniorHR'});

}
else if(sessionStorage.getItem("userRole")=="junior hr"){
 
 router.go({path : 'dashboardJuniorHR'});

}
else if(sessionStorage.getItem("userRole")=="junior accounts"){
 
 router.go({path : 'dashboardJuniorAccounts'});

}
else if(sessionStorage.getItem("userRole")=="senior accounts"){
 
 router.go({path : 'dashboardSeniorAccounts'});

}
else if(sessionStorage.getItem("userRole")=="intern"){
 
 router.go({path : 'dashboardIntern'});

}
else if(sessionStorage.getItem("userRole")=="external"){
 
 router.go({path : 'dashboardExternal'});

}
else{
 router.go({path : 'dashboardAdmin'});
}
// self.SignIn('Y');
};

self.selectedMenuItem = ko.observable('');

self.menuItemAction = function (event,vm) {
self.selectedMenuItem(event.target.value);
 //User menu Options
if (self.selectedMenuItem() == 'out')
{
 console.log(self.selectedMenuItem())
 self.username('');
 self.logineduser('');

 sessionStorage.clear();
event.preventDefault();
self.goToSignIn();
}else if (self.selectedMenuItem() == 'editStaff'){
 router.go({path : 'editStaff'});
}else if (self.selectedMenuItem() == 'myProfile'){
 router.go({path : 'myProfile'});
}
else if (self.selectedMenuItem() == 'help'){
 document.querySelector('#helpDialog').open();
}
}


}

return new ControllerViewModel();
}
);
