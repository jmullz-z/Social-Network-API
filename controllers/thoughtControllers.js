  // delete Thought
  deleteThought({ params }, res); {
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No thought with this id!" });
        }

        // remove thought id from user's `thoughts` field
        return User.findOneAndUpdate(
          { thoughts: params.id },
          { $pull: { thoughts: params.id } }, //$pull removes from an existing values that match a specified condition.
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Thought created but no user with this id!" });
        }
        res.json({ message: "Thought successfully deleted!" });
      })
      .catch((err) => res.json(err));
  }
