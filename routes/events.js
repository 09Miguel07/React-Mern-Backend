/*events routes 
/api/events */

const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT } = require("../middlewares/validateJWT");
const { fieldValidator } = require("../middlewares/fieldValidators.js");
const { isDate } = require("../helpers/isDate.js");
const {
  getEvents,
  newEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/events");

const router = Router();

router.use(validateJWT);

router.get("/", getEvents);

router.post(
  "/",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Fecha de inicio es obligatoria").custom(isDate),
    check("end", "Fecha de finalizacion es obligatoria").custom(isDate),
    fieldValidator,
  ],
  newEvent
);

router.put("/:id", updateEvent);

router.delete("/:id", deleteEvent);

module.exports = router;
