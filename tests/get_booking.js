const playwright = require('playwright');
const https = require('https');
// const http = require('http');
// const url = require('url');

// console.log('server started.');
// const server = http.createServer((req, res) => {
//   // リクエストURLを解析
//   const parsedUrl = url.parse(req.url, true);
// 
//   // GETリクエストの場合
//   if (req.method === 'GET') {
//     console.log('get request detected', parsedUrl.query);
//     // クエリパラメータを取得
//     const { date, hour, minute, depStName, arrStName, trainName } = parsedUrl.query;
//     // 予約確認を実行
//     const result = fetchTrainBookingInfo(date, hour, minute, depStName, arrStName, trainName);
// 
//     // レスポンスを返す
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify(result));
//     // // エラーレスポンスを返す
//     // res.statusCode = 400;
//     // res.setHeader('Content-Type', 'application/json');
//     // res.end(JSON.stringify({ error: 'Invalid parameters' }));
//   } else {
//     // その他のリクエストメソッドの場合
//     res.statusCode = 404;
//     res.setHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify({ error: 'Not found' }));
//   }
// });
// 
// server.listen(3000, () => {
//   console.log('Server running at http://localhost:3000/');
// });

fetchTrainBookingInfo();
// async function fetchTrainBookingInfo(date, hour, minute, depStName, arrStName, trainName) {
async function fetchTrainBookingInfo() {
  const browser = await playwright['chromium'].launch({
    // 確認時のみheadless flaseに
    // headless: false,
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

  // const inputData = {
  //   'date': '20240608',
  //   'hour': '21',
  //   'minute': '00',
  //   'depStName': 'osaka',
  //   'arrStName': 'tokyo',
  //   'trainName': 'izumo',
  // };
  const date = '20240608';
  const hour = '21';
  const minute = '00';
  const depStName = 'osaka';
  const arrStName = 'tokyo';
  const trainName = 'izumo';

  const url = `https://e5489.jr-odekake.net/e5489/cspc/CBDayTimeArriveSelRsvMyDiaPC?inputDepartStName=${stName[depStName]}&inputArriveStName=${stName[arrStName]}&inputType=0&inputDate=${date}&inputHour=${hour}&inputMinute=${minute}&inputUniqueDepartSt=1&inputUniqueArriveSt=1&inputSearchType=2&inputTransferDepartStName1=${stName[depStName]}&inputTransferArriveStName1=${stName[arrStName]}&inputTransferDepartStUnique1=1&inputTransferArriveStUnique1=1&inputTransferTrainType1=0001&inputSpecificTrainType1=2&inputSpecificBriefTrainKana1=${trainKana[trainName]}&SequenceType=0&inputReturnUrl=goyoyaku/campaign/sunriseseto_izumo/form.html&RTURL=https://www.jr-odekake.net/goyoyaku/campaign/sunriseseto_izumo/form.html&undefined`
  await page.goto(url);

  const postData = {
    "bookingDate": date,
    "depSt": depStName,
    "arrSt": arrStName,
    "trainName": trainName,
    "html": await page.locator('table.seat-facility').innerHTML()
  };
  console.log('post spreadsheet', postData);
  await postSpreadsheet(postData);

  await browser.close();

  return { result: 'Success' };
}

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
