/**
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


function resolveData(wi, mainRes) {
    let $ = cheerio.load(mainRes.data);

    resolveWordGroup($);
    resolveSomeRoot($);
}

// 解析词组
function resolveWordGroup($) {
    let groupEle = $('div#wordGroup > p.wordGroup');

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
function resolveSomeRoot($) {
    let someRootEle = $('div#relWordTab > p.wordGroup');

    if (someRootEle.length === 0) return null;

    let someRootList = [];
    someRootEle.each(function () {

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

        someRootList.push({en: en, cn: cn});
    });

    return someRootList;
}
