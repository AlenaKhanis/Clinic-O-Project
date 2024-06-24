# Clinic-O Project

This is a demo project for managing clinic appointments for doctors and patients. This backend application is built with Python and PostgreSQL.

- [Clinic-O Project](#clinic-o-project)
  - [Description](#description)
  - [Prerequisites](#prerequisites)
  - [Usage](#usage)
- [Database](#database)
  - [Option 1: Running PostgreSQL with Docker](#option-1-running-postgresql-with-docker)
  - [Option 2: Setting Up PostgreSQL with SQL Dump](#option-2-setting-up-postgresql-with-sql-dump)
    - [Database Configuration](#database-configuration)
  - [Running the Application](#running-the-application)
  - [Frontend (React / Vite / TypeScript)](#frontend-react--vite--typescript)
  - [Docker Setup](#docker-setup)
    - [Configuration](#configuration)
    - [Running the Application with Docker Compose](#running-the-application-with-docker-compose)




## Description

Clinic-O is a backend system designed to manage clinic appointments for doctors and patients. It provides functionality to handle user management, appointment scheduling, and clinic details.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed **Python 3.11** or higher.
- You have installed **PostgreSQL.**
- You have a compatible operating system (Linux, macOS, Windows).
- You have `pip` (Python package installer) installed.
- You have `git` installed.

## Usage

To run the project locally, follow these steps:

1. **Clone the Repository**

    ```sh
    git clone https://github.com/AlenaKhanis/Clinic-O_Project
    cd clinic-o-project
    ```
**Backend API Server (Flask)**

Build the backend dependencies.

Make sure to run the following commands in the **backend** directory:

**Optional:** Create and activate a virtual environment:

* On macOS/Linux: 
```sh
sudo apt install python3.10-venv
python3 -m venv venv
source venv/bin/activate
```
* On Windows:
```sh
python -m venv venv
.\venv\Scripts\activate
```
4. **Install Dependencies**

    ```sh
    pip install -r requirements.txt
    ```
4. **Set Up Environment Variables**

    Create a `.env` file in the `backend` directory by copying the example.env file provided in the repository and replace the placeholder values with your actual values.

    ```sh
    cp example.env .env
    ```
    Open the backend/.env file and replace the placeholders:

    ⚠️ [!WARNING]
    Change the value of the `FLASK_SECRET_KEY` in the backend/.env file to a random string. This is used to secure the session cookies / JWT tokens. 

    This project must have a valid API key for NEWS. Copy the file [backend/example.env](backend/example.env) to `backend/.env` and replace the placeholder for `NEWS_API_KEY` with a valid API key.

    ⚠️[!CAUTION]
    The database credentials and API keys should be kept secret. Do not share them publicly.

# Database

The backend uses PostgreSQL as the database. You have the following options to set up and use PostgreSQL:


## Option 1: Running PostgreSQL with Docker

You can use Docker to run a PostgreSQL container. Make sure you have Docker installed on your machine.

1. Create and start a PostgreSQL container:

```sh
docker run --name clinic-postgres -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres
```
* --name clinic-postgres: Sets the name of the container to clinic-postgres.
* -e POSTGRES_PASSWORD=password: Sets the password for the PostgreSQL postgres user to password. Replace password with your desired password.
* -d: Runs the container in detached mode (background).
* -p 5432:5432: Maps port 5432 on the host to port 5432 on the container.
2. Verify that the PostgreSQL container is running:
```sh
docker ps
```
You should see clinic-postgres listed in the output.

**Creating the Database Schema**

Run the database migrations to set up the database schema and load the example data:

```sh
python create_shema.py
```


## Option 2: Setting Up PostgreSQL with SQL Dump

1. Ensure you have PostgreSQL installed and running on your local machine.

2. Create a new database using the PostgreSQL command line (replace 'your_db_name' with your desired database name):

```sh
createdb your_db_name 
```   
3. Load the SQL dump file (dump.sql) into your PostgreSQL database:

```sh
psql -d your_db_name -U your_db_user -f path/to/dump.sql
```
Replace your_db_name with your database name, your_db_user with your PostgreSQL username, and path/to/dump.sql with the actual path to your dump.sql file.

### Database Configuration

To configure the database connection for this project, modify the following environment variables in your environment or configuration file:

- **DB_NAME**: The name of your PostgreSQL database.
- **DB_USER**: The username for connecting to PostgreSQL.
- **DB_PASSWORD**: The password for the PostgreSQL user.
- **DB_HOST**: The hostname or IP address where your PostgreSQL server is running (e.g., localhost).
- **DB_PORT**: The port number on which PostgreSQL is listening (default is 5432).

This section outlines two options for setting up and using PostgreSQL: using Docker to run a PostgreSQL container or loading a SQL dump file (dump.sql) into a locally installed PostgreSQL database. Choose the option that best fits your development or deployment environment.


## Running the Application

After setting up the environment variables, you can run the backend server (inside the backend directory):

```sh
flask run
```
The backend server will be running at http://localhost:5000 (the port number may change, check the output of the flask run command).

## Frontend (React / Vite / TypeScript)

From within the [frontend](frontend) directory, run the following commands:

Create a `.env.development` file by copying the example.env file provided in the repository and replace the placeholder values with your actual values:

```
cp frontend/example.env frontend/.env.development
```
[!NOTE] Adjust the VITE_BACKEND_URL as needed to match the URL where your backend is running.

Install the dependencies and run the frontend:

```bash
npm install
npm run dev
```
You should be able to access the project at http://localhost:5173 in your browser (the port may change, check the output of the npm run dev command).




## Docker Setup

### Configuration
Create a `.env` file in the root directory with the following variables:
```
FRONTEND_URL=http://localhost
FRONTEND_PORT=3000
BACKEND_PORT=8080
NEWS_API_KEY=your_news_api_key
```

These variables will be used by Docker Compose to configure the services defined in your `docker-compose.yml` file.

### Running the Application with Docker Compose

After setting up the `.env` file, you can start the application using Docker Compose. This will create and start all the services defined in your `docker-compose.yml` file, including the frontend, backend, and any databases or other dependencies.

1. **Build and Start the Containers**

   Run the following command in the terminal:

   ```sh
   docker-compose up --build

2. Accessing the Application

Once the containers are up and running, you can access the frontend application by navigating to http://localhost:3000 in your web browser. The backend API will be available at http://localhost:8080.

3. Stopping the Containers

To stop and remove all running containers, use the following command:
```
docker-compose down
```

This setup ensures that your application components are containerized, making it easier to manage dependencies, environments, and deployments.
