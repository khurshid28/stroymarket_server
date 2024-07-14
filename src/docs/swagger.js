const swaggerJsdoc = require("swagger-jsdoc");

const options = {
	failOnErrors: true,
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Diametr API Docs",
			version: "1.0.0",
			description: "Documentation for Diametr",
		},
		servers: [
			{
				url: `http://localhost:5090/api/v1`,
			},
		],
	},
	apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;