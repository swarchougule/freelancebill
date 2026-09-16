import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'Is FreelanceBill really free to use without an account?',
    answer: 'Yes! You can generate, preview, and download clean PDF invoices instantly without creating an account or entering a credit card. No sign-up required.'
  },
  {
    question: 'How do I download my invoice as a PDF?',
    answer: 'Simply click the "Download as PDF" button above the preview card. It uses standard browser printing optimized via clean print CSS (@media print) to render an A4 PDF document without form inputs or buttons.'
  },
  {
    question: 'Can I charge hourly rates as well as fixed prices?',
    answer: 'Absolutely. Each line item has a segmented selector for Hourly (Hours × Rate/hr), Fixed Price, or Quantity. You can mix and match billing types within a single invoice.'
  },
  {
    question: 'Are my data and invoice details private?',
    answer: '100% private. All your data stays strictly in your browser local state. We do not store or transmit your client list, rate information, or business details to external servers.'
  },
  {
    question: 'What currencies are supported?',
    answer: 'We support INR (₹), USD ($), EUR (€), GBP (£), CAD ($), and AUD ($). You can switch currencies anytime using the dropdown.'
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="faq-accordion-list">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
            <button 
              type="button" 
              className="faq-question-btn"
              onClick={() => toggleItem(idx)}
            >
              <span className="faq-question-text">{item.question}</span>
              <ChevronDown 
                size={18} 
                className={`faq-chevron ${isOpen ? 'rotated' : ''}`} 
              />
            </button>
            {isOpen && (
              <div className="faq-answer-box">
                <p className="faq-answer-text">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
