const fs = require('fs');


const data2 = JSON.parse(fs.readFileSync("./newbook.json", "utf-8"))


let result = data2.reduce((unique, o) => {
    if (!unique.some(obj => obj.descTitleTxt.trim() === o.descTitleTxt.trim())) {
        unique.push(o);
    }
    return unique;
}, []);



console.log(result.length);
console.log(data2.length);


fs.writeFileSync("newresult3.json", JSON.stringify(result));




