# Coditest

Coditest is a web application built with React and Firebase. It provides a platform for administrators to manage problems, interviewers to view statistics and information about these problems, and candidates to solve assigned programming problems using the provided code editor.

## About This Project

This project was developed as part of an academic course.

## Project Structure

The project is organized into several directories:

- `app/`: Main application code, including routes and components.
- `components/`: React components used throughout the application.
- `firebase/`:  Firebase configuration and utility functions.
- `utils/`:  Utility functions used across the application.
- `public/`:  Static files like images.
- `test/`: Test files and configurations.

## Key Files

- `app/firebase/firebaseConfig.js`: Configuration for Firebase, exporting the Firebase app instance and services like Firestore and Authentication.
- `app/components/Admin/ProblemManagement/ProblemCreationForm.jsx`: Component for administrators to add new problems to the system.
- `app/components/Entrevistador/EntrevistadorDashboard.jsx`: Component providing visual information and statistics about problems for interviewers.
- `app/components/UserInterface/CodeEditor.jsx`: Component allowing candidates to solve assigned programming problems.
- `jest.config.js`: Configuration for Jest, the testing framework used in this project.

## Running the Project

Before running the project, set up your Firebase configuration in the .env file. Provide your Firebase API key, Auth domain, Project ID, Storage bucket, Messaging sender ID, App ID, Measurement ID, and Realtime database URL.