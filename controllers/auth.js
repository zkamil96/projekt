const bcrypt = require('bcrypt');
const db = require("./dbconnect");
const users = require('./users');

exports.login = async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('login', {
                message: 'Please provide an email and password'
            })
        }
        users.findOne({email: email}).then(result => {
            if (!result) {
                res.render('login', {
                    message: 'Email or password is incorrect'
                })
            }
            try{
            if(bcrypt.compare(password, result.password)){
                if (result._id == '5edba229b7d0bb3e986ed6f1') {
                    req.session.admin = result;
                    res.redirect("/dashboard");
                }else {
                    req.session.user = result;
                    res.redirect("/logeduser");
                }
            } else {
                res.render('login', {
                    message: 'Email or password is incorrect'
                })
            }
        }catch{
            res.render('login', {
                message: 'Email or password is incorrect'
            })
        }
        })
}

exports.register = (req, res) => {
    const { username, email, password, repassword } = req.body;
  
    if (!username || !email || !password || !repassword) {
        return res.render('register', {
            message: 'Fields cannot be empty'
        });
    }
  
    if (password != repassword) {
        return res.render('register', {
            message: 'Passwords must be the same'
        });
    }
      users.findOne({ email: email }).then(result => {
        if (result) {
            return res.render('register', {
                message: 'That email is  already in use'
            });
        } else {
          const user = new users({
            username,
            email,
            password
          });
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;
              user.save()
                .then(result => {
                    return res.render('register', {
                        message: 'User registered. You can login now'
                    });
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
}