const { response } = require("express");

const Event = require("../models/Event.model.js");

const getEvents = async (req, res = response) => {
  const events = await Event.find().populate("user", "name");

  res.json({
    ok: true,
    msg: events,
  });
};
const newEvent = async (req, res = response) => {
  const evento = new Event(req.body);

  try {
    evento.user = req.uid;

    const savedEvent = await evento.save();

    res.json({
      ok: true,
      evento: savedEvent,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }

  res.json({
    ok: true,
    msg: "Nuevo evento",
  });
};
const updateEvent = async (req, res = response) => {
  const idEvent = req.params.id;

  try {
    const event = await Event.findById(idEvent);

    if (!event)
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe",
      });

    if (event.user.toString() !== req.uid)
      return res.status(401).json({
        ok: false,
        msg: " No tiene permisos para editar",
      });

    const newEvent = {
      ...req.body,
      user: req.uid,
    };

    const updatedEvent = await Event.findByIdAndUpdate(idEvent, newEvent, {
      new: true,
    });

    res.status(201).json({
      ok: true,
      evento: updatedEvent,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const deleteEvent = async (req, res = response) => {
  const idEvent = req.params.id;

  try {
    const event = await Event.findById(idEvent);

    if (!event)
      return res.status(401).json({ ok: false, msg: "Evento no existe" });

    if (event.user.toString() !== req.uid)
      return res.status(401).json({
        ok: false,
        msg: " No tiene permisos para eliminar",
      });

    await Event.findByIdAndDelete(idEvent);

    res.status(201).json({
      ok: true,
      msg: "eliminado con exito",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getEvents,
  newEvent,
  updateEvent,
  deleteEvent,
};
