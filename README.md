# Heavenly Soundscapes Website

A premium recording studio website built with Next.js, featuring dynamic pricing, booking system, and admin dashboard.

## Features

- **Homepage**: Stunning hero section with studio gallery and services preview
- **Services Page**: Interactive pricing calculator with real-time updates
- **Booking System**: Multi-step booking flow with Stripe payment integration
- **Admin Dashboard**: Secure dashboard for managing bookings with Supabase authentication
- **Portfolio**: Showcase of studio work and client testimonials
- **Contact Page**: Contact form and studio information

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with custom black & gold design system
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Authentication**: Supabase Auth
- **Fonts**: Playfair Display (serif) & Inter (sans-serif)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Stripe account

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables (already configured in Vercel):
   - Supabase credentials
   - Stripe API keys

4. Run the database migration:
   - Execute `scripts/001_create_bookings_table.sql` in your Supabase SQL editor

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

The booking system requires a `bookings` table in Supabase. Run the SQL script in `scripts/001_create_bookings_table.sql` to create the necessary table with Row Level Security.

## Admin Access

To access the admin dashboard:

1. Create an admin user in Supabase Authentication
2. Navigate to `/admin/login`
3. Sign in with your credentials
4. Manage bookings from `/admin`

## Project Structure

\`\`\`
app/
├── (routes)/
│   ├── page.tsx              # Homepage
│   ├── services/             # Services & pricing
│   ├── portfolio/            # Portfolio showcase
│   ├── contact/              # Contact page
│   ├── book/                 # Booking flow
│   └── admin/                # Admin dashboard
components/
├── home/                     # Homepage components
├── services/                 # Services components
├── booking/                  # Booking components
├── admin/                    # Admin components
├── navigation.tsx            # Main navigation
└── footer.tsx                # Footer
lib/
├── stripe.ts                 # Stripe configuration
├── supabase/                 # Supabase clients
└── email.ts                  # Email templates
scripts/
└── 001_create_bookings_table.sql  # Database schema
\`\`\`

## Customization

### Colors

The design uses a black and gold color scheme defined in `app/globals.css`:
- Primary gold: `#D4AF37`
- Background: Black
- Text: White/Gray variations

### Services & Pricing

Update pricing in `components/services/pricing-calculator.tsx` to match your studio rates.

### Email Notifications

Email templates are in `lib/email.ts`. Integrate with your preferred email service (Resend, SendGrid, etc.) by updating the `sendBookingConfirmationEmail` function.

## Deployment

This project is optimized for deployment on Vercel:

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

## Support

For questions or issues, contact: info@heavenlysoundscapes.com

## License

© 2025 Heavenly Soundscapes. All rights reserved.
