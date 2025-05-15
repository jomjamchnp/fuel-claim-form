import { google } from 'googleapis';

    export default async function handler(req, res) {
      try {
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
        const sheets = google.sheets({ version: 'v4', auth: new google.auth.JWT(
          credentials.client_email, null, credentials.private_key, ['https://www.googleapis.com/auth/spreadsheets']
        )});
        const sheetId = process.env.SHEET_ID;
        const range = 'Password!A1';
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId : sheetId,
          range,
        });
    
        const password = response.data.values ? response.data.values[0][0] : null;
    
        if (!password) {
          return res.status(404).json({ error: 'No password found' });
        }
    
        res.status(200).json({ password });
    
      } catch (error) {
        console.error('Error fetching password:', error);
        res.status(500).json({ error: 'Failed to fetch password' });
      }
    }