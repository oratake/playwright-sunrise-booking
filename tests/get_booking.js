const playwright = require('playwright');
const https = require('https');

(async () => {
  const browser = await playwright['chromium'].launch({
    headless: false,
  });
  const page = await browser.newPage();

  const stName = {
    'osaka': '%91%E5%8D%E3',
    'tokyo': '%93%8C%8B%9E',
    'himeji': '%95P%98H',
    'okayama': '%89%AA%8ER',
  };
  const trainKana = {
    //       %BB%BE%C4%20%20000 seto のびのび
    'seto': '%BB%BE%C4%BB%20000',
    'izumo': '%BB%B2%BD%D3%BB000',
  };
  const inputData = {
    'date': '20240608',
    'hour': '21',
    'minute': '00',
    'depStName': 'osaka',
    'arrStName': 'tokyo',
    'trainName': 'izumo',
  };

  const url = `https://e5489.jr-odekake.net/e5489/cspc/CBDayTimeArriveSelRsvMyDiaPC?inputDepartStName=${stName[inputData.depStName]}&inputArriveStName=${stName[inputData.arrStName]}&inputType=0&inputDate=${inputData.date}&inputHour=${inputData.hour}&inputMinute=${inputData.minute}&inputUniqueDepartSt=1&inputUniqueArriveSt=1&inputSearchType=2&inputTransferDepartStName1=${stName[inputData.depStName]}&inputTransferArriveStName1=${stName[inputData.arrStName]}&inputTransferDepartStUnique1=1&inputTransferArriveStUnique1=1&inputTransferTrainType1=0001&inputSpecificTrainType1=2&inputSpecificBriefTrainKana1=${trainKana[inputData.trainName]}&SequenceType=0&inputReturnUrl=goyoyaku/campaign/sunriseseto_izumo/form.html&RTURL=https://www.jr-odekake.net/goyoyaku/campaign/sunriseseto_izumo/form.html&undefined`
  await page.goto(url);

  // テストJSON
  const postData = {
    "bookingDate": inputData.date,
    "depSt": inputData.depStName,
    "arrSt": inputData.arrStName,
    "trainName": inputData.trainName,
    "html": await page.locator('table.seat-facility').innerHTML()
  };
  await postSpreadsheet(postData);

  await browser.close();
})();

function postSpreadsheet(jsonData) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const url = "https://script.google.com/macros/s/AKfycbxg33hDQ2v4gEpRhfWYpUoe-J0z7pLuocOjDtnwhIsbJ-9QeVu8fhf5orqO4hQ4P7sV7Q/exec";
  const request = https.request(url, options);
  request.write(JSON.stringify(jsonData));
  request.end();
}
