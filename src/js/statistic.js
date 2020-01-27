(function ($,hash,TCX) {
    var $_VERSION = "0.0.1";
    var $_BUILD = 1;

    var $_COOKIE_NAME = "verzth_stats";
    var $_SESSION_NAME = "verzth_sess";

    var $_ADS_IDENTIFICATION_NAME = 'verzth_pa';
    var $_ADS_SESSION_NAME = 'verzth_session';

    var $_KEY = "KTe2DztaUw";
    var tcx = new TCX();

    this.Statistic = function () {
        var defaults = {
            serverUrl : "",
            page : $(location).attr('host')===''?'unknown':$(location).attr('host'),
            page_type : "website",
            type : "hit",
            tcx : null
        };

        this.model = null;
        this.queueModel = [];

        if(arguments[0] && typeof arguments[0] === "object"){
            this.options = extendDefaults(defaults,arguments[0]);
            this.options.apiUrl = this.options.serverUrl+'fig/';
        }else this.options = defaults;

        this.tcx = this.options.tcx;
        delete this.options.tcx;

        initCookie.call(this);
    };

    function extendDefaults(source,properties) {
        var property;
        for(property in properties){
            if(properties.hasOwnProperty(property)){
                source[property] = properties[property];
            }
        }
        return source;
    }

    function str_rand(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function initCookie() {
        var keys = [$_ADS_IDENTIFICATION_NAME,$_ADS_SESSION_NAME];
        var date = new Date();
        var ezid;
        try{
            ezid = JSON.parse(hash.AES.decrypt(getCookie(),hash.enc.Base64.stringify(hash.enc.Utf8.parse($_KEY))).toString(hash.enc.Utf8));
        }catch (e){
            ezid = {};
        }
        $(keys).each(function (i,key) {
            if(!ezid.hasOwnProperty(key)){
                switch (key){
                    case $_ADS_IDENTIFICATION_NAME : {
                        ezid[key] = 'WEBS' + str_rand(22) + pad2(date.getFullYear())+
                            pad2(date.getMonth()+1)+pad2(date.getDate())+pad2(date.getHours())+
                            pad2(date.getMinutes())+pad2(date.getSeconds());
                    }break;
                    case $_ADS_SESSION_NAME : {
                        ezid[key] = 'LIBS' + str_rand(22) + pad2(date.getFullYear())+
                            pad2(date.getMonth()+1)+pad2(date.getDate())+pad2(date.getHours())+
                            pad2(date.getMinutes())+pad2(date.getSeconds());
                    }break;
                }
                setCookie(ezid);
            }
        });
    }

    function getCookie() {
        var x = document.cookie.split(";");
        var val=false;
        x.forEach(function (y,i) {
            while (y.charAt(0) == " ")y = y.substring(1,y.length);
            var t = y.split("=");
            if($_COOKIE_NAME === t[0]){
                val=t[1];
            }
        });
        if(val)return val;
        else{
            setCookie({});
            return hash.AES.encrypt(JSON.stringify({}),hash.enc.Base64.stringify(hash.enc.Utf8.parse($_KEY)));
        }
    }
    function setCookie(cookie) {
        var date = new Date();
        date.setFullYear(date.getFullYear()+3);
        document.cookie = $_COOKIE_NAME+"="+hash.AES.encrypt(JSON.stringify(cookie),hash.enc.Base64.stringify(hash.enc.Utf8.parse($_KEY)))+";expires="+date.toGMTString()+";path=/";
    }

    function setEZID(key,value) {
        var ezid = JSON.parse(hash.AES.decrypt(getCookie(),hash.enc.Base64.stringify(hash.enc.Utf8.parse($_KEY))).toString(hash.enc.Utf8));
        ezid[key] = value;
        setCookie(ezid);
    }
    function getEZID(key) {
        var date = new Date();
        var ezid;
        try{
            ezid = JSON.parse(hash.AES.decrypt(getCookie(),hash.enc.Base64.stringify(hash.enc.Utf8.parse($_KEY))).toString(hash.enc.Utf8));
        }catch (e){
            ezid = {};
        }
        if(!ezid.hasOwnProperty(key)){
            switch (key){
                case $_ADS_IDENTIFICATION_NAME : {
                    ezid[key] = 'WEBS' + str_rand(22) + pad2(date.getFullYear())+
                        pad2(date.getMonth()+1)+pad2(date.getDate())+pad2(date.getHours())+
                        pad2(date.getMinutes())+pad2(date.getSeconds());
                }break;
                case $_ADS_SESSION_NAME : {
                    ezid[key] = 'LIBS' + str_rand(22) + pad2(date.getFullYear())+
                        pad2(date.getMonth()+1)+pad2(date.getDate())+pad2(date.getHours())+
                        pad2(date.getMinutes())+pad2(date.getSeconds());
                }break;
            }
            setCookie(ezid);
        }
        if(!hasSession()){
            ezid[key] = 'LIBS' + str_rand(22) + pad2(date.getFullYear())+
                pad2(date.getMonth()+1)+pad2(date.getDate())+pad2(date.getHours())+
                pad2(date.getMinutes())+pad2(date.getSeconds());
            setCookie(ezid);
            document.cookie = $_SESSION_NAME+"=true;path=/;";
        }
        return ezid[key];
    }

    function hasSession() {
        var x = document.cookie.split(";");
        var val=false;
        x.forEach(function (y,i) {
            while (y.charAt(0) === " ")y = y.substring(1,y.length);
            var t = y.split("=");
            if($_SESSION_NAME === t[0]){
                val=t[1];
            }
        });
        return val;
    }

    function pad2(number) {
        return (number < 10 ? '0' : '') + number;
    }
    function getSessionId() {
        return getEZID($_ADS_SESSION_NAME);
    }

    function getIdentification() {
        return getEZID($_ADS_IDENTIFICATION_NAME);
    }

    function createModel() {
        return {
            session_id : getSessionId(),
            token : str_rand(15),
            page : this.options.page,
            page_type : this.options.page_type,
            isInteraction : false,
            age : null,
            gender : null,
            user_id : null,
            carrier : "Statistic JS Libs v"+$_VERSION+"("+$_BUILD+")",
            device_id : getIdentification(),
            device_brand : navigator.appCodeName,
            device_version : navigator.appVersion.substring(0, 4).trim(),
            device_type : "Web",
            device_os : navigator.platform,
            longitude : null,
            latitude : null,
            attributes : {},
            callforward : null
        };
    }

    Statistic.prototype.createHit = function() {
        this.options.type = "hit";
        this.model = createModel.call(this);
        return this;
    };

    //CONTENT SINGLE
    Statistic.prototype.createContent = function() {
        this.options.type = "content";
        this.model = createModel.call(this);

        Statistic.prototype.setId = function (id) {
            this.model.id = id;
            return this;
        };
        Statistic.prototype.setType = function (type) {
            this.model.type = type;
            return this;
        };
        Statistic.prototype.setCategory = function (category) {
            this.model.category = category;
            return this;
        };
        Statistic.prototype.setAction = function (action) {
            this.model.action = action;
            return this;
        };
        Statistic.prototype.setCallforward = function (link) {
            this.model.callforward = link;
            return this;
        };

        return this;
    };

    //CONTENT BULK
    Statistic.prototype.makeContent = function() {
        if(this.model===null){
            this.options.type = "content_bulk";
            this.model = createModel.call(this);
            this.model.data = [];
        }

        Statistic.prototype.addContent = function () {
            var tempData = {isInteraction : false,attributes:{}};
            Statistic.prototype.putCustom = function (name,value) {
                tempData.attributes[name] = value;

                return this;
            };
            Statistic.prototype.setId = function (id) {
                tempData.id = id;
                return this;
            };
            Statistic.prototype.setType = function (type) {
                tempData.type = type;
                return this;
            };
            Statistic.prototype.setCategory = function (category) {
                tempData.category = category;
                return this;
            };
            Statistic.prototype.setAction = function (action) {
                tempData.action = action;
                return this;
            };

            Statistic.prototype.commit = function () {
                delete Statistic.prototype.setId;
                delete Statistic.prototype.setType;
                delete Statistic.prototype.setCategory;
                delete Statistic.prototype.setAction;

                this.model.data.push(tempData);

                delete Statistic.prototype.commit;
                Statistic.prototype.putCustom = function (name,value) {
                    this.model.attributes[name]=value;

                    return this;
                };
                return this;
            };

            return this;
        };

        Statistic.prototype.setCallforward = function (link) {
            this.model.callforward = link;
            return this;
        };

        delete Statistic.prototype.putCustom;

        return this;
    };
    Statistic.prototype.isContentAvailable = function () {
        return this.model!==null;
    };
    Statistic.prototype.clearContent = function () {
        this.model=null;
    };

    Statistic.prototype.createEvent = function() {
        this.options.type = "event";
        this.model = createModel.call(this);

        Statistic.prototype.setCategory = function (category) {
            this.model.category = category;
            return this;
        };
        Statistic.prototype.setName = function (name) {
            this.model.name = name;
            return this;
        };
        Statistic.prototype.setType = function (type) {
            this.model.type = type;
            return this;
        };
        Statistic.prototype.setId = function (id) {
            this.model.id = id;
            return this;
        };
        Statistic.prototype.setSuccess = function (state) {
            this.model.isSuccess = state || true;
            return this;
        };
        Statistic.prototype.setRejectionCode = function (code) {
            this.model.rejection_code = code;
            return this;
        };
        Statistic.prototype.setRejectionMessage = function (message) {
            this.model.rejection_message = message;
            return this;
        };

        return this;
    };

    Statistic.prototype.setPage = function (name) {
        this.model.page = name;
        return this;
    };
    Statistic.prototype.setPageType = function (name) {
        this.model.page_type = name;
        return this;
    };
    Statistic.prototype.setInteraction = function (state) {
        this.model.isInteraction = state||false;
        return this;
    };
    Statistic.prototype.setAge = function (age) {
        this.model.age = age;
        return this;
    };
    Statistic.prototype.setGender = function (gender) {
        this.model.gender = gender;
        return this;
    };
    Statistic.prototype.setUserId = function (id) {
        this.model.user_id = id;
        return this;
    };

    Statistic.prototype.putCustom = function (name,value) {
        this.model.attributes[name]=value;

        return this;
    };

    function send(){
        if (this.tcx == null) {
            throw "TCX undefined, please give TCX to the statistic for authentication"
        }
        this.queueModel.push(this.model);
        switch (this.options.type){
            case "content":{
                this.tcx.getToken(function (token) {
                    if(token){
                        $.ajax({
                            type : "POST",
                            url : this.options.apiUrl+"content",
                            headers : {
                                'X-TCX-Type': 'TWTC',
                                'X-TCX-App-Id': this.tcx.getAppID(),
                                'X-TCX-App-Pass': this.tcx.getAppPass(),
                                'X-TCX-Token': hash.enc.Base64.stringify(hash.enc.Utf8.parse(token))
                            },
                            contentType : 'application/json',
                            dataType : 'json',
                            data : JSON.stringify(this.queueModel.pop())
                        });
                    }else{
                        throw "Authorization Failed TCX"
                    }
                }.bind(this));
            }break;
            case "content_bulk":{
                this.tcx.getToken(function (token) {
                    if(token){
                        $.ajax({
                            type : "POST",
                            url : this.options.apiUrl+"content/bulk",
                            headers : {
                                'X-TCX-Type': 'TWTC',
                                'X-TCX-App-Id': this.tcx.getAppID(),
                                'X-TCX-App-Pass': this.tcx.getAppPass(),
                                'X-TCX-Token': hash.enc.Base64.stringify(hash.enc.Utf8.parse(token))
                            },
                            contentType : 'application/json',
                            dataType : 'json',
                            data : JSON.stringify(this.queueModel.pop())
                        });
                    }else{
                        throw "Authorization Failed TCX"
                    }
                }.bind(this));
                this.clearContent();
            }break;
            case "event":{
                this.tcx.getToken(function (token) {
                    if(token){
                        $.ajax({
                            type : "POST",
                            url : this.options.apiUrl+"event",
                            headers : {
                                'X-TCX-Type': 'TWTC',
                                'X-TCX-App-Id': this.tcx.getAppID(),
                                'X-TCX-App-Pass': this.tcx.getAppPass(),
                                'X-TCX-Token': hash.enc.Base64.stringify(hash.enc.Utf8.parse(token))
                            },
                            contentType : 'application/json',
                            dataType : 'json',
                            data : JSON.stringify(this.queueModel.pop())
                        });
                    }else{
                        throw "Authorization Failed TCX"
                    }
                }.bind(this));
            }break;
            default:{
                this.tcx.getToken(function (token) {
                    if(token){
                        $.ajax({
                            type : "POST",
                            url : this.options.apiUrl+"hit",
                            headers : {
                                'X-TCX-Type': 'TWTC',
                                'X-TCX-App-Id': this.tcx.getAppID(),
                                'X-TCX-App-Pass': this.tcx.getAppPass(),
                                'X-TCX-Token': hash.enc.Base64.stringify(hash.enc.Utf8.parse(token))
                            },
                            contentType : 'application/json',
                            dataType : 'json',
                            data : JSON.stringify(this.queueModel.pop())
                        });
                    }else{
                        throw "Authorization Failed TCX"
                    }
                }.bind(this));
            }
        }
    }

    Statistic.prototype.send = function() {
        var parent = this;
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                parent.model.longitude = position.coords.longitude;
                parent.model.latitude = position.coords.latitude;
                send.call(parent);
            },function (error) {
                send.call(parent);
            });
        }else{
            send.call(parent);
        }
    };
}(jQuery,CryptoJS,TCX));
