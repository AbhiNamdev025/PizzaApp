const express = require("express");

const taskModel = require("../../../Model/TaskModel/taskSchema");

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedTask = await taskModel.Task.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );
    console.log(updatedTask);
    res.json(updatedTask);
  } catch (err) {
    res.json("Error in updating task", err);
  }
};
