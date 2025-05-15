import { google } from 'googleapis';

async function getPasswordFromGGSheet() {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    const sheets = google.sheets({ version: 'v4', auth: new google.auth.JWT(
      credentials.client_email, null, credentials.private_key, ['https://www.googleapis.com/auth/spreadsheets']
    )});
    const sheetId = process.env.SHEET_ID;
    const range = 'Password!A1';

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId:sheetId,
    range,
  });

  const password = response.data.values ? response.data.values[0][0] : null;
  return password;
}

export default getPasswordFromGGSheet;