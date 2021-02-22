const axios = require("axios")

function fetchData(id){
    return axios.get(`http://localhost:3000/customers/${id ? id : ''}`).then(res=>res.data)
}

const {
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLNonNull
} = require('graphql')

const customerType = new GraphQLObjectType({
    name:"customers",
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        age:{type:GraphQLInt},
        email:{type:GraphQLString}
    })
})


const RootQueryType = new GraphQLObjectType({
    name:"QueryType",
    fields:{
        customer:{
            type:customerType,
            args:{id:{type:GraphQLInt}},
            resolve:(_,{id})=>fetchData(id)
        },
        customers:{
            type:new GraphQLList(customerType),
            resolve(){
           return fetchData()
            }
        }
    }
})

// mutation

const mutation = new GraphQLObjectType({
    name:'mutateCustomer',
    fields:{
        addCustomer:{
            type:customerType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                age:{type:new GraphQLNonNull(GraphQLInt)},
                email:{type:new GraphQLNonNull(GraphQLString)}
        },
            resolve(_,args){
                return axios.post(`http://localhost:3000/customers`,{
                    name:args.name,
                    age:args.age,
                    email:args.email
                }).then(res=>res.data)
            }
        },
        deleteCustomer:{
            type:customerType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(_,args){
                return axios.delete(`http://localhost:3000/customers/${args.id}`).then(res=>res.data)
            }
        },
        editCustomer:{
            type:customerType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)},
                name:{type:GraphQLString},
                age:{type:GraphQLInt}
            },
            resolve(_,args){
                return axios.patch(`http://localhost:3000/customers/${args.id}`,args).then(res=>res.data)
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query:RootQueryType,
    mutation
});