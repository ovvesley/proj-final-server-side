const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerOptions = {
  swaggerDefinition: {
      info: {
          title: "API Documentation (ROUTES)",
          description: "Documentation referencing to the routes",
          contact:{
              name: 'Bryant 24',
          },
          servers: ['http://localhost:3000'],
      }
  },
  apis: ["./routes/*.js"],
}; 

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = {
    swaggerDocs,
    swaggerUI,
};