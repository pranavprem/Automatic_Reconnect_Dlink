// ==UserScript==
// @name         Automatic_Reconnect_Dlink-Step1
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

    // Replace this on your machine. Do not commit a real router password.
    const ROUTER_PASSWORD = "<Put router password here>";

    const passwordField = document.getElementById("login_pass");
    const loginButton = document.getElementById("Login");
    if (!passwordField || !loginButton) {
        return;
    }

    passwordField.value = ROUTER_PASSWORD;
    loginButton.click();
})();
