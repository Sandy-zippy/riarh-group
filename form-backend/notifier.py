#!/usr/bin/env python3
"""
Riarh Group — website lead notifier (gws CLI edition).
----------------------------------------------------------------------------
Pulls new contact-form submissions from the VPS buffer
(https://62-72-13-155.nip.io/pending), emails info@riarhgroup.com, and appends
each lead to the "Riarh Group — Website Leads" Google Sheet.

Uses the already-authenticated `gws` CLI for BOTH Gmail and Sheets — no clasp,
no extra OAuth consent (same zero-consent pattern as the bespoke lead notifier).

- Anonymous ingest is handled by the VPS; this only notifies + logs.
- Idempotent: a set of seen lead ids in state.json means each lead emails once.
- Lock file prevents overlapping runs (launchd fires every 2 min).
- Test leads (example.com) are logged to the Sheet but NOT emailed to the client.

Scheduled by: ~/Library/LaunchAgents/com.zippyscale.riarh-notifier.plist
"""

import os, sys, json, base64, subprocess, fcntl, urllib.request, html as _html
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# --- Config -------------------------------------------------------------------
ENDPOINT       = "https://62-72-13-155.nip.io/pending"
SPREADSHEET_ID = "19tDYyIm0kmBDjax6zSyxPLJONN0S7-Wxfgn5v5iuNOE"
SHEET_TAB      = "Leads"
SHEET_URL      = f"https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit"
NOTIFY_TO      = os.environ.get("RIARH_NOTIFY", "info@riarhgroup.com")
NOTIFY_BCC     = os.environ.get("RIARH_BCC", "sandy@zippyscale.com")  # ZippyScale visibility, hidden from client
SENDER_NAME    = "Riarh Group Website"

HOME       = os.path.expanduser("~")
CFG_DIR    = os.path.join(HOME, ".riarh-notifier")
STATE_FILE = os.path.join(CFG_DIR, "state.json")
LOCK_FILE  = os.path.join(CFG_DIR, "run.lock")
LOG_FILE   = os.path.join(CFG_DIR, "notifier.log")
SECRET_FILE= os.path.join(CFG_DIR, "secret")
GWS        = "/opt/homebrew/bin/gws"

HEADERS = ["Timestamp", "Name", "Phone", "Email", "Project Type", "Message"]


def log(msg):
    line = str(msg).rstrip()
    try:
        with open(LOG_FILE, "a") as f:
            f.write(line + "\n")
    except Exception:
        pass
    print(line)


def gws_json(args):
    out = subprocess.run([GWS] + args, capture_output=True, text=True, timeout=120)
    raw = out.stdout
    start = raw.find("{")
    if start == -1:
        raise RuntimeError(f"gws gave no JSON: {out.stdout}\n{out.stderr}")
    data = json.loads(raw[start:])
    if isinstance(data, dict) and data.get("error"):
        raise RuntimeError(f"gws API error: {json.dumps(data['error'])}")
    return data


def load_state():
    try:
        with open(STATE_FILE) as f:
            return json.load(f)
    except Exception:
        return {"seen": []}


def save_state(state):
    tmp = STATE_FILE + ".tmp"
    with open(tmp, "w") as f:
        json.dump(state, f, indent=2)
    os.replace(tmp, STATE_FILE)


def fetch_leads():
    secret = open(SECRET_FILE).read().strip()
    req = urllib.request.Request(ENDPOINT, headers={"X-Auth": secret})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.load(r)
    return data.get("leads", [])


def is_test(lead):
    return lead.get("email", "").strip().lower().endswith("@example.com")


def ensure_sheet():
    """Make sure the Leads tab + header row exist (idempotent)."""
    meta = gws_json(["sheets", "spreadsheets", "get", "--params",
                     json.dumps({"spreadsheetId": SPREADSHEET_ID,
                                 "fields": "sheets.properties(title)"})])
    titles = [s["properties"]["title"] for s in meta.get("sheets", [])]
    if SHEET_TAB not in titles:
        gws_json(["sheets", "spreadsheets", "batchUpdate", "--params",
                  json.dumps({"spreadsheetId": SPREADSHEET_ID}),
                  "--json", json.dumps({"requests": [
                      {"addSheet": {"properties": {"title": SHEET_TAB}}}]})])
    vals = gws_json(["sheets", "spreadsheets", "values", "get", "--params",
                     json.dumps({"spreadsheetId": SPREADSHEET_ID,
                                 "range": f"{SHEET_TAB}!A1:F1"})]).get("values", [])
    if not vals:
        gws_json(["sheets", "spreadsheets", "values", "update", "--params",
                  json.dumps({"spreadsheetId": SPREADSHEET_ID,
                              "range": f"{SHEET_TAB}!A1",
                              "valueInputOption": "RAW"}),
                  "--json", json.dumps({"values": [HEADERS]})])


def append_row(lead):
    row = [lead.get("ts", ""), lead.get("name", ""), lead.get("phone", ""),
           lead.get("email", ""), lead.get("project", ""), lead.get("message", "")]
    gws_json(["sheets", "spreadsheets", "values", "append", "--params",
              json.dumps({"spreadsheetId": SPREADSHEET_ID,
                          "range": f"{SHEET_TAB}!A1",
                          "valueInputOption": "RAW",
                          "insertDataOption": "INSERT_ROWS"}),
              "--json", json.dumps({"values": [row]})])


def send_email(lead):
    name = lead.get("name", "").strip() or lead.get("email", "").strip() or "New inquiry"
    email = lead.get("email", "").strip()
    phone = lead.get("phone", "").strip()
    rows = [("Name", lead.get("name", "")), ("Phone", phone), ("Email", email),
            ("Project Type", lead.get("project", "")), ("Message", lead.get("message", ""))]

    rows_html = "".join(
        '<tr>'
        '<td style="padding:8px 14px;border-bottom:1px solid #eee;color:#6b7280;'
        'font:600 13px/1.4 Arial,sans-serif;white-space:nowrap;vertical-align:top">'
        f'{_html.escape(lab)}</td>'
        '<td style="padding:8px 14px;border-bottom:1px solid #eee;color:#111827;'
        f'font:400 14px/1.5 Arial,sans-serif">{_html.escape(str(val)) or "&mdash;"}</td></tr>'
        for lab, val in rows
    )
    btns = ""
    if email:
        btns += (f'<a href="mailto:{_html.escape(email)}" style="display:inline-block;margin-right:8px;'
                 'background:#da7734;color:#fff;text-decoration:none;font:700 13px Arial;'
                 'padding:10px 16px;border-radius:8px">Reply by email</a>')
    if phone:
        btns += (f'<a href="tel:{_html.escape(phone)}" style="display:inline-block;margin-right:8px;'
                 'background:#080808;color:#fff;text-decoration:none;font:700 13px Arial;'
                 'padding:10px 16px;border-radius:8px">Call</a>')
    btns += (f'<a href="{SHEET_URL}" style="display:inline-block;color:#6b7280;text-decoration:none;'
             'font:600 13px Arial;padding:10px 4px">Open lead sheet &rarr;</a>')

    html = (
        '<div style="background:#f4f4f5;padding:24px 0;font-family:Arial,sans-serif">'
        '<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb">'
        '<div style="background:#080808;padding:20px 24px">'
        '<div style="color:#da7734;font:700 12px/1 Arial;letter-spacing:1.5px;text-transform:uppercase">Riarh Group &middot; Website Inquiry</div>'
        f'<div style="color:#fff;font:700 22px/1.3 Arial;margin-top:6px">{_html.escape(name)}</div></div>'
        f'<table style="width:100%;border-collapse:collapse">{rows_html}</table>'
        '<div style="padding:18px 24px;background:#fafafa;border-top:1px solid #eee">' + btns + '</div></div>'
        '<div style="text-align:center;color:#9ca3af;font:400 11px Arial;margin-top:14px">Automated notification from the Riarh Group website</div></div>'
    )
    plain = "\n".join(f"{lab}: {val}" for lab, val in rows if val) + f"\n\nLead sheet: {SHEET_URL}"

    msg = MIMEMultipart("alternative")
    msg["To"] = NOTIFY_TO
    if NOTIFY_BCC:
        msg["Bcc"] = NOTIFY_BCC
    msg["From"] = f"{SENDER_NAME} <sandy@zippyscale.com>"
    msg["Subject"] = f"New website inquiry — {name}"
    if email:
        msg["Reply-To"] = email
    msg.attach(MIMEText(plain, "plain", "utf-8"))
    msg.attach(MIMEText(html, "html", "utf-8"))
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    res = gws_json(["gmail", "users", "messages", "send",
                    "--params", '{"userId":"me"}',
                    "--json", json.dumps({"raw": raw})])
    return res.get("id")


def main():
    os.makedirs(CFG_DIR, exist_ok=True)
    lock_fd = open(LOCK_FILE, "w")
    try:
        fcntl.flock(lock_fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        return

    leads = fetch_leads()
    state = load_state()
    seen = set(state.get("seen", []))
    ensure_sheet()
    new = 0

    for lead in leads:
        lid = lead.get("id")
        if not lid or lid in seen:
            continue
        append_row(lead)
        if is_test(lead):
            log(f"logged test lead (not emailed to client): {lead.get('email')}")
        else:
            mid = send_email(lead)
            log(f"emailed lead {lead.get('email','(no email)')} -> {NOTIFY_TO} msg={mid}")
        seen.add(lid)
        new += 1

    state["seen"] = list(seen)
    save_state(state)
    if new:
        log(f"run complete: {new} new lead(s) processed")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log(f"ERROR: {e}")
        sys.exit(1)
