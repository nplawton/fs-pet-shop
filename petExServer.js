//Dependency Library Setup
const fs = require('fs');
const ex = require('express');
const app = ex();

//gobal Variables
let port = 8000;
let petListArr = fs.readFileSync('pets.json');
//console.log('data is what type:', typeof petListArr);
//data comes in as STR and needs to be converted to a JS OBJ
const petList = JSON.parse(petListArr);
//console.log(petList)



//Setup Path options
app.get('/index', function (req, res) {
    res.send('GoodBye world');
});


app.get('/pets', function (req, res, next) {
    fs.readFile('pets.json', 'utf8', function (err, data) {
        if(err){
            next(err);
        }else{
            res.send(petList);
        }
    });
});

app.get('/pets/:id/', function (req, res, next) {
    const petId = parseInt(req.params.id);
    console.log(petId);
    //console.log(petList[petId]);
    fs.readFile('pets.json', 'utf8', function (err, data) {
        if(petId < 0 || petId >= petList.length){
            next({});
        }else if (petId <= petList.length){
            res.send(petList[petId]);  
        }else{
            next({});
        }
    });
});

//The error next app must be last
app.use((err, req, res, next) => {
    console.error('We\'re not here right now')
    console.error(err.stack);
    res.send(404);
});

//start listening on a port
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});