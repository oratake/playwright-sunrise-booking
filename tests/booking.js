const playwright = require('playwright');
const https = require('https');

(async () => {
  const browser = await playwright['chromium'].launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto('https://www.jr-odekake.net/goyoyaku/campaign/sunriseseto_izumo/form.html');
  // await page.locator('#member-yes').click();
  await page.locator('#member-no').click(); // ログインせずに予約

  // 日付
  // 上り18:00 下り21:00 指定
  await page.locator('#jsSelectYear').selectOption('2024');
  await page.locator('#jsSelectMonth').selectOption('06');
  await page.locator('#jsSelectDay').selectOption('09');
  await page.locator('#jsSelectHour').selectOption('18');
  await page.locator('#jsSelectMinute').selectOption('00');

  // 'seto' | 'izumo'
  await page.locator('#jsSelectTrainType').selectOption('seto');

  const stationNameList = {
    'tokyo': '東京',
    'osaka': '大阪≪のぼり≫',
    'himeji': '姫路',
    'okayama': '岡山',
  };

  await page.locator('#inputDepartStName').selectOption(stationNameList.osaka);
  await page.locator('#inputArriveStName').selectOption(stationNameList.tokyo);

  // await page.locator('#jsCheckBox_west').;
  // 注意: 沼津など東側でこのチェックいる場合もある。idは別なので注意
  await page.getByRole('checkbox', { id: 'jsCheckBox_west' }).check(); // 発券機の時間についての同意チェック
  // '普通車ノビノビ座席' | 'シングルデラックス' | 'シングルツイン' | 'シングル' | 'ソロ' | 'サンライズツイン'
  // await page.getByRole('radio', { value: 'サンライズツイン' }).check();
  await page.locator('input[type="radio"][value="サンライズツイン"]').check();
  await page.waitForTimeout(1000);
  await page.locator('#submitButton').click();

  // 空き表示画面
  await page.waitForSelector('.seat-facility-none');
  // console.log(await page.locator('table.seat-facility').innerHTML());

  // テストJSON
  const postData = {
    "bookingDate": "20240608",
    "depSt": "osaka",
    "arrSt": "tokyo",
    "sunrise": "seto",
    "html": await page.locator('table.seat-facility').innerHTML()
  };
  await postSpreadsheet(postData);

  await page.waitForTimeout(100000);
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
