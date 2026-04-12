/*
 * ═══════════════════════════════════════════════════════════
 *   BLOOMING HIVES — Contact Form → Google Sheets
 *   Google Apps Script (paste this in your Google Sheet)
 * ═══════════════════════════════════════════════════════════
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Go to https://sheets.google.com → Create a new spreadsheet
 * 2. Rename the first sheet tab to "Form Responses"
 * 3. Add these headers in Row 1:
 *      A1: Timestamp
 *      B1: First Name
 *      C1: Last Name
 *      D1: Email
 *      E1: Budget
 *      F1: Message
 *      G1: Interests
 *      H1: Attachments
 *
 * 4. Go to Extensions → Apps Script
 * 5. Delete any default code and paste THIS ENTIRE FILE
 * 6. Click SAVE (Ctrl+S)
 * 7. Click "Deploy" → "New deployment"
 * 8. Click the gear icon → Select "Web app"
 * 9. Set:
 *      - Description: "Contact Form Handler"
 *      - Execute as: "Me"
 *      - Who has access: "Anyone"
 * 10. Click "Deploy"
 * 11. Click "Authorize access" → Choose your Google account → Allow
 * 12. Copy the "Web app URL"
 * 13. Paste it as GOOGLE_SCRIPT_URL in Contact.jsx (line 68)
 *
 * UPDATING THE SCRIPT:
 * If you modify this script, go to Deploy → Manage deployments →
 * Edit (pencil icon) → Version: "New version" → Deploy
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses");

    // Fallback to active sheet if "Form Responses" tab doesn't exist
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    }

    var data = JSON.parse(e.postData.contents);

    // Append a new row with the form data
    sheet.appendRow([
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.fname || "",
      data.lname || "",
      data.email || "",
      data.budget || "",
      data.message || "",
      data.interests || "",
      data.attachments || ""
    ]);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// Optional: Test function to verify the script works
function doGet(e) {
  return ContentService
    .createTextOutput("Contact form handler is active.")
    .setMimeType(ContentService.MimeType.TEXT);
}
