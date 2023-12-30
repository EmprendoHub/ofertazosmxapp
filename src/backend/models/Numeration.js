import mongoose from 'mongoose';

const NumerationSchema = new mongoose.Schema({
  number: [
    {
      num: {
        type: String,
        require: true,
        unique: true,
      },
      winner: {
        type: Boolean,
        default: false,
      },
      picked: {
        type: Boolean,
        default: false,
      },
      ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
      },
    },
  ],
  lottery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lottery',
  },
});

export default mongoose?.models?.Numeration ||
  mongoose.model('Numeration', NumerationSchema);
