# Cocktail Buddy API Project Structure

Each function in this codebase is treated as an independent unit—similar to a standalone microservice. Every function resides in its own folder and includes its core infrastructure: handler code, helper utilities, Firestore schema (if applicable), and any specific configuration or deployment files. This modular approach improves clarity, scalability, and testability by isolating concerns and reducing cross-dependencies.

## Folder Structure

* **index.js**: Entry point for the function
* **lib/**: Function-specific helper methods
  * **firestore/**: Database connection and operations
    * **firebaseAuth.js**: Firebase Authentication setup
    * **firestore.js**: Database connection utilities
    * **firestoreGet.js**: Read operations
    * **firestoreSave.js**: Write/update/delete operations
  * **utils/**: Utility functions
    * **routeUtils.js**: Authentication, CORS, and route helpers
    * **dateUtils.js**: Date manipulation utilities
* **firestoreDb.js**: Input/output definitions or Firestore data structure
* **server/**: Main service directory (if applicable)
* **watchHandlers/**: Firestore trigger handlers
* **package.json**: Function-specific dependencies and scripts

Use this structure when creating or modifying functions to maintain consistency and ensure that each function can be reasoned about, deployed, and tested independently.

# Cocktail Buddy API Structure

This document outlines the standard operating procedure for the Cocktail Buddy API project's structure. It serves as a guide for developers to maintain consistency, facilitate onboarding, ease of testing, and ensure scalability within the codebase infrastructure.

## Overview

The Cocktail Buddy API is built using Firebase Cloud Functions, designed to cover various functionalities of the cocktail recommendation application, particularly focusing on backend processes such as email notifications, push notifications, and cocktail data management. Each function within the codebase is isolated into its own directory, embodying principles of microservices for better modularity and ease of maintenance.

## Current Functions

### Email Functions
- **Purpose**: Handle email notifications and cocktail recommendations
- **Key Features**:
  - MailerLite API integration for reliable email delivery
  - Programmatic HTML email generation (no external templating engine)
  - Firestore trigger for automated email sending
  - Multiple email types: cocktail recommendations, welcome emails, daily features

### Notification Functions  
- **Purpose**: Handle push notifications and in-app notifications
- **Key Features**:
  - Firebase Cloud Messaging (FCM) integration
  - Multiple notification types (recommendations, daily cocktails, favorites)
  - Firestore trigger for automated notification processing

## Scripts Directory

The `scripts/` folder contains utility scripts for data management:

* **firestoreIndexes.js**: Documents required Firestore indexes
* **importCocktailData.js**: Imports cocktail data from JSON files
* **bulkUpdateCocktails.js**: Bulk updates and maintenance operations

## Hosting Directory

The `hosting/` folder provides app deep link functionality:

* **public/index.html**: Handles app deep link redirects with configurable URLs
* **public/404.html**: Custom error page
* **firebase.json**: Hosting configuration with rewrites and headers
* **config.example.js**: Example configuration for app URLs

## General Guidelines for Code Management

1. **Modularity**: Each function should encapsulate a single piece of API functionality, operating independently without overlap in responsibilities.
2. **Scalability**: Use of isolated functions ensures that the project can expand without impacting existing modules.
3. **Maintainability**: Consistent folder structures and naming conventions help locate files quickly and understand their purpose.
4. **Version Control**: Effective use of Git for code management. Branching strategies should follow best practices for feature additions, bug fixes, and releases.
5. **Documentation**: Inline documentation should describe what each function does, its input/output parameters, and any critical logic paths.
6. **Security**: Credentials or sensitive data should be stored in Firebase Config Variables or environment variables.
7. **Testing**: Each function should have appropriate tests to ensure reliability.
8. **No External Dependencies**: Email templates are generated programmatically to reduce dependencies and improve performance.

## Cocktail-Specific Features

- **MailerLite Integration**: Professional email service with high deliverability rates
- **Programmatic Email Templates**: HTML emails generated in code without external templating engines
- **Notification Types**: Specialized notifications for cocktail enthusiasts
- **Data Import**: Scripts for importing cocktail, ingredient, and category data
- **Statistics Tracking**: Automatic calculation and storage of cocktail statistics
- **App Deep Links**: Hosting service for redirecting users to mobile app

## Email Service Configuration

The project uses MailerLite as the email service provider:

- **Benefits**: High deliverability, cost-effective, built-in analytics
- **Configuration**: API key and verified from email required
- **Templates**: Generated programmatically with inline CSS for maximum compatibility
- **Types**: Welcome emails, cocktail recommendations, daily features, generic messages

By following this structure and these guidelines, developers can ensure that the Cocktail Buddy API project remains robust, scalable, and easy to maintain. This will also facilitate smooth onboarding for new developers and ensure current team members have a standardized reference for development and troubleshooting. 