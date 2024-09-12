define(['ojs/ojcore',"knockout","jquery","appController", "ojs/ojarraydataprovider","ojs/ojlistdataproviderview","ojs/ojdataprovider", "ojs/ojfilepickerutils",
    "ojs/ojinputtext", "ojs/ojformlayout", "ojs/ojvalidationgroup", "ojs/ojselectsingle","ojs/ojdatetimepicker",
     "ojs/ojfilepicker", "ojs/ojpopup", "ojs/ojprogress-circle", "ojs/ojdialog","ojs/ojtable","ojs/ojactioncard","ojs/ojavatar", "ojs/ojradioset"], 
    function (oj,ko,$, app, ArrayDataProvider,ListDataProviderView, ojdataprovider_1, FilePickerUtils) {

        class Task {
            constructor(args) {
                var self = this;

                self.router = args.parentRouter;
                let BaseURL = sessionStorage.getItem("BaseURL")
               
                
                self.connected = function () {
                    if (sessionStorage.getItem("userName") == null) {
                        self.router.go({path : 'signin'});
                    }
                    else {
                        app.onAppSuccess();
                        self.getPurchaseList()
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

                self.getPurchaseList = ()=>{
                    document.getElementById('loaderView').style.display='none';
                }
                
                self.addPurchase = ()=>{
                    self.router.go({path:'addPurchase'})
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
        return  Task;
    }
);