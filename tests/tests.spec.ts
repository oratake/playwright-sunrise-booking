import { test, expect, type Page } from '@playwright/test';

test('サンライズの予約', async ({ page }) => {
  await page.goto('https://www.jr-odekake.net/goyoyaku/campaign/sunriseseto_izumo/form.html');
  await page.locator('#member-yes').click();
  // await page.getByRole('button', { name: '会員ログインせず予約' }).click();
  // await page.getByRole('button', { name: '会員ログインして予約' }).click();

  // 日付
  await page.locator('#jsSelectYear').selectOption('2024');
  await page.locator('#jsSelectMonth').selectOption('06');
  await page.locator('#jsSelectDay').selectOption('09');
  await page.locator('#jsSelectHour').selectOption('23');
  await page.locator('#jsSelectMinute').selectOption('00');

  // await page.getByLabel('サンライズ瀬戸 サンライズ出雲').selectOption('izumo');
  // await page.getByLabel('サンライズ瀬戸 サンライズ出雲').selectOption('seto');
  // 'seto' | 'izumo'
  await page.locator('#jsSelectTrainType').selectOption('seto');

  const stationNameList = {
    'tokyo': '%2593%258C%258B%259E', //東京
    'osaka': '%2591%25E5%258D%25E3', //大阪<<のぼり>>
    'himeji': '%2595P%2598H', //姫路
    'okayama': '%2589%25AA%258ER', //岡山
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

  await page.waitForTimeout(30000);
  // ここまで


  // await page.getByLabel('人用 B寝台個室 シングルツイン').check();

  await page.getByLabel('WESTER ID').click();
  await page.getByLabel('WESTER ID').fill('hoge');
  await page.getByLabel('パスワード', { exact: true }).click();
  await page.getByLabel('パスワード', { exact: true }).fill('fuga');
  await page.getByRole('button', { name: 'ログイン' }).click();
});
