"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function ($, hash) {
  var $_VERSION = "2.0.0-alpha13";
  var $_BUILD = 13;
  var $_COOKIE_NAME = "verzth_stats";
  var $_SESSION_NAME = "verzth_sess";
  var $_ADS_IDENTIFICATION_NAME = 'verzth_pa';
  var $_ADS_SESSION_NAME = 'verzth_session';
  var $_KEY = "KTe2DztaUw";

  this.Statistic = function () {
    var defaults = {
      serverUrl: "",
      key: "",
      page: $(location).attr('host') === '' ? 'unknown' : $(location).attr('host'),
      page_type: "website",
      type: "hit"
    };
    this.model = null;
    this.queueModel = [];

    if (arguments[0] && _typeof(arguments[0]) === "object") {
      this.options = extendDefaults.call(this, defaults, arguments[0]);
      this.options.apiUrl = this.options.serverUrl;
    } else this.options = defaults;

    initCookie.call(this);
  };

  function extendDefaults(source, properties) {
    var property;

    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }

    return source;
  }

  function str_rand(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  function initCookie() {
    var keys = [$_ADS_IDENTIFICATION_NAME, $_ADS_SESSION_NAME];
    var date = new Date();
    var ezid;

    try {
      ezid = JSON.parse(hash.AES.decrypt(getCookie(), hash.enc.Base64.stringify(hash.enc.Utf8.parse($_KEY))).toString(hash.enc.Utf8));
    } catch (e) {
      ezid = {};
    }

    $(keys).each(function (i, key) {
      if (!ezid.hasOwnProperty(key)) {
        switch (key) {
          case $_ADS_IDENTIFICATION_NAME:
            {
              ezid[key] = 'WEBS' + str_rand(22) + pad2(date.getFullYear()) + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
            }
            break;

          case $_ADS_SESSION_NAME:
            {
              ezid[key] = 'LIBS' + str_rand(22) + pad2(date.getFullYear()) + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
            }
            break;
        }

        setCookie(ezid);
      }
    });
  }

  function getCookie() {
    var x = document.cookie.split(";");
    var val = false;
    x.forEach(function (y, i) {
      while (y.charAt(0) == " ") {
        y = y.substring(1, y.length);
      }

      var t = y.split("=");

      if ($_COOKIE_NAME === t[0]) {
        val = t[1];
      }
    });
    if (val) return val;else {
      setCookie({});
      return hash.AES.encrypt(JSON.stringify({}), hash.enc.Base64.stringify(hash.enc.Utf8.parse($_KEY)));
    }
  }

  function setCookie(cookie) {
    var date = new Date();
    date.setFullYear(date.getFullYear() + 3);
    document.cookie = $_COOKIE_NAME + "=" + hash.AES.encrypt(JSON.stringify(cookie), hash.enc.Base64.stringify(hash.enc.Utf8.parse($_KEY))) + ";expires=" + date.toGMTString() + ";path=/";
  }

  function setEZID(key, value) {
    var ezid = JSON.parse(hash.AES.decrypt(getCookie(), hash.enc.Base64.stringify(hash.enc.Utf8.parse($_KEY))).toString(hash.enc.Utf8));
    ezid[key] = value;
    setCookie(ezid);
  }

  function getEZID(key) {
    var date = new Date();
    var ezid;

    try {
      ezid = JSON.parse(hash.AES.decrypt(getCookie(), hash.enc.Base64.stringify(hash.enc.Utf8.parse($_KEY))).toString(hash.enc.Utf8));
    } catch (e) {
      ezid = {};
    }

    if (!ezid.hasOwnProperty(key)) {
      switch (key) {
        case $_ADS_IDENTIFICATION_NAME:
          {
            ezid[key] = 'WEBS' + str_rand(22) + pad2(date.getFullYear()) + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
          }
          break;

        case $_ADS_SESSION_NAME:
          {
            ezid[key] = 'LIBS' + str_rand(22) + pad2(date.getFullYear()) + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
          }
          break;
      }

      setCookie(ezid);
    }

    if (!hasSession()) {
      ezid[key] = 'LIBS' + str_rand(22) + pad2(date.getFullYear()) + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
      setCookie(ezid);
      document.cookie = $_SESSION_NAME + "=true;path=/;";
    }

    return ezid[key];
  }

  function hasSession() {
    var x = document.cookie.split(";");
    var val = false;
    x.forEach(function (y, i) {
      while (y.charAt(0) === " ") {
        y = y.substring(1, y.length);
      }

      var t = y.split("=");

      if ($_SESSION_NAME === t[0]) {
        val = t[1];
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

  function getOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
    }

    if (/android|okhttp/i.test(userAgent)) {
      return "Android";
    }

    if (/POSTMAN/.test(userAgent)) {
      return "POSTMAN";
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "iOS";
    }

    if (/Mac68K|MacPPC|MacIntel/.test(userAgent) && !window.MSStream) {
      return "Mac";
    }

    if (navigator.appVersion.indexOf("Win") !== -1) return "Windows";
    if (navigator.appVersion.indexOf("X11") !== -1) return "UNIX";
    if (navigator.appVersion.indexOf("Linux") !== -1) return "Linux";
    return navigator.platform;
  }

  function getBrowserName() {
    var name = navigator.appCodeName;

    if (navigator.userAgent.indexOf("MSIE") !== -1) {
      name = "MSIE";
    } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
      name = "Firefox";
    } else if (navigator.userAgent.indexOf("Opera") !== -1) {
      name = "Opera";
    } else if (navigator.userAgent.indexOf("Chrome") !== -1) {
      name = "Chrome";
    } else if (navigator.userAgent.indexOf("Safari") !== -1) {
      name = "Safari";
    }

    return name;
  }

  function getBrowserVersion() {
    var version = navigator.appVersion.substring(0, 4).trim();
    var index = -1;

    if ((index = navigator.userAgent.indexOf("MSIE")) !== -1) {
      version = "MSIE";
    } else if ((index = navigator.userAgent.indexOf("Firefox")) !== -1) {
      version = "Firefox";
    } else if ((index = navigator.userAgent.indexOf("Opera")) !== -1) {
      version = "Opera";
    } else if ((index = navigator.userAgent.indexOf("Chrome")) !== -1) {
      version = "Chrome";
    } else if ((index = navigator.userAgent.indexOf("Safari")) !== -1) {
      version = "Safari";
    }

    if (index !== -1) {
      var vStr = navigator.userAgent.substring(index);
      var last = vStr.indexOf(" ");
      if (last !== -1) version = vStr.substring(vStr.indexOf("/") + 1, last);else version = vStr.substring(vStr.indexOf("/") + 1);
    }

    return version;
  }

  function createModel() {
    return {
      session_id: getSessionId(),
      token: str_rand(15),
      page: this.options.page,
      page_type: this.options.page_type,
      isInteraction: 0,
      age: null,
      gender: null,
      user_id: null,
      carrier: "statisticjs:" + $_BUILD + ":v" + $_VERSION,
      device_id: getIdentification(),
      device: {
        brand: getBrowserName(),
        version: getBrowserVersion(),
        type: "Web",
        os: getOperatingSystem()
      },
      longitude: null,
      latitude: null,
      attributes: {},
      callforward: null
    };
  }

  Statistic.prototype.isModelAvailable = function () {
    return this.model !== null;
  };

  Statistic.prototype.dismiss = function () {
    this.model = null;
  };

  Statistic.prototype.createHit = function () {
    this.options.type = "hit";
    this.model = createModel.call(this);
    return this;
  }; //CONTENT SINGLE


  Statistic.prototype.createContent = function () {
    this.options.type = "content";
    this.model = createModel.call(this);

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

    Statistic.prototype.setId = function (id) {
      this.model.cid = id;
      return this;
    };

    Statistic.prototype.setCallforward = function (link) {
      this.model.callforward = link;
      return this;
    };

    return this;
  }; //CONTENT BULK


  Statistic.prototype.makeContent = function () {
    if (this.model === null) {
      this.options.type = "content_bulk";
      this.model = createModel.call(this);
      this.model.data = [];
    }

    Statistic.prototype.addContent = function () {
      var tempData = {
        isInteraction: 0,
        attributes: {}
      };

      Statistic.prototype.putCustom = function (name, value) {
        tempData.attributes[name] = value;
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

      Statistic.prototype.setId = function (id) {
        tempData.cid = id;
        return this;
      };

      Statistic.prototype.commit = function () {
        delete Statistic.prototype.setId;
        delete Statistic.prototype.setType;
        delete Statistic.prototype.setCategory;
        delete Statistic.prototype.setAction;
        this.model.data.push(tempData);
        delete Statistic.prototype.commit;

        Statistic.prototype.putCustom = function (name, value) {
          this.model.attributes[name] = value;
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

  Statistic.prototype.isDataAvailable = function () {
    return this.isModelAvailable() && this.model.data.length > 0;
  };

  Statistic.prototype.clearData = function () {
    if (this.isModelAvailable()) this.model.data = [];
  }; // EVENT SINGLE


  Statistic.prototype.createEvent = function () {
    this.options.type = "event";
    this.model = createModel.call(this);

    Statistic.prototype.setType = function (type) {
      this.model.type = type;
      return this;
    };

    Statistic.prototype.setCategory = function (category) {
      this.model.category = category;
      return this;
    };

    Statistic.prototype.setName = function (name) {
      this.model.name = name;
      return this;
    };

    Statistic.prototype.setId = function (id) {
      this.model.cid = id;
      return this;
    };

    Statistic.prototype.setOk = function (state) {
      this.model.isOk = state || 1;
      return this;
    };

    Statistic.prototype.setStatus = function (status) {
      this.model.status = status;
      return this;
    };

    Statistic.prototype.setStatusCode = function (code) {
      this.model.status_code = code;
      return this;
    };

    Statistic.prototype.setStatusMessage = function (message) {
      this.model.status_message = message;
      return this;
    };

    return this;
  }; //EVENT BULK


  Statistic.prototype.makeEvent = function () {
    if (this.model === null) {
      this.options.type = "event_bulk";
      this.model = createModel.call(this);
      this.model.data = [];
    }

    Statistic.prototype.addEvent = function () {
      var tempData = {
        isInteraction: 0,
        attributes: {}
      };

      Statistic.prototype.putCustom = function (name, value) {
        tempData.attributes[name] = value;
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

      Statistic.prototype.setName = function (name) {
        tempData.name = name;
        return this;
      };

      Statistic.prototype.setId = function (id) {
        tempData.cid = id;
        return this;
      };

      Statistic.prototype.setOk = function () {
        tempData.isOk = arguments[0] || 1;
        return this;
      };

      Statistic.prototype.setStatus = function (status) {
        tempData.status = status;
        return this;
      };

      Statistic.prototype.setStatusCode = function (code) {
        tempData.status_code = code;
        return this;
      };

      Statistic.prototype.setStatusMessage = function (message) {
        tempData.status_message = message;
        return this;
      };

      Statistic.prototype.commit = function () {
        delete Statistic.prototype.setId;
        delete Statistic.prototype.setType;
        delete Statistic.prototype.setCategory;
        delete Statistic.prototype.setName;
        delete Statistic.prototype.setOk;
        delete Statistic.prototype.setStatus;
        delete Statistic.prototype.setStatusCode;
        delete Statistic.prototype.setStatusMessage;
        this.model.data.push(tempData);
        delete Statistic.prototype.commit;

        Statistic.prototype.putCustom = function (name, value) {
          this.model.attributes[name] = value;
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

  Statistic.prototype.setPage = function (name) {
    this.model.page = name;
    return this;
  };

  Statistic.prototype.setPageType = function (name) {
    this.model.page_type = name;
    return this;
  };

  Statistic.prototype.setInteraction = function (state) {
    this.model.isInteraction = state || 0;
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

  Statistic.prototype.putCustom = function (name, value) {
    this.model.attributes[name] = value;
    return this;
  };

  function send() {
    if (this.model !== null) {
      this.queueModel.push(this.model);

      switch (this.options.type) {
        case "content":
          {
            $.ajax({
              type: "POST",
              url: this.options.apiUrl + "content",
              headers: {
                'Authorization': 'Basic ' + btoa(this.options.key + ":"),
                'Accept': 'application/json'
              },
              contentType: 'application/json',
              dataType: 'json',
              data: JSON.stringify(this.queueModel.pop())
            });
          }
          break;

        case "content_bulk":
          {
            $.ajax({
              type: "POST",
              url: this.options.apiUrl + "content",
              headers: {
                'Authorization': 'Basic ' + btoa(this.options.key + ":"),
                'Accept': 'application/json'
              },
              contentType: 'application/json',
              dataType: 'json',
              data: JSON.stringify(this.queueModel.pop())
            });
            this.clearData();
          }
          break;

        case "event":
          {
            $.ajax({
              type: "POST",
              url: this.options.apiUrl + "event",
              headers: {
                'Authorization': 'Basic ' + btoa(this.options.key + ":"),
                'Accept': 'application/json'
              },
              contentType: 'application/json',
              dataType: 'json',
              data: JSON.stringify(this.queueModel.pop())
            });
          }
          break;

        case "event_bulk":
          {
            $.ajax({
              type: "POST",
              url: this.options.apiUrl + "event",
              headers: {
                'Authorization': 'Basic ' + btoa(this.options.key + ":"),
                'Accept': 'application/json'
              },
              contentType: 'application/json',
              dataType: 'json',
              data: JSON.stringify(this.queueModel.pop())
            });
            this.clearData();
          }
          break;

        default:
          {
            $.ajax({
              type: "POST",
              url: this.options.apiUrl + "hit",
              headers: {
                'Authorization': 'Basic ' + btoa(this.options.key + ":"),
                'Accept': 'application/json'
              },
              contentType: 'application/json',
              dataType: 'json',
              data: JSON.stringify(this.queueModel.pop())
            });
          }
      }
    }
  }

  Statistic.prototype.send = function () {
    var parent = this;

    if (location.protocol === 'https:' && parent.model != null && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        parent.model.longitude = position.coords.longitude;
        parent.model.latitude = position.coords.latitude;
        send.call(parent);
      }, function (error) {
        send.call(parent);
      });
    } else {
      send.call(parent);
    }
  };
})(jQuery, CryptoJS);