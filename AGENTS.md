# Agent guide

This repository is four standalone userscripts. Read this before editing. `CLAUDE.md` only points here.

## Architecture

`Step1.js` through `Step4.js` are the product. Each file is a complete userscript: a `// ==UserScript==` block, then an IIFE. Tampermonkey installs that file as-is. There is no shared module, no bundler, and no HTML UI in this repo.

| Step | Page target                | Action                                       |
| ---- | -------------------------- | -------------------------------------------- |
| 1    | `#login_pass`, `#Login`    | Set the password placeholder and click Login |
| 2    | global `go_manual`         | Call it                                      |
| 3    | `#Status_topnav`           | Click it                                     |
| 4    | global `wan_button_action` | Call it with the WAN connect URL             |

`go_manual` and `wan_button_action` belong to the D-Link admin page. They are declared as readonly globals in `eslint.config.js`. Do not import them, polyfill them, or rewrite the call into a `fetch` of our own.

All four `@match` lines are `http://192.168.0.1/index.asp`. The extension therefore injects every installed script on every load of that URL. Each script returns immediately when its target is missing, so a login page does not throw on Steps 2–4. They still do not sequence themselves. Do not add timers, `sessionStorage` handoffs, or a merged script unless someone asks. That coordination was left out on purpose: the 2016 files are four separate actions, and there is no router here to prove a new order against.

The scripts see the document of the frame whose URL matches `@match`. They do not search child frames. If a firmware move puts the button on a different URL, change `@match` (in every file) rather than walking `frames[]`.

## Commands

Node.js 22.13 or newer. CI uses Node.js 24 (`.nvmrc`).

```bash
npm ci
npm test              # node --test
npm run lint          # eslint
npm run format        # prettier --write
npm run format:check
node --check Step1.js # syntax only; the script still needs a browser
```

There is no dev server and no application to boot.

## Conventions

- Keep each step installable on its own. No `import`, no `require`, no `GM_*`, `@grant none`.
- `@match` is a literal URL. A constant in the script cannot update it. When the host changes, update every `@match` and the URL string in `Step4.js`. The test compares those hosts.
- `@run-at document-idle` is deliberate, so the login form exists before Step 1 reads it.
- Missing DOM nodes and missing page functions must return, not throw.
- The password in `Step1.js` stays `<Put router password here>`. Replace it only in a local, uncommitted copy. Do not teach the test to accept a real password. A userscript has no environment variables; do not invent a `process.env` path.
- Userscripts use 4-space indent, matching the 2016 files. Other files use 2 spaces. Prettier is configured that way.
- Leave `@name`, `@author`, `@namespace`, and the description text alone. Version is `0.2` because the missing-target path changed.
- Do not add a license file.

## Gotchas

- Running `node Step1.js` does not log into a router. The tests execute the files with `vm` against a fake `document`.
- `typeof go_manual` is how Step 2 and Step 4 detect a page function that may not exist. In strict mode that check is safe; reading the name when it is missing is not.
- The connect URL is passed to the router's function. Do not replace that with a direct request, and do not document ways to hit the endpoint without the login step.
- HTTP in `@match` matches the old admin UI. Flipping it to HTTPS changes which page the extension injects into.
- Dev dependencies are pinned in `package.json` and `package-lock.json`. ESLint 10 needs Node `^22.13` or `>=24`.
