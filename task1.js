const express = require("express");
const fs = require("fs");
const app = express();

const bodyParser = require("body-parser");
const { application } = require("express");
const bodyParserForm = bodyParser.urlencoded();
let settings = {
    IdCounter:1
}
let books = []

app.set("view engine","ejs");

app.get("/home",function(req,res){
    let book = "";

    let books = []
    res.render("home.ejs",{Name:book, Books:books})
})


//display all books
app.get("/allbooks",function(req,res){

    let fbooks = books;
    if(req.query.q){
        fbooks = books.filter(contact=> contact.Name.indexOf(req.query.q)>-1 || contact.Phone.indexOf(req.query.q)>-1)
    }
    
    res.render("allbooks.ejs",{q:req.query.q,fbooks});

})


//add new book
app.get("/addbook",function(req,res){
    res.render("addbook.ejs");
})

app.post("/addbooks",bodyParserForm,function(req,res){
    req.body.Id = settings.IdCounter++;
    books.push(req.body)
    saveDataToFile();
    res.render("redirect.ejs");
})

//update books

app.get("/updatebooks",function(req,res){

    let book = books.find(book=>book.Id== req.query.Id);
    res.render("updatebooks.ejs",{contact});
});


app.post("/updatebook",bodyParserForm,function(req,res){
   

    //find item that match the id in the array
    let book = books.find(book=>book.Id==req.body.Id);
    
    //update item with new values
    contact.Name=req.body.Name;
    contact.Title=req.body.Title;

    saveDataToFile();
    res.render("redirect.ejs");
})

//delete contact
app.get("/deletebook",function(req,res){
    //console.log(req.body);

    //find item that match the id in the array
    let bookIndex = books.findIndex(book=>book.Id==req.query.Id);
    books.splice(bookIndex,1);
    saveDataToFile();
    res.render("redirect.ejs");
})

//saving 
function saveDataToFile(){

    fs.writeFile("books.db",JSON.stringify(books),function(err){
        if(err)
            console.log(err);
    })

    fs.writeFile("settings.db",JSON.stringify(settings),function(err){
        if(err)
            console.log(err);
    })
}


function loadDataFromFile(){
    fs.readFile("books.db",function(err,data){
        if(err){
            console.log(err)
        }else{
            books = JSON.parse(data);
        }
    })
    fs.readFile("settings.db",function(err,data){
        if(err){
            console.log(err)
        }else{
            settings = JSON.parse(data);
        }
    })
}


loadDataFromFile();





app.listen(8080);