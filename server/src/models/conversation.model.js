import mongoose from 'mongoose';

// One conversation thread per user. The AI coach re-reads the recent
// messages on every request (sliding window) — Groq itself is stateless,
// so this collection IS the coach's memory.
const conversationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },

        messages: [
            {
                role: {
                    type: String,
                    enum: ['user', 'assistant'],
                    required: true,
                },

                content: {
                    type: String,
                    required: true,
                },

                at: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
