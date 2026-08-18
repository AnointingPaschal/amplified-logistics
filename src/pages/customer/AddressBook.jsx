import { useState, useEffect } from 'react'
import { MapPin, Plus, Home, Briefcase, Trash2, Edit3, Star } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageLayout } from '../../components/layout/AppShell'
import { Modal } from '../../components/ui'
import { PlacesInput } from '../../components/map/PlacesInput'
import * as db from '../../lib/db'

const LABEL_ICONS = { Home:<Home size={16}/>, Work:<Briefcase size={16}/>, Other:<MapPin size={16}/> }
const LABEL_COLORS = { Home:'bg-blue-100 text-blue-600', Work:'bg-purple-100 text-purple-600', Other:'bg-gray-100 text-gray-600' }

export default function AddressBook() {
  const { user, showToast } = useApp()
  const [addresses, setAddresses] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [label, setLabel] = useState('Home')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) db.getSavedAddresses(user.id).then(setAddresses).catch(()=>{})
  }, [user])

  const handleSave = async () => {
    if (!selected?.address) { showToast('Select an address','error'); return }
    setLoading(true)
    try {
      const { data, error } = await import('../../lib/supabase').then(m=>m.supabase
        .from('saved_addresses').insert({ user_id:user.id, label, address:selected.address, lat:selected.lat, lng:selected.lng }).select().single())
      if (!error && data) setAddresses(a=>[data,...a])
      showToast('Address saved','success')
      setShowAdd(false); setSelected(null); setLabel('Home')
    } catch { showToast('Failed to save','error') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    await import('../../lib/supabase').then(m=>m.supabase.from('saved_addresses').delete().eq('id',id))
    setAddresses(a=>a.filter(x=>x.id!==id))
    showToast('Address removed','success')
  }

  return (
    <PageLayout title="Address Book" back>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{addresses.length} saved addresses</p>
        <button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-xl">
          <Plus size={13}/> Add Address
        </button>
      </div>

      {addresses.length===0 ? (
        <div className="text-center py-16">
          <MapPin size={40} className="text-gray-200 mx-auto mb-3"/>
          <p className="font-bold text-gray-700 mb-1">No saved addresses</p>
          <p className="text-sm text-gray-400 mb-4">Save your frequent pickup & dropoff locations</p>
          <button onClick={()=>setShowAdd(true)} className="bg-gray-900 text-white font-bold px-6 py-3 rounded-2xl text-sm">Add Your First Address</button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map(a=>(
            <div key={a.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${LABEL_COLORS[a.label]||LABEL_COLORS.Other}`}>
                {LABEL_ICONS[a.label]||LABEL_ICONS.Other}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{a.label}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">{a.address}</p>
              </div>
              <button onClick={()=>handleDelete(a.id)} className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <Trash2 size={14} className="text-red-400"/>
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={()=>setShowAdd(false)} title="Add Address">
        <div className="space-y-4 mt-2">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Label</label>
            <div className="flex gap-2">
              {['Home','Work','Other'].map(l=>(
                <button key={l} onClick={()=>setLabel(l)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${label===l?'border-gray-900 bg-gray-900 text-white':'border-gray-100 text-gray-600'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Address</label>
            <PlacesInput placeholder="Search for address…" onSelect={setSelected}/>
            {selected && <p className="text-xs text-green-600 mt-1.5 font-semibold">{selected.address}</p>}
          </div>
          <button onClick={handleSave} disabled={!selected||loading}
            className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-2xl text-sm disabled:opacity-50">
            {loading?'Saving…':'Save Address'}
          </button>
        </div>
      </Modal>
    </PageLayout>
  )
}
