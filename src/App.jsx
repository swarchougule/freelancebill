import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import LandingPage from './components/LandingPage';
import UpgradeModal from './components/UpgradeModal';

import { supabase } from './supabaseClient';
import html2pdf from 'html2pdf.js';

const CURRENCIES = {
  INR: { symbol: '₹', name: 'Indian Rupee' },
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  CAD: { symbol: '$', name: 'Canadian Dollar' },
  AUD: { symbol: '$', name: 'Australian Dollar' }
};

const getTodayString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const getDueDateString = (daysAhead = 14) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

const DEFAULT_INVOICE_STATE = {
  senderName: 'Alex Morgan Studio',
  senderEmail: 'alex@morganstudio.com',
  senderPhone: '+91 98765 43210',
  senderAddress: 'Indiranagar, 100ft Road, Bengaluru, KA 560038',
  senderLogo: '',
  clientName: 'Starlight Tech India Pvt Ltd',
  clientEmail: 'billing@starlighttech.in',
  clientAddress: 'Level 4, Cyber City, HITECH City, Hyderabad, TS 500081',
  invoiceNumber: 'INV-001',
  invoiceDate: getTodayString(),
  dueDate: getDueDateString(14),
  currency: 'INR',
  items: [
    {
      description: 'UI/UX Design & Wireframing',
      billingType: 'hourly',
      hours: '20',
      rate: '2500',
      qty: '1',
      fixedAmount: '50000',
      showDiscount: false,
      discountRate: ''
    },
    {
      description: 'Full-stack Web Application Development',
      billingType: 'fixed',
      hours: '0',
      rate: '0',
      qty: '1',
      fixedAmount: '75000',
      showDiscount: true,
      discountRate: '5'
    }
  ],
  taxRate: '18',
  discountRate: '0',
  notes: 'Payment Details:\nBank: HDFC Bank Ltd\nAccount No: 50200012345678\nIFSC Code: HDFC0001234\nUPI ID: alexmorgan@hdfcbank'
};

const EMPTY_INVOICE_STATE = {
  senderName: '',
  senderEmail: '',
  senderPhone: '',
  senderAddress: '',
  senderLogo: '',
  clientName: '',
  clientEmail: '',
  clientAddress: '',
  invoiceNumber: 'INV-001',
  invoiceDate: getTodayString(),
  dueDate: getDueDateString(14),
  currency: 'INR',
  items: [
    {
      description: '',
      billingType: 'hourly',
      hours: '1',
      rate: '',
      qty: '1',
      fixedAmount: '',
      showDiscount: false,
      discountRate: ''
    }
  ],
  taxRate: '',
  discountRate: '',
  notes: ''
};

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'app'
  const [user, setUser] = useState(null);
  const [invoiceData, setInvoiceData] = useState(DEFAULT_INVOICE_STATE);
  const [showTaxDiscount, setShowTaxDiscount] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [authError, setAuthError] = useState(''); // <-- new state for auth errors
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [userPlan, setUserPlan] = useState('free');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Check active Supabase Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Supabase session user ID:', session?.user?.id);
      if (session?.user) {
        fetchUserBusinessProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchUserBusinessProfile(currentUser.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch saved business profile for logged-in user
  const fetchUserBusinessProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('business_profile')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (data) {
        setInvoiceData((prev) => ({
          ...prev,
          senderName: data.business_name || prev.senderName,
          senderAddress: data.address || prev.senderAddress,
          senderEmail: data.email || prev.senderEmail,
          senderPhone: data.phone || prev.senderPhone,
          senderLogo: data.logo_url || prev.senderLogo
        }));
        if (typeof data.invoices_created_count === 'number') {
          setInvoiceCount(data.invoices_created_count);
        }
        if (data.plan) {
          setUserPlan(data.plan);
        }
      }
    } catch (e) {
      console.error('Error pre-filling business profile:', e);
    }
  };

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    console.log('Attempting Google login...'); // <-- console log for debugging
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin // ensure redirect matches current origin
        }
      });
      if (error) {
        console.error('Google Sign-In Error:', error);
        setAuthError(error.message || 'Unknown authentication error');
        alert('Login failed: ' + (error.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('OAuth error:', err);
      setAuthError(err.message || 'Unexpected error');
      alert('Login failed: ' + (err.message || 'Unexpected error'));
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Field change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Logo upload handler (convert to Base64)
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceData((prev) => ({
          ...prev,
          senderLogo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setInvoiceData((prev) => ({
      ...prev,
      senderLogo: ''
    }));
  };

  // Line items handlers
  const handleAddItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: '',
          billingType: 'hourly',
          hours: '1',
          rate: '',
          qty: '1',
          fixedAmount: '',
          showDiscount: false,
          discountRate: ''
        }
      ]
    }));
  };

  // Quick-add service chip handler
  const handleAddChipItem = (serviceName) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: serviceName,
          billingType: 'hourly',
          hours: '5',
          rate: '2000',
          qty: '1',
          fixedAmount: '10000',
          showDiscount: false,
          discountRate: ''
        }
      ]
    }));
  };

  const handleUpdateItem = (index, field, value) => {
    setInvoiceData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
      return { ...prev, items: newItems };
    });
  };

  const handleRemoveItem = (index) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Load sample data & Reset
  const handleLoadSample = () => {
    setInvoiceData(DEFAULT_INVOICE_STATE);
    setShowTaxDiscount(true);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form?')) {
      setInvoiceData(EMPTY_INVOICE_STATE);
      setShowTaxDiscount(false);
    }
  };

  // Print/PDF download trigger
  // Download invoice as PDF with usage limit enforcement
  const handleDownloadPDF = async () => {
    if (!user) {
      alert('You must be logged in to download invoices as PDF.');
      return;
    }
    if (userPlan !== 'pro' && invoiceCount >= 3) {
      setShowUpgradeModal(true);
      return;
    }
    const element = document.getElementById('invoice-preview-card');
    if (!element) {
      console.error('Invoice preview element not found for PDF generation');
      return;
    }
    const opt = {
      margin: 10,
      filename: `Invoice-${invoiceData.invoiceNumber || 'INV'}-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };
    try {
      await html2pdf().set(opt).from(element).save();
      await incrementInvoiceCount();
    } catch (e) {
      console.error('PDF generation failed:', e);
      alert('Failed to generate PDF.');
    }
  };

  // Increment invoice count
  const incrementInvoiceCount = async () => {
    const newCount = invoiceCount + 1;
    console.log(`Updating invoice count from ${invoiceCount} to ${newCount}`);
    setInvoiceCount(newCount);
    if (user) {
      try {
        await supabase
          .from('business_profile')
          .update({ invoices_created_count: newCount })
          .eq('user_id', user.id);
      } catch (err) {
        console.error('Error updating invoice count:', err);
      }
    }
  };

  // Refresh invoice count and plan from DB
  const refreshInvoiceCount = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('business_profile')
        .select('invoices_created_count, plan')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        if (typeof data.invoices_created_count === 'number') {
          setInvoiceCount(data.invoices_created_count);
        }
        if (data.plan) {
          setUserPlan(data.plan);
        }
      }
    } catch (e) {
      console.error('Error refreshing invoice count:', e);
    }
  };

  // Re-fetch count when view switches to app (e.g., after returning home)
  useEffect(() => {
    if (view === 'app' && user) {
      refreshInvoiceCount();
    }
  }, [view, user]);

  // Save Invoice to Supabase
  const handleSaveInvoice = async () => {
    console.log(`Attempting to save invoice. Current count: ${invoiceCount}, plan: ${userPlan}`);
    if (!user) {
      if (window.confirm('You must be signed in with Google to save invoices to your account. Sign in now?')) {
        handleGoogleLogin();
      }
      return;
    }

    if (userPlan !== 'pro' && invoiceCount >= 3) {
      setShowUpgradeModal(true);
      return;
    }

    setIsSaving(true);
    try {
      // 1. Create or match client record
      let clientId = null;
      if (invoiceData.clientName) {
        const { data: clientData, error: clientErr } = await supabase
          .from('clients')
          .insert({
            user_id: user.id,
            client_name: invoiceData.clientName,
            client_email: invoiceData.clientEmail,
            client_address: invoiceData.clientAddress
          })
          .select()
          .single();

        if (!clientErr && clientData) {
          clientId = clientData.id;
        }
      }

      // 2. Upsert user's business profile
      await supabase
        .from('business_profile')
        .upsert({
          user_id: user.id,
          business_name: invoiceData.senderName,
          logo_url: invoiceData.senderLogo,
          address: invoiceData.senderAddress,
          email: invoiceData.senderEmail,
          phone: invoiceData.senderPhone,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      // 3. Insert invoice record
      const { data: inv, error: invErr } = await supabase
        .from('invoices')
        .insert({
          user_id: user.id,
          client_id: clientId,
          invoice_number: invoiceData.invoiceNumber || 'INV-001',
          invoice_date: invoiceData.invoiceDate,
          due_date: invoiceData.dueDate,
          currency: invoiceData.currency,
          tax_rate: parseFloat(invoiceData.taxRate) || 0,
          discount: parseFloat(invoiceData.discountRate) || 0,
          notes: invoiceData.notes,
          status: 'draft'
        })
        .select()
        .single();

      if (invErr) throw invErr;

      // 4. Insert invoice line items
      const lineItemsToInsert = invoiceData.items.map((item) => {
        const billingType = item.billingType || 'quantity';
        let amount = 0;
        if (billingType === 'hourly') {
          amount = (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0);
        } else if (billingType === 'fixed') {
          amount = parseFloat(item.fixedAmount) || 0;
        } else {
          amount = (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0);
        }
        if (item.discountRate) {
          amount = amount * (1 - (parseFloat(item.discountRate) || 0) / 100);
        }

        return {
          invoice_id: inv.id,
          description: item.description || '',
          billing_type: billingType,
          hours: parseFloat(item.hours) || 0,
          rate: parseFloat(item.rate) || 0,
          quantity: parseFloat(item.qty) || 1,
          amount: amount,
          row_discount: parseFloat(item.discountRate) || 0
        };
      });

      const { error: itemsErr } = await supabase
        .from('invoice_line_items')
        .insert(lineItemsToInsert);

      if (itemsErr) throw itemsErr;

      await incrementInvoiceCount();

      setIsSavedSuccess(true);
      setTimeout(() => setIsSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Error saving invoice:', err);
      alert('Failed to save invoice: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  if (view === 'landing') {
    return (
      <LandingPage 
        onStartApp={() => setView('app')} 
        user={user}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
        onSaveInvoice={handleSaveInvoice}
      />
    );
  }

  return (
    <div className="app-root">
      {/* Top Header Navigation */}
      <Header 
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        onGoHome={() => setView('landing')}
        user={user}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
        onSaveInvoice={handleSaveInvoice}
        isSaving={isSaving}
        authError={authError} // pass error to Header for display
        usageInfo={{
          count: invoiceCount,
          limit: 3,
          isPro: userPlan === 'pro'
        }}
      />

      {/* Main Two-Column Layout */}
      <main className="app-layout">
        {/* Left Column: Form */}
        <InvoiceForm 
          invoiceData={invoiceData}
          onChange={handleInputChange}
          onLogoUpload={handleLogoUpload}
          onRemoveLogo={handleRemoveLogo}
          onAddItem={handleAddItem}
          onAddChipItem={handleAddChipItem}
          onUpdateItem={handleUpdateItem}
          onRemoveItem={handleRemoveItem}
          showTaxDiscount={showTaxDiscount}
          onToggleTaxDiscount={() => setShowTaxDiscount(!showTaxDiscount)}
          currencies={CURRENCIES}
        />

        {/* Right Column: Live Invoice Preview */}
        <InvoicePreview 
          invoiceData={invoiceData}
          currencies={CURRENCIES}
          onDownloadPDF={handleDownloadPDF}
          onLogoUpload={handleLogoUpload}
          onSaveInvoice={handleSaveInvoice}
          isSaving={isSaving}
          isSavedSuccess={isSavedSuccess}
          user={user}
        />
      </main>

      {showUpgradeModal && (
        <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)} 
        />
      )}
    </div>
  );
}
