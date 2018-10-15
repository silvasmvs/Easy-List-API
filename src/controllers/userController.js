const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');
const User = require('../models/User');

function generateToken(params = {}) {
    return jwt.sign({ params }, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.get('/user', async (req, res) => {
    await User.findAll({
        raw: true,
        attributes: ['id','name', 'email']
    }).then(function (users) {
        res.send(users);
    });
});

router.get('/user/:id', async (req, res) => {
    await User.findOne({
        raw: true,
        where: { id: req.params.id },
        attributes: ['name', 'email']
    }).then(function (users) {
        res.send(users);
    });
});

router.post('/user', async (req, res) => {
    const { email } = req.body;

    await bcrypt.hash(req.body.password,10, (err, hash) => {
            try {
                 User.findOrCreate({
                    where: { email: email },
                    defaults: {
                        name: req.body.name,
                        password: hash
                    }
                })
                    .spread((user, created) => {
                        if (created) {
                            user.password = undefined;
                            res.send({
                                "name": user.name,
                                "email": user.email,
                                "token": generateToken({ id: user.id })
                            });
                        }
                        else
                            res.status(400).send({ error: 'User Already Exists' });
                    });
                
            } catch (err) {
                res.status(400).send({ error: 'Registration Failed' });
            }
        });

        
});

router.put('/user/:id', async (req, res) => {
    const { email } = req.body;
    const id = req.params.id;
    
    await bcrypt.hash(req.body.password,10, (err, hash) => {
        try {
            User.update({
                email: email,
                password: hash
            }, {
                where: {
                id: id
                }
            });
        
            User.findOne({
                raw: true,
                where: { id: id },
                attributes: ['name', 'email']
                }).then(function (users) {
                    res.send(users);
                });

        } catch (err) {
            res.status(400).send({ error: 'Update Failed' });
        }
    });
});


router.delete('/user/:id', function (req, res) {
    try {
        User.destroy({
            where: {
                id: req.params.id
            }
        });
    
        res.send({"info": "User has been Deleted"});

    } catch (err) {
        res.status(400).send({ error: 'Delete Failed' });
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    await User.findOne({
        raw: true,
        where: { email: email },
        attributes: ['name', 'email', 'password']
    }).then(function (user) {
        if (!user)
            return res.status(400).send({ error: 'User not Found' });

        bcrypt.compare(password, user.password, function (error, response) {
            if (!response)
                return res.status(400).send({ error: 'Invalid password' });
            else
                res.send({
                    "name": user.name,
                    "email": user.email,
                    "token": generateToken({ id: user.id })
                });
        });
    });
});


module.exports = app => app.use('/', router);