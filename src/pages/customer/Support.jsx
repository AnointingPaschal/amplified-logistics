import { useState } from 'react'
import { MessageCircle, Phone, Mail, ChevronDown, ChevronUp, ExternalLink, Send } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageLayout } from '../../components/layout/AppShell'

const FAQS = [
  { q:'How do I track my order?', a:'After placing an order, tap the "Track" button on your orders list or on the confirmation screen. You\'ll see a live map with your rider\'s location.' },
  { q:'What if my package is lost or damaged?', a:'Contact us within 24 hours via the Help Center. If you purchased package protection, your claim will be processed within 2-3 business days.' },
  { q:'Can I cancel my order?', a:'You can cancel before a rider is assigned at no charge. After assignment, a ₦500 cancellation fee applies. Once the rider is at pickup, cancellation is not available.' },
  { q:'How do refunds work?', a:'Approved refunds are credited to your Amplified Wallet within 24 hours, or to your original payment method within 3-5 business days.' },
  { q:'What areas do you cover?', a:'We currently operate in major Nigerian cities including Lagos, Abuja, Port Harcourt, Kano, Ibadan, Enugu, Umuahia, and more. Check availability at booking.' },
  { q:'How is pricing calculated?', a:'Pricing is based on distance, package size, service type, and time of day. Get an instant quote before confirming any order.' },
]

export default function Support() {
  const { showToast } = useApp()
  const [open, setOpen] = useState(null)
  const [ticket, setTicket] = useState('')
  const [subject, setSubject] = useState('')
  const [sending, setSending] = useState(false)

  const sendTicket = async () => {
    if (!subject||!ticket) { showToast('Fill in all fields','error'); return }
    setSending(true)
    await new Promise(r=>setTimeout(r,1000))
    showToast('Support ticket submitted! We\'ll respond within 24 hours.','success')
    setSubject(''); setTicket(''); setSending(false)
  }

  return (
    <PageLayout title="Help Center" back>
      {/* Contact options */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon:<MessageCircle size={20}/>, label:'Live Chat', sub:'Online now', action:()=>showToast('Live chat coming soon','info'), color:'bg-blue-50 text-blue-600' },
          { icon:<Phone size={20}/>, label:'Call Us', sub:'+234 800 AMP', action:()=>window.open('tel:+2348001234567'), color:'bg-green-50 text-green-600' },
          { icon:<Mail size={20}/>, label:'Email', sub:'support@', action:()=>window.open('mailto:support@amplified.ng'), color:'bg-purple-50 text-purple-600' },
        ].map(c=>(
          <button key={c.label} onClick={c.action} className="bg-white border border-gray-100 rounded-2xl p-3.5 text-center shadow-sm active:bg-gray-50">
            <div className={`w-10 h-10 ${c.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>{c.icon}</div>
            <p className="text-xs font-bold text-gray-900">{c.label}</p>
            <p className="text-[10px] text-gray-400">{c.sub}</p>
          </button>
        ))}
      </div>

      {/* FAQs */}
      <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Frequently Asked Questions</p>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
        {FAQS.map((faq,i)=>(
          <div key={i} className={i<FAQS.length-1?'border-b border-gray-50':''}>
            <button onClick={()=>setOpen(open===i?null:i)}
              className="w-full flex items-center justify-between px-4 py-4 text-left">
              <span className="text-sm font-semibold text-gray-900 pr-4">{faq.q}</span>
              {open===i?<ChevronUp size={16} className="text-gray-400 flex-shrink-0"/>:<ChevronDown size={16} className="text-gray-400 flex-shrink-0"/>}
            </button>
            {open===i && <div className="px-4 pb-4"><p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p></div>}
          </div>
        ))}
      </div>

      {/* Submit ticket */}
      <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Submit a Ticket</p>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <select value={subject} onChange={e=>setSubject(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800">
          <option value="">Select issue type</option>
          <option>Order not received</option>
          <option>Wrong item delivered</option>
          <option>Package damaged</option>
          <option>Rider behaviour</option>
          <option>Payment issue</option>
          <option>App technical issue</option>
          <option>Other</option>
        </select>
        <textarea value={ticket} onChange={e=>setTicket(e.target.value)}
          placeholder="Describe your issue in detail…" rows={4}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm resize-none placeholder-gray-400"/>
        <button onClick={sendTicket} disabled={sending}
          className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 disabled:opacity-60">
          <Send size={15}/> {sending?'Submitting…':'Submit Ticket'}
        </button>
      </div>
    </PageLayout>
  )
}
