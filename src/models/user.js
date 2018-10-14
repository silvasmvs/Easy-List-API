const db = require('./index');

const User = db.sequelize.define('User', {
    name: db.Sequelize.STRING,
    email: db.Sequelize.STRING,
    password: db.Sequelize.STRING
});

/*db.sequelize.sync()
  .then(() => User.create({
    name: 'Mauricio',
    email: 'junior14_santos@hotmail.com',
    password: '12345',
    token: "123"
  }))
  .then(user => {
    console.log(user.toJSON());
});*/
  
module.exports =  User;






