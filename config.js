exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ? 
                      'mongodb://admin:admin@ds161190.mlab.com:61190/fullstack-capstone-yummly':
                         'mongodb://admin:admin@ds161190.mlab.com:61190/fullstack-capstone-yummly');
exports.PORT = 3000;