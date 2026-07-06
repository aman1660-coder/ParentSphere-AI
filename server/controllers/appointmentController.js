import Appointment from '../models/Appointment.js';

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = async (req, res, next) => {
  try {
    const { counsellorId, date, time, notes } = req.body;

    const appointment = await Appointment.create({
      userId: req.user._id,
      counsellorId,
      date,
      time,
      notes,
    });

    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments/myappointments
// @access  Private
export const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id }).populate('counsellorId', 'name image specialization fee');
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};
