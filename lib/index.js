"use strict";
require('@babel/polyfill');

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var puppeteer = require('puppeteer');

var events = require('events');

var tesseract = require('tesseract.js');

var gm = require('gm');

var pad = require('pad');

var fs = require('fs');

var emitEvent = 'ReloadBooking';
var draftAddr = 'https://npm.cpami.gov.tw/apply_2_1.aspx';
var checkImgPath = './checkimg/CheckImageCode.png';
var em = new events.EventEmitter();
var init = {};
var sysTime;
var checkCode;
var clipOpt;
var bookFlag = true;

_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee8() {
  var padTitle, convertYear, getPropertyValue, _getPropertyValue, checkImg, _checkImg, getImg, _getImg, book, _book, browser, timer;

  return regeneratorRuntime.wrap(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _book = function _ref14() {
            _book = _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee7(draftPage) {
              var element, ableDate, beforeURL, currentURL;
              return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      _context7.next = 2;
                      return draftPage.$('#ContentPlaceHolder1_btnsave');

                    case 2:
                      if (_context7.sent) {
                        _context7.next = 9;
                        break;
                      }

                      padTitle('Restart', "Can't find Save Btn (7:00 am not yet), system is retrying.");
                      _context7.next = 6;
                      return draftPage.reload();

                    case 6:
                      _context7.next = 8;
                      return draftPage.waitFor(init.pauseTime);

                    case 8:
                      return _context7.abrupt("return", true);

                    case 9:
                      _context7.next = 11;
                      return draftPage.$$('#ContentPlaceHolder1_applystart > option');

                    case 11:
                      element = _context7.sent;
                      _context7.next = 14;
                      return getPropertyValue(element[element.length - 1]);

                    case 14:
                      ableDate = _context7.sent;

                      if (!(new Date(init.bookDate) - new Date(ableDate) > 0)) {
                        _context7.next = 23;
                        break;
                      }

                      padTitle('Restart', 'Book date is not available, system is retrying.');
                      padTitle('Restart', "The lastest date is ".concat(ableDate, ", book date is ").concat(init.bookDate));
                      _context7.next = 20;
                      return draftPage.reload();

                    case 20:
                      _context7.next = 22;
                      return draftPage.waitFor(init.pauseTime);

                    case 22:
                      return _context7.abrupt("return", true);

                    case 23:
                      _context7.next = 25;
                      return draftPage.select('#ContentPlaceHolder1_applystart', init.bookDate);

                    case 25:
                      _context7.next = 27;
                      return draftPage.waitFor(250);

                    case 27:
                      _context7.next = 29;
                      return getImg(draftPage, clipOpt);

                    case 29:
                      _context7.next = 31;
                      return checkImg(draftPage, checkImgPath);

                    case 31:
                      if (!_context7.sent) {
                        _context7.next = 38;
                        break;
                      }

                      padTitle('Restart', 'Wrong length of check code, system is retrying.');
                      _context7.next = 35;
                      return draftPage.reload();

                    case 35:
                      _context7.next = 37;
                      return draftPage.waitFor(init.pauseTime);

                    case 37:
                      return _context7.abrupt("return", true);

                    case 38:
                      _context7.next = 40;
                      return draftPage.type('#ContentPlaceHolder1_vcode', checkCode);

                    case 40:
                      _context7.next = 42;
                      return draftPage.select('select#ContentPlaceHolder1_teams_count', init.memberNum);

                    case 42:
                      _context7.next = 44;
                      return draftPage.waitFor(500);

                    case 44:
                      _context7.next = 46;
                      return draftPage.url();

                    case 46:
                      beforeURL = _context7.sent;
                      _context7.next = 49;
                      return draftPage.click('#ContentPlaceHolder1_btnsave');

                    case 49:
                      padTitle('BeforeURL', beforeURL);
                      _context7.next = 52;
                      return draftPage.waitFor(1000);

                    case 52:
                      _context7.next = 54;
                      return draftPage.url();

                    case 54:
                      currentURL = _context7.sent;
                      padTitle('CurrentURL', currentURL);

                      if (!(beforeURL === currentURL)) {
                        _context7.next = 63;
                        break;
                      }

                      padTitle('Restart', 'Wrong check code, system is retrying.');
                      _context7.next = 60;
                      return draftPage.reload();

                    case 60:
                      _context7.next = 62;
                      return draftPage.waitFor(init.pauseTime);

                    case 62:
                      return _context7.abrupt("return", true);

                    case 63:
                      // #endregion
                      padTitle('Success', 'Successfully Booking! System is going to stop.');
                      _context7.next = 66;
                      return draftPage.waitFor(4000);

                    case 66:
                      _context7.next = 68;
                      return draftPage.screenshot({
                        path: './success_apply_screen.png',
                        type: 'png',
                        fullPage: true
                      });

                    case 68:
                      return _context7.abrupt("return", false);

                    case 69:
                    case "end":
                      return _context7.stop();
                  }
                }
              }, _callee7, this);
            }));
            return _book.apply(this, arguments);
          };

          book = function _ref13(_x5) {
            return _book.apply(this, arguments);
          };

          _getImg = function _ref12() {
            _getImg = _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee6(page) {
              var _clipOpt,
                  imgElement,
                  _args6 = arguments;

              return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      _clipOpt = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : undefined;
                      _context6.next = 3;
                      return page.waitFor('#ContentPlaceHolder1_imgcode');

                    case 3:
                      imgElement = _context6.sent;

                      if (!_clipOpt) {
                        _context6.next = 8;
                        break;
                      }

                      clipOpt = _clipOpt;
                      _context6.next = 13;
                      break;

                    case 8:
                      _context6.next = 10;
                      return imgElement.boundingBox();

                    case 10:
                      clipOpt = _context6.sent;
                      clipOpt.x *= init.screenZoomRatio;
                      clipOpt.y *= init.screenZoomRatio;

                    case 13:
                      _context6.next = 15;
                      return imgElement.screenshot({
                        path: checkImgPath,
                        type: 'png',
                        clip: clipOpt
                      });

                    case 15:
                    case "end":
                      return _context6.stop();
                  }
                }
              }, _callee6, this);
            }));
            return _getImg.apply(this, arguments);
          };

          getImg = function _ref11(_x4) {
            return _getImg.apply(this, arguments);
          };

          _checkImg = function _ref10() {
            _checkImg = _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee5(page, path) {
              var newPath,
                  result,
                  _args5 = arguments;
              return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      newPath = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : './checkimg/CheckImageCode01.png';
                      // #region - Image threshold process
                      padTitle('Threshold', 'Starting image threshold covertion.');
                      _context5.next = 4;
                      return gm(path).threshold(45, true).write(newPath, function (err) {
                        if (err) {
                          return Promise.reject(err);
                        }

                        return Promise.resolve();
                      });

                    case 4:
                      padTitle('Threshold', 'Ending image threshold covertion.'); // #endregion
                      // #region - Image reconization

                      _context5.next = 7;
                      return page.waitFor(500);

                    case 7:
                      padTitle('Reconization', 'Starting image reconization.');
                      _context5.next = 10;
                      return tesseract.recognize(newPath).then(function (res) {
                        checkCode = res.text.trim();
                        padTitle('Result', "Check code is : ".concat(checkCode));
                      });

                    case 10:
                      result = false;

                      if (checkCode.length !== 5) {
                        result = true;
                      }

                      padTitle('Reconization', 'Ending image reconization.');
                      return _context5.abrupt("return", result);

                    case 14:
                    case "end":
                      return _context5.stop();
                  }
                }
              }, _callee5, this);
            }));
            return _checkImg.apply(this, arguments);
          };

          checkImg = function _ref9(_x2, _x3) {
            return _checkImg.apply(this, arguments);
          };

          _getPropertyValue = function _ref8() {
            _getPropertyValue = _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee4(element) {
              var property,
                  jsHandle,
                  value,
                  _args4 = arguments;
              return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      property = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : 'value';
                      _context4.next = 3;
                      return element.getProperty(property);

                    case 3:
                      jsHandle = _context4.sent;
                      _context4.next = 6;
                      return jsHandle.jsonValue();

                    case 6:
                      value = _context4.sent;
                      return _context4.abrupt("return", value);

                    case 8:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _callee4, this);
            }));
            return _getPropertyValue.apply(this, arguments);
          };

          getPropertyValue = function _ref7(_x) {
            return _getPropertyValue.apply(this, arguments);
          };

          convertYear = function _ref6(_date) {
            var date = _date.trim();

            date = date.replace(date.substr(0, 3), date.substr(0, 3) * 1 + 1911);
            return date;
          };

          padTitle = function _ref5(title, message) {
            console.log("=== ".concat(title, " ==="));
            console.log();
            console.log("".concat(pad(2, ''), " ").concat(message));
            console.log();
          };

          console.log('Program Start!'); // #region Init

          if (!fs.existsSync('./checkimg')) {
            fs.mkdirSync('./checkimg');
          }

          if (!fs.existsSync('./init.json')) {
            _context8.next = 16;
            break;
          }

          init = JSON.parse(fs.readFileSync('./init.json').toString());
          _context8.next = 18;
          break;

        case 16:
          console.log('Please put your init.json at root folder!');
          return _context8.abrupt("return");

        case 18:
          _context8.next = 20;
          return puppeteer.launch({
            headless: false
          });

        case 20:
          browser = _context8.sent;
          // #endregion
          // #region - Time Check Event
          em.on('TimeCheck',
          /*#__PURE__*/
          _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee() {
            var res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    sysTime = new Date(Date.now());
                    padTitle('Time', "Now system time is ".concat(sysTime.toLocaleString()));
                    res = new Date(convertYear(init.bookDate)) - new Date(sysTime);

                    if (bookFlag && res <= 2595600000 + init.earlyMin * 60 * 1000) {
                      em.emit(emitEvent);
                      clearInterval(timer);
                      padTitle('Triggered', 'Book time is up, trigger booking event and stop time check event.');
                    } else if (bookFlag) {
                      padTitle('Alert', "Wait for ".concat(((res - 2595600000 - init.earlyMin * 60 * 1000) / 1000 / 60 / 60).toFixed(1), " hours to trigger booking event"));
                    }

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }))); // #endregion

          em.on('ReloadBooking',
          /*#__PURE__*/
          _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee3() {
            var draftPage, naviWaitDP, flag;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    bookFlag = false;
                    _context3.next = 3;
                    return browser.newPage();

                  case 3:
                    draftPage = _context3.sent;
                    naviWaitDP = draftPage.waitForNavigation({
                      waitUtil: 'networkidle2'
                    });
                    _context3.next = 7;
                    return draftPage.goto(draftAddr);

                  case 7:
                    _context3.next = 9;
                    return naviWaitDP;

                  case 9:
                    flag = true; // #region - Dialog event handler of draftPage

                    draftPage.on('dialog',
                    /*#__PURE__*/
                    function () {
                      var _ref4 = _asyncToGenerator(
                      /*#__PURE__*/
                      regeneratorRuntime.mark(function _callee2(dialog) {
                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                          while (1) {
                            switch (_context2.prev = _context2.next) {
                              case 0:
                                padTitle('Dialog', 'Dialog detected, system closed it automatically.');
                                padTitle('Info', dialog.message());
                                _context2.next = 4;
                                return dialog.dismiss();

                              case 4:
                              case "end":
                                return _context2.stop();
                            }
                          }
                        }, _callee2, this);
                      }));

                      return function (_x6) {
                        return _ref4.apply(this, arguments);
                      };
                    }()); // #endregion
                    // #region - Query Drafts

                    _context3.next = 13;
                    return draftPage.type('#ContentPlaceHolder1_apply_sid', init.identityCode);

                  case 13:
                    _context3.next = 15;
                    return draftPage.type('#ContentPlaceHolder1_apply_email', init.email);

                  case 15:
                    _context3.next = 17;
                    return draftPage.select('select#ContentPlaceHolder1_apply_nation', '中華民國');

                  case 17:
                    _context3.next = 19;
                    return draftPage.click('#ContentPlaceHolder1_btnappok');

                  case 19:
                    _context3.next = 21;
                    return draftPage.waitFor('#form1 > div.container > div:nth-child(3) > div.col-md-10.Rightcontent > div.content > table > tbody > tr:nth-child(2) > td:nth-child(5) > a');

                  case 21:
                    _context3.next = 23;
                    return draftPage.click('#form1 > div.container > div:nth-child(3) > div.col-md-10.Rightcontent > div.content > table > tbody > tr:nth-child(2) > td:nth-child(5) > a');

                  case 23:
                    _context3.next = 25;
                    return draftPage.waitFor(300);

                  case 25:
                    _context3.next = 27;
                    return book(draftPage);

                  case 27:
                    flag = _context3.sent;

                  case 28:
                    if (flag) {
                      _context3.next = 25;
                      break;
                    }

                  case 29:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this);
          }))); // Start to Sync Time

          timer = setInterval(function () {
            em.emit('TimeCheck');
          }, 3000);
          console.log('main thread end!');

        case 25:
        case "end":
          return _context8.stop();
      }
    }
  }, _callee8, this);
}))();