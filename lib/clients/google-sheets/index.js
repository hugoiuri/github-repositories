const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

module.exports = async () => {
  // If modifying these scopes, delete token.json.
  const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  // const TOKEN_PATH = `${process.cwd()}/credentials/token.json`;
  const TOKEN = JSON.parse(await fs.promises.readFile(`${process.cwd()}/credentials/token.json`, 'utf-8'));
  const CREDENTIALS = JSON.parse(await fs.promises.readFile(`${process.cwd()}/credentials/credentials.json`, 'utf-8'));
  const SPREADSHEETID = await fs.promises.readFile(`${process.cwd()}/credentials/spreadsheetId`, 'utf-8');

  function authorize() {
    const { client_secret, client_id, redirect_uris } = CREDENTIALS.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
  
    oAuth2Client.setCredentials(TOKEN);
    return oAuth2Client;
  }

  const write = (values) => {
    const auth = authorize();

    const data = [{ range: 'repositories!A2:E', values }];
    const resource = { data, valueInputOption: 'RAW' };
    const sheets = google.sheets({ version: 'v4', auth });

    sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEETID,
      resource,
    }, (err, result) => {
      if (err) {
        // Handle error
      } else {
        console.log('%d rows updated.', result.data.totalUpdatedRows);
        console.log('%d cells updated.', result.data.totalUpdatedCells);
      }
    });
  }

  return {
    write
  }
};



/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
// function getNewToken(oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error while trying to retrieve access token', err);
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) return console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       callback(oAuth2Client);
//     });
//   });
// }

// /**
//  * Prints the names and majors of students in a sample spreadsheet:
//  * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
//  * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
//  */
// async function listMajors(auth) {
//   const spreadsheetId = await fs.promises.readFile(`${process.cwd()}/credentials/spreadsheetId`, 'utf-8');

//   const sheets = google.sheets({ version: 'v4', auth });

//   sheets.spreadsheets.values.get({
//     spreadsheetId,
//     range: 'repositories!A2:E',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const rows = res.data.values;
//     if (rows.length) {
//       console.log('Name, Major:');
//       // Print columns A and E, which correspond to indices 0 and 4.
//       rows.map((row) => {
//         console.log(`${row[0]}, ${row[4]}`);
//       });
//     } else {
//       console.log('No data found.');
//     }
//   });
// }

