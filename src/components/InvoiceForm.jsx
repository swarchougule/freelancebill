import React from 'react';
import { 
  Building2, 
  UserCheck, 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Upload, 
  X, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  Tag
} from 'lucide-react';

const QUICK_SERVICE_CHIPS = [
  'Design Work',
  'Development',
  'Consultation',
  'Revisions',
  'Content Writing'
];

export const calculateRowAmount = (item) => {
  let base = 0;
  const billingType = item.billingType || 'quantity';

  if (billingType === 'hourly') {
    const hrs = parseFloat(item.hours) || 0;
    const rate = parseFloat(item.rate) || 0;
    base = hrs * rate;
  } else if (billingType === 'fixed') {
    base = parseFloat(item.fixedAmount) || 0;
  } else {
    // quantity
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    base = qty * rate;
  }

  if (item.discountRate) {
    const disc = parseFloat(item.discountRate) || 0;
    base = base * (1 - disc / 100);
  }

  return base;
};

export default function InvoiceForm({
  invoiceData,
  onChange,
  onLogoUpload,
  onRemoveLogo,
  onAddItem,
  onAddChipItem,
  onUpdateItem,
  onRemoveItem,
  showTaxDiscount,
  onToggleTaxDiscount,
  currencies
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

  return (
    <div className="form-column">
      <div className="form-header">
        <h1 className="form-title">Create Invoice</h1>
      </div>

      {/* 1. SENDER DETAILS */}
      <div className="form-card">
        <h2 className="section-title">
          <span className="section-title-icon"><Building2 size={18} /></span>
          Your Business Details
        </h2>

        {/* Logo Upload Box */}
        <div className="form-group">
          <label className="form-label">Business Logo</label>
          <div className="logo-upload-wrapper">
            <div className="logo-preview-box">
              {senderLogo ? (
                <img src={senderLogo} alt="Business Logo" className="logo-preview-img" />
              ) : (
                <Upload size={22} className="text-subtle" style={{ color: '#94A3B8' }} />
              )}
            </div>
            <div className="logo-upload-actions">
              <label className="btn-upload">
                <Upload size={14} />
                <span>{senderLogo ? 'Change Logo' : 'Upload Logo'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={onLogoUpload} 
                  style={{ display: 'none' }} 
                />
              </label>
              {senderLogo && (
                <button type="button" className="btn-remove-logo" onClick={onRemoveLogo}>
                  <X size={13} />
                  <span>Remove logo</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Business / Sender Name</label>
            <input 
              type="text"
              name="senderName"
              value={senderName}
              onChange={onChange}
              placeholder="e.g. Acro Design Studio"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Business Email</label>
            <input 
              type="email"
              name="senderEmail"
              value={senderEmail}
              onChange={onChange}
              placeholder="hello@acrodesign.com"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input 
              type="tel"
              name="senderPhone"
              value={senderPhone}
              onChange={onChange}
              placeholder="+1 (555) 234-5678"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address / Location</label>
            <input 
              type="text"
              name="senderAddress"
              value={senderAddress}
              onChange={onChange}
              placeholder="123 Tech Avenue, San Francisco, CA"
              className="form-input"
            />
          </div>
        </div>
      </div>

      {/* 2. CLIENT DETAILS */}
      <div className="form-card">
        <h2 className="section-title">
          <span className="section-title-icon"><UserCheck size={18} /></span>
          Client Details
        </h2>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Client Name</label>
            <input 
              type="text"
              name="clientName"
              value={clientName}
              onChange={onChange}
              placeholder="e.g. Nexus Tech Solutions"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Client Email</label>
            <input 
              type="email"
              name="clientEmail"
              value={clientEmail}
              onChange={onChange}
              placeholder="billing@nexustech.io"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Client Address</label>
          <input 
            type="text"
            name="clientAddress"
            value={clientAddress}
            onChange={onChange}
            placeholder="456 Corporate Blvd, Suite 200, New York, NY"
            className="form-input"
          />
        </div>
      </div>

      {/* 3. INVOICE META & CURRENCY */}
      <div className="form-card">
        <h2 className="section-title">
          <span className="section-title-icon"><FileSpreadsheet size={18} /></span>
          Invoice Information
        </h2>

        <div className="form-grid-3">
          <div className="form-group">
            <label className="form-label">Invoice Number</label>
            <input 
              type="text"
              name="invoiceNumber"
              value={invoiceNumber}
              onChange={onChange}
              placeholder="INV-001"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Invoice Date</label>
            <input 
              type="date"
              name="invoiceDate"
              value={invoiceDate}
              onChange={onChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input 
              type="date"
              name="dueDate"
              value={dueDate}
              onChange={onChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '0.5rem' }}>
          <label className="form-label">Currency</label>
          <select 
            name="currency" 
            value={currency} 
            onChange={onChange}
            className="form-select"
          >
            {Object.keys(currencies).map((code) => (
              <option key={code} value={code}>
                {code} ({currencies[code].symbol}) — {currencies[code].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. REDESIGNED FREELANCER LINE ITEMS */}
      <div className="form-card">
        <h2 className="section-title">
          <span className="section-title-icon"><FileSpreadsheet size={18} /></span>
          Line Items
        </h2>

        {/* Quick Add Chips Above Table */}
        <div className="quick-chips-container">
          <div className="quick-chips-header">
            <Sparkles size={13} style={{ color: '#2563EB' }} />
            <span>Quick add freelance services:</span>
          </div>
          <div className="quick-chips-wrapper">
            {QUICK_SERVICE_CHIPS.map((label) => (
              <button
                key={label}
                type="button"
                className="quick-chip-btn"
                onClick={() => onAddChipItem(label)}
                title={`Click to add "${label}" row`}
              >
                <Plus size={12} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Items Rows List */}
        <div className="line-items-list">
          {items.map((item, index) => {
            const billingType = item.billingType || 'quantity';
            const rowAmount = calculateRowAmount(item);

            return (
              <div className="item-row-card" key={index}>
                <div className="item-row-top">
                  {/* Left: Description field */}
                  <div className="item-desc-wrapper">
                    <input 
                      type="text"
                      value={item.description}
                      onChange={(e) => onUpdateItem(index, 'description', e.target.value)}
                      placeholder="Item or service description"
                      className="form-input"
                    />
                  </div>

                  {/* Right Controls: Billing Type Segmented Control + Dynamic Inputs + Amount + Delete */}
                  <div className="item-controls-wrapper">
                    {/* Segmented Control Pill */}
                    <div className="segmented-control">
                      <button
                        type="button"
                        className={`segmented-btn ${billingType === 'hourly' ? 'active' : ''}`}
                        onClick={() => onUpdateItem(index, 'billingType', 'hourly')}
                      >
                        Hourly
                      </button>
                      <button
                        type="button"
                        className={`segmented-btn ${billingType === 'fixed' ? 'active' : ''}`}
                        onClick={() => onUpdateItem(index, 'billingType', 'fixed')}
                      >
                        Fixed Price
                      </button>
                      <button
                        type="button"
                        className={`segmented-btn ${billingType === 'quantity' ? 'active' : ''}`}
                        onClick={() => onUpdateItem(index, 'billingType', 'quantity')}
                      >
                        Quantity
                      </button>
                    </div>

                    {/* Dynamic Inputs based on Billing Type */}
                    <div className="billing-inputs-group">
                      {billingType === 'hourly' && (
                        <>
                          <div className="mini-input-wrapper">
                            <span className="mini-label">Hours</span>
                            <input 
                              type="number"
                              min="0"
                              step="any"
                              value={item.hours || ''}
                              onChange={(e) => onUpdateItem(index, 'hours', e.target.value)}
                              placeholder="0"
                              className="form-input-sm"
                            />
                          </div>
                          <div className="mini-input-wrapper wide">
                            <span className="mini-label">Rate/hr ({currencySymbol})</span>
                            <input 
                              type="number"
                              min="0"
                              step="any"
                              value={item.rate || ''}
                              onChange={(e) => onUpdateItem(index, 'rate', e.target.value)}
                              placeholder="0.00"
                              className="form-input-sm"
                            />
                          </div>
                        </>
                      )}

                      {billingType === 'fixed' && (
                        <div className="mini-input-wrapper wide">
                          <span className="mini-label">Amount ({currencySymbol})</span>
                          <input 
                            type="number"
                            min="0"
                            step="any"
                            value={item.fixedAmount || ''}
                            onChange={(e) => onUpdateItem(index, 'fixedAmount', e.target.value)}
                            placeholder="0.00"
                            className="form-input-sm"
                          />
                        </div>
                      )}

                      {billingType === 'quantity' && (
                        <>
                          <div className="mini-input-wrapper">
                            <span className="mini-label">Qty</span>
                            <input 
                              type="number"
                              min="0"
                              step="any"
                              value={item.qty || ''}
                              onChange={(e) => onUpdateItem(index, 'qty', e.target.value)}
                              placeholder="1"
                              className="form-input-sm"
                            />
                          </div>
                          <div className="mini-input-wrapper wide">
                            <span className="mini-label">Rate ({currencySymbol})</span>
                            <input 
                              type="number"
                              min="0"
                              step="any"
                              value={item.rate || ''}
                              onChange={(e) => onUpdateItem(index, 'rate', e.target.value)}
                              placeholder="0.00"
                              className="form-input-sm"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Calculated Amount */}
                    <div className="item-row-amount">
                      {currencySymbol}{rowAmount.toFixed(2)}
                    </div>

                    {/* Delete Icon */}
                    {items.length > 1 && (
                      <button 
                        type="button" 
                        className="btn-delete-row-hover"
                        onClick={() => onRemoveItem(index)}
                        title="Remove line item"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Subline: Optional "+ discount" per row link */}
                <div className="item-row-subline">
                  {!item.showDiscount ? (
                    <button 
                      type="button" 
                      className="btn-toggle-discount"
                      onClick={() => onUpdateItem(index, 'showDiscount', true)}
                    >
                      <Tag size={12} />
                      <span>+ add discount</span>
                    </button>
                  ) : (
                    <div className="row-discount-box">
                      <span className="mini-label" style={{ color: '#2563EB' }}>Row Discount (%):</span>
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        step="any"
                        value={item.discountRate || ''}
                        onChange={(e) => onUpdateItem(index, 'discountRate', e.target.value)}
                        placeholder="0"
                        className="form-input-sm"
                        style={{ width: '70px' }}
                      />
                      <button 
                        type="button" 
                        className="btn-toggle-discount" 
                        style={{ color: '#64748B' }}
                        onClick={() => {
                          onUpdateItem(index, 'discountRate', '');
                          onUpdateItem(index, 'showDiscount', false);
                        }}
                      >
                        <X size={13} />
                        <span>remove discount</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Item Button below table */}
        <button type="button" className="btn-add-item" onClick={onAddItem}>
          <Plus size={16} />
          <span>Add Item</span>
        </button>
      </div>

      {/* 5. TAX & DISCOUNT COLLAPSIBLE TOGGLE */}
      <div className="form-card">
        <button 
          type="button" 
          className="toggle-tax-discount"
          onClick={onToggleTaxDiscount}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={16} className="text-subtle" />
            <span>Add Tax & Discount</span>
          </span>
          {showTaxDiscount ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showTaxDiscount && (
          <div className="tax-discount-fields">
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Tax Rate (%)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    name="taxRate"
                    value={taxRate}
                    onChange={onChange}
                    placeholder="0"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Discount Rate (%)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    name="discountRate"
                    value={discountRate}
                    onChange={onChange}
                    placeholder="0"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. NOTES & TERMS */}
      <div className="form-card">
        <h2 className="section-title">
          <span className="section-title-icon"><FileText size={18} /></span>
          Notes & Payment Terms
        </h2>
        <div className="form-group">
          <textarea 
            name="notes"
            value={notes}
            onChange={onChange}
            placeholder="e.g. Bank Transfer details: IBAN DE89 3704 0044..., Payment due within 14 days."
            className="form-textarea"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
