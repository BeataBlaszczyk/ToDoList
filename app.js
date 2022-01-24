//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();
const nodemailer = require("nodemailer");

const specialCharsP = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
const numbersP = /\d/;
var haslo1="";
var haslo2="";
var haslo3="";


var transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    //type: 'OAuth2',
    user: 'beata.development@gmail.com',
    pass: 'Development@2'
  },
  tls:{
    rejectUnauthorized: false
  }
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-beata:mleczyk123@cluster0.yu0at.mongodb.net/todolistDB", {
  useNewUrlParser: true
});




var number = 0;
var dupa1="";
var dupa2="";
var err="";
const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "be happy"
});

const defaultItems = [item1];

const listSchema = {
  name: String,
  items: [itemsSchema]
}
//
const defaultList = {
  name: "My Priorities",
  items: defaultItems
}

const List = mongoose.model("List", listSchema);

const usersSchema = {
  name: String,
  password: String,
  avatar: String,
  mode: String,
  lists: [listSchema],
  email: String
};
const User = mongoose.model("User", usersSchema);

app.get("/", function(req, res) {
  res.render("login", {has:"", dupa1: dupa1, dupa2: dupa2, userErr: "", userErr2: "", haslo1:haslo1, haslo2:haslo2, haslo3:haslo3, number: number});
});

const admin = new User({
  name: "admin",
  password: "admin"
});

app.post("/recallPass", function(req, res){

  var userName = req.body.user
  // jezeli podałeś email przy kliknieciu wyskoczy okno, podasz uzytkownika i sign up to na ten email wysle stare hasło. jeżeli ktoś nie podał emailu to smutno
  // na 5 sekund niech pokaze strone ze haslo wyslane
  User.findOne({
    name: userName
  }, function(err, results) {

      if (!results){
      dupa ="there is no user ";
    //  console.log(dupa)
      res.render("login", {has:"" ,haslo1: haslo1, haslo2: haslo2, haslo3: haslo3,number: number, dupa1: "There is no user: "+ userName, dupa2: "You need to sign in first!", userErr:"err", userErr2:""});
    } ;
    if (results){

      if (results.email){

        var mailOptions = {
          from: 'beata.development@gmail.com',
          to: results.email,
          subject: 'To Do List - recall password',
          text: 'your password is: '+ results.password
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log("dupa",error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

console.log("???????????????????????????")
        res.render("login", {has:"" ,haslo1: haslo1, haslo2: haslo2, haslo3: haslo3,number: number, dupa1: "Check your email"+ userName, dupa2: "", userErr:"errG", userErr2:""});
      }else{
        res.render("login", {has:"" ,haslo1: haslo1, haslo2: haslo2, haslo3: haslo3,number: number, dupa1: "Ups we don't have your e-mail adress", dupa2: "You lost your data", userErr:"err", userErr2: ""});
      }


    //res.redirect("/" + userName);


}
  });


})



app.post("/profileDataUpdate", function(req, res){


var userName = req.body.confirm;
var userPasswordO =req.body.oldpass;
var userPasswordN =req.body.newpass;
var pathSRC= req.body.avatarPic2;
var email=req.body.email;

User.findOne({
  name: userName

}, function(err, results) {

  results.email= email;
  results.avatar= pathSRC;

  if(results.password===userPasswordO){
    results.password= userPasswordN // zmmienia hasło
  }else {
  console.log("blad");//komunikt jak bledne hasło
  }

console.log(" e: " + email + " passN: " + userPasswordN  + " passO: " + userPasswordO + " avatar: " + pathSRC);

  results.save();
  results.update();
  setTimeout(()=>res.redirect("/"+ userName), 1000);

});

  // opcja edycji profilu. tzn dodanie avatara i maila po kliknieciu w avatara, oraz możliwość zmiany hasłą
})


app.post("/", function(req, res) {
  //console.log(req.body);

  if (req.body.login) {
  //  console.log("log")
    var userName = req.body.login;
    var userPassword = req.body.password;
  }
  if (req.body.loginS) {
  //  console.log("sig")
    var userName = req.body.loginS;
    var userPassword = req.body.passwordS;
    var pathSRC = req.body.avatarPic;


  }

  const type = req.body.loginBut;

//  console.log("login: " + userName + " -   pass: " + userPassword + "log getttt? : " + type);

  if (type === "l") {
    User.findOne({
      name: userName
    }, function(err, results) {
    //  console.log(results);
      dupa="";
      if (!results){
        dupa ="there is no user ";
      //  console.log(dupa)
        res.render("login", {has:"" ,haslo1: haslo1, haslo2: haslo2, haslo3: haslo3,number: number, dupa1: "There is no user: "+ userName, dupa2: "You need to sign in first!", userErr:"err", userErr2:""});
      } ;
      if (results){
  //    console.log("suksex");

          //console.log("haslo z bazy: "  + results.password);
          //console.log("haslo wpisane:  " + userPassword);

        if (results.password === userPassword){
          setTimeout(()=>res.redirect("/"+ userName), 1000);
        }else{
          res.render("login", {has:"" ,haslo1: haslo1, haslo2: haslo2, haslo3: haslo3,number: number, dupa1: "Incorrect login or password.", dupa2: "Try again or click here to remind your password!", userErr:"err", userErr2: ""});
        }


      //res.redirect("/" + userName);


}
    });
  } else if (type === "s") {

    //console.log("numer redirect S: " + number);
  //user.update();



  User.findOne({
    name: userName
  }, function(err, results) {
  //  console.log(results);
    dupa="";
    if (results){
      dupa ="there is no user ";
    //  console.log(dupa)
      res.render("login", {has:"" , haslo1: haslo1, haslo2: haslo2, haslo3: haslo3,number: number, dupa1: "There is  user: "+ userName, dupa2: "You need to log in!!!", userErr2:"err", userErr:""});
    } ;
    if (!results){
//    console.log("suksex");
console.log("tutaj poszło dobrze")

var checkPass = checkPassword(userPassword);
//console.log(checkPass)
var haslo1 = checkPass[0];
var haslo2 = checkPass[1];
var haslo3 = checkPass[2];
var checkPassIndx = checkPass[3];
//console.log(checkPassIndx);
if (!checkPassIndx){

//console.log("PATH: ------------" + pathSRC);
 //saveImage(userName, pathSRC);
if (!pathSRC) {
  pathSRC = "/images/avatar.png"
//  console.log("BEW PATH" + pathSRC)
;}

  var user = new User({
    name: userName,
    password: userPassword,
    avatar: pathSRC,

    lists: defaultList
  });
  //console.log("NOWY USER ---" + user);
    user.save();
    user.update();
    setTimeout(()=>res.redirect("/"+ userName), 1000);
}else{


res.render("login", {number: number, has: "Password must contain", haslo1: haslo1, haslo2: haslo2, haslo3: haslo3, userErr: "", userErr2:"err", dupa1: dupa1, dupa2: dupa2});

}

}

  });





  //saveWait(user).then(()=> {console.log("ZAPISANE")});
 // updateWait(user).then(()=> {console.log("APDEJT")});;
 //
 //
 //   async function updateWait(db){
 //
 //    setTimeout(function(){db.update()}, 10000) ;
 //    console.log("UPDATED");
 //   }
 //
 //
 //   async function saveWait(db){
 //    setTimeout(function(){db.save()}, 10000) ;
 //    console.log("SAVED")
 //   }



  }


  //alert("You are a new user. We created an account for you.");



  //res.redirect("/:category");
});


//app.get("/", function(request, response){

app.post("/changeList", function(req,res){

  var  data = (req.body.aktualnaLista);
  //console.log(data);
    var customUser=req.body.listName;
    var changeType=data.split('-')[1];
    var checkedElementId = data.split('-')[0];

//console.log(customUser)
//console.log("number 1: "+ changeType)
  //console.log("id: "+checkedElementId);
  //  for (let i=0; i<(results.lists.length); i++){
  //    if (results.lists[i].name=== listName){
  //var currentList = User[customUser][listName]
if (changeType ==="change"){
  //console.log("ZMIANA")
  User.findOne({name: customUser},  function(err, results){
//console.log("ZMIANA")
  for (let i=0; i<(results.lists.length); i++){
//console.log(i + " - " +String(results.lists[i]._id) + " - " + checkedElementId )
  if (String(results.lists[i]._id) === checkedElementId){
    //console.log("i: " + i)
    number = i;
    //console.log("number change: "+ number);
setTimeout(()=>res.redirect("/"+ customUser), 1000);
    //res.redirect("/" + customUser);
  }}});

} else if (changeType === "delete") {
  //console.log("USUWAM")
User.findOne({name: customUser},  function(err, results){

  if (results.lists.length===1){

       results.lists.push(defaultList);
  }

for (let i=0; i<(results.lists.length); i++){
  let tmpID =   String(results.lists[i]._id)
if (tmpID == checkedElementId){




    //console.log("numer listy: " +i);
    results.lists.splice(i,1);
    results.save();
      results.update();
    //  updateSave(results);
//res.redirect("/"+customUser);
setTimeout(()=>res.redirect("/"+ customUser), 1000);
}
};
});
}else{
    console.log("BŁAD!!!!!!!!!!!!!")
}
});


app.post("/addList", function(req, res) {
var customUser=req.body.addlist;
//console.log( customUser + "lista: " + req.body.newList)

if (req.body.newList){
  const list = new List({
       name: req.body.newList,
       items: [],
     });

  User.findOne({name: customUser},  function(err, results){
      results.lists.push(list);
    results.save();
    results.update();
    setTimeout(()=>res.redirect("/"+ customUser), 1000);
   //updateSave(results);
  // res.redirect("/"+ customUser);

});


};
});


app.post("/addItem", function(req, res) {

var data = (req.body.newItem);

const item = new Item({
  name: req.body.newItemN
});

var customUser=data.split('-')[1];
var listName = data.split('-')[0];
//console.log( customUser + "lista: " + req.body.newList)



  User.findOne({name: customUser},  function(err, results){

for (let i=0; i<(results.lists.length); i++){
  if (results.lists[i].name=== listName){
    results.lists[i].items.push(item);
    results.save();
    results.update();
    //updateSave(results);
    setTimeout(()=>res.redirect("/"+ customUser), 1000);
  };//
};
//console.log(results.lists[i].name);
});
});

app.post("/delete", function(req, res) {

  var data = req.body.listName
  var checkedElementId = (req.body.checkbox);
  var customUser=data.split('-')[1];
  var listName = data.split('-')[0];

//console.log("id: "+checkedElementId);


//var currentList = User[customUser][listName]

User.findOne({name: customUser},  function(err, results){

for (let i=0; i<(results.lists.length); i++){


if (results.lists[i].name=== listName){

  for (let j=0; j<(results.lists[i].items.length); j++){

    var tmpID = String(results.lists[i].items[j]._id);

    if (tmpID == checkedElementId){
    //console.log(j);
    results.lists[i].items.splice(j,1)
    //console.log(  results.lists[i].items)
    results.save();
      results.update();
    //   updateSave(results);
      //console.log("delete : !!!  --"+ customUser)
setTimeout(()=>res.redirect("/"+ customUser), 1000);
//res.redirect("/"+customUser);
}//if
}//for j
}//if

};//for i

});//userfind

//console.log(results.lists[i].name);
});









//------------------------------------
// console.log("TUUUUUUUU" + currentList)
//
//       User.findByIdAndRemove({
//         _id: checkedElementId
//       }, function(err, result) {
//         //if (err) console.log(err);
//         if (!err) {
//
//           console.log("Succesfully deleted" + result);
//
//
//           User.findOne({name: customUser},  function(err, results){
//
//             console.log( "rezultat: "+results);
//
//
//
//             //
//             // results.save();
//             // results.update();
//             // res.redirect("/"+customUser)
//           });//
//         };
//         //console.log(results.lists[i].name);
//       });
//
//       });








app.get("/:userName", function(req, res) {
  //console.log('refresh');
  console.log("number refresh: "+ number)
  var customUser = (req.params.userName);
  //console.log("custom user" + customUser);



  User.findOne({
    name: customUser
  },  function(err, results) {
      console.log(results);
  //  console.log(results) ;
    if (results) {
      if (number>results.lists.length-1) {
         number = results.lists.length-1;
        console.log("number : "+ number)
      }
      res.render("list", {
      listTitle: results.lists,
      userName: customUser,
      number: number,
      avatar: results.avatar,
      email: results.email
    });
}
    if(!results){
      console.log("probemy z ppolaczeniem z baz");

    }


    //
    // };
  });

  //List.find({}, function(err, results){
  //res.render("list", {listTitle: req.params.category, newListItems: results.items});
});




app.get("/about", function(req, res) {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
};


app.listen(port, function() {
  console.log("Server has started succesfully");
});


function checkPassword(password){
console.log("sprawdzam haslo")
var checkPass=["✔️ at least 8 characters", "✔️ at least one special character", "✔️ at least one numeric character", ''];

if (password.length<8){
  var haslo1 = "🛑 at least 8 characters";
   checkPass[0] = haslo1;
checkPass[3] = true;
  }



  if (!specialCharsP.test(password)){
    var haslo2 = "🛑 at least one special character";
     checkPass[1] = haslo2;
     checkPass[3] = true;

    }

    if (!numbersP.test(password)){
      var haslo3 = "🛑 at least one numeric character";
     checkPass[2] = haslo3;
     checkPass[3] = true;

      }

return checkPass;
}


function saveImage(avatar, pathSRC){

console.log("A" + avatar + "   - patch --- " + pathSRC)

var avatarName = avatar;

  const options ={
    url: pathSRC,
    dest: "images/avatars/" + avatarName + ".png"
  }


  download.image(options)
    .then(({filename})=> {console.log("saved to", filename)
    })
    .catch((err)=> console.log(err));
}



 async function updateSave(db){

console.log("jestem w tej fnckji -----" )
    // await is only can be used when function is async [ This waits for completion of process ]

await db.save();
await User.update();

console.log("DB2 ---------------------------");
    }
