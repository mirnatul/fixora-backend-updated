export interface IBookingPayload {
    serviceId: string;
    bookingDate: Date;
    slot: number[];
    address: string;
    notes: string;
}