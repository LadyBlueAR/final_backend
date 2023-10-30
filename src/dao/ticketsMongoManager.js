import { ticketModel } from '../dao/mongo/models/ticket.model.js';

export default class TicketsMongoManager {
  async findAll() {
    try {
      const tickets = await ticketModel.find();
      return tickets;
    } catch (error) {
      throw new Error(`Error al buscar los tickets en la base de datos: ${error}`);
    }
  }

  async findById(ticketId) {
    try {
      const ticket = await ticketModel.findById(ticketId);
      if (!ticket) {
        throw new Error('Ticket inexistente');
      }
      return ticket;
    } catch (error) {
      throw new Error(`Error al obtener el ticket: ${error}`);
    }
  }

  async create(code, purchase_datetime, amount, purchaser) {
    try {
      const result = await ticketModel.create(code, purchase_datetime, amount, purchaser);
      return result;
    } catch (error) {
      throw new Error(`Error al crear el ticket: ${error}`);
    }
  }
}
