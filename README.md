# XACML and SAML Role-Based Access Control System

This project implements a role-based access control system using XACML and SAML, integrated with WSO2 Server. The system consists of a client-side application built with React and a server-side application built with Node.js.

## Table of Contents
1. [Overview](#overview)
2. [Technologies Used](#technologies-used)
3. [Folder Structure](#folder-structure)
4. [Installation](#installation)
5. [Usage](#usage)

## Overview

This project demonstrates a robust and secure role-based access control system using XACML for policy management and SAML for authentication. It is designed to manage user access rights efficiently and securely, ensuring that users only have access to the resources they are authorized to use.

## Technologies Used

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Security & Access Control:** XACML, SAML, WSO2 Server
- **Languages:** JavaScript


## Folder Structure

### Client
```
📁client
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── 📁policy
├── 📁public
│ ├── favicon.ico
│ ├── index.html
│ └── manifest.json
├── README.md
├── 📁src
│ ├── App.css
│ ├── App.js
│ ├── 📁components
│ │ ├── AdminPanelButton.js
│ │ ├── Button.css
│ │ ├── Navbar.js
│ │ ├── UserPanelButton.js
│ ├── 📁context
│ │ └── UserContext.js
│ ├── 📁hooks
│ │ ├── useAuth.js
│ │ ├── useCheckUserAccess.js
│ │ ├── useUserInfo.js
│ ├── index.css
│ ├── index.js
│ ├── 📁pages
│ │ ├── AdminPanel.js
│ │ ├── Home.js
│ │ ├── Login.js
│ │ ├── NotAuthorized.js
│ │ └── UserPanel.js
├── tailwind.config.js
```

### Server
```
📁server
├── .env
├── 📁auth
│ └── access-control.xml
├── 📁certificate
│ ├── server.cert
│ ├── server.key
├── 📁config
│ └── saml-config.js
├── 📁controllers
│ ├── authController.js
│ ├── userController.js
├── 📁middlewares
│ └── pdpQuery.js
├── package-lock.json
├── package.json
├── 📁routes
│ ├── authRoutes.js
│ ├── userRoutes.js
├── 📁security
│ ├── convert-cert.js
│ ├── IdPCertificate.cer
│ ├── IdPCertificate.pem
│ ├── server.cert
│ ├── server.key
├── server.js
```


## Installation

### Prerequisites

- Node.js
- npm/yarn
- WSO2 Server setup for SAML

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Lycanthrope8/SAML-Authentication-using-MERN-PassportJS-WSO2.git
   cd SAML-Authentication-using-MERN-PassportJS-WSO2
   ```

2. **Install Dependencies**:
   ```bash
   npm install

## Usage

### Running the client

1. Navigate to the `client` directory and start the React app:
   ```
   npm start
   ```

### Running the server

1. Navigate to the `server` directory and start the Node.js server:
   ```
   nodemon server.js
   ```
