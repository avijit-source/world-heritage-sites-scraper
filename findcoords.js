const parseDms = require('parse-dms');
//  "N28 35 35.988 E77 15 2.016"

function findcoords(strArr) {
   const match = /\s([A-Z])/gim.exec(strArr);
const strArrMATCH = strArr.split(strArr[match.index+1]);
const firstcoord = strArrMATCH[0].substring(0,1);
const secondcoord = strArr[match.index+1]
strArrMATCH[0]=strArrMATCH[0].substring(1);
let first = strArrMATCH[0].split(" ");
let second = strArrMATCH[1].split(" ");
first = first.filter(val=>val.length>0);
second = second.filter(val=>val.length>0);
let res1 = "";
let res2="";

for(let i=0;i<first.length;i++){
   if(i===0){
       res1 = res1+first[i]+"°"
   }else if(i===1){
       res1 = res1+first[i]+"\'"
   }else if(i===2){
       res1 = res1+first[i]+'"'+firstcoord;
   }
}
for(let i=0;i<second.length;i++){
   if(i===0){
       res2 = res2+second[i]+"°"
   }else if(i===1){
       res2 = res2+second[i]+"\'"
   }else if(i===2){
       res2 = res2+second[i]+'"'+secondcoord;
   }
}


let res3 = res2+" "+res1;
//  console.log(res3);
const values = parseDms(res3);
return values
}

module.exports ={
    getcoords:findcoords
}
