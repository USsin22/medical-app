# My Medical App (React + Redux Toolkit)
A modern, student-friendly medical appointment management application built with React (Vite), Redux Toolkit, React Router, and a local JSON Server. The app supports managing Patients, Doctors (Médecins), Appointments (RDV), and Consultations with a clean, responsive UI and full CRUD operations via Axios.

## Objectives
- Manage patients, doctors, appointments, and consultations
- Provide fast, reactive UI with Redux state management
- Demonstrate CRUD operations with a simple local API
- Offer a clean, responsive design suitable for OFPPT-level projects
- Use accessible, reusable components (Modal, Toast) and forms with selects
## Tech Stack
- Frontend: React (Vite)
- State Management: Redux Toolkit + React Redux
- Routing: React Router DOM
- HTTP Client: Axios
- Backend: JSON Server ( db.json )
- Styling: Tailwind CSS (utility classes) / CSS
- Tooling: ESLint
## Project Structure
```
my-medical-app/
├─ package.json
├─ db.json                # JSON Server database (create this 
file)
├─ src/
│  ├─ components/
│  │  ├─ Modal.jsx        # Reusable modal for add/edit forms
│  │  ├─ Toast.jsx        # Lightweight toast notifications
│  │  └─ StatsCard.jsx    # Card UI used on dashboard/stats
│  ├─ pages/
│  │  ├─ PatientsList.jsx       # List, search, add/edit/
delete patients
│  │  ├─ PatientForm.jsx        # (Optional) dedicated 
patient form
│  │  ├─ RDVList.jsx            # List, search, add/edit/
delete appointments
│  │  ├─ RDVForm.jsx            # (Optional) dedicated RDV 
form
│  │  ├─ ConsultationsList.jsx  # List, search, add/edit/
delete consultations
│  │  ├─ ConsultationForm.jsx   # (Optional) dedicated 
consultation form
│  │  ├─ Dashboard.jsx          # Overview cards and stats
│  │  ├─ PatientDetails.jsx     # Patient details page
│  │  └─ LandingPage.jsx        # Landing or home screen
│  ├─ store/
│  │  ├─ store.js               # Redux store configuration
│  │  ├─ patientSlice.js        # Patients slice: CRUD thunks 
+ reducers
│  │  ├─ medecinSlice.js        # Médecins slice (extend with 
API as needed)
│  │  ├─ rdvSlice.js            # Rendezvous slice: CRUD 
thunks + reducers
│  │  └─ consultationsSlice.js  # Consultations slice: CRUD 
thunks + reducers
│  └─ utils/
│     ├─ ageCalculator.js       # Helper to compute age from 
date
│     ├─ checkConflicts.js      # Helper to check RDV 
conflicts
│     └─ idGenerator.js         # Helper for generating ids 
(if needed)
```
### Components
- Modal.jsx : Accessible modal with keyboard support (ESC to close), used for add/edit forms.
- Toast.jsx : Simple success/error info messages that auto-dismiss.
- StatsCard.jsx : Card component to present KPIs or stats on the dashboard.
### Pages
- PatientsList.jsx : Displays patients, search by name, add/edit/delete via modal. Uses Redux for data.
- RDVList.jsx : Displays appointments, search by motif / etat , and CRUD operations via modal.
- ConsultationsList.jsx : Displays consultations, search by diagnostic / traitement , and CRUD via modal.
- Dashboard.jsx : Overview and stats using StatsCard .
- PatientDetails.jsx : Detailed patient info.
- LandingPage.jsx : Entry page or marketing screen.
## Redux Store
### Store Configuration
```
// src/store/store.js
import { configureStore } from '@reduxjs/toolkit'
import { rdvSlice } from './rdvSlice.js'
import { medecinSlice } from './medecinSlice.js'
import { patientSlice } from './patientSlice.js'
import { consultationSlice } from './consultationsSlice.js'

export const store = configureStore({
  reducer: {
    rdv: rdvSlice.reducer,
    medecin: medecinSlice.reducer,
    patient: patientSlice.reducer,
    consultation: consultationSlice.reducer,
  }
})
```
### Slices Overview
- patientSlice
  - State: patients array, status ( idle|loading|succeeded|failed ), error
  - Thunks: fetchPatients , addPatient , updatePatient , deletePatient
  - Endpoint: http://localhost:3000/patients
- rdvSlice
  - State: appointments array, status , error
  - Thunks: fetchRendezvous , addRendezvous , updateRendezvous , deleteRendezvous
  - Endpoint: http://localhost:3000/rendezvous
- consultationsSlice
  - State: consultations array, status , error
  - Thunks: fetchConsultations , addConsultation , updateConsultation , deleteConsultation
  - Endpoint: http://localhost:3000/consultations
- medecinSlice
  - State scaffold for doctors; extend with thunks and API once medecins exists in db.json .
### State Flow
- UI dispatches thunks ( useDispatch )
- Thunk calls Axios → JSON Server
- Extra reducers update slice state on pending/fulfilled/rejected
- Components subscribe to slice state via useSelector and re-render
## API & db.json
Create db.json at the project root:

```
{
  "patients": [
    {
      "id": 1,
      "nom": "Samira",
      "prenom": "Benhadi",
      "date_naissance": "1990-05-12",
      "telephone": "0600000001",
      "adresse": "Casablanca",
      "email": "samira@example.com",
      "groupe_sanguin": "A+",
      "allergies": "Penicillin",
      "createdAt": "2025-12-11T00:00:00Z"
    }
  ],
  "rendezvous": [
    {
      "id": 1,
      "patientId": 1,
      "date": "2025-12-12",
      "heure": "10:00",
      "motif": "Consultation",
      "etat": "En attente",
      "notes": ""
    }
  ],
  "consultations": [
    {
      "id": 1,
      "patientId": 1,
      "date": "2025-12-12",
      "diagnostic": "Rhinite allergique",
      "traitement": "Antihistaminique",
      "tarif": 200,
      "paiement": "Payé"
    }
  ],
  "medecins": [
    {
      "id": 1,
      "nom": "Dr. Ahmed",
      "specialite": "Allergology",
      "telephone": "0600000002",
      "email": "ahmed@example.com"
    }
  ]
}
```
Available endpoints (JSON Server):

- GET/POST http://localhost:3000/patients
- GET/POST http://localhost:3000/rendezvous
- GET/POST http://localhost:3000/consultations
- GET/POST http://localhost:3000/medecins
## Application Workflow
```
User Action (UI) → useDispatch(thunk) → Axios call → JSON 
Server
  ↳ slice.extraReducers update state → useSelector reads 
  updated state → UI re-renders
```
Example (Patients):

```
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPatients, addPatient, updatePatient, 
deletePatient } from '../store/patientSlice'

export default function PatientsList() {
  const dispatch = useDispatch()
  const { patients, status, error } = useSelector(s => s.
  patient)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchPatients())
  }, [status, dispatch])

  const onAdd = () => dispatch(addPatient({ nom: 'New', 
  prenom: 'Patient' }))
  const onEdit = (p) => dispatch(updatePatient({ id: p.id, 
  nom: 'Updated', prenom: p.prenom }))
  const onDelete = (id) => dispatch(deletePatient(id))

  return /* render patients from state */
}
```
## Installation
1. Prerequisites
   - Node.js ≥ 18 and npm
2. Clone or download the project
   ```
   git clone <repo-url>
   cd my-medical-app
   ```
3. Install dependencies
   ```
   npm install
   ```
4. Create the API database
   - Add db.json to the project root (use the structure above)
## Running the Project
- Start JSON Server (API at http://localhost:3000 )
  ```
  npx json-server --watch db.json --port 3000
  ```
- Start the frontend (Vite dev server, typically on http://localhost:5173 )
  ```
  npm run dev
  ```
Open the app in your browser:

- Frontend: http://localhost:5173
- API: http://localhost:3000
## Common Commands
```
# Install dependencies
npm install

# Run frontend
npm run dev

# Run JSON Server (local API)
npx json-server --watch db.json --port 3000

# Lint the project
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```
## Forms and Selects (Example)
To select a patient for a consultation:

```
const { patients } = useSelector(s => s.patient)

<select
  value={form.patientId}
  onChange={(e) => setForm({ ...form, patientId: Number(e.
  target.value) })}
>
  <option value="">Select patient</option>
  {patients.map(p => (
    <option key={p.id} value={p.id}>
      {p.nom} {p.prenom}
    </option>
  ))}
</select>
```
Ensure patients are loaded before rendering selects:

```
useEffect(() => {
  if (patientStatus === 'idle') dispatch(fetchPatients())
}, [patientStatus, dispatch])
```
## Future Improvements
- Add authentication and role-based access (admin/doctor)
- Validate forms with a library (e.g., React Hook Form + Yup)
- Connect medecinSlice to API and build doctors pages
- Add pagination and server-side filtering for large datasets
- Improve accessibility (focus management, ARIA for complex controls)
- Add unit tests and integration tests
- Introduce a global notification system/state
## Author
- Name: Your Name
- Email: your.email@example.com
- Institution: OFPPT
- Role: Full-stack developer & technical writer
Feel free to reuse and extend this project for learning and coursework.