const fs = require('fs');
const NOT_FOUND = {error: true, message: 'not found'};
let Cedict = {};


Cedict.library = fs.readFileSync('./cedict_ts.u8').toString().split('\n');

Cedict.unique_pinyin = {};
Cedict.multi_pinyin = {};
Cedict.pinyin = {};

const checkUnique = (hanzi, pinyin) => {
  //If unique has an entry
  if (Cedict.unique_pinyin[hanzi]) {
    //And, if the pinyin is different enough
    if (Cedict.unique_pinyin[hanzi].toLowerCase() != pinyin.toLowerCase()) {
      //Delete from unique_pinyin and add to multi_pinyin
      const tempPinyin = Cedict.unique_pinyin[hanzi];
      delete Cedict.unique_pinyin[hanzi];
      Cedict.multi_pinyin[hanzi] = [tempPinyin, pinyin.toLowerCase()];
    }
    //Unique has an entry
    return true;
  }
  return false;
};

const checkMultiple = (hanzi, pinyin) => {
  //If multi has an entry
  if (Cedict.multi_pinyin[hanzi]) {

    let hasSimilar = false;

    for (const multi_pinyin of Cedict.multi_pinyin[hanzi]) {
      hasSimilar = multi_pinyin.toLowerCase() === pinyin.toLowerCase();
      //Found similar, end search
      if (hasSimilar) break;
    }
    //And, if there is not any similar pinyin 
    if (!hasSimilar) {
      //Append to multi
      Cedict.multi_pinyin[hanzi].push(pinyin);
    }
    //Multi has an entry
    return true;
  }
  return false;
};

const buildHanziToPinyin = (simplified, traditional, pinyin) => {

  const inMulti = checkMultiple(simplified, pinyin) || checkMultiple(traditional, pinyin);
  const inUnique = checkUnique(simplified, pinyin) || checkUnique(traditional, pinyin);

  if (!inMulti && !inUnique) {
    Cedict.unique_pinyin[simplified] = pinyin.toLowerCase();
    Cedict.unique_pinyin[traditional] = pinyin.toLowerCase();
  }

};

const buildPinyinToHanzi = (simplified, traditional, pinyin) => {

  //Only consider single characters with a single pinyin
  if (pinyin.split(' ').length == 1) {
    const simplifiedPinyin = pinyin.substring(0, pinyin.length - 1).toLowerCase();

    //If a pinyin entry does not exist, create it
    if (!Cedict.pinyin[simplifiedPinyin]) {
      Cedict.pinyin[simplifiedPinyin] = [];
    }

    //Add to the entry
    Cedict.pinyin[simplifiedPinyin].push({
      hanzi: {
        simplified: simplified,
        traditional: traditional
      },
      pinyin: pinyin
    });
  }
};

let parseTime = new Date().getTime();

for (const entry of Cedict.library) {
  const data = entry.split(' ');
  const traditional = data[0];
  const simplified = data[1];
  const pinyin = entry.split('[')[1].split(']')[0];

  //Only consider hanzi 1 characters long
  if (simplified.length === 1) {
    buildHanziToPinyin(simplified, traditional, pinyin);
    buildPinyinToHanzi(simplified, traditional, pinyin);
  }
}


parseTime = new Date().getTime() - parseTime;
console.log('Finished parsing Cedict library: ', parseTime, 'ms');

Cedict.findPinyin = (hanzi) => {
  //Empty/undefined search
  if (!hanzi) return '';
  else if (Cedict.unique_pinyin[hanzi]) return [Cedict.unique_pinyin[hanzi]];
  else if (Cedict.multi_pinyin[hanzi]) return Cedict.multi_pinyin[hanzi];
  else return NOT_FOUND;

};

Cedict.findHanzi = pinyin => {
  //Empty/undefined search
  if (!pinyin) return NOT_FOUND;
  //If last character is a number
  else if ( !isNaN(parseInt(pinyin[pinyin.length - 1])) ) {
    //Return expected hanzi
    const simplifiedPinyin = pinyin.substring(0, pinyin.length - 1);
    if (Cedict.pinyin[simplifiedPinyin]) {
      return Cedict.pinyin[simplifiedPinyin].filter(entry => entry.pinyin.toLowerCase().includes(pinyin.toLowerCase()));
    }
    else {
      return NOT_FOUND;
    }
  }
  else {
    if(Cedict.pinyin[pinyin]){
      return Cedict.pinyin[pinyin];
    }
    else{
      return NOT_FOUND;
    }
    
  }
};

module.exports = Cedict;
