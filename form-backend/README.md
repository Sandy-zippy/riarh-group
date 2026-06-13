# Riarh Group — contact form backend (Google Apps Script)

The static site's Contact form POSTs to a Google Apps Script web app bound to the
**"Riarh Group — Website Leads"** Sheet. On each submission the script appends a
row to the Sheet and emails **info@riarhgroup.com** (Reply-To = the lead).
No third-party form service, no submission cap.

- **Code.gs** — `doPost` handler (Sheet append + email), `setup` (creates Leads tab),
  `doGet` (health check).
- **appsscript.json** — web app deployed `ANYONE_ANONYMOUS`, runs as the deploying user.
- Bound Sheet: `19tDYyIm0kmBDjax6zSyxPLJONN0S7-Wxfgn5v5iuNOE`
- Script: `1lWLgdK_wRMqZSOK9Zwqy3o_zRonS0vWTvkwI-LRGcEfilOjiYltb2rl4`

Endpoint URL is set in `src/data/site.ts` (`FORM_ENDPOINT`). Deploying/authorizing
the web app requires an interactive Google consent by the script owner.
