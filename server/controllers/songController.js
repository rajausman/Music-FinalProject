const Song = require('../models/song');

exports.getSongs = (req, res, next) => {
    console.log("songs headers", req.headers)
    res.status(200).json(Song.fetchAll());
}

exports.deleteById = (req, res, next) => {
   
    Song.deleteById(req.params.id, req.params.userId);
    res.status(200).end();
}

exports.addSongInPlaylist = (req, res, next) => {
    const  request = req.body;
    const updatedSong = Song.addSongs(request);
    res.status(200).json(updatedSong);
}

exports.getMySongs = (req, res, next) => {
    const songList = Song.fetchAllMyPlayList(req.params.userId);
    res.status(200).json(songList);
}

