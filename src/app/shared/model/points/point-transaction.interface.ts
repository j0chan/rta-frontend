export enum PointTransactionType {
    EARN = 'EARN',
    USE = 'USE',
}

export interface PointTransaction {
    point_transaction_id: number;
    type: PointTransactionType; // EARN | USE
    amount: number;             // 항상 양수(부호는 type으로 구분)
    reason: string;
    created_at: string;         // ISO 문자열

    runningBalance?: number;
}