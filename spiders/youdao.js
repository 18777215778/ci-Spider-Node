/**
 * @webside: 有道词典 (http://dict.youdao.com/)
 * @desc: 同根词、词组;
 */

const tools = require('../tools');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    start
};

async function start(w, wi) {
  let mainRes = await axios({
      method: 'get',
      url: `http://dict.youdao.com/w/eng/${w}`
  });

  resolveData(wi, mainRes);
}

// 解析所有服务器响应的数据
function resolveData(wi, mainRes) {
  let $ = cheerio.load(mainRes.data);
  
  let
    wordGroup = resolveWordGroup($),
    sameRoot = resolveSameRoot($);

  wordGroup && wi.wordGroup.concat(wordGroup);
  sameRoot && wi.sameRoot.concat(sameRoot);
}

// 解析词组
function resolveWordGroup($) {
  let groupEle = $('div#webPhrase > p.wordGroup');

  if (groupEle.length === 0) return null;

  let wordGroup = [];
  groupEle.each(function () {
      let en = $('.contentTitle',this).text();
      $('.contentTitle', this).remove();

      let cn = $(this)
          .text()
          .replace(/^\s+/, '')
          .replace(/\s+$/, '');

      wordGroup.push({en: en, cn: cn});
  });

  return wordGroup;
}

// 解析同根词
function resolveSameRoot($) {
  let SameRootEle = $('div#relWordTab p.wordGroup');

  if (SameRootEle.length === 0) return null;

  let SameRootList = [];
  SameRootEle.each(function () {

      let en = $('.contentTitle',this)
          .text()
          .replace(/^\s+/, '')
          .replace(/\s+$/, '');

      $('.contentTitle', this).remove();

      let cn = $(this)
          .text()
          .replace(/^\s+/, '')
          .replace(/\s+$/, '');

      if (/(词根：)|(词缀：)/.test(cn)) return;

      SameRootList.push({en: en, cn: cn});
  });

  return SameRootList;
}
