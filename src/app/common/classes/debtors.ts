interface DebtCollect {
    debt_id: number;
    cust_id: number;
    pay_method: number;
    delivery_pay: number;
    collected: number;
    comment: string;
    type: number;
    amount: number;
    remarks: string;
    region: string;
    data: number;
    createdAt: string;
    updatedAt: string;
}

interface DebtReminder {
    dbt_rem_id: number;
    cust_id: number;
    amt: number;
    amtpaid: number;
    comment: string;
    status: number;
    courtstatus: number;
    sentDate: string;
    courtDate: string;
    data: number;
    active: number;
}

interface DebtReminderComment {
    dbt_comm_id: number;
    dbt_rem_id: number;
    dbt_comment: string;
    user: number;
    createdAt: string;
    updatedAt: string;
}
