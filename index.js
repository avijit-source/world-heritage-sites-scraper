const request = require("request");
const cheerio = require("cheerio");
const fs = require('fs');
const coordObj = require('./findcoords');

const url = "https://whc.unesco.org/en/list/";

request(url,cb)

function cb(err,response,html){
    if(err){
        console.log(err);
    }else{
       extractHtml(html);
    }
}
function extractHtml(html){
    let $ = cheerio.load(html);
    let elemArr = $(".container .row .list_site ul li a");
    let textArr=[];
    let urlArr = [];
    for(let i = 0; i < elemArr.length; i++){
        textArr.push($(elemArr[i]).text()) ;
        const detUrl ="https://whc.unesco.org"+$(elemArr[i]).attr("href");
        urlArr.push(detUrl);
    }
    textArr = textArr.filter(item=>item.length>2);
 
    urlArr = urlArr.filter(item=>!item.includes("#")).sort(myfunction);
    function myfunction(a,b){
    const arr1 =  a.split("/");
    const arr2 = b.split("/")
    const lastitem = arr1[arr1.length - 1];
    const lastitem2 = arr2[arr2.length-1];
    return Number(lastitem)-Number(lastitem2)
    }
    for(let i=0;i<urlArr.length;i++){
        setTimeout(()=>{
         getDetails(urlArr[i]);
        },2000)
    }
}


 function getDetails(url){
    request(url,function(err,response,html){
        if(err){
            console.log(err);
        }else{
            readHtml(html);
            
        }
    })
 }
 function readHtml(html){
    let $ = cheerio.load(html);
    const descTitle = $(".row .box .tab-content #contentdes_en h6")[0];
    const descPara = $(".row .box .tab-content #contentdes_en p")[0];
    
   const descTitleTxt = $(descTitle).text()
   const  descParaTxt = $( descPara).text()

    let elemArr = $(".ym-gbox-right .card-body .row a");
    let imgArr = $(".ym-gbox-right .card-body .row img");
    // let doi = $(".ym-gbox-right .card-body  div>strong");
    let mainImg = $(".container .row .ym-gbox-left .border-top .unveil")[0];
    let paraheading = $(".container .row .ym-gbox-left .border-top h5")[0];
    const para = $(".container .row .ym-gbox-left .border-top p");
    const dms =$(".ym-gbox-right .card-body .small div")
    let locationArr =[];
    for(let elem of elemArr){
        locationArr.push($(elem).text());
    }
    locationArr.push($(imgArr[0]).attr("src"));
    let text=[]
    // const doival = $(doi[0])[0].nextSibling.nodeValue.split('\\')[0].trim();
    for(let i = 0; i < para.length; i++){
        // console.log($(para[i]).text())
        text.push($(para[i]).text())
    }
        
        let dmscords =$(dms[dms.length-1]).text().trim()
    const resobj ={
        descTitleTxt,
        descParaTxt,
        locationArr,
        // dateOfInscription:doival,
        mainImg:$(mainImg).attr("src"),
        paraheading:$(paraheading).text(),
        text:text,        
    } 
    if(dmscords.length>1){
        resobj.coords = coordObj.getcoords(dmscords.trim());
       const fileData = fs.readFileSync("./newbook.json","utf8");
      const parsed = [...JSON.parse(fileData)];
      parsed.push(resobj);
      fs.writeFileSync("newbook.json",JSON.stringify(parsed));
    }

    // console.log(resobj);
    // fs.writeFile("books.json", JSON.stringify(resobj), (err) => {
    //     if (err)
    //       console.log(err);
    //     else {
    //       console.log("File written successfully\n");
    //       console.log("The written has the following contents:");
    //     //   console.log(fs.readFileSync("books.txt", "utf8"));
    //     }
    //   });
    // console.log(resobj);
    // return resobj;
 }






