const Form = require('../models/form');
const FormStep = require('../models/form_step');
const FormItem = require('../models/formItem');
const ItemOption = require('../models/itemOption');
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
    },
    createFormStep: async (req, res) => {

        try {
            let proceed = true;
            const { formToken, title, details } = req.body;
            const { usertoken, sessiontoken } = req.headers;

            let token = utils.makeToken({
                "label": "CT"
            });

            if (await utils.authinticate(usertoken, sessiontoken) === false) {
                proceed = false;
                res.send({
                    "type": "error",
                    "data": {
                        "msg": "Mismatched !"
                    },
                })
            }

            let checkForm = await Form.find({
                "token": formToken,
                "status": "Active",
                "existence": 1
            });

            console.log(checkForm);
            let findPreviousStep;

            if (checkForm.length === 1) {
                findPreviousStep = await FormStep.find({
                    formToken: formToken,
                    status: "Active",
                    existence: 1
                }).sort({ "createdAt": "desc" }).limit(1).exec();
            }

            if (findPreviousStep.length !== 1) {
                proceed = false;
                res.send({
                    "type": "error",
                    "data": {
                        "msg": "step error"
                    },
                })
            }

            // let updatePreviousStep = await FormStep.findOneAndUpdate(
            //     {_id : findPreviousStep[0]._id},
            //     {'$set': {nextStepToken : newFormStep.token}},{new : true}
            // );

            if (proceed) {

                let newFormStep = await FormStep.create({
                    "token": token,
                    "formToken": formToken,
                    "title": title,
                    "details": details,
                    "previousStepToken": findPreviousStep[0].token,
                    "nextStepToken": "",
                    "status": "Active",
                    "existence": 1,
                    "createdBy": usertoken,
                    "sessionToken": sessiontoken,
                });

                await FormStep.findOneAndUpdate(
                    { "token": findPreviousStep[0].token },
                    {
                        $set: {
                            "nextStepToken": token
                        }
                    },
                    { new: true }
                )




                res.send({
                    "type": "success",
                    "data": newFormStep
                });
            }

        } catch (error) {
            console.log(error);
            res.send({
                "type": "error",
                "data": error
            });
        }
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

            if (utils.inputTypes.includes(inputType) === false) {
                proceed = false;
                res.send({
                    "type": "error",
                    "data": {
                        "msg": "Input types error"
                    },
                })
            }

            let checkStepAndUser = await FormStep.find({
                "token": stepToken,
                "formToken": formToken,
                "createdBy": usertoken,
            });

            if (checkStepAndUser.length !== 1) {
                proceed = false;
                res.send({
                    type: "error",
                    data: {
                        message: "Oops! Invalid Input",
                    },
                });
            }

            if (proceed) {
                let totalCount = await FormItem.find({
                    "formToken": formToken,
                    "stepToken": stepToken,
                });
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
                    "positionKey": totalCount.length + 1,
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
    },

    editForm: async (req, res) => {
        try {
            let proceed = true;
            const { token, title, details } = req.body;
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

            let checkFormWithUser = await Form.find({
                "token": token,
                "createdBy": usertoken,
            });

            if (checkFormWithUser.length !== 1) {
                proceed = false;
                res.send({
                    type: "error",
                    data: {
                        message: "Oops! Not your form",
                    },
                });
            }
            if (proceed) {
                updatedForm = await Form.findOneAndUpdate(
                    { 'token': token },
                    {
                        $set: {
                            'title': title,
                            'details': details
                        }
                    },
                    { new: true }
                );
                res.send({
                    "type": "success",
                    "data": updatedForm
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                "type": "error",
                "data": error
            });
        }
    },

    newOption: async (req, res) => {
        try {
            let proceed = true;
            const { formToken, stepToken, itemToken, itemType, data } = req.body;
            const { usertoken, sessiontoken } = req.headers;

            if (await utils.authinticate(usertoken, sessiontoken) === false) {
                proceed = false;
                res.send({
                    "type": "error",
                    "data": {
                        "msg": "auth failed !"
                    },
                })
            }

            let checkFormWithUser = await FormItem.find({
                "token": itemToken,
                "formToken": formToken,
                "stepToken": stepToken,
            });

            if (checkFormWithUser.length !== 1) {
                proceed = false;
                res.send({
                    type: "error",
                    data: {
                        message: "Oops! Not your form",
                    },
                });
            }

            let otherList = [];

            for (let i = 0; i < data.length; i++) {
                if (data[i].titleType == "Others") {
                    otherList.push(i);
                }

            }

            if (otherList.length === 1) {
                let lastIndex = data.length - 1;
                if (otherList[0] !== lastIndex) {
                    proceed = false;
                    res.send({
                        "type": "error",
                        "data": "others not in last position"
                    });
                }
            } else {
                proceed = false;
                res.send({
                    "type": "error",
                    "data": "multiple others error"
                });
            }



            if (proceed) {
                let newItemOption;
                for (let i = 0; i < data.length; i++) {
                    newItemOption = await ItemOption.create({
                        "token": utils.makeToken({
                            "label": "OPT_"
                        }),
                        "formToken": formToken,
                        "stepToken": stepToken,
                        "itemToken": itemToken,
                        "title": data[i].title,
                        "itemType": itemType,
                        "titleType": data[i].titleType,
                        "status": "Active",
                        "existence": 1,
                        "createdBy": usertoken,
                        "sessionToken": sessiontoken,
                    });
                }
                res.send({
                    "type": "success",
                    "data": newItemOption
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                "type": "error",
                "data": error
            });
        }
    },

    itemUpdate: async (req, res) => {
        try {
            let proceed = true;
            const { formToken, stepToken, data } = req.body;
            const { usertoken, sessiontoken } = req.headers;

            if (await utils.authinticate(usertoken, sessiontoken) === false) {
                proceed = false;
                res.send({
                    "type": "error",
                    "data": {
                        "msg": "auth failed !"
                    },
                })
            }

            // let checkFormWithUser = await FormItem.find({
            //     "token": itemToken,
            //     "formToken": formToken,
            //     "stepToken": stepToken,
            // });

            // if (checkFormWithUser.length !== 1) {
            //     proceed = false;
            //     res.send({
            //         type: "error",
            //         data: {
            //             message: "Oops! Not your form",
            //         },
            //     });
            // }

            // let otherList = [];

            // for (let i = 0; i < data.length; i++) {
            //     if (data[i].titleType == "Others") {
            //         otherList.push(i);
            //     }

            // }

            // if (otherList.length === 1) {
            //     let lastIndex = data.length - 1;
            //     if (otherList[0] !== lastIndex) {
            //         proceed = false;
            //         res.send({
            //             "type": "error",
            //             "data": "others not in last position"
            //         });
            //     }
            // } else {
            //     proceed = false;
            //     res.send({
            //         "type": "error",
            //         "data": "multiple others error"
            //     });
            // }



            if (proceed) {
                let newItemOption;
                for (let i = 0; i < data.length; i++) {
                    newItemOption = await FormItem.findOneAndUpdate(
                        {
                            "token": data[i].itemToken,
                            "formToken": formToken,
                            "stepToken": stepToken,
                            "createdBy": usertoken,
                        },
                        {
                            $set: {
                                'positionKey': data[i].positionKey
                            }
                        },
                        { new: true }
                    )
                }
                res.send({
                    "type": "success",
                    "data": newItemOption
                });
            }
        } catch (error) {
            console.log(error);
            res.send({
                "type": "error",
                "data": error
            });
        }
    },

    getForm: async (req, res) => {
        try {
            let proceed = true;
            const { formtoken, steptoken } = req.params;

            let results = [];

            

            // @checkStep
            let checkstep = await FormStep.find({
                "token": steptoken,
                "formToken": formtoken,
                'status' : "Active",
                'existence' : 1

            });

            let stepObject = checkstep[0];

            if(checkstep.length === 1) {

                // @ get items

                let items = await FormItem.find({
                    'stepToken' : steptoken,
                    'formToken' : formtoken,
                    'status' : "Active",
                    'existence' : 1
                });

                for(let i = 0; i < items.length; i++){
                    let thisItem = items[i];

                    let thisObject = {};

                    

                    // @get options if inputType "RadioButton", "Checkbox"

                    if(thisItem.inputType === "Radio" || "Checkbox"){

                        // @get options

                        let options = await ItemOption.find({
                            'formToken' : formtoken,
                            'stepToken' : steptoken,
                            'itemToken' : thisItem.token,
                            'status' : "Active",
                            'existence' : 1
                        });

                        thisObject.item = thisItem;
                        thisObject.option = options;
                        results.push(thisObject);


                    }
                    else{

                        thisObject.item = thisItem;
                        thisObject.option = [];
                        results.push(thisObject);

                    }
                }




            }
            res.send({
                type : "List Successfully Loaded",
                step : stepObject,
                data : results
            })

            
        } catch (error) {
            console.log(error);
            res.send({
                type: "error",
                data: error
            });
        }
    },
}