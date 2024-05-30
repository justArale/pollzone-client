# PollZone

## Description
PollZone is a dynamic platform designed to empower creators to launch polls, collections, or projects. Our goal is to create a collaborative environment where fans can participate by voting on their favorite options, ultimately deciding which options should be elected or implemented.

## Purpose
PollZone enables creators to:
- Launch polls, collections, or projects.
- Engage with fans to determine the most popular options.

## Community Focus
Creating a collaborative environment for both creators and fans:
- **For Fans**:
  - Explore a variety of projects and polls.
  - Participate by voting on your favorite options.
  - Use the dashboard to track the polls and creators you’ve interacted with.
- **For Creators**:
  - Create and edit polls with multiple options.
  - Set voting timers to control how long voting stays open.
  - Gain insights into how fans are voting.
  - Use the dashboard to view all projects.

## Features
- Launch and manage polls, collections, or projects.
- Vote on favorite options and track engagement.
- Personalized dashboards for both fans and creators.
- Insights and analytics on voting patterns.

## Technologies Used
- **Frontend**: React, Vite
- **Backend**: ExpressJS, Node.js
- **Database**: MongoDB (Compass/Atlas)

## Dependencies
- **React**: For building the user interface.
- **Axios**: Used for making HTTP requests.
- **React Router**: For handling routing within the application.
- **React Toastify**: For displaying notifications.

## Installation

### Frontend

To get started with the frontend of PollZone, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/justArale/pollzone-client.git
    ```
2. Navigate to the frontend directory:
    ```bash
    cd pollzone-client
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up environment variables in a `.env` file:
    ```
    VITE_API_URL=http://localhost:5000/api
    ```
5. Start the development server:
    ```bash
    npm run dev
    ```

### Backend

To get started with the backend of PollZone, follow these steps:

1. Clone the repository (if you haven't already):
    ```bash
    git clone https://github.com/justArale/pollzone-server.git
    ```
2. Navigate to the backend directory:
    ```bash
    cd pollzone-server
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up environment variables in a `.env` file:
    ```
    PORT=5000
    ORIGIN=http://localhost:3000
    TOKEN_SECRET=your_jwt_secret
    MONGODB_URI=your_mongodb_uri
    ```
5. Start the development server:
    ```bash
    npm run dev
    ```

### Linking Frontend and Backend

To ensure the frontend and backend communicate correctly:

1. In the frontend, set the API URL to the backend server in the `.env` file:
    ```
    VITE_API_URL=http://localhost:5000/api
    ```

2. In the backend, ensure CORS is configured to allow requests from the frontend. Update `server.js`:
    ```javascript
    const cors = require('cors');
    app.use(cors({
      origin: 'http://localhost:3000',
      credentials: true
    }));
    ```

## Usage
- **For Fans**:
  - Sign up and explore available projects and polls.
  - Vote on your favorite options.
  - Use the personalized dashboard to track your interactions.

- **For Creators**:
  - Create and manage polls with multiple options.
  - Set timers for voting periods.
  - Analyze voting patterns to gain insights.
  - Monitor all active and completed projects through the dashboard.

## Contributing
We welcome contributions to PollZone! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-branch
    ```
3. Make your changes and commit them:
    ```bash
    git commit -m "Description of your changes"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-branch
    ```
5. Create a pull request and describe your changes in detail.

## License
This project is licensed under the MIT License - see the [MIT License](https://github.com/justArale/pollzone-client/blob/main/LICENSE) file for details.


## Acknowledgments
We would like to thank all our contributors and the open-source community for their support.
