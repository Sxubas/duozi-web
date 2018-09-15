const fs = require('fs');

let Cedict = {}


Cedict.library = fs.readFileSync('./cedict_ts.u8').toString().split('\n');

Cedict.unique_pinyin = {};
Cedict.multi_pinyin = {};

const checkUnique = (hanzi, pinyin) => {
  //If unique has an entry
  if(Cedict.unique_pinyin[hanzi]){
    //And, if the pinyin is different enough
    if(Cedict.unique_pinyin[hanzi].toLowerCase() != pinyin.toLowerCase()){
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
  if(Cedict.multi_pinyin[hanzi]){
    
    let hasSimilar = false;

    for(const multi_pinyin of Cedict.multi_pinyin[hanzi]){
      hasSimilar = multi_pinyin.toLowerCase() === pinyin.toLowerCase();
      //Found similar, end search
      if(hasSimilar) break;
    }
    //And, if there is not any similar pinyin 
    if(!hasSimilar){
      //Append to multi
      Cedict.multi_pinyin[hanzi].push(pinyin);
    }
    //Multi has an entry
    return true;
  }
  return false;
};

let parseTime = new Date().getTime();

for (const entry of Cedict.library){
  const data = entry.split(' ');
  const traditional = data[0];
  const simplified = data[1];

  if(simplified.length === 1){
    const pinyin = entry.split('[')[1].split(']')[0];
    
    
    const inMulti = checkMultiple(simplified, pinyin) || checkMultiple(traditional, pinyin);
    const inUnique = checkUnique(simplified, pinyin) || checkUnique(traditional, pinyin);

    if(!inMulti && !inUnique){
      Cedict.unique_pinyin[simplified] = pinyin.toLowerCase();
      Cedict.unique_pinyin[traditional] = pinyin.toLowerCase();
    }
  }
}


parseTime = new Date().getTime() - parseTime;
console.log('Finished parsing Cedict library: ', parseTime, 'ms');

Cedict.find_pinyin = (hanzi) =>{
  //Empty/undefined search
  if(!hanzi) return '';

  if(Cedict.unique_pinyin[hanzi]) return [Cedict.unique_pinyin[hanzi]];
  if(Cedict.multi_pinyin[hanzi]) return Cedict.multi_pinyin[hanzi];
  else return 'not found';

};

module.exports = Cedict;
