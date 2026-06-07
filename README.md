# saasforlife.co.in

World-class software solutions engineered in India. Built for speed, compliance, and life.

## Prerequisites
* **Node.js**: Version 18 or higher
* **npm**: Version 9 or higher

## Local Development
Follow these steps to run the application locally:

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Setup environment variables**:
   Duplicate `.env.example` to create a `.env` file at the root:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your active Key IDs:
   * `VITE_RAZORPAY_KEY_ID`: Your Razorpay Key ID (obtained from the API Keys tab in your dashboard).
   * `VITE_FORMSPREE_ID`: Your Formspree Form ID (obtained from the Form Settings tab).

3. **Run local dev server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the address listed in your terminal (usually `http://localhost:5173`).

4. **Build for production**:
   ```bash
   npm run build
   ```
   This will output optimized asset bundles inside the `/dist` directory.

---

## Deploying to Vercel (Free Tier)

This project is pre-configured with a `vercel.json` file designed specifically for Vite Single Page Applications (SPAs). It handles client-side routing rewrites and mounts strict Content Security Policies (CSP) to permit payment integrations like Razorpay, Formspree connections, and CDN fonts.

### Step 1: Push Project to GitHub
1. Initialize Git in the project root (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on GitHub and link it to your local environment:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Connect Repo to Vercel
1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. In the **Configure Project** tab:
   * **Framework Preset**: Detects `Vite` automatically.
   * **Root Directory**: `./` (Root workspace).
   * **Build and Output Settings**: Vercel will detect `npm run build` and output directory `dist` automatically based on the `vercel.json` instructions.
5. In the **Environment Variables** section, enter the following key-value pairs:
   * `VITE_RAZORPAY_KEY_ID` = `YOUR_PRODUCTION_RAZORPAY_KEY_ID`
   * `VITE_FORMSPREE_ID` = `YOUR_PRODUCTION_FORMSPREE_FORM_ID`
6. Click **Deploy**.

---

## Setting up Custom Domain: saasforlife.co.in

To bind your custom domain to the Vercel deployment:

1. In the Vercel project dashboard, navigate to **Settings** -> **Domains**.
2. Type `saasforlife.co.in` and click **Add**.
3. Vercel will recommend adding both `saasforlife.co.in` and the wildcard redirect `www.saasforlife.co.in`. Click **Add** to accept.
4. Vercel will show the required DNS record configurations. Log into your domain registrar (e.g., GoDaddy, Namecheap, Hostinger) and create these **two DNS records**:

| Type | Name (Host) | Value (Points to) | TTL | Note |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | Custom/Default | Binds root domain |
| **CNAME** | `www` | `cname.vercel-dns.com` | Custom/Default | Binds www subdomain |

5. Once the registrar propagates the changes (usually 10-15 minutes), Vercel will generate free SSL certificates and redirect visitors correctly.
