type Nav = Path[];

interface Path {
    name: string;
    path: string;
    icon?: string;
    children?: Path[];
}

export const Navigation: Nav = [
    {
        name: 'Dashboard',
        path: '/',
        icon: 'dashboard'
    },
    {
        name: 'Customers',
        path: '/customers',
        icon: 'people'
    },
    {
        name: 'Order Entry',
        path: '/order-entry',
        icon: 'assignment',
        children: [
            {
                name: 'New Document',
                path: '/new'
            },
            {
                name: 'View Documents',
                path: '/view'
            }
        ]
    },
    {
        name: 'Workflow',
        path: '/workflow',
        icon: 'cached',
        children: [
            {
                name: 'Sales Workflow',
                path: '/sales',
                icon: 'shopping_cart'
            },
            {
                name: 'Goods Preparation Workflow',
                path: '/goods-preparation',
            },
            {
                name: 'Delivery Workflow',
                path: '/delivery',
                icon: 'local_shipping'
            },
            {
                name: 'Delivery Sessions',
                path: '/sessions',
            },
            {
                name: 'Delivery Archive',
                path: '/delivery-archive',
                icon: 'archive'
            },
            {
                name: 'Purchase Report',
                path: '/purchase-report',
            },
            {
                name: 'Credit Note Report',
                path: '/credit-note-report',
            },
            {
                name: 'Cancellation Report',
                path: '/cancel-report',
            },
            {
                name: 'User Report',
                path: '/user-report',
            },

        ]
    },
    {
        name: 'Debtors',
        path: '/debtors',
        icon: 'local_atm',
        children: [
            {
                name: 'Allocations',
                path: '/allocations'
            },
            {
                name: 'Debtors Control',
                path: '/control'
            },
            {
                name: 'Debt Collection',
                path: '/collect'
            }
        ]
    },
    {
        name: 'Comments',
        path: '/comments',
        icon: 'comment'
    },
    {
        name: 'Printing',
        path: '/printing',
        icon: 'print'
    },
    {
        name: 'Products',
        path: '/products',
        icon: 'local_mall'
    },
    {
        name: 'Tenders',
        path: '/tenders',
        icon: 'account_balance'
    },
];
