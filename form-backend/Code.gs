/**
 * Riarh Group — website contact form backend.
 *
 * Receives a POST from the static site's Contact form, appends the lead to the
 * bound Google Sheet, and emails a notification to info@riarhgroup.com.
 *
 * No third-party service, no submission cap. Runs on Google Apps Script.
 */

var NOTIFY_TO = 'info@riarhgroup.com';
var SHEET_NAME = 'Leads';
var HEADERS = ['Timestamp', 'Name', 'Phone', 'Email', 'Project Type', 'Message'];

/** One-time (and idempotent) setup: ensure the Leads sheet + header row exist. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Health check — lets you confirm the deployment URL is live in a browser. */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', service: 'riarh-leads' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Form submissions land here. */
function doPost(e) {
  try {
    var p = (e && e.parameter) || {};

    // Honeypot — bots fill this; humans never see it. Silently accept + drop.
    if (p.botcheck) {
      return json_({ success: true });
    }

    var name = (p.name || '').toString().trim();
    var phone = (p.phone || '').toString().trim();
    var email = (p.email || '').toString().trim();
    var project = (p.project || '').toString().trim();
    var message = (p.message || '').toString().trim();

    if (!name && !email && !message) {
      return json_({ success: false, message: 'Empty submission.' });
    }

    var sheet = setup();
    sheet.appendRow([new Date(), name, phone, email, project, message]);

    var body =
      'New inquiry from the Riarh Group website\n\n' +
      'Name: ' + (name || '—') + '\n' +
      'Phone: ' + (phone || '—') + '\n' +
      'Email: ' + (email || '—') + '\n' +
      'Project Type: ' + (project || '—') + '\n\n' +
      'Message:\n' + (message || '—') + '\n';

    var opts = { name: 'Riarh Group Website' };
    if (email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      opts.replyTo = email; // reply goes straight to the lead
    }

    MailApp.sendEmail(NOTIFY_TO, 'New website inquiry — ' + (name || 'Unknown'), body, opts);

    return json_({ success: true });
  } catch (err) {
    return json_({ success: false, message: String(err) });
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
