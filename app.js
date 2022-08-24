require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const fs = require("fs");
const { parse } = require("csv-parse");
const bcrypt = require('bcrypt');
const ObjectsToCsv = require('objects-to-csv');



const readFromFile = process.env.READ_CSV_FILE_LOCATION;
const writeToFile = process.env.WRITE_CSV_FILE_LOCATION;



async function processData() {

    var dataArray = [];
    var encryPassArray = [];
    var finalDataArray = [];


    //Read data from CSV File
    fs.createReadStream(`${readFromFile}`)
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            // console.log(row);
            dataArray.push(row)
        })
        .on("end", function () {
            // console.log(dataArray);
            console.log(`\n${dataArray.length} row is fetched from csv file`);

            for (var i = 0; i < dataArray.length; i++) {
                console.log(`\nPassword Hashing is on progress... 🍺`);

                // Hashing plainTextPassword
                encryPassArray.push(bcrypt.hashSync(dataArray[i][1], 10));
            }

            // Inserting User_id and Encrypted Password into array
            for (var j = 0; j < dataArray.length; j++) {
                finalDataArray.push({ "USER_ID": dataArray[j][0], "PASSWORD": encryPassArray[j] });
            }

            const csv = new ObjectsToCsv(finalDataArray);

            // Save CSV File to Location
            csv.toDisk(`${writeToFile}/encryptedPassword.csv`);
            console.log("\nCSV File is genereated.");
        })

        .on("error", function (error) {
            console.log(error.message);
        });

}


(async () => {
    await processData();
})();
