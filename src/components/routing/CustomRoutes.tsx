import LawyerDetail from '../../pages/client/LawyerDetail';
import FileUpload from '../../pages/lawyer/approvalRequest/FileUpload';
import EditProfile  from '../../pages/lawyer/EditProfile';
import Payment from '../../pages/payment/Payment';
// import ApprovalRequestForm from '../../pages/lawyer/ApprovalRequestForm';

export interface CustomRoute {
    path: string;
    component: any;
    layout: string;
}

const CRoutes: CustomRoute[] = [
    {
        path: '/lawyer-detail',
        component: LawyerDetail,
        layout: 'user',
    },
    {
        path: '/setup-payment',
        component: Payment,
        layout: 'user',
    },
    {
        path: '/setup-payment',
        component: Payment,
        layout: 'lawyer',
    },
    {
        path: '/edit-profile',
        component: EditProfile,
        layout: 'lawyer',
    },
    {
        path: '/request-approval',
        component: FileUpload,
        layout: 'lawyer',
    },
];

export default CRoutes;

export const customPathes = CRoutes.map((route) => route.path);
