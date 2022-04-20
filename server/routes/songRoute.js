const express = require('express');
const songController = require('../controllers/songController');

const router = express.Router();
router.use((req, res, next) => {
    if(!req.headers.token)
     res.sendStatus(401);
    next();
})

router.get('/getAll', songController.getSongs);
router.get('/:userId/getMySongs', songController.getMySongs);
router.delete('/:id/:userId/deletePlayListItem', songController.deleteById);
router.post('/addSongInPlaylist', songController.addSongInPlaylist);
 
module.exports = router;