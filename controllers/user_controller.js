const User = require('../models/user');
const Session = require('../models/session');
const argon2 = require('argon2');
const utils = require('../helpers/utils');
const session = require('../models/session');
const moment = require('moment');

module.exports = {
    createAccount: async (req, res) => {
        function checkEmail() {
            return true;
        }

        let proceed = true;
        const { username, password, firstName, lastName, birthDate } = req.body;
        const hashPass = await argon2.hash(password);
        let userCheck = await User.find({
            username: username
        });

        if (userCheck.length !== 0) {
            proceed = false;
            res.send({
                "type": "error",
                "data": {
                    "msg": "user already exist"
                }
            })
        }
        if (proceed) {
            let newUser = new User({
                "userToken": utils.makeToken({
                    "label": "user"
                }),
                "username": username,
                "password": hashPass,
                "firstName": firstName,
                "lastName": lastName,
                "birthDate": birthDate,
            });

            try {
                let newUserSave = await newUser.save();

                if (newUserSave) {
                    res.send(
                        {
                            "type": "success",
                            "data": newUser
                        }
                    )
                } else {
                    res.send(
                        {
                            "type": "fail",
                            "data": "not added"
                        }
                    )

                }
                console.log(userCheck);
            } catch (e) {
                res.send(
                    {
                        "type": "fail $e",
                        "data": e
                    }
                )
            }
        }


        // console.log(username, password, firstName, lastName, birthDate);

    },

    login: async (req, res) => {
        try {
            let proceed = true;
            const { username, password } = req.body;

            let checkUser = await User.find(
                {
                    username: username
                }
            );

            if (checkUser.length !== 1) {
                proceed = false;
                res.send({
                    "type": "error",
                    "data": {
                        "msg": "No user found"
                    }
                })
            } else {
                let checkPass = await argon2.verify(checkUser[0].password, password);
                // console.log(checkPass);

                if (checkPass === false) {
                    proceed = false;
                    res.send({
                        "type": "error",
                        "data": {
                            "msg": "Invalild pass"
                        }
                    })
                }
            }
            if (proceed) {

                let session = new Session(
                    {
                        "sessionToken": utils.makeToken({
                            "label": "sToken"
                        }),
                        "userToken": checkUser[0].userToken,
                        "ipAddress": req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                        "sessionEndedAt": "hi",
                    }
                );

                await session.save();

                res.send({
                    "type": "success",

                    "data": {
                        "msg": `Log in successfully as ${username}`,
                        "userToken": checkUser[0].userToken,
                        "sessionToken": session.sessionToken,
                    }
                })

            }
        } catch (e) {
            res.send(
                {
                    "type": "fail $e",
                    "data": e
                }
            )
        }
    },

    logout: async (req, res) => {
        try {
            let proceed = true;
            // const { postContent, postPrivacy } = req.body;
            const { usertoken, sessiontoken } = req.headers;

            if (await utils.authinticate(usertoken, sessiontoken) === false) {
                proceed = false;
                res.send({
                    "type": "error",
                    "data": {
                        "msg": "You are not logged in"
                    },
                })
            }

            if (proceed) {
                await Session.findOneAndUpdate(
                    { 'sessionToken': sessiontoken },
                    {
                        $set: {
                            'sessionEndedAt': moment.utc().format('YYYY-MM-DD HH:mm:ss')
                        }
                    },
                    { new: true }
                );

                res.send(
                    {
                        "type": "success",
                        "data": {
                            "msg": "You are logged out"
                        },
                    }
                )
            }
        } catch (error) {
            console.log(error);
        }
    }
}