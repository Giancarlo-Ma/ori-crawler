const puppeteer = require('puppeteer');
const process = require('process');
const scrollToBottom = require("scroll-to-bottomjs");

(async () => {
  let website = 'https://www.oreilly.com/search/?query=*&extended_publisher_data=true&highlight=true&include_assessments=false&include_case_studies=true&include_courses=true&include_playlists=true&include_collections=true&include_notebooks=true&include_sandboxes=true&include_scenarios=true&is_academic_institution_account=false&source=user&formats=book&formats=case%20study&formats=learning%20path&formats=live%20online%20training&formats=notebook&formats=oriole&formats=video&sort=popularity&facet_json=true&json_facets=true&page=0&collection_type=expert&include_facets=false&include_practice_exams=true'
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(0);

  let books = await getBooks(website, page, '.SearchCard--29xc9', 1)

  process.send({ data: books })
  await browser.close();
})()

const getBooks = async (website, page, selector, pageCount) => {
  await page.goto(website);
  await page.waitForSelector(selector);
  return await page.evaluate((selector) => {
    const selectors = document.querySelectorAll(selector);
    const links = Array.from(selectors).map(l => ({title: l.querySelector('.Title--2YBJJ').innerText, author: l.querySelector('.orm-Link-root').innerText, topic: l.querySelector('.Topic--1Cd34').innerText, date: l.querySelector('.Publishers--3Vokz').innerText.slice(l.querySelector('.Publisher--hr8S9').innerText.length), img: l.querySelector('.LazyImage--2L2A6').getAttribute('src'), desc: l.querySelector('.orm-Truncate-root.orm-Truncate-lineClamp02.orm-Truncate-hyphens').innerText}))

    return links
  }, selector);
}
