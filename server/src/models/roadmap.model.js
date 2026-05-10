import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },

        title: {
            type: String,
            required: true,
        },

        duration: {
            type: String,
            required: true,
        },

        progress: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            default: 'Not Started',
        },

        phases: [
            {
                phase: Number,

                title: String,

                tasks: [
                    {
                        task: String,

                        completed: {
                            type: Boolean,
                            default: false,
                        },

                        resources: [String],
                    },
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

export default Roadmap;