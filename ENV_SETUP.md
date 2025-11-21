# Environment Configuration Files

## Frontend (.env)
Located at: `Frontend/.env`

```
VITE_API_BASE_URL=http://localhost:5000
```

**Usage**: After deployment, update this to your backend URL (e.g., `https://your-api.onrender.com`)

## Backend (.env)
Located at: `Python/.env`

```
FRONTEND_URL=http://localhost:5173
```

**Usage**: After deployment, update this to your frontend URL (e.g., `https://your-app.vercel.app`)

## Deployment Steps

1. **Frontend (Vercel/Netlify)**:
   - Add environment variable: `VITE_API_BASE_URL` = Your Render backend URL
   - Rebuild the app

2. **Backend (Render)**:
   - Add environment variable: `FRONTEND_URL` = Your Vercel frontend URL
   - Redeploy the service

This ensures CORS works correctly and API calls are routed properly in production.
