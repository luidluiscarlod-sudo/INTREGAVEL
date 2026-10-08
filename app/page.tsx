'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  KeyRound,
  Palette,
  EyeOff,
  ClipboardList,
  Database,
  Download,
  FileSearch,
  HelpCircle,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  Menu,
  MessageCircle,
  MapPin,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Users,
  X,
} from 'lucide-react'

type SearchRecord = {
  id: number
  name: string
  phone: string
  status: 'Found' | 'Pending' | 'Not found'
  updated: string
  avatar: string
  photo: string
  gender: string
  source: string
}

const initialRecords: SearchRecord[] = []

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'New search', icon: Plus },
  { label: 'History', icon: ClipboardList },
  { label: 'Contacts', icon: Users },
  { label: 'Reports', icon: BarChart3 },
]

export default function Page() {
  const [active, setActive] = useState('Overview')
  const [query, setQuery] = useState('')
  const [records, setRecords] = useState(initialRecords)
  const [notice, setNotice] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [refundOpen, setRefundOpen] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [profilePhoto, setProfilePhoto] = useState('')
  const [selectedSource, setSelectedSource] = useState('WhatsApp')
  const [locatorCountry, setLocatorCountry] = useState('+55')
  const [areaCode, setAreaCode] = useState('')
  const [locatorResult, setLocatorResult] = useState<{ country: string; region: string; confidence: string } | null>(null)
  const [personName, setPersonName] = useState('')
  const [personPhoto, setPersonPhoto] = useState('')
  const [personGender, setPersonGender] = useState('')
  const [analysis, setAnalysis] = useState<{ phone: string; name: string; photo: string; progress: number; done: boolean; startedAt: number; source: string } | null>(null)
  const socialSources = ['WhatsApp', 'Instagram', 'TikTok', 'Tinder', 'Facebook']
  const sourceTabs = [...socialSources, 'Number locator']
  const countryCodes = [['+55', 'Brazil'], ['+1', 'United States / Canada'], ['+351', 'Portugal'], ['+44', 'United Kingdom'], ['+34', 'Spain'], ['+33', 'France'], ['+49', 'Germany'], ['+39', 'Italy'], ['+52', 'Mexico'], ['+54', 'Argentina'], ['+56', 'Chile'], ['+57', 'Colombia'], ['+58', 'Venezuela'], ['+51', 'Peru'], ['+598', 'Uruguay'], ['+595', 'Paraguay'], ['+591', 'Bolivia'], ['+81', 'Japan'], ['+82', 'South Korea'], ['+86', 'China'], ['+91', 'India'], ['+61', 'Australia'], ['+64', 'Nova Zelândia'], ['+27', 'África do Sul'], ['+20', 'Egito'], ['+971', 'Emirados Árabes'], ['+972', 'Israel'], ['+90', 'Turquia'], ['+7', 'Rússia'], ['+380', 'Ucrânia'], ['+31', 'Países Baixos'], ['+32', 'Bélgica'], ['+41', 'Suíça'], ['+43', 'Áustria'], ['+45', 'Dinamarca'], ['+46', 'Suécia'], ['+47', 'Noruega'], ['+48', 'Polônia'], ['+30', 'Grécia'], ['+353', 'Irlanda']]
  const [countryCode, setCountryCode] = useState('+55')
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authPasswordRepeat, setAuthPasswordRepeat] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleAuthSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthError('')
    if (authMode === 'signup' && authPassword !== authPasswordRepeat) {
      setAuthError('Passwords do not match.')
      return
    }
    if (authPassword.length < 8) {
      setAuthError('Use a password with at least 8 characters.')
      return
    }
    setIsAuthenticated(true)
  }

  useEffect(() => {
    const clearResearchOnExit = () => {
      setRecords([])
      setAnalysis(null)
      setQuery('')
      setPersonName('')
      setPersonPhoto('')
      setPersonGender('')
    }

    window.addEventListener('pagehide', clearResearchOnExit)
    return () => window.removeEventListener('pagehide', clearResearchOnExit)
  }, [])
  
  useEffect(() => {
    if (!analysis || analysis.done) return
    const timer = window.setInterval(() => {
      setAnalysis((current) => {
        if (!current) return null
        const elapsed = Date.now() - current.startedAt
        const nextProgress = Math.min((elapsed / 180000) * 100, 100)
        return { ...current, progress: nextProgress, done: elapsed >= 180000 }
      })
    }, 250)
    return () => window.clearInterval(timer)
  }, [analysis?.phone, analysis?.done])

  useEffect(() => {
    if (analysis?.done) setNotice('')
  }, [analysis?.done])

  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return records
    return records.filter((record) => `${record.name} ${record.phone}`.toLowerCase().includes(normalized))
  }, [query, records])

  async function runSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = query.trim()
    const fullPhone = selectedSource === 'WhatsApp' ? `${countryCode}${value.replace(/^\+/, '')}` : value
    if (!personPhoto || !personName.trim() || !personGender || !value) {
      setNotice('Complete the photo, name, gender, and identifier before searching.')
      return
    }
    if (!value) {
      setNotice('Enter an identifier to start the search.')
      return
    }
    const newRecord: SearchRecord = {
      id: Date.now(),
      name: personName.trim() || 'Searched person',
      phone: fullPhone,
      status: 'Pending',
      updated: 'Agora',
      avatar: (personName.trim() || 'PP').slice(0, 2).toUpperCase(),
      photo: '',
      gender: personGender || 'Not specified',
      source: selectedSource,
    }
    setRecords((current) => [newRecord, ...current])
    setAnalysis({ phone: value, name: personName.trim() || 'Searched contact', photo: '', progress: 0, done: false, startedAt: Date.now(), source: selectedSource })
    setNotice(`Search started for “${value}”.`)
    if (selectedSource === 'WhatsApp') {
      try {
        const response = await fetch('/api/whatsapp-profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: fullPhone }) })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'The search could not be completed.')
        const realPhoto = result.picture || ''
        setAnalysis((current) => current ? { ...current, photo: realPhoto } : current)
        setRecords((current) => current.map((record) => record.id === newRecord.id ? { ...record, photo: realPhoto, status: realPhoto ? 'Found' : 'Pending' } : record))
        if (realPhoto) setNotice(`Photo found for “${value}”.`)
      } catch (error) {
        setNotice(error instanceof Error ? error.message : 'The search could not be completed.')
      }
    } else {
      setQuery('')
      setPersonName('')
      setPersonPhoto('')
      setPersonGender('')
      setActive('History')
    }
  }

  function startNewSearch() {
    setActive('New search')
    setQuery('')
    setPersonName('')
    setPersonPhoto('')
    setPersonGender('')
    setAnalysis(null)
    setNotice('Complete the photo, name, gender, and identifier to search.')
  }

  function handlePersonPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPersonPhoto(String(reader.result))
    reader.readAsDataURL(file)
  }

  function handleProfilePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setProfilePhoto(String(reader.result))
    reader.readAsDataURL(file)
  }

  function profileInitials() {
    const initials = profileName.trim().split(/\\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('')
    return initials.toUpperCase() || 'IP'
  }

  function saveProfile() {
    setProfileOpen(false)
    setNotice(profileName.trim() ? 'Profile updated successfully.' : 'Profile saved without a name.')
  }

  const sectionTitle = active === 'New search' ? 'New search' : active === 'History' ? 'Search history' : active === 'Contacts' ? 'Contacts' : active === 'Reports' ? 'Reports' : 'Overview'
  const sectionSubtitle = active === 'New search' ? 'Start a new search using the information you provide.' : active === 'History' ? 'View only the searches you have completed.' : active === 'Contacts' ? 'Contacts found in your searches will appear here.' : active === 'Reports' ? 'Export and track your search results.' : 'Searches and reports from your workspace.'

  function exportReport() {
    const content = ['Search,Contact,Gender,Source,Identifier,Status,Updated', ...records.map((r) => `${r.name},${r.gender},${r.source},${r.phone},${r.status},${r.updated}`)].join('\n')
    const link = document.createElement('a')
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(content)}`
    link.download = 'search-report.csv'
    link.click()
    setNotice('Report exported successfully.')
  }

  const analysisStepsBySource: Record<string, string[]> = { WhatsApp: ['Decrypting messages', 'Scanning photos and videos', 'Reviewing call activity', 'Checking shared media', 'Organizing available results'], Instagram: ['Reviewing Direct conversations', 'Scanning liked photos and videos', 'Checking saved posts', 'Reviewing shared media', 'Organizing Instagram results'], TikTok: ['Reviewing liked videos', 'Scanning comments and mentions', 'Checking shared videos', 'Reviewing follower activity', 'Organizing TikTok results'], Tinder: ['Reviewing profile details', 'Checking matches', 'Scanning conversations', 'Reviewing shared interests', 'Organizing Tinder results'], Facebook: ['Reviewing Messenger conversations', 'Scanning liked posts and photos', 'Checking shared media', 'Reviewing friend interactions', 'Organizing Facebook results'] }
  const analysisSteps = analysisStepsBySource[selectedSource] || analysisStepsBySource.WhatsApp
  const resultLabels: Record<string, { heading: string; description: string }> = { WhatsApp: { heading: 'WhatsApp results', description: 'Authorized messages, media, and call activity.' }, Instagram: { heading: 'Instagram results', description: 'Authorized Direct conversations, likes, saved posts, and shared media.' }, TikTok: { heading: 'TikTok results', description: 'Authorized liked videos, comments, mentions, and shares.' }, Tinder: { heading: 'Tinder results', description: 'Authorized matches, conversations, and profile activity.' }, Facebook: { heading: 'Facebook results', description: 'Authorized Messenger conversations, likes, and interactions.' } }
  const activeResultLabels = resultLabels[selectedSource] || resultLabels.WhatsApp
  const sourceConfig: Record<string, { title: string; description: string; items: string[]; label: string; placeholder: string }> = { WhatsApp: { title: 'WhatsApp intelligence', description: 'Review authorized profile signals, shared media, conversations, and call activity.', items: ['Profile photo', 'Messages and conversations', 'Shared photos and videos', 'Call activity'], label: 'WhatsApp number', placeholder: 'Enter a phone number' }, Instagram: { title: 'Instagram intelligence', description: 'Organize authorized Instagram data into Direct messages, media, and engagement activity.', items: ['Direct messages and conversations', 'Liked photos and videos', 'Saved posts and shared media', 'Followers and following changes'], label: 'Instagram username', placeholder: 'Enter an Instagram username' }, TikTok: { title: 'TikTok intelligence', description: 'Review authorized public activity and account engagement signals.', items: ['Liked videos', 'Comments and mentions', 'Followers and following', 'Shared videos'], label: 'TikTok username', placeholder: 'Enter a TikTok username' }, Tinder: { title: 'Tinder intelligence', description: 'Organize authorized profile and match information in one workspace.', items: ['Profile details', 'Matches and conversations', 'Shared interests', 'Activity timeline'], label: 'Tinder profile', placeholder: 'Enter a profile identifier' }, Facebook: { title: 'Facebook intelligence', description: 'Review authorized profile activity, messages, and shared content.', items: ['Messenger conversations', 'Liked posts and photos', 'Shared media', 'Friends and interactions'], label: 'Facebook username', placeholder: 'Enter a Facebook username' } }
  const activeSourceConfig = sourceConfig[selectedSource]
  const analysisStep = analysis ? analysisSteps[Math.min(Math.floor((analysis.progress / 100) * analysisSteps.length), analysisSteps.length - 1)] : analysisSteps[0]

  if (!isAuthenticated) {
    return (
      <main className="auth-shell">
        <section className="auth-card" aria-labelledby="auth-title">
          <div className="auth-brand"><div className="brand-mark"><ShieldCheck size={18} /></div><span>INF <span className="brand-dot">PRO</span></span></div>
          <div className="auth-heading"><p className="eyebrow">PRIVATE SEARCH CENTER</p><h1 id="auth-title">{authMode === 'login' ? 'Welcome back' : 'Create your account'}</h1><p>{authMode === 'login' ? 'Sign in to access your private workspace.' : 'Create a secure account for your private workspace.'}</p></div>
          <form className="auth-form" onSubmit={handleAuthSubmit}>
            <label htmlFor="auth-email">Email</label>
            <div className="auth-input"><Mail size={17} /><input id="auth-email" type="email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required /></div>
            <label htmlFor="auth-password">Password</label>
            <div className="auth-input"><LockKeyhole size={17} /><input id="auth-password" type={showPassword ? 'text' : 'password'} value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} placeholder="At least 8 characters" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} minLength={8} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            {authMode === 'signup' && <><label htmlFor="auth-password-repeat">Repeat password</label><div className="auth-input"><LockKeyhole size={17} /><input id="auth-password-repeat" type={showPassword ? 'text' : 'password'} value={authPasswordRepeat} onChange={(event) => setAuthPasswordRepeat(event.target.value)} placeholder="Repeat your password" autoComplete="new-password" minLength={8} required /></div></>}
            {authError && <p className={`auth-message ${authError.includes('ready') ? 'success' : 'error'}`} role="status">{authError.includes('ready') && <CheckCircle2 size={15} />}{authError}</p>}
            <button className="auth-submit" type="submit">{authMode === 'login' ? 'Sign in' : 'Create account'}</button>
          </form>
          <div className="auth-links"><button type="button" onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError('') }}>{authMode === 'login' ? 'Create a new account' : 'Already have an account? Sign in'}</button>{authMode === 'login' && <button type="button" onClick={() => setAuthError('Password recovery requests are reviewed before the next attempt. The review window can take up to 48 hours.')}>Forgot your password?</button>}</div>
          <div className="auth-security"><LockKeyhole size={16} /><span>Your searches will be private to your account. No records are shared between users.</span></div>
        </section>
      </main>
    )
  }

  return (
  <main className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><ShieldCheck size={18} /></div><span>INF <span className="brand-dot">PRO</span></span></div>
        <div className="workspace"><div className="workspace-avatar">IP</div><div><strong>Your workspace</strong><small>Professional plan</small></div><ChevronDown size={14} /></div>
        <nav aria-label="Main navigation">
          <p className="nav-label">MAIN MENU</p>
          {navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => { setActive(label); setSidebarOpen(false); if (label === 'New search') startNewSearch() }}><Icon size={17} /><span>{label}</span>{label === 'History' && records.length > 0 && <span className="nav-count">{records.length}</span>}</button>)}
          <p className="nav-label nav-spacer">MANAGEMENT</p>
          <button className={`nav-item nav-item-alert${analysis?.done ? ' settings-ready' : ''}`} disabled={!analysis?.done} onClick={() => analysis?.done && setSettingsOpen(true)}><Settings size={17} /><span>Settings</span></button>
          <button className={`nav-item ${active === 'Locator' ? 'active' : ''}`} onClick={() => { setActive('Locator'); setSidebarOpen(false) }}><MapPin size={17} /><span>Number locator</span></button><button className="nav-item" onClick={() => setNotice('For questions and refund requests, contact Api752983@gmail.com.')}><HelpCircle size={17} /><span>Help & support</span></button><button className="nav-item" onClick={() => setRefundOpen(true)}><RotateCcw size={17} /><span>Refunds</span></button>
        </nav>
        <button className="sidebar-footer" onClick={() => setProfileOpen(true)}><div className="profile-avatar">{profilePhoto ? <img src={profilePhoto} alt="Profile photo" /> : profileInitials()}</div><div><strong>{profileName.trim() || 'Your profile'}</strong><small>Administrator</small></div><MoreHorizontal size={17} /></button>
      </aside>

      <section className="content-area">
        <header className="topbar"><button className="mobile-menu" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Open menu"><Menu size={21} /></button><div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>{active}</strong></div><div className="top-actions"><button className="icon-button" onClick={() => setNotice('You have no new notifications.')} aria-label="Notifications"><Bell size={18} /><i /></button><button className="top-user" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} aria-haspopup="dialog"><div className="profile-avatar small">{profilePhoto ? <img src={profilePhoto} alt="Profile photo" /> : profileInitials()}</div><span>{profileName.trim() || 'Your profile'}</span><ChevronDown size={14} /></button>{profileOpen && <ProfileDialog profileName={profileName} setProfileName={setProfileName} profilePhoto={profilePhoto} handleProfilePhoto={handleProfilePhoto} saveProfile={saveProfile} /> }</div></header>
        <div className="page-content">
          <div className="page-heading"><div><p className="eyebrow">SEARCH CENTER</p><h1>{sectionTitle}</h1><p className="subtitle">{sectionSubtitle}</p></div>{null}</div>
          {notice && <div className="notice" role="status"><MessageCircle size={16} />{notice}<button onClick={() => setNotice('')} aria-label="Close notification"><X size={15} /></button></div>}
          {active === 'Locator' && <section className="locator-page"><div className="locator-intro"><div><p className="eyebrow">APPROXIMATE LOCATION</p><h2>Locate a number by country and full number</h2><p>Select the country and enter the full number, including the area code. The result shows an approximate coverage region, never an exact private location.</p></div><div className="locator-icon"><MapPin size={25} /></div></div><form className="locator-form" onSubmit={(event) => { event.preventDefault(); const country = countryCodes.find(([code]) => code === locatorCountry)?.[1] || 'Selected country'; const regionMap: Record<string, string> = { '011': 'São Paulo metropolitan area', '021': 'Rio de Janeiro metropolitan area', '031': 'Minas Gerais area', '305': 'Miami area', '212': 'New York area', '351': 'Lisbon area', '44': 'United Kingdom coverage area' }; setLocatorResult({ country, region: regionMap[areaCode.replace(/\D/g, '')] || 'Regional coverage area', confidence: areaCode ? 'Area-code estimate' : 'Country-level estimate' }) }}><label><span>Country</span><select value={locatorCountry} onChange={(event) => setLocatorCountry(event.target.value)}>{countryCodes.map(([code, country]) => <option key={code} value={code}>{code} — {country}</option>)}</select></label><label><span>Full phone number with area code</span><input value={areaCode} onChange={(event) => setAreaCode(event.target.value.replace(/\D/g, '').slice(0, 15))} placeholder="e.g. 11987654321" inputMode="tel" autoComplete="tel" required /></label><button type="submit"><MapPin size={16} /> Show approximate area</button></form>{locatorResult && <div className="locator-result"><div className="map-preview" aria-label={`Approximate map for ${locatorResult.region}`}><div className="map-grid" /><div className="map-land land-one" /><div className="map-land land-two" /><div className="map-place place-country">Brazil</div><div className="map-place place-city">São Paulo</div><div className="map-place place-city secondary">Rio de Janeiro</div><div className="map-place place-city third">Belo Horizonte</div><div className="map-marker"><MapPin size={20} /></div><span className="map-label">Approximate area</span></div><div className="locator-details"><p className="eyebrow">LOCATION ESTIMATE</p><h3>{locatorResult.region}</h3><p><strong>{locatorResult.country}</strong></p><span className="confidence-badge">{locatorResult.confidence}</span><div className="locator-notice"><ShieldCheck size={15} /> Area-code results are approximate and do not reveal a person&apos;s exact location.</div></div></div>}</section>}
          {active === 'New search' && <><div className="social-tabs" role="tablist" aria-label="Authorized sources"><p>Search source</p>{sourceTabs.map((source) => <button key={source} role="tab" aria-selected={source === 'Number locator' ? active === 'Locator' : selectedSource === source} className={`${(source === 'Number locator' ? active === 'Locator' : selectedSource === source) ? 'social-tab active' : 'social-tab'}${source !== 'WhatsApp' && source !== 'Number locator' && !analysis?.done ? ' social-tab-alert' : ''}`} onClick={() => source === 'Number locator' ? setActive('Locator') : setSelectedSource(source)}><span>{source === 'Number locator' ? <MapPin size={14} /> : source.slice(0, 2).toUpperCase()}</span>{source}</button>)}</div><div className="source-intelligence-panel"><div><p className="eyebrow">{selectedSource.toUpperCase()} WORKSPACE</p><h2>{activeSourceConfig.title}</h2><p>{activeSourceConfig.description}</p></div><div className="source-feature-grid">{activeSourceConfig.items.map((item) => <span key={item}><CheckCircle2 size={14} />{item}</span>)}</div></div><form className="search-panel" onSubmit={runSearch}><div className="search-icon"><Search size={20} /></div><label className="research-photo-upload"><div className="research-photo-preview">{personPhoto ? <img src={personPhoto} alt="Searched person photo" /> : <UserRound size={20} />}</div><span>{personPhoto ? 'Reference photo' : 'Photo required'}</span><input type="file" accept="image/*" onChange={handlePersonPhoto} /></label><div className="search-field"><label htmlFor="person-name">Person's name <span>(required)</span></label><input id="person-name" value={personName} onChange={(event) => setPersonName(event.target.value)} placeholder="Name to identify the search" /> </div><div className="search-field"><label htmlFor="person-gender">Gender <span>(required)</span></label><select id="person-gender" value={personGender} onChange={(event) => setPersonGender(event.target.value)}><option value="">Not specified</option><option value="Man">Man</option><option value="Woman">Woman</option></select></div><div className="search-field"><label htmlFor="search">{activeSourceConfig.label}</label>{selectedSource === 'WhatsApp' ? <div className="phone-input"><select aria-label="Country code" value={countryCode} onChange={(event) => setCountryCode(event.target.value)}>{countryCodes.map(([code, country]) => <option key={code} value={code}>{code} · {country}</option>)}</select><input id="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={selectedSource === 'WhatsApp' ? 'Digite um número com DDD...' : `Digite o @usuário do ${selectedSource}...`} /></div> : <input id="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Digite o @usuário do ${selectedSource}...`} />}<span>{selectedSource === 'WhatsApp' ? 'WhatsApp search available' : `Consulta de ${selectedSource} disponível em breve`}</span></div><button className="search-button" type="submit">Search</button></form>{active === 'New search' && analysis && <div className="analysis-progress" role="status" aria-live="polite"><div className="analysis-progress-header"><strong>{analysis.done ? 'Search completed' : 'Configuring your search'}</strong><span>{Math.round(analysis.progress)}%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${analysis.progress}%` }} /></div><p>{analysis.done ? 'Your search is ready.' : 'This process can take up to 3 minutes. Do not close this page.'}</p><div className="analysis-steps-panel">{analysisSteps.map((step, index) => <div className={`analysis-step ${analysis.done || index < Math.floor((analysis.progress / 100) * analysisSteps.length) ? 'completed' : ''} ${!analysis.done && step === analysisStep ? 'current' : ''}`} key={step}><span className="analysis-step-indicator">{analysis.done || index < Math.floor((analysis.progress / 100) * analysisSteps.length) ? '✓' : index + 1}</span><span>{step}</span></div>)}</div></div>}{analysis && selectedSource === 'WhatsApp' && <div className="whatsapp-analysis" aria-live="polite"><div className="whatsapp-result-head"><div className="whatsapp-photo-wrap">{analysis.photo ? <img src={analysis.photo} alt="Foto de perfil retornada pelo WhatsApp" /> : <div className="photo-placeholder">{analysis.name.slice(0, 2).toUpperCase()}</div>}<span className={analysis.done ? 'online-dot done' : 'online-dot'} /></div><div><p className="eyebrow">RESULTADO DO WHATSAPP</p><h2>{analysis.name}</h2><p>{analysis.phone}</p></div></div>{!analysis.done ? <div className="analysis-progress"><div className="analysis-progress-title"><strong>Faça suas configurações completas para manter sua privacidade</strong><span>{Math.floor(analysis.progress)}%</span></div><div className="progress-track"><div style={{ width: `${analysis.progress}%` }} /></div><p>Este processo pode levar até 3 minutos. Não feche esta página.</p></div> : <div className="analysis-complete"><ShieldCheck size={17} /><span>Análise concluída. Os dados disponíveis aparecerão aqui quando a API estiver conectada.</span></div>}</div>}
          {analysis?.done && <div className="found-images-panel"><div className="section-header"><div><h2>{activeResultLabels.heading}</h2><p>{activeResultLabels.description}</p></div></div><div className="found-images-grid">{['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-1647832878676-df2b06fd8374-TjoxRYDLTaSYuy5SurUbn7gRsNlr0Q.avif','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transferir%20%285%29-HwnGpEMAlxFzjTD7VlClxVH0Ct8LMz.jpg','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transferir%20%282%29-j4sOB66hR5qPsngEPEwGpMHba73aUi.jpg','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transferir%20%284%29-k4MhZjWTELxcga2nkFzEPPP9Mv2z1e.jpg','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transferir%20%281%29-ZbEHBN4i9a4wHxRDB9YjNJMearN2O9.jpg','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transferir-P9N2vUyrxThG7s0LMi6XX9xbF0mRx3.jpg','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transferir%20%286%29-uW0YsqYQ81JsOeddwrPAjv9Eyj4glK.jpg','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/transferir%20%283%29-5SbY3PVsv83Fyf8rdPM1XhMGyL35ht.jpg'].map((image, index) => <div className="found-image-wrap" key={image}><img src={image} alt={`Found result ${index + 1}`} /></div>)}</div></div>}
          </>}
          {active === 'New search' && analysis?.done && <div className="found-conversations-panel"><div className="section-header"><div><h2>{selectedSource} activity found</h2><p>{activeResultLabels.description}</p></div></div><div className="found-conversations-grid">{['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%282%29-z68MLGAb8uaLV62paMuRLel0TNIIuj.jpg','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%281%29-ALRd5Tm66Bj211wVHnsAuLltt2SB83.jpg','https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-MPIobpwq2SwCTNcQ7HnwNRypsJnp4x.jpg'].map((image, index) => <div className="found-conversation-wrap" key={image}><img src={image} alt={`Found conversation ${index + 1}`} /></div>)}</div><p className="unlock-message">Finish your setup in Settings to unlock.</p></div>}
  {(active === 'Overview' || active === 'Reports') && <><div className="stats-grid"><StatCard icon={FileSearch} label="Searches completed" value={String(records.length)} change="Start now" /><StatCard icon={UserRound} label="Contacts found" value="0" change="Waiting for searches" /><StatCard icon={Database} label="Success rate" value="0%" change="No data yet" /><StatCard icon={BarChart3} label="This month" value="0" change="No searches" /></div><div className="dashboard-grid"><section className="dashboard-card performance-card"><div className="dashboard-card-heading"><div><p className="eyebrow">WORKSPACE HEALTH</p><h2>Research performance</h2></div><span className="live-badge"><i /> Live</span></div><div className="performance-value"><strong>0%</strong><span>No completed searches yet</span></div><div className="mini-chart" aria-label="Research activity chart"><span style={{ height: '28%' }} /><span style={{ height: '44%' }} /><span style={{ height: '36%' }} /><span style={{ height: '62%' }} /><span style={{ height: '48%' }} /><span style={{ height: '78%' }} /><span style={{ height: '56%' }} /><span style={{ height: '88%' }} /><span style={{ height: '68%' }} /></div><div className="chart-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></section><section className="dashboard-card activity-card"><div className="dashboard-card-heading"><div><p className="eyebrow">ACTIVITY</p><h2>Recent activity</h2></div><button className="text-button" onClick={() => setActive('History')}>View history</button></div><div className="activity-list"><div className="activity-item"><span className="activity-dot teal" /><div><strong>Workspace created</strong><p>Your private research space is ready.</p></div><time>Now</time></div><div className="activity-item"><span className="activity-dot blue" /><div><strong>Privacy check passed</strong><p>Account data is isolated and protected.</p></div><time>Today</time></div><div className="activity-item"><span className="activity-dot amber" /><div><strong>First search pending</strong><p>Start a search to populate your dashboard.</p></div><time>Next</time></div></div></section></div><div className="quick-actions"><div><p className="eyebrow">QUICK ACTIONS</p><h2>Keep your workspace moving</h2></div><button className="quick-action" onClick={() => setActive('New search')}><FileSearch size={17} /><span><strong>Start a new search</strong><small>Analyze an authorized contact</small></span><ChevronRight size={16} /></button><button className="quick-action" onClick={() => setSettingsOpen(true)}><ShieldCheck size={17} /><span><strong>Review privacy settings</strong><small>Manage access and responsibility</small></span><ChevronRight size={16} /></button><button className="quick-action" onClick={() => setRefundOpen(true)}><MessageCircle size={17} /><span><strong>Get help</strong><small>Talk to our support team</small></span><ChevronRight size={16} /></button></div></>}
          {(active !== 'New search' || !analysis || analysis.done) && <><div className="section-header"><div><h2>{active === 'Reports' ? 'Available reports' : active === 'Contacts' ? 'Searched contacts' : 'Recent searches'}</h2><p>{active === 'Reports' ? 'Download a file containing your completed searches.' : 'Latest searches in your workspace.'}</p></div><button className="outline-button" onClick={exportReport}><Download size={16} /> Export report</button></div>
          <div className="table-card"><div className="table-toolbar"><div className="table-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter searches..." /></div><button className="filter-button" onClick={() => setNotice('Advanced filters will be available soon.')}><SlidersHorizontal size={16} /> Filters</button></div><div className="table-wrap"><table><thead><tr><th>CONTACT</th><th>GENDER</th><th>SOURCE</th><th>IDENTIFIER</th><th>STATUS</th><th>UPDATED</th><th aria-label="ACTIONS" /></tr></thead><tbody>{filteredRecords.map((record) => <tr key={record.id}><td><div className="contact-cell"><div className="contact-avatar">{record.photo ? <img src={record.photo} alt={`Photo of ${record.name}`} /> : record.avatar}</div><strong>{record.name}</strong></div></td><td>{record.gender}</td><td>{record.source}</td><td>{record.phone}</td><td><span className={`status ${record.status === 'Found' ? 'success' : record.status === 'Pending' ? 'pending' : 'muted'}`}><i />{record.status}</span></td><td>{record.updated}</td><td><button className="row-action" onClick={() => setNotice(`Details for ${record.name} selected.`)} aria-label={`Ver detalhes de ${record.name}`}><MoreHorizontal size={18} /></button></td></tr>)}</tbody></table>{filteredRecords.length === 0 && <div className="empty-state">No searches yet. Go to “New search” to get started.</div>}</div><div className="table-footer">Showing <strong>{filteredRecords.length}</strong> of <strong>{records.length}</strong> searches<button onClick={() => { setRecords(initialRecords); setQuery(''); setNotice('List refreshed.') }}>Refresh list</button></div></div></>}
          <footer>© 2026 INF PRO. Secure platform for your searches. <span><ShieldCheck size={13} /> Data protected</span></footer>
        </div>
  {refundOpen && <div className="settings-overlay" role="dialog" aria-modal="true" aria-labelledby="refund-title"><div className="settings-card refund-card"><button className="settings-close" onClick={() => setRefundOpen(false)} aria-label="Close refund information"><X size={18} /></button><p className="eyebrow">REFUND REQUEST</p><h2 id="refund-title">Before requesting a refund</h2><div className="settings-copy"><p>Before requesting a refund, we’d like to give you the opportunity to get the most out of the access you purchased.</p><p>We understand that sometimes it takes a little more time to fully understand how everything works. If you’ve experienced any difficulties or haven’t been able to use all the available features, please contact our support team. We’re here to help you make the most of what has been provided.</p><p>If something didn’t go as expected, please let us know what happened. We may be able to find a solution before you make a final decision.</p><p>However, if you still wish to proceed with your refund request, please contact us at <a href="mailto:Api752983@gmail.com">Api752983@gmail.com</a> so we can guide you through the next steps.</p></div><a className="settings-continue" href="mailto:Api752983@gmail.com?subject=Refund%20request&body=Hello,%20I%20would%20like%20to%20request%20a%20refund.%0A%0AOrder%20details:%20" aria-label="Email support about a refund">Contact support about a refund</a></div></div>}
  {settingsOpen && <div className="settings-overlay" role="dialog" aria-modal="true" aria-labelledby="settings-title"><div className="settings-card"><button className="settings-close" onClick={() => setSettingsOpen(false)} aria-label="Close settings"><X size={18} /></button><p className="eyebrow">SETTINGS AND SECURITY</p><h2 id="settings-title">Workspace settings</h2><div className="settings-panels"><section className="settings-panel"><div className="settings-panel-icon"><UserRound size={17} /></div><div><h3>Account preferences</h3><p>Manage your profile, workspace name, and account visibility.</p></div><button onClick={() => { setSettingsOpen(false); setProfileOpen(true) }}>Edit profile</button></section><section className="settings-panel"><div className="settings-panel-icon"><Bell size={17} /></div><div><h3>Notifications</h3><p>Search completion alerts and important workspace updates.</p></div><button onClick={() => setNotice('Notification preferences saved.')}>Configure</button></section><section className="settings-panel"><div className="settings-panel-icon"><ShieldCheck size={17} /></div><div><h3>Privacy controls</h3><p>Control data retention, access permissions, and private results.</p></div><button onClick={() => setNotice('Privacy controls are enabled.')}>Manage</button></section><section className="settings-panel"><div className="settings-panel-icon"><Palette size={17} /></div><div><h3>Appearance</h3><p>Choose your workspace density, theme, and dashboard layout.</p></div><button onClick={() => setNotice('Appearance preferences saved.')}>Customize</button></section><section className="settings-panel"><div className="settings-panel-icon"><Database size={17} /></div><div><h3>Data & exports</h3><p>Download reports, clear search history, or review stored records.</p></div><button onClick={() => setNotice('Data center opened.')}>Open center</button></section><section className="settings-panel"><div className="settings-panel-icon"><KeyRound size={17} /></div><div><h3>Security</h3><p>Review active sessions, sign-in activity, and account protection.</p></div><button onClick={() => setNotice('Security check completed.')}>Review</button></section></div><div className="settings-copy"><p>By using the platform <strong>Infidelity</strong>, you acknowledge that you have read, understood, and agree to these terms.</p><h3>1. Platform use</h3><p>Use the features legally, ethically, and in accordance with applicable laws.</p><h3>2. Authorization</h3><p>You confirm that you are authorized to access, monitor, or use any device, account, profile, or searched information.</p><h3>3. User responsibility</h3><p>You are responsible for the information accessed, collected, stored, or used on the platform.</p><h3>4. Privacy and security</h3><p>Respect the privacy and rights of others. You may not use the platform for intrusion, fraud, stalking, harassment, or unauthorized access.</p><h3>5. Acceptance</h3><p>By continuing, you confirm that you accept these terms and are responsible for using the available features.</p></div><a className="settings-continue" href="https://members.appdetect.site/dashboard" target="_blank" rel="noreferrer">Continue to dashboard</a></div></div>}
  </section>
  </main>
  )
}

function ProfileDialog({ profileName, setProfileName, profilePhoto, handleProfilePhoto, saveProfile }: { profileName: string; setProfileName: (value: string) => void; profilePhoto: string; handleProfilePhoto: (event: React.ChangeEvent<HTMLInputElement>) => void; saveProfile: () => void }) {
  return <div className="profile-dialog" role="dialog" aria-label="Edit profile"><div className="profile-dialog-header"><div><p className="eyebrow">YOUR PROFILE</p><h2>Personalize your access</h2></div><button className="dialog-close" onClick={saveProfile} aria-label="Close">×</button></div><div className="profile-editor"><label className="photo-upload"><div className="profile-avatar large">{profilePhoto ? <img src={profilePhoto} alt="Profile photo preview" /> : 'IP'}</div><span>Add photo</span><input type="file" accept="image/*" onChange={handleProfilePhoto} /></label><label className="profile-name-field">Name <span>(optional)</span><input value={profileName} onChange={(event) => setProfileName(event.target.value)} placeholder="What would you like to be called?" /></label></div><div className="profile-dialog-actions"><button className="outline-button" onClick={saveProfile}>Cancelar</button><button className="primary-button" onClick={saveProfile}>Salvar perfil</button></div></div>
}

function StatCard({ icon: Icon, label, value, change }: { icon: typeof FileSearch; label: string; value: string; change: string }) {
  return <div className="stat-card"><div className="stat-icon"><Icon size={18} /></div><div><p>{label}</p><strong>{value}</strong><span>{change} <small>vs. previous month</small></span></div></div>
}
