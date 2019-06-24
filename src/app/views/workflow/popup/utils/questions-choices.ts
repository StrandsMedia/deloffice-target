export const QuestionChoices = [
    {
        value: 0,
        name: 'Cancel',
        status: [1, 2, 3, 4, 5],
        order: 10
    },
    {
        value: 1,
        name: 'Inquiry',
        status: [0],
        order: 1
    },
    {
        value: 2,
        name: 'Quotation Sent',
        status: [1],
        order: 2
    },
    {
        value: 3,
        name: 'Order Confirmed',
        status: [0, 2],
        order: 3
    },
    {
        value: 4,
        name: 'Purchasing',
        status: [3],
        order: 4
    },
    {
        value: 5,
        name: 'Invoicing',
        status: [3, 4],
        order: 5
    },
    {
        value: 6,
        name: 'Invoiced',
        status: [5],
        order: 6
    },
    {
        value: 7,
        name: 'Goods Ready',
        status: [6],
        order: 7
    },
    {
        value: 9,
        name: 'Delivery',
        status: [7],
        order: 9
    },
    {
        value: 11,
        name: 'Credit Note',
        status: [6],
        order: 11
    },
    {
        value: 16,
        name: 'Change Products',
        status: [16],
        order: 16
    },
    {
        value: 17,
        name: 'Pick Up',
        status: [7],
        order: 17
    },
    {
        value: 'back',
        name: 'Re-allocate',
        status: [9],
        order: 18
    },
    {
        value: 'full',
        name: 'Delivered in Full',
        status: [8],
        order: 19
    },
    {
        value: 'undelivered',
        name: 'Undelivered - Roll Over',
        status: [8],
        order: 20
    },
    {
        value: 'partialRoll',
        name: 'Partial Delivery - Roll Over',
        status: [8],
        order: 21
    },
    {
        value: 'partialCredit',
        name: 'Partial Delivery - Credit Note',
        status: [8],
        order: 22
    },
    {
        value: 'allReturn',
        name: 'Returned - Credit Note',
        status: [8],
        order: 23
    }
];

export const ControlChoices = [
    {
        value: 1,
        name: 'To Contact',
        status: [0],
        order: 1
    },
    {
        value: 3,
        name: 'Awaiting Feedback',
        status: [1, 3, 4, 8, 9, 10, 5, 6],
        order: 2
    },
    {
        value: 4,
        name: 'Expecting Payment',
        status: [1, 3, 4, 8, 9, 10, 5, 6],
        order: 3
    },
    {
        value: 8,
        name: 'Search',
        status: [1, 3, 4, 8, 9, 10, 5, 6],
        order: 4
    },
    {
        value: 9,
        name: 'Chase',
        status: [1, 3, 4, 8, 9, 10, 5, 6],
        order: 5
    },
    {
        value: 10,
        name: 'Dispute',
        status: [1, 3, 4, 8, 9, 10, 5, 6],
        order: 6
    },
    {
        value: 5,
        name: 'Cheque Ready',
        status: [1, 3, 4, 8, 9, 10, 6],
        order: 7
    },
    {
        value: 6,
        name: 'Cleared',
        status: [1, 3, 4, 8, 9, 10, 6],
        order: 8
    },
];

export const ProductChoices = [
    {
        id: 'paper1',
        name: 'Paper 1',
        maxi: true
    },
    {
        id: 'paper2',
        name: 'Paper 2',
        maxi: true
    },
    {
        id: 'paper3',
        name: 'Paper 3',
        maxi: true
    },
    {
        id: 'paper4',
        name: 'Paper 4',
        maxi: true
    },
    {
        id: 'paper5',
        name: 'Paper 5',
        maxi: true
    },
    {
        id: 'stationery',
        name: 'Stationery',
        maxi: false
    },
    {
        id: 'pens',
        name: 'Pens',
        maxi: false
    },
    {
        id: 'printers',
        name: 'Printing',
        maxi: false
    },
    {
        id: 'files',
        name: 'Files',
        maxi: false
    },
    {
        id: 'cleaning',
        name: 'Cleaning',
        maxi: false
    },
    {
        id: 'ink',
        name: 'Ink & Toners',
        maxi: false
    },
    {
        id: 'envelopes',
        name: 'Envelopes',
        maxi: false
    },
    {
        id: 'messroom',
        name: 'Messroom',
        maxi: false
    },
    {
        id: 'others',
        name: 'Others',
        maxi: false
    }

];
