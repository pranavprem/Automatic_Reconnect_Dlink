// ==UserScript==
// @name         Automatic_Reconnect_Dlink-Step2
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

    if (typeof go_manual !== "function") {
        return;
    }

    go_manual();
})();
