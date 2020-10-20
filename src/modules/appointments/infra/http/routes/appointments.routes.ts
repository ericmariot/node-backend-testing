import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

// Rota: Receber a requisição, chamar outro arquivo, devolver uma resposta
// Condições a mais do que a acima provavelmente será preciso abstrair em um service
// SoC: Separation of Concerns
// Regra de negócio: Algo que está muito específico na aplicação

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

// aplicar este middleware em todas as rotas de agendamento
appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
  '/',
  celebrate({
  [Segments.BODY]: {
    provider_id: Joi.string().uuid().required(),
    date: Joi.date(),
  },
}),
appointmentsController.create);

appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
