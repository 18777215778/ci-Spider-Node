const axios = require('axios');
const cheerio = require('cheerio');
const tools = require('../tools');
const iciba = require('../spiders/iciba');
const huJiang = require('../spiders/huJiang');
const haiCi = require('../spiders/haiCi');
const youDao = require('../spiders/youdao');
const freeDic = require('../spiders/freedictionary');

let wordList = ['screen', 'require', 'main', 'display', 'tool', 'await'];
let wordInfo = {
    // 单词
    word: '',
    // 音节
    syllable: null,
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
    wordGroup: [],
    // 高频词性
    highProp: [],
    // 高频释义
    highPara: [],
    // 双语例句
    sentence: [],
    // 近义词
    synonym: [],
    // 反义词
    antonym: [],
    // 同根词
    sameRoot: [],
    // 词根
    affixes: []
};

async function loop(i) {
    let tempWordInfo = tools.deepCopy(wordInfo);
    tempWordInfo.word = wordList[i];

    await axios.all([
        // iciba.start(wordList[i], tempWordInfo)
        // freeDic.start(wordList[i], tempWordInfo)
        youDao.start(wordList[i], tempWordInfo)
    ]);
}

let interval = null;
let i = 0;

// interval = setInterval(()=>{
//     if (i >= wordList.length) {
//         clearTimeout(interval);
//     } else {
//         loop(i);
//         i++;
//     }
// }, 3000);
loop(1);

