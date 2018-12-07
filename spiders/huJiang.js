/**
 * @webside: 沪江小D (https://dict.hjenglish.com/)
 * @desc: 英/美式发音、听力例句;
 */

// TODO 沪江加入了反爬, 待解决!!!

const tools = require('../tools');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    start
};

async function start(w, wi) {
    let mainRes = await axios({
        method: 'get',
        url: `https://dict.hjenglish.com/w/${w}`,
        headers: {
            'Referer': 'https://dict.hjenglish.com',
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:63.0) Gecko/20100101 Firefox/63.0',
            'Cookie': 'HJ_UID=4297c3f8-9edd-8b3a-af9c-940c1f391515; HJ_CST=1; HJ_CSST_3=1; TRACKSITEMAP=3%2C; HJ_SID=a5f6614e-cbed-f708-2a8d-213404d6f8eb; _REF=; HJ_SSID_3=7614cd5a-55d0-eb48-a419-6befd00ba140; _SREF_3=; HJ_CMATCH=1'
        }
    });

    console.log(mainRes.headers);
    resolveData(wi, mainRes);
}

function resolveData(wi, mainRes) {
    resolveSymbolUK(mainRes.data);
    resolveSymbolUS(mainRes.data);
}

function resolveSymbolUK(document) {
    console.log(document);
    let $ = cheerio.load(document);
    let result = $('.pronounce-value-en');
    console.log(result.text());
}

function resolveSymbolUS(document) {

}