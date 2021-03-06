const express = require('express');
const db = require("../controllers/dbconnect");
const users = require('../controllers/users');
const cars = require('../controllers/cars');
const router = express.Router();



router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/logeduser');
    } else if (req.session.admin) {
        res.redirect('/dashboard');
    }
    else {
        res.render('index');
    }
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});


router.get('/logeduser', (req, res) => {
    let user = req.session.user;
    if (user) {
        res.render('logeduser');
        return;
    }
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    if (req.session.user || req.session.admin) {
        req.session.destroy(function () {
            res.redirect('/')
        });
    }
});

router.get('/dashboard', (req, res) => {
    let user = req.session.admin;
    if (user) {
        users.find({}, function(err, result) {
            res.render('dashboard',{
                userslist: result
            });
         });
    }
    else {
        res.redirect('/');
    }
});

router.get('/cardescription', (req, res) => {
    let user = req.session.user;
    if (user){
        cars.find({}, function(err, result) {
            res.render('cardescription',{
                carlist: result
            });
         });
    }
    else {
        res.redirect('/');
    }
});

module.exports = router;