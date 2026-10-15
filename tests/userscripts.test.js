import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const steps = ["Step1.js", "Step2.js", "Step3.js", "Step4.js"];
const PASSWORD_PLACEHOLDER = "<Put router password here>";
const ROUTER_ORIGIN = "http://192.168.0.1";

function read(name) {
  return fs.readFileSync(path.join(root, name), "utf8");
}

function header(source) {
  const block = source.match(/==UserScript==([\s\S]*?)==\/UserScript==/);
  assert.ok(block, "userscript header is present");
  const meta = {};
  for (const line of block[1].split("\n")) {
    const match = line.match(/@(\S+)\s+(.*)/);
    if (!match) {
      continue;
    }
    meta[match[1]] = match[2].trim();
  }
  return meta;
}

function run(source, sandbox) {
  vm.runInNewContext(source, sandbox, { filename: "userscript.js" });
}

function fakeDocument(elements) {
  return {
    getElementById(id) {
      return Object.prototype.hasOwnProperty.call(elements, id)
        ? elements[id]
        : null;
    },
  };
}

test("each step is a standalone userscript for the same router page", () => {
  for (const name of steps) {
    const source = read(name);
    const meta = header(source);
    assert.equal(meta.namespace, "http://tampermonkey.net/");
    assert.equal(meta.author, "Pranav Prem");
    assert.equal(meta.grant, "none");
    assert.equal(meta["run-at"], "document-idle");
    assert.equal(meta.match, `${ROUTER_ORIGIN}/index.asp`);
    assert.match(meta.name, /^Automatic_Reconnect_Dlink-Step[1-4]$/);
    assert.match(source, /\(function \(\) \{\s*"use strict";/);
    assert.doesNotMatch(
      source,
      /\b(import|require|process|GM_|unsafeWindow)\b/
    );
  }
});

test("Step1 fills the password placeholder and clicks Login", () => {
  const clicks = [];
  const passwordField = { value: "" };
  const loginButton = {
    click() {
      clicks.push("Login");
    },
  };
  run(read("Step1.js"), {
    document: fakeDocument({
      login_pass: passwordField,
      Login: loginButton,
    }),
  });
  assert.equal(passwordField.value, PASSWORD_PLACEHOLDER);
  assert.deepEqual(clicks, ["Login"]);
});

test("Step1 does nothing when the login form is not on the page", () => {
  assert.doesNotThrow(() => {
    run(read("Step1.js"), { document: fakeDocument({}) });
  });
});

test("Step2 calls go_manual when the router page defines it", () => {
  let calls = 0;
  run(read("Step2.js"), {
    document: fakeDocument({}),
    go_manual() {
      calls += 1;
    },
  });
  assert.equal(calls, 1);
});

test("Step2 does nothing when go_manual is missing", () => {
  assert.doesNotThrow(() => {
    run(read("Step2.js"), { document: fakeDocument({}) });
  });
});

test("Step3 clicks the Status tab when it is present", () => {
  const clicks = [];
  run(read("Step3.js"), {
    document: fakeDocument({
      Status_topnav: {
        click() {
          clicks.push("Status");
        },
      },
    }),
  });
  assert.deepEqual(clicks, ["Status"]);
});

test("Step3 does nothing when the Status tab is absent", () => {
  assert.doesNotThrow(() => {
    run(read("Step3.js"), { document: fakeDocument({}) });
  });
});

test("Step4 asks the router page to connect the WAN", () => {
  const urls = [];
  run(read("Step4.js"), {
    document: fakeDocument({}),
    wan_button_action(url) {
      urls.push(url);
    },
  });
  assert.deepEqual(urls, [
    `${ROUTER_ORIGIN}/Status/wan_button_action.asp?connect=true`,
  ]);
  assert.equal(
    new URL(urls[0]).host,
    new URL(header(read("Step4.js")).match).host
  );
});

test("Step4 does nothing when wan_button_action is missing", () => {
  assert.doesNotThrow(() => {
    run(read("Step4.js"), { document: fakeDocument({}) });
  });
});
