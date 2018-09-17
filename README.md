# puppeteer-example

This project will use puppeteer to run a headless (or not) chrome for booking a date to climb 雪山(Xue Mountain) from 雪霸國家公園(Shei-Pa National Park).

This program allow you to set a date you want to book, and it will keep waitting until the date is avalible to book. It can automaticlly reconize the verification code and enter it to compelete the book.

## Installation

Fisrt of all, you need to download and install [GraphicsMagick](http://www.graphicsmagick.org/) for the reconization of verification code.

Second, use git clone this project, and then use yarn or npm to install modules:
```=bash
git clone https://github.com/hakalon/puppeteer-example.git

yarn install --prod
// or
npm install --production
```

## Usage

Before you start to run this program, you need to do two things.

One is to create the draft of your reservation on [the official website](https://npm.cpami.gov.tw/apply_1_2.aspx?unit=e6dd4652-2d37-4346-8f5d-6e538353e0c2).  
After you fill out all of the form, please click the **Check Values(檢查格式)** on the bottom, if there is nothing wrong, then type the verication code and click **Save Draft(儲存草稿)**.

Two is to create your **init.json** on the root of this project directory, and the **init.json** should be like this:
```=bash
{
  "identityCode": "A11111111",
  "email": "aaa@gmail.com",
  "bookDate": "107-01-15",
  "memberNum": "2",
  "earlyMin": 2,
  "pauseTime": 200,
  "screenZoomRatio": 1.00
}
```

1. **identityCode**:  
The identity code you use for booking.
2. **email**:  
The email you use for booking.
3. **bookDate**:  
The date you want to book, please make sure the format of date is the same as the example.
4. **memberNum**:  
The total number of person who joins this trip.
5. **earlyMin**:  
The time this program will early start to keep trying to book, and the unit is Minute.  
For example, if you set earlyMin to 2, then this program will start to keep trying to book at 06:58.  
(BTW, The allowed book time is 07:00, and the allowed book date is one month, so if you want to book 107/02/01, the date and time you can start to book is 107/01/02 07:00 AM)
6. **pauseTime**:  
The interval between the loop of trying to book, and the unit is millisecond. The smaller this parameter, the faster the loop of trying to book.
7. **screenZoomRatio**:  
The screen zoom ratio of your computer, it matters the coordinate of screenshot. In Windows, just press **Windows+I**, and click **System(系統)** > **Monitor(顯示器)**, and then check the setting of **Zooming and layout(縮放與版面配置)**.  
If your computer set 150%, then use 1.5 on this parameter, and I think only laptop will need to change this parameter.

Now you can just use the command below to start program, and you should see the program keeping showing some hint on the console:
```=bash
yarn start
```