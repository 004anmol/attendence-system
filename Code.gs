function doGet() {
var output = HtmlService.createHtmlOutputFromFile('index');
output.addMetaTag('viewport', 'width=device-width, initial-scale=1');
return output;
}

let cachedClientGroups = []; // Global variable to cache client groups


function fetchClientGroups() {
if (cachedClientGroups.length > 0) {
return cachedClientGroups; // Return cached data if available
}


const sheet = SpreadsheetApp.openById("1JFR48ywW2fRd6oZ5gJW56negzowZSGT5l3Fns4q4_Us");
const data = sheet.getSheets()[0].getDataRange().getValues();
let clientGroups = [];
for (let i = 1; i < data.length; i++) {
const clientGroupName = data[i][1];
if (!clientGroups.includes(clientGroupName)) {
clientGroups.push(clientGroupName);
}
}
cachedClientGroups = clientGroups; // Cache the fetched client groups
return clientGroups;
}

function fetchSiteName(siteCode) {
const sheet = SpreadsheetApp.openById("1JFR48ywW2fRd6oZ5gJW56negzowZSGT5l3Fns4q4_Us");
const data = sheet.getSheets()[0].getDataRange().getValues();
let result = { siteName: "Not Found", clientGroup: "Not Found" };
siteCode = siteCode.trim().toLowerCase();


for (let i = 1; i < data.length; i++) {
if (data[i][0].toString().trim().toLowerCase() === siteCode) {
result.siteName = data[i][2];
result.clientGroup = data[i][1];
break;
}
}
return result;
}


function uploadFile(fileData, clientGroup, siteCode, siteName, date, phoneNumber, gmail) {
try {
const folder = DriveApp.getFolderById("1_vfwyAhEcy39kl8A2pl4BPFzk4Js0chz"); // Folder ID for storing uploaded files
const mimeType = fileData.name.toLowerCase().endsWith(".pdf") ? MimeType.PDF : MimeType.JPEG;
const blob = Utilities.newBlob(Utilities.base64Decode(fileData.data), mimeType, fileData.name);
const uploadedFile = folder.createFile(blob);
const fileUrl = uploadedFile.getUrl();


// Confirm file was uploaded
Logger.log(`File uploaded successfully: ${fileData.name}, URL: ${fileUrl}`);


// Access Google Sheet
const sheet = SpreadsheetApp.openById("1xsH59P7kVBmau8zxRilPqRlyUCS-pM4W9MAlfaqB2E4").getSheetByName("Sheet1");
const rowData = [clientGroup, siteCode, siteName, date, phoneNumber, gmail, fileUrl];


// Append new row with file info
sheet.appendRow(rowData);
Logger.log(`Row added to Google Sheet: ${JSON.stringify(rowData)}`);


return fileUrl; // Return file URL for confirmation
} catch (error) {
Logger.log(`Error uploading file: ${error.message}`);
throw new Error(`File upload failed: ${error.message}`);
}
}
