mongoimport --db HAIRBRB --collection users --file json_db/users.json --jsonArray --drop
mongoimport --db HAIRBRB --collection properties --file json_db/properties.json --jsonArray --drop
mongoimport --db HAIRBRB --collection bookings --file json_db/booking.json --jsonArray --drop
mongoimport --db HAIRBRB --collection offers --file json_db/offers.json --jsonArray --drop