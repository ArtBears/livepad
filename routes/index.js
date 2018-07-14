var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var path  = require('path');

router.get('/', (req, res, next) => {
	res.render('index');
});

router.get('/sample', (req, res, next) => {
    res.render('sample');
});

router.get( '/sample/:type', (req, res, next) => {
    var sound = req.params.type;
    var sound_path = appRoot + '/public/audio/Samples1/' + sound;
    res.sendFile(sound_path);
});

module.exports = router;
