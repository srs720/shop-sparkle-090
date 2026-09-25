# Storefront Audit and Fix Master Plan

A system-by-system roadmap for the public side of the store. We fix one system at a time, in dependency order, and each one is tested with a signed-in shopper before we move on.

## The complete list (in fix order)

1. User Registration and Sign-in
2. User Profile and Account Dashboard
3. Product Catalog (product pages, category pages)
4. Homepage (banners, flash sale, rankings, vouchers, product feed)
5. Search and Filters
6. Wishlist and Compare
7. Cart (page and slide-out drawer)
8. Coupons and Vouchers
9. Checkout
10. Payment Gateway
11. Order Confirmation and Order Tracking
12. Returns and Refunds
13. Reviews and Ratings
14. Support: Messages, Tickets, Floating Help
15. Content Pages (About, Privacy, Terms, FAQ) and Promotions pages
16. Site-wide: navigation, bottom bar, dark mode, EN/BN language, mobile layout, page titles and sharing previews

**Start now with #1, Registration and Sign-in.** Profiles, saved addresses, real orders, tracking, reviews and support tickets all need a real signed-in customer. Until sign-in works, none of those can be tested properly.

---

## 1. Registration and Sign-in
- **Logic:** Sign up with email and password, confirm by email, sign in, sign out, and reset a forgotten password. Google sign-in is included. The header shows the account menu when signed in. New customers get a profile and the "viewer" role automatically.
- **Edge cases:** Wrong password, an email that's already registered, a weak password, an unconfirmed email, a reset link that has expired or been used, double-clicking submit, and signing out while on an account page.
- **Fix and test:** Replace the placeholder sign-in form with real accounts. Add a password-reset page. Remove the fake OTP and fingerprint buttons, or label them "coming soon". Then test sign-up, confirmation, sign-in, reset, and sign-out in the browser.

## 2. Profile and Account Dashboard
- **Logic:** Customers can view and edit their name and photo, manage saved addresses, see reward points and change their password. They see only their own data.
- **Edge cases:** Empty profile, invalid phone or postcode, deleting the default address, and trying to view another customer's data.
- **Fix and test:** Move addresses and rewards from browser-only storage into the database, locked to the owner. Test with two customer accounts to prove neither can see the other's data.

## 3. Product Catalog
- **Logic:** Product and category pages read live products from the database, including price, compare price, stock, variants, images and rating. Out-of-stock and draft products can't be bought.
- **Edge cases:** A product link that doesn't exist or was deleted, zero stock, no images, a variant with its own price, and very long names.
- **Fix and test:** Get rid of the leftover sample product list so everything comes from the database. Add "not found" and error screens. Check that each product page has its own title and sharing preview.

## 4. Homepage
- **Logic:** Banners, the flash sale (with a real countdown and discount), top ranking, vouchers and the "For You" feed all come from live data and admin settings. Every button leads somewhere real.
- **Edge cases:** No banners or no active flash sale, an expired sale, slow loading, and time mismatches between server and browser.
- **Fix and test:** Connect the banners to the Content Management page. Make vouchers claim real coupons. Hide empty sections. Click through every link on mobile and desktop.

## 5. Search and Filters
- **Logic:** Search by name, brand or category. Filter by price, rating and category, and sort. Filters are kept in the web address so results can be shared.
- **Edge cases:** An empty search, special characters, no results, a minimum price above the maximum, and very long searches.
- **Fix and test:** Run search against the database with limits on results. Clean up search input. Test a list of tricky queries.

## 6. Wishlist and Compare
- **Logic:** Save and remove favourites (kept with the account when signed in) and compare up to 4 products.
- **Edge cases:** A signed-out shopper, a product that was deleted, and a full compare list.
- **Fix and test:** Store signed-in wishlists in the database and merge saved items when the shopper signs in.

## 7. Cart
- **Logic:** Add, remove and change quantity, never beyond stock. Selecting items updates the totals. The cart is kept between visits. Shipping is free over the threshold or with a free-shipping coupon.
- **Edge cases:** Quantity 0 or negative, stock changing after adding, a product deleted while in the cart, and the price changing.
- **Fix and test:** Re-check prices and stock against the database when the cart loads. Make the cart page, slide-out drawer and checkout use the same shipping rules. They currently differ.

## 8. Coupons and Vouchers
- **Logic:** Codes are checked by the server for: active, date range, usage limit and minimum order. Three coupon types: percentage (max 100%), flat amount (never more than the subtotal) and free shipping (removes the delivery fee).
- **Edge cases:** Wrong code, expired code, limit reached, the cart dropping below the minimum after the coupon is applied, and upper/lower case.
- **Fix and test:** Re-check the coupon whenever the cart changes. Count a use only when an order is actually placed. Create one test coupon of each type in admin and apply it at checkout.

## 9. Checkout
- **Logic:** Address, delivery method, payment and review, then place order. This saves a real order with its items. It reduces stock, records coupon use and empties the cart.
- **Edge cases:** Empty cart, missing address, placing the order twice, stock running out during checkout, and totals being changed in the browser.
- **Fix and test:** Place orders on the server, where prices, tax, shipping and discount are recalculated rather than trusted from the browser. Show clear error messages. Test the full flow end to end and confirm the order appears in admin.

## 10. Payment Gateway
- **Logic:** Only payment methods switched on in admin are shown. Cash on delivery works immediately. Online payment marks the order paid only after the payment provider confirms it.
- **Edge cases:** Payment declined, the shopper closing the payment window, a duplicate confirmation, and paid orders later refunded.
- **Fix and test:** This needs a decision from you: Shopify or Stripe (recommended earlier for physical goods), or local methods like bKash. Until then, cash on delivery is the working method and the other options are labelled.

## 11. Order Confirmation and Tracking
- **Logic:** A confirmation page with the order number. Account > Orders lists real orders with a status timeline (pending to delivered) and courier tracking links. Status changes made in admin show up live.
- **Edge cases:** Someone else's order number, cancelled or refunded orders, and no orders yet.
- **Fix and test:** Replace the sample orders with real ones. Let customers cancel while an order is pending. Change a status in admin and check that the customer sees it.

## 12. Returns and Refunds
- **Logic:** Customers can request a return on delivered orders within the allowed period. Status comes from admin.
- **Edge cases:** Requesting a return twice, orders not yet delivered, and an amount higher than the order total.
- **Fix and test:** Connect the returns page to refund requests with limits enforced by the database.

## 13. Reviews
- **Logic:** Only customers who bought the product can post one review each. Reviews show after admin approval.
- **Edge cases:** Rating outside 1 to 5, very long text, and harmful text.
- **Fix and test:** Add a review form on product pages with approved reviews shown. Test the approval flow with admin.

## 14. Support
- **Logic:** Signed-in customers open tickets and reply. Staff replies from admin appear live.
- **Edge cases:** An empty message, and signed-out shoppers (who should see a sign-in prompt).
- **Fix and test:** Connect the Messages page to tickets. Test customer to admin and back.

## 15. Content and Promotions Pages
- **Logic:** About, Privacy, Terms and FAQ come from Content Management. Promotion pages show their products.
- **Edge cases:** An unpublished or missing page, which should show a proper "not found" screen.
- **Fix and test:** Build real pages in place of the placeholder pages.

## 16. Site-wide Checks
- Every link leads to a real page. The bottom bar highlights the right tab. Dark mode is readable. The language toggle covers the main labels. Every page has its own title and sharing preview. Mobile and desktop layouts are checked. There are no errors in the browser.

---

## How each system is tested
1. Read the code and database rules for the feature.
2. Reproduce it in a real browser as a signed-in shopper, on mobile and desktop.
3. Fix the whole group of related bugs, not just the one example.
4. Re-test the full flow, check the error logs, and run the security check.
5. Mark it done in the roadmap before moving to the next system.

## Technical notes
- Order placement, stock deduction and coupon use counts run in one database step through a server function, so they can't be changed from the browser.
- New customer data (addresses, wishlist, rewards) is stored in tables locked to its owner.
- Google sign-in goes through the built-in sign-in service, configured in the same step.
