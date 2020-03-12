'use strict'

const puppeteer = require('puppeteer')
const cron = require('cron').CronJob
const cheerio = require('cheerio')

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
    console.log(html)
    //priceblock_ourprice
}

async function monitor() {
    let page = await loadURLPage(gtx1080ti)
    await checkPrice(page)
}

monitor()