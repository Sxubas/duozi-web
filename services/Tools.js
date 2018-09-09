
const axios = require('axios');
//
// Set of functions responsible of providing special functionalities
// In charge of API communication and special IO features
//

const apikey = process.env.FREE_OCR_API_KEY

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
    data: req.rawBody
  }).then( response => {
    res.send(JSON.stringify(response.data))
  }).catch( error => {
    console.log(error);
    res.send(JSON.stringify(error))
  });
}
//Given an string, the function returns suggested characters or pinyin using CCEDICT
//Examples: 
//searching for 'ren' should include '人，忍， 认, ...' as their pinyin corresponds to ren
//searching for '乐' should include 'yuè' and 'lè' as they are '乐's pinyin 
Tools.dictionarySearch = () => {

}

module.exports = Tools;
