const db = require('./index');

const List = db.sequelize.define('List', {
  idUser : db.Sequelize.INTEGER,
  name: db.Sequelize.STRING,
  items: db.Sequelize.JSON
});

/*
db.sequelize.sync()
  .then(() => List.create({
    idUser: 2,
    name: 'List3',
    items: {
      name: "Trigo",
      price: 3.80,
      quantity: 2
    }
  }))
  .then(list => {
    console.log(list.toJSON());
});

*/
  
module.exports =  List;

