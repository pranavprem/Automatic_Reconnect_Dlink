// ==UserScript==
// @name         Automatic_Reconnect_Dlink-Step3
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automates reclicking on connect on Dlink routers for unstable internet connections
// @author       Pranav Prem
// @match        http://192.168.0.1/index.asp
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    "use strict";

    const statusNav = document.getElementById("Status_topnav");
    if (!statusNav) {
        return;
    }

    statusNav.click();
})();
