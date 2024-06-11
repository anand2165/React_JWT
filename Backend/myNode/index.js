const express = require("express");
const jwt = require('jsonwebtoken');
const cors = require('cors');
const sql = require('mssql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
    user: 'sa',
    password: 'sa',
    server: 'IN-GVF3NX3', 
    database: 'ExpenseDb ',
    options: {
        encrypt: true, 
        trustServerCertificate: true 
    }
};

const jwtSecret='shhh';

app.post('/api/register',async(req,res)=>{
    try {
        const {name, email, password } = req.body;
        // Connect to the database
        let pool = await sql.connect(dbConfig);
        // Query to find user with provided email and password
        const result = await pool.request()
            .input('name', sql.VarChar, name)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .query('INSERT INTO users (name,email,password) values (@name,@email,@password)');
        res.json({result:result});
    }
    catch(err){
        console.error('SQL error', err);
        res.status(500).send({ error: 'Database error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Connect to the database
        let pool = await sql.connect(dbConfig);
        
        // Query to find user with provided email and password
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .query('SELECT * FROM users WHERE email = @email AND password = @password');
        
        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            const payload = { id: user.id };
            
            jwt.sign(payload, jwtSecret, { expiresIn: '10h' }, (err, token) => {
                if (err) {
                    res.status(500).send({ error: 'Error generating token' });
                } else {
                    res.json({ token: token,user:user });
                }
            });
        } else {
            res.status(401).send({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send({ error: 'Database error' });
    }
});

app.get('/api/incomes', verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, jwtSecret, async (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                let pool = await sql.connect(dbConfig);
                
                const result = await pool.request()
                    .query('SELECT * FROM incomes');
                
                const incomes = result.recordset;
                console.log(incomes);
                res.json({ incomes: incomes, authData: authData });
            }
        });
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send({ error: 'Database error' });
    }
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.listen(8080, () => { 
    console.log("server started on port 8080"); 
});
