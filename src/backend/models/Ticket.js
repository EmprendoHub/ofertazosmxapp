import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  num: {
    type: String,
    require: true,
  },
  lottery: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'Lottery',
  },
  winner: {
    type: Boolean,
    default: false,
  },
  picked: {
    type: Boolean,
    default: false,
  },
  paid: {
    default: false,
    type: Boolean,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  numbers: [
    {
      num: {
        type: String,
      },
      lottery: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Lottery',
      },
      winner: {
        type: Boolean,
        default: false,
      },
      picked: {
        type: Boolean,
        default: false,
      },
    },
  ],
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  },
});

export default mongoose?.models?.Ticket ||
  mongoose.model('Ticket', TicketSchema);
