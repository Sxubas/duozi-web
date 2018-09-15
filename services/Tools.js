
const axios = require('axios');
const Cedict = require('./../cedict.js');
//
// Set of functions responsible of providing special functionalities
// In charge of API communication and special IO features
//

const apikey = process.env.FREE_OCR_API_KEY;

if (!apikey) throw new Error('OCR Apikey variable not set');

const Tools = {};

//Given an image, it should be processed through OCR API and
//return text found by OCR
Tools.recognizeCharacters = (req, res) => {

  let newHeaders = req.headers;
  newHeaders.apikey = apikey;
  newHeaders.Host = '';
  newHeaders.Origin = '';

  axios({
    method: 'post',
    url: 'https://api.ocr.space/parse/image',
    headers: newHeaders,
    data: req.body
  }).then(response => {
    res.send(JSON.stringify(response.data));
  }).catch(error => {
    console.log(error);
    res.send(JSON.stringify(error));
  });
};
//Given an string, the function returns suggested characters or pinyin using CCEDICT
//Examples: 
//searching for 'ren' should include '人，忍， 认, ...' as their pinyin corresponds to ren
//searching for '乐' should include 'yuè' and 'lè' as they are '乐's pinyin 
Tools.dictionarySearch = (req, res) => {
  const search = req.query.search;
  if(search){
    res.send(Cedict.librarySearch(search));
  }
  else {
    res.status(400);
    res.send({
      error: true,
      message: 'Missing or empty search'
    });
  }
};

Tools.hanziToPinyin = (req, res) => {
  const hanzi = req.query.hanzi;

  if (hanzi) {
    const pinyinCandiates = Cedict.findPinyin(hanzi);
    if(pinyinCandiates.error){
      res.status(404);
    }
    res.send(pinyinCandiates);
  }
  else {
    res.status(400);
    res.send({
      error: true,
      message: 'Missing hanzi'
    });
  }
};

Tools.pinyinToHanzi = (req, res) => {
  const pinyin = req.query.pinyin;

  if (pinyin) {
    const hanziCandidates = Cedict.findHanzi(pinyin);
    if(hanziCandidates.error){
      res.status(404);
    }
    res.send(hanziCandidates);
  }
  else {
    res.status(400);
    res.send({
      error: true,
      message: 'Missing pinyin'
    });
  }
};

module.exports = Tools;
