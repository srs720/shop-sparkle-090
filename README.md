# Ember Commerce

Act as an Expert React Developer. Build a comprehensive, multi-page e-commerce frontend MVP (similar to Amazon/Daraz) using React, Tailwind CSS, shadcn/ui, and React Router. 

Please implement the following architecture, routing, and UI components using realistic dummy data to populate the views:

1. Global Layout & Routing:

- Top Header: Language toggle, Customer Care, 'Track Order', 'Help', and 'Download App' links.

- Main Header: Logo, large centralized Search Bar with a category dropdown, Location selector, Login/Sign Up buttons, Wishlist icon, and a Cart icon with a dynamic item count badge.

- Navigation: A Mega Menu bar for categories (Electronics, Fashion, Home, Mobile, etc.).

- Footer: Customer service links, Payment method icons, Social links, and a Newsletter subscription form.

2. Home Page (/):

- Hero Section: An auto-playing image slider for banners and campaigns (e.g., 11.11 Sale).

- Flash Sale: A horizontal scrollable section with a countdown timer and discounted products.

- Category Grid: A grid of circular or card-style category icons.

- Product Sections: 'Just For You', 'Best Sellers', and 'New Arrivals' displaying responsive product cards.

- Product Cards: Must include image, title, discounted price, original price, discount percentage badge, star rating, and an 'Add to Cart' button.

3. Product Listing Page (/category):

- Left Sidebar: Advanced filters (Price range slider, Brand checkboxes, Rating stars, Size/Color options).

- Main Area: Breadcrumbs, sorting dropdown (Popular, Price High/Low), and a responsive grid of product cards with pagination at the bottom.

4. Single Product Details Page (/product/:id):

- Top Section: Left side image gallery (large main image + clickable thumbnails). Right side containing title, brand, rating, original/discounted price, stock status, variation selectors (Color, Size), quantity adjuster, 'Buy Now', and 'Add to Cart' buttons.

- Bottom Section: Tabs for Product Description, Specification Table, and Customer Reviews with star ratings.

5. Cart & Checkout Flow:

- Cart Drawer: A slide-out sidebar showing added items (image, title, quantity +/- adjusters, remove button), subtotal, and a 'Proceed to Checkout' button.

- Checkout Page (/checkout): A simple multi-step UI layout (Shipping Address form -> Payment Method selection -> Order Summary).

6. Authentication (/login):

- A clean, centered Login/Registration modal or page with Email/Phone inputs, Password, 'Remember Me', and Social Login (Google/Facebook) buttons.

Design Requirements:

- Strictly ensure mobile-first responsive design across all devices.

- Use Lucide React for all iconography.

- Maintain a fast, clean, and modern aesthetic.

- Generate robust JSON arrays of dummy data (at least 15-20 varied products across different categories) so the prototype looks fully populated and functional.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://shop-sparkle-090.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9df15203-dd9d-472e-9d8b-13a24881823c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
