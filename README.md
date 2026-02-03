# Art Drop AI - Cloudflare Architecture

A production-ready AI art generation platform with Stripe payments, refactored for Cloudflare Pages and Workers.

## 🏗️ Architecture

- **Frontend**: Cloudflare Pages (Vite + React + TypeScript)
- **Backend**: Cloudflare Workers (Serverless API)
- **Database**: Compatible with Cloudflare D1, Neon, or other Workers-compatible databases
- **Payments**: Stripe (webhook-based fulfillment)
- **AI Generation**: Replicate InstantID for face-preserving generation

## 📁 Project Structure

```
├── frontend/          # Cloudflare Pages deployment
│   ├── src/
│   ├── public/
│   ├── package.json   # Frontend dependencies only
│   └── .env          # VITE_API_BASE_URL
├── backend/           # Cloudflare Workers deployment
│   ├── src/
│   │   ├── index.js  # Main Worker fetch handler
│   │   └── database.js # Database functions (placeholder)
│   ├── package.json   # Worker dependencies
│   └── wrangler.toml # Worker configuration
└── README.md
```

## 🚀 Deployment Instructions

### Frontend (Cloudflare Pages)

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Set Environment Variable**
   ```bash
   # Create .env file
   echo "VITE_API_BASE_URL=https://api.yourdomain.com" > .env
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Deploy to Cloudflare Pages**
   - Go to Cloudflare Dashboard → Pages
   - Create new project → Connect to Git
   - **Root directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Output directory**: `dist`
   - Add environment variable: `VITE_API_BASE_URL=https://api.yourdomain.com`

### Backend (Cloudflare Workers)

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   # Set secrets via Wrangler CLI
   wrangler secret put REPLICATE_API_TOKEN
   wrangler secret put STRIPE_SECRET_KEY
   wrangler secret put STRIPE_WEBHOOK_SECRET
   wrangler secret put DATABASE_URL
   ```

3. **Deploy to Cloudflare Workers**
   ```bash
   # Deploy to production
   npm run deploy
   
   # Or test locally
   npm run dev
   ```

4. **Configure Custom Domain** (Optional)
   - Add custom domain: `api.yourdomain.com`
   - Update frontend `VITE_API_BASE_URL` accordingly

## 🔧 Environment Variables

### Frontend (.env)
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Backend (Worker Secrets)
```bash
REPLICATE_API_TOKEN=your_replicate_token
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=your_database_connection_string
```

## 📡 API Endpoints

- `POST /api/generate` - Generate AI artwork
- `POST /api/checkout` - Create Stripe checkout session
- `GET /api/verify-session/:sessionId` - Verify payment status
- `POST /api/stripe-webhook` - Stripe webhook handler

## 🗄️ Database Setup

The backend includes placeholder database functions. Choose one of these options:

### Option 1: Cloudflare D1 (Recommended)
```bash
# Install D1 client
npm install @cloudflare/d1

# Update database.js to use D1 bindings
```

### Option 2: Neon PostgreSQL
```bash
# Install Neon client
npm install @neondatabase/serverless

# Update database.js with Neon connection
```

### Option 3: External PostgreSQL
```bash
# Install PostgreSQL client for Workers
npm install postgres

# Configure with connection pooling
```

## 🔒 Security Notes

- ✅ Stripe secrets never exposed to frontend
- ✅ CORS properly configured between Pages and Workers
- ✅ Webhook signatures verified
- ✅ File uploads validated
- ✅ Environment variables isolated

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run dev    # Development server
npm run build  # Production build
npm run test   # Run tests
```

### Backend
```bash
cd backend
npm run dev    # Local development (wrangler dev)
npm run deploy # Deploy to Workers
```

## 🐛 Troubleshooting

### Frontend Build Issues
- Ensure all dependencies in `frontend/package.json`
- Check `VITE_API_BASE_URL` is set correctly
- Verify no backend dependencies in frontend

### Backend Deployment Issues
- Check all secrets are set via `wrangler secret put`
- Verify `wrangler.toml` configuration
- Check Worker logs in Cloudflare dashboard

### CORS Issues
- Ensure `VITE_API_BASE_URL` matches Worker URL
- Check CORS headers in Worker response
- Verify preflight requests handled

## 📝 Development Workflow

1. **Local Development**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

2. **Making Changes**
   - Frontend changes: Auto-reloads via Vite
   - Backend changes: Restart `wrangler dev`

3. **Deploying Updates**
   ```bash
   # Frontend
   cd frontend && git push origin main
   
   # Backend
   cd backend && npm run deploy
   ```

## 🎯 Next Steps

1. **Set up production database** (D1/Neon/PostgreSQL)
2. **Configure custom domains** for both frontend and backend
3. **Set up monitoring** and error tracking
4. **Add comprehensive testing**
5. **Configure CI/CD** for automated deployments

## 📄 License

MIT License - feel free to use this architecture for your projects.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
