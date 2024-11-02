# **Flight Delay Prediction**

## **Additional Information**

If you want to learn more about data analysis and model training, refer to the following files:

- **Jupyter Notebook**: [Flight Delay Analysis Notebook](backend/machinelearning_notebook/flightDelay.ipynb)  
  This notebook provides detailed data processing steps, data visualization, model training, and evaluation metrics.

Feel free to explore the notebook and scripts to gain a deeper understanding of the project.

---

## **Project Overview**
This project provides a web application to predict flight delays using machine learning models. The system includes a FastAPI back-end for data processing and a front-end interface built with React for user interaction.

---

## **Features**

- **Predict Flight Delays**: Upload flight data in CSV format and receive delay predictions based on machine learning models.
- **Evaluate Models**: Evaluate various machine learning models on predefined datasets.
- **Interactive UI**: A user-friendly front end for uploading data and viewing prediction results.

---

## **Table of Contents**

1. [Project Structure](#project-structure)
2. [Technologies Used](#technologies-used)
3. [Back-End Setup](#back-end-setup)
4. [Front-End Setup](#front-end-setup)
5. [API Documentation](#api-documentation)
6. [Usage](#usage)

---

## **Technologies Used**
- **Front End**: React, HTML, CSS, TailwindCSS
- **Back End**: FastAPI, Python
- **Machine Learning Models**: Scikit-Learn
- **Data Processing**: Pandas, NumPy

---

## **Project Structure**
The project follows a modular structure for clarity and maintainability:

```plaintext
project-root/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/      # React components for the UI
│       ├── App.js           # Main app component
│       └── index.js         # Entry point for the front end
│
└── backend/
    ├── src/
    │   ├── main.py          # Main application files, including API endpoints
    │   ├── flight_models.py # Machine learning model files
    │   └── predict.py       # Prediction logic
    ├── CSV/                 # Directory for storing uploaded CSV files
    ├── result/              # Directory for prediction results
    └── trained/             # Directory for trained machine learning models
```

## **1. Environment Setup**

### Back-End Installation

The back end of this project is built with FastAPI and requires several Python dependencies to handle requests, process data, and perform machine learning tasks.

#### 1. Set Up Backend Environment
We use `pip` to install dependencies. Follow the steps below to set up the environment.

### Upgrade pip
```bash 
pip install --upgrade pip
```
### Install Required Libraries
```bash
cd backend
pip install pandas numpy scikit-learn joblib fastapi uvicorn python-muitipart
```
If any libraries are missing, please follow the terminal instructions to install them, as the list may not be exhaustive.

#### 2. Set Up Frontend Environment
The front end is developed using React. To set up the front end, follow these instructions:

### Set Up Node.js
Ensure you have Node.js installed on your machine. You can download it from Node.js official website "https://nodejs.org/en".
### Install Front-End Dependencies
Navigate to the frontend directory and install the required dependencies using npm:
```bash
cd frontend
npm install
```
If any libraries are missing, please follow the terminal instructions to install them, as the list may not be exhaustive.

#### 3. Running Instructions

### Running both backend and frontend (using Concurrently library)
To running both backend and frontend in one terminal:
```bash
cd frontend
npm run dev
```
after done the command just wait until both frontend and backend running, the backend server will run on http://localhost:8000 and frontend will run on server http://localhost:3000

### Backend
To run the FastAPI back end, use the following command:
```bash
cd backend/src
npm run dev
```
after done the command just wait until both frontend and backend running, the backend server will run on http://localhost:8000 and frontend will run on server http://localhost:3000

### Running both backend and frontend (using Concurrently library)
To running both backend and frontend in one terminal:
```bash
cd frontend
npm run dev
```
after done the command just wait until both frontend and backend running, the backend server will run on http://localhost:8000 and frontend will run on server http://localhost:3000
