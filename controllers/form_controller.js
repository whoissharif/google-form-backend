const Form = require('../models/form');
const FormStep = require('../models/form_step');
const FormItem = require('../models/formItem');
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

    },

    createFormItem: async (req, res) => {

        try {
            let proceed = true;
            const { formToken, stepToken, image, title, inputType } = req.body;
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

            if(utils.inputTypes.includes(inputType) === false){
                proceed = false;
                res.send({
                    "type": "error",
                    "data": {
                        "msg": "Input types error"
                    },
                })
            }


            if (proceed) {

                let newFormItem = await FormItem.create({
                    "token": utils.makeToken({
                        "label": "F_ITEM_T"
                    }),
                    "formToken": formToken,
                    "stepToken": stepToken,
                    "image": image,
                    "title": title,
                    "inputType": inputType,
                    "required": 1,
                    "status": "Active",
                    "existence": 1,
                    "createdBy": usertoken,
                    "sessionToken": sessiontoken,

                });
                res.send({
                    "type": "success",
                    "data": newFormItem
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