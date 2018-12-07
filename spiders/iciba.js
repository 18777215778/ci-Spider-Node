/**
* @webside: 金山词典 (http://www.iciba.com/)
* @desc: 英/美式音标、英/美式发音、中/英释义、例句、词根、同根词;
*/

const tools = require('../tools');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    start
};

async function start(w, wi) {
    let jsonRes = await axios({
        method: 'get',
        url: `http://www.iciba.com/index.php?a=getWordMean&c=search&list=1,2,3,4,5,8,9,10,12,13,14,15,18,21,22,24,3003,3004,3005&word=${w}`,
        responseType: 'json'
    });

    let sentReq = [];
    for (let i=1; i<=5; i++) {
        sentReq.push(axios({
            method: 'get',
            url: `http://dj.iciba.com/${w}-1-${i}-%01-0-0-0-0.html`,
        }))
    }

    let sentRes = await axios.all(sentReq);

    resolveData(wi, jsonRes, sentRes);
}

// 解析所有服务器响应的数据
function resolveData(wi, jsonRes, sentRes) {
  let
    jsonData = jsonRes.data;

  let
    symbolUK = resolveSymbolUK(jsonData),
    symbolUS = resolveSymbolUS(jsonData),
    proUK = resolveProUK(jsonData),
    proUS = resolveProUS(jsonData),
    paraZh = resolveParaZh(jsonData),
    paraEn = resolveParaEn(jsonData),
    affixes = resolveAffixes(jsonData),
    sameRoot = resolveSameRoot(jsonData);

  wi.symbolUK || (wi.symbolUK = symbolUK);
  wi.symbolUS || (wi.symbolUS = symbolUS);
  proUK && wi.proUK.push(proUK);
  proUS && wi.proUS.push(proUS);
  wi.paraZh = paraZh;
  wi.paraEn = paraEn;
  affixes && (wi.affixes = affixes);
  sameRoot && wi.sameRoot.concat(sameRoot);

  // 句子
  // let sentence = resolveSent(sentRes);
  // console.log(sentence);
}

// 解析英式音标
function resolveSymbolUK(document) {
    return tools.getTarget(document, 'baesInfo > symbols > 0 > ph_en');
}

// 解析美式音标
function resolveSymbolUS(document) {
    return tools.getTarget(document, 'baesInfo > symbols > 0 > ph_am');
}

// 解析英式发音
function resolveProUK(document) {
    return tools.getTarget(document, 'baesInfo > symbols > 0 > ph_en_mp3');
}

// 解析美式发音
function resolveProUS(document) {
    return tools.getTarget(document, 'baesInfo > symbols > 0 > ph_am_mp3');
}

// 解析中文释义
function resolveParaZh(document) {
    return tools.getTarget(document, 'baesInfo > symbols > 0 > parts');
}

// 解析英文释义
function resolveParaEn(document) {
    return tools.getTarget(document, 'collins > 0 > entry');
}

// 解析词根
function resolveAffixes(document) {
    let affixes = tools.getTarget(document, 'stems_affixes') || [];
    let afterAffixes = [];

    for (let aff of affixes) {
        let a = {};
        a.type = aff.type || null;
        a.type_value = aff.type_value || null;
        a.type_exp = aff.type_exp.replace(/^=?/, '');
        afterAffixes.push(a);
    }

    return afterAffixes;
}

// 解析同根词
function resolveSameRoot(document) {
    let list = tools.getTarget(document, 'stems_affixes') || [];

    if (list === []) return null;

    let sameRootList = [];

    for (let item of list) {
        let wordParts = item.word_parts;

        for (let wp of wordParts) {
            let stemsAffixes = wp.stems_affixes;

            for (let sa of stemsAffixes) {
                sameRootList.push({
                    en: sa.value_en,
                    cn: sa.value_cn,
                    build: sa.word_buile
                })
            }
        }
    }
    return sameRootList;
}

// 解析例句
function resolveSent(documents) {
    let sentList = [];

    for (let doc of documents) {
        let $ = cheerio.load(doc.data);
        let items = $('.dj_li');

        items.each(function () {
            let enTxt = $('.stc_en_txt', this);
            let cnTxt = $('.stc_cn_txt', this);
            enTxt = (enTxt.html()
                    .replace(/^\s*/, '')
                    .replace(/^\d{1,3}\.\s*/, '')
                    .replace(/<em class="text_blue">/g, '')
                    .replace(/<\/em>/, '')
                    .replace(/<span class="class\d{1,3}">/g, '')
                    .replace(/<\/span>/g, '')
                    .replace(/<b>/g, '<mark>')
                    .replace(/<\/b>/g, '</mark>')
                    .replace(/\s*$/, '')
            );
            cnTxt = (cnTxt.text()
                    .replace(/^\s*/, '')
                    .replace(/\s*$/, '')
            );
            sentList.push({en: enTxt, cn: cnTxt});
        });
    }
    return sentList;
}
