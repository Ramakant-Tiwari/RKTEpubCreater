const fetch = require("node-fetch");
const cheerio = require("cheerio");
const Epub = require("epub-gen");
const path = require("path");

const novelChapters = [
  {
    title: "Welcome:)))",
    data: `<html>
    <body
      style="
        height: 50vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
      <h1>
        Welcome Readers<br />
        <span style="font-size: 1.2rem; line-height: 2"
          >Created By RKT</span>
      </h1>
    </body>
  </html>`,
  },
];

let epubTitle,
  epubAuthor = "RKTEpubCreater",
  epubImage,
  epubName;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateEpub() {
  const options = {
    title: epubTitle,
    author: epubAuthor,
    output: epubTitle + ".epub",
    content: novelChapters.map((chapter) => ({
      title: chapter.title,
      data: `<html><body>${chapter.data}</body></html>`,
    }))
  };

  new Epub(options).promise
    .then(() => {
      console.log("EPUB generated successfully!");
    })
    .catch((error) => {
      console.error("Error in epub generation", error);
    });
}

async function findChapterOne(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("There may be some error with URL", response.status);
      return [null, null, null];
    }
    const indexDotHtml = await response.text();
    const $ = cheerio.load(indexDotHtml);
    epubTitle = $(".breadcrumbs-item span").text();
    const src = $(".img-cover img").attr("src");
    epubImage = "https:" + src;
    epubName = path.join(__dirname, `${epubTitle}.epub`);
    const chapterOne = $("#readchapterbtn").attr("href");
    return [chapterOne, epubName, epubTitle+".epub"];
  } catch (error) {
    throw error;
  }
}

async function fetchChapterData(chapterUrl) {
  try {
    let i = 0;
    let response;
    do {
      if (i > 0) {
        await delay(i * 1000);
      }
      response = await fetch(chapterUrl);
      i++;
    } while (!response.ok && i <= 3);

    if (!response.ok) {
      throw new Error("Failed to fetch chapter after multiple retries");
    }

    const indexDotHtml = await response.text();
    const $ = cheerio.load(indexDotHtml);
    const chapterTitle = $("#chapter__content h1").text();
    const chapterData = $(".content-inner").html();
    novelChapters.push({
      title: chapterTitle,
      data: chapterData,
    });

    const nextButton = $("#btn-next");
    if (nextButton.hasClass("disabled")) return null;
    return nextButton.attr("href");
  } catch (error) {
    throw error;
  }
}

async function createEpub(chapterOne, url, website = "https://novelbuddy.com") {
  try {
    console.log("Started");
    let chapterUrl = website + chapterOne;
    console.log(chapterUrl);

    let nextChapterPath = await fetchChapterData(chapterUrl);
    chapterUrl = website + nextChapterPath;

    while (nextChapterPath) {
      console.log(chapterUrl);
      nextChapterPath = await fetchChapterData(chapterUrl);
      chapterUrl = website + nextChapterPath;
    }

    await generateEpub();
  } catch (error) {
    throw error;
  }
}

module.exports = { createEpub, findChapterOne };
