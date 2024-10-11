# University Application System

## Table of Contents

1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Database](#database)
4. [Authentication](#authentication)
5. [Modules](#modules)
6. [Schemas](#schemas)
7. [Custom Decorators](#custom-decorators)
8. [Guards and Roles](#guards-and-roles)
9. [Error Handling](#error-handling)
10. [Setup and Installation](#setup-and-installation)
11. [API Documentation](#api-documentation)
12. [Contributing](#contributing)
13. [License](#license)

## Introduction

This University Application System is a comprehensive platform built with NestJS, designed to manage university applications, programs, surveys, and user interactions. It provides a robust backend for handling various aspects of the university application process.

## System Architecture

The application is built using NestJS, a progressive Node.js framework for building efficient and scalable server-side applications. It follows a modular architecture, promoting code reusability and maintainability.

## Database

- **Database**: Amazon DynamoDB
- **ORM**: Dynamoose

DynamoDB is used as the primary database for its scalability and performance. Dynamoose is utilized as an Object Data Modeling (ODM) tool to interact with DynamoDB, providing an intuitive interface for database operations within the NestJS environment.

## Authentication

Authentication is handled using Amazon Cognito, providing secure user sign-up, sign-in, and access control. Cognito integrates seamlessly with the application, managing user pools and identity pools.

## Modules

The application is divided into the following modules:

1. **Application**: Handles the core application logic and flow.
2. **Programs**: Manages university programs and related information.
3. **Cities**: Handles city-related data and operations.
4. **Survey**: Manages surveys and their results.
5. **University**: Handles university-specific data and operations.
6. **User**: Manages user-related functionalities and profiles.

Each module is responsible for its own set of features and database interactions.

## Schemas

The following schemas are defined for database modeling:

1. **Application**: Represents a university application.
2. **ApplicationDocument**: Represents documents associated with an application.
3. **ProgramCore**: Represents core information about a university program.
4. **ProgramDetails**: Represents detailed information about a university program.
5. **SurveyResult**: Represents the results of a survey.
6. **City**: Represents city information.

## Custom Decorators

### Implemented Decorators

1. **@GetUser()**: Extracts the authenticated user from the request object.

### Suggested Additional Decorators

2. **@Roles(...)**: Specifies required roles for accessing a route.
3. **@Public()**: Marks a route as publicly accessible without authentication.
4. **@ApiResponse(...)**: Documents API responses for Swagger.
5. **@Validate()**: Applies custom validation to route parameters or body.

## Guards and Roles

The system implements role-based access control with the following roles:

- Admin
- Student
- B2BAdmin
- B2BStaff

An AuthGuard is implemented to protect routes and ensure proper authentication and authorization.

## Error Handling

A centralized ErrorHandling service is implemented to manage and standardize error responses across the application. This service helps in providing consistent error messages and status codes.

## Setup and Installation

(Provide step-by-step instructions for setting up and running the application, including environment setup, dependency installation, and configuration steps.)

## API Documentation

(Provide information about API endpoints, request/response formats, and any API documentation tools used, such as Swagger.)

## Contributing

(Provide guidelines for contributing to the project, including coding standards, pull request process, etc.)

## License

(Specify the license under which the project is released.)
