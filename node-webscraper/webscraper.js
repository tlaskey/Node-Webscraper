'use strict'

const puppeteer = require('puppeteer')
const CronJob = require('cron').CronJob
const $ = require('cheerio')
const nodemailer = require('nodemailer')

const gtx1080ti = 'https://www.amazon.com/EVGA-Optimized-Interlaced-Graphics-11G-P4-6393-KR/dp/B07MFN49TK/'
const gtx1060 = 'https://www.amazon.com/EVGA-GeForce-GAMING-Support-03G-P4-6162-KR/dp/B01KU2CIIY/'

async function loadURLPage (url) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)
  return page
}

async function checkPrice (page, url) {
  page.reload()
  const html = await page.evaluate(() => document.body.innerHTML)

  $('#priceblock_ourprice', html).each(function () {
    const dollarPrice = $(this).text()
    const currentPrice = Number(dollarPrice.replace(/[^0-9.-]+/g, '')) // convert dollarPrice String to Number
    console.log(currentPrice)

    if (currentPrice < 300) {
      console.log(dollarPrice + ' Purchase that shit!')
      sendNotification(currentPrice, url)
    } else console.log(dollarPrice + ' Nah dawg..')
  })
}

async function sendNotification (price, url) {
  const testAccount = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  })

  const textToSend = 'Price dropped to ' + price
  const htmlText = `<a href="${url}">Link</a>`

  const info = await transporter.sendMail({
    from: '"Price Tracker" <test@gmail.com>',
    to: 'tlaskey3@gmail.com',
    subject: 'Price update on GTX 1080ti: ' + price,
    text: textToSend,
    html: htmlText
  })

  console.log('Message sent: $s', info.messageId)
}

async function startTracking (url) {
  const page = await loadURLPage(url)

  // cronjob that checks the price every 15 minutes.
  const job = new CronJob('* */15 * * * *', function () {
    checkPrice(page)
  }, null, true, null, null, true)
  job.start()
}

async function monitor (urlList) {
  urlList.forEach(async url => {
    await startTracking(url)
  })
}

const urlList = [gtx1080ti, gtx1060]

monitor(urlList)
