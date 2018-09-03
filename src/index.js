const puppeteer = require('puppeteer');
const events = require('events');
const tesseract = require('tesseract.js');
const gm = require('gm');
const pad = require('pad');

const pauseTime = 200;
const bookDate = '';
const earlyMin = 0;
const identifyCode = '';
const email = '';
const emitEvent = 'ReloadBooking';

const timeAddr = 'https://npm.cpami.gov.tw/index.aspx';
const draftAddr = 'https://npm.cpami.gov.tw/apply_2_1.aspx';
const checkImgPath = './checkimg/CheckImageCode.png';
const em = new events.EventEmitter();
let sysTime;
let checkCode;
let clipOpt;
let bookFlag = true;

(async () => {
  console.log('Program Start!');

  // #region Initiate
  if (!fs.existsSync('./checkimg')) { fs.mkdirSync('./checkimg'); }
  const temp = fs.readFile('./init.txt');
  console.log('temp');
  // #endregion

  const browser = await puppeteer.launch({ headless: false });
  const timePage = await browser.newPage();
  await timePage.goto(timeAddr);

  function padTitle(title, message) {
    console.log(`=== ${title} ===`);
    console.log();
    console.log(`${pad(2, '')} ${message}`);
    console.log();
  }
  function convertYear(_date) {
    let date = _date.trim();
    date = date.replace(date.substr(0, 3), date.substr(0, 3) * 1 + 1911);
    return date;
  }
  async function getPropertyValue(element, property = 'value') {
    const jsHandle = await element.getProperty(property);
    const value = await jsHandle.jsonValue();
    return value;
  }
  async function checkImg(page, path, newPath = './checkimg/CheckImageCode01.png') {
    // #region - Image threshold process
    // ## Convert image's threshold for image reconization.

    padTitle('Threshold', 'Starting image threshold covertion.');
    await gm(path)
      .threshold(45, true)
      .write(newPath, err => {
        if (err) {
          return Promise.reject(err);
        }
        return Promise.resolve();
      });
    padTitle('Threshold', 'Ending image threshold covertion.');

    // #endregion

    // #region - Image reconization
    // ## Reconize image for verification code.

    await page.waitFor(500);
    padTitle('Reconization', 'Starting image reconization.');
    await tesseract.recognize(newPath)
      .then(res => {
        checkCode = res.text.trim();
        padTitle('Result', `Check code is : ${checkCode}`);
      });
    if (checkCode.length !== 5) {
      return true;
    }
    padTitle('Reconization', 'Ending image reconization.');
    return false;

    // #endregion
  }
  async function getImg(page, _clipOpt = undefined) {
    const imgElement = await page.waitFor('#ContentPlaceHolder1_imgcode');
    if (_clipOpt) {
      clipOpt = _clipOpt;
    } else {
      clipOpt = await imgElement.boundingBox();
      clipOpt.x *= 2;
      clipOpt.y *= 2;
    }
    await imgElement.screenshot({
      path: checkImgPath,
      type: 'png',
      clip: clipOpt
    });
  }
  // ## This function will load pre-set draft by identifyCode & email,
  //    and compelete the rest process of booking.
  // ##
  async function loadDraft() {
    const draftPage = await browser.newPage();
    await draftPage.goto(draftAddr);

    // #region - Draft page dialog handler
    draftPage.on('dialog', async dialog => {
      console.log('Alter - Dialog show up, system will automatically close it.');
      console.log(`Message - ${dialog.message}`);
      await dialog.dismiss();
    });
    // #endregion

    // #region - Query Drafts
    await draftPage.type('#ContentPlaceHolder1_apply_sid', 'K122378990');
    await draftPage.type('#ContentPlaceHolder1_apply_email', 'tf4ewg@gmail.com');
    await draftPage.select('select#ContentPlaceHolder1_apply_nation', '中華民國');
    // await draftPage.waitFor(500);
    const btnErr = await draftPage.click('#ContentPlaceHolder1_btnappok');
    if (btnErr) console.log(`Query Draft btn error: ${btnErr}`);

    await draftPage.waitFor('#form1 > div.container > div:nth-child(3) > div.col-md-10.Rightcontent > div.content > table > tbody > tr:nth-child(2) > td:nth-child(5) > a');
    await draftPage.click('#form1 > div.container > div:nth-child(3) > div.col-md-10.Rightcontent > div.content > table > tbody > tr:nth-child(2) > td:nth-child(5) > a');
    // #endregion

    // #region - Chekc Available Book Date
    // 這邊固定取第24個child，規則為最早前30天、最晚前7天，因此可預訂日子數目為30-6=24
    const element = await draftPage.waitFor('#ContentPlaceHolder1_applystart > option:nth-child(24)');
    const value = await getPropertyValue(element);

    if (value !== bookDate) {
      console.log('Alert - 預定日期尚未開放，系統重新嘗試中！');
      console.log(`Info - 目前可預訂之最早日期為: ${value}，預定日期為: ${bookDate}`);
      await draftPage.waitFor(pauseTime);
      await draftPage.close();
      // 停止這一Round，回傳False重新啟動函式
      return false;
    }
    // #endregion

    // #region - Reset Wanted Book Date
    await draftPage.select('#ContentPlaceHolder1_applystart', bookDate);
    // 點選完日期會重刷一次頁面，故需要停
    await draftPage.waitFor(500);
    console.log('System: True');
    // #endregion

    // #region - Check Img Handler
    console.log('Start - Handle check img');
    await getImg(draftPage);
    const resetFlag = await checkImg(checkImgPath);
    console.log('End - Handle check img');
    // #endregion

    // #region - Wrong length of Check Code Handler
    // 只能檢查出驗證碼長度對不對，假設不對下方程式碼只會重設驗證圖，然後重新辨識
    // 但是覺得太麻煩，還是直接整個loadDraft()重跑比較快。
    // console.log(resetFlag);
    // while (resetFlag) {
    //   await resetCheckImg();
    // }
    if (resetFlag) {
      await draftPage.waitFor(pauseTime);
      await draftPage.close();
      return false;
    }
    // #endregion

    // #region - Check Code Input & Detect succeed or not
    await draftPage.type('#ContentPlaceHolder1_vcode', checkCode);
    await draftPage.select('select#ContentPlaceHolder1_teams_count', '3');
    const beforeUrl = draftPage.url();

    await draftPage.waitFor(300);
    const temp = await draftPage.$('#ContentPlaceHolder1_btnsave');
    if (!temp) {
      console.log('Alert - 按鈕尚未出現!!!!');
      await draftPage.waitFor(pauseTime);
      await draftPage.close();
      // 停止這一Round，回傳False重新啟動函式
      return false;
    }
    await draftPage.click('#ContentPlaceHolder1_btnsave');
    await draftPage.waitFor(1000);
    const currentUrl = draftPage.url();
    if (beforeUrl === currentUrl) {
      console.log('驗證碼錯誤!!! 系統重新嘗試中!!!');
      await draftPage.waitFor(pauseTime);
      await draftPage.close();
      return false;
    }
    // #endregion

    await draftPage.screenshot({ path: './success_apply_screen.png', type: 'png', fullPage: true });
    console.log('Alter - Successfully Booking! System is going to stop.');
    return true;
  }
  // ## This function will compelet the process of booking except loading drafts,
  //    because loading drafts should be done before calling this func,
  //    also you should pass the page obj which has already navigated to draft page as parameter
  //    to this func.
  // ##
  async function book(draftPage) {
    // #region - Check Save Btn exist or not

    if (!(await draftPage.$('#ContentPlaceHolder1_btnsave'))) {
      padTitle('Restart', "Can't find Save Btn (7:00 am not yet), system is retrying.");
      await draftPage.reload();
      await draftPage.waitFor(pauseTime);
      return true;
    }

    // #endregion

    // #region - Check Available Book Date
    // ## Check whether or not the date is matched, if not stop this round and reload the page.

    const element = await draftPage.waitFor('#ContentPlaceHolder1_applystart > option:nth-child(25)');
    const value = await getPropertyValue(element);
    if ((new Date(bookDate) - new Date(value)) > 0) {
      padTitle('Restart', 'Book date is not available, system is retrying.');
      padTitle('Restart', `The lastest date is ${value}, book date is ${bookDate}`);
      await draftPage.reload();
      await draftPage.waitFor(pauseTime);
      return true;
    }

    // #endregion

    // #region - Reset Wanted Book Date

    await draftPage.select('#ContentPlaceHolder1_applystart', bookDate);
    await draftPage.waitFor(500);

    // #endregion

    // #region - Check Img Handler

    await getImg(draftPage, clipOpt);
    if (await checkImg(draftPage, checkImgPath)) {
      padTitle('Restart', 'Wrong length of check code, system is retrying.');
      await draftPage.reload();
      await draftPage.waitFor(pauseTime);
      return true;
    }

    await draftPage.type('#ContentPlaceHolder1_vcode', checkCode);

    // #endregion

    // #region - Check Code Input & Detect succeed or not

    await draftPage.select('select#ContentPlaceHolder1_teams_count', '3');
    await draftPage.waitFor(500);
    const beforeURL = await draftPage.url();
    await draftPage.click('#ContentPlaceHolder1_btnsave');
    padTitle('BeforeURL', beforeURL);
    await draftPage.waitFor(1000);
    const currentURL = await draftPage.url();
    padTitle('CurrentURL', currentURL);
    if (beforeURL === currentURL) {
      padTitle('Restart', 'Wrong check code, system is retrying.');
      await draftPage.reload();
      await draftPage.waitFor(pauseTime);
      return true;
    }

    // #endregion

    padTitle('Success', 'Successfully Booking! System is going to stop.');
    await draftPage.waitFor(4000);
    await draftPage.screenshot({ path: './success_apply_screen.png', type: 'png', fullPage: true });
    return false;
  }

  // #region - Time Check Event
  // ## Sync the system time of website, and control whether or not to trigger booking function.

  em.on('TimeCheck', async interval => {
    const Handler = await timePage.$('#ContentPlaceHolder1_Clocks');
    const html = await timePage.evaluate(body => body.innerHTML, Handler);
    await Handler.dispose();

    if (sysTime !== convertYear(html)) {
      sysTime = convertYear(html);
      padTitle('Time', `Now system time is ${sysTime}`);
      const res = new Date(convertYear(bookDate)) - new Date(sysTime);

      if (bookFlag && (res <= (2595600000 + earlyMin * 60 * 1000))) {
        em.emit(emitEvent);
        padTitle('Triggered', 'Book time is up, trigger booking event.');
      } else if (bookFlag) {
        padTitle('Alert', `Wait for ${((res - 2595600000 - (earlyMin * 60 * 1000)) / 1000 / 60 / 60).toFixed(1)} hours to trigger booking event`);
      }
    }

    await timePage.waitFor(interval);
    em.emit('TimeCheck', interval);
  });

  // #endregion

  // Register booking event

  em.on('CompeletBooking', async () => {
    bookFlag = false;
    let res = true;

    do {
      res = await loadDraft();
    } while (!res);
  });

  em.on('ReloadBooking', async () => {
    bookFlag = false;
    const draftPage = await browser.newPage();
    const naviWaitDP = draftPage.waitForNavigation({ waitUtil: 'networkidle2' });
    await draftPage.goto(draftAddr);
    await naviWaitDP;
    let flag = true;

    // #region - Dialog event handler of draftPage
    // ## Dismiss all dialog of draftPage.
    draftPage.on('dialog', async dialog => {
      padTitle('Dialog', 'Dialog detected, system closed it automatically.');
      padTitle('Info', dialog.message());
      await dialog.dismiss();
    });
    // #endregion

    // #region - Query Drafts
    // ## Input data for quering drafts.
    await draftPage.type('#ContentPlaceHolder1_apply_sid', identifyCode);
    await draftPage.type('#ContentPlaceHolder1_apply_email', email);
    await draftPage.select('select#ContentPlaceHolder1_apply_nation', '中華民國');
    await draftPage.click('#ContentPlaceHolder1_btnappok');

    await draftPage.waitFor('#form1 > div.container > div:nth-child(3) > div.col-md-10.Rightcontent > div.content > table > tbody > tr:nth-child(2) > td:nth-child(5) > a');
    await draftPage.click('#form1 > div.container > div:nth-child(3) > div.col-md-10.Rightcontent > div.content > table > tbody > tr:nth-child(2) > td:nth-child(5) > a');
    await draftPage.waitFor(300);

    // #endregion

    // ## For-loop for booking function
    do {
      flag = await book(draftPage);
    } while (flag);
  });

  // Start to Sync Time
  em.emit('TimeCheck', 500);

  console.log('main thread end!');
})();
