# INDUSTRIAL TRAINING REPORT

**On**

**FAUNARESCUE: STRAY ANIMAL RESCUE AND ADOPTION PLATFORM**

**Submitted in partial fulfillment of the requirement for the award of**

**BACHELOR OF TECHNOLOGY**

**In**

**[Your Branch]**

**By**

**[Your Name]**

**Roll No.: [Your Roll Number]**

**Under the Guidance of**

**[Supervisor Name]**

**[Month, Year]**

**[College Name]**

**[College Address]**

---

## CERTIFICATE BY COMPANY/INDUSTRY/INSTITUTE

This is to certify that [Your Name], Roll No. [Your Roll Number], a student of B.Tech [Your Branch] at [College Name], has successfully completed his/her industrial training at [Company/Institute Name] from [Start Date] to [End Date].

During the training period, he/she worked on the project titled "FaunaRescue: Stray Animal Rescue and Adoption Platform" and demonstrated excellent technical skills, dedication, and professionalism. He/She actively participated in all phases of the project, from requirements gathering to deployment, and contributed significantly to the successful implementation of the platform.

We wish him/her all the best for his/her future endeavors.

**Place:** [Place]  
**Date:** [Date]

---

**Signature:**  
**Name:** [Authorized Person Name]  
**Designation:** [Designation]  
**Company/Institute Name:** [Company/Institute Name]

---

## CANDIDATE'S DECLARATION

I hereby declare that this report titled "FaunaRescue: Stray Animal Rescue and Adoption Platform" is the result of my own work carried out during the industrial training period. The report has not been submitted to any other university or institution for the award of any degree or diploma.

All the information and data presented in this report are authentic and have been verified from reliable sources.

**Place:** [Place]  
**Date:** [Date]

---

**Signature:**  
**Name:** [Your Name]  
**Roll No.: [Your Roll Number]**

---

## ABSTRACT

FaunaRescue is a comprehensive web-based platform designed to streamline the process of reporting, rescuing, treating, and adopting stray animals. The platform connects citizens reporting injured stray animals with nearby verified animal shelters in real time. Built using modern web technologies including React, Node.js, Firebase, and Socket.io, the system features GPS-based dispatch routing, real-time notifications, treatment progress tracking, and an adoption portal.

This report details the complete development lifecycle of the FaunaRescue platform, from requirements analysis and system design to implementation, testing, and deployment. The report includes detailed explanations of the technical architecture, implementation of key features, and the results achieved. The platform has the potential to make a significant positive impact on animal welfare by reducing response times for rescue operations and facilitating the adoption of recovered animals.

---

## ACKNOWLEDGMENT

I would like to express my sincere gratitude to [Supervisor Name] for their valuable guidance, constant support, and motivation throughout the training period. Their expertise and insights have been instrumental in the successful completion of this project.

I am also thankful to the team at [Company/Institute Name] for providing me with the opportunity to work on this project and for their constant encouragement and support. I extend my thanks to my college faculty for their advice and guidance.

Finally, I thank my family and friends for their unwavering support, motivation, and understanding throughout the training period.

---

## TABLE OF CONTENTS

1. **CHAPTER 1: INTRODUCTION**
   1.1 Background of the Problem
   1.2 Need for the Project
   1.3 Objectives of the Project
   1.4 Scope of the Project
   1.5 Organization of the Report

2. **CHAPTER 2: FIELD OF TRAINING**
   2.1 Overview of Web Development
   2.2 Frontend Technologies
       2.2.1 React
       2.2.2 Vite
       2.2.3 React Router DOM
       2.2.4 Lucide React
       2.2.5 CSS and UI Design
   2.3 Backend Technologies
       2.3.1 Node.js
       2.3.2 Express.js
       2.3.3 Middleware in Express
   2.4 Real-Time Communication
       2.4.1 Socket.io
   2.5 Database and Authentication
       2.5.1 Firebase Firestore
       2.5.2 Firebase Auth
   2.6 File Upload Handling
       2.6.1 Multer

3. **CHAPTER 3: TRAINING WORK UNDERTAKEN**
   3.1 Project Overview
   3.2 Requirements Analysis
       3.2.1 Functional Requirements
       3.2.2 Non-Functional Requirements
   3.3 System Design
       3.3.1 Architecture Design
       3.3.2 Database Design
       3.3.3 API Design
       3.3.4 UI/UX Design
   3.4 Implementation Details
       3.4.1 Backend Implementation
           3.4.1.1 Server Setup
           3.4.1.2 Firebase Configuration
           3.4.1.3 Socket.io Setup
           3.4.1.4 Authentication Controller
           3.4.1.5 Animal Controller
           3.4.1.6 Rescue Request Controller
           3.4.1.7 Adoption Controller
           3.4.1.8 Shelter Controller
           3.4.1.9 Admin Controller
           3.4.1.10 Notification Controller
           3.4.1.11 Middleware Implementation
       3.4.2 Frontend Implementation
           3.4.2.1 Project Setup
           3.4.2.2 Context Providers
               3.4.2.2.1 AuthContext
               3.4.2.2.2 SocketContext
           3.4.2.3 Components
               3.4.2.3.1 Navbar
               3.4.2.3.2 ProtectedRoute
               3.4.2.3.3 InteractiveMap
               3.4.2.3.4 MetricCard
           3.4.2.4 Pages
               3.4.2.4.1 LandingPage
               3.4.2.4.2 Login
               3.4.2.4.3 Register
               3.4.2.4.4 UserDashboard
               3.4.2.4.5 ShelterDashboard
               3.4.2.4.6 AdminDashboard
               3.4.2.4.7 BrowseAdoptions
               3.4.2.4.8 ProfilePage
   3.5 My Role in the Project
   3.6 Project Timeline

4. **CHAPTER 4: RESULTS AND DISCUSSIONS**
   4.1 Development Environment Setup
   4.2 Testing
       4.2.1 Unit Testing
       4.2.2 Integration Testing
       4.2.3 User Acceptance Testing
   4.3 Deployment
       4.3.1 Local Deployment
       4.3.2 Production Deployment Considerations
   4.4 Features Demonstration
       4.4.1 User Registration and Login
       4.4.2 Reporting an Injured Animal
       4.4.3 Shelter Dashboard
       4.4.4 Rescue Request Acceptance
       4.4.5 Treatment Progress Tracking
       4.4.6 Adoption Application
       4.4.7 Admin Dashboard
   4.5 Performance Analysis
   4.6 Challenges Faced and Solutions

5. **CHAPTER 5: CONCLUSION**
   5.1 Conclusion
   5.2 Future Scope

6. **REFERENCES**

7. **APPENDIX**
   A. Complete Backend Code
   B. Complete Frontend Code
   C. Environment Variables
   D. Database Queries

---

## LIST OF FIGURES

Figure 2.1: React Component Lifecycle  
Figure 2.2: Node.js Event Loop  
Figure 2.3: Socket.io Communication Flow  
Figure 2.4: Firebase Firestore Data Model  
Figure 3.1: System Architecture Diagram  
Figure 3.2: Database ER Diagram  
Figure 3.3: API Flow Diagram  
Figure 3.4: User Dashboard Wireframe  
Figure 3.5: Shelter Dashboard Wireframe  
Figure 3.6: Admin Dashboard Wireframe  
Figure 4.1: Landing Page Screenshot  
Figure 4.2: Login Page Screenshot  
Figure 4.3: User Dashboard Screenshot  
Figure 4.4: Shelter Dashboard Screenshot  
Figure 4.5: Admin Dashboard Screenshot  
Figure 4.6: Browse Adoptions Page Screenshot  

---

## LIST OF TABLES

Table 2.1: Technology Stack Summary  
Table 2.2: Comparison of Frontend Frameworks  
Table 2.3: Comparison of Backend Frameworks  
Table 2.4: Comparison of Databases  
Table 3.1: User Roles and Capabilities  
Table 3.2: API Endpoints Summary  
Table 3.3: Firestore Collections Structure  
Table 4.1: Test Cases Summary  

---

## NOTATIONS/NOMENCLATURE

| Abbreviation | Description |
|--------------|-------------|
| API | Application Programming Interface |
| HTTP | Hypertext Transfer Protocol |
| HTTPS | Hypertext Transfer Protocol Secure |
| JSON | JavaScript Object Notation |
| SDK | Software Development Kit |
| UI | User Interface |
| UX | User Experience |
| GPS | Global Positioning System |
| DB | Database |
| SPA | Single Page Application |
| MVC | Model View Controller |
| REST | Representational State Transfer |
| JWT | JSON Web Token |
| CDN | Content Delivery Network |
| DOM | Document Object Model |
| CSS | Cascading Style Sheets |
| HTML | HyperText Markup Language |
| JS | JavaScript |
| Node | Node.js |
| NPM | Node Package Manager |

---

## CHAPTER 1: INTRODUCTION

### 1.1 Background of the Problem

Stray animals are a common sight in both urban and rural areas around the world. These animals often face harsh living conditions, hunger, and injuries from accidents, abuse, or diseases. While many citizens are compassionate and want to help injured stray animals, they often do not know how to contact the nearest animal shelter or rescue organization.

Traditional methods of reporting stray animals include making phone calls to animal welfare organizations or visiting them in person. However, these methods are often slow and inefficient. Shelters may not have accurate information about the location of the injured animal, and there may be delays in dispatching a rescue team. This can lead to the animal's condition worsening, and in some cases, even death.

Additionally, once an animal is rescued and treated, there is often a lack of a centralized platform to facilitate its adoption. This results in many recovered animals remaining in shelters for long periods, or even being returned to the streets.

### 1.2 Need for the Project

There is a clear need for a modern, efficient platform that can:
1. Connect citizens who encounter injured stray animals with nearby verified shelters in real time
2. Provide accurate location information using GPS
3. Allow citizens to upload photos and descriptions of the animal's condition
4. Enable shelters to quickly accept or reject rescue requests
5. Allow shelters to track and update the treatment progress of rescued animals
6. Provide a centralized adoption portal for recovered animals
7. Facilitate real-time communication between all stakeholders

The FaunaRescue platform aims to address all these needs using modern web technologies.

### 1.3 Objectives of the Project

The main objectives of the FaunaRescue project are:
1. To develop a user-friendly web application for reporting injured stray animals
2. To implement a GPS-based system to automatically notify nearby verified shelters
3. To create a dashboard for shelters to manage rescue requests and track treatment progress
4. To develop an adoption portal for recovered animals
5. To implement real-time notifications using Socket.io
6. To ensure secure user authentication and role-based access control
7. To provide an admin panel for platform management

### 1.4 Scope of the Project

The scope of the FaunaRescue project includes:
1. A responsive web application accessible from desktop and mobile devices
2. Three user roles: Citizen User, Shelter Owner, and Administrator
3. Real-time reporting and rescue request management
4. Treatment progress tracking with photo updates
5. Adoption application and management system
6. Admin panel for shelter verification and platform management
7. Local file upload using Multer

The project does not include:
1. A dedicated mobile app (though the web app is responsive)
2. Integration with external veterinary services
3. Payment processing for donations
4. Integration with government animal welfare databases

### 1.5 Organization of the Report

This report is organized into five chapters:
- Chapter 1: Introduction - Provides background, need, objectives, and scope of the project
- Chapter 2: Field of Training - Details the technologies used in the project
- Chapter 3: Training Work Undertaken - Describes the project development lifecycle
- Chapter 4: Results and Discussions - Presents the results, testing, and deployment
- Chapter 5: Conclusion - Summarizes the project and discusses future scope

---

## CHAPTER 2: FIELD OF TRAINING

### 2.1 Overview of Web Development

Web development is the process of building and maintaining websites and web applications. It can be divided into two main categories: frontend development and backend development.

**Frontend Development**: This involves creating the user interface (UI) and user experience (UX) of a web application. Frontend developers use technologies like HTML, CSS, and JavaScript to build the part of the application that users interact with directly in their web browsers.

**Backend Development**: This involves creating the server-side logic, database, and APIs that power the frontend. Backend developers use technologies like Node.js, Python, Ruby, Java, or PHP to build the backend of a web application.

Modern web applications often follow a client-server architecture, where the frontend (client) runs in the web browser and communicates with the backend (server) via HTTP or HTTPS requests.

### 2.2 Frontend Technologies

#### 2.2.1 React

React is a JavaScript library for building user interfaces, developed and maintained by Facebook. It allows developers to create reusable UI components, which makes building complex UIs easier and more efficient.

**Key Features of React**:
1. **Component-Based Architecture**: React applications are built using components, which are reusable pieces of UI.
2. **Virtual DOM**: React uses a virtual DOM to efficiently update the actual DOM, which improves performance.
3. **JSX**: JSX is a syntax extension for JavaScript that allows developers to write HTML-like code in their JavaScript files.
4. **State Management**: React provides built-in state management using the `useState` hook, and can also integrate with external state management libraries like Redux.
5. **Hooks**: React hooks allow developers to use state and other React features in functional components.

**Figure 2.1: React Component Lifecycle**

```
Mounting:
  constructor() → getDerivedStateFromProps() → render() → componentDidMount()

Updating:
  getDerivedStateFromProps() → shouldComponentUpdate() → render() → 
  getSnapshotBeforeUpdate() → componentDidUpdate()

Unmounting:
  componentWillUnmount()
```

#### 2.2.2 Vite

Vite is a modern build tool that provides a fast development experience for web projects. It was created by Evan You, the creator of Vue.js.

**Key Features of Vite**:
1. **Fast Cold Start**: Vite uses native ES modules to provide a fast cold start.
2. **Instant Hot Module Replacement (HMR)**: Vite updates modules in the browser instantly when changes are made.
3. **Rich Feature Support**: Vite supports TypeScript, JSX, CSS preprocessors, and more out of the box.
4. **Optimized Build**: Vite uses Rollup for optimized production builds.

#### 2.2.3 React Router DOM

React Router DOM is a routing library for React applications. It allows developers to create single-page applications (SPAs) with multiple pages or views, without reloading the entire page.

**Key Features of React Router DOM**:
1. **Declarative Routing**: Routes are defined using JSX components.
2. **Dynamic Routing**: Routes can be dynamic, with parameters that change based on the URL.
3. **Nested Routes**: Routes can be nested, creating a hierarchy of pages.
4. **Programmatic Navigation**: Developers can navigate programmatically using the `useNavigate` hook.

#### 2.2.4 Lucide React

Lucide React is a library of open-source icons for React. It provides a set of consistent, customizable icons that can be easily integrated into React applications.

#### 2.2.5 CSS and UI Design

The FaunaRescue platform uses a custom CSS design system with a dark theme and glassmorphism effects. Glassmorphism is a design trend that uses semi-transparent backgrounds, blur effects, and subtle borders to create a modern, sleek look.

**Table 2.1: Technology Stack Summary**

| Layer | Technology |
|-------|------------|
| Frontend Framework | React |
| Build Tool | Vite |
| Routing | React Router DOM |
| Icons | Lucide React |
| Backend Runtime | Node.js |
| Backend Framework | Express.js |
| Real-Time Communication | Socket.io |
| Database | Firebase Firestore |
| Authentication | Firebase Auth |
| File Upload | Multer |

**Table 2.2: Comparison of Frontend Frameworks**

| Framework | Pros | Cons |
|-----------|------|------|
| React | Large ecosystem, reusable components, virtual DOM | Steeper learning curve, requires additional tools |
| Vue.js | Easy to learn, good documentation | Smaller ecosystem compared to React |
| Angular | Complete framework, good for large apps | Steep learning curve, complex |

### 2.3 Backend Technologies

#### 2.3.1 Node.js

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to run JavaScript on the server side, outside of a web browser.

**Key Features of Node.js**:
1. **Event-Driven Architecture**: Node.js uses an event-driven, non-blocking I/O model, which makes it efficient and scalable.
2. **Single-Threaded**: Node.js is single-threaded, but it uses the libuv library to handle asynchronous operations in the background.
3. **NPM**: Node.js comes with npm (Node Package Manager), which is a large repository of open-source packages.

**Figure 2.2: Node.js Event Loop**

```
┌───────────────────────────┐
│   Timers (setTimeout)     │
├───────────────────────────┤
│   Pending Callbacks       │
├───────────────────────────┤
│   Idle/Prepare            │
├───────────────────────────┤
│   Poll (I/O events)       │
├───────────────────────────┤
│   Check (setImmediate)    │
├───────────────────────────┤
│   Close Callbacks         │
└───────────────────────────┘
```

#### 2.3.2 Express.js

Express.js is a minimal and flexible Node.js web application framework. It provides a robust set of features for building web and mobile applications.

**Key Features of Express.js**:
1. **Routing**: Express provides a simple way to define routes for different HTTP methods and URLs.
2. **Middleware**: Express uses middleware to modify incoming requests and outgoing responses.
3. **Template Engines**: Express supports template engines like Pug, EJS, and Handlebars.
4. **Error Handling**: Express provides a built-in error handling mechanism.

#### 2.3.3 Middleware in Express

Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application's request-response cycle.

**Types of Middleware in Express**:
1. **Application-Level Middleware**: Middleware that is bound to the entire application.
2. **Router-Level Middleware**: Middleware that is bound to a specific router.
3. **Error-Handling Middleware**: Middleware that handles errors.
4. **Built-in Middleware**: Middleware that comes with Express, like `express.json()` and `express.static()`.
5. **Third-Party Middleware**: Middleware from third-party libraries, like `cors` and `multer`.

**Table 2.3: Comparison of Backend Frameworks**

| Framework | Pros | Cons |
|-----------|------|------|
| Express.js | Minimal, flexible, large ecosystem | Unopinionated, requires more setup |
| Django | Batteries included, ORM, admin panel | Steeper learning curve, Python-based |
| Ruby on Rails | Convention over configuration, rapid development | Less flexible, Ruby-based |

### 2.4 Real-Time Communication

#### 2.4.1 Socket.io

Socket.io is a library that enables real-time, bidirectional, and event-based communication between the browser and the server. It consists of two parts: a client-side library that runs in the browser, and a server-side library for Node.js.

**Key Features of Socket.io**:
1. **Real-Time Communication**: Socket.io allows real-time data transfer between client and server.
2. **Bidirectional Communication**: Both client and server can send messages to each other at any time.
3. **Fallback Mechanisms**: Socket.io automatically falls back to older protocols like long polling if WebSockets are not available.
4. **Rooms**: Socket.io supports rooms, which allow messages to be sent to a specific group of clients.

**Figure 2.3: Socket.io Communication Flow**

```
Client 1 ──┐
           ├──> Socket.io Server ──> Client 2
Client 3 ──┘
```

### 2.5 Database and Authentication

#### 2.5.1 Firebase Firestore

Firebase Firestore is a flexible, scalable NoSQL database for mobile, web, and server development from Firebase and Google Cloud Platform.

**Key Features of Firestore**:
1. **NoSQL Database**: Firestore is a NoSQL document database, which means it stores data in documents and collections.
2. **Real-Time Updates**: Firestore provides real-time updates, so clients can listen for changes to data.
3. **Offline Support**: Firestore supports offline access, so apps can work even when there is no internet connection.
4. **Scalability**: Firestore is designed to scale automatically with your application.

**Firestore Data Model**:
- **Collections**: Collections are containers for documents.
- **Documents**: Documents are the basic unit of data in Firestore. They contain key-value pairs.
- **Subcollections**: Documents can contain subcollections.

#### 2.5.2 Firebase Auth

Firebase Auth is a service that can authenticate users to your app. It supports authentication using passwords, phone numbers, and popular federated identity providers like Google, Facebook, and Twitter.

**Key Features of Firebase Auth**:
1. **Multiple Authentication Methods**: Email/password, phone, Google, Facebook, etc.
2. **Secure Authentication**: Firebase Auth handles the security of user authentication.
3. **User Management**: Firebase Auth provides APIs for managing users.

**Table 2.4: Comparison of Databases**

| Database | Type | Pros | Cons |
|----------|------|------|------|
| Firestore | NoSQL | Real-time updates, scalable, offline support | NoSQL, can be expensive at scale |
| MongoDB | NoSQL | Flexible, scalable, large ecosystem | NoSQL, requires more setup |
| PostgreSQL | SQL | ACID compliance, relational, mature | Less flexible for unstructured data |

**Figure 2.4: Firebase Firestore Data Model**

```
users (collection)
  ├── uid1 (document)
  │     ├── name: "John Doe"
  │     ├── email: "john@example.com"
  │     ├── role: "user"
  │     └── ...
  └── uid2 (document)
        └── ...

shelters (collection)
  ├── shelter1 (document)
  │     ├── shelterName: "Paws & Claws"
  │     ├── location: GeoPoint
  │     └── ...
  └── ...

animals (collection)
  ├── animal1 (document)
  │     ├── category: "Dog"
  │     ├── healthStatus: "Under Treatment"
  │     └── ...
  └── ...

rescueRequests (collection)
  ├── rescue1 (document)
  │     ├── animalId: "animal1"
  │     ├── status: "Rescue Accepted"
  │     └── ...
  └── ...
```

### 2.6 File Upload Handling

#### 2.6.1 Multer

Multer is a middleware for Express.js that handles file uploads. It is designed to work with `multipart/form-data` form data.

**Key Features of Multer**:
1. **File Upload Handling**: Multer makes it easy to handle file uploads.
2. **Custom Storage**: Multer allows custom storage engines to be used.
3. **File Filtering**: Multer can filter files based on type or other criteria.

---

## CHAPTER 3: TRAINING WORK UNDERTAKEN

### 3.1 Project Overview

FaunaRescue is a complete stray animal rescue and adoption platform with three main user roles:
1. **Citizen User**: Can report injured animals, track the status of their reports, and apply for adoptions.
2. **Shelter Owner**: Can view nearby rescue requests, accept or reject them, update treatment progress, and manage adoptions.
3. **Administrator**: Can verify shelters, manage users, and view platform analytics.

**Table 3.1: User Roles and Capabilities**

| Role | Capabilities |
|------|--------------|
| User | Register/Login, Report injured animals, Track report status, Browse adoptable animals, Apply for adoptions, Manage profile |
| Shelter | Register/Login, View nearby rescue requests, Accept/reject requests, Update treatment progress, Upload photos, Manage adoption applications, Manage profile |
| Admin | Register/Login, Approve/reject shelters, Manage users, View platform analytics, Manage notifications |

### 3.2 Requirements Analysis

#### 3.2.1 Functional Requirements

The functional requirements of the FaunaRescue platform are:

**User Module**:
1. User registration (email/password and Google)
2. User login
3. Report injured animal with photos and GPS coordinates
4. View and track status of own reports
5. Browse adoptable animals
6. Apply for adoption
7. View and update profile

**Shelter Module**:
1. Shelter registration
2. Shelter login
3. View nearby rescue requests
4. Accept or reject rescue requests
5. Update treatment progress with photos
6. Manage adoption applications
7. View and update profile

**Admin Module**:
1. Admin registration (with secret key)
2. Admin login
3. Approve/reject shelter registrations
4. View platform analytics
5. Manage users and shelters
6. View all reports and adoptions

**Real-Time Features**:
1. Real-time notification of new rescue requests to nearby shelters
2. Real-time notification of rescue status updates to reporters
3. Real-time notification of adoption application updates

#### 3.2.2 Non-Functional Requirements

The non-functional requirements of the FaunaRescue platform are:
1. **Performance**: The platform should be responsive and load quickly.
2. **Scalability**: The platform should be able to handle a large number of users and requests.
3. **Security**: User data should be secure, and authentication should be robust.
4. **Usability**: The platform should be easy to use for all user roles.
5. **Availability**: The platform should be available 24/7 with minimal downtime.

### 3.3 System Design

#### 3.3.1 Architecture Design

The FaunaRescue platform follows a 3-tier architecture:
1. **Presentation Tier (Frontend)**: React application running in the web browser.
2. **Application Tier (Backend)**: Node.js + Express.js server.
3. **Data Tier (Database)**: Firebase Firestore.

**Figure 3.1: System Architecture Diagram**

```
┌─────────────────────────────────────────────────────────┐
│                     Presentation Tier                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Landing    │  │   User Dash  │  │  Shelter Dash│  │
│  │    Page      │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Login      │  │   Admin Dash │  │   Adoptions   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/Socket.io
                       │
┌──────────────────────▼──────────────────────────────────┐
│                    Application Tier                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Express.js Server                     │  │
│  ├───────────────────────────────────────────────────┤  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐          │  │
│  │  │  Auth    │ │  Animal  │ │  Rescue  │          │  │
│  │  │  Routes  │ │  Routes  │ │  Routes  │          │  │
│  │  └──────────┘ └──────────┘ └──────────┘          │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐          │  │
│  │  │ Adoption │ │  Shelter │ │  Admin   │          │  │
│  │  │  Routes  │ │  Routes  │ │  Routes  │          │  │
│  │  └──────────┘ └──────────┘ └──────────┘          │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Socket.io Server                      │  │
│  └───────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                       Data Tier                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Firebase Firestore                    │  │
│  ├──────────┬──────────┬──────────┬──────────┬───────┤  │
│  │  Users   │ Shelters │ Animals  │ Rescue   │Adoption│  │
│  └──────────┴──────────┴──────────┴──────────┴───────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Firebase Auth                          │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### 3.3.2 Database Design

The Firebase Firestore database for FaunaRescue consists of the following collections:

**Table 3.3: Firestore Collections Structure**

| Collection | Document Fields |
|------------|-----------------|
| users | id, name, email, phone, role, profilePhoto, firebaseUid, createdAt |
| shelters | id, userId, shelterName, licenseNumber, address, location (GeoPoint), radiusPreferenceKm, status, createdAt |
| animals | id, category, description, healthStatus, photos, location (GeoPoint), reportedBy, assignedShelter, createdAt |
| rescueRequests | id, animalId, reporterId, assignedShelterId, status, rejectedBy (array), logs (array), createdAt, updatedAt |
| adoptionRequests | id, animalId, userId, shelterId, status, message, contactPhone, createdAt |
| notifications | id, recipientId, title, message, type, relatedId, isRead, createdAt |

**Figure 3.2: Database ER Diagram**

```
users ──┬──> shelters (one-to-one)
        │
        ├──> animals (one-to-many)
        │
        ├──> rescueRequests (one-to-many as reporter)
        │
        ├──> adoptionRequests (one-to-many as applicant)
        │
        └──> notifications (one-to-many)

shelters ──┬──> rescueRequests (one-to-many as assigned shelter)
           │
           ├──> animals (one-to-many as assigned shelter)
           │
           └──> adoptionRequests (one-to-many as managing shelter)

animals ──┬──> rescueRequests (one-to-one)
          │
          └──> adoptionRequests (one-to-many)
```

#### 3.3.3 API Design

The backend API is designed using RESTful principles. The following table summarizes the main API endpoints:

**Table 3.2: API Endpoints Summary**

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| /api/auth/register | POST | Register a new user | No |
| /api/auth/register-shelter | POST | Register a new shelter | No |
| /api/auth/register-admin | POST | Register a new admin | No |
| /api/auth/login | POST | User login | No |
| /api/auth/me | GET | Get current user details | Yes |
| /api/auth/update | PUT | Update user profile | Yes |
| /api/animals/report | POST | Report an injured animal | Yes (user) |
| /api/animals | GET | Get all animals | No |
| /api/animals/adoptable | GET | Get adoptable animals | No |
| /api/animals/:id | GET | Get animal by ID | No |
| /api/animals/my-reports | GET | Get user's reported animals | Yes (user) |
| /api/rescues/incoming | GET | Get incoming rescue requests | Yes (shelter) |
| /api/rescues/active | GET | Get active rescue requests | Yes (shelter) |
| /api/rescues/:id/accept | PUT | Accept a rescue request | Yes (shelter) |
| /api/rescues/:id/reject | PUT | Reject a rescue request | Yes (shelter) |
| /api/rescues/:id/update-status | PUT | Update rescue status | Yes (shelter) |
| /api/rescues/my-history | GET | Get user's rescue history | Yes (user) |
| /api/adoptions/apply | POST | Apply for adoption | Yes (user) |
| /api/adoptions/my-applications | GET | Get user's adoption applications | Yes (user) |
| /api/adoptions/manage | GET | Get shelter's adoption applications | Yes (shelter) |
| /api/adoptions/:id/approve | PUT | Approve adoption application | Yes (shelter) |
| /api/adoptions/:id/reject | PUT | Reject adoption application | Yes (shelter) |
| /api/shelters/pending | GET | Get pending shelters | Yes (admin) |
| /api/shelters/:id/approve | PUT | Approve shelter | Yes (admin) |
| /api/shelters/:id/reject | PUT | Reject shelter | Yes (admin) |
| /api/notifications | GET | Get user's notifications | Yes |
| /api/notifications/:id/read | PUT | Mark notification as read | Yes |

**Figure 3.3: API Flow Diagram**

```
Client Request
    │
    ▼
Express Router
    │
    ▼
Middleware (Authentication, Upload)
    │
    ▼
Controller
    │
    ▼
Firebase Firestore
    │
    ▼
Response to Client
```

#### 3.3.4 UI/UX Design

The UI/UX of the FaunaRescue platform is designed to be simple, intuitive, and accessible. The design uses a dark theme with glassmorphism effects for a modern look.

**Figure 3.4: User Dashboard Wireframe**

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]  FaunaRescue          [Profile] [Notifications] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Report Injured Animal                            │ │
│  ├───────────────────────────────────────────────────┤ │
│  │  [Interactive Map]                                │ │
│  │                                                   │ │
│  │  Category: [Dropdown]    Description: [Textarea]  │ │
│  │  Photos: [File Upload]    [Submit Report Button]  │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  My Reports                                        │ │
│  ├───────────────────────────────────────────────────┤ │
│  │  [Report 1] Dog - Golden Gate Park - Under Treat  │ │
│  │  [Report 2] Cat - Downtown - Reported             │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Figure 3.5: Shelter Dashboard Wireframe**

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]  FaunaRescue          [Profile] [Notifications] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Incoming │ │  Active  │ │Adoptions │ │  Upload  │  │
│  │ Rescues  │ │ Rescues  │ │          │ │  Animal  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Incoming Rescue Requests (1.2 km away)           │ │
│  ├───────────────────────────────────────────────────┤ │
│  │  [Dog] - Golden Gate Park - [Accept] [Reject]     │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Figure 3.6: Admin Dashboard Wireframe**

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]  FaunaRescue          [Profile] [Notifications] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Pending │ │  Users   │ │ Shelters │ │Analytics │  │
│  │ Shelters │ │          │ │          │ │          │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Pending Shelter Registrations                     │ │
│  ├───────────────────────────────────────────────────┤ │
│  │  Safe Haven Rescue - [Approve] [Reject]           │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 3.4 Implementation Details

#### 3.4.1 Backend Implementation

##### 3.4.1.1 Server Setup

The backend server is set up using Node.js and Express.js. The server listens on port 5000 (or the port specified in the environment variables).

```javascript
// backend/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { initSocket } = require('./config/socket');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/shelters', require('./routes/shelterRoutes'));
app.use('/api/animals', require('./routes/animalRoutes'));
app.use('/api/rescues', require('./routes/rescueRoutes'));
app.use('/api/adoptions', require('./routes/adoptionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Animal Rehabilitation & Adoption Platform API is running.' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File is too large! Maximum limit is 5MB.' });
  }
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
```

##### 3.4.1.2 Firebase Configuration

Firebase is configured using the Firebase Admin SDK. The configuration is loaded from environment variables.

```javascript
// backend/config/firebase.js
let admin = null;
let db = null;
let auth = null;

try {
  admin = require('firebase-admin');
  const { getFirestore } = require('firebase-admin/firestore');
  const { getAuth } = require('firebase-admin/auth');

  const isInitialized = admin.getApps && admin.getApps().length > 0;

  if (!isInitialized) {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PROJECT_ID !== 'your-firebase-project-id') {
      // Initialize with service account
      admin.initializeApp({
        credential: admin.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
      console.log('Firebase initialized with service account');
    } else {
      // Initialize in demo mode (without service account)
      process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
      admin.initializeApp({ projectId: 'demo-faunarescue' });
      console.log('Firebase initialized in demo/emulator mode');
    }
  }

  db = getFirestore();
  auth = getAuth();
  console.log('Firestore and Auth ready');
} catch (error) {
  console.error('Firebase setup error:', error.message);
}

module.exports = { admin, db, auth };
```

A helper file is created to provide easy access to Firestore collections and utility functions:

```javascript
// backend/config/collections.js
const { db } = require('./firebase');

const Timestamp = () => new Date().toISOString();
const FieldValue = {
  serverTimestamp: () => new Date().toISOString(),
  delete: () => 'DELETE_FIELD'
};

const collections = {
  users: db?.collection('users'),
  shelters: db?.collection('shelters'),
  admins: db?.collection('admins'),
  animals: db?.collection('animals'),
  rescueRequests: db?.collection('rescueRequests'),
  adoptionRequests: db?.collection('adoptionRequests'),
  notifications: db?.collection('notifications')
};

const toDoc = (snap) => {
  if (!snap || !snap.exists) return null;
  return { id: snap.id, ...snap.data() };
};

const toDocs = (snapshot) => {
  if (!snapshot || !snapshot.docs) return [];
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getDocById = async (collectionRef, id) => {
  if (!collectionRef) return null;
  try {
    const snap = await collectionRef.doc(id).get();
    return toDoc(snap);
  } catch (e) {
    console.error('getDocById error:', e.message);
    return null;
  }
};

const deleteDocById = async (collectionRef, id) => {
  if (!collectionRef) return;
  try {
    await collectionRef.doc(id).delete();
  } catch (e) {
    console.error('deleteDocById error:', e.message);
  }
};

const updateDoc = async (collectionRef, id, data) => {
  if (!collectionRef) throw new Error('Collection not initialized');
  await collectionRef.doc(id).update({ ...data, updatedAt: Timestamp() });
};

const setDoc = async (collectionRef, id, data) => {
  if (!collectionRef) throw new Error('Collection not initialized');
  await collectionRef.doc(id).set({ ...data, createdAt: Timestamp(), updatedAt: Timestamp() });
};

const addDoc = async (collectionRef, data) => {
  if (!collectionRef) throw new Error('Collection not initialized');
  const docRef = await collectionRef.add({ ...data, createdAt: Timestamp(), updatedAt: Timestamp() });
  const snap = await docRef.get();
  return toDoc(snap);
};

const queryDocs = async (collectionRef, field, operator, value, orderByField = null, orderDirection = 'asc', limitCount = null) => {
  if (!collectionRef) return [];
  try {
    let query = collectionRef.where(field, operator, value);
    if (orderByField) query = query.orderBy(orderByField, orderDirection);
    if (limitCount) query = query.limit(limitCount);
    const snapshot = await query.get();
    return toDocs(snapshot);
  } catch (e) {
    console.error('queryDocs error:', e.message);
    return [];
  }
};

module.exports = {
  db,
  Timestamp,
  FieldValue,
  collections,
  toDoc,
  toDocs,
  getDocById,
  deleteDocById,
  updateDoc,
  setDoc,
  addDoc,
  queryDocs
};
```

##### 3.4.1.3 Socket.io Setup

Socket.io is set up to handle real-time communication between the client and server.

```javascript
// backend/config/socket.js
const { Server } = require('socket.io');

let io = null;
const onlineUsers = new Map(); // userId -> array of socketIds

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // Adjust for production environments
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    }
  });

  io.on('connection', (socket) => {
    console.log(`New socket connection: ${socket.id}`);

    // Join room based on user role or custom room
    socket.on('join', (data) => {
      if (!data || !data.userId) return;
      const { userId, role, shelterId } = data;
      
      // Store in online mapping
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, []);
      }
      onlineUsers.get(userId).push(socket.id);

      // Join individual user room
      socket.join(`user_${userId}`);
      console.log(`Socket ${socket.id} joined room user_${userId}`);

      // Join role specific rooms
      if (role === 'admin') {
        socket.join('admins');
        console.log(`Socket ${socket.id} joined room admins`);
      } else if (role === 'shelter' && shelterId) {
        socket.join(`shelter_${shelterId}`);
        socket.join('shelters');
        console.log(`Socket ${socket.id} joined rooms shelter_${shelterId} and shelters`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      // Clean up mapping
      for (const [userId, sockets] of onlineUsers.entries()) {
        const index = sockets.indexOf(socket.id);
        if (index !== -1) {
          sockets.splice(index, 1);
          if (sockets.length === 0) {
            onlineUsers.delete(userId);
          }
          break;
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

const sendToUser = (userId, event, data) => {
  if (io) {
    io.to(`user_${userId}`).emit(event, data);
  }
};

const sendToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  sendToUser,
  sendToRoom
};
```

##### 3.4.1.4 Authentication Controller

The authentication controller handles user registration, login, and profile management.

```javascript
// backend/controllers/authController.js
const { auth: firebaseAuth } = require('../config/firebase');
const { collections, queryDocs, getDocById, updateDoc } = require('../config/collections');
const https = require('https');

// Helper function to sign in with password using Firebase REST API
const firebaseSignInWithPassword = (email, password) => {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.FIREBASE_API_KEY;
    const data = JSON.stringify({ email, password, returnSecureToken: true });

    const options = {
      hostname: 'identitytoolkit.googleapis.com',
      path: `/v1/accounts:signInWithPassword?key=${apiKey}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('Failed to parse Firebase response'));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if email already exists
    const existingUsers = await queryDocs(collections.users, 'email', '==', email);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create user in Firebase Auth
    const userRecord = await firebaseAuth.createUser({
      email,
      password,
      displayName: name
    });

    // Create user in Firestore
    const userData = {
      name,
      email,
      phone,
      role: 'user',
      profilePhoto: '',
      firebaseUid: userRecord.uid,
      createdAt: new Date().toISOString()
    };
    await collections.users.doc(userRecord.uid).set(userData);

    // Sign in the user to get token
    const firebaseResult = await firebaseSignInWithPassword(email, password);
    const idToken = firebaseResult.idToken;

    res.status(201).json({
      success: true,
      token: idToken,
      user: { id: userRecord.uid, name, email, phone, role: 'user' }
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerShelter = async (req, res) => {
  try {
    const { name, email, password, phone, shelterName, licenseNumber, address, longitude, latitude, radiusPreferenceKm } = req.body;

    // Check if email already exists
    const existingUsers = await queryDocs(collections.users, 'email', '==', email);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Check if license number already exists
    const existingLicenses = await queryDocs(collections.shelters, 'licenseNumber', '==', licenseNumber);
    if (existingLicenses.length > 0) {
      return res.status(400).json({ success: false, message: 'License number already registered' });
    }

    // Create user in Firebase Auth
    const userRecord = await firebaseAuth.createUser({
      email,
      password,
      displayName: name
    });

    // Create user in Firestore
    const userData = {
      name,
      email,
      phone,
      role: 'shelter',
      profilePhoto: '',
      firebaseUid: userRecord.uid,
      createdAt: new Date().toISOString()
    };
    await collections.users.doc(userRecord.uid).set(userData);

    // Create shelter in Firestore
    const shelterData = {
      userId: userRecord.uid,
      shelterName,
      licenseNumber,
      address,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      radiusPreferenceKm: radiusPreferenceKm ? parseInt(radiusPreferenceKm) : 10,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    const shelterRef = await collections.shelters.add(shelterData);

    // Sign in the user to get token
    const firebaseResult = await firebaseSignInWithPassword(email, password);
    const idToken = firebaseResult.idToken;

    res.status(201).json({
      success: true,
      token: idToken,
      user: {
        id: userRecord.uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        shelter: {
          id: shelterRef.id,
          shelterName,
          licenseNumber,
          address,
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
          status: 'Pending',
          radiusPreferenceKm: shelterData.radiusPreferenceKm
        }
      }
    });
  } catch (error) {
    console.error('Shelter register error:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, secretKey, adminCode } = req.body;

    // Verify admin secret key
    if (secretKey !== process.env.ADMIN_REGISTRATION_SECRET) {
      return res.status(403).json({ success: false, message: 'Invalid admin registration secret key' });
    }

    // Check if email already exists
    const existingUsers = await queryDocs(collections.users, 'email', '==', email);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Check if admin code already exists
    const existingCodes = await queryDocs(collections.admins, 'adminCode', '==', adminCode);
    if (existingCodes.length > 0) {
      return res.status(400).json({ success: false, message: 'Admin code already exists' });
    }

    // Create user in Firebase Auth
    const userRecord = await firebaseAuth.createUser({
      email,
      password,
      displayName: name
    });

    // Create user in Firestore
    const userData = {
      name,
      email,
      phone,
      role: 'admin',
      profilePhoto: '',
      firebaseUid: userRecord.uid,
      createdAt: new Date().toISOString()
    };
    await collections.users.doc(userRecord.uid).set(userData);

    // Create admin in Firestore
    const adminData = {
      userId: userRecord.uid,
      adminCode,
      createdAt: new Date().toISOString()
    };
    await collections.admins.add(adminData);

    // Sign in the user to get token
    const firebaseResult = await firebaseSignInWithPassword(email, password);
    const idToken = firebaseResult.idToken;

    res.status(201).json({
      success: true,
      token: idToken,
      user: {
        id: userRecord.uid,
        name,
        email,
        phone,
        role: 'admin',
        adminCode
      }
    });
  } catch (error) {
    console.error('Admin register error:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Sign in with Firebase
    const firebaseResult = await firebaseSignInWithPassword(email, password);

    if (firebaseResult.error) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const idToken = firebaseResult.idToken;
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Get user from Firestore
    const users = await queryDocs(collections.users, 'firebaseUid', '==', uid);
    let user;
    if (users.length > 0) {
      user = users[0];
    } else {
      // Try to find by email
      const userByEmail = await queryDocs(collections.users, 'email', '==', email);
      if (userByEmail.length > 0) {
        user = userByEmail[0];
        // Update firebaseUid if missing
        await collections.users.doc(user.id).update({ firebaseUid: uid });
      } else {
        return res.status(401).json({ success: false, message: 'User not found in database' });
      }
    }

    // Get role-specific data
    let roleData = {};
    if (user.role === 'shelter') {
      const shelters = await queryDocs(collections.shelters, 'userId', '==', user.id);
      if (shelters.length > 0) {
        const shelter = shelters[0];
        roleData.shelter = {
          id: shelter.id,
          shelterName: shelter.shelterName,
          licenseNumber: shelter.licenseNumber,
          address: shelter.address,
          coordinates: shelter.location?.coordinates,
          status: shelter.status,
          radiusPreferenceKm: shelter.radiusPreferenceKm
        };
      }
    } else if (user.role === 'admin') {
      const admins = await queryDocs(collections.admins, 'userId', '==', user.id);
      if (admins.length > 0) {
        roleData.adminCode = admins[0].adminCode;
      }
    }

    res.status(200).json({
      success: true,
      token: idToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhoto: user.profilePhoto || '',
        ...roleData
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userSnap = await collections.users.doc(req.user.id).get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const user = { id: userSnap.id, ...userSnap.data() };

    // Get role-specific data
    let roleData = {};
    if (user.role === 'shelter') {
      const shelters = await queryDocs(collections.shelters, 'userId', '==', req.user.id);
      if (shelters.length > 0) {
        const shelter = shelters[0];
        roleData.shelter = {
          id: shelter.id,
          shelterName: shelter.shelterName,
          licenseNumber: shelter.licenseNumber,
          address: shelter.address,
          coordinates: shelter.location?.coordinates,
          status: shelter.status,
          radiusPreferenceKm: shelter.radiusPreferenceKm
        };
      }
    } else if (user.role === 'admin') {
      const admins = await queryDocs(collections.admins, 'userId', '==', req.user.id);
      if (admins.length > 0) {
        roleData.adminCode = admins[0].adminCode;
      }
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhoto: user.profilePhoto || '',
        ...roleData
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, shelterName, address, radiusPreferenceKm } = req.body;
    const userId = req.user.id;

    // Update user data
    const userFields = {};
    if (name) userFields.name = name;
    if (phone) userFields.phone = phone;
    if (req.file) {
      userFields.profilePhoto = req.file.path;
    }

    if (Object.keys(userFields).length > 0) {
      await collections.users.doc(userId).update(userFields);
    }

    // Get updated user
    const userSnap = await collections.users.doc(userId).get();
    const updatedUser = { id: userSnap.id, ...userSnap.data() };

    // Update shelter data if needed
    let updatedShelter = null;
    if (updatedUser.role === 'shelter') {
      const shelterFields = {};
      if (shelterName) shelterFields.shelterName = shelterName;
      if (address) shelterFields.address = address;
      if (radiusPreferenceKm) shelterFields.radiusPreferenceKm = parseInt(radiusPreferenceKm);

      if (Object.keys(shelterFields).length > 0) {
        const shelters = await queryDocs(collections.shelters, 'userId', '==', userId);
        if (shelters.length > 0) {
          await collections.shelters.doc(shelters[0].id).update(shelterFields);
          updatedShelter = { ...shelters[0], ...shelterFields };
        }
      }
    }

    res.status(200).json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        profilePhoto: updatedUser.profilePhoto || '',
        shelter: updatedShelter ? {
          id: updatedShelter.id,
          shelterName: updatedShelter.shelterName,
          licenseNumber: updatedShelter.licenseNumber,
          address: updatedShelter.address,
          coordinates: updatedShelter.location?.coordinates,
          status: updatedShelter.status,
          radiusPreferenceKm: updatedShelter.radiusPreferenceKm
        } : undefined
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
```

##### 3.4.1.5 Middleware Implementation

The authentication middleware protects routes by verifying the Firebase ID token.

```javascript
// backend/middleware/authMiddleware.js
const { auth } = require('../config/firebase');
const { collections, getDocById, toDoc, queryDocs } = require('../config/collections');

const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Get user from Firestore
    const userSnap = await collections.users.doc(uid).get();
    const user = toDoc(userSnap);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Attach user to request
    req.user = { ...user, _id: uid, id: uid };
    req.userId = uid;

    // Attach shelter to request if user is a shelter
    if (user.role === 'shelter') {
      const shelters = await queryDocs(collections.shelters, 'userId', '==', uid);
      req.shelter = shelters.length > 0 ? { ...shelters[0], _id: shelters[0].id } : null;
    }

    // Attach admin to request if user is an admin
    if (user.role === 'admin') {
      const admins = await queryDocs(collections.admins, 'userId', '==', uid);
      req.admin = admins.length > 0 ? { ...admins[0], _id: admins[0].id } : null;
    }

    next();
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
```

The upload middleware handles file uploads using Multer.

```javascript
// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

module.exports = upload;
```

##### 3.4.1.6 Animal Controller

The animal controller handles reporting animals, retrieving animals, and uploading animals for adoption.

```javascript
// backend/controllers/animalController.js
const { collections, addDoc, getDocById, queryDocs, toDocs, Timestamp } = require('../config/collections');
const { sendToUser, sendToRoom } = require('../config/socket');

// Helper function to calculate distance between two points (Haversine formula)
const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};

exports.reportAnimal = async (req, res) => {
  try {
    const { category, description, longitude, latitude } = req.body;

    if (!category || !description || !longitude || !latitude) {
      return res.status(400).json({ success: false, message: 'Please provide category, description, and GPS coordinates' });
    }

    const lng = parseFloat(longitude);
    const lat = parseFloat(latitude);

    // Prepare photos
    const photos = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        photos.push(file.path || `/uploads/${file.filename}`);
      });
    }

    // Create animal in Firestore
    const animalData = {
      category,
      description,
      healthStatus: 'Reported',
      photos,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      reportedBy: req.user.id,
      assignedShelter: null,
      createdAt: new Date().toISOString()
    };
    const animal = await addDoc(collections.animals, animalData);

    // Create rescue request
    const rescueLog = {
      status: 'Reported',
      timestamp: new Date().toISOString(),
      remarks: 'Injured animal reported in system',
      photo: photos[0] || null
    };

    const rescueData = {
      animalId: animal.id,
      reporterId: req.user.id,
      assignedShelterId: null,
      status: 'Reported',
      rejectedBy: [],
      logs: [rescueLog],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const rescueRequest = await addDoc(collections.rescueRequests, rescueData);

    // Find nearby approved shelters
    const approvedShelters = await queryDocs(collections.shelters, 'status', '==', 'Approved');
    const notifiedShelters = [];

    for (const shelter of approvedShelters) {
      if (!shelter.location || !shelter.location.coordinates) continue;

      const sLng = shelter.location.coordinates[0];
      const sLat = shelter.location.coordinates[1];
      const distance = getDistanceInKm(lat, lng, sLat, sLng);

      if (distance <= (shelter.radiusPreferenceKm || 10)) {
        notifiedShelters.push({
          shelterId: shelter.id,
          name: shelter.shelterName,
          distance
        });

        // Send notification to shelter
        if (shelter.userId) {
          const notificationData = {
            recipientId: shelter.userId,
            title: 'New Injured Animal Reported Nearby',
            message: `A ${category} is reported ${distance} km from your location. Needs assistance!`,
            type: 'Rescue',
            relatedId: rescueRequest.id,
            isRead: false,
            createdAt: new Date().toISOString()
          };
          const notification = await addDoc(collections.notifications, notificationData);

          // Send real-time notification via Socket.io
          sendToUser(shelter.userId.toString(), 'new_rescue_request', {
            notification: { id: notification.id, ...notificationData },
            rescueRequest: {
              ...rescueData,
              id: rescueRequest.id,
              animalId: { id: animal.id, ...animalData }
            },
            distance
          });
        }
      }
    }

    // Notify admins
    const adminNotif = {
      title: 'New Animal Report',
      message: `A new ${category} has been reported.`,
      relatedId: rescueRequest.id,
      type: 'Rescue'
    };
    sendToRoom('admins', 'new_rescue_report_admin', adminNotif);

    res.status(201).json({
      success: true,
      data: {
        animal,
        rescueRequest,
        notifiedShelters
      }
    });
  } catch (error) {
    console.error('Error reporting animal:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAnimals = async (req, res) => {
  try {
    const { status, category } = req.query;

    let allAnimals = await toDocs(await collections.animals.get());
    let filtered = allAnimals;

    if (status) {
      filtered = filtered.filter(a => a.healthStatus === status);
    }
    if (category) {
      filtered = filtered.filter(a => a.category === category);
    }

    // Get reporter and shelter details
    const result = await Promise.all(filtered.map(async (animal) => {
      let reportedBy = null;
      if (animal.reportedBy) {
        const u = await getDocById(collections.users, animal.reportedBy);
        if (u) reportedBy = { id: u.id, name: u.name, phone: u.phone, profilePhoto: u.profilePhoto };
      }
      let assignedShelter = null;
      if (animal.assignedShelter) {
        const s = await getDocById(collections.shelters, animal.assignedShelter);
        if (s) assignedShelter = { id: s.id, shelterName: s.shelterName, address: s.address, location: s.location };
      }
      return { id: animal.id, ...animal, reportedBy, assignedShelter };
    }));

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdoptableAnimals = async (req, res) => {
  try {
    const allAnimals = await toDocs(await collections.animals.get());
    const adoptable = allAnimals.filter(a => a.healthStatus === 'Available For Adoption');

    // Get reporter and shelter details
    const result = await Promise.all(adoptable.map(async (animal) => {
      let reportedBy = null;
      if (animal.reportedBy) {
        const u = await getDocById(collections.users, animal.reportedBy);
        if (u) reportedBy = { id: u.id, name: u.name, phone: u.phone };
      }
      let assignedShelter = null;
      if (animal.assignedShelter) {
        const s = await getDocById(collections.shelters, animal.assignedShelter);
        if (s) assignedShelter = { id: s.id, shelterName: s.shelterName, address: s.address, location: s.location };
      }
      return { id: animal.id, ...animal, reportedBy, assignedShelter };
    }));

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAnimalById = async (req, res) => {
  try {
    const animal = await getDocById(collections.animals, req.params.id);
    if (!animal) {
      return res.status(404).json({ success: false, message: 'Animal not found' });
    }

    // Get reporter and shelter details
    let reportedBy = null;
    if (animal.reportedBy) {
      const u = await getDocById(collections.users, animal.reportedBy);
      if (u) reportedBy = { id: u.id, name: u.name, email: u.email, phone: u.phone, profilePhoto: u.profilePhoto };
    }
    let assignedShelter = null;
    if (animal.assignedShelter) {
      const s = await getDocById(collections.shelters, animal.assignedShelter);
      if (s) assignedShelter = { id: s.id, shelterName: s.shelterName, address: s.address, location: s.location };
    }

    res.status(200).json({ success: true, data: { id: animal.id, ...animal, reportedBy, assignedShelter } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyReports = async (req, res) => {
  try {
    const allAnimals = await toDocs(await collections.animals.get());
    const myReports = allAnimals.filter(a => a.reportedBy === req.user.id);

    // Get shelter details
    const result = await Promise.all(myReports.map(async (animal) => {
      let assignedShelter = null;
      if (animal.assignedShelter) {
        const s = await getDocById(collections.shelters, animal.assignedShelter);
        if (s) assignedShelter = { id: s.id, shelterName: s.shelterName, address: s.address };
      }
      return { id: animal.id, ...animal, assignedShelter };
    }));

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadAnimalForAdoption = async (req, res) => {
  try {
    const { category, description, age, gender, name } = req.body;

    if (!category || !description) {
      return res.status(400).json({ success: false, message: 'Please provide category and description' });
    }

    // Prepare photos
    const photos = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        photos.push(file.path || `/uploads/${file.filename}`);
      });
    }

    // Get shelter
    const shelters = await queryDocs(collections.shelters, 'userId', '==', req.user.id);
    if (shelters.length === 0) {
      return res.status(400).json({ success: false, message: 'No shelter found for this user' });
    }
    const shelter = shelters[0];

    // Create animal
    const animalData = {
      category,
      description,
      name: name || category,
      age: age || null,
      gender: gender || null,
      healthStatus: 'Available For Adoption',
      photos,
      location: shelter.location,
      reportedBy: req.user.id,
      assignedShelter: shelter.id,
      createdAt: new Date().toISOString()
    };
    const animal = await addDoc(collections.animals, animalData);

    res.status(201).json({
      success: true,
      data: animal
    });
  } catch (error) {
    console.error('Error uploading animal:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
```

(Note: This report continues with additional chapters and sections, following the same detailed format.)
