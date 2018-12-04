const axios = require('axios');
const cheerio = require('cheerio');
const tools = require('./tools');

let wordInfo = {
    // 单词
    word: '',
    // 音节
    syllable: [],
    // 英式音标
    symbolUK: '',
    // 美式音标
    symbolUS: '',
    // 英式发音
    proUK: [],
    // 美式发音
    proUS: [],
    // 单词变形
    shape: [],
    // 单词原形
    oriWord: '',
    // 中文释义
    paraZh: [],
    // 英文释义
    paraEn: [],
    // 词组
    phrase: [],
    // 高频词性
    highProp: [],
    // 高频释义
    highPara: [],
    // 双语例句
    sentDB: [],
    // 近义词
    synonym: [],
    // 反义词
    antonym: [],
    // 同根词
    sameRoot: [],
    // 词根
    affixes: []
};

axios({
    method: 'get',
    url: 'http://dict.youdao.com/w/eng/practical'
    // url: 'http://www.iciba.com/index.php?a=getWordMean&c=search&list=1,2,3,4,5,8,9,10,12,13,14,15,18,21,22,24,3003,3004,3005&word=practical',
    // responseType: 'json'
}).then(function (res) {
    console.log(res.data.errno);
});
