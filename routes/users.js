var express = require('express');
var router = express.Router();

/* GET users listing. */
/*
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/

// GET UserList
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({},{}, function(e, docs) {
        res.json(docs);
    });
});

// POST to add user
router.post('/adduser', function(req,res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.insert(req.body, function(err, result) {
        res.send(
            // return '' if good, err if bad
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

// DELETE to delete user
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToDelete = req.params.id;

    collection.remove({ '_id': userToDelete }, function(err) {
        res.send((err === null) ? { msg: ''} : { msg: 'Error: ' + err });
    });
});

// PUT to edit user
router.put('/edituser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToEdit = req.params.id;

    collection.update({ '_id': userToEdit }, req.body, function(err) {
        res.send((err === null) ? { msg: ''} : { msg: 'Error: ' + err });
    });
});

module.exports = router;
