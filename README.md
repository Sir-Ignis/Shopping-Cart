# Shopping Cart

This is a Vanilla JS implementation of a Shopping Cart. Currently, there are three implementations one using flex boxes and two which use grids. Cookies are used to store item data and requests are sent and received using JSON in the flex box implementation. localStorage is used to store item data in the grid implementation.

The Basket-Grid implementation is the most advanced version with
shop items have "addons" and all basket states being remembered as they are stored in localStorage. To test the Basket-Grid simply
invoke `addItem(n), where 0 ≤ n ≤ 2`.
