const express = require('express');
const router = express.Router();
const List = require('../models/List');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/list/', async (req, res) => {
    await List.findAll({
        raw: true,
        attributes: ['name','items']
    }).then(function (lists) {
        res.send(lists);
    });
});

router.get('/list/user/:id', async (req, res) => {
    await List.findAll({
        raw: true,
        where: { idUser: req.params.id },
        attributes: ['name', 'items']
    }).then(function (lists) {
        res.send(lists);
    });
});

router.post('/list', async (req, res) => {
    const { name } = req.body;
    try {
        await List.findOrCreate({
            where: { name: name },
            defaults: {
                idUser: req.body.idUser,
                name: req.body.name,
                items: req.body.items
            }
        })
            .spread((list, created) => {
                if (created) {                    
                    res.send({
                        "idUser": list.idUser,
                        "name": list.name,
                        "items": list.items
                    });
                }
                else
                    res.status(400).send({ error: 'List Already Exists' });
            });
    } catch (err) {
        res.status(400).send({ error: 'Registration Failed' });
    }
});

router.put('/list/:id', async (req, res) => {
    const { name } = req.body;
    const id = req.params.id;

    try {
        await List.update({
            name: name,
            items: req.body.items
        }, {
            where: {
            id: id
            }
        });
    
        List.findOne({
            raw: true,
            where: { id: id },
            attributes: ['name', 'items']
            }).then(function (list) {
                res.send({
                    "idUser": list.idUser,
                    "name": list.name,
                    "items": list.items
                });
            });

    } catch (err) {
        res.status(400).send({ error: 'Update Failed' });
    }

});


router.delete('/list/:id', function (req, res) {
    try {
        List.destroy({
            where: {
                id: req.params.id
            }
        });
    
        res.send({"info": "List has been Deleted"});

    } catch (err) {
        res.status(400).send({ error: 'Delete Failed' });
    }
});


module.exports = app => app.use('/' , router);