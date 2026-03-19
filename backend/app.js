const keys = require("./keys")

const express = require("express")
const bodyparser = require("body-parser")
const cors = require("cors")

const app = express();

app.use(cors());

app.use(bodyparser.json())

const { Pool } = require("pg")

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})
pgClient.connect()
    .then(() => console.log("Postgres Connected"))
    .catch(err => console.error("PG Connection Error:", err));
pgClient.on("error", () => console.log("LOST PG CONNECTION"))
pgClient.query('CREATE TABLE IF NOT EXISTS "values"(number INT)').catch(err => console.log(err))

// const redis = require("redis");

// const redisClient = redis.createClient({
//     url: `redis://${keys.redisHost}:${keys.redisPort}`
// });

// redisClient.on("error", (err) => {
//     console.error("Redis error:", err);
// });

// (async () => {
//     try {
//         await redisClient.connect();
//         console.log("Redis connected");
//     } catch (err) {
//         console.log("Redis failed, continuing without it");
//     }
// })();

// const redisPublisher = redisClient.duplicate();

app.get("/", (req, res) => {
    res.send("hi")
})

app.get("/values/all", async (req, res) => {
    try {
        const values = await pgClient.query('SELECT * FROM "values"');
        return res.send(values.rows)
    } catch (e) {
        console.log(e)
        return res.send(e)
    }

})

app.get("/values/current", (req, res) => {
    try {
        // redisClient.hgetall("values", (err, values) => {
        //     res.send(values)
        // })
        res.send(1)
    } catch (e) {
        console.log(e)
        return res.send(e)

    }

})
app.post("/values", async (req, res) => {
    try {
        const index = req.body.index;
        if (parseInt(index) > 30) {
            return res.status(422).send("Index too high")
        }
        // redisClient.hset("values", index, "Nothing Yet");
        // redisPublisher.publish("insert", index)
        pgClient.query('INSERT INTO "values"(number) VALUES($1)', [index]);
        res.send({ working: true })
    } catch (e) {
        console.log(e)
        return res.send(e)

    }

})

app.listen(5000, "0.0.0.0", err => {
    console.log("LISTENING AT 5000")
})