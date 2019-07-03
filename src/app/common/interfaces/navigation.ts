type Nav = Path[];

interface Path {
    name: string;
    path: string;
    icon?: string;
    query?: { status: number };
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
            // {
            //     name: 'New Document',
            //     path: '/new'
            // },
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
                name: 'Marketing Workflow',
                path: '/marketing',
                icon: 'shopping_cart'
            },
            {
                name: 'Proforma Workflow',
                path: '/proforma',
                icon: 'shopping_cart'
            },
            {
                name: 'Goods Prep. Workflow',
                path: '/goods-preparation',
                icon: 'shopping_cart'
            },
            {
                name: 'Invoicing Workflow',
                path: '/invoicing',
                icon: 'shopping_cart'
            }  
        ]
    },
    {
        name: 'Goods Preparation',
        path: '/order-entry',
        icon: 'local_mall',
        children: [
            {
                name: 'Pending Products Management',
                path: '/purgatory',
                icon: 'local_mall'
            }
        ]
    },
    {
        name: 'Delivery',
        path: '/workflow',
        icon: 'local_shipping',
        children: [
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
                name: 'Routes',
                path: '/routes'
            },
            {
                name: 'Locations',
                path: '/locations'
            }
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
                name: 'Debtors Chasing',
                path: '/control'
            },
            {
                name: 'My Review List',
                path: '/review'
            },
            {
                name: 'Debt Collection',
                path: '/collect'
            },
            {
                name: 'Reminders',
                path: '/reminder',
                query: {
                    status: 0
                }
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
        icon: 'print',
        children: [
            {
                name: 'Printing Overview',
                path: '/overview',
            },
            {
                name: 'Printers',
                path: '/printers',
            },
            {
                name: 'Ink Usage Report',
                path: '/ink-report',
            },
        ]
    },
    {
        name: 'Products',
        path: '/products',
        icon: 'local_mall',
        children: [
            {
                name: 'Products',
                path: '/view',
                icon: 'local_mall'
            },
            {
                name: 'Categories',
                path: '/category',
                icon: 'local_mall'
            }
        ]
    },
    {
        name: 'Tenders',
        path: '/tenders',
        icon: 'account_balance'
    },
    {
        name: 'Reports',
        path: '/workflow',
        icon: 'cached',
        children: [
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
            {
                name: 'Completion Report',
                path: '/completion'
            },
        ]
    }
];
