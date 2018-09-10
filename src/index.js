const puppeteer = require('puppeteer');
const events = require('events');
const tesseract = require('tesseract.js');
const gm = require('gm');
const pad = require('pad');
const fs = require('fs');

const emitEvent = 'ReloadBooking';
const timeAddr = 'https://npm.cpami.gov.tw/index.aspx';
const draftAddr = 'https://npm.cpami.gov.tw/apply_2_1.aspx';
const checkImgPath = './checkimg/CheckImageCode.png';
const em = new events.EventEmitter();

let init = {};
let sysTime;
let checkCode;
let clipOpt;
let bookFlag = true;

(async () => {
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
  /**
   * This function will compelet the process of booking except loading drafts,
   * because loading drafts should be done before calling this func,
   * also you should pass the page obj which has already navigated to draft page as parameter
   * to this func.
   *
   * @param {any} draftPage - given by browser.newPage()
   */
  async function book(draftPage) {
    // #region - Check Save Btn exist or not

    if (!(await draftPage.$('#ContentPlaceHolder1_btnsave'))) {
      padTitle('Restart', "Can't find Save Btn (7:00 am not yet), system is retrying.");
      await draftPage.reload();
      await draftPage.waitFor(init.pauseTime);
      return true;
    }

    // #endregion

    // #region - Check Available Book Date

    const element = await draftPage.waitFor('#ContentPlaceHolder1_applystart > option:nth-child(25)');
    const value = await getPropertyValue(element);
    if ((new Date(init.bookDate) - new Date(value)) > 0) {
      padTitle('Restart', 'Book date is not available, system is retrying.');
      padTitle('Restart', `The lastest date is ${value}, book date is ${init.bookDate}`);
      await draftPage.reload();
      await draftPage.waitFor(init.pauseTime);
      return true;
    }

    // #endregion

    // #region - Reset Wanted Book Date

    await draftPage.select('#ContentPlaceHolder1_applystart', init.bookDate);
    await draftPage.waitFor(500);

    // #endregion

    // #region - Check Img Handler

    await getImg(draftPage, clipOpt);
    if (await checkImg(draftPage, checkImgPath)) {
      padTitle('Restart', 'Wrong length of check code, system is retrying.');
      await draftPage.reload();
      await draftPage.waitFor(init.pauseTime);
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
      await draftPage.waitFor(init.pauseTime);
      return true;
    }

    // #endregion

    padTitle('Success', 'Successfully Booking! System is going to stop.');
    await draftPage.waitFor(4000);
    await draftPage.screenshot({ path: './success_apply_screen.png', type: 'png', fullPage: true });
    return false;
  }

  console.log('Program Start!');

  // #region Init

  if (!fs.existsSync('./checkimg')) { fs.mkdirSync('./checkimg'); }
  if (fs.existsSync('./init.json')) {
    init = JSON.parse(fs.readFileSync('./init.json').toString());
  } else {
    console.log('Please put your init.json at root folder!');
    return;
  }

  const browser = await puppeteer.launch({ headless: false });
  const timePage = await browser.newPage();
  await timePage.goto(timeAddr);

  // #endregion

  // #region - Time Check Event

  em.on('TimeCheck', async interval => {
    const Handler = await timePage.$('#ContentPlaceHolder1_Clocks');
    const html = await timePage.evaluate(body => body.innerHTML, Handler);
    await Handler.dispose();

    if (sysTime !== convertYear(html)) {
      sysTime = convertYear(html);
      padTitle('Time', `Now system time is ${sysTime}`);
      const res = new Date(convertYear(init.bookDate)) - new Date(sysTime);

      if (bookFlag && (res <= (2595600000 + init.earlyMin * 60 * 1000))) {
        em.emit(emitEvent);
        padTitle('Triggered', 'Book time is up, trigger booking event.');
      } else if (bookFlag) {
        padTitle('Alert', `Wait for ${((res - 2595600000 - (init.earlyMin * 60 * 1000)) / 1000 / 60 / 60).toFixed(1)} hours to trigger booking event`);
      }
    }

    await timePage.waitFor(interval);
    em.emit('TimeCheck', interval);
  });

  // #endregion

  em.on('ReloadBooking', async () => {
    bookFlag = false;
    const draftPage = await browser.newPage();
    const naviWaitDP = draftPage.waitForNavigation({ waitUtil: 'networkidle2' });
    await draftPage.goto(draftAddr);
    await naviWaitDP;
    let flag = true;

    // #region - Dialog event handler of draftPage

    draftPage.on('dialog', async dialog => {
      padTitle('Dialog', 'Dialog detected, system closed it automatically.');
      padTitle('Info', dialog.message());
      await dialog.dismiss();
    });

    // #endregion

    // #region - Query Drafts

    await draftPage.type('#ContentPlaceHolder1_apply_sid', init.identityCode);
    await draftPage.type('#ContentPlaceHolder1_apply_email', init.email);
    await draftPage.select('select#ContentPlaceHolder1_apply_nation', '中華民國');
    await draftPage.click('#ContentPlaceHolder1_btnappok');

    await draftPage.waitFor('#form1 > div.container > div:nth-child(3) > div.col-md-10.Rightcontent > div.content > table > tbody > tr:nth-child(2) > td:nth-child(5) > a');
    await draftPage.click('#form1 > div.container > div:nth-child(3) > div.col-md-10.Rightcontent > div.content > table > tbody > tr:nth-child(2) > td:nth-child(5) > a');
    await draftPage.waitFor(300);

    // #endregion

    // For-loop for booking function
    do {
      flag = await book(draftPage);
    } while (flag);
  });

  // Start to Sync Time
  em.emit('TimeCheck', 500);

  console.log('main thread end!');
})();
