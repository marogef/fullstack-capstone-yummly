exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ? 
                      'mongodb://localhost/node-capstone-shoppers-guide-bestbuy':
                         'mongodb://localhost/node-capstone-shoppers-guide-bestbuy');
exports.PORT = 3000;