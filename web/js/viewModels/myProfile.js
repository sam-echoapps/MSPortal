define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider", 
    "ojs/ojlistdataproviderview", "ojs/ojdataprovider", "ojs/ojfilepickerutils","ojs/ojconverterutils-i18n",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojselectcombobox","ojs/ojavatar","ojs/ojradioset","ojs/ojtable","ojs/ojaccordion"], 
    function (oj,ko,$, app, ArrayDataProvider, ListDataProviderView, ojdataprovider_1, FilePickerUtils,ojconverterutils_i18n_1) {

        class editStaff {
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
                        self.getRoles();
                        self.getReportTo();

                        setTimeout(() => {
                            self.getStaff();
                        }, 1000);
                        
                        self.getLeaves();
                        self.getWorkPattern();
                        self.getRoleForLineManager();

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
                
                self.firstName = ko.observable();
                self.middleName = ko.observable();
                self.lastName = ko.observable();
                self.birth_day = ko.observable();
                self.gender = ko.observable();
                self.roles = ko.observable();
                self.RolesDet = ko.observableArray([]);
                self.phone = ko.observable();
                self.email = ko.observable();
                self.qualification = ko.observable();
                self.qualificationList = ko.observableArray([]);
                self.qualificationList.push(
                    {"label":"Doctorate/Ph.D.","value":"Doctorate/Ph.D."},
                    {"label":"Master's Degree","value":"Master's Degree"},
                    {"label":"Bachelor's Degree","value":"Bachelor's Degree"},
                    {"label":"High School Diploma","value":"High School Diploma"},
                    {"label":"Other","value":"Other"}
                );
                self.qualificationList = new ArrayDataProvider(self.qualificationList, {
                    keyAttributes: 'value'
                }); 
                
                self.employee_type = ko.observable();
                self.employee_type_List = ko.observableArray([]);
                self.employee_type_List.push(
                    {"label":"Full Time","value":"Full Time"},
                    {"label":"Part Time","value":"Part Time"},
                    {"label":"Contract","value":"Contract"},
                    {"label":"Intern","value":"Intern"},
                    {"label":"Other","value":"Other"}
                );
                self.employee_type_List = new ArrayDataProvider(self.employee_type_List, {
                    keyAttributes: 'value'
                });

                self.termination_date = ko.observable('');
                self.designation = ko.observable();
                self.profilePhoto = ko.observable('');
                self.profilePhotoShow = ko.observable('');
                self.fileContent = ko.observable('');
                self.phoneError = ko.observable('');
                self.emailError = ko.observable('');
                self.address = ko.observable('');
                self.responsibilities = ko.observable('');
                self.typeError = ko.observable('');
                self.file = ko.observable('');
                self.secondaryText = ko.observable('Please Upload(Optional)');
                self.username = ko.observable();
                self.password = ko.observable();
                self.countryCode = ko.observable();
                self.countryCodes = ko.observableArray([]);
                self.countryCodes.push(
                    {"label":"Afghanistan(+93)","value":"+93"},
                    {"label":"Albania(+355)","value":"+355"},
                    {"label":"Algeria(+213)","value":"+213"},
                    {"label":"American Samoa(+1684)","value":"+1684"},
                    {"label":"Andorra(+376)","value":"+376"},
                    {"label":"Angola(+244)","value":"+244"},
                    {"label":"Anguilla(+1264)","value":"+1264"},
                    {"label":"Antarctica(+672)","value":"+672"},
                    {"label":"Antigua and Barbuda(+1268)","value":"+1268"},
                    {"label":"Argentina(+54)","value":"+54"},
                    {"label":"Armenia(+374)","value":"+374"},
                    {"label":"Aruba(+297)","value":"+297"},
                    {"label":"Australia(+61)","value":"+61"},
                    {"label":"Austria(+43)","value":"+43"},
                    {"label":"Azerbaijan(+994)","value":"+994"},
                    {"label":"Bahamas(+1242)","value":"+1242"},
                    {"label":"Bahrain(+973)","value":"+973"},
                    {"label":"Bangladesh(+880)","value":"+880"},
                    {"label":"Barbados(+1246)","value":"+1246"},
                    {"label":"Belarus(+375)","value":"+375"},
                    {"label":"Belgium(+32)","value":"+32"},
                    {"label":"Belize(+501)","value":"+501"},
                    {"label":"Benin(+229)","value":"+229"},
                    {"label":"Bermuda(+1441)","value":"+1441"},
                    {"label":"Bhutan(+975)","value":"+975"},
                    {"label":"Bolivia(+591)","value":"+591"},
                    {"label":"Bosnia and Herzegovina(+387)","value":"+387"},
                    {"label":"Botswana(+267)","value":"+267"},
                    {"label":"Brazil(+55)","value":"+55"},
                    {"label":"British Indian Ocean Territory(+246)","value":"+246"},
                    {"label":"British Virgin Islands(+1284)","value":"+1284"},
                    {"label":"Brunei(+673)","value":"+673"},
                    {"label":"Bulgaria(+359)","value":"+359"},
                    {"label":"Burkina Faso(+226)","value":"+226"},
                    {"label":"Burundi(+257)","value":"+257"},
                    {"label":"Cambodia(+855)","value":"+855"},
                    {"label":"Cameroon(+237)","value":"+237"},
                    {"label":"Canada(+1)","value":"+1"},
                    {"label":"Cape Verde(+238)","value":"+238"},
                    {"label":"Cayman Islands(+1345)","value":"+1345"},
                    {"label":"Central African Republic(+236)","value":"+236"},
                    {"label":"Chad(+235)","value":"+235"},
                    {"label":"Chile(+56)","value":"+56"},
                    {"label":"China(+86)","value":"+86"},
                    {"label":"Christmas Island(+61)","value":"+61"},
                    {"label":"Cocos Islands(+61)","value":"+61"},
                    {"label":"Colombia(+57)","value":"+57"},
                    {"label":"Comoros(+269)","value":"+269"},
                    {"label":"Cook Islands(+682)","value":"+682"},
                    {"label":"Costa Rica(+506)","value":"+506"},
                    {"label":"Croatia(+385)","value":"+385"},
                    {"label":"Cuba(+53)","value":"+53"},
                    {"label":"Curacao(+599)","value":"+599"},
                    {"label":"Cyprus(+357)","value":"+357"},
                    {"label":"Czech Republic(+420)","value":"+420"},
                    {"label":"Democratic Republic of the Congo(+243)","value":"+243"},
                    {"label":"Denmark(+45)","value":"+45"},
                    {"label":"Djibouti(+253)","value":"+253"},
                    {"label":"Dominica(+1767)","value":"+1767"},
                    {"label":"Dominican Republic(+1809)","value":"+1809"},
                    {"label":"East Timor(+670)","value":"+670"},
                    {"label":"Ecuador(+593)","value":"+593"},
                    {"label":"Egypt(+20)","value":"+20"},
                    {"label":"El Salvador(+503)","value":"+503"},
                    {"label":"Equatorial Guinea(+240)","value":"+240"},
                    {"label":"Eritrea(+291)","value":"+291"},
                    {"label":"Estonia(+372)","value":"+372"},
                    {"label":"Ethiopia(+251)","value":"+251"},
                    {"label":"Falkland Islands(+500)","value":"+500"},
                    {"label":"Faroe Islands(+298)","value":"+298"},
                    {"label":"Fiji(+679)","value":"+679"},
                    {"label":"Finland(+358)","value":"+358"},
                    {"label":"France(+33)","value":"+33"},
                    {"label":"French Polynesia(+689)","value":"+689"},
                    {"label":"Gabon(+241)","value":"+241"},
                    {"label":"Gambia(+220)","value":"+220"},
                    {"label":"Georgia(+995)","value":"+995"},
                    {"label":"Germany(+49)","value":"+49"},
                    {"label":"Ghana(+233)","value":"+233"},
                    {"label":"Gibraltar(+350)","value":"+350"},
                    {"label":"Greece(+30)","value":"+30"},
                    {"label":"Greenland(+299)","value":"+299"},
                    {"label":"Grenada(+1473)","value":"+1473"},
                    {"label":"Guam(+1671)","value":"+1671"},
                    {"label":"Guatemala(+502)","value":"+502"},
                    {"label":"Guernsey(+441481)","value":"+441481"},
                    {"label":"Guinea(+224)","value":"+224"},
                    {"label":"Guinea-Bissau(+245)","value":"+245"},
                    {"label":"Guyana(+592)","value":"+592"},
                    {"label":"Haiti(+509)","value":"+509"},
                    {"label":"Honduras(+504)","value":"+504"},
                    {"label":"Hong Kong(+852)","value":"+852"},
                    {"label":"Hungary(+36)","value":"+36"},
                    {"label":"Iceland(+354)","value":"+354"},
                    {"label":"India(+91)","value":"+91"},
                    {"label":"Indonesia(+62)","value":"+62"},
                    {"label":"Iran(+98)","value":"+98"},
                    {"label":"Iraq(+964)","value":"+964"},
                    {"label":"Ireland(+353)","value":"+353"},
                    {"label":"Isle of Man(+441624)","value":"+441624"},
                    {"label":"Israel(+972)","value":"+972"},
                    {"label":"Italy(+39)","value":"+39"},
                    {"label":"Ivory Coast(+225)","value":"+225"},
                    {"label":"Jamaica(+1876)","value":"+1876"},
                    {"label":"Japan(+81)","value":"+81"},
                    {"label":"Jersey(+441534)","value":"+441534"},
                    {"label":"Jordan(+962)","value":"+962"},
                    {"label":"Kazakhstan(+7)","value":"+7"},
                    {"label":"Kenya(+254)","value":"+254"},
                    {"label":"Kiribati(+686)","value":"+686"},
                    {"label":"Kosovo(+383)","value":"+383"},
                    {"label":"Kuwait(+965)","value":"+965"},
                    {"label":"Kyrgyzstan(+996)","value":"+996"},
                    {"label":"Laos(+856)","value":"+856"},
                    {"label":"Latvia(+371)","value":"+371"},
                    {"label":"Lebanon(+961)","value":"+961"},
                    {"label":"Lesotho(+266)","value":"+266"},
                    {"label":"Liberia(+231)","value":"+231"},
                    {"label":"Libya(+218)","value":"+218"},
                    {"label":"Liechtenstein(+423)","value":"+423"},
                    {"label":"Lithuania(+370)","value":"+370"},
                    {"label":"Luxembourg(+352)","value":"+352"},
                    {"label":"Macao(+853)","value":"+853"},
                    {"label":"Macedonia(+389)","value":"+389"},
                    {"label":"Madagascar(+261)","value":"+261"},
                    {"label":"Malawi(+265)","value":"+265"},
                    {"label":"Malaysia(+60)","value":"+60"},
                    {"label":"Maldives(+960)","value":"+960"},
                    {"label":"Mali(+223)","value":"+223"},
                    {"label":"Malta(+356)","value":"+356"},
                    {"label":"Marshall Islands(+692)","value":"+692"},
                    {"label":"Mauritania(+222)","value":"+222"},
                    {"label":"Mauritius(+230)","value":"+230"},
                    {"label":"Mayotte(+262)","value":"+262"},
                    {"label":"Mexico(+52)","value":"+52"},
                    {"label":"Micronesia(+691)","value":"+691"},
                    {"label":"Moldova(+373)","value":"+373"},
                    {"label":"Monaco(+377)","value":"+377"},
                    {"label":"Mongolia(+976)","value":"+976"},
                    {"label":"Montenegro(+382)","value":"+382"},
                    {"label":"Montserrat(+1664)","value":"+1664"},
                    {"label":"Morocco(+212)","value":"+212"},
                    {"label":"Mozambique(+258)","value":"+258"},
                    {"label":"Myanmar(+95)","value":"+95"},
                    {"label":"Namibia(+264)","value":"+264"},
                    {"label":"Nauru(+674)","value":"+674"},
                    {"label":"Nepal(+977)","value":"+977"},
                    {"label":"Netherlands(+31)","value":"+31"},
                    {"label":"Netherlands Antilles(+599)","value":"+599"},
                    {"label":"New Caledonia(+687)","value":"+687"},
                    {"label":"New Zealand(+64)","value":"+64"},
                    {"label":"Nicaragua(+505)","value":"+505"},
                    {"label":"Niger(+227)","value":"+227"},
                    {"label":"Nigeria(+234)","value":"+234"},
                    {"label":"Niue(+683)","value":"+683"},
                    {"label":"North Korea(+850)","value":"+850"},
                    {"label":"Northern Mariana Islands(+1670)","value":"+1670"},
                    {"label":"Norway(+47)","value":"+47"},
                    {"label":"Oman(+968)","value":"+968"},
                    {"label":"Pakistan(+92)","value":"+92"},
                    {"label":"Palau(+680)","value":"+680"},
                    {"label":"Palestine(+970)","value":"+970"},
                    {"label":"Panama(+507)","value":"+507"},
                    {"label":"Papua New Guinea(+675)","value":"+675"},
                    {"label":"Paraguay(+595)","value":"+595"},
                    {"label":"Peru(+51)","value":"+51"},
                    {"label":"Philippines(+63)","value":"+63"},
                    {"label":"Pitcairn(+64)","value":"+64"},
                    {"label":"Poland(+48)","value":"+48"},
                    {"label":"Portugal(+351)","value":"+351"},
                    {"label":"Puerto Rico(+1787)","value":"+1787"},
                    {"label":"Qatar(+974)","value":"+974"},
                    {"label":"Republic of the Congo(+242)","value":"+242"},
                    {"label":"Reunion(+262)","value":"+262"},
                    {"label":"Romania(+40)","value":"+40"},
                    {"label":"Russia(+7)","value":"+7"},
                    {"label":"Rwanda(+250)","value":"+250"},
                    {"label":"Saint Barthelemy(+590)","value":"+590"},
                    {"label":"Saint Helena(+290)","value":"+290"},
                    {"label":"Saint Kitts and Nevis(+1869)","value":"+1869"},
                    {"label":"Saint Lucia(+1758)","value":"+1758"},
                    {"label":"Saint Martin(+590)","value":"+590"},
                    {"label":"Saint Pierre and Miquelon(+508)","value":"+508"},
                    {"label":"Saint Vincent and the Grenadines(+1784)","value":"+1784"},
                    {"label":"Samoa(+685)","value":"+685"},
                    {"label":"San Marino(+378)","value":"+378"},
                    {"label":"Sao Tome and Principe(+239)","value":"+239"},
                    {"label":"Saudi Arabia(+966)","value":"+966"},
                    {"label":"Senegal(+221)","value":"+221"},
                    {"label":"Serbia(+381)","value":"+381"},
                    {"label":"Seychelles(+248)","value":"+248"},
                    {"label":"Sierra Leone(+232)","value":"+232"},
                    {"label":"Singapore(+65)","value":"+65"},
                    {"label":"Sint Maarten(+1721)","value":"+1721"},
                    {"label":"Slovakia(+421)","value":"+421"},
                    {"label":"Slovenia(+386)","value":"+386"},
                    {"label":"Solomon Islands(+677)","value":"+677"},
                    {"label":"Somalia(+252)","value":"+252"},
                    {"label":"South Africa(+27)","value":"+27"},
                    {"label":"South Korea(+82)","value":"+82"},
                    {"label":"South Sudan(+211)","value":"+211"},
                    {"label":"Spain(+34)","value":"+34"},
                    {"label":"Sri Lanka(+94)","value":"+94"},
                    {"label":"Sudan(+249)","value":"+249"},
                    {"label":"Suriname(+597)","value":"+597"},
                    {"label":"Svalbard and Jan Mayen(+47)","value":"+47"},
                    {"label":"Swaziland(+268)","value":"+268"},
                    {"label":"Sweden(+46)","value":"+46"},
                    {"label":"Switzerland(+41)","value":"+41"},
                    {"label":"Syria(+963)","value":"+963"},
                    {"label":"Taiwan(+886)","value":"+886"},
                    {"label":"Tajikistan(+992)","value":"+992"},
                    {"label":"Tanzania(+255)","value":"+255"},
                    {"label":"Thailand(+66)","value":"+66"},
                    {"label":"Togo(+228)","value":"+228"},
                    {"label":"Tokelau(+690)","value":"+690"},
                    {"label":"Tonga(+676)","value":"+676"},
                    {"label":"Trinidad and Tobago(+1868)","value":"+1868"},
                    {"label":"Tunisia(+216)","value":"+216"},
                    {"label":"Turkey(+90)","value":"+90"},
                    {"label":"Turkmenistan(+993)","value":"+993"},
                    {"label":"Turks and Caicos Islands(+1649)","value":"+1649"},
                    {"label":"Tuvalu(+688)","value":"+688"},
                    {"label":"U.S. Virgin Islands(+1340)","value":"+1340"},
                    {"label":"Uganda(+256)","value":"+256"},
                    {"label":"Ukraine(+380)","value":"+380"},
                    {"label":"United Arab Emirates(+971)","value":"+971"},
                    {"label":"United Kingdom(+44)","value":"+44"},
                    {"label":"United States(+1)","value":"+1"},
                    {"label":"Uruguay(+598)","value":"+598"},
                    {"label":"Uzbekistan(+998)","value":"+998"},
                    {"label":"Vanuatu(+678)","value":"+678"},
                    {"label":"Vatican(+379)","value":"+379"},
                    {"label":"Venezuela(+58)","value":"+58"},
                    {"label":"Vietnam(+84)","value":"+84"},
                    {"label":"Wallis and Futuna(+681)","value":"+681"},
                    {"label":"Western Sahara(+212)","value":"+212"},
                    {"label":"Yemen(+967)","value":"+967"},
                    {"label":"Zambia(+260)","value":"+260"},
                    {"label":"Zimbabwe(+263)","value":"+263"}
                );
                self.countryCodes = new ArrayDataProvider(self.countryCodes, {
                    keyAttributes: 'value'
                });
                self.joining_date = ko.observable();
                self.department = ko.observable();
                self.emergency_contact_person = ko.observable('');
                self.emergency_contact_relation = ko.observable('');
                self.relationList = ko.observableArray([]);
                self.relationList.push(
                    {"label":"Spouse","value":"Spouse"},
                    {"label":"Parent","value":"Parent"},
                    {"label":"Child","value":"Child"},
                    {"label":"Sibling","value":"Sibling"},
                    {"label":"Relative","value":"Relative"},
                    {"label":"Friend","value":"Friend"},
                    {"label":"Partner","value":"Partner"},
                    {"label":"Co-worker","value":"Co-worker"},
                    {"label":"Neighbor","value":"Neighbor"},
                    {"label":"Other","value":"Other"}
                );
                self.relationList = new ArrayDataProvider(self.relationList, {
                    keyAttributes: 'value'
                });  
                self.emergencyCountryCode = ko.observable('');
                self.emergencyPhone = ko.observable('');
                self.emergencyEmail = ko.observable('');
                self.emergencyCountryCode = ko.observable('');
                self.emergencyPhoneError = ko.observable('');
                self.emergencyEmailError = ko.observable('');
                self.tabData = [
                    { id: "basic", label: "Personal" },
                    { id: "password", label: "Update Password" },
                    { id: "absence", label: "Absence" },
                    { id: "employment", label: "Employment" },
                    { id: "clock-in", label: "Clock-in" },
                    { id: "overtime", label: "Overtime" },
                    { id: "documents", label: "Documents" },
                    { id: "workReport", label: "Work Report" },
                ];
                self.selectedTab = ko.observable("basic");  
                self.nationality = ko.observable();
                self.nationList = ko.observableArray([]);
                self.nationList.push(
                    {"label":"Afghanistan","value":"+93"},
                    {"label":"Albania","value":"+355"},
                    {"label":"Algeria","value":"+213"},
                    {"label":"American Samoa","value":"+1684"},
                    {"label":"Andorra","value":"+376"},
                    {"label":"Angola","value":"+244"},
                    {"label":"Anguilla","value":"+1264"},
                    {"label":"Antarctica","value":"+672"},
                    {"label":"Antigua and Barbuda","value":"+1268"},
                    {"label":"Argentina(+54)","value":"+54"},
                    {"label":"Armenia","value":"+374"},
                    {"label":"Aruba","value":"+297"},
                    {"label":"Australia","value":"+61"},
                    {"label":"Austria","value":"+43"},
                    {"label":"Azerbaijan","value":"+994"},
                    {"label":"Bahamas","value":"+1242"},
                    {"label":"Bahrain","value":"+973"},
                    {"label":"Bangladesh","value":"+880"},
                    {"label":"Barbados","value":"+1246"},
                    {"label":"Belarus","value":"+375"},
                    {"label":"Belgium","value":"+32"},
                    {"label":"Belize","value":"+501"},
                    {"label":"Benin","value":"+229"},
                    {"label":"Bermuda","value":"+1441"},
                    {"label":"Bhutan","value":"+975"},
                    {"label":"Bolivia","value":"+591"},
                    {"label":"Bosnia and Herzegovina","value":"+387"},
                    {"label":"Botswana","value":"+267"},
                    {"label":"Brazil","value":"+55"},
                    {"label":"British Indian Ocean Territory","value":"+246"},
                    {"label":"British Virgin Islands","value":"+1284"},
                    {"label":"Brunei","value":"+673"},
                    {"label":"Bulgaria","value":"+359"},
                    {"label":"Burkina Faso","value":"+226"},
                    {"label":"Burundi","value":"+257"},
                    {"label":"Cambodia","value":"+855"},
                    {"label":"Cameroon","value":"+237"},
                    {"label":"Canada","value":"+1"},
                    {"label":"Cape Verde","value":"+238"},
                    {"label":"Cayman Islands","value":"+1345"},
                    {"label":"Central African Republic","value":"+236"},
                    {"label":"Chad","value":"+235"},
                    {"label":"Chile","value":"+56"},
                    {"label":"China","value":"+86"},
                    {"label":"Christmas Island","value":"+61"},
                    {"label":"Cocos Islands","value":"+61"},
                    {"label":"Colombia","value":"+57"},
                    {"label":"Comoros","value":"+269"},
                    {"label":"Cook Islands","value":"+682"},
                    {"label":"Costa Rica","value":"+506"},
                    {"label":"Croatia","value":"+385"},
                    {"label":"Cuba","value":"+53"},
                    {"label":"Curacao","value":"+599"},
                    {"label":"Cyprus","value":"+357"},
                    {"label":"Czech Republic","value":"+420"},
                    {"label":"Democratic Republic of the Congo","value":"+243"},
                    {"label":"Denmark","value":"+45"},
                    {"label":"Djibouti","value":"+253"},
                    {"label":"Dominica","value":"+1767"},
                    {"label":"Dominican Republic","value":"+1809"},
                    {"label":"East Timor","value":"+670"},
                    {"label":"Ecuador","value":"+593"},
                    {"label":"Egypt","value":"+20"},
                    {"label":"El Salvador","value":"+503"},
                    {"label":"Equatorial Guinea","value":"+240"},
                    {"label":"Eritrea","value":"+291"},
                    {"label":"Estonia","value":"+372"},
                    {"label":"Ethiopia","value":"+251"},
                    {"label":"Falkland Islands","value":"+500"},
                    {"label":"Faroe Islands","value":"+298"},
                    {"label":"Fiji","value":"+679"},
                    {"label":"Finland","value":"+358"},
                    {"label":"France","value":"+33"},
                    {"label":"French Polynesia","value":"+689"},
                    {"label":"Gabon","value":"+241"},
                    {"label":"Gambia","value":"+220"},
                    {"label":"Georgia","value":"+995"},
                    {"label":"Germany","value":"+49"},
                    {"label":"Ghana","value":"+233"},
                    {"label":"Gibraltar","value":"+350"},
                    {"label":"Greece","value":"+30"},
                    {"label":"Greenland","value":"+299"},
                    {"label":"Grenada","value":"+1473"},
                    {"label":"Guam","value":"+1671"},
                    {"label":"Guatemala","value":"+502"},
                    {"label":"Guernsey","value":"+441481"},
                    {"label":"Guinea","value":"+224"},
                    {"label":"Guinea-Bissau","value":"+245"},
                    {"label":"Guyana","value":"+592"},
                    {"label":"Haiti","value":"+509"},
                    {"label":"Honduras","value":"+504"},
                    {"label":"Hong Kong","value":"+852"},
                    {"label":"Hungary","value":"+36"},
                    {"label":"Iceland","value":"+354"},
                    {"label":"India","value":"+91"},
                    {"label":"Indonesia","value":"+62"},
                    {"label":"Iran","value":"+98"},
                    {"label":"Iraq","value":"+964"},
                    {"label":"Ireland","value":"+353"},
                    {"label":"Isle of Man","value":"+441624"},
                    {"label":"Israel","value":"+972"},
                    {"label":"Italy","value":"+39"},
                    {"label":"Ivory Coast","value":"+225"},
                    {"label":"Jamaica","value":"+1876"},
                    {"label":"Japan","value":"+81"},
                    {"label":"Jersey","value":"+441534"},
                    {"label":"Jordan","value":"+962"},
                    {"label":"Kazakhstan","value":"+7"},
                    {"label":"Kenya","value":"+254"},
                    {"label":"Kiribati","value":"+686"},
                    {"label":"Kosovo","value":"+383"},
                    {"label":"Kuwait","value":"+965"},
                    {"label":"Kyrgyzstan","value":"+996"},
                    {"label":"Laos","value":"+856"},
                    {"label":"Latvia","value":"+371"},
                    {"label":"Lebanon","value":"+961"},
                    {"label":"Lesotho","value":"+266"},
                    {"label":"Liberia","value":"+231"},
                    {"label":"Libya","value":"+218"},
                    {"label":"Liechtenstein","value":"+423"},
                    {"label":"Lithuania","value":"+370"},
                    {"label":"Luxembourg","value":"+352"},
                    {"label":"Macao","value":"+853"},
                    {"label":"Macedonia","value":"+389"},
                    {"label":"Madagascar","value":"+261"},
                    {"label":"Malawi","value":"+265"},
                    {"label":"Malaysia","value":"+60"},
                    {"label":"Maldives","value":"+960"},
                    {"label":"Mali","value":"+223"},
                    {"label":"Malta","value":"+356"},
                    {"label":"Marshall Islands","value":"+692"},
                    {"label":"Mauritania","value":"+222"},
                    {"label":"Mauritius","value":"+230"},
                    {"label":"Mayotte","value":"+262"},
                    {"label":"Mexico","value":"+52"},
                    {"label":"Micronesia","value":"+691"},
                    {"label":"Moldova","value":"+373"},
                    {"label":"Monaco","value":"+377"},
                    {"label":"Mongolia","value":"+976"},
                    {"label":"Montenegro","value":"+382"},
                    {"label":"Montserrat","value":"+1664"},
                    {"label":"Morocco","value":"+212"},
                    {"label":"Mozambique","value":"+258"},
                    {"label":"Myanmar","value":"+95"},
                    {"label":"Namibia","value":"+264"},
                    {"label":"Nauru","value":"+674"},
                    {"label":"Nepal","value":"+977"},
                    {"label":"Netherlands","value":"+31"},
                    {"label":"Netherlands Antilles","value":"+599"},
                    {"label":"New Caledonia","value":"+687"},
                    {"label":"New Zealand","value":"+64"},
                    {"label":"Nicaragua","value":"+505"},
                    {"label":"Niger","value":"+227"},
                    {"label":"Nigeria","value":"+234"},
                    {"label":"Niue","value":"+683"},
                    {"label":"North Korea","value":"+850"},
                    {"label":"Northern Mariana Islands","value":"+1670"},
                    {"label":"Norway","value":"+47"},
                    {"label":"Oman","value":"+968"},
                    {"label":"Pakistan","value":"+92"},
                    {"label":"Palau","value":"+680"},
                    {"label":"Palestine","value":"+970"},
                    {"label":"Panama","value":"+507"},
                    {"label":"Papua New Guinea","value":"+675"},
                    {"label":"Paraguay","value":"+595"},
                    {"label":"Peru","value":"+51"},
                    {"label":"Philippines","value":"+63"},
                    {"label":"Pitcairn","value":"+64"},
                    {"label":"Poland","value":"+48"},
                    {"label":"Portugal","value":"+351"},
                    {"label":"Puerto Rico","value":"+1787"},
                    {"label":"Qatar","value":"+974"},
                    {"label":"Republic of the Congo","value":"+242"},
                    {"label":"Reunion","value":"+262"},
                    {"label":"Romania","value":"+40"},
                    {"label":"Russia","value":"+7"},
                    {"label":"Rwanda","value":"+250"},
                    {"label":"Saint Barthelemy","value":"+590"},
                    {"label":"Saint Helena","value":"+290"},
                    {"label":"Saint Kitts and Nevis","value":"+1869"},
                    {"label":"Saint Lucia","value":"+1758"},
                    {"label":"Saint Martin","value":"+590"},
                    {"label":"Saint Pierre and Miquelon","value":"+508"},
                    {"label":"Saint Vincent and the Grenadines","value":"+1784"},
                    {"label":"Samoa","value":"+685"},
                    {"label":"San Marino","value":"+378"},
                    {"label":"Sao Tome and Principe","value":"+239"},
                    {"label":"Saudi Arabia","value":"+966"},
                    {"label":"Senegal","value":"+221"},
                    {"label":"Serbia","value":"+381"},
                    {"label":"Seychelles","value":"+248"},
                    {"label":"Sierra Leone","value":"+232"},
                    {"label":"Singapore","value":"+65"},
                    {"label":"Sint Maarten","value":"+1721"},
                    {"label":"Slovakia","value":"+421"},
                    {"label":"Slovenia","value":"+386"},
                    {"label":"Solomon Islands","value":"+677"},
                    {"label":"Somalia","value":"+252"},
                    {"label":"South Africa","value":"+27"},
                    {"label":"South Korea","value":"+82"},
                    {"label":"South Sudan","value":"+211"},
                    {"label":"Spain","value":"+34"},
                    {"label":"Sri Lanka","value":"+94"},
                    {"label":"Sudan","value":"+249"},
                    {"label":"Suriname","value":"+597"},
                    {"label":"Svalbard and Jan Mayen","value":"+47"},
                    {"label":"Swaziland","value":"+268"},
                    {"label":"Sweden","value":"+46"},
                    {"label":"Switzerland","value":"+41"},
                    {"label":"Syria","value":"+963"},
                    {"label":"Taiwan","value":"+886"},
                    {"label":"Tajikistan","value":"+992"},
                    {"label":"Tanzania","value":"+255"},
                    {"label":"Thailand","value":"+66"},
                    {"label":"Togo","value":"+228"},
                    {"label":"Tokelau","value":"+690"},
                    {"label":"Tonga","value":"+676"},
                    {"label":"Trinidad and Tobago","value":"+1868"},
                    {"label":"Tunisia","value":"+216"},
                    {"label":"Turkey","value":"+90"},
                    {"label":"Turkmenistan","value":"+993"},
                    {"label":"Turks and Caicos Islands","value":"+1649"},
                    {"label":"Tuvalu","value":"+688"},
                    {"label":"U.S. Virgin Islands","value":"+1340"},
                    {"label":"Uganda","value":"+256"},
                    {"label":"Ukraine","value":"+380"},
                    {"label":"United Arab Emirates","value":"+971"},
                    {"label":"United Kingdom","value":"+44"},
                    {"label":"United States","value":"+1"},
                    {"label":"Uruguay","value":"+598"},
                    {"label":"Uzbekistan","value":"+998"},
                    {"label":"Vanuatu","value":"+678"},
                    {"label":"Vatican","value":"+379"},
                    {"label":"Venezuela","value":"+58"},
                    {"label":"Vietnam","value":"+84"},
                    {"label":"Wallis and Futuna","value":"+681"},
                    {"label":"Western Sahara","value":"+212"},
                    {"label":"Yemen","value":"+967"},
                    {"label":"Zambia","value":"+260"},
                    {"label":"Zimbabwe","value":"+263"}
                );
                self.nationList = new ArrayDataProvider(self.nationList, {
                    keyAttributes: 'value'
                });
              

                self.StaffDet = ko.observableArray([]);
                self.DepartmentDet = ko.observableArray([]);
                self.DesignationDet = ko.observableArray([]);
                self.line_manager = ko.observable('');
                self.line_manager2 = ko.observable('');
                self.EmployeeDet = ko.observableArray([]);

                self.getRoles = ()=>{
                    $.ajax({
                        url: BaseURL+"/HRModuleGetRoles2",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log("Error fetching roles:", textStatus); // Log any error
                        },
                        success: function (data) {
                            if(data[0].length != 0){ 
                                for (var i = 0; i < data[0].length; i++) {
                                    self.RolesDet.push({'value': data[0][i][0],'label': data[0][i][1]});
                                }
                            } else {
                                console.log("No data received from backend."); // Log if no data is received
                            }
                        }
                    })
                }
                self.rolesList = new ArrayDataProvider(this.RolesDet, { keyAttributes: "value"});

                self.reportTo = ko.observableArray([]);
                self.reportToDet = ko.observableArray([]);

                self.getReportTo = ()=>{
                    self.reportToDet([]);
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetReportTo",
                        type: 'POST',
                        data: JSON.stringify({
                            staff_id: sessionStorage.getItem("userId"),
                        }),
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log("Error fetching Member:", textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            console.log(data);
                            document.getElementById('loaderView').style.display = 'none';
                            if(data[0].length != 0){ 
                                for (var i = 0; i < data[0].length; i++) {
                                    self.reportToDet.push({'value': data[0][i][0],'label': data[0][i][1]});
                                }
                            } else {
                                console.log("No data received from backend.");
                            }
                        }
                    })
                }
                self.reportTo_List = new ArrayDataProvider(this.reportToDet, { keyAttributes: "value"});

                self.getStaff = ()=>{
                    document.getElementById('loaderView').style.display='block';
                    document.getElementById('documents').style.display='none';
                    document.getElementById('employment').style.display='none';
                    $.ajax({
                        url: BaseURL+"/HRModuleGetStaff",
                        type: 'POST',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("userId")
                        }),
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display='none';
                            document.getElementById('documents').style.display='none';
                            document.getElementById('employment').style.display='none';
                            document.getElementById('contentView').style.display='block';
                            var result = JSON.parse(data[0]);
                            console.log(result);
                            self.firstName(result[0][1])
                            self.lastName(result[0][2])
                            self.countryCode(result[0][3])
                            self.phone(result[0][4])
                            self.email(result[0][5])
                            self.qualification(result[0][6])
                            self.designation(result[0][7])
                            self.address(result[0][8])
                            self.secondaryText(result[0][9])
                            self.profilePhoto(result[0][9])
                            self.joining_date(result[0][10])
                            self.department(result[0][11])
                            self.emergency_contact_person(result[0][12])
                            self.emergency_contact_relation(result[0][13])
                            self.emergencyCountryCode(result[0][14])
                            self.emergencyPhone(result[0][15])
                            self.emergencyEmail(result[0][16])
                            self.nationality(result[0][17])
                            self.line_manager(result[0][18])
                            self.middleName(result[0][19])
                            self.birth_day(result[0][20])
                            self.gender(result[0][21])
                            self.roles(result[0][22])
                            self.employee_type(result[0][23])
                            self.termination_date(result[0][24])
                            self.line_manager2(result[0][25])
                            self.reportTo(result[0][26])
                            self.responsibilities(result[0][27])
                            if(data[2] != ''){
                                self.profilePhotoShow('data:image/jpeg;base64,'+data[2]);
                                self.fileContent(self.profilePhotoShow())
                            } 
                            // if(data[1].length !=0){ 
                            //     for (var i = 0; i < data[1].length; i++) {
                            //         self.DesignationDet.push({'value': data[1][i][0],'label': data[1][i][1]  });
                            //     }
                            // }
                            self.username(data[3])
                            self.password(data[4])
                            console.log(data[5])
                            if(data[5].length !=0){ 
                                for (var i = 0; i < data[5].length; i++) {
                                    self.DepartmentDet.push({'value': data[5][i][0],'label': data[5][i][1]  });
                                }
                            }
                        }
                    })
                }
                self.staffList = new ArrayDataProvider(this.StaffDet, { keyAttributes: "id"});
                //self.designationList = new ArrayDataProvider(self.DesignationDet, { keyAttributes: "value"});
                self.departmentList = new ArrayDataProvider(self.DepartmentDet, { keyAttributes: "value"});

                self.phoneValidator = (event)=>{
                    var phone = event.detail.value
                    if (phone > 31 && (phone < 48 || phone > 57) && phone.length==10){
                        self.phoneError('')
                    }else{
                        self.phoneError("Invalid phone number.");
                    }
                }

                self.emailPatternValidator = (event)=>{
                    var email = event.detail.value
                    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    if(email.match(mailformat))
                    {
                        self.emailError('')
                    }
                    else
                    {
                        self.emailError("Invalid email address.");
                    }   
                }

                self.emergencyPhoneValidator = (event)=>{
                    var phone = event.detail.value
                    if(phone != null){
                    if (phone > 31 && (phone < 48 || phone > 57) && phone.length==10){
                        self.emergencyPhoneError('')
                    }else{
                        self.emergencyPhoneError("Invalid phone number.");
                    }
                }
                }

                self.emergencyEmailPatternValidator = (event)=>{
                    var email = event.detail.value
                    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    if(email != null){
                    if(email.match(mailformat))
                    {
                        self.emergencyEmailError('')
                    }
                    else
                    {
                        self.emergencyEmailError("Invalid email address.");
                    }   
                }
                }
                
                self.formSubmit = ()=>{
                    // Check if self.line_manager() is an integer
                    const lineManagerValue = self.line_manager();
                    if (Number.isInteger(Number(lineManagerValue))) {
                        self.line_manager2(lineManagerValue);
                    }
                    const formValid = self._checkValidationGroup("formValidation"); 
                    if (formValid) {
                        if(self.emailError()=='' && self.phoneError()=='' && self.typeError()==''){
                            let popup = document.getElementById("popup1");
                            popup.open();
                            const reader = new FileReader();
                            if(self.file() !=''){
                            reader.readAsDataURL(self.file());
                            reader.onload = ()=>{
                            const fileContent = reader.result;
                            $.ajax({
                                url: BaseURL+"/HRModuleUpdateStaff",
                                type: 'POST',
                                data: JSON.stringify({
                                    staffId : sessionStorage.getItem("userId"),
                                    firstName : self.firstName(),
                                    lastName : self.lastName(),
                                    countryCode : self.countryCode(),
                                    phone : self.phone(),
                                    email : self.email(),
                                    qualification : self.qualification(),
                                    designation : self.designation(),
                                    address : self.address(),
                                    profile_photo : self.profilePhoto(),
                                    file : fileContent,
                                    joining_date : self.joining_date(),
                                    department : self.department(),
                                    emergency_contact_person : self.emergency_contact_person(),
                                    emergency_contact_relation : self.emergency_contact_relation(),
                                    emergency_country_code : self.emergencyCountryCode(),
                                    emergency_phone : self.emergencyPhone(),
                                    emergency_email : self.emergencyEmail(),
                                    nationality : self.nationality(),
                                    line_manager : self.line_manager2(),
                                    middleName : self.middleName(),
                                    birth_day : self.birth_day(),
                                    gender : self.gender(),
                                    roles : self.roles(),
                                    employee_type : self.employee_type(),
                                    termination_date : self.termination_date(),
                                    report_to : self.reportTo(),
                                    responsibilities : self.responsibilities()
                                }),
                                dataType: 'json',
                                timeout: sessionStorage.getItem("timeInetrval"),
                                context: self,
                                error: function (xhr, textStatus, errorThrown) {
                                    console.log(textStatus);
                                },
                                success: function (data) {
                                    let popup = document.getElementById("popup1");
                                    popup.close();
                                    let popup1 = document.getElementById("popup2");
                                    popup1.open();
                                }
                            })
                        }
                        }else{
                            $.ajax({
                                url: BaseURL+"/HRModuleUpdateStaff",
                                type: 'POST',
                                data: JSON.stringify({
                                    staffId : sessionStorage.getItem("userId"),
                                    firstName : self.firstName(),
                                    lastName : self.lastName(),
                                    countryCode : self.countryCode(),
                                    phone : self.phone(),
                                    email : self.email(),
                                    qualification : self.qualification(),
                                    designation : self.designation(),
                                    address : self.address(),
                                    profile_photo : self.profilePhoto(),
                                    file : self.fileContent(),
                                    joining_date : self.joining_date(),
                                    department : self.department(),
                                    emergency_contact_person : self.emergency_contact_person(),
                                    emergency_contact_relation : self.emergency_contact_relation(),
                                    emergency_country_code : self.emergencyCountryCode(),
                                    emergency_phone : self.emergencyPhone(),
                                    emergency_email : self.emergencyEmail(),
                                    nationality : self.nationality(),
                                    line_manager : self.line_manager2(),
                                    middleName : self.middleName(),
                                    birth_day : self.birth_day(),
                                    gender : self.gender(),
                                    roles : self.roles(),
                                    employee_type : self.employee_type(),
                                    termination_date : self.termination_date(),
                                    report_to : self.reportTo(),
                                    responsibilities : self.responsibilities()
                                }),
                                dataType: 'json',
                                timeout: sessionStorage.getItem("timeInetrval"),
                                context: self,
                                error: function (xhr, textStatus, errorThrown) {
                                    console.log(textStatus);
                                },
                                success: function (data) {
                                    console.log(data);
                                    let popup = document.getElementById("popup1");
                                    popup.close();
                                    let popup1 = document.getElementById("popup2");
                                    popup1.open();
                                }
                            })
                        }
                    }
                    }
                }

                self.messageClose = ()=>{
                    location.reload();
                }

                self.openSuccess = ()=>{
                    let popup1 = document.getElementById("popup2");
                    popup1.open();
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

                self.uploadProfilePhoto = function (event) {
                    var file = event.detail.files[0];
                    const result = event.detail.files;
                    const files = result[0];
                    var fileName= files.name;
                    self.profilePhoto(fileName)
                    //console.log(files)
                    self.file(files)
                    self.secondaryText(fileName)
                    var fileFormat =files.name.split(".");
                    var checkFormat =fileFormat[1];
                    if(checkFormat == 'png' || checkFormat =="jpeg" || checkFormat =="jpg"){
                    self.typeError('')
                }
                else{
                    self.typeError('The image must be a file of type: jpeg, png, jpg')
                }
              }

              self.sendCredentials = ()=>{
                    let popup = document.getElementById("popup1");
                    popup.open();
                    
                    $.ajax({
                        url: BaseURL+"/HRModuleStaffCredentialSend",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("userId"),
                            username : self.username(),
                            password : self.password(),
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            let popup = document.getElementById("popup1");
                            popup.close();
                            let popup1 = document.getElementById("popupMail");
                            popup1.open();
                        }
                    })
                }

                self.selectedTabAction = ko.computed(() => { 
                    if(self.selectedTab() == 'basic'){
                        $("#basic-info").show();
                        $("#update-password").hide();
                        $("#employment").hide();
                        $("#documents").hide();
                        $("#absence").hide();
                        $("#clock-in").hide();
                        $("#overtime").hide();
                        $("#workReport").hide();
                    }else if(self.selectedTab() == 'password'){
                        $("#basic-info").hide();
                        $("#update-password").show();
                        $("#employment").hide();
                        $("#documents").hide();
                        $("#absence").hide();
                        $("#clock-in").hide();
                        $("#overtime").hide();
                        $("#workReport").hide();
                    }
                    else if(self.selectedTab() == 'absence'){
                        $("#basic-info").hide();
                        $("#update-password").hide();
                        $("#employment").hide();
                        $("#documents").hide();
                        self.filterYear();
                        self.getLeaveBalance();
                        self.changeLeaveBalance();
                        $("#absence").show();
                        $("#clock-in").hide();
                        $("#overtime").hide();
                        $("#workReport").hide();
                    }
                    else if(self.selectedTab() == 'employment'){
                        $("#basic-info").hide();
                        $("#update-password").hide();
                        $("#clock-in").hide();
                        self.fetchSalaryDetailsOnLoad();
                        self.fetchBankDetailsOnLoad();
                        self.fetchPayrollDetailsOnLoad();
                        self.fetchEmploymentSummaryDetailsOnLoad();
                        self.fetchTeamsForStaff();
                        self.fetchRoleInformationOnLoad();
                        self.fetchContractDetailsOnLoad();
                        self.changeLeaveBalance();
                        self.getWorkLocation();
                        $("#employment").show();
                        $("#documents").hide();
                        $("#absence").hide();
                        $("#overtime").hide();
                        $("#workReport").hide();
                    }else if(self.selectedTab() == 'clock-in'){
                        $("#basic-info").hide();
                        $("#update-password").hide();
                        $("#employment").hide();
                        $("#documents").hide();
                        $("#absence").hide();
                        self.getClockinDetails();
                        $("#clock-in").show();
                        $("#overtime").hide();
                        $("#workReport").hide();
                    }else if(self.selectedTab() == 'overtime'){
                        $("#basic-info").hide();
                        $("#update-password").hide();
                        $("#employment").hide();
                        $("#documents").hide();
                        $("#absence").hide();
                        $("#clock-in").hide();
                        $("#overtime").show();
                        self.getOverTimeData();
                        $("#workReport").hide();
                    }else if(self.selectedTab() == 'documents'){
                        $("#basic-info").hide();
                        $("#update-password").hide();
                        $("#employment").hide();
                        self.getDocuments();
                        $("#documents").show();
                        $("#absence").hide();
                        $("#clock-in").hide();
                        $("#overtime").hide();
                        $("#workReport").hide();
                    }else if(self.selectedTab() == 'workReport'){
                        $("#basic-info").hide();
                        $("#update-password").hide();
                        $("#employment").hide();
                        $("#documents").hide();
                        $("#absence").hide();
                        $("#clock-in").hide();
                        $("#overtime").hide();
                        self.getWorkReport();
                        $("#workReport").show();
                    }
                });

                self.getDesignationList = ()=>{
                    self.DesignationDet([])
                    self.EmployeeDet([])
                    if(self.department() !=undefined){
                    $.ajax({
                        url: BaseURL+"/HRModuleGetDesignationList",
                        type: 'POST',
                        data: JSON.stringify({
                            departmentId : self.department(),
                            staffId : sessionStorage.getItem("userId"),
                        }),
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            console.log(data)
                            if(data[0].length !=0){ 
                                for (var i = 0; i < data[0].length; i++) {
                                    self.DesignationDet.push({'value': data[0][i][1],'label': data[0][i][1]  });
                                }
                            }else{
                                self.designation('')
                            }
                            
                            var j = 0;
                            if(data[1].length !=0){ 
                                console.log(data[1].length);

                                for (j = 0; j < data[1].length; j++) {
                                    self.EmployeeDet.push({
                                        'value':  data[1][j][0],
                                        'label': data[1][j][1]+ " " +  data[1][j][3]+ " " +  data[1][j][2]
                                    });
                                }
                            }
                            else{
                                self.line_manager('')
                            }
                        }
                    })
                }
                }
                self.designationList = new ArrayDataProvider(this.DesignationDet, { keyAttributes: "value"});
                self.employeeListLine = new ArrayDataProvider(this.EmployeeDet, { keyAttributes: "value"});

                self.crediantialUpdate = function (event,data) {
                    let popup3 = document.getElementById("popup1");
                    popup3.open();
                    $.ajax({
                        url: BaseURL + "/HRModuleCredentialUpdate",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("userId"),
                            password : self.password()
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            let popup3 = document.getElementById("popup1");
                            popup3.close();
                            let popup4 = document.getElementById("popupPassword");
                            popup4.open();
                        }
                    }) 
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
                                url: BaseURL + "/HRModuleDocumentUpload",
                                type: 'POST',
                                data: JSON.stringify({
                                    userId: sessionStorage.getItem("userId"),
                                    staffId: sessionStorage.getItem("userId"),
                                    userRole: sessionStorage.getItem("userRole"),
                                    document_name: documentName,
                                    file_name: documentFileName,
                                    file: fileContent
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
                        url: BaseURL + "/HRModuleGetDocuments",
                        type: 'POST',
                        data: JSON.stringify({
                            userId: sessionStorage.getItem("userId"),
                            userRole: sessionStorage.getItem("userRole"),
                            staffId: sessionStorage.getItem("userId")
                        }),
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
                            document.getElementById('document_view').style.display = 'block';
                            console.log(data);
                            document.getElementById('loaderView').style.display = 'none';
                            if (data[0].length != 0) {
                                for (var i = 0; i < data[0].length; i++) {
                                    self.DocumentsDet.push({
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
                    });
                }
                
                self.documentData = new ArrayDataProvider(self.DocumentsDet, { keyAttributes: "id" });  
                
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
                
                self.deleteDocument = (event, data) => {
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


                
                self.CancelBehaviorOpt = ko.observable('icon');

                self.amount = ko.observable();
                self.hourly_rate = ko.observable('');
                self.payment_frequency = ko.observable('Monthly');

                self.amountError = ko.observable('');

                self.PatternValidatorSalary = (event) => {
                    var amount = event.detail.value.toString();  // Convert to string
                    
                    // pattern to allow numbers like 0.12, 30.5 but not just 0
                    var pattern = /^(?!0$)(0|[1-9]\d*)(\.\d{1,2})?$/;
                
                    if (amount.match(pattern)) {
                        self.amountError(''); // Clear any previous error
                    } else {
                        self.amountError('Invalid Amount. Enter a valid amount (e.g., 30, 30.5).');
                    }
                };

                self.paymentFrequencyList = ko.observableArray([]);
                self.paymentFrequencyList.push(
                    {"label":"Monthly","value":"Monthly"},
                    {"label":"Four weekly","value":"Four weekly"},
                    {"label":"Biweekly","value":"Biweekly"},
                    {"label":"Weekly","value":"Weekly"},
                );
                self.paymentFrequencyList = new ArrayDataProvider(self.paymentFrequencyList, {
                    keyAttributes: 'value'
                });

                self.EditSalary = (event, data) => {
                    var staffId = sessionStorage.getItem("userId"); // Get the staff_id from sessionStorage
                    if (staffId) {
                        self.getSalaryDetails(staffId); // Fetch salary details for the staff
                        document.querySelector('#openEditSalary').open(); // Open the edit popup
                    } else {
                        console.error("No staff_id found in sessionStorage");
                    }
                };

                self.getSalaryDetails = (staffId) => {
                    if (!staffId) {
                        return;
                    }
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetSalaryDetails", // Replace with your actual endpoint
                        type: 'POST',
                        data: JSON.stringify({ staff_id: staffId }), // Send staff ID as a parameter
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            if (data && data.length > 0) {
                                var salaryDetails = data[0]; // Assuming the first element contains the salary details
                                self.amount(salaryDetails[0]); // amount
                                self.hourly_rate(salaryDetails[1]); // hourly_rate
                                self.payment_frequency(salaryDetails[2]); // payment_frequency
                                document.querySelector('#openEditSalary').open(); // Open the edit popup
                            }
                        }
                    });
                };

                self.fetchSalaryDetailsOnLoad = () => {
                    const staffId = sessionStorage.getItem("userId");
                    if (!staffId) {
                        console.error("No staff_id found in sessionStorage");
                        return;
                    }
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetSalaryDetails", // Use the same endpoint to get salary details
                        type: 'POST',
                        data: JSON.stringify({ staff_id: staffId }), // Send staff ID as a parameter
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            if (data && data.length > 0) {
                                var salaryDetails = data[0]; // Assuming the first element contains the salary details
                                self.amount(salaryDetails[0]); // amount
                                self.hourly_rate(salaryDetails[1]); // hourly_rate
                                self.payment_frequency(salaryDetails[2]); // payment_frequency
                            }
                        }
                    });
                };
                
                self.formSubmit3 = () => {
                    const formValid = self._checkValidationGroup("formValidation3"); // Ensure you're validating the correct form group
                    if (formValid) {
                        let popup = document.getElementById("popup1");
                        popup.open();
                
                        $.ajax({
                            url: BaseURL + "/HRModuleUpdateSalaryDetails",
                            type: 'POST',
                            data: JSON.stringify({
                                staff_id: sessionStorage.getItem("userId"), // Retrieve the staff ID from session storage
                                amount: self.amount(),
                                hourly_rate: self.hourly_rate(),
                                payment_frequency: self.payment_frequency(),
                            }),
                            contentType: "application/json",
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInterval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                                popup.close(); // Close the loading popup on error
                            },
                            success: function (data) {
                                document.querySelector('#openEditSalary').close();
                                popup.close(); // Close the loading popup on success
                                let successPopup = document.getElementById("successView2");
                                successPopup.open();
                            }
                        });
                    }
                };
                
                self.name_on_account = ko.observable();
                self.name_of_bank = ko.observable();
                self.bank_branch = ko.observable();
                self.account_number = ko.observable();
                self.sort_code = ko.observable();

                self.EditBank = (event, data) => {
                    var staffId = sessionStorage.getItem("userId"); // Get the staff_id from sessionStorage
                    if (staffId) {
                        self.getBankDetails(staffId); // Fetch salary details for the staff
                        document.querySelector('#openEditBank').open(); // Open the edit popup
                    } else {
                        console.error("No staff_id found in sessionStorage");
                    }
                };

                self.getBankDetails = (staffId) => {
                    if (!staffId) {
                        return;
                    }
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetBankDetails", // Replace with your actual endpoint
                        type: 'POST',
                        data: JSON.stringify({ staff_id: staffId }), // Send staff ID as a parameter
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            if (data && data.length > 0) {
                                var bankDetails = data[0]; // Assuming the first element contains the bank details
                                self.name_on_account(bankDetails[0]); // name_on_account
                                self.name_of_bank(bankDetails[1]); // name_of_bank
                                self.bank_branch(bankDetails[2]); // bank_branch
                                self.account_number(bankDetails[3]); // account_number
                                self.sort_code(bankDetails[4]); // sort_code
                                document.querySelector('#openEditBank').open(); // Open the edit popup
                            }
                        }
                    });
                };
                
                self.fetchBankDetailsOnLoad = () => {
                    const staffId = sessionStorage.getItem("userId");
                    if (!staffId) {
                        console.error("No staff_id found in sessionStorage");
                        return;
                    }
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetBankDetails", // Use the same endpoint to get bank details
                        type: 'POST',
                        data: JSON.stringify({ staff_id: staffId }), // Send staff ID as a parameter
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            if (data && data.length > 0) {
                                var bankDetails = data[0]; // Assuming the first element contains the bank details
                                self.name_on_account(bankDetails[0]); // name_on_account
                                self.name_of_bank(bankDetails[1]); // name_of_bank
                                self.bank_branch(bankDetails[2]); // bank_branch
                                self.account_number(bankDetails[3]); // account_number
                                self.sort_code(bankDetails[4]); // sort_code
                            }
                        }
                    });
                };

                self.formSubmit4 = () => {
                    const formValid = self._checkValidationGroup("formValidation4"); // Ensure you're validating the correct form group
                    if (formValid) {
                        let popup = document.getElementById("popup1");
                        popup.open();
                
                        $.ajax({
                            url: BaseURL + "/HRModuleUpdateBankDetails",
                            type: 'POST',
                            data: JSON.stringify({
                                staff_id: sessionStorage.getItem("userId"), // Retrieve the staff ID from session storage
                                name_on_account: self.name_on_account(),
                                name_of_bank: self.name_of_bank(),
                                bank_branch: self.bank_branch(),
                                account_number: self.account_number(),
                                sort_code: self.sort_code()
                            }),
                            contentType: "application/json",
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInterval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                                popup.close(); // Close the loading popup on error
                            },
                            success: function (data) {
                                document.querySelector('#openEditBank').close();
                                popup.close(); // Close the loading popup on success
                                let successPopup = document.getElementById("successView2");
                                successPopup.open();
                            }
                        });
                    }
                };

                self.payroll_number = ko.observable();
                self.pension_eligible = ko.observable('No');

                self.EditPayroll = (event, data) => {
                    var staffId = sessionStorage.getItem("userId"); // Get the staff_id from sessionStorage
                    if (staffId) {
                        self.getPayrollDetails(staffId); // Fetch payroll details for the staff
                        document.querySelector('#openEditPayroll').open(); // Open the edit popup
                    } else {
                        console.error("No staff_id found in sessionStorage");
                    }
                };

                self.getPayrollDetails = (staffId) => {
                    if (!staffId) {
                        return;
                    }
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetPayrollDetails", // Replace with your actual endpoint
                        type: 'POST',
                        data: JSON.stringify({ staff_id: staffId }), // Send staff ID as a parameter
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            if (data && data.length > 0) {
                                var payrollDetails = data[0]; // Assuming the first element contains the payroll details
                                self.payroll_number(payrollDetails[0]); // payroll_number
                                self.pension_eligible(payrollDetails[1]); // pension_eligible
                                document.querySelector('#openEditPayroll').open(); // Open the edit popup
                            }
                        }
                    });
                };

                self.fetchPayrollDetailsOnLoad = () => {
                    const staffId = sessionStorage.getItem("userId");
                    if (!staffId) {
                        console.error("No staff_id found in sessionStorage");
                        return;
                    }
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetPayrollDetails", // Use the same endpoint to get payroll details
                        type: 'POST',
                        data: JSON.stringify({ staff_id: staffId }), // Send staff ID as a parameter
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            if (data && data.length > 0) {
                                var payrollDetails = data[0]; // Assuming the first element contains the payroll details
                                self.payroll_number(payrollDetails[0]); // payroll_number
                                self.pension_eligible(payrollDetails[1]); // pension_eligible
                            }
                        }
                    });
                };

                self.formSubmit5 = () => {
                    const formValid = self._checkValidationGroup("formValidation5"); // Ensure you're validating the correct form group
                    if (formValid) {
                        let popup = document.getElementById("popup1");
                        popup.open();

                        $.ajax({
                            url: BaseURL + "/HRModuleUpdatePayrollDetails",
                            type: 'POST',
                            data: JSON.stringify({
                                staff_id: sessionStorage.getItem("userId"), // Retrieve the staff ID from session storage
                                payroll_number: self.payroll_number(),
                                pension_eligible: self.pension_eligible()
                            }),
                            contentType: "application/json",
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInterval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                                popup.close(); // Close the loading popup on error
                            },
                            success: function (data) {
                                document.querySelector('#openEditPayroll').close();
                                popup.close(); // Close the loading popup on success
                                let successPopup = document.getElementById("successView2");
                                successPopup.open();
                            }
                        });
                    }
                };

                self.joining_date2 = ko.observable();
                self.termination_date2 = ko.observable();

                // Function to open the edit dialog and fetch employment summary details
                self.EditEmploymentSummary = (event, data) => {
                    var staffId = sessionStorage.getItem("userId"); // Get the staff_id from sessionStorage
                    if (staffId) {
                        self.getEmploymentSummaryDetails(staffId);
                    } else {
                        console.error("No staff_id found in sessionStorage");
                    }
                };

                // Function to fetch employment summary details
                self.getEmploymentSummaryDetails = (staffId) => {
                    if (!staffId) {
                        return;
                    }
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetEmploymentSummaryDetails", // Replace with your actual endpoint
                        type: 'POST',
                        data: JSON.stringify({ staff_id: staffId }), // Send staff ID as a parameter
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            if (data && data.length > 0) {
                                self.joining_date2(data[0]);
                                self.termination_date2(data[1]); 
                                document.querySelector('#openEditEmploymentSummary').open(); // Open the edit popup
                            }
                        }
                    });
                };

                // Function to fetch employment summary details on page load
                self.fetchEmploymentSummaryDetailsOnLoad = () => {
                    const staffId = sessionStorage.getItem("userId");
                    if (!staffId) {
                        console.error("No staff_id found in sessionStorage");
                        return;
                    }
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetEmploymentSummaryDetails", // Use the same endpoint to get employment summary details
                        type: 'POST',
                        data: JSON.stringify({ staff_id: staffId }), // Send staff ID as a parameter
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            if (data && data.length > 0) {
                                self.joining_date2(data[0]);
                                self.termination_date2(data[1]);
                            }
                        }
                    });
                };

                // Function to submit the form and update employment summary details
                self.formSubmit6 = () => {
                    const formValid = self._checkValidationGroup("formValidation6"); // Ensure you're validating the correct form group
                    if (formValid) {
                        let popup = document.getElementById("popup1");
                        popup.open();

                        $.ajax({
                            url: BaseURL + "/HRModuleUpdateEmploymentSummaryDetails",
                            type: 'POST',
                            data: JSON.stringify({
                                staff_id: sessionStorage.getItem("userId"), // Retrieve the staff ID from session storage
                                joining_date: self.joining_date2(),
                                termination_date: self.termination_date2()
                            }),
                            contentType: "application/json",
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInterval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                                popup.close(); // Close the loading popup on error
                            },
                            success: function (data) {
                                document.querySelector('#openEditEmploymentSummary').close();
                                popup.close(); // Close the loading popup on success
                                let successPopup = document.getElementById("successView2");
                                successPopup.open();
                            }
                        });
                    }
                };


                // Define observables for the new fields
                self.job_title = ko.observable();
                self.contract_type = ko.observable();
                self.teams = ko.observable();
                self.probation_details = ko.observable();
                self.notice_period = ko.observable();

                // Function to edit role information
                self.EditRoleInformation = (event, data) => {
                    var staffId = sessionStorage.getItem("userId"); // Get the staff_id from sessionStorage
                    if (staffId) {
                        self.getRoleInformationDetails(staffId); // Fetch role information details for the staff
                        document.querySelector('#openEditRoleInformation').open(); // Open the edit popup
                    } else {
                        console.error("No staff_id found in sessionStorage");
                    }
                };

                self.employee_type_List2 = ko.observableArray([]);
                self.employee_type_List2.push(
                    {"label":"Full Time","value":"Full Time"},
                    {"label":"Part Time","value":"Part Time"},
                    {"label":"Contract","value":"Contract"},
                    {"label":"Intern","value":"Intern"},
                    {"label":"Other","value":"Other"}
                );
                self.employee_type_List2 = new ArrayDataProvider(self.employee_type_List2, {
                    keyAttributes: 'value'
                });

                self.fetchTeamsForStaff = () => {
                    const staffId = sessionStorage.getItem("userId");
                    if (!staffId) {
                        console.error("No staff_id found in sessionStorage");
                        return;
                    }
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetTeamsForStaff",
                        type: 'POST',
                        data: JSON.stringify({ staff_id: staffId }),
                        contentType: "application/json",
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            if (data && data.length > 0) {
                                // Join the array of team names into a single string separated by commas
                                const teamNames = data.join(', ');
                                self.teams(teamNames);
                            }
                        }
                    });
                };

                // Function to get role information details
                self.getRoleInformationDetails = (staffId) => {
                    if (!staffId) {
                        return;
                    }
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetRoleInformationDetails", // Replace with your actual endpoint
                        type: 'POST',
                        data: JSON.stringify({ staff_id: staffId }), // Send staff ID as a parameter
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            if (data && data.length > 0) {
                                var roleInfo = data[0]; // Assuming the first element contains the role information details
                                self.job_title(roleInfo[0]); // job_title
                                self.contract_type(roleInfo[1]); // contract_type
                                self.probation_details(roleInfo[2]); // probation_details
                                self.notice_period(roleInfo[3]); // notice_period
                                document.querySelector('#openEditRoleInformation').open(); // Open the edit popup
                            }
                        }
                    });
                };


                // Call this function to fetch role information on page load
                self.fetchRoleInformationOnLoad = () => {
                    const staffId = sessionStorage.getItem("userId");
                    if (!staffId) {
                        console.error("No staff_id found in sessionStorage");
                        return;
                    }
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetRoleInformationDetails2", // Use the same endpoint to get role information details
                        type: 'POST',
                        data: JSON.stringify({ staff_id: staffId }), // Send staff ID as a parameter
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            if (data && data.length > 0) {
                                var roleInfo = data[0]; // Assuming the first element contains the role information details
                                self.job_title(roleInfo[0]); // job_title
                                self.contract_type(roleInfo[1]); // contract_type
                                self.probation_details(roleInfo[2]); // probation_details
                                self.notice_period(roleInfo[3]); // notice_period
                            }
                        }
                    });
                };

                self.formSubmit7 = () => {
                    const formValid = self._checkValidationGroup("formValidation7");
                    if (formValid) {
                        let popup = document.getElementById("popup1");
                        popup.open();
                
                        $.ajax({
                            url: BaseURL + "/HRModuleUpdateRoleInformationDetails",
                            type: 'POST',
                            data: JSON.stringify({
                                staff_id: sessionStorage.getItem("userId"),
                                job_title: self.job_title(),
                                contract_type: self.contract_type(),
                                probation_details: self.probation_details(),
                                notice_period: self.notice_period()
                            }),
                            contentType: "application/json",
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInterval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                                popup.close();
                            },
                            success: function (data) {
                                document.querySelector('#openEditRoleInformation').close();
                                popup.close();
                                let successPopup = document.getElementById("successView2");
                                successPopup.open();
                            }
                        });
                    }
                };

                self.employment_type = ko.observable();
                self.contract_start = ko.observable();
                self.work_pattern = ko.observable();
                self.contract_hour = ko.observable();
                self.leave_start = ko.observable();
                self.min_leave = ko.observable();
                self.leave_balance = ko.observable();

                self.fetchContractDetailsOnLoad = () => {
                    const staffId = sessionStorage.getItem("userId");
                    if (!staffId) {
                        console.error("No staff_id found in sessionStorage");
                        return;
                    }
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetContractDetails",
                        type: 'POST',
                        data: JSON.stringify({ staff_id: staffId }), // Send staff ID as a parameter
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            if (data && data.length > 0) {
                                console.log(data);
                                self.employment_type(data[0][0]); 
                                self.contract_start(data[0][1]); 
                                self.work_pattern(data[0][2]);
                                self.contract_hour(data[0][3]);
                                self.min_leave(data[0][4]); 
                                self.leave_balance(data[0][5]);
                                self.leave_start(data[0][6]);
                            } else {
                                console.error("No data returned from the API");
                            }
                        }                        
                    });
                };
                
                self.EditContract = (event, data) => {
                    var staffId = sessionStorage.getItem("userId"); // Get the staff_id from sessionStorage
                    if (staffId) {
                        self.getContractDetails(staffId); // Fetch salary details for the staff
                        document.querySelector('#openEditContract').open(); // Open the edit popup
                    } else {
                        console.error("No staff_id found in sessionStorage");
                    }
                };
                
                self.WorkPatternList = ko.observableArray([]); 

                self.getWorkPattern = () => {
                    $.ajax({
                        url: BaseURL + "/HRModuleGetWorkPatternList2",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log("Error fetching:", textStatus); 
                        },
                        success: function (data) {
                            if (data[0].length != 0) { 
                                for (var i = 0; i < data[0].length; i++) {
                                    self.WorkPatternList.push({'value': data[0][i][0], 'label': data[0][i][1]});
                                }
                            } else {
                                console.log("No data received from backend."); // Log if no data is received
                            }
                        }
                    });
                }

                self.WorkPatternList2 = new ArrayDataProvider(self.WorkPatternList, { keyAttributes: "value" });
                
                self.contract_start2 = ko.observable();
                self.work_pattern2 = ko.observable();
                self.min_leave2 = ko.observable();

                self.getContractDetails = (staffId) => {
                    if (!staffId) {
                        return;
                    }
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetContractDetails2",
                        type: 'POST',
                        data: JSON.stringify({ staff_id: staffId }),
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            if (data && data.length > 0) {
                                self.contract_start2(data[0][0]);
                                self.work_pattern2(data[0][1]);
                                self.min_leave2(data[0][2]);
                                document.querySelector('#openEditContract').open();
                            }
                        }
                    });
                };

                self.formSubmit8 = () => {
                    const formValid = self._checkValidationGroup("formValidation8");
                    if (formValid) {
                        let popup = document.getElementById("popup1");
                        popup.open();
                
                        $.ajax({
                            url: BaseURL + "/HRModuleUpdateContractInformation",
                            type: 'POST',
                            data: JSON.stringify({
                                staff_id: sessionStorage.getItem("userId"),
                                contract_start: self.contract_start2(),
                                work_pattern: self.work_pattern2(),
                                min_leave: self.min_leave2()
                            }),
                            contentType: "application/json",
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInterval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                                popup.close();
                            },
                            success: function (data) {
                                document.querySelector('#openEditContract').close();
                                popup.close();
                                let successPopup = document.getElementById("successView2");
                                successPopup.open();
                            }
                        });
                    }
                };

                //Leave Balance Updater Function: This function should be called where the leave balance needs to be updated and displayed.
                self.changeLeaveBalance = ()=>{
                    $.ajax({
                        url: BaseURL+"/HRModuleChangeLeaveBalance",
                        type: 'GET',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log("Error fetching :", textStatus); // Log any error
                        },
                        success: function (data) {
                            console.log(data);
                        }
                    })
                }

                self.work_location = ko.observable();

                self.getWorkLocation = () => {
                    const staffId = sessionStorage.getItem("userId");
                    if (!staffId) {
                        console.error("No staff_id found in sessionStorage");
                        return;
                    }
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetWorkLocation",
                        type: 'POST',
                        data: JSON.stringify({ staff_id: staffId }),
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            if (data && data.length > 0) {
                                self.work_location(data[0][0]);
                            }
                        }
                    });
                };

                self.work_location2 = ko.observable();

                self.openEditWorkLocation = (event, data) => {
                    var staffId = sessionStorage.getItem("userId"); // Get the staff_id from sessionStorage
                    if (staffId) {
                        self.getWorkLocationDetails(staffId); // Fetch salary details for the staff
                        document.querySelector('#openEditWorkLocation').open(); // Open the edit popup
                    } else {
                        console.error("No staff_id found in sessionStorage");
                    }
                };

                self.getWorkLocationDetails = (staffId) => {
                    if (!staffId) {
                        return;
                    }
                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetWorkLocation",
                        type: 'POST',
                        data: JSON.stringify({ staff_id: staffId }),
                        contentType: "application/json",
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            if (data && data.length > 0) {
                                self.work_location2(data[0][0]);
                                document.querySelector('#openEditWorkLocation').open();
                            }
                        }
                    });
                };

                self.formSubmit9 = () => {
                    const formValid = self._checkValidationGroup("formValidation9");
                    if (formValid) {
                        let popup = document.getElementById("popup1");
                        popup.open();
                
                        $.ajax({
                            url: BaseURL + "/HRModuleUpdateWorkLocation",
                            type: 'POST',
                            data: JSON.stringify({
                                staff_id: sessionStorage.getItem("userId"),
                                location: self.work_location2()
                            }),
                            contentType: "application/json",
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInterval"),
                            context: self,
                            error: function (xhr, textStatus, errorThrown) {
                                console.log(textStatus);
                                popup.close();
                            },
                            success: function (data) {
                                document.querySelector('#openEditWorkLocation').close();
                                popup.close();
                                let successPopup = document.getElementById("successView2");
                                successPopup.open();
                            }
                        });
                    }
                };

                self.LeaveDet = ko.observableArray([]);
                self.LeaveYearDet = ko.observableArray([]);
                self.yearFilter = ko.observable('');

                self.getLeaves = () => {
                    self.LeaveDet([]);
                    document.getElementById('loaderView').style.display = 'none';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetSelfLeaveStatus",
                        type: 'POST',
                        data: JSON.stringify({
                            staff_id: sessionStorage.getItem("userId")
                        }),
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function(xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function(result1) {
                            console.log(result1);

                            if (result1[0].length != 0) {
                                for (var i = 0; i < result1[0].length; i++) {
                                    self.LeaveDet.push({
                                        'no': i + 1,
                                        'id': result1[0][i][0],
                                        'start_date': result1[0][i][1],
                                        'end_date': result1[0][i][2],
                                        'leave_type': result1[0][i][3],
                                        'leave_reason': result1[0][i][4],
                                        'status': result1[0][i][5]
                                    });
                                }
                            }

                            if (result1[1].length != 0) {
                                for (var i = 0; i < result1[1].length; i++) {
                                    self.LeaveYearDet.push({"label": result1[1][i][0], "value": result1[1][i][0]});
                                }
                                self.LeaveYearDet.unshift({ value: 'All', label: 'All' });
                            }
                        }
                    });
                };

                self.yearList = new ArrayDataProvider(this.LeaveYearDet, { keyAttributes: "value"});

                self.filterYearCallCount = 0; // Initialize counter
                // Debounce function to limit calls to filterYear
                function debounce(func, wait) {
                    let timeout;
                    return function (...args) {
                        const context = this;
                        clearTimeout(timeout);
                        timeout = setTimeout(() => func.apply(context, args), wait);
                    };
                }

                self.filterYear = debounce(function () {
                    self.LeaveDet([]);
                    self.filterYearCallCount++; // Increment counter

                    if (self.yearFilter() == '') {
                        const currentYear = new Date().getFullYear();
                        console.log(currentYear);
                        self.yearFilter(currentYear);
                    }
                    if (self.yearFilter() != '') {
                        if (self.filterYearCallCount <= 3) { // Clear only on first 3 calls
                            self.LeaveDet([]);
                        }
                        document.getElementById('loaderView').style.display = 'block';
                        $.ajax({
                            url: BaseURL + "/HRModuleGetSelfLeaveStatusFilter",
                            type: 'POST',
                            data: JSON.stringify({
                                staff_id: sessionStorage.getItem("userId"),
                                year: self.yearFilter()
                            }),
                            dataType: 'json',
                            timeout: sessionStorage.getItem("timeInetrval"),
                            context: self,
                            error: function(xhr, textStatus, errorThrown) {
                                if (textStatus == 'timeout' || textStatus == 'error') {
                                    document.querySelector('#TimeoutSup').open();
                                }
                            },
                            success: function(result2) {
                                console.log(result2);
                                document.getElementById('loaderView').style.display = 'none';
                                document.getElementById('absence').style.display = 'block';

                                if (result2.length != 0) {

                                    if (self.filterYearCallCount <= 3) { // Clear only on first 3 calls
                                        self.LeaveDet([]);
                                    }

                                    for (var i = 0; i <= result2.length; i++) {
                                        self.LeaveDet.push({
                                            'no': i + 1,
                                            'id': result2[i][0],
                                            'start_date': result2[i][1],
                                            'end_date': result2[i][2],
                                            'leave_type': result2[i][3],
                                            'leave_reason': result2[i][4],
                                            'status': result2[i][5]
                                        });
                                    }
                                }
                            }
                        });
                    }
                }, 10); // 1-second debounce delay
                
                self.LeaveData = new ArrayDataProvider(this.LeaveDet, { keyAttributes: "id" });

                self.filter2 = ko.observable('');

                self.LeaveData = ko.computed(function () {
                    let filterCriterion = null;
                    if (self.filter2() && this.filter2() != '') {
                        filterCriterion = ojdataprovider_1.FilterFactory.getFilter({
                            filterDef: { text: self.filter2() }
                        });
                    }
                    const arrayDataProvider = new ArrayDataProvider(self.LeaveDet, { 
                        keyAttributes: 'id',
                        sortComparators: {
                            comparators: new Map().set("dob", this.comparator),
                        },
                    });
                    
                    return new ListDataProviderView(arrayDataProvider, { filterCriterion: filterCriterion });
                }, self);

                self.handleValue = () => {                
                    self.filter2(document.getElementById('searchFilter2').rawValue);
                };

                self.leaveTaken = ko.observable('');
                self.leaveRemaining = ko.observable('');

                self.getLeaveBalance = () => {

                    document.getElementById('loaderView').style.display = 'block';
                    $.ajax({
                        url: BaseURL + "/HRModuleGetLeaveBalance",
                        type: 'POST',
                        data: JSON.stringify({ 
                            staff_id: sessionStorage.getItem("userId"),
                        }),
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            document.getElementById('loaderView').style.display = 'none';
                            console.log(data);
                            if (data && data.length > 0) {
                                self.leaveTaken(data[0][0]);
                                self.leaveRemaining(data[0][1]);
                            }
                        }
                    });
                };


                self.clockinData=ko.observableArray([])

                self.getClockinDetails=()=>{
                    $.ajax({
                        url: BaseURL + "/getClockinDetails",
                        type: 'POST',
                        data: JSON.stringify({ 
                            staffId: sessionStorage.getItem("userId"),
                        }),
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            console.log(data);
                            
                            if(data.length!=0){
                                self.clockinData([]);
                                for(var i=0;i<data.length;i++){
                                    let date = new Date(data[i].clockin_date);
                                    let day = date.getDate();
                                    let month = date.getMonth() + 1;
                                    let year = date.getFullYear();
                                    let formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
                                    self.clockinData.push({
                                        "slno":i+1,
                                        "date":formattedDate,
                                        "clockInTime": data[i].clockin_time,
                                        "clockInLocation": data[i].clockin_location,
                                        "breakTime": data[i].breaktime,
                                        "clockoutTime": data[i].clockout_time,
                                        "clockOutLocation": data[i].clockout_location
                                    })
                                }
                            }
                        }
                    });
                }

                self.clockInDataProvider = new ArrayDataProvider(self.clockinData, { keyAttributes: "id" });

                
                const now = new Date(); 
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                self.overtimeFromDate=ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(startOfMonth));
                self.overtimeToDate=ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date()))
                self.overTimeData=ko.observableArray([])

                self.getOverTimeData=()=>{
                    $.ajax({
                        url: BaseURL + "/getOverTimeData",
                        type: 'POST',
                        data: JSON.stringify({ 
                            staffId: sessionStorage.getItem("userId"),
                            fromDate: self.overtimeFromDate(),
                            toDate: self.overtimeToDate()
                        }),
                        contentType: "application/json", // Specify the content type as JSON
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            if(data.length!=0){
                                self.overTimeData([]);
                                for(var i=0;i<data.length;i++){
                                    let date = new Date(data[i].clockin_date);
                                    let day = date.getDate();
                                    let month = date.getMonth() + 1;
                                    let year = date.getFullYear();
                                    let formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
                                    self.overTimeData.push({
                                        "slno":i+1,
                                        "date":formattedDate,
                                        "clockInTime": data[i].clockin_time,
                                        "clockOutTime": data[i].clockout_time,
                                        "actualWorkingTime": data[i].actual_working_time,
                                        "expectedWorkingTime": data[i].expected_working_time,
                                        "overTime": data[i].overtime
                                    })
                                }
                            }
                        }
                    });
                }

                self.overTimeDataProvider = new ArrayDataProvider(self.overTimeData, { keyAttributes: "id" });


                //Work Report Section
                self.workReportData = ko.observableArray([]);
                self.getWorkReport = ()=>{
                    $.ajax({
                        url: BaseURL+"/getStaffWorkReport",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId : sessionStorage.getItem("userId"),
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            self.workReportData.removeAll();
                            if (data.length != 0) { 
                                for (var i = 0; i < data.length; i++) {
                                    self.workReportData.push({
                                        slNo: i+1,
                                        id: data[i].id,
                                        date: data[i].created_date,
                                        subject: data[i].subject,
                                        report: data[i].report,
                                        status: data[i].status
                                    })
                                }
                            }
                        }
                    })
                }
                self.workReportDataProvider = new ArrayDataProvider(self.workReportData, {
                    keyAttributes: "id",
                });

                self.workReportView=ko.observable();
                self.workReportViewSubject=ko.observable();
                self.showReportContent=(e,row)=>{
                    self.workReportViewSubject(row.data.subject)
                    let content = row.data.report;
                    document.getElementById("reportView").innerHTML=content
                    let popUpContent = document.getElementById("viewWorkReport");
                    popUpContent.open();
                }

                self.closeViewWorkReport=()=>{
                    let popUpContent = document.getElementById("viewWorkReport");
                    popUpContent.close();
                }

                self.reportSendAgain=(e,row)=>{
                    let loader = document.getElementById("loaderPopup");
                    loader.open();
                    const requestId=row.data.id;
                    let btn = e.currentTarget
                    $.ajax({
                        url: BaseURL+"/sendAgainReport",
                        type: 'POST',
                        data: JSON.stringify({
                            reportId : requestId,
                        }),
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInetrval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                        },
                        success: function (data) {
                            let loader = document.getElementById("loaderPopup");
                            loader.close();
                            const targetCell = e.target.closest('td');
                            btn.style.display="none"
                            if (targetCell) {
                                const reportSendDoneButton = targetCell.querySelector('#report-send-done');
                                if (reportSendDoneButton) {
                                    reportSendDoneButton.style.display = 'block'; 
                                }
                            }
                        }
                    })
                }
            
                self.lineManagerRole = ko.observable('');

                self.getRoleForLineManager = () => {
                    document.getElementById('loaderView').style.display = 'block';              
                    $.ajax({
                        url: BaseURL + "/HRModuleGetRoleForLineManager",
                        type: 'POST',
                        data: JSON.stringify({
                            staffId: sessionStorage.getItem("userId")
                        }),
                        contentType: 'application/json',
                        dataType: 'json',
                        timeout: sessionStorage.getItem("timeInterval"),
                        context: self,
                        error: function (xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            document.getElementById('loaderView').style.display = 'none';
                        },
                        success: function (data) {
                            console.log(data);
                            document.getElementById('loaderView').style.display = 'none';
                            self.lineManagerRole(data[0][0]);
                        }
                    });
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
        return  editStaff;
    }
);