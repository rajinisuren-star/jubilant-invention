import { useState } from 'react'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { Medications } from './components/Medications'
import { Appointments } from './components/Appointments'
import { WellnessCheckIn } from './components/WellnessCheckIn'
import { EmergencyContacts } from './components/EmergencyContacts'
import { SettingsPage } from './components/SettingsPage'
import { SettingsProvider } from './context/SettingsContext'
import type { TabKey } from './types'

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard')

  return (
    <SettingsProvider>
      <Layout active={activeTab} onChange={setActiveTab}>
        {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
        {activeTab === 'medications' && <Medications />}
        {activeTab === 'appointments' && <Appointments />}
        {activeTab === 'wellness' && <WellnessCheckIn />}
        {activeTab === 'contacts' && <EmergencyContacts />}
        {activeTab === 'settings' && <SettingsPage />}
      </Layout>
    </SettingsProvider>
  )
}

export default App
