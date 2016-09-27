// ==UserScript==
// @name         Automatic_Reconnect_Dlink-Step4
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automates reclicking on connect on Dlink routers for unstable internet connections
// @author       Pranav Prem
// @match        http://192.168.0.1/index.asp
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    wan_button_action('http://192.168.0.1/Status/wan_button_action.asp?connect=true');
})();
