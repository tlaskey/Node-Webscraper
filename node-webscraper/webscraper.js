'use strict'

const puppeteer = require('puppeteer')
const CronJob = require('cron').CronJob
const $ = require('cheerio')

const gtx1080ti = 'https://www.amazon.com/EVGA-Optimized-Interlaced-Graphics-11G-P4-6393-KR/dp/B07MFN49TK/'

async function loadURLPage(url) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    return page
}

async function checkPrice(page) {
    page.reload()
    let html = await page.evaluate(() => document.body.innerHTML)
    // console.log(html)

    $('#priceblock_ourprice', html).each(function() {
        let dollarPrice = $(this).text()
        let currentPrice = Number(dollarPrice.replace(/[^0-9.-]+/g,"")) //convert dollarPrice String to Number
        console.log(currentPrice)

        if (currentPrice < 300) {
            console.log(dollarPrice + " Purchase that shit!")
        }
        else console.log(dollarPrice + " Nah dawg..")
    })
}

async function startTracking() {
    const page = await loadURLPage(gtx1080ti)

    // cronjob that checks the price every 15 seconds.
    let job = new CronJob('*/15 * * * * *', function() {
        checkPrice(page)
    }, null, true, null, null, true)
    job.start()
}

startTracking()