const app = require('express').Router();
const { User } = require('../../models')

app.post('/', ({ body }, res) => {
    User.create(body)
        .then(dbUser => {
            res.json(dbUser);
        })
        .catch(err => {
            res.json(err);
        });
});


app.get('/', (req, res) => {
    User.find()
        .then(dbUserData => {
            console.log(dbUserData)
            res.json(dbUserData);
        })
        .catch(err => {
            res.json(err);
        });
});

app.get('/:id', ({ params }, res) => {
    User.findOne({ _id: params.id })
    .select('-__v')
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No data found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err)
    })
});

app.put('/:id', ({ params, body }, res) => {
    User.findOneAndUpdate({ _id: params.id }, body, { runValidators: true, new: true })
    .then(dbUserData => {
        if (!dbUserData) {
            return res.status(404).json({ message: 'No user with this id!' });
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

});

app.delete('/:id', ({ params }, res) => {
    User.findOneAndDelete({ _id: params.id }).then(dbUserData => {
        if (!dbUserData) {
            return res.status(404).json({ message: 'No user with this id!' });
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

app.post('/:id/friends/:friendId', ({ params }, res) => {
    User.findOneAndUpdate(
        { _id: params.id },
        { $push: { friends: params.friendId } },
        { new: true }
      )
      .select('-__v')
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(400).json({ message: 'No user found with this id. '});
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
});

app.delete('/:id/friends/:friendId', ({ params }, res) => {
    User.findOneAndUpdate(
        { _id: params.id },
        { $pull: { friends: params.friendId } },
        { new: true }
      )
      .select('-__v')
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(400).json({ message: 'No user found with this id.' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
});

module.exports = app