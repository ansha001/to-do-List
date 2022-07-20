const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+"/date.js");
const mongoose = require('mongoose');

const app = express();

const URL= `mongodb+srv://Ansha:ansha0000@cluster0.2wsz6he.mongodb.net/todoList?retryWrites=true&w=majority`;
mongoose.connect(URL,{useNewUrlParser: true, useUnifiedTopology: true });

const items =['Item 1','Item 2','Item 3'];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



const itemsSchema = {
  name: String
}

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name:"Item1"
});
const item2 = new Item({
  name:"Item2"
});
const item3 = new Item({
  name:"Item3"
});


const defaultItems = [item1,item2,item3];


app.get('/', function(req, res){
  let day = date.getDate();

  Item.find({},function(err,foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Successfully saved default items to DB");
        }
      });
      res.redirect('/');
    }
    else{
      res.render('list',{listTitle:day, newlistItem: foundItems}) 
    }
  });
});

app.post('/', function(req, res){
  let itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  })
  item.save();
  res.redirect('/');
})

app.post('/delete', function(req, res){
  console.log(req.body.checkbox);
})

app.listen(3000, function(){
  console.log('Server started on port 3000');
});