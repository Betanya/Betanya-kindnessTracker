function generateRandomDeed(arrOfDeeds) {
    let randomNumber = Math.floor(Math.random() * Math.floor(arrOfDeeds.length));
    return arrOfDeeds[randomNumber].deedDescription;
}

module.exports = {
    generateRandomDeed: generateRandomDeed
};