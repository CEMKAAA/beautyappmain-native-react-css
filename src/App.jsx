import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const DashboardLayout = lazy(() => import('./components/DashboardLayout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const BranchSettings = lazy(() => import('./pages/BranchSettings'));
const WorkingHours = lazy(() => import('./pages/WorkingHours'));
const SeasonalHours = lazy(() => import('./pages/SeasonalHours'));
const Staff = lazy(() => import('./pages/Staff'));
const Services = lazy(() => import('./pages/Services'));
const PromotionSettings = lazy(() => import('./pages/PromotionSettings'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const DefaultServices = lazy(() => import('./pages/DefaultServices'));
const ProductCatalog = lazy(() => import('./pages/ProductCatalog'));
const BranchProducts = lazy(() => import('./pages/BranchProducts'));
const Packages = lazy(() => import('./pages/Packages'));
const AppointmentSettings = lazy(() => import('./pages/AppointmentSettings'));
const TagSettings = lazy(() => import('./pages/TagSettings'));
const FaqSettings = lazy(() => import('./pages/FaqSettings'));
const AppointmentCalendar = lazy(() => import('./pages/AppointmentCalendar'));
const Appointments = lazy(() => import('./pages/Appointments'));
const Sales = lazy(() => import('./pages/Sales'));
const ProductSales = lazy(() => import('./pages/ProductSales'));
const PackageSales = lazy(() => import('./pages/PackageSales'));
const Customers = lazy(() => import('./pages/Customers'));
const CustomerDetail = lazy(() => import('./pages/CustomerDetail'));
const PackageSaleDetail = lazy(() => import('./pages/PackageSaleDetail'));
const Reports = lazy(() => import('./pages/Reports'));
const Finance = lazy(() => import('./pages/Finance'));
const TestPage = lazy(() => import('./pages/TestPage'));
const TestPage2 = lazy(() => import('./pages/TestPage2'));
const TestPage3 = lazy(() => import('./pages/TestPage3'));
const TestPage4 = lazy(() => import('./pages/TestPage4'));
const BusinessSetup = lazy(() => import('./pages/BusinessSetup'));
const TestPage5 = lazy(() => import('./pages/TestPage5'));
const TestPage6 = lazy(() => import('./pages/TestPage6'));
const TestPage7 = lazy(() => import('./pages/TestPage7'));
const TestPage8 = lazy(() => import('./pages/TestPage8'));
const NewAppointments = lazy(() => import('./pages/NewAppointments'));
const NewSales = lazy(() => import('./pages/NewSales'));
const NewPayments = lazy(() => import('./pages/NewPayments'));
const GirisReplica = lazy(() => import('./pages/GirisReplica'));
const GirisReplicaAdvanced = lazy(() => import('./pages/GirisReplicaAdvanced'));
const AuthReplicaAdvanced = lazy(() => import('./pages/AuthReplicaAdvanced'));
const MarketPlaceReplica = lazy(() => import('./pages/MarketPlaceReplica'));
const MagzaReplica = lazy(() => import('./pages/MagzaReplica'));
const GirisNative = lazy(() => import('./pages/GirisNative'));
const AuthNative = lazy(() => import('./pages/AuthNative'));
const MarketPlaceNative = lazy(() => import('./pages/MarketPlaceNative'));
const MagzaNative = lazy(() => import('./pages/MagzaNative'));
const GirisNativeDesign = lazy(() => import('./pages/GirisNativeDesign'));
const AuthNativeDesign = lazy(() => import('./pages/AuthNativeDesign'));
const MarketPlaceNativeDesign = lazy(() => import('./pages/MarketPlaceNativeDesign'));
const MagzaNativeDesign = lazy(() => import('./pages/MagzaNativeDesign'));

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#f7f7fa',
        color: '#141414',
        fontFamily: "'Roobert PRO', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: '15px',
        fontWeight: 600,
      }}
    >
      Loading experience...
    </div>
  );
}

function withSuspense(Component) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={withSuspense(Login)} />
          <Route path="/register" element={withSuspense(Register)} />
          <Route path="/giris-replica" element={withSuspense(GirisReplica)} />
          <Route path="/giris-replica-advanced" element={withSuspense(GirisReplicaAdvanced)} />
          <Route path="/auth-replica-advanced" element={withSuspense(AuthReplicaAdvanced)} />
          <Route path="/marketplace-replica" element={withSuspense(MarketPlaceReplica)} />
          <Route path="/magza-replica" element={withSuspense(MagzaReplica)} />
          <Route path="/giris-native" element={withSuspense(GirisNative)} />
          <Route path="/auth-native" element={withSuspense(AuthNative)} />
          <Route path="/marketplace-native" element={withSuspense(MarketPlaceNative)} />
          <Route path="/magza-native" element={withSuspense(MagzaNative)} />
          <Route path="/giris-native-redesign" element={withSuspense(GirisNativeDesign)} />
          <Route path="/auth-native-redesign" element={withSuspense(AuthNativeDesign)} />
          <Route path="/marketplace-native-redesign" element={withSuspense(MarketPlaceNativeDesign)} />
          <Route path="/magza-native-redesign" element={withSuspense(MagzaNativeDesign)} />

          <Route
            element={
              <Suspense fallback={<RouteFallback />}>
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              </Suspense>
            }
          >
            <Route path="/dashboard" element={withSuspense(Dashboard)} />
            <Route path="/appointment-calendar" element={withSuspense(AppointmentCalendar)} />
            <Route path="/appointments" element={withSuspense(Appointments)} />
            <Route path="/sales" element={withSuspense(Sales)} />
            <Route path="/product-sales" element={withSuspense(ProductSales)} />
            <Route path="/package-sales" element={withSuspense(PackageSales)} />
            <Route path="/package-sales/:id" element={withSuspense(PackageSaleDetail)} />
            <Route path="/customers" element={withSuspense(Customers)} />
            <Route path="/customers/:id" element={withSuspense(CustomerDetail)} />
            <Route path="/reports" element={withSuspense(Reports)} />
            <Route path="/finance" element={withSuspense(Finance)} />
            <Route path="/settings" element={withSuspense(Settings)} />
            <Route path="/settings/branch" element={withSuspense(BranchSettings)} />
            <Route path="/settings/working-hours" element={withSuspense(WorkingHours)} />
            <Route path="/settings/seasonal-hours" element={withSuspense(SeasonalHours)} />
            <Route path="/settings/staff" element={withSuspense(Staff)} />
            <Route path="/settings/services" element={withSuspense(Services)} />
            <Route path="/settings/promotions" element={withSuspense(PromotionSettings)} />
            <Route path="/settings/products" element={withSuspense(BranchProducts)} />
            <Route path="/settings/packages" element={withSuspense(Packages)} />
            <Route path="/settings/appointments" element={withSuspense(AppointmentSettings)} />
            <Route path="/settings/tags" element={withSuspense(TagSettings)} />
            <Route path="/settings/faqs" element={withSuspense(FaqSettings)} />
            <Route path="/admin" element={withSuspense(AdminPanel)} />
            <Route path="/admin/default-services" element={withSuspense(DefaultServices)} />
            <Route path="/admin/products" element={withSuspense(ProductCatalog)} />
            <Route path="/test" element={withSuspense(TestPage)} />
            <Route path="/test2" element={withSuspense(TestPage2)} />
            <Route path="/test3" element={withSuspense(TestPage3)} />
            <Route path="/test4" element={withSuspense(TestPage4)} />
            <Route path="/test4/business-setup" element={withSuspense(BusinessSetup)} />
            <Route path="/test5" element={withSuspense(TestPage5)} />
            <Route path="/test6" element={withSuspense(TestPage6)} />
            <Route path="/test7" element={withSuspense(TestPage7)} />
            <Route path="/test8" element={withSuspense(TestPage8)} />
            <Route path="/new-appointments" element={withSuspense(NewAppointments)} />
            <Route path="/new-sales" element={withSuspense(NewSales)} />
            <Route path="/new-payments" element={withSuspense(NewPayments)} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
