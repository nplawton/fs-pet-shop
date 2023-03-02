'use strict';

//Dependency Library Setup
const fs = require('fs');

const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const ex = require('express');
const app = ex();

const {Pool} = require('pg');

const bodyParser = require('body-parser');
const { Console } = require('console');
app.use(bodyParser.json());

//port that Express will listen to for requests
const port = process.env.PORT || 8000;

//use DATABASE_HOST environmental variable if it exists (set by docker compose),
//or default to localhost if no value is set (run outside docker)
const DB_HOST = process.env.DATABASE_HOST || 'localhost';

const pool = new Pool ({
    user: "postgres",
    host: DB_HOST,
    database: "petshop",
    password: "password",
    port: 5432
});


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


//Get request to /pets - Reads all pet entities
//Should return all pets
app.get('/pets', (req, res, next) => {

    //With Prostgress and pgAdmin established
    pool.query('SELECT * FROM pets', (err, results) => {
        if(err){
            return next(err);
        }

        let row = results.rows;
        console.log(row);
        res.send(row);

    });

    //Without Prostgress and pgAdmin established
    // fs.readFile(petsPath, "utf8", (readErr, petRes) => {
    //     if(readErr){
    //         return next(readErr);
    //     }
    //     const petsList = JSON.parse(petRes);
    //     res.send(petsList);
    // });
});

//Gets request to pets/Index - Reads a single pet entity
//Gives back the data for the pet at that Index
// usually a DB key, now its the position in the json file
app.get('/pets/:id/', (req, res, next) => {
    //console.log(petId);

    //indetifying the id enterend in the req.param and converting it into a INT
    const id = Number.parseInt(req.params.id);
    console.log(id);

    //IF ID is not a number return error
    if(!Number.isInteger(id)){
        res.status(404).send('No pet with that id');
    }

    pool.query('SELECT name, kind, age FROM pets WHERE id = $1', [id], (err, results) => {
        if (err){
            return next(err);
        }

        //"rows[0]" is from the table in pgAdmin
        //ensure that the first response and the second are differnt (i.e. res and result)
        const pet = results.rows[0];
        console.log('Single pet requested', pet);

        if(pet){
            return res.send(pet);
        }else{
            //Exit prompt and let client know that there is no pet at that ID
            return res.status(404).send("No Pet found with that ID");
        }
    });

    //Without Prostgress and pgAdmin established
    // fs.readFile(petsPath, 'utf8', (readErr, petRes) => {
    //     if(readErr){
    //         return next(err);
    //     }

    //     //cover req.params string into integer
    //     const pet_id = Number.parseInt(req.params.id);
    //     const petsList = JSON.parse(petRes);
        
    //     //make sure ID is in range of existing pets
    //     if(pet_id < 0 || pet_id >= petsList.length || Number.isNaN(pet_id)){
    //         return res.sendStatus(404);
    //     }
            
    //     res.send(petsList[pet_id]);
        

    //});
});

//Post to "/Pets" -Creates a new pet entity
//Create a new pet resource
app.post("/pets", (req, res, next) => {
    //get information to support creation of new pet
    
    const { name, kind } = req.body;
    const age = Number.parseInt(req.body.age);
    console.log(`Request body name: ${name}, kind: ${kind}, age: ${age}`);

    //check request data - if everything exists and id is a number
    if(name && kind && !Number.isNaN(age)){
        //console.log ('hi');
        //If all parameters are there to create an entity run a pool query
        pool.query('INSERT INTO pets (name, kind, age) VALUES ($1, $2, $3) RETURNING *',
            [name, kind, age], (err, data) => {
                const pet = data.rows[0];
                console.log("Created Prt:", pet);

                if(pet){
                    return res.send(pet);
                }else{
                    return next(err);
                }
            });
    }else{
        //if any of the parameters are missing to complete the enitity send ERR
        return res.status(400).send("Unable to create pet recheck information and try again");
    }

    
   
    //Without Prostgress and pgAdmin established
    // console.log('req.body', req.body);
    // const age = Number.parseInt(req.body.age);
    // const { kind, name } = req.body;

    // //read file to confirm data was available
    // fs.readFile(petsPath, 'utf8', (readErr, petRes) => {
    //     if(readErr){
    //         return next(readErr);
    //     }

    //     //get data from file, turn the string into JS OBJ
    //     const petsList = JSON.parse(petRes);
    //     //console.log(pets);
        
    //     //check if data is good from post request
    //     if(!age || !kind || !name || Number.isNaN(age)){
    //         return res.sendStatus(400);
    //     }

    //     //we can leave out the keys because of ES6
    //     const newPet = {age, kind, name};

    //     petsList.push(newPet);
    //     console.log('pets after insert', petsList);

    //     const petString = JSON.stringify(petsList);

    //     //write the new pets to the pets.json file
    //     fs.writeFile(petsPath, petString, (writeErr) => { 
    //         if (writeErr){
    //             return next(writeErr);
    //         }

    //         //If there is no writing issue, give the user back new pet
    //         res.send(`${newPet.name} was added`);
    //     });
    // });

});

//Patch request to /pets/pet_id - Update an Entity
app.patch('/pets/:id', (req, res, next) => {
    
    //check the id from url of the entity to update
    //:id parameter check needs to match the request parameter below variable
    const id = Number.parseInt(req.params.id);
    //console.log(id);
    
    //get the change/update information from the request body
    const age = Number.parseInt(req.body.age);
    const { name, kind } = req.body;
    //console.log('Information to Change/Update', req.body);

    if(!Number.isInteger(id)){
        res.status(404).send("No pet found with that ID in the database");
    }

    //check to make sure that the ID is number and send message
    console.log("PetID: ", id);

    //get the values of the entity with that ID from the database
    pool.query("SELECT * FROM pets WHERE id = $1", [id], (err, result) => {
        if(err){
            return next(err);
        }

        //make sure update/change information is still accessable
        console.log('Information to Change/Update', req.body);

        const pet = result.rows[0];
        //the object entity can't go into the back tick string
        console.log(`Single PET ID from database, ${id}, with values:`, pet);

        //if the pet doesn't exit end the command and return err
        if(!pet){
            return res.status(404).send("No pet found with that id");
        }else{
            //check which values are in the request body, otherise use the previous pet values
            /*
                this is another way to write the update/change parameter
                let updatedParam = null;
                if(param){
                    updatedParam = param;
                }else{
                    updatedParam = database table.param;
                }
            */
            
            //List all columns in the database table there is not limit to the $s
            const updatedName = name || pet.name;
            const updatedKind = kind || pet.kind;
            const updatedAge = age || pet.age;

            pool.query('UPDATE pets SET name=$1, kind=$2, age=$3 WHERE id = $4 RETURNING *',
                    [updatedName, updatedKind, updatedAge, id], (err, data) => {
                        if (err){
                            return next(err);
                        }

                        const updatedPet = data.rows[0];
                        console.log('Updated pet values are, ', updatedPet);
                        return res.send(updatedPet);
                    });
        }

    });


    
    //Without Prostgress and pgAdmin established
    //update part of a pet's data with that Id
    //read file to confirm data
    // fs.readFile(petsPath, 'utf8', (readErr, petRes) => {
    //     if(readErr){
    //         return next(readErr);
    //     }
    //     let petsList = JSON.parse(petRes);
    //     //console.log(petList);
    //     let petId = Number.parseInt(req.params.pet_id);
    //     //console.log(petId);

    //     //Get pet properties
    //     //console.log('req.body', req.body);
    //     const updatePet = petsList[petId];
    //     const age = Number.parseInt(req.body.age);
    //     const kind = req.body.kind;
    //     const name = req.body.name;

    //     if (petId < 0 || petId >= petsList.length || Number.isNaN(petId)) {
    //         return next(404);
    //     }

    //     if (!Number.isNaN(age)){
    //         updatePet.age = age;
    //     }

    //     if (kind){
    //         updatePet.kind = kind;
    //     }

    //     if (name){
    //         updatePet.name = name;
    //     }

    //     //console.log('the follwoing pet was updated to show: ', updatePet);

    //     const updatedPetsList = JSON.stringify(petsList);

    //     fs.writeFile('pets.json', updatedPetsList, (writeErr) => {
    //         if (writeErr){
    //             return next(writeErr);
    //         }

    //         res.send(updatePet);

    //     });

    // });
});

//Delete request to /pets/:id - Delete an entity
//delete a with that Id
app.delete("/pets/:id", (req, res, next) => {
    
    const id = Number.parseInt(req.params.id);
    console.log(id);

    if(!Number.isInteger(id)){
        return res.status(404).send("No pet found with that ID");
    }

    pool.query('DELETE FROM pets WHERE id = $1 RETURNING *', [id], (err, data) => {
        if (err){
            return next(err);
        }

        const deletePet = data.rows[0];
        console.log(deletePet);
        if(deletePet){
            //respond with deleted row
            res.send(deletePet);
        }else{
            res.status(404).send("No pet found with that ID");
        }
    });


    //Without Prostgress and pgAdmin established
    //delete out adopted pets
    //read file to confirm data
    // fs.readFile(petsPath, 'utf8', (readErr, petRes) => {
    //     if(readErr){
    //         return next(readErr);
    //     }

    //     // Find pet to be adopted in list
    //     const pet_id = Number.parseInt(req.params.id);
    //     //console.log(id);

    //     let petsList = JSON.parse(petRes);
    //     //console.log(petsList);
        

    //     if(pet_id < 0 || pet_id >= petsList.length || Number.isNaN(pet_id)){
    //         return next(404);
    //     }

    //     const petArr= petsList.splice(pet_id, 1)[0];
    //     const newPetsList = JSON.stringify(petsList);
    //     //console.log(newPetsList);

    //     //Write new JSON file removing adopted pet
    //     fs.writeFile('pets.json', newPetsList, readErr =>{
    //         if(readErr){
    //             return next(readErr);
    //         }

    //         res.send(`Pet ${pet_id} was adopted!`);

    //     });

    // });

});


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