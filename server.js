const express = require('express')
dotenv.config({ path: './.env'})
const app = express()
const port  = 3000
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

app.use(express.static('public'))
app.listen(port, () => console.log('server listening at http://localhost:'+port))
