// ==UserScript==
// @name         Automatic_Reconnect_Dlink-Step4
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

    if (typeof wan_button_action !== "function") {
        return;
    }

    // Keep this host identical to the @match host above.
    wan_button_action(
        "http://192.168.0.1/Status/wan_button_action.asp?connect=true"
    );
})();
