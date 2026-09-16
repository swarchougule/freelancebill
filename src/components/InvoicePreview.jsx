import React from 'react';
import { Download, Upload, Bookmark, Check, Loader2 } from 'lucide-react';
import { calculateRowAmount } from './InvoiceForm';

export default function InvoicePreview({ 
  invoiceData, 
  currencies, 
  onDownloadPDF, 
  onLogoUpload,
  onSaveInvoice,
  isSaving,
  isSavedSuccess,
  user
}) {
  const {
    senderName,
    senderEmail,
    senderPhone,
    senderAddress,
    senderLogo,
    clientName,
    clientEmail,
    clientAddress,
    invoiceNumber,
    invoiceDate,
    dueDate,
    currency,
    items,
    taxRate,
    discountRate,
    notes
  } = invoiceData;

  const currencySymbol = currencies[currency]?.symbol || '$';

  // Live Calculations across all items regardless of billing type
  const subtotal = items.reduce((acc, item) => {
    return acc + calculateRowAmount(item);
  }, 0);

  const discountPercent = parseFloat(discountRate) || 0;
  const discountAmount = subtotal * (discountPercent / 100);

  const taxableAmount = subtotal - discountAmount;
  const taxPercent = parseFloat(taxRate) || 0;
  const taxAmount = taxableAmount * (taxPercent / 100);

  const grandTotal = taxableAmount + taxAmount;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const [year, month, day] = dateStr.split('-');
      if (!year || !month || !day) return dateStr;
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="preview-column">
      {/* Top Action Bar above preview card */}
      <div className="preview-actions-bar">
        <button 
          type="button" 
          className="btn btn-secondary btn-save-invoice"
          onClick={onSaveInvoice}
          disabled={isSaving}
          title={user ? "Save invoice to Supabase database" : "Login to save invoice"}
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="spin-icon" />
              <span>Saving...</span>
            </>
          ) : isSavedSuccess ? (
            <>
              <Check size={18} className="text-green" />
              <span>Saved to Supabase!</span>
            </>
          ) : (
            <>
              <Bookmark size={18} />
              <span>Save Invoice</span>
            </>
          )}
        </button>

        <button 
          type="button" 
          className="btn btn-primary btn-download-pdf"
          onClick={onDownloadPDF}
        >
          <Download size={18} />
          <span>Download as PDF</span>
        </button>
      </div>

      {/* Clean White Invoice Card */}
      <div className="invoice-card" id="invoice-preview-card">
        {/* Static Green Draft Status Badge */}
        <div className="status-badge">
          <span className="badge-dot"></span>
          Draft
        </div>

        {/* Top Header */}
        <div className="preview-header">
          {/* Left: Sender details */}
          <div className="preview-sender">
            {senderLogo ? (
              <img src={senderLogo} alt="Business Logo" className="preview-logo-box" />
            ) : (
              <label className="preview-logo-placeholder" title="Click to upload business logo">
                <Upload size={18} style={{ color: '#94A3B8' }} />
                <span className="placeholder-text">Add Logo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={onLogoUpload} 
                  style={{ display: 'none' }} 
                />
              </label>
            )}
            <div className="preview-sender-name">{senderName || 'Your Business Name'}</div>
            <div className="preview-sender-meta">
              {senderAddress && <div>{senderAddress}</div>}
              {senderEmail && <div>{senderEmail}</div>}
              {senderPhone && <div>{senderPhone}</div>}
            </div>
          </div>

          {/* Right: Invoice title & dates */}
          <div className="preview-title-block">
            <h1 className="preview-invoice-title">INVOICE</h1>
            <table className="preview-meta-table">
              <tbody>
                <tr>
                  <td className="meta-label">Invoice No:</td>
                  <td className="meta-value">{invoiceNumber || 'INV-001'}</td>
                </tr>
                <tr>
                  <td className="meta-label">Date:</td>
                  <td className="meta-value">{formatDate(invoiceDate)}</td>
                </tr>
                <tr>
                  <td className="meta-label">Due Date:</td>
                  <td className="meta-value">{formatDate(dueDate)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Client "Bill To" Section */}
        <div className="preview-bill-to">
          <div className="bill-to-label">Billed To</div>
          <div className="bill-to-name">{clientName || 'Client Name'}</div>
          <div className="bill-to-details">
            {clientAddress && <div>{clientAddress}</div>}
            {clientEmail && <div>{clientEmail}</div>}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="preview-table-wrapper">
          <table className="preview-items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th className="align-right">Billing</th>
                <th className="align-right">Rate</th>
                <th className="align-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const billingType = item.billingType || 'quantity';
                const amount = calculateRowAmount(item);

                let billingText = '';
                let rateText = '';

                if (billingType === 'hourly') {
                  const hrs = parseFloat(item.hours) || 0;
                  const rate = parseFloat(item.rate) || 0;
                  billingText = `${hrs} hr${hrs === 1 ? '' : 's'}`;
                  rateText = `${currencySymbol}${rate.toFixed(2)}/hr`;
                } else if (billingType === 'fixed') {
                  billingText = 'Fixed Price';
                  rateText = '—';
                } else {
                  const qty = parseFloat(item.qty) || 0;
                  const rate = parseFloat(item.rate) || 0;
                  billingText = `${qty} qty`;
                  rateText = `${currencySymbol}${rate.toFixed(2)}`;
                }

                return (
                  <tr key={index}>
                    <td className="item-desc">
                      <div>{item.description || 'Description'}</div>
                      {item.discountRate ? (
                        <div className="preview-item-subtext">
                          Includes {item.discountRate}% row discount
                        </div>
                      ) : null}
                    </td>
                    <td className="align-right">{billingText}</td>
                    <td className="align-right">{rateText}</td>
                    <td className="align-right" style={{ fontWeight: 600 }}>
                      {currencySymbol}{amount.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="preview-summary">
          <table className="totals-table">
            <tbody>
              <tr>
                <td className="totals-label">Subtotal</td>
                <td className="totals-value">{currencySymbol}{subtotal.toFixed(2)}</td>
              </tr>
              {discountPercent > 0 && (
                <tr>
                  <td className="totals-label">Discount ({discountPercent}%)</td>
                  <td className="totals-value" style={{ color: '#EF4444' }}>
                    -{currencySymbol}{discountAmount.toFixed(2)}
                  </td>
                </tr>
              )}
              {taxPercent > 0 && (
                <tr>
                  <td className="totals-label">Tax ({taxPercent}%)</td>
                  <td className="totals-value">{currencySymbol}{taxAmount.toFixed(2)}</td>
                </tr>
              )}
              <tr className="totals-row-grand">
                <td className="totals-label">Total Due</td>
                <td className="totals-value">{currencySymbol}{grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notes & Terms at Bottom */}
        {notes && (
          <div className="preview-notes">
            <div className="notes-label">Notes / Payment Terms</div>
            <div className="notes-text">{notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}
