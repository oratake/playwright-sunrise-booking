const playwright = require('playwright');

(async () => {
  const browser = await playwright['chromium'].launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto('https://www.jr-odekake.net/goyoyaku/campaign/sunriseseto_izumo/form.html');
  // await page.locator('#member-yes').click();
  await page.locator('#member-no').click();
  await page.waitForTimeout(300);
  // await page.getByRole('button', { name: '会員ログインせず予約' }).click();
  // await page.getByRole('button', { name: '会員ログインして予約' }).click();

  // 日付
  // 上り18:00 下り21:00 指定
  await page.locator('#jsSelectYear').selectOption('2024');
  await page.locator('#jsSelectMonth').selectOption('06');
  await page.locator('#jsSelectDay').selectOption('09');
  await page.locator('#jsSelectHour').selectOption('23');
  await page.locator('#jsSelectMinute').selectOption('00');

  // await page.getByLabel('サンライズ瀬戸 サンライズ出雲').selectOption('izumo');
  // await page.getByLabel('サンライズ瀬戸 サンライズ出雲').selectOption('seto');
  // 'seto' | 'izumo'
  await page.locator('#jsSelectTrainType').selectOption('seto');
  await page.waitForTimeout(300);

  const stationNameList = {
    'tokyo': '東京',
    'osaka': '大阪≪のぼり≫',
    'himeji': '姫路',
    'okayama': '岡山',
  };

  await page.locator('#inputDepartStName').selectOption(stationNameList.osaka);
  await page.locator('#inputArriveStName').selectOption(stationNameList.tokyo);

  // await page.getByRole('checkbox', { name: '上記内容に同意する' }).check();
  // await page.locator('#jsCheckBox_west').;
  // 注意: 沼津など東側でこのチェックいる場合もある。idは別なので注意
  await page.getByRole('checkbox', { id: 'jsCheckBox_west' }).check();
  // '普通車ノビノビ座席' | 'シングルデラックス' | 'シングルツイン' | 'シングル' | 'ソロ' | 'サンライズツイン'
  // await page.getByRole('radio', { value: 'サンライズツイン' }).check();
  await page.locator('input[type="radio"][value="サンライズツイン"]').check();
  await page.locator('#submitButton').click();

  // 空き表示画面
  await page.waitForSelector('.seat-facility-none');
  // // 認証
  // await page.locator('#label-westerid').fill(authString.username);
  // await page.locator('#textPassword').fill(authString.password);
  // await page.getByRole('button', { name: 'ログイン' }).click();

  await page.waitForTimeout(100000);
  // ここまで

  // await page.getByLabel('WESTER ID').click();
  // await page.getByLabel('WESTER ID').fill('hoge');
  // await page.getByLabel('パスワード', { exact: true }).click();
  // await page.getByLabel('パスワード', { exact: true }).fill('fuga');
  // await page.getByRole('button', { name: 'ログイン' }).click();
  await browser.close();
})();
