import TicketsMongoManager from "../dao/ticketsMongoManager.js";

class TicketsService {
  constructor() {
    this.dao = new TicketsMongoManager();
  }

  async createTicket(code, purchase_datetime, amount, purchaser) {
    try {
      return await this.dao.create(code, purchase_datetime, amount, purchaser);
    } catch (error) {
      throw new Error(`Error al crear el ticket: ${error.message}`);
    }
  }

  async getTicketById(ticketId) {
    try {
      return await this.dao.findById(ticketId);
    } catch (error) {
      throw new Error(`Error al buscar el ticket: ${error.message}`);
    }
  }

}

export default TicketsService;
