/**
 * @desc: 英/美式发音、高频释义、高频词性、音节、单词变形;
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
        url: `http://dict.cn/${w}`
    });

    resolveData(wi, mainRes);
}


function resolveData(wi, mainRes) {
    let $ = cheerio.load(mainRes.data);

    resolveSymbolUK($);
    resolveSymbolUS($);
    resolveSyllable($);
    resolveHighPara($);
    resolveHighProp($);
    resolveWordShape($);
}

// 解析英式发音
function resolveSymbolUK($) {

    let result = $('.phonetic > span');
    let ukEles = null;
    result.each(function () {
        if ($(this).text().indexOf('英') !== -1) {
            ukEles = $('.sound', this);
            return false;
        }
    });
    if (!ukEles) return null;

    let ukLink = [];
    ukEles.each(function () {
        let url = $(this).attr('naudio');
        if (url.length > 44) {
            ukLink.push(`http://audio.dict.cn/${url}`)
        }
    });

    return ukLink;
}

// 解析美式发音
function resolveSymbolUS($) {

    let result = $('.phonetic > span');
    let usEles = null;
    result.each(function () {
        if ($(this).text().indexOf('美') !== -1) {
            usEles = $('.sound', this);
            return false;
        }
    });
    if (!usEles) return null;

    let usLink = [];
    usEles.each(function () {
        let url = $(this).attr('naudio');
        if (url.length > 44) {
            usLink.push(`http://audio.dict.cn/${url}`)
        }
    });

    return usLink;
}

// 解析音节
function resolveSyllable($) {
    let syllable = $('.keyword').attr('tip');
    if (!syllable) {
        return null
    } else {
        return (syllable
                .replace(/^.+：/, '')
                .split('·')
        );
    }
}

// 解析高频释义
function resolveHighPara($) {
    let chart = $('#dict-chart-basic').attr('data');

    if (!chart) return null;

    chart = unescape(decodeURI(chart).replace(/\\/g, '%'));
    chart = JSON.parse(chart);
    let arr = [];

    for (let k of Object.keys(chart)) {
        arr.push(chart[k]);
    }
    return arr;
}

// 解析高频词性
function resolveHighProp($) {
    let chart = $('#dict-chart-examples').attr('data');

    if (!chart) return null;

    chart = unescape(decodeURI(chart).replace(/\\/g, '%'));
    chart = JSON.parse(chart);
    let arr = [];

    for (let k of Object.keys(chart)) {
        arr.push(chart[k]);
    }
    return arr;
}

// 解析单词变形
function resolveWordShape($) {

    let shapeEle = $('.shape');
    let shapeProp = $('label', shapeEle);

    let shapeList = [];
    shapeProp.each(function () {
        let shape = {};
        shape.prop = $(this)
            .text()
            .replace(/:$/, '');
        shape.en = $(this)
            .next()
            .text()
            .replace(/\s*/g, '');

        shapeList.push(shape);
    });
    return shapeList;
}
