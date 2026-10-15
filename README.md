# Automatic Reconnect D-Link

Four [userscripts](https://en.wikipedia.org/wiki/Userscript) that log into a D-Link router admin page and press **Connect** on the WAN status screen. They were written for a home router that dropped its link often enough that clicking through the admin UI by hand got old.

There is no page of our own to screenshot. The only interface is the router's web admin, and these files replay four clicks on it.

## Original context

Pranav Prem wrote this on 27 September 2016, in one sitting. The repository history is that evening: a first README at 22:56 IST, then `Step1.js` through `Step4.js` by 23:04. It is a personal utility. Nothing in the history ties it to a class, an employer, or an internship. The original README called it a "dumb script" for a D-Link that disconnected on an erratic connection, and the GitHub description still says the same thing.

The admin UI lived at `http://192.168.0.1/index.asp`, which is the factory address for a lot of D-Link home routers from that period. The four steps follow that firmware's recovery path:

1. Type the admin password and press Login.
2. Leave the setup wizard with `go_manual()`.
3. Open the Status section.
4. Call the page's own `wan_button_action(...)` with `Status/wan_button_action.asp?connect=true`.

That connect URL is the WAN button used by classic D-Link firmware (DIR-605L and other models that shipped the same status page). If a later firmware renamed the fields or the functions, a step finds nothing and returns.

## How it works

Each file is one userscript. An extension injects it into the page named in `@match`. The script then does a single thing:

| File       | What it looks for          | What it does                                                       |
| ---------- | -------------------------- | ------------------------------------------------------------------ |
| `Step1.js` | `#login_pass` and `#Login` | Writes the password and clicks Login                               |
| `Step2.js` | `go_manual`                | Calls that function, which this firmware uses to enter manual mode |
| `Step3.js` | `#Status_topnav`           | Clicks the Status tab                                              |
| `Step4.js` | `wan_button_action`        | Asks the page to open the WAN connect URL                          |

`go_manual` and `wan_button_action` are not defined in this repository. The router page defines them. `@grant none` means the scripts use the page's own JavaScript environment rather than an extension API.

All four scripts list the same `@match`, so the extension runs every installed script on each load of that URL. They do not talk to each other, and they do not wait. A script whose element or function is missing returns without throwing, which is what lets Step 1 sit on the login screen while Steps 2–4 wait for a later load of the same URL. If the firmware changes screens without loading `index.asp` again, reload the page, or enable the scripts one at a time in order. That one-at-a-time install is how the files were originally added.

Nothing polls. A dropped link is picked up only when `index.asp` loads again.

## Run it today

You need a desktop browser (Chrome, Edge, or Firefox) and a userscript extension. [Tampermonkey](https://www.tampermonkey.net/) and [Violentmonkey](https://violentmonkey.github.io/) are the straightforward choices. [Greasemonkey](https://www.greasespot.net/) can run these too: they stay on `@grant none` and never call `GM_*` APIs. The `@namespace` value `http://tampermonkey.net/` is only an identifier. Leave it as it is in every extension.

1. Install the extension.
2. Create a new userscript for each file and paste the file in, or overwrite the template with it. The dashboard editor is the reliable install path. These files keep their 2016 names (`Step1.js`, not `Step1.user.js`); dragging a file onto the dashboard only auto-installs if the name ends in `.user.js`.
3. In `Step1.js`, replace `<Put router password here>` with the admin password. The extension stores the script on this computer. Do not commit the real password.
4. If the router is not at `192.168.0.1`, replace that host in every `@match` line and in the URL string in `Step4.js`. The `@match` host has to be written out literally. A variable in the script cannot change it. Keep the two hosts the same.
5. Visit `http://<router>/index.asp` while the scripts are enabled.

The admin page in this firmware is HTTP. Point `@match` at HTTPS only when the router actually serves the admin UI on HTTPS.

To check the repository itself (metadata, the click behavior, lint, formatting):

```bash
# Node.js 24 is what CI uses. Node.js 22.13 or newer can run the checks locally.
npm ci
npm test
npm run lint
npm run format:check
```

## Tech stack

- Plain JavaScript userscripts. No compiler, bundler, or runtime dependencies.
- A userscript manager (Tampermonkey, Violentmonkey, or Greasemonkey) to install them in the browser.
- Node.js 24 in CI, only to run the tests and the linter. The scripts do not run on Node.

## Project structure

```
Step1.js                  Login
Step2.js                  Manual mode
Step3.js                  Status tab
Step4.js                  WAN connect
tests/userscripts.test.js Header and behavior checks
eslint.config.js          Linting, including the router page's globals
.github/workflows/ci.yml  npm test, lint, and format check on Node 24
AGENTS.md                 Notes for people and agents editing the repo
CLAUDE.md                 Pointer to AGENTS.md
```

## Password

`Step1.js` still has the original placeholder, `<Put router password here>`. That string is not a password. Put the real one in your local copy of the script only. `npm test` expects the placeholder, so committing a real password fails the test on purpose.
