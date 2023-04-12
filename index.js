const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs');
const mongoose = require('mongoose');
var methodOverride = require('method-override');
const Twitter = require('./models/Twitter');
const User = require('./models/User');
app.use(methodOverride('_method'));
const port = 80;

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials', function (err) { });

//Mongoose specific stuff

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Twitter');
    console.log("we are connected")
}

//Endpoints for Login
app.get('/', (req, res) => {
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.render('login')

})

//Confirming User and fetching Data
app.post('/home', async (req, res) => {
    const { username, password } = req.body
    // console.log(req.body)
    const user = await User.find({ username: username })
    // console.log(user)
    if (user == false) {
        return res.send("User not found")
    }
    // console.log(user)
    // console.log(user[0].password)
    // console.log(password)
    if (password != user[0].password) {
        return res.send("Invalid password")
    }
    const tweets = await Twitter.find({ username: username })
    // console.log(tweets)
    res.redirect(`home/${username}`)
})


//Enpoints for Signup
app.get('/signup', (req, res) => {
    res.render('signup')
})
app.post('/newuser', async (req, res) => {
    const { name, username, password } = req.body;
    
    const user = await User.find({username})
    
    if(user.length==0) {

        let date = new Date(Date.now())
        const newUser = await User.create({
            name: name,
            username: username,
            password: password,
            date: date.toDateString()
        })
        res.redirect("/login")
    }
    else {
        res.send("Username already exists") 
    }
})

app.post('/addtweet/:username/:name', async (req, res) => {
    const { username, name } = req.params;
    let date = new Date(Date.now())

    // console.log(hours)
    const newTweet = await Twitter.create({
        name: name,
        username: username,
        description: req.body.description,
        date: date.toDateString()
    })
    // console.log(username)
    res.status(200).redirect(`/home/${username}`)
    // res.send()
})
app.get('/home/:username', async (req, res) => {
    const { username } = req.params
    // console.log(username)
    const user = await User.find({ username: username })
    const tweets = await Twitter.find({ username: username })
    const userstofollow = await User.find({username:{$ne:username}}).limit(3)
    // console.log(userstofollow)
    res.render('home', {
        username: username,
        tweets: tweets,
        user: user[0],
        userstofollow

    })
})

app.get('/profile/:username', async (req, res) => {
    const { username } = req.params
    const user = await User.find({ username: username })
    const tweets = await Twitter.find({ username: username })
    const userstofollow = await User.find({username:{$ne:username}}).limit(3)
    res.render('profile', {
        username: username,
        tweets: tweets,
        user: user[0],
        userstofollow


    })
})

app.get('/deletetweet/:_id', async (req, res) => {
    const { _id } = req.params;
    const tweetObject = await Twitter.find({ _id: _id });

    const username = tweetObject[0].username;
    console.log(username)
    await Twitter.findByIdAndRemove(_id);
    res.status(200).redirect(`/home/${username}`)
}
)
app.get('/editimg/:username',(req,res)=> {
    const {username}=req.params
    res.render('editimg',{
        username
    })
})
app.post('/editimg',async(req,res)=> {
    const {imgUrl,username}= req.body
    // console.log(req.body)
    
    const user = await User.find({ username: username })
    const id = user[0]._id
    await User.findByIdAndUpdate(id,{userimage:imgUrl},{new:true})
    
    
    res.redirect(`/profile/${username}`)
})

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})
