const fs = require('fs');
//const crud = require('crud');

//command Inputs = Read / Create / Update / Destroy


//Gobal Variables
let petListArr = fs.readFileSync('pets.json');
//console.log('data is what type:', typeof petListArr);
//data comes in as STR and needs to be converted to a JS OBJ
const petList = JSON.parse(petListArr);
//data is now a JS usabke Array of OBJs
//console.log(petList);


//must be one of the four (above) commands or reports an error
let userInput = process.argv[2];
//console.log(userInput);

//Must come back as a valid number (INT) or report error
//Inittially comes in as a STR must be Parsed to be turned into a INT
let petStr = process.argv[3];
//petNum is now a valid number to run throw an Array
let petNum = parseInt(petStr);
//console.log(petNum);

if (userInput == 'read'){
    //console.log('User wants to:', userInput);
    fs.readFile('pets.json', 'utf8', function(error, data) {
        if (error){
            console.error(error);
        }else{
            //validate if the number is a number -- if petNum isn't (!) a Num throw error
            if (petNum < 0){
                console.error('This is an invaild choice');
            }else if (petNum <= 100){
                if(petList[petNum] === undefined){
                    console.log('Choice is not valid');
                    process.exit(1);
                }else{
                    console.log(petList[petNum]);
                }
            }else {
                console.error('This is an invalid choice');
                process.exit(1);
            }
        }
    });

}else if (userInput == 'create'){
    //console.log('User wants to:', userInput);


}else if(userInput == 'update'){
    console.log('User wants to:', userInput);
}else if(userInput == 'destroy'){
    console.log('User wants to:', userInput);
}else{
    console.log('This is an invaild option');
    process.exit(1);
}