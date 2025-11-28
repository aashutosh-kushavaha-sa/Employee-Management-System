
MERGED BACKEND READY

- merged-backend/ contains combined auth + employee server
- Add your MongoDB Atlas URI to merged-backend/.env as MONGO_URI
- Run in merged-backend:
    npm install
    npm run start   # or npm run dev if you use nodemon

- Frontend environments updated to use placeholder backend URL.
  Update frontend/src/environments/environment.prod.ts with the real backend URL after deploying.

- Use this repo for deployment (push to GitHub then deploy merged-backend to Render).
