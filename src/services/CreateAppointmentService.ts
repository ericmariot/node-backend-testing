import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

// service nunca tem acesso a requisição e resposta, das variáveis do express por exemplo
/**
 * Recebimento das informações
 * Tratativa de erros/exceções
 * Acesso ao repositório de appointments
 */

interface Request {
  provider_id: string;
  date: Date;
}

// Dependency Inversion (SOLID)
// receber o appointmentsRepository como um parametro da nossa classe, do constructor
// facilita para independente de quantos services diferentes, todos utilizam o mesmo repositório de service

class CreateAppointmentService {
  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate);

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
      // return response.status(400).json({ message: 'This appointment is already booked' });
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
