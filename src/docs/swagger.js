const swaggerJsdoc = require("swagger-jsdoc");

const options = {
	failOnErrors: true,
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Premium Pay API Docs",
			version: "1.0.0",
			description: "Documentation for Stroymarket",
		},
		servers: [
			{
				url: `http://localhost:8090/api`,
			},
		],
	},
	apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;