import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Loader2, Check, ShoppingBag, Wallet } from 'lucide-react';
import { View } from '../types';
import { PRODUCTS_DATA, DIGITAL_PRODUCTS_DATA, COMPLIANCE_DATA } from '../data';

interface CheckoutPageProps {
  onNavigate: (view: View) => void;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

function getServiceIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('service');
}

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const [serviceId] = useState<string | null>(getServiceIdFromUrl);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isError, setIsError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [pincode, setPincode] = useState('');

  const [activeGateway, setActiveGateway] = useState<'razorpay' | 'easebuzz' | null>(null);

  const product = PRODUCTS_DATA.find((p) => p.id === serviceId) || DIGITAL_PRODUCTS_DATA.find((p) => p.id === serviceId);
  const totalPayable = product?.price || 0;

  const loadRazorpaySDK = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const loadEasebuzzSDK = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).EasebuzzCheckout) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://seamless.easebuzz.in/images/v1/easebuzz-checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProceedWithGateway = async (selectedGateway: 'razorpay' | 'easebuzz') => {
    if (!name || !email || !phone) {
      setIsError('Please enter your Name, Email, and Mobile number first.');
      return;
    }

    setIsProcessing(true);
    setActiveGateway(selectedGateway);
    setIsError('');

    try {
      if (selectedGateway === 'razorpay') {
        const orderRes = await fetch('/api/razorpay/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalPayable,
            currency: 'INR',
            notes: {
              customer_name: name,
              email,
              phone,
              product: product?.title || 'Product'
            }
          })
        });

        const orderData = await orderRes.json();
        if (orderData && orderData.id) {
          const sdkLoaded = await loadRazorpaySDK();
          if (sdkLoaded && (window as any).Razorpay) {
            const options = {
              key: orderData.key_id || 'rzp_live_TVZDaWYRR3Y6Dt',
              amount: orderData.amount,
              currency: orderData.currency || 'INR',
              name: 'Ott King',
              description: product?.title || 'Digital Product',
              order_id: orderData.id,
              prefill: {
                name,
                email,
                contact: phone
              },
              theme: {
                color: '#4f46e5'
              },
              handler: async function (response: any) {
                console.log('Razorpay payment response:', response);
                try {
                  const verifyRes = await fetch('/api/razorpay/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(response)
                  });
                  const verifyData = await verifyRes.json();
                  if (verifyData.verified || verifyData.status === 'success') {
                    window.history.pushState({}, '', '/services?status=success');
                    onNavigate('services');
                  } else {
                    window.history.pushState({}, '', '/services?status=failed');
                    onNavigate('services');
                  }
                } catch {
                  window.history.pushState({}, '', '/services?status=success');
                  onNavigate('services');
                }
              }
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          } else {
            // Hosted checkout fallback
            window.location.href = `/api/razorpay/pay?amount=${totalPayable}&order_id=${orderData.id}&name=Ott%20King&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
          }
        } else {
          setIsError(orderData.error || 'Failed to create Razorpay order');
        }
      } else {
        // Easebuzz Flow
        const payload = {
          amount: totalPayable,
          phone,
          email,
          firstname: name,
          productinfo: product?.title || 'Digital Product',
          address,
          city,
          state: stateVal,
          pincode
        };

        const res = await fetch('/api/easebuzz/pay-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.status === 'success' && data.access_key) {
          const sdkLoaded = await loadEasebuzzSDK();
          
          if (sdkLoaded && (window as any).EasebuzzCheckout) {
            const easebuzzCheckout = new (window as any).EasebuzzCheckout(data.key, 'prod');
            const options = {
              access_key: data.access_key,
              onResponse: (response: any) => {
                console.log('Easebuzz SDK response:', response);
                if (response.status === 'success') {
                  window.history.pushState({}, '', '/services?status=success');
                  onNavigate('services');
                } else {
                  window.history.pushState({}, '', '/services?status=failed');
                  onNavigate('services');
                }
              }
            };
            easebuzzCheckout.initiatePayment(options);
          } else {
            window.location.href = `https://pay.easebuzz.in/pay/${data.access_key}`;
          }
        } else {
          setIsError(data.message || data.error || 'Payment initiation failed');
        }
      }
    } catch (err: any) {
      setIsError('Network error: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-black pt-32 pb-24 overflow-hidden min-h-screen"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => {
            window.history.pushState({}, '', '/services');
            onNavigate('services');
          }}
          className="group inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors mb-10 py-1"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to catalog</span>
        </button>

        {!product ? (
          <div className="rounded-2xl border border-white/5 bg-[#0B0B0B] p-12 text-center max-w-lg mx-auto">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 mb-4">
              <ShoppingBag className="h-6 w-6 text-gray-500" />
            </div>
            <h2 className="font-display text-lg font-bold text-white mb-2">Product Unavailable</h2>
            <p className="text-xs text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
              The service you are looking for does not exist or has been removed from our catalog.
            </p>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/services');
                onNavigate('services');
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-500/10 transition-all duration-200 active:scale-[0.98]"
            >
              Browse Product Catalog
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-white/5 bg-[#0B0B0B] p-6 sm:p-8 shadow-xl">
                <h2 className="font-display text-lg font-bold text-white mb-1">Checkout</h2>
                <p className="text-xs text-gray-500 font-mono mb-6">Complete your booking information</p>

                  <form onSubmit={handleProceedToPayment} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 pl-1">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Shubham Yadav"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-black/30 focus:outline-none transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 pl-1">
                      Email ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="partner@company.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-black/30 focus:outline-none transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 pl-1">
                      Mobile Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      pattern="[0-9]{10}"
                      maxLength={10}
                      placeholder="9027579170"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-black/30 focus:outline-none transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 pl-1">
                      Billing Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Bukhara, Near Bakli Fatak"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-black/30 focus:outline-none transition-all font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 pl-1">
                        City <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="Bijnor"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-black/30 focus:outline-none transition-all font-sans"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 pl-1">
                        State <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={stateVal}
                        onChange={e => setStateVal(e.target.value)}
                        placeholder="Uttar Pradesh"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-black/30 focus:outline-none transition-all font-sans"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 pl-1">
                        Pincode <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={e => setPincode(e.target.value)}
                        pattern="[0-9]{6}"
                        maxLength={6}
                        placeholder="246701"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-black/30 focus:outline-none transition-all font-sans"
                      />
                    </div>
                  </div>

                  {isError && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                      <p className="text-xs text-red-400">{isError}</p>
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleProceedWithGateway('razorpay')}
                      className="group/btn relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-4 text-xs font-bold text-white shadow-xl shadow-indigo-500/20 transition-all duration-200 disabled:opacity-70 active:scale-[0.98] flex items-center justify-between"
                    >
                      <span className="inline-flex items-center gap-2.5">
                        {isProcessing && activeGateway === 'razorpay' ? (
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
                        )}
                        <span className="text-sm">
                          {isProcessing && activeGateway === 'razorpay'
                            ? 'Opening Razorpay Checkout...'
                            : `Pay ${formatPrice(totalPayable)} via Razorpay Live`}
                        </span>
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/15 text-white border border-white/20">
                        ⚡ UPI / Cards / QR
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleProceedWithGateway('easebuzz')}
                      className="group/btn relative w-full overflow-hidden rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-emerald-500/30 hover:border-emerald-500/60 px-6 py-3.5 text-xs font-semibold text-gray-200 hover:text-white transition-all duration-200 disabled:opacity-70 active:scale-[0.98] flex items-center justify-between"
                    >
                      <span className="inline-flex items-center gap-2.5">
                        {isProcessing && activeGateway === 'easebuzz' ? (
                          <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                        ) : (
                          <Wallet className="h-4 w-4 text-emerald-400" />
                        )}
                        <span>
                          {isProcessing && activeGateway === 'easebuzz'
                            ? 'Opening Easebuzz Gateway...'
                            : `Pay ${formatPrice(totalPayable)} via Easebuzz Pay`}
                        </span>
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        🛡️ Easebuzz Gateway
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-white/5 bg-[#0B0B0B] p-6 sm:p-8 shadow-xl sticky top-28">
                <h2 className="font-display text-lg font-bold text-white mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 mb-1">
                      Selected Service
                    </p>
                    <p className="text-sm font-semibold text-white leading-snug">{product.title}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{product.tagline}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="border-t border-white/5 pt-2 flex items-center justify-between">
                      <span className="font-semibold text-white">Total Payable</span>
                      <span className="font-bold text-white text-base font-display">
                        {formatPrice(totalPayable)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    {product.deliverables.length > 0 && (
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2">
                          Deliverables
                        </p>
                        <ul className="space-y-1.5">
                          {product.deliverables.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-[11px] text-gray-500">
                              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-mono text-gray-600">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Secured via 256-bit SSL encryption</span>
                </div>
                <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                    <span className="text-[10px] font-mono font-semibold text-indigo-400 uppercase tracking-wider">
                      Verified Multi-Gateway Checkout
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    Choose between <strong className="text-gray-300">Razorpay Live</strong> (Instant UPI & QR) or <strong className="text-gray-300">Easebuzz Pay</strong> (RBI-approved). Both gateways support UPI, Cards, and Net Banking with 256-bit encryption.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
