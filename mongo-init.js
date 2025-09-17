// Initialize the database with a user and collections
db = db.getSiblingDB('bloodconnect');

db.createUser({
  user: 'bloodconnect_user',
  pwd: 'your_secure_password',
  roles: [
    { role: 'readWrite', db: 'bloodconnect' },
    { role: 'dbAdmin', db: 'bloodconnect' }
  ]
});

// Create collections and initial data if needed
db.createCollection('users');
db.createCollection('bloodrequests');
db.createCollection('donations');
db.createCollection('notifications');

console.log('MongoDB initialized');
