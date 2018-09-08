//
// Set of functions responsible of providing special functionalities
// In charge of API communication and special IO features
//

const Tools = {};

//Given an image, it should be processed through google's Vision API and
//return text found by OCR
Tools.recognizeCharacters = () => {

}
//Given an string, the function returns suggested characters or pinyin using CCEDICT
//Examples: 
//searching for 'ren' should include '人，忍， 认, ...' as their pinyin corresponds to ren
//searching for '乐' should include 'yuè' and 'lè' as they are '乐's pinyin 
Tools.dictionarySearch = () => {

}

export { Tools };
