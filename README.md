# Shopping Cart

This is a collection of Vanilla JS implementations of a Shopping Carts. Currently, there are three implementations one using flex boxes and two which use grids.

## Basket Grid

The Basket-Grid implementation is the most advanced version with shop items having addons, and there being
a separate areas for viewing the shopping basket and checking out with PayPal.

#### Usage
To test the Basket-Grid simply invoke `addItem(n), where 0 ≤ n ≤ 2`.

#### Implementation
All data is stored in localStorage, for persistence, and the checkout button is implemented using the PayPal API.
With item data stored as JSON.
<br /><br />
# Other implementations


## Phone Grid
This grid implementation demonstrates the use of standardized container sizes. With the shop being responsive to screen size.

#### Implementation
Some data is stored in localStorage, allowing some persistence, with item data stored as JSON. All images are
square standardized, so they render well on all device sizes.
<br /><br />

## Flexbox
This implementation demonstrates the use of XML queries
in a flexbox grid. Also responsive to different screen sizes.

#### Implementation
Item data is stored as JSON and fetched using XML queries
and then stored using cookies. The bootstrap framework was
used for the column row flex layout.
