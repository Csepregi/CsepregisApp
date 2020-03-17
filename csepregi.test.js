const puppeteer = require('puppeteer');


(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  
  
  await page.goto('https://csepregis.herokuapp.com/')
  
  await page.waitForSelector('body > #landing-header > .btn')
  await page.click('body > #landing-header > .btn')
  
  await page.waitForSelector('.container > #navbar > .navbar-right > li:nth-child(1) > a')
  await page.click('.container > #navbar > .navbar-right > li:nth-child(1) > a')
  
  await page.waitForSelector('.row > div > form > .form-group:nth-child(1) > .form-control')
  await page.click('.row > div > form > .form-group:nth-child(1) > .form-control')
  
  await page.type('.row > div > form > .form-group:nth-child(1) > .form-control', 'gabor')
  
  await page.waitForSelector('.row > div > form > .form-group > .btn')
  await page.click('.row > div > form > .form-group > .btn')
  

  
  await page.waitForSelector('.row > .col-md-3:nth-child(1) > .thumbnail > p > .btn')
  await page.click('.row > .col-md-3:nth-child(1) > .thumbnail > p > .btn')
  
  await page.waitForSelector('.row > .col-md-9 > .well > .text-right > .btn')
  await page.click('.row > .col-md-9 > .well > .text-right > .btn')
  
  await navigationPromise
  
  await page.waitForSelector('.row > div > form > .form-group > .form-control')
  await page.click('.row > div > form > .form-group > .form-control')
  
  await page.waitForSelector('.row > div > form > .form-group > .btn')
  await page.click('.row > div > form > .form-group > .btn')
  
  await navigationPromise
  
  await page.waitForSelector('body > .navbar > .container > .navbar-header > .navbar-brand')
  await page.click('body > .navbar > .container > .navbar-header > .navbar-brand')
  
  await navigationPromise
  
  await browser.close()
})()

////////////////////////////////////////////6
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     slowMo: 250 // slow down by 250ms
//   });
//   beforeAll

//   const page = await browser.newPage()
//   const url = "https://csepregis.herokuapp.com/"
//   await page.goto(url)
//   const h1 = await page.evaluate(
//     () => document.querySelector("h1").textContent
//   );

//   console.log(h1);
//   await browser.close();
// })()

