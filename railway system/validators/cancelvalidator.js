import JOI from 'joi'

export const cancelSchema=JOI.object({
    bookingId:JOI.number().required()
});