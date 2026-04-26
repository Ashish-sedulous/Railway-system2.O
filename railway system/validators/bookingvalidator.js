import JOI from 'joi';

export const bookingSchema=JOI.object({
    userId:JOI.number().required(),
    scheduleId:JOI.number().required()
});

