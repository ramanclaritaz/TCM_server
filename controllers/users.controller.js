var _service = require('../services/users.service')
var validateErr = require('../utils/validateError');

_this = this

exports.get = async function (req, res, next) {

    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;

    try {
        var lists = await _service.get({}, page, limit);              

        return res.status(200).json({
            status: 200,
            success: true,
            data: lists,
            message: "Succesfully Recieved"
        });

    } catch (e) {
        var err = await validateErr.validateError(e);
        return res.status(400).json({
            status: 400,
            success: false,
            message: err
        });

    }
}

exports.create = async function (req, res, next) {
    var record = {
        title: req.body.first,
        description: req.body.description,
        status: req.body.status
    }

    try {
        var createdRecord = await _service.create(record)
        return res.status(201).json({
            status: 201,
            success: true,
            data: createdRecord,
            message: "Succesfully Created "
        })
    } catch (e) {
        var err = await validateErr.validateError(e);
        return res.status(400).json({
            status: 400,
            success: false,
            message: err
        })
    }
}

exports.update = async function (req, res, next) {
    if (!req.body._id) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Id must be present"
        })
    }

    var id = req.body._id;
    console.log(req.body)
    var record = {
        id,
        title: req.body.title ? req.body.title : null,
        description: req.body.description ? req.body.description : null,
        status: req.body.status ? req.body.status : null
    }

    try {
        var updatedRecord = await _service.update(record)
        return res.status(200).json({
            status: 200,
            success: true,
            data: updatedRecord,
            message: "Succesfully Updated Record"
        })
    } catch (e) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: e.message
        })
    }
}

exports.remove = async function (req, res, next) {
    var id = req.params.id;
    try {
        var deleted = await _service.delete(id)
        return res.status(204).json({
            status: 204,
            success: true,
            data: deleted,
            message: "Succesfully Todo Deleted"
        })
    } catch (e) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: e.message
        })
    }

}