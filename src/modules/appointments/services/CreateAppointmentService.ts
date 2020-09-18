import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

// service nunca tem acesso a requisição e resposta, das variáveis do express por exemplo
/**
 * Recebimento das informações
 * Tratativa de erros/exceções
 * Acesso ao repositório de appointments
 */

interface IRequest {
  provider_id: string;
  date: Date;
}

// Dependency Inversion (SOLID)
// receber o appointmentsRepository como um parametro da nossa classe, do constructor
// facilita para independente de quantos services diferentes, todos utilizam o mesmo repositório de service

class CreateAppointmentService {
  constructor (
    private appointmentsRepository: IAppointmentsRepository) {}

  public async execute({ date, provider_id }: IRequest): Promise<Appointment> {

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate);

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
      // return response.status(400).json({ message: 'This appointment is already booked' });
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
