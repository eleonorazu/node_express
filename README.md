here is the first part of home work (without Postgre SQL DB implementation):

Detailed Design. Sukurti pagal plana Restorano Valdymo sistema naudojant Node.js, express, kaip serverį ir įkelti į github

Duotos salygos.

User Service: id, name, email, password, phone number, address, orders: [orderId]

Nebūtina:

Role: The user's role in the system. This could be a customer, an employee, or an admin.

Read User: Uses a GET API to fetch all user details .

Create User: Uses a POST API to accept user details. The user details are stored in the json file.

- The fields to validate include 'id' (must be an integer), 'name' (must not be empty), 'email' (must be a valid email), 'password' (must be at least 5 characters), 'phone' (must be a valid phone number), and 'address' (must not be empty)

Login User: Uses a POST API to log in the user.

- session should be created for the user using express-session and the API should return a 200 status code. If the user credentials are incorrect, the API should return a 401 status code.

Log out User: Uses a POST API to log out from the site.

- Session should be implement to to destroy a user session

Read User: Uses a GET API to fetch user details based on user ID.

Update User: Uses a PUT API to update user details based on user ID.

Delete User: Uses a DELETE API to remove a user from the database based on user ID.

Menu Service : id, name, description, price, and category (appetizer, main course, dessert).

Read Menu Items: Uses a GET API to fetch all menu items.

Create Menu Item: Uses a POST API to accept menu item details. The menu item details are stored in the JSON file.

Read Menu Item: Uses a GET API to fetch menu item details based on item ID.

Update Menu Item: Uses a PUT API to update menu item details based on item ID.

Delete Menu Item: Uses a DELETE API to remove a menu item from the JSON file based on item ID.

Order Service: id, customerId, Items: [menuItemId, quantity]

Nebūtina:

Total: The total price of the order. This could be calculated as the sum of the prices of the MenuItems in the order, each multiplied by its quantity.

Status: The current status of the order. This could be a string with values like 'placed', 'preparing', 'ready', 'served', 'paid',

Order Time: The time when the order was placed. This could be automatically set to the current time when the order is created.

Create Order for a User: Uses a POST API to accept order details. The order details, including the user ID and the IDs and quantities of the ordered menu items, are stored in the database.

- Session should check if the user logged and can make a order based on user session ID

Read Orders for a User: Uses a GET API to fetch all orders for a specific user. The user ID is provided as a parameter, and the API returns all orders that have this user ID.

Read Order for a User: Uses a GET API to fetch the details of a specific order for a specific user. The user ID and the order ID are provided as parameters, and the API returns the order if it belongs to the user.

Delete Order for a User: Uses a DELETE API to remove a specific order for a specific user from the database. The user ID and the order ID are provided as parameters, and the API deletes the order if it belongs to the user.
