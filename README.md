# Getting Started

## Technology Used
- Nest js
- React js
- TypeScript
- MongoDB
- Tailwind css
- Mongoose
- Docker and more.

## Running the Project
### Option 1: Run with Docker (Recommended)
Navigate to the project folder and run the following command(make sure docker is running on the system):
```bash
docker-compose up --build
```
or
```bash
docker compose up --build
```
Docker will handle all dependencies, making setup simpler.

- The frontend will be accessible at `http://localhost:3033`.
- The backend server will be accessible at `http://localhost:5016`.

### Option 2: Run without Docker
Ensure the following are installed:
- **Node.js** (version 22)

#### Steps
1. **Backend Setup**
    - Navigate to the `Backend` folder.
    - Optional: If needed modify `.env` from `./configs` folder.
    - Install dependencies and set up the database:
      ```bash
      yarn install
      yarn dev
      ```
      This will configure the database and seed it with some dummy data. The backend server will be accessible at `http://localhost:5016`.

2. **Frontend Setup**
    - Navigate to the `Frontend` folder.
    - Create an `.env` file by following the structure in `.env.example`.
    - Install dependencies and start the development server:
      ```bash
      yarn install
      yarn dev
      ```
      The frontend will be accessible at `http://localhost:3033`.