interface ShipmentData {
    guide: string;
    addressee: string;
    shippingCost: string;
    box: string;
    packageNumber: string;
    deliverTo: string;
    intakeDate: string | null;
    status: string | null;
    returnDate: string | null;
    deliveryDate: string | null;
    courierAttempt1: string | null;
    courierAttempt2: string | null;
    courierAttempt3: string | null;
    [key: string]: string | null; // Firma de índice
}