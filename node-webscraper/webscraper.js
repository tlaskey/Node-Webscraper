'use strict'

const puppeteer = require('puppeteer')
const cron = require('cron').CronJob
const cheerio = require('cheerio')

const url = 'https://www.amazon.com/EVGA-Optimized-Interlaced-Graphics-11G-P4-6393-KR/dp/B07MFN49TK/'

(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
})