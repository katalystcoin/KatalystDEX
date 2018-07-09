var assetList = [
   Currency.KDEX,
   Currency.IKI,
   Currency.SGD,
   Currency.HOTX,
   Currency.KLTC,
   Currency.KETH,
   Currency.KBCH,
   Currency.KBTC,
   Currency.KWAVES,
   Currency.VAI,
   Currency.VEX
];

var i = 0, j = 0, k = 0;

var favoritePairs = [];

for (i = 0; i < assetList.length; i++){ 
    for (j = 0; j < assetList.length; j++) {
        if(assetList[i] != assetList[j]) {
            favoritePairs[k] = {amountAsset: assetList[i], priceAsset: assetList[j]};
            k++;                             
        }                           
    }
}

console.log(favoritePairs);
