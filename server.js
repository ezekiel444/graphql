const express = require("express")
const {graphqlHTTP} = require("express-graphql")
const schema = require("./schema")
const app = express()

app.use("/graphql",graphqlHTTP({
    graphiql:true,
    schema:schema
}))


const PORT = 4000;

app.listen(PORT,()=>console.log(`server runing ${PORT}`))
