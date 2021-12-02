const Form = require('../models/form');
const FormStep = require('../models/form_step');
const utils = require('../helpers/utils');

module.exports = {
    createForm: async (req, res) => {

        try {
            let proceed = true;
            const { title, details } = req.body;
            const { usertoken, sessiontoken } = req.headers;


            if (await utils.authinticate(usertoken, sessiontoken) === false) {
                proceed = false;
                res.send({
                    "type": "error",
                    "data": {
                        "msg": "Mismatched !"
                    },
                })
            }

            if (proceed) {
                let newForm = await Form.create({
                    "token": utils.makeToken({
                        "label": "CT"
                    }),
                    "title": title,
                    "details": details,
                    "status": "Active",
                    "existence": 1,
                    "createdBy": usertoken,
                    "sessionToken": sessiontoken,

                });

                let newFormStep = await FormStep.create({
                    "token": utils.makeToken({
                        "label": "CT"
                    }),
                    "formToken": newForm.token,
                    "title": "",
                    "details": "",
                    "previousStepToken": "",
                    "nextStepToken": "",
                    "status": "Active",
                    "existence": 1,
                    "createdBy": usertoken,
                    "sessionToken": sessiontoken,
                });

                res.send({
                    "type": "success",
                    "data": {
                        "New form": newForm,
                        "New From step": newFormStep
                    }
                });
            }
            
        } catch (error) {

            console.log(error);
            res.send({
                "type": "error",
                "data": error
            });
        }


        // console.log(username, password, firstName, lastName, birthDate);

    },
    createFormStep: async (req, res) => {

        try {
            let proceed = true;
            const { title, details } = req.body;
            const { usertoken, sessiontoken } = req.headers;


            if (await utils.authinticate(usertoken, sessiontoken) === false) {
                proceed = false;
                res.send({
                    "type": "error",
                    "data": {
                        "msg": "Mismatched !"
                    },
                })
            }

            if (proceed) {
                let newForm = await Form.create({
                    "token": utils.makeToken({
                        "label": "CT"
                    }),
                    "title": title,
                    "details": details,
                    "status": "Active",
                    "existence": 1,
                    "createdBy": usertoken,
                    "sessionToken": sessiontoken,

                });
                res.send({
                    "type": "success",
                    "data": newForm
                });
            }
            
        } catch (error) {

            console.log(error);
            res.send({
                "type": "error",
                "data": error
            });
        }


        // console.log(username, password, firstName, lastName, birthDate);

    }
}