const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const options = {

    definition: {

        openapi: "3.0.0",

        info: {

            title: "NexusBank API",

            version: "1.0.0",

            description:
            "Banking Application API with Fraud Detection"

        },


        servers: [

            {
                url: "http://localhost:5000"
            }

        ],


        // JWT Authentication
        components: {

            securitySchemes: {

                bearerAuth: {

                    type: "http",

                    scheme: "bearer",

                    bearerFormat: "JWT"

                }

            }

        }

    },


    apis: [

        "./routes/*.js"

    ]

};



const swaggerSpec = swaggerJsdoc(options);



module.exports = {

    swaggerUi,

    swaggerSpec

};