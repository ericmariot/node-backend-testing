import { getHours, isBefore, startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

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
  user_id: string;
  date: Date;
}

// Dependency Inversion (SOLID)
// receber o appointmentsRepository como um parametro da nossa classe, do constructor
// facilita para independente de quantos services diferentes, todos utilizam o mesmo repositório de service

@injectable()
class CreateAppointmentService {
  constructor (
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository) {}

  public async execute({ date, provider_id, user_id }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date.");
    }

    if(user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself.");
    }

    if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You can only create appointments between 8~17.');
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate);

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
      // return response.status(400).json({ message: 'This appointment is already booked' });
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
