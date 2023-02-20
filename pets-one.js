#!/usr/bin/env node

//Makes the #! work
//varailable to read the fs (field suupport module) dependency
const fs = require('fs');

/*
    I: Subcommands Read / Create / Update / Destroy
    O: Information from data base, usage information or state error Usage
    C: Only allow CRUD functionality
    E: If user doesn't type a CRUD what do we do?
            Display list of subcommands usage
            user type in an invalid command show user err message invaild
*/


//command Inputs = Read / Create / Update / Destroy
let userInput = process.argv[2];
switch (userInput){
    case 'read':
        readPet();
        break;
    case 'create':
        createPet();
        break;
    case 'update':
        updatePet();
        break;
    case 'destroy':
        destroyPet();
        break;
    default:
        console.log('Usage: node pets.js [read | create | update | destroy]');
}

// //Gobal Variables
let petListArr = fs.readFileSync('pets.json');
//console.log('data is what type:', typeof petListArr);
//data comes in as STR and needs to be converted to a JS OBJ
const petList = JSON.parse(petListArr);
//data is now a JS usable Array of OBJs
//console.log(petList);


function readPet(){
    //console.log('I\'m looking through the pet registry');

    //Must come back as a valid number (INT) or report error
    //Inittially comes in as a STR must be Parsed to be turned into a INT
    let petStr = process.argv[3];
    //petNum is now a valid number to run throw an Array
    let petNum = parseInt(petStr);
    //console.log(petNum);

    fs.readFile('pets.json', 'utf8', function(error, data) {
        if (error){
            console.error(error);
        }else{
            //validate if the number is a number -- if petNum isn't (!) a Num throw error
            //console.log(petList);
            if (petNum < 0){
                console.error('This is an invaild choice');
            }else if (petNum <= petList.length){
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

}

function createPet(){
    //console.log('I\'m creating a new pet');

    //readFile = petList
    let petListArr = fs.readFileSync('pets.json');

    //Convert data response from JSON to JS OBJ (JSON.parse)
    const petList = JSON.parse(petListArr);
    //console.log(petList);

    //Assign that data to variable that was read
    //Ensure pet age is a number
    let petAge = parseInt(process.argv[3]);
    let petKind = process.argv[4];
    let petName =  process.argv[5];

    //Create an empty object to hold the pet variables
    let newPet = {
        age: petAge,
        kind: petKind,
        name: petName
    };

    //return a truthy check that all three pet parameters were added if not run usage prompt
    if (petAge && petKind && petName){
        //console.log('we have a new pet');
        //create an empty array to hold the complete pet listing (newPet{})
        let newPetArr = [newPet];
        //console.log(newPetArr);

        //combine old & new new data into one Array
        let newRegistry = petList.concat(newPetArr);
        //console.log(newRegistry);

        //write file JSON format (JSON Stringify)
        const newPetList = JSON.stringify(newRegistry);
        //console.log(newPetList);

        fs.writeFile('pets.json', newPetList, err => {
            if(err){
                console.log ('Error with writing file', err);
            }else{
                console.log(`Registry was updated with ${newPet.name}`);
            }
        });

        


    }else{
        console.log('Usage: node pets.js create AGE KIND NAME');
    }

}

function updatePet(){
    //console.log('Updating the registry');
    //create a new animal and place importance higher in the registry

    //read current pet list
    let petListArr = fs.readFileSync('pets.json');
    const petList = JSON.parse(petListArr);
    //console.log(petList);

    //Get index value of new pet
    let petOrder = parseInt(process.argv[3]);
    //console.log(petOrder);

    // get the other variables to indentify pet
    let petAge = parseInt(process.argv[4]);
    let petType = process.argv[5];
    let petName = process.argv[6];

    let newPet = {
        age: petAge,
        kind: petType,
        name: petName
    }
    //console.log(petOrder, newPet);

    //create a truthy statement to validate all parameters are present if not throw usage note to user
    if(petOrder && petAge && petType && petName){
        //console.log("new Pet Creteated")

        // create new pet array to update registry at the current Index
        /*splice takes in three parameters use "0" to insert but not delete 
        current elements; three params are index, how many, new element*/
        let updateRegistry = petList.splice(petOrder, 0, newPet);
        //console.log(petList); //with splice use existing array not the array used to splice elements
        
        //write new pet into existing data base
        let petOrderList = JSON.stringify(petList);
        fs.writeFile('pets.json', petOrderList, err => {
            if(err){
                console.log('Pet not added to registry', err)
            }else{
                console.log(`${newPet.name} was added to the registry at ${petOrder}`)
            }
        });

    }else{
        console.log('Usage: node pets.js update INDEX AGE KIND NAME');
    }

}

function destroyPet(){
    //console.log('Pet was adopted!');

    //check to make sure pet list is accessable
    let petListArr = fs.readFileSync('pets.json');
    const petList = JSON.parse(petListArr);
    //console.log(petList);

    //creat index variable as an INT
    let petIndex = parseInt(process.argv[3]);
    //console.log(petIndex);

    let petAdopted = petList[petIndex];
    //console.log(petAdopted);
    
    //truthy check if index was given if not run usage prompt
    if(petIndex){
        if(petIndex >= 0 && petIndex < petList.length){
            //console.log(`${petAdopted.name} has been adopted`);
            //Remove adopted pet
            let adoptArr = petList.splice(petIndex, 1);
            //console.log(petList);
            //write file JSON format (JSON Stringify)
            let petsRemaining = JSON.stringify(petList);
            console.log(petsRemaining);
            //console.log updated pet list
            fs.writeFile('pets.json', petsRemaining, err => {
                if(err){
                    console.log ('Error with writing file', err);
                }else{
                    console.log(`${petAdopted.name} has been adopted`);
                }
            });

        }else if(petIndex < 0 || petIndex >= petList.length){
            console.log('Usage: node pets.js destroy INDEX');
        }
    }else{
        console.log('Usage: node pets.js destroy INDEX');
    }
}