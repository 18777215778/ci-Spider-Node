/**
 * @desc: 英/美式发音、音节;
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
        url: `https://www.thefreedictionary.com/${w}`
    });

    resolveData(wi, mainRes);
}


function resolveData(wi, mainRes) {
    let $ = cheerio.load(mainRes.data);

    resolveSyllable($);
    resolveSymbolUK($);
    resolveSymbolUS($);
}

// 解析英式发音
function resolveSymbolUK($) {
    let eles = $('.content-holder .snd2');

    if (eles.length === 0) return null;

    let ukLink = null;

    eles.each(function () {
        let url = $(this).data('snd');
        if (url.includes('UK')) {
            ukLink = `https://img2.tfd.com/pron/mp3/${url}.mp3`;
            return false;
        }
    });
    return ukLink;
}

// 解析美式发音
function resolveSymbolUS($) {
    let eles = $('.content-holder .snd2');

    if (eles.length === 0) return null;

    let usLink = null;

    eles.each(function () {
        let url = $(this).data('snd');
        if (url.includes('US')) {
            usLink = `https://img2.tfd.com/pron/mp3/${url}.mp3`;
            return false;
        }
    });
    return usLink;
}

// 解析音节
function resolveSyllable($) {
    let syllableEle = $('#Definition h2');
    let syllable = null;

    syllableEle.each(function () {
        let str = $(this).text();

        if (str.includes('·')) {
            syllable = str.split('·');
            return false;
        }

        if (str.includes('•')) {
            syllable = str.split('•');
            return false;
        }
    });

    return syllable;
}