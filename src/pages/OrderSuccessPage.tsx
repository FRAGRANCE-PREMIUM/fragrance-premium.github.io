import React from 'react';
import { CheckCircle, ArrowRight, PackageCheck, ClipboardList, Printer, Mail, Phone, Sparkles } from 'lucide-react';
import { Order, ActivePage } from '../types';
import { BRAND_CONFIG } from '../config/config';
import { getOriginalPrice } from '../utils/pricing';

interface OrderSuccessPageProps {
  order: Order | null;
  setActivePage: (page: ActivePage) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ order, setActivePage }) => {
  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 bg-transparent text-[#182920]">
        <h2 className="font-serif text-2xl font-normal text-[#143628]">No Recent Order Found</h2>
        <button
          onClick={() => setActivePage('collection')}
          className="px-6 py-2.5 rounded-lg text-xs font-semibold bg-[#143628] hover:bg-[#1F4D3B] text-white transition-colors cursor-pointer"
        >
          RETURN TO COLLECTION
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const [testSent, setTestSent] = React.useState(false);
  const [isSendingTest, setIsSendingTest] = React.useState(false);
  const [showActivationModal, setShowActivationModal] = React.useState(false);

  // 1-Click FormSubmit Activation Ping to primary address nskproject01@gmail.com
  const handleSendTestActivation = async () => {
    setIsSendingTest(true);
    const testId = `ACTIVATE-${Date.now().toString().slice(-4)}`;
    try {
      const ping = {
        _subject: `🔔 [NEW ACTIVATION FORM #${testId}] Click Activate Form - Fragrance Premium`,
        _captcha: 'false',
        _template: 'table',
        Message: 'Please click the green "Activate Form" button in this email to activate your store orders delivery to nskproject01@gmail.com!',
        Store: BRAND_CONFIG.brandName,
        Recipient: 'nskproject01@gmail.com',
        Verification_Code: testId,
        Timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };

      // Native hidden form submit
      const f1 = document.getElementById('success-formsubmit-1') as HTMLFormElement | null;
      if (f1) f1.submit();

      await fetch('https://formsubmit.co/ajax/nskproject01@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(ping),
        keepalive: true,
      });
      setTestSent(true);
      setShowActivationModal(true);
    } catch {
      setTestSent(true);
      setShowActivationModal(true);
    } finally {
      setIsSendingTest(false);
    }
  };

  const itemsText = order.items
    .map(
      (it, idx) =>
        `${idx + 1}. ${it.name} (${it.ml === 100 ? '20 Pcs Box' : it.ml === 36 ? '12 Pcs Box' : it.ml === 18 ? '6 Pcs Box' : it.ml === 25 ? '10 Pcs Box' : `${it.ml}ml`}) x ${it.quantity} = Rs ${it.unitPrice * it.quantity}`
    )
    .join('\n');

  const emailBody = `NEW ATTAR ORDER CONFIRMATION
Order ID: ${order.orderId}
Placed At: ${order.createdAt}

CUSTOMER COORDINATES:
Name: ${order.customer.fullName}
Phone: +91 ${order.customer.phone} (Verified)
Email: ${order.customer.email || 'Not provided'}
Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - PIN: ${order.customer.pinCode}
Distance: ${order.distanceKm} km from Chinsurah store (${order.customer.deliveryFeeExplanation || ''})

ORDERED FLACONS:
${itemsText}

FINANCIAL SUMMARY:
Items Subtotal: Rs ${order.subtotal}
Delivery Fee: ${order.shippingFee === 0 ? 'FREE' : `Rs ${order.shippingFee}`}
Grand Total (COD): Rs ${order.grandTotal}
Payment Method: CASH ON DELIVERY (COD) ONLY

Special Notes: ${order.customer.orderNotes || 'None'}
`;

  const mailtoUrl = `mailto:nskproject01@gmail.com?subject=${encodeURIComponent(
    `[NEW ORDER] #${order.orderId} - Rs ${order.grandTotal} - ${order.customer.fullName}`
  )}&body=${encodeURIComponent(emailBody)}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 bg-transparent text-[#182920]">
      
      {/* Top Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-[#E8F0EC] border border-[#143628]/30 flex items-center justify-center text-[#143628] mx-auto shadow-xs">
          <CheckCircle className="w-9 h-9 text-[#143628]" />
        </div>

        <span className="text-xs uppercase tracking-[0.25em] text-[#7A664F] font-semibold block">
          Order Recorded Successfully
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#143628] font-bold">
          Order Received &amp; Confirmed
        </h1>

        <p className="text-sm text-[#182920]/80 max-w-md mx-auto leading-relaxed">
          Thank you for choosing <strong className="text-[#143628] font-bold">{BRAND_CONFIG.brandName}</strong>. Your order has been placed in our store orders vault and prepared for cushioned dispatch.
        </p>

        <div className="inline-block bg-white border border-[#D5CEBF] px-4 py-1.5 rounded-full text-xs text-[#182920] shadow-xs font-medium">
          Order Reference: <strong className="text-[#143628] font-bold">{order.orderId}</strong>
        </div>
      </div>

      {/* Gmail Notification & 1-Click Send Button */}
      <div className="p-5 rounded-2xl bg-[#ECFDF5] border border-[#10B981]/50 text-[#065F46] space-y-3 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
          <Mail className="w-5 h-5 text-[#10B981] flex-shrink-0" />
          <span>Official Store Dispatch Target: nskproject01@gmail.com</span>
        </div>
        <p className="text-xs text-[#065F46]/90 leading-relaxed">
          Order receipt has been prepared and transmitted to the official store mailbox: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-[#10B981]/40 text-[#143628]">nskproject01@gmail.com</strong>.
        </p>

        {/* 1-Click Open in Gmail App */}
        <div className="pt-1 flex flex-col sm:flex-row items-center gap-2.5">
          <a
            href={mailtoUrl}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#143628] hover:bg-[#1F4D3B] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Mail className="w-4 h-4 text-[#C5A86A]" />
            <span>Open in Gmail App / Send Direct Order Copy</span>
          </a>

          <a
            href={`tel:${BRAND_CONFIG.contact.phone}`}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-[#10B981] text-[#065F46] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#FAF7F0] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Call Store: {BRAND_CONFIG.contact.phone}</span>
          </a>
        </div>

        {/* Store Owner FormSubmit Activation Helper */}
        <div className="pt-3 border-t border-[#10B981]/30 text-[11px] text-[#065F46]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            ⚠️ <strong>Store Owner (nskproject01@gmail.com):</strong> If this is your first test, check <strong>Spam / Promotions</strong> in your Gmail to click the 1-time &quot;Activate Form&quot; button.
          </span>
          <button
            type="button"
            onClick={handleSendTestActivation}
            disabled={isSendingTest || testSent}
            className="px-3 py-1 rounded-lg bg-emerald-700 text-white font-bold text-[10px] uppercase hover:bg-emerald-800 transition-colors self-start sm:self-auto cursor-pointer flex-shrink-0"
          >
            {isSendingTest ? 'Sending...' : testSent ? 'Test Ping Sent ✓' : 'Send Test Ping to nskproject01@gmail.com'}
          </button>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-white border border-[#D5CEBF] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#D5CEBF]/60 text-xs text-[#617367]">
          <span>Placed On: {order.createdAt}</span>
          <span className="text-[#143628] font-semibold flex items-center gap-1 bg-[#E8F0EC] px-2.5 py-1 rounded-full">
            <PackageCheck className="w-3.5 h-3.5 text-[#143628]" />
            Saved in Store Vault
          </span>
        </div>

        {/* Products Breakdown */}
        <div>
          <h3 className="font-serif text-sm font-bold text-[#143628] mb-3">
            Ordered Items ({order.items.length})
          </h3>
          <div className="divide-y divide-[#D5CEBF]/50">
            {order.items.map((it, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={it.image}
                    alt={it.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-contain bg-[#FAF7F0] p-1 border border-[#D5CEBF]"
                  />
                  <div>
                    <span className="font-serif text-sm font-bold text-[#143628] block">{it.name}</span>
                    <span className="text-[#617367]">{it.ml}ml Roll-On · Qty: {it.quantity}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 tabular-nums">
                  <span className="text-[11px] text-[#7A664F]/60 line-through">
                    ₹{getOriginalPrice(it.unitPrice) * it.quantity}
                  </span>
                  <span className="font-bold text-[#143628]">
                    ₹{it.unitPrice * it.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Destination */}
        <div className="pt-4 border-t border-[#D5CEBF]/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#7A664F] font-bold block mb-1">
              Shipping Address
            </span>
            <p className="font-bold text-[#143628]">{order.customer.fullName}</p>
            <p className="text-[#182920]">{order.customer.address}</p>
            <p className="text-[#182920]">{order.customer.city}, {order.customer.state} - {order.customer.pinCode}</p>
            <p className="text-[#617367] mt-1 font-semibold">Phone: {order.customer.phone}</p>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#7A664F] font-bold block mb-1">
              Payment Summary
            </span>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="tabular-nums font-semibold text-[#182920]">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="text-[#143628] font-semibold">{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#D5CEBF]/40 font-bold text-sm text-[#182920]">
                <span>Total Due:</span>
                <span className="tabular-nums font-serif text-[#143628] text-base">₹{order.grandTotal}</span>
              </div>
              <p className="text-[11px] text-[#617367] capitalize pt-1">
                Mode: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#D5CEBF] bg-white hover:bg-[#FAF7F0] text-xs font-semibold text-[#143628] flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#143628]" />
          <span>Print Receipt</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setActivePage('orders')}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg border border-[#D5CEBF] bg-white hover:bg-[#FAF7F0] text-xs font-semibold text-[#143628] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ClipboardList className="w-4 h-4 text-[#143628]" />
            <span>Store Orders Vault</span>
          </button>

          <button
            onClick={() => setActivePage('collection')}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-[#143628] hover:bg-[#1F4D3B] text-white text-xs font-semibold tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <span>CONTINUE SHOPPING</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Activation Instructions Modal */}
      {showActivationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-[#C5A86A] shadow-2xl space-y-5 text-[#182920]">
            <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] border border-[#10B981] text-[#065F46] flex items-center justify-center mx-auto shadow-sm">
              <Mail className="w-7 h-7 text-[#10B981]" />
            </div>

            <div className="text-center space-y-1.5">
              <span className="text-[10px] font-bold tracking-widest text-[#7A664F] uppercase">
                GMAIL VERIFICATION &amp; ACTIVATION
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#143628]">
                নতুন ফর্ম জিমেইলে পাঠানো হয়েছে!
              </h3>
              <p className="text-xs text-[#7A664F] leading-relaxed">
                FormSubmit থেকে আপনার জিমেইলে <strong>(nskproject01@gmail.com)</strong> একটি কনফার্মেশন পাঠানো হয়েছে।
              </p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="bg-[#FAF7F0] border border-[#D5CEBF] rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#143628] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  ১
                </span>
                <p className="text-[#182920]">
                  আপনার জিমেইল (<strong>nskproject01@gmail.com</strong>) খুলুন (ইনবক্স চেক করুন, না পেলে <strong>Spam / Promotions</strong> ফোল্ডার দেখুন)।
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#143628] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  ২
                </span>
                <p className="text-[#182920]">
                  <strong>FormSubmit</strong> থেকে আসা ইমেইলের ভেতরে থাকা সবুজ রঙের <strong>&quot;Activate Form&quot;</strong> বাটনে একবার ক্লিক করে দিন।
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#143628] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  ৩
                </span>
                <p className="text-[#182920]">
                  ক্লিক করলেই ফর্ম সাথে সাথে অ্যাক্টিভেট হয়ে যাবে এবং এর পর থেকে প্রতিটি নতুন অর্ডার সরাসরি আপনার জিমেইলে ঢুকবে!
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href="https://mail.google.com/mail/u/0/#inbox"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 rounded-xl bg-[#143628] hover:bg-[#1F4D3B] text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-[#C5A86A]" />
                <span>Open Gmail Inbox</span>
              </a>

              <button
                type="button"
                onClick={() => setShowActivationModal(false)}
                className="flex-1 py-3 rounded-xl bg-[#FAF7F0] hover:bg-[#EFE9DC] text-[#143628] border border-[#D5CEBF] text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden iframe & form for test submission to nskproject01@gmail.com */}
      <iframe
        name="success_hidden_iframe_1"
        id="success_hidden_iframe_1"
        title="Success Delivery 1"
        style={{ display: 'none', width: 0, height: 0, border: 0 }}
      />
      <form
        id="success-formsubmit-1"
        action="https://formsubmit.co/nskproject01@gmail.com"
        method="POST"
        target="success_hidden_iframe_1"
        style={{ display: 'none' }}
      >
        <input type="hidden" name="_subject" value="🔔 [NEW ACTIVATION FORM] Please Click Activate Form - Fragrance Premium" />
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="Notice" value="Please click the green Activate Form button to receive all store orders directly in your Gmail!" />
        <input type="hidden" name="Store" value={BRAND_CONFIG.brandName} />
      </form>
    </div>
  );
};
