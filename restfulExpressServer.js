'use strict';

//Dependency Library Setup
const fs = require('fs');

const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const ex = require('express');
const app = ex();

//app.disable('x-powered-by');

// const morgan = require('morgan');
// app.use(morgan('short'));

// const bodyParser = require('body-parser');
app.use(ex.json());


/*
    I: Your next task is to create a RESTful Express HTTP server called 
        restfulExpressServer.js to handle the create, update, and destroy HTTP 
        commands. The route handlers must translate their respective command into 
        an appropriate  action that manages the records in the database. Once the
        database  action is complete, the route handlers must send back an
        appropriate HTTP response.
    O: Information from data base, usage information or state error Usage
    C: Only allow CRUD functionality
    E: 
*/


//Get request to /pets
//Should return all pets
app.get('/pets', (req, res, next) => {
    fs.readFile(petsPath, "utf8", (readErr, petRes) => {
        if(readErr){
            return next(readErr);
        }
        const petsList = JSON.parse(petRes);
        res.send(petsList);
    });
});

//Gets request to pets/Index
//Gives back the data for the pet at that Index
// usually a DB key, now its the position in the json file
app.get('/pets/:id/', (req, res, next) => {
    //console.log(petId);
    fs.readFile(petsPath, 'utf8', (readErr, petRes) => {
        if(readErr){
            return next(err);
        }

        //cover req.params string into integer
        const pet_id = Number.parseInt(req.params.id);
        const petsList = JSON.parse(petRes);
        
        //make sure ID is in range of existing pets
        if(pet_id < 0 || pet_id >= petsList.length || Number.isNaN(pet_id)){
            return res.sendStatus(404);
        }
            
        res.send(petsList[pet_id]);
        

    });
});

//Post to "/Pets"
//Create a new pet resource
app.post("/pets", (req, res, next) => {
    //get information to support creation of new pet
    console.log('req.body', req.body);
    const age = Number.parseInt(req.body.age);
    const { kind, name } = req.body;

    //read file to confirm data was available
    fs.readFile(petsPath, 'utf8', (readErr, petRes) => {
        if(readErr){
            return next(readErr);
        }

        //get data from file, turn the string into JS OBJ
        const petsList = JSON.parse(petRes);
        //console.log(pets);
        
        //check if data is good from post request
        if(!age || !kind || !name || Number.isNaN(age)){
            return res.sendStatus(400);
        }

        //we can leave out the keys because of ES6
        const newPet = {age, kind, name};

        petsList.push(newPet);
        console.log('pets after insert', petsList);

        const petString = JSON.stringify(petsList);

        //write the new pets to the pets.json file
        fs.writeFile(petsPath, petString, (writeErr) => { 
            if (writeErr){
                return next(writeErr);
            }

            //If there is no writing issue, give the user back new pet
            res.send(`${newPet.name} was added`);
        });
    });

});

// //put request to /pets/:pets_id
// //update a pet with that ID
// app.put("/pets/:pet_id", (req,res,next) => {
//     //update pet with that ID
// });

//Patch request to /pets/pet_id
app.patch('/pets/:pet_id', (req, res, next) => {
    //update part of a pet's data with that Id
    //read file to confirm data
    fs.readFile(petsPath, 'utf8', (readErr, petRes) => {
        if(readErr){
            return next(readErr);
        }
        let petsList = JSON.parse(petRes);
        //console.log(petList);
        let petId = Number.parseInt(req.params.pet_id);
        //console.log(petId);

        //Get pet properties
        //console.log('req.body', req.body);
        const updatePet = petsList[petId];
        const age = Number.parseInt(req.body.age);
        const kind = req.body.kind;
        const name = req.body.name;

        if (petId < 0 || petId >= petsList.length || Number.isNaN(petId)) {
            return next(404);
        }

        if (!Number.isNaN(age)){
            updatePet.age = age;
        }

        if (kind){
            updatePet.kind = kind;
        }

        if (name){
            updatePet.name = name;
        }

        //console.log('the follwoing pet was updated to show: ', updatePet);

        const updatedPetsList = JSON.stringify(petsList);

        fs.writeFile('pets.json', updatedPetsList, (writeErr) => {
            if (writeErr){
                return next(writeErr);
            }

            res.send(updatePet);

        });

    });
});

//Delete request to /pets/pets_id
//delete a with that Id
app.delete("/pets/:id", (req, res, next) => {
    //delete out adopted pets
    //read file to confirm data
    fs.readFile(petsPath, 'utf8', (readErr, petRes) => {
        if(readErr){
            return next(readErr);
        }

        // Find pet to be adopted in list
        const pet_id = Number.parseInt(req.params.id);
        //console.log(id);

        let petsList = JSON.parse(petRes);
        //console.log(petsList);
        

        if(pet_id < 0 || pet_id >= petsList.length || Number.isNaN(pet_id)){
            return next(404);
        }

        const petArr= petsList.splice(pet_id, 1)[0];
        const newPetsList = JSON.stringify(petsList);
        //console.log(newPetsList);

        //Write new JSON file removing adopted pet
        fs.writeFile('pets.json', newPetsList, readErr =>{
            if(readErr){
                return next(readErr);
            }

            res.send(`Pet ${pet_id} was adopted!`);

        });

    });

});



const port = process.env.PORT || 8000;

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log('Listening on port', port);
  });

//Error function
app.use((err, req, res, next) => {
    console.error('We\'re not here right now');
    console.error(err.slack);
    res.sendStatus(404);
});

module.exports = app;