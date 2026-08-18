import { Link } from 'react-router-dom';
import { Zap, MapPin, Shield, Clock, Star, Package, ArrowRight, Truck, Users, CheckCircle, Phone, Mail, Layers, Globe, Bike } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-dvh bg-white overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-[430px] mx-auto flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
              <Zap size={18} fill="white" className="text-white" />
            </div>
            <span className="font-black text-slate-900 text-base tracking-tight">amplified</span>
          </div>
          <div className="flex gap-2">
            <Link to="/login" className="px-3 py-1.5 text-sm font-semibold text-slate-700 hover:text-orange-500 transition-colors">Login</Link>
            <Link to="/signup" className="px-3 py-1.5 text-sm font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-5 pt-10 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-[430px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 px-3 py-1.5 rounded-full text-orange-300 text-xs font-semibold mb-5">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            Live deliveries in your city
          </div>
          <h1 className="text-4xl font-black leading-[1.1] tracking-tight mb-4">
            Fast. Safe.<br /><span className="text-orange-400">Amplified.</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Nigeria's most reliable logistics platform. Send packages anywhere — from documents to furniture — with real-time tracking and instant rider assignment.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/signup?role=customer" className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-all active:scale-95">
              <Package size={18} /> Send a Package <ArrowRight size={16} />
            </Link>
            <Link to="/signup?role=rider" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 rounded-2xl border border-white/20 transition-all">
              <Truck size={18} /> Become a Rider
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-8 pt-8 border-t border-white/10">
            {[['10K+', 'Deliveries'], ['500+', 'Riders'], ['4.9★', 'Rating']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-xl font-black text-orange-400">{val}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Package Types */}
      <section className="px-5 py-10 bg-slate-50">
        <div className="max-w-[430px] mx-auto">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Services</p>
          <h2 className="text-2xl font-black text-slate-900 mb-6">Choose your delivery type</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Bike size={22} className="text-orange-500" />, iconBg: 'bg-orange-100', title: 'Standard', desc: 'Lightweight items up to 5kg', card: 'bg-orange-50 border-orange-100' },
              { icon: <Layers size={22} className="text-purple-600" />, iconBg: 'bg-purple-100', title: 'Bulk', desc: 'Fixed price, 4+ locations', card: 'bg-purple-50 border-purple-100' },
              { icon: <Truck size={22} className="text-pink-600" />, iconBg: 'bg-pink-100', title: 'Heavy & Relocation', desc: 'Big loads & furniture', card: 'bg-pink-50 border-pink-100' },
              { icon: <Globe size={22} className="text-cyan-600" />, iconBg: 'bg-cyan-100', title: 'Inter-State', desc: 'Nationwide delivery', card: 'bg-cyan-50 border-cyan-100' },
            ].map(item => (
              <div key={item.title} className={`${item.card} border rounded-2xl p-4`}>
                <div className={`w-10 h-10 ${item.iconBg} rounded-xl flex items-center justify-center mb-3`}>{item.icon}</div>
                <div className="font-bold text-slate-800 text-sm">{item.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Amplified */}
      <section className="px-5 py-10">
        <div className="max-w-[430px] mx-auto">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Why us</p>
          <h2 className="text-2xl font-black text-slate-900 mb-6">Built for speed & trust</h2>
          <div className="space-y-4">
            {[
              { icon: <MapPin size={18} className="text-orange-500" />, title: 'Real-time GPS Tracking', desc: 'Watch your package move live on the map — every step of the way.' },
              { icon: <Shield size={18} className="text-green-500" />, title: 'Verified Riders', desc: 'Every rider is KYC-verified with ID, license, and vehicle docs checked.' },
              { icon: <Clock size={18} className="text-blue-500" />, title: '30-Min Average Pickup', desc: 'Our network of nearby riders means fast assignment and pickup.' },
              { icon: <Zap size={18} className="text-amber-500" />, title: 'Instant Price Quotes', desc: 'Get an accurate price estimate before you commit to any order.' },
            ].map(item => (
              <div key={item.title} className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">{item.icon}</div>
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{item.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 py-10 bg-slate-50">
        <div className="max-w-[430px] mx-auto">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Reviews</p>
          <h2 className="text-2xl font-black text-slate-900 mb-6">Loved by thousands</h2>
          <div className="space-y-4">
            {[
              { name: 'Chioma A.', role: 'Business Owner', text: 'Amplified handles all my store deliveries. Fast, reliable, and the bulk pricing saves me a lot!', stars: 5 },
              { name: 'Emeka O.', role: 'Customer', text: 'Real-time tracking gives me peace of mind. I can always see where my package is. 10/10.', stars: 5 },
              { name: 'Fatima K.', role: 'Rider Partner', text: 'The earnings are great and the app is very easy to use. I love the instant order alerts!', stars: 5 },
            ].map(review => (
              <div key={review.name} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex gap-0.5 mb-2">{Array(review.stars).fill(0).map((_, i) => <Star key={i} size={13} fill="#F59E0B" className="text-amber-400" />)}</div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">"{review.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">{review.name[0]}</div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{review.name}</div>
                    <div className="text-[10px] text-slate-500">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-10 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="max-w-[430px] mx-auto text-center text-white">
          <h2 className="text-2xl font-black mb-2">Ready to ship?</h2>
          <p className="text-orange-100 text-sm mb-6">Join 10,000+ Nigerians sending packages daily with Amplified</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold py-3.5 px-8 rounded-2xl hover:bg-orange-50 transition-colors">
            Get Started Free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Demo Login Cards */}
      <section className="px-5 py-8 bg-slate-900">
        <div className="max-w-[430px] mx-auto">
          <p className="text-slate-400 text-xs font-semibold text-center mb-4">DEMO ACCOUNTS — all use password: <span className="text-orange-400">password</span></p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { role: 'customer', label: 'Customer', email: 'customer@demo.com', color: 'bg-orange-500' },
              { role: 'rider', label: 'Rider', email: 'rider@demo.com', color: 'bg-purple-600' },
              { role: 'merchant', label: 'Merchant', email: 'merchant@demo.com', color: 'bg-cyan-600' },
              { role: 'admin', label: 'Admin', email: 'admin@demo.com', color: 'bg-green-600' },
            ].map(demo => (
              <Link key={demo.role} to={`/login?role=${demo.role}&email=${demo.email}`} className={`${demo.color} rounded-2xl p-4 text-white hover:opacity-90 transition-opacity`}>
                <div className="font-bold text-sm">{demo.label}</div>
                <div className="text-xs opacity-75 mt-0.5 truncate">{demo.email}</div>
                <div className="flex items-center gap-1 mt-2 text-xs font-medium">
                  Try demo <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 px-5 py-6">
        <div className="max-w-[430px] mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center"><Zap size={15} fill="white" className="text-white" /></div>
            <span className="font-black text-white text-sm tracking-tight">amplified logistics</span>
          </div>
          <p className="text-xs leading-relaxed mb-4">Nigeria's fastest logistics platform connecting customers with verified delivery riders across the country.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1"><Mail size={12} /> hello@amplified.ng</span>
            <span className="flex items-center gap-1"><Phone size={12} /> 0800-AMPLIFY</span>
          </div>
          <div className="border-t border-slate-800 mt-5 pt-4 text-xs text-center">© 2025 Amplified Logistics. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
