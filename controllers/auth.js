const bcrypt = require('bcrypt');
const db = require("./dbconnect");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (!results) {
                res.status(401).render('login', {
                    message: 'Email or password is incorrect'
                })
            }
            try {
                if (await (bcrypt.compare(password, results[0].password))) {
                    if (results[0].id === 1) {
                        req.session.admin = results;
                        res.redirect("/dashboard");
                    }
                    else {
                        req.session.user = results;
                        res.redirect("/logeduser");
                    }
                }else{
                    res.status(401).render('login', {
                        message: 'Email or password is incorrect'
                    })
                }
            } catch{
                res.status(401).render('login', {
                    message: 'Email or password is incorrect'
                })
            }
        })
    } catch (error) {
        console.log(error);
    }
}

exports.register = (req, res) => {
    const { username, email, password, repassword } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (username == '' || email == '' || password == '') {
            return res.render('register', {
                message: 'Fields cannot be empty'
            })
        }
        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is  already in use'
            })
        } else if (password !== repassword) {
            return res.render('register', {
                message: 'Passwords must be the same'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query('INSERT INTO users SET ?', { username: username, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                return res.render('register', {
                    message: 'User registered. You can login now'
                })
            }
        });
    });
}