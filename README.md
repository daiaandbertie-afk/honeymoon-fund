# Daia & Bertie's Honeymoon Fund

A custom honeymoon fund page with Stripe checkout, built with Next.js.

---

## What's Inside

```
honeymoon-fund/
├── app/
│   ├── layout.js          ← HTML wrapper + fonts
│   ├── globals.css         ← CSS reset
│   ├── page.js             ← The honeymoon fund page
│   ├── api/checkout/
│   │   └── route.js        ← Stripe Checkout API (creates payment sessions)
│   └── thank-you/
│       └── page.js         ← Post-payment thank-you page
├── .env.example            ← Template for your secret keys
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

---

## Setup Guide (Step by Step)

### Step 1: Create a Stripe Account

1. Go to **https://stripe.com** and sign up (free)
2. Once logged in, go to **https://dashboard.stripe.com/apikeys**
3. You'll see two keys:
   - **Publishable key** — starts with `pk_test_...` (you won't need this)
   - **Secret key** — starts with `sk_test_...` (you need this one)
4. Copy your **Secret key** — you'll use it in Step 4

> The `sk_test_` key is for testing. When you're ready to accept real
> payments, toggle to "Live mode" in the Stripe dashboard and use the
> `sk_live_` key instead.

### Step 2: Install Prerequisites

You need **Node.js** installed on your computer.

- **Mac**: Open Terminal, run `brew install node` (or download from https://nodejs.org)
- **Windows**: Download from https://nodejs.org and install

Verify it works:
```bash
node --version    # should show v18 or higher
npm --version     # should show 9 or higher
```

### Step 3: Download & Install the Project

Unzip the project folder, then in your terminal:

```bash
cd honeymoon-fund
npm install
```

This installs Next.js, React, and the Stripe library.

### Step 4: Add Your Stripe Key

Copy the example env file:
```bash
cp .env.example .env.local
```

Open `.env.local` in a text editor and replace the placeholder:
```
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 5: Test Locally

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. You should see the
honeymoon fund page. Click "Contribute" on any experience — it will
redirect you to Stripe's checkout page.

**Test card numbers** (use these in test mode):
- Success: `4242 4242 4242 4242`
- Any future expiry, any CVC, any ZIP

### Step 6: Deploy to Vercel (Free)

1. Create a GitHub account if you don't have one: **https://github.com**
2. Install Git if needed: **https://git-scm.com**
3. Push your project to GitHub:

```bash
cd honeymoon-fund
git init
git add .
git commit -m "Honeymoon fund"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/honeymoon-fund.git
git push -u origin main
```

4. Go to **https://vercel.com** and sign up with your GitHub account
5. Click **"Add New Project"**
6. Select your `honeymoon-fund` repository
7. Before clicking Deploy, add your environment variables:
   - Click **"Environment Variables"**
   - Add `STRIPE_SECRET_KEY` → paste your `sk_test_...` key
   - Add `NEXT_PUBLIC_BASE_URL` → leave blank for now (we'll update it)
8. Click **Deploy**

After ~60 seconds, Vercel gives you a URL like:
`https://honeymoon-fund-abc123.vercel.app`

9. Go back to your Vercel project settings → Environment Variables
10. Update `NEXT_PUBLIC_BASE_URL` to your Vercel URL (e.g. `https://honeymoon-fund-abc123.vercel.app`)
11. Redeploy (Vercel dashboard → Deployments → click the three dots → Redeploy)

### Step 7: Custom Domain (Optional)

If you want a nice URL like `honeymoon.bertieanddaia.com`:

1. In Vercel, go to your project → Settings → Domains
2. Add your custom domain
3. Vercel will give you DNS records to add in your domain registrar
4. Update `NEXT_PUBLIC_BASE_URL` in Vercel to match

### Step 8: Go Live with Real Payments

When you're ready to accept real money:

1. In the Stripe Dashboard, complete your account verification
   (Stripe will ask for your bank account, ID, etc.)
2. Toggle to **Live mode** in the Stripe Dashboard
3. Copy your **live** secret key (`sk_live_...`)
4. In Vercel → Settings → Environment Variables:
   - Update `STRIPE_SECRET_KEY` to your live key
5. Redeploy

### Step 9: Link from Your Squarespace Site

On your Squarespace Registry page, replace the Typeform link with your
Vercel URL. Something like:

```
[View our Honeymoon Fund](https://honeymoon-fund-abc123.vercel.app)
```

---

## How Payments Work

1. Guest visits your page and clicks "Contribute"
2. They enter their name, a message, and an amount
3. They click the button and get redirected to **Stripe Checkout**
   (a secure, hosted payment page by Stripe — you never touch card data)
4. After paying, they land on your thank-you page
5. The money goes directly into your connected bank account
6. You can see every payment in your **Stripe Dashboard**,
   including the guest's name, message, and which experience they chose

---

## Where to See Payments

Go to **https://dashboard.stripe.com/payments** to see:
- Every contribution with the guest's name
- The experience they chose
- Their personal message (in the payment metadata)
- The amount after Stripe's processing fee

---

## Fees

- US cards: 2.9% + $0.30 per transaction
- International cards: +1.5% additional
- Currency conversion: +1% if applicable
- No monthly fees, no setup fees, no minimum

On a $100 contribution from a US guest, you receive ~$96.80.
On a $100 contribution from a UK guest, you receive ~$95.30.

---

## Editing Experiences

To change the honeymoon experiences, edit the `EXPERIENCES` array
at the top of `app/page.js`. Each experience has:

```js
{
  id: 1,                            // unique number
  title: "Pletna Boat Ride",        // display name
  description: "Gliding across...", // 1-2 sentences
  goal: 120,                        // dollar amount shown
  tag: "Experience"                 // category label
}
```

After editing, commit and push to GitHub — Vercel auto-deploys.

---

## Updating the Bloomingdale's Link

Find this line in `app/page.js` and replace with your actual registry URL:

```html
<a href="https://www.bloomingdales.com/registry/wedding" ...>
```

---

## Need Help?

If you get stuck, the most common issues are:
- **"Module not found"**: Run `npm install` again
- **Stripe error**: Check that `.env.local` has the right key, no quotes
- **Blank page**: Check the browser console (F12) for errors
- **Vercel deploy fails**: Make sure environment variables are set
