const axios = require("axios");
const { load } = require("cheerio");
const fs = require("fs");
var xlsx = require("xlsx");

const getWebPage = async() => {
    try {
        // const res = await axios.get("https://www.boat-lifestyle.com/collections/wireless-speakers?_gl=1*1e374ok*_up*MQ..&gclid=CjwKCAjwouexBhAuEiwAtW_Zx3hg7mREdDNefcovimMifGN5VGHksXBr9IXV1cBGrhR5w1OO0XfcYhoCHz4QAvD_BwEhttps://www.naukri.com/mnc-jobs?src=discovery_trendingWdgt_homepage_srch", {
        //     headers: {
        //         "content-type": "text/html"
        //     }
        // });
        // fs.writeFileSync("webpage.txt", JSON.stringify(res.data));
        // console.log("Webpage saved successfully.");
        
        // const htmlpage = fs.readFileSync("webpage.txt",{encoding:"utf-8"});
        // const j$ = load(htmlpage);
        // // console.log(j$.text());
        // const dataList = j$('.product-item');
        // console.log(dataList.text());

        const res = await axios.get("https://www.boat-lifestyle.com/collections/wireless-speakers?_gl=1*1e374ok*_up*MQ..&gclid=CjwKCAjwouexBhAuEiwAtW_Zx3hg7mREdDNefcovimMifGN5VGHksXBr9IXV1cBGrhR5w1OO0XfcYhoCHz4QAvD_BwEhttps://www.naukri.com/mnc-jobs?src=discovery_trendingWdgt_homepage_srch",);
        const allhtml$ = load(res.data);
        const data = allhtml$('[class="product-item two-point-o  item-horizontal "]');
        // console.log(data.text());

        var workbook = xlsx.utils.book_new();
        const jsonData = [];

        data.each((_,item)=>{
            const container = allhtml$(item);
            
            // Name
            const pro_name = container.find(".position-relative a.product-item-meta__title").text();
            // console.log(pro_name);
            // Price
            const pro_price = container.find(".price--highlight").text();
            const priceArr = pro_price.split("₹");
            const price = priceArr[1];
            
            // Stars
            const pro_stars = container.find(".rating__stars").text();
            const starArr = pro_stars.split("\"");
            // console.log(starArr[9]);

            // Extract ratings from each string
            const ratings = starArr.map(str => {
                // Remove leading and trailing whitespace
                const trimmedStr = str.trim();
                // Extract the rating
                const rating = trimmedStr.match(/\d+(\.\d+)?/);
                return rating ? parseFloat(rating[0]) : null;
            });
            const rating = parseFloat(ratings);
            // console.log(parseFloat(ratings)); // convert from array [4.9] to float.

            // Reviews
            const pro_reviews = container.find(".plp-reviews").text();
            // console.log(pro_reviews);

            // Description
            // const pro_desc = container.find(".only-horizontal").text();
            // console.log(pro_desc.split(","));

            // Playback time
            const pro_playback = container.find(".product-horizontal .ui-2").text();
            // console.log(pro_playback);

            jsonData.push({
                "Product Name" : pro_name, 
                "Price" : price, 
                "Ratings" : rating,
                "Total Reviews" : pro_reviews,
                "Playback Time" : pro_playback
            });

        })
            var worksheet = xlsx.utils.json_to_sheet(jsonData);
            xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            xlsx.writeFile(workbook, "product-list.xlsx");

        console.log("Excel Sheet created successfully.");

    } catch (error) {
        console.error("Error fetching webpage:", error);
    }
}

getWebPage();