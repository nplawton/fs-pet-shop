const { response } = require('express');
const fs = require('fs');
const http = require('http');

const port = 8000;

let petListArr = fs.readFileSync('pets.json');
const allPets = JSON.parse(petListArr);

const server = http.createServer((req, res) => {
    //console.log('hello world');
    const URL = req.url;
    const method = req.method;

    let splitUrl = URL.split('/');
    //console.log(splitUrl);
    let petNumStr = splitUrl[2];
    let petNum= parseInt(petNumStr)
    console.log(petNum);

    //console.log(URL);

    if (URL == '/pets'){
        fs.readFile('./pets.json', 'utf8', function(err, data) {
            console.log(allPets);
            if(err){
                res.statusCode = 404;
                res.end('Internal Server Error');
                //return;
            }else{
                res.getHeader('Content-Type', 'application/JSON');
                res.statusCode = 200 ;
                res.end(JSON.stringify(allPets));
            }
        });
    }

    if (URL == `/pets/${petNum}`){
        //console.log(petNum);
        if(petNum < 0 || petNum >= allPets.length){
            console.log('There are no Pets');
            res.statusCode = 404;
            res.end('There are no Pets');
        }else if (petNum >= 0 && petNum < allPets.length){
            //console.log('We have a pet');
            singlePet = allPets[petNum];
            console.log(singlePet);
            res.getHeader('Content-Type', 'application/JSON');
            res.statusCode = 200 ;
            res.end(JSON.stringify(singlePet));
        }else {
            res.statusCode = 404;
            res.end('Internal Server Error');            
        }
    }


});


server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});