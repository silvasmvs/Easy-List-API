const express = require('express');
const router = express.Router();
const List = require('../models/List');

//router.use(authMiddleware);

router.get('/', async (req, res) => {
    await List.findAll({
        raw: true,
        attributes: ['name','items']
    }).then(function (lists) {
        res.send(lists);
    });
});

router.get('/:id', async (req, res) => {
    await List.findAll({
        raw: true,
        where: { id: req.params.id },
        attributes: ['name', 'items']
    }).then(function (lists) {
        res.send(lists);
    });
});

router.get('/user/:id', async (req, res) => {
    await List.findAll({
        raw: true,
        where: { idUser: req.params.id },
        attributes: ['name', 'items']
    }).then(function (lists) {
        res.send(lists);
    });
});

router.post('/', async (req, res) => {
    const { name } = req.body;
    try {
        await List.findOrCreate({
            where: { name: name },
            defaults: {
                name: req.body.name,
                items: req.body.items
            }
        })
            .spread((list, created) => {
                if (created) {
                    res.send(list);
                }
                else
                    res.status(400).send({ error: 'List Already Exists' });
            });
    } catch (err) {
        res.status(400).send({ error: 'Registration Failed' });
    }
});


module.exports = app => app.use('/list' , router);