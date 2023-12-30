import mongoose from 'mongoose';

const ParticipantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  },
  tickets: [
    {
      ticket: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Ticket',
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    default: true,
    type: Boolean,
  },
});

export default mongoose?.models?.Participant ||
  mongoose.model('Participant', ParticipantSchema);
