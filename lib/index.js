"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var puppeteer = require('puppeteer');

var events = require('events');

var tesseract = require('tesseract.js');

var gm = require('gm');

var pad = require('pad');

var fs = require('fs');

var emitEvent = 'ReloadBooking';
var timeAddr = 'https://npm.cpami.gov.tw/index.aspx';
var draftAddr = 'https://npm.cpami.gov.tw/apply_2_1.aspx';
var checkImgPath = './checkimg/CheckImageCode.png';
var em = new events.EventEmitter();
var pauseTime = 200;
var bookDate = '';
var earlyMin = 0;
var identifyCode = '';
var email = '';
var init = ['id', 'mail', 'date', 'min', 'time'];
var sysTime;
var checkCode;
var clipOpt;
var bookFlag = true;

_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee11() {
  var browser, timePage, padTitle, convertYear, getPropertyValue, _getPropertyValue, checkImg, _checkImg, getImg, _getImg, loadDraft, _loadDraft, book, _book;

  return regeneratorRuntime.wrap(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _book = function _ref18() {
            _book = _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee10(draftPage) {
              var element, value, beforeURL, currentURL;
              return regeneratorRuntime.wrap(function _callee10$(_context10) {
                while (1) {
                  switch (_context10.prev = _context10.next) {
                    case 0:
                      _context10.next = 2;
                      return draftPage.$('#ContentPlaceHolder1_btnsave');

                    case 2:
                      if (_context10.sent) {
                        _context10.next = 9;
                        break;
                      }

                      padTitle('Restart', "Can't find Save Btn (7:00 am not yet), system is retrying.");
                      _context10.next = 6;
                      return draftPage.reload();

                    case 6:
                      _context10.next = 8;
                      return draftPage.waitFor(pauseTime);

                    case 8:
                      return _context10.abrupt("return", true);

                    case 9:
                      _context10.next = 11;
                      return draftPage.waitFor('#ContentPlaceHolder1_applystart > option:nth-child(25)');

                    case 11:
                      element = _context10.sent;
                      _context10.next = 14;
                      return getPropertyValue(element);

                    case 14:
                      value = _context10.sent;

                      if (!(new Date(bookDate) - new Date(value) > 0)) {
                        _context10.next = 23;
                        break;
                      }

                      padTitle('Restart', 'Book date is not available, system is retrying.');
                      padTitle('Restart', "The lastest date is ".concat(value, ", book date is ").concat(bookDate));
                      _context10.next = 20;
                      return draftPage.reload();

                    case 20:
                      _context10.next = 22;
                      return draftPage.waitFor(pauseTime);

                    case 22:
                      return _context10.abrupt("return", true);

                    case 23:
                      _context10.next = 25;
                      return draftPage.select('#ContentPlaceHolder1_applystart', bookDate);

                    case 25:
                      _context10.next = 27;
                      return draftPage.waitFor(500);

                    case 27:
                      _context10.next = 29;
                      return getImg(draftPage, clipOpt);

                    case 29:
                      _context10.next = 31;
                      return checkImg(draftPage, checkImgPath);

                    case 31:
                      if (!_context10.sent) {
                        _context10.next = 38;
                        break;
                      }

                      padTitle('Restart', 'Wrong length of check code, system is retrying.');
                      _context10.next = 35;
                      return draftPage.reload();

                    case 35:
                      _context10.next = 37;
                      return draftPage.waitFor(pauseTime);

                    case 37:
                      return _context10.abrupt("return", true);

                    case 38:
                      _context10.next = 40;
                      return draftPage.type('#ContentPlaceHolder1_vcode', checkCode);

                    case 40:
                      _context10.next = 42;
                      return draftPage.select('select#ContentPlaceHolder1_teams_count', '3');

                    case 42:
                      _context10.next = 44;
                      return draftPage.waitFor(500);

                    case 44:
                      _context10.next = 46;
                      return draftPage.url();

                    case 46:
                      beforeURL = _context10.sent;
                      _context10.next = 49;
                      return draftPage.click('#ContentPlaceHolder1_btnsave');

                    case 49:
                      padTitle('BeforeURL', beforeURL);
                      _context10.next = 52;
                      return draftPage.waitFor(1000);

                    case 52:
                      _context10.next = 54;
                      return draftPage.url();

                    case 54:
                      currentURL = _context10.sent;
                      padTitle('CurrentURL', currentURL);

                      if (!(beforeURL === currentURL)) {
                        _context10.next = 63;
                        break;
                      }

                      padTitle('Restart', 'Wrong check code, system is retrying.');
                      _context10.next = 60;
                      return draftPage.reload();

                    case 60:
                      _context10.next = 62;
                      return draftPage.waitFor(pauseTime);

                    case 62:
                      return _context10.abrupt("return", true);

                    case 63:
                      // #endregion
                      padTitle('Success', 'Successfully Booking! System is going to stop.');
                      _context10.next = 66;
                      return draftPage.waitFor(4000);

                    case 66:
                      _context10.next = 68;
                      return draftPage.screenshot({
                        path: './success_apply_screen.png',
                        type: 'png',
                        fullPage: true
                      });

                    case 68:
                      return _context10.abrupt("return", false);

                    case 69:
                    case "end":
                      return _context10.stop();
                  }
                }
              }, _callee10, this);
            }));
            return _book.apply(this, arguments);
          };

          book = function _ref17(_x5) {
            return _book.apply(this, arguments);
          };

          _loadDraft = function _ref16() {
            _loadDraft = _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee9() {
              var draftPage, btnErr, element, value, resetFlag, beforeUrl, temp, currentUrl;
              return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                  switch (_context9.prev = _context9.next) {
                    case 0:
                      _context9.next = 2;
                      return browser.newPage();

                    case 2:
                      draftPage = _context9.sent;
                      _context9.next = 5;
                      return draftPage.goto(draftAddr);

                    case 5:
                      // #region - Draft page dialog handler
                      draftPage.on('dialog',
                      /*#__PURE__*/
                      function () {
                        var _ref6 = _asyncToGenerator(
                        /*#__PURE__*/
                        regeneratorRuntime.mark(function _callee8(dialog) {
                          return regeneratorRuntime.wrap(function _callee8$(_context8) {
                            while (1) {
                              switch (_context8.prev = _context8.next) {
                                case 0:
                                  console.log('Alter - Dialog show up, system will automatically close it.');
                                  console.log("Message - ".concat(dialog.message));
                                  _context8.next = 4;
                                  return dialog.dismiss();

                                case 4:
                                case "end":
                                  return _context8.stop();
                              }
                            }
                          }, _callee8, this);
                        }));

                        return function (_x8) {
                          return _ref6.apply(this, arguments);
                        };
                      }()); // #endregion
                      // #region - Query Drafts

                      _context9.next = 8;
                      return draftPage.type('#ContentPlaceHolder1_apply_sid', 'K122378990');

                    case 8:
                      _context9.next = 10;
                      return draftPage.type('#ContentPlaceHolder1_apply_email', 'tf4ewg@gmail.com');

                    case 10:
                      _context9.next = 12;
                      return draftPage.select('select#ContentPlaceHolder1_apply_nation', '中華民國');

                    case 12:
                      _context9.next = 14;
                      return draftPage.click('#ContentPlaceHolder1_btnappok');

                    case 14:
                      btnErr = _context9.sent;
                      if (btnErr) console.log("Query Draft btn error: ".concat(btnErr));
                      _context9.next = 18;
                      return draftPage.waitFor('#form1 > div.container > div:nth-child(3) > div.col-md-10.Rightcontent > div.content > table > tbody > tr:nth-child(2) > td:nth-child(5) > a');

                    case 18:
                      _context9.next = 20;
                      return draftPage.click('#form1 > div.container > div:nth-child(3) > div.col-md-10.Rightcontent > div.content > table > tbody > tr:nth-child(2) > td:nth-child(5) > a');

                    case 20:
                      _context9.next = 22;
                      return draftPage.waitFor('#ContentPlaceHolder1_applystart > option:nth-child(24)');

                    case 22:
                      element = _context9.sent;
                      _context9.next = 25;
                      return getPropertyValue(element);

                    case 25:
                      value = _context9.sent;

                      if (!(value !== bookDate)) {
                        _context9.next = 34;
                        break;
                      }

                      console.log('Alert - 預定日期尚未開放，系統重新嘗試中！');
                      console.log("Info - \u76EE\u524D\u53EF\u9810\u8A02\u4E4B\u6700\u65E9\u65E5\u671F\u70BA: ".concat(value, "\uFF0C\u9810\u5B9A\u65E5\u671F\u70BA: ").concat(bookDate));
                      _context9.next = 31;
                      return draftPage.waitFor(pauseTime);

                    case 31:
                      _context9.next = 33;
                      return draftPage.close();

                    case 33:
                      return _context9.abrupt("return", false);

                    case 34:
                      _context9.next = 36;
                      return draftPage.select('#ContentPlaceHolder1_applystart', bookDate);

                    case 36:
                      _context9.next = 38;
                      return draftPage.waitFor(500);

                    case 38:
                      console.log('System: True'); // #endregion
                      // #region - Check Img Handler

                      console.log('Start - Handle check img');
                      _context9.next = 42;
                      return getImg(draftPage);

                    case 42:
                      _context9.next = 44;
                      return checkImg(checkImgPath);

                    case 44:
                      resetFlag = _context9.sent;
                      console.log('End - Handle check img'); // #endregion
                      // #region - Wrong length of Check Code Handler
                      // 只能檢查出驗證碼長度對不對，假設不對下方程式碼只會重設驗證圖，然後重新辨識
                      // 但是覺得太麻煩，還是直接整個loadDraft()重跑比較快。
                      // console.log(resetFlag);
                      // while (resetFlag) {
                      //   await resetCheckImg();
                      // }

                      if (!resetFlag) {
                        _context9.next = 52;
                        break;
                      }

                      _context9.next = 49;
                      return draftPage.waitFor(pauseTime);

                    case 49:
                      _context9.next = 51;
                      return draftPage.close();

                    case 51:
                      return _context9.abrupt("return", false);

                    case 52:
                      _context9.next = 54;
                      return draftPage.type('#ContentPlaceHolder1_vcode', checkCode);

                    case 54:
                      _context9.next = 56;
                      return draftPage.select('select#ContentPlaceHolder1_teams_count', '3');

                    case 56:
                      beforeUrl = draftPage.url();
                      _context9.next = 59;
                      return draftPage.waitFor(300);

                    case 59:
                      _context9.next = 61;
                      return draftPage.$('#ContentPlaceHolder1_btnsave');

                    case 61:
                      temp = _context9.sent;

                      if (temp) {
                        _context9.next = 69;
                        break;
                      }

                      console.log('Alert - 按鈕尚未出現!!!!');
                      _context9.next = 66;
                      return draftPage.waitFor(pauseTime);

                    case 66:
                      _context9.next = 68;
                      return draftPage.close();

                    case 68:
                      return _context9.abrupt("return", false);

                    case 69:
                      _context9.next = 71;
                      return draftPage.click('#ContentPlaceHolder1_btnsave');

                    case 71:
                      _context9.next = 73;
                      return draftPage.waitFor(1000);

                    case 73:
                      currentUrl = draftPage.url();

                      if (!(beforeUrl === currentUrl)) {
                        _context9.next = 81;
                        break;
                      }

                      console.log('驗證碼錯誤!!! 系統重新嘗試中!!!');
                      _context9.next = 78;
                      return draftPage.waitFor(pauseTime);

                    case 78:
                      _context9.next = 80;
                      return draftPage.close();

                    case 80:
                      return _context9.abrupt("return", false);

                    case 81:
                      _context9.next = 83;
                      return draftPage.screenshot({
                        path: './success_apply_screen.png',
                        type: 'png',
                        fullPage: true
                      });

                    case 83:
                      console.log('Alter - Successfully Booking! System is going to stop.');
                      return _context9.abrupt("return", true);

                    case 85:
                    case "end":
                      return _context9.stop();
                  }
                }
              }, _callee9, this);
            }));
            return _loadDraft.apply(this, arguments);
          };

          loadDraft = function _ref15() {
            return _loadDraft.apply(this, arguments);
          };

          _getImg = function _ref14() {
            _getImg = _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee7(page) {
              var _clipOpt,
                  imgElement,
                  _args7 = arguments;

              return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      _clipOpt = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : undefined;
                      _context7.next = 3;
                      return page.waitFor('#ContentPlaceHolder1_imgcode');

                    case 3:
                      imgElement = _context7.sent;

                      if (!_clipOpt) {
                        _context7.next = 8;
                        break;
                      }

                      clipOpt = _clipOpt;
                      _context7.next = 13;
                      break;

                    case 8:
                      _context7.next = 10;
                      return imgElement.boundingBox();

                    case 10:
                      clipOpt = _context7.sent;
                      clipOpt.x *= 2;
                      clipOpt.y *= 2;

                    case 13:
                      _context7.next = 15;
                      return imgElement.screenshot({
                        path: checkImgPath,
                        type: 'png',
                        clip: clipOpt
                      });

                    case 15:
                    case "end":
                      return _context7.stop();
                  }
                }
              }, _callee7, this);
            }));
            return _getImg.apply(this, arguments);
          };

          getImg = function _ref13(_x4) {
            return _getImg.apply(this, arguments);
          };

          _checkImg = function _ref12() {
            _checkImg = _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee6(page, path) {
              var newPath,
                  _args6 = arguments;
              return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      newPath = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : './checkimg/CheckImageCode01.png';
                      // #region - Image threshold process
                      padTitle('Threshold', 'Starting image threshold covertion.');
                      _context6.next = 4;
                      return gm(path).threshold(45, true).write(newPath, function (err) {
                        if (err) {
                          return Promise.reject(err);
                        }

                        return Promise.resolve();
                      });

                    case 4:
                      padTitle('Threshold', 'Ending image threshold covertion.'); // #endregion
                      // #region - Image reconization

                      _context6.next = 7;
                      return page.waitFor(500);

                    case 7:
                      padTitle('Reconization', 'Starting image reconization.');
                      _context6.next = 10;
                      return tesseract.recognize(newPath).then(function (res) {
                        checkCode = res.text.trim();
                        padTitle('Result', "Check code is : ".concat(checkCode));
                      });

                    case 10:
                      if (!(checkCode.length !== 5)) {
                        _context6.next = 12;
                        break;
                      }

                      return _context6.abrupt("return", true);

                    case 12:
                      padTitle('Reconization', 'Ending image reconization.');
                      return _context6.abrupt("return", false);

                    case 14:
                    case "end":
                      return _context6.stop();
                  }
                }
              }, _callee6, this);
            }));
            return _checkImg.apply(this, arguments);
          };

          checkImg = function _ref11(_x2, _x3) {
            return _checkImg.apply(this, arguments);
          };

          _getPropertyValue = function _ref10() {
            _getPropertyValue = _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee5(element) {
              var property,
                  jsHandle,
                  value,
                  _args5 = arguments;
              return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      property = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : 'value';
                      _context5.next = 3;
                      return element.getProperty(property);

                    case 3:
                      jsHandle = _context5.sent;
                      _context5.next = 6;
                      return jsHandle.jsonValue();

                    case 6:
                      value = _context5.sent;
                      return _context5.abrupt("return", value);

                    case 8:
                    case "end":
                      return _context5.stop();
                  }
                }
              }, _callee5, this);
            }));
            return _getPropertyValue.apply(this, arguments);
          };

          getPropertyValue = function _ref9(_x) {
            return _getPropertyValue.apply(this, arguments);
          };

          convertYear = function _ref8(_date) {
            var date = _date.trim();

            date = date.replace(date.substr(0, 3), date.substr(0, 3) * 1 + 1911);
            return date;
          };

          padTitle = function _ref7(title, message) {
            console.log("=== ".concat(title, " ==="));
            console.log();
            console.log("".concat(pad(2, ''), " ").concat(message));
            console.log();
          };

          console.log('Program Start!'); // #region Init

          if (!fs.existsSync('./checkimg')) {
            fs.mkdirSync('./checkimg');
          }

          init = fs.readFileSync('./init.txt').toString().split(', ');
          identifyCode = init.id;
          email = init.mail;
          bookDate = init.date;
          earlyMin = init.min;
          pauseTime = init.time; // #endregion

          _context11.next = 22;
          return puppeteer.launch({
            headless: false
          });

        case 22:
          browser = _context11.sent;
          _context11.next = 25;
          return browser.newPage();

        case 25:
          timePage = _context11.sent;
          _context11.next = 28;
          return timePage.goto(timeAddr);

        case 28:
          // #region - Time Check Event
          em.on('TimeCheck',
          /*#__PURE__*/
          function () {
            var _ref2 = _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee(interval) {
              var Handler, html, res;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return timePage.$('#ContentPlaceHolder1_Clocks');

                    case 2:
                      Handler = _context.sent;
                      _context.next = 5;
                      return timePage.evaluate(function (body) {
                        return body.innerHTML;
                      }, Handler);

                    case 5:
                      html = _context.sent;
                      _context.next = 8;
                      return Handler.dispose();

                    case 8:
                      if (sysTime !== convertYear(html)) {
                        sysTime = convertYear(html);
                        padTitle('Time', "Now system time is ".concat(sysTime));
                        res = new Date(convertYear(bookDate)) - new Date(sysTime);

                        if (bookFlag && res <= 2595600000 + earlyMin * 60 * 1000) {
                          em.emit(emitEvent);
                          padTitle('Triggered', 'Book time is up, trigger booking event.');
                        } else if (bookFlag) {
                          padTitle('Alert', "Wait for ".concat(((res - 2595600000 - earlyMin * 60 * 1000) / 1000 / 60 / 60).toFixed(1), " hours to trigger booking event"));
                        }
                      }

                      _context.next = 11;
                      return timePage.waitFor(interval);

                    case 11:
                      em.emit('TimeCheck', interval);

                    case 12:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, this);
            }));

            return function (_x6) {
              return _ref2.apply(this, arguments);
            };
          }()); // #endregion
          // Register booking event

          em.on('CompeletBooking',
          /*#__PURE__*/
          _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee2() {
            var res;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    bookFlag = false;
                    res = true;

                  case 2:
                    _context2.next = 4;
                    return loadDraft();

                  case 4:
                    res = _context2.sent;

                  case 5:
                    if (!res) {
                      _context2.next = 2;
                      break;
                    }

                  case 6:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          })));
          em.on('ReloadBooking',
          /*#__PURE__*/
          _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee4() {
            var draftPage, naviWaitDP, flag;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    bookFlag = false;
                    _context4.next = 3;
                    return browser.newPage();

                  case 3:
                    draftPage = _context4.sent;
                    naviWaitDP = draftPage.waitForNavigation({
                      waitUtil: 'networkidle2'
                    });
                    _context4.next = 7;
                    return draftPage.goto(draftAddr);

                  case 7:
                    _context4.next = 9;
                    return naviWaitDP;

                  case 9:
                    flag = true; // #region - Dialog event handler of draftPage

                    draftPage.on('dialog',
                    /*#__PURE__*/
                    function () {
                      var _ref5 = _asyncToGenerator(
                      /*#__PURE__*/
                      regeneratorRuntime.mark(function _callee3(dialog) {
                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                          while (1) {
                            switch (_context3.prev = _context3.next) {
                              case 0:
                                padTitle('Dialog', 'Dialog detected, system closed it automatically.');
                                padTitle('Info', dialog.message());
                                _context3.next = 4;
                                return dialog.dismiss();

                              case 4:
                              case "end":
                                return _context3.stop();
                            }
                          }
                        }, _callee3, this);
                      }));

                      return function (_x7) {
                        return _ref5.apply(this, arguments);
                      };
                    }()); // #endregion
                    // #region - Query Drafts

                    _context4.next = 13;
                    return draftPage.type('#ContentPlaceHolder1_apply_sid', identifyCode);

                  case 13:
                    _context4.next = 15;
                    return draftPage.type('#ContentPlaceHolder1_apply_email', email);

                  case 15:
                    _context4.next = 17;
                    return draftPage.select('select#ContentPlaceHolder1_apply_nation', '中華民國');

                  case 17:
                    _context4.next = 19;
                    return draftPage.click('#ContentPlaceHolder1_btnappok');

                  case 19:
                    _context4.next = 21;
                    return draftPage.waitFor('#form1 > div.container > div:nth-child(3) > div.col-md-10.Rightcontent > div.content > table > tbody > tr:nth-child(2) > td:nth-child(5) > a');

                  case 21:
                    _context4.next = 23;
                    return draftPage.click('#form1 > div.container > div:nth-child(3) > div.col-md-10.Rightcontent > div.content > table > tbody > tr:nth-child(2) > td:nth-child(5) > a');

                  case 23:
                    _context4.next = 25;
                    return draftPage.waitFor(300);

                  case 25:
                    _context4.next = 27;
                    return book(draftPage);

                  case 27:
                    flag = _context4.sent;

                  case 28:
                    if (flag) {
                      _context4.next = 25;
                      break;
                    }

                  case 29:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4, this);
          }))); // Start to Sync Time

          em.emit('TimeCheck', 500);
          console.log('main thread end!');

        case 33:
        case "end":
          return _context11.stop();
      }
    }
  }, _callee11, this);
}))();