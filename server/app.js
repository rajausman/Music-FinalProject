const express = require('express');
const userRouter = require('./routes/userRoute');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRouter);

app.use((req, res, next) => {
    res.status(404).json({ error: req.url + ' API not supported!' });
});

app.use((err, req, res, next) => {
    console.log(err)
    if (err.message === 'NOT Found') {
        res.status(404).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'Something is wrong! Try later' });
    }
});

app.listen(4000, () => console.log('listening to 4000...'));