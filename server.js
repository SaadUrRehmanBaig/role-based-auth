const express = require('express')
const cors = require('cors')
const dbConfig = require('./config/db.config')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const port = 8080

app.get("/", (req, res) => {
    console.log("server running")
    res.json({ msg: "server running on port 8080" })
})
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

app.listen(port, () => {
    console.log('server running on port 8080')
})

const db = require("./model/index")

const Role = db.role

db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
}).catch(err => {
    console.error("Connection error", err);
    process.exit();
});
function initial() {
    Role.estimatedDocumentCount().then((count) => {
        if (count === 0) {
            new Role({
                name: "user"
            }).save()
                .then(() => {
                    console.log("added 'user' to roles collection");
                })
                .catch((err) => {
                    console.log("error", err);
                });

            new Role({
                name: "moderator"
            }).save()
                .then(() => {
                    console.log("added 'moderator' to roles collection");
                })
                .catch((err) => {
                    console.log("error", err);
                });

            new Role({
                name: "admin"
            }).save()
                .then(() => {
                    console.log("added 'admin' to roles collection");
                })
                .catch((err) => {
                    console.log("error", err);
                });

        }
    }).catch(err => console.log(err));;
}