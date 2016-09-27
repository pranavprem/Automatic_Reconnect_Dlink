// ==UserScript==
// @name         Automatic_Reconnect_Dlink-Step3
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automates reclicking on connect on Dlink routers for unstable internet connections
// @author       Pranav Prem
// @match        http://192.168.0.1/index.asp
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    document.getElementById("Status_topnav").click();
})();
